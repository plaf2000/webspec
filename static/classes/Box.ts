import { Coord2D } from "./Coord";
import { xPx, xUnit, xyUnit, yPx, yUnit } from "./Units";
import { Values } from "./Values";
import { View } from "./View";



export class Box {
  private tl: Coord2D;
  private br: Coord2D;

  get xs(): number {
    return this.tl.xpx;
  }



  get xe(): number {
    return this.br.xpx;
  }

  get ys(): number {
    return this.tl.ypx;
  }

  get ye(): number {
    return this.br.ypx;
  }

  get pxW(): number {
    return this.xe - this.xs;
  }

  get pxH(): number {
    return this.ye - this.ys;
  }

  constructor(tl: Coord2D, br: Coord2D) {
    Box.prototype.set(tl,br);
  }

  set(tl: Coord2D, br: Coord2D) {
    this.tl = tl;
    this.br = br;
  }

  isHover(coord: Coord2D): boolean {
    coord = coord.convert(xPx, yPx);
    return (
      coord.x.geq(this.tl.x) &&
      coord.x.leq(this.br.x) &&
      coord.y.geq(this.tl.y) &&
      coord.y.leq(this.br.y)
    );
  }

  isHoverPx(x: number, y: number): boolean {
    return this.isHover(new Coord2D(x, y, xPx, yPx));
  }

  isHoverStrict(coord: Coord2D): boolean {
    coord = coord.convert(xPx, yPx);
    return (
      coord.x.ge(this.tl.x) &&
      coord.x.le(this.br.x) &&
      coord.y.ge(this.tl.y) &&
      coord.y.le(this.br.y)
    );
  }

  isHoverStrictPx(x: number, y: number): boolean {
    return this.isHoverStrict(new Coord2D(x, y, xPx, yPx));
  }
}

export class DrawableBox extends Box {
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D, tl: Coord2D, br: Coord2D) {
    super(tl, br);
    this.ctx = ctx;
  }

  clear(): void {
    this.ctx.clearRect(this.xs, this.ys, this.pxW, this.pxH);
  }

}
