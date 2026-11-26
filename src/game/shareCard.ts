import { getActivePalette, getActiveTheme } from './themes';

export interface DailySharePayload {
  dateKey: string; // YYYY-MM-DD
  displayDate: string; // e.g. "NOV 26"
  fullDisplayDate: string; // e.g. "Thursday, NOV 26, 2026"
  dayOfYear: number;
  totalDaysInYear: number;
  title: string;
  weekdayTheme: string;
  accentColor: string;
  cardText: string;
  rows: number;
  cols: number;
  moves: number;
  par: number;
  stars: number; // 1..3
  ply?: number;
  currentStreak: number;
  longestStreak: number;
}

/**
 * Generates a spoiler-free plain-text summary suitable for messaging apps.
 * Never reveals crease locations, fold directions, or symbol placements.
 */
export function buildDailyShareText(p: DailySharePayload): string {
  const edition = `#${String(p.dayOfYear).padStart(3, '0')}`;
  const starGlyphs = '★'.repeat(Math.max(0, Math.min(3, p.stars))) +
    '☆'.repeat(Math.max(0, 3 - Math.min(3, p.stars)));

  const parTiles = Math.min(p.moves, p.par);
  const extraTiles = Math.max(0, p.moves - p.par);
  const maxVisual = 10;
  const glyphs: string[] = [];
  for (let i = 0; i < Math.min(parTiles, maxVisual); i++) glyphs.push('■');
  for (let i = 0; i < Math.min(extraTiles, Math.max(0, maxVisual - glyphs.length)); i++) {
    glyphs.push('□');
  }
  const overflow = p.moves > maxVisual ? ` +${p.moves - maxVisual}` : '';
  const cadenceLine = `${glyphs.join(' ')}${overflow}`;

  const streakLabel =
    p.currentStreak > 0
      ? ` · ${p.currentStreak}d STREAK`
      : '';

  return [
    `FOLD FOLD · DAILY ${edition} (${p.displayDate})`,
    `${starGlyphs} · ${p.moves}/${p.par} FOLDS${streakLabel}`,
    `${cadenceLine} · ${p.rows}×${p.cols} ${p.weekdayTheme}`,
  ].join('\n');
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawDogEarCardPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  foldSize: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - foldSize, y);
  ctx.lineTo(x + w, y + foldSize);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawRegistrationMark(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  strokeColor: string
) {
  ctx.save();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - radius - 6, cy);
  ctx.lineTo(cx + radius + 6, cy);
  ctx.moveTo(cx, cy - radius - 6);
  ctx.lineTo(cx, cy + radius + 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawStarShape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number
) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? outerR : innerR;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawHalftoneStrip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  spacing = 14,
  dotR = 2.2
) {
  ctx.save();
  ctx.fillStyle = color;
  for (let yy = y + spacing / 2; yy < y + h; yy += spacing) {
    const offset = Math.floor((yy - y) / spacing) % 2 === 0 ? 0 : spacing / 2;
    for (let xx = x + spacing / 2 + offset; xx < x + w; xx += spacing) {
      ctx.beginPath();
      ctx.arc(xx, yy, dotR, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/**
 * Renders a crisp, high-resolution Bauhaus Risograph archival proof card (900x1120)
 * onto an offscreen canvas using the player's currently equipped paper & ink theme.
 */
export function renderDailyShareCardCanvas(p: DailySharePayload): HTMLCanvasElement {
  const RISO = getActivePalette();
  const activeTheme = getActiveTheme();
  const W = 900;
  const H = 1120;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const displayFont =
    '"Archivo Black", "Space Grotesk", "Arial Black", system-ui, sans-serif';
  const monoFont =
    '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

  // 1. Newsprint cardstock background
  ctx.fillStyle = RISO.newsprint;
  ctx.fillRect(0, 0, W, H);

  // Subtle deterministic Risograph paper fiber grain
  let seed = (p.dayOfYear * 2654435761) >>> 0;
  const nextRand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < 4200; i++) {
    const gx = nextRand() * W;
    const gy = nextRand() * H;
    ctx.fillStyle = i % 3 === 0 ? RISO.grainLight : RISO.grainDark;
    ctx.fillRect(gx, gy, 2, 2);
  }

  // Outer archival crop frame + 4 corner registration crosshairs
  drawRegistrationMark(ctx, 42, 42, 9, RISO.regMarkInk);
  drawRegistrationMark(ctx, W - 42, 42, 9, RISO.regMarkInk);
  drawRegistrationMark(ctx, 42, H - 42, 9, RISO.regMarkInk);
  drawRegistrationMark(ctx, W - 42, H - 42, 9, RISO.regMarkInk);

  // Subtle halftone accent band behind the main sheet
  drawHalftoneStrip(
    ctx,
    84,
    96,
    W - 150,
    H - 180,
    RISO.isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(20, 20, 20, 0.08)',
    16,
    2.2
  );

  const mutedInk = RISO.isDark
    ? 'rgba(240, 246, 252, 0.7)'
    : 'rgba(20, 20, 20, 0.62)';
  const subtleInk = RISO.isDark
    ? 'rgba(240, 246, 252, 0.24)'
    : 'rgba(20, 20, 20, 0.16)';
  const dividerInk = RISO.isDark
    ? 'rgba(240, 246, 252, 0.28)'
    : 'rgba(20, 20, 20, 0.25)';

  // 2. Main folded Risograph proof sheet with offset ink shadow & cobalt dog-ear flap
  const cardX = 68;
  const cardY = 74;
  const cardW = W - 136;
  const cardH = H - 148;
  const cornerR = 26;
  const foldSize = 96;

  // Hard offset shadow
  ctx.save();
  drawDogEarCardPath(ctx, cardX + 16, cardY + 16, cardW, cardH, cornerR, foldSize);
  ctx.fillStyle = RISO.isDark ? 'rgba(0, 0, 0, 0.55)' : RISO.ink;
  ctx.fill();
  ctx.restore();

  // Main cardstock body
  ctx.save();
  drawDogEarCardPath(ctx, cardX, cardY, cardW, cardH, cornerR, foldSize);
  ctx.fillStyle = RISO.paperWhite;
  ctx.fill();
  ctx.clip();

  // Subtle internal fold crease guides
  ctx.save();
  ctx.strokeStyle = RISO.isDark ? 'rgba(240, 246, 252, 0.14)' : 'rgba(20, 20, 20, 0.12)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(cardX + cardW / 2, cardY + 140);
  ctx.lineTo(cardX + cardW / 2, cardY + cardH - 110);
  ctx.stroke();
  ctx.restore();

  // Top accent press masthead band
  const headerH = 122;
  ctx.fillStyle = p.accentColor;
  ctx.fillRect(cardX, cardY, cardW, headerH);

  // Header divider line
  ctx.fillStyle = RISO.ink;
  ctx.fillRect(cardX, cardY + headerH, cardW, 5);

  // Brand + Daily Edition header copy
  ctx.fillStyle = p.cardText;
  ctx.font = `900 38px ${displayFont}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('FOLD FOLD', cardX + 42, cardY + 60);

  ctx.font = `800 19px ${monoFont}`;
  ctx.fillStyle = p.cardText;
  ctx.globalAlpha = 0.9;
  const editionStr = `DAILY PROOF #${String(p.dayOfYear).padStart(3, '0')}/${p.totalDaysInYear}  ·  ${p.displayDate}`;
  ctx.fillText(editionStr, cardX + 42, cardY + 96);
  ctx.globalAlpha = 1;

  ctx.restore();

  // Crisp outer ink stroke around the dog-ear card
  drawDogEarCardPath(ctx, cardX, cardY, cardW, cardH, cornerR, foldSize);
  ctx.strokeStyle = RISO.ink;
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Cobalt Blue folded dog-ear flap (top-right)
  ctx.save();
  const flapX = cardX + cardW - foldSize;
  const flapY = cardY;
  ctx.beginPath();
  ctx.moveTo(flapX, flapY);
  ctx.lineTo(cardX + cardW, flapY + foldSize);
  ctx.lineTo(flapX + 18, flapY + foldSize);
  ctx.quadraticCurveTo(flapX, flapY + foldSize, flapX, flapY + foldSize - 18);
  ctx.closePath();
  ctx.fillStyle = RISO.blue;
  ctx.fill();
  ctx.strokeStyle = RISO.ink;
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();

  // 3. Puzzle Title & Theme Subtitle
  const innerX = cardX + 44;
  const innerW = cardW - 88;
  let curY = cardY + headerH + 62;

  ctx.fillStyle = mutedInk;
  ctx.font = `800 18px ${monoFont}`;
  ctx.fillText(p.fullDisplayDate.toUpperCase(), innerX, curY);

  curY += 54;
  ctx.fillStyle = RISO.ink;
  ctx.font = `900 46px ${displayFont}`;
  const safeTitle = p.title.toUpperCase();
  ctx.fillText(safeTitle, innerX, curY, innerW);

  curY += 34;
  ctx.fillStyle = RISO.blue;
  ctx.font = `800 20px ${monoFont}`;
  ctx.fillText(
    `${p.weekdayTheme.toUpperCase()}  ·  ${p.rows}×${p.cols} SHEET`,
    innerX,
    curY
  );

  // 4. Big Risograph Star Stamp Box (with misregistration shadow)
  curY += 34;
  const starBoxH = 186;
  drawRoundedRectPath(ctx, innerX + 6, curY + 6, innerW, starBoxH, 20);
  ctx.fillStyle = RISO.ink;
  ctx.fill();

  drawRoundedRectPath(ctx, innerX, curY, innerW, starBoxH, 20);
  ctx.fillStyle = RISO.newsprint;
  ctx.fill();
  ctx.strokeStyle = RISO.ink;
  ctx.lineWidth = 4.5;
  ctx.stroke();

  // Draw 3 large Bauhaus stars centered
  const starCenterY = curY + 78;
  const starGap = 112;
  const midX = cardX + cardW / 2;
  for (let i = 0; i < 3; i++) {
    const sx = midX + (i - 1) * starGap;
    const earned = i < p.stars;

    if (earned) {
      // Mustard misregistration offset shadow
      ctx.save();
      drawStarShape(ctx, sx + 6, starCenterY + 6, 44, 19);
      ctx.fillStyle = 'rgba(244, 162, 97, 0.72)';
      ctx.fill();
      ctx.restore();
    }

    drawStarShape(ctx, sx, starCenterY, 44, 19);
    ctx.fillStyle = earned ? RISO.red : subtleInk;
    ctx.fill();
    ctx.strokeStyle = earned ? RISO.ink : dividerInk;
    ctx.lineWidth = 3.5;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  // Verdict Stamp Pill inside Star Box
  const verdict =
    p.moves <= p.par
      ? 'EXACT PAR PROOF'
      : p.stars === 2
        ? 'CLEAN ARCHIVAL FOLD'
        : 'DAILY SHEET CLEARED';
  ctx.font = `800 20px ${monoFont}`;
  const vTextW = ctx.measureText(verdict).width;
  const pillW = vTextW + 44;
  const pillH = 38;
  const pillX = midX - pillW / 2;
  const pillY = curY + 132;
  drawRoundedRectPath(ctx, pillX, pillY, pillW, pillH, 10);
  ctx.fillStyle = p.moves <= p.par ? RISO.red : RISO.blue;
  ctx.fill();
  ctx.strokeStyle = RISO.ink;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = p.moves <= p.par ? RISO.badgeTextOnRed : RISO.badgeTextOnBlue;
  ctx.textAlign = 'center';
  ctx.fillText(verdict, midX, pillY + 26);
  ctx.textAlign = 'left';

  // 5. Spoiler-Free Abstract Fold Cadence Strip
  curY += starBoxH + 46;
  ctx.fillStyle = mutedInk;
  ctx.font = `800 17px ${monoFont}`;
  ctx.fillText('FOLD CADENCE  (SPOILER-FREE)', innerX, curY);

  curY += 20;
  const cadenceH = 104;
  drawRoundedRectPath(ctx, innerX, curY, innerW, cadenceH, 18);
  ctx.fillStyle = RISO.paperWhite;
  ctx.fill();
  ctx.strokeStyle = RISO.ink;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Render abstract geometric crease stamps (no directions or positions!)
  const maxTiles = 8;
  const shownCount = Math.min(p.moves, maxTiles);
  const overflowCount = Math.max(0, p.moves - maxTiles);
  const tileSize = shownCount <= 5 ? 60 : 50;
  const tileGap = shownCount <= 5 ? 18 : 12;
  const extraLabelW = overflowCount > 0 ? 64 : 0;
  const totalStripW =
    shownCount * tileSize + Math.max(0, shownCount - 1) * tileGap + extraLabelW;
  let tx = midX - totalStripW / 2;
  const ty = curY + (cadenceH - tileSize) / 2;
  const palette = [RISO.red, RISO.blue, RISO.yellow, RISO.teal];

  for (let i = 0; i < shownCount; i++) {
    const withinPar = i < p.par;
    const fill = palette[i % palette.length];

    // Hard micro-shadow
    drawRoundedRectPath(ctx, tx + 4, ty + 4, tileSize, tileSize, 10);
    ctx.fillStyle = withinPar ? (RISO.isDark ? 'rgba(0,0,0,0.5)' : RISO.ink) : subtleInk;
    ctx.fill();

    // Tile face
    drawRoundedRectPath(ctx, tx, ty, tileSize, tileSize, 10);
    ctx.fillStyle = withinPar ? fill : RISO.newsprint;
    ctx.fill();
    ctx.strokeStyle = RISO.ink;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Diagonal origami crease mark inside each tile
    ctx.save();
    ctx.strokeStyle = withinPar
      ? fill === RISO.yellow || RISO.isDark
        ? 'rgba(15, 20, 30, 0.45)'
        : 'rgba(250, 248, 245, 0.55)'
      : mutedInk;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(tx + 10, ty + tileSize - 10);
    ctx.lineTo(tx + tileSize - 10, ty + 10);
    ctx.stroke();
    ctx.restore();

    tx += tileSize + tileGap;
  }

  if (overflowCount > 0) {
    ctx.fillStyle = RISO.ink;
    ctx.font = `900 24px ${monoFont}`;
    ctx.fillText(`+${overflowCount}`, tx + 8, curY + cadenceH / 2 + 8);
  }

  // 6. Three Crisp Archival Stat Boxes (FOLDS / PAR / STREAK)
  curY += cadenceH + 34;
  const statGap = 20;
  const statW = (innerW - statGap * 2) / 3;
  const statH = 148;

  const statItems = [
    {
      label: 'FOLDS',
      value: `${p.moves}`,
      sub: `PAR ${p.par}`,
      color: RISO.blue,
    },
    {
      label: 'STREAK',
      value: `${p.currentStreak}d`,
      sub: `BEST ${Math.max(p.longestStreak, p.currentStreak)}d`,
      color: RISO.red,
    },
    {
      label: p.ply ? 'FINAL STOCK' : 'STARS',
      value: p.ply ? `${p.ply} PLY` : `${p.stars} / 3`,
      sub: p.moves <= p.par ? 'OPTIMAL' : `+${p.moves - p.par} OVER PAR`,
      color: RISO.ink,
    },
  ];

  statItems.forEach((item, idx) => {
    const sx = innerX + idx * (statW + statGap);

    drawRoundedRectPath(ctx, sx + 5, curY + 5, statW, statH, 16);
    ctx.fillStyle = RISO.ink;
    ctx.fill();

    drawRoundedRectPath(ctx, sx, curY, statW, statH, 16);
    ctx.fillStyle = RISO.newsprint;
    ctx.fill();
    ctx.strokeStyle = RISO.ink;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = mutedInk;
    ctx.font = `800 17px ${monoFont}`;
    ctx.fillText(item.label, sx + statW / 2, curY + 38);

    ctx.fillStyle = item.color;
    ctx.font = `900 44px ${displayFont}`;
    ctx.fillText(item.value, sx + statW / 2, curY + 96);

    ctx.fillStyle = mutedInk;
    ctx.font = `800 15px ${monoFont}`;
    ctx.fillText(item.sub, sx + statW / 2, curY + 128);
  });
  ctx.textAlign = 'left';

  // 7. Bottom Printmaker Colophon & Color Registration Bars
  const footerY = cardY + cardH - 66;
  ctx.strokeStyle = dividerInk;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(innerX, footerY - 22);
  ctx.lineTo(innerX + innerW, footerY - 22);
  ctx.stroke();

  const swatches = [RISO.red, RISO.blue, RISO.yellow, RISO.teal, RISO.ink];
  swatches.forEach((sw, idx) => {
    const swX = innerX + idx * 28;
    ctx.fillStyle = sw;
    ctx.fillRect(swX, footerY - 4, 20, 20);
    ctx.strokeStyle = RISO.ink;
    ctx.lineWidth = 2;
    ctx.strokeRect(swX, footerY - 4, 20, 20);
  });

  ctx.textAlign = 'right';
  ctx.fillStyle = mutedInk;
  ctx.font = `800 17px ${monoFont}`;
  ctx.fillText(
    `FOLD FOLD · ${activeTheme.name.toUpperCase()}`,
    innerX + innerW,
    footerY + 12
  );
  ctx.textAlign = 'left';

  return canvas;
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to encode Risograph PNG'));
    }, 'image/png');
  });
}

export async function copyDailyShareText(p: DailySharePayload): Promise<boolean> {
  const text = buildDailyShareText(p);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below for restricted iframe / WebView contexts
  }

  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export async function downloadDailyCardPng(p: DailySharePayload): Promise<void> {
  const canvas = renderDailyShareCardCanvas(p);
  const blob = await canvasToPngBlob(canvas);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fold-fold-daily-${p.dateKey}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Attempts native Web Share API with the PNG proof card file attached (ideal on Android/iOS).
 * Gracefully falls back to saving the PNG and copying the spoiler-free summary text.
 */
export async function shareDailyCard(
  p: DailySharePayload
): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const text = buildDailyShareText(p);
  const canvas = renderDailyShareCardCanvas(p);
  const blob = await canvasToPngBlob(canvas);
  const file = new File([blob], `fold-fold-daily-${p.dateKey}.png`, {
    type: 'image/png',
  });

  const nav = navigator as Navigator & {
    canShare?: (data?: ShareData) => boolean;
  };

  if (typeof nav.share === 'function') {
    try {
      if (typeof nav.canShare === 'function' && nav.canShare({ files: [file] })) {
        await nav.share({
          title: `Fold Fold Daily #${String(p.dayOfYear).padStart(3, '0')}`,
          text,
          files: [file],
        });
        return 'shared';
      }
      await nav.share({
        title: `Fold Fold Daily #${String(p.dayOfYear).padStart(3, '0')}`,
        text,
      });
      return 'shared';
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return 'cancelled';
      }
      // Fall through to PNG download + text copy
    }
  }

  await downloadDailyCardPng(p);
  await copyDailyShareText(p);
  return 'downloaded';
}
