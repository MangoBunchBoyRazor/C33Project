//Module Aliases
const Engine = Matter.Engine,
      Bodies = Matter.Bodies,
      World = Matter.World,
      Render = Matter.Render,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

//Declaring global variables      
var engine, circles = [], ground, parts = [], baskets = [], gameState = "play", turns = 0, score = 0;
//Images
var pauseImg, restartImg;
//Database
var database;

function preload(){
    //Loading all images
    pauseImg = loadImage("Pics/pause-1.png.png");
    restartImg = loadImage("Pics/restart-1.png.png");
}
function setup(){
    //canvas
    canvas = createCanvas(600,800);
    //Color mode
    colorMode(HSB);

    //Creating the engine
    engine = Engine.create();	

    //Boundaries
    let leftWall = Bodies.rectangle(0,height/2,10,height,{isStatic: true});
    let rightWall = Bodies.rectangle(width,height/2,10,height,{isStatic: true});
    World.add(engine.world,[leftWall,rightWall]);

    //Creating the pegs
    for(i = 0; i < width; i+=50){
        circles.push(new dots(i+12,100,12));
        circles.push(new dots(i+12,550,12));
        circles.push(new dots(i+37,475,12));
        circles.push(new dots(i+12,400,12));
        circles.push(new dots(i+37,325,12));
        circles.push(new dots(i+12,250,12));
        circles.push(new dots(i+37,175,12));
    }
    //The baskets for catching the balls
    for(j = 50; j < width; j+=100)
        baskets.push(new Basket(j,700,100));

    let mconstraint = MouseConstraint.create(engine,{
        mouse: Mouse.create(canvas.elt)
    });
    World.add(engine.world,mconstraint);
}   
function draw(){
    score = 0;
    getCalculatedScore();
    //Background
    push();
    colorMode(RGB);
    background(200);
    pop();
    //Displaying the title
    push();
    textAlign(CENTER);
    fill(circles[0].hue,100,100);
    textSize(40);
    text("Plinko!",width/2,50);	
    fill(360,100,100);
    textSize(20);
    textAlign(LEFT);
    text("Score:"+score,0,50);
    pop();
    //Declaring game state to over if the no. of turns is 5
    if(turns > 5)
    gameState = "over";

    //Displaying all the objects
    for(n = 0; n < baskets.length; n++)
        baskets[n].circleAmt = 0;
    for(i = 0; i < circles.length; i++){
        circles[i].display();
    }
    for(j = 0; j < parts.length; j++)
        parts[j].display();
    for(k = 0; k < baskets.length; k++)
        baskets[k].display();

  
    if(gameState == "over"){
        push();
        textAlign(CENTER);
        textSize(40);
        fill(100,10,100);
        text("Game Over",width/2,200);
        text("Your final score:"+score,width/2,250);
        pop();
    }
    //updating the engine if game is not pause
    if(gameState == "play"){
        Engine.update(engine, 1000/60);
    }
    else if(gameState == "pause"){
        //Creating the pause screen when game is paused
        let canvas2 = createGraphics(width,height);
        canvas2.background(150,240);
        canvas2.textSize(30);
        canvas2.textAlign(CENTER);
        canvas2.text("Paused",width/2,300);
        image(canvas2,0,0);
    }

    //Displaying the pause and restart images
    image(pauseImg,width-100,0);
    image(restartImg,width-50,0);

    push();
    textSize(20);
    textAlign(CENTER);
    for(let i = 0; i < baskets.length; i++){
        if(i < 2)
            text("300",baskets[i].x,baskets[i].y);
        else if(i < 4)
            text("100",baskets[i].x,baskets[i].y);
        else if(i < 6)
            text("200",baskets[i].x,baskets[i].y);
    }
    pop();
}
function getCalculatedScore(){
    for(i = 0; i < parts.length; i++){
        if(parts[i].body.position.y > 600){
            let pos = parts[i].body.position;
            if(pos.x <= baskets[1].x+baskets[1].size/2)
                score+=300;
            else if(pos.x > baskets[1].x+baskets[1].size/2 && pos.x <= baskets[3].x+baskets[3].size/2)
                score+=100;
            else if(pos.x > baskets[3].x+baskets[3].size/2 && pos.x <= baskets[5].x+baskets[5].size/2)
                score+=200;
        }
    }
}
function mouseClicked(){
    if(mouseX < width && mouseX > width-50 && mouseY < 50)
        restart();
    else if(mouseX < width-50 && mouseX > width-100 && mouseY < 50)
        pause();
    else if(gameState == "play" && turns <= 5){
        turns++;
        parts.push(new Particles(mouseX,-10));
    }
}
//Function to pause the game
function pause(){
    if(gameState != "pause")
        gameState = "pause";
    else if(gameState == "pause")
        gameState = "play";
}
//Function to restart the game
function restart(){
    turns = 0;
    gameState = "play";
    for(j = 0; j < parts.length; j++)
        World.remove(engine.world, parts[j].body);
    parts = [];
}