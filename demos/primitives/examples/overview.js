function draw(ctx, params) {
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    const color = params.mainColor;

    // The grid is only a visual guide.
    if (params.showGrid) {
        ctx.strokeStyle = '#eaf0f7';
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (let y = 0; y < H; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }
    }

    ctx.font = '17px system-ui';
    ctx.fillStyle = '#4b5e76';
    ctx.lineWidth = params.lineWidth;

    // A logical pixel, enlarged so it is visible.
    ctx.fillText('fillRect()', 55, 61);
    ctx.fillStyle = color;
    ctx.fillRect(80, 105, 18, 18);
    ctx.fillRect(110, 105, 18, 18);
    ctx.fillRect(140, 125, 18, 18);
    ctx.fillRect(170, 145, 18, 18);

    // A line segment.
    ctx.fillStyle = '#4b5e76';
    ctx.fillText('moveTo() + lineTo()', 352, 61);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(350, 175);
    ctx.lineTo(575, 92);
    ctx.stroke();

    // A rectangle: fill and outline.
    ctx.fillStyle = '#4b5e76';
    ctx.fillText('fillRect() + strokeRect()', 644, 61);
    ctx.fillStyle = '#dbe8ff';
    ctx.fillRect(665, 96, 164, 83);
    ctx.strokeStyle = color;
    ctx.strokeRect(665, 96, 164, 83);

    // A polygon.
    ctx.fillStyle = '#4b5e76';
    ctx.fillText('closePath() + fill()', 55, 297);
    ctx.beginPath();
    ctx.moveTo(83, 442);
    ctx.lineTo(175, 342);
    ctx.lineTo(257, 440);
    ctx.closePath();
    ctx.fillStyle = '#dbe8ff';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();

    // A circular arc.
    ctx.fillStyle = '#4b5e76';
    ctx.fillText('arc()', 356, 297);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(454, 401, 63, -Math.PI / 2, 1.5 * Math.PI);
    ctx.stroke();

    // A cubic Bézier drawing primitive.
    ctx.fillStyle = '#4b5e76';
    ctx.fillText('bezierCurveTo()', 648, 297);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(654, 447);
    ctx.bezierCurveTo(700, 310, 765, 503, 840, 355);
    ctx.stroke();
}
