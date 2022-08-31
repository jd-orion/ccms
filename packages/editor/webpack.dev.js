/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

process.env.NODE_ENV = 'development'

module.exports = merge(common, {
  mode: 'development',
  cache: {
    type: 'filesystem'
  },
  entry: path.join(__dirname, './src/indexDev.tsx'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './dist'),
    libraryTarget: 'umd'
  },
  externals: {},
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 使用的HTML模板
      filename: 'index.html', // 打包生成到的HTML文件名
      minify: {
        removeAttributeQuotes: true, // 打包后去掉双引号
        collapseInlineTagWhitespace: true // 打包后去空格
      },
      hash: true, // 每次开发打包时，生成的HTML文件带hash
      publicPath: '/'
    })
  ],
  devServer: {
    host: 'localhost',
    port: 9999,
    disableHostCheck: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://beta-oconsole.jd.com',
        secure: false,
        changeOrigin: true
      },
      {
        context: ['/ccms/config/1.0.0/0/'],
        target: 'http://127.0.0.1:9001',
        secure: true
      }
    ],
    historyApiFallback: true,
    overlay: {
      errors: true
    },
    inline: true,
    hot: true
  },
  devtool: 'cheap-module-source-map'
})
