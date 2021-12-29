import { Axes } from "./Axes";
import { DrawableBox } from "./Box";
import { xyGenCoord } from "./Coord";
import { Track } from "./Track";
import { View } from "./View";
import { AxT, uList, xUnit, yUnit } from "./Units";
import { PXCoord } from "./Coord";
import { Spec } from "./Spec";


export abstract class Ax<A extends AxT, U extends uList<A>> extends DrawableBox<xyGenCoord,xyGenCoord> {
  ax: A;
  unit: U;
  first: number = 0;
  delta: number = 0;
  deltas: number[];
  multiples: Set<Number>[];

  constructor(ctx: CanvasRenderingContext2D, tl: PXCoord, br: PXCoord, ax: A, unit: U, deltas = [1,1/2,1/4]) {
    super(ctx, tl, br);
    this.ctx = ctx;
    this.unit = unit;
    this.ax = ax;
    this.deltas = deltas.sort();
    this.multiples = [];
    for(const k of this.deltas.keys()) {
      this.multiples.push(new Set());
      const delta = this.deltas[k];
        for(let m=1; m<Math.ceil(1/delta); m++) {
          let ok = true;
          for(let i=0; i<delta; i++) {
            if(delta*m%i==0) {
              ok = false;
              break;
            }
          }
          if(ok) this.multiples[k].add(m);
        }
    }
  }

  get start(): number {
    return Math.min(+this.tl[this.ax][this.unit],+this.br[this.ax][this.unit])
  }
  get end(): number{
    return Math.max(+this.tl[this.ax][this.unit],+this.br[this.ax][this.unit])
  }

  abstract drawTick(val: number, size: number): void;

  drawOnCanvas(): void {
    
    let dec = Math.log10(this.end-this.start);
    let u = Math.pow(10,dec)
    let s = Math.floor(this.start/u);
    let e = Math.ceil(this.end/u);

    while(s<=e) {
      this.drawTick(s,1);
      for(let k of this.deltas.keys()) {
        const delta = this.deltas[k];
        for(const m of this.multiples[k]) {
          const val = s+ m.valueOf()*delta*u
          if(val>this.end) break;
          this.drawTick(val, delta);
        }
      }
      s+=u;
    }
    




    this.ctxAx.clearRect(0, 0, this.w, this.h);
    this.ctxAx.beginPath();

    for (
      let i: number = 0;
      this.first + i * this.delta <= this.unitEnd &&
      this.first + i * this.delta <= Track.audio.duration;
      i++
    ) {
      let value: number =
        Math.round((this.first + i * this.delta) * 1000) / 1000;
      let pos: number = ((value - this.unitStart) / this.rConv) * this.r;
      let time: Date = new Date(0, 0, 0, 0, 0, 0, 0);

      let timeStr: string = timeToStr(time, value);

      this.ctxAx.strokeStyle = "black";
      this.ctxAx.moveTo(pos, 0);
      this.ctxAx.lineTo(pos, 10);

      let sub: number = 1 / 4;

      for (let k: number = 1; k * sub < 1; k++) {
        let frac: number = Math.round(sub * k * 10000) / 10000;
        let halfValue: number =
          Math.round((this.first + (i + frac) * this.delta) * 100000) / 100000;
        if (halfValue <= Track.audio.duration) {
          let halfPos: number =
            ((halfValue - this.unitStart) / this.rConv) * this.r;

          this.ctxAx.strokeStyle = "black";
          this.ctxAx.moveTo(halfPos, 0);
          let len: number = 6;
          if (frac == 0.5) {
            len = 8;
          }

          this.ctxAx.lineTo(halfPos, len);
        }
      }

      this.ctxAx.font = fontSize + "px Roboto";

      if (this.unitEnd - value <= this.delta / 6) {
        this.ctxAx.textAlign = "right";
      } else if (value - this.unitStart <= this.delta / 6) {
        this.ctxAx.textAlign = "left";
      } else {
        this.ctxAx.textAlign = "center";
      }

      this.ctxAx.strokeText(timeStr, pos, 30);

      this.ctxAx.lineWidth = 1;
    }
    this.ctxAx.moveTo(0, 0);
    this.ctxAx.lineTo(this.w, 0);

    this.ctxAx.stroke();
  }
}

class xAx<U extends uList<"x">> extends Ax<"x",U> {

  len = 30;

  constructor(ctx: CanvasRenderingContext2D, tl: PXCoord, br: PXCoord, unit: U, deltas = [1,1/2,1/4]) {
    super(ctx, tl, br, "x", unit, deltas);
  }

  drawTick(val: number,size: number) {
    const x = new xUnit(val,this.unit);
    this.ctx.moveTo(x.px,this.t.px);
    this.ctx.lineTo(x.px,this.t.px+this.len*size);
    if(this.unit=="date") {

    }
  }
  drawOnCanvas() {
    
    ctx.beginPath();


    // console.log(audio.duration)
    for (var i = 0; this.first+i*this.delta <= view.txend && (isNaN(audio.duration) || this.first+i*this.delta <= audio.duration); i++) {
      var value = Math.round((this.first+i*this.delta)*1000)/1000;
      var pos = this.stoPx(value);
      var time = new Date(0,0,0,0,0,0,0);

      var timeStr = timeToStr(time,value);



      ctx.strokeStyle = "black";

      if(value>=view.tx) {
        ctx.moveTo(pos, this.y);
        ctx.lineTo(pos, this.y+10);

        ctx.font =fontSize+"px Roboto";
        ctx.textAlign = "center";

        ctx.lineWidth = "1";
        ctx.textBaseline='middle';
        ctx.strokeText(timeStr, pos, this.y+30);
      }
      

      var sub=1abstract
      for (var k = 1; k*sub < 1; k++) {
        var frac = Math.round(sub*k*10000)/10000;
        var halfValue = Math.round((this.first+(i+frac)*this.delta)*100000)/100000;

        if((isNaN(audio.duration) || halfValue<=audio.duration)) {
          var halfPos = this.stoPx(halfValue);

          ctx.strokeStyle = "black";
          ctx.moveTo(halfPos, this.y);
          var len = 6;
          if(frac==.5) {
            len=8;
          }

          

          if(halfValue>=view.tx) {
            ctx.lineTo(halfPos, this.y+len);
          }

        }


      }

      
    }

    ctx.moveTo(this.xstart,this.y);
    ctx.lineTo(this.xend,this.y);

    ctx.stroke();

  };
}

class yAx extends Ax {
  constructor(parent) {
    let x = fqwidth;
    super(x, x, tinfocvsheight, tinfocvsheight + fqheight);
    this.unit = "Hz";
    this.x = x;
    this.deltas = parent.deltas;
  }

  updateDelta() {
    var i = 0;
    var j = -1;
    while (
      ((Math.pow(10, j) * this.deltas[i]) / HzPx) * view.ry <
      cvsheight / 4
    ) {
      i++;
      if (i == this.deltas.length) {
        i = 0;
        j++;
      }
    }

    if (i == 0) {
      j--;
      i = this.deltas.length - 1;
    } else {
      i--;
    }
    this.delta = Math.pow(10, j) * this.deltas[i];
  }

  updatePos() {
    this.first = Math.ceil(view.fyend / this.delta - 1) * this.delta;
    if (this.first < 0) this.first = 0;
  }

  updateAll() {
    this.updateDelta();
    this.updatePos();
  }

  clear() {
    ctx.clearRect(0, 0, fqwidth, fqheight + tinfocvsheight + timelineheight);
  }

  inside(val) {
    return val <= view.fy && val >= view.fyend;
  }

  drawOnCanvas() {
    ctx.beginPath();

    for (var i = 0; this.first + i * this.delta <= view.fy; i++) {
      var value = Math.round((this.first + i * this.delta) * 1000) / 1000;
      var pos = this.HztoPx(value);
      if (this.inside(value)) {
        ctx.strokeStyle = "black";
        ctx.moveTo(this.x, pos);
        ctx.lineTo(this.x - 10, pos);

        ctx.font = fontSize + "px Roboto";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        ctx.strokeText(value, this.x - 15, pos);
      }

      var sub = 1 / 4;

      for (var k = 1; k * sub < 1; k++) {
        var frac = Math.round(sub * k * 10000) / 10000;
        var halfValue =
          Math.round((this.first + (i + frac) * this.delta) * 100000) / 100000;
        var halfPos = this.HztoPx(halfValue);
        if (this.inside(halfValue)) {
          ctx.moveTo(this.x, halfPos);
          var len = 6;
          if (frac == 0.5) {
            len = 8;
          }

          ctx.lineTo(this.x - len, halfPos);
        }
      }
    }
    ctx.stroke();
  }
}