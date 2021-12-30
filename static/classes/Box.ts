import { xyCoord, xyGenCoord, PXCoord } from "./Coord.js";
import { yUnit, xUnit, xGenUnit, yGenUnit, uList } from "./Units.js";

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

  isHoverPx(p: PXCoord, strict = false): boolean {
    return this.isHover(p, "px", "px", strict);
  }
}

export class PXBox extends Box<"px","px","px","px">{};

export class DrawableBox<
T extends uList<"y">,
L extends uList<"x">,
B extends uList<"y">,
R extends uList<"x">
> extends Box<T,L,B,R> {
  ctx: CanvasRenderingContext2D;

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

  constructor(ctx: CanvasRenderingContext2D, tl: xyCoord<L,T>, br: xyCoord<R,B>) {
    super(tl, br);
    this.ctx = ctx;
  }

  clear(): void {
    this.ctx.clearRect(this.xl, this.yt, this.w, this.h);
  }

  drawOnCanvas() {
    this.ctx.beginPath();
    this.ctx.rect(this.xl, this.yt, this.w, this.h);
    this.ctx.stroke();
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
> extends DrawableBox<T,L,B,R>  {
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

  set tl(tl: xyGenCoord) {
    this.t = tl.y;
    this.l = tl.x;
  }

  set br(br: xyGenCoord) {
    this.r = br.x;
    this.b = br.y;
  }

  set tr(tr: xyGenCoord) {
    this.t = tr.y;
    this.r = tr.x;
  }

  set bl(bl: xyGenCoord) {
    this.l = bl.x;
    this.b = bl.y;
  }

  set l(x: xGenUnit) {
    if (x.px > this.br.x.px) {
      this.tl.x.px = this.br.x.px;
      this.br.x.px = x.px;
      if (this.resize_x) this.resize_x = "r";
    } else this.tl.x.px = x.px;
  }

  set r(x: xGenUnit) {
    if (x.px < this.tl.x.px) {
      this.br.x.px = this.tl.x.px;
      this.tl.x.px = x.px;
      if (this.resize_x) this.resize_x = "l";
    } else this.br.x.px = x.px;
  }

  set t(y: yGenUnit) {
    if (y.px > this.br.y.px) {
      this.tl.y.px = this.br.y.px;
      this.br.y.px = y.px;
      if (this.resize_y) this.resize_y = "b";
    } else this.tl.y.px = y.px;
  }

  set b(y: yGenUnit) {
    if (y.px < this.tl.y.px) {
      this.br.y.px = this.tl.y.px;
      this.tl.y.px = y.px;
      if (this.resize_y) this.resize_y = "t";
    } else this.br.y.px = y.px;
  }

  resize(p: xyGenCoord): void {
    if (this.resize_x) this[this.resize_x].px = p.x.px;
    if (this.resize_y) this[this.resize_y].px = p.y.px;
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
      console.log(this.w, this.h);
      this.start_move_coord = p;
    }
  }

  stopMoving() {
    this.start_move_coord = undefined;
  }
}

export class DrawablePXBox extends DrawableBox<"px","px","px","px">{};


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
> extends EditableBox<T,L,B,R> {
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

  set l(x: xGenUnit) {
    super.l = this.bounds.x.l
      ? x.px < this.bound_box.l.px
        ? this.bound_box.l
        : x
      : x;
  }

  set r(x: xGenUnit) {
    super.r = this.bounds.x.r
      ? x.px > this.bound_box.r.px
        ? this.bound_box.r
        : x
      : x;
  }

  set t(y: yGenUnit) {
    super.t = this.bounds.y.t
      ? y.px < this.bound_box.t.px
        ? this.bound_box.t
        : y
      : y;
  }

  set b(y: yGenUnit) {
    super.b = this.bounds.y.b
      ? y.px > this.bound_box.b.px
        ? this.bound_box.b
        : y
      : y;
  }

  bounds: IsBounded;
  bound_box: Box<uList<"y">,uList<"x">,uList<"y">,uList<"x">>;

  constructor(
    ctx: CanvasRenderingContext2D,
    tl: xyCoord<L,T>,
    br: xyCoord<R,B>,
    bound_box: Box<uList<"y">,uList<"x">,uList<"y">,uList<"x">>,
    bounds: IsBounded
  ) {
    super(ctx, tl, br);
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


