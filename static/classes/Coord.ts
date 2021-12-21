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
} from "./Units";

export type xyGenCoord = xyCoord<xGenUnit, yGenUnit>;

export class xyCoord<xU extends xUnit<xVal>, yU extends yUnit<yVal>> {
  protected x_: xU;
  protected y_: yU;
  constructor(x: xU, y: yU) {
    this.x_ = x;
    this.y_ = y;
  }

  get editable(): boolean {
    return this.x.editable && this.y.editable;
  }

  get x(): xU {
    return this.x_;
  }

  get y(): yU {
    return this.y_;
  }

  set x(x: xU) {
    if (this.x.editable) this.x_ = x;
  }

  set y(y: yU) {
    if (this.y.editable) this.y_ = y;
  }

  distance(p: xyGenCoord, xunit: nUnit<"x">, yunit: nUnit<"y">) {
    let dx = p.x[xunit] - this.x[xunit];
    let dy = p.y[yunit] - this.y[yunit];
    return Math.sqrt(dx * dx + dy * dy);
  }

  midPoint(
    p: xyGenCoord,
    xunit: nUnit<"x">,
    yunit: nUnit<"y">,
    ex?: boolean,
    ey?: boolean
  ) {
    let x = p.x[xunit] + this.x[xunit];
    let y = p.y[yunit] + this.y[yunit];

    return new xyCoord(Xu(x / 2, xunit, ex), Yu(y / 2, yunit, ey));
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
