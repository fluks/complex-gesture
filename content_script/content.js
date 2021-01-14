let g_isDown = false,
    g_points = [];

function Point(x, y) {
    this.X = x;
    this.Y = y;
}

function startGesture(e) {
    g_isDown = true;
    g_points = [];
    const x = e.layerX;
    const y = e.layerY;
    g_points.push(new Point(x, y));
}

function move(e) {
    if (!g_isDown)
        return;

    const x = e.layerX;
    const y = e.layerY;
    g_points.push(new Point(x, y));
}

function stopGesture(e) {
    g_isDown = false;
    const x = e.layerX;
    const y = e.layerY;
    g_points.push(new Point(x, y));
    chrome.runtime.sendMessage({
        points: g_points,
        screen: {
            x: document.body.clientWidth,
            y: document.body.clientHeight,
        },
    });
}

document.addEventListener('mousedown', startGesture);
document.addEventListener('mousemove', move);
document.addEventListener('mouseup', stopGesture);
