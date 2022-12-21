class Car{
    constructor(x, y, width, height, controlType, maxSpeed = 3, color="blue") {
        this.x = x;
        this.y = y; //down y is positive, up is negative
        this.width = width;
        this.height = height;

        this.speed = 0; //distance/time
        this.acceleration = 0.2; //rate of change of speed/velocity
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0; //Math.PI/2, to rotate a car if initialized horizontaly (but here vertical)
        this.damaged = false

        this.useBrain = controlType == "AI";

        if(controlType != "DUMMY"){
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4] //rayCount is input layer, 6 is hidden layer, 4 is output layer (left, rt, up, down)
            )
        }
        this.controls = new Controls(controlType);

        this.img = new Image();
        this.img.src = "Resources/car.png"

        this.mask = document.createElement("canvas")
        this.mask.width = width
        this.mask.height = height

        const maskCtx = this.mask.getContext("2d")
        this.img.onload = () => {
            maskCtx.fillStyle = color
            maskCtx.rect(0, 0, this.width, this.height)
            maskCtx.fill()

            maskCtx.globalCompositeOperation ="destination-atop"; //keep color only where it overlaps the car
            maskCtx.drawImage(this.img, 0,0, this.width, this.height)
        }
    }

    update(roadBorders, traffic){
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon()
            this.damaged = this.#assessDamage(roadBorders, traffic)
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(
                s => s == null ? 0 : 1-s.offset //so closer outputs have more importance, closer offset is more important, 1-smallOffset = big value
            )
            const outputs = NeuralNetwork.feedForward(offsets, this.brain)
            //console.log(outputs)
            if(this.useBrain){
                this.controls.forward = outputs[0]
                this.controls.left = outputs[1]
                this.controls.right = outputs[2]
                this.controls.reverse = outputs[3]
            }
        }
    }

    #assessDamage(roadBorders, traffic){
        for(let i=0; i<roadBorders.length; i++){
            if(polysIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }
        for(let i=0; i<traffic.length; i++){
            if(polysIntersect(this.polygon, traffic[i].polygon )){
                return true;
            }
        }
        return false
    }

    #createPolygon(){
        const points = []
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({   //top right
            x: this.x - Math.sin(this.angle - alpha)*rad,
            y: this.y - Math.cos(this.angle - alpha)*rad
        })
        points.push({   //top left
            x: this.x - Math.sin(this.angle + alpha)*rad,
            y: this.y - Math.cos(this.angle + alpha)*rad
        })
        points.push({   //bottom left
            x: this.x - Math.sin(Math.PI + this.angle - alpha)*rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha)*rad
        })
        points.push({   //bottom right
            x: this.x - Math.sin(Math.PI + this.angle + alpha)*rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha)*rad
        })
        return points
    }

    #move(){
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }
        if(this.speed != 0){
            const flip = this.speed > 0 ? 1 : -1; //if less than zero, than flip rotate angle
            if(this.controls.left){
                this.angle += 0.03*flip; //angle increase counterclockwise
            }
            if(this.controls.right){
                this.angle -= 0.03*flip;
            }
        }
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed; //capping max speed
        }
        if(this.speed < -this.maxSpeed/2){ //reverse, let speed be half, negative speed doesnt exist, but here, it does when reversed
            this.speed = -this.maxSpeed/2;
        }
        if(this.speed > 0){
            this.speed -= this.friction; //if +speed, reduce it by friction
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0; //if the change in (say up, so negative) made speed less than 0 but not greater than firction, then again acceleration will always be there, so make it zero
        }
        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;
    }

    draw(ctx, drawSensors = false){

        if(this.sensor && drawSensors){
            this.sensor.draw(ctx);  //car draws it's own sensors
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle)
        if(!this.damaged){
            ctx.drawImage(this.mask,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
                )
            ctx.globalCompositeOperation = "multiply";
        }
            ctx.drawImage(this.img,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
            )
        ctx.restore();
    }
}