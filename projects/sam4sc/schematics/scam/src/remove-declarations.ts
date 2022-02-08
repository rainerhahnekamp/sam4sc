import { SchematicsException, Tree } from '@angular-devkit/schematics';

import { tsquery } from '@phenomnomnominal/tsquery';
import { Identifier, PropertyAssignment } from 'typescript';
import { ModuleMap } from './model';

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

    tree.overwrite(path, `${prefix}${suffix}`);
  }
}
