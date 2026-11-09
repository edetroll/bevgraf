import {words,getLanguage,setLanguage,getTheme,setTheme,initThemeSelect,loadJson,loadText,localized,escapeHtml} from './common.js';
let lang=getLanguage(), config, activeExample, originalCode='', params={}, worker=null,timeout=null,runId=0;
let examplesCache=new Map();
const $=(id)=>document.getElementById(id);
const code=$('codeEditor');const status=$('runStatus');const canvas=$('resultCanvas');
const ctx=canvas.getContext('2d');
const workspace=$('workspace');
const demoId=(new URL(location.href)).searchParams.get('demo')||'primitives';
const safeDemoId=/^[a-z0-9-]+$/.test(demoId)?demoId:'primitives';
function storage(key){return `bevgraf-demo-${safeDemoId}-${key}`;}
function getSaved(key){try{return localStorage.getItem(storage(key));}catch{return null;}}
function save(key,value){try{localStorage.setItem(storage(key),value);}catch{}}
function delSaved(key){try{localStorage.removeItem(storage(key));}catch{}}
function updateLineNumbers(){const count=code.value.split('\n').length;$('lineNumbers').textContent=Array.from({length:count},(_,i)=>i+1).join('\n');$('lineNumbers').scrollTop=code.scrollTop;}
function setStatus(kind,text){status.className=`status ${kind}`;status.textContent=text;}
function showError(message){const el=$('errorPanel');el.hidden=false;el.textContent=message;}
function clearError(){$('errorPanel').hidden=true;$('errorPanel').textContent='';}
function refreshText(){
  setLanguage(lang);
  $('demoTitle').textContent=localized(config.title,lang);
  $('exampleSelect').innerHTML=config.examples.map(ex=>`<option value="${escapeHtml(ex.id)}">${escapeHtml(localized(ex.label,lang))}</option>`).join('');
  if(activeExample){$('exampleSelect').value=activeExample.id;$('exampleDescription').textContent=localized(activeExample.description,lang);renderParams();}
  $('backLink').href=`index.html?chapter=${encodeURIComponent(config.backChapter)}&lang=${lang}`;
  document.title=`${localized(config.title,lang)} · Demo`;
}
function paramKey(){return `params-${activeExample.id}`;}
function loadParams(ex){
  const defaults=Object.fromEntries((ex.parameters||[]).map(p=>[p.id,p.value]));
  try{const stored=JSON.parse(getSaved(`params-${ex.id}`)||'null');return stored&&typeof stored==='object'?{...defaults,...stored}:defaults;}
  catch{return defaults;}
}
function renderParams(){
  const container=$('parameterFields');container.innerHTML='';
  for (const field of activeExample.parameters||[]) {
    const wrap=document.createElement('div');wrap.className='param-field';
    const controlId=`param-${field.id}`;
    let input;
    if(field.type==='checkbox'){
      const label=document.createElement('label');label.className='param-check';label.htmlFor=controlId;
      input=document.createElement('input');input.type='checkbox';input.id=controlId;input.checked=Boolean(params[field.id]);
      const span=document.createElement('span');span.textContent=localized(field.label,lang);label.append(input,span);wrap.appendChild(label);
    } else {
      const line=document.createElement('div');line.className='param-inline';
      const label=document.createElement('label');label.htmlFor=controlId;label.textContent=localized(field.label,lang);line.appendChild(label);
      const out=document.createElement('output');out.textContent=String(params[field.id]);if(field.type==='range')line.appendChild(out);
      wrap.appendChild(line);
      input=document.createElement('input');input.type=field.type;input.id=controlId;input.value=params[field.id];
      if(field.min!==undefined)input.min=field.min;
      if(field.max!==undefined)input.max=field.max;
      if(field.step!==undefined)input.step=field.step;
      wrap.appendChild(input);
    }
    const listener=()=>{
      params[field.id]=field.type==='checkbox'?input.checked:(field.type==='range'||field.type==='number'?Number(input.value):input.value);
      const out=wrap.querySelector('output');if(out)out.textContent=String(params[field.id]);
      save(paramKey(),JSON.stringify(params));run();
    };
    input.addEventListener(field.type==='range'||field.type==='color'?'input':'change',listener);
    container.appendChild(wrap);
  }
}
async function selectExample(id){
  const ex=config.examples.find(e=>e.id===id)||config.examples[0];
  activeExample=ex;
  if(!examplesCache.has(ex.id))examplesCache.set(ex.id,await loadText(ex.file));
  originalCode=examplesCache.get(ex.id);
  code.value=getSaved(`code-${ex.id}`)??originalCode;
  code.scrollTop=0;updateLineNumbers();
  params=loadParams(ex);
  refreshText();run();
}
function stopWorker(){if(timeout!==null){clearTimeout(timeout);timeout=null;}if(worker){worker.terminate();worker=null;}}
function run(){
  if(!activeExample)return;
  stopWorker();clearError();setStatus('running',words[lang].running);
  const thisRun=++runId;
  let task;
  try{task=new Worker(new URL('./runner-worker.js',import.meta.url));worker=task;}
  catch(error){showError(error.message);setStatus('error','Error');return;}
  task.onmessage=({data})=>{
    if(thisRun!==runId)return;
    stopWorker();
    if(data.type==='error'){
      setStatus('error','Error');showError(data.message);return;
    }
    if(data.bitmap){
      canvas.width=config.width;canvas.height=config.height;
      ctx.drawImage(data.bitmap,0,0);
      if(typeof data.bitmap.close==='function')data.bitmap.close();
    }
    setStatus('ok',words[lang].success);
  };
  task.onerror=(error)=>{if(thisRun!==runId)return;stopWorker();setStatus('error','Error');showError(error.message||'Worker error');};
  timeout=setTimeout(()=>{if(thisRun!==runId)return;stopWorker();setStatus('error','Timeout');showError(words[lang].timedOut);},3000);
  task.postMessage({id:thisRun,code:code.value,params:{...params},width:config.width,height:config.height});
}
function initSplitter(){
  const splitter=$('splitter');const widthPct=Number(getSaved('split-width')||50);
  function setPct(p){const n=Math.max(28,Math.min(72,p));workspace.style.setProperty('--editor-percent',`${n}%`);splitter.setAttribute('aria-valuenow',String(Math.round(n)));save('split-width',String(n));}
  setPct(widthPct);
  let dragging=false;
  splitter.addEventListener('pointerdown',e=>{dragging=true;splitter.setPointerCapture(e.pointerId);e.preventDefault();});
  splitter.addEventListener('pointermove',e=>{if(!dragging)return;const rect=workspace.getBoundingClientRect();setPct(((e.clientX-rect.left)/rect.width)*100);});
  splitter.addEventListener('pointerup',()=>dragging=false);
  splitter.addEventListener('pointercancel',()=>dragging=false);
  splitter.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setPct(Number(splitter.getAttribute('aria-valuenow'))+(e.key==='ArrowRight'?3:-3));}});
}
async function start(){
  initThemeSelect();setLanguage(lang);initSplitter();
  $('languageSelect').addEventListener('change',e=>{lang=e.target.value;refreshText();setStatus('ok',words[lang].ready);});
  $('exampleSelect').addEventListener('change',e=>selectExample(e.target.value));
  $('runButton').addEventListener('click',run);
  $('resetCode').addEventListener('click',()=>{if(!activeExample)return;delSaved(`code-${activeExample.id}`);code.value=originalCode;updateLineNumbers();run();});
  $('resetParams').addEventListener('click',()=>{if(!activeExample)return;delSaved(paramKey());params=loadParams(activeExample);renderParams();run();});
  code.addEventListener('input',()=>{updateLineNumbers();if(activeExample)save(`code-${activeExample.id}`,code.value);});
  code.addEventListener('scroll',updateLineNumbers);
  code.addEventListener('keydown',e=>{
    if(e.key==='Tab'){
      e.preventDefault();const pos=code.selectionStart;code.setRangeText('    ',pos,code.selectionEnd,'end');code.dispatchEvent(new Event('input'));
    }
    if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();run();}
  });
  canvas.addEventListener('pointermove',e=>{
    const r=canvas.getBoundingClientRect();const x=Math.round((e.clientX-r.left)*canvas.width/r.width);const y=Math.round((e.clientY-r.top)*canvas.height/r.height);
    $('coordReadout').textContent=`x: ${x}, y: ${y}`;
  });
  canvas.addEventListener('pointerleave',()=>{$('coordReadout').textContent='x: –, y: –';});
  try{
    config=await loadJson(`demos/${safeDemoId}/config.json`);
    canvas.width=config.width;canvas.height=config.height;
    $('canvasSize').textContent=`${config.width} × ${config.height} px`;
    const sel=new URL(location.href).searchParams.get('example');
    await selectExample(sel);
  }catch(error){setStatus('error','Error');showError(`${words[lang].loadError}\n${error.message}`);}
}
window.addEventListener('beforeunload',stopWorker);
start();
