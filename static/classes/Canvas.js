"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = void 0;
var Canvas = /** @class */ (function () {
    function Canvas() {
    }
    Canvas.prototype.loadCvs = function (cvs) {
        Canvas.cvs = cvs;
        var ctx = cvs.getContext("2d");
        if (ctx == null) {
            throw new Error("Context is null!");
        }
        Canvas.ctx = ctx;
    };
    Canvas.drawCanvas = function () {
    };
    return Canvas;
}());
exports.Canvas = Canvas;
