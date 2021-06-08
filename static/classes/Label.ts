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