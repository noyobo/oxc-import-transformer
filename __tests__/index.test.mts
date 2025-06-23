import { join } from 'path';
import { transform } from '../src/index.ts';
import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('transform', () => {
  it('should transform a.tsx', async () => {
    const file = join(__dirname, './fixtures', 'a.tsx');
    const content = await readFile(file, 'utf8');
    const result = await transform({
      filename: file,
      content,
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

    expect(result.converted).toBe(true);
    expect(result.map).toBeUndefined();
    expect(result.code).toMatchInlineSnapshot(`
      "import { ActionSheet } from '@ray-js/smart-ui/lib/ActionSheet';
      import { Button } from '@ray-js/smart-ui/lib/Button';

      export default () => {
        return (
          <Button
            title="hello"
            onClick={() => {
              console.log('hello');
            }}
          >
            <span>hello</span>
          </Button>
        );
      };
      "
    `);
  });

  it('should transform b.tsx', async () => {
    const file = join(__dirname, './fixtures', 'b.tsx');
    const content = await readFile(file, 'utf8');
    const result = await transform({
      filename: file,
      content,
      sourcemap: 'external',
      libraryTransform: [
        {
          libraryName: '@ray-js/smart-ui',
          format: (localName: string, importedName: string) => {
            if (localName !== importedName) {
              return `import { ${importedName} as ${localName} } from '@ray-js/smart-ui/lib/${importedName}';`;
            }
            return `import { ${importedName} } from '@ray-js/smart-ui/lib/${importedName}';`;
          },
        },
        {
          libraryName: '@ray-js/ui-smart',
          format: (localName: string, importedName: string) => {
            return `import { ${importedName} } from '@ray-js/ui-smart/lib/${importedName}';`;
          },
        },
      ],
    });
    expect(result.converted).toBe(true);
    expect(result.map).toContain('"version":3');
    expect(result.code).toMatchInlineSnapshot(`
      "import { ActionSheet } from '@ray-js/smart-ui/lib/ActionSheet';
      import { Button as Btn } from '@ray-js/smart-ui/lib/Button';
      import { Picker } from '@ray-js/ui-smart/lib/Picker';

      export default () => {
        return (
          <Btn
            title="hello"
            onClick={() => {
              console.log('hello');
            }}
          >
            <ActionSheet>hello</ActionSheet>
            <Picker>hello</Picker>
          </Btn>
        );
      };
      "
    `);
  });
});
