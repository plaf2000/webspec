import { Canvas } from './Canvas';
import { Axes } from "./Axes.js";
import { DrawablePXBox, PXBox } from "./Box.js";
import { xyGenCoord } from "./Coord.js";
import { Track } from "./Track.js";
import { View } from "./View.js";
import {
  AxT,
  convertDist,
  DateTime,
  uList,
  Unit,
  xUnit,
  yUnit,
} from "./Units.js";
import { PXCoord } from "./Coord.js";
import { Spec } from "./Spec.js";
// import { timers } from "jquery";

type Delta = {
  ses: number[];
  dec: number[];
  large_ses: number[];
};

export abstract class Ax<
  A extends AxT,
  U extends uList<A>
> extends DrawablePXBox {
  ctx: CanvasRenderingContext2D;
  ax: A;
  unit: U;
  first: number = 0;
  delta: number = 0;
  offset: number = 0;
  system: keyof Delta = "dec";
  deltas_ticks: number[];
  deltas_unit: Delta;
  multiples: Set<number>[];
  font_size = 11;
  len = 5;
  dyn_len = 12;
  txt_margin = 2;
  abstract label_dist_px: number;

  get label_dist(): number {
    return convertDist(this.label_dist_px, this.ax, "px", this.unit);
  }

  constructor(
    cvs: Canvas,
    tl: PXCoord,
    br: PXCoord,
    ax: A,
    unit: U,
    deltas_ticks = [1, 1 / 2, 1 / 4, 1 / 8],
    deltas_units = {
      dec: [1, 1 / 2, 1 / 4, 1 / 5, 1 / 8],
      large_ses: [1, 1 / 2, 1 / 4, 1 / 8],
      ses: [1, 1 / 2, 1 / 3, 1 / 4, 1 / 6, 1 / 12, 1 / 15, 1 / 20, 1 / 30],
    }
  ) {
    super(cvs, tl, br);
    this.ctx = cvs.ctx;
    this.unit = unit;
    this.ax = ax;
    this.deltas_ticks = deltas_ticks.sort().reverse();
    this.deltas_unit = {
      dec: deltas_units.dec.sort().reverse(),
      large_ses: deltas_units.large_ses.sort().reverse(),
      ses: deltas_units.ses.sort().reverse(),
    };
    // Compute all the multiples so that ticks don't get overwritten
    // Example: deltas_ticks.dec = [1,1/2,1/4,1/8] => multiples = [{1},{1},{1,3 (not 2!)}, {1,3,5,7}]
    this.multiples = this.deltas_ticks.map((delta, k, deltas_ticks) => {
      let set = new Set<number>().add(1); // Assume al deltas_ticks.dec are different
      for (let m = 2; m < Math.ceil(1 / delta); m++) {
        let ok = true;
        // Check that this delta multiplied by m is not a multiple of any larger delta
        for (let i = 0; i < k; i++) {
          // Assumes this.deltas_ticks.dec is sorted!
          if ((delta * m) % this.deltas_ticks[i] == 0) {
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

  getTickL(size: number): number {
    return this.len + this.dyn_len * size;
  }

  abstract drawTick(val: number, size: number): void;

  abstract drawUnit(): void;

  getDecUnit(): number {
    let dec = Math.ceil(Math.log10(this.label_dist));
    return Math.pow(10, dec);
  }

  shrinkUnit(inital: number, system: keyof Delta = this.system): number {
    let u = inital;
    let du = this.deltas_unit[system];
    for (let k = 0; inital * du[k] > this.label_dist && k < du.length; k++)
      u = inital * du[k];
    return u;
  }

  getUnit(): number {
    // Compute the base-ten order to express a single unit, while keeping the specified distance
    let u = this.getDecUnit();

    // If distance is too large, use delta values to shrink it
    return this.shrinkUnit(u);
  }

  drawOnCanvas(): void {
    let u = this.getUnit();
    let mid =
      Math.floor(
        (this.start + this.end) / 2 / u / this.deltas_unit[this.system][0]
      ) *
        u *
        this.deltas_unit[this.system][0] - this.offset;
    let pos = mid;

    this.ctx.strokeStyle = "black";
    this.ctx.font = `${this.font_size}px Arial`;

    // Draw all the ticks between one unit and the other
    // Ex: interval: (1,2), deltas: [1,.5,.25] => draws 1.25,1.5,1.75,2
    let draw = (pt: number, u: number) => {
      for (let k of this.deltas_ticks.keys()) {
        const delta = this.deltas_ticks[k];
        for (const m of this.multiples[k]) {
          const val = pt + m * delta * u;
          if (val > this.end || val < this.start) break;
          this.drawTick(val, delta);
        }
      }
    };

    // Starts drawing the tick on the midpoint (because of floor)
    this.drawTick(mid, this.deltas_ticks[0]);

    // Fills with ticks on the left
    for (; pos >= this.start; pos -= u) draw(pos, -u);

    // Fills with ticks on the right
    for (pos = mid; pos <= this.end; pos += u) draw(pos, u);

    this.ctx.stroke();

    this.drawUnit();
  }
}

export class xAx<U extends uList<"x">> extends Ax<"x", U> {
  label_dist_px = this.font_size * 7;

  constructor(
    cvs: Canvas,
    tl: PXCoord,
    br: PXCoord,
    unit: U,
    deltas_ticks?: number[],
    deltas_units?: Delta
  ) {
    super(cvs, tl, br, "x", unit, deltas_ticks, deltas_units);
    this.system = unit == "s" || unit == "date" ? "ses" : "dec";
  }

  getUnit(): number {
    // Compute the base-ten order to express a single unit, while keeping the specified distance
    let u = this.getDecUnit();
    let system: keyof Delta = "dec";

    let factor = this.unit == "date" ? 1000 : 1;
    this.offset = 0;

    if (this.system == "ses" && u > 1 * factor) {
      let ses = Math.ceil(Math.log(this.label_dist / factor) / Math.log(60));
      u = factor * Math.pow(60, ses);
      // while (u < this.label_dist) u = factor * Math.pow(60, ++ses);

      if (this.unit == "date" && u > 3600 * factor) {
        // console.log(u)
        u = 86400 * factor;
        u *= Math.ceil(this.label_dist / u);
        system = "large_ses";
        this.offset = this.tl.x.date.offset;
      } else {
        system = "ses";
      }
    }

    // If distance is too large, use delta values to shrink it
    return this.shrinkUnit(u, system);
  }

  drawTick(val: number, size: number) {
    let l = this.getTickL(size);
    const x = new xUnit(val, this.unit);
    this.ctx.moveTo(x.px, this.t.px);
    this.ctx.lineTo(x.px, this.t.px + l);
    if (size == this.deltas_ticks[0]) {
      let label: string;
      if (this.unit == "date") {
        let date_time = x["date"];
        label = date_time.toTimeString();
      } else {
        label = x[this.unit].toString();
      }
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "top";
      label
        .split("\n")
        .map((txt, i) =>
          this.ctx.strokeText(
            txt,
            x.px,
            this.t.px + l + this.txt_margin + (this.font_size + 2) * i
          )
        );
    }
  }

  drawUnit() {
    let unit_pos = 25 + this.t.px + this.len + this.dyn_len + this.txt_margin;
    let center = (this.l.px + this.r.px) / 2;

    let writeUnit = (text: string) => {
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "top";
      this.ctx.strokeText(text, center, unit_pos);
    };

    if (this.unit == "date") {
      let l = this.br.x.date;

      let s_dt = new DateTime(this.start);
      let e_dt = new DateTime(this.end);

      let sm = +s_dt.midnight;
      let em = +e_dt.midnight;


      let bar_len = 31;
      let bar_pos = unit_pos - 10;

      if (sm < em) {
        let one_day = 86_400_000;
        let day = one_day;

        day *= Math.ceil(this.label_dist / day);

        let bar_margin = 6;

        let writeRightSide = (pos: number) => {
          // if(pos<this.start || pos>this.end) return;
          this.ctx.textAlign = "left";
          this.ctx.textBaseline = "top";
          let midnight = new xUnit(pos, "date");
          this.ctx.moveTo(midnight.px, bar_pos);
          this.ctx.lineTo(midnight.px, bar_pos + bar_len);
          this.ctx.stroke();
          this.ctx.strokeText(
            midnight.date.toDateString(),
            midnight.px + bar_margin,
            unit_pos
          );
        };

        let mid = +new DateTime(Math.floor((sm + em) / 2)).midnight;
        let d;

        for (d = mid; d >= +this.start; d -= day) writeRightSide(d);

        d += day;
        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "top";
        // let local_pos = new DateTime();
        // local_pos.local = new DateTime(d);
        let midnight_pos = new xUnit(d, "date");
        let midnight = new xUnit(d - day, "date");
        this.ctx.strokeText(
          midnight.date.toDateString(),
          midnight_pos.px - bar_margin,
          unit_pos
        );

        for (d = mid + day; d <= +this.end; d += day) writeRightSide(d);
      } else {
        writeUnit(s_dt.toDateString());
      }
      unit_pos = this.txt_margin + bar_len + bar_pos;
      writeUnit(s_dt.toTimeZoneString());
    } else if (this.unit == "s") {
      writeUnit("Time");
    } else {
      writeUnit(this.unit);
    }
  }
}

export class yAx<U extends uList<"y">> extends Ax<"y", U> {
  label_dist_px = this.font_size * 4;

  constructor(
    cvs: Canvas,
    tl: PXCoord,
    br: PXCoord,
    unit: U,
    deltas_ticks?: number[],
    deltas_units?: Delta
  ) {
    super(cvs, tl, br, "y", unit, deltas_ticks, deltas_units);
  }

  drawTick(val: number, size: number): void {
    let l = this.getTickL(size);
    const y = new yUnit(val, this.unit);
    this.ctx.moveTo(this.r.px, y.px);
    this.ctx.lineTo(this.r.px - l, y.px);
    if (size == this.deltas_ticks[0]) {
      let label = y.toString(this.unit, 4);
      this.ctx.textAlign = "right";
      this.ctx.textBaseline = "middle";
      this.ctx.strokeText(label, this.r.px - l - this.txt_margin, y.px);
    }
  }

  drawUnit() {
    let text = this.unit == "hz" ? "Hz" : this.unit;
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "middle";
    this.ctx.strokeText(text, this.l.px + 20, (this.t.px + this.b.px) / 2);
  }
}
