import { Report } from '../model';

export function printReport(report: Report, print: (msg: string) => void = console.log) {
  if (report.scams.length || report.mcams.length) {
    print('Please fix following modules:');
    print('=====================================================');

    if (report.mcams.length) {
      print('Migrated (legacy) Modules - check if they are still needed or delete them');
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
  } else {
    print('Looks like there is nothing left to do. 👍');
    print('');
  }
}
