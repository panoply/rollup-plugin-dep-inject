
# rollup-plugin-dep-inject

A rollup plugin that extracts your externally defined modules and injects their unpkg cdn equivalent into an index entry file resulting in faster bundle times.

### Install
`yarn add rollup-plugin-dep-inject --dev`

### Example
```js

import depInject from  'rollup-plugin-dep-inject'

export default {
  input: 'src/app.js',
  external: ['lodash', 'mithril', 'turbolinks'],
  output: [
    {
      file: 'dist/app.js',
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
      index: 'dist/index.html'
    })
  ]
}

```

### Options

| Option | Type  |  Description |
|--|--|--|
| `index` | *String* | Relative path to the projects entry index file |
| `attrs` | *String* | Attributes apply to `<script>` tags |
| `ignore` | *Array* | External listed module IDs to ignore |
| `overwrite` | *Object* | Apply a custom uri reference to modules |


## Usage
By default all external modules listed in  `rollup.config.js` files will be injected and use version numbers sourced from the projects `package.json`. Below is a usage example with custom configuration:

```js

depInject({
  index: 'dist/index.html',
  attrs: 'defer',
  ignore: ['lodash'],
  overwrite: {
    mithril:
      'https://cdnjs.cloudflare.com/ajax/libs/mithril/1.1.6/mithril.min.js'
  }
})

```
The above configuration would generate the following:

```html

<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>

    <!--dep-inject-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mithril/1.1.6/mithril.min.js"></script>
    <script src="https://unpkg.com/turbolinks@5.2.0/dist/turbolinks.js"></script>
    <!--dep-inject-->

    <script src="bundle.test.js"></script>
  </head>
  <body>
    <div class="test">
      <h1>Hello World</h1>
    </div>
  </body>
</html>

```
The injectected dependencies in this example reflect the options defined within the plugin configuration :

- The script tags using `defer`  attribute
- Lodash was ignored
- Mithril is using an alternative CDN

### How it works?
The plugin extracts your bundles `external: []` modules and will cross-reference them with to your projects package.json dependencies. The modules name and version number is used to generate `<script src="">` tags that reference a modules unpkg uri equivalent cdn. The generated  `script` tag module cdn references are injected into the entry index file that was defined in the plugin options.

## Changelog

Please see [changelog](changelog.md) for more information what has changed recently.

## License
The MIT License (MIT). Please see [License File](LICENSE) for more information.

