class dots{
    constructor(x,y,size){
        this.radius = size;
        this.hue = 0;
        this.body = Bodies.circle(x,y,this.radius,{isStatic: true, friction: 0});
        World.add(engine.world,this.body);
    }
    display(){
        let pos = this.body.position;
        push();
        colorMode(HSB);
        translate(pos.x,pos.y);
        fill(this.hue,100,100);
        stroke(0,255,0);
        circle(0,0,this.radius*2);
        pop();
        if(this.hue >= 360)
            this.hue = 0;
        this.hue += 2;
    }
}