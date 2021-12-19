import {
  xUnit,
  yUnit,
  Constr,
  xArg,
  yArg,
  xNumUnits,
  yNumUnits,
} from "./Units";

export type genCoord2D = Coord2D<
 xArg,
 yArg,
 xUnit,
 yUnit
>;
export class Coord2D<
  Xraw extends xArg,
  Yraw extends yArg,
  xU extends xUnit,
  yU extends yUnit
> {
  private x_: xU;
  private y_: yU;
  private x_unit_type: Constr<Xraw, xU>;
  private y_unit_type: Constr<yArg, yU>;
  constructor(
    x: Xraw,
    y: Yraw,
    x_unit_type: Constr<Xraw, xU>,
    y_unit_type: Constr<yArg, yU>
  ) {
    this.x_unit_type = x_unit_type;
    this.y_unit_type = y_unit_type;
    this.x_ = new this.x_unit_type(x);
    this.y_ = new this.y_unit_type(y);
  }

  set xraw(x: Xraw) {
    this.x_ = new this.x_unit_type(x);
  }

  set yraw(y: Yraw) {
    this.y_ = new this.y_unit_type(y);
  }

  set x(x: xU) {
    this.x_ = x;
  }

  set y(y: yU) {
    this.y_ = y;
  }

  get x(): xU {
    return this.x_;
  }

  get y(): yU {
    return this.y_;
  }

  distance(p: genCoord2D, xunit: xNumUnits, yunit: yNumUnits) {
    let dx = p.x[xunit] - this.x[xunit];
    let dy = p.y[yunit] - this.y[yunit];
    return Math.sqrt(dx * dx + dy * dy);
  }

  midPoint(p: genCoord2D, xunit: xNumUnits, yunit: yNumUnits) {
    let x = p.x[xunit] + this.x[xunit];
    let y = p.y[yunit] + this.y[yunit];

    let constrx = p.x.constructors[xunit];
    let constry = p.y.constructors[yunit];

    return new Coord2D(x / 2, y / 2, constrx, constry);
  }
}
