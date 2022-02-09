import { normalize } from '@angular-devkit/core';

describe('Misc', () => {
  it('should verify normalize', () => {
    expect(normalize('./src/app/../lib/app.component')).toBe('src/lib/app.component');
  });
});
