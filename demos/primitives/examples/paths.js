function draw(ctx, params) {
    const color = params.strokeColor;
    ctx.lineWidth = params.strokeWidth;
    ctx.strokeStyle = color;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.fillStyle = '#42566e';
    ctx.font = '21px system-ui';
    ctx.fillText('Open path', 110, 70);
    ctx.fillText('Closed path', 530, 70);

    // Open polyline: the endpoints remain separate.
    ctx.beginPath();
    ctx.moveTo(105, 385);
    ctx.lineTo(165, 180);
    ctx.lineTo(300, 310);
    ctx.lineTo(380, 135);
    ctx.stroke();

    // The same concept, but with a closed polygon.
    ctx.beginPath();
    ctx.moveTo(530, 395);
    ctx.lineTo(570, 215);
    ctx.lineTo(690, 132);
    ctx.lineTo(820, 280);
    ctx.lineTo(770, 438);
    ctx.closePath();
    if (params.fill) {
        ctx.fillStyle = '#dbe8ff';
        ctx.fill();
    }
    ctx.stroke();

    ctx.fillStyle = '#63738b';
    ctx.font = '16px system-ui';
    ctx.fillText('beginPath → moveTo → lineTo → stroke', 110, 490);
    ctx.fillText('closePath → fill / stroke', 530, 490);
}
