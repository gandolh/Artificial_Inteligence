carCanvas.width = 200;
networkCanvas.width = 300;
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);



const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
]
if (localStorage.getItem('bestBrain')) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2);
        }
    }
}


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


function animate(time) {
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