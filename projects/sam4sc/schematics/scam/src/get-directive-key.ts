import { PartialDirective } from './model';

export function getDirectiveKey({ name, path }: PartialDirective) {
  return `${name}-${path}`;
}
