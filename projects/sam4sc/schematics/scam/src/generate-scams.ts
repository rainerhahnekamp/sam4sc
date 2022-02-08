import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, mergeWith, move, Rule, url } from '@angular-devkit/schematics';
import { kebabFormat } from './kebab-format';
import { NgType } from './model';

export function generateSCAMs(name: string, ngType: NgType, filePath: string): Rule {
  const prettyName = name
    .replace(/Component$/, '')
    .replace(/Directive$/, '')
    .replace(/Pipe$/, '');

  const filePathParts = filePath.split('/');

  const variables = {
    filename: kebabFormat(prettyName) + '.' + ngType.toLowerCase(),
    directive: name,
    directiveFilename: filePathParts[filePathParts.length - 1].replace(/\.ts$/, '')
  };

  return mergeWith(
    apply(url('./files'), [applyTemplates(variables), move(normalize(filePath + '/..'))])
  );
}
