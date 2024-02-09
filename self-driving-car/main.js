carCanvas.width = 200;
networkCanvas.width = 300;
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);




const N = 100;
const cars = generateCars(N);
const traffic = [];
let bestCar = cars[0];

if (localStorage.getItem('bestBrain')) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2);
        }
    }
}

let generatedTraffic =0;


animate();

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem('bestBrain');
}

function generateCars(N) {
    const cars = [];
    for (let i = 1; i < N; i++)
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    return cars;
}

function generateTraffic() {
    const laneCount = road.laneCount;
    const randomLane = Math.floor(Math.random() * laneCount);
    const startPoint = - (carCanvas.height * 0.7 - bestCar.y);
    const newTraffic = new Car(road.getLaneCenter(randomLane),
        startPoint, 30, 50, "DUMMY", 2);
    
    for (let i = 0; i < traffic.length; i++)
        if (polysIntersect(newTraffic.getPolygon(), traffic[i].polygon))
            return;

    traffic.push(newTraffic);
}


function animate(time) {
    // generating random traffic
    if(Math.floor(-bestCar.y / 300) > generatedTraffic){
        generateTraffic();
        generatedTraffic = Math.floor(time / 1000);
    }
    
    for (const t of traffic)
        t.update(road.borders, []);
    for (const car of cars)
        car.update(road.borders, traffic);

    const bestCarStat = Math.min(...cars.map(c => c.y));
    bestCar = cars.find(c => c.y == bestCarStat);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    draw();

    networkCtx.lineDashOffset = -time / 100;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate);
}

function draw() {
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    carCtx.globalAlpha = 0.2;
    road.draw(carCtx);

    for (let i = 0; i < traffic.length; i++)
        traffic[i].draw(carCtx, { color: 'red' });

    for (const car of cars)
        car.draw(carCtx, { color: 'blue' });

    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, { color: 'blue', drawSensor: true });
    carCtx.restore();

}