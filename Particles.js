class Particles{
    constructor(x,y){
        this.radius = 9;
        x += random(10,20);
        this.body = Bodies.circle(x,y,this.radius,{restitution: 0.5, density: 0.5, friction: 0});
        World.add(engine.world,this.body);
        this.color = color(random(0,360),255,255);
    }
    display(){
        let pos = this.body.position;
        push();
        noStroke();
        translate(pos.x,pos.y);
        fill(this.color);
        circle(0,0,this.radius*2);
        pop();
    }
}