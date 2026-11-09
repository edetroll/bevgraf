# Bevezetés a számítógépi grafikába — webes tananyag, v1

Első, működő prototípus: magyar/angol tananyag, 3 megjelenési mód, reszponzív felület és egy önálló, szerkeszthető Canvas 2D demonstráció öt választható példával.

## Indítás

GitHub Pages-re a mappa **tartalmát** másold fel a tároló gyökerébe. A nyitólap az `index.html`, a demonstráció a `demo.html?demo=primitives` címen érhető el.

Helyi teszteléshez indíts statikus webszervert ebben a mappában:

```bash
python3 -m http.server 8000
```

Majd nyisd meg: <http://localhost:8000/>. A böngésző biztonsági korlátozásai miatt a `file://`-ból történő közvetlen megnyitás nem támogatott (JSON/Markdown betöltés és Web Worker).

## Új fejezet hozzáadása

1. Hozz létre egy könyvtárat a `chapters/` alatt, benne egy `hu.md` és `en.md` fájllal, opcionális `media/` mappával.
2. A `manifest.json` `chapters` tömbjéhez adj hozzá egy új bejegyzést (ID, sorszám, címpárok, Markdown-fájlok útvonalai).
3. A menü és az alfejezet-navigáció automatikusan frissül; a `##` és `###` címsorokból lesznek az oldalsáv alfejezetei.

## Új demonstráció hozzáadása

1. Hozz létre egy `demos/<demo-id>/config.json` konfigurációt a `primitives/config.json` mintájára.
2. A konfiguráció `examples` tömbjében add meg a fájlokat, a kétnyelvű címkéket, a paraméterek típusait és alapértékeit.
3. Minden példa önálló JavaScript-fájl, benne `function draw(ctx, params) { ... }` függvénnyel.
4. A Markdownba tegyél egy `demo.html?demo=<demo-id>` linket: a közös demonstrációs felület automatikusan az új konfigurációt tölti be.

Támogatott vezérlők a jelenlegi motorban: `range`, `number`, `checkbox`, `color`. A kód a böngészőben elmentődik külön példánként; a paraméterek szintén. A **Kód visszaállítása** és **Alaphelyzet** ezeket visszaállítja.

## Technológia

Natív HTML, CSS és JavaScript; nincs build lépés, keretrendszer vagy külön backend. A grafikai algoritmusok `OffscreenCanvas`-t használó **Web Workerben** futnak; a rajz `ImageBitmap`-ként kerül a fő oldalra. A végtelen ciklusokat 3 másodperc után a motor megszakítja. Ez nem szigorú biztonsági sandbox ismeretlen eredetű kód futtatásához: ne tölts be harmadik féltől származó, nem ellenőrzött kódokat.

A szöveg minimális, helyben írt Markdown-renderert használ (`js/markdown.js`): címsor, bekezdés, félkövér/dőlt, kép, hivatkozás, idézet, lista és kódblokk támogatott. Összetettebb Markdown-igény esetén ez a modul szabványos parserre cserélhető a tartalmi fájlok módosítása nélkül.

A matematikai képletek renderelését a MathJax 4 biztosítja **CDN-en keresztül**. A képletekhez ezért internetkapcsolat szükséges. Később a megfelelő MathJax-disztribúció saját tárhelyen is üzemeltethető.

A kódszerkesztő jelenleg egy beépített, tabulátort és sorszámozást támogató `<textarea>` (Ctrl/⌘+Enter futtatás). A későbbi CodeMirror integrációhoz a `js/demo.js` szerkesztőadaptere cserélhető; a demófájlok ettől függetlenek.

## Megjegyzések

- A jelenlegi példák az alaprajzoló műveleteket ismertetik. A Bézier-példa a Canvas beépített `bezierCurveTo` primitívjét mutatja be, nem a később tanítandó Bézier-algoritmust.
- A világos, sötét és nagy kontrasztú témák, valamint a nyelvválasztás a böngésző helyi tárhelyében tárolódnak.
- Mobilon a grafikus eredmény a kódszerkesztő fölé kerül. Asztali gépen az elválasztóvonal egérrel húzható.
