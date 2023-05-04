module.exports = {
  context: __dirname + '/src',
  entry: './index',
  output: {
    path: __dirname,
    filename: 'index.js',
    library: 'threading',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  }
}
