function draw(ctx, params) {
    const cx = 455, cy = 275;
    const r = params.radius;
    const start = 0;
    const end = params.endAngle * Math.PI / 180;

    ctx.strokeStyle = '#d5e0ef';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 200, cy);
    ctx.lineTo(cx + 200, cy);
    ctx.moveTo(cx, cy - 200);
    ctx.lineTo(cx, cy + 200);
    ctx.stroke();

    ctx.strokeStyle = '#c4d3ea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, end, params.counterclockwise);
    ctx.stroke();

    // Circle center and the radius at angle zero.
    ctx.fillStyle = '#e57e36';
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#e57e36';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r, cy);
    ctx.stroke();

    ctx.fillStyle = '#3e536f';
    ctx.font = '18px system-ui';
    ctx.fillText(`r = ${r},  end = ${params.endAngle}°`, 36, 55);
    ctx.fillText('angle 0', cx + r + 12, cy + 6);
}
