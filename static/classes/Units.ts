export type UConstr<Arg, ObjType> = { new (arg: Arg, e?: boolean): ObjType };

/*

Type definitions

*/

export type xTUnit = xUnit<"s" | "date">;

export type xGenUnit = xUnit<keyof Units["x"]>
export type yGenUnit = yUnit<keyof Units["y"]>

// type TableConv = {
//   [Ax in keyof Units]: {
//     [from in keyof Units[Ax]]: {
//       [to in keyof Units[Ax]]: (arg: Units[Ax][from]) => Units[Ax][to];
//     };
//   };
// };

export type nUnit = {
  [A in keyof Units]: nUnit_[A] & keyof Units[A]; 
}

export type nUnit_ = {
  x: "px" | "s";
  y: "px" | "hz";
};

export type uList<A extends AxT> = keyof Units[A];
export type AxT = keyof Units;

export type Units = {
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

/*
 extends keyof Units[A]
Classes used for conversions

*/

// let identity: <X>(arg: X) => X = (arg) => arg;

export class Conv {
  static px_s = 10;
  static time_offset = 0;
  static start_time = Conv.time_offset;
  static fq_end = 22000;
  static px_hz = 0.1;

  // static tableConv: TableConv = {
  //   x: {
  //     px: {
  //       px: identity,
  //       s: (v) => v / Conv.px_s + Conv.start_time,
  //       date: (v) => this.tableConv.x.s.date(this.tableConv.x.px.s(v)),
  //     },
  //     s: {
  //       px: identity,
  //       s: identity,
  //       date: (v) => new Date(v * 1000),
  //     },
  //     date: {
  //       px: (v) => v.getMilliseconds(),
  //       s: (v) => v.getMilliseconds(),
  //       date: identity,
  //     },
  //   },
  //   y: {
  //     px: {
  //       px: identity,
  //       hz: identity,
  //     },
  //     hz: {
  //       px: identity,
  //       hz: identity,
  //     },
  //   },
  // };


  /*
   * TODO: test the following function:
  */
  static conv<
    A extends AxT,
    F extends keyof Units[A],
    T extends keyof Units[A]
  >(v: Units[A][F], f: F, t: T, a: A): any { 
    if ((f as string) == (t as string)) {
      return v;
    }
    else {
      if(a == "x") {
        if(f == "px" && typeof v == "number") {
          if(t == "s") {
            return v / Conv.px_s + Conv.start_time;
          }
          else {
            return Conv.conv(Conv.conv(v,"px","s","x"),"s","date","x");
          }
        }
        else if(f == "s" && typeof v == "number") {
          if(t == "px") {
            return (v - Conv.start_time) * Conv.px_s;
          }
          else {
            return new Date((v+Conv.time_offset) * 1000);
          }
        }
        else if(v instanceof Date) {
          if(t == "px") {
            return Conv.conv(Conv.conv(v,"date","s","x"),"s","px","x");
          }
          else {
            return v.getMilliseconds() / 1000 - Conv.time_offset;
          }
        }
      }
      else if(typeof v == "number") {
        if(f=="px") {
          return Conv.fq_end - v / Conv.px_hz;
        }
        else {
          return (Conv.fq_end - v) * Conv.px_hz;
        }
      }
    }
  }
}

/*

x and y units definitons

*/

export class Unit<A extends keyof Units, U extends keyof Units[A]> {
  readonly editable: boolean;
  private val_: Units[A][U];
  readonly unit: U;
  readonly ax: A;
  constructor(val: Units[A][U], ax: A, unit: U, e = false) {
    this.val_ = val;
    this.editable = e;
    this.unit = unit;
    this.ax = ax;
  }

  protected set val(v: Units[A][U]) {
    if (this.editable) this.val_ = v;
  }

  get val(): Units[A][U] {
    return this.val_;
  }

  get prim_type(): string {
    return typeof this.val_;
  }

  getv<T extends keyof Units[A]>(t: T): Units[A][T] {
    return Conv.conv(this.val,this.unit,t,this.ax);
  }

  setv<F extends keyof Units[A]>(v: Units[A][F] | Unit<A, F>, f: F) {
    if (v instanceof Unit) v = v.getv(f);
    this.val = Conv.conv(v,f,this.unit,this.ax);
  }
}

export class xUnit<U extends keyof Units["x"]> extends Unit<"x", U> {

  constructor (val: Units["x"][U], unit: U, e = false) {
    super(val, "x", unit, e);
  }

  get date(): Units["x"]["date"] {
    return this.getv("date");
  }
  get s(): Units["x"]["s"] {
    return this.getv("s");
  }
  get px(): Units["x"]["px"] {
    return this.getv("px");
  }

  set date(v: Units["x"]["date"]) {
    this.setv(v, "date");
  }
  set s(v: Units["x"]["s"]) {
    this.setv(v, "s");
  }
  set px(v: Units["x"]["px"]) {
    this.setv(v, "px");
  }
}

export class yUnit<U extends keyof Units["y"]> extends Unit<"y", U> {

  constructor (val: Units["y"][U], unit: U, e = false) {
    super(val, "y", unit, e);
  }

  get hz(): Units["y"]["hz"] {
    return this.getv("hz");
  }
  get px(): Units["y"]["px"] {
    return this.getv("px");
  }

  set hz(v: Units["y"]["hz"]) {
    this.setv(v, "hz");
  }
  set px(v: Units["y"]["px"]) {
    this.setv(v, "px");
  }
}
