// Find my blog at https://codeheir.com/
// I do a lot of p5.js stuff that might interest you!


let player;
let playerStartX;
let playerStartY;
let zombies = [];
let crosshair;
let zombieSpawnTime = 300;
let zombieMaxSpeed = 2;
let frame = 0
let score = 0;
let animatedScore = 0;
let highest_score = 0;
let gameOver = false;
let game_music ;
let game_over_sound;
let walls = [];
const cellSize = 50; 
const fixedWallWidth = cellSize;
const fixedWallHeight = cellSize;
// Dimensione della zona di sicurezza intorno al giocatore (distanza dal giocatore senza muri)
const safeZoneSize = cellSize;

function setup() {
    let canvas = createCanvas(1000, 850);
    canvas.id('myCanvas');  // Assign id to the canvas
  // Assegna il canvas come figlio della div '#game'
  canvas.parent('game');
  playerStartX = width / 2;
  playerStartY = height / 2;
  player = new Player(playerStartX, playerStartY);
  noCursor();
// Genera la griglia dei muri
for (let y = 0; y < height; y += cellSize) {
  for (let x = 0; x < width; x += cellSize) {
    // Verifica che la cella non sia nell'area di partenza del giocatore né nella zona di sicurezza intorno
    if (!isSafeZone(x, y, playerStartX, playerStartY, safeZoneSize) && Math.random() > 0.82) { // 80% probabilità di avere un muro nella cella (correggi il commento)
      // Crea un muro della stessa altezza e larghezza
      walls.push(new Wall(x, y, cellSize, cellSize));
    }
  }
}

  // Avvia la musica di gioco
  game_music.loop();
 
}

function preload() {
  crosshair = loadImage('static/imgs/crosshair097.png');
  game_music = loadSound('static/sounds/game_music.mp3');
  //abbassa il volume della musica di gioco
  game_music.setVolume(0.1);
  game_over_sound = loadSound('static/sounds/game_over.wav');
  game_music.setVolume(0.1);
    if (!username.startsWith("guest")){
    updateHighestScore();
    }
  }

function updateHighestScore() {
    fetch('/get_highest_score')
    .then(response => response.json())
    .then(data => highest_score = data.highest_score)
    .catch((error) => console.error('Errore:', error));
}

// Funzione che verifica se la cella si trova nella safe zone intorno al giocatore
function isSafeZone(x, y, playerX, playerY, zoneSize) {
  return x >= playerX - zoneSize && x <= playerX + zoneSize &&
         y >= playerY - zoneSize && y <= playerY + zoneSize;
}

function checkCollision(rect1, rect2) {
  return rect1.pos.x < rect2.pos.x + rect2.w  &&
         rect1.pos.x + rect1.w > rect2.pos.x &&
         rect1.pos.y < rect2.pos.y + rect2.h &&
         rect1.pos.y + rect1.h > rect2.pos.y;
}

function draw() {
  if (gameOver) {
    // Darken the background
    background(0);
  
    // Add game over text
    textSize(72);
    fill(255, 0, 0); // Bright red color for contrast
    textStyle(BOLD); // Bold text for the "Game Over"
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 100);
    
    // Add instructions to restart
    textSize(32);
    fill(255); // White color for the instructions text
    text("Press R to Restart", width / 2, height / 2);

    // Highest Score
    if (highest_score > 0 && !username.startsWith("guest")) {
      fill(255, 255, 0); // Yellow color for the highest score text
      text("Highest Score: " + highest_score, width / 2, (height / 2) + 100);
    }

    // Calculate the increment based on a percentage of the remaining distance to the actual score
    // Smooth animation to count up to the current score
    let increment = ceil((score - animatedScore) / 15);
    animatedScore += increment;
    if (animatedScore > score) {
      animatedScore = score; // Avoid overshooting the actual score
    }

    fill(255); // White color for the current score text
    text("Your Score: " + animatedScore, width / 2, (height / 2) + 150);
  } else {
        background(0);
        rectMode(CENTER);
        for (let wall of walls) {
            wall.draw();
        }
        player.draw();
        player.update();
        
        walls.forEach(wall => {
          if (checkCollision(player, wall)) {
              player.handleCollision(wall);
              console.log("Collisione con il muro");
          }
        
      });
  
      // Verifica collisione tra gli zombie e i muri
      zombies.forEach(zombie => {
          walls.forEach(wall => {
              if (checkCollision(zombie, wall)) {
                  zombie.handleCollision(wall);
              }
          });
      });
        for (let i = zombies.length - 1; i >= 0; i--) {
            zombies[i].draw();
            zombies[i].update();
            
            if (zombies[i].state !== 'dead' && player.hasShot(zombies[i])) {
              score++;
            }
            if (zombies[i].state !== 'dead' && player.hasCollided(zombies[i])) {
              endGame();
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
        // colora il testo dello Score in bianco
        fill(255);
        text("Score: " + score, 100, 50); // Cambia la posizione del testo dello Score per comparirlo a sinistra
        if (highest_score > 0 && !username.startsWith("guest")){
        text("Highest Score: " + highest_score, width - 150, 70); // Cambia la posizione del testo dell'High Score per comparirlo a destra
        }
    }
}


function saveScore() {
  fetch('/save_score', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({score: score, date: new Date().toISOString()}),
})
}
function endGame() {
    gameOver = true;
    game_over_sound.play();
    saveScore();
    updateHighestScore();
  
}
function restart() {
  player = new Player(playerStartX, playerStartY);
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