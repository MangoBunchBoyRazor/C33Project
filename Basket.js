class Basket{
    constructor(x,y,size){
        this.size = size;
        this.x = x;
        this.y = y;
        let options = {isStatic: true};
        this.body1 = Bodies.rectangle(this.x-this.size/2, this.y+this.size/2, 10, this.size*1.5,options);
        this.body2 = Bodies.rectangle(this.x+this.size/2, this.y+this.size/2, 10, this.size*1.5,options);
        this.body3 = Bodies.rectangle(this.x, this.y+this.size, this.size, 10,options);
        World.add(engine.world,[this.body1, this.body2, this.body3]);
        this.circleAmt = 0;
    }
    display(){
        let pos1 = this.body1.position;
        let pos2 = this.body2.position;
        let pos3 = this.body3.position;
        push();
        fill(0,100,100);
        rectMode(CENTER);
        rect(pos1.x,pos1.y,10,this.size*1.5);
        rect(pos2.x,pos2.y,10,this.size*1.5);
        rect(pos3.x,pos3.y,this.size,10);
        pop();
    }
    isCircleInside(object){
        if(object.body.position.x > this.x - this.size/2 
           && object.body.position.x < this.x + this.size/2
           && object.body.position.y > this.y - this.size/2)
           return true;
        return false;
    }
}