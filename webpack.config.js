const path = require('path');

module.exports = {
  mode: 'development',
  input: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public'),
  },
  devtool: 'sourcemap'
}
