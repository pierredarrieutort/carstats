const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    // 'styles/index': './public/styles/index.scss',
    // 'scripts/auth': './public/scripts/auth/index.js',
    'scripts/app': './public/scripts/app/index.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                ['@babel/plugin-transform-runtime']
              ]
            }
          },
          // 'standard-loader',
        ]
      },
      {
        test: /\.((jpe?|pn|sv)g|web[pm]|m(ov|p4)|gif|bmp|avif?)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets',
              name: '[name].[ext]',
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|[to]tf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts'
        }
      },
      {
        test: /\.s?[ca]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '../' }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin()
  ]
}
