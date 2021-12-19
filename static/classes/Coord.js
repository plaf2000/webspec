"use strict";
exports.__esModule = true;
exports.Coord2D = void 0;
var Coord2D = /** @class */ (function () {
    function Coord2D(x, y, constrx, constry) {
        this.xval = new constrx(x);
        this.yval = new constry(y);
    }
    Coord2D.prototype.convertx = function (constr) {
        return new constr(this.x);
    };
    Coord2D.prototype.converty = function (constr) {
        return new constr(this.y);
    };
    Coord2D.prototype.convert = function (constrx, constry) {
        return new Coord2D(this.x, this.y, constrx, constry);
    };
    Coord2D.prototype.distance = function (coord) {
        var dx = coord.x.distance(this.x);
        var dy = coord.y.distance(this.y);
        return Math.sqrt(dx * dx + dy * dy);
    };
    Object.defineProperty(Coord2D.prototype, "x", {
        get: function () {
            return this.xval;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Coord2D.prototype, "y", {
        get: function () {
            return this.yval;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Coord2D.prototype, "xpx", {
        get: function () {
            return this.x.px;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Coord2D.prototype, "ypx", {
        get: function () {
            return this.y.px;
        },
        enumerable: false,
        configurable: true
    });
    return Coord2D;
}());
exports.Coord2D = Coord2D;
