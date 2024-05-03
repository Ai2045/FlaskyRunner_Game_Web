
class Zombie {
  
    constructor(speed) {
      this.speed = speed;
      this.max_health = 3;
      this.health = random(1, 3);
      let y;
      if (random(1) < 0.5) {
        // from the top
        y = random(-300, 0);            
      } else {
        // from the bottom
        y = random(height, height + 300);
      }
      
      let x = random(-300, width + 300);
      this.pos = createVector(x, y);
      this.destroy_sound = loadSound('static/sounds/destroy.wav');
    } 
    
      
    draw() {
        push();
        fill(100, 255, 100);
        let angle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
        translate(this.pos.x, this.pos.y);
        rotate(angle);
        rect(0, 0, 20, 20);
        // Disegna la barra di salute sopra il mostro
        let healthWidth = map(this.health, 0, this.max_health, 0, 20);

        fill(255, 0, 0);
        rect(0, -25, healthWidth*1.5, 5);
        
        pop();
    }
    
    
    update() {
      let difference = p5.Vector.sub(player.pos, this.pos);

      difference.limit(this.speed);
      this.pos.add(difference);
    }
    
    tackDamage() {
      this.health--;
      if (this.health < 1) {
        this.destroy_sound.play();
        return true;
      }
      return false;
    }

    ateYou() {
      return dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y) < 20;
    }
  }