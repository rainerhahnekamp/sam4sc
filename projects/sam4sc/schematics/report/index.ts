import { Rule, Tree } from '@angular-devkit/schematics';
import { forEachTsFile } from '../src/for-each-ts-file';
import { getProjectPath } from '../src/get-project-path';
import { ReportItem } from '../src/model';
import { readFile } from '../src/read-file';
import { parseReportItem } from '../src/report/parse-report-item';
import { printReport } from '../src/report/print-report';
import { toReport } from '../src/report/to-report';
import { Schema as MyServiceSchema } from './schema';

export function report(options: MyServiceSchema): Rule {
  return async (tree: Tree) => {
    const sourceRoot = await getProjectPath(tree, options.project);

    const reportItems: ReportItem[] | undefined = [];
    forEachTsFile(tree, sourceRoot, (filePath) => {
      const reportItem = parseReportItem(readFile(tree, filePath), filePath);
      if (reportItem) {
        reportItems.push(reportItem);
      }
    });

    const report = toReport(reportItems);
    printReport(report);
  };
}
