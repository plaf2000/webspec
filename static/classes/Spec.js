import { DrawableBox } from "./Box.js";
import { pxCoord } from "./Coord.js";
import { Detections } from "./Detection.js";
import { DateTime, Unit } from "./Units.js";
import { spec_options, spec_start_coord } from "../main.js";
export class Spec {
    constructor(ctx, tl_px, br_px, dx_limit) {
        this.mouse_type = "auto";
        this.zoommed = {
            x: 0,
            y: 0,
        };
        this.zoom_r = {
            x: 1.14,
            y: 1.14,
        };
        Unit.spec = this;
        this.ctx = ctx;
        this.tl_ = {
            x: {
                px: tl_px.x,
                s: 0,
                date: new DateTime(spec_start_coord.tstart)
            },
            y: {
                px: tl_px.y,
                hz: spec_start_coord.fend
            }
        };
        this.br_ = {
            x: {
                px: br_px.x,
                s: (spec_start_coord.tend - spec_start_coord.tstart) / 1000,
                date: new DateTime(spec_start_coord.tend)
            },
            y: {
                px: br_px.y,
                hz: spec_start_coord.fstart
            }
        };
        this.time_offset = +this.tl_.x.date - +this.tl_.x.s * 1000;
        this.bound = {
            dx: dx_limit,
            y: {
                max: spec_options.hf,
                min: spec_options.lf,
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
        shift || (shift = dir < 0 && this.zoommed.x >= 0);
        let rx = Math.pow(this.zoom_r.x, dir);
        let newU = (old, v, r) => v - (v - old) * r;
        let newS = (old) => newU(old, +p.x.s, rx);
        if (this.boundX(newS(+this.tl_.x.s), newS(+this.br_.x.s))) {
            this.updateDate();
            this.zoommed.x += dir;
        }
        if (!shift) {
            let ry = Math.pow(this.zoom_r.x, dir);
            let newHz = (old) => newU(old, p.y.hz, ry);
            this.boundZoomY(newHz(this.tl_.y.hz), newHz(this.br_.y.hz), dir);
        }
        this.updateURLCoord();
    }
    boundX(tl, br) {
        if (this.bound.dx && br - tl >= this.bound.dx)
            return false;
        this.tl_.x.s = tl;
        this.br_.x.s = br;
        return true;
    }
    boundZoomY(t, b, dir) {
        let reset = () => {
            this.br_.y.hz = this.bound.y.min;
            this.tl_.y.hz = this.bound.y.max;
            this.zoommed.y = 0;
        };
        if (t >= this.bound.y.max && b <= this.bound.y.min) {
            reset();
        }
        else {
            if (t >= this.bound.y.max) {
                b = this.br_.y.hz + this.bound.y.max - t;
                if (b <= this.bound.y.min) {
                    reset();
                }
                else {
                    this.tl_.y.hz = this.bound.y.max;
                    this.br_.y.hz = b;
                    this.zoommed.y += dir;
                }
            }
            else if (b <= this.bound.y.min) {
                t = this.tl_.y.hz + this.bound.y.min - b;
                if (t >= this.bound.y.max) {
                    reset();
                }
                else {
                    this.br_.y.hz = this.bound.y.min;
                    this.tl_.y.hz = t;
                    this.zoommed.y += dir;
                }
            }
            else {
                this.tl_.y.hz = t;
                this.br_.y.hz = b;
                this.zoommed.y += dir;
            }
        }
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
        this.updateURLCoord();
    }
    onMouseDown(p) {
        if (this.dets.triggered) {
            this.dets.onMouseDown(p);
            this.mouse_type = this.dets.mouse_type;
        }
        else {
            this.startMoving(p);
        }
    }
    onMouseUp(p) {
        this.dets.onMouseUp(p);
        this.stopMoving();
        this.mouse_type = this.dets.mouse_type;
    }
    onMouseMove(p, md) {
        if (md)
            if (!this.start_move_coord) {
                this.dets.onMouseMove(p, md);
                this.mouse_type = this.dets.mouse_type;
            }
            else {
                this.move(p);
                this.mouse_type = "grabbing";
            }
        else {
            this.dets.onMouseMove(p, md);
            this.mouse_type = this.dets.mouse_type;
        }
    }
    updateURLCoord() {
        window.history.replaceState(null, "", `../../../${+this.tl_.x.date}/${+this.br_.x.date}/${this.br_.y.hz}/${this.tl_.y.hz}`);
    }
}
class SpecImgs {
    constructor(ctx, spec) {
        this.imgs = [];
        this.spec = spec;
        this.ctx = ctx;
    }
    load() {
        this.imgs.push(new SpecImg(this.spec.box.l, this.spec.box.r, this.spec.box.t, this.spec.box.b));
    }
    drawOnCanvas() {
        this.load();
        this.imgs.map((img, i) => {
            img.drawOnCanvas();
        });
    }
}
class SpecImg {
    constructor(ts, te, fs, fe) {
        //     var url = new URL("spec/", window.location);
        // Object.keys(params).forEach((key) =>
        //   url.searchParams.append(key, params[key])
        // );
        // var request = fetch(url, {
        //   method: "GET",
        //   mimeType: "blob",
        // });
        // // var request = $.ajax({
        // //   method: "GET",
        // //   url: "spec/",
        // //   data: params,
        // //   mimeType: "blob"
        // // });
        // // var request = $.get(
        // //   "spec/",
        // //   params
        // // );
        // SpecImg.requestSpec(offset, i, duration).then((data) => {
        //   data.blob().then((blob) => {
        //     this.blob = blob;
        //     this.blob
        //       .slice(0, 8)
        //       .arrayBuffer()
        //       .then((buffer) => {
        //         let offset = Number(new Float64Array(buffer)[0]);
        //         this.start = offset;
        //         this.end = offset + duration;
        //       });
        //     this.duration = duration;
        //     this.img = new Image();
        //     this.img.src = URL.createObjectURL(this.blob.slice(8), { type: "image/png" });
        //     this.img.style = "-webkit-filter: blur(500px);  filter: blur(500px);";
        //     let parent = this;
        //     this.img.onload = function () {
        //       parent.width = this.width;
        //       parent.height = this.height;
        //     }
        //   });
        // });
    }
    // static requestSpec(): Promise<Response> {
    // let params = {
    //   offset: offset,
    //   lf: lf,
    //   hf: hf,
    //   ch: channel,
    //   sens: sens,
    //   con: con,
    //   nfft: nfft,
    //   wfft: wfft,
    //   factor: ,
    // };
    // return request;
    // }
    drawOnCanvas() { }
}
