/*

x and y units definitons

*/
export class Unit {
    constructor(val, ax, unit, e = false, spec = Unit.spec) {
        this.spec = spec;
        if (spec != Unit.spec)
            Unit.spec = spec;
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
        return this.spec.conv(this.val, this.unit, t, this.ax);
    }
    setv(v, f) {
        if (v instanceof Unit)
            v = v.getv(f);
        this.val = this.spec.conv(v, f, this.unit, this.ax);
    }
}
export class xUnit extends Unit {
    constructor(val, unit, e = false) {
        super(val, "x", unit, e);
    }
    get date() {
        return new DateTime(this.getv("date"));
    }
    get s() {
        return new Second(this.getv("s"));
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
let digit = (x, n) => x.toLocaleString("en-US", {
    minimumIntegerDigits: n,
    useGrouping: false,
});
let decimal = (x, n) => x.toLocaleString("en-US", {
    minimumFractionDigits: n,
    maximumFractionDigits: n,
    useGrouping: false,
});
let round = (x, n) => Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
class Second extends Number {
    toString() {
        let time = new Date(Math.round(this.valueOf() * 1000));
        const [m, s, ms] = [
            time.getMinutes(),
            time.getSeconds(),
            time.getMilliseconds(),
        ];
        const h = (+time - m * 60000 - s * 1000 - ms) / 3600000;
        return `${digit(h, 2)}:${digit(m, 2)}:${digit(s + Math.round(ms) / 1000, 2)}`;
    }
}
export class DateTime extends Date {
    toDateString() {
        return `${this.getFullYear()}-${digit(this.getMonth() + 1, 2)}-${digit(this.getDate(), 2)}`;
    }
    toTimeString() {
        const [h, m, s, ms] = [
            this.getHours(),
            this.getMinutes(),
            this.getSeconds(),
            this.getMilliseconds(),
        ];
        return `${digit(h, 2)}:${digit(m, 2)}:${digit(s + Math.round(ms) / 1000, 2)}`;
    }
    toString() {
        return `${this.toDateString()} ${this.toTimeString()}`;
    }
    get midnight() {
        return new DateTime(this.getFullYear(), this.getMonth(), this.getDate());
    }
}
export function convertDist(val, ax, f, t) {
    let zero = new Unit(0, ax, f);
    let uval = new Unit(val, ax, f);
    return +uval.getv(t) - +zero.getv(t);
}
