class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.graph = graph;
        this.ctx = this.canvas.getContext('2d');
        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;

    }

    enable() {
        this.#addEventListeners();
    }

    disable() {
        this.#removeEventListeners();
        this.selected = false;
        this.hovered = false;
    }

    // private method
    #addEventListeners() {
        this.boundMouseDown = (e) => this.#handleMouseDown(e);
        this.boundMouseMove = (e) => this.#handleMouseMove(e);
        this.boundMouseUp = (e) => {
            this.dragging = false;
        };
        this.boundContextMenu = (e) => {
            e.preventDefault();
        }

        this.canvas.addEventListener('mousedown', this.boundMouseDown);
        this.canvas.addEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('mouseup', this.boundMouseUp);
        this.canvas.addEventListener('contextmenu', this.boundContextMenu);
    }

    #removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        this.canvas.removeEventListener('mousemove', this.boundMouseMove);
        this.canvas.removeEventListener('mouseup', this.boundMouseUp);
        this.canvas.removeEventListener('contextmenu', this.boundContextMenu);
    }


    #handleMouseDown(e) {
        if (e.button == 2) { // right click
            if (this.selected)
                this.selected = null;
            else if (this.hovered)
                this.#removePoint(this.hovered);
        }

        if (e.button == 0) { // left click
            this.mouse = this.viewport.getMouse(e, true);
            if (this.hovered) {
                this.#select(this.hovered);
                this.dragging = true;
                return;
            }
            const success = this.graph.tryAddPoint(this.mouse);
            this.#select(this.mouse);
            this.hovered = this.mouse;
        }

    }

    #handleMouseMove(e) {
        this.mouse = this.viewport.getMouse(e, true);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);

        if (this.dragging && this.selected) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    #select(point) {
        if (this.selected)
            this.graph.tryAddSegment(new Segment(this.selected, point));
        this.selected = point;
    }

    #removePoint(point) {
        this.graph.removePoint(point);
        this.hovered = null;
        if (this.selected == point)
            this.selected = null;
    }

    dispose() {
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
    }

    display() {
        this.graph.draw(this.ctx);
        if (this.hovered) {
            this.hovered.draw(this.ctx, { fill: true });
        }
        if (this.selected) {
            const intent = this.hovered ? this.hovered : this.mouse;
            new Segment(this.selected, intent).draw(this.ctx, { dash: [3, 3] });
            this.selected.draw(this.ctx, { outline: true });
        }
    }

}