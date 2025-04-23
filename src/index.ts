import { ImportDeclaration, ImportSpecifier, parseAsync, Statement } from 'oxc-parser';
import { extname } from 'node:path';
import MagicString from 'magic-string';

export const transform = async (options: {
  filename: string;
  content: string;
  sourcemap?: 'inline' | 'external' | false;
  libraryTransform: Array<{
    libraryName: string;
    format: (localName: string, importedName: string) => string;
  }>;
}) => {
  const { filename, content, libraryTransform } = options;
  const fileExt = extname(filename);
  const isTs = fileExt === '.ts' || fileExt === '.tsx';

  const ast = await parseAsync(filename, content, {
    lang: fileExt.substring(1) as 'js' | 'jsx' | 'ts' | 'tsx',
    astType: isTs ? 'ts' : 'js',
  });

  const magicString = new MagicString(content);

  function traverseStatement(statement: Statement) {
    const codeUpdates: Array<{
      start: number;
      end: number;
      content: string;
    }> = [];
    if (statement.type === 'ImportDeclaration') {
      const { source, specifiers } = statement as ImportDeclaration;
      const { value } = source;
      const currentLibraryTransform = libraryTransform.find((l) => l.libraryName === value);

      if (currentLibraryTransform) {
        const start = statement.start;
        const end = statement.end;
        const updateImports = specifiers
          .map((specifier) => {
            if (specifier.type === 'ImportSpecifier') {
              const { local, imported } = specifier as ImportSpecifier;
              const localName = local.name;
              let importedName: string;
              if (imported.type === 'Identifier') {
                importedName = imported.name;
              }
              const newSpecifier = currentLibraryTransform.format(localName, importedName);
              if (newSpecifier) {
                return newSpecifier;
              }
            }
          })
          .filter(Boolean)
          .join('\n');

        codeUpdates.push({ start, end, content: updateImports });
      }
    }
    return codeUpdates;
  }

  const codeUpdates = ast.program.body.map(traverseStatement).flat();

  if (!codeUpdates.length) {
    return {
      converted: false,
      code: content,
    };
  }

  codeUpdates.reverse().forEach((update) => {
    magicString.overwrite(update.start, update.end, update.content);
  });

  let map: string | undefined;

  let code = magicString.toString();

  if (options.sourcemap) {
    const mapObj = magicString.generateMap({
      source: filename,
      file: filename.replace(fileExt, '.js.map'),
      includeContent: true,
      hires: true,
    });

    if (options.sourcemap === 'inline') {
      code += '\n//# sourceMappingURL=' + mapObj.toUrl();
    } else {
      map = mapObj.toString();
    }
  }

  return {
    converted: true,
    code,
    map,
  };
};
