# Changelog

All notable changes to `rollup-plugin-dep=inject will be documented in this file.

## [0.2.6] - 14/12/2019

### Added

**Provide `remove` option**

Provide an option to remove injected dependencies. Helpful when working in development and production environments.

### Updates

- Document remove option


## [0.2.5] - 14/12/2019

### Added

**`</head>` fallback**

When no `<script>` tags are detected in the defined `index` file modules write from `</head>` tag element.

**Direct write fallback**

When no `</script>` or `</head>` is located within the defined `index` file then modules will be written from position `0` of a document.

**Prodive `remove` option**

Provide an option to remove injected dependencies. Helpful when working in development and production environments.

### Updates

- some readme.md adjustments
- Updated dependencies
- Added some helpful logs

### Updates

- Some readme.md updates and changes.

## [0.2.2] - 17/08/2019

### Updates

- Minor changes and removed demo dependencies which are not required.

## [0.2.0] - 16/05/2019

### Changes

- The `overwrite` option is now `custom`

### Updates

- Added (unpkg-uri)[https://github.com/tabianco/unpkg-uri#usage] pattern support.
- Added example test
- Improved documentation

## [0.1.2] - 16/05/2019

- Tidy up depInject class
- Better documentation

## [0.1.0] - 14/05/2019

- Initial Release
