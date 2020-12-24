var canvas, backgroundImage;

var gameState = 0;


var database;
var position1,position2;
var player1score=0, player2score=0;
var player1,player2, player1img, player2img;
function preload()
{
  player1img=loadAnimation("player11.png","player12.png","player11.png")
  player2img=loadAnimation("player21.png","player22.png","player21.png")
}


function setup(){
  canvas = createCanvas(400,400);
  database = firebase.database();

  
  player1= createSprite(50,200);
  player1.addAnimation("player1",player1img)
  player1.scale =0.4;
  player1.setCollider("circle",0,0,50);
  database.ref('player1/position').on("value",readposition1)

  player2= createSprite(350,200);
  player2.addAnimation("player2",player2img)
  player2.setCollider("circle",0,0,50);
  player2.scale =0.4;
  database.ref('player2/position').on("value",readposition2)
  //chance = Math.round(random(1,2))
  //console.log(chance)
  database.ref('/').update({
    player1score:0,
    player2score:0,
    gameState:0
  })
  database.ref('player1score').on("value",pl1score)
  database.ref('player2score').on("value",pl2score)
  //database.ref('gameState').on("value",gstate)
  
}


function draw(){
  background(255)
  drawline(10,"red")
  drawline(390,"red")
  drawline(100,"yellow");
  drawline(300,"yellow");
  drawline(200,"black");
  database.ref('gameState').on("value",gstate)
  if(gameState===0)
  {
    fill("green");
    textSize(20)
    database.ref('player1/position').update({
      x: 50,
      y:200
    })
    database.ref('player2/position').update({
       x: 350,
       y:200
    })
    database.ref('/').update({
      gameState:0
   })
    text("press space for toss", 150,200);
    
   
  }
  if(keyDown("space") && gameState===0)
  {
    
    
    var chance = Math.round(random(1,2))
    if(chance===1)
    {
      gameState=1;
      database.ref('/').update({
        gameState:gameState
      })
      alert("chance of red player")
      chance=0;
    }
    else if(chance==2)
    {
        gameState=2;
        database.ref('/').update({
          gameState:gameState
        })        
        alert("Chance of player2 (yellow)")
        chance=0;
    }
   
    }  
  
    if(gameState===1)
    { 
      database.ref('player1/position').on("value",readposition1)
      database.ref('player2/position').on("value",readposition2)
      if(keyWentDown("up"))
      {
        console.log("up")  
        writeposition1(0,-5)

      }
      if(keyWentDown("down"))
      {
         writeposition1(0,5)
      }
      if(keyWentDown("left"))
      {
        writeposition1(-5,0)
      }
      if(keyWentDown("right"))
      {
        writeposition1(5,0)
      }
      if(keyWentDown("w"))
      {
        writeposition2(0,-5)
      }
      if(keyWentDown("s"))
      {
        writeposition2(0,5)
      }

      if(player1.x>=390)
      {
        gameState=0
        database.ref('/').update({
          gameState:0,
          player2score:player2score+5
        })
      }

      if(player1.isTouching(player2))
      {
        alert("red won")
        gameState=0;
        database.ref('/').update({
          gameState:0,
          player1score:player1score+5
        })
      
        database.ref('player1/position').update({
          x: 50,
          y:200
        })
        database.ref('player2/position').update({
           x: 350,
           y:200
        })  
        
      }
      
      console.log("gamestate : "+gameState)

    }
    else if(gameState==2)
    {
      database.ref('player1/position').on("value",readposition1)
      database.ref('player2/position').on("value",readposition2)
        if(keyWentDown("w"))
        {
          console.log("up")    
          writeposition2(0,-5)
        }
        if(keyWentDown("s"))
        {
            writeposition2(0,5)
        }
        if(keyWentDown("a"))
        {
          writeposition2(-5,0)
        }
        if(keyWentDown("d"))
        {
          writeposition2(5,0)
        }
        if(keyWentDown("up"))
        {
          writeposition1(0,-5)
        }
        if(keyWentDown("down"))
        {
          writeposition1(0,5)
        }

        if(player2.x<=10)
        {
          gameState=0;
        database.ref('/').update({
          gameState:0,
          player1score:player1score+5
        })

        }

      if(player2.isTouching(player1))
      {
        alert("yellow won")
        gameState=0;
        
        database.ref('/').update({
          gameState:0,
          player2score:player2score+5
        })
        database.ref('player1/position').update({
          x: 50,
          y:200
        })
        database.ref('player2/position').update({
           x: 350,
           y:200
        })  
      }
     console.log("gamestate :"+gameState)

    }
    
    fill("red")
  text("red: " + player1score,100,15)
  fill("yellow")
  text("yellow: "+ player2score,300,15)
 drawSprites(); 
}

async function gstate(data)
{
  gameState=await data.val();
}
function pl1score(data)
{
  player1score=data.val();
}
function pl2score(data)
{
  player2score=data.val();
}
function readposition1(data)
{
position1= data.val();
player1.x = position1.x;
player1.y=position1.y
}

function readposition2(data)
{
position2= data.val();
player2.x = position2.x;
player2.y=position2.y
}

function writeposition1(x,y)
{
    database.ref('player1/position').set({
      'x': position1.x +x,
      'y': position1.y +y
    })
}

function writeposition2(x,y)
{
    database.ref('player2/position').set({
      'x': position2.x +x,
      'y': position2.y +y
    })
}

function drawline(x,color)
{
  for(var i=0;i<400;i=i+20)
  {
    strokeWeight(3);
    stroke(color)
    line(x,i,x,i+10)
  }
}
