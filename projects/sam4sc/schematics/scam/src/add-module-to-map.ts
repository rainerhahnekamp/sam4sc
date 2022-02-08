import { normalize } from '@angular-devkit/core';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  ArrayLiteralExpression,
  ImportDeclaration,
  PropertyAssignment,
  StringLiteral,
  SyntaxKind
} from 'typescript';
import { PartialModuleMap } from './model';

function findComponentPath(
  componentName: string,
  imports: { names: string[]; path: string }[],
  modulePath: string,
  moduleContents: string,
  moduleName: string
): string {
  const componentImport = imports.find((imp) => imp.names.includes(componentName));
  if (componentImport !== undefined) {
    return `${componentImport.path}.ts`;
  }

  const isComponentInModuleFile =
    tsquery(moduleContents, `ClassDeclaration > Identifier[name=${componentName}]`).length > 0;
  if (isComponentInModuleFile) {
    return normalize(modulePath);
  }

  throw new Error(`Cannot find ${componentName} declared in NgModule ${moduleName}`);
}

export function addModuleToMap(
  name: string,
  partialModuleMap: PartialModuleMap,
  filePath: string,
  contents: string,
  moduleContents: string
): void {
  const imports: { names: string[]; path: string }[] = (
    tsquery(contents, 'ImportDeclaration') as ImportDeclaration[]
  ).map((declaration) => {
    const stringLiterals = tsquery(declaration, 'StringLiteral') as StringLiteral[];
    let [path] = stringLiterals.map((sl: StringLiteral) => sl.text);
    if (path.startsWith('.')) {
      path = normalize(filePath + '/../' + path);
    }

    const names = tsquery(declaration, 'Identifier').map((identifier) => identifier.getText());

    return { path, names };
  });

  const props: PropertyAssignment[] = tsquery(
    moduleContents,
    'Decorator > CallExpression > ObjectLiteralExpression > PropertyAssignment > Identifier[name=declarations]'
  );
  const [declarations] = props;
  const arrayLiterals = declarations.parent
    .getChildren()
    .find((child) => child.kind === SyntaxKind.ArrayLiteralExpression) as ArrayLiteralExpression;
  const directiveNames = arrayLiterals.elements.map((component) => component.getText());

  const directives = directiveNames.map((directiveName) => ({
    name: directiveName,
    path: findComponentPath(directiveName, imports, filePath, contents, name)
  }));
  partialModuleMap.set(name, { path: filePath, directives });
}
