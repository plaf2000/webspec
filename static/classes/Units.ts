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

  constructor(val: number, ax: A, unit: U, e = false, spec = Unit.spec) {
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

  midPoint(u: Unit<A,U>) {
    return new Unit((this.val + +u )/2,this.ax,this.unit);
  }

  getv<T extends keyof Units[A]>(t: T): Units[A][T] {
    return this.spec.conv(this.val, this.unit, t, this.ax);
  }

  setv<F extends keyof Units[A]>(v: Units[A][F] | Unit<A, F>, f: F) {
    if (v instanceof Unit) v = v.getv(f);
    this.val = this.spec.conv(v, f, this.unit, this.ax);
  }
}

export class xUnit<U extends keyof Units["x"]> extends Unit<"x", U> {
  constructor(val: number, unit: U, e = false) {
    super(val, "x", unit, e);
  }

  get date(): Units["x"]["date"] {
    return new DateTime(this.getv("date"));
  }
  get s(): Units["x"]["s"] {
    return new Second(this.getv("s"));
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
  constructor(val: number, unit: U, e = false) {
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

let digit = (x: number, n: number) =>
  x.toLocaleString("en-US", {
    minimumIntegerDigits: n,
    useGrouping: false,
  });

let decimal = (x: number, n: number) =>
  x.toLocaleString("en-US", {
    minimumFractionDigits: n,
    maximumFractionDigits: n,
    useGrouping: false,
  });

let round = (x: number, n: number) =>
  Math.round(x * Math.pow(10, n)) / Math.pow(10, n);

class Second extends Number {
  toString(): string {
    let time = new Date(Math.round(this.valueOf() * 1000));
    const [m, s, ms] = [
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds(),
    ];
    const h = (+time - m * 60000 - s * 1000 - ms) / 3600000;
    return `${digit(h, 2)}:${digit(m, 2)}:${digit(
      s + Math.round(ms) / 1000,
      2
    )}`;
  }
}

export class DateTime extends Date {
  toDateString(): string {
    return `${this.getFullYear()}-${digit(this.getMonth() + 1, 2)}-${digit(
      this.getDate(),
      2
    )}`;
  }

  toTimeString(): string {
    const [h, m, s, ms] = [
      this.getHours(),
      this.getMinutes(),
      this.getSeconds(),
      this.getMilliseconds(),
    ];
    return `${digit(h, 2)}:${digit(m, 2)}:${digit(
      s + Math.round(ms) / 1000,
      2
    )}`;
  }

  toString(): string {
    return `${this.toDateString()} ${this.toTimeString()}`;
  }

  get midnight(): DateTime {
    return new DateTime(this.getFullYear(),this.getMonth(),this.getDate());
  }
}

export function convertDist<
  A extends AxT,
  F extends uList<A>,
  T extends uList<A>
>(val: number, ax: A, f: F, t: T): number {
  let zero = new Unit(0, ax, f);
  let uval = new Unit(val, ax, f);
  return +uval.getv(t) - +zero.getv(t);
}
