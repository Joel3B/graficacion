const canvas = document.getElementById('plano');
const ctx = canvas.getContext('2d');

const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imgData.data;

let secondClick = false;
let pos1 = null;
let pos2 = null;

const nav = document.getElementById('nav');
const stroke = {
    x0: randomInteger(0, 300),
    y0: randomInteger(0, 300),
    x1: randomInteger(0, 300),
    y1: randomInteger(0, 300),
};

basicLine(stroke.x0, stroke.y0, stroke.x1, stroke.y1);
updateMap();

canvas.addEventListener('click', function (e) {
    const x = e.offsetX;
    const y = e.offsetY;

    if (!secondClick) {
        pos1 = {
            x: x,
            y: y,
        };

        setPixel(x, y, {
            r: 255,
            g: 0,
            b: 0,
        });

        updateMap();

        secondClick = true;
    } else {
        pos2 = {
            x: x,
            y: y,
        };

        basicLine(pos1.x, pos1.y, pos2.x, pos2.y);
        updateMap();

        secondClick = false;
    }
});

function setPixel(x, y, color) {
    let n = (y * canvas.width + x) * 4;
    data[n] = color.r;
    data[n + 1] = color.g;
    data[n + 2] = color.b;
    data[n + 3] = 255;
}

function updateMap() {
    ctx.putImageData(imgData, 0, 0);
}

function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = (num >> 8) & 255;
    var b = num & 255;

    return { r: r, g: g, b: b };
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showCords(x0, y0, x1, y1, color) {
    color = `rgb(${color.r}, ${color.g}, ${color.b})`;

    nav.innerHTML += `
        <div class="stroke">
            <div class="color" style="background-color: ${color}"></div>
            <div class="coords">
                <div class="coord1">(${x0} <sup>x1</sup>, ${y0} <sup>y1</sup>)</div>
                <div class="coord2">(${x1} <sup>x2</sup>, ${y1} <sup>y2</sup>)</div>
            </div>
        </div>
    `;
}

function basicLine(x0, y0, x1, y1) {
    const color = getRandomRgb();

    showCords(x0, y0, x1, y1, color);

    const m = (y1 - y0) / (x1 - x0);
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
