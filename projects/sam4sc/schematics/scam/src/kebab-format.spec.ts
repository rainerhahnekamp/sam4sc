import { kebabFormat } from './kebab-format';
import { dasherize } from '@angular-devkit/core/src/utils/strings';

describe('kebab format', () => {
  it('should validate kebabFormat', () => {
    expect(kebabFormat('AComponent')).toBe('a-component');
  });
});
