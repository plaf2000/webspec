/*
 extends keyof Units[A]
Classes used for conversions

*/
// let identity: <X>(arg: X) => X = (arg) => arg;
export class Conv {
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
    static conv(v, f, t, a) {
        if (f == t) {
            return v;
        }
        else {
            if (a == "x") {
                if (f == "px" && typeof v == "number") {
                    if (t == "s") {
                        return v / Conv.px_s + Conv.start_time;
                    }
                    else {
                        return Conv.conv(Conv.conv(v, "px", "s", "x"), "s", "date", "x");
                    }
                }
                else if (f == "s" && typeof v == "number") {
                    if (t == "px") {
                        return (v - Conv.start_time) * Conv.px_s;
                    }
                    else {
                        return new Date((v + Conv.time_offset) * 1000);
                    }
                }
                else if (v instanceof Date) {
                    if (t == "px") {
                        return Conv.conv(Conv.conv(v, "date", "s", "x"), "s", "px", "x");
                    }
                    else {
                        return v.getMilliseconds() / 1000 - Conv.time_offset;
                    }
                }
            }
            else if (typeof v == "number") {
                if (f == "px") {
                    return Conv.fq_end - v / Conv.px_hz;
                }
                else {
                    return (Conv.fq_end - v) * Conv.px_hz;
                }
            }
        }
    }
}
Conv.px_s = 10;
Conv.time_offset = 0;
Conv.start_time = Conv.time_offset;
Conv.fq_end = 22000;
Conv.px_hz = 0.1;
/*

x and y units definitons

*/
export class Unit {
    constructor(val, ax, unit, e = false) {
        this.val_ = val;
        this.editable = e;
        this.unit = unit;
        this.ax = ax;
    }
    set val(v) {
        if (this.editable)
            this.val_ = v;
    }
    get val() {
        return this.val_;
    }
    get prim_type() {
        return typeof this.val_;
    }
    getv(t) {
        return Conv.conv(this.val, this.unit, t, this.ax);
    }
    setv(v, f) {
        if (v instanceof Unit)
            v = v.getv(f);
        this.val = Conv.conv(v, f, this.unit, this.ax);
    }
}
export class xUnit extends Unit {
    constructor(val, unit, e = false) {
        super(val, "x", unit, e);
    }
    get date() {
        return this.getv("date");
    }
    get s() {
        return this.getv("s");
    }
    get px() {
        return this.getv("px");
    }
    set date(v) {
        this.setv(v, "date");
    }
    set s(v) {
        this.setv(v, "s");
    }
    set px(v) {
        this.setv(v, "px");
    }
}
export class yUnit extends Unit {
    constructor(val, unit, e = false) {
        super(val, "y", unit, e);
    }
    get hz() {
        return this.getv("hz");
    }
    get px() {
        return this.getv("px");
    }
    set hz(v) {
        this.setv(v, "hz");
    }
    set px(v) {
        this.setv(v, "px");
    }
}
