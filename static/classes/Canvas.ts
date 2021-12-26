import { Box } from "./Box.js";
import { PXCoord, TFCoord, xy, xyCoord } from "./Coord.js";
import { Detection } from "./Detection.js";
import { Conv, xUnit, yUnit } from "./Units.js";
import { View } from "./View";

function mouseCoord(e: MouseEvent) {
    return xy(e.offsetX, e.offsetY,"px","px");
}
export class Canvas {
  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  det: Detection;
  private mouse_pos_: PXCoord;
  md = false;
  // view : View;

  setMousePos(e: MouseEvent) {
    this.mouse_pos_ = xy(e.offsetX, e.offsetY,"px","px")
  }

  get mouse_pos(): PXCoord {
      return this.mouse_pos_;
  }

  constructor(cvs: HTMLCanvasElement) {
    this.cvs = cvs;
    let ctx = cvs.getContext("2d");
    if (ctx == null) {
      throw new Error("Context is null!");
    }
    this.ctx = ctx;

    this.det = new Detection(
      this.ctx,
      xy(Conv.conv(0,"px","s","x"),Conv.conv(0,"px","hz","y"), "s", "hz"),
      xy(Conv.conv(100,"px","s","x"),Conv.conv(100,"px","hz","y"), "s", "hz")
    );
    console.log((this.det as Box<TFCoord,TFCoord>).tl);

    this.mouse_pos_ = xy(0,0,"px","px");
    this.drawCanvas();
  }

  onMouseDown(e: MouseEvent) {
      this.det.startResize(this.mouse_pos);
      this.md = true;
  }

  onMouseMove(e: MouseEvent) {
      this.setMousePos(e);
      if(this.md) {
        this.det.resize(this.mouse_pos);
      }
      else {
          this.det.checkResize(this.mouse_pos);
      }
    
  }

  onMouseUp(e: MouseEvent) {
      this.md = false;
      this.det.stopResize(this.mouse_pos_);
  }

  drawCanvas() {
    this.det.drawOnCanvas();
  }


  
}
