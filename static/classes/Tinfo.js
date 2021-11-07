"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tinfo = void 0;
var Tinfo = /** @class */ (function () {
    function Tinfo() {
        this.update();
    }
    Tinfo.update = function () {
        this.cursor.x = cursor.relx();
        var time = new Date(0, 0, 0, 0, 0, 0, 0);
        this.cursor.timeStr = timeToStr(time, cursor.tx, true);
    };
    Tinfo.drawOnCanvas = function () {
        var margin = 10;
        var l = 20;
        ctxTinfo.fillStyle = "white";
        ctxTinfo.strokeStyle = "black";
        if (this.cursor.x < 0) {
            ctxTinfo.beginPath();
            ctxTinfo.moveTo(margin, tinfocvs.height / 2);
            ctxTinfo.lineTo(margin + (l * Math.sqrt(3)) / 2, tinfocvs.height / 2 - l / 2);
            ctxTinfo.lineTo(margin + (l * Math.sqrt(3)) / 2, tinfocvs.height / 2 + l / 2);
            ctxTinfo.lineTo(margin, tinfocvs.height / 2);
            ctxTinfo.stroke();
        }
        else if (this.cursor.x > tinfocvs.width) {
            ctxTinfo.beginPath();
            ctxTinfo.moveTo(tinfocvs.width - margin, tinfocvs.height / 2);
            ctxTinfo.lineTo(tinfocvs.width - (margin + (l * Math.sqrt(3)) / 2), tinfocvs.height / 2 - l / 2);
            ctxTinfo.lineTo(tinfocvs.width - (margin + (l * Math.sqrt(3)) / 2), tinfocvs.height / 2 + l / 2);
            ctxTinfo.lineTo(tinfocvs.width - margin, tinfocvs.height / 2);
            ctxTinfo.stroke();
        }
        else {
            ctxTinfo.font = fontSize + "px Roboto";
            ctxTinfo.textBaseline = "top";
            ctxTinfo.strokeText(this.cursor.timeStr, this.cursor.x, tinfocvs.height - fontSize);
        }
    };
    return Tinfo;
}());
exports.Tinfo = Tinfo;
