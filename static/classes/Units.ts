import { Spec } from "./Spec.js";

export type UConstr<Arg, ObjType> = { new (arg: Arg, e?: boolean): ObjType };

/*

Type definitions

*/

export type xTUnit = xUnit<"s" | "date">;

export type xGenUnit = xUnit<keyof Units["x"]>;
export type yGenUnit = yUnit<keyof Units["y"]>;

export type uList<A extends AxT> = keyof Units[A];
export type AxT = keyof Units;

export type Units = {
  x: {
    px: number;
    s: Second;
    date: DateTime;
  };
  y: {
    px: number;
    hz: number;
  };
};

/*

x and y units definitons

*/

export class Unit<A extends keyof Units, U extends keyof Units[A]> {
  static spec: Spec;
  readonly spec: Spec;
  readonly editable: boolean;
  private val_: number;
  readonly unit: U;
  readonly ax: A;

  constructor(val: number,  unit: U, ax: A, e = false, spec = Unit.spec) {
    this.spec = spec;
    if (spec != Unit.spec) Unit.spec = spec;
    this.val_ = val;
    this.editable = e;
    this.unit = unit;
    this.ax = ax;
  }

  set val(v: number) {
    if (this.editable) this.val_ = v;
  }

  get val(): number {
    return this.val_;
  }


  midPoint<V extends keyof Units[A], W extends keyof Units[A]> (
    u: Unit<A, V>,
    unit: W,
    e = false,
    constr = Unit
  ): Unit<A,W> {
    return new Unit(
      (this.getv(unit) + u.getv(unit)) / 2,
      unit,
      this.ax,
      e,
      this.spec
    );
  }

  getv<T extends keyof Units[A]>(t: T): number {
    return this.spec.conv(this.val, this.unit, t, this.ax);
  }

  setv<F extends keyof Units[A]>(v: number, f: F) {
    this.val = this.spec.conv(v, f, this.unit, this.ax);
  }

  toString(unit: keyof Units[A], digit: number, print_unit = false): string {
    let roundval: number = Math.pow(10, digit);
    return `${Math.round(+this.getv(unit) * roundval) / roundval}${
      print_unit ? " " + unit : ""
    }`;
  }

  add<V extends keyof Units[A], W extends keyof Units[A]>(
    other: Unit<A, V>,
    unit: W
  ): Unit<A, W> {
    return new Unit(
      this.getv(unit) + other.getv(unit),
      unit,
      this.ax,
      this.editable,
      this.spec
    );
  }

  sub<V extends keyof Units[A], W extends keyof Units[A]>(
    other: Unit<A, V>,
    unit: W
  ): Unit<A, W> {
    return new Unit(
      this.getv(unit) - other.getv(unit),
      unit,
      this.ax,
      this.editable,
      this.spec
    );
  }
}

export class xUnit<U extends keyof Units["x"]> extends Unit<"x", U> {
  
  constructor(
    val: number,
    unit: U,
    ax: "x" = "x",
    e = false,
    spec = Unit.spec
  ) {
    super(val,unit, "x",  e, spec);
  }

  get date(): Units["x"]["date"] {
    return new DateTime(this.getv("date"));
  }
  get s(): Units["x"]["s"] {
    return new Second(this.getv("s"));
  }
  get px(): Units["x"]["px"] {
    return Math.round(this.getv("px"));
  }

  set date(v: Units["x"]["date"]) {
    this.setv(+v, "date");
  }
  set s(v: Units["x"]["s"]) {
    this.setv(+v, "s");
  }
  set px(v: Units["x"]["px"]) {
    this.setv(Math.round(v), "px");
  }
}



export class yUnit<U extends keyof Units["y"]> extends Unit<"y", U> {
  constructor(
    val: number,
    unit: U,
    ax: "y" = "y",
    e = false,
    spec = Unit.spec
  ) {
    super(val, unit,"y", e, spec);
  }

  get hz(): Units["y"]["hz"] {
    return this.getv("hz");
  }
  get px(): Units["y"]["px"] {
    return Math.round(this.getv("px"));
  }

  set hz(v: Units["y"]["hz"]) {
    this.setv(v, "hz");
  }
  set px(v: Units["y"]["px"]) {
    this.setv(Math.round(v), "px");
  }
}

export function castx<U extends uList<"x">>(u: Unit<"x",U>){
  return new xUnit(u.val,u.unit,"x",u.editable,u.spec);
}

export function casty<U extends uList<"y">>(u: Unit<"y",U>){
  return new yUnit(u.val,u.unit,"y",u.editable,u.spec);
}


let digit = (x: number, n: number) =>
  x.toLocaleString("en-US", {
    minimumIntegerDigits: n,
    useGrouping: false,
  });

class Second extends Number {
  toString(): string {
    let neg = this.valueOf() < 0;
    let time = new Date(Math.round(Math.abs(this.valueOf()) * 1000));
    const [m, s, ms] = [
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds(),
    ];
    let h = (+time - m * 60000 - s * 1000 - ms) / 3600000;
    let d = Math.floor(h / 24);
    h = h - Math.sign(h) * d * 24;
    let w = Math.floor(d / 7);
    d = d - Math.sign(d) * w * 7;
    let str = "";
    if (neg) str += "-";
    if (w > 0) str += `${w} week${w > 1 ? "s" : ""}`;
    if (d > 0) {
      if (w > 0) str += " ";
      str += `${d} day${d > 1 ? "s" : ""}`;
    }
    if (d > 0 || w > 0) str += "\n";
    return (
      str +
      `${digit(h, 2)}:${digit(m, 2)}:${digit(s + Math.round(ms) / 1000, 2)}`
    );
  }
}
export class DateTime extends Date {
  static tz: string = "UTC";

  get offset(): number  {
    const local = new DateTime(this.toLocaleString('en-US', { timeZone: DateTime.tz }));
    const utcDate = new DateTime(this.toLocaleString('en-US', { timeZone:"UTC" }));
    return (local.getTime() - utcDate.getTime());
  }

  get shifted(): DateTime {
    return new DateTime(+this + this.offset);
  }

  get millisPrecision(): number {
    const m = Math.round(this.shifted.getUTCMilliseconds());
    for(let i=1; i<4; i++) {
      let dec = 10**i;
      if(m % dec) return 4-i;
    }
    return 0;
  }

  toDateString(): string {
    return this.toLocaleDateString(undefined, {timeZone: DateTime.tz})
  }

  toTimeString(): string {
    // return  this.toLocaleTimeString(undefined, {timeZone: DateTime.tz, hour: "2-digit", minute:"2-digit", second:"2-digit", fractionalSecondDigits: 3});
    const mp = this.millisPrecision;
    let options: {
      timeZone: string,
      hour?: string,
      minute?:string,
      second?:string,
      fractionalSecondDigits?: number
    } = {timeZone: DateTime.tz}
    if(mp) options = {timeZone: DateTime.tz, hour: "2-digit", minute:"2-digit", second:"2-digit", fractionalSecondDigits: mp};
    return  this.toLocaleTimeString(undefined, options);
  }

  toTimeZoneString(): string {
    const withDate = this.toLocaleDateString("en-GB", {timeZone: DateTime.tz, timeZoneName:"shortOffset"});
    return withDate.split(" ").slice(1).join(" ");
  }



  toString(): string {
    return this.toLocaleString(undefined, {timeZone: DateTime.tz, timeZoneName:"shortOffset"})
  }

  get midnight(): DateTime {
    const utcMidnight = Date.UTC(
      this.shifted.getUTCFullYear(),
      this.shifted.getUTCMonth(),
      this.shifted.getUTCDate()
    );
    // let ms_from_midnight = ((this.getUTCHours()*60+this.getUTCMinutes())*60+this.getUTCSeconds())*1000+this.getUTCMilliseconds();
    return new DateTime(+utcMidnight - this.offset);
  }
}

export function convertDist<
  A extends AxT,
  F extends uList<A>,
  T extends uList<A>
>(val: number, ax: A, f: F, t: T): number {
  let zero = new Unit(0,f,ax);
  let uval = new Unit(val, f, ax);
  return Math.abs(uval.getv(t) - zero.getv(t));
}
