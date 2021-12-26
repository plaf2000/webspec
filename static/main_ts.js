import { Canvas } from "./classes/Canvas.js";
let cvs = document.getElementById("spec");
if (cvs) {
    let canvas = new Canvas(cvs);
    cvs.addEventListener("mousemove", (e) => canvas.onMouseMove(e));
    cvs.addEventListener("mousedown", (e) => canvas.onMouseDown(e));
    cvs.addEventListener("mouseup", (e) => canvas.onMouseUp(e));
    canvas.drawCanvas();
}
