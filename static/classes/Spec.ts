import { Box, DrawableBox, DrawablePXBox } from "./Box.js";
import { pxCoord, PXCoord, TFCoord, tfCoord, xyGenCoord } from "./Coord.js";
import { Detection, Detections } from "./Detection.js";
import {
  AxT,
  castx,
  DateTime,
  Unit,
  Units,
  xGenUnit,
  xUnit,
  yGenUnit,
  yUnit,
} from "./Units.js";
import { urls, spec_options, spec_start_coord } from "../main.js";
import { Canvas } from "./Canvas.js";

export class Spec {
  time_offset: number;
  private tl_: Units;
  private br_: Units;
  cvs: Canvas;
  start_move_coord: xyGenCoord | undefined;
  spec_imgs_layers: SpecImgsLayers;
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
  >(ax: A, u: U, v: V): number {
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
    this.spec_imgs_layers = new SpecImgsLayers(this.cvs, this);
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
    v: number,
    f: F,
    t: T,
    a: A
  ): number {
    let res: number =
      (+v - +this.tl_[a][f]) * this.ratio(a, t, f) + +this.tl_[a][t];    
    return res;
  }

  drawOnCanvas() {
    this.spec_imgs_layers.drawOnCanvas();
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



class SpecImgsLayers {
  layers: SpecImgs[] = [];
  spec: Spec;
  cvs: Canvas;
  zoommed: { x: number; y: number };
  threshold = 10;

  ptr = 0;

  constructor(cvs: Canvas, spec: Spec) {
    this.spec = spec;
    this.zoommed = { x: spec.zoommed.x, y: spec.zoommed.y};
    this.cvs = cvs;
    this.layers.push(new SpecImgs(cvs, spec));
  }

  drawOnCanvas() {
    this.update();
    this.layers[this.ptr].drawOnCanvas();
  }

  update() {
    if (this.spec.zoommed.x < this.zoommed.x - this.threshold) {
      this.ptr--;
      if(this.ptr<0) {
        this.layers.unshift(new SpecImgs(this.cvs, this.spec));
        this.ptr = 0;
      }
      this.zoommed.x = this.spec.zoommed.x;
    } else if (this.spec.zoommed.x > this.zoommed.x + this.threshold) {
      this.ptr++;
      if(this.ptr==this.layers.length) {
        this.layers.push(new SpecImgs(this.cvs, this.spec));
      }
      this.zoommed.x = this.spec.zoommed.x;
    }
  }
}

type ReqSpecRes = { tbuffer: ArrayBuffer; fbuffer: ArrayBuffer; blob: Blob };
type ReqSpecBlob = Promise<ReqSpecRes>;

type FileObj = {
  id: number,
  path: string,
  tstart: string,
  tend: string,
  length: number,
  sample_rate: number,
  stereo: number,
  device_id: number
}

type ReqFilesRes = FileObj[]

class SpecImgs {
  spec: Spec;
  imgs: SpecImg[] = [];
  ts: xGenUnit;
  te: xGenUnit;
  cvs: Canvas;
  pxs: number;

  constructor(cvs: Canvas, spec: Spec) {
    this.spec = spec;
    this.ts = castx(spec.box.l.midPoint(spec.box.r, "date"));
    this.te = this.ts;
    this.pxs = (spec.ratio("x","px","s"))
    this.cvs = cvs;
  }

  static async getFiles(ts: xGenUnit, te: xGenUnit): Promise<Response> {
    return await fetch(urls.getRel(`files/${ts.date.toISOString()}/${te.date.toISOString()}/`).href)
  }

  loadFromFiles(ts: xGenUnit, te: xGenUnit) {
    let resolver = (result: ReqSpecRes) => {
      let img = new SpecImg(
        this.cvs,
        result.tbuffer,
        result.fbuffer,
        result.blob
      );
      this.imgs.push(img);
    };

    SpecImgs.getFiles(ts,te).then(
      (result: Response) => {
        result.json().then(
          (files: ReqFilesRes) => {
            files.map((f) => {
              const fts = new DateTime(f.tstart);
              const fte = new DateTime(f.tend);
              if(!(fts > te.date || fte < ts.date))
              SpecImg.requestSpecBlob(
                  f.id,
                  ts,
                  te,
                  this.pxs,
                  this.spec.box.b,
                  this.spec.box.t
                ).then(resolver)
              }
            )
          }
        )
      }
    )
  }

  load() {
    let margin_rx = 0;
    let margin_x = (r = margin_rx) =>
      new xUnit(this.spec.box.dur * r * 1000, "date");

    let addmx = (bound: xGenUnit, m = margin_x()) => bound.add(m, "date");
    let submx = (bound: xGenUnit, m = margin_x()) => bound.sub(m, "date");

    let ts = castx(submx(this.spec.box.l));
    let te = castx(addmx(this.spec.box.r));

    // console.log(ts.date)

    if (ts.date < this.ts.date || te.date > this.te.date) {

      if (ts.date < this.ts.date) {
        ts = castx(submx(ts, margin_x(.5)));
        let te_ = (te.date < this.ts.date) ? te : this.ts;

        this.loadFromFiles(ts,te_);        
        
        this.ts = ts;
        this.te = (te==te_) ? te : this.te
      }


      if (te.date > this.te.date) {
        te = castx(addmx(te, margin_x(.5)));
        let ts_ = (ts.date > this.te.date) ? ts : this.te;

        this.loadFromFiles(ts_,te);        

        this.te = te;
        this.ts = (ts==ts_) ? ts : this.ts;
      }
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
    pxs: number,
    fs: yGenUnit,
    fe: yGenUnit
  ): ReqSpecBlob {
    let url = urls.getRel(
      `spec/${file_id}/${ts.date.toISOString()}/${te.date.toISOString()}/${
        fs.hz
      }/${fe.hz}/?pxs=${pxs}&con=${spec_options.contr}&sens=${
        spec_options.sens
      }&ch=${spec_options.channel}&nfft=${spec_options.nfft}&wfft=${
        spec_options.wfft
      }`
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
