import { tsquery } from '@phenomnomnominal/tsquery';
import { PropertyAssignment } from 'typescript';
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

  console.log(moduleContents.length);
  console.log(decoratorProperty);

  return scAction;
}
