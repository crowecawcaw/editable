const path = require('path')
const webpack = require('webpack')

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    index: './index.jsx',
  },
  output: {
    path: path.resolve(__dirname, './public'),
    filename: '[name].bundle.js',
  },
  /*resolve: {
    alias: {
        'react': 'preact-compat',
        'react-dom': 'preact-compat'
    }
  },*/
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [{
          loader: 'babel-loader',
          options: { presets: [[ 'es2015', { modules: false } ], 'react'] }
        }],
        include: /src/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader?importLoaders=1', 'sass-loader'],
      },
      {
        test: /\.html/,
        use: ['file-loader?name=[name].[ext]'],
      },
      {
        test: /\.(png|gif|jpg|svg|woff|woff2|ttf|eot)$/,
        use: ['file-loader?name=[hash].[ext]'],
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
  ]
}