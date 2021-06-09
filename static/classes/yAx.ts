import {Ax} from './Ax'
import {Axes} from './Axes'

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