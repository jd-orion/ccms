export default {
  entry: 'src/index.tsx',
  esm: "rollup",
  cjs: {
    type: "babel",
    lazy: true
  },
  cssModules: true,
  injectCSS: true,
  lessInBabelMode: true,
  doc: {
    typescript: true
  },
  extraBabelPlugins: [
    ['babel-plugin-import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }],
  ]
}