class Player {
    constructor() {
      this.pos = createVector(width / 2, height / 2)
      this.imgIdle = loadImage('static/assets/Individual_Animations/Playergun1.png');
      this.imgFire = loadImage('static/assets/Individual_Animations/Playergun2.png');
      this.currentImg = this.imgIdle;
      this.angle = 0;
      this.bullets = [];
      this.particles = [];
      this.shoot_sound = loadSound('static/sounds/shoot.wav');
      this.isShooting = false;
      this.shootingDuration = 100; // Durata dello stato "fire" in millisecondi.
      this.lastShotTime = -Infinity; // Per tenere traccia dell'ultimo momento dello sparo.

    }
    
    draw() {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.angle);
      imageMode(CENTER);
      image(this.currentImg, 0, 0, 100, 100);
      pop();
      
       // Aggiorna l'img da "fire" a "idle" se è passato abbastanza tempo dallo sparo.
    if (this.isShooting && millis() - this.lastShotTime > this.shootingDuration) {
      this.setIdle();
    }

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
      
      for (let i = this.bullets.length - 1; i >= 0; i--) {
        this.bullets[i].update();
        this.bullets[i].draw();
        if (this.bullets[i].remove) {
          this.bullets.splice(i, 1);
        }
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

  setIdle() {
    this.currentImg = this.imgIdle;
    this.isShooting = false;
  }
  
  setFire() {
    this.currentImg = this.imgFire;
    this.isShooting = true;
    this.lastShotTime = millis(); // Memorizza il momento dello sparo.
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
        this.setFire(); // Imposta l'immagine a "fire" quando si spara.
      }

      hasShot(zombie) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let bullet = this.bullets[i];
            if (dist(bullet.x, bullet.y, zombie.pos.x, zombie.pos.y) < 15) {
                if (!bullet.hasHit) {
                    bullet.hasHit = true; // Marca il proiettile come colpito per prevenire ulteriore danno
                    bullet.beginDissipation(); // Comincia la dissolvenza (se presente)
                    if (zombie.takeDamage()) {
                        console.log('Zombie colpito');
                        return true;
                    }
                }
            }
        }
        return false;
    }

  }