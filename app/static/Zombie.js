
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
      this.w = 40;
      this.h = 40;
      this.state = 'running';
      this.deathTime = 0; // Il tempo della morte è inizialmente 0
      this.isDestroyed = false;  // Flag che indica se il mostro è stato distrutto
      this.preload();
    } 
    
    preload() {
        let animation_run = [];
        let animation_attack = [];
        for (let i = 1; i < 5; i++) {
            animation_run.push(loadImage(`static/assets/Zombie/Zombie_run_${i}.png`));
        }
        for (let i = 1; i < 5; i++) {
            animation_attack.push(loadImage(`static/assets/Zombie/Zombie_attack_${i}.png`));
        }
        this.img_dead = loadImage('static/assets/Zombie/Zombie_dead.png');
        this.animation_attack = animation_attack;
        this.animation_run = animation_run;
        this.destroy_sound = loadSound('static/sounds/destroy.wav');
    }
    draw() {
      push();
      translate(this.pos.x, this.pos.y);
      imageMode(CENTER);
    
      if (this.state !== 'dead') {
        // Se lo zombie non è morto, ruotare per guardare verso il giocatore
        this.angle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
        rotate(this.angle);
      } else {
        // Se lo zombie è morto, utilizzare l'ultimo angolo calcolato per mantenerne l'orientamento
        rotate(this.angle);
        // Qui puoi gestire ulteriori logiche di disegno specifiche per lo zombie morto
      }
      // Scegli l'animazione in base allo stato
      let currentAnimationFrames;
      switch(this.state) {
          case 'running':
              currentAnimationFrames = this.animation_run;
              break;
          case 'attacking':
              currentAnimationFrames = this.animation_attack;
              break;
          case 'dead':
              image(this.img_dead, 0, 0, this.w, this.h);
              pop(); // Non dimenticare di chiamare pop() prima di return se non continui a disegnare.
              return;
          default:
              // Se non ci sono stati definiti, non disegnare nulla o scegliere un'opzione predefinita.
              pop();
              return;
      }

      // Calcola quale frame dell'animazione mostrare basandosi sul tempo o su un altro meccanismo
      let frameIndex = floor(frameCount / 10) % currentAnimationFrames.length;
      image(currentAnimationFrames[frameIndex], 0, 0, 40, 40);
      
      // Barra della salute (rimane uguale)
      fill(100, 255, 100);
      let healthWidth = map(this.health, 0, this.max_health, 0, 20);
      fill(255, 0, 0);
      rect(0, -25, healthWidth * 1.5, 5);
      
      pop();
    }
    
    
    update() {
      if (this.state === 'dead') {
        // Se lo zombie è nello stato 'dead' e non è ancora stato rimosso dalla scena
        if (!this.isDestroyed) {
          // Controlla se sono trascorsi 3 secondi da `deathTime`
          if (Date.now() - this.deathTime >= 3000) {
            this.isDestroyed = true; // Marca lo zombie come rimosso
            // Rimuovi lo zombie dall'array degli zombie
            let index = zombies.indexOf(this);
            if(index > -1) {
              zombies.splice(index, 1);
            }
            console.log('Zombie rimosso dalla scena');
          }
        }
      } else {
        // Aggiorna posizione e stato se lo zombie non è morto
        let direction = p5.Vector.sub(player.pos, this.pos);
        direction.limit(this.speed);
        this.pos.add(direction);
        // Controlla se lo zombie ha raggiunto il giocatore
        if (this.ateYou()) {
          this.state = 'attacking';
        }
      }
    }
    
    takeDamage() {
      if (this.isDestroyed) return false; // Non fare nulla se il mostro è già distrutto
    
      this.health--;
      if (this.health < 1) {
        this.state = 'dead';
        this.deathTime = Date.now(); // Memorizza il tempo della morte
        this.destroy_sound.play();
        return true;
      }
      return false;
    }

    ateYou() {
      this.state = 'attacking';
      return dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y) < (20 + player.radius);
    }

    handleCollision(wall) {
       // Calcola la direzione in cui lo zombie si sta muovendo
  let movementDirection = p5.Vector.sub(player.pos, this.pos);
  movementDirection.normalize();
  
  // Considera il centro del muro e calcola la normale alla superficie al punto di collisione
  let wallNormal = p5.Vector.sub(this.pos, createVector(wall.x + wall.w / 2, wall.y + wall.h / 2)).normalize();
  
  // Riflette la direzione di movimento dello zombie utilizzando la normale del muro
  // La riflessione è calcolata come: vettore_riflesso = dir - 2 * (dir · norm) * norm
  let dotProduct = movementDirection.dot(wallNormal);
  let reflection = p5.Vector.sub(movementDirection, wallNormal.mult(2 * dotProduct));
  
  // Imposta la nuova direzione di movimento allo zombie post-collisione
  this.pos.add(reflection);

  }
  }