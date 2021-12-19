export type Constr<Arg, ObjType> = { new (arg: Arg): ObjType };

/*

Type definitions

*/

type xTimeArg = number | Date;
type yFreqArg = number;
type pxArg  = number;
type xPxArg = pxArg;
type yPxArg = pxArg;

export type xArg = xTimeArg & xPxArg;
export type yArg = yPxArg & yFreqArg;

export type xConstr = Constr<xArg,xUnit>;
export type yConstr = Constr<yArg,yUnit>;

export type xNumUnits = "seconds" | "px";
export type yNumUnits = "hz" | "px";


/*

Class used for conversions

*/

export class xUnitConv {
  static px_s = 10;
  static time_offset = 0;
  static start_time = xUnitConv.time_offset;

  static pxToS(x: number): number {
    return x/xUnitConv.px_s+xUnitConv.start_time;
  }

  static sToPx(x: number): number {
    return (x-xUnitConv.start_time)*xUnitConv.px_s;
  }

  static dateToS(x: Date): number {
    return x.getMilliseconds()/1000-xUnitConv.time_offset;
  }

  static sToDate(x: number): Date {
    return new Date(x*1000);
  }

  static pxToDate(x: number): Date {
    return xUnitConv.sToDate(xUnitConv.pxToS(x));
  }

  static dateToPx(x: Date): number {
    return xUnitConv.sToPx(xUnitConv.dateToS(x));
  }
}

/*

x and y units definitons

*/

export class yUnitConv {
  static fq_end = 22000;
  static px_hz = .1;

  static pxToHz(y: number): number {
    return yUnitConv.fq_end-y/yUnitConv.px_hz;
  }

  static hzToPx(y: number): number {
    return (y-yUnitConv.fq_end)*yUnitConv.px_hz;
  }
}

export abstract class xUnit {
  abstract date: Date;
  abstract seconds: number;
  abstract px: number;
  protected val: number;

  constructor(arg: number) {
    this.val = arg;
  }

  constructors: {
    seconds: xConstr,
    date: xConstr,
    px: xConstr
  } = {
    seconds: xTime,
    date: xTime,
    px: xPx,
  }

  set time(x: Date | number) {
    if(x instanceof Date) {
      this.date = x;
    }
    else {
      this.seconds = x;
    }
  }
}

export abstract class yUnit {
  abstract hz: number;
  abstract px: number;
  protected val: number;

  constructor(arg: number) {
    this.val = arg;
  }

  constructors: {
    hz: yConstr,
    px: yConstr
  } = {
    hz: yFreq,
    px: yPx,
  }
}

/*

x and y units implementations

*/

// x implementations

export class xTime extends xUnit {
  constructor(arg: xTimeArg) {
    if(arg instanceof Date) arg = xUnitConv.dateToS(arg);
    super(arg);
  }
  get seconds(): number {
    return this.val;
  }

  get date(): Date {
    return xUnitConv.sToDate(this.val);
  }

  get px(): number {
    return xUnitConv.sToPx(this.val);
  } 

  set seconds(x: number) {
    this.val = x;
  }

  set date(x: Date) {
    this.val = xUnitConv.dateToS(x);
  }

  set px(x: number) {
    this.val = xUnitConv.pxToS(x);
  }
}

export class xPx extends xUnit {
  get seconds(): number {
    return xUnitConv.pxToS(this.val);
  }

  get date(): Date {
    return xUnitConv.pxToDate(this.val);
  }

  get px(): number {
    return this.val;
  } 

  set seconds(x: number) {
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

export class yPx extends yUnit {

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

export class yFreq extends yUnit {

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

