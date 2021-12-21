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
exports.x = exports.constructors = exports.yFreq = exports.yPx = exports.xPx = exports.xTime = exports.yUnit = exports.xUnit = exports.Unit = exports.yUnitConv = exports.xUnitConv = void 0;
/*

Classes used for conversions

*/
var xUnitConv = /** @class */ (function () {
    function xUnitConv() {
    }
    xUnitConv.pxToS = function (x) {
        return x / xUnitConv.px_s + xUnitConv.start_time;
    };
    xUnitConv.sToPx = function (x) {
        return (x - xUnitConv.start_time) * xUnitConv.px_s;
    };
    xUnitConv.dateToS = function (x) {
        return x.getMilliseconds() / 1000 - xUnitConv.time_offset;
    };
    xUnitConv.sToDate = function (x) {
        return new Date(x * 1000);
    };
    xUnitConv.pxToDate = function (x) {
        return xUnitConv.sToDate(xUnitConv.pxToS(x));
    };
    xUnitConv.dateToPx = function (x) {
        return xUnitConv.sToPx(xUnitConv.dateToS(x));
    };
    xUnitConv.px_s = 10;
    xUnitConv.time_offset = 0;
    xUnitConv.start_time = xUnitConv.time_offset;
    return xUnitConv;
}());
exports.xUnitConv = xUnitConv;
var yUnitConv = /** @class */ (function () {
    function yUnitConv() {
    }
    yUnitConv.pxToHz = function (y) {
        return yUnitConv.fq_end - y / yUnitConv.px_hz;
    };
    yUnitConv.hzToPx = function (y) {
        return (y - yUnitConv.fq_end) * yUnitConv.px_hz;
    };
    yUnitConv.fq_end = 22000;
    yUnitConv.px_hz = 0.1;
    return yUnitConv;
}());
exports.yUnitConv = yUnitConv;
/*

x and y units definitons

*/
var Unit = /** @class */ (function () {
    function Unit(val, e) {
        this.val_ = val;
        this.editable_ = e || false;
    }
    Object.defineProperty(Unit.prototype, "editable", {
        get: function () {
            return this.editable_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Unit.prototype, "val", {
        get: function () {
            return this.val_;
        },
        set: function (v) {
            if (this.editable)
                this.val_ = v;
        },
        enumerable: false,
        configurable: true
    });
    return Unit;
}());
exports.Unit = Unit;
var xUnit = /** @class */ (function (_super) {
    __extends(xUnit, _super);
    function xUnit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return xUnit;
}(Unit));
exports.xUnit = xUnit;
var yUnit = /** @class */ (function (_super) {
    __extends(yUnit, _super);
    function yUnit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return yUnit;
}(Unit));
exports.yUnit = yUnit;
/*

x and y units implementations

*/
// x implementations
var xTime = /** @class */ (function (_super) {
    __extends(xTime, _super);
    function xTime(arg) {
        var _this = this;
        if (arg instanceof Date)
            arg = xUnitConv.dateToS(arg);
        _this = _super.call(this, arg, false) || this;
        return _this;
    }
    Object.defineProperty(xTime.prototype, "s", {
        get: function () {
            return this.val;
        },
        set: function (x) {
            this.val = x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(xTime.prototype, "date", {
        get: function () {
            return xUnitConv.sToDate(this.val);
        },
        set: function (x) {
            this.val = xUnitConv.dateToS(x);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(xTime.prototype, "px", {
        get: function () {
            return xUnitConv.sToPx(this.val);
        },
        set: function (x) {
            this.val = xUnitConv.pxToS(x);
        },
        enumerable: false,
        configurable: true
    });
    return xTime;
}(xUnit));
exports.xTime = xTime;
var xPx = /** @class */ (function (_super) {
    __extends(xPx, _super);
    function xPx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(xPx.prototype, "s", {
        get: function () {
            return xUnitConv.pxToS(this.val);
        },
        set: function (x) {
            this.val = xUnitConv.sToPx(x);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(xPx.prototype, "date", {
        get: function () {
            return xUnitConv.pxToDate(this.val);
        },
        set: function (x) {
            this.val = xUnitConv.dateToPx(x);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(xPx.prototype, "px", {
        get: function () {
            return this.val;
        },
        set: function (x) {
            this.val = x;
        },
        enumerable: false,
        configurable: true
    });
    return xPx;
}(xUnit));
exports.xPx = xPx;
// y implementations
var yPx = /** @class */ (function (_super) {
    __extends(yPx, _super);
    function yPx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(yPx.prototype, "hz", {
        get: function () {
            return yUnitConv.pxToHz(this.val);
        },
        set: function (x) {
            this.val = yUnitConv.hzToPx(x);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(yPx.prototype, "px", {
        get: function () {
            return this.val;
        },
        set: function (x) {
            this.val = x;
        },
        enumerable: false,
        configurable: true
    });
    return yPx;
}(yUnit));
exports.yPx = yPx;
var yFreq = /** @class */ (function (_super) {
    __extends(yFreq, _super);
    function yFreq() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(yFreq.prototype, "px", {
        get: function () {
            return yUnitConv.hzToPx(this.val);
        },
        set: function (x) {
            this.val = yUnitConv.pxToHz(x);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(yFreq.prototype, "hz", {
        get: function () {
            return this.val;
        },
        set: function (x) {
            this.val = x;
        },
        enumerable: false,
        configurable: true
    });
    return yFreq;
}(yUnit));
exports.yFreq = yFreq;
/*

Helper functions

*/
// x
exports.constructors = {
    x: {
        s: xTime,
        px: xPx,
        date: xTime
    },
    y: {
        px: yPx,
        hz: yFreq
    }
};
function x(val, utype, e) {
    return new exports.constructors["x"][utype](val);
}
exports.x = x;
x(new Date(4), "date");
