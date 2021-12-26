import { Box } from "./Box.js";
import { pxCoord, PXCoord, tfCoord, TFCoord, xy, xyCoord } from "./Coord.js";
import { Detection } from "./Detection.js";
import { Conv, xUnit, yUnit } from "./Units.js";
import { View } from "./View";

function mouseCoord(e: MouseEvent) {
  return xy(e.offsetX, e.offsetY, "px", "px");
}
export class Canvas {
  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  det: Detection;
  private mouse_pos_: PXCoord;
  md = false;
  // view : View;

  setMousePos(e: MouseEvent) {
    this.mouse_pos_ = xy(e.offsetX, e.offsetY, "px", "px");
  }

  get mouse_pos(): PXCoord {
    return this.mouse_pos_;
  }

  get w(): number {
      return this.cvs.width;
  }

  get h(): number {
      return this.cvs.height;
  }

  set w(width: number) {
      this.cvs.width = width;
  }

  set h(height: number) {
    this.cvs.height = height;
}


  constructor(cvs: HTMLCanvasElement, w: number, h: number) {
    this.cvs = cvs;
    this.w = w;
    this.h = h;
    let ctx = cvs.getContext("2d");
    if (ctx == null) {
      throw new Error("Context is null!");
    }
    this.ctx = ctx;
    ctx.resetTransform();

    this.det = new Detection(
      this.ctx,
      tfCoord(Conv.conv(100, "px", "s", "x"), Conv.conv(100, "px", "hz", "y"),true, true),
      tfCoord(Conv.conv(200, "px", "s", "x"), Conv.conv(200, "px", "hz", "y"),true, true)
    );

    this.mouse_pos_ = pxCoord(0, 0);
    this.drawCanvas();
  }

  onMouseDown(e: MouseEvent) {
    this.det.startResize(this.mouse_pos);
    this.md = true;
  }

  onMouseMove(e: MouseEvent) {
    this.setMousePos(e);
    if (this.md) {
      this.det.resize(this.mouse_pos);
      this.drawCanvas();
    } else {
      this.det.checkResize(this.mouse_pos);
    }
  }

  onMouseUp(e: MouseEvent) {
    this.md = false;
    this.det.stopResize(this.mouse_pos_);
  }

  drawCanvas() {
      this.clear();
    this.det.drawOnCanvas();
  }

  clear() {
    this.ctx.clearRect(0,0,this.w,this.h);
  }
}
