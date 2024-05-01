// Find my blog at https://codeheir.com/
// I do a lot of p5.js stuff that might interest you!


let player;
let zombies = [];
let crosshair;
let zombieSpawnTime = 300;
let zombieMaxSpeed = 2;
let frame = 0
let score = 0;
let highest_score = 0;
let gameOver = false;
function setup() {
    let canvas = createCanvas(1000, 850);
    canvas.id('myCanvas');  // Assign id to the canvas
  // Assegna il canvas come figlio della div '#game'
  canvas.parent('game');
  preload();
  player = new Player();
  noCursor();
  console.log(username)
}

function preload() {
  crosshair = loadImage('static/imgs/crosshair097.png');
    if (!username.startsWith("guest")){
        fetch('/get_highest_score')
        .then(response => response.json())
        .then(data => highest_score = data.highest_score)
        .catch((error) => console.error('Errore:', error));
    }
    }
    
function draw() {
    
    if (gameOver) {
        fill(0, 0, 0, 150);
        rect(width / 2, height / 2, width, height);
        textSize(72);
        fill(255, 0, 0);
        text("Game Over", width / 2 - 100, height / 2); // Aggiunto -100 per centrare il testo
        textSize(32);
        text("Press R to Restart", width / 2 - 100, (height / 2) + 100); // Aggiunto -100 per centrare il testo
        if (highest_score > 0 && !username.startsWith("guest")){
        text("Highest Score: " + highest_score, width / 2 - 100, (height / 2) + 150); // Aggiunto -100 per centrare il testo
        }
        keyPressed();
      } else {
        background(100, 100, 100);
        rectMode(CENTER);
        player.draw();
        player.update(); 
        
        
        
        for (let i = zombies.length - 1; i >= 0; i--) {
            zombies[i].draw();
            zombies[i].update();
            
            if (zombies[i].ateYou()) {
            endGame();
            break;
            }
            
            if (player.hasShot(zombies[i])) {
            score++;
            zombies.splice(i, 1);
            }
        }
        
        if (frame >= zombieSpawnTime) {
            zombies.push(new Zombie(random(zombieMaxSpeed)));
            zombieSpawnTime *= 0.95;
            frame = 0;
        }
        if (frameCount % 1000 == 0) {
            zombieMaxSpeed += 0.1;
        }
            
            image(crosshair, mouseX - 25, mouseY - 25, 50, 50);
        frame++;
        textAlign(CENTER);
        textSize(32);
        fill(0,255,0)
        text("Score: " + score, 70, 70); // Cambia la posizione del testo dello Score per comparirlo a sinistra
        if (highest_score > 0 && !username.startsWith("guest")){
        text("Highest Score: " + highest_score, width - 150, 70); // Cambia la posizione del testo dell'High Score per comparirlo a destra
        }
    }
}

function endGame() {
    gameOver = true;

    fetch('/save_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({score: score, date: new Date().toISOString()}),
    })
}
function restart() {
  player = new Player();
  zombies = [];
  zombieSpawnTime = 300;
  zombieMaxSpeed = 2;
  score = 0;
    gameOver = false;
}

function mouseClicked() {
  player.shoot();
}

function keyPressed() {
    if (gameOver && (key === 'r' || key === 'R')) {
      restart();
    }
  }