class Cursor {
    x: number = 0;
    tx: number = view.origOffset;
    width: number = 12;
    scaledWidth(): number {
      return this.width / view.rx;
    }
  
    set(x: number): void {
      this.x = view.x + x / view.rx;
      this.tx = pxtoS(this.x);
    }
  
    setT(tx: number): void {
      this.tx = tx;
      this.x = stoPx(tx);
    }
  
    relx(): number {
      return (this.x - view.x) * view.rx;
    }
  
    drawOnCanvas(): void {
      var scw = this.scaledWidth();
      var triangleTip = ((this.width / 2) * Math.sqrt(3)) / view.ry;
  
      var grdr = ctx.createLinearGradient(this.x, 0, this.x + scw / 2, 0);
      grdr.addColorStop(0, "black");
      grdr.addColorStop(1, "rgba(170,170,170,0)");
      ctx.fillStyle = grdr;
      ctx.fillRect(this.x, view.y + triangleTip, scw / 2, cvs.height);
  
      var grdl = ctx.createLinearGradient(this.x, 0, this.x - scw / 2, 0);
      grdl.addColorStop(0, "black");
      grdl.addColorStop(1, "rgba(170,170,170,0)");
      ctx.fillStyle = grdl;
      ctx.fillRect(this.x - scw / 2, view.y + triangleTip, scw / 2, cvs.height);
  
      ctx.beginPath();
      ctx.lineWidth = scw / 6;
      ctx.strokeStyle = "#fff";
      ctx.moveTo(this.x, 0);
  
      ctx.lineTo(this.x, cvs.height);
      ctx.stroke();
  
      let l: number =
        (2 * this.width * 2 * Math.cos(Math.atan(view.rx / view.ry))) /
        Math.sqrt(Math.pow(view.rx, 2) + Math.pow(view.ry, 2));
  
      let alpha: number = Math.atan((view.rx / view.ry) * Math.tan(Math.PI / 3));
  
      let t: number = l * Math.cos(alpha);
      let p: number = l * Math.sin(alpha);
  
      let stepOne: number = Math.sqrt(3) / 8;
      let stepTwo: number = stepOne + 5 / 24;
  
      let grdlu: CanvasGradient = ctx.createLinearGradient(
        this.x,
        view.y,
        this.x - p,
        view.y + t
      );
      grdlu.addColorStop(stepOne, "black");
      grdlu.addColorStop(stepTwo, "rgba(170,170,170,0)");
      ctx.fillStyle = grdlu;
      ctx.fillRect(view.x, view.y, this.x - view.x, triangleTip);
  
      let grdru: CanvasGradient = ctx.createLinearGradient(
        this.x,
        view.y,
        this.x + p,
        view.y + t
      );
      grdru.addColorStop(stepOne, "black");
      grdru.addColorStop(stepTwo, "rgba(170,170,170,0)");
      ctx.fillStyle = grdru;
      ctx.fillRect(this.x, view.y, view.xend - this.x, triangleTip);
  
      let grdld: CanvasGradient = ctx.createLinearGradient(
        this.x,
        view.yend,
        this.x - p,
        view.yend - t
      );
      grdld.addColorStop(stepOne, "black");
      grdld.addColorStop(stepTwo, "rgba(170,170,170,0)");
      ctx.fillStyle = grdld;
      ctx.fillRect(view.x, view.yend, this.x - view.x, -triangleTip);
  
      let grdrd: CanvasGradient = ctx.createLinearGradient(
        this.x,
        view.yend,
        this.x + p,
        view.yend - t
      );
      grdrd.addColorStop(stepOne, "black");
      grdrd.addColorStop(stepTwo, "rgba(170,170,170,0)");
      ctx.fillStyle = grdrd;
      ctx.fillRect(this.x, view.yend, view.xend - this.x, -triangleTip);
  
      ctx.moveTo(this.x, view.y);
  
      ctx.beginPath();
      ctx.fillStyle = "#fff";
      ctx.lineTo(this.x - scw / 2, view.y);
      ctx.lineTo(this.x, view.y + triangleTip);
      ctx.lineTo(this.x + scw / 2, view.y);
      ctx.lineTo(this.x, view.y);
      ctx.closePath();
      ctx.fill();
  
      ctx.moveTo(this.x, view.yend);
  
      ctx.beginPath();
      ctx.fillStyle = "#fff";
      ctx.lineTo(this.x - scw / 2, view.yend);
      ctx.lineTo(this.x, view.yend - triangleTip);
      ctx.lineTo(this.x + scw / 2, view.yend);
      ctx.lineTo(this.x, view.yend);
      ctx.closePath();
      ctx.fill();
  
      ctxTinfo.font = fontSize + "px Roboto";
      ctxTinfo.textBaseline = "top";
      ctxTinfo.textAlign = "center";
  
      ctxTinfo.fillStyle = "white";
      ctxTinfo.strokeStyle = "black";
    }
  
    move(): void {
      var timedelta = (sPx / view.rx) * 1000;
  
      this.playInterval = setInterval(function () {
        cursor.setT(audio.currentTime);
        tinfo.update();
  
        drawCanvas();
      }, timedelta);
    }
  
    stop(): void {
      clearInterval(this.playInterval);
    }
  }