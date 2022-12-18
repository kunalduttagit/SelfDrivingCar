const carCanvas = document.getElementById('carCanvas');//carCanvas is global variable, no need query selector
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9); //0.9 to move the lines a little closer to center, padding outside
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
]

animate();

function animate(time) {
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, [])
    }
    car.update(road.borders, traffic);

    carCanvas.height = window.innerHeight; //this helps to resize the canvas 60fps according to broswer length, also it resets the properties of canvas so no need ot use onClear() and onResize() function to do it every frame
    networkCanvas.height = window.innerHeight;
    
    carCtx.save();
    carCtx.translate(0, -car.y+carCanvas.height*0.7) //dont translate canvas in x axis, translate in car's y obj, negative , and place it 70% from total height of canvas
    
    road.draw(carCtx);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }
    car.draw(carCtx, "blue");
    
    carCtx.restore();

    networkCtx.lineDashOffset = -time/50
    Visualizer.drawNetwork(networkCtx, car.brain)
    requestAnimationFrame(animate); //reccursively call fn animate() 60 FPS/timesPS
}