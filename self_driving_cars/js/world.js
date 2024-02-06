class World {
    constructor(graph,
        roadWidth = 100,
        roadRoundness = 10,
        buildingWidth = 150,
        buildingMinLength = 150,
        spacing = 50) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;
        this.buildingWidth = buildingWidth;
        this.buildingMinLength = buildingMinLength;
        this.spacing = spacing;
        this.envelopes = [];
        this.roadBorders = [];
        this.buildings = [];
        this.generate();
    }

    generate() {
        this.envelopes = [];
        for (const segment of this.graph.segments) {
            const envelope = new Envelope(segment, this.roadWidth, this.roadRoundness);
            this.envelopes.push(envelope);
        }

        this.roadBorders = Polygon.union(this.envelopes.map(e => e.poly));

        this.buildings = this.#generateBuildings();
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

        for (let i = 0; i < bases.length - 1; i++)
            for (let j = i + 1; j < bases.length; j++)
                if (bases[i].intersectsPoly(bases[j])) {
                    bases.splice(j, 1);
                    j--;
                }


        return bases;
    }

    draw(ctx) {
        for (const envelope of this.envelopes) {
            envelope.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
        }

        for (const segment of this.graph.segments) {
            segment.draw(ctx, { color: 'white', width: 4, dash: [10, 10] });
        }

        for (const segment of this.roadBorders) {
            segment.draw(ctx, { color: 'white', width: 4 });
        }

        for (const building of this.buildings) {
            building.draw(ctx);
        }
    }

}