class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 16;
    this.bulletImg = loadImage('/static/assets/Game_Icons/BulletProjectile.png');

    // Nuovi attributi per l'animazione di dissipazione
    this.dissipating = false;
    this.dissipateFrames = []; // Array che conterrà i frame dell'animazione
    this.dissipateIndex = 0;
    this.frameChangeInterval = 400; // Intervallo di 200ms per il cambio frame
    this.lastFrameChange = millis(); // Tempo dell'ultimo cambio frame
    this.hasHit = false;
    // Carica i frame per l'animazione di dissipazione
    for (let i = 0; i < 2; i++) {
      this.dissipateFrames.push(loadImage(`/static/assets/Game_Icons/BulletProjectile_Dissapate${i}.png`));
    }
  }
  
  draw() {
    push();
    imageMode(CENTER);
    
    if (this.dissipating) {
      if (millis() - this.lastFrameChange > this.frameChangeInterval && this.dissipateIndex < this.dissipateFrames.length - 1) {
        this.dissipateIndex++;
        this.lastFrameChange = millis();
      } else if (this.dissipateIndex >= this.dissipateFrames.length - 1) {
        this.remove = true; // Pronto per essere rimosso
      }
      
      image(this.dissipateFrames[this.dissipateIndex], this.x, this.y, 30, 30);
    } else {
      image(this.bulletImg, this.x, this.y, 30, 30);
    }

    pop();
}
  
  update() {
    // Aggiorna solo se il proiettile non sta dissipando
    if (!this.dissipating) {
      this.x += this.speed * cos(this.angle);
      this.y += this.speed * sin(this.angle);
    }
  }

  beginDissipation() {
    this.dissipating = true;
  }
}