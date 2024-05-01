class Particle {
    constructor(x, y){
      this.x = x;
      this.y = y;
      this.size = random(1, 4);
      this.speedX = random(-1, 1);
      this.speedY = random(-1, 1);
    }
  
    move() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Make particles shrink each frame
      this.size -= 0.05;
    }
  
    draw() {
      noStroke();
      fill(255); // white color
      ellipse(this.x, this.y, this.size);
    }
  
    // Check if the particle is still on the screen
    isAlive() {
      return this.size > 0;
    }
  }