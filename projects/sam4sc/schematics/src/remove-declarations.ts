import { Tree } from '@angular-devkit/schematics';

import { tsquery } from '@phenomnomnominal/tsquery';
import { Identifier, PropertyAssignment } from 'typescript';
import { ModuleMap } from './model';
import { readFile } from './read-file';
import { getLineBreakChar, removeListElement } from './ts-helper';

const COMMENT = `// SAM4SC:MCAM`;

export function removeDeclarations(moduleMap: ModuleMap, tree: Tree) {
  for (const [, { path }] of Array.from(moduleMap.entries())) {
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
