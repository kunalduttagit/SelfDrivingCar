class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI/2;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders){
        this.#castRays();
        this.readings = [];
        for(let i=0; i<this.rays.length; i++){ //rays.Length <=> rayCount
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders)
            );
        } 
    }

    #getReading(ray, roadBorders){
        let touches = [];

        for(let i=0; i<roadBorders.length; i++){
            const touch = getIntersection(
                ray[0], //ray starting point, basically centre of car
                ray[1],     //ray end point, basically cos(a) + sin(a)
                roadBorders[i][0],  //basically left border top point for i = 0
                roadBorders[i][1]   ////basically left border top point for i = 0, for i=1, it's right border
            );
            if(touch){
                touches.push(touch);
            }
        }
        if(touches.length == 0){
            return null;
        }else{
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e => e.offset == minOffset);
        }
    }

    #castRays(){
        this.rays = [];
        for(let i=0; i<this.rayCount; i++){
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount == 1 ? 0.5 : i/(this.rayCount-1)
            )+this.car.angle; //to move to direction of rays respective to the car's angle
            const start = {x: this.car.x, y: this.car.y};
            const end = {
                x: this.car.x -
                    Math.sin(rayAngle)*this.rayLength,  //unit circle, 1px radius, mul by length to make it visible
                y: this.car.y -
                    Math.cos(rayAngle)*this.rayLength
            };
            this.rays.push([start, end]);
        }
        //console.table(this.rays)
    }

    draw(ctx){
        for(let i=0; i<this.rayCount; i++){

            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }

            ctx.beginPath();        //for yellow
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();        //for black
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

        }
    }
}