import { transformAsync } from '@babel/core';
import { readFileSync } from 'node:fs';
import { join } from 'path';
import { bench, describe } from 'vitest';
import { transform } from '../src/index.ts';

const file = join(__dirname, './fixtures', 'a.tsx');
const code = readFileSync(file, 'utf-8');

const babelTransform = async (code: string) => {
  return transformAsync(code, {
    presets: ['@babel/preset-react'],
    plugins: [
      [
        'babel-plugin-import',
        {
          libraryName: '@ray-js/smart-ui',
          libraryDirectory: 'dist',
        },
      ],
    ],
  });
};

const oxcTransform = (code: string) => {
  return transform({
    filename: file,
    content: code,
    sourcemap: false,
    libraryTransform: [
      {
        libraryName: '@ray-js/smart-ui',
        format: (localName: string, importedName: string) => {
          return `import { ${importedName} } from '@ray-js/smart-ui/lib/${importedName}';`;
        },
      },
    ],
  });
};

describe('transform', () => {
  bench('babel transform', async () => {
    const result = await babelTransform(code);
  });

  bench('oxc transform', async () => {
    const result = await oxcTransform(code);
  });
});
