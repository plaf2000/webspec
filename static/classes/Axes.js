"use strict";
exports.__esModule = true;
exports.Axes = void 0;
var Ax_1 = require("./Ax");
var Axes = /** @class */ (function () {
    function Axes() {
        this.deltas = [1, 2, 5];
        this.x = new Ax_1.xAx(this);
        this.y = new Ax_1.yAx(this);
        this.updateAll();
        this.drawOnCanvas();
    }
    Axes.prototype.updateAll = function () {
        this.x.updateAll();
        this.y.updateAll();
    };
    Axes.prototype.updatePos = function () {
        this.x.updatePos();
        this.y.updatePos();
    };
    Axes.prototype.drawOnCanvas = function () {
        this.x.drawOnCanvas();
        this.y.drawOnCanvas();
    };
    return Axes;
}());
exports.Axes = Axes;
