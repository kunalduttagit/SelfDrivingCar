const carCanvas = document.getElementById('carCanvas');//carCanvas is global variable, no need query selector
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9); //0.9 to move the lines a little closer to center, padding outside

const N = 1
const cars = generateCars(N)
let bestCar = cars[0]

if(!localStorage.getItem("beenHereBefore")){
    localStorage.setItem("beenHereBefore","true");
    //localStorage.setItem("bestBrain",'{"levels":[{"inputs":[0.7134037395397386,0.4704391617329813,0,0,0],"outputs":[1,0,1,0,1,1],"biases":[-0.2857065784574137,0.15198050810320685,-0.13924253314793095,0.11578316440435818,-0.16178778119340148,-0.3000903730682978],"weights":[[-0.13515557540433842,0.07300698004528629,0.0040602602910803365,-0.06511672542187383,0.2351613353184897,-0.2012322725070096],[0.11375478789219415,0.19674169055322577,-0.10038853369062525,-0.08805459204957476,0.21925787393967702,0.15340538795108272],[0.006771304836725459,0.19973693546258126,-0.054730364561966574,-0.31855113026094745,-0.18011218120061373,-0.07367159677011853],[0.10788433228858771,-0.08604768151855152,-0.16601129743851203,-0.00019124113279275767,-0.2387343271874623,0.024133579587637094],[0.016549344407090646,0.07491472818610108,0.01776519928759422,0.061508369764843265,-0.22340799373690096,-0.04158178250497961]]},{"inputs":[1,0,1,0,1,1],"outputs":[1,1,1,0],"biases":[-0.06116069156441874,-0.0723274390864902,0.040602477018632524,0.36214587805918513],"weights":[[0.08902059474663654,-0.15740460212292795,-0.33036790341757627,-0.09502772355825113],[-0.025343350670927654,-0.3306790265709002,-0.015918008460683405,-0.3003507035765679],[0.3227266376583849,0.38057846051375693,0.18707727773028537,0.053444661926534916],[-0.2025644147140744,0.1184725671846302,-0.09069904024640596,-0.12430190885008531],[0.07527020196440684,-0.230469927588571,0.3007741658810536,0.22218297028978307],[-0.01361908920713352,0.16609276689516542,-0.09581290649261008,-0.039394098855477074]]}]}');
    localStorage.setItem("bestBrain",'{"levels":[{"inputs":[0.6730043048111198,0.39579073999138836,0,0,0],"outputs":[0,1,0,1,1,0],"biases":[0.2979045186123642,-0.03464437413289169,0.40566392466506895,0.07952651395290802,-0.21102836321829244,0.2609068822387978],"weights":[[0.13620501853640396,0.18233045602588202,0.5811439538949016,0.19869767634807928,0.12417774569813653,-0.06935094051834215],[-0.27213445817448506,0.34083888136863705,0.0031754185393973455,-0.12933853855623118,-0.033172671331445504,-0.5420639078742046],[0.18311501960594262,-0.4345953677907681,-0.1523043049211365,-0.28308665744836403,-0.028818817175752506,-0.26691197790774984],[0.21443009353488407,-0.5965918890360359,0.17909589167667828,0.0409033211284138,0.21417497817787667,-0.30035330666271404],[-0.20316338582505206,0.2472031172189031,-0.45409219148051605,0.3385611442604812,0.1024888093081094,-0.4535112411825913]]},{"inputs":[0,1,0,1,1,0],"outputs":[1,1,1,0],"biases":[-0.45402970297060774,0.4557574359357359,0.21748408123563373,0.020125765331484413],"weights":[[0.1595993413896638,-0.44723851243763857,-0.41422550590266793,-0.18802071023927658],[-0.2913314791166747,0.0475805340732383,0.4862618896882391,-0.22649835006680757],[-0.004811271090555902,-0.005694232112323477,-0.06735477575639795,-0.10305894794933575],[-0.27394322439888646,0.5323771769369883,0.07415077816071851,0.29393424475243435],[0.5742780189817159,0.1573523239690133,0.09169172756391161,-0.6597348032156503],[-0.1633589821939035,-0.05572959784324717,0.0025561698762028295,0.10449767801153437]]}]}');
}
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, 0.2)
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor() ),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor() ),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor() ),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor() ),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor() ),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor() ),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor() ),
    new Car(road.getLaneCenter(2), -900, 30, 50, "DUMMY", 2, getRandomColor() ),
    new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2, getRandomColor() ),
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