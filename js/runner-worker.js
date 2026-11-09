// A worker isolates long-running student loops from the UI thread.
// This is a teaching sandbox, not a security boundary for untrusted third-party programs.
self.onmessage = ({data}) => {
  const {id,code,params,width,height} = data;
  try {
    if (typeof OffscreenCanvas !== 'function') throw new Error('OffscreenCanvas is not supported by this browser.');
    const canvas = new OffscreenCanvas(width,height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D drawing context is not available.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,width,height);
    // User code is only executed inside the worker, never in the host document.
    const invoke = new Function('ctx','params', '"use strict";\n' + code + '\nif (typeof draw !== "function") throw new Error("Define draw(ctx, params).");\ndraw(ctx, params);');
    invoke(ctx,Object.freeze({...params}));
    const bitmap = canvas.transferToImageBitmap();
    self.postMessage({id,type:'result',bitmap},[bitmap]);
  } catch (error) {
    self.postMessage({id,type:'error',message:String(error?.message || error),stack:String(error?.stack||'').split('\n').slice(0,3).join('\n')});
  }
};
