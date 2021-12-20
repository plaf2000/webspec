import { genCoord2D, Coord2D, genECoord2D, ECoord2D } from "./Coord";
import {
  xPx,
  xPxArg,
  yPxArg,
  yPx,
  yUnit,
  xNumUnits,
  yNumUnits,
  xEPx,
  yEPx,
  xTime,
  xUnit,
} from "./Units";
import { Values } from "./Values";
import { View } from "./View";

export class Box<TL extends genCoord2D, BR extends genCoord2D> {
  protected tl_: TL;
  protected br_: BR;

  width(xunit: xNumUnits): number {
    return this.br_.x[xunit] - this.tl_.x[xunit];
  }

  height(yunit: yNumUnits): number {
    return this.br_.y[yunit] - this.tl_.y[yunit];
  }

  constructor(tl: TL, br: BR) {
    this.tl_ = tl;
    this.br_ = br;
  }

  isHover(p: genCoord2D, xunit: xNumUnits, yunit: yNumUnits): boolean {
    return (
      p.x[xunit] >= this.tl_.x[xunit] &&
      p.x[xunit] <= this.br_.x[xunit] &&
      p.y[yunit] >= this.tl_.y[yunit] &&
      p.y[yunit] >= this.br_.y[yunit]
    );
  }

  isHoverPx(x: xPxArg, y: yPxArg): boolean {
    return this.isHover(new Coord2D(x, y, xPx, yPx), "px", "px");
  }

  isHoverStrict(p: genCoord2D, xunit: xNumUnits, yunit: yNumUnits): boolean {
    return (
      p.x[xunit] >= this.tl_.x[xunit] &&
      p.x[xunit] <= this.br_.x[xunit] &&
      p.y[yunit] >= this.tl_.y[yunit] &&
      p.y[yunit] >= this.br_.y[yunit]
    );
  }

  isHoverStrictPx(x: xPxArg, y: yPxArg): boolean {
    return this.isHoverStrict(new Coord2D(x, y, xPx, yPx), "px", "px");
  }
}

export class DrawableBox<
  TL extends genCoord2D,
  BR extends genCoord2D
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
  TL extends genCoord2D,
  BR extends genCoord2D
> extends DrawableBox<TL, BR> {
  set tl(tl: TL) {
    this.tl = tl;
  }

  set br(br: BR) {
    this.br = br;
  }

  set tlpx(coord: { x: xPxArg; y: yPxArg }) {
    this.tl.x.px = coord.x;
    this.tl.y.px = coord.y;
  }

  // set brpx

  constructor(ctx: CanvasRenderingContext2D, tl: TL, br: BR) {
    super(ctx, tl, br);
  }
}

let lol: Unit<number> = new xPx(234) as Unit<number>;

let b = new ECoord2D<number, number, xPx, yPx>(1, 1, xPx, yPx);
let yolo = new EditableBox(new CanvasRenderingContext2D(), b, b);
