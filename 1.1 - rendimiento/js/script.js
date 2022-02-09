const controls = document.getElementById('controls');
const coords = document.getElementById('coords');

const canvas = document.getElementById('plano');
const ctx = canvas.getContext('2d');

const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imgData.data;

let benchmarkStatus = false;
let timeElapsed = null;

controls.addEventListener('click', async function () {
    if (benchmarkStatus !== false) {
        return;
    }

    benchmarkStatus = true;

    controls.firstElementChild.textContent = 'Corriendo...';

    const basic = await benchmark(basicLine);
    document.querySelector('#basic').textContent = `${basic} ms`;

    const dda = await benchmark(ddaLine);
    document.querySelector('#dda').textContent = `${dda} ms`;

    const bresenham = await benchmark(bresenhamLine);
    document.querySelector('#bresenham').textContent = `${bresenham} ms`;

    benchmarkStatus = false;

    controls.firstElementChild.textContent = 'Iniciar';
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

async function benchmark(method) {
    return new Promise((resolve) => {
        timeElapsed = Date.now();

        const width = canvas.width;
        const height = canvas.height;

        const colorHorizontal = { r: 255, g: 0, b: 0 };
        const colorVertical = { r: 0, g: 0, b: 255 };
        const colorDiagonal = { r: 0, g: 255, b: 0 };

        for (let i = 0; i < height; i++) {
            if (i % 3 !== 0) {
                continue;
            }

            if (i % 2 === 0) {
                // horizontal - izq a der
                method(0, i, width - 1, i, colorHorizontal);

                // vertical - arriba a abajo
                method(i, 0, i, height - 1, colorVertical);
            } else {
                // horizontal - der a izq
                method(width - 1, i, 0, i, colorHorizontal);

                // vertical - abajo a arriba
                method(i, height - 1, i, 0, colorVertical);
            }
        }

        updateMap();

        for (let i = 0; i < height; i++) {
            if (i % 3 !== 0) {
                continue;
            }

            if (i % 2 === 0) {
                // arriba a abajo

                // noroeste
                method(i, 0, 0, i, colorDiagonal);

                // sureste
                method(width - 1, height - 1 - i, width - 1 - i, height - 1, colorDiagonal);

                // noreste
                method(width - 1 - i, 0, width - 1, i, colorDiagonal);

                // suroeste
                method(0, height - 1 - i, i, height - 1, colorDiagonal);
            } else {
                // abajo a arriba

                // noroeste
                method(0, i, i, 0, colorDiagonal);

                // sureste
                method(width - 1 - i, height - 1, width - 1, height - 1 - i, colorDiagonal);

                // noreste
                method(width - 1, i, width - 1 - i, 0, colorDiagonal);

                // suroeste
                method(i, height - 1, 0, height - 1 - i, colorDiagonal);
            }
        }

        updateMap();

        resolve(Date.now() - timeElapsed);
    });
}
