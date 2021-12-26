import { pxCoord, xyCoord } from "./Coord.js";
export class Box {
    constructor(tl, br) {
        this.tl_ = tl;
        this.br_ = br;
    }
    get tl() {
        return this.tl_;
    }
    get br() {
        return this.br_;
    }
    get tr() {
        return new xyCoord(this.br.x, this.tl.y);
    }
    get bl() {
        return new xyCoord(this.tl.x, this.br.y);
    }
    get l() {
        return this.tl_.x;
    }
    get r() {
        return this.br_.x;
    }
    get t() {
        return this.tl_.y;
    }
    get b() {
        return this.br_.y;
    }
    width(xunit) {
        return this.br_.x[xunit] - this.tl_.x[xunit];
    }
    height(yunit) {
        return this.br_.y[yunit] - this.tl_.y[yunit];
    }
    isHover(p, xunit, yunit, strict = false) {
        let check = (a, b, op) => {
            return op(a, b) || (!strict && a == b);
        };
        let gt = (a, b) => a > b;
        let lt = (a, b) => a < b;
        return (check(p.x[xunit], this.tl_.x[xunit], gt) &&
            check(p.x[xunit], this.br_.x[xunit], lt) &&
            check(p.y[yunit], this.tl_.y[yunit], gt) &&
            check(p.y[yunit], this.br_.y[yunit], lt));
    }
    isHoverPx(x, y, strict = false) {
        return this.isHover(pxCoord(x, y), "px", "px", strict);
    }
}
export class DrawableBox extends Box {
    constructor(ctx, tl, br) {
        super(tl, br);
        this.ctx = ctx;
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
        return this.l.px;
    }
    get yt() {
        return this.t.px;
    }
    get w() {
        return this.width("px");
    }
    get h() {
        return this.height("px");
    }
    get dur() {
        return this.width("s");
    }
    get dfreq() {
        return this.height("hz");
    }
    clear() {
        this.ctx.clearRect(this.xl, this.yt, this.w, this.h);
    }
    drawOnCanvas() {
        this.ctx.beginPath();
        this.ctx.rect(this.xl, this.yt, this.w, this.h);
        this.ctx.stroke();
    }
}
export class EditableBox extends DrawableBox {
    constructor(ctx, tl, br) {
        super(ctx, tl, br);
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
        return !(this.resize_x === undefined);
    }
    get resizing_y() {
        return !(this.resize_y === undefined);
    }
    set tl(tl) {
        this.t = tl.y;
        this.l = tl.x;
    }
    set br(br) {
        this.r = br.x;
        this.b = br.y;
    }
    set tr(tr) {
        this.t = tr.y;
        this.r = tr.x;
    }
    set bl(bl) {
        this.l = bl.x;
        this.b = bl.y;
    }
    set l(x) {
        if (x.px > this.br.x.px) {
            this.tl.x.px = this.br.x.px;
            this.br.x.px = x.px;
            if (this.resizing_x)
                this.resize_x = "r";
        }
        else
            this.tl.x.px = x.px;
    }
    set r(x) {
        if (x.px < this.tl.x.px) {
            this.br.x.px = this.tl.x.px;
            this.tl.x.px = x.px;
            if (this.resizing_x)
                this.resize_x = "l";
        }
        else
            this.br.x.px = x.px;
    }
    set t(y) {
        if (y.px > this.br.y.px) {
            this.tl.y.px = this.br.y.px;
            this.br.y.px = y.px;
            if (this.resizing_y)
                this.resize_y = "b";
        }
        else
            this.tl.y.px = y.px;
    }
    set b(y) {
        if (y.px < this.tl.y.px) {
            this.br.y.px = this.tl.y.px;
            this.tl.y.px = y.px;
            if (this.resizing_y)
                this.resize_y = "t";
        }
        else
            this.br.y.px = y.px;
    }
    resize(p) {
        if (this.resize_x !== undefined) {
            this[this.resize_x] = p.x;
        }
        if (this.resize_y !== undefined) {
            this[this.resize_y] = p.y;
        }
    }
    stopResize(p) {
        this.resize(p);
        this.resize_x = undefined;
        this.resize_y = undefined;
    }
}
