import path from 'path'
import ts from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
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
      exclude: 'node_modules/**',
      plugins: ['@babel/plugin-transform-runtime']
    }),
    commonjs(),
    nodeResolve({
      extensions: ['.js', '.ts', '.tsx']
    }),
    terser()
  ],
  external: ['@ant-design/icons', 'antd', 'ccms', 'react', 'react-color'],
  watch: {
    include: 'src/**'
  }
}
