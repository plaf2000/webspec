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
exports.Ax = void 0;
var Track_1 = require("./Track");
var Ax = /** @class */ (function () {
    function Ax(parent) {
        this.first = 0;
        this.delta = 0;
        this.deltas = parent.deltas;
        this.view = view;
        this.updateDelta();
    }
    Ax.prototype.updateDelta = function () {
        var i = 0;
        var j = -2;
        while (((Math.pow(10, j) * this.deltas[i]) / this.rConv) * this.r <
            this.l / 6) {
            i++;
            if (i == this.deltas.length) {
                i = 0;
                j++;
            }
        }
        if (i == 0) {
            j--;
            i = this.deltas.length - 1;
        }
        else {
            i--;
        }
        this.delta = Math.pow(10, j) * this.deltas[i];
    };
    Ax.prototype.updatePos = function () {
        this.first = Math.ceil(this.unitStart / this.delta - 1) * this.delta;
        if (this.first < 0)
            this.first = 0;
    };
    Ax.prototype.updateAll = function () {
        this.updateDelta();
        this.updatePos();
    };
    Ax.prototype.drawOnCanvas = function () {
        this.ctxAx.clearRect(0, 0, this.w, this.h);
        this.ctxAx.beginPath();
        for (var i = 0; this.first + i * this.delta <= this.unitEnd &&
            this.first + i * this.delta <= Track_1.Track.audio.duration; i++) {
            var value = Math.round((this.first + i * this.delta) * 1000) / 1000;
            var pos = ((value - this.unitStart) / this.rConv) * this.r;
            var time = new Date(0, 0, 0, 0, 0, 0, 0);
            var timeStr = timeToStr(time, value);
            this.ctxAx.strokeStyle = "black";
            this.ctxAx.moveTo(pos, 0);
            this.ctxAx.lineTo(pos, 10);
            var sub = 1 / 4;
            for (var k = 1; k * sub < 1; k++) {
                var frac = Math.round(sub * k * 10000) / 10000;
                var halfValue = Math.round((this.first + (i + frac) * this.delta) * 100000) / 100000;
                if (halfValue <= Track_1.Track.audio.duration) {
                    var halfPos = ((halfValue - this.unitStart) / this.rConv) * this.r;
                    this.ctxAx.strokeStyle = "black";
                    this.ctxAx.moveTo(halfPos, 0);
                    var len = 6;
                    if (frac == 0.5) {
                        len = 8;
                    }
                    this.ctxAx.lineTo(halfPos, len);
                }
            }
            this.ctxAx.font = fontSize + "px Roboto";
            if (this.unitEnd - value <= this.delta / 6) {
                this.ctxAx.textAlign = "right";
            }
            else if (value - this.unitStart <= this.delta / 6) {
                this.ctxAx.textAlign = "left";
            }
            else {
                this.ctxAx.textAlign = "center";
            }
            this.ctxAx.strokeText(timeStr, pos, 30);
            this.ctxAx.lineWidth = 1;
        }
        this.ctxAx.moveTo(0, 0);
        this.ctxAx.lineTo(this.w, 0);
        this.ctxAx.stroke();
    };
    return Ax;
}());
exports.Ax = Ax;
var xAx = /** @class */ (function (_super) {
    __extends(xAx, _super);
    function xAx(parent) {
        var _this = this;
        var y = tinfocvsheight + fqheight;
        _this = _super.call(this, fqwidth, fqwidth + cvswidth, y, y) || this;
        _this.y = y;
        _this.unit = "s";
        _this.deltas = parent.deltas;
        return _this;
    }
    xAx.prototype.updateDelta = function () {
        var i = 0;
        var j = -2;
        while (Math.pow(10, j) * this.deltas[i] / sPx * view.rx < cvswidth / 6) {
            i++;
            if (i == this.deltas.length) {
                i = 0;
                j++;
            }
        }
        if (i == 0) {
            j--;
            i = this.deltas.length - 1;
        }
        else {
            i--;
        }
        this.delta = Math.pow(10, j) * this.deltas[i];
    };
    ;
    xAx.prototype.updatePos = function () {
        this.first = Math.ceil(view.tx / this.delta - 1) * this.delta;
        if (this.first < 0)
            this.first = 0;
    };
    ;
    xAx.prototype.updateAll = function () {
        this.updateDelta();
        this.updatePos();
    };
    xAx.prototype.clear = function () {
        ctx.clearRect(0, this.y, timelinewidth + fqwidth + 10, timelineheight + 10);
    };
    xAx.prototype.drawOnCanvas = function () {
        ctx.beginPath();
        // console.log(audio.duration)
        for (var i = 0; this.first + i * this.delta <= view.txend && (isNaN(audio.duration) || this.first + i * this.delta <= audio.duration); i++) {
            var value = Math.round((this.first + i * this.delta) * 1000) / 1000;
            var pos = this.stoPx(value);
            var time = new Date(0, 0, 0, 0, 0, 0, 0);
            var timeStr = timeToStr(time, value);
            ctx.strokeStyle = "black";
            if (value >= view.tx) {
                ctx.moveTo(pos, this.y);
                ctx.lineTo(pos, this.y + 10);
                ctx.font = fontSize + "px Roboto";
                ctx.textAlign = "center";
                ctx.lineWidth = "1";
                ctx.textBaseline = 'middle';
                ctx.strokeText(timeStr, pos, this.y + 30);
            }
            var sub = 1 / 4;
            for (var k = 1; k * sub < 1; k++) {
                var frac = Math.round(sub * k * 10000) / 10000;
                var halfValue = Math.round((this.first + (i + frac) * this.delta) * 100000) / 100000;
                if ((isNaN(audio.duration) || halfValue <= audio.duration)) {
                    var halfPos = this.stoPx(halfValue);
                    ctx.strokeStyle = "black";
                    ctx.moveTo(halfPos, this.y);
                    var len = 6;
                    if (frac == .5) {
                        len = 8;
                    }
                    if (halfValue >= view.tx) {
                        ctx.lineTo(halfPos, this.y + len);
                    }
                }
            }
        }
        ctx.moveTo(this.xstart, this.y);
        ctx.lineTo(this.xend, this.y);
        ctx.stroke();
    };
    ;
    return xAx;
}(DrawableBox));
var yAx = /** @class */ (function (_super) {
    __extends(yAx, _super);
    function yAx(parent) {
        var _this = this;
        var x = fqwidth;
        _this = _super.call(this, x, x, tinfocvsheight, tinfocvsheight + fqheight) || this;
        _this.unit = "Hz";
        _this.x = x;
        _this.deltas = parent.deltas;
        return _this;
    }
    yAx.prototype.updateDelta = function () {
        var i = 0;
        var j = -1;
        while (((Math.pow(10, j) * this.deltas[i]) / HzPx) * view.ry <
            cvsheight / 4) {
            i++;
            if (i == this.deltas.length) {
                i = 0;
                j++;
            }
        }
        if (i == 0) {
            j--;
            i = this.deltas.length - 1;
        }
        else {
            i--;
        }
        this.delta = Math.pow(10, j) * this.deltas[i];
    };
    yAx.prototype.updatePos = function () {
        this.first = Math.ceil(view.fyend / this.delta - 1) * this.delta;
        if (this.first < 0)
            this.first = 0;
    };
    yAx.prototype.updateAll = function () {
        this.updateDelta();
        this.updatePos();
    };
    yAx.prototype.clear = function () {
        ctx.clearRect(0, 0, fqwidth, fqheight + tinfocvsheight + timelineheight);
    };
    yAx.prototype.inside = function (val) {
        return val <= view.fy && val >= view.fyend;
    };
    yAx.prototype.drawOnCanvas = function () {
        ctx.beginPath();
        for (var i = 0; this.first + i * this.delta <= view.fy; i++) {
            var value = Math.round((this.first + i * this.delta) * 1000) / 1000;
            var pos = this.HztoPx(value);
            if (this.inside(value)) {
                ctx.strokeStyle = "black";
                ctx.moveTo(this.x, pos);
                ctx.lineTo(this.x - 10, pos);
                ctx.font = fontSize + "px Roboto";
                ctx.textAlign = "right";
                ctx.textBaseline = "middle";
                ctx.strokeText(value, this.x - 15, pos);
            }
            var sub = 1 / 4;
            for (var k = 1; k * sub < 1; k++) {
                var frac = Math.round(sub * k * 10000) / 10000;
                var halfValue = Math.round((this.first + (i + frac) * this.delta) * 100000) / 100000;
                var halfPos = this.HztoPx(halfValue);
                if (this.inside(halfValue)) {
                    ctx.moveTo(this.x, halfPos);
                    var len = 6;
                    if (frac == 0.5) {
                        len = 8;
                    }
                    ctx.lineTo(this.x - len, halfPos);
                }
            }
        }
        ctx.stroke();
    };
    return yAx;
}(Ax));
