import { Edges, EditableBox } from "./Box.js"
import { pxCoord, PXCoord, TFCoord } from "./Coord.js";
import { xUnit, yUnit } from "./Units";

function inBound(a: number, x: number, b: number): boolean {
  return (a<=x && x<=b);
}
export class Detection extends EditableBox<TFCoord,TFCoord> {
  private frame_size = 6;

  protected triggered_x: keyof Edges["x"] | undefined;
  protected triggered_y: keyof Edges["y"] | undefined;

  checkResize(p: PXCoord) {
    if(this.isHover(p, "px", "px")) {
      if(inBound(this.l.px,p.x.px,this.l.px+this.frame_size)) {
        this.triggered_x = "l";
      }
      else if (inBound(this.r.px-this.frame_size,p.x.px,this.r.px)) {
        this.triggered_x = "r";
      }
      else {
        this.triggered_x = undefined;
      }

      if(inBound(this.t.px,p.y.px,this.t.px+this.frame_size)) {
        this.triggered_y = "t";
      }
      else if (inBound(this.b.px-this.frame_size,p.y.px,this.b.px)) {
        this.triggered_y = "b";
      }
      else {
        this.triggered_x = undefined;
      }
    }
  }

  startResize(p: PXCoord) : void {
    this.checkResize(p);
    this.resize_x = this.triggered_x;
    this.resize_y = this.triggered_y;
  }
}