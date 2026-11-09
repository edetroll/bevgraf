export const words = {
  hu: {
    courseShort:'Számítógépi grafika',courseType:'Interaktív tananyag',language:'Nyelv',appearance:'Megjelenés',
    light:'Világos',dark:'Sötét',contrast:'Nagy kontraszt',chapters:'FEJEZETEK',onThisPage:'EZEN AZ OLDALON',
    courseFooter:'Bevezetés a számítógépi grafikába · 1. verzió',introTag:'BEVEZETŐ FEJEZET',
    footerNote:'A példák a böngésző natív Canvas 2D API-ját használják.',back:'Vissza a tananyaghoz',
    example:'Példa',resetCode:'Kód visszaállítása',run:'Futtatás',output:'Eredmény',shortcut:'Ctrl / ⌘ + Enter: futtatás',
    editorHelp:'A <code>draw(ctx, params)</code> függvényt szerkesztheted. A Futtatás gomb újrarajzolja a képet.',
    canvasNote:'Koordináták a Canvas belső rajzterületén.',parameters:'Paraméterek',resetParameters:'Alaphelyzet',
    parametersIntro:'A módosítás után a kép automatikusan frissül.',safety:'Futtatási korlát: 3 s · helyi böngészős végrehajtás',
    ready:'Készen áll',running:'Rajzolás...',success:'Sikeres futtatás',timedOut:'Futási idő túllépve (3 s). Ellenőrizd a ciklusokat.',
    missingWorker:'A böngésző nem támogatja a szükséges grafikus Worker-funkciókat.',loadError:'Nem sikerült betölteni a fájlokat.',
    menuOpen:'Menü megnyitása',menuClose:'Menü bezárása'
  },
  en: {
    courseShort:'Computer graphics',courseType:'Interactive course',language:'Language',appearance:'Appearance',
    light:'Light',dark:'Dark',contrast:'High contrast',chapters:'CHAPTERS',onThisPage:'ON THIS PAGE',
    courseFooter:'Introduction to Computer Graphics · version 1',introTag:'INTRODUCTORY CHAPTER',
    footerNote:'Examples use the browser’s native Canvas 2D API.',back:'Back to course',
    example:'Example',resetCode:'Reset code',run:'Run',output:'Output',shortcut:'Ctrl / ⌘ + Enter: run',
    editorHelp:'Edit the <code>draw(ctx, params)</code> function. Click Run to redraw the canvas.',
    canvasNote:'Coordinates in the internal Canvas drawing space.',parameters:'Parameters',resetParameters:'Reset',
    parametersIntro:'Changing a parameter immediately refreshes the drawing.',safety:'Execution limit: 3 s · local browser execution',
    ready:'Ready',running:'Rendering...',success:'Completed',timedOut:'Execution timed out (3 s). Check your loops.',
    missingWorker:'This browser does not support the required graphics Worker features.',loadError:'Could not load the files.',
    menuOpen:'Open navigation',menuClose:'Close navigation'
  }
};
export function getLanguage(){
  const url = new URL(location.href); const query = url.searchParams.get('lang');
  if (query === 'hu' || query === 'en') return query;
  try { return localStorage.getItem('bevgraf-lang') === 'en' ? 'en' : 'hu'; } catch { return 'hu'; }
}
export function setLanguage(lang){
  if(lang !== 'hu' && lang !== 'en') return;
  try {localStorage.setItem('bevgraf-lang',lang);}catch{}
  const u=new URL(location.href);u.searchParams.set('lang',lang);history.replaceState(null,'',u);
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const value=words[lang][el.dataset.i18n];if(value !== undefined) el.innerHTML=value;
  });
  const select=document.querySelector('#languageSelect');if(select)select.value=lang;
}
export function getTheme(){try{return ['light','dark','contrast'].includes(localStorage.getItem('bevgraf-theme'))?localStorage.getItem('bevgraf-theme'):'light';}catch{return 'light';}}
export function setTheme(theme){
  if(!['light','dark','contrast'].includes(theme))return;
  document.documentElement.dataset.theme=theme;
  try{localStorage.setItem('bevgraf-theme',theme);}catch{}
  const select=document.querySelector('#themeSelect');if(select)select.value=theme;
}
export function initThemeSelect(){setTheme(getTheme());document.querySelector('#themeSelect')?.addEventListener('change',e=>setTheme(e.target.value));}
export async function loadJson(url){const res=await fetch(url);if(!res.ok)throw new Error(`${res.status}: ${url}`);return await res.json();}
export async function loadText(url){const res=await fetch(url);if(!res.ok)throw new Error(`${res.status}: ${url}`);return await res.text();}
export function localized(obj,lang){return typeof obj==='string'?obj:(obj?.[lang] ?? obj?.hu ?? '');}
export function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
