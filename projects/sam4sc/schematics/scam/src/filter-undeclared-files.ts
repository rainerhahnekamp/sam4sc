import { getDirectiveKey } from './get-directive-key';
import { Directive, DirectiveMap, PartialModuleMap } from './model';

export function getDirectiveKeysFromModuleMap(moduleMap: PartialModuleMap): string[] {
  return Array.from(moduleMap.values())
    .map((el) => el.directives.map((e) => getDirectiveKey(e)))
    .reduce((acc: string[], val) => [...acc, ...val], []);
}

export function filterUndeclaredDirectives(
  moduleMap: PartialModuleMap,
  directiveMap: DirectiveMap,
  logger: (message: string) => void = console.log
) {
  const directiveKeysFromModules = getDirectiveKeysFromModuleMap(moduleMap);
  const undeclaredDirectives: Directive[] = [];
  for (const [key, directive] of Array.from(directiveMap.entries())) {
    if (!directiveKeysFromModules.includes(key)) {
      undeclaredDirectives.push(directive);
    }
  }

  if (undeclaredDirectives.length > 0) {
    logger(`Skipping ${undeclaredDirectives.length} undeclared component(s):`);
    for (const directive of undeclaredDirectives) {
      logger(`${directive.path}: ${directive.name}`);
    }
    logger('');
  }

  return undeclaredDirectives;
}
