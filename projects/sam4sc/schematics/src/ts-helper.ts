export interface NodeElement {
  pos: number;
  getFullText: () => string;
}

// https://stackoverflow.com/questions/34820267/detecting-type-of-line-breaks
export function getLineBreakChar(str: string) {
  const indexOfLF = str.indexOf('\n', 1); // No need to check first-character

  if (indexOfLF === -1) {
    if (str.indexOf('\r') !== -1) return '\r';

    return '\n';
  }

  if (str[indexOfLF - 1] === '\r') return '\r\n';

  return '\n';
}

export function removeListElement(contents: string, element: NodeElement): string {
  const prefix = contents.substring(0, element.pos);
  const suffix = contents.substring(element.pos + element.getFullText().length).replace(/\s*,/, ''); // remove potential trailing comma

  return `${prefix}${suffix}`;
}

export function prependToList(contents: string, listItem: string, element: NodeElement): string {
  const prefix = contents.substring(0, element.pos);
  const suffix = contents.substring(element.pos);

  return `${prefix}${getLineBreakChar(contents)}${listItem},${suffix}`;
}
