export type Constr<Arg, ObjType> = { new (arg: Arg): ObjType };

export interface Unit {
  val: number;
  toStr(): String;
}

export abstract class xyUnit implements Unit {
  abstract val: number;
  abstract toStr(): string;

  abstract convert(constr: Constr<xyUnit, xyUnit>): xyUnit;
}

export abstract class xUnit extends xyUnit {
  static pxS = 10;
  static timeOffset = 0;
  abstract convert(constr: Constr<xUnit, xUnit>): xUnit;
}

export abstract class yUnit extends xyUnit {
  static pxHz = 1;
  abstract convert(constr: Constr<yUnit, yUnit>): yUnit;
}

export class xPx implements xUnit {
  val: number;

  constructor(arg: number | xUnit) {
    if (typeof arg == "number") {
      this.val = arg;
    } else if (arg instanceof Time) {
      this.val = arg.val * xUnit.pxS;
    } else {
      this.val = arg.val;
    }
  }

  toStr() {
    return `${this.val} px`;
  }

  convert(constr: Constr<xPx, xUnit>): xUnit {
    return new constr(this);
  }
}

export class Time extends Date implements xUnit {
  val: number;

  constructor(arg: number | xUnit) {
    let val: number;
    if (typeof arg == "number") {
      val = arg;
    } else if (arg instanceof xPx) {
      val = arg.val * xUnit.pxS;
    } else {
      val = arg.val;
    }
    super((xUnit.timeOffset + val) * 1000);
    this.val = val;
  }

  toStr() {
    return this.toTimeString();
  }

  convert(constr: Constr<Time, xUnit>): xUnit {
    return new constr(this);
  }
}

export class Freq implements yUnit {
  val: number;

  constructor(arg: number | yUnit) {
    if (typeof arg == "number") {
      this.val = arg;
    } else if (arg instanceof yPx) {
      this.val = arg.val / yUnit.pxHz;
    } else {
      this.val = arg.val;
    }
  }

  toStr() {
    return `${this.val} Hz`;
  }

  convert(constr: Constr<Freq, yUnit>): yUnit {
    return new constr(this);
  }
}

export class yPx implements yUnit {
  val: number;

  constructor(arg: number | yUnit) {
    if (typeof arg == "number") {
      this.val = arg;
    } else if (arg instanceof yPx) {
      this.val = arg.val * yUnit.pxHz;
    } else {
      this.val = arg.val;
    }
  }

  toStr() {
    return `${this.val} px`;
  }

  convert(constr: Constr<yPx, yUnit>): yUnit {
    return new constr(this);
  }
}
