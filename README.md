# oxc-import-transformer

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]

[build-img]: https://github.com/noyobo/oxc-import-transformer/actions/workflows/ci.yml/badge.svg
[build-url]: https://github.com/noyobo/oxc-import-transformer/actions/workflows/ci.yml
[downloads-img]: https://img.shields.io/npm/dt/oxc-import-transformer
[downloads-url]: https://www.npmtrends.com/oxc-import-transformer
[npm-img]: https://img.shields.io/npm/v/oxc-import-transformer
[npm-url]: https://www.npmjs.com/package/oxc-import-transformer
[issues-img]: https://img.shields.io/github/issues/noyobo/oxc-import-transformer
[issues-url]: https://github.com/noyobo/oxc-import-transformer/issues
[codecov-img]: https://codecov.io/gh/noyobo/oxc-import-transformer/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/noyobo/oxc-import-transformer
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/

## Usage

```ts
import { transform } from 'oxc-import-transformer';
import { readFileSync } from 'node:fs';

const file = '/path/to/file.ts';
const content = readFileSync(file, 'utf-8');

const code = await transform({
  filename: file,
  content,
  sourcemap: false,
  libraryTransform: [
    {
      libraryName: '@ray-js/smart-ui',
      format: (localName: string, importedName: string) => {
        return `import ${localName} from '@ray-js/smart-ui/lib/${importedName}';`;
      },
    },
    {
      libraryName: '@ray-js/ui-smart',
      format: (localName: string, importedName: string) => {
        return `import ${localName} from '@ray-js/ui-smart/lib/${importedName}';`;
      },
    },
  ],
});
```

## Benchmark

vs [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)

```
Benchmarking is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v3.1.2 /Users/runner/work/oxc-import-transformer/oxc-import-transformer


 ✓ __tests__/index.bench.mts > transform 1285ms
     name                   hz     min      max    mean     p75      p99     p995     p999     rme  samples
   · babel transform    288.76  1.1712  12.3138  3.4631  4.3863  11.2988  12.3138  12.3138  ±8.96%      145
   · oxc transform    6,113.60  0.0724   7.3846  0.1636  0.1462   0.8301   1.5227   3.5838  ±5.81%     3057   fastest

 BENCH  Summary

  oxc transform - __tests__/index.bench.mts > transform
    21.17x faster than babel transform
```
