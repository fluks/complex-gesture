const g_gestureBackground = document.querySelector('#gesture-background'),
    g_canvas = document.querySelector('canvas'),
    g_minScore = document.querySelector('#min-score');

const g_ctx = g_canvas.getContext('2d');
    g_ctx.fillStyle = 'rgb(0,0,225)';
    g_ctx.strokeStyle = 'rgb(0,0,225)';
    g_ctx.lineWidth = 3;
let g_isDown = false,
    g_points = [],
    g_name = '',
    g_options = {};

function init(options) {
    g_options = options;
    Object.keys(g_options.actions).forEach((name, i) => {
        addGesture(name, i);
    });

    document.querySelectorAll('.clear').forEach(e => {
        e.addEventListener('click', () => clearGesture(e));
    });
    document.querySelectorAll('.gesture').forEach(e => {
        e.addEventListener('click', () => showGestureArea(e));
    });
    document.querySelector('#ok').addEventListener('click', e => {
        clearCanvas();
        g_gestureBackground.style.display = 'none';
        g_options.actions[g_name].points = g_points;
    });
    if ('ontouchstart' in window) {
        g_canvas.addEventListener('touchstart', startGesture);
        g_canvas.addEventListener('touchmove', move);
        g_canvas.addEventListener('touchend', stopGesture);
    }
    else {
        g_canvas.addEventListener('mousedown', startGesture);
        g_canvas.addEventListener('mousemove', move);
        g_canvas.addEventListener('mouseup', stopGesture);
    }
    document.addEventListener('blur', save);

    g_minScore.value = g_options.minScore;
}

function getRow(e) {
    for (let c of e.classList.entries()) {
        if (c[1].startsWith('row'))
            return c[1];
    }
}

function clearGesture(e) {
    const row = getRow(e);
    const name = document.querySelector(`.name.${row}`).textContent;
    g_options.actions[name].points = [];
}

function showGestureArea(e) {
    g_gestureBackground.style.display = 'inherit';

    const row = getRow(e);
    g_name = document.querySelector(`.name.${row}`).textContent;
    g_points = g_options.actions[g_name].points;
    for (let i = 2; i < g_points.length; i++) {
        drawLine(i - 2, i - 1);
    }
}

function addGesture(name, i) {
    const actions = document.querySelector('#actions');
    const row = 'row-' + i;

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('name');
    nameSpan.classList.add(row);
    nameSpan.textContent = name;
    actions.appendChild(nameSpan);

    const gesture = document.createElement('input');
    gesture.type = 'button';
    gesture.classList.add('gesture');
    gesture.classList.add(row);
    gesture.value = 'Gesture';
    actions.appendChild(gesture);

    const clear = document.createElement('input');
    clear.type = 'button';
    clear.classList.add('clear');
    clear.classList.add(row);
    clear.value = 'Clear';
    actions.appendChild(clear);
}

function startGesture(e) {
    e.preventDefault();
    clearCanvas();
    g_isDown = true;
    g_points = [];

    const [ x, y ] = getXY(e);
    g_points.push(new Point(x, y));
}

function drawLine(from, to) {
    g_ctx.beginPath();
    g_ctx.moveTo(g_points[from].X, g_points[from].Y);
    g_ctx.lineTo(g_points[to].X, g_points[to].Y);
    g_ctx.closePath();
    g_ctx.stroke();
}

function move(e) {
    if (!g_isDown)
        return;

    const [ x, y ] = getXY(e);
    g_points.push(new Point(x, y));
    drawLine(g_points.length - 2, g_points.length - 1);
}

function stopGesture(e) {
    g_isDown = false;

    const [ x, y ] = getXY(e);
    g_points.push(new Point(x, y));
    drawLine(g_points.length - 2, g_points.length - 1);
}

function clearCanvas() {
    const rect = g_canvas.getBoundingClientRect();
    g_ctx.clearRect(0, 0, rect.width, rect.height);
}

function save(e) {
    g_options.minScore = g_minScore.value;

    browser.storage.local.set(g_options);
}

browser.storage.local.get(null, init);
