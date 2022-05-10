import path from 'path'
import ts from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
// import { eslint } from 'rollup-plugin-eslint'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.tsx',
  output: [
    {
      format: 'esm',
      file: path.resolve('dist/index.esm.js')
    }
  ],
  plugins: [
    json(),
    // eslint({
    //     throwOnError: true,
    //     exclude: ['node_modules/**', 'es/**', 'dist/**']
    // }),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**'
    }),

    commonjs(),
    nodeResolve({
      extensions: ['.js', '.ts', '.tsx']
    }),
    terser()
  ],
  external: ['react', 'react-dom', 'marked', 'lodash', 'axios', 'query-string', 'moment', 'qiankun'],
  watch: {
    include: 'src/**'
  }
}
