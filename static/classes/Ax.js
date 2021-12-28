import { DrawableBox } from "./Box";
import { Track } from "./Track";
export class Ax extends DrawableBox {
    constructor(ctx, tl, br) {
        super(ctx, tl, br);
        this.first = 0;
        this.delta = 0;
        this.ctx = ctx;
    }
    get start() { }
    get end() { }
    updateDelta() {
        let i = 0;
        let j = -2;
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
    }
    drawOnCanvas() {
        this.ctxAx.clearRect(0, 0, this.w, this.h);
        this.ctxAx.beginPath();
        for (let i = 0; this.first + i * this.delta <= this.unitEnd &&
            this.first + i * this.delta <= Track.audio.duration; i++) {
            let value = Math.round((this.first + i * this.delta) * 1000) / 1000;
            let pos = ((value - this.unitStart) / this.rConv) * this.r;
            let time = new Date(0, 0, 0, 0, 0, 0, 0);
            let timeStr = timeToStr(time, value);
            this.ctxAx.strokeStyle = "black";
            this.ctxAx.moveTo(pos, 0);
            this.ctxAx.lineTo(pos, 10);
            let sub = 1 / 4;
            for (let k = 1; k * sub < 1; k++) {
                let frac = Math.round(sub * k * 10000) / 10000;
                let halfValue = Math.round((this.first + (i + frac) * this.delta) * 100000) / 100000;
                if (halfValue <= Track.audio.duration) {
                    let halfPos = ((halfValue - this.unitStart) / this.rConv) * this.r;
                    this.ctxAx.strokeStyle = "black";
                    this.ctxAx.moveTo(halfPos, 0);
                    let len = 6;
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
    }
}
class xAx extends DrawableBox {
    constructor(parent) {
        let y = tinfocvsheight + fqheight;
        super(fqwidth, fqwidth + cvswidth, y, y);
        this.y = y;
        this.unit = "s";
        this.deltas = parent.deltas;
    }
    updateDelta() {
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
    }
    ;
    updatePos() {
        this.first = Math.ceil(view.tx / this.delta - 1) * this.delta;
        if (this.first < 0)
            this.first = 0;
    }
    ;
    updateAll() {
        this.updateDelta();
        this.updatePos();
    }
    clear() {
        ctx.clearRect(0, this.y, timelinewidth + fqwidth + 10, timelineheight + 10);
    }
    drawOnCanvas() {
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
            var sub = 1, abstract;
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
    }
    ;
}
class yAx extends Ax {
    constructor(parent) {
        let x = fqwidth;
        super(x, x, tinfocvsheight, tinfocvsheight + fqheight);
        this.unit = "Hz";
        this.x = x;
        this.deltas = parent.deltas;
    }
    updateDelta() {
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
    }
    updatePos() {
        this.first = Math.ceil(view.fyend / this.delta - 1) * this.delta;
        if (this.first < 0)
            this.first = 0;
    }
    updateAll() {
        this.updateDelta();
        this.updatePos();
    }
    clear() {
        ctx.clearRect(0, 0, fqwidth, fqheight + tinfocvsheight + timelineheight);
    }
    inside(val) {
        return val <= view.fy && val >= view.fyend;
    }
    drawOnCanvas() {
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
    }
}
