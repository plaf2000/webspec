import { BoundedBox } from "./Box.js";
function inBound(a, x, b) {
    return a <= x && x <= b;
}
export class Detection extends BoundedBox {
    constructor() {
        super(...arguments);
        this.frame_size = 6;
    }
    get resizing() {
        return (this.triggered_x != undefined) || (this.triggered_y != undefined);
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
                mt = "auto";
            else
                mt =
                    (this.triggered_y ? Detection.mouse_type[this.triggered_y] : "") +
                        (this.triggered_x ? Detection.mouse_type[this.triggered_x] : "") +
                        "-resize";
        }
        else {
            this.triggered_x = undefined;
            this.triggered_y = undefined;
            mt = "auto";
        }
        return mt;
    }
    startResize(p) {
        this.checkResize(p);
        this.resize_x = this.triggered_x;
        this.resize_y = this.triggered_y;
    }
    startMoving(p) {
        if (!this.resize_x && !this.resize_y && this.isHover(p, "px", "px")) {
            this.start_move_coord = p;
        }
    }
}
Detection.mouse_type = {
    l: "w",
    r: "e",
    t: "n",
    b: "s",
};
