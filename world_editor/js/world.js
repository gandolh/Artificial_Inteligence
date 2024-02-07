class World {
    constructor(graph,
        roadWidth = 100,
        roadRoundness = 10,
        buildingWidth = 150,
        buildingMinLength = 150,
        spacing = 50,
        treeSize = 160
    ) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;
        this.buildingWidth = buildingWidth;
        this.buildingMinLength = buildingMinLength;
        this.spacing = spacing;
        this.treeSize = treeSize;
        this.envelopes = [];
        this.roadBorders = [];
        this.buildings = [];
        this.trees = [];
        this.laneGuides = [];
        this.markings = [];
        this.generate();
    }

    static load(info){
        const world = new World(new Graph());
        world.graph = Graph.load(info.graph);
        world.roadWidth = info.roadWidth;
        world.roadRoundness = info.roadRoundness;
        world.buildingWidth = info.buildingWidth;
        world.buildingMinLength = info.buildingMinLength;
        world.spacing = info.spacing;
        world.treeSize = info.treeSize;
        world.envelopes = info.envelopes.map(e => Envelope.load(e));
        world.roadBorders = info.roadBorders.map(s => new Segment(s.p1, s.p2));
        world.buildings = info.buildings.map(b => Building.load(b));
        world.trees = info.trees.map(t => Tree.load(t));
        world.laneGuides = info.laneGuides.map(s => new Segment(s.p1, s.p2));
        world.markings = info.markings.map(m => Marking.load(m));
        world.zoom = info.zoom;
        world.offset = info.offset;
        return world;
    }

    generate() {
        this.envelopes = [];
        for (const segment of this.graph.segments) {
            const envelope = new Envelope(segment, this.roadWidth, this.roadRoundness);
            this.envelopes.push(envelope);
        }

        this.roadBorders = Polygon.union(this.envelopes.map(e => e.poly));

        this.buildings = this.#generateBuildings();
        this.trees = this.#generateTrees();
        this.laneGuides.length = 0;
        this.laneGuides.push(...this.#generateLaneGuides());
    }

    #generateLaneGuides() {
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
            tmpEnvelopes.push(
                new Envelope(seg,
                    this.roadWidth / 2,
                    this.roadRoundness)
            );
        }
        
        const segments = Polygon.union(tmpEnvelopes.map(e => e.poly));
        return segments;
    }

    #generateTrees() {
        const points = [
            ...this.roadBorders.map(s => [s.p1, s.p2]).flat(),
            ...this.buildings.map(b => b.base.points).flat()
        ];
        const {top, right, bottom, left} = this.#getCornerPoints(points);
        const trees = [];
        const illegalPolys = [
            ...this.buildings.map(b => b.base),
            ...this.envelopes.map(e => e.poly)
        ]

        let tryCount = 0;
        while (tryCount < 100) {
            const p = new Point(
                lerp(left, right, Math.random()),
                lerp(bottom, top, Math.random())
            );

            let keep = !this.#isInsideOtherStructure(p, illegalPolys) 
            && !this.#isOverlappingOtherTree(p, trees)
            && this.#isCloseToSomething(p, illegalPolys)

            if (keep) {
                trees.push(new Tree(p, this.treeSize));
                tryCount = 0;
            }
            tryCount++;
        }
        return trees;
    }

    #getCornerPoints(points) {
        const left = Math.min(...points.map(p => p.x));
        const right = Math.max(...points.map(p => p.x));
        const top = Math.min(...points.map(p => p.y));
        const bottom = Math.max(...points.map(p => p.y));
        return {top, right, bottom, left};
    }

    #isInsideOtherStructure(p, illegalPolys) {
        for (const poly of illegalPolys) {
            if (poly.containsPoint(p)
                || poly.distanceToPoint(p) < this.treeSize / 2) {
                return true;
            }
        }
        return false;
    }

    #isOverlappingOtherTree(p, trees) {
        for (const tree of trees)
            if (distance(tree.center, p) < this.treeSize) {
                return true;
            }
        return false;
    }

    
    #isCloseToSomething(p, illegalPolys) {
        for (const poly of illegalPolys)
            if (poly.distanceToPoint(p) < this.treeSize * 2)
                return true;

        return false;
    }

    #generateBuildings() {
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
            tmpEnvelopes.push(
                new Envelope(seg,
                    this.roadWidth + this.buildingWidth + this.spacing * 2,
                    this.roadRoundness)
            );
        }

        const guides = Polygon.union(tmpEnvelopes.map(e => e.poly));
        for (let i = guides.length - 1; i >= 0; i--) {
            const seg = guides[i];
            if (seg.length() < this.buildingMinLength) {
                guides.splice(i, 1);
            }
        }

        const suports = [];
        for (let seg of guides) {
            const len = seg.length() + this.spacing;
            const buildingCount = Math.floor(
                len / (this.buildingMinLength + this.spacing)
            );
            const buildingLength = len / buildingCount - this.spacing;
            const dir = seg.directionVector();
            let q1 = seg.p1;
            let q2 = add(q1, scale(dir, buildingLength));
            suports.push(new Segment(q1, q2));

            for (let i = 2; i <= buildingCount; i++) {
                q1 = add(q2, scale(dir, this.spacing));
                q2 = add(q1, scale(dir, buildingLength));
                suports.push(new Segment(q1, q2));
            }
        }

        const bases = [];
        for (const seg of suports) {
            bases.push(new Envelope(seg, this.buildingWidth).poly);
        }

        const eps = 0.001;
        for (let i = 0; i < bases.length - 1; i++)
            for (let j = i + 1; j < bases.length; j++)
                if (bases[i].intersectsPoly(bases[j]) || 
                    bases[i].distanceToPoly(bases[j]) < this.spacing - eps){
                    bases.splice(j, 1);
                    j--;
                }


        return bases.map(b => new Building(b));
    }

    draw(ctx, viewPoint) {
        for (const envelope of this.envelopes) {
            envelope.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
        }

        for (const marking of this.markings) {
            marking.draw(ctx);
        }

        for (const segment of this.graph.segments) {
            segment.draw(ctx, { color: 'white', width: 4, dash: [10, 10] });
        }

        for (const segment of this.roadBorders) {
            segment.draw(ctx, { color: 'white', width: 4 });
        }

        const items = [... this.buildings, ... this.trees];
        items.sort(
            (a,b) => 
            b.base.distanceToPoint(viewPoint) 
            - a.base.distanceToPoint(viewPoint)
        )

        for (const item of items) {
            item.draw(ctx, viewPoint);
        }
    }

}