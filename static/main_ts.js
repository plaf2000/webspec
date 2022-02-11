import { Canvas } from "./classes/Canvas.js";
let cvs = document.getElementById("spec");
let isFirefox = (/Firefox/i.test(navigator.userAgent));
if (cvs) {
    let canvas = new Canvas(cvs, window.innerWidth, window.innerHeight * 4 / 5, isFirefox);
    document.addEventListener("mousemove", (e) => canvas.onMouseMove(e));
    cvs.addEventListener("mousedown", (e) => canvas.onMouseDown(e));
    document.addEventListener("mouseup", (e) => canvas.onMouseUp(e));
    cvs.addEventListener("mouseleave", (e) => canvas.onMouseLeave(e));
    cvs.addEventListener("wheel", (e) => canvas.onWheel(e));
    canvas.drawCanvas();
}
