import { tsquery } from '@phenomnomnominal/tsquery';
import { Identifier, PropertyAssignment } from 'typescript';
import { ScAction } from '../src/model';

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
    componentPath,
    'Decorator > CallExpression > ObjectLiteralExpression > PropertyAssignment:last-child'
  ) as PropertyAssignment[];

  return scAction;
}
