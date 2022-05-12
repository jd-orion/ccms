import path from 'path'
import ts from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
// import { eslint } from 'rollup-plugin-eslint'
import json from '@rollup/plugin-json'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.tsx',
  output: [
    {
      format: 'cjs',
      file: path.resolve('dist/index.js')
    }
  ],
  onwarn(warning) {
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return
    }
    console.error(warning.message)
  },
  plugins: [
    // eslint({
    //     throwOnError: true,
    //     exclude: ['node_modules/**', 'lib/**', 'dist/**']
    // }),
    postcss({
      extensions: ['.css', '.less'],
      modules: true // 启用CSS模块
    }),
    json(),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**', // 只编译我们的源代码
      plugins: ['@babel/plugin-transform-runtime']
    }),
    commonjs(),
    nodeResolve({
      extensions: ['.js', '.ts', '.tsx']
    }),
    terser()
  ],
  external: ['react', 'react-dom', 'ccms', '@ant-design/icons', 'react-color', 'antd'],
  watch: {
    include: 'src/**'
  }
}
