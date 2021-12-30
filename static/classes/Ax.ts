import { Axes } from "./Axes.js";
import { DrawablePXBox, PXBox } from "./Box.js";
import { xyGenCoord } from "./Coord.js";
import { Track } from "./Track.js";
import { View } from "./View.js";
import { AxT, convertDist, DateTime, uList, Unit, xUnit, yUnit } from "./Units.js";
import { PXCoord } from "./Coord.js";
import { Spec } from "./Spec.js";

export abstract class Ax<
  A extends AxT,
  U extends uList<A>
> extends DrawablePXBox {
  ax: A;
  unit: U;
  first: number = 0;
  delta: number = 0;
  deltas: number[];
  multiples: Set<number>[];
  abstract label_dist_px: number;

  get label_dist(): number {
    return convertDist(this.label_dist_px, this.ax, "px", this.unit);
  }

  constructor(
    ctx: CanvasRenderingContext2D,
    tl: PXCoord,
    br: PXCoord,
    ax: A,
    unit: U,
    deltas = [1, 1 / 2, 1 / 4, 1 / 8]
  ) {
    super(ctx, tl, br);
    this.ctx = ctx;
    this.unit = unit;
    this.ax = ax;
    this.deltas = deltas.sort().reverse();
    // Compute all the multiples so that ticks don't get overwritten
    // Example: deltas = [1,1/2,1/4,1/8] => multiples = [{1},{1},{1,3 (not 2!)}, {1,3,5,7}]
    this.multiples = this.deltas.map((delta, k, deltas) => {
      let set = new Set<number>().add(1); // Assume al deltas are different
      for (let m = 2; m < Math.ceil(1 / delta); m++) {
        let ok = true;
        // Check that this delta multiplied by m is not a multiple of any larger delta
        for (let i = 0; i < k; i++) {
          // Assumes this.deltas is sorted!
          if ((delta * m) % this.deltas[i] == 0) {
            ok = false;
            break;
          }
        }
        if (ok) set.add(m);
      }
      return set;
    });
  }

  get start(): number {
    return Math.min(+this.tl[this.ax][this.unit], +this.br[this.ax][this.unit]);
  }
  get end(): number {
    return Math.max(+this.tl[this.ax][this.unit], +this.br[this.ax][this.unit]);
  }

  abstract drawTick(val: number, size: number): void;

  drawOnCanvas(): void {
    // Compute the base-ten order to express a single unit, while keeping the specified distance
    let dec = Math.floor(Math.log10(this.end - this.start));
    let u_1 = Math.pow(10, dec);
    while (u_1 < this.label_dist) u_1 = Math.pow(10, ++dec);

    // If distance is too large, use delta values to shrink it
    let u = u_1;
    let k = 0;
    while (u_1 * this.deltas[k] > this.label_dist && k < this.deltas.length)
      u = u_1 * this.deltas[k++];
    let mid =
      Math.floor((this.start + this.end) / 2 / u / this.deltas[0]) *
      u *
      this.deltas[0];
    let pos = mid;

    this.ctx.strokeStyle = "black";

    // Draw all the ticks between one unit and the other
    // Ex: interval: (1,2), deltas: [1,.5,.25] => draws 1.25,1.5,1.75,2
    let draw = (pt: number, u: number) => {
      for (let k of this.deltas.keys()) {
        const delta = this.deltas[k];
        for (const m of this.multiples[k]) {
          const val = pt + m * delta * u;
          if (val > this.end || val < this.start) break;
          this.drawTick(val, delta);
        }
      }
    };

    // Starts drawing the tick on the midpoint (because of floor)
    this.drawTick(mid, this.deltas[0]);

    // Fills with ticks on the left
    while (pos >= this.start) {
      draw(pos, -u);
      pos -= u;
    }

    pos = mid;

    // Fills with ticks on the right
    while (pos <= this.end) {
      draw(pos, u);
      pos += u;
    }

    this.ctx.stroke();
  }
}

export class xAx<U extends uList<"x">> extends Ax<"x", U> {
  len = 15;
  txt_top_margin = 2;
  label_dist_px = 100;

  constructor(
    ctx: CanvasRenderingContext2D,
    tl: PXCoord,
    br: PXCoord,
    unit: U,
    deltas?: number[]
  ) {
    super(ctx, tl, br, "x", unit, deltas);
  }

  drawTick(val: number, size: number) {
    let l = this.len * size;
    const x = new xUnit(val, this.unit);
    this.ctx.moveTo(x.px, this.t.px);
    this.ctx.lineTo(x.px, this.t.px + l);
    if (size == this.deltas[0]) {
      let label: string;
      if (this.unit == "date") {
        console.log(x["date"] instanceof DateTime);
        label = (x["date"] as DateTime).toTimeString();
      } else {
        label = x[this.unit].toString();
      }
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "top";
      this.ctx.strokeText(label, x.px, this.t.px + l + this.txt_top_margin);
    }
  }
}
