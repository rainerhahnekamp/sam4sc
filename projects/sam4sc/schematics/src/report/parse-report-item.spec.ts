import { ReportItem } from '../model';
import { parseReportItem } from './parse-report-item';

describe('find report data', () => {
  it('should identify the mcam', () => {
    const ts = `
// SAM4SC:MCAM

@NgModule({})
export class SomeModule {
}`;

    const reportItem: ReportItem = { type: 'MCAM', path: 'src/module.ts' };
    expect(parseReportItem(ts, 'src/module.ts')).toEqual(reportItem);
  });

  it('should identify the scam', () => {
    const ts = `
/* SAM4SC:SCAM

@NgModule({})
export class SomeModule {
}`;

    const reportItem: ReportItem = { type: 'SCAM', path: 'src/module.ts' };
    expect(parseReportItem(ts, 'src/module.ts')).toEqual(reportItem);
  });

  it('should ignore code with the same signature', () => {
    const ts = `
type SCAM = string;

function fn(SAM4SC:SCAM) {
  console.log(SAM4SC:SCAM);
}`;

    expect(parseReportItem(ts, '')).toBeUndefined();
  });

  it('should find no tag', () => {
    const ts = `
@Component({})
class Ab {}
}`;
    expect(parseReportItem(ts, '')).toBeUndefined();
  });
});
