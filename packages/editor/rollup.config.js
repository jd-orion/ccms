import path from 'path';
import ts from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
// import { eslint } from 'rollup-plugin-eslint';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.tsx',
  output: [
    {
      format: 'cjs',
      file: path.resolve('dist/index.js')
    }
  ],
  plugins: [
    // eslint({
    //     throwOnError: true,
    //     exclude: ['node_modules/**', 'es/**', 'dist/**']
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
      exclude: 'node_modules/**',
      plugins: ['@babel/plugin-transform-runtime']
    }),
    commonjs({
      include: [
        'node_modules/**'
      ],
      namedExports: {
        "node_modules/ccms-antd-mini/dist/index.js": ["FormStep"],
        "node_modules/ccms-drip/node_modules/@babel/runtime/regenerator/index.js": ["default"]
      },
      
    }),
    nodeResolve({
      extensions: ['.js', '.ts', '.tsx']
    }),
    terser()
  ],
  external: ['react', 'react-dom', 'marked', 'lodash', 'axios', 'query-string', 'moment', 'qiankun'],
  watch: {
    include: 'src/**'
  }
};
