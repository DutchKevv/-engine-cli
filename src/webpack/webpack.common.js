const path = require('path');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    output: {
        filename: "[name].[hash].bundle.js",
        chunkFilename: "[id].[hash].bundle.js",
    },
    resolve: {
        extensions: ['.json', '.ts', '.js', '.scss', '.html'],
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                exclude: /node_modules/,
                loader: "handlebars-loader",
                options: {
                    knownHelpersOnly: false,
                    helperDirs: [
                        path.join(__dirname, '../../engine-core/src/editor/util/handlebars')
                    ]
                }
            },
            {
                test: /\.(html)$/,
                exclude: /node_modules/,
                loader: "html-loader?exportAsEs6Default"
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(woff2?|ttf|otf|eot|svg)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                }
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: __dirname
                            }
                        }
                    },
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sourceMapContents: false
                        }
                    }
                ],
            }
        ]
    },
    plugins: [
        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            exclude: /a\.js|node_modules/,
            // add errors to webpack instead of warnings
            failOnError: false,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
        }),

        // extract CSS from JS files
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].[hash].css"
        }),

        // add async to <script>
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'async'
        }),

        // preload fonts
        new PreloadWebpackPlugin({
            rel: 'preload',
            include: 'allAssets',
            fileWhitelist: [/\.woff/],
        }),

        // new BundleAnalyzerPlugin()
    ],
    optimization: {
        splitChunks: {
            // minSize: 300,
            // minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            // automaticNameDelimiter: '~',
            name: true,
            // cacheGroups: {
            //     // engine(chunk) {
            //     //     return chunk.context && chunk.context.includes('\\engine\\');
            //     // },
            //     // editor() {
            //     //     return false;
            //     // },
            //     default: {
            //         test: /[\\/]engine[\\/]/,
            //     },
            //     editor: {
            //         test: /[\\/]editor[\\/]/,
            //         name: 'editor',
            //         chunks: 'all',
            //         // reuseExistingChunk: true
            //     },
            //     game: {
            //         test: /[\\/]game[\\/]/,
            //         name: 'game',
            //         chunks: 'all'
            //         // reuseExistingChunk: true
            //     }
            // }
        }
    },
    stats: {
        assets: false,

        // Add build date and time information
        builtAt: false,

        cached: false,

        // Show cached assets (setting this to `false` only shows emitted files)
        cachedAssets: false,

        // Add chunk information (setting this to `false` allows for a less verbose output)
        chunks: false,

        // Add namedChunkGroups information
        chunkGroups: false,

        // Add built modules information to chunk information
        chunkModules: false,

        // Add the origins of chunks and chunk merging info
        chunkOrigins: false,

        // Add errors
        errors: true,

        // Add children information
        children: false,

        performance: false,

        modules: false,

        modulesSort: '!size',

        maxModules: 10,
    }
}