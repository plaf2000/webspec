import {
  editable,
  xUnit,
  yUnit,
  Constr,
  xArg,
  yArg,
  xNumUnits,
  yNumUnits,
  UnitConstrType,
  xEUnit,
  yEUnit,
} from "./Units";

export type genCoord2D = Coord2D<xArg, yArg, xUnit<xArg>, yUnit<yArg>>;

export class Coord2D<
  Xraw extends xArg,
  Yraw extends yArg,
  xU extends xUnit<xArg>,
  yU extends yUnit<yArg>
> {
  protected x_: xU;
  protected y_: yU;
  protected x_unit_type: Constr<Xraw, xU>;
  protected y_unit_type: Constr<Yraw, yU>;
  protected x_editable: boolean;
  protected y_editable: boolean;
  constructor(
    x: Xraw,
    y: Yraw,
    x_unit_type: Constr<Xraw, xU>,
    y_unit_type: Constr<Yraw, yU>
  ) {
    this.x_unit_type = x_unit_type;
    this.y_unit_type = y_unit_type;
    this.x_ = new this.x_unit_type(x);
    this.y_ = new this.y_unit_type(y);
    this.x_editable=(this.x_ instanceof xEUnit);
    this.y_editable=(this.y_ instanceof yEUnit);
  }

  get x(): xU {
    return this.x_;
  }

  get y(): yU {
    return this.y_;
  }

  set x(x: xU) {
    if(this.xeditable) this.x_ = x;
  }

  set y(y: yU) {
    if(this.yeditable) this.y_ = y;
  }

  set xpx(x: number) {
    if(this.x_.editable) this.x_.px = x;
  }

  get xeditable(): boolean {
      return this.x_editable;
  }

  get yeditable(): boolean {
      return this.y_editable;
  }

  distance(p: genCoord2D, xunit: xNumUnits, yunit: yNumUnits) {
    let dx = p.x[xunit] - this.x[xunit];
    let dy = p.y[yunit] - this.y[yunit];
    return Math.sqrt(dx * dx + dy * dy);
  }

  midPoint(
    p: genCoord2D,
    xunit: xNumUnits,
    yunit: yNumUnits,
    editablex: boolean,
    editabley: boolean
  ) {
    let x = p.x[xunit] + this.x[xunit];
    let y = p.y[yunit] + this.y[yunit];

    let typex: UnitConstrType = editable(editablex);
    let typey: UnitConstrType = editable(editabley);

    let constrx = p.x.constructors[typex][xunit];
    let constry = p.y.constructors[typey][yunit];

    return new Coord2D(x / 2, y / 2, constrx, constry);
  }
}
