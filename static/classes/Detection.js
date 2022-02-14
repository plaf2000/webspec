import { Box, BoundedBox } from "./Box.js";
import { tfCoord } from "./Coord.js";
import { DateTime } from "./Units.js";
function inBound(a, x, b) {
    return a <= x && x <= b;
}
export class Detections {
    constructor(ctx, spec) {
        this.dets = [];
        this.mouse_type = "auto";
        this.resizing = false;
        this.spec = spec;
        this.loaded = {
            s: spec.box.l,
            e: spec.box.r,
        };
        this.ctx = ctx;
        this.dets.push(new Detection(this.ctx, tfCoord(new DateTime(2020, 10, 12, 6, 55, 0), 8000, true, true), tfCoord(new DateTime(2020, 10, 12, 6, 56, 0), 500, true, true), new Box(tfCoord(0, 22000), tfCoord(50, 0)), {
            x: {
                l: true,
                r: true,
            },
            y: {
                t: true,
                b: true,
            },
        }));
        this.drawOnCanvas();
    }
    load() {
        if (this.loaded.s.s > this.spec.box.l.s) {
        }
        if (this.loaded.e.s < this.spec.box.r.s) {
        }
    }
    drawOnCanvas() {
        this.load();
        this.dets.map((det, i) => {
            det.drawOnCanvas();
        });
    }
    onMouseMove(p, md) {
        if (!md)
            this.isHover(p);
        if (this.triggered) {
            this.triggered.onMouseMove(p, md);
            this.mouse_type = this.triggered.mouse_type;
        }
        else {
            this.mouse_type = "auto";
        }
    }
    onMouseDown(p) {
        if (this.triggered) {
            this.triggered.onMouseDown(p);
        }
    }
    onMouseUp(p) {
        if (this.triggered) {
            this.triggered.onMouseUp(p);
            this.triggered = undefined;
        }
        this.onMouseMove(p, false);
    }
    isHover(p) {
        let ih = false;
        this.dets.map((det, i) => {
            if (det.isHoverPx(p)) {
                this.triggered = det;
                ih = true;
            }
        });
        if (!ih)
            this.triggered = undefined;
        return ih;
    }
}
export class Detection extends BoundedBox {
    constructor() {
        super(...arguments);
        this.frame_size = 6;
        this.mouse_type = "auto";
    }
    get resizing() {
        return this.triggered_x != undefined || this.triggered_y != undefined;
    }
    checkResize(p) {
        let mt;
        if (this.isHoverPx(p)) {
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
            if (!this.triggered_x && !this.triggered_y)
                mt = "grab";
            else
                mt =
                    (this.triggered_y
                        ? Detection.mouse_transl_type[this.triggered_y]
                        : "") +
                        (this.triggered_x
                            ? Detection.mouse_transl_type[this.triggered_x]
                            : "") +
                        "-resize";
        }
        else {
            this.triggered_x = undefined;
            this.triggered_y = undefined;
            mt = "auto";
        }
        this.mouse_type = mt;
    }
    startResize(p) {
        this.resize_x = this.triggered_x;
        this.resize_y = this.triggered_y;
    }
    startMoving(p) {
        if (!this.resize_x && !this.resize_y && this.isHover(p, "px", "px")) {
            this.start_move_coord = p;
        }
    }
    onMouseMove(p, md) {
        if (md) {
            if (this.resizing)
                this.resize(p);
            else if (this.start_move_coord) {
                this.move(p);
            }
        }
        else {
            this.checkResize(p);
        }
    }
    onMouseDown(p) {
        if (this.isHoverPx(p)) {
            this.startResize(p);
            this.startMoving(p);
            if (!this.resizing)
                this.mouse_type = "grabbing";
        }
    }
    onMouseUp(p) {
        this.stopResize(p);
        this.stopMoving();
        this.onMouseMove(p, false);
    }
}
Detection.mouse_transl_type = {
    l: "w",
    r: "e",
    t: "n",
    b: "s",
};
