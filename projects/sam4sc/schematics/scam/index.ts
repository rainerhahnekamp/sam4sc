/**
 * TODO:
 * - CheckTask stating how many Modules remain to be checked
 * - Provide option to copy all imports, providers from original module
 * - Provide option for a blockList for imports that should be ignored when copying over
 * - Provide possibility to set standalone
 * - Full Coverage via Jest
 * - Add a pipe, directive and customers module to demo app
 *
 * DONE:
 * - Empty Declaration in Modules
 * - Rewrite as Angular Schematic
 * - Add dirty tag in generated SCAM
 * - Show summary before proceeding (--dry-run option)
 * - Add todo along description to created SCAM
 */
import { chain, Rule, Tree } from '@angular-devkit/schematics';
import { constructDirectivePartialModuleMap } from '../src/construct-directive-partial-module-map';
import { createModuleMap } from '../src/create-module-map';
import { filterScamModules } from '../src/filter-scam-modules';
import { filterUndeclaredDirectives } from '../src/filter-undeclared-files';
import { generateSCAMs } from '../src/generate-scams';
import { getProjectPath } from '../src/get-project-path';
import { removeDeclarations } from '../src/remove-declarations';
import { Schema as MyServiceSchema } from './schema';

export function toScam(options: MyServiceSchema): Rule {
  return async (tree: Tree) => {
    const sourceRoot = await getProjectPath(tree, options.project);
    const { directiveMap, partialModuleMap } = constructDirectivePartialModuleMap(tree, sourceRoot);

    filterUndeclaredDirectives(partialModuleMap, directiveMap);
    const { filteredModuleMap } = filterScamModules(partialModuleMap, directiveMap);
    const moduleMap = createModuleMap(filteredModuleMap, directiveMap);

    const rules: Rule[] = [];
    for (const [, { directives }] of Array.from(moduleMap.entries())) {
      for (const directive of directives) {
        rules.push(generateSCAMs(directive.name, directive.type, directive.path));
      }
    }

    removeDeclarations(moduleMap, tree);
    
    // https://github.com/angular/angular-cli/issues/17851#issuecomment-1067921103
    return chain(rules.map(rule => () => Promise.resolve(rule)));
  };
}
