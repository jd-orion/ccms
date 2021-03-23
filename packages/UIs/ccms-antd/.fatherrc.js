
export default {
  entry: 'src/index.tsx',
  cjs: "rollup",
  cssModules: true,
  injectCSS: true,
  lessInBabelMode: true,
  doc: {
    title: "猎户座+ 配置文档",
    typescript: true,
    codeSandbox: false,
    setWebpackConfig: {
      publicPath: '/public',
    },
    filterComponents: (files) =>
      //This overrides the default filtering of components
      files.filter(filepath => /[w-]*.(js|jsx|ts|tsx)$/.test(filepath))
  }
}