import { normalize } from '@angular-devkit/core';
import { getDirectiveKey } from './get-directive-key';
import { DirectiveMap, TypeInfo } from './model';

export function addDirectiveToMap(
  typeInfo: TypeInfo,
  directiveMap: DirectiveMap,
  filePath: string
): void {
  const path = normalize(filePath);
  const directive = { name: typeInfo.name, path, type: typeInfo.ngType };
  directiveMap.set(getDirectiveKey(directive), directive);
}
