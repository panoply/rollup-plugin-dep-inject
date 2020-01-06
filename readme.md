

![npm](https://img.shields.io/npm/v/rollup-plugin-dep-inject.svg?style=flat-square)

Suited for projects that leverage the Rollup [JavaScript API](https://rollupjs.org/guide/en/#javascript-api) to programmatically generate bundles.

# rollup-plugin-dep-inject

A rollup plugin that will use your external defined modules and inject their [unpkg](unpkg.io) CDN equivalents as script tags into a custom defined entry `index` file. The benifits here are that Rollup will skip bundling heavy dependencies that you might be using which in turn will speed up your bundle times when compiling programatically or using a third-party tool like Gulp 4.

### Bruh... Why not just code split?
If you're using the JavaScript API and bundling programatically, even with code splitting Rollup is still processing your dependencies. The plugin was originally developed to speed up the time it was taking Rollup to complile IIFE bundles building via Gulp 4 functions but it can be appropriated to almost any use even if you're not compling via the [JavaScript API](https://rollupjs.org/guide/en/#javascript-api).

### Yarn
`yarn add rollup-plugin-dep-inject --dev`

### NPM
`npm install rollup-plugin-dep-inject --save-dev`

### Example
```js

import depInject from  'rollup-plugin-dep-inject'

export default {
  input: 'src/app.js',
  // Some External defined modules
  external: ['lodash', 'bss', 'mithril', 'turbolinks'],
  // Generating an IIFE bundle
  output: [
    {
      file: 'dist/app.bundle.js',
      format: 'iife',
      name: 'App',
      sourcemap: true,
      // Globals reflect the externmal defined modules
      globals: {
        lodash: '_',
        bss: 'b',
        mithril: 'm',
        turbolinks: 'Turbolinks'
      }
    }
  ],
  plugins: [
    // We call dep-inject to add externals to said file
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
| `remove` | *Boolean* | When set to `true` will remove any injected dependencies in file |
| `log` | *Boolean* | Enabled/Disable logging of dependency injections, defaults to `true` |
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
  ignore: ['lodash'], // do not inject the 'lodash' module,
  remove: (process.env.NODE_ENV === 'production') // Remove injected modules for production bundle
  unpkg: {
    // leverage 'unpkg-uri' pattern and retrive the minified version of the 'bss' module
    bss: '[min.js]'
  },
  custom: {
    // use a custom CDN reference for the 'mithril' framework module
    mithril:
      'https://cdnjs.cloudflare.com/ajax/libs/mithril/2.0.4/mithril.min.js'
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mithril/2.0.4/mithril.min.js" defer></script>
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

### Removing injections

You can remove injections by passing a truthy to the `remove` option which will detect and remove any injected `<script>` dependencies from the index file located between `<!--dep-inject-->` comments. This is helpful when you are building in different environments where in _development_ you inject dependencies but in _production_ you bundle them.

### How it works?
The plugin uses your bundles `external: []` modules and cross-references them with your projects package.json dependencies. The name and version number is used to generate `<script src="">` tags that reference the modules [unpkg](unpkg.io) uri equivalent cdn address. The generated `script` tag modules are then injected into the entry `index` file that was defined in the plugin options.

## Changelog

Please see [changelog](changelog.md) for more information what has changed recently.

## License
The MIT License (MIT). Please see [License File](LICENSE) for more information.

