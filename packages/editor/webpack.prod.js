const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
  entry: path.join(__dirname, './src/index.tsx'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './dist'),
    libraryTarget: "umd",
  },
  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    },
    'qiankun': 'qiankun'
  }
})