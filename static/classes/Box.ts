import { View } from "./View";
import { Values } from "./Values"

export class Box {

  xstart: number;
  xend: number;
  ystart: number;
  yend: number;

  constructor(xstart: number, xend: number, ystart: number, yend: number) {
    this.xstart = xstart;
    this.xend = xend;
    this.ystart = ystart;
    this.yend = yend;
  }

  isHover(x: number,y: number) {
    return x>=this.xstart && x<=this.xend && y>= this.ystart && y<=this.yend;
  }

  isHoverStrict(x: number,y: number) {
    return x>this.xstart && x<this.xend && y> this.ystart && y<this.yend;
  }
}

export class DrawableBox extends Box {
  constructor(xstart: number,xend: number,ystart: number,yend: number) {
    super(xstart,xend,ystart,yend)
  }

  stoPx(t: number) {
    return (t-View.tx)/Values.sPx*View.rx+this.xstart;
  }

  pxtoS(x: number) {
    return (x-this.xstart)/View.rx*Values.sPx+View.tx;
  }

  HztoPx(f: number) {
    return (View.fy-f)/Values.HzPx*View.ry+this.ystart;
  }

  pxtoHz(y: number) {
    return View.fy-(y-this.ystart)/View.ry*Values.HzPx;
  }
  

}