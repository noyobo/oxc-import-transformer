import { ImportDeclaration, ImportSpecifier, parseAsync, Statement } from 'oxc-parser';
import { extname } from 'path';
import MagicString from 'magic-string';

export const transform = async (options: {
  filename: string;
  content: string;
  sourcemap?: boolean;
  libraryTransform: Array<{
    libraryName: string;
    format: (localName: string, importedName: string) => string;
  }>;
}): Promise<string> => {
  const { filename, content, libraryTransform } = options;
  const fileExt = extname(filename);
  const isTs = fileExt === '.ts' || fileExt === '.tsx';

  const ast = await parseAsync(filename, content, {
    lang: fileExt.substring(1) as 'js' | 'jsx' | 'ts' | 'tsx',
    astType: isTs ? 'ts' : 'js',
  });

  const magicString = new MagicString(content);

  const codeUpdate = [];

  function traverseStatement(statement: Statement) {
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

        codeUpdate.push({ start, end, updateImports });
      }
    }
  }

  ast.program.body.map(traverseStatement);

  if (!codeUpdate.length) {
    return content;
  }

  codeUpdate.reverse().forEach((update) => {
    magicString.overwrite(update.start, update.end, update.updateImports);
  });

  const code = magicString.toString();
  if (options.sourcemap) {
    const map = magicString
      .generateMap({
        source: filename,
        includeContent: true,
        hires: true,
      })
      .toUrl();
    return code + '\n//# sourceMappingURL=' + map;
  }

  return code;
};
