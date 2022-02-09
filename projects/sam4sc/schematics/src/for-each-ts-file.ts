import { Tree } from '@angular-devkit/schematics';

export function forEachTsFile(
  tree: Tree,
  sourcePath: string,
  callback: (filePath: string) => void
) {
  const dir = tree.getDir(sourcePath);
  dir.visit((path, entry) => {
    if (path.endsWith('.ts') && entry) {
      try {
        callback(entry.path);
      } catch (err) {
        console.error(`error in processing ${entry.path}`);
        throw err;
      }
    }
  });
}
