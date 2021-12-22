import { buildCoord, pxCoord, tfCoord, xyCoord, xyGenCoord } from "./Coord";
import {
  xPx,
  yPx,
  yUnit,
  xTime,
  xUnit,
  PrimUnit,
  Arg,
  nUnit,
  xGenUnit,
  yGenUnit,
  xUnitConv,
  Xu,
} from "./Units";
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

type Corners = "tl" | "tr" | "bl" | "br";

type Corner = {
  [key in Corners]: xyGenCoord;
}

type CornerEdges = Corner & {
  l: xGenUnit;
  r: xGenUnit;
  t: yGenUnit;
  b: yGenUnit;
};


export class EditableBox<
  TL extends xyGenCoord,
  BR extends xyGenCoord
> extends DrawableBox<TL, BR> implements CornerEdges {
  set tl(tl: CornerEdges["tl"]) {
    this.t = tl.y;
    this.l = tl.x;
  }

  set br(br: CornerEdges["br"]) {
    this.br.x = br.x;
    this.br.y = br.y;
  }

  set tr(tr: CornerEdges["tr"]) {
    this.tl.y = tr.y;
    this.br.x = tr.x;
  }

  set bl(bl: CornerEdges["bl"]) {
    this.tl.x = bl.x;
    this.br.y = bl.y;
  }

  set l(x: CornerEdges["l"]) {
    if (x.px > this.br.x.px) {
      this.tl.x.px = this.br.x.px;
      this.br.x.px = x.px;
    } else this.tl.x.px = x.px;
  }

  set r(x: CornerEdges["r"]) {
    if (x.px < this.tl.x.px) {
      this.br.x.px = this.tl.x.px;
      this.tl.x.px = x.px;
    } else this.br.x.px = x.px;
  }

  set t(y: CornerEdges["t"]) {
    if (y.px > this.br.y.px) {
      this.tl.y.px = this.br.y.px;
      this.br.y.px = y.px;
    } else this.tl.y.px = y.px;
  }

  set b(y: CornerEdges["b"]) {
    if (y.px < this.tl.y.px) {
      this.br.y.px = this.tl.y.px;
      this.tl.y.px = y.px;
    } else this.br.y.px = y.px;
  }

  set<EC extends keyof CornerEdges>(p: CornerEdges[EC], edge: EC): keyof CornerEdges {
    let next_edge: keyof CornerEdges = edge;
    switch (edge) {
      case "tl":
        if (p.x.px > this.br.x.px) break;
      default:
        next_edge = edge;
    }

    this[edge] = p;

    return next_edge;
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
