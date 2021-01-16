let g_isDown = false,
    g_points = [];

function Point(x, y) {
    this.X = x;
    this.Y = y;
}

function startGesture(e) {
    g_isDown = true;
    g_points = [];
    e = e.touches ? e.touches[0] : e;
    const x = e.layerX;
    const y = e.layerY;
    g_points.push(new Point(x, y));
}

function move(e) {
    if (!g_isDown)
        return;

    e = e.touches ? e.touches[0] : e;
    const x = e.layerX;
    const y = e.layerY;
    g_points.push(new Point(x, y));
}

function stopGesture(e) {
    g_isDown = false;
    e = e.touches ? e.touches[0] : e;
    const x = e.layerX;
    const y = e.layerY;
    g_points.push(new Point(x, y));
    chrome.runtime.sendMessage({
        points: g_points,
        x: document.body.clientWidth,
        y: document.body.clientHeight,
    });
}

function doAction(req, sender, sendMessage) {
    eval(req.code);
    return true;
}

if ('ontouchstart' in window) {
    document.addEventListener('touchstart', startGesture);
    document.addEventListener('touchmove', move);
    document.addEventListener('touchend', stopGesture);
}
else {
    document.addEventListener('mousedown', startGesture);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stopGesture);
}
chrome.runtime.onMessage.addListener(doAction);
