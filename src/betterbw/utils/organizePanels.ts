import { clamp } from './math';
import { queryPanels } from './openPanel';

const base = { my: 'right-top', at: 'right-top' };

export const panelRatio = 314 / 365;

export const gridconf = {
  MARGIN_TOP: 30,
  MARGIN_RIGHT: 5,
  GAP_X: 4,
  GAP_Y: 4,
  // Stored as the input's string value
  WIDTH: +GM_getValue('config.webcamWidth', 365),
  HEIGHT: +GM_getValue('config.webcamWidth', 365) * panelRatio,
};

const MIN_WIDTH = 120;
const BASE_COLS = 3; // The chat's default width leaves room for this many columns of the configured size
const BASE_CAMS = 9; // Cams beyond this go in extra columns, over the chat

type Layout = { width: number; height: number; cols: number; rows: number };

/**
 * Biggest panels (up to the configured size) that fit the base cams between the chat and the right edge.
 * On ties, prefers fewer empty cells, then a square-ish grid, then more columns.
 */
export function computeLayout(): Layout {
  const chatRight = document.getElementById('tabsAndFooter')?.getBoundingClientRect().right ?? 0;
  const areaWidth = innerWidth - chatRight - gridconf.MARGIN_RIGHT;
  const areaHeight = innerHeight - gridconf.MARGIN_TOP;
  const cams = clamp(1, +chatHTML5.roles.user.webcamMax || 1, BASE_CAMS);

  const candidates = Array.from({ length: cams }, (_, i): Layout => {
    const cols = i + 1;
    const rows = Math.ceil(cams / cols);
    const fitWidth = (areaWidth - (cols - 1) * gridconf.GAP_X) / cols;
    const fitHeight = (areaHeight - (rows - 1) * gridconf.GAP_Y) / rows;
    const width = Math.floor(Math.max(MIN_WIDTH, Math.min(gridconf.WIDTH, fitWidth, fitHeight / panelRatio)));
    return { width, height: width * panelRatio, cols, rows };
  });

  candidates.sort(
    (a, b) =>
      b.width - a.width || a.cols * a.rows - b.cols * b.rows || Math.abs(a.cols - a.rows) - Math.abs(b.cols - b.rows) || b.cols - a.cols
  );
  return candidates[0]!;
}

const overflowOffset = 65 - gridconf.MARGIN_TOP; // Keeps the chat tabs visible

/** Fills the grid in bands of 2 rows, column by column; then extra columns to the left, over the chat */
function* gridPositions({ width, height, cols, rows }: Layout) {
  const place = (c: number, r: number, offset = 0) => ({
    ...base,
    offsetX: -(gridconf.MARGIN_RIGHT + c * (width + gridconf.GAP_X)),
    offsetY: gridconf.MARGIN_TOP + r * (height + gridconf.GAP_Y) + offset,
  });

  for (let band = 0; band < rows; band += 2) {
    for (let c = 0; c < cols; c++) for (let r = band; r < Math.min(band + 2, rows); r++) yield place(c, r);
  }

  for (let c = cols; ; c++) for (let r = 0; r < rows; r++) yield place(c, r, overflowOffset);
}

export function organizePanels() {
  // The chat's default width follows the configured panel size (see #tabsAndFooter in static.css)
  const camsWidth = BASE_COLS * (gridconf.WIDTH + gridconf.GAP_X) - gridconf.GAP_X + gridconf.MARGIN_RIGHT;
  document.documentElement.style.setProperty('--bbw-cams-width', `${camsWidth}px`);

  const opened = queryPanels();
  if (!opened.length) return;

  const layout = computeLayout();
  const baseCells = layout.cols * layout.rows;
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

  // Move the users over the chat to a better position, if possible
  // Go on reverse to reduce the movement
  for (let i = grid.length - 1; i >= baseCells; i--) {
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
  const positions = gridPositions(layout);
  for (const place of grid) {
    const position = positions.next().value;
    if (!place || !position) continue;

    const panel = jsPanel.activePanels.getPanel(place.id);
    if (panel) panel.resize({ width: layout.width, height: layout.height }).reposition(position);
  }
}
