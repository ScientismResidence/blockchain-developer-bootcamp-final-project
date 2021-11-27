const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DotenvWebpackPlugin = require('dotenv-webpack');

module.exports = {
    target: 'web',
    mode: 'development',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'index.bundle.js'
    },
    // webpack 5 comes with devServer which loads in development mode
    devServer: {
        static: {
            directory: path.join(__dirname, 'src'),
        },
        port: 8080,
        open: true,
        liveReload: true
    },
    // Rules of how webpack will take our files, complie & bundle them for the browser 
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /nodeModules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({ 
            template: './src/template/index.html',
            inject: true
        }),
        new DotenvWebpackPlugin({
            path: '.env'
        })
    ],
    stats: {
        errorDetails: true,
    },
}