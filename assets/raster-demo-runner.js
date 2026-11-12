(function () {
'use strict';
const $=id=>document.getElementById(id);
function init(){
  const name=document.body.dataset.demo,example=window.BevGrafRasterExamples?.[name];
  if(!example)return;
  const editor=$('codeEditor'),layer=$('highlightedCode'),statusEl=$('runnerStatus'),top=$('idealCanvas'),bottom=$('gridCanvas');
  const workspace=$('demoWorkspace'),splitter=$('workspaceSplitter');
  editor.value=example.source;
  const status=(s,err=false)=>{statusEl.textContent=s;statusEl.classList.toggle('error',err);};
  const highlight=()=>{layer.innerHTML=window.BevGrafHighlight.highlight(editor.value);layer.parentElement.scrollTop=editor.scrollTop;layer.parentElement.scrollLeft=editor.scrollLeft;};
  editor.addEventListener('input',highlight);
  editor.addEventListener('scroll',()=>{layer.parentElement.scrollTop=editor.scrollTop;layer.parentElement.scrollLeft=editor.scrollLeft;});
  editor.addEventListener('keydown',e=>{
    if(e.key==='Tab'){e.preventDefault();editor.setRangeText('  ',editor.selectionStart,editor.selectionEnd,'end');highlight();}
    if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();run();}
  });
  $('editorBox').addEventListener('wheel',e=>{
    if(!e.ctrlKey&&!e.altKey)return;
    e.preventDefault();window.BevGrafSite.adjustCode(e.deltaY<0?1:-1);
  },{passive:false});
  let current=null;
  function run(){
    try{
      const pts=[];
      const ctx=bottom.getContext('2d');
      const putPixel=(_ctx,x,y,color)=>{
        if(!Number.isFinite(x)||!Number.isFinite(y))throw Error('Érvénytelen pixelkoordináta.');
        if(pts.length>=20000)throw Error('Túl sok képpont.');
        pts.push({x:Math.round(x),y:Math.round(y),color});
      };
      const program=new Function('ctx','putPixel','"use strict";\n'+editor.value+'\nreturn {\n  p0: typeof p0 === "undefined" ? null : p0,\n  p1: typeof p1 === "undefined" ? null : p1,\n  center: typeof center === "undefined" ? null : center,\n  radius: typeof radius === "undefined" ? null : radius\n};');
      const result=program(ctx,putPixel);
      const circle=name==='midpoint-circle';
      if(circle){
        if(!result.center||!Number.isInteger(result.radius)||result.radius<0||result.radius>100)throw Error('A középpont és a sugár hibás.');
        const {center,radius}=result;
        window.BevGrafRaster.idealCircle(top,center,radius,pts);
        window.BevGrafRaster.grid(bottom,pts,{x:center.x-radius,y:center.y-radius},{x:center.x+radius,y:center.y+radius});
      }else{
        const {p0,p1}=result;
        if(!p0||!p1||[p0.x,p0.y,p1.x,p1.y].some(x=>!Number.isFinite(x)))throw Error('A p0 és p1 végpontokat meg kell adni.');
        window.BevGrafRaster.line(top,p0,p1,pts);
        window.BevGrafRaster.grid(bottom,pts,p0,p1);
      }
      current={result,pts,circle};
      status((window.BevGrafSite.language==='hu'?'A program lefutott. Kiválasztott pontok: ':'Program executed. Pixel positions: ')+new Set(pts.map(p=>p.x+','+p.y)).size+'.');
    }catch(e){status((window.BevGrafSite.language==='hu'?'Hiba: ':'Error: ')+(e.message||String(e)),true);}
  }
  $('runCode').addEventListener('click',run);
  $('resetCode').addEventListener('click',()=>{editor.value=example.source;editor.scrollTop=0;highlight();run();});
  $('copyCode').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(editor.value);status('Másolva.');}
    catch(e){editor.focus();editor.select();status('Ctrl+C');}
  });
  const title=$('demoHeading');
  function setTitle(){const lang=window.BevGrafSite.language;title.textContent=example[lang].title;document.title=title.textContent+' – Bevezetés a számítógépi grafikába';}
  document.addEventListener('bevgraf:settings',()=>{setTitle();if(current){const r=current.result,p=current.pts;if(current.circle){window.BevGrafRaster.idealCircle(top,r.center,r.radius,p);window.BevGrafRaster.grid(bottom,p,{x:r.center.x-r.radius,y:r.center.y-r.radius},{x:r.center.x+r.radius,y:r.center.y+r.radius});}else{window.BevGrafRaster.line(top,r.p0,r.p1,p);window.BevGrafRaster.grid(bottom,p,r.p0,r.p1);}}});
  if(splitter){let active=false;
    splitter.addEventListener('pointerdown',e=>{if(window.innerWidth<=1120)return;active=true;splitter.setPointerCapture(e.pointerId);});
    splitter.addEventListener('pointermove',e=>{if(!active)return;const w=workspace.getBoundingClientRect().width;const size=Math.min(w-320,Math.max(340,e.clientX-workspace.getBoundingClientRect().left));workspace.style.gridTemplateColumns=`${size}px 10px minmax(310px,1fr)`;});
    splitter.addEventListener('pointerup',()=>{active=false;});
    splitter.addEventListener('pointercancel',()=>{active=false;});
    splitter.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const w=workspace.getBoundingClientRect().width;const pane=workspace.querySelector('.demo-pane').getBoundingClientRect().width;const size=Math.min(w-320,Math.max(340,pane+(e.key==='ArrowRight'?24:-24)));workspace.style.gridTemplateColumns=`${size}px 10px minmax(310px,1fr)`;});
  }
  highlight();setTitle();run();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
