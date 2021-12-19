export type Constr<Arg, ObjType> = { new (arg: Arg): ObjType };

type xTimeArg = number | Date;
type yFreqArg = number;
type pxArg  = number;
type xPxArg = pxArg;
type yPxArg = pxArg;

export type xArg = xTimeArg | xPxArg;
export type yArg = yPxArg | yFreqArg;

type xTimeConstr = Constr<xTimeArg,xTime>;
type xPxConstr = Constr<xPxArg, xPx>;
type yPxConstr = Constr<yPxArg, yPx>;
type yFreqConstr = Constr<yFreqArg, yFreq>;

export type xConstr = xTimeConstr | xPxConstr;
export type yConstr = yPxConstr | yFreqConstr;

export type xNumUnits = "seconds" | "px";
export type yNumUnits = "hz" | "px";



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

export class yUnitConv {
  static fqEnd = 22000;
  static pxHz = .1;

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


export interface Unit {
  // toStr(): String;
  // distance(x: Unit): number;
  // absDistance(x: Unit): number;
  // le(x: Unit): boolean;
  // leq(x: Unit): boolean;
  // eq(x: Unit): boolean;
  // geq(x: Unit): boolean;
  // ge(x: Unit): boolean;
}
export abstract class xUnit implements Unit {
  abstract date: Date;
  abstract seconds: number;
  abstract px: number;
  protected val: number;

  constructor(arg: number) {
    this.val = arg;
  }

  constructors: {
    seconds: xTimeConstr,
    date: xTimeConstr,
    px: xPxConstr
  } = {
    seconds: xTime,
    date: xTime,
    px: xPx,
  }

  seconds_constr = xTime;
  date_constr = xTime;
  px_constr = xPx;

  set time(x: Date | number) {
    if(x instanceof Date) {
      this.date = x;
    }
    else {
      this.seconds = x;
    }
  }
}

export interface yUnit extends Unit {
  hz: number;
  px: number;
}

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



// class yPx extends Px implements yUnitType {
//   toFreq(): yFreq {
//     return new yFreq();
//   }
// }

// export class xUnit {

//   private u: xUnitType;

//   constructor(x: xUnitType) {
//     this.u = x;
//   }


//   set time(x: number | Date) {
//     if(this.u instanceof xPx) {
//       this.u.time = x;
//   }

//   set px(x: number) {
//     if(this.u instanceof xPx) {
//       this.u = new xPx(x);
//     }
//     else if(this.u instanceof xTime) {
//       this.u = new xPx(x).toTime();
//     }
//     else { 
//       throw new Error("Unknown type.");
//     }
//   }

//   get seconds(): number {
//     if(this.u instanceof xPx) {
//       return this.u.toTime().val;
//     }
//     else if(this.u instanceof xTime) {
//       return this.u.val;
//     }
//     else { 
//       throw new Error("Unknown type.");
//     }
//   }

//   get date(): Date {
//     if(this.u instanceof xPx) {
//       return this.u.toTime().date;
//     }
//     else if(this.u instanceof xTime) {
//       return this.u.date;
//     }
//     else { 
//       throw new Error("Unknown type.");
//     }
//   }
// }


// export abstract class yUnit extends xyUnit {
//   static pxHz = .1;
//   static fqEnd = 22000;
//   abstract convert(constr: Constr<yUnit, yUnit>): yUnit;
//   abstract get freq(): number;
// }



// export class Freq extends yUnit {
//   constructor(arg: number | yUnit) {
//     if (typeof arg == "number") {
//       super(arg);
//     } else if (arg instanceof yPx) {
//       super(yUnit.fqEnd - arg.val / yUnit.pxHz);
//     } else {
//       super(arg.val);
//     }
//   }

//   toStr() {
//     return `${this.val} Hz`;
//   }

//   convert(constr: Constr<Freq, yUnit>): yUnit {
//     return new constr(this);
//   }

//   distance(x: yUnit): number {
//     return x.convert(Freq).val - this.val;
//   }

//   get px(): number {
//     return this.convert(yPx).val;
//   }

//   get freq(): number {
//     return this.val;
//   }
// }

// export class yPx extends yUnit {
//   constructor(arg: number | yUnit) {
//     if (typeof arg == "number") {
//       super(arg);
//     } else if (arg instanceof yPx) {
//       super((yUnit.fqEnd - arg.val) * yUnit.pxHz);
//     } else {
//       super(arg.val);
//     }
//   }

//   toStr() {
//     return `${this.val} px`;
//   }

//   convert(constr: Constr<yPx, yUnit>): yUnit {
//     return new constr(this);
//   }

//   distance(x: yUnit): number {
//     return x.convert(yPx).val - this.val;
//   }

//   get px(): number {
//     return this.val;
//   }

//   get freq(): number {
//     return this.convert(Freq).val;
//   }
// }
