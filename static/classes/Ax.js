import { Track } from "./Track";
export class Ax {
    constructor(parent) {
        this.first = 0;
        this.delta = 0;
        this.deltas = parent.deltas;
        this.updateDelta();
    }
    updateDelta() {
        let i = 0;
        let j = -2;
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
    }
    updatePos() {
        this.first = Math.ceil(this.unitStart / this.delta - 1) * this.delta;
        if (this.first < 0)
            this.first = 0;
    }
    updateAll() {
        this.updateDelta();
        this.updatePos();
    }
    ;
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
    ;
}
