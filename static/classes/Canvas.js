import { xAx, yAx } from "./Ax.js";
import { pxCoord } from "./Coord.js";
import { Spec } from "./Spec.js";
import { DateTime } from "./Units.js";
function mouseCoord(e) {
    return pxCoord(e.offsetX, e.offsetY);
}
export class Canvas {
    constructor(cvs, w, h, iffx) {
        this.mouse_type_ = "auto";
        this.md = false;
        this.cvs = cvs;
        this.w = w;
        this.h = h;
        this.is_ffox = iffx;
        let ctx = cvs.getContext("2d");
        if (ctx == null) {
            throw new Error("Context is null!");
        }
        this.ctx = ctx;
        let grid = {
            x: [0, 100, 800, this.cvs.width],
            y: [0, 10, 600, this.cvs.height],
        };
        const tl = {
            x: {
                px: grid.x[1],
                s: 0,
                date: new DateTime(2021, 11, 31, 23, 59, 40),
            },
            y: {
                px: grid.y[1],
                hz: 22000,
            },
        };
        const br = {
            x: {
                px: grid.x[2],
                s: 50,
                date: new DateTime(2022, 0, 1, 0, 0, 25),
            },
            y: {
                px: grid.y[2],
                hz: 0,
            },
        };
        this.spec = new Spec(this.ctx, tl, br);
        this.xax = new xAx(this.ctx, this.spec.box.bl, pxCoord(grid.x[2], grid.y[3]), "date");
        this.yax = new yAx(this.ctx, pxCoord(grid.x[0], grid.y[1]), this.spec.box.bl, "hz");
        this.bound_rect = this.cvs.getBoundingClientRect();
        // this.xax = new xAx(this.ctx,this.box.bl)
        this.mouse_pos_ = pxCoord(0, 0);
        this.drawCanvas();
    }
    // view : View;
    setMousePos(e) {
        this.mouse_pos_ = pxCoord(e.clientX - this.bound_rect.x, e.clientY - this.bound_rect.y);
    }
    set mouse_type(type) {
        this.cvs.style.cursor = type;
        this.mouse_type_ = type;
    }
    get mouse_type() {
        return this.mouse_type_;
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
        this.md = true;
        if (this.spec.box.isHoverPx(this.mouse_pos)) {
            this.spec.onMouseDown(this.mouse_pos);
        }
    }
    onMouseMove(e) {
        this.setMousePos(e);
        this.spec.onMouseMove(this.mouse_pos, this.md);
        this.mouse_type = this.spec.mouse_type;
        this.drawCanvas();
    }
    onMouseUp(e) {
        this.md = false;
        this.spec.onMouseUp(this.mouse_pos_);
    }
    onMouseLeave(e) {
        this.onMouseUp(e);
    }
    onWheel(e) {
        if (this.spec.box.isHover(this.mouse_pos, "px", "px")) {
            this.spec.zoom(this.mouse_pos, Math.sign(e.deltaY), e.shiftKey);
            this.drawCanvas();
        }
    }
    drawCanvas() {
        this.clear();
        this.spec.drawOnCanvas();
        this.xax.drawOnCanvas();
        this.yax.drawOnCanvas();
    }
    clear() {
        this.ctx.clearRect(0, 0, this.w, this.h);
    }
}
