import { SchematicsException } from '@angular-devkit/schematics';
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

  const [decoratorProperty] = tsquery(
    componentContents,
    'Decorator > CallExpression > ObjectLiteralExpression > PropertyAssignment:first-child'
  ) as PropertyAssignment[];

  const imports = fetchModuleImports(moduleContents, modulePath);

  scAction.componentContents = prependToList(
    scAction.componentContents,
    imports.getFullText(),
    decoratorProperty
  );

  scAction.componentContents = prependToList(
    scAction.componentContents,
    'standalone: true',
    decoratorProperty
  );

  const importStatements = getImportStatements(
    moduleContents,
    getModuleNames(fetchModuleImports(moduleContents, modulePath))
  ).map((importStatement) => importStatement.getText());
  scAction.componentContents =
    importStatements.join(getLineBreakChar(scAction.componentContents)) +
    scAction.componentContents;

  return scAction;
}

export function fetchModuleImports(contents: string, modulePath: string): PropertyAssignment {
  const propertyAssignments = tsquery(
    contents,
    'Decorator > CallExpression > ObjectLiteralExpression > PropertyAssignment'
  ) as PropertyAssignment[];

  const importAssignment = propertyAssignments.find(
    (pa) => tsquery(pa, 'Identifier[name=imports]').length > 0
  );
  if (!importAssignment) {
    throw new SchematicsException(`cannot find imports declaration in module ${modulePath}`);
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
