function draw(ctx, params) {
    const cell = params.cell;
    const left = 80, top = 50;
    const columns = 26, rows = 16;

    // Each cell is an enlarged logical pixel.
    if (params.showGrid) {
        ctx.strokeStyle = '#dbe4f2';
        ctx.lineWidth = 1;
        for (let x = 0; x <= columns; x++) {
            ctx.beginPath();
            ctx.moveTo(left + x * cell, top);
            ctx.lineTo(left + x * cell, top + rows * cell);
            ctx.stroke();
        }
        for (let y = 0; y <= rows; y++) {
            ctx.beginPath();
            ctx.moveTo(left, top + y * cell);
            ctx.lineTo(left + columns * cell, top + y * cell);
            ctx.stroke();
        }
    }

    function putPixel(x, y) {
        ctx.fillStyle = params.pixelColor;
        ctx.fillRect(left + x * cell + 1,
                     top + y * cell + 1,
                     cell - 2, cell - 2);
    }

    // A small diagonal raster pattern.
    const pixels = [
        [2, 3], [3, 3], [4, 4], [5, 4], [6, 5],
        [7, 6], [8, 6], [9, 7], [10, 7], [11, 8],
        [12, 9], [13, 9], [14, 10], [15, 10],
        [16, 11], [17, 12], [18, 12], [19, 13]
    ];
    for (const [x, y] of pixels) putPixel(x, y);

    ctx.fillStyle = '#243b5e';
    ctx.font = '17px system-ui';
    ctx.fillText('(0, 0)', left + 5, top - 14);
    ctx.fillText('x →', left + 26 * cell - 40, top - 14);
    ctx.fillText('y ↓', left - 53, top + 18);
}
