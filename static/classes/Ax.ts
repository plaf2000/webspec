abstract class Ax {
    abstract unit: string;
    first: number = 0;
    delta: number = 0;
    deltas: number[];
  
    abstract rConv: number;
    abstract r: number;
    abstract l: number;
    abstract unitStart: number;
    abstract unitEnd: number;
  
    abstract w: number;
    abstract h: number;
  
    abstract ctxAx: CanvasRenderingContext2D;
  
    constructor(parent: Axes) {
      this.deltas = parent.deltas;
      this.updateDelta();
    }
    
    updateDelta(): void {
        let i: number = 0;
        let j: number = -2;
        while (
          ((Math.pow(10, j) * this.deltas[i]) / this.rConv) * this.r < this.l / 6
        ) {
          i++;
          if (i == this.deltas.length) {
            i = 0;
            j++;
          }
        }
    
        if (i == 0) {
          j--;
          i = this.deltas.length - 1;
        } else {
          i--;
        }
        this.delta = Math.pow(10, j) * this.deltas[i];
      }
    
      updatePos(): void {
        this.first = Math.ceil(this.unitStart / this.delta - 1) * this.delta;
        if (this.first < 0) this.first = 0;
      }
    
      updateAll(): void {
        this.updateDelta();
        this.updatePos();
      };
    
      drawOnCanvas(): void {
        this.ctxAx.clearRect(0, 0, this.w, this.h);
        this.ctxAx.beginPath();
    
        for (
          let i: number = 0;
          this.first + i * this.delta <= this.unitEnd &&
          this.first + i * this.delta <= audio.duration;
          i++
        ) {
          let value: number = Math.round((this.first + i * this.delta) * 1000) / 1000;
          let pos: number = ((value - this.unitStart) / this.rConv) * this.r;
          let time: Date = new Date(0, 0, 0, 0, 0, 0, 0);
    
          let timeStr: string = timeToStr(time, value);
    
          this.ctxAx.strokeStyle = "black";
          this.ctxAx.moveTo(pos, 0);
          this.ctxAx.lineTo(pos, 10);
    
          let sub: number = 1 / 4;
    
          for (let k: number = 1; k * sub < 1; k++) {
            let frac: number = Math.round(sub * k * 10000) / 10000;
            let halfValue: number =
              Math.round((this.first + (i + frac) * this.delta) * 100000) / 100000;
            if (halfValue <= audio.duration) {
              let halfPos: number = ((halfValue - this.unitStart) / this.rConv) * this.r;
    
              this.ctxAx.strokeStyle = "black";
              this.ctxAx.moveTo(halfPos, 0);
              let len: number = 6;
              if (frac == 0.5) {
                len = 8;
              }
    
              this.ctxAx.lineTo(halfPos, len);
            }
          }
    
          this.ctxAx.font = fontSize + "px Roboto";
    
          if (this.unitEnd - value <= this.delta / 6) {
            this.ctxAx.textAlign = "right";
          } else if (value - this.unitStart <= this.delta / 6) {
            this.ctxAx.textAlign = "left";
          } else {
            this.ctxAx.textAlign = "center";
          }
    
          this.ctxAx.strokeText(timeStr, pos, 30);
    
          this.ctxAx.lineWidth = 1;
        }
        this.ctxAx.moveTo(0, 0);
        this.ctxAx.lineTo(this.w, 0);
    
        this.ctxAx.stroke();
      };
    }