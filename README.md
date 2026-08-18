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

## Install

```bash
bun add oxc-import-transformer
```

> **ESM only.** This package ships as ES modules (`"type": "module"`) and cannot be loaded with `require()`.
> Both runtime dependencies (`oxc-parser`, `magic-string`) are ESM-only as well.

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

 RUN  v4.1.10 /Users/runner/work/oxc-import-transformer/oxc-import-transformer


 ✓ __tests__/index.bench.mts > transform 1214ms
     name                    hz     min      max    mean     p75     p99    p995    p999     rme  samples
   · babel transform   1,790.26  0.3698   6.8742  0.5586  0.5389  3.1573  5.2055  6.8742  ±5.86%      896
   · oxc transform    33,031.21  0.0234  12.7746  0.0303  0.0281  0.0390  0.0545  0.1877  ±6.25%    16516

 BENCH  Summary

  oxc transform - __tests__/index.bench.mts > transform
    18.45x faster than babel transform
```

## Development

This repo uses [Bun](https://bun.sh) as its package manager.

```bash
bun install
bun run test
bun run bench
bun run build
```
