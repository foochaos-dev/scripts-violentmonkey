import { queryPanels } from './openPanel';

const base = { my: 'right-top', at: 'right-top' };

export const panelRatio = 318 / 365;

export const gridconf = {
  MARGIN_TOP: 30,
  MARGIN_RIGHT: 5,
  GAP_X: 4,
  GAP_Y: 4,
  WIDTH: GM_getValue('config.webcamWidth', 365),
  HEIGHT: (GM_getValue('config.webcamWidth', 365) * 318) / 365,
};

const col = (n: number) => -(gridconf.MARGIN_RIGHT + n * (gridconf.WIDTH + gridconf.GAP_X));
const row = (n: number) => gridconf.MARGIN_TOP + n * (gridconf.HEIGHT + gridconf.GAP_Y);
const gridPlace = (c: number, r: number, offset: number = 0) => ({ ...base, offsetX: col(c), offsetY: row(r) + offset });

const offset = 65 - gridconf.MARGIN_TOP;
const positions3x3plus1 = () => [
  gridPlace(0, 0),
  gridPlace(0, 1),
  gridPlace(1, 0),
  gridPlace(1, 1),
  gridPlace(2, 0),
  gridPlace(2, 1),
  gridPlace(0, 2),
  gridPlace(1, 2),
  gridPlace(2, 2),
  gridPlace(3, 0, offset),
  gridPlace(3, 1, offset),
  gridPlace(3, 2, offset),
  gridPlace(4, 0, offset),
  gridPlace(4, 1, offset),
  gridPlace(4, 2, offset),
];

export function organizePanels(getPositions = positions3x3plus1) {
  const opened = queryPanels();
  if (!opened.length) return;

  let lastIndex = 0;

  // Split the opened panels in two groups
  const groups = { prePositioned: [] as HTMLDivElement[], newlyCreated: [] as HTMLDivElement[] };
  for (const panel of opened) {
    const gridIndex = panel.dataset.gridIndex;
    if (!gridIndex) {
      groups.newlyCreated.push(panel);
    } else {
      groups.prePositioned.push(panel);
      const gridIndexNumber = +gridIndex;
      if (gridIndexNumber > lastIndex) lastIndex = gridIndexNumber;
    }
  }

  const webcamMax = +chatHTML5.roles.user.webcamMax;
  const GRID_SIZE = Math.max(webcamMax, opened.length, lastIndex);
  const grid = Array(GRID_SIZE).fill(null);

  // Place the pre-positioned panels back on the same index
  for (const panel of groups.prePositioned) {
    if (panel.dataset.gridIndex == null || panel.dataset.gridIndex === '') continue;
    if (grid[+panel.dataset.gridIndex]) {
      panel.dataset.gridIndex = '';
      groups.newlyCreated.unshift(panel);
    } else {
      grid[+panel.dataset.gridIndex] = panel;
    }
  }

  // Move the 10th+ users to a better position, if possible
  // Go on reverse to reduce the movement
  for (let i = grid.length - 1; i >= 9; i--) {
    if (!grid[i]) continue;

    const nextAvailableSlot = grid.indexOf(null);
    if (nextAvailableSlot < 0 || nextAvailableSlot >= i) continue;

    grid[i].dataset.gridIndex = nextAvailableSlot.toString();
    grid[nextAvailableSlot] = grid[i];
    grid[i] = null;
  }

  // Place the new panels
  for (const panel of groups.newlyCreated) {
    const nextAvailableSlot = grid.indexOf(null);
    if (nextAvailableSlot < 0) {
      panel.dataset.gridIndex = grid.length.toString();
      grid.push(panel);
    } else {
      panel.dataset.gridIndex = nextAvailableSlot.toString();
      grid[nextAvailableSlot] = panel;
    }
  }

  // Apply the position to all the panels
  const positions = getPositions();
  let idx = -1;
  for (const place of grid) {
    idx++;
    const position = positions[idx];
    if (!place || !position) continue;

    const panel = jsPanel.activePanels.getPanel(place.id);
    if (panel) panel.resize({ width: gridconf.WIDTH, height: gridconf.HEIGHT }).reposition(position);
  }
}
