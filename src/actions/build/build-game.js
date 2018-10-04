const webpack = require("webpack");
const webpackConfig = require('../../webpack/webpack.dev');

module.exports = function (gameId, prod) {
    webpack(webpackConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
            // Handle errors here
            console.log(err);
        }
        console.log(stats);
        // Done processing
    });
}