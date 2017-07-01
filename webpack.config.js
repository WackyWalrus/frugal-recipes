var webpack = require('webpack');
var path = require('path');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var BUILD_DIR = path.resolve(__dirname, 'src/public');
var APP_DIR = path.resolve(__dirname, 'src/js');

var config = {
  entry: {
  	'index': [ APP_DIR + '/index.js' ],
    'upload': [ APP_DIR + '/upload.js' ],
    'recipe': [ APP_DIR + '/recipe.js' ],
    'profile': [ APP_DIR + '/profile.js' ]
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
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
      	test: /\.css$/,
      	loader: 'file-loader?name=[name].[ext]&outputPath=css/'
      },
      {
      	test: /\.woff2$|\.woff$|\.eot$|\.ttf$|\.svg$/,
      	loader: 'file-loader?name=[name].[ext]&outputPath=fonts/'
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin("css/styles.css"),
  ]
};

module.exports = config;