class Polygon {
    constructor(points) {
        this.points = points;
        this.segments = [];
        for (let i = 1; i <= this.points.length; i++) {
            this.segments.push(
                new Segment(this.points[i - 1],
                    this.points[i % points.length]));
        }
    }

    static load(info) {
        return new Polygon(info.points.map(p => new Point(p.x, p.y)));   
    }

    draw(ctx, { stroke = 'blue', lineWidth = 2, fill = 'rgba(0,0,255,0.3)' } = {}) {
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    static union(polys) {
        Polygon.multiBreak(polys);
        const keptSegments = [];
        for (let i = 0; i < polys.length; i++) 
        {
            for (const seg of polys[i].segments) {
                let keep = true;

                for (let j = 0; j < polys.length; j++) 
                    if (i != j && polys[j].containsSegment(seg)) {
                            keep = false;
                            break;
                    }

                if (keep)
                    keptSegments.push(seg);
            }
        }
        return keptSegments;
    }

    static multiBreak(polys) {
        for (let i = 0; i < polys.length - 1; i++)
            for (let j = i + 1; j < polys.length; j++) {
                Polygon.break(polys[i], polys[j]);
            }
    }

    static break(poly1, poly2) {
        const segments1 = poly1.segments;
        const segments2 = poly2.segments;
        for (let i = 0; i < segments1.length; i++)
            for (let j = 0; j < segments2.length; j++) {
                const intersection = getIntersection(
                    segments1[i].p1, segments1[i].p2,
                    segments2[j].p1, segments2[j].p2);
                if (intersection && intersection.offset != 1 && intersection.offset != 0) {
                    const point = new Point(
                        intersection.x, intersection.y
                    );
                    let aux = segments1[i].p2;
                    segments1[i].p2 = point;
                    segments1.splice(i + 1, 0, new Segment(point, aux));
                    aux = segments2[j].p2;
                    segments2[j].p2 = point;
                    segments2.splice(j + 1, 0, new Segment(point, aux));

                }
            }
    }

    containsSegment(seg){
        const midPoint = average(seg.p1, seg.p2);
        return this.containsPoint(midPoint);
    }

    containsPoint(point){
        const outerPoint = new Point(-1000,-1000);
        let intersectionCount = 0;
        for (const segment of this.segments) {
            const intersection = getIntersection(outerPoint, point, segment.p1, segment.p2);
            if (intersection ) {
                intersectionCount++;
            }
        }
        return intersectionCount % 2 == 1;
    }

    distanceToPoint(point){
       return Math.min(...this.segments.map(s => s.distanceToPoint(point)));
    }

    distanceToPoly(poly){
        return Math.min(...this.points.map(p => poly.distanceToPoint(p)));
    }

    intersectsPoly(poly){
        for(let s1 of this.segments)
            for(let s2 of poly.segments)
                if(getIntersection(s1.p1, s1.p2, s2.p1, s2.p2))
                    return true;
        return false;
    }


    drawSegments(ctx) {
        for (const segment of this.segments) {
            segment.draw(ctx, { color: getRandomColor(), width: 5 });
        }
    }
}