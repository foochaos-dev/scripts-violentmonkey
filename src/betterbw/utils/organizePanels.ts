import { queryPanels } from './openPanel';

const base = { my: 'right-top', at: 'right-top' };

export const panelRatio = 314 / 365;

export const gridconf = {
  MARGIN_TOP: 30,
  MARGIN_RIGHT: 5,
  GAP_X: 4,
  GAP_Y: 4,
  WIDTH: GM_getValue('config.webcamWidth', 365),
  HEIGHT: GM_getValue('config.webcamWidth', 365) * panelRatio,
};

const col = (n: number) => -(gridconf.MARGIN_RIGHT + n * (gridconf.WIDTH + gridconf.GAP_X));
const row = (n: number) => gridconf.MARGIN_TOP + n * (gridconf.HEIGHT + gridconf.GAP_Y);
const gridPlace = (c: number, r: number, offset: number = 0) => ({ ...base, offsetX: col(c), offsetY: row(r) + offset });

const offset = 65 - gridconf.MARGIN_TOP;

function* positions3x3plus1() {
  for (let c = 0; c < 3; c++) for (let r = 0; r < 2; r++) yield gridPlace(c, r);

  for (let c = 0; c < 3; c++) yield gridPlace(c, 2);

  let c = 3;
  do {
    for (let r = 0; r < 3; r++) yield gridPlace(c, r, offset);
  } while (c++);
}

export function organizePanels(getPositions = positions3x3plus1()) {
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
  for (const place of grid) {
    const position = getPositions.next().value;
    if (!place || !position) continue;

    const panel = jsPanel.activePanels.getPanel(place.id);
    if (panel) panel.resize({ width: gridconf.WIDTH, height: gridconf.HEIGHT }).reposition(position);
  }
}
