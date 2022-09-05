/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

process.env.NODE_ENV = 'production'

module.exports = merge(common, {
  entry: path.join(__dirname, './src/index.tsx'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './dist'),
    libraryTarget: 'umd'
  },
  externals: {
    '@monaco-editor/react': '@monaco-editor/react',
    antd: 'antd',
    axios: 'axios',
    'copy-html-to-clipboard': 'copy-html-to-clipboard',
    immer: 'immer',
    lodash: 'lodash',
    marked: 'marked',
    moment: 'moment',
    qiankun: 'qiankun',
    'query-string': 'query-string',
    react: 'react',
    'react-color': 'react-color',
    'react-dom': 'react-dom',
    'react-sortable-hoc': 'react-sortable-hoc',
    ccms: 'ccms',
    'ccms-antd': 'ccms-antd',
    'ccms-antd-mini': 'ccms-antd-mini'
  },
  plugins: [new BundleAnalyzerPlugin()]
})
