var path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'out.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
    ],
  },
  devtool: 'cheap-module-eval-source-map',
}
