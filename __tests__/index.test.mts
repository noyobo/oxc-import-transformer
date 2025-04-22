import {join} from 'path';
import {transform} from '../src';
import {describe, expect, it} from 'vitest'

describe('transform', () => {
  it('should transform a.tsx', async () => {
    const file = join(__dirname, './fixtures', 'a.tsx')
    const code = await transform(file, {
      sourcemap: false,
      libraryName: '@ray-js/smart-ui',
      format: (localName: string, importedName: string) => {
        return `import ${localName} from '@ray-js/smart-ui/lib/${importedName}';`
      }
    })

    expect(code).toMatchInlineSnapshot(`
      "import ActionSheet from '@ray-js/smart-ui/lib/ActionSheet';
      import Button from '@ray-js/smart-ui/lib/Button';

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
      }"
    `)
  });

  it('should transform b.tsx', async () => {
    const file = join(__dirname, './fixtures', 'b.tsx')
    const code = await transform(file, {
      sourcemap: false,
      libraryName: '@ray-js/smart-ui',
      format: (localName: string, importedName: string) => {
        return `import ${localName} from '@ray-js/smart-ui/lib/${importedName}';`
      }
    })

    expect(code).toMatchInlineSnapshot(`
      "import ActionSheet from '@ray-js/smart-ui/lib/ActionSheet';
      import Btn from '@ray-js/smart-ui/lib/Button';

      export default () => {
        return (
          <Btn
            title="hello"
            onClick={() => {
              console.log('hello');
            }}
          >
            <ActionSheet>hello</ActionSheet>
          </Btn>
        );
      }"
    `)
  });
})