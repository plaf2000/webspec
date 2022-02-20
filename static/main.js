import { Canvas } from "./classes/Canvas.js";
let cvs = document.getElementById("spec");
let isFirefox = /Firefox/i.test(navigator.userAgent);
export let spec_options = {
    get nfft() {
        return parseInt(document.getElementById("nfft").value);
    },
    get wfft() {
        return parseInt(document.getElementById("wfft").value);
    },
    get lf() {
        return parseFloat(document.getElementById("lf").value);
    },
    get hf() {
        return parseFloat(document.getElementById("hf").value);
    },
    get channel() {
        return document.querySelector(".channel:checked")
            .value;
    },
    get contr() {
        return parseInt(document.getElementById("contr").value);
    },
    get sens() {
        return parseInt(document.getElementById("sens").value);
    },
};
export const spec_start_coord = window.spec_coord;
if (cvs) {
    let canvas = new Canvas(cvs, window.innerWidth, window.innerHeight * 0.8, isFirefox);
    document.addEventListener("mousemove", (e) => canvas.onMouseMove(e));
    cvs.addEventListener("mousedown", (e) => canvas.onMouseDown(e));
    document.addEventListener("mouseup", (e) => canvas.onMouseUp(e));
    cvs.addEventListener("mouseleave", (e) => canvas.onMouseLeave(e));
    cvs.addEventListener("wheel", (e) => canvas.onWheel(e));
    canvas.drawCanvas();
}
