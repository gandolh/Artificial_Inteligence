class Viewport {
    constructor(canvas, zoom = 1, offset= null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.zoom = zoom ? zoom : 1;
        this.center = new Point(canvas.width / 2, canvas.height / 2);
        this.offset = offset ? offset : scale(this.center, -1);
        this.drag = {
            start: new Point(0, 0),
            end: new Point(0, 0),
            offset: new Point(0, 0),
            active: false
        }

        this.#addEventListeners();
    }

    getMouse(e, subtractDragOffset = false) {
        const p =  new Point(
            (e.offsetX - this.center.x) * this.zoom - this.offset.x,
            (e.offsetY - this.center.y) * this.zoom - this.offset.y
        )

        return subtractDragOffset ? substract(p, this.drag.offset) : p;
    }

    getOffset(){
        return add(this.offset, this.drag.offset);
    }

    reset(){
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.save();
        this.ctx.translate(this.center.x, this.center.y);
        this.ctx.scale(1 / this.zoom, 1 / this.zoom);
        const offset = this.getOffset();
        this.ctx.translate(offset.x, offset.y);
    }

    #addEventListeners() {
        this.canvas.addEventListener('wheel', (e) => this.#handleWheel(e));
        this.canvas.addEventListener('mousedown', (e) => this.#handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.#handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.#handleMouseUp(e));
    }

    #handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY;
        const dir = Math.sign(delta);
        const step = 0.1;
        this.zoom += dir * step;
        // clamp between 1 and 5
        this.zoom = Math.max(1, Math.min(5, this.zoom));
    }

    #handleMouseDown(e) {
        if (e.button == 1) { // middle button
            this.drag.start = this.getMouse(e);
            this.drag.active = true;
        }
    }
    #handleMouseMove(e) {
        if (this.drag.active) { 
            this.drag.end = this.getMouse(e);
            this.drag.offset = substract(this.drag.end, this.drag.start);
        }
    }
    #handleMouseUp(e) {
        if(this.drag.active){
            this.offset = add(this.offset, this.drag.offset);
            this.drag = {
                start: new Point(0, 0),
                end: new Point(0, 0),
                offset: new Point(0, 0),
                active: false
            }
        }
    }

}