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
exports.yPx = exports.Freq = exports.xTime = exports.xPx = exports.yUnit = exports.xUnit = exports.xyUnit = void 0;
function test(arg) {
    return;
}
var xyUnit = /** @class */ (function () {
    function xyUnit(x) {
        this.value = x;
    }
    xyUnit.prototype.le = function (x) {
        return 0 < this.distance(x);
    };
    xyUnit.prototype.leq = function (x) {
        return 0 <= this.distance(x);
    };
    xyUnit.prototype.eq = function (x) {
        return 0 == this.distance(x);
    };
    xyUnit.prototype.geq = function (x) {
        return 0 >= this.distance(x);
    };
    xyUnit.prototype.ge = function (x) {
        return 0 > this.distance(x);
    };
    xyUnit.prototype.absDistance = function (x) {
        return Math.abs(this.distance(x));
    };
    Object.defineProperty(xyUnit.prototype, "val", {
        get: function () {
            return this.value;
        },
        enumerable: false,
        configurable: true
    });
    return xyUnit;
}());
exports.xyUnit = xyUnit;
var xUnit = /** @class */ (function (_super) {
    __extends(xUnit, _super);
    function xUnit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    xUnit.pxS = 10;
    xUnit.timeOffset = 0;
    return xUnit;
}(xyUnit));
exports.xUnit = xUnit;
var yUnit = /** @class */ (function (_super) {
    __extends(yUnit, _super);
    function yUnit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    yUnit.pxHz = .1;
    yUnit.fqEnd = 22000;
    return yUnit;
}(xyUnit));
exports.yUnit = yUnit;
var xPx = /** @class */ (function (_super) {
    __extends(xPx, _super);
    function xPx(arg) {
        var _this = this;
        if (typeof arg == "number") {
            _this = _super.call(this, arg) || this;
        }
        else if (arg instanceof xTime) {
            _this = _super.call(this, arg.val * xUnit.pxS) || this;
        }
        else {
            _this = _super.call(this, arg.val) || this;
        }
        return _this;
    }
    xPx.prototype.toStr = function () {
        return this.val + " px";
    };
    xPx.prototype.convert = function (constr) {
        return new constr(this);
    };
    xPx.prototype.distance = function (x) {
        return x.convert(xPx).val - this.val;
    };
    Object.defineProperty(xPx.prototype, "px", {
        get: function () {
            return this.val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(xPx.prototype, "seconds", {
        get: function () {
            return this.convert(xTime).val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(xPx.prototype, "datetime", {
        get: function () {
            return this.convert(xTime).datetime;
        },
        enumerable: false,
        configurable: true
    });
    return xPx;
}(xUnit));
exports.xPx = xPx;
test(new xPx(3));
var xTime = /** @class */ (function (_super) {
    __extends(xTime, _super);
    function xTime(arg) {
        var _this = this;
        var val;
        if (typeof arg == "number") {
            _this = _super.call(this, arg) || this;
        }
        else if (arg instanceof xPx) {
            _this = _super.call(this, arg.val * xUnit.pxS) || this;
        }
        else {
            _this = _super.call(this, arg.val) || this;
        }
        _this.date = new Date((xUnit.timeOffset + _this.val) * 1000);
        return _this;
    }
    xTime.prototype.toStr = function () {
        return this.date.toTimeString();
    };
    xTime.prototype.convert = function (constr) {
        return new constr(this);
    };
    xTime.prototype.distance = function (x) {
        return x.convert(xTime).val - this.val;
    };
    Object.defineProperty(xTime.prototype, "px", {
        get: function () {
            return this.convert(xPx).val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(xTime.prototype, "seconds", {
        get: function () {
            return this.val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(xTime.prototype, "datetime", {
        get: function () {
            return this.date;
        },
        enumerable: false,
        configurable: true
    });
    return xTime;
}(xUnit));
exports.xTime = xTime;
var Freq = /** @class */ (function (_super) {
    __extends(Freq, _super);
    function Freq(arg) {
        var _this = this;
        if (typeof arg == "number") {
            _this = _super.call(this, arg) || this;
        }
        else if (arg instanceof yPx) {
            _this = _super.call(this, yUnit.fqEnd - arg.val / yUnit.pxHz) || this;
        }
        else {
            _this = _super.call(this, arg.val) || this;
        }
        return _this;
    }
    Freq.prototype.toStr = function () {
        return this.val + " Hz";
    };
    Freq.prototype.convert = function (constr) {
        return new constr(this);
    };
    Freq.prototype.distance = function (x) {
        return x.convert(Freq).val - this.val;
    };
    Object.defineProperty(Freq.prototype, "px", {
        get: function () {
            return this.convert(yPx).val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Freq.prototype, "freq", {
        get: function () {
            return this.val;
        },
        enumerable: false,
        configurable: true
    });
    return Freq;
}(yUnit));
exports.Freq = Freq;
var yPx = /** @class */ (function (_super) {
    __extends(yPx, _super);
    function yPx(arg) {
        var _this = this;
        if (typeof arg == "number") {
            _this = _super.call(this, arg) || this;
        }
        else if (arg instanceof yPx) {
            _this = _super.call(this, (yUnit.fqEnd - arg.val) * yUnit.pxHz) || this;
        }
        else {
            _this = _super.call(this, arg.val) || this;
        }
        return _this;
    }
    yPx.prototype.toStr = function () {
        return this.val + " px";
    };
    yPx.prototype.convert = function (constr) {
        return new constr(this);
    };
    yPx.prototype.distance = function (x) {
        return x.convert(yPx).val - this.val;
    };
    Object.defineProperty(yPx.prototype, "px", {
        get: function () {
            return this.val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(yPx.prototype, "freq", {
        get: function () {
            return this.convert(Freq).val;
        },
        enumerable: false,
        configurable: true
    });
    return yPx;
}(yUnit));
exports.yPx = yPx;
