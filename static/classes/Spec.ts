import { Box, DrawableBox } from "./Box.js";
import { pxCoord, PXCoord, xyGenCoord } from "./Coord.js";
import { AxT, Unit, Units } from "./Units.js";

export class Spec {
  time_offset: number;
  private tl_: Units;
  private br_: Units;
  ctx: CanvasRenderingContext2D;

  zoommed_r = {
    x: 1,
    y: 1,
  };

  bound: {
    dx: number;
    y: {
      min: number;
      max: number;
    };
  };

  zoom_r = {
    x: 1.14,
    y: 1.14,
  };

  get tl(): PXCoord {
    return pxCoord(this.tl_.x.px, this.tl_.y.px);
  }

  get br(): PXCoord {
    return pxCoord(this.br_.x.px, this.br_.y.px);
  }

  get box(): DrawableBox<PXCoord, PXCoord> {
    return new DrawableBox(this.ctx, this.tl, this.br);
  }

  delta<A extends keyof Units, U extends keyof Units[A]>(ax: A, u: U): number {
    return +this.tl_[ax][u] - +this.br_[ax][u];
  }

  ratio<
    A extends keyof Units,
    U extends keyof Units[A],
    V extends keyof Units[A]
  >(ax: A, u: U, v: V) {
    return this.delta(ax, u) / this.delta(ax, v);
  }

  constructor(
    ctx: CanvasRenderingContext2D,
    tl: Units,
    br: Units,
    dx_limit: number
  ) {
    Unit.spec = this;
    this.ctx = ctx;
    this.tl_ = tl;
    this.br_ = br;
    this.time_offset = tl.x.date.getMilliseconds() - tl.x.s * 1000;
    this.bound = {
      dx: dx_limit,
      y: {
        max: tl.y.hz,
        min: br.y.hz,
      },
    };
  }

  updateDate() {
    let getDate = (val: number) => new Date(this.time_offset + val * 1000);
    this.tl_.x.date = getDate(this.tl_.x.s);
    this.br_.x.date = getDate(this.br_.x.s);
  }

  zoom(p: PXCoord, dir: number, shift: boolean) {
    let rx = Math.pow(this.zoom_r.x, dir);
    let newU = (old: number, v: number, r: number) => v - (v - old) * r;
    let newS = (old: number) => newU(old, p.x.s, rx);
    if (this.boundX(newS(this.tl_.x.s), newS(this.br_.x.s))) this.updateDate();

    if (!shift) {
      let ry = Math.pow(this.zoom_r.x, dir);
      let newHz = (old: number) => newU(old, p.y.hz, ry);
      this.boundY(newHz(this.tl_.y.hz), newHz(this.br_.y.hz));
    }
  }

  boundX(tl: number, br: number): boolean {
    if (br - tl < this.bound.dx) {
      this.tl_.x.s = tl;
      this.br_.x.s = br;
      return true;
    }
    return false;
  }

  boundY(tl: number, br: number) {
    this.tl_.y.hz = Math.min(tl, this.bound.y.max);
    this.br_.y.hz = Math.max(this.bound.y.min, br);
  }

  conv<A extends AxT, F extends keyof Units[A], T extends keyof Units[A]>(
    v: Units[A][F],
    f: F,
    t: T,
    a: A
  ): any {
    let res: number =
      (+v - +this.tl_[a][f]) * this.ratio(a, t, f) + +this.tl_[a][t];
    if (t == "date") return new Date(res);
    return res;
  }

}
