import { xUnit, yUnit, Constr, xPx, yPx, xArg, yArg, xNumUnits, yNumUnits, xConstr } from "./Units";

export class Coord2D<Xraw extends xArg, Yraw extends yArg> {
  private x_: xUnit;
  private y_: yUnit;
  private x_unit_type: Constr<Xraw,xUnit> ;
  private y_unit_type: Constr<yArg, yUnit>;
  constructor(
    x: Xraw,
    y: Yraw,
    x_unit_type: Constr<Xraw, xUnit>,
    y_unit_type: Constr<yArg, yUnit>
  ) {
    this.x_unit_type = x_unit_type;
    this.y_unit_type = y_unit_type;
    this.x_ = new this.x_unit_type(x);
    this.y_ = new this.y_unit_type(y);
  }

  set x(x: Xraw) {
    this.x_ = new this.x_unit_type(x);
  }

  set y(y: Yraw) {
    this.y_ = new this.y_unit_type(y);
  }

  get xu(): xUnit {
    return this.x_;
  }

  get yu(): yUnit {
    return this.y_;
  }

  distance(p: Coord2D<xArg,yArg>, xunit: xNumUnits, yunit: yNumUnits) {
    let dx = p.xu[xunit]-this.xu[xunit];
    let dy = p.yu[yunit]-this.yu[yunit];
    return Math.sqrt(dx * dx + dy * dy);
  }

  midPoint(p: Coord2D<xArg,yArg>, xunit: xNumUnits, yunit: yNumUnits) {
    let x = p.xu[xunit]+this.xu[xunit];
    let y = p.yu[yunit]+this.yu[yunit];

    let constrx = p.xu.constructors[xunit];
    let constry = p.yu.constructors[yunit];

    return new Coord2D(x,y,constrx,constry);
  }

}


let test = new Coord2D(1,1,xPx,yPx);
