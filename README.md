## 3. változat – 2026. november 9.

A demók teljes képernyőmagasságú szerkesztő + rajzterület nézetben futnak, bal oldali menü, fölösleges leírás és utólagos példalista nélkül. A tananyag 1.1–1.6 számozott alfejezetet, szűkített középső tartalmat és jobb oldali tartalomjegyzéket tartalmaz. A Canvas háttér világos témában fehér, sötét/kisegítő módokban fekete.

# Bevezetés a számítógépi grafikába – webes tananyag

Az első fejezet: **Grafikus primitívek JavaScriptben**. A régi C# WinForms `01_Primitives` és `02_MouseHandling` példái alapján készült, böngészőben futtatható változat.

## Indítás

Nyisd meg az `index.html` fájlt egy korszerű böngészőben. Nincs szerverfüggőség és nincsenek külső JavaScript- vagy CSS-könyvtárak. GitHub Pages-re a mappát változatlanul fel lehet tölteni.

## Tartalom

- `index.html` – az 1. fejezet, **A fejezet tartalma** hivatkozásokkal.
- `demos/pixel/index.html` – képpont, 256 × 256-os képpontminta.
- `demos/line/index.html` – szakaszrajzolás két végpontból.
- `demos/circle/index.html` – kör, ellipszis.
- `demos/colors/index.html` – RGB/RGBA-színek, kitöltés, vonalvastagság.
- `demos/mouse/index.html` – a téglalap húzása és méretezése görgővel.
- `assets/graphics.js` – `putPixel`, `drawLine` és `drawCircle` segédfüggvények.
- `assets/examples.js` – a különálló demók forrása, itt módosítható.
- `assets/highlight.js` – offline szintaxiskiemelő, a szerkesztő színeit a téma határozza meg.
- `assets/site.js` – nyelv, stílus, kontrasztmód, betűméret, fejezetnavigáció.
- `assets/logo.svg`, `assets/favicon.svg` – vektoros logó és favicon.

## Megjelenítés

- A **téma** gomb a világos és sötét színt váltja.
- A külön **Kontraszt** gomb szabványkövető, nagy kontrasztú, fekete hátterű akadálymentes színsémára vált; független a témától.
- A `HU` gombbal az angol felületre lehet váltani; a következő kattintás visszavált.
- `A−`, `A+` a tananyagszöveg vagy a kód betűméretét módosítják, külön.
- **Ctrl + egérgörgő** a tananyag fölött a szöveg betűméretét, a kódszerkesztő fölött pedig a kód betűméretét állítja. A szerkesztőn az **Alt + egérgörgő** is működik. Egyszerű görgetéssel a hosszú kód scrollozható.
- A demókon a **Futtatás** gomb vagy **Ctrl+Enter** futtatja a módosított forrást.
- A kód és a rajzterület osztóvonala egérrel húzható asztali nézetben.
- A téma, a nyelv, a kontrasztmód és a méretek böngészőben megőrződnek, ha a tárolás engedélyezett.

## Tananyag bővítése

Az `assets/site.js` fájl `CHAPTERS` tömbjében további fejezetek rögzíthetők. A bal oldalsáv fix magasságú és önállóan görgethető. A következő fejezetekhez külön HTML-fájl hozható létre; jelenleg csak az első létezik, így előrehaladott demók nem láthatók.

Az `assets/graphics.js` függvényei a Canvas API-ra épülő kényelmi segédek. A későbbi raszteres algoritmusokat (például DDA, Bresenham) célszerű ezektől megkülönböztetve, saját képpontszámítással bevezetni.
