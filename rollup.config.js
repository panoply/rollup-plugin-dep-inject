import { terser } from 'rollup-plugin-terser'

var external = Object.keys(require('./package.json').dependencies).concat('path')

export default {
  input: 'src/index.js',
  plugins: [
    terser()
  ],
  external: external,
  output: [
    {
      file: 'dist/rollup-plugin-dep-inject.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/rollup-plugin-dep-inject.es6.js',
      format: 'esm'
    }
  ]
}
