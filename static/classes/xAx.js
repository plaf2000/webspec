import { Ax } from './Ax';
export class xAx extends Ax {
    constructor(parent) {
        super(parent);
        this.unit = "s";
        this.rConv = sPx;
        this.r = view.rx;
        this.l = cvs.width;
        this.unitStart = view.tx;
        this.unitEnd = view.txend;
        this.w = timeline.width;
        this.h = timeline.height;
        this.ctxAx = ctxTimeline;
    }
}
