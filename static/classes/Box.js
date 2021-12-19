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
var Coord_1 = require("./Coord");
var Units_1 = require("./Units");
var Box = /** @class */ (function () {
    function Box(tl, br) {
        this.tl = tl;
        this.br = br;
    }
    Object.defineProperty(Box.prototype, "xs", {
        get: function () {
            return this.tl.xpx;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "xe", {
        get: function () {
            return this.br.xpx;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "ys", {
        get: function () {
            return this.tl.ypx;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "ye", {
        get: function () {
            return this.br.ypx;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "pxW", {
        get: function () {
            return this.xe - this.xs;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "pxH", {
        get: function () {
            return this.ye - this.ys;
        },
        enumerable: false,
        configurable: true
    });
    Box.prototype.isHover = function (coord) {
        coord = coord.convert(Units_1.xPx, Units_1.yPx);
        return (coord.x.geq(this.tl.x) &&
            coord.x.leq(this.br.x) &&
            coord.y.geq(this.tl.y) &&
            coord.y.leq(this.br.y));
    };
    Box.prototype.isHoverPx = function (x, y) {
        return this.isHover(new Coord_1.Coord2D(x, y, Units_1.xPx, Units_1.yPx));
    };
    Box.prototype.isHoverStrict = function (coord) {
        coord = coord.convert(Units_1.xPx, Units_1.yPx);
        return (coord.x.ge(this.tl.x) &&
            coord.x.le(this.br.x) &&
            coord.y.ge(this.tl.y) &&
            coord.y.le(this.br.y));
    };
    Box.prototype.isHoverStrictPx = function (x, y) {
        return this.isHoverStrict(new Coord_1.Coord2D(x, y, Units_1.xPx, Units_1.yPx));
    };
    return Box;
}());
exports.Box = Box;
var DrawableBox = /** @class */ (function (_super) {
    __extends(DrawableBox, _super);
    function DrawableBox(ctx, tl, br) {
        var _this = _super.call(this, tl, br) || this;
        _this.ctx = ctx;
        return _this;
    }
    DrawableBox.prototype.updatetf = function () { };
    DrawableBox.prototype.clear = function () {
        this.ctx.clearRect(this.tl.x.convert(Units_1.xPx).val, this.tl.y.convert(Units_1.yPx).val);
    };
    return DrawableBox;
}(Box));
exports.DrawableBox = DrawableBox;
