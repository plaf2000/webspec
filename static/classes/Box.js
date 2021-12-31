import { xyCoord } from "./Coord.js";
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
    get y_editable() {
        return this.t.editable && this.b.editable;
    }
    get x_editable() {
        return this.l.editable && this.r.editable;
    }
    width(xunit) {
        return +this.br_.x[xunit] - +this.tl_.x[xunit];
    }
    height(yunit) {
        return +this.br_.y[yunit] - +this.tl_.y[yunit];
    }
    isHover(p, xunit, yunit, strict = false) {
        let check = (a, b, op) => {
            return op(a, b) || (!strict && a == b);
        };
        let gt = (a, b) => a > b;
        let lt = (a, b) => a < b;
        return (check(+p.x[xunit], +this.tl_.x[xunit], gt) &&
            check(+p.x[xunit], +this.br_.x[xunit], lt) &&
            check(+p.y[yunit], +this.tl_.y[yunit], gt) &&
            check(+p.y[yunit], +this.br_.y[yunit], lt));
    }
    isHoverPx(p, strict = false) {
        return this.isHover(p, "px", "px", strict);
    }
}
export class PXBox extends Box {
}
export class DrawableBox extends Box {
    constructor(ctx, tl, br) {
        super(tl, br);
        this.ctx = ctx;
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
    set tl(tl) {
        this.tl = tl;
    }
    set br(br) {
        this.br = br;
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
        this.tl.x = x;
    }
    set r(x) {
        this.br.x = x;
    }
    set t(y) {
        this.tl.y = y;
    }
    set b(y) {
        this.br.y = y;
    }
    setEdge(x, edge) {
        switch (edge) {
            case "l":
                if (x > this.br.x.px) {
                    this.tl.x.px = this.br.x.px;
                    this.br.x.px = x;
                    if (this.resize_x)
                        this.resize_x = "r";
                }
                else
                    this.tl.x.px = x;
                break;
            case "r":
                if (x < this.tl.x.px) {
                    this.br.x.px = this.tl.x.px;
                    this.tl.x.px = x;
                    if (this.resize_x)
                        this.resize_x = "l";
                }
                else
                    this.br.x.px = x;
                break;
            case "t":
                if (x > this.br.y.px) {
                    this.tl.y.px = this.br.y.px;
                    this.br.y.px = x;
                    if (this.resize_y)
                        this.resize_y = "b";
                }
                else
                    this.tl.y.px = x;
                break;
            case "b":
                if (x < this.tl.y.px) {
                    this.br.y.px = this.tl.y.px;
                    this.tl.y.px = x;
                    if (this.resize_y)
                        this.resize_y = "t";
                }
                else
                    this.br.y.px = x;
                break;
        }
    }
    resize(p) {
        if (this.resize_x)
            this.setEdge(p.x.px, this.resize_x);
        if (this.resize_y)
            this.setEdge(p.y.px, this.resize_y);
    }
    stopResize(p) {
        this.resize(p);
        this.resize_x = undefined;
        this.resize_y = undefined;
        console.log(this.tl.x.px, this.tl.y.px, this.br.x.px, this.br.y.px);
    }
    move(p) {
        if (this.start_move_coord) {
            let dx = this.x_editable ? this.start_move_coord.distanceX(p, "px") : 0;
            let dy = this.y_editable ? this.start_move_coord.distanceY(p, "px") : 0;
            this.l.px += dx;
            this.t.px += dy;
            this.r.px += dx;
            this.b.px += dy;
            console.log(this.w, this.h);
            this.start_move_coord = p;
        }
    }
    stopMoving() {
        this.start_move_coord = undefined;
    }
}
export class DrawablePXBox extends DrawableBox {
}
export class BoundedBox extends EditableBox {
    constructor(ctx, tl, br, bound_box, bounds) {
        super(ctx, tl, br);
        this.bounds = bounds;
        this.bound_box = bound_box;
    }
    setEdge(x, edge) {
        let arg = 0;
        switch (edge) {
            case "l":
                arg = this.bounds.x.l
                    ? x < this.bound_box.l.px
                        ? this.bound_box.l.px
                        : x
                    : x;
                break;
            case "r":
                arg = this.bounds.x.r
                    ? x > this.bound_box.r.px
                        ? this.bound_box.r.px
                        : x
                    : x;
                break;
            case "t":
                arg = this.bounds.y.t
                    ? x < this.bound_box.t.px
                        ? this.bound_box.t.px
                        : x
                    : x;
                break;
            case "b":
                arg = this.bounds.y.b
                    ? x > this.bound_box.b.px
                        ? this.bound_box.b.px
                        : x
                    : x;
                break;
        }
        super.setEdge(arg, edge);
    }
    move(p) {
        if (this.start_move_coord) {
            let dx = this.x_editable ? this.start_move_coord.distanceX(p, "px") : 0;
            let dy = this.y_editable ? this.start_move_coord.distanceY(p, "px") : 0;
            if (this.bounds.x.l)
                dx = Math.max(this.bound_box.l.px - this.l.px, dx);
            if (this.bounds.x.r)
                dx = Math.min(this.bound_box.r.px - this.r.px, dx);
            if (this.bounds.y.t)
                dy = Math.max(this.bound_box.t.px - this.t.px, dy);
            if (this.bounds.y.b)
                dy = Math.min(this.bound_box.b.px - this.b.px, dy);
            this.l.px += dx;
            this.t.px += dy;
            this.r.px += dx;
            this.b.px += dy;
            this.start_move_coord = p;
        }
    }
}
