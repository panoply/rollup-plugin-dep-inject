import buble from 'rollup-plugin-buble'

var external = Object.keys(require('./package.json').dependencies).concat('path')

export default {
  input: 'src/index.js',
  plugins: [
    buble({
      transforms: {
        templateString: false
      }
    })
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
