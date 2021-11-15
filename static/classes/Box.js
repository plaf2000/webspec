import { View } from "./View";
import { Values } from "./Values";
export class Box {
    constructor(xstart, xend, ystart, yend) {
        this.xstart = xstart;
        this.xend = xend;
        this.ystart = ystart;
        this.yend = yend;
    }
    isHover(x, y) {
        return x >= this.xstart && x <= this.xend && y >= this.ystart && y <= this.yend;
    }
    isHoverStrict(x, y) {
        return x > this.xstart && x < this.xend && y > this.ystart && y < this.yend;
    }
}
export class DrawableBox extends Box {
    constructor(xstart, xend, ystart, yend) {
        super(xstart, xend, ystart, yend);
    }
    stoPx(t) {
        return (t - View.tx) / Values.sPx * View.rx + this.xstart;
    }
    pxtoS(x) {
        return (x - this.xstart) / View.rx * Values.sPx + View.tx;
    }
    HztoPx(f) {
        return (View.fy - f) / Values.HzPx * View.ry + this.ystart;
    }
    pxtoHz(y) {
        return View.fy - (y - this.ystart) / View.ry * Values.HzPx;
    }
}
