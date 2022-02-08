import { tsquery } from '@phenomnomnominal/tsquery';
import { ClassDeclaration, Identifier } from 'typescript';
import { TypeInfo } from './model';

export function parseFile(contents: string): TypeInfo[] {
  const classesSource = tsquery(contents, 'ClassDeclaration') as ClassDeclaration[];
  return classesSource
    .map((classSource: ClassDeclaration): TypeInfo | undefined => {
      if (classSource.name === undefined) {
        return undefined;
      }

      const name = classSource.name.getText();
      const returner: TypeInfo = { name, ngType: 'Other', contents: classSource.getText() };
      const identifiers: Identifier[] = tsquery(
        classSource,
        'Decorator > CallExpression > Identifier'
      );

      if (identifiers.length === 0) {
        return undefined;
      }

      const [identifier] = identifiers;
      switch (identifier.getText()) {
        case 'NgModule':
          returner.ngType = 'Module';
          break;
        case 'Component':
          returner.ngType = 'Component';
          break;
        case 'Directive':
          returner.ngType = 'Directive';
          break;
        case 'Pipe':
          returner.ngType = 'Pipe';
          break;
        default:
          return undefined;
      }
      return returner;
    })
    .filter((entry): entry is TypeInfo => entry !== undefined);
}
