export type NgType = 'Module' | 'Component' | 'Directive' | 'Pipe' | 'Other';

export interface TypeInfo {
  name: string;
  ngType: NgType;
  contents: string;
}

export interface Directive {
  path: string;
  name: string;
  type: NgType;
}

export interface PartialDirective {
  path: string;
  name: string;
}

export interface ReportItem {
  type: 'SCAM' | 'MCAM';
  path: string;
}

export interface Report {
  mcams: ReportItem[];
  scams: ReportItem[];
}

export interface ScAction {
  modulePath: string;
  componentPath: string;
  componentContents: string;
  moduleContents?: string;
  deleteModule: boolean;
}

export type DirectiveMap = Map<string, Directive>;
export function createDirectiveMap(): DirectiveMap {
  return new Map<string, Directive>();
}

export type PartialModuleMap = Map<string, { path: string; directives: PartialDirective[] }>;
export function createPartialModuleMap(): PartialModuleMap {
  return new Map<string, { path: string; directives: PartialDirective[] }>();
}

export type ModuleMap = Map<string, { path: string; directives: Directive[] }>;
export function createModuleMap(): ModuleMap {
  return new Map<string, { path: string; directives: Directive[] }>();
}
