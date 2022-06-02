var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DrawableBox } from "./Box.js";
import { pxCoord, tfCoord } from "./Coord.js";
import { Detections } from "./Detection.js";
import { DateTime, Unit, xUnit, } from "./Units.js";
import { spec_options, spec_start_coord } from "../main.js";
export class Spec {
    constructor(cvs, tl_px, br_px, dx_limit) {
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
        this.cvs = cvs;
        let ts = new DateTime(spec_start_coord.tstart);
        let te = new DateTime(spec_start_coord.tend);
        let s = (+te - +ts) / 1000;
        this.tl_ = {
            x: {
                px: tl_px.x,
                s: 0,
                date: ts,
            },
            y: {
                px: tl_px.y,
                hz: spec_start_coord.fend,
            },
        };
        this.br_ = {
            x: {
                px: br_px.x,
                s: s,
                date: te,
            },
            y: {
                px: br_px.y,
                hz: spec_start_coord.fstart,
            },
        };
        this.time_offset = +this.tl_.x.date - +this.tl_.x.s * 1000;
        this.bound = {
            dx: dx_limit,
            y: {
                max: spec_options.hf,
                min: spec_options.lf,
            },
        };
        this.spec_imgs_layers = new SpecImgsLayers(this.cvs, this);
        this.dets = new Detections(this.cvs, this);
    }
    get tl() {
        return pxCoord(this.tl_.x.px, this.tl_.y.px);
    }
    get br() {
        return pxCoord(this.br_.x.px, this.br_.y.px);
    }
    get box() {
        return new DrawableBox(this.cvs, this.tl, this.br);
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
        if (isNaN(res))
            throw new Error("Invalid res");
        return res;
    }
    drawOnCanvas() {
        this.spec_imgs_layers.drawOnCanvas();
        this.dets.drawOnCanvas();
        this.box.clearOutside();
        this.box.drawOnCanvas();
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
        window.history.replaceState(null, "", `../../../${this.tl_.x.date.toISOString()}/${this.br_.x.date.toISOString()}/${this.br_.y.hz}/${this.tl_.y.hz}`);
    }
}
class SpecImgsLayers {
    constructor(cvs, spec) {
        this.layers = [];
        this.threshold = 10;
        this.ptr = 0;
        this.spec = spec;
        this.zoommed = { x: spec.zoommed.x, y: spec.zoommed.y };
        this.cvs = cvs;
        this.layers.push(new SpecImgs(cvs, spec));
    }
    drawOnCanvas() {
        this.update();
        this.layers[this.ptr].drawOnCanvas();
    }
    update() {
        if (this.spec.zoommed.x < this.zoommed.x - this.threshold) {
            // console.log(this.ptr, this.layers.length);
            this.ptr--;
            if (this.ptr < 0) {
                this.layers.unshift(new SpecImgs(this.cvs, this.spec));
                this.ptr = 0;
            }
            this.zoommed.x = this.spec.zoommed.x;
        }
        else if (this.spec.zoommed.x > this.zoommed.x + this.threshold) {
            this.ptr++;
            if (this.ptr == this.layers.length) {
                this.layers.push(new SpecImgs(this.cvs, this.spec));
            }
            this.zoommed.x = this.spec.zoommed.x;
        }
    }
}
class SpecImgs {
    constructor(cvs, spec) {
        this.imgs = [];
        this.spec = spec;
        this.ts = spec.box.l.midPoint(spec.box.r, "date");
        this.te = this.ts;
        this.pxs = (spec.ratio("x", "px", "s"));
        this.cvs = cvs;
    }
    load() {
        let file_id = 1;
        let margin_rx = 0;
        let margin_x = (r = margin_rx) => new xUnit(this.spec.box.dur * r * 1000, "date");
        let addmx = (bound, m = margin_x()) => bound.add(m, "date");
        let submx = (bound, m = margin_x()) => bound.sub(m, "date");
        let ts = submx(this.spec.box.l);
        let te = addmx(this.spec.box.r);
        if (ts.date < this.ts.date || te.date > this.te.date) {
            let resolver = (result) => {
                let img = new SpecImg(this.cvs, result.tbuffer, result.fbuffer, result.blob);
                this.imgs.push(img);
            };
            if (ts.date < this.ts.date) {
                ts = submx(ts, margin_x(.5));
                let te_ = (te.date < this.ts.date) ? te : this.ts;
                SpecImg.requestSpecBlob(file_id, ts, te_, this.pxs, this.spec.box.b, this.spec.box.t).then(resolver);
                this.ts = ts;
                this.te = (te == te_) ? te : this.te;
            }
            if (te.date > this.te.date) {
                te = addmx(te, margin_x(.5));
                let ts_ = (ts.date > this.te.date) ? ts : this.te;
                SpecImg.requestSpecBlob(file_id, ts_, te, this.pxs, this.spec.box.b, this.spec.box.t).then(resolver);
                this.te = te;
                this.ts = (ts == ts_) ? ts : this.ts;
            }
        }
    }
    drawOnCanvas() {
        this.load();
        this.imgs.map((img, i) => {
            img.drawOnCanvas();
        });
    }
}
class SpecImg extends DrawableBox {
    constructor(cvs, tbuffer, fbuffer, blob) {
        let tarr = new BigUint64Array(tbuffer);
        let farr = new Float64Array(fbuffer);
        super(cvs, tfCoord(new DateTime(Number(tarr[0])), farr[0]), tfCoord(new DateTime(Number(tarr[1])), farr[1]));
        this.loaded = false;
        this.cvs = cvs;
        this.img = new Image();
        this.img.src = URL.createObjectURL(blob.slice(32));
        this.img.onload = (_) => this.cvs.drawCanvas();
        // img.style = "-webkit-filter: blur(500px);  filter: blur(500px);";
    }
    static requestSpecBlob(file_id, ts, te, pxs, fs, fe) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = new URL(`../../../../spec/${file_id}/${ts.date.toISOString()}/${te.date.toISOString()}/${fs.hz}/${fe.hz}/?pxs=${pxs}&con=${spec_options.contr}&sens=${spec_options.sens}&ch=${spec_options.channel}&nfft=${spec_options.nfft}&wfft=${spec_options.wfft}`, document.baseURI);
            let data = yield fetch(url.href, {
                method: "GET",
            });
            let blob = yield data.blob();
            let tb = yield blob.slice(0, 16).arrayBuffer();
            let fb = yield blob.slice(16, 32).arrayBuffer();
            return { tbuffer: tb, fbuffer: fb, blob: blob };
        });
    }
    drawOnCanvas() {
        this.cvs.ctx.drawImage(this.img, this.l.px, this.t.px, this.w, this.h);
    }
}
