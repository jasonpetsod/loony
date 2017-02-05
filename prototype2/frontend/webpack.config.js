var path = require('path');

module.exports = {
  entry: './loony.jsx',
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
}
