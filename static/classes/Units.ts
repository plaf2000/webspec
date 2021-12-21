export type UConstr<Arg, ObjType> = { new (arg: Arg, e?: boolean): ObjType };

/*

Type definitions

*/

export type xVal = number;
export type yVal = number;

export type nUnit<T extends keyof PrimUnit> = PrimUnit[T]["number"]

export type Constr = {
  x: {
    px: UConstr<Arg["xPx"], xPx>;
    s: UConstr<Arg["xTime"], xTime>;
    date: UConstr<Arg["xTime"], xTime>;
  };
  y: {
    px: UConstr<Arg["yPx"], yPx>;
    hz: UConstr<Arg["yFreq"], yFreq>;
  };
};

export type UnitClass = {
  x: {
    px: xPx,
    s: xTime,
    date: xTime
  };
  y: {
    px: yPx,
    hz: yFreq
  };
};

export type Arg = {
  xPx: number;
  xTime: number | Date;
  yPx: number;
  yFreq: number;
};

export type UnitPrim = {
  x: {
    px: number;
    s: number;
    date: Date;
  };
  y: {
    px: number;
    hz: number;
  };
};

export type PrimUnit = {
  x: {
    Date: "date";
    number: "s" | "px";
  };
  y: {
    number: "px" | "hz";
  };
};

// Get unit string either by x or y (= type T)

export type UnitStr<T extends keyof UnitPrim> = keyof UnitPrim[T];

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
  private val_: U;
  constructor(val: U, e?: boolean) {
    this.val_ = val;
    this.editable_ = e || false;
  }
  get editable(): boolean {
    return this.editable_;
  }

  protected set val(v: U) {
    if (this.editable) this.val_ = v;
  }

  get val(): U {
    return this.val_;
  }
}

export abstract class xUnit<U extends xVal> extends Unit<U> {
  abstract date: Date;
  abstract s: number;
  abstract px: number;
}

export abstract class yUnit<U extends yVal> extends Unit<U> {
  abstract hz: number;
  abstract px: number;
}

/*

x and y units implementations

*/

// x implementations

export class xTime extends xUnit<number> {
  constructor(arg: Arg["xTime"]) {
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

// y implementations

export class yPx extends yUnit<number> {
  get hz(): number {
    return yUnitConv.pxToHz(this.val);
  }

  get px(): number {
    return this.val;
  }

  set hz(x: number) {
    this.val = yUnitConv.hzToPx(x);
  }

  set px(x: number) {
    this.val = x;
  }
}

export class yFreq extends yUnit<number> {
  get px(): number {
    return yUnitConv.hzToPx(this.val);
  }

  get hz(): number {
    return this.val;
  }

  set px(x: number) {
    this.val = yUnitConv.pxToHz(x);
  }

  set hz(x: number) {
    this.val = x;
  }
}

/*

Helper functions

*/

// x

export let constructors: Constr = {
  x: {
    s: xTime,
    px: xPx,
    date: xTime,
  },
  y: {
    px: yPx,
    hz: yFreq,
  },
};

export function Xu<
  xU extends UnitStr<"x">
>(val: UnitPrim["x"][xU], utype: xU, e?: boolean) {
  if(val instanceof Date) return new xTime(val);
  return new constructors["x"][utype](val);
}


export function Yu<
  yU extends UnitStr<"y">
>(val: UnitPrim["y"][yU], utype: yU, e?: boolean) {
 return new constructors["y"][utype](val);
}

