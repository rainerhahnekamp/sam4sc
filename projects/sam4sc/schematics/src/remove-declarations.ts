import { SchematicsException, Tree } from '@angular-devkit/schematics';

import { tsquery } from '@phenomnomnominal/tsquery';
import { Identifier, PropertyAssignment } from 'typescript';
import { ModuleMap } from './model';
import { readFile } from './read-file';
import { removeListElement } from './ts-helper';

const COMMENT = `// SAM4SC:MCAM`;

// https://stackoverflow.com/questions/34820267/detecting-type-of-line-breaks
function getLineBreakChar(str: string) {
  const indexOfLF = str.indexOf('\n', 1); // No need to check first-character

  if (indexOfLF === -1) {
    if (str.indexOf('\r') !== -1) return '\r';

    return '\n';
  }

  if (str[indexOfLF - 1] === '\r') return '\r\n';

  return '\n';
}

export function removeDeclarations(moduleMap: ModuleMap, tree: Tree) {
  for (const [name, { path }] of Array.from(moduleMap.entries())) {
    const contents = readFile(tree, path);

    const [declarations] = tsquery(
      contents,
      'Decorator > CallExpression > ObjectLiteralExpression > PropertyAssignment > Identifier[name=declarations]'
    ) as Identifier[];
    const propertyAssignment = declarations.parent as PropertyAssignment;

    const newContents = removeListElement(contents, propertyAssignment);

    tree.overwrite(path, `${COMMENT}${getLineBreakChar(contents)}${newContents}`);
  }
}
