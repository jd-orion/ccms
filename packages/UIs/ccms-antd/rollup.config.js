import path from 'path'
import ts from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'

export default {
  input: {
    index: 'src/index.tsx',
    'step/fetch': 'src/steps/fetch/index.ts',
    'step/form': 'src/steps/form/index.tsx',
    'step/skip': 'src/steps/skip/index.tsx',
    'step/table': 'src/steps/table/table.tsx',
    'step/filter': 'src/steps/filter/index.tsx',
    'step/header': 'src/steps/header/index.tsx',
    'step/detail': 'src/steps/detail/index.tsx'
  },
  output: [
    {
      format: 'cjs',
      // file: path.resolve('dist/index.js')
      dir: 'dist'
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
      exclude: 'node_modules/**', // 只编译我们的源代码
      plugins: ['@babel/plugin-transform-runtime']
    }),
    commonjs(),
    nodeResolve({
      extensions: ['.js', '.ts', '.tsx']
    }),
    terser()
  ],
  external: ['@ant-design/icons', '@monaco-editor/react', 'antd', 'ccms', 'react', 'react-color', 'react-sortable-hoc'],
  watch: {
    include: 'src/**'
  }
}
