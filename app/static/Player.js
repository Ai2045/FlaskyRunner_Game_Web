class Player {
    constructor() {
      this.pos = createVector(width / 2, height / 2)
      this.angle = 0;
      this.bullets = [];
      this.particles = [];
      this.shoot_sound = loadSound('static/sounds/shoot.wav');

    }
    
    draw() {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.angle);
       // Draw the shadow first
    fill(50, 50, 50, 100); // choose a darker color for the shadow
    rect(2, 2, 20, 20); // this will create a shadow offset by 2 pixel in the x/y directions

      fill(255, 255, 255)
      rect(0, 0, 20, 20);
      
      pop();
      
      for (let i = this.particles.length -1; i >= 0; i--) {
        const p = this.particles[i];
      
        // Remove particles that should no longer be alive
        if (!p.isAlive()) {
          this.particles.splice(i, 1);
          continue;
        }
      
        p.move();
        p.draw();
      }
      
      for (let bullet of this.bullets) {
        bullet.update();
        bullet.draw();
      }
    }
    

    update() {
      let xSpeed = 0;
      let ySpeed = 0;
      if (keyIsDown(65)) {
        xSpeed = -2;
      }
  
      if (keyIsDown(68)) {
        xSpeed = 2;
      }
  
      if (keyIsDown(87)) {
        ySpeed = -2;
      }
  
      if (keyIsDown(83)) {
        ySpeed = 2;
      }
      this.pos.add(xSpeed, ySpeed);
      this.angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x); // add this
      this.createParticles();
    }

    createParticles() {
        // Add particle if we've moved
        if (this.oldPos) {
          const diffX = abs(this.pos.x - this.oldPos.x);
          const diffY = abs(this.pos.y - this.oldPos.y);
          
          if (diffX > 1 || diffY > 1) {
            this.particles.push(new Particle(this.pos.x, this.pos.y));
          }
        }
        // Remember our old position
        this.oldPos = this.pos.copy();
      }
    
    shoot() {
      this.bullets.push(new Bullet(this.pos.x, this.pos.y, this.angle));
      this.shoot_sound.play();
    }
    
    hasShot(zombie) {
      for (let i = 0; i < this.bullets.length; i++) {
        if (dist(this.bullets[i].x, this.bullets[i].y, zombie.pos.x, zombie.pos.y) < 15) {
          this.bullets.splice(i, 1);
          if (zombie.tackDamage()) {
            return true;
          }
        }
      }
      return false;
    }
  }