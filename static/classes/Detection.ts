import { Edges, EditableBox, Box, DrawableBox, BoundedBox } from "./Box.js";
import { pxCoord, PXCoord, TFCoord, xyGenCoord } from "./Coord.js";
import { xUnit, yUnit } from "./Units";

function inBound(a: number, x: number, b: number): boolean {
  return a <= x && x <= b;
}
export class Detection extends BoundedBox<"hz","s" | "date","hz","s"|"date"> {
  private frame_size = 6;

  protected triggered_x: Edges["x"] | undefined;
  protected triggered_y: Edges["y"] | undefined;

  get resizing(): boolean {
    return (this.triggered_x!=undefined) || (this.triggered_y!=undefined);
  }

  static mouse_type = {
    l: "w",
    r: "e",
    t: "n",
    b: "s",
  };

  checkResize(p: PXCoord): string | undefined {
    let mt: string | undefined;
    if (this.isHoverPx(p)) {
      if (inBound(this.l.px, p.x.px, this.l.px + this.frame_size)) {
        this.triggered_x = "l";
      } else if (inBound(this.r.px - this.frame_size, p.x.px, this.r.px)) {
        this.triggered_x = "r";
      } else {
        this.triggered_x = undefined;
      }

      if (inBound(this.t.px, p.y.px, this.t.px + this.frame_size)) {
        this.triggered_y = "t";
      } else if (inBound(this.b.px - this.frame_size, p.y.px, this.b.px)) {
        this.triggered_y = "b";
      } else {
        this.triggered_y = undefined;
      }
      if (!this.triggered_x && !this.triggered_y) mt = "auto";
      else
        mt =
          (this.triggered_y ? Detection.mouse_type[this.triggered_y] : "") +
          (this.triggered_x ? Detection.mouse_type[this.triggered_x] : "") +
          "-resize";
    } else {
      this.triggered_x = undefined;
      this.triggered_y = undefined;
      mt = "auto";
    }
    return mt;
  }

  startResize(p: PXCoord): void {
    this.checkResize(p);
    this.resize_x = this.triggered_x;
    this.resize_y = this.triggered_y;
  }

  startMoving(p: xyGenCoord) {
    if (!this.resize_x && !this.resize_y && this.isHover(p, "px", "px")) {
      this.start_move_coord = p;
    }
  }
}
