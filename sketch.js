//Module Aliases
const Engine = Matter.Engine,
      Bodies = Matter.Bodies,
      World = Matter.World,
      Render = Matter.Render,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

//Declaring global variables      
var engine, circles = [], ground, parts = [], baskets = [], Timer, timer, timerIncrease;
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

    //Timer
    timer = 0, Timer = null, timerIncrease = true;

    //Adding mouse controls
    mConstraint = MouseConstraint.create(engine, {
        mouse: Mouse.create(canvas.elt),
    });
    World.add(engine.world,mConstraint);

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyApgwGl_2u-ka2IL3eZkNXsET29KjGN0-4",
        authDomain: "test-project-a08e8.firebaseapp.com",
        databaseURL: "https://test-project-a08e8.firebaseio.com",
        projectId: "test-project-a08e8",
        storageBucket: "test-project-a08e8.appspot.com",
        messagingSenderId: "952912058078",
        appId: "1:952912058078:web:0d130d36b02162446c944f",
        measurementId: "G-C1CN1EB073"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();

    //Create button
    let submitBtn = createButton('submit');
    submitBtn.mouseClicked(createUserAndSubmitData);
}
//Function to submit data to the firebase database
function createUserAndSubmitData(){
    let _scores = [];
    for(i = 0; i < baskets.length; i++)
        _scores.push(baskets[i].circleAmt);
    let data = {
        name: "BlahBlah",
        scores: _scores
    }
    database.ref('scores').push(data);
}
function draw(){
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
    text("Plinko!",width/2,25);	
    pop();

    //Generating the ball at random time
    if(!Timer)
        Timer = round(random(10,75));
    else if(timer === Timer){
        parts.push(new Particles(width/2-1,0));
        Timer = null, timer = 0;
    }

    //Displaying all the objects
    for(n = 0; n < baskets.length; n++)
        baskets[n].circleAmt = 0;
    for(i = 0; i < circles.length; i++)
	    circles[i].display();
    for(j = 0; j < parts.length; j++){
        parts[j].display();
        //Checking the number of circles in each basket
        for(l = 0; l < baskets.length; l++){
            if(baskets[l].isCircleInside(parts[j]))
                baskets[l].circleAmt++;
        }
    }
    for(k = 0; k < baskets.length; k++)
        baskets[k].display();

    //Increasing the timer and updating the engine if game is not pause
    if(timerIncrease){
        timer++;
        Engine.update(engine, 1000/60);
    }
    else{
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

    //Displaying the no. of circles in each basket and the total no. of circles in each basket
    push();
    textAlign(CENTER);
    text(baskets[0].circleAmt,baskets[0].x,75);
    text(baskets[1].circleAmt,baskets[1].x,75);
    text(baskets[2].circleAmt,baskets[2].x,75);
    text(baskets[3].circleAmt,baskets[3].x,75);
    text(baskets[4].circleAmt,baskets[4].x,75);
    text(baskets[5].circleAmt,baskets[5].x,75);
    text("Total Balls: "+parts.length,width/2,50);
    pop();

    //Highlighting the body which the mouse is touching
    if(mConstraint.body){
        push();
        fill(250,250,250,255);
        ellipse(mConstraint.body.position.x,mConstraint.body.position.y,20,20);
        pop();
    }
}
function mouseClicked(){
    if(mouseX < width && mouseX > width-50 && mouseY < 50)
        restart();
    else if(mouseX < width-50 && mouseX > width-100 && mouseY < 50)
        pause();
}
//Function to pause the game
function pause(){
    if(timerIncrease)
        timerIncrease = false;
    else
        timerIncrease = true;
}
//Function to restart the game
function restart(){
    Timer = null;
    timer = 0;
    for(i = 0; i < baskets.length; i++)
        baskets[i].circleAmt = 0;
    for(j = 0; j < parts.length; j++)
        World.remove(engine.world, parts[j].body);
    parts.splice(0,parts.length);
}