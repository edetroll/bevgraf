/* Ezek a forráskódok közvetlenül szerkeszthetők a bemutatóoldalakon. */
window.BevGrafRasterExamples={
 incremental:{hu:{title:'Egyszerű növekményes módszer'},en:{title:'Simple incremental algorithm'},source:`// A meredek szakasznál a pontok között rések maradhatnak.
const p0 = { x: 2, y: 2 };
const p1 = { x: 5, y: 11 };
const S = "rgb(220, 124, 46)";

function incremental(p0, p1) {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  if (dx === 0) return;

  const m = dy / dx;
  let y = p0.y;
  for (let x = p0.x; x <= p1.x; x++) {
    putPixel(ctx, x, Math.round(y), S);
    y += m;
  }
}

incremental(p0, p1);`},
 dda:{hu:{title:'DDA szakaszrajzoló algoritmus'},en:{title:'DDA line rasterisation'},source:`const p0 = { x: 2, y: 2 };
const p1 = { x: 19, y: 12 };
const S = "rgb(220, 124, 46)";

function DDA(p0, p1) {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const n = Math.max(Math.abs(dx), Math.abs(dy));

  let x = p0.x;
  let y = p0.y;
  putPixel(ctx, x, y, S);
  if (n === 0) return;

  const stepX = dx / n;
  const stepY = dy / n;
  for (let i = 1; i <= n; i++) {
    x += stepX;
    y += stepY;
    putPixel(ctx, Math.round(x), Math.round(y), S);
  }
}

DDA(p0, p1);`},
 midpoint:{hu:{title:'Midpoint (0°–45°)'},en:{title:'Midpoint (0°–45°)'},source:`// Csak 0 <= dy <= dx, dx > 0 esetén.
const p0 = { x: 2, y: 2 };
const p1 = { x: 19, y: 9 };
const S = "rgb(220, 124, 46)";

function midpoint(p0, p1) {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  if (dx <= 0 || dy < 0 || dy > dx) {
    throw new Error("A szakasz nem 0° és 45° közötti.");
  }
  let x = p0.x;
  let y = p0.y;
  let d = dx - 2 * dy;
  putPixel(ctx, x, y, S);

  for (let i = 1; i <= dx; i++) {
    if (d < 0) {
      y++;
      d += 2 * (dx - dy);
    } else {
      d -= 2 * dy;
    }
    x++;
    putPixel(ctx, x, y, S);
  }
}

midpoint(p0, p1);`},
 'midpoint-general':{hu:{title:'Midpoint – általános eset'},en:{title:'Midpoint – general case'},source:`const p0 = { x: 3, y: 12 };
const p1 = { x: 19, y: 3 };
const S = "rgb(220, 124, 46)";

function midpoint(p0, p1) {
  // A sorrend egységesítése az irányfüggetlen pixelválasztáshoz.
  if (p0.x > p1.x ||
      (p0.x === p1.x && p0.y > p1.y)) {
    [p0, p1] = [p1, p0];
  }
  let x = p0.x, y = p0.y;
  let dx = Math.abs(p1.x - p0.x);
  let dy = Math.abs(p1.y - p0.y);
  const sx = Math.sign(p1.x - p0.x);
  const sy = Math.sign(p1.y - p0.y);
  const swapped = dy > dx;
  if (swapped) [dx, dy] = [dy, dx];

  let d = dx - 2 * dy;
  putPixel(ctx, x, y, S);
  for (let i = 1; i <= dx; i++) {
    if (d < 0) {
      if (swapped) x += sx;
      else y += sy;
      d += 2 * (dx - dy);
    } else d -= 2 * dy;

    if (swapped) y += sy;
    else x += sx;
    putPixel(ctx, x, y, S);
  }
}

midpoint(p0, p1);`},
 'midpoint-circle':{hu:{title:'Midpoint körrajzoló algoritmus'},en:{title:'Midpoint circle rasterisation'},source:`const center = { x: 12, y: 12 };
const radius = 9;
const S = "rgb(220, 124, 46)";

function circlePoints(x, y) {
  const cx = center.x, cy = center.y;
  const dx = [x, -x, x, -x, y, -y, y, -y];
  const dy = [y, y, -y, -y, x, x, -x, -x];
  for (let i = 0; i < 8; i++) {
    putPixel(ctx, cx + dx[i], cy + dy[i], S);
  }
}

function midpointCircle(R) {
  let x = 0;
  let y = R;
  let h = 1 - R;
  while (x <= y) {
    circlePoints(x, y);
    if (h < 0) {
      h += 2 * x + 3;
    } else {
      h += 2 * (x - y) + 5;
      y--;
    }
    x++;
  }
}

midpointCircle(radius);`}
};
