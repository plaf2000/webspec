import { Ax, xAx, yAx } from './Ax';


export class Axes {
  deltas: number[] = [1, 2, 5];

  x: xAx;
  y: yAx;

  constructor() {
    this.x = new xAx(this);
    this.y = new yAx(this);
    this.updateAll();
    this.drawOnCanvas();
  }

  updateAll(): void {
    this.x.updateAll();
    this.y.updateAll();
  }

  updatePos(): void {
    this.x.updatePos();
    this.y.updatePos();
  }

  drawOnCanvas(): void {
    this.x.drawOnCanvas();
    this.y.drawOnCanvas();
  }
}
