export function getUsername(panel: HTMLDivElement) {
  const title = panel.querySelector<HTMLHeadingElement>('.jsPanel-title')!;
  const username = Array.from(title.childNodes)
    .find((e) => e.nodeType === Node.TEXT_NODE && e.nodeValue?.trim())
    ?.nodeValue?.trim();
  const name = username?.split('_')[0];

  if (!name) console.error(`Couldn't find username on ${title.textContent}`);
  return name || 'FAIL';
}
