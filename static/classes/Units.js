/*

x and y units definitons

*/
export class Unit {
    constructor(val, unit, ax, e = false, spec = Unit.spec) {
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
    midPoint(u, unit, e = false, constr = Unit) {
        return new Unit((this.getv(unit) + u.getv(unit)) / 2, unit, this.ax, e, this.spec);
    }
    getv(t) {
        return this.spec.conv(this.val, this.unit, t, this.ax);
    }
    setv(v, f) {
        this.val = this.spec.conv(v, f, this.unit, this.ax);
    }
    toString(unit, digit, print_unit = false) {
        let roundval = Math.pow(10, digit);
        return `${Math.round(+this.getv(unit) * roundval) / roundval}${print_unit ? " " + unit : ""}`;
    }
    add(other, unit) {
        return new Unit(this.getv(unit) + other.getv(unit), unit, this.ax, this.editable, this.spec);
    }
    sub(other, unit) {
        return new Unit(this.getv(unit) - other.getv(unit), unit, this.ax, this.editable, this.spec);
    }
}
export class xUnit extends Unit {
    constructor(val, unit, ax = "x", e = false, spec = Unit.spec) {
        super(val, unit, "x", e, spec);
    }
    get date() {
        return new DateTime(this.getv("date"));
    }
    get s() {
        return new Second(this.getv("s"));
    }
    get px() {
        return Math.round(this.getv("px"));
    }
    set date(v) {
        this.setv(+v, "date");
    }
    set s(v) {
        this.setv(+v, "s");
    }
    set px(v) {
        this.setv(Math.round(v), "px");
    }
}
export class yUnit extends Unit {
    constructor(val, unit, ax = "y", e = false, spec = Unit.spec) {
        super(val, unit, "y", e, spec);
    }
    get hz() {
        return this.getv("hz");
    }
    get px() {
        return Math.round(this.getv("px"));
    }
    set hz(v) {
        this.setv(v, "hz");
    }
    set px(v) {
        this.setv(Math.round(v), "px");
    }
}
export function castx(u) {
    return new xUnit(u.val, u.unit, "x", u.editable, u.spec);
}
export function casty(u) {
    return new yUnit(u.val, u.unit, "y", u.editable, u.spec);
}
let digit = (x, n) => x.toLocaleString("en-US", {
    minimumIntegerDigits: n,
    useGrouping: false,
});
class Second extends Number {
    toString() {
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
        if (neg)
            str += "-";
        if (w > 0)
            str += `${w} week${w > 1 ? "s" : ""}`;
        if (d > 0) {
            if (w > 0)
                str += " ";
            str += `${d} day${d > 1 ? "s" : ""}`;
        }
        if (d > 0 || w > 0)
            str += "\n";
        return (str +
            `${digit(h, 2)}:${digit(m, 2)}:${digit(s + Math.round(ms) / 1000, 2)}`);
    }
}
export class DateTime extends Date {
    get offset() {
        const local = new DateTime(this.toLocaleString('en-US', { timeZone: DateTime.tz }));
        const utcDate = new DateTime(this.toLocaleString('en-US', { timeZone: "UTC" }));
        return (local.getTime() - utcDate.getTime());
    }
    get shifted() {
        return new DateTime(+this + this.offset);
    }
    get millisPrecision() {
        const m = Math.round(this.shifted.getUTCMilliseconds());
        for (let i = 1; i < 4; i++) {
            let dec = 10 ** i;
            if (m % dec)
                return 4 - i;
        }
        return 0;
    }
    toDateString() {
        return this.toLocaleDateString(undefined, { timeZone: DateTime.tz });
    }
    toTimeString() {
        // return  this.toLocaleTimeString(undefined, {timeZone: DateTime.tz, hour: "2-digit", minute:"2-digit", second:"2-digit", fractionalSecondDigits: 3});
        const mp = this.millisPrecision;
        let options = { timeZone: DateTime.tz };
        if (mp)
            options = { timeZone: DateTime.tz, hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: mp };
        return this.toLocaleTimeString(undefined, options);
    }
    toTimeZoneString() {
        const withDate = this.toLocaleDateString("en-GB", { timeZone: DateTime.tz, timeZoneName: "shortOffset" });
        return withDate.split(" ").slice(1).join(" ");
    }
    toString() {
        return this.toLocaleString(undefined, { timeZone: DateTime.tz, timeZoneName: "shortOffset" });
    }
    get midnight() {
        const utcMidnight = Date.UTC(this.shifted.getUTCFullYear(), this.shifted.getUTCMonth(), this.shifted.getUTCDate());
        // let ms_from_midnight = ((this.getUTCHours()*60+this.getUTCMinutes())*60+this.getUTCSeconds())*1000+this.getUTCMilliseconds();
        return new DateTime(+utcMidnight - this.offset);
    }
}
DateTime.tz = "UTC";
export function convertDist(val, ax, f, t) {
    let zero = new Unit(0, f, ax);
    let uval = new Unit(val, f, ax);
    return Math.abs(uval.getv(t) - zero.getv(t));
}
