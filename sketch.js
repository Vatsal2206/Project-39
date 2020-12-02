var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var cake,cakeI;

var clap,soundG;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");

  cakeI = loadImage("cake.png")
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  clap = loadSound("wow.mp3")
  soundG = loadSound("sound.wav")
}

function setup() {
  createCanvas(displayWidth,displayHeight - 143);

  var message = "This is a message";
  console.log(message)
  
  trex = createSprite(displayWidth - 1550,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);

  trex.scale = 0.7;
  
  ground = createSprite(displayWidth - 1550,displayHeight - 300,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(displayWidth/2 - 100,displayHeight/2 - 220);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2 - 100,displayHeight/2 - 160);
  restart.addImage(restartImg);
 
  gameOver.scale = 1;
  restart.scale = 1;
  
  invisibleGround = createSprite(displayWidth - 1550,displayHeight - 290,800,10);
  invisibleGround.visible = false;

  cake = createSprite(displayWidth/2 - 100,displayHeight - 380)
  cake.addImage(cakeI)
  cake.scale = 0.4;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("circle",0,0,trex.width - 50);
  
  score = 0;
  
}

function draw() {
  
  background(255);
  textSize(50)
  text("Score: "+ score, displayWidth/2 - 200,70);

  textSize(30);
  fill("red")
  text("Score 2000 points to win!!",displayWidth/2 - 275, -40)
  
  camera.position.x = trex.x + 700;
  camera.position.y = trex.y - 200;

  cloudsGroup.depth = cake.depth + 1;
  
  if(gameState === PLAY){
    cake.visible = false;

    if(frameCount % 55 === 0){
      soundG.play();

    }

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= displayHeight - 322) {
      
        trex.velocityY = -14;
        jumpSound.play();
    }

    console.log(trex.y)
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        dieSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      cake.visible = false;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);  
      
      if(mousePressedOver(restart)) {
        reset();
      }
   }

  
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);

  if(score === 1999){
    clap.play();
  }
  if(score === 2000){
    gameState = WIN; 

  }

  if(gameState === WIN){

    fill("red")
    textSize(40)
    text("🎉✨🎊Congratulations!!🎊✨🎉",displayWidth/2 - 400,displayHeight/2 - 275)
    fill("blue")
    text("😍U won a HUGE cake😍",displayWidth/2 - 330,displayHeight/2 - 225)
      
    trex.changeAnimation("collided", trex_collided);
    

    trex.velocityY += 0.8

    cake.visible = true;
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
        
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.destroyEach();
    cloudsGroup.setVelocityXEach(0);
      
    ground.velocityX = 0

    restart.visible = true;

    if(mousePressedOver(restart)) {
      reset();
    }

  }

  
  

  drawSprites();
}

function reset(){
  gameState = PLAY;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
}


function spawnObstacles(){
 if (frameCount % 80 === 0){
   var obstacle = createSprite(displayWidth + 100,invisibleGround.y - 30,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.7;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth + 100,displayHeight - 200,40,10);
    cloud.y = Math.round(random(80,420));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 2000;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

