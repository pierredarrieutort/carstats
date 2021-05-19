const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const webmanifest = require('./webmanifest.js')
const { GenerateSW } = require('workbox-webpack-plugin')

module.exports = {
  entry: {
    'styles/index': './public/styles/index.scss',
    'scripts/auth': './public/scripts/auth/index.js',
    'scripts/app': './public/scripts/app/index.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    clean: true,
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
  },
  devServer: {
    writeToDisk: true
  },
  devtool: 'eval-cheap-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
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
          'standard-loader'
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
    new WebpackPwaManifest(webmanifest),
    new GenerateSW({
      swDest: 'sw.js',
      sourcemap: false,
      skipWaiting: true,
      runtimeCaching: [{
        urlPattern: /\.(?:(jpe?|pn|sv)g|css|woff2)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'carstats-cache'
        }
      }],
      clientsClaim: true
    }),
    new MiniCssExtractPlugin(),
    {
      apply (compiler) {
        compiler.hooks.shouldEmit.tap('Remove JS made by cssExtractPlugin',
          compilation => {
            delete compilation.assets['styles/index.js']
            return true
          })
      }
    }
  ]
}
