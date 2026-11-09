/* Egységes, két végpontra épülő segédfüggvények.
   A Canvas API-ra épülnek, önmagukban nem raszteres algoritmusok. */
(function () {
  "use strict";

  function putPixel(ctx, x, y, color = "#ffffff") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }

  function drawLine(ctx, p0, p1, color = "#ffffff", width = 1) {
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function drawCircle(ctx, center, radius, color = "#ffffff", width = 1) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  window.BevGraf = Object.freeze({ putPixel, drawLine, drawCircle });
})();
