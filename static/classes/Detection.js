import { EditableBox } from "./Box.js";
function inBound(a, x, b) {
    return a <= x && x <= b;
}
export class Detection extends EditableBox {
    constructor() {
        super(...arguments);
        this.frame_size = 6;
    }
    get tl() {
        return super.tl;
    }
    get br() {
        return super.br;
    }
    get tr() {
        return super.tr;
    }
    get bl() {
        return super.bl;
    }
    get l() {
        return super.l;
    }
    get r() {
        return super.r;
    }
    get t() {
        return super.t;
    }
    get b() {
        return super.b;
    }
    get xl() {
        return super.xl;
    }
    get yt() {
        return super.yt;
    }
    get w() {
        return super.w;
    }
    get h() {
        return super.h;
    }
    get dur() {
        return super.dur;
    }
    get dfreq() {
        return super.dfreq;
    }
    get resizing_x() {
        return super.resizing_x;
    }
    get resizing_y() {
        return super.resizing_y;
    }
    set tl(tl) {
        super.tl = tl;
    }
    set br(br) {
        super.br = br;
    }
    set tr(tr) {
        super.bl = tr;
    }
    set bl(bl) {
        super.bl = bl;
    }
    set l(x) {
        super.l = x;
    }
    set r(x) {
        super.r = x;
    }
    set t(y) {
        super.t = y;
    }
    set b(y) {
        super.b = y;
    }
    checkResize(p) {
        if (this.isHover(p, "px", "px")) {
            if (inBound(this.l.px, p.x.px, this.l.px + this.frame_size)) {
                this.triggered_x = "l";
            }
            else if (inBound(this.r.px - this.frame_size, p.x.px, this.r.px)) {
                this.triggered_x = "r";
            }
            else {
                this.triggered_x = undefined;
            }
            if (inBound(this.t.px, p.y.px, this.t.px + this.frame_size)) {
                this.triggered_y = "t";
            }
            else if (inBound(this.b.px - this.frame_size, p.y.px, this.b.px)) {
                this.triggered_y = "b";
            }
            else {
                this.triggered_y = undefined;
            }
        }
        console.log(this.triggered_x, this.triggered_y);
    }
    startResize(p) {
        this.checkResize(p);
        this.resize_x = this.triggered_x;
        this.resize_y = this.triggered_y;
    }
    resize(p) {
        if (this.resize_x) {
            this[this.resize_x] = p.x;
        }
        if (this.resize_y) {
            this[this.resize_y] = p.y;
            console.log("Resizing y...");
        }
    }
}
