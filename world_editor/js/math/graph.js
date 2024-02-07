class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }
    
    static load(Info) {
        const points = Info.points.map(p => new Point(p.x, p.y));
        const segments = Info.segments.map(s => new Segment(
            points.find(p => p.equals(s.p1)),
            points.find(p => p.equals(s.p2))
        ));
        return new Graph(points, segments);
    
    }  

    tryAddPoint(point) {
        if (!this.containsPoint(point)){
            this.addPoint(point);
            return true;
        }
        return false;
    }

    
    tryAddSegment(segment) {
        if (!this.containsSegment(segment) 
            && !segment.p1.equals(segment.p2)){
            this.addSegment(segment);
            return true;
        }
        return false;
    }

    addPoint(point) {
        this.points.push(point);
    }

    addSegment(segment) {
        this.segments.push(segment);
    }

    removeSegment(segment) {
        this.segments = this.segments.filter(s => !s.equals(segment));
    }

    removePoint(point) {
        const segmentsToRemove = this.getSegmentsWithPoint(point);
        segmentsToRemove.forEach(s => this.removeSegment(s));
        this.points = this.points.filter(p => !p.equals(point));
    }
    

    containsPoint(point) {
        return this.points.some(p => p.equals(point));
    }

    containsSegment(segment) {
        return this.segments.some(s => s.equals(segment));
    }

    getSegmentsWithPoint(point) {
        return this.segments.filter(s => s.includes(point));
    }

    dispose() {
        this.points = [];
        this.segments = [];
    }

    draw(ctx) {
        this.segments.forEach(segment => {
            segment.draw(ctx);
        });

        this.points.forEach(point => {
            point.draw(ctx);
        });
    }

    hash() {
        return JSON.stringify(this);
        
    }
}