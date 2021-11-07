"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ax = void 0;
var Track_1 = require("./Track");
var Ax = /** @class */ (function () {
    function Ax(parent) {
        this.first = 0;
        this.delta = 0;
        this.deltas = parent.deltas;
        this.updateDelta();
    }
    Ax.prototype.updateDelta = function () {
        var i = 0;
        var j = -2;
        while (((Math.pow(10, j) * this.deltas[i]) / this.rConv) * this.r < this.l / 6) {
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
    ;
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
    ;
    return Ax;
}());
exports.Ax = Ax;
