import {} from 'functions_ts.js';

const fname     : string = (window as any).fname;
const csrftoken : string = (window as any).csrftoken;
let projectId : number = (window as any).projectId;
let dfn       : number = (window as any).dfn;
let wfft      : number = (window as any).wfft;
let sr        : number = (window as any).sr;
let analysisId: number = (window as any).analysisId;
let zoomRatio : number = (window as any).zoomRatio;
















  


  
  // updateDelta(): void {
  //   let i: number = 0;
  //   let j: number = -2;
  //   while (
  //     ((Math.pow(10, j) * this.deltas[i]) / sPx) * view.rx < cvs.width / 6
  //   ) {
  //     i++;
  //     if (i == this.deltas.length) {
  //       i = 0;
  //       j++;
  //     }
  //   }

  //   if (i == 0) {
  //     j--;
  //     i = this.deltas.length - 1;
  //   } else {
  //     i--;
  //   }
  //   this.delta = Math.pow(10, j) * this.deltas[i];
  // };

  // updatePos(): void {
  //   this.first = Math.ceil(view.tx / this.delta - 1) * this.delta;
  //   if (this.first < 0) this.first = 0;
  // };

  // updateAll(): void {
  //   this.updateDelta();
  //   this.updatePos();
  // };

  // drawOnCanvas(): void {
  //   ctxTimeline.clearRect(0, 0, timeline.width, timeline.height);
  //   ctxTimeline.beginPath();

  //   for (
  //     let i: number = 0;
  //     this.first + i * this.delta <= view.txend &&
  //     this.first + i * this.delta <= audio.duration;
  //     i++
  //   ) {
  //     let value: number = Math.round((this.first + i * this.delta) * 1000) / 1000;
  //     let pos: number = ((value - view.tx) / sPx) * view.rx;
  //     let time: Date = new Date(0, 0, 0, 0, 0, 0, 0);

  //     let timeStr: string = timeToStr(time, value);

  //     ctxTimeline.strokeStyle = "black";
  //     ctxTimeline.moveTo(pos, 0);
  //     ctxTimeline.lineTo(pos, 10);

  //     let sub: number = 1 / 4;

  //     for (let k: number = 1; k * sub < 1; k++) {
  //       let frac: number = Math.round(sub * k * 10000) / 10000;
  //       let halfValue: number =
  //         Math.round((this.first + (i + frac) * this.delta) * 100000) / 100000;
  //       if (halfValue <= audio.duration) {
  //         let halfPos: number = ((halfValue - view.tx) / sPx) * view.rx;

  //         ctxTimeline.strokeStyle = "black";
  //         ctxTimeline.moveTo(halfPos, 0);
  //         let len: number = 6;
  //         if (frac == 0.5) {
  //           len = 8;
  //         }

  //         ctxTimeline.lineTo(halfPos, len);
  //       }
  //     }

  //     ctxTimeline.font = fontSize + "px Roboto";

  //     if (view.txend - value <= this.delta / 6) {
  //       ctxTimeline.textAlign = "right";
  //     } else if (value - view.tx <= this.delta / 6) {
  //       ctxTimeline.textAlign = "left";
  //     } else {
  //       ctxTimeline.textAlign = "center";
  //     }

  //     ctxTimeline.strokeText(timeStr, pos, 30);

  //     ctxTimeline.lineWidth = 1;
  //   }
  //   ctxTimeline.moveTo(0, 0);
  //   ctxTimeline.lineTo(timeline.width, 0);

  //   ctxTimeline.stroke();
  // };
}

class yAx extends Ax {
  unit = "Hz";

  rConv = HzPx;
  r = view.ry;
  l = cvs.height;

  unitStart = view.fy;
  unitEnd = view.fyend;
  w = fq.width;
  h = fq.height;
  ctxAx = ctxFq;

  constructor(parent: Axes) {
    super(parent);
  }


  // updateDelta(): void {
  //   var i = 0;
  //   var j = -1;
  //   while (
  //     ((Math.pow(10, j) * this.deltas[i]) / HzPx) * view.ry <
  //     cvs.height / 4
  //   ) {
  //     i++;
  //     if (i == this.deltas.length) {
  //       i = 0;
  //       j++;
  //     }
  //   }

  //   if (i == 0) {
  //     j--;
  //     i = this.deltas.length - 1;
  //   } else {
  //     i--;
  //   }
  //   this.delta = Math.pow(10, j) * this.deltas[i];
  // };

  // this.updatePos = function () {
  //   this.first = Math.ceil(view.fyend / this.delta - 1) * this.delta;
  //   if (this.first < 0) this.first = 0;
  // };

  // this.updateAll = function () {
  //   this.updateDelta();
  //   this.updatePos();
  // };

  // this.drawOnCanvas = function () {
  //   ctxFq.clearRect(0, 0, fq.width, fq.height);
  //   ctxFq.beginPath();

  //   for (var i = 0; this.first + i * this.delta <= view.fy; i++) {
  //     var value = Math.round((this.first + i * this.delta) * 1000) / 1000;
  //     var pos = ((view.fy - value) / HzPx) * view.ry;

  //     ctxFq.strokeStyle = "black";
  //     ctxFq.moveTo(fq.width, pos);
  //     ctxFq.lineTo(fq.width - 10, pos);

  //     var sub = 1 / 4;

  //     for (var k = 1; k * sub < 1; k++) {
  //       var frac = Math.round(sub * k * 10000) / 10000;
  //       var halfValue =
  //         Math.round((this.first + (i + frac) * this.delta) * 100000) / 100000;
  //       var halfPos = ((view.fy - halfValue) / HzPx) * view.ry;

  //       ctxFq.moveTo(fq.width, halfPos);
  //       var len = 6;
  //       if (frac == 0.5) {
  //         len = 8;
  //       }

  //       ctxFq.lineTo(fq.width - len, halfPos);
  //     }

  //     ctxFq.font = fontSize + "px Roboto";
  //     ctxFq.textAlign = "right";
  //     if (value - view.fyend <= this.delta / 6) {
  //       ctxFq.textBaseline = "bottom";
  //     } else if (view.fy - value <= this.delta / 6) {
  //       ctxFq.textBaseline = "top";
  //     } else {
  //       ctxFq.textBaseline = "middle";
  //     }

  //     ctxFq.strokeText(value, fq.width - 15, pos);
  //   }
  //   ctxFq.stroke();
  // };
}
