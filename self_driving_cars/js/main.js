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
const tools = {
    graph: { button: graphBtn, editor: new GraphEditor(viewport, graph) },
    stop: { button: stopBtn, editor: new StopEditor(viewport, world) },
    crossing: { button: crossingBtn, editor: new CrossingEditor(viewport, world) },
    start: { button: startBtn, editor: new StartEditor(viewport, world) },
    light: { button: lightBtn, editor: new LightEditor(viewport, world) },
    parking: { button: parkingBtn, editor: new ParkingEditor(viewport, world) },
    target: { button: targetBtn, editor: new TargetEditor(viewport, world) },
    yield: { button: yieldBtn, editor: new YieldEditor(viewport, world) }
}

let oldGraphHash = graph.hash();

setMode('graph');
animate();


function dispose() {
    tools["graph"].editor.dispose();
    world.markings.length = 0;
}

function save() {
    const json = JSON.stringify(graph);
    localStorage.setItem('graph', json);
}

function setMode(mode) {
    disableEditors();
    tools[mode].button.classList.remove('disabled');
    tools[mode].editor.enable();
}

function disableEditors() {
    for (const tool of Object.values(tools)) {
        tool.button.classList.add('disabled');
        tool.editor.disable();
    }
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
    for (const tool of Object.values(tools))
        tool.editor.display();

    requestAnimationFrame(animate);
}