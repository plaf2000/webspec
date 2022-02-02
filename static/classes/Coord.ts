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

  distanceX(p: xyGenCoord, unit: uList<"x">) {
    return +p.x[unit] - +this.x[unit];
  }

  distanceY(p: xyGenCoord, unit: uList<"y">) {
    return +p.y[unit] - +this.y[unit];
  }

  euclDistance(p: xyGenCoord, xunit: uList<"x">, yunit: uList<"y">): number {
    let dx = this.distanceX(p, xunit);
    let dy = this.distanceY(p, yunit);
    return Math.sqrt(dx * dx + dy * dy);
  }

  midPoint<xR extends uList<"x">, yR extends uList<"y">>(
    p: xyGenCoord,
    xunit: xR,
    yunit: yR,
    ex?: boolean,
    ey?: boolean
  ): xyCoord<xR, yR> {
    let x = +p.x[xunit] + +this.x[xunit];
    let y = +p.y[yunit] + +this.y[yunit];

    return xy(x / 2, y / 2, xunit, yunit, ex, ey);
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
  return new xyCoord(new xUnit<xU>(+x, xunit, ex), new yUnit<yU>(+y, yunit, ey));
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