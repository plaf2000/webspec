import { buildCoord, pxCoord, tfCoord, xyCoord, xyGenCoord } from "./Coord";
import { xPx, yPx, yUnit, xTime, xUnit, PrimUnit, Arg, nUnit, xGenUnit } from "./Units";
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

  width(xunit: nUnit<"x">): number {
    return this.br_.x[xunit] - this.tl_.x[xunit];
  }

  height(yunit: nUnit<"y">): number {
    return this.br_.y[yunit] - this.tl_.y[yunit];
  }

  constructor(tl: TL, br: BR) {
    this.tl_ = tl;
    this.br_ = br;
  }

  isHover(
    p: xyGenCoord,
    xunit: nUnit<"x">,
    yunit: nUnit<"y">,
    strict?: false
  ): boolean {
    let check: (
      a: number,
      b: number,
      op: (x: number, y: number) => boolean
    ) => boolean = (a, b, op) => {
      if (strict) return op(a, b);
      return op(a, b) || a == b;
    };
    return (
      check(p.x[xunit], this.tl_.x[xunit], (a: number, b: number) => a > b) &&
      check(p.x[xunit], this.br_.x[xunit], (a: number, b: number) => a < b) &&
      check(p.y[yunit], this.tl_.y[yunit], (a: number, b: number) => a > b) &&
      check(p.y[yunit], this.br_.y[yunit], (a: number, b: number) => a < b)
    );
  }

  isHoverPx(x: Arg["xPx"], y: Arg["yPx"], strict?: false): boolean {
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
}

export class EditableBox<
  TL extends xyGenCoord,
  BR extends xyGenCoord
> extends DrawableBox<TL, BR> {
  set tl(tl: xyGenCoord) {
    this.t = t.y;
    this.l = tl.x;
  }

  set br(br: xyGenCoord) {
    this.br.x.px = br.x.px;
    this.br.y.px = br.y.px;
  }

  set tr(tr: xyGenCoord) {
    this.tl.y.px = tr.y.px;
    this.br.x.px = tr.x.px;
  }

  set bl(bl: xyGenCoord) {
    this.tl.x.px = bl.x.px;
    this.br.y.px = bl.y.px;
  }

  set l(x: xGenUnit) {
    if(x.px>this.br.x.px) this.tl.x. 
    else this.tl.x.px = x.px;
  }

  relativePos(p: xyGenCoord): "tl" | "tr" | "bl" | "br" {
  }

  // set brpx

  constructor(ctx: CanvasRenderingContext2D, tl: TL, br: BR) {
    super(ctx, tl, br);
  }
}

let kobi = new EditableBox(
  new CanvasRenderingContext2D(),
  tfCoord(2, 3),
  tfCoord(3, 4)
);
