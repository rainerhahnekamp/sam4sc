import { Tree } from '@angular-devkit/schematics';
import { addDirectiveToMap } from './add-directive-to-map';
import { addModuleToMap } from './add-module-to-map';
import { forEachTsFile } from './for-each-ts-file';
import {
  createDirectiveMap,
  createPartialModuleMap,
  DirectiveMap,
  PartialModuleMap
} from './model';
import { parseFile } from './parse-file';
import { readFile } from './read-file';

export function constructDirectivePartialModuleMap(
  tree: Tree,
  sourceRoot: string
): {
  directiveMap: DirectiveMap;
  partialModuleMap: PartialModuleMap;
} {
  const directiveMap = createDirectiveMap();
  const partialModuleMap = createPartialModuleMap();

  forEachTsFile(tree, sourceRoot, (filePath) => {
    const contents = readFile(tree, filePath);

    for (const typeInfo of parseFile(contents)) {
      if (['Component', 'Pipe', 'Directive'].includes(typeInfo.ngType)) {
        addDirectiveToMap(typeInfo, directiveMap, filePath);
      }

      if (typeInfo.ngType === 'Module') {
        addModuleToMap(typeInfo.name, partialModuleMap, filePath, contents, typeInfo.contents);
      }
    }
  });

  return { directiveMap, partialModuleMap };
}
