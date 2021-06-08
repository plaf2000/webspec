class Axes {
    deltas: number[] = [1, 2, 5];
  
    x: xAx = new xAx(this);
    y: yAx = new yAx(this);
  
    constructor() {
      this.updateAll();
      this.drawOnCanvas();
    }
  
    updateAll(): void {
      this.x.updateAll();
      this.y.updateAll();
    };
  
    updatePos(): void {
      this.x.updatePos();
      this.y.updatePos();
    };
  
    drawOnCanvas(): void {
      this.x.drawOnCanvas();
      this.y.drawOnCanvas();
    };
  
  }