function ddaLine(x0, y0, x1, y1, color) {
    const dx = x1 - x0;
    const dy = y1 - y0;

    const step = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

    const xInc = dx / step;
    const yInc = dy / step;

    for (let i = 0; i <= step; i++) {
        setPixel(Math.round(x0), Math.round(y0), color);

        x0 += xInc;
        y0 += yInc;
    }
}
