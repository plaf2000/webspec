import { Canvas } from "./Canvas";
import { Values } from "./Values";
import { Track } from "./Track";
export class View {
    constructor(top, left, offset, dur) {
        this.rx = 1;
        this.ry = 1;
        this.x = 0;
        this.y = 0;
        this.detx = 0;
        this.dety = 0;
        this.origFrame = 0;
        this.actualI = 0;
        this.fy = 0;
        this.tx = 0;
        this.txend = 0;
        this.fyend = 0;
        this.origOffset = offset;
        this.start = offset;
        this.end = offset + dur;
        this.left = left;
        this.top = top;
    }
    setOffset(top, left, offset, dur) {
        this.origOffset = offset;
        this.start = offset;
        this.end = offset + dur;
        this.left = left;
        this.top = top;
    }
    zoom(dir, ratio, x, y, shiftPressed) {
        let newRx = this.rx * ratio;
        // if(newRx<.018) return;
        newRx =
            Math.round(newRx * Math.pow(10, 12)) / Math.pow(10, 12) == 1 ? 1 : newRx;
        let newRy = this.ry * ratio;
        newRy =
            Math.round(newRy * Math.pow(10, 12)) / Math.pow(10, 12) <= 1 ? 1 : newRy;
        Canvas.ctx.resetTransform();
        let absx = this.x + x / this.rx;
        let absy = this.y + y / this.ry;
        let ry = 1;
        if (!shiftPressed) {
            ry = ratio;
            this.ry = newRy;
        }
        if (newRx <= 1) {
            ry = 1;
            this.ry = 1;
        }
        this.rx = newRx;
        this.x = 0;
        this.y = 0;
        Canvas.ctx.scale(this.rx, this.ry);
        var dx = x - absx * this.rx;
        var dy = y - absy * this.ry;
        this.pan(dx, dy);
    }
    pan(dx, dy) {
        let x = this.x - dx / this.rx;
        let y = this.y - dy / this.ry;
        this.moveTo(x, y, undefined, undefined);
    }
    moveTo(xPx, yPx, xT, yF) {
        if (!xPx && !xT) {
            throw new Error("x coordinates not specified!");
        }
        if (!yPx && !yF) {
            throw new Error("y coordinates not specified!");
        }
        if (yPx) {
            yF = this.pxtoHz(yPx);
        }
        else {
            yPx = yF ? this.HztoPx(yF) : 0;
            yF = yF ? yF : 0;
        }
        if (xPx) {
            xT = this.pxtoS(xPx);
        }
        else {
            xPx = xT ? this.stoPx(xT) : 0;
            xT = xT ? xT : 0;
        }
        if (yPx < 0) {
            yPx = 0;
            yF = Values.hf;
        }
        else if (yPx + Canvas.cvs.height / this.ry > Canvas.cvs.height) {
            yPx = Canvas.cvs.height * (1 - 1 / this.ry);
            yF = Values.hf - (Values.hf - Values.lf) * (1 - 1 / this.ry);
        }
        if (xT + (Canvas.cvs.width * Values.sPx) / this.rx > Track.audio.duration) {
            xT = Track.audio.duration - (Canvas.cvs.width * Values.sPx) / this.rx;
            xPx = this.stoPx(xT);
        }
        if (xT < 0) {
            xT = 0;
            xPx = this.stoPx(0);
        }
        let dx = this.x - xPx;
        let dy = this.y - yPx;
        Canvas.ctx.translate(dx, dy);
        this.detx += dx * this.rx;
        this.dety += dy * this.ry;
        this.x = xPx;
        this.y = yPx;
        this.xend = this.x + Canvas.cvs.width / this.rx;
        this.yend = this.y + Canvas.cvs.height / this.ry;
        this.tx = xT;
        this.fy = yF;
        this.txend = this.pxtoS(this.xend);
        this.fyend = this.pxtoHz(this.yend);
        // while (this.tx < this.start && this.start > 0) {
        //   // this.start =  ? 0 : this.start-dur;
        //   // addToCanvas(this.start,true);
        //   if (this.start > Values.dur) {
        //     this.start -= Values.dur;
        //     addToCanvas(this.start, nSpecs, true);
        //   } else {
        //     addToCanvas(0, nSpecs, true);
        //     // addToCanvas(0,true,this.start);
        //     this.start = 0;
        //   }
        //   nSpecs++;
        // }
        // while (this.txend > this.end && this.end < audio.duration) {
        //   if (this.end + Values.dur < audio.duration) {
        //     addToCanvas(this.end, nSpecs, false);
        //     this.end += Values.dur;
        //   } else {
        //     addToCanvas(this.end, nSpecs, false, audio.duration - this.end);
        //     this.end = audio.duration;
        //   }
        //   nSpecs++;
        // }
    }
    stoPx(t) {
        return (t - this.origOffset) / Values.sPx + this.left / this.rx;
    }
    pxtoS(x) {
        return (x - this.left / this.rx) * Values.sPx + this.origOffset;
    }
    HztoPx(f) {
        return (Values.hf - f) / Values.HzPx + this.top / this.ry;
    }
    pxtoHz(y) {
        return Values.hf - (y - this.top / this.ry) * Values.HzPx;
    }
}
