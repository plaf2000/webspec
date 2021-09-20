"use strict";
exports.__esModule = true;
exports.Axes = void 0;
var Axes = /** @class */ (function () {
    function Axes() {
        this.deltas = [1, 2, 5];
        this.x = new xAx(this);
        this.y = new yAx(this);
        this.updateAll();
        this.drawOnCanvas();
    }
    Axes.prototype.updateAll = function () {
        this.x.updateAll();
        this.y.updateAll();
    };
    ;
    Axes.prototype.updatePos = function () {
        this.x.updatePos();
        this.y.updatePos();
    };
    ;
    Axes.prototype.drawOnCanvas = function () {
        this.x.drawOnCanvas();
        this.y.drawOnCanvas();
    };
    ;
    return Axes;
}());
exports.Axes = Axes;
