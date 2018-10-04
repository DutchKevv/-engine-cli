const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const oWebpackConfig = require('../../webpack/webpack.dev');
const npmLink = require('../npm-link/npm-link');

const PATH_ENGINE_CORE = path.resolve(__dirname, '../../../../engine-core');
const PATH_ENGINE_CLI = path.resolve(__dirname, '../../../../engine-cli');
const PATH_PROJECTS_SRC = path.resolve(__dirname, '../../../../data/static/projects/');
const PATH_PROJECTS_DIST = path.resolve(__dirname, '../../../../data/public/projects/');

module.exports = function (gameId, clean = true) {

  return new Promise(async (resolve, reject) => {
    const srcPath = path.resolve(PATH_PROJECTS_SRC, gameId);
    const outPath = path.resolve(PATH_PROJECTS_DIST, gameId);
    const configPath = path.join(srcPath, 'config.json');
    const config = JSON.parse(fs.readFileSync(configPath));

    // link core and cli to active project
    // TODO - whats the ultimate way to do this? This feels 'spooky'
    await Promise.all([
      npmLink('engine-core', PATH_ENGINE_CORE, srcPath),
      npmLink('engine-cli', PATH_ENGINE_CLI, srcPath)
    ]);

    // merge webpackConfig with custom options
    const webpackConfig = Object.assign({}, oWebpackConfig);

    // set context to engine-cli
    webpackConfig.context = path.resolve(__dirname, '../../../');

    setWebpackEntries(webpackConfig, config.compile, srcPath);
    addEditor(webpackConfig, config.compile, srcPath)
    setWebpackHtmlReplacePlugins(webpackConfig, config.compile, srcPath)
    setCopyFilesPlugin(webpackConfig, config.compile, srcPath, outPath)

    // write path
    webpackConfig.output.path = outPath;

    // add clean plugin
    if (clean) {
      const cleanPlugin = new CleanWebpackPlugin([outPath], {
        allowExternal: true,
        watch: false
      });

      webpackConfig.plugins.unshift(cleanPlugin);
    }

    webpack(webpackConfig, (error, stats) => {
      if (error || stats.hasErrors()) {
        if (error) return reject(error);

        // Handle errors here
        const statsJson = stats.toJson();

        statsJson.errors.forEach(error => console.log('\n' + '\x1b[31m', error.toString() + '\n'));
      }

      console.info('\n compiling done, no errors');

      resolve();
    });
  });
};

function addEditor(webpackConfig, compileOptions, projectPath) {
  webpackConfig.entry['editor'] = path.resolve(projectPath, 'node_modules/engine-core/src/editor/editor.ts');
}

function setCopyFilesPlugin(webpackConfig, compileOptions, projectPath, destinationPath) {
  // copy assets
  if (!compileOptions.copyFiles || !compileOptions.copyFiles.length)
    return;

  compileOptions.copyFiles.forEach(copyFile => {
    copyFile.from = relativeToAbsolute(copyFile.from, projectPath);
    // copyFile.to = copyFile.to ? relativeToAbsolute(copyFile.to, destinationPath) : destinationPath;
  });

  webpackConfig.plugins.splice(1, 0, new CopyWebpackPlugin(compileOptions.copyFiles));
}

function setWebpackEntries(webpackConfig, compileOptions, projectPath) {
  webpackConfig.entry = webpackConfig.entry || {};

  for (let name in compileOptions.entries) {
    webpackConfig.entry[name] = relativeToAbsolute(compileOptions.entries[name].path, projectPath);
  }
}

function setWebpackHtmlReplacePlugins(webpackConfig, compileOptions, projectPath) {
  webpackConfig.entry = webpackConfig.entry || {};

  for (let name in compileOptions.entries) {
    const options = compileOptions.entries[name].indexHtml;

    if (options) {
      webpackConfig.plugins.splice(2, 0, new HtmlWebpackPlugin({
        chunks: options.chunks,
        filename: options.filename,
        template: relativeToAbsolute(options.template, projectPath)
      }));
    }
  }
}

function relativeToAbsolute(url, projectPath) {
  // is absolute
  if (url.startsWith('/'))
    return url

  return path.resolve(projectPath, url);
}
