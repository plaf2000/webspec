import {} from 'functions_ts.js';

const fname     : string = (window as any).fname;
const csrftoken : string = (window as any).csrftoken;
let projectId : number = (window as any).projectId;
let dfn       : number = (window as any).dfn;
let wfft      : number = (window as any).wfft;
let sr        : number = (window as any).sr;
let analysisId: number = (window as any).analysisId;
let zoomRatio : number = (window as any).zoomRatio;


<<<<<<< HEAD














  


=======
class SpecImg {
  base64: string;
  start: number;
  end: number;
  duration: number;
  img: HTMLImageElement;

  constructor(
    base64data: string,
    offset: number,
    adding: boolean = false,
    duration: number = dur
  ) {
    this.base64 = window.btoa(base64data);
    this.start = offset;
    this.end = offset + duration;
    this.duration = duration;
    this.img = new Image();
    this.img.src = "data:image/png;base64," + this.base64;
    this.img.setAttribute(
      "style",
      "-webkit-filter: blur(500px);  filter: blur(500px);"
    );

    this.img.onload = function () {
      drawCanvas();
    };
  }

  drawOnCanvas(): void {
    ctx.drawImage(
      this.img,
      0,
      0,
      this.img.width,
      this.img.height,
      stoPx(this.start),
      0,
      this.duration / sPx,
      window.cvs.height
    );
  }
}

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

class Detection {
  x: number;
  y: number;
  width: number;
  height: number;

  label : Label;
  pinned: boolean;
  manual: boolean;
  id: number;
  tStart: number;
  tEnd: number;
  fStart: number;
  fEnd: number;

  css: object;
  html: string;
  jqueryElement: any; 

  constructor(
    data?: {
      label_id : number;
      pinned: boolean;
      manual: boolean;
      id: number;
      tstart: number;
      tend: number;
      fstart: number;
      fend: number;
    },
    x: number = 0,
    y: number = 0
  ) {
    
    // this.css = "";
    if(data) {
      this.label = new Label(data["label_id"]);
      this.pinned = data && data["pinned"];
      this.manual = data["manual"];
      this.id = data["id"];
      this.tStart = data["tstart"];
      this.tEnd = data["tend"];
      this.fStart = data["fstart"];
      this.fEnd = data["fend"];
      this.append();
      this.update();
    }
    else {
      this.label = new Label(-1);
      this.id=-1;
      this.manual = true;
      this.pinned = false;
      this.x=x;
      this.y=y;
      this.width = 0;
      this.height = 0;
      this.updateTF();
      this.append();
      this.create();
    }
    
  }


  update(): void {
    this.x = (stoPx(this.tStart) - view.x) * view.rx;
    this.y = (HztoPx(this.fEnd) - view.y) * view.ry;

    this.width = (stoPx(this.tEnd) - view.x) * view.rx - this.x;
    this.height = (HztoPx(this.fStart) - view.y) * view.ry - this.y;

    this.updateCss();
  }

  updateCssLabel(): void {
    var labelHeight = this.label.jqueryElement.outerHeight();

    if (this.y < labelHeight) {
      if (cvs.height - (this.height + this.y) < labelHeight) {
        this.label.updatePos("top-inside", -this.y);
      } else {
        this.label.updatePos("bottom");
      }
    } else {
      this.label.updatePos("top");
    }
  }

  updateCss(): void {
    if (this.tEnd >= view.tx && this.tStart <= view.txend) {
      this.css = {
        display: "block",
        left: this.x + "px",
        top: this.y + "px",
        width: this.width + "px",
        height: this.height + "px",
      };
      this.jqueryElement.css(this.css);
    } else {
      this.css = { display: "none" };
      this.jqueryElement.css(this.css);
    }
  }

  addClass(className: string): void {
    this.jqueryElement.addClass(className);
  }

  removeClass(className: string): void {
    this.jqueryElement.removeClass(className);
  }
  
  focus(): void {
    this.addClass("focus");
  }

  unFocus(): void {
    this.removeClass("focus");
  }

  updateTF(): void {
    this.tStart = pxtoS(this.x / view.rx + view.x);
    this.fEnd = pxtoHz(this.y / view.ry + view.y);

    this.tEnd = pxtoS((this.width + this.x) / view.rx + view.x);
    this.fStart = pxtoHz((this.height + this.y) / view.ry + view.y);
  }

  resize(
     x: number,
     y: number,
     t: boolean,
     b: boolean,
     l:boolean,
     r: boolean
    ) : void {
    this.manual = true;

    let xend: number = this.x + this.width;
    let yend: number = this.y + this.height;

    if (l) {
      this.x = x;
    } else if (r) {
      xend = x;
    }
    this.width = xend - this.x;

    if (this.width < 0) {
      this.width = 0;
      if (l) {
        this.x = xend;
      }
    }

    if (t) {
      this.y = y;
    } else if (b) {
      yend = y;
    }
    this.height = yend - this.y;

    if (this.height < 0) {
      this.height = 0;
      if (t) {
        this.y = yend;
      }
    }

    xend = this.x + this.width;
    yend = this.y + this.height;

    this.updateTF();

    if (this.tStart < 0) {
      this.tStart = 0;
    }
    if (this.tEnd > audio.duration) {
      this.tEnd = audio.duration;
    }
    if (this.fEnd > hf) {
      this.fEnd = hf;
    }
    if (this.fStart < lf) {
      this.fStart = lf;
    }

    this.update();
    this.updateCssLabel();
  }

  move(dx: number, dy: number): void {
    this.manual = true;

    var deltaT = this.tEnd - this.tStart;
    var deltaF = this.fEnd - this.fStart;

    this.x += dx;
    this.y += dy;

    this.updateTF();

    if (this.tStart < 0) {
      this.tStart = 0;
      this.tEnd = deltaT;
    }

    if (this.tEnd > audio.duration) {
      this.tEnd = audio.duration;
      this.tStart = this.tEnd - deltaT;
    }

    if (this.fEnd > hf) {
      this.fEnd = hf;
      this.fStart = this.fEnd - deltaF;
    }

    if (this.fStart < lf) {
      this.fStart = lf;
      this.fEnd = this.fStart + deltaF;
    }

    this.update();
    this.updateCssLabel();
  }
  
  append(): void {
    this.html = '<div class="detection" id="' + this.id + '"></div>';
    $("#spec-td").append(this.html);
    this.jqueryElement = $(".detection#" + this.id);

    this.label.append(this.jqueryElement);
  }

  setId(id: number): void {
    this.id = id;
    this.jqueryElement.attr("id", id);
  }

  getData(): {
      id: number,
      pinned: boolean,
      manual: boolean,
      tstart: number,
      tend: number,
      fstart: number,
      fend: number,
      analysisid: number,
      labelid: number,
  } {
    return {
      id = this.id,
      pinned = this.pinned,
      manual = this.manual,
      tstart = this.tStart,
      tend = this.tEnd,
      fstart = this.fStart,
      fend = this.fEnd,
      analysisid = analysisId,
      labelid = this.label.id()
    };
  }

  create(): void {
    this.manual = true;
    var det = this;
    $.ajax({
      url: "/det/create/",
      method: "POST",
      headers: { "X-CSRFToken": csrftoken },
      data: det.getData(),
    })
      .done(function (response) {
        det.setId(response.id);
        det.label.setId(response.id);
        det.save();
      })
      .fail(function (error) {
        console.log(error);
      });
      
  }

  save(): void {
    if (this.id != -1) {
      this.manual = true;
      var det = this;

      $.ajax({
        url: "/det/save/",
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        data: det.getData(),
      })
        .done(function (response) {
          // console.log(response);
        })
        .fail(function (error) {
          throw {message: error}; 
        });
    }
  }

  delete(): void {
    var det = this;
    $.ajax({
      url: "/det/delete/",
      method: "POST",
      headers: { "X-CSRFToken": csrftoken },
      data: { id: det.id },
    })
      .done(function (response) {
        det.jqueryElement.fadeOut(400, function () {
          this.remove();
        });
      })
      .fail(function (error) {
        console.log(error);
      });
  }
}

class Label {

  position: string;
  html: string;
  jqueryElement: any;


  constructor(id: number, position: string = "top") {
    this.position = position;
    this.html =
      '<div class="label ' +
      this.position +
      '"><span class="label-text"><div class="id" contenteditable="true">' +
      id +
      '</div></span><span><div class="delete-det"></div></span></div>';
  }
  
  append(detectionJQuery: any): void {
    detectionJQuery.append(this.html);
    this.jqueryElement = detectionJQuery.find(".label");
  };

  updatePos(position: string, translationY: boolean = false): void {
    if (typeof this.jqueryElement != "undefined") {
      this.jqueryElement.removeClass(this.position);
      this.jqueryElement.addClass(position);
      if (translationY) {
        this.jqueryElement.css({
          top: translationY,
        });
      } else {
        this.jqueryElement.css({
          top: "auto",
        });
      }
    }

    this.position = position;
  };

  id(): number {
    var id = parseInt(this.jqueryElement.find(".id").html());
    return isNaN(id) ? 0 : id;
  };

  setId(id: number) {
    this.jqueryElement.find(".id").html(id);
  };
}

class Tinfo {
  cursor: {
    x: number,
    timeStr: number,
    tx: number
  };

  constructor() {
    this.update();
  }
  
  update(): void {
    this.cursor.x = cursor.relx();
    let time = new Date(0, 0, 0, 0, 0, 0, 0);
    this.cursor.timeStr = timeToStr(time, cursor.tx, true);
  }

  drawOnCanvas(): void {
    let margin = 10;
    let l = 20;

    ctxTinfo.fillStyle = "white";
    ctxTinfo.strokeStyle = "black";

    if (this.cursor.x < 0) {
      ctxTinfo.beginPath();
      ctxTinfo.moveTo(margin, tinfocvs.height / 2);
      ctxTinfo.lineTo(
        margin + (l * Math.sqrt(3)) / 2,
        tinfocvs.height / 2 - l / 2
      );
      ctxTinfo.lineTo(
        margin + (l * Math.sqrt(3)) / 2,
        tinfocvs.height / 2 + l / 2
      );
      ctxTinfo.lineTo(margin, tinfocvs.height / 2);

      ctxTinfo.stroke();
    } else if (this.cursor.x > tinfocvs.width) {
      ctxTinfo.beginPath();

      ctxTinfo.moveTo(tinfocvs.width - margin, tinfocvs.height / 2);
      ctxTinfo.lineTo(
        tinfocvs.width - (margin + (l * Math.sqrt(3)) / 2),
        tinfocvs.height / 2 - l / 2
      );
      ctxTinfo.lineTo(
        tinfocvs.width - (margin + (l * Math.sqrt(3)) / 2),
        tinfocvs.height / 2 + l / 2
      );
      ctxTinfo.lineTo(tinfocvs.width - margin, tinfocvs.height / 2);

      ctxTinfo.stroke();
    } else {
      ctxTinfo.font = fontSize + "px Roboto";
      ctxTinfo.textBaseline = "top";
      ctxTinfo.strokeText(
        this.cursor.timeStr,
        this.cursor.x,
        tinfocvs.height - fontSize
      );
    }
  }
}

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

class Axes {
  deltas: number[] = [1, 2, 5];

  x: xAx = new xAx(this);
  y: yAx = new yAx(this);

  constructor() {
    this.updateAll();
    this.drawOnCanvas();
  }

  updateAll(): void {
    this.x.updateAll();
    this.y.updateAll();
  };

  updatePos(): void {
    this.x.updatePos();
    this.y.updatePos();
  };

  drawOnCanvas(): void {
    this.x.drawOnCanvas();
    this.y.drawOnCanvas();
  };

}

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
>>>>>>> master
  
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
