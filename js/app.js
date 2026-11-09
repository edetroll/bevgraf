import {words,getLanguage,setLanguage,initThemeSelect,loadJson,loadText,localized,escapeHtml} from './common.js';
import {parseMarkdown} from './markdown.js';
let manifest;let lang=getLanguage();
const article=document.querySelector('#article');
const chaptersEl=document.querySelector('#chapterNav');
const sectionsEl=document.querySelector('#sectionNav');
const sidebar=document.querySelector('#sidebar');
const overlay=document.querySelector('#mobileOverlay');
const menu=document.querySelector('#menuToggle');
function closeNav(){sidebar.classList.remove('open');overlay.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',words[lang].menuOpen);}
function toggleNav(){const open=!sidebar.classList.contains('open');sidebar.classList.toggle('open',open);overlay.hidden=!open;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',words[lang][open?'menuClose':'menuOpen']);}
menu.addEventListener('click',toggleNav);overlay.addEventListener('click',closeNav);
function chapterId(){return new URL(location.href).searchParams.get('chapter')||manifest.chapters[0].id;}
async function render(){
  const item=manifest.chapters.find(c=>c.id===chapterId())||manifest.chapters[0];
  const source=localized(item.source,lang);
  document.querySelector('#chapterTag').textContent = `${item.number}. ${lang === 'hu' ? 'FEJEZET' : 'CHAPTER'}`;
  chaptersEl.innerHTML=manifest.chapters.map(ch=>`<a class="chapter-link ${ch.id===item.id?'active':''}" href="index.html?chapter=${encodeURIComponent(ch.id)}&lang=${lang}"><span class="chapter-number">${escapeHtml(ch.number)}</span><span>${escapeHtml(localized(ch.title,lang))}</span></a>`).join('');
  try{
    const md=await loadText(source);const parsed=parseMarkdown(md,{sourcePath:source,lang});article.innerHTML=parsed.html;
    sectionsEl.innerHTML=parsed.headings.filter(h=>h.level===2||h.level===3).map(h=>`<a class="section-link level-${h.level}" href="#${h.id}">${escapeHtml(h.title)}</a>`).join('');
    document.title=`${localized(item.title,lang)} · ${localized(manifest.course,lang)}`;
    if(location.hash){const id=decodeURIComponent(location.hash.slice(1));setTimeout(()=>document.getElementById(id)?.scrollIntoView(),50);}
    if(window.MathJax?.typesetPromise)window.MathJax.typesetPromise([article]).catch(()=>{});
  }catch(e){article.innerHTML=`<p class="error-note">${escapeHtml(words[lang].loadError)}<br>${escapeHtml(e.message)}</p>`;}
}
document.addEventListener('mathjax-ready', () => {
  if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([article]).catch(()=>{});
});
async function start(){
  setLanguage(lang);initThemeSelect();
  document.querySelector('#languageSelect').addEventListener('change',async e=>{lang=e.target.value;setLanguage(lang);await render();closeNav();});
  try{manifest=await loadJson('manifest.json');await render();}
  catch(e){article.innerHTML=`<p class="error-note">${escapeHtml(words[lang].loadError)} ${escapeHtml(e.message)}</p>`;}
}
start();
