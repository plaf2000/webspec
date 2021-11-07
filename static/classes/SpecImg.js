"use strict";
var SpecImg = /** @class */ (function () {
    function SpecImg(base64data, offset, adding, duration) {
        if (adding === void 0) { adding = false; }
        if (duration === void 0) { duration = dur; }
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
    SpecImg.prototype.drawOnCanvas = function () {
        ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, stoPx(this.start), 0, this.duration / sPx, window.cvs.height);
    };
    return SpecImg;
}());
