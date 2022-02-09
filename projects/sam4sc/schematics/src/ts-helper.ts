export function removeListElement(
  contents: string,
  element: { pos: number; getFullText: () => string }
) {
  const prefix = contents.substring(0, element.pos);
  const suffix = contents.substring(element.pos + element.getFullText().length).replace(/\s*,/, ''); // remove potential trailing comma

  return `${prefix}${suffix}`;
}
