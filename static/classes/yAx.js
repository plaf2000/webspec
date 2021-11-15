import { Ax } from './Ax';
class yAx extends Ax {
    constructor(parent) {
        super(parent);
        this.unit = "Hz";
        this.rConv = HzPx;
        this.r = view.ry;
        this.l = cvs.height;
        this.unitStart = view.fy;
        this.unitEnd = view.fyend;
        this.w = fq.width;
        this.h = fq.height;
        this.ctxAx = ctxFq;
    }
}
