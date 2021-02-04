function getXY(e) {
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

    return [ x, y ];
}

function Point(x, y) {
    this.X = x;
    this.Y = y;
}
