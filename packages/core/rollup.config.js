/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs'
import path from 'path'
import ts from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'

const input = {}
const loadInput = (pathPrefix) => {
  const sources = fs.readdirSync(path.resolve(__dirname, 'src', ...pathPrefix), { withFileTypes: true })
  for (const source of sources) {
    if (source.isDirectory()) {
      loadInput([...pathPrefix, source.name])
    } else {
      const extIndex = source.name.indexOf('.')
      const name = source.name.substring(0, extIndex)
      const exts = source.name.substring(extIndex + 1)
      if (exts === 'ts' || exts === 'tsx') {
        input[[...pathPrefix, name].join('/')] = ['src', ...pathPrefix, source.name].join('/')
      }
    }
  }
}
loadInput([])

export default {
  input,
  output: {
    format: 'esm',
    dir: 'dist'
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
      exclude: 'node_modules/**', // 只编译我们的源代码
      plugins: ['@babel/plugin-transform-runtime']
    }),
    commonjs(),
    nodeResolve({
      extensions: ['.js', '.ts', '.tsx']
    }),
    terser()
  ],
  external: ['axios', 'immer', 'lodash', 'moment', 'qiankun', 'query-string', 'react'],
  watch: {
    include: 'src/**'
  }
}
