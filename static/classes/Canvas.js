import { xy } from "./Coord.js";
import { Detection } from "./Detection.js";
import { Conv } from "./Units.js";
function mouseCoord(e) {
    return xy(e.offsetX, e.offsetY, "px", "px");
}
export class Canvas {
    constructor(cvs) {
        this.md = false;
        this.cvs = cvs;
        let ctx = cvs.getContext("2d");
        if (ctx == null) {
            throw new Error("Context is null!");
        }
        this.ctx = ctx;
        this.det = new Detection(this.ctx, xy(Conv.conv(0, "px", "s", "x"), Conv.conv(0, "px", "hz", "y"), "s", "hz"), xy(Conv.conv(100, "px", "s", "x"), Conv.conv(100, "px", "hz", "y"), "s", "hz"));
        console.log(this.det.tl);
        this.mouse_pos_ = xy(0, 0, "px", "px");
        this.drawCanvas();
    }
    // view : View;
    setMousePos(e) {
        this.mouse_pos_ = xy(e.offsetX, e.offsetY, "px", "px");
    }
    get mouse_pos() {
        return this.mouse_pos_;
    }
    onMouseDown(e) {
        this.det.startResize(this.mouse_pos);
        this.md = true;
    }
    onMouseMove(e) {
        this.setMousePos(e);
        if (this.md) {
            this.det.resize(this.mouse_pos);
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
        this.det.drawOnCanvas();
    }
}
