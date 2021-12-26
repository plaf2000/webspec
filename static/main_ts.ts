import { Canvas } from "./classes/Canvas.js";
let cvs = document.getElementById("spec");
if(cvs) {
  let canvas = new Canvas(cvs as HTMLCanvasElement, window.innerWidth, window.innerHeight*4/5);
  cvs.addEventListener("mousemove",(e) => canvas.onMouseMove(e));
  cvs.addEventListener("mousedown",(e) => canvas.onMouseDown(e));
  cvs.addEventListener("mouseup",(e) => canvas.onMouseUp(e));
  canvas.drawCanvas();
}


