import { xAx } from "./Ax.js";
import { Box } from "./Box.js";
import { pxCoord, PXCoord, tfCoord, TFCoord, xy, xyCoord } from "./Coord.js";
import { Detection } from "./Detection.js";
import { Spec } from "./Spec.js";
import { DateTime, Unit, xUnit, yUnit } from "./Units.js";

function mouseCoord(e: MouseEvent) {
  return pxCoord(e.offsetX, e.offsetY);
}
export class Canvas {
  is_ffox: boolean;
  cvs: HTMLCanvasElement;
  bound_rect: DOMRect;
  ctx: CanvasRenderingContext2D;
  det: Detection;
  spec: Spec;
  private mouse_pos_: PXCoord;
  private mouse_type_: string = "auto";
  md = false;
  private xax: xAx<"date">;
  // view : View;

  setMousePos(e: MouseEvent) {
    this.mouse_pos_ = pxCoord(
      e.clientX - this.bound_rect.x,
      e.clientY - this.bound_rect.y
    );
  }

  set mouse_type(type: string) {
    this.cvs.style.cursor = type;
    this.mouse_type_ = type;
  }

  get mouse_type(): string {
    return this.mouse_type_;
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

  constructor(cvs: HTMLCanvasElement, w: number, h: number, iffx: boolean) {
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


    this.xax = new xAx(
      this.ctx,
      this.spec.box.bl,
      pxCoord(grid.x[2], grid.y[3]),
      "date"
    );
    this.bound_rect = this.cvs.getBoundingClientRect();

    this.det = new Detection(
      this.ctx,
      tfCoord(5, 8000, true, true),
      tfCoord(25, 500, true, true),
      new Box(tfCoord(0, 22000), tfCoord(50, 0)),
      {
        x: {
          l: true,
          r: true,
        },
        y: {
          t: true,
          b: true,
        },
      }
    );

    // this.xax = new xAx(this.ctx,this.box.bl)

    this.mouse_pos_ = pxCoord(0, 0);
    this.drawCanvas();
  }

  onMouseDown(e: MouseEvent) {
    this.det.startResize(this.mouse_pos);
    this.det.startMoving(this.mouse_pos);
    this.md = true;
  }

  onMouseMove(e: MouseEvent) {
    this.setMousePos(e);
    if (this.md) {
      if (this.det.resizing) this.det.resize(this.mouse_pos);
      else this.det.move(this.mouse_pos);
      this.drawCanvas();
    } else {
      let res = this.det.checkResize(this.mouse_pos);
      if (res) this.mouse_type = res;
    }
  }

  onMouseUp(e: MouseEvent) {
    this.md = false;
    this.det.stopResize(this.mouse_pos_);
    this.det.stopMoving();
  }

  onWheel(e: WheelEvent) {
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
