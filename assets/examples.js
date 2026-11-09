/* Minden demonstrációnak külön URL-je és külön szerkeszthető forráskódja van. */
window.BevGrafExamples = {
  pixel: {
    hu: {
      title: "Képpont (pixel)",
      lead: "Egy képpont színét az (x, y) koordinátájával adjuk meg. A program egy 1 × 1 képpontos négyzetet rajzol, majd képpontonként állít elő egy színmintát.",
      hint: "Módosítsd az RGB-összetevőket és a ciklushatárokat. Figyeld meg, hogyan változik a színminta!"
    },
    en: {
      title: "Pixel",
      lead: "A pixel is addressed by its (x, y) coordinates. The program draws a 1 × 1 pixel rectangle, then constructs a colour pattern pixel by pixel.",
      hint: "Modify the RGB components and loop bounds. Observe the resulting colour pattern."
    },
    source: `// A Canvas rajzterületének közepén egy piros pixel.
const center = {
  x: Math.floor(canvas.width / 2),
  y: Math.floor(canvas.height / 2)
};
putPixel(ctx, center.x, center.y, "red");

// 256 × 256 képpontos színminta.
for (let y = 0; y < 256; y++) {
  for (let x = 0; x < 256; x++) {
    const red = x;
    const green = Math.floor(Math.abs(Math.sin(x / 24)) * 255);
    const blue = y;
    putPixel(ctx, x + 48, y + 80,
      rgb({red}, {green}, {blue}));
  }
}

// A középpontot látható jelöléssel is megmutatjuk.
ctx.strokeStyle = "#f05d5e";
ctx.lineWidth = 1;
ctx.strokeRect(center.x - 8, center.y - 8, 17, 17);`.replaceAll('\u001c','`').replaceAll('\u001e','$').replaceAll('\u001d','`')
  },
  line: {
    hu: {
      title: "Szakasz rajzolása",
      lead: "A szakaszt két végpont határozza meg. Saját drawLine() függvényünk e két pontot kapja, a Canvas moveTo() és lineTo() hívásait pedig elrejti.",
      hint: "Változtasd meg a végpontokat, a színeket és a vonalvastagságot. A koordinátarendszer kezdőpontja a bal felső sarok."
    },
    en: {
      title: "Drawing a line segment",
      lead: "A line segment is defined by two endpoints. Our drawLine() helper accepts both points and encapsulates the Canvas moveTo() and lineTo() calls.",
      hint: "Change the endpoints, colours and line widths. The origin of the coordinate system is at the upper-left corner."
    },
    source: `const p0 = { x: 80, y: 80 };
const p1 = { x: 390, y: 300 };

drawLine(ctx, p0, p1, "#f3b849", 4);
drawLine(ctx,
  { x: 100, y: 360 },
  { x: 720, y: 90 },
  "#56c7bf", 3);

// Két tengely a rajzterület középpontjában.
const cx = canvas.width / 2;
const cy = canvas.height / 2;
drawLine(ctx, { x: cx, y: 0 },
              { x: cx, y: canvas.height }, "#899ab2", 1);
drawLine(ctx, { x: 0, y: cy },
              { x: canvas.width, y: cy }, "#899ab2", 1);`
  },
  circle: {
    hu: {
      title: "Kör és ellipszis",
      lead: "A kört középpont és sugár határozza meg. A Canvas arc() függvénye teljes körvonalat rajzolhat, az ellipse() különböző féltengelyeket is megenged.",
      hint: "Módosítsd a sugár értékét, az ellipszis féltengelyeit és a kitöltés színét."
    },
    en: {
      title: "Circle and ellipse",
      lead: "A circle is specified by its centre and radius. Canvas arc() can construct a complete circle; ellipse() also supports two different semi-axes.",
      hint: "Modify the radius, the semi-axes of the ellipse, and the fill colour."
    },
    source: `const center = { x: 260, y: 235 };
const radius = 110;

// Kitöltés és körvonal külön művelet.
ctx.beginPath();
ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
ctx.fillStyle = "#f6d48e";
ctx.fill();
drawCircle(ctx, center, radius, "#57bba0", 3);

// Ellipszis: vízszintes és függőleges féltengely.
ctx.beginPath();
ctx.ellipse(610, 235, 135, 75, 0, 0, 2 * Math.PI);
ctx.fillStyle = "#b28df2";
ctx.fill();
ctx.strokeStyle = "#ffe59c";
ctx.lineWidth = 3;
ctx.stroke();`
  },
  colors: {
    hu: {
      title: "Színek és kitöltés",
      lead: "A szín megadható névvel, hexadecimális formában vagy RGB(A)-összetevőkkel. A kitöltés és a körvonal külön beállítást használ; a vonal vastagságát a kód állítja.",
      hint: "Próbáld ki a fillStyle, strokeStyle és lineWidth értékeinek megváltoztatását!"
    },
    en: {
      title: "Colours and fills",
      lead: "Colours can be specified by name, hexadecimal code, or RGB(A) components. Fill and stroke have separate settings; the line width is set directly in code.",
      hint: "Experiment with fillStyle, strokeStyle and lineWidth."
    },
    source: `// Kék téglalap sárga körvonallal.
ctx.fillStyle = "rgb(0, 0, 255)";
ctx.fillRect(90, 90, 265, 180);
ctx.strokeStyle = "#f7ce61";
ctx.lineWidth = 4;
ctx.strokeRect(90, 90, 265, 180);

// Részben áttetsző magenta ellipszis.
ctx.beginPath();
ctx.ellipse(300, 190, 130, 88, 0, 0, 2 * Math.PI);
ctx.fillStyle = "rgba(255, 0, 255, 0.62)";
ctx.fill();
ctx.strokeStyle = "lime";
ctx.lineWidth = 2;
ctx.stroke();

// Színátmenet RGB(A)-összetevőkből.
for (let x = 0; x < 256; x++) {
  for (let y = 0; y < 75; y++) {
    putPixel(ctx, x + 455, y + 180,
      rgb({x}, {255 - x}, {y * 3}));
  }
}`.replaceAll('\u001c','`').replaceAll('\u001e','$').replaceAll('\u001d','`')
  },
  mouse: {
    hu: {
      title: "Egérkezelés",
      lead: "A téglalap a belsejében lenyomott egérgombbal megfogható, húzással áthelyezhető, a rajzterület fölött használt görgővel pedig átméretezhető. A példa a csatolt WinForms-program eseménykezelését követi.",
      hint: "Fogd meg a sárga téglalapot és mozgasd! A rajzterület fölött görgetve változtathatod a méretét. A forrásban az eseménykezelők külön függvények."
    },
    en: {
      title: "Mouse handling",
      lead: "The yellow rectangle can be grabbed by pressing inside it, moved by dragging, and resized with the mouse wheel over the drawing area. The example follows the event-handling logic of the supplied WinForms application.",
      hint: "Drag the yellow rectangle. Scroll over the canvas to resize it. The event handlers are separate functions in the source."
    },
    source: `const rect = {
  x: canvas.width / 2 - 50,
  y: canvas.height / 2 - 50,
  width: 100, height: 100
};
let isGrabbed = false;
let dx = 0;
let dy = 0;

function pointerPosition(event) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - bounds.left) * canvas.width / bounds.width,
    y: (event.clientY - bounds.top) * canvas.height / bounds.height
  };
}

function repaint() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f4d163";
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

function onDown(event) {
  const p = pointerPosition(event);
  if (p.x >= rect.x && p.x < rect.x + rect.width &&
      p.y >= rect.y && p.y < rect.y + rect.height) {
    isGrabbed = true;
    dx = p.x - rect.x;
    dy = p.y - rect.y;
    canvas.setPointerCapture(event.pointerId);
  }
}
function onMove(event) {
  if (!isGrabbed) return;
  const p = pointerPosition(event);
  rect.x = p.x - dx;
  rect.y = p.y - dy;
  repaint();
}
function onUp() { isGrabbed = false; }
function onWheel(event) {
  event.preventDefault();
  const inc = event.deltaY < 0 ? 12 : -12;
  rect.width = Math.max(20, rect.width + inc);
  rect.height = Math.max(20, rect.height + inc);
  repaint();
}

canvas.addEventListener("pointerdown", onDown);
canvas.addEventListener("pointermove", onMove);
canvas.addEventListener("pointerup", onUp);
canvas.addEventListener("pointercancel", onUp);
canvas.addEventListener("wheel", onWheel, { passive: false });
repaint();

// Újrafuttatáskor a régi eseménykezelőket eltávolítjuk.
return function cleanup() {
  canvas.removeEventListener("pointerdown", onDown);
  canvas.removeEventListener("pointermove", onMove);
  canvas.removeEventListener("pointerup", onUp);
  canvas.removeEventListener("pointercancel", onUp);
  canvas.removeEventListener("wheel", onWheel);
};`
  }
};
