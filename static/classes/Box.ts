import { Canvas } from './Canvas';
import { xyCoord, xyGenCoord, PXCoord, pxCoord } from "./Coord.js";
import { yUnit, xUnit, xGenUnit, yGenUnit, uList, AxT } from "./Units.js";

export class Box<
  T extends uList<"y">,
  L extends uList<"x">,
  B extends uList<"y">,
  R extends uList<"x">
> {
  protected tl_: xyCoord<L, T>;
  protected br_: xyCoord<R, B>;

  get tl(): xyCoord<L, T> {
    return this.tl_;
  }

  get br(): xyCoord<R, B> {
    return this.br_;
  }

  get tr(): xyCoord<R, T> {
    return new xyCoord(this.br.x, this.tl.y);
  }

  get bl(): xyCoord<L, B> {
    return new xyCoord(this.tl.x, this.br.y);
  }

  get l(): xUnit<L> {
    return this.tl_.x;
  }

  get r(): xUnit<R> {
    return this.br_.x;
  }

  get t(): yUnit<T> {
    return this.tl_.y;
  }

  get b(): yUnit<B> {
    return this.br_.y;
  }


  get y_editable() {
    return this.t.editable && this.b.editable;
  }

  get x_editable() {
    return this.l.editable && this.r.editable;
  }

  width(xunit: uList<"x">): number {
    return +this.br_.x[xunit] - +this.tl_.x[xunit];
  }

  height(yunit: uList<"y">): number {
    return +this.br_.y[yunit] - +this.tl_.y[yunit];
  }

  constructor(tl: xyCoord<L, T>, br: xyCoord<R, B>) {
    this.tl_ = tl;
    this.br_ = br;
  }

  isHover(
    p: xyGenCoord,
    xunit: uList<"x">,
    yunit: uList<"y">,
    strict = false
  ): boolean {
    let check: (
      a: number,
      b: number,
      op: (x: number, y: number) => boolean
    ) => boolean = (a, b, op) => {
      return op(a, b) || (!strict && a == b);
    };
    let gt = (a: number, b: number) => a > b;
    let lt = (a: number, b: number) => a < b;
    return (
      check(+p.x[xunit], +this.tl_.x[xunit], gt) &&
      check(+p.x[xunit], +this.br_.x[xunit], lt) &&
      check(+p.y[yunit], +this.tl_.y[yunit], gt) &&
      check(+p.y[yunit], +this.br_.y[yunit], lt)
    );
  }

  isHoverPx(p: xyGenCoord, strict = false): boolean {
    return this.isHover(p, "px", "px", strict);
  }
}

export class PXBox extends Box<"px", "px", "px", "px"> {}

export class DrawableBox<
  T extends uList<"y">,
  L extends uList<"x">,
  B extends uList<"y">,
  R extends uList<"x">
> extends Box<T, L, B, R> {
  cvs: Canvas;

  get xl(): number {
    return this.l.px;
  }

  get yt(): number {
    return this.t.px;
  }

  get w(): number {
    return this.width("px");
  }

  get h(): number {
    return this.height("px");
  }

  get dur(): number {
    return this.width("s");
  }

  get dfreq(): number {
    return this.height("hz");
  }

  constructor(
    cvs: Canvas,
    tl: xyCoord<L, T>,
    br: xyCoord<R, B>
  ) {
    super(tl, br);
    this.cvs = cvs;
  }

  clear(): void {
    this.cvs.ctx.clearRect(this.xl, this.yt, this.w, this.h);
  }

  clearOutside(): void {
    new DrawableBox(this.cvs, pxCoord(0,0), pxCoord(this.cvs.w,this.t.px)).clear();
    new DrawableBox(this.cvs, pxCoord(0,0), pxCoord(this.l.px,this.cvs.h)).clear();
    new DrawableBox(this.cvs, pxCoord(0,this.b.px), pxCoord(this.cvs.w,this.cvs.h)).clear();
    new DrawableBox(this.cvs, pxCoord(this.r.px,0), pxCoord(this.cvs.w,this.cvs.h)).clear();
  }

  drawOnCanvas() {
    if(this.w>1 && this.h>1) {
      this.cvs.ctx.beginPath();
      this.cvs.ctx.rect(this.xl, this.yt, this.w, this.h);
      this.cvs.ctx.stroke();
    }
  }
}

export type Edges = {
  x: "l" | "r";
  y: "t" | "b";
};

export class EditableBox<
  T extends uList<"y">,
  L extends uList<"x">,
  B extends uList<"y">,
  R extends uList<"x">
> extends DrawableBox<T, L, B, R> {
  protected resize_x: Edges["x"] | undefined;
  protected resize_y: Edges["y"] | undefined;

  start_move_coord: xyGenCoord | undefined;
  get tl(): xyCoord<L, T> {
    return super.tl;
  }

  get br(): xyCoord<R, B> {
    return super.br;
  }

  get tr(): xyCoord<R, T> {
    return super.tr;
  }

  get bl(): xyCoord<L, B> {
    return super.bl;
  }

  get l(): xUnit<L> {
    return super.l;
  }

  get r(): xUnit<R> {
    return super.r;
  }

  get t(): yUnit<T> {
    return super.t;
  }

  get b(): yUnit<B> {
    return super.b;
  }

  set tl(tl: xyCoord<L, T>) {
    this.tl = tl;
  }

  set br(br: xyCoord<R, B>) {
    this.br = br;
  }

  set tr(tr: xyCoord<R, T>) {
    this.t = tr.y;
    this.r = tr.x;
  }

  set bl(bl: xyCoord<L, B>) {
    this.l = bl.x;
    this.b = bl.y;
  }

  set l(x: xUnit<L>) {
    this.tl.x = x;
  }

  set r(x: xUnit<R>) {
    this.br.x = x;
  }

  set t(y: yUnit<T>) {
    this.tl.y = y;
  }

  set b(y: yUnit<B>) {
    this.br.y = y;
  }

  setEdge(x: number, edge: Edges["x"] | Edges["y"]) {
    switch (edge) {
      case "l":
        if (x > this.br.x.px) {
          this.tl.x.px = this.br.x.px;
          this.br.x.px = x;
          if (this.resize_x) this.resize_x = "r";
        } else this.tl.x.px = x;
        break;
      case "r":
        if (x < this.tl.x.px) {
          this.br.x.px = this.tl.x.px;
          this.tl.x.px = x;
          if (this.resize_x) this.resize_x = "l";
        } else this.br.x.px = x;
        break;
      case "t":
        if (x > this.br.y.px) {
          this.tl.y.px = this.br.y.px;
          this.br.y.px = x;
          if (this.resize_y) this.resize_y = "b";
        } else this.tl.y.px = x;
        break;
      case "b":
        if (x < this.tl.y.px) {
          this.br.y.px = this.tl.y.px;
          this.tl.y.px = x;
          if (this.resize_y) this.resize_y = "t";
        } else this.br.y.px = x;
        break;
    }
  }

  resize(p: xyGenCoord): void {
    if (this.resize_x) this.setEdge(p.x.px, this.resize_x);
    if (this.resize_y) this.setEdge(p.y.px, this.resize_y);
  }
  stopResize(p: xyGenCoord): void {
    this.resize(p);
    this.resize_x = undefined;
    this.resize_y = undefined;

  }

  move(p: xyGenCoord): void {
    if (this.start_move_coord) {
      let dx = this.x_editable ? this.start_move_coord.distanceX(p, "px") : 0;
      let dy = this.y_editable ? this.start_move_coord.distanceY(p, "px") : 0;
      this.l.px += dx;
      this.t.px += dy;
      this.r.px += dx;
      this.b.px += dy;
      this.start_move_coord = p;
    }
  }

  stopMoving() {
    this.start_move_coord = undefined;
  }
}

export class DrawablePXBox extends DrawableBox<"px", "px", "px", "px"> {}

type IsBounded = {
  [A in keyof Edges]: {
    [E in Edges[A]]: boolean;
  };
};

export class BoundedBox<
  T extends uList<"y">,
  L extends uList<"x">,
  B extends uList<"y">,
  R extends uList<"x">
> extends EditableBox<T, L, B, R> {
  setEdge(x: number, edge: Edges["x"] | Edges["y"]) {
    let arg = 0;
    switch (edge) {
      case "l":
        arg = this.bounds.x.l
          ? x < this.bound_box.l.px
            ? this.bound_box.l.px
            : x
          : x;
        break;
      case "r":
        arg = this.bounds.x.r
          ? x > this.bound_box.r.px
            ? this.bound_box.r.px
            : x
          : x;
        break;
      case "t":
        arg = this.bounds.y.t
          ? x < this.bound_box.t.px
            ? this.bound_box.t.px
            : x
          : x;
        break;
      case "b":
        arg = this.bounds.y.b
          ? x > this.bound_box.b.px
            ? this.bound_box.b.px
            : x
          : x;
        break;
    }
    super.setEdge(arg,edge);
  }
  bounds: IsBounded;
  bound_box: Box<uList<"y">, uList<"x">, uList<"y">, uList<"x">>;

  constructor(
    cvs: Canvas,
    tl: xyCoord<L, T>,
    br: xyCoord<R, B>,
    bound_box: Box<uList<"y">, uList<"x">, uList<"y">, uList<"x">>,
    bounds: IsBounded
  ) {
    super(cvs, tl, br);
    this.bounds = bounds;
    this.bound_box = bound_box;
  }

  move(p: xyGenCoord): void {
    if (this.start_move_coord) {
      let dx = this.x_editable ? this.start_move_coord.distanceX(p, "px") : 0;
      let dy = this.y_editable ? this.start_move_coord.distanceY(p, "px") : 0;
      if (this.bounds.x.l) dx = Math.max(this.bound_box.l.px - this.l.px, dx);
      if (this.bounds.x.r) dx = Math.min(this.bound_box.r.px - this.r.px, dx);
      if (this.bounds.y.t) dy = Math.max(this.bound_box.t.px - this.t.px, dy);
      if (this.bounds.y.b) dy = Math.min(this.bound_box.b.px - this.b.px, dy);
      this.l.px += dx;
      this.t.px += dy;
      this.r.px += dx;
      this.b.px += dy;
      this.start_move_coord = p;
    }
  }
}
