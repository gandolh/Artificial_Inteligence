//TODO: Do load method
class Segment{
    constructor(p1, p2){
        this.p1 = p1;
        this.p2 = p2;
    }

    draw(ctx, {width = 2, color='black', dash = []} = {}){
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.setLineDash(dash);
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    equals(s){
       return this.includes(s.p1) && this.includes(s.p2);
    }

    includes(point){
        return this.p1.equals(point) || this.p2.equals(point);
    }

    length(){
        return distance(this.p1, this.p2);
    }

    directionVector(){
        return normalize(substract(this.p2, this.p1));
    }

    distanceToPoint(point) {
        const proj = this.projectPoint(point);
        if (proj.offset > 0 && proj.offset < 1) {
           return distance(point, proj.point);
        }
        const distToP1 = distance(point, this.p1);
        const distToP2 = distance(point, this.p2);
        return Math.min(distToP1, distToP2);
     }
     
     projectPoint(point) {
        const a = substract(point, this.p1);
        const b = substract(this.p2, this.p1);
        const normB = normalize(b);
        const scaler = dot(a, normB);
        const proj = {
           point: add(this.p1, scale(normB, scaler)),
           offset: scaler / magnitude(b),
        };
        return proj;
     }
}