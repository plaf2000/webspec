import { xy, pxCoord, tfCoord, xyCoord, xyGenCoord, PXCoord } from "./Coord.js";
import { yUnit, xUnit, Units, xGenUnit, yGenUnit, uList } from "./Units.js";
import { Values } from "./Values";
import { View } from "./View";

export class Box<TL extends xyGenCoord, BR extends xyGenCoord> {
  protected tl_: TL;
  protected br_: BR;

  get tl(): xyGenCoord {
    return this.tl_;
  }

  get br(): xyGenCoord {
    return this.br_;
  }

  get tr(): xyGenCoord {
    return new xyCoord(this.br.x, this.tl.y);
  }

  get bl(): xyGenCoord {
    return new xyCoord(this.tl.x, this.br.y);
  }

  get l() {
    return this.tl_.x;
  }

  get r() {
    return this.br_.x;
  }

  get t() {
    return this.tl_.y;
  }

  get b() {
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

  constructor(tl: TL, br: BR) {
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

export class DrawableBox<
  TL extends xyGenCoord,
  BR extends xyGenCoord
> extends Box<TL, BR> {
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

  constructor(ctx: CanvasRenderingContext2D, tl: TL, br: BR) {
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
  x: {
    l: xGenUnit;
    r: xGenUnit;
  };
  y: {
    t: yGenUnit;
    b: yGenUnit;
  };
};

export class EditableBox<
  TL extends xyGenCoord,
  BR extends xyGenCoord
> extends DrawableBox<TL, BR> {
  protected resize_x: keyof Edges["x"] | undefined;
  protected resize_y: keyof Edges["y"] | undefined;

  start_move_coord: xyGenCoord | undefined;
  get tl(): xyGenCoord {
    return super.tl;
  }

  get br(): xyGenCoord {
    return super.br;
  }

  get tr(): xyGenCoord {
    return super.tr;
  }

  get bl(): xyGenCoord {
    return super.bl;
  }

  get l() {
    return super.l;
  }

  get r() {
    return super.r;
  }

  get t() {
    return super.t;
  }

  get b() {
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

  set l(x: Edges["x"]["l"]) {
    if (x.px > this.br.x.px) {
      this.tl.x.px = this.br.x.px;
      this.br.x.px = x.px;
      if (this.resize_x) this.resize_x = "r";
    } else this.tl.x.px = x.px;
  }

  set r(x: Edges["x"]["r"]) {
    if (x.px < this.tl.x.px) {
      this.br.x.px = this.tl.x.px;
      this.tl.x.px = x.px;
      if (this.resize_x) this.resize_x = "l";
    } else this.br.x.px = x.px;
  }

  set t(y: Edges["y"]["t"]) {
    if (y.px > this.br.y.px) {
      this.tl.y.px = this.br.y.px;
      this.br.y.px = y.px;
      if (this.resize_y) this.resize_y = "b";
    } else this.tl.y.px = y.px;
  }

  set b(y: Edges["y"]["b"]) {
    if (y.px < this.tl.y.px) {
      this.br.y.px = this.tl.y.px;
      this.tl.y.px = y.px;
      if (this.resize_y) this.resize_y = "t";
    } else this.br.y.px = y.px;
  }

  resize(p: xyGenCoord): void {
    if (this.resize_x) this[this.resize_x] = p.x;
    if (this.resize_y) this[this.resize_y] = p.y;
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
      this.l.px+=dx
      this.t.px+=dy;
      this.r.px+=dx
      this.b.px+=dy;
      console.log(this.w, this.h);
      this.start_move_coord = p;
    }
  }

  stopMoving() {
    this.start_move_coord = undefined;
  }
}

type IsBounded = {
  [A in keyof Edges]: {
    [E in keyof Edges[A]]: boolean;
  };
};
export class BoundedBox<
  TL extends xyGenCoord,
  BR extends xyGenCoord
> extends EditableBox<TL, BR> {
  get l() {
    return super.l;
  }

  get r() {
    return super.r;
  }

  get t() {
    return super.t;
  }

  get b() {
    return super.b;
  }

  set l(x: Edges["x"]["l"]) {
    super.l = this.bounds.x.l
      ? x.px < this.bound_box.l.px
        ? this.bound_box.l
        : x
      : x;
  }

  set r(x: Edges["x"]["r"]) {
    super.r = this.bounds.x.r
      ? x.px > this.bound_box.r.px
        ? this.bound_box.r
        : x
      : x;
  }

  set t(y: Edges["y"]["t"]) {
    super.t = this.bounds.y.t
      ? y.px < this.bound_box.t.px
        ? this.bound_box.t
        : y
      : y;
  }

  set b(y: Edges["y"]["b"]) {
    super.b = this.bounds.y.b
      ? y.px > this.bound_box.b.px
        ? this.bound_box.b
        : y
      : y;
  }

  bounds: IsBounded;
  bound_box: Box<xyGenCoord, xyGenCoord>;

  constructor(
    ctx: CanvasRenderingContext2D,
    tl: TL,
    br: BR,
    bound_box: Box<xyGenCoord, xyGenCoord>,
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
      if(this.bounds.x.l) dx = Math.max(this.bound_box.l.px - this.l.px,dx);
      if(this.bounds.x.r) dx = Math.min(this.bound_box.r.px - this.r.px, dx);
      if(this.bounds.y.t) dy = Math.max(this.bound_box.t.px - this.t.px, dy);
      if(this.bounds.y.b) dy = Math.min(this.bound_box.b.px - this.b.px, dy);
      this.l.px+=dx
      this.t.px+=dy;
      this.r.px+=dx
      this.b.px+=dy;
      this.start_move_coord = p;
    }
  }


}
