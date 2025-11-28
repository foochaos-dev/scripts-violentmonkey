import { PANEL_SELECTOR } from './openPanel';

const base = { my: 'right-top', at: 'right-top' };
const gridStyle = {
  marginTop: 50,
  marginRight: 5,
  gapX: 5,
  gapY: 5,
  width: 365,
  height: 318,
};
const col = [
  -gridStyle.marginRight,
  -(gridStyle.marginRight + gridStyle.width + gridStyle.gapX),
  -(gridStyle.marginRight + (gridStyle.width + gridStyle.gapX) * 2),
  -(gridStyle.marginRight + (gridStyle.width + gridStyle.gapX) * 3),
];
const row = [
  gridStyle.marginTop,
  gridStyle.marginTop + gridStyle.height + gridStyle.gapY,
  gridStyle.marginTop + (gridStyle.height + gridStyle.gapY) * 2,
];
const positions3x3plus1: Function[] = [
  () => ({ ...base, offsetX: col[0], offsetY: row[0] }),
  () => ({ ...base, offsetX: col[0], offsetY: row[1] }),
  () => ({ ...base, offsetX: col[1], offsetY: row[0] }),
  () => ({ ...base, offsetX: col[1], offsetY: row[1] }),
  () => ({ ...base, offsetX: col[2], offsetY: row[0] }),
  () => ({ ...base, offsetX: col[2], offsetY: row[1] }),
  () => ({ ...base, offsetX: col[0], offsetY: row[2] }),
  () => ({ ...base, offsetX: col[1], offsetY: row[2] }),
  () => ({ ...base, offsetX: col[2], offsetY: row[2] }),
  () => ({ ...base, offsetX: col[3], offsetY: 65 }),
];
export function organizePanels(positions = positions3x3plus1) {
  const opened = Array.from(document.querySelectorAll<HTMLDivElement>(PANEL_SELECTOR));
  if (!opened?.length) return;

  const GRID_SIZE = 10;
  const grid = Array(GRID_SIZE).fill(null);

  // Split the opened panels in two groups
  const groups = { prePositioned: [] as HTMLDivElement[], newlyCreated: [] as HTMLDivElement[] };
  for (const panel of opened) {
    const group = panel.dataset.gridIndex ? groups.prePositioned : groups.newlyCreated;
    group.push(panel);
  }

  // Put the pre-positioned panels back on the same index
  for (const panel of groups.prePositioned) {
    if (panel.dataset.gridIndex == null || panel.dataset.gridIndex === '') continue;
    if (grid[+panel.dataset.gridIndex]) {
      groups.newlyCreated.unshift(panel);
    } else {
      grid[+panel.dataset.gridIndex] = panel;
    }
  }

  for (const panel of groups.newlyCreated) {
    const nextAvailableSlot = grid.indexOf(null);
    if (nextAvailableSlot > -1) {
      grid[nextAvailableSlot] = panel;
      panel.dataset.gridIndex = nextAvailableSlot.toString();
    }
  }

  grid
    .map(panel => panel ? jsPanel.activePanels.getPanel(panel.id) : null)
    .forEach((panel, idx, grid) => {
      if (!panel) return;

      const positionFn = positions[idx];
      if (!positionFn) return;

      panel.resize({ width: gridStyle.width, height: gridStyle.height }).reposition(positionFn(grid));
    });

}
