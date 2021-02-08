let g_isDown = false,
    g_points = [];

function startGesture(e) {
    g_isDown = true;
    g_points = [];

    const [ x, y ] = getXY(e);
    g_points.push(new Point(x, y));
}

function move(e) {
    if (!g_isDown)
        return;

    const [ x, y ] = getXY(e);
    g_points.push(new Point(x, y));
}

function stopGesture(e) {
    g_isDown = false;

    chrome.runtime.sendMessage({ points: g_points, });
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
