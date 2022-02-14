import { Canvas } from "./classes/Canvas.js";
let cvs = document.getElementById("spec");
let isFirefox = /Firefox/i.test(navigator.userAgent);

export let spec_options = {
  get nfft(): number {
    return parseInt((document.getElementById("nfft") as HTMLSelectElement).value);
  },
  get wfft(): number {
    return parseInt((document.getElementById("wfft") as HTMLSelectElement).value);
  },
  get lf(): number {
    return parseFloat((document.getElementById("lf") as HTMLInputElement).value);
  },
  get hf(): number {
    return parseFloat((document.getElementById("hf") as HTMLInputElement).value);
  },
  get channel(): string {
    return (document.querySelector(".channel:checked") as HTMLInputElement)
      .value;
  },
  get contr(): number {
    return parseInt((document.getElementById("contr") as HTMLInputElement).value);
  },
  get sens(): number {
    return parseInt((document.getElementById("sens") as HTMLInputElement).value);
  },
};

export const spec_start_coord = (window as any).spec_coord;
console.log(spec_start_coord)

if (cvs) {
  let canvas = new Canvas(
    cvs as HTMLCanvasElement,
    window.innerWidth,
    window.innerHeight * 0.8,
    isFirefox
  );
  document.addEventListener("mousemove", (e) => canvas.onMouseMove(e));
  cvs.addEventListener("mousedown", (e) => canvas.onMouseDown(e));
  document.addEventListener("mouseup", (e) => canvas.onMouseUp(e));
  cvs.addEventListener("mouseleave", (e) => canvas.onMouseLeave(e));
  cvs.addEventListener("wheel", (e) => canvas.onWheel(e));
  canvas.drawCanvas();
}
