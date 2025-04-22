import { readFile } from 'fs/promises';
import { ImportDeclaration, ImportSpecifier, parseAsync, Statement } from 'oxc-parser';
import { extname } from 'path';
import MagicString from 'magic-string';

export const transform = async (
  file_path: string,
  options: {
    sourcemap?: boolean;
    libraryName: string;
    format: (localName: string, importedName: string) => string;
  },
): Promise<string> => {
  const content = await readFile(file_path, 'utf-8');
  const fileExt = extname(file_path);
  const isTs = fileExt === '.ts' || fileExt === '.tsx';

  const ast = await parseAsync(file_path, content, {
    lang: fileExt.substring(1) as 'js' | 'jsx' | 'ts' | 'tsx',
    astType: isTs ? 'ts' : 'js',
  });

  const magicString = new MagicString(content);

  let hasUpdate = false;

  function traverseStatement(statement: Statement) {
    if (statement.type === 'ImportDeclaration') {
      const { source, specifiers } = statement as ImportDeclaration;
      const { value } = source;
      if (value === options.libraryName) {
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
              const newSpecifier = options.format(localName, importedName);
              if (newSpecifier) {
                return newSpecifier;
              }
            }
          })
          .filter(Boolean)
          .join('\n');
        magicString.update(start, end, updateImports);
        hasUpdate = true;
      }
    }
  }

  ast.program.body.map(traverseStatement);

  if (!hasUpdate) {
    return content;
  }

  const code = magicString.toString();
  if (options.sourcemap) {
    const map = magicString
      .generateMap({
        source: file_path,
        includeContent: true,
        hires: true,
      })
      .toUrl();
    return code + '\n//# sourceMappingURL=' + map;
  }

  return code;
};
