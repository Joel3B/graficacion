function bresenhamLine(x0, y0, x1, y1, color) {
    const dx = Math.abs(x1 - x0);
    const sx = x0 < x1 ? 1 : -1;

    const dy = Math.abs(y1 - y0);
    const sy = y0 < y1 ? 1 : -1;

    let tmp = (dx > dy ? dx : -dy) / 2;

    while (true) {
        setPixel(x0, y0, color);

        if (x0 === x1 && y0 === y1) break;

        let e2 = tmp;

        if (e2 > -dx) {
            tmp -= dy;
            x0 += sx;
        }

        if (e2 < dy) {
            tmp += dx;
            y0 += sy;
        }
    }
}
