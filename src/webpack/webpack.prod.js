const path = require('path');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const configCommon = require('./webpack.common');

module.exports = webpackMerge(configCommon, {
    mode: 'production',
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['game'],
            template: path.join(__dirname, '../src/game/index.html'),
            filename: 'index.game.html'
        }),
    ]
});