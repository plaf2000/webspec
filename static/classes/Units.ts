import { Spec } from "./Spec.js";

export type UConstr<Arg, ObjType> = { new (arg: Arg, e?: boolean): ObjType };

/*

Type definitions

*/

export type xTUnit = xUnit<"s" | "date">;

export type xGenUnit = xUnit<keyof Units["x"]>;
export type yGenUnit = yUnit<keyof Units["y"]>;

export type nUnit = {
  [A in keyof Units]: nUnit_[A] & keyof Units[A];
};

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

x and y units definitons

*/

export class Unit<A extends keyof Units, U extends keyof Units[A]> {
  static spec: Spec;
  readonly spec: Spec;
  readonly editable: boolean;
  private val_: Units[A][U];
  readonly unit: U;
  readonly ax: A;

  constructor(val: Units[A][U], ax: A, unit: U, e = false, spec = Unit.spec) {
    this.spec = spec;
    if (spec != Unit.spec) Unit.spec = spec;
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
    return this.spec.conv(this.val, this.unit, t, this.ax);
  }

  setv<F extends keyof Units[A]>(v: Units[A][F] | Unit<A, F>, f: F) {
    if (v instanceof Unit) v = v.getv(f);
    this.val = this.spec.conv(v, f, this.unit, this.ax);
  }
}

export class xUnit<U extends keyof Units["x"]> extends Unit<"x", U> {
  constructor(val: Units["x"][U], unit: U, e = false) {
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
  constructor(val: Units["y"][U], unit: U, e = false) {
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
