const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      { test: /\.css$/, 
      use: ['style-loader', 'css-loader'],}
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css']
  },
  optimization: {
    minimize: true,
  },
  plugins:  [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify("production")
    })
],
};