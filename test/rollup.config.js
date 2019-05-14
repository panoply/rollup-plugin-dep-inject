import depInject from './../src/index'

export default {
  input: 'test/app.js',
  external: [
    'lodash',
    'mithril',
    'turbolinks'
  ],
  output: [
    {
      file: 'test/app.bundle.js',
      format: 'iife',
      name: 'App',
      sourcemap: true,
      globals: {
        lodash: '_',
        mithril: 'm',
        turbolinks: 'Turbolinks'
      }
    }
  ],
  plugins: [
    depInject({
      index: 'test/index.html'
    })
  ],
  watch: {
    chokidar: {
      usePolling: true
    }
  }
}
