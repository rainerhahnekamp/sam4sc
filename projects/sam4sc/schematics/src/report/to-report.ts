import { Report, ReportItem } from '../model';

const comparer = (rl1: ReportItem, rl2: ReportItem) => {
  return rl1.path > rl2.path ? 1 : -1;
};

export function toReport(reportItems: ReportItem[]): Report {
  const report: Report = {
    mcams: [],
    scams: []
  };

  for (let reportItem of reportItems) {
    if (reportItem.type === 'MCAM') {
      report.mcams.push(reportItem);
    } else {
      report.scams.push(reportItem);
    }
  }

  report.mcams.sort(comparer);
  report.scams.sort(comparer);

  return report;
}
