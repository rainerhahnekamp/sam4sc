import { Rule, Tree } from '@angular-devkit/schematics';
import { constructDirectivePartialModuleMap } from '../src/construct-directive-partial-module-map';
import { createModuleMap } from '../src/create-module-map';
import { filterScamModules } from '../src/filter-scam-modules';
import { getProjectPath } from '../src/get-project-path';
import { readFile } from './../src/read-file';
import { createScAction } from './create-sc-action';
import { Schema as MyServiceSchema } from './schema';

export function sc(options: MyServiceSchema): Rule {
  return async (tree: Tree) => {
    const sourceRoot = await getProjectPath(tree, options.project);
    const { directiveMap, partialModuleMap } = constructDirectivePartialModuleMap(tree, sourceRoot);

    const { scamModuleMap } = filterScamModules(partialModuleMap, directiveMap);

    const moduleMap = createModuleMap(scamModuleMap, directiveMap);

    for (let [, value] of Array.from(moduleMap.entries())) {
      const modulePath = value.path;
      const componentPath = value.directives[0].path;
      const componentContents = readFile(tree, componentPath);
      const moduleContents = readFile(tree, modulePath);

      if (!componentPath.endsWith('inline-module.component.ts')) {
        console.log(componentPath);
        const scAction = createScAction(
          modulePath,
          moduleContents,
          componentPath,
          componentContents
        );

        tree.delete(modulePath);
        tree.overwrite(componentPath, scAction.componentContents);
      } else {
        console.log('skipping inline module');
      }
    }
  };
}
