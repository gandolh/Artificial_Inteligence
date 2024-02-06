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

function average(p1, p2) {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
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

function angle(p) {
    return Math.atan2(p.y, p.x);
}

function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
    const eps = 0.001;

    if (Math.abs(bottom) > eps) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t,
            };
        }
    }

    return null;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return `hsl(${hue}, 100%, 60%)`;
}

function normalize(p) {
    return scale(p, 1 / magnitude(p));
}

function magnitude(p) {
    return Math.hypot(p.x, p.y);
}

