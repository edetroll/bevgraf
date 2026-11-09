function draw(ctx, params) {
    const p0 = { x: 100, y: 400 };
    const p1 = { x: 290, y: 90 + params.bend };
    const p2 = { x: 610, y: 495 - params.bend };
    const p3 = { x: 815, y: 130 };

    if (params.showControl) {
        ctx.strokeStyle = '#aebdd3';
        ctx.lineWidth = 2;
        ctx.setLineDash([7, 7]);
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Canvas provides this curve-drawing primitive.
    // Later we compute Bézier points with our own algorithm.
    ctx.strokeStyle = params.curveColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.bezierCurveTo(p1.x, p1.y,
                      p2.x, p2.y,
                      p3.x, p3.y);
    ctx.stroke();

    const controlPoints = [p0, p1, p2, p3];
    ctx.font = '18px system-ui';
    for (let i = 0; i < controlPoints.length; i++) {
        const p = controlPoints[i];
        ctx.beginPath();
        ctx.fillStyle = i === 0 || i === 3 ? '#245bea' : '#e57e36';
        ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#3e536f';
        ctx.fillText(`P${i}`, p.x + 12, p.y - 10);
    }
}
