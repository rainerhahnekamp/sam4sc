import { SchematicsException, Tree } from '@angular-devkit/schematics';

export function readFile(tree: Tree, filePath: string): string {
  const buffer = tree.read(filePath);
  if (buffer === null) {
    throw new SchematicsException(`cannot read module ${filePath}`);
  }
  return buffer.toString('utf-8');
}
