import { Box, DrawableBox, DrawablePXBox } from "./Box.js";
import { pxCoord, PXCoord, TFCoord, tfCoord, xyGenCoord } from "./Coord.js";
import { Detection, Detections } from "./Detection.js";
import { AxT, DateTime, Unit, Units, xGenUnit, yGenUnit } from "./Units.js";
import { spec_options, spec_start_coord } from "../main.js";
import { Canvas } from "./Canvas.js";

export class Spec {
  time_offset: number;
  private tl_: Units;
  private br_: Units;
  cvs: Canvas;
  start_move_coord: xyGenCoord | undefined;
  spec_imgs: SpecImgs;
  dets: Detections;
  mouse_type: string = "auto";

  zoommed = {
    x: 0,
    y: 0,
  };

  bound: {
    dx?: number;
    y: {
      min: number;
      max: number;
    };
  };

  zoom_r = {
    x: 1.14,
    y: 1.14,
  };

  get tl(): PXCoord {
    return pxCoord(this.tl_.x.px, this.tl_.y.px);
  }

  get br(): PXCoord {
    return pxCoord(this.br_.x.px, this.br_.y.px);
  }

  get box(): DrawablePXBox {
    return new DrawableBox(this.cvs, this.tl, this.br);
  }

  delta<A extends keyof Units, U extends keyof Units[A]>(ax: A, u: U): number {
    return +this.tl_[ax][u] - +this.br_[ax][u];
  }

  ratio<
    A extends keyof Units,
    U extends keyof Units[A],
    V extends keyof Units[A]
  >(ax: A, u: U, v: V) {
    return this.delta(ax, u) / this.delta(ax, v);
  }

  constructor(
    cvs: Canvas,
    tl_px: { x: number; y: number },
    br_px: { x: number; y: number },
    dx_limit?: number
  ) {
    Unit.spec = this;
    this.cvs = cvs;

    let ts = new DateTime(spec_start_coord.tstart);
    let te = new DateTime(spec_start_coord.tend);

    let s = (+te - +ts) / 1000;

    this.tl_ = {
      x: {
        px: tl_px.x,
        s: 0,
        date: ts,
      },
      y: {
        px: tl_px.y,
        hz: spec_start_coord.fend,
      },
    };
    this.br_ = {
      x: {
        px: br_px.x,
        s: s,
        date: te,
      },
      y: {
        px: br_px.y,
        hz: spec_start_coord.fstart,
      },
    };
    this.time_offset = +this.tl_.x.date - +this.tl_.x.s * 1000;
    this.bound = {
      dx: dx_limit,
      y: {
        max: spec_options.hf,
        min: spec_options.lf,
      },
    };
    this.spec_imgs = new SpecImgs(this.cvs, this);
    this.dets = new Detections(this.cvs, this);
  }

  updateDate() {
    let getDate = (val: number) => new DateTime(this.time_offset + val * 1000);
    this.tl_.x.date = getDate(+this.tl_.x.s);
    this.br_.x.date = getDate(+this.br_.x.s);
  }

  zoom(p: xyGenCoord, dir: number, shift: boolean) {
    shift ||= dir < 0 && this.zoommed.x >= 0;

    let rx = Math.pow(this.zoom_r.x, dir);
    let newU = (old: number, v: number, r: number) => v - (v - old) * r;
    let newS = (old: number) => newU(old, +p.x.s, rx);
    if (this.boundX(newS(+this.tl_.x.s), newS(+this.br_.x.s))) {
      this.updateDate();
      this.zoommed.x += dir;
    }

    if (!shift) {
      let ry = Math.pow(this.zoom_r.x, dir);
      let newHz = (old: number) => newU(old, p.y.hz, ry);
      this.boundZoomY(newHz(this.tl_.y.hz), newHz(this.br_.y.hz), dir);
    }

    this.updateURLCoord();
  }

  boundX(tl: number, br: number): boolean {
    if (this.bound.dx && br - tl >= this.bound.dx) return false;
    this.tl_.x.s = tl;
    this.br_.x.s = br;
    return true;
  }

  boundZoomY(t: number, b: number, dir: number) {
    let reset = () => {
      this.br_.y.hz = this.bound.y.min;
      this.tl_.y.hz = this.bound.y.max;
      this.zoommed.y = 0;
    };
    if (t >= this.bound.y.max && b <= this.bound.y.min) {
      reset();
    } else {
      if (t >= this.bound.y.max) {
        b = this.br_.y.hz + this.bound.y.max - t;
        if (b <= this.bound.y.min) {
          reset();
        } else {
          this.tl_.y.hz = this.bound.y.max;
          this.br_.y.hz = b;
          this.zoommed.y += dir;
        }
      } else if (b <= this.bound.y.min) {
        t = this.tl_.y.hz + this.bound.y.min - b;
        if (t >= this.bound.y.max) {
          reset();
        } else {
          this.br_.y.hz = this.bound.y.min;
          this.tl_.y.hz = t;
          this.zoommed.y += dir;
        }
      } else {
        this.tl_.y.hz = t;
        this.br_.y.hz = b;
        this.zoommed.y += dir;
      }
    }
  }

  boundPanX(dx: number) {
    this.tl_.x.s = +this.tl_.x.s - dx;
    this.br_.x.s = +this.br_.x.s - dx;
  }

  boundPanY(dy: number) {
    if (+this.tl_.y.hz - dy > this.bound.y.max) {
      dy = this.tl_.y.hz - this.bound.y.max;
    } else if (+this.br_.y.hz - dy < this.bound.y.min) {
      dy = this.br_.y.hz - this.bound.y.min;
    }
    this.tl_.y.hz -= dy;
    this.br_.y.hz -= dy;
  }

  conv<A extends AxT, F extends keyof Units[A], T extends keyof Units[A]>(
    v: Units[A][F] | number,
    f: F,
    t: T,
    a: A
  ): any {
    let res: number =
      (+v - +this.tl_[a][f]) * this.ratio(a, t, f) + +this.tl_[a][t];
    if (t == "date") return new Date(res);
    return res;
  }

  drawOnCanvas() {
    this.spec_imgs.drawOnCanvas();
    this.dets.drawOnCanvas();
    this.box.clearOutside();
    this.box.drawOnCanvas();
  }
  move(p: xyGenCoord) {
    if (this.start_move_coord) {
      let dx = +p.x.s - +this.start_move_coord.x.s;
      let dy = p.y.hz - this.start_move_coord.y.hz;

      this.boundPanX(dx);
      this.boundPanY(dy);
      this.updateDate();
      this.start_move_coord = p;
    }
  }

  startMoving(p: xyGenCoord) {
    this.start_move_coord = p;
  }

  stopMoving(): void {
    this.start_move_coord = undefined;
    this.updateURLCoord();
  }

  onMouseDown(p: xyGenCoord) {
    if (this.dets.triggered) {
      this.dets.onMouseDown(p);
      this.mouse_type = this.dets.mouse_type;
    } else {
      this.startMoving(p);
    }
  }

  onMouseUp(p: xyGenCoord) {
    this.dets.onMouseUp(p);
    this.stopMoving();
    this.mouse_type = this.dets.mouse_type;
  }

  onMouseMove(p: xyGenCoord, md: boolean) {
    if (md)
      if (!this.start_move_coord) {
        this.dets.onMouseMove(p, md);
        this.mouse_type = this.dets.mouse_type;
      } else {
        this.move(p);
        this.mouse_type = "grabbing";
      }
    else {
      this.dets.onMouseMove(p, md);
      this.mouse_type = this.dets.mouse_type;
    }
  }

  updateURLCoord() {
    window.history.replaceState(
      null,
      "",
      `../../../${this.tl_.x.date.toISOString()}/${this.br_.x.date.toISOString()}/${
        this.br_.y.hz
      }/${this.tl_.y.hz}`
    );
  }
}

class SpecImgs {
  spec: Spec;
  imgs: SpecImg[] = [];
  cvs: Canvas;

  status = 0;

  constructor(cvs: Canvas, spec: Spec) {
    this.spec = spec;
    this.cvs = cvs;
  }

  load() {
    // this.imgs.push(new SpecImg(this.spec.box.l, this.spec.box.r, this.spec.box.b, this.spec.box.t));
    let file_id = 1;

    if (this.status == 0) {
      console.log("Load request", this.status);
      SpecImg.requestSpecBlob(
        file_id,
        this.spec.box.l,
        this.spec.box.r,
        this.spec.box.b,
        this.spec.box.t
      ).then((result) => {
        let img = new SpecImg(
          this.cvs,
          result.tbuffer,
          result.fbuffer,
          result.blob
        );
        this.imgs = [img];
      });
      this.status++;
    }
  }

  drawOnCanvas() {
    this.load();
    this.imgs.map((img, i) => {
      img.drawOnCanvas();
    });
  }
}

class SpecImg extends DrawableBox<"hz", "date" | "s", "hz", "date" | "s"> {
  img: HTMLImageElement;
  cvs: Canvas;
  loaded = false;

  constructor(
    cvs: Canvas,
    tbuffer: ArrayBuffer,
    fbuffer: ArrayBuffer,
    blob: Blob
  ) {
    let tarr = new BigUint64Array(tbuffer);
    let farr = new Float64Array(fbuffer);
    super(
      cvs,
      tfCoord(new DateTime(Number(tarr[0])), farr[0]),
      tfCoord(new DateTime(Number(tarr[1])), farr[1])
    );

    this.cvs = cvs;
    this.img = new Image();
    this.img.src = URL.createObjectURL(blob.slice(32));
    this.img.onload = (_) => this.cvs.drawCanvas();
    // img.style = "-webkit-filter: blur(500px);  filter: blur(500px);";
  }

  static async requestSpecBlob(
    file_id: number,
    ts: xGenUnit,
    te: xGenUnit,
    fs: yGenUnit,
    fe: yGenUnit
  ): Promise<{ tbuffer: ArrayBuffer; fbuffer: ArrayBuffer; blob: Blob }> {
    let url = new URL(
      `../../../../spec/${file_id}/${ts.date.toISOString()}/${te.date.toISOString()}/${
        fs.hz
      }/${fe.hz}/?con=${spec_options.contr}&sens=${spec_options.sens}&ch=${
        spec_options.channel
      }&nfft=${spec_options.nfft}&wfft=${spec_options.wfft}`,
      document.baseURI
    );

    let data = await fetch(url.href, {
      method: "GET",
    });

    let blob = await data.blob();

    let tb = await blob.slice(0, 16).arrayBuffer();
    let fb = await blob.slice(16, 32).arrayBuffer();

    return { tbuffer: tb, fbuffer: fb, blob: blob };
  }

  drawOnCanvas(): void {
    this.cvs.ctx.drawImage(this.img, this.l.px, this.t.px, this.w, this.h);
  }
}
