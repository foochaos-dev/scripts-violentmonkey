import { clamp } from './math';
import { queryPanels } from './openPanel';
import { getSetting } from '../features/settings';

export type LayoutName = 'classic' | 'adaptable';

export const LAYOUT_LABELS: Record<LayoutName, string> = {
  classic: 'Classic grid (3 rows)',
  adaptable: 'Adaptable grid (N rows)',
};

const base = { my: 'right-top', at: 'right-top' };

// The panel is a fixed-height header over a body the video fills; only the body scales with the width
const HEADER_HEIGHT = 22;
const BODY_RATIO = (314 - HEADER_HEIGHT) / 365;
export const panelHeight = (width: number) => width * BODY_RATIO + HEADER_HEIGHT;
const panelWidth = (height: number) => (height - HEADER_HEIGHT) / BODY_RATIO;

export const gridconf = {
  MARGIN_TOP: 30,
  MARGIN_RIGHT: 5,
  GAP_X: 4,
  GAP_Y: 4,
  // The adaptable grid's max size; stored as the input's string value
  WIDTH: +GM_getValue('config.webcamWidth', 365),
  HEIGHT: panelHeight(+GM_getValue('config.webcamWidth', 365)),
};

const MIN_WIDTH = 120;
const BASE_COLS = 3; // The chat's default width leaves room for this many columns of the configured size
const CLASSIC_ROWS = 3;
export const MAX_ROWS = 8;

type Layout = { width: number; height: number; cols: number; rows: number };

/** Fixed size: 3 columns by 3 rows beside the chat, then extra columns over it */
function classicLayout(): Layout {
  const width = getSetting('classicWidth');
  return { width, height: panelHeight(width), cols: BASE_COLS, rows: CLASSIC_ROWS };
}

/** The chosen number of rows fills the window's height (up to the max size), with as many columns as fit beside the chat */
function adaptableLayout(): Layout {
  const chatRight = document.getElementById('tabsAndFooter')?.getBoundingClientRect().right ?? 0;
  const areaWidth = innerWidth - chatRight - gridconf.MARGIN_RIGHT;
  const areaHeight = innerHeight - gridconf.MARGIN_TOP;
  const rows = clamp(1, getSetting('adaptableRows'), MAX_ROWS);
  const fitHeight = (areaHeight - (rows - 1) * gridconf.GAP_Y) / rows;
  const width = Math.floor(Math.max(MIN_WIDTH, Math.min(gridconf.WIDTH, areaWidth, panelWidth(fitHeight))));
  const cols = Math.max(1, Math.floor((areaWidth + gridconf.GAP_X) / (width + gridconf.GAP_X)));
  return { width, height: panelHeight(width), cols, rows };
}

export const computeLayout = (): Layout => (getSetting('layout') === 'classic' ? classicLayout() : adaptableLayout());

/** The chat's default width; from the configured size, not the computed one, which itself depends on the chat's width */
function camsWidth() {
  const width = getSetting('layout') === 'classic' ? getSetting('classicWidth') : gridconf.WIDTH;
  return BASE_COLS * (width + gridconf.GAP_X) - gridconf.GAP_X + gridconf.MARGIN_RIGHT;
}

/** Fills the grid in bands of 2 rows, column by column; then extra columns to the left, over the chat */
function* gridPositions({ width, height, cols, rows }: Layout) {
  const place = (c: number, r: number) => ({
    ...base,
    offsetX: -(gridconf.MARGIN_RIGHT + c * (width + gridconf.GAP_X)),
    offsetY: gridconf.MARGIN_TOP + r * (height + gridconf.GAP_Y),
  });

  for (let band = 0; band < rows; band += 2) {
    for (let c = 0; c < cols; c++) for (let r = band; r < Math.min(band + 2, rows); r++) yield place(c, r);
  }

  // The extra columns sit over the chat; hovering its tabs moves them out of the way (see camsMoveAway.ts)
  for (let c = cols; ; c++) for (let r = 0; r < rows; r++) yield place(c, r);
}

/** Moves a single panel to a grid slot, leaving the others alone (e.g. while another one is being dragged) */
export function placeInSlot(panel: HTMLDivElement, index: number) {
  const layout = computeLayout();
  const positions = gridPositions(layout);
  for (let i = 0; i < index; i++) positions.next();
  const position = positions.next().value;
  if (position) jsPanel.activePanels.getPanel(panel.id)?.resize({ width: layout.width, height: layout.height }).reposition(position);
}

export function organizePanels() {
  // The chat's default width follows the configured panel size (see #tabsAndFooter in static.css)
  document.documentElement.style.setProperty('--bbw-cams-width', `${camsWidth()}px`);

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

  const newlyPlaced = new Set<HTMLDivElement>();
  for (const panel of groups.newlyCreated) {
    const nextAvailableSlot = grid.indexOf(null);
    if (nextAvailableSlot < 0) grid.push(panel);
    else grid[nextAvailableSlot] = panel;
    newlyPlaced.add(panel);
  }

  // Apply the position to all the panels
  const positions = gridPositions(layout);
  const poppedIn: HTMLDivElement[] = [];
  grid.forEach((place, index) => {
    const position = positions.next().value;
    if (!place || !position) return;

    const isNew = newlyPlaced.has(place);
    // New panels must land directly on their grid slot, without transitioning from jsPanel's own spawn position
    if (isNew) {
      place.style.transition = 'none';
      poppedIn.push(place);
    }

    const panel = jsPanel.activePanels.getPanel(place.id);
    if (panel) panel.resize({ width: layout.width, height: layout.height }).reposition(position);
    if (isNew) place.dataset.gridIndex = index.toString();
  });

  if (poppedIn.length) {
    // Force layout so the browser commits the final position with no transition active, before re-enabling
    // it for subsequent moves; otherwise the position change and the CSS enabling it land in the same style
    // recalculation and still animate.
    void poppedIn[0]!.offsetHeight;
    requestAnimationFrame(() => {
      for (const panel of poppedIn) panel.style.transition = '';
    });
  }
}
