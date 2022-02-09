/**
 * TODO:
 * - CheckTask der sagt, wie viele Module noch zu überprüfen sind
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
import { addDirectiveToMap } from '../src/add-directive-to-map';
import { addModuleToMap } from '../src/add-module-to-map';
import { createModuleMap } from '../src/create-module-map';
import { filterScamModules } from '../src/filter-scam-modules';
import { filterUndeclaredDirectives } from '../src/filter-undeclared-files';
import { forEachTsFile } from '../src/for-each-ts-file';
import { generateSCAMs } from '../src/generate-scams';
import { getProjectPath } from '../src/get-project-path';
import { createDirectiveMap, createPartialModuleMap } from '../src/model';
import { parseFile } from '../src/parse-file';
import { readFile } from '../src/read-file';
import { removeDeclarations } from '../src/remove-declarations';
import { Schema as MyServiceSchema } from './schema';

export function toScam(options: MyServiceSchema): Rule {
  return async (tree: Tree) => {
    const sourceRoot = await getProjectPath(tree, options.project);

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

    filterUndeclaredDirectives(partialModuleMap, directiveMap);
    const filterModuleMapWng = filterScamModules(partialModuleMap, directiveMap);
    const moduleMap = createModuleMap(filterModuleMapWng, directiveMap);

    const rules: Rule[] = [];
    for (const [, { directives }] of Array.from(moduleMap.entries())) {
      for (const directive of directives) {
        rules.push(generateSCAMs(directive.name, directive.type, directive.path));
      }
    }

    removeDeclarations(moduleMap, tree);

    return chain(rules);
  };
}
