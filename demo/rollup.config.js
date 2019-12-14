import depInject from '../src/index'

export default {
  input: './demo/app.js',
  external: [
    'lodash',
    'bss',
    'mithril',
    'turbolinks'
  ],
  output: [
    {
      file: './demo/app.bundle.js',
      format: 'iife',
      name: 'App',
      sourcemap: true,
      globals: {
        lodash: '_',
        mithril: 'm',
        bss: 'b',
        turbolinks: 'Turbolinks'
      }
    }
  ],
  plugins: [
    depInject({
      index: './demo/index.html',
      attr: '', // add a 'defer' attribute to each generated script tag
      inBody: false,
      ignore: [
        'lodash' // do not inject the 'lodash' module
      ],
      unpkg: {
        // leverage unpkg-uri and retrive the minified version
        // bss: '[min.js]'
      },
      custom: {
        // use a different CDN for the 'mithril' module external
        mithril:
          'https://cdnjs.cloudflare.com/ajax/libs/mithril/1.1.6/mithril.min.js'
      }
    })
  ],
  watch: {
    chokidar: {
      usePolling: true
    }
  }
}
