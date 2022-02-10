import { tsquery } from '@phenomnomnominal/tsquery';
import { Identifier, ImportDeclaration, PropertyAssignment } from 'typescript';
import { ScAction } from '../src/model';
import { getLineBreakChar, prependToList } from '../src/ts-helper';

export function createScAction(
  modulePath: string,
  moduleContents: string,
  componentPath: string,
  componentContents: string
): ScAction {
  const scAction: ScAction = {
    modulePath,
    componentPath,
    componentContents,
    deleteModule: true
  };

  const decoratorProperty = getDecoratorProperty(componentContents);
  const imports = fetchModuleImports(moduleContents);

  if (imports) {
    scAction.componentContents = prependToList(
      scAction.componentContents,
      imports.getFullText(),
      decoratorProperty
    );

    const importStatements = getImportStatements(moduleContents, getModuleNames(imports)).map(
      (importStatement) => importStatement.getText()
    );
    scAction.componentContents =
      importStatements.join(getLineBreakChar(scAction.componentContents)) +
      scAction.componentContents;
  }

  scAction.componentContents = prependToList(
    scAction.componentContents,
    'standalone: true',
    getDecoratorProperty(scAction.componentContents)
  );

  return scAction;
}

export function fetchModuleImports(contents: string): PropertyAssignment | undefined {
  const propertyAssignments = tsquery(
    contents,
    'Decorator > CallExpression > ObjectLiteralExpression > PropertyAssignment'
  ) as PropertyAssignment[];

  const importAssignment = propertyAssignments.find(
    (pa) => tsquery(pa, 'Identifier[name=imports]').length > 0
  );
  if (!importAssignment) {
    return undefined;
  }

  return importAssignment;
}

export function getImportStatements(contents: string, importTypes: string[]): ImportDeclaration[] {
  const importDeclarations: ImportDeclaration[] = tsquery(contents, 'ImportDeclaration');
  return importDeclarations.filter((importDeclaration) => {
    const stringIdentfiers: Identifier[] = tsquery(importDeclaration, 'ImportClause Identifier');
    const stringLiteralTypes = stringIdentfiers.map((stringLiteral) => stringLiteral.getText());

    return importTypes.find((importType) => stringLiteralTypes.includes(importType));
  });
}

export function getModuleNames(importAssignment: PropertyAssignment): string[] {
  const identifiers: Identifier[] = tsquery(
    importAssignment,
    'ArrayLiteralExpression > Identifier'
  );
  return identifiers.map((identfier) => identfier.getText());
}

export function getDecoratorProperty(componentContents: string) {
  const [decoratorProperty] = tsquery(
    componentContents,
    'Decorator > CallExpression > ObjectLiteralExpression > PropertyAssignment:first-child'
  ) as PropertyAssignment[];

  return decoratorProperty;
}
