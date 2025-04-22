# oxc-import-transformer

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]

[build-img]: https://github.com/noyobo/oxc-import-tramsformer/actions/workflows/ci.yml/badge.svg
[build-url]: https://github.com/noyobo/oxc-import-tramsformer/actions/workflows/ci.yml
[downloads-img]: https://img.shields.io/npm/dt/oxc-import-tramsformer
[downloads-url]: https://www.npmtrends.com/oxc-import-tramsformer
[npm-img]: https://img.shields.io/npm/v/oxc-import-tramsformer
[npm-url]: https://www.npmjs.com/package/oxc-import-tramsformer
[issues-img]: https://img.shields.io/github/issues/noyobo/oxc-import-tramsformer
[issues-url]: https://github.com/noyobo/oxc-import-tramsformer/issues
[codecov-img]: https://codecov.io/gh/noyobo/oxc-import-tramsformer/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/noyobo/oxc-import-tramsformer
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/

## Usage

```ts
import { transform } from 'oxc-import-transformer';

const file = '/path/to/file.ts';

const code = transform(file, {
  sourcemap: true,
  libraryName: '@ray-js/smart-ui',
  format: (localName: string, importedName: string) => {
    return `import ${localName} from '@ray-js/smart-ui/lib/${importedName}';`;
  },
});
```
