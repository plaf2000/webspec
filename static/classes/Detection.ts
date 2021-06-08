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