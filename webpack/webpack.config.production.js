const webpack = require('webpack')
const path = require('path');
const distPath = path.join(__dirname, '/../', 'dist' );
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    context: __dirname+ '/..',
    progress: true,
    entry: [
        "./src/index.js"
    ],
    output: {
        path: distPath,
        filename: "bundle.js"
    },
    plugins: [
            new CopyWebpackPlugin([{
                from: './assets', to: distPath
            }
        ]),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                include: path.join(__dirname, '../','src')
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
};