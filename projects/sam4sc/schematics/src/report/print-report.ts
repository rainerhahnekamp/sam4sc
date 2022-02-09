import { Report } from '../model';

export function printReport(report: Report, print: (msg: string) => void = console.log) {
  print('Please fix following modules:');
  print('=====================================================');

  if (report.mcams.length) {
    print('Migrated (check if they are required or delete them):');
    for (let mcam of report.mcams) {
      print('- ' + mcam.path);
    }
  }

  if (report.scams.length && report.mcams.length) {
    print('-----------------------------------------------------');
  }

  if (report.scams.length) {
    print('SCAM (set imports & providers)');
    for (let scam of report.scams) {
      print('- ' + scam.path);
    }
  }

  print('');
}
