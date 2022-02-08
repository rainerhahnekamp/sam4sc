import { parseFile } from './parse-file';

describe('parseFile', () => {
  it('should parse a file with one component and a module', () => {
    const ts = `
@Component({
  selector: 'pps-inline-module',
  template: ''
})
export class InlineModuleComponent {}
    `;

    const typeInfos = parseFile(ts);
    expect(typeInfos).toHaveLength(1);
    expect(typeInfos[0]).toMatchObject({ name: 'InlineModuleComponent', ngType: 'Component' });
  });

  it('should parse a file with a component and a module', () => {
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

    const typeInfos = parseFile(ts);
    expect(typeInfos).toHaveLength(2);
    expect(typeInfos[0]).toMatchObject({ name: 'InlineModuleComponent', ngType: 'Component' });
    expect(typeInfos[1]).toMatchObject({ name: 'InlineModuleComponentModule', ngType: 'Module' });
  });

  it('should exclude classes without decorators and classes with unknown decorator', () => {
    const ts = `
export class InlineModuleComponent {}

@FooBar({
  declarations: [InlineModuleComponent]
})
export class InlineModuleComponentModule {}
    `;

    expect(parseFile(ts)).toEqual([]);
  });
});
