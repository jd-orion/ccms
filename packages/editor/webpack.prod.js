const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const dependencies = {
  'react': '17',
  'react-dom': '17',
  'antd': '4',
  '@drip/drip-design': ['drip', '4']
}

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(common, {
  externals: (context, request, callback)=>{
    if(Object.keys(dependencies).includes(request)){
      if (Array.isArray(dependencies[request])) {
        callback(null, `root window["orion:common:${dependencies[request][0]}:${dependencies[request][1]}"]`)
      } else {
        callback(null, `root window["orion:common:${request}:${dependencies[request]}"]`)
      }
    } else {
        callback();
    }
  },
  // devtool: 'cheap-module-source-map',
  // plugins: [
  //   new BundleAnalyzerPlugin()
  // ]
})