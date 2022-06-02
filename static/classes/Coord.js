import { xUnit, yUnit } from "./Units.js";
export class Coord2D {
    constructor(x, y) {
        this.x_ = x;
        this.y_ = y;
    }
    get editable() {
        return this.x.editable && this.y.editable;
    }
    get x() {
        return this.x_;
    }
    get y() {
        return this.y_;
    }
    set x(x) {
        if (this.x.editable)
            this.x_ = x;
    }
    set y(y) {
        if (this.y.editable)
            this.y_ = y;
    }
    distanceX(p, unit) {
        return p.x.sub(this.x, unit).getv(unit);
    }
    distanceY(p, unit) {
        return p.y.sub(this.y, unit).getv(unit);
    }
    euclDistance(p, xunit, yunit) {
        let dx = this.distanceX(p, xunit);
        let dy = this.distanceY(p, yunit);
        return Math.sqrt(dx * dx + dy * dy);
    }
    midPoint(p, xunit, yunit, ex, ey) {
        let x = this.x.midPoint(this.x, xunit, ex);
        let y = this.y.midPoint(this.y, yunit, ex);
        return new Coord2D(x, y);
    }
}
export class xyCoord extends Coord2D {
    get x() {
        return super.x;
    }
    get y() {
        return super.y;
    }
    set x(x) {
        super.x = x;
    }
    set y(y) {
        super.y = y;
    }
}
export function xy(x, y, xunit, yunit, ex, ey) {
    return new xyCoord(new xUnit(+x, xunit, ex), new yUnit(+y, yunit, ey));
}
export let pxCoord = (x, y, ex, ey) => xy(x, y, "px", "px", ex, ey);
export let tfCoord = (x, y, ex, ey) => {
    if (x instanceof Date)
        return xy(x, y, "date", "hz", ex, ey);
    else
        return xy(x, y, "s", "hz", ex, ey);
};
