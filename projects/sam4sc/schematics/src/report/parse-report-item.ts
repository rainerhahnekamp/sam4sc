import { ReportItem } from '../model';

export function parseReportItem(ts: string, path: string): ReportItem | undefined {
  if (ts.match('\\/\\/\\sSAM4SC:MCAM')) {
    return { type: 'MCAM', path };
  } else if (ts.match('\\*\\sSAM4SC:SCAM')) {
    return { type: 'SCAM', path };
  }

  return undefined;
}
