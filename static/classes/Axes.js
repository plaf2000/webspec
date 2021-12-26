import { xAx, yAx } from './Ax';
export class Axes {
    constructor() {
        this.deltas = [1, 2, 5];
        this.x = new xAx(this);
        this.y = new yAx(this);
        this.updateAll();
        this.drawOnCanvas();
    }
    updateAll() {
        this.x.updateAll();
        this.y.updateAll();
    }
    updatePos() {
        this.x.updatePos();
        this.y.updatePos();
    }
    drawOnCanvas() {
        this.x.drawOnCanvas();
        this.y.drawOnCanvas();
    }
}
