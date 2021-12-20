export type Constr<Arg, ObjType> = { new (arg: Arg): ObjType };

/*

Type definitions

*/

type xTimeArg = number | Date;
type yFreqArg = number;
type pxArg = number;
export type xPxArg = pxArg;
export type yPxArg = pxArg;

export type xArg = xTimeArg & xPxArg;
export type yArg = yPxArg & yFreqArg;

export type xConstr = Constr<xArg, xUnit<xArg>>;
export type yConstr = Constr<yArg, yUnit<yArg>>;

export type xNumUnits = "s" | "px";
export type yNumUnits = "hz" | "px";
export type UnitConstrType = "editable" | "non_editable";

export let editable = (e: boolean): UnitConstrType =>
  e ? "editable" : "non_editable";

/*

Classes used for conversions

*/

export class xUnitConv {
  static px_s = 10;
  static time_offset = 0;
  static start_time = xUnitConv.time_offset;

  static pxToS(x: number): number {
    return x / xUnitConv.px_s + xUnitConv.start_time;
  }

  static sToPx(x: number): number {
    return (x - xUnitConv.start_time) * xUnitConv.px_s;
  }

  static dateToS(x: Date): number {
    return x.getMilliseconds() / 1000 - xUnitConv.time_offset;
  }

  static sToDate(x: number): Date {
    return new Date(x * 1000);
  }

  static pxToDate(x: number): Date {
    return xUnitConv.sToDate(xUnitConv.pxToS(x));
  }

  static dateToPx(x: Date): number {
    return xUnitConv.sToPx(xUnitConv.dateToS(x));
  }
}

export class yUnitConv {
  static fq_end = 22000;
  static px_hz = 0.1;

  static pxToHz(y: number): number {
    return yUnitConv.fq_end - y / yUnitConv.px_hz;
  }

  static hzToPx(y: number): number {
    return (y - yUnitConv.fq_end) * yUnitConv.px_hz;
  }
}

/*

x and y units definitons

*/

export abstract class Unit<U> {
  protected editable_: boolean;
  protected val: U;
  constructor(val: U, e?: boolean) {
    this.val = val;
    this.editable_ = e || false;
  }
  get editable(): boolean {
    return this.editable_;
  }
}

export abstract class xUnit<U extends xArg> extends Unit<U> {
  abstract get date(): Date;
  abstract get s(): number;
  abstract get px(): number;
  constructors: {
    non_editable: {
      s: xConstr;
      date: xConstr;
      px: xConstr;
    };
    editable: {
      s: xConstr;
      date: xConstr;
      px: xConstr;
    };
  } = {
    non_editable: {
      s: xTime,
      date: xTime,
      px: xPx,
    },
    editable: {
      s: xETime,
      date: xETime,
      px: xEPx,
    },
  };
}

export abstract class yUnit<U extends yArg> extends Unit<U> {
  abstract get hz(): number;
  abstract get px(): number;

  constructors: {
    non_editable: {
      hz: yConstr;
      px: yConstr;
    };
    editable: {
      hz: yConstr;
      px: yConstr;
    };
  } = {
    non_editable: {
      hz: yFreq,
      px: yPx,
    },
    editable: {
      hz: yEFreq,
      px: yEPx,
    },
  };
}

/*

x and y editable units

*/

export abstract class xEUnit<U extends xArg> extends xUnit<U> {
  abstract set date(x: Date);
  abstract set s(x: number);
  abstract set px(x: number);
}

export abstract class yEUnit<U extends yArg> extends yUnit<U> {
  abstract set hz(y: number);
  abstract set px(y: number);
}

/*

x and y non-editable units implementations

*/

// x implementations

export class xTime extends xUnit<number> {
  constructor(arg: xTimeArg) {
    if (arg instanceof Date) arg = xUnitConv.dateToS(arg);
    super(arg, false);
  }
  get s(): number {
    return this.val;
  }

  get date(): Date {
    return xUnitConv.sToDate(this.val);
  }

  get px(): number {
    return xUnitConv.sToPx(this.val);
  }
}

export class xPx extends xUnit<number> {
  get s(): number {
    return xUnitConv.pxToS(this.val);
  }

  get date(): Date {
    return xUnitConv.pxToDate(this.val);
  }

  get px(): number {
    return this.val;
  }
}

// y implementations

export class yPx extends yUnit<number> {
  get hz(): number {
    return yUnitConv.pxToHz(this.val);
  }

  get px(): number {
    return this.val;
  }
}

export class yFreq extends yUnit<number> {
  get px(): number {
    return yUnitConv.hzToPx(this.val);
  }

  get hz(): number {
    return this.val;
  }
}

/*

x and y editable units implementations

*/

// x implementations

export class xEPx extends xPx implements xEUnit<number> {
  constructor(x: number) {
    super(x,false);
  }
  set s(x: number) {
    this.val = xUnitConv.sToPx(x);
  }

  set date(x: Date) {
    this.val = xUnitConv.dateToPx(x);
  }

  set px(x: number) {
    this.val = x;
  }
}
export class xETime extends xTime implements xEUnit<number> {
  set s(x: number) {
    this.val = x;
  }

  set date(x: Date) {
    this.val = xUnitConv.dateToS(x);
  }

  set px(x: number) {
    this.val = xUnitConv.pxToS(x);
  }
}

// y implementations

export class yEPx extends yPx implements yEUnit<number> {

  set hz(x: number) {
    this.val = yUnitConv.hzToPx(x);
  }

  set px(x: number) {
    this.val = x;
  }
}

export class yEFreq extends yFreq implements yEUnit<number> {
  set px(x: number) {
    this.val = yUnitConv.pxToHz(x);
  }

  set hz(x: number) {
    this.val = x;
  }
}
