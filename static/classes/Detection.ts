import { Edges, EditableBox, Box, DrawableBox } from "./Box.js";
import { pxCoord, PXCoord, TFCoord, xyGenCoord } from "./Coord.js";
import { xUnit, yUnit } from "./Units";

function inBound(a: number, x: number, b: number): boolean {
  return a <= x && x <= b;
}
export class Detection extends EditableBox<TFCoord, TFCoord> {
  private frame_size = 6;

  protected triggered_x: keyof Edges["x"] | undefined;
  protected triggered_y: keyof Edges["y"] | undefined;

  get tl(): xyGenCoord {
    return super.tl;
  }

  get br(): xyGenCoord {
    return super.br;
  }

  get tr(): xyGenCoord {
    return super.tr;
  }

  get bl(): xyGenCoord {
    return super.bl;
  }

  get l() {
    return super.l;
  }

  get r() {
    return super.r;
  }

  get t() {
    return super.t;
  }

  get b() {
    return super.b;
  }

  get xl(): number {
    return super.xl;
  }

  get yt(): number {
    return super.yt;
  }

  get w(): number {
    return super.w;
  }

  get h(): number {
    return super.h;
  }

  get dur(): number {
    return super.dur;
  }

  get dfreq(): number {
    return super.dfreq;
  }
  get resizing_x(): boolean {
    return super.resizing_x;
  }

  get resizing_y(): boolean {
    return super.resizing_y;
  }

  set tl(tl: xyGenCoord) {
    super.tl = tl;
  }

  set br(br: xyGenCoord) {
    super.br = br;
  }

  set tr(tr: xyGenCoord) {
    super.bl = tr;
  }

  set bl(bl: xyGenCoord) {
    super.bl = bl;
  }

  set l(x: Edges["x"]["l"]) {
    super.l = x;
  }

  set r(x: Edges["x"]["r"]) {
    super.r = x;
  }

  set t(y: Edges["y"]["t"]) {
    super.t = y;
  }

  set b(y: Edges["y"]["b"]) {
    super.b = y;
  }

  checkResize(p: PXCoord) {
    if (this.isHover(p, "px", "px")) {
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
    }
  }

  startResize(p: PXCoord): void {
    this.checkResize(p);
    this.resize_x = this.triggered_x;
    this.resize_y = this.triggered_y;
  }
}
