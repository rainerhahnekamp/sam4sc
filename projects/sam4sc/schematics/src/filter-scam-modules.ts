import { SchematicsException } from '@angular-devkit/schematics';
import { getDirectiveKey } from './get-directive-key';
import { createPartialModuleMap, Directive, DirectiveMap, PartialModuleMap } from './model';

export function filterScamModules(
  moduleMap: PartialModuleMap,
  directiveMap: DirectiveMap
): { filteredModuleMap: PartialModuleMap; scamModuleMap: PartialModuleMap } {
  const scamDirectives: Directive[] = [];
  const scamModuleMap = createPartialModuleMap();
  const filteredModuleMap = createPartialModuleMap();

  for (const [key, value] of Array.from(moduleMap.entries())) {
    if (value.directives.length === 1) {
      const [partialDirective] = value.directives;
      const directive = directiveMap.get(getDirectiveKey(partialDirective));
      if (!directive) {
        throw new SchematicsException(
          `cannot find component ${partialDirective.name} in module ${value.path}`
        );
      }
      scamDirectives.push(directive);
      scamModuleMap.set(key, value);
    } else {
      filteredModuleMap.set(key, value);
    }
  }

  if (scamDirectives.length > 0) {
    console.log(`Skipping ${scamDirectives.length} SCAM component(s):`);
    for (const directive of scamDirectives) {
      console.log(`${directive.path}: ${directive.name}`);
    }
    console.log('');
  }

  return { filteredModuleMap, scamModuleMap };
}
