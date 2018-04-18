var webpack = require('webpack');
var path = require('path');
var uglifyJS = require('uglifyjs-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, './build');
var APP_DIR = path.resolve(__dirname, './src/client');

const config = {
  mode: 'development',
  entry: [
    path.join(APP_DIR + '/index.js'),
    'webpack-hot-middleware/client'
  ],
  output: {
    filename: 'bundle.js',
    path: BUILD_DIR,
    publicPath: ''
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }]
      },
      {
        test: /\.(jsx|js)?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['react', 'env']
          }
        }]
      }
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};

module.exports = config;