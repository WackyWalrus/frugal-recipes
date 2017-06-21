var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/public');
var APP_DIR = path.resolve(__dirname, 'src/js');

var config = {
  entry: {
  	'index': [ APP_DIR + '/index.js' ],
    'upload': [ APP_DIR + '/upload.js' ],
    'recipe': [ APP_DIR + '/recipe.js' ]
  },
  output: {
    path: BUILD_DIR,
    filename: 'js/[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015','react']
        }
      },
      {
      	test: /\.css$/,
      	loader: 'file-loader?name=[name].[ext]&outputPath=css/'
      },
      {
      	test: /\.woff2$|\.woff$|\.eot$|\.ttf$|\.svg$/,
      	loader: 'file-loader?name=[name].[ext]&outputPath=fonts/'
      }
    ]
  },
};

module.exports = config;