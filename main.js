const carCanvas = document.getElementById('carCanvas');//carCanvas is global variable, no need query selector
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9); //0.9 to move the lines a little closer to center, padding outside

const N = 1
const cars = generateCars(N)
let bestCar = cars[0]

if(localStorage.getItem("bestBrain")){
    for(let i = 0; i < cars.length; i++){
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        )
        if(i != 0){
            NeuralNetwork.mutate(cars[i].brain, 0.2)
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
]

animate();

function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain)
    );
    let saved = document.querySelector(".save")
    saved.addEventListener("click", ()=> {
        saved.style.backgroundColor = "green"
    })
}

function discard(){
    localStorage.removeItem("bestBrain")
    let deleted = document.querySelector(".delete")
    deleted.addEventListener("click",()=> {
        deleted.style.backgroundColor = "red"
    })
}

function generateCars(N){
    const cars = [];
    for(let i = 1; i <= N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars
}

function animate(time) {
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, [])
    }

    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        )
    );

    carCanvas.height = window.innerHeight; //this helps to resize the canvas 60fps according to broswer length, also it resets the properties of canvas so no need ot use onClear() and onResize() function to do it every frame
    networkCanvas.height = window.innerHeight;
    
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.7) //dont translate canvas in x axis, translate in car's y obj, negative , and place it 70% from total height of canvas
    
    road.draw(carCtx);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }

    carCtx.globalAlpha = 0.2;
    for(let i=0; i<cars.length; i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    requestAnimationFrame(animate); //reccursively call fn animate() 60 FPS/timesPS
}