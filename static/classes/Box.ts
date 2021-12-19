import { genCoord2D, Coord2D } from "./Coord";
import { xPx, xUnit, yUnit, yPx, yUnit, xNumUnits, yNumUnits } from "./Units";
import { Values } from "./Values";
import { View } from "./View";



export class Box {
  protected tl: genCoord2D;
  protected br: genCoord2D;

  get xs(): number {
    return this.tl.x.px;
  }

  get xe(): number {
    return this.br.x.px;
  }

  get ys(): number {
    return this.tl.y.px;
  }

  get ye(): number {
    return this.br.y.px;
  }

  get pxW(): number {
    return this.xe - this.xs;
  }

  get pxH(): number {
    return this.ye - this.ys;
  }

  constructor(tl: genCoord2D, br: genCoord2D) {
    this.tl = tl;
    this.br = br;
  }

  set(tl: genCoord2D, br: genCoord2D) {
    this.tl = tl;
    this.br = br;
  }

  isHover(p: genCoord2D,xunit: xNumUnits, yunit: yNumUnits): boolean {
    return (
      p.x[xunit]>=this.tl.x[xunit] &&
      p.x[xunit]<=this.br.x[xunit] &&
      p.y[yunit]>=this.tl.y[yunit] &&
      p.y[yunit]>=this.br.y[yunit]
    );
  }

  isHoverPx(x: number, y: number): boolean {
    return this.isHover(new Coord2D(x, y, xPx, yPx),"px","px");
  }

  isHoverStrict(p: genCoord2D,xunit: xNumUnits, yunit: yNumUnits): boolean {
    return (
      p.x[xunit]>=this.tl.x[xunit] &&
      p.x[xunit]<=this.br.x[xunit] &&
      p.y[yunit]>=this.tl.y[yunit] &&
      p.y[yunit]>=this.br.y[yunit]
    );
  }

  isHoverStrictPx(x: number, y: number): boolean {
    return this.isHoverStrict(new Coord2D(x, y, xPx, yPx), "px", "px");
  }
}

export class DrawableBox extends Box {
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D, tl: genCoord2D, br: genCoord2D) {
    super(tl, br);
    this.ctx = ctx;
  }

  clear(): void {
    this.ctx.clearRect(this.xs, this.ys, this.pxW, this.pxH);
  }

}
