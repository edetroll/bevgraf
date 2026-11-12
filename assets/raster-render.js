/* Közös raszterizálási modellek és rajzmegjelenítés. A kódmentes összehasonlító demó is ezeket használja. */
(function () {
  'use strict';
  function canon(a,b) { return a.x > b.x || (a.x === b.x && a.y > b.y) ? [b,a] : [a,b]; }
  function pixel(x,y) { return {x:Math.round(x),y:Math.round(y)}; }
  function incremental(a,b) {
    [a,b] = canon(a,b);
    if (a.x === b.x) return {pixels:[],unsupported:true};
    const n = b.x-a.x, dy = (b.y-a.y)/n, arr=[];
    let y=a.y;
    for (let i=0;i<=n;i++){arr.push(pixel(a.x+i,y));y+=dy;}
    return {pixels:arr,unsupported:false};
  }
  function dda(a,b) {
    [a,b] = canon(a,b);
    const dx=b.x-a.x, dy=b.y-a.y, n=Math.max(Math.abs(dx),Math.abs(dy));
    if(n===0) return {pixels:[pixel(a.x,a.y)]};
    const ax=dx/n, ay=dy/n, arr=[];
    let x=a.x,y=a.y;
    arr.push(pixel(x,y));
    for(let i=1;i<=n;i++){x+=ax;y+=ay;arr.push(pixel(x,y));}
    return {pixels:arr};
  }
  function midpoint(a,b) {
    [a,b] = canon(a,b);
    const dx=b.x-a.x,dy=b.y-a.y;
    const sx=Math.sign(dx), sy=Math.sign(dy);
    const steep=Math.abs(dy)>Math.abs(dx);
    const major=Math.max(Math.abs(dx),Math.abs(dy)), minor=Math.min(Math.abs(dx),Math.abs(dy));
    let x=a.x,y=a.y,d=major-2*minor;
    const arr=[pixel(x,y)];
    for(let i=1;i<=major;i++) {
      if(d<0){if(steep)x+=sx;else y+=sy;d+=2*(major-minor);}
      else d-=2*minor;
      if(steep)y+=sy;else x+=sx;
      arr.push(pixel(x,y));
    }
    return {pixels:arr};
  }
  function color(varname,fallback) {
    const v=getComputedStyle(document.documentElement).getPropertyValue(varname).trim();
    return v||fallback;
  }
  function colors(){return {bg:color('--canvas-bg','#fff'),grid:color('--border','#dce2ea'),text:color('--text','#202938'),muted:color('--muted','#586579'),primary:color('--primary','#28549b'),accent:color('--accent','#335fa8'),pixel:color('--raster-pixel','#b16a39')};}
  const backdrop=(ctx,w,h,c)=>{ctx.fillStyle=c.bg;ctx.fillRect(0,0,w,h);};
  function view(points,a,b,opts={}) {
    if(opts.fixed) return opts.fixed;
    const xs=[...(points||[]).map(p=>p.x),a.x,b.x],ys=[...(points||[]).map(p=>p.y),a.y,b.y];
    const xmin=Math.min(0,...xs)-1,xmax=Math.max(19,...xs)+1;
    const ymin=Math.min(0,...ys)-1,ymax=Math.max(13,...ys)+1;
    return {xmin,xmax,ymin,ymax};
  }
  function layout(canvas,area) {
    const {width:w,height:h}=canvas;
    const cols=area.xmax-area.xmin+1, rows=area.ymax-area.ymin+1;
    const step=Math.max(1,Math.min((w-40)/cols,(h-36)/rows));
    const left=(w-cols*step)/2,top=(h-rows*step)/2;
    const center=(x,y)=>[left+(x-area.xmin+.5)*step,top+(area.ymax-y+.5)*step];
    return {step,left,top,cols,rows,center};
  }
  function line(canvas,a,b,pts=[],opts={}){
    const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,c=colors();
    backdrop(ctx,w,h,c);
    const v=view(pts,a,b,opts),grid=layout(canvas,v);
    const [x0,y0]=grid.center(a.x,a.y),[x1,y1]=grid.center(b.x,b.y);
    ctx.strokeStyle=c.accent;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();
    ctx.fillStyle=c.pixel;
    for(const [x,y] of [[x0,y0],[x1,y1]]){ctx.beginPath();ctx.arc(x,y,5,0,2*Math.PI);ctx.fill();}
    ctx.font='15px system-ui';ctx.fillStyle=c.text;
    ctx.fillText(`P₀ (${a.x}; ${a.y})`,Math.max(5,x0-14),Math.max(19,y0-12));
    ctx.fillText(`P₁ (${b.x}; ${b.y})`,Math.min(w-115,x1+10),Math.max(19,y1-10));
  }
  function grid(canvas,pts,a,b,opts={}) {
    const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,c=colors();
    backdrop(ctx,w,h,c);
    const area=view(pts,a,b,opts),g=layout(canvas,area);
    for(const p of pts||[]) {
      const [x,y]=g.center(p.x,p.y);
      ctx.fillStyle=p.color || c.pixel;ctx.globalAlpha=.72;
      ctx.fillRect(x-g.step/2+1,y-g.step/2+1,Math.max(1,g.step-2),Math.max(1,g.step-2));
    }
    ctx.globalAlpha=1;
    ctx.strokeStyle=c.grid;ctx.lineWidth=.9;
    for(let i=0;i<=g.cols;i++){const x=g.left+i*g.step;ctx.beginPath();ctx.moveTo(x,g.top);ctx.lineTo(x,g.top+g.rows*g.step);ctx.stroke();}
    for(let i=0;i<=g.rows;i++){const y=g.top+i*g.step;ctx.beginPath();ctx.moveTo(g.left,y);ctx.lineTo(g.left+g.cols*g.step,y);ctx.stroke();}
    // The mathematical segment passes through the centres of the ideal endpoint pixels.
    const [x0,y0]=g.center(a.x,a.y),[x1,y1]=g.center(b.x,b.y);
    ctx.strokeStyle=c.accent;ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=c.text;
    for(const [x,y] of [[x0,y0],[x1,y1]]) {ctx.beginPath();ctx.arc(x,y,Math.max(2,g.step*.10),0,2*Math.PI);ctx.fill();}
  }
  function idealCircle(canvas,center,r,points=[]) {
    const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,c=colors(); backdrop(ctx,w,h,c);
    const area=view(points,{x:center.x-r,y:center.y-r},{x:center.x+r,y:center.y+r}),g=layout(canvas,area);
    const [x,y]=g.center(center.x,center.y);
    ctx.beginPath();ctx.arc(x,y,r*g.step,0,2*Math.PI);ctx.strokeStyle=c.accent;ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle=c.pixel;ctx.beginPath();ctx.arc(x,y,4,0,2*Math.PI);ctx.fill();
    ctx.fillStyle=c.text;ctx.font='16px system-ui';ctx.fillText('R = '+r,Math.min(w-80,x+r*g.step/2),Math.max(24,y-r*g.step*.7));
  }
  window.BevGrafRaster={incremental,dda,midpoint,line,grid,idealCircle,canon};
})();
