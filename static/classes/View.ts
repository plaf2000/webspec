class View {
    rx: number = 1;
    ry: number = 1;
    x: number  = 0;
    y: number  = 0;
    detx: number = 0;
    dety: number = 0;
    origOffset: number;
    origFrame: number = 0;
    actualI: number = 0;
  
    start: number;
    end: number;
  
    yf: number = 0;
    tx: number = 0;
  
    txend: number = 0;
    fyend: number = 0;
    
  
    constructor(offset: number) {
      this.origOffset = offset;
      this.start = offset;
      this.end = offset + dur;
    }
  
    zoom(dir: number, ratio: number, x: number, y: number, shiftPressed: boolean) {
      let newRx: number = this.rx * ratio;
      // if(newRx<.018) return;
      newRx =
        Math.round(newRx * Math.pow(10, 12)) / Math.pow(10, 12) == 1 ? 1 : newRx;
  
      let newRy: number = this.ry * ratio;
      newRy =
        Math.round(newRy * Math.pow(10, 12)) / Math.pow(10, 12) <= 1 ? 1 : newRy;
  
      ctx.resetTransform();
  
      let absx: number = this.x + x / this.rx;
      let absy: number = this.y + y / this.ry;
  
      let ry: number = 1;
  
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
  
      ctx.scale(this.rx, this.ry);
  
      var dx = x - absx * this.rx;
      var dy = y - absy * this.ry;
  
      this.pan(dx, dy);
    }
  
    pan(dx: number, dy: number) {
      let x: number = this.x - dx / this.rx;
      let y: number = this.y - dy / this.ry;
  
      this.moveTo(x, y, undefined, undefined);
    }
  
    moveTo(xPx?: number, yPx?: number, xT?: number, yF?: number): void {
      if(!yPx) {
        yPx = yF ? HztoPx(yF) : this.y;
        yF = yF ? yF : this.yf;
      }
  
      if(!xPx) {
        xPx = xT ? HztoPx(xT) : this.x;
        xT = xT ? xT : this.tx;
      }
  
        
  
      if (yPx < 0) {
        yPx = 0;
        yF = hf;
      } else if (yPx + cvs.height / this.ry > cvs.height) {
        yPx = cvs.height * (1 - 1 / this.ry);
        yF = hf - (hf - lf) * (1 - 1 / this.ry);
      }
  
      if (xT + (cvs.width * sPx) / this.rx > audio.duration) {
        xT = audio.duration - (cvs.width * sPx) / this.rx;
        xPx = stoPx(xT);
      }
  
      if (xT < 0) {
        xT = 0;
        xPx = stoPx(0);
      }
  
      let dx: number = this.x - xPx;
      let dy: number = this.y - yPx;
  
      ctx.translate(dx, dy);
  
      this.detx += dx * this.rx;
      this.dety += dy * this.ry;
  
      this.x = xPx;
      this.y = yPx;
  
      this.xend = this.x + cvs.width / this.rx;
      this.yend = this.y + cvs.height / this.ry;
  
      this.tx = xT;
      this.fy = yF;
  
      this.txend = pxtoS(this.xend);
      this.fyend = pxtoHz(this.yend);
  
      while (this.tx < this.start && this.start > 0) {
        // this.start =  ? 0 : this.start-dur;
        // addToCanvas(this.start,true);
        if (this.start > dur) {
          this.start -= dur;
          addToCanvas(this.start, nSpecs, true);
        } else {
          addToCanvas(0, nSpecs, true);
          // addToCanvas(0,true,this.start);
          this.start = 0;
        }
        nSpecs++;
      }
  
      while (this.txend > this.end && this.end < audio.duration) {
        if (this.end + dur < audio.duration) {
          addToCanvas(this.end, nSpecs, false);
          this.end += dur;
        } else {
          addToCanvas(this.end, nSpecs, false, audio.duration - this.end);
          this.end = audio.duration;
        }
        nSpecs++;
      }
  
      this.actualI =
        Math.floor((this.tx + dur / 2 / view.rx - this.origOffset) / dur) +
        this.origFrame;
      if (this.actualI < 0) {
        this.actualI = 0;
      }
      if (this.actualI >= specImgs.length) {
        this.actualI = specImgs.length - 1;
      }
    };
  }