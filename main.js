myCanvas.height = window.innerHeight; //myCanvas is global variable, no need query selector
myCanvas.width = 200;

const ctx = myCanvas.getContext("2d");
const road = new Road(myCanvas.width/2, myCanvas.width*0.9); //0.9 to move the lines a little closer to center, padding outside
const car = new Car(road.getLaneCenter(1), 100, 30, 50);

animate();

function animate() {
    car.update(road.borders);

    myCanvas.height = window.innerHeight; //this helps to resize the canvas 60fps according to broswer length, also it resets the properties of canvas so no need ot use onClear() and onResize() function to do it every frame
    
    ctx.translate(0, -car.y+myCanvas.height*0.7) //dont translate canvas in x axis, translate in car's y obj, negative , and place it 70% from total height of canvas
    road.draw(ctx);
    car.draw(ctx);
    
    requestAnimationFrame(animate); //reccursively call fn animate() 60 FPS/timesPS
}