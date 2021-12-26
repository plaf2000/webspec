import { pxCoord, tfCoord, xy } from "./Coord.js";
import { Detection } from "./Detection.js";
import { Conv } from "./Units.js";
function mouseCoord(e) {
    return xy(e.offsetX, e.offsetY, "px", "px");
}
export class Canvas {
    constructor(cvs, w, h) {
        this.md = false;
        this.cvs = cvs;
        this.w = w;
        this.h = h;
        let ctx = cvs.getContext("2d");
        if (ctx == null) {
            throw new Error("Context is null!");
        }
        this.ctx = ctx;
        ctx.resetTransform();
        this.det = new Detection(this.ctx, tfCoord(Conv.conv(100, "px", "s", "x"), Conv.conv(100, "px", "hz", "y"), true, true), tfCoord(Conv.conv(200, "px", "s", "x"), Conv.conv(200, "px", "hz", "y"), true, true));
        this.mouse_pos_ = pxCoord(0, 0);
        this.drawCanvas();
    }
    // view : View;
    setMousePos(e) {
        this.mouse_pos_ = xy(e.offsetX, e.offsetY, "px", "px");
    }
    get mouse_pos() {
        return this.mouse_pos_;
    }
    get w() {
        return this.cvs.width;
    }
    get h() {
        return this.cvs.height;
    }
    set w(width) {
        this.cvs.width = width;
    }
    set h(height) {
        this.cvs.height = height;
    }
    onMouseDown(e) {
        this.det.startResize(this.mouse_pos);
        this.md = true;
    }
    onMouseMove(e) {
        this.setMousePos(e);
        if (this.md) {
            this.det.resize(this.mouse_pos);
            this.drawCanvas();
        }
        else {
            this.det.checkResize(this.mouse_pos);
        }
    }
    onMouseUp(e) {
        this.md = false;
        this.det.stopResize(this.mouse_pos_);
    }
    drawCanvas() {
        this.clear();
        this.det.drawOnCanvas();
    }
    clear() {
        this.ctx.clearRect(0, 0, this.w, this.h);
    }
}
