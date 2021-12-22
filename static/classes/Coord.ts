import {
  xUnit,
  yUnit,
  Constr,
  yVal,
  xVal,
  UConstr,
  xPx,
  yPx,
  PrimUnit,
  Xu,
  Yu,
  UnitPrim,
  UnitStr,
  UnitClass,
  Arg,
  nUnit,
  xGenUnit,
  yGenUnit,
  AxT,
  uList,
  Unit,
  Units,
} from "./Units";

export type xyGenCoord = Coord2D<"x", "y", uList<"x">, uList<"y">>;

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

  distance(
    p: Coord2D<X, Y, uList<X>, uList<Y>>,
    xunit: keyof Units[X],
    yunit: keyof Units[Y]
  ) {
    let dx = this.x.dist(p.x, xunit);
    let dy = this.y.dist(p.y, yunit);
    if (dx && dy) return Math.sqrt(dx * dx + dy * dy);
  }

  midPoint(
    p: Coord2D<X, Y, uList<X>, uList<Y>>,
    xunit: keyof Units[X],
    yunit: keyof Units[Y]
  ) {
    let mx = this.x.midPoint(p.x, xunit);
    let my = this.y.midPoint(p.y, yunit)
    if(mx && my) return new Coord2D(mx,my);
  }
}

export function buildCoord<xU extends UnitStr<"x">, yU extends UnitStr<"y">>(
  x: UnitPrim["x"][xU],
  y: UnitPrim["y"][yU],
  xunit: xU,
  yunit: yU,
  ex?: boolean,
  ey?: boolean
): xyCoord<UnitClass["x"][xU], UnitClass["y"][yU]> {
  return new xyCoord(Xu(x, xunit, ex), Yu(y, yunit, ey));
}

export let pxCoord = (
  x: Arg["xPx"],
  y: Arg["yPx"],
  ex?: boolean,
  ey?: boolean
) => buildCoord(x, y, "px", "px", ex, ey);

export let tfCoord = (
  x: Arg["xTime"],
  y: Arg["yFreq"],
  ex?: boolean,
  ey?: boolean
) => {
  if (x instanceof Date) return buildCoord(x, y, "date", "hz", ex, ey);
  else return buildCoord(x, y, "s", "hz", ex, ey);
};
