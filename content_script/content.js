let g_isDown = false,
    g_points = [];

function Point(x, y) {
    this.X = x;
    this.Y = y;
}

function startGesture(e) {
    e.preventDefault();
    g_isDown = true;
    g_points = [];

    let x, y;
    if (e.touches) {
        e = e.touches[0];
        const rect = e.target.getBoundingClientRect();
        x = e.pageX - rect.x;
        y = e.pageY - rect.y;
    }
    else {
        x = e.layerX;
        y = e.layerY;
    }
    g_points.push(new Point(x, y));
}

function move(e) {
    if (!g_isDown)
        return;

    let x, y;
    if (e.touches) {
        e = e.touches[0];
        const rect = e.target.getBoundingClientRect();
        x = e.pageX - rect.x;
        y = e.pageY - rect.y;
    }
    else {
        x = e.layerX;
        y = e.layerY;
    }
    g_points.push(new Point(x, y));
}

function stopGesture(e) {
    g_isDown = false;

    let x, y;
    if (e.touches) {
        e = e.touches[0];
        const rect = e.target.getBoundingClientRect();
        x = e.pageX - rect.x;
        y = e.pageY - rect.y;
    }
    else {
        x = e.layerX;
        y = e.layerY;
    }
    g_points.push(new Point(x, y));
    chrome.runtime.sendMessage({
        points: g_points,
        x: document.body.clientWidth,
        y: document.body.clientHeight,
    });
}

function doAction(req, sender, sendMessage) {
    if (req.action === 'Scroll to top') {
         window.scrollTo(0, 0);
    }
    else if (req.action === 'Scroll to bottom') {
        window.scrollTo(0, document.body.scrollHeight);
    }
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
