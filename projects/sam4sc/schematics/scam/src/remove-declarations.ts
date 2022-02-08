import { SchematicsException, Tree } from '@angular-devkit/schematics';

import { tsquery } from '@phenomnomnominal/tsquery';
import { Identifier, PropertyAssignment } from 'typescript';
import { ModuleMap } from './model';

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
    const buffer = tree.read(path);
    if (buffer === null) {
      throw new SchematicsException(`cannot read module ${name}`);
    }
    const contents = buffer.toString('utf-8');

    const [declarations] = tsquery(
      contents,
      'Decorator > CallExpression > ObjectLiteralExpression > PropertyAssignment > Identifier[name=declarations]'
    ) as Identifier[];
    const propertyAssignment = declarations.parent as PropertyAssignment;

    const prefix = contents.substring(0, propertyAssignment.pos);
    const suffix = contents
      .substring(propertyAssignment.pos + propertyAssignment.getFullText().length)
      .replace(/\s*,/, ''); // remove potential trailing comma

    tree.overwrite(path, `${COMMENT}${getLineBreakChar(contents)}${prefix}${suffix}`);
  }
}
