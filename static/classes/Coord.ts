import { xUnit, yUnit, Unit, yPx, xPx, Constr, Freq, Time } from "./Units";

export interface Coord<xU extends xUnit, yU extends yUnit> {
  x: xU;
  y: yU;
  convertx(constr: Constr<xU, xUnit>): xUnit;
  converty(constr: Constr<yU, yUnit>): yUnit;
  convert(
    constr: Constr<Coord<xU, yU>, Coord<xUnit, yUnit>>
  ): Coord<xUnit, yUnit>;
}

export class PxCoord implements Coord<xPx, yPx> {
  x: xPx;
  y: yPx;

  constructor(x: number | xUnit, y: number | yUnit) {
    this.x = new xPx(x);
    this.y = new yPx(y);
  }

  convertx(constr: Constr<xPx, xUnit>): xUnit {
    return new constr(this.x);
  }

  converty(constr: Constr<yPx, yUnit>): yUnit {
    return new constr(this.y);
  }

  convert(
    constr: Constr<Coord<xPx, yPx>, Coord<xUnit, yUnit>>
  ): Coord<xUnit, yUnit> {
    return new constr(this);
  }
}

export class TFCoord implements Coord<Time, Freq> {
  x: Time;
  y: Freq;

  constructor(x: number | xUnit, y: number | yUnit) {
    this.x = new Time(x);
    this.y = new Freq(y);
  }

  convertx(constr: Constr<Time, xUnit>): xUnit {
    return new constr(this.x);
  }

  converty(constr: Constr<Freq, yUnit>): yUnit {
    return new constr(this.y);
  }

  convert(
    constr: Constr<Coord<Time, Freq>, Coord<xUnit, yUnit>>
  ): Coord<xUnit, yUnit> {
    return new constr(this);
  }
}
