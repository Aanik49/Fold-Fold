import {
  carbonToNormalSymbol,
  getTopSymbol,
  hasTrappedSymbol,
  isCellInMovingFlap,
  isCreasePerforated,
} from './engine';
import { getActivePalette, RisoPalette } from './themes';
import {
  BlockReason,
  BoardState,
  CellState,
  FoldAction,
  FoldDir,
  FoldOrientation,
  LockKeySymbol,
  SymbolType,
} from './types';

export interface RisoPatterns {
  halftoneDark: CanvasPattern | null;
  halftoneBlue: CanvasPattern | null;
  halftoneRed: CanvasPattern | null;
  halftoneTeal: CanvasPattern | null;
  newsprintGrain: CanvasPattern | null;
}

export interface InkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
  life: number;
  maxLife: number;
  color: string;
}

export interface FlapCellSnapshot {
  r: number;
  c: number;
  topSym: SymbolType | null;
  depth: number;
  pinned: boolean;
}

export interface ActiveFoldAnim {
  orientation: FoldOrientation;
  index: number;
  dir: FoldDir;
  progress: number;
  duration: number;
  flapSnapshot: FlapCellSnapshot[];
  undersideColor: string;
  isTear?: boolean;
}

export interface HoverCreaseState {
  orientation: FoldOrientation;
  index: number;
  dir: FoldDir;
  blockReason: BlockReason;
  peelAmount: number; // 0..1 progressive swipe peel feedback
}

export interface BoardLayout {
  tileSize: number;
  boardW: number;
  boardH: number;
  boardX: number;
  boardY: number;
}

function createHalftoneTile(dotColor: string, spacing = 5, radius = 1.35): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = spacing * 2;
  c.height = spacing * 2;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(spacing * 0.5, spacing * 0.5, radius, 0, Math.PI * 2);
  ctx.arc(spacing * 1.5, spacing * 1.5, radius, 0, Math.PI * 2);
  ctx.fill();
  return c;
}

function createGrainTile(palette: RisoPalette): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 140;
  c.height = 140;
  const ctx = c.getContext('2d')!;
  for (let i = 0; i < 650; i++) {
    const x = Math.random() * 140;
    const y = Math.random() * 140;
    ctx.fillStyle = i % 2 === 0 ? palette.grainDark : palette.grainLight;
    ctx.fillRect(x, y, 1.3, 1.3);
  }
  return c;
}

export function createRisoPatterns(
  ctx: CanvasRenderingContext2D,
  palette: RisoPalette = getActivePalette()
): RisoPatterns {
  return {
    halftoneDark: ctx.createPattern(createHalftoneTile(palette.halftoneDark, 5, 1.35), 'repeat'),
    halftoneBlue: ctx.createPattern(createHalftoneTile(palette.halftoneBlue, 5, 1.35), 'repeat'),
    halftoneRed: ctx.createPattern(createHalftoneTile(palette.halftoneRed, 5, 1.35), 'repeat'),
    halftoneTeal: ctx.createPattern(createHalftoneTile(palette.halftoneTeal, 5, 1.35), 'repeat'),
    newsprintGrain: ctx.createPattern(createGrainTile(palette), 'repeat'),
  };
}

export function computeBoardLayout(
  width: number,
  height: number,
  rows: number,
  cols: number
): BoardLayout {
  const isCompact = width < 640;
  const topMargin = isCompact ? 114 : 96;
  const bottomMargin = isCompact ? 116 : 122;
  const sideMargin = isCompact ? 20 : 40;

  const availW = Math.max(220, width - sideMargin * 2);
  const availH = Math.max(190, height - topMargin - bottomMargin);

  const maxTile = 132;
  const tileW = Math.min(maxTile, Math.floor(availW / Math.max(1, cols)));
  const tileH = Math.min(maxTile, Math.floor(availH / Math.max(1, rows)));
  const tileSize = Math.max(52, Math.min(tileW, tileH));

  const boardW = cols * tileSize;
  const boardH = rows * tileSize;
  const boardX = Math.floor((width - boardW) * 0.5);
  const boardY = Math.floor(topMargin + (availH - boardH) * 0.5);

  return { tileSize, boardW, boardH, boardX, boardY };
}

/**
 * Draw authentic Bauhaus Risograph geometric symbols with 1.5px overprint misregistration
 */
export function drawRisoSymbol(
  ctx: CanvasRenderingContext2D,
  sym: SymbolType,
  cx: number,
  cy: number,
  r: number,
  palette: RisoPalette = getActivePalette()
) {
  ctx.save();
  switch (sym) {
    case 'circle': {
      // Misregistration ghost
      ctx.save();
      ctx.globalAlpha = 0.46;
      ctx.strokeStyle = palette.yellow;
      ctx.lineWidth = Math.max(4, r * 0.26);
      ctx.beginPath();
      ctx.arc(cx + 1.6, cy + 1.4, r * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Primary bold ring
      ctx.strokeStyle = palette.red;
      ctx.lineWidth = Math.max(4.5, r * 0.28);
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'cross': {
      const arm = r * 0.56;
      const lw = Math.max(4.5, r * 0.28);
      ctx.lineCap = 'butt';

      // Red misregistration offset
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = palette.red;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(cx - arm + 1.5, cy - arm + 1.5);
      ctx.lineTo(cx + arm + 1.5, cy + arm + 1.5);
      ctx.moveTo(cx + arm + 1.5, cy - arm + 1.5);
      ctx.lineTo(cx - arm + 1.5, cy + arm + 1.5);
      ctx.stroke();
      ctx.restore();

      // Primary Cross
      ctx.strokeStyle = palette.blue;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(cx - arm, cy - arm);
      ctx.lineTo(cx + arm, cy + arm);
      ctx.moveTo(cx + arm, cy - arm);
      ctx.lineTo(cx - arm, cy + arm);
      ctx.stroke();
      break;
    }

    case 'triangle': {
      const h = r * 0.66;
      // Offset ink ghost
      ctx.fillStyle = palette.isDark ? 'rgba(0, 0, 0, 0.38)' : 'rgba(20, 20, 20, 0.22)';
      ctx.beginPath();
      ctx.moveTo(cx + 2, cy - h + 2);
      ctx.lineTo(cx + h + 2, cy + h * 0.82 + 2);
      ctx.lineTo(cx - h + 2, cy + h * 0.82 + 2);
      ctx.closePath();
      ctx.fill();

      // Mustard / Gold triangle with crisp outline
      ctx.fillStyle = palette.yellow;
      ctx.strokeStyle = palette.isDark ? palette.newsprintDark : palette.ink;
      ctx.lineWidth = Math.max(1.8, r * 0.06);
      ctx.beginPath();
      ctx.moveTo(cx, cy - h);
      ctx.lineTo(cx + h, cy + h * 0.82);
      ctx.lineTo(cx - h, cy + h * 0.82);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'square': {
      const half = r * 0.54;
      // Red offset underprint
      ctx.fillStyle = palette.red;
      ctx.fillRect(cx - half + 2.4, cy - half + 2.4, half * 2, half * 2);

      // Ink square
      ctx.fillStyle = palette.ink;
      ctx.fillRect(cx - half, cy - half, half * 2, half * 2);
      break;
    }

    case 'wild': {
      // Bauhaus 4-Tone Diamond Prism (matches any ink)
      const d = r * 0.76;
      ctx.fillStyle = palette.red;
      ctx.beginPath();
      ctx.moveTo(cx, cy - d);
      ctx.lineTo(cx + d * 0.5, cy - d * 0.5);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx - d * 0.5, cy - d * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = palette.blue;
      ctx.beginPath();
      ctx.moveTo(cx + d, cy);
      ctx.lineTo(cx + d * 0.5, cy + d * 0.5);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + d * 0.5, cy - d * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = palette.yellow;
      ctx.beginPath();
      ctx.moveTo(cx, cy + d);
      ctx.lineTo(cx - d * 0.5, cy + d * 0.5);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + d * 0.5, cy + d * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = palette.teal;
      ctx.beginPath();
      ctx.moveTo(cx - d, cy);
      ctx.lineTo(cx - d * 0.5, cy - d * 0.5);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx - d * 0.5, cy + d * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = Math.max(2.2, r * 0.08);
      ctx.beginPath();
      ctx.moveTo(cx, cy - d);
      ctx.lineTo(cx + d, cy);
      ctx.lineTo(cx, cy + d);
      ctx.lineTo(cx - d, cy);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = palette.paperWhite;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'duplex_rb':
    case 'duplex_br': {
      const isRedFront = sym === 'duplex_rb';
      const frontColor = isRedFront ? palette.red : palette.blue;
      const backColor = isRedFront ? palette.blue : palette.red;
      const badgeGlyphColor = isRedFront
        ? palette.badgeTextOnBlue
        : palette.badgeTextOnRed;

      // Subtle dashed flip halo indicating reversible ink
      ctx.strokeStyle = backColor;
      ctx.lineWidth = Math.max(1.8, r * 0.07);
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.86, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw active front symbol slightly inset
      if (isRedFront) {
        ctx.strokeStyle = frontColor;
        ctx.lineWidth = Math.max(4, r * 0.25);
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.54, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        const arm = r * 0.48;
        ctx.strokeStyle = frontColor;
        ctx.lineWidth = Math.max(4, r * 0.25);
        ctx.lineCap = 'butt';
        ctx.beginPath();
        ctx.moveTo(cx - arm, cy - arm);
        ctx.lineTo(cx + arm, cy + arm);
        ctx.moveTo(cx + arm, cy - arm);
        ctx.lineTo(cx - arm, cy + arm);
        ctx.stroke();
      }

      // Small reverse-color badge in top-right showing what it flips into
      const bx = cx + r * 0.62;
      const by = cy - r * 0.62;
      const br = Math.max(6.5, r * 0.28);
      ctx.fillStyle = backColor;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.strokeStyle = badgeGlyphColor;
      ctx.lineWidth = 1.7;
      if (isRedFront) {
        const a = br * 0.42;
        ctx.beginPath();
        ctx.moveTo(bx - a, by - a);
        ctx.lineTo(bx + a, by + a);
        ctx.moveTo(bx + a, by - a);
        ctx.lineTo(bx - a, by + a);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(bx, by, br * 0.42, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }

    case 'carbon_circle':
    case 'carbon_cross':
    case 'carbon_triangle':
    case 'carbon_square': {
      const normalSym = carbonToNormalSymbol(sym);
      const box = r * 0.88;

      // Subtle archival carbon sheet backing frame
      ctx.save();
      ctx.globalAlpha = palette.isDark ? 0.14 : 0.08;
      ctx.fillStyle = palette.ink;
      ctx.fillRect(cx - box, cy - box, box * 2, box * 2);
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(cx - box, cy - box, box * 2, box * 2);
      ctx.setLineDash([]);
      ctx.restore();

      // Offset carbon ghost copy underneath
      ctx.save();
      ctx.globalAlpha = 0.28;
      drawRisoSymbol(ctx, normalSym, cx + r * 0.15, cy + r * 0.15, r * 0.8, palette);
      ctx.restore();

      // Primary sharp ink stamp
      drawRisoSymbol(ctx, normalSym, cx - r * 0.07, cy - r * 0.07, r * 0.82, palette);

      // Crisp 2× Carbon Duplicator stamp badge in top-right corner
      const bx = cx + r * 0.64;
      const by = cy - r * 0.64;
      const bw = Math.max(17, r * 0.64);
      const bh = Math.max(12, r * 0.44);
      ctx.fillStyle = palette.ink;
      ctx.fillRect(bx - bw * 0.5, by - bh * 0.5, bw, bh);
      ctx.strokeStyle = palette.paperWhite;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(bx - bw * 0.5, by - bh * 0.5, bw, bh);

      ctx.fillStyle = palette.paperWhite;
      ctx.font = `800 ${Math.max(8, Math.round(r * 0.28))}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('2×', bx, by + 0.5);
      break;
    }
  }
  ctx.restore();
}

export function drawPaperTile(
  ctx: CanvasRenderingContext2D,
  patterns: RisoPatterns,
  x: number,
  y: number,
  size: number,
  cell: CellState,
  depth: number,
  isLifted: boolean,
  undersideColor: string | null,
  palette: RisoPalette = getActivePalette()
) {
  const pad = 4;
  const tx = x + pad;
  const ty = y + pad;
  const tw = size - pad * 2;
  const th = size - pad * 2;

  ctx.save();

  // 1. Offset Halftone Dot Drop Shadow
  const shadowShift = isLifted ? 11 : Math.min(9, 4 + (depth - 1) * 1.6);
  ctx.fillStyle = patterns.halftoneDark || palette.halftoneDark;
  ctx.fillRect(tx + shadowShift, ty + shadowShift, tw, th);

  // 2. Stacked Lower Paper Plies
  const plies = Math.min(4, depth);
  for (let p = plies - 1; p >= 1; p--) {
    ctx.fillStyle = p % 2 === 0 ? palette.blue : palette.red;
    ctx.fillRect(tx + p * 1.5, ty + p * 2.2, tw, th);
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(tx + p * 1.5, ty + p * 2.2, tw, th);
  }

  // 3. Main Cardstock Face or Colored Underside
  ctx.fillStyle = undersideColor || palette.paperWhite;
  ctx.fillRect(tx, ty, tw, th);

  ctx.lineWidth = 2.2;
  ctx.strokeStyle = palette.ink;
  ctx.strokeRect(tx, ty, tw, th);

  if (!undersideColor) {
    // 4. Brass Eyelet Pin (if tile is anchored to table)
    if (cell.pinned) {
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = palette.yellow;
      ctx.fillRect(tx + 2, ty + 2, tw - 4, th - 4);
      ctx.restore();

      const px = tx + 13;
      const py = ty + 13;
      ctx.beginPath();
      ctx.arc(px, py, 7.5, 0, Math.PI * 2);
      ctx.fillStyle = palette.yellow;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = palette.ink;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(px, py, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = palette.isDark ? palette.newsprintDark : palette.ink;
      ctx.fill();
    }

    // 5. Geometric Symbol
    const topSym = getTopSymbol(cell);
    if (topSym) {
      drawRisoSymbol(ctx, topSym, x + size * 0.5, y + size * 0.5, size * 0.35, palette);
    }

    // 6. Trapped Underprint Dog-Ear Pip
    if (hasTrappedSymbol(cell)) {
      ctx.beginPath();
      ctx.moveTo(tx + tw - 16, ty + th);
      ctx.lineTo(tx + tw, ty + th - 16);
      ctx.lineTo(tx + tw, ty + th);
      ctx.closePath();
      ctx.fillStyle = palette.red;
      ctx.fill();
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 7. Ply Depth Stamp
    if (depth >= 2) {
      ctx.font = '800 9px "JetBrains Mono", monospace';
      ctx.fillStyle = palette.ink;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(`${depth}P`, tx + 5, ty + th - 5);
    }
  }

  ctx.restore();
}

export function drawHazardTapeStrip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  allowDir: FoldDir,
  isVertical: boolean,
  palette: RisoPalette = getActivePalette()
) {
  ctx.save();

  const chevronInk = palette.isDark ? palette.newsprintDark : palette.ink;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fillRect(x + 3, y + 3, w, h);

  ctx.fillStyle = palette.yellow;
  ctx.fillRect(x, y, w, h);

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  ctx.fillStyle = chevronInk;
  const step = 16;
  if (!isVertical) {
    const dirSign = allowDir === 'down' ? 1 : -1;
    for (let sx = x - 16; sx < x + w + 16; sx += step) {
      ctx.beginPath();
      ctx.moveTo(sx, y + (dirSign > 0 ? 2 : h - 2));
      ctx.lineTo(sx + 8, y + h * 0.5 + dirSign * 6);
      ctx.lineTo(sx + 16, y + (dirSign > 0 ? 2 : h - 2));
      ctx.lineTo(sx + 16, y + (dirSign > 0 ? 8 : h - 8));
      ctx.lineTo(sx + 8, y + h * 0.5 + dirSign * 12);
      ctx.lineTo(sx, y + (dirSign > 0 ? 8 : h - 8));
      ctx.closePath();
      ctx.fill();
    }
  } else {
    const dirSign = allowDir === 'right' ? 1 : -1;
    for (let sy = y - 16; sy < y + h + 16; sy += step) {
      ctx.beginPath();
      ctx.moveTo(x + (dirSign > 0 ? 2 : w - 2), sy);
      ctx.lineTo(x + w * 0.5 + dirSign * 6, sy + 8);
      ctx.lineTo(x + (dirSign > 0 ? 2 : w - 2), sy + 16);
      ctx.lineTo(x + (dirSign > 0 ? 8 : w - 8), sy + 16);
      ctx.lineTo(x + w * 0.5 + dirSign * 12, sy + 8);
      ctx.lineTo(x + (dirSign > 0 ? 8 : w - 8), sy);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();

  ctx.lineWidth = 2;
  ctx.strokeStyle = palette.ink;
  ctx.strokeRect(x, y, w, h);

  // Center Directional Badge
  const cx = x + w * 0.5;
  const cy = y + h * 0.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fillStyle = palette.paperWhite;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = palette.ink;
  ctx.stroke();

  ctx.fillStyle = palette.ink;
  ctx.font = '900 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const arrowMap: Record<FoldDir, string> = {
    right: '→',
    left: '←',
    down: '↓',
    up: '↑',
  };
  ctx.fillText(arrowMap[allowDir], cx, cy + 0.5);

  ctx.restore();
}

export function drawPerforatedCrease(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  isVertical: boolean,
  palette: RisoPalette = getActivePalette()
) {
  ctx.save();

  // Backing paper-slit highlight so perforation teeth pop on every theme
  ctx.strokeStyle = palette.paperWhite;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Bold red dashed perforation tear line
  ctx.strokeStyle = palette.red;
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Pinhole perforation dots between slits
  const len = isVertical ? y2 - y1 : x2 - x1;
  ctx.fillStyle = palette.ink;
  for (let d = 8; d < len - 6; d += 11) {
    const px = isVertical ? x1 : x1 + d;
    const py = isVertical ? y1 + d : y1;
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Center circular Scissor Notch Stamp
  const cx = (x1 + x2) * 0.5;
  const cy = (y1 + y2) * 0.5;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
  ctx.beginPath();
  ctx.arc(cx + 2, cy + 2, 13, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, 13, 0, Math.PI * 2);
  ctx.fillStyle = palette.paperWhite;
  ctx.fill();
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = palette.red;
  ctx.stroke();

  // Crisp scissor glyph
  ctx.fillStyle = palette.red;
  ctx.font = '800 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✂', cx, cy + 0.5);

  ctx.restore();
}

export function drawLockedCrease(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  keySymbol: LockKeySymbol,
  _isVertical: boolean,
  palette: RisoPalette = getActivePalette()
) {
  ctx.save();

  // Solid archival lock rail along crease
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Inner dashed metallic rail
  ctx.strokeStyle = palette.newsprint;
  ctx.lineWidth = 1.6;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Center Padlock Badge with embedded Key Symbol
  const cx = (x1 + x2) * 0.5;
  const cy = (y1 + y2) * 0.5;

  // Padlock U-Shackle arch above badge
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy - 11, 7.5, Math.PI, 0);
  ctx.stroke();

  // Shadow behind lock plate
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fillRect(cx - 13 + 2.5, cy - 11 + 2.5, 26, 25);

  // Padlock body square
  ctx.fillStyle = palette.paperWhite;
  ctx.fillRect(cx - 13, cy - 11, 26, 25);
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 2.4;
  ctx.strokeRect(cx - 13, cy - 11, 26, 25);

  // Mini Key Symbol inside padlock so player immediately knows what to clear
  drawRisoSymbol(ctx, keySymbol, cx, cy + 1.5, 11.5, palette);

  ctx.restore();
}

export function drawDirectionBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: FoldDir,
  blocked: boolean,
  color: string,
  palette: RisoPalette = getActivePalette()
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, 16, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = palette.ink;
  ctx.stroke();

  ctx.strokeStyle = palette.isDark ? palette.newsprintDark : palette.paperWhite;
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (blocked) {
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 5);
    ctx.lineTo(x + 5, y + 5);
    ctx.moveTo(x + 5, y - 5);
    ctx.lineTo(x - 5, y + 5);
    ctx.stroke();
  } else {
    const rotMap: Record<FoldDir, number> = {
      right: 0,
      down: Math.PI / 2,
      left: Math.PI,
      up: -Math.PI / 2,
    };
    ctx.translate(x, y);
    ctx.rotate(rotMap[dir]);
    ctx.beginPath();
    ctx.moveTo(-5.5, 0);
    ctx.lineTo(5.5, 0);
    ctx.moveTo(1.5, -4.5);
    ctx.lineTo(5.5, 0);
    ctx.lineTo(1.5, 4.5);
    ctx.stroke();
  }
  ctx.restore();
}

export function renderGameplayCanvas(params: {
  ctx: CanvasRenderingContext2D;
  patterns: RisoPatterns;
  palette?: RisoPalette;
  width: number;
  height: number;
  board: BoardState;
  layout: BoardLayout;
  time: number;
  hoverCrease: HoverCreaseState | null;
  activeAnim: ActiveFoldAnim | null;
  hintFold: FoldAction | null;
  blockedShake: { timer: number; x: number; y: number; reason: BlockReason };
  particles: InkParticle[];
  showFirstFoldGuide: boolean;
}) {
  const {
    ctx,
    patterns,
    width,
    height,
    board,
    layout,
    time,
    hoverCrease,
    activeAnim,
    hintFold,
    blockedShake,
    particles,
    showFirstFoldGuide,
  } = params;
  const palette = params.palette ?? getActivePalette();

  const { tileSize: ts, boardX, boardY, boardW, boardH } = layout;

  // 1. Newsprint stock background + grain
  ctx.fillStyle = palette.newsprint;
  ctx.fillRect(0, 0, width, height);
  if (patterns.newsprintGrain) {
    ctx.fillStyle = patterns.newsprintGrain;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.save();

  // Spring-back shake on blocked fold attempt
  if (blockedShake.timer > 0) {
    const shakeX =
      Math.sin(blockedShake.timer * 58) * 7.5 * (blockedShake.timer / 0.34);
    ctx.translate(shakeX, 0);
  }

  // 2. Exhibition crop & registration marks around the sheet
  const regPad = 16;
  const regLen = 10;
  ctx.save();
  ctx.strokeStyle = palette.regMarkInk;
  ctx.lineWidth = 1.5;
  [
    [boardX - regPad, boardY - regPad],
    [boardX + boardW + regPad, boardY - regPad],
    [boardX - regPad, boardY + boardH + regPad],
    [boardX + boardW + regPad, boardY + boardH + regPad],
  ].forEach(([rx, ry]) => {
    ctx.beginPath();
    ctx.moveTo(rx - regLen, ry);
    ctx.lineTo(rx + regLen, ry);
    ctx.moveTo(rx, ry - regLen);
    ctx.lineTo(rx, ry + regLen);
    ctx.stroke();
  });
  ctx.restore();

  // 3. Base Paper Sheet Backing Frame
  ctx.save();
  ctx.fillStyle = patterns.halftoneDark || palette.ink;
  ctx.fillRect(boardX + 9, boardY + 9, boardW, boardH);
  ctx.fillStyle = palette.newsprintDark;
  ctx.fillRect(boardX, boardY, boardW, boardH);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = palette.ink;
  ctx.strokeRect(boardX, boardY, boardW, boardH);
  ctx.restore();

  // 4. Stationary Paper Tiles (plus progressive swipe-peel lift if dragging!)
  const isPeeling =
    !activeAnim &&
    hoverCrease !== null &&
    !hoverCrease.blockReason &&
    hoverCrease.peelAmount > 0.04;

  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      if (
        activeAnim &&
        isCellInMovingFlap(
          r,
          c,
          activeAnim.orientation,
          activeAnim.index,
          activeAnim.dir
        )
      ) {
        continue;
      }
      if (
        isPeeling &&
        hoverCrease &&
        isCellInMovingFlap(
          r,
          c,
          hoverCrease.orientation,
          hoverCrease.index,
          hoverCrease.dir
        )
      ) {
        continue;
      }
      const cell = board.grid[r][c];
      drawPaperTile(
        ctx,
        patterns,
        boardX + c * ts,
        boardY + r * ts,
        ts,
        cell,
        cell.stack.length,
        false,
        null,
        palette
      );
    }
  }

  // 5. Internal Dotted Crease Lines
  ctx.save();
  ctx.strokeStyle = palette.creaseInk;
  ctx.lineWidth = 1.6;
  ctx.setLineDash([5, 4]);
  for (let c = 1; c < board.cols; c++) {
    const cx = boardX + c * ts;
    ctx.beginPath();
    ctx.moveTo(cx, boardY);
    ctx.lineTo(cx, boardY + boardH);
    ctx.stroke();
  }
  for (let r = 1; r < board.rows; r++) {
    const ry = boardY + r * ts;
    ctx.beginPath();
    ctx.moveTo(boardX, ry);
    ctx.lineTo(boardX + boardW, ry);
    ctx.stroke();
  }
  ctx.restore();

  // 6. Hazard One-Way Tapes
  for (const tape of board.tapes) {
    if (tape.orientation === 'v') {
      const cx = boardX + tape.index * ts;
      drawHazardTapeStrip(ctx, cx - 13, boardY - 10, 26, boardH + 20, tape.allowDir, true, palette);
    } else {
      const cy = boardY + tape.index * ts;
      drawHazardTapeStrip(ctx, boardX - 10, cy - 13, boardW + 20, 26, tape.allowDir, false, palette);
    }
  }

  // 6b. Perforated Tear Lines
  for (const pf of board.perforations) {
    if (pf.orientation === 'v') {
      const cx = boardX + pf.index * ts;
      drawPerforatedCrease(ctx, cx, boardY - 8, cx, boardY + boardH + 8, true, palette);
    } else {
      const cy = boardY + pf.index * ts;
      drawPerforatedCrease(ctx, boardX - 8, cy, boardX + boardW + 8, cy, false, palette);
    }
  }

  // 6c. Locked Creases
  for (const lk of board.locks) {
    if (lk.orientation === 'v') {
      const cx = boardX + lk.index * ts;
      drawLockedCrease(ctx, cx, boardY - 8, cx, boardY + boardH + 8, lk.keySymbol, true, palette);
    } else {
      const cy = boardY + lk.index * ts;
      drawLockedCrease(ctx, boardX - 8, cy, boardX + boardW + 8, cy, lk.keySymbol, false, palette);
    }
  }

  // 7. Progressive Drag-Peel Flap Preview (tactile origami lift or tear pull while swiping!)
  if (isPeeling && hoverCrease) {
    const isPeelTear = isCreasePerforated(
      board,
      hoverCrease.orientation,
      hoverCrease.index
    );
    ctx.save();
    if (isPeelTear) {
      // Tear pull: slightly separate the detaching flap away from the perforated seam
      const pull = hoverCrease.peelAmount * 16;
      const dx =
        hoverCrease.orientation === 'v'
          ? hoverCrease.dir === 'right'
            ? -pull
            : pull
          : 0;
      const dy =
        hoverCrease.orientation === 'h'
          ? hoverCrease.dir === 'down'
            ? -pull
            : pull
          : 0;
      ctx.translate(dx, dy - hoverCrease.peelAmount * 6);
    } else {
      const peelAngle = hoverCrease.peelAmount * 0.42;
      const cosS = Math.cos(peelAngle);
      const liftY = Math.sin(peelAngle) * 18;
      if (hoverCrease.orientation === 'v') {
        const hingeX = boardX + hoverCrease.index * ts;
        ctx.translate(hingeX, 0);
        ctx.scale(cosS, 1);
        ctx.translate(-hingeX, -liftY);
      } else {
        const hingeY = boardY + hoverCrease.index * ts;
        ctx.translate(0, hingeY);
        ctx.scale(1, cosS);
        ctx.translate(0, -hingeY - liftY);
      }
    }
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        if (
          isCellInMovingFlap(
            r,
            c,
            hoverCrease.orientation,
            hoverCrease.index,
            hoverCrease.dir
          )
        ) {
          const cell = board.grid[r][c];
          drawPaperTile(
            ctx,
            patterns,
            boardX + c * ts,
            boardY + r * ts,
            ts,
            cell,
            cell.stack.length,
            true,
            null,
            palette
          );
        }
      }
    }
    ctx.restore();
  }

  // 8. Hover / Drag Crease Ghost Landing Preview (or Detach Highlight for Perforations)
  if (hoverCrease && !activeAnim) {
    const blocked = hoverCrease.blockReason !== null;
    const isHoverTear =
      !blocked &&
      isCreasePerforated(board, hoverCrease.orientation, hoverCrease.index);
    const color = blocked || isHoverTear ? palette.red : palette.blue;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3.5;
    ctx.setLineDash([7, 5]);

    if (hoverCrease.orientation === 'v') {
      const cx = boardX + hoverCrease.index * ts;
      ctx.beginPath();
      ctx.moveTo(cx, boardY - 10);
      ctx.lineTo(cx, boardY + boardH + 10);
      ctx.stroke();

      const badgeX = cx + (hoverCrease.dir === 'right' ? 22 : -22);
      drawDirectionBadge(ctx, badgeX, boardY + boardH * 0.5, hoverCrease.dir, blocked, color, palette);
    } else {
      const cy = boardY + hoverCrease.index * ts;
      ctx.beginPath();
      ctx.moveTo(boardX - 10, cy);
      ctx.lineTo(boardX + boardW + 10, cy);
      ctx.stroke();

      const badgeY = cy + (hoverCrease.dir === 'down' ? 22 : -22);
      drawDirectionBadge(ctx, boardX + boardW * 0.5, badgeY, hoverCrease.dir, blocked, color, palette);
    }

    if (!blocked && isHoverTear) {
      // Highlight the moving flap in dashed red to indicate it will TEAR OFF & DISCARD
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = palette.red;
      ctx.fillStyle = palette.isDark
        ? 'rgba(230, 57, 70, 0.22)'
        : 'rgba(230, 57, 70, 0.14)';
      ctx.lineWidth = 2.4;

      for (let r = 0; r < board.rows; r++) {
        for (let c = 0; c < board.cols; c++) {
          if (
            isCellInMovingFlap(
              r,
              c,
              hoverCrease.orientation,
              hoverCrease.index,
              hoverCrease.dir
            )
          ) {
            const gx = boardX + c * ts + 5;
            const gy = boardY + r * ts + 5;
            ctx.fillRect(gx, gy, ts - 10, ts - 10);
            ctx.strokeRect(gx, gy, ts - 10, ts - 10);
          }
        }
      }
    } else if (!blocked) {
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = palette.blue;
      ctx.fillStyle = palette.previewTint;
      ctx.lineWidth = 2;

      if (hoverCrease.orientation === 'v') {
        const cStart = hoverCrease.dir === 'right' ? 0 : hoverCrease.index;
        const cEnd = hoverCrease.dir === 'right' ? hoverCrease.index : board.cols;
        for (let r = 0; r < board.rows; r++) {
          for (let c = cStart; c < cEnd; c++) {
            const mirrorC =
              hoverCrease.dir === 'right'
                ? hoverCrease.index + (hoverCrease.index - 1 - c)
                : hoverCrease.index - 1 - (c - hoverCrease.index);
            const gx = boardX + mirrorC * ts + 5;
            const gy = boardY + r * ts + 5;
            ctx.fillRect(gx, gy, ts - 10, ts - 10);
            ctx.strokeRect(gx, gy, ts - 10, ts - 10);
          }
        }
      } else {
        const rStart = hoverCrease.dir === 'down' ? 0 : hoverCrease.index;
        const rEnd = hoverCrease.dir === 'down' ? hoverCrease.index : board.rows;
        for (let r = rStart; r < rEnd; r++) {
          for (let c = 0; c < board.cols; c++) {
            const mirrorR =
              hoverCrease.dir === 'down'
                ? hoverCrease.index + (hoverCrease.index - 1 - r)
                : hoverCrease.index - 1 - (r - hoverCrease.index);
            const gx = boardX + c * ts + 5;
            const gy = boardY + mirrorR * ts + 5;
            ctx.fillRect(gx, gy, ts - 10, ts - 10);
            ctx.strokeRect(gx, gy, ts - 10, ts - 10);
          }
        }
      }
    }
    ctx.restore();
  }

  // 9. Pulsing Optimal Hint Crease Guide
  if (hintFold && !activeAnim) {
    const pulse = (Math.sin(time * 5.2) + 1) * 0.5;
    ctx.save();
    ctx.strokeStyle = palette.teal;
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 4]);

    if (hintFold.orientation === 'v') {
      const cx = boardX + hintFold.index * ts;
      ctx.beginPath();
      ctx.moveTo(cx, boardY - 12);
      ctx.lineTo(cx, boardY + boardH + 12);
      ctx.stroke();

      const offset = (hintFold.dir === 'right' ? 1 : -1) * (18 + pulse * 10);
      drawDirectionBadge(ctx, cx + offset, boardY + boardH * 0.5, hintFold.dir, false, palette.teal, palette);
    } else {
      const cy = boardY + hintFold.index * ts;
      ctx.beginPath();
      ctx.moveTo(boardX - 12, cy);
      ctx.lineTo(boardX + boardW + 12, cy);
      ctx.stroke();

      const offset = (hintFold.dir === 'down' ? 1 : -1) * (18 + pulse * 10);
      drawDirectionBadge(ctx, boardX + boardW * 0.5, cy + offset, hintFold.dir, false, palette.teal, palette);
    }
    ctx.restore();
  }

  // 10. 3D-Perspective Folding Flap Animation (or Perforated Tear Detachment!)
  if (activeAnim) {
    const t = Math.min(1, activeAnim.progress);

    if (activeAnim.isTear) {
      const easeOut = 1 - Math.pow(1 - t, 3);
      const pullDist = easeOut * ts * 1.15;
      const dx =
        activeAnim.orientation === 'v'
          ? activeAnim.dir === 'right'
            ? -pullDist
            : pullDist
          : 0;
      const dy =
        activeAnim.orientation === 'h'
          ? activeAnim.dir === 'down'
            ? -pullDist
            : pullDist
          : -easeOut * 22;
      const tilt =
        (activeAnim.dir === 'right' || activeAnim.dir === 'down' ? -1 : 1) *
        0.14 *
        easeOut;

      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - t * 1.1);
      const pivotX = boardX + boardW * 0.5;
      const pivotY = boardY + boardH * 0.5;
      ctx.translate(pivotX + dx, pivotY + dy);
      ctx.rotate(tilt);
      ctx.translate(-pivotX, -pivotY);

      for (const item of activeAnim.flapSnapshot) {
        const tempCell: CellState = {
          stack: item.topSym ? [item.topSym] : [null],
          pinned: item.pinned,
        };
        drawPaperTile(
          ctx,
          patterns,
          boardX + item.c * ts,
          boardY + item.r * ts,
          ts,
          tempCell,
          item.depth,
          true,
          null,
          palette
        );
      }
      ctx.restore();
    } else {
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const cosScale = Math.cos(ease * Math.PI);
      const liftY = Math.sin(ease * Math.PI) * 22;
      const showColoredBack = cosScale < 0;

      ctx.save();
      if (activeAnim.orientation === 'v') {
        const hingeX = boardX + activeAnim.index * ts;
        ctx.translate(hingeX, 0);
        ctx.scale(cosScale, 1);
        ctx.translate(-hingeX, -liftY);
      } else {
        const hingeY = boardY + activeAnim.index * ts;
        ctx.translate(0, hingeY);
        ctx.scale(1, cosScale);
        ctx.translate(0, -hingeY - liftY);
      }

      for (const item of activeAnim.flapSnapshot) {
        const tempCell: CellState = {
          stack: item.topSym ? [item.topSym] : [null],
          pinned: item.pinned,
        };
        drawPaperTile(
          ctx,
          patterns,
          boardX + item.c * ts,
          boardY + item.r * ts,
          ts,
          tempCell,
          item.depth,
          true,
          showColoredBack ? activeAnim.undersideColor : null,
          palette
        );
      }
      ctx.restore();
    }
  }

  // 11. Blocked Ripple Feedback
  if (blockedShake.timer > 0) {
    const p = 1 - blockedShake.timer / 0.34;
    ctx.save();
    ctx.beginPath();
    ctx.arc(blockedShake.x, blockedShake.y, 18 + p * 38, 0, Math.PI * 2);
    ctx.strokeStyle = palette.red;
    ctx.lineWidth = 3.5 * (1 - p);
    ctx.stroke();

    ctx.fillStyle = palette.ink;
    ctx.font = '800 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const label =
      blockedShake.reason === 'lock'
        ? 'LOCKED CREASE!'
        : blockedShake.reason === 'pin'
          ? 'PINNED TILE!'
          : 'ONE-WAY TAPE!';
    ctx.fillText(label, blockedShake.x, blockedShake.y - 26 - p * 12);
    ctx.restore();
  }

  ctx.restore();

  // 12. Ink Stamp Burst Particles
  ctx.save();
  for (const p of particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'square') {
      ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 1.2);
      ctx.lineTo(p.size * 1.1, p.size);
      ctx.lineTo(-p.size * 1.1, p.size);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.restore();

  // 13. Animated First-Fold Swipe Guide (Level 1-1 before first move)
  if (showFirstFoldGuide && !activeAnim && board.cols >= 2) {
    const pulse = (Math.sin(time * 3.2) + 1) * 0.5;
    const startX = boardX + ts * (board.cols - 0.5);
    const endX = boardX + ts * (board.cols - 1.5);
    const y = boardY + ts * 0.5;
    const curX = startX + (endX - startX) * pulse;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
    ctx.strokeStyle = palette.red;
    ctx.lineWidth = 2.6;
    ctx.setLineDash([5, 4]);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(curX, y, 13 + pulse * 3.5, 0, Math.PI * 2);
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = palette.red;
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = palette.red;
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Render floating Bauhaus Risograph poster geometric ornaments for the Lobby background
 */
export function renderPosterBackdrop(
  ctx: CanvasRenderingContext2D,
  patterns: RisoPatterns,
  width: number,
  height: number,
  time: number,
  palette: RisoPalette = getActivePalette()
) {
  ctx.fillStyle = palette.newsprint;
  ctx.fillRect(0, 0, width, height);
  if (patterns.newsprintGrain) {
    ctx.fillStyle = patterns.newsprintGrain;
    ctx.fillRect(0, 0, width, height);
  }

  const floatY = Math.sin(time * 1.2) * 5;

  // Top-Left Split Red / Halftone Blue Circle
  ctx.save();
  ctx.translate(Math.max(48, width * 0.11), Math.max(108, height * 0.2) + floatY);
  ctx.rotate(-0.35);
  ctx.fillStyle = palette.red;
  ctx.beginPath();
  ctx.arc(0, -3, 36, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = patterns.halftoneBlue || palette.blue;
  ctx.beginPath();
  ctx.arc(0, 3, 36, 0, Math.PI);
  ctx.fill();
  ctx.restore();

  // Top-Right Red Grid Mesh + Cobalt Semicircle
  ctx.save();
  ctx.translate(width - Math.max(56, width * 0.12), Math.max(108, height * 0.19) - floatY);
  ctx.rotate(0.28);
  ctx.strokeStyle = palette.red;
  ctx.lineWidth = 1.6;
  for (let i = -24; i <= 24; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, -24);
    ctx.lineTo(i, 24);
    ctx.moveTo(-24, i);
    ctx.lineTo(24, i);
    ctx.stroke();
  }
  ctx.fillStyle = palette.blue;
  ctx.beginPath();
  ctx.arc(16, 18, 26, 0, Math.PI);
  ctx.fill();
  ctx.restore();

  if (width > 560) {
    // Mid-Left Halftone Red Circle + Blue Grid
    ctx.save();
    ctx.translate(Math.max(64, width * 0.12), height * 0.56 - floatY * 0.8);
    ctx.fillStyle = patterns.halftoneRed || palette.red;
    ctx.beginPath();
    ctx.arc(-10, 0, 34, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = palette.blue;
    ctx.lineWidth = 1.6;
    for (let i = -22; i <= 22; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i + 8, -22);
      ctx.lineTo(i + 8, 22);
      ctx.moveTo(-14, i);
      ctx.lineTo(30, i);
      ctx.stroke();
    }
    ctx.restore();

    // Bottom-Right Mustard Triangle + Halftone Teal Accent
    ctx.save();
    ctx.translate(width - Math.max(68, width * 0.12), height * 0.64 + floatY * 0.7);
    ctx.rotate(0.18);
    ctx.fillStyle = patterns.halftoneTeal || palette.teal;
    ctx.beginPath();
    ctx.arc(14, 10, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = palette.yellow;
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(24, 18);
    ctx.lineTo(-24, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}
