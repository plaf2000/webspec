class xAx extends Ax {
    unit = "s";
  
    rConv = sPx;
    r = view.rx;
    l = cvs.width;
  
    unitStart = view.tx;
    unitEnd = view.txend;
    w = timeline.width;
    h = timeline.height;
    ctxAx = ctxTimeline;
  
    constructor(parent: Axes) {
      super(parent);
    }
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