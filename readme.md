

![npm](https://img.shields.io/npm/v/rollup-plugin-dep-inject.svg?style=flat-square)

# rollup-plugin-dep-inject

A rollup plugin that will use your external defined modules and inject their [unpkg](unpkg.io) CDN equivalents as script tags into a custom defined entry `index` file. The benifits here are that Rollup will skip bundling heavy dependencies that you might be using, which in turn will speed up your bundle times.

### Why not just code split?
You can, but even with code splitting, Rollup is still processing your dependencies. This plugin will be exceptionally helpful when you're working on a web project that uses a large amount of external depenedencies.

### Install
`yarn add rollup-plugin-dep-inject --dev`

### Example
```js

import depInject from  'rollup-plugin-dep-inject'

export default {
  input: 'src/app.js',
  external: ['lodash', 'bss', 'mithril', 'turbolinks'],
  output: [
    {
      file: 'dist/app.bundle.js',
      format: 'iife',
      name: 'App',
      sourcemap: true,
      globals: {
        lodash: '_',
        bss: 'b',
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

## Options

| Option | Type  |  Description |
|--|--|--|
| `index` | *String* | Relative path to the projects entry index file. |
| `attrs` | *String* | Attributes apply to `<script>` tags. |
| `ignore` | *Array* | External listed module IDs to ignore. |
| `unpkg` | *Object* | Retrieve specific reference using a unpkg-uri pattern. |
| `custom` | *Object* | Use a custom url reference to a module. |

> Both the `unpkg` and `custom` options accept a comma-separate list of `moduleID:Reference` pairs.

### unpkg-uri

The plugin leverages [unpkg-uri](https://github.com/tabianco/unpkg-uri) when generating the unpkg CDN module equivalents. The `unpkg` option accepts unpkg-uri pattern values which allows you to retrieve specified references within a modules package.

| Value | Returns |
|--|--|
| `[min.js]` | `https://unpkg.com/moduleID@0.1.0/lib/index.min.js`
| <code>&#124;file.json</code> | `https://unpkg.com/moduleID@0.1.0/lib/file.json`
| `/package.json` | `https://unpkg.com/moduleID@0.1.0/package.json`
| `@1.2.3` | `https://unpkg.com/moduleID@1.2.3/lib/index.js`
| `@prefix/` | `https://unpkg.com/@prefix/moduleID@0.1.0/lib/index.js`

## Usage

By default all external modules listed in `rollup.config.js` files will be injected and use the version numbers sourced from your projects `package.json` file. The unpkg uri will be generated automatically.

Below is a usage example with custom configuration:

```js

depInject({
  index: 'dist/index.html', // inject modules into this file
  attrs: 'defer', // add a 'defer' attribute to each generated script tag
  ignore: ['lodash'], // do not inject the 'lodash' module
  unpkg: {
    // leverage unpkg-uri pattern and retrive the minified version of bss
    bss: '[min.js]'
  },
  custom: {
    // use a custom CDN reference for the 'mithril' module external
    mithril:
      'https://cdnjs.cloudflare.com/ajax/libs/mithril/1.1.6/mithril.min.js'
  }
})

```

The above configuration would write the following to the entry index defined file:

```html

<!-- dist/index.html -->

<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>

    <!--dep-inject-->
    <script src="https://unpkg.com/bss@1.6.1/bss.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mithril/1.1.6/mithril.min.js" defer></script>
    <script src="https://unpkg.com/turbolinks@5.2.0/dist/turbolinks.js" defer></script>
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
The injectected dependencies in this example reflect the options defined within the plugin configuration:

- The script tags contain `defer` attributes
- Lodash was ignored
- BSS uses the minified version
- Mithril is using the custom CDN address.

### How it works?
The plugin uses your bundles `external: []` modules and cross-references them with your projects package.json dependencies. The name and version number is used to generate `<script src="">` tags that reference the modules [unpkg](unpkg.io) uri equivalent cdn address. The generated `script` tag modules are then injected into the entry `index` file that was defined in the plugin options.

## Changelog

Please see [changelog](changelog.md) for more information what has changed recently.

## License
The MIT License (MIT). Please see [License File](LICENSE) for more information.

