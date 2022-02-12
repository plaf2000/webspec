import { DrawableBox } from "./Box.js";
import { pxCoord } from "./Coord.js";
import { Detections } from "./Detection.js";
import { DateTime, Unit } from "./Units.js";
export class Spec {
    constructor(ctx, tl, br, dx_limit) {
        this.mouse_type = "auto";
        this.zoommed_r = {
            x: 1,
            y: 1,
        };
        this.zoom_r = {
            x: 1.14,
            y: 1.14,
        };
        Unit.spec = this;
        this.ctx = ctx;
        this.tl_ = tl;
        this.br_ = br;
        this.time_offset = +tl.x.date - +tl.x.s * 1000;
        this.bound = {
            dx: dx_limit,
            y: {
                max: tl.y.hz,
                min: br.y.hz,
            },
        };
        this.spec_imgs = new SpecImgs(this.ctx, this);
        this.dets = new Detections(this.ctx, this);
    }
    get tl() {
        return pxCoord(this.tl_.x.px, this.tl_.y.px);
    }
    get br() {
        return pxCoord(this.br_.x.px, this.br_.y.px);
    }
    get box() {
        return new DrawableBox(this.ctx, this.tl, this.br);
    }
    delta(ax, u) {
        return +this.tl_[ax][u] - +this.br_[ax][u];
    }
    ratio(ax, u, v) {
        return this.delta(ax, u) / this.delta(ax, v);
    }
    updateDate() {
        let getDate = (val) => new DateTime(this.time_offset + val * 1000);
        this.tl_.x.date = getDate(+this.tl_.x.s);
        this.br_.x.date = getDate(+this.br_.x.s);
    }
    zoom(p, dir, shift) {
        let rx = Math.pow(this.zoom_r.x, dir);
        let newU = (old, v, r) => v - (v - old) * r;
        let newS = (old) => newU(old, +p.x.s, rx);
        if (this.boundX(newS(+this.tl_.x.s), newS(+this.br_.x.s)))
            this.updateDate();
        if (!shift) {
            let ry = Math.pow(this.zoom_r.x, dir);
            let newHz = (old) => newU(old, p.y.hz, ry);
            this.boundZoomY(newHz(this.tl_.y.hz), newHz(this.br_.y.hz));
        }
    }
    boundX(tl, br) {
        if (this.bound.dx && br - tl >= this.bound.dx)
            return false;
        this.tl_.x.s = tl;
        this.br_.x.s = br;
        return true;
    }
    boundZoomY(tl, br) {
        this.tl_.y.hz = Math.min(tl, this.bound.y.max);
        this.br_.y.hz = Math.max(this.bound.y.min, br);
    }
    boundPanX(dx) {
        this.tl_.x.s = +this.tl_.x.s - dx;
        this.br_.x.s = +this.br_.x.s - dx;
    }
    boundPanY(dy) {
        if (+this.tl_.y.hz - dy > this.bound.y.max) {
            dy = this.tl_.y.hz - this.bound.y.max;
        }
        else if (+this.br_.y.hz - dy < this.bound.y.min) {
            dy = this.br_.y.hz - this.bound.y.min;
        }
        this.tl_.y.hz -= dy;
        this.br_.y.hz -= dy;
    }
    conv(v, f, t, a) {
        let res = (+v - +this.tl_[a][f]) * this.ratio(a, t, f) + +this.tl_[a][t];
        if (t == "date")
            return new Date(res);
        return res;
    }
    drawOnCanvas() {
        this.box.drawOnCanvas();
        this.spec_imgs.drawOnCanvas();
        this.dets.drawOnCanvas();
    }
    move(p) {
        if (this.start_move_coord) {
            let dx = +p.x.s - +this.start_move_coord.x.s;
            let dy = p.y.hz - this.start_move_coord.y.hz;
            this.boundPanX(dx);
            this.boundPanY(dy);
            this.updateDate();
            this.start_move_coord = p;
        }
    }
    startMoving(p) {
        this.start_move_coord = p;
    }
    stopMoving() {
        this.start_move_coord = undefined;
    }
    onMouseDown(p) {
        if (this.dets.triggered) {
            this.dets.onMouseDown(p);
        }
        else {
            this.startMoving(p);
        }
    }
    onMouseUp(p) {
        this.dets.onMouseUp(p);
        this.stopMoving();
    }
    onMouseMove(p, md) {
        if (md)
            if (!this.start_move_coord)
                this.dets.onMouseMove(p, md);
            else
                this.move(p);
        else
            this.dets.onMouseMove(p, md);
        this.mouse_type = this.dets.mouse_type;
    }
}
class SpecImgs {
    constructor(ctx, spec) {
        this.spec = spec;
        this.ctx = ctx;
    }
    load() { }
    drawOnCanvas() {
        this.load();
    }
}
