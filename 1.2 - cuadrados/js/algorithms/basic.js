function basicLine(x0, y0, x1, y1, color) {
    let m = (y1 - y0) / (x1 - x0);

    if (Math.abs(m) === Infinity) {
        m = y1;
    }

    const b = y0 - m * x0;

    for (let x = x0; x <= x1; x++) {
        let y = m * x + b;

        setPixel(x, Math.round(y), color);
    }

    for (let x = x1; x <= x0; x++) {
        let y = m * x + b;

        setPixel(x, Math.round(y), color);
    }

    for (let y = y1; y <= y0; y++) {
        let x = (y - b) / m;

        setPixel(Math.round(x), y, color);
    }

    for (let y = y0; y <= y1; y++) {
        let x = (y - b) / m;

        setPixel(Math.round(x), y, color);
    }

    updateMap();
}
