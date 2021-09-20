"use strict";
exports.__esModule = true;
exports.View = void 0;
var Canvas_1 = require("./Canvas");
var Values_1 = require("./Values");
var Track_1 = require("./Track");
var View = /** @class */ (function () {
    function View() {
    }
    View.setOffset = function (top, left, offset, dur) {
        View.origOffset = offset;
        View.start = offset;
        View.end = offset + dur;
        View.left = left;
        View.top = top;
    };
    View.zoom = function (dir, ratio, x, y, shiftPressed) {
        var newRx = View.rx * ratio;
        // if(newRx<.018) return;
        newRx =
            Math.round(newRx * Math.pow(10, 12)) / Math.pow(10, 12) == 1 ? 1 : newRx;
        var newRy = View.ry * ratio;
        newRy =
            Math.round(newRy * Math.pow(10, 12)) / Math.pow(10, 12) <= 1 ? 1 : newRy;
        Canvas_1.Canvas.ctx.resetTransform();
        var absx = View.x + x / View.rx;
        var absy = View.y + y / View.ry;
        var ry = 1;
        if (!shiftPressed) {
            ry = ratio;
            View.ry = newRy;
        }
        if (newRx <= 1) {
            ry = 1;
            View.ry = 1;
        }
        View.rx = newRx;
        View.x = 0;
        View.y = 0;
        Canvas_1.Canvas.ctx.scale(View.rx, View.ry);
        var dx = x - absx * View.rx;
        var dy = y - absy * View.ry;
        View.pan(dx, dy);
    };
    View.pan = function (dx, dy) {
        var x = View.x - dx / View.rx;
        var y = View.y - dy / View.ry;
        View.moveTo(x, y, undefined, undefined);
    };
    View.moveTo = function (xPx, yPx, xT, yF) {
        if ((!xPx && !xT)) {
            throw new Error("x coordinates not specified!");
        }
        if ((!yPx && !yF)) {
            throw new Error("y coordinates not specified!");
        }
        if (yPx) {
            yF = View.pxtoHz(yPx);
        }
        else {
            yPx = (yF) ? View.HztoPx(yF) : 0;
            yF = (yF) ? yF : 0;
        }
        if (xPx) {
            xT = View.pxtoS(xPx);
        }
        else {
            xPx = (xT) ? View.stoPx(xT) : 0;
            xT = (xT) ? xT : 0;
        }
        if (yPx < 0) {
            yPx = 0;
            yF = Values_1.Values.hf;
        }
        else if (yPx + Canvas_1.Canvas.cvs.height / View.ry > Canvas_1.Canvas.cvs.height) {
            yPx = Canvas_1.Canvas.cvs.height * (1 - 1 / View.ry);
            yF = Values_1.Values.hf - (Values_1.Values.hf - Values_1.Values.lf) * (1 - 1 / View.ry);
        }
        if (xT + (Canvas_1.Canvas.cvs.width * Values_1.Values.sPx) / View.rx > Track_1.Track.audio.duration) {
            xT = Track_1.Track.audio.duration - (Canvas_1.Canvas.cvs.width * Values_1.Values.sPx) / View.rx;
            xPx = View.stoPx(xT);
        }
        if (xT < 0) {
            xT = 0;
            xPx = View.stoPx(0);
        }
        var dx = View.x - xPx;
        var dy = View.y - yPx;
        Canvas_1.Canvas.ctx.translate(dx, dy);
        View.detx += dx * View.rx;
        View.dety += dy * View.ry;
        View.x = xPx;
        View.y = yPx;
        View.xend = View.x + Canvas_1.Canvas.cvs.width / View.rx;
        View.yend = View.y + Canvas_1.Canvas.cvs.height / View.ry;
        View.tx = xT;
        View.fy = yF;
        View.txend = View.pxtoS(View.xend);
        View.fyend = View.pxtoHz(View.yend);
        // while (View.tx < View.start && View.start > 0) {
        //   // View.start =  ? 0 : View.start-dur;
        //   // addToCanvas(View.start,true);
        //   if (View.start > Values.dur) {
        //     View.start -= Values.dur;
        //     addToCanvas(View.start, nSpecs, true);
        //   } else {
        //     addToCanvas(0, nSpecs, true);
        //     // addToCanvas(0,true,View.start);
        //     View.start = 0;
        //   }
        //   nSpecs++;
        // }
        // while (View.txend > View.end && View.end < audio.duration) {
        //   if (View.end + Values.dur < audio.duration) {
        //     addToCanvas(View.end, nSpecs, false);
        //     View.end += Values.dur;
        //   } else {
        //     addToCanvas(View.end, nSpecs, false, audio.duration - View.end);
        //     View.end = audio.duration;
        //   }
        //   nSpecs++;
        // }
    };
    ;
    View.stoPx = function (t) {
        return ((t - View.origOffset) / Values_1.Values.sPx) + View.left / View.rx;
    };
    View.pxtoS = function (x) {
        return (x - View.left / View.rx) * Values_1.Values.sPx + View.origOffset;
    };
    View.HztoPx = function (f) {
        return (Values_1.Values.hf - f) / Values_1.Values.HzPx + View.top / View.ry;
    };
    View.pxtoHz = function (y) {
        return Values_1.Values.hf - (y - View.top / View.ry) * Values_1.Values.HzPx;
    };
    View.rx = 1;
    View.ry = 1;
    View.x = 0;
    View.y = 0;
    View.detx = 0;
    View.dety = 0;
    View.origFrame = 0;
    View.actualI = 0;
    View.fy = 0;
    View.tx = 0;
    View.txend = 0;
    View.fyend = 0;
    return View;
}());
exports.View = View;
