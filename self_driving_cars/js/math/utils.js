function getNearestPoint(loc, points, threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_VALUE;
    let nearest = null;
    points.forEach(p => {
        const dist = distance(p, loc);
        if (dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = p;
        }
    });
    return nearest;
}

function distance(p1, p2) {
    // return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

function substract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

function scale(p, scaler) {
    return new Point(p.x * scaler, p.y * scaler);
}

function translate(loc, angle, offset) {
    return new Point(loc.x + offset * Math.cos(angle),
        loc.y + offset * Math.sin(angle));

}

function angle(p){
    return Math.atan2(p.y, p.x);
}