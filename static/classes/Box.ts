import { xy, pxCoord, tfCoord, xyCoord, xyGenCoord } from "./Coord.js";
import { yUnit, xUnit, nUnit, Units, xGenUnit, yGenUnit } from "./Units.js";
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

  get lb(): xyGenCoord {
    return new xyCoord(this.tl.x, this.br.y);
  }

  width(xunit: nUnit["x"]): number {
    return this.br_.x[xunit] - this.tl_.x[xunit];
  }

  height(yunit: nUnit["y"]): number {
    return this.br_.y[yunit] - this.tl_.y[yunit];
  }

  constructor(tl: TL, br: BR) {
    this.tl_ = tl;
    this.br_ = br;
  }

  isHover(
    p: xyGenCoord,
    xunit: nUnit["x"],
    yunit: nUnit["y"],
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
      check(p.x[xunit], this.tl_.x[xunit], gt) &&
      check(p.x[xunit], this.br_.x[xunit], lt) &&
      check(p.y[yunit], this.tl_.y[yunit], gt) &&
      check(p.y[yunit], this.br_.y[yunit], lt)
    );
  }

  isHoverPx(x: Units["x"]["px"], y: Units["y"]["px"], strict = false): boolean {
    return this.isHover(pxCoord(x, y), "px", "px", strict);
  }
}

export class DrawableBox<
  TL extends xyGenCoord,
  BR extends xyGenCoord
> extends Box<TL, BR> {
  ctx: CanvasRenderingContext2D;

  get xl(): number {
    return this.tl_.x.px;
  }

  get yt(): number {
    return this.tl_.y.px;
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
  }
};

export class EditableBox<TL extends xyGenCoord, BR extends xyGenCoord>
  extends DrawableBox<TL, BR>
{
  protected resize_x: keyof Edges["x"] | undefined;
  protected resize_y: keyof Edges["y"] | undefined;

  constructor(ctx: CanvasRenderingContext2D, tl: TL, br: BR) {
    super(ctx, tl, br);
  }

  get resizing_x(): boolean {
    return !(this.resize_x === undefined);
  }

  get resizing_y(): boolean {
    return !(this.resize_y === undefined);
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
      if(this.resizing_x) this.resize_x = "r"
    } else this.tl.x.px = x.px;
  }

  set r(x: Edges["x"]["r"]) {
    if (x.px < this.tl.x.px) {
      this.br.x.px = this.tl.x.px;
      this.tl.x.px = x.px;
      if(this.resizing_x) this.resize_x = "l"
    } else this.br.x.px = x.px;
  }

  set t(y: Edges["y"]["t"]) {
    if (y.px > this.br.y.px) {
      this.tl.y.px = this.br.y.px;
      this.br.y.px = y.px;
      if(this.resizing_y) this.resize_y = "b"
    } else this.tl.y.px = y.px;
  }

  set b(y: Edges["y"]["b"]) {
    if (y.px < this.tl.y.px) {
      this.br.y.px = this.tl.y.px;
      this.tl.y.px = y.px;
      if(this.resizing_y) this.resize_y = "t"
    } else this.br.y.px = y.px;
  }

  resize(p: xyGenCoord): void {
    if(this.resize_x !== undefined) {
      this[this.resize_x] = p.x;
    }
    if(this.resize_y !== undefined)  {
      this[this.resize_y] = p.y;
    }
  }

  stopResize(p: xyGenCoord): void {
    this.resize(p);
    this.resize_x = undefined;
    this.resize_y = undefined;
  }
}


