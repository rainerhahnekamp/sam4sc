import { ReportItem } from '../model';
import { parseReportItem } from './parse-report-item';
import { toReport } from './to-report';

describe('toReport', () => {
  it('should create the report', () => {
    const reportItems: ReportItem[] = [
      { type: 'MCAM', path: 'module1' },
      { type: 'SCAM', path: 'module2' },
      { type: 'MCAM', path: 'module3' },
      { type: 'MCAM', path: 'app.module' }
    ];

    expect(toReport(reportItems)).toEqual({
      mcams: [
        { type: 'MCAM', path: 'app.module' },
        { type: 'MCAM', path: 'module1' },
        { type: 'MCAM', path: 'module3' }
      ],
      scams: [{ type: 'SCAM', path: 'module2' }]
    });
  });
});
