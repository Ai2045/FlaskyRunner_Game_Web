class Wall {
    constructor(x, y, w, h) {
      this.pos = createVector(x, y);
      this.w = w;
      this.h = h;
    }
    
    draw() {
      fill(170); // Colore grigio per i muri
      rect(this.pos.x, this.pos.y, this.w, this.h);
    }
  }