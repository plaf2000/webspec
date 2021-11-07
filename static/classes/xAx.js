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
Object.defineProperty(exports, "__esModule", { value: true });
exports.xAx = void 0;
var Ax_1 = require("./Ax");
var xAx = /** @class */ (function (_super) {
    __extends(xAx, _super);
    function xAx(parent) {
        var _this = _super.call(this, parent) || this;
        _this.unit = "s";
        _this.rConv = sPx;
        _this.r = view.rx;
        _this.l = cvs.width;
        _this.unitStart = view.tx;
        _this.unitEnd = view.txend;
        _this.w = timeline.width;
        _this.h = timeline.height;
        _this.ctxAx = ctxTimeline;
        return _this;
    }
    return xAx;
}(Ax_1.Ax));
exports.xAx = xAx;
