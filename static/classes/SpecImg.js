"use strict";
class SpecImg {
    constructor(base64data, offset, adding = false, duration = dur) {
        this.base64 = window.btoa(base64data);
        this.start = offset;
        this.end = offset + duration;
        this.duration = duration;
        this.img = new Image();
        this.img.src = "data:image/png;base64," + this.base64;
        this.img.setAttribute("style", "-webkit-filter: blur(500px);  filter: blur(500px);");
        this.img.onload = function () {
            drawCanvas();
        };
    }
    drawOnCanvas() {
        ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, stoPx(this.start), 0, this.duration / sPx, window.cvs.height);
    }
}
