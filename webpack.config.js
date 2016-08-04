var path = require("path");
var webpack = require("webpack");

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: "./main.jsx",
  output: {
    path: path.join(__dirname, "build"),
    filename: "bundle.js",
    library: 'main',
    publicPath: '/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel",
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015'],
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style!css',
      },
      { test: /\.svg$/,    loader: "url?limit=10000&mimetype=image/svg+xml" }
    ]
  }
};
