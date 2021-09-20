"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.DrawableBox = exports.Box = void 0;
var View_1 = require("./View");
var Values_1 = require("./Values");
var Box = /** @class */ (function () {
    function Box(xstart, xend, ystart, yend) {
        this.xstart = xstart;
        this.xend = xend;
        this.ystart = ystart;
        this.yend = yend;
    }
    Box.prototype.isHover = function (x, y) {
        return x >= this.xstart && x <= this.xend && y >= this.ystart && y <= this.yend;
    };
    Box.prototype.isHoverStrict = function (x, y) {
        return x > this.xstart && x < this.xend && y > this.ystart && y < this.yend;
    };
    return Box;
}());
exports.Box = Box;
var DrawableBox = /** @class */ (function (_super) {
    __extends(DrawableBox, _super);
    function DrawableBox(xstart, xend, ystart, yend) {
        return _super.call(this, xstart, xend, ystart, yend) || this;
    }
    DrawableBox.prototype.stoPx = function (t) {
        return (t - View_1.View.tx) / Values_1.Values.sPx * View_1.View.rx + this.xstart;
    };
    DrawableBox.prototype.pxtoS = function (x) {
        return (x - this.xstart) / View_1.View.rx * Values_1.Values.sPx + View_1.View.tx;
    };
    DrawableBox.prototype.HztoPx = function (f) {
        return (View_1.View.fy - f) / Values_1.Values.HzPx * View_1.View.ry + this.ystart;
    };
    DrawableBox.prototype.pxtoHz = function (y) {
        return View_1.View.fy - (y - this.ystart) / View_1.View.ry * Values_1.Values.HzPx;
    };
    return DrawableBox;
}(Box));
exports.DrawableBox = DrawableBox;
