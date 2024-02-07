myCanvas.width = 600;
myCanvas.height = 600;

const ctx = myCanvas.getContext('2d');

const worldString = localStorage.getItem('world');
const worldInfo = worldString ? JSON.parse(worldString) : null;
let world = worldInfo ?
    World.load(worldInfo) :
    new World(new Graph());

const graph = world.graph;

const viewport = new Viewport(myCanvas, world.zoom, world.offset);
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
    world.zoom = viewport.zoom;
    world.offset = viewport.offset;

    const element = document.createElement('a');
    const json = JSON.stringify(world);
    element.setAttribute('href', 
    'data:application/json;charset=utf-8,' 
    + encodeURIComponent(json));
    const fileName = "name.world";
    element.setAttribute('download', fileName);

    element.click();
    localStorage.setItem('world', json);
}

function load(e){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
        
        const jsonData = JSON.parse(e.target.result);
        world = World.load(jsonData);
        localStorage.setItem('world', JSON.stringify(world));
        location.reload();

    }
    reader.readAsText(file);
    
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

function openModal(){
    modalInfo.style.display = "block";
}

function closeModal(){
    modalInfo.style.display = "none";
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