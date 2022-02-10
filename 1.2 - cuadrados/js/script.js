const controls = document.getElementById('controls');
const coords = document.getElementById('coords');

const canvas = document.getElementById('plano');
const ctx = canvas.getContext('2d');

const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imgData.data;

let currentAlgorithm = 0;

let secondClick = false;

let pos1 = null;
let pos2 = null;

controls.addEventListener('click', function (e) {
    const target = e.target;
    const algorithm = Number(target.dataset.algorithm);

    if (algorithm === currentAlgorithm || !target.classList.contains('button')) {
        return;
    }

    document.querySelector(`[data-algorithm="${currentAlgorithm}"]`).classList.remove('active');

    target.classList.add('active');

    currentAlgorithm = algorithm;
});

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

        const points = [pos1.x, pos1.y, pos2.x, pos2.y];

        const color = getRandomRgb();

        showCords(...points, color);

        // trazar cuadrado
        const sides = 4;

        const pos = {
            x0: pos1.x,
            y0: pos1.y,
            x1: pos2.x,
            y1: pos2.y,
        };

        const x0 = pos.x0;
        const y0 = pos.y0;
        const x1 = pos.x1;
        const y1 = pos.y1;

        for (let i = 0; i < sides; i++) {
            switch (i) {
                case 0:
                    pos.y1 = y0;
                    break;
                case 1:
                    pos.x0 = x1;
                    pos.y1 = y1;
                    break;
                case 2:
                    pos.y0 = y1;
                    pos.x1 = x0;
                    break;
                case 3:
                    pos.x0 = x0;
                    pos.y1 = y0;
                    break;
            }

            const points = [pos.x0, pos.y0, pos.x1, pos.y1];

            drawLine(points, color);
        }

        secondClick = false;
    }
});

function drawLine(points, color) {
    switch (currentAlgorithm) {
        case 0:
            basicLine(...points, color);
            break;
        case 1:
            ddaLine(...points, color);
            break;
        case 2:
            bresenhamLine(...points, color);
            break;
        default:
            basicLine(...points, color);
            break;
    }
}

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

    return {
        r: r,
        g: g,
        b: b,
    };
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showCords(x0, y0, x1, y1, color) {
    color = `rgb(${color.r}, ${color.g}, ${color.b})`;

    coords.innerHTML += `
        <div class="stroke">
            <div class="color" style="background-color: ${color}"></div>
            <div class="coords">
                <div class="coord1"><b>${currentAlgorithm + 1}</b> (${x0} <sup>x1</sup>, ${y0} <sup>y1</sup>)</div>
                <div class="coord2">(${x1} <sup>x2</sup>, ${y1} <sup>y2</sup>)</div>
            </div>
        </div>
    `;
}
