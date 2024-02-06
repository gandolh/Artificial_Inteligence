

function dispose() {
    graphEditor.dispose();
}

function save() {
    const json = JSON.stringify(graph);
    localStorage.setItem('graph', json);
}


myCanvas.width = 600;
myCanvas.height = 600;

const ctx = myCanvas.getContext('2d');

const graphString = localStorage.getItem('graph');
const graphInfo = JSON.parse(graphString);
console.log(graphInfo);
const graph = graphInfo
    ? Graph.load(graphInfo)
    : new Graph();

const world = new World(graph);

const viewport = new Viewport(myCanvas);
const graphEditor = new GraphEditor(viewport, graph);

let oldGraphHash = graph.hash();
animate();

function animate() {
    viewport.reset();
    if(graph.hash() !== oldGraphHash) {
        world.generate();
        oldGraphHash = graph.hash();
    }

    const viewPoint = scale(viewport.getOffset(), -1)
    world.draw(ctx,viewPoint);
    ctx.globalAlpha = 0.3;
    graphEditor.display();
    requestAnimationFrame(animate);
}