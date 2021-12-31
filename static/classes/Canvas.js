import { xAx } from "./Ax.js";
import { Box } from "./Box.js";
import { pxCoord, tfCoord } from "./Coord.js";
import { Detection } from "./Detection.js";
import { Spec } from "./Spec.js";
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
                date: new Date(2021, 11, 31, 23, 40),
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
                date: new Date(2022, 0, 1, 0, 25),
            },
            y: {
                px: grid.y[2],
                hz: 0,
            },
        };
        this.spec = new Spec(this.ctx, tl, br, 10800);
        this.xax = new xAx(this.ctx, this.spec.box.bl, pxCoord(grid.x[2], grid.y[3]), "date");
        this.bound_rect = this.cvs.getBoundingClientRect();
        this.det = new Detection(this.ctx, tfCoord(5, 8000, true, true), tfCoord(25, 500, true, true), new Box(tfCoord(0, 22000), tfCoord(50, 0)), {
            x: {
                l: true,
                r: true,
            },
            y: {
                t: true,
                b: true,
            },
        });
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
        this.det.startResize(this.mouse_pos);
        this.det.startMoving(this.mouse_pos);
        this.md = true;
    }
    onMouseMove(e) {
        this.setMousePos(e);
        if (this.md) {
            if (this.det.resizing)
                this.det.resize(this.mouse_pos);
            else
                this.det.move(this.mouse_pos);
            this.drawCanvas();
        }
        else {
            let res = this.det.checkResize(this.mouse_pos);
            if (res)
                this.mouse_type = res;
        }
    }
    onMouseUp(e) {
        this.md = false;
        this.det.stopResize(this.mouse_pos_);
        this.det.stopMoving();
    }
    onWheel(e) {
        if (this.spec.box.isHover(this.mouse_pos, "px", "px")) {
            this.spec.zoom(this.mouse_pos, Math.sign(e.deltaY), e.shiftKey);
            this.drawCanvas();
        }
    }
    drawCanvas() {
        this.clear();
        this.spec.box.drawOnCanvas();
        this.det.drawOnCanvas();
        this.xax.drawOnCanvas();
    }
    clear() {
        this.ctx.clearRect(0, 0, this.w, this.h);
    }
}
