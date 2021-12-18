import { Canvas } from "./Canvas";
import { Values } from "./Values";
import { Track } from "./Track";
export class View {
  rx: number = 1;
  ry: number = 1;
  x: number = 0;
  y: number = 0;
  detx: number = 0;
  dety: number = 0;
  origOffset: number;
  origFrame: number = 0;
  actualI: number = 0;

  start: number;
  end: number;

  fy: number = 0;
  tx: number = 0;

  txend: number = 0;
  fyend: number = 0;

  top: number;
  left: number;

  xend: number;
  yend: number;

  constructor(top: number, left: number, offset: number, dur: number) {
    this.origOffset = offset;
    this.start = offset;
    this.end = offset + dur;
    this.left = left;
    this.top = top;
  }


  setOffset(top: number, left: number, offset: number, dur: number) {
    this.origOffset = offset;
    this.start = offset;
    this.end = offset + dur;
    this.left = left;
    this.top = top;
  }

  zoom(
    dir: number,
    ratio: number,
    x: number,
    y: number,
    shiftPressed: boolean
  ) {
    let newRx: number = this.rx * ratio;
    // if(newRx<.018) return;
    newRx =
      Math.round(newRx * Math.pow(10, 12)) / Math.pow(10, 12) == 1 ? 1 : newRx;

    let newRy: number = this.ry * ratio;
    newRy =
      Math.round(newRy * Math.pow(10, 12)) / Math.pow(10, 12) <= 1 ? 1 : newRy;

    Canvas.ctx.resetTransform();

    let absx: number = this.x + x / this.rx;
    let absy: number = this.y + y / this.ry;

    let ry: number = 1;

    if (!shiftPressed) {
      ry = ratio;
      this.ry = newRy;
    }
    if (newRx <= 1) {
      ry = 1;
      this.ry = 1;
    }

    this.rx = newRx;

    this.x = 0;
    this.y = 0;

    Canvas.ctx.scale(this.rx, this.ry);

    var dx = x - absx * this.rx;
    var dy = y - absy * this.ry;

    this.pan(dx, dy);
  }

  pan(dx: number, dy: number) {
    let x: number = this.x - dx / this.rx;
    let y: number = this.y - dy / this.ry;

    this.moveTo(x, y, undefined, undefined);
  }

  moveTo(xPx?: number, yPx?: number, xT?: number, yF?: number): void {
    if (!xPx && !xT) {
      throw new Error("x coordinates not specified!");
    }

    if (!yPx && !yF) {
      throw new Error("y coordinates not specified!");
    }

    if (yPx) {
      yF = this.pxtoHz(yPx);
    } else {
      yPx = yF ? this.HztoPx(yF) : 0;
      yF = yF ? yF : 0;
    }

    if (xPx) {
      xT = this.pxtoS(xPx);
    } else {
      xPx = xT ? this.stoPx(xT) : 0;
      xT = xT ? xT : 0;
    }

    if (yPx < 0) {
      yPx = 0;
      yF = Values.hf;
    } else if (yPx + Canvas.cvs.height / this.ry > Canvas.cvs.height) {
      yPx = Canvas.cvs.height * (1 - 1 / this.ry);
      yF = Values.hf - (Values.hf - Values.lf) * (1 - 1 / this.ry);
    }

    if (xT + (Canvas.cvs.width * Values.sPx) / this.rx > Track.audio.duration) {
      xT = Track.audio.duration - (Canvas.cvs.width * Values.sPx) / this.rx;
      xPx = this.stoPx(xT);
    }

    if (xT < 0) {
      xT = 0;
      xPx = this.stoPx(0);
    }

    let dx: number = this.x - xPx;
    let dy: number = this.y - yPx;

    Canvas.ctx.translate(dx, dy);

    this.detx += dx * this.rx;
    this.dety += dy * this.ry;

    this.x = xPx;
    this.y = yPx;

    this.xend = this.x + Canvas.cvs.width / this.rx;
    this.yend = this.y + Canvas.cvs.height / this.ry;

    this.tx = xT;
    this.fy = yF;

    this.txend = this.pxtoS(this.xend);
    this.fyend = this.pxtoHz(this.yend);

    // while (this.tx < this.start && this.start > 0) {
    //   // this.start =  ? 0 : this.start-dur;
    //   // addToCanvas(this.start,true);
    //   if (this.start > Values.dur) {
    //     this.start -= Values.dur;
    //     addToCanvas(this.start, nSpecs, true);
    //   } else {
    //     addToCanvas(0, nSpecs, true);
    //     // addToCanvas(0,true,this.start);
    //     this.start = 0;
    //   }
    //   nSpecs++;
    // }

    // while (this.txend > this.end && this.end < audio.duration) {
    //   if (this.end + Values.dur < audio.duration) {
    //     addToCanvas(this.end, nSpecs, false);
    //     this.end += Values.dur;
    //   } else {
    //     addToCanvas(this.end, nSpecs, false, audio.duration - this.end);
    //     this.end = audio.duration;
    //   }
    //   nSpecs++;
    // }
  }

  stoPx(t: number) {
    return (t - this.origOffset) / Values.sPx + this.left / this.rx;
  }

  pxtoS(x: number) {
    return (x - this.left / this.rx) * Values.sPx + this.origOffset;
  }

  HztoPx(f: number) {
    return (Values.hf - f) / Values.HzPx + this.top / this.ry;
  }

  pxtoHz(y: number) {
    return Values.hf - (y - this.top / this.ry) * Values.HzPx;
  }
}
