"use strict";
exports.__esModule = true;
exports.Canvas = void 0;
var Canvas = /** @class */ (function () {
    function Canvas(cvs) {
        this.cvs = cvs;
        var ctx = cvs.getContext("2d");
        if (ctx == null) {
            throw new Error("Context is null!");
        }
        this.ctx = ctx;
    }
    Canvas.prototype.drawCanvas = function () {
    };
    return Canvas;
}());
exports.Canvas = Canvas;
