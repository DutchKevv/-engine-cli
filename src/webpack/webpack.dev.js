const path = require('path');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const configCommon = require('./webpack.common');

module.exports = webpackMerge(configCommon, {
    // watchOptions: {
    //     ignored: ['**/*.map.json', 'node_modules'],
    // },
    watch: true,
    mode: 'development',
    devtool: 'inline-source-map',
    // entry: {
    //     editor: '../node_modules/engine-core/src/editor/editor.ts',
    // },
    plugins: [
        // new HtmlWebpackPlugin({
        //     chunks: ['main'],
        //     template: 'game/index.html',
        //     filename: 'index.game.html'
        // }),
    ]
});