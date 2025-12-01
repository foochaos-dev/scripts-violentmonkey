import { queryPanels } from './openPanel';

const base = { my: 'right-top', at: 'right-top' };

const MARGIN_TOP = 30;
const MARGIN_RIGHT = 5;
const GAP_X = 4;
const GAP_Y = 4;
const WIDTH = 365;
const HEIGHT = 318;

// prettier-ignore
const col = [
  -MARGIN_RIGHT,
  -(MARGIN_RIGHT + WIDTH + GAP_X),
  -(MARGIN_RIGHT + (WIDTH + GAP_X) * 2),
  -(MARGIN_RIGHT + (WIDTH + GAP_X) * 3)
];

// prettier-ignore
const row = [
  MARGIN_TOP,
  MARGIN_TOP + HEIGHT + GAP_Y,
  MARGIN_TOP + (HEIGHT + GAP_Y) * 2
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
  const opened = queryPanels();
  if (!opened.length) return;

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

  // Put the 10th user in a better position, if possible
  if (grid[9]) {
    const nextAvailableSlot = grid.indexOf(null);
    if (nextAvailableSlot > -1) {
      grid[9].dataset.gridIndex = nextAvailableSlot.toString();
      grid[nextAvailableSlot] = grid[9];
      grid[9] = null;
    }
  }

  // Position the new panels
  for (const panel of groups.newlyCreated) {
    const nextAvailableSlot = grid.indexOf(null);
    if (nextAvailableSlot > -1) {
      grid[nextAvailableSlot] = panel;
      panel.dataset.gridIndex = nextAvailableSlot.toString();
    }
  }

  grid
    .map((panel) => (panel ? jsPanel.activePanels.getPanel(panel.id) : null))
    .forEach((panel, idx, grid) => {
      if (!panel) return;

      const positionFn = positions[idx];
      if (!positionFn) return;

      panel.resize({ width: WIDTH, height: HEIGHT }).reposition(positionFn(grid));
    });
}
