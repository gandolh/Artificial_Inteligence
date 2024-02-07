

function dispose() {
    graphEditor.dispose();
    world.markings.length = 0;
}

function save() {
    const json = JSON.stringify(graph);
    localStorage.setItem('graph', json);
}

function setMode(mode) {
    disableEditors();
    switch (mode) {
        case 'graph':
            graphBtn.classList.remove('disabled');
            graphEditor.enable();
            break;
        case 'stop':
            stopBtn.classList.remove('disabled');
            stopEditor.enable();
            break;
        case 'crossing':
            crossingBtn.classList.remove('disabled');
            crossingEditor.enable();
            break;
        default:
            break;
    }
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
const stopEditor = new StopEditor(viewport, world);
const crossingEditor = new CrossingEditor(viewport, world);

let oldGraphHash = graph.hash();

setMode('graph');
animate();

function disableEditors() {
    graphBtn.classList.add('disabled');
    graphEditor.disable();
    stopBtn.classList.add('disabled');
    stopEditor.disable();
    crossingBtn.classList.add('disabled');
    crossingEditor.disable();
 }


function animate() {
    viewport.reset();
    if (graph.hash() !== oldGraphHash) {
        world.generate();
        oldGraphHash = graph.hash();
    }

    const viewPoint = scale(viewport.getOffset(), -1)
    world.draw(ctx, viewPoint);
    ctx.globalAlpha = 0.3;
    graphEditor.display();
    stopEditor.display();
    crossingEditor.display();
    requestAnimationFrame(animate);
}