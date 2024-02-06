class Tree{
    constructor(center, size, heightCoef = 0.3){
        this.center = center;
        this.size = size; // size of the base
        this.heightCoef = heightCoef;
        this.base = this.#generateLevel(center, size);
    }

    draw(ctx,viewPoint){
        const diff = substract(this.center, viewPoint);
        const top = add(this.center, scale(diff, this.heightCoef));

        const levelCount = 7;
        for(let level = 0; level < levelCount; level++){
            const t = level / (levelCount - 1);
            const point = lerp2D(this.center, top, t);
            const color = `rgb(30,${lerp(50,200,t)},70)`;
            const size = lerp(this.size, 40, t);
            // those are more cute
            // point.draw(ctx, {color: color, size: size});
            const poly = this.#generateLevel(point, size);
            poly.draw(ctx, {fill: color, stroke: 'rgba(0,0,0,0)'});
        }
    }

    #generateLevel(center, size){
        const points = [];
        const rad = size /2;
        for(let a = 0; a < Math.PI * 2; a += Math.PI / 16){
            const kindOfRandom = Math.cos(((a + this.center.x) * size) % 17) ** 2;
            const noisyRadius = rad * lerp(0.5, 1,kindOfRandom);
            points.push(translate(center, a, noisyRadius));
        }
        return new Polygon(points);
    }
}