const g_gestureBackground = document.querySelector('#gesture-background'),
    g_canvas = document.querySelector('canvas');

const g_rect = g_canvas.getBoundingClientRect(),
    g_ctx = g_canvas.getContext('2d');
    g_ctx.fillStyle = 'rgb(0,0,225)';
    g_ctx.strokeStyle = 'rgb(0,0,225)';
    g_ctx.lineWidth = 3;
let g_isDown = false,
    g_points = [],
    g_name = '',
    g_options = {},
    g_useProtractor = false;

function init(options) {
    g_options = options;
    Object.keys(g_options.actions).forEach(name => {
        addGesture(name, g_options.actions[name].custom);
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
    document.querySelector('#custom').addEventListener('click', () => addGesture('Custom action', true));
    g_canvas.addEventListener('mousedown', startGesture);
    g_canvas.addEventListener('mousemove', move);
    g_canvas.addEventListener('mouseup', stopGesture);
    document.addEventListener('blur', save);
}

function clearGesture(e) {
    const name = e.parentNode.querySelector('.name').value;
    g_options.actions[name].points = [];
}

function showGestureArea(e) {
    g_gestureBackground.style.display = 'inherit';

    g_name = e.parentNode.querySelector('.name').value;
    g_points = g_options.actions[g_name].points;
    for (let i = 2; i < g_points.length; i++) {
        drawLine(i - 2, i - 1);
    }
}

function addGesture(name, isCustom) {
    const disabled = isCustom ? '' : 'disabled';
    const remove = isCustom ? '<input type="button" value="Remove" class="remove">' : '';
    const div = document.createElement('div');
    div.classList = 'action';
    const html = `    
        <input class="name" value="${name}" ${disabled}>
        <input type="button" value="Gesture" class="gesture">
        <input type="button" value="Clear" class="clear">
        ${remove}
    `;
    div.innerHTML = html;
    document.querySelector('#actions').appendChild(div);
    if (isCustom)
        div.querySelector('.remove').addEventListener('click', () => div.remove());
}

function Point(x, y) {
    this.X = x;
    this.Y = y;
}

function startGesture(e) {
    clearCanvas();
    g_isDown = true;
    g_points = [];
    const x = e.layerX;
    const y = e.layerY;
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

    const x = e.layerX;
    const y = e.layerY;
    g_points.push(new Point(x, y));
    drawLine(g_points.length - 2, g_points.length - 1);
}

function stopGesture(e) {
    g_isDown = false;
    const x = e.layerX;
    const y = e.layerY;
    g_points.push(new Point(x, y));
    drawLine(g_points.length - 2, g_points.length - 1);
}

function clearCanvas() {
    const g_rect = g_canvas.getBoundingClientRect();
    g_ctx.clearRect(0, 0, g_rect.width, g_rect.height);
}

function save(e) {
    Array.from(document.querySelectorAll('.name'))
        .filter(n => !n.disabled)
        .forEach(n => {
            g_options.actions[n].custom = true;
        });
    chrome.storage.local.set(g_options);
}

chrome.storage.local.get(null, init);
