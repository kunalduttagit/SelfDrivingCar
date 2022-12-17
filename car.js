class Car{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y; //down y is positive, up is negative
        this.width = width;
        this.height = height;

        this.speed = 0; //distance/time
        this.acceleration = 0.2; //rate of change of speed/velocity
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0; //Math.PI/2, to rotate a car if initialized horizontaly (but here vertical)

        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update(roadBorders){
        this.#move();
        this.sensor.update(roadBorders);
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

    draw(ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        ctx.rect(
            - this.width/2,
            - this.height/2,
            this.width,
            this.height
        );
        ctx.fill();
        ctx.restore();

        this.sensor.draw(ctx);  //car draws it's own sensors
    }
}