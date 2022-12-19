class Road{
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;
        this.left = x - width / 2; //x is middle, so half widht left, and right will make whole width of road
        this.right = x + width / 2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity; //y goes positive down

        const topLeft = {x:this.left, y:this.top};
        const bottomLeft = {x:this.left, y:this.bottom};
        const topRight = {x:this.right, y:this.top};
        const bottomRight = {x:this.right, y:this.bottom};
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];     
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth/2 + 
            Math.min(laneIndex, this.laneCount-1) * laneWidth; //if laneIndex is greater than lane count, then we put the car in last lane
    }
    draw(ctx){
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        ctx.setLineDash([20,20]);
        for(let i=1; i<=this.laneCount-1; i++){
            const x = lerp( //linear interpolation
                this.left,
                this.right,
                i/this.laneCount
            );
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke(); 
        }
        ctx.setLineDash([])
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        })
    }
}