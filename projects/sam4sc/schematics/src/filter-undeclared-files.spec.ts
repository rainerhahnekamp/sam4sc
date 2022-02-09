import {
  filterUndeclaredDirectives,
  getDirectiveKeysFromModuleMap
} from './filter-undeclared-files';
import {
  createDirectiveMap,
  createPartialModuleMap,
  DirectiveMap,
  NgType,
  PartialModuleMap
} from './model';

describe('filter undeclared files', () => {
  const noopLogger = () => {};
  it('should show undeclared directives', () => {
    const moduleMap = createPartialModuleMap();

    moduleMap.set('a', {
      path: 'a.ts',
      directives: [
        { name: 'Comp1', path: 'app/src/comp1.ts' },
        { name: 'Comp2', path: 'app/src/comp2.ts' }
      ]
    });

    const directivesMap = createDirectiveMap();

    directivesMap.set('UndeclaredComponent-app/src/undeclared.comp.ts', {
      path: 'app/src/undeclared.comp.ts',
      name: 'UndeclaredComponent',
      type: 'Component'
    });

    expect(filterUndeclaredDirectives(moduleMap, directivesMap, noopLogger)).toEqual([
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

  it('should verify the logging', () => {
    const moduleMap = createPartialModuleMap();
    const logger = jest.fn<void, [string]>();
    moduleMap.set('a', {
      path: 'a.ts',
      directives: []
    });
    const directivesMap: DirectiveMap = createDirectiveMap();
    directivesMap.set('UC-app/undeclared.comp.ts', {
      path: 'app/undeclared.comp.ts',
      name: 'UC',
      type: 'Component'
    });

    filterUndeclaredDirectives(moduleMap, directivesMap, logger);

    expect(logger.mock.calls.map(([msg]) => msg)).toEqual([
      'Skipping 1 undeclared component(s):',
      'app/undeclared.comp.ts: UC',
      ''
    ]);
  });
});
