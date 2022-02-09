import { Report } from '../model';
import { printReport } from './print-report';

describe('print report', () => {
  const params: { name: string; report: Report; output: string[] }[] = [
    {
      name: 'default report',
      report: {
        mcams: [
          { type: 'MCAM', path: 'app1.ts' },
          { type: 'MCAM', path: 'app2.ts' }
        ],
        scams: [{ type: 'SCAM', path: 'module.ts' }]
      },
      output: [
        'Please fix following modules:',
        '=====================================================',
        'Migrated (check if they are required or delete them):',
        '- app1.ts',
        '- app2.ts',
        '-----------------------------------------------------',
        'SCAM (set imports & providers)',
        '- module.ts',
        ''
      ]
    },
    {
      name: 'only mcams',
      report: {
        mcams: [
          { type: 'MCAM', path: 'app1.ts' },
          { type: 'MCAM', path: 'module.ts' }
        ],
        scams: []
      },
      output: [
        'Please fix following modules:',
        '=====================================================',
        'Migrated (check if they are required or delete them):',
        '- app1.ts',
        '- module.ts',
        ''
      ]
    },
    {
      name: 'only scams',
      report: {
        mcams: [],
        scams: [
          { type: 'SCAM', path: 'module1.ts' },
          { type: 'SCAM', path: 'module2.ts' }
        ]
      },
      output: [
        'Please fix following modules:',
        '=====================================================',
        'SCAM (set imports & providers)',
        '- module1.ts',
        '- module2.ts',
        ''
      ]
    },
    {
      name: 'empty',
      report: {
        mcams: [],
        scams: []
      },
      output: ['Looks like there is nothing left to do. 👍', '']
    }
  ];

  for (let { name, report, output } of params) {
    test(name, () => {
      const printer = jest.fn<void, [string]>();
      printReport(report, printer);
      const lines = printer.mock.calls.map(([line]) => line);
      expect(lines).toEqual(output);
    });
  }
});
