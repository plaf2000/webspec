import { Axes } from "./Axes.js";
import { DrawablePXBox, PXBox } from "./Box.js";
import { xyGenCoord } from "./Coord.js";
import { Track } from "./Track.js";
import { View } from "./View.js";
import { AxT, uList, xUnit, yUnit } from "./Units.js";
import { PXCoord } from "./Coord.js";
import { Spec } from "./Spec.js";


export abstract class Ax<A extends AxT, U extends uList<A>> extends DrawablePXBox {
  ax: A;
  unit: U;
  first: number = 0;
  delta: number = 0;
  deltas: number[];
  multiples: Set<Number>[];

  constructor(ctx: CanvasRenderingContext2D, tl: PXCoord, br: PXCoord, ax: A, unit: U, deltas = [1,1/2,1/4,1/8]) {
    super(ctx, tl, br);
    this.ctx = ctx;
    this.unit = unit;
    this.ax = ax;
    this.deltas = deltas.sort().reverse();
    this.multiples = this.deltas.map((delta,k,deltas)=> {
      let set = new Set<Number>().add(1);
      for(let m=2; m<Math.ceil(1/delta); m++) {
        let ok = true;
        for(let i=0; i<k; i++) {
          if((delta*m)%deltas[i]==0) {
            ok = false;
            break;
          }
        }
        if(ok) set.add(m);
      }
      return set;
    })
  }

  get start(): number {
    return Math.min(+this.tl[this.ax][this.unit],+this.br[this.ax][this.unit])
  }
  get end(): number{
    return Math.max(+this.tl[this.ax][this.unit],+this.br[this.ax][this.unit])
  }

  abstract drawTick(val: number, size: number): void;

  drawOnCanvas(): void {
    
    let dec = Math.floor(Math.log10(this.end-this.start));
    let u = Math.pow(10,dec)
    let s = Math.floor(this.start/u)*u;
    let e = Math.ceil(this.end/u)*u;

    // console.log(s,e);

    this.ctx.strokeStyle = "black";

    while(s<=e) {
      for(let k of this.deltas.keys()) {
        const delta = this.deltas[k];
        for(const m of this.multiples[k]) {
          const val = s+ +m*delta*u
          if(val>this.end) break;
          this.drawTick(val, delta);
        }
      }
      s+=u;
    }
    

    this.ctx.stroke();
  }
}

export class xAx<U extends uList<"x">> extends Ax<"x",U> {

  len = 15;
  txt_top_margin = 2;

  constructor(ctx: CanvasRenderingContext2D, tl: PXCoord, br: PXCoord, unit: U, deltas?: number[]) {
    super(ctx, tl, br, "x", unit, deltas);
  }

  drawTick(val: number,size: number) {
    let l=this.len*size;
    const x = new xUnit(val,this.unit);
    this.ctx.moveTo(x.px,this.t.px);
    this.ctx.lineTo(x.px,this.t.px+l);
    if((size==this.deltas[0])){ 
      let label: string;
      if(this.unit=="date") {
        label = x["date"].toTimeString();
      }
      else {
        label = x[this.unit].toString();
      }
      this.ctx.textAlign = "center";
      this.ctx.textBaseline="top";
      this.ctx.strokeText(label,x.px,this.t.px+l+this.txt_top_margin)
    }
  }
}
