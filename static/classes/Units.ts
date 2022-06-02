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

  protected set val(v: number) {
    if (this.editable) this.val_ = v;
  }

  get val(): number {
    return this.val_;
  }

  get prim_type(): string {
    return typeof this.val_;
  }

  midPoint<V extends keyof Units[A], W extends keyof Units[A]> (
    u: Unit<A, V>,
    unit: W,
    e = false,
    constr = Unit
  ): Unit<A,W> {
    return new this.constructor(
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
    return new this.constructor(
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
    return new this.constructor(
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
  static tz: number = 0;

  get local(): DateTime {
    return new DateTime(+this + DateTime.tz * 3_600_000);
  }

  set local(date: DateTime) {
    let new_date = new Date(+date - DateTime.tz * 3_600_000);
    this.setUTCFullYear(
      new_date.getUTCFullYear(),
      new_date.getUTCMonth(),
      new_date.getUTCDate()
    );
    this.setUTCHours(
      new_date.getUTCHours(),
      new_date.getUTCMinutes(),
      new_date.getUTCSeconds(),
      new_date.getUTCMilliseconds()
    );
  }

  toDateString(): string {
    return `${this.local.getUTCFullYear()}-${digit(
      this.local.getUTCMonth() + 1,
      2
    )}-${digit(this.local.getUTCDate(), 2)}`;
  }

  static toTimeZoneString(): string {
    return `(UTC+${digit(DateTime.tz, 2)})`;
  }

  toTimeString(): string {
    const [h, m, s, ms] = [
      this.local.getUTCHours(),
      this.local.getUTCMinutes(),
      this.local.getUTCSeconds(),
      this.local.getUTCMilliseconds(),
    ];

    return `${digit(h, 2)}:${digit(m, 2)}:${digit(
      s + Math.round(ms) / 1000,
      2
    )}`;
  }

  toString(): string {
    return `${this.toDateString()} ${this.toTimeString()} ${DateTime.toTimeZoneString()}`;
  }

  get midnight(): DateTime {
    return new DateTime(
      this.local.getUTCFullYear(),
      this.local.getUTCMonth(),
      this.local.getUTCDate()
    ).local;
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
