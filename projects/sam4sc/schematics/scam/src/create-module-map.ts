import { getDirectiveKey } from './get-directive-key';
import { Directive, DirectiveMap, ModuleMap, PartialDirective, PartialModuleMap } from './model';

function formatDirective({ name, path }: PartialDirective) {
  return `${name}: ${path}`;
}

export function createModuleMap(
  moduleMapWng: PartialModuleMap,
  directiveMap: DirectiveMap
): ModuleMap {
  const moduleMap: ModuleMap = new Map<string, { path: string; directives: Directive[] }>();
  moduleMapWng.forEach((value, key) => {
    moduleMap.set(key, {
      path: value.path,
      directives: value.directives.map((entry) => {
        const directive = directiveMap.get(getDirectiveKey(entry));
        if (!directive) {
          throw new Error(`Couldn't find ${formatDirective(entry)} in Module ${key}`);
        }
        return directive;
      })
    });
  });

  return moduleMap;
}
