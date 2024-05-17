class Player {
    constructor(posX, posY) {
      this.pos = createVector(posX, posY);
      this.w = 30;
      this.h = 30;
      this.imgIdle = loadImage('static/assets/Individual_Animations/Playergun1.png');
      this.imgFire = loadImage('static/assets/Individual_Animations/Playergun2.png');
      this.currentImg = this.imgIdle;
      this.angle = 0;
      this.bullets = [];
      this.particles = [];
      this.shoot_sound = loadSound('static/sounds/shoot.wav');
      this.bullet_empty_sound = loadSound('static/sounds/bullet_empty.mp3');
      this.reload_sound = loadSound('static/sounds/reload.mp3');
      this.isShooting = false;
      this.shootingDuration = 100; // Durata dello stato "fire" in millisecondi.
      this.lastShotTime = -Infinity; // Per tenere traccia dell'ultimo momento dello sparo.
      this.magazineSize = 10; // Numero di proiettili per caricatore
      this.currentAmmo = this.magazineSize; // Munizioni attuali
      this.reloadTime = 2000; // Tempo di ricarica in millisecondi
      this.isReloading = false;
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
    if (this.currentAmmo <= 3) {
      fill(255, 0, 0); // Imposta il colore del testo a rosso (RGB) per le munizioni basse
    }else {
      fill(255); // Imposta il colore del testo a bianco per le munizioni normali
    }
    text(`Munizioni: ${this.currentAmmo} / ${this.magazineSize}`, width -150 , 50);
    if (this.isReloading) {
      fill(0, 255, 0); // Imposta il colore del testo a verde (RGB) per la ricarica
      text('Ricarica...', width -100, 90);
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

      if (keyIsDown(82)) { // 82 è il codice per il tasto "R"
        this.reload();
      }

      this.pos.add(xSpeed, ySpeed);
      this.angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x); // add this
      this.createParticles();
    }

    reload() {
      if (this.currentAmmo < this.magazineSize && !this.isReloading) {
        this.isReloading = true;
        setTimeout(() => {
          this.currentAmmo = this.magazineSize;
          this.isReloading = false;
          this.reload_sound.play();
        }, this.reloadTime);
      }
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
  if (this.currentAmmo > 0 && !this.isReloading) {
    // ... creazione del proiettile
    let bullet = new Bullet(this.pos.x, this.pos.y, this.angle);
    this.bullets.push(bullet);
    this.shoot_sound.play();

    this.setFire();
    this.currentAmmo--;
  } else if (this.currentAmmo === 0) {
    // Suono di "mancanza di munizioni" se tenti di sparare senza munizioni
    this.bullet_empty_sound.play();
    this.reload(); // Inizia automaticamente la ricarica se non ci sono munizioni
  }
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

    hasCollided(zombie) {
        return dist(this.pos.x, this.pos.y, zombie.pos.x, zombie.pos.y) < 20;
    }

    handleCollision(wall) {
      //impedi ulteriori movimenti in quella direzione, ecc.
      let xSpeed = 0;
      let ySpeed = 0;
      if (keyIsDown(65)) {
        xSpeed = 2;
      }
      
      if (keyIsDown(68)) {
        xSpeed = -2;
      }

      if (keyIsDown(87)) {
        ySpeed = 2;
      }

      if (keyIsDown(83)) {
        ySpeed = -2;
      }

      this.pos.add(xSpeed, ySpeed);

      // Inoltre, potresti voler ripristinare la posizione precedente
      this.oldPos = this.pos.copy();
      
    }
  }