import { xUnit, yUnit, AxT, uList, Unit, Units } from "./Units.js";

export type xyGenCoord = xyCoord<uList<"x">, uList<"y">>;
export type TFCoord = xyCoord<"s" | "date", "hz">;
export type PXCoord = xyCoord<"px", "px">;

export class Coord2D<
  X extends AxT,
  Y extends AxT,
  xU extends uList<X>,
  yU extends uList<Y>
> {
  protected x_: Unit<X, xU>;
  protected y_: Unit<Y, yU>;
  constructor(x: Unit<X, xU>, y: Unit<Y, yU>) {
    this.x_ = x;
    this.y_ = y;
  }

  get editable(): boolean {
    return this.x.editable && this.y.editable;
  }

  get x(): Unit<X, xU> {
    return this.x_;
  }

  get y(): Unit<Y, yU> {
    return this.y_;
  }

  set x(x: Unit<X, xU>) {
    if (this.x.editable) this.x_ = x;
  }

  set y(y: Unit<Y, yU>) {
    if (this.y.editable) this.y_ = y;
  }

  distanceX<
    xUp extends uList<X>,
    Z extends AxT,
    yUp extends uList<Z>,
    xR extends uList<X>
  >(p: Coord2D<X, Z, xUp, yUp>, unit: xR): number {
    return p.x.sub(this.x, unit).getv(unit);
  }

  distanceY<
    Z extends AxT,
    xUp extends uList<Z>,
    yUp extends uList<Y>,
    yR extends uList<Y>
  >(p: Coord2D<Z, Y, xUp, yUp>, unit: yR): number {
    return p.y.sub(this.y, unit).getv(unit);
  }

  euclDistance<xUp extends uList<X>, yUp extends uList<Y>>(
    p: Coord2D<X, Y, xUp, yUp>,
    xunit: uList<X>,
    yunit: uList<Y>
  ): number {
    let dx = this.distanceX(p, xunit);
    let dy = this.distanceY(p, yunit);
    return Math.sqrt(dx * dx + dy * dy);
  }

  midPoint<
    xP extends uList<X>,
    yP extends uList<Y>,
    xR extends uList<X>,
    yR extends uList<Y>
  >(
    p: Coord2D<X, Y, xP, yP>,
    xunit: xR,
    yunit: yR,
    ex?: boolean,
    ey?: boolean
  ): Coord2D<X, Y, xR, yR> {
    let x = this.x.midPoint(this.x, xunit, ex);
    let y = this.y.midPoint(this.y, yunit, ex);

    return new Coord2D(x, y);
  }
}

export class xyCoord<
  xU extends uList<"x">,
  yU extends uList<"y">
> extends Coord2D<"x", "y", xU, yU> {
  get x() {
    return super.x as xUnit<xU>;
  }
  get y() {
    return super.y as yUnit<yU>;
  }

  set x(x: xUnit<xU>) {
    super.x = x;
  }
  set y(y: yUnit<yU>) {
    super.y = y;
  }
}

export function xy<xU extends uList<"x">, yU extends uList<"y">>(
  x: Units["x"][xU] | number,
  y: Units["y"][yU] | number,
  xunit: xU,
  yunit: yU,
  ex?: boolean,
  ey?: boolean
): xyCoord<xU, yU> {
  return new xyCoord(
    new xUnit<xU>(+x, xunit, "x", ex),
    new yUnit<yU>(+y, yunit, "y", ey)
  );
}

export let pxCoord = (
  x: Units["x"]["px"] | number,
  y: Units["y"]["px"] | number,
  ex?: boolean,
  ey?: boolean
): PXCoord => xy(x, y, "px", "px", ex, ey);

export let tfCoord = (
  x: Units["x"]["s"] | Units["x"]["date"] | number,
  y: Units["y"]["hz"] | number,
  ex?: boolean,
  ey?: boolean
): TFCoord => {
  if (x instanceof Date) return xy(x, y, "date", "hz", ex, ey);
  else return xy(x, y, "s", "hz", ex, ey);
};
