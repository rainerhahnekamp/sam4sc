import { addModuleToMap } from './add-module-to-map';
import { PartialDirective, PartialModuleMap } from './model';
import { parseFile } from './parse-file';

describe('addModuleToMap', () => {
  beforeEach(() => expect.hasAssertions());

  it('should be able find a declared class in the same file as the module', () => {
    const ts = `
@Component({
  selector: 'pps-inline-module',
  template: ''
})
export class InlineModuleComponent {}

@NgModule({
  declarations: [InlineModuleComponent]
})
export class InlineModuleComponentModule {}
    `;

    const [, typeInfo] = parseFile(ts);
    const partialModuleMap: PartialModuleMap = new Map<
      string,
      { path: string; directives: PartialDirective[] }
    >();
    addModuleToMap(typeInfo.name, partialModuleMap, 'app/src/inline.ts', ts, typeInfo.contents);

    const moduleData = partialModuleMap.get('InlineModuleComponentModule');
    expect(moduleData).toEqual({
      directives: [{ name: 'InlineModuleComponent', path: 'app/src/inline.ts' }],
      path: 'app/src/inline.ts'
    });
  });

  it('should find a declared class from the imports', () => {
    const ts = `
import { FooComponent } from "./foo.component";
import { BarComponent } from "../bar/bar.component";

@NgModule({
  declarations: [FooComponent, BarComponent]
})
export class FooModule {}
    `;

    const [typeInfo] = parseFile(ts);
    const partialModuleMap: PartialModuleMap = new Map<
      string,
      { path: string; directives: PartialDirective[] }
    >();
    addModuleToMap(typeInfo.name, partialModuleMap, 'app/src/inline.ts', ts, typeInfo.contents);

    const moduleData = partialModuleMap.get('FooModule');
    expect(moduleData).toEqual({
      directives: [
        { name: 'FooComponent', path: 'app/src/foo.component.ts' },
        { name: 'BarComponent', path: 'app/bar/bar.component.ts' }
      ],
      path: 'app/src/inline.ts'
    });
  });

  it('should skip a module without declarations', () => {
    const ts = `
@NgModule({
  declarations: []
})
export class FooModule {}
    `;

    const [typeInfo] = parseFile(ts);
    const partialModuleMap: PartialModuleMap = new Map<
      string,
      { path: string; directives: PartialDirective[] }
    >();
    addModuleToMap(typeInfo.name, partialModuleMap, 'app/src/inline.ts', ts, typeInfo.contents);

    expect(partialModuleMap.has('FooModule')).toBe(false);
  });

  it('should skip a module with empty declarations', () => {
    const ts = `
@NgModule({})
export class FooModule {}
    `;

    const [typeInfo] = parseFile(ts);
    const partialModuleMap: PartialModuleMap = new Map<
      string,
      { path: string; directives: PartialDirective[] }
    >();
    addModuleToMap(typeInfo.name, partialModuleMap, 'app/src/inline.ts', ts, typeInfo.contents);

    expect(partialModuleMap.has('FooModule')).toBe(false);
  });
});
