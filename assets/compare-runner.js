(function(){
'use strict';
const $=id=>document.getElementById(id);
const algorithms=[['inc',window.BevGrafRaster.incremental],['dda',window.BevGrafRaster.dda],['mid',window.BevGrafRaster.midpoint]];
const presets={steep:[2,2,5,11],half:[1,2,17,10],shallow:[2,3,18,9],negative:[2,11,18,3],vertical:[10,1,10,12]};
let current=[...presets.steep];
function render(){
 const [x0,y0,x1,y1]=current,a={x:x0,y:y0},b={x:x1,y:y1};
 if(current.some(v=>!Number.isInteger(v)||v<0||v>19)||y0>13||y1>13){$('compareStatus').textContent='A koordináták kívül esnek a megjelenített tartományon.';return;}
 const fixed={xmin:0,xmax:19,ymin:0,ymax:13};
 let results=[];
 for(const [key,fn] of algorithms){
  const outcome=fn(a,b);const pts=outcome.pixels;
  window.BevGrafRaster.grid($(key+'Canvas'),pts,a,b,{fixed});
  $(key+'Count').textContent=outcome.unsupported? (window.BevGrafSite.language==='hu'?'nem értelmezett':'not defined') : pts.length+' px';
  results.push({key,pts,unsupported:outcome.unsupported});
 }
 const tieDiff=JSON.stringify(results[1].pts)!==JSON.stringify(results[2].pts);
 const inc=results[0];
 const lang=window.BevGrafSite.language;
 let desc='';
 if(inc.unsupported)desc=lang==='hu'?'A növekményes x-szerinti módszer függőleges szakaszra nem értelmezett.':'The x-based incremental method is undefined for vertical segments.';
 else if(Math.abs(y1-y0)>Math.abs(x1-x0))desc=lang==='hu'?'A növekményes módszer meredek szakasznál kihagy pixelsorokat.':'The incremental method skips pixel rows on steep segments.';
 else if(tieDiff)desc=lang==='hu'?'A DDA és a Midpoint eltérése itt a félpixeles döntetlenekből adódik.':'DDA and Midpoint differ here due to exact half-pixel ties.';
 else desc=lang==='hu'?'A módszerek képe itt nagyrészt megegyezik; az eltérésük a számításban van.':'The rasterised lines largely match; their computation differs.';
 $('compareStatus').textContent=desc;
}
function init(){
 const fields=['x0','y0','x1','y1'].map($);
 function set(vals){current=vals;fields.forEach((el,i)=>el.value=vals[i]);render();}
 $('presetSelect').addEventListener('change',e=>{if(e.target.value==='custom')return;set(presets[e.target.value]);});
 fields.forEach((field,i)=>field.addEventListener('input',()=>{
   const v=Number(field.value);if(!Number.isInteger(v))return;
   current[i]=v;$('presetSelect').value='custom';render();
 }));
 document.addEventListener('bevgraf:settings',render);
 set(presets.steep);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
