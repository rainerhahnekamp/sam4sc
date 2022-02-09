import { Rule, Tree } from '@angular-devkit/schematics';
import { constructDirectivePartialModuleMap } from '../src/construct-directive-partial-module-map';
import { createModuleMap } from '../src/create-module-map';
import { filterScamModules } from '../src/filter-scam-modules';
import { getProjectPath } from '../src/get-project-path';
import { Schema as MyServiceSchema } from './schema';

export function sc(options: MyServiceSchema): Rule {
  return async (tree: Tree) => {
    const sourceRoot = await getProjectPath(tree, options.project);
    const { directiveMap, partialModuleMap } = constructDirectivePartialModuleMap(tree, sourceRoot);

    const { scamModuleMap } = filterScamModules(partialModuleMap, directiveMap);

    const moduleMap = createModuleMap(scamModuleMap, directiveMap);

    console.log(moduleMap);
  };
}
