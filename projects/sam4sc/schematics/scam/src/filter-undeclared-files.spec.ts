import {
  filterUndeclaredDirectives,
  getDirectiveKeysFromModuleMap
} from './filter-undeclared-files';
import { DirectiveMap, NgType, PartialModuleMap } from './model';

describe('filter undeclared files', () => {
  it('should show undeclared directives', () => {
    const moduleMap: PartialModuleMap = new Map<
      string,
      { path: string; directives: { name: string; path: string }[] }
    >();

    moduleMap.set('a', {
      path: 'a.ts',
      directives: [
        { name: 'Comp1', path: 'app/src/comp1.ts' },
        { name: 'Comp2', path: 'app/src/comp2.ts' }
      ]
    });

    const directivesMap: DirectiveMap = new Map<
      string,
      { path: string; name: string; type: NgType }
    >();

    directivesMap.set('UndeclaredComponent-app/src/undeclared.comp.ts', {
      path: 'app/src/undeclared.comp.ts',
      name: 'UndeclaredComponent',
      type: 'Component'
    });

    expect(filterUndeclaredDirectives(moduleMap, directivesMap)).toEqual([
      {
        path: 'app/src/undeclared.comp.ts',
        name: 'UndeclaredComponent',
        type: 'Component'
      }
    ]);
  });

  it('should flatten the moduleMap', () => {
    const moduleMap: PartialModuleMap = new Map<
      string,
      { path: string; directives: { name: string; path: string }[] }
    >();
    moduleMap.set('a', {
      path: 'a.ts',
      directives: [
        { name: 'Comp1', path: 'comp1.ts' },
        { name: 'Comp2', path: 'comp2.ts' }
      ]
    });

    moduleMap.set('b', {
      path: 'b.ts',
      directives: [
        { name: 'Comp3', path: 'comp3.ts' },
        { name: 'Comp4', path: 'comp4.ts' }
      ]
    });

    expect(getDirectiveKeysFromModuleMap(moduleMap)).toEqual([
      'Comp1-comp1.ts',
      'Comp2-comp2.ts',
      'Comp3-comp3.ts',
      'Comp4-comp4.ts'
    ]);
  });
});
