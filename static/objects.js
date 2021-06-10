function SpecImg(base64data,offset,adding=false,duration=dur) {
  this.base64=window.btoa(base64data);
  this.start=offset;
  this.end=offset+duration;
  this.duration = duration;
  this.img=new Image;
  this.img.src = 'data:image/png;base64,'+this.base64;
  this.img.style="-webkit-filter: blur(500px);  filter: blur(500px);";

  var parent=this;
  this.img.onload = function() {
    parent.width=this.width;
    parent.height=this.height;
    drawCanvas();
  };

  this.drawOnCanvas = function() {
    ctx.drawImage(this.img, stoPx(this.start), HztoPx(hf), this.duration/sPx, window.cvsheight);
  };
}

function Cursor() {
  this.xstart=fqwidth;
  this.xend=fqwidth+cvswidth;
  this.ystart=tinfocvsheight;
  this.yend=tinfocvsheight+cvsheight;
  this.width = 12;

  this.updatePos = function() {
    this.x = (this.tx-view.tx)/sPx*view.rx+this.xstart;
  }

  this.updateTime = function() {
    this.tx = (this.x-this.xstart)/view.rx*sPx+view.tx;
  }

  this.set = function(x) {
    this.x=(x<this.xstart) ? this.xstart : x;
    this.updateTime();
  };

  this.setT = function(tx) {
    this.tx=(tx<0) ? 0 : tx;
    this.updatePos();
  };

  this.setT(offset);


  


  this.drawOnCanvas = function() {

    this.updatePos();




    var triangleTip =(this.width/2*Math.sqrt(3));


    var grdr = ctx.createLinearGradient(this.x, 0, this.x+this.width/2, 0);
    grdr.addColorStop(0, "black");
    grdr.addColorStop(1, "rgba(170,170,170,0)");
    ctx.fillStyle = grdr;
    ctx.fillRect(this.x, this.ystart+triangleTip, this.width/2, cvsheight-2*triangleTip);

    var grdl = ctx.createLinearGradient(this.x, 0, this.x-this.width/2, 0);
    grdl.addColorStop(0, "black");
    grdl.addColorStop(1, "rgba(170,170,170,0)");
    ctx.fillStyle = grdl;
    ctx.fillRect(this.x-this.width/2, this.ystart+triangleTip, this.width/2, cvsheight-2*triangleTip);

    ctx.beginPath();
    ctx.lineWidth = this.width/6;
    ctx.strokeStyle = "#fff";
    ctx.moveTo(this.x, this.ystart);

    ctx.lineTo(this.x, this.yend);
    ctx.stroke();



    var l = 2 * this.width;

    var alpha = Math.PI/3;


    var t = l*Math.cos(alpha);
    var p = l*Math.sin(alpha);

    var stepOne = Math.sqrt(3)/8;
    var stepTwo = stepOne+5/24;




    var grdlu = ctx.createLinearGradient(this.x, this.ystart, this.x-p, this.ystart+t);
    grdlu.addColorStop(stepOne, "black");
    grdlu.addColorStop(stepTwo, "rgba(170,170,170,0)");
    ctx.fillStyle = grdlu;
    ctx.fillRect(this.xstart, this.ystart, this.x-this.xstart, triangleTip);

    var grdru = ctx.createLinearGradient(this.x, this.ystart, this.x+p, this.ystart+t);
    grdru.addColorStop(stepOne, "black");
    grdru.addColorStop(stepTwo, "rgba(170,170,170,0)");
    ctx.fillStyle = grdru;
    ctx.fillRect(this.x, this.ystart, this.xend-this.x, triangleTip);

    var grdld = ctx.createLinearGradient(this.x, this.yend, this.x-p, this.yend-t);
    grdld.addColorStop(stepOne, "black");
    grdld.addColorStop(stepTwo, "rgba(170,170,170,0)");
    ctx.fillStyle = grdld;
    ctx.fillRect(this.xstart, this.yend, this.x-this.xstart, -triangleTip);

    var grdrd = ctx.createLinearGradient(this.x, this.yend, this.x+p, this.yend-t);
    grdrd.addColorStop(stepOne, "black");
    grdrd.addColorStop(stepTwo, "rgba(170,170,170,0)");
    ctx.fillStyle = grdrd;
    ctx.fillRect(this.x, this.yend, this.xend-this.x, -triangleTip);

    ctx.moveTo(this.x,this.ystart);


    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.lineTo(this.x-this.width/2, this.ystart);
    ctx.lineTo(this.x, this.ystart+triangleTip);
    ctx.lineTo(this.x+this.width/2, this.ystart);
    ctx.lineTo(this.x, this.ystart);
    ctx.closePath();
    ctx.fill();

    ctx.moveTo(this.x,this.yend);

    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.lineTo(this.x-this.width/2, this.yend);
    ctx.lineTo(this.x, this.yend-triangleTip);
    ctx.lineTo(this.x+this.width/2, this.yend);
    ctx.lineTo(this.x, this.yend);
    ctx.closePath();
    ctx.fill();

    ctx.font = fontSize+"px Roboto";
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    // ctx.lineWidth = 2;

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";



  };

  this.move = function() {
    var timedelta = (sPx/view.rx)*1000;


    this.playInterval = setInterval(function() {
      cursor.setT(audio.currentTime);
      tinfo.update();

      drawCanvas();
    }, timedelta);
  };

  this.stop = function() {
    clearInterval(this.playInterval);
  }
}



function Detection(data,x=false,y=false) {

  this.update = function() {
    this.x = (stoPx(this.tStart)-view.x)*view.rx;
    this.y = (HztoPx(this.fEnd)-view.y)*view.ry;

    this.width = (stoPx(this.tEnd)-view.x)*view.rx-this.x;
    this.height = (HztoPx(this.fStart)-view.y)*view.ry-this.y;


    this.updateCss();

  };

  this.updateCssLabel = function() {
    var labelHeight = this.label.jqueryElement.outerHeight();

    if(this.y<labelHeight) {
      if(cvsheight-(this.height+this.y)<labelHeight){
        this.label.updatePos('top-inside',-this.y);
      }
      else{this.label.updatePos('bottom');}
    }
    else { this.label.updatePos('top'); }
  };

  this.updateCss = function() {
    if(this.tEnd>=view.tx && this.tStart<=view.txend) {


      this.css = {
        'display': 'block',
        'left': this.x+'px',
        'top': this.y+'px',
        'width': this.width+'px',
        'height': this.height+'px'
      };

      this.jqueryElement.css(this.css);

    }


    else {
      this.css={"display": 'none'};
      this.jqueryElement.css(this.css);
    }
  };

  this.addClass = function(className) {
    this.jqueryElement.addClass(className);
  }

  this.removeClass = function(className) {
    this.jqueryElement.removeClass(className);
  }
  this.focus = function() {
    this.addClass("focus");
  }
  this.unFocus = function() {
    this.removeClass("focus");

  }


  this.updateTF = function() {
    this.tStart = pxtoS(this.x/view.rx+view.x);
    this.fEnd = pxtoHz(this.y/view.ry+view.y);

    this.tEnd = pxtoS((this.width+this.x)/view.rx+view.x);
    this.fStart = pxtoHz((this.height+this.y)/view.ry+view.y);
  }


  this.resize = function(x,y,t,b,l,r) {
    this.manual = true;


    this.xend=this.x+this.width;
    this.yend=this.y+this.height;

    if(l) { this.x = x; }
    else if(r) { this.xend = x; }
    this.width = this.xend-this.x;

    if(this.width < 0) {
      this.width =0;
      if(l) {this.x = this.xend;}
    }

    if(t) { this.y = y; }
    else if(b) { this.yend = y; }
    this.height = this.yend-this.y;

    if(this.height < 0) {
      this.height =0;
      if(t) {this.y = this.yend;}
    }

    this.xend=this.x+this.width;
    this.yend=this.y+this.height;


    this.updateTF();

    if(this.tStart<0) { this.tStart=0; }
    if(this.tEnd>audio.duration) { this.tEnd=audio.duration; }
    if(this.fEnd>hf) { this.fEnd=hf; }
    if(this.fStart<lf) { this.fStart=lf; }

    this.update();
    this.updateCssLabel();

  }

  this.move = function(dx,dy) {
    this.manual = true;


    var deltaT = this.tEnd - this.tStart;
    var deltaF = this.fEnd - this.fStart;

    this.x+=dx;
    this.y+=dy;

    this.updateTF();


    if(this.tStart<0) {
      this.tStart=0;
      this.tEnd=deltaT;
    }

    if(this.tEnd>audio.duration) {
      this.tEnd=audio.duration;
      this.tStart=this.tEnd-deltaT;
    }

    if(this.fEnd>hf) {
      this.fEnd=hf;
      this.fStart=this.fEnd-deltaF;
    }

    if(this.fStart<lf) {
      this.fStart=lf;
      this.fEnd=this.fStart+deltaF;
    }


    this.update();
    this.updateCssLabel();

  };

  this.append = function() {
    this.html = '<div class="detection" id="'+this.id+'"></div>';
    $("#spec-td").append(this.html);
    this.jqueryElement = $(".detection#"+this.id);

    this.label.append(this.jqueryElement);

  };

  this.setId = function(id) {
    this.id = id;
    this.jqueryElement.attr("id",id);
  };

  this.getData = function() {
    return {
      id: this.id,
      pinned: this.pinned,
      manual: this.manual,
      tstart: this.tStart,
      tend: this.tEnd,
      fstart: this.fStart,
      fend: this.fEnd,
      analysisid: analysisId,
      labelid: this.label.id()
    };
  };

  this.create = function() {
    this.manual = true;
    var det = this;
    $.ajax({

      url: '/det/create/',
      method: "POST",
      headers: {'X-CSRFToken': csrftoken},
      data: det.getData(),

    }).done(
          function(response) {
            det.setId(response.id);
            det.label.setId(response.id);
            det.save();
          }
    ).fail(
          function (error) {
            console.log(error);
          }
    );
  };

  this.save = function() {
    if(this.id!="adding") {
      this.manual = true;
      var det = this;

      $.ajax({
        url: '/det/save/',
        method: "POST",
        headers: {'X-CSRFToken': csrftoken},
        data: det.getData(),

      }).done(
        function(response) {
          // console.log(response);
        }
      ).fail(
        function (error) {
          console.log(error);
        }
      );

    }
  };


  this.delete = function() {
    var det = this;
    $.ajax({

      url: '/det/delete/',
      method: "POST",
      headers: {'X-CSRFToken': csrftoken},
      data: { id: det.id },

    }).done(
          function(response) {
            det.jqueryElement.fadeOut(400, function(){ this.remove(); });

          }
    ).fail(
          function (error) {
            console.log(error);
          }
    );
  };

  if(data) {
    this.label = new Label(data["label_id"]);
    this.pinned = data["pinned"];
    this.maual = data["manual"];
    this.id = data["id"];
    this.tStart = data["tstart"];
    this.tEnd = data["tend"];
    this.fStart = data["fstart"];
    this.fEnd = data["fend"];
    this.append();
    this.update();
  }

  else {
    this.label = new Label("adding");
    this.id="adding";
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

function Label(id,position="top") {

  this.position=position;
  this.html='<div class="label '+this.position+'"><span class="label-text"><div class="id" contenteditable="true">'+id+'</div></span><span><div class="delete-det"></div></span></div>';
  this.append = function(detection) {
    detection.append(this.html);
    this.jqueryElement = detection.find(".label");
  };


  this.updatePos = function(position,translationY=false) {
    if(typeof this.jqueryElement != "undefined") {
      this.jqueryElement.removeClass(this.position);
      this.jqueryElement.addClass(position);
      if(translationY) {
        this.jqueryElement.css({
          'top' : translationY
        });
      }
      else {
        this.jqueryElement.css({
          'top' : 'auto'
        });
      }
    }

    this.position = position;
  };

  this.id = function() {
    var id = parseInt(this.jqueryElement.find(".id").html());
    return isNaN(id) ? 0 : id;
  };

  this.setId = function(id) {
    this.jqueryElement.find(".id").html(id);

  };

}

function Tinfo() {
  this.update = function() {
    var time = new Date(0,0,0,0,0,0,0);
    this.timeStr = timeToStr(time,cursor.tx,true);
  };

  this.clear = function() {
    ctx.clearRect(0,0,tinfocvswidth+fqwidth,tinfocvsheight);
  }

  this.drawOnCanvas = function() {

    var margin = 10;
    var l =20;

    ctx.fillStyle="white";
    ctx.strokeStyle="black";

    this.xstart = fqwidth;
    this.xend = fqwidth+tinfocvswidth;

    if(cursor.x<this.xstart) {



      ctx.beginPath();
      ctx.moveTo(this.xstart, tinfocvsheight/2);
      ctx.lineTo(this.xstart+l*Math.sqrt(3)/2, tinfocvsheight/2-l/2);
      ctx.lineTo(this.xstart+l*Math.sqrt(3)/2, tinfocvsheight/2+l/2);
      ctx.lineTo(this.xstart, tinfocvsheight/2);

      ctx.stroke();



    }

    else if (cursor.x>this.xend) {


      ctx.beginPath();

      ctx.moveTo(this.xend-margin, tinfocvsheight/2);
      ctx.lineTo(this.xend-(margin+l*Math.sqrt(3)/2), tinfocvsheight/2-l/2);
      ctx.lineTo(this.xend-(margin+l*Math.sqrt(3)/2), tinfocvsheight/2+l/2);
      ctx.lineTo(this.xend-margin, tinfocvsheight/2);

      ctx.stroke();

    }

    else {
      ctx.lineWidth = 1;
      ctx.font = fontSize+"px Roboto";
      ctx.textBaseline = "top";
      ctx.textAlign = "center";
      ctx.strokeText(this.timeStr, cursor.x, tinfocvsheight-fontSize);

    }


  };

  this.update();
}

function View(offset) {

  this.rx=1;
  this.ry=1;
  this.x=0;
  this.y=0;
  this.detx=0;
  this.dety=0;
  this.tx=offset;
  this.origOffset=offset;
  this.origFrame=0;
  this.actualI=0;

  this.start= offset;
  this.end= offset+dur;

  this.zoom = function(dir,ratio,x,y,shiftPressed) {

    

    newRx = this.rx*ratio;
    // if(newRx<.018) return;
    newRx = (Math.round(newRx*Math.pow(10,12))/Math.pow(10,12)==1)? 1 : newRx;

    

    newRy = this.ry*ratio;
    newRy = (Math.round(newRy*Math.pow(10,12))/Math.pow(10,12)<=1)? 1 : newRy;
    
    ctx.resetTransform();

    var absx = this.x+x/this.rx;
    var absy = this.y+y/this.ry;

    var ry=1;

    if (!shiftPressed){
      ry = ratio;
      this.ry = newRy;
     };
    if (newRx<=1){
      ry=1;
      this.ry = 1;
    };

    this.rx = newRx;

    this.x=0;
    this.y=0;

    ctx.scale(this.rx,this.ry);


    var dx=(x-absx*this.rx);
    var dy=(y-absy*this.ry);

    this.pan(dx,dy);

  };
  this.pan = function(dx,dy) {

    x=this.x-dx/this.rx;
    y=this.y-dy/this.ry;


    this.moveTo(xPx=x,yPx=y);

  };

  this.moveTo = function(xPx,yPx,xT,yF) {

    if(xPx===undefined && xT===undefined) {
      xPx = this.x;
      xT = this.tx;
    }
    else {
      xPx = (xPx===undefined) ? this.HztoPx(xT) : xPx;
      xT = (xT===undefined) ? this.pxtoS(xPx) : xT;
    }


    if(yPx===undefined && yF===undefined) {
      yPx = this.y;
      yF = this.yf;
    }
    else {
      yPx = (yPx===undefined) ? this.HztoPx(yF) : yPx;
      yF = (yF===undefined) ? this.pxtoHz(yPx) : yF;
    }

    


    if(yPx<0) {
      yPx = 0;
      yF = hf;
    }

    else if(yPx+cvsheight/this.ry>cvsheight) {
      yPx = cvsheight*(1-1/this.ry);
      yF = hf-(hf-lf)*(1-1/this.ry);
    }

    

    if(xT+dur/this.rx>audio.duration) {
      xT = audio.duration-dur/this.rx;
      xPx=this.stoPx(xT);
    }

    if(xT<0) {
      xT = 0;
      xPx=this.stoPx(0);
    }

    



    var dx=(this.x-xPx);
    var dy=(this.y-yPx);

    

    ctx.translate(dx,dy);

    this.detx+=dx*this.rx;
    this.dety+=dy*this.ry;



    this.x=xPx;
    this.y=yPx;

    this.xend=this.x+cvswidth/this.rx;
    this.yend=this.y+cvsheight/this.ry;


    this.tx=xT;
    this.fy=yF;

    this.txend=this.pxtoS(this.xend);
    this.fyend=this.pxtoHz(this.yend);

    

    while(this.tx<this.start && this.start>0) {
      // this.start =  ? 0 : this.start-dur;
      // addToCanvas(this.start,true);
      if(this.start>dur) {
        this.start-=dur;
        addToCanvas(this.start,nSpecs,true);
      }
      else {
        addToCanvas(0,nSpecs,true);
        // addToCanvas(0,true,this.start);
        this.start=0;
      }
      nSpecs++;
    }


    while(this.txend>this.end && this.end<audio.duration) {
      if(this.end+dur<audio.duration) {
        addToCanvas(this.end,nSpecs,false);
        this.end+=dur;
      }
      else {
        addToCanvas(this.end,nSpecs,false,audio.duration-this.end);
        this.end=audio.duration;
      }
      nSpecs++;
    }


    this.actualI = Math.floor((this.tx+dur/2/view.rx-this.origOffset)/dur) + this.origFrame;
    if(this.actualI<0){this.actualI = 0};
    if(this.actualI>=specImgs.length){this.actualI = specImgs.length-1};



  };

  this.stoPx = function(x) {
    return ((x-view.origOffset)/sPx);
  }
  
  this.pxtoS = function(x) {
    return (x)*sPx+view.origOffset;
  }
  
  this.HztoPx = function(y) {
    return (hf-y)/HzPx;
  }
  
  this.pxtoHz = function(y) {
    return hf-(y)*HzPx;
  }
}

function Axes() {
  this.deltas = [1,2,5];
  var parent = this;

  this.x = new xAx(parent);
  this.y = new yAx(parent);


  this.updateAll = function() {
    this.x.updateAll();
    this.y.updateAll();

  };

  this.updatePos = function() {
    this.x.updatePos();
    this.y.updatePos();

  };

  this.clear = function() {
    this.x.clear();
    this.y.clear();
  }

  this.drawOnCanvas = function() {
    this.x.drawOnCanvas();
    this.y.drawOnCanvas();
  };
  this.updateAll();
  this.drawOnCanvas();
}

function xAx(parent) {

  this.unit= "s";

  this.y = tinfocvsheight+fqheight;
  this.xstart = fqwidth;
  this.xend =   fqwidth+cvswidth;

  

  this.deltas = parent.deltas;
  this.updateDelta = function() {
      var i = 0;
      var j =-2;
      while(Math.pow(10,j)*this.deltas[i]/sPx*view.rx<cvswidth/6) {
        i++;
        if(i==this.deltas.length) {
          i=0;
          j++;
        }
      }

      if(i==0) {
        j--;
        i=this.deltas.length-1;
      }
      else {
        i--;
      }
      this.delta = Math.pow(10,j)*this.deltas[i];
  };

  this.updatePos = function() {
      this.first = Math.ceil(view.tx/this.delta-1)*this.delta;
      if (this.first<0) this.first=0;
  };

  this.updateAll = function() {
    this.updateDelta();
    this.updatePos();
  }


  this.clear = function() {
    ctx.clearRect(0,this.y, timelinewidth+fqwidth+10, timelineheight+10);
  }

  this.drawOnCanvas = function() {
    
    ctx.beginPath();


    for (var i = 0; this.first+i*this.delta <= view.txend && this.first+i*this.delta <= audio.duration; i++) {
      var value = Math.round((this.first+i*this.delta)*1000)/1000;
      var pos = (value-view.tx)/sPx*view.rx+this.xstart;
      var time = new Date(0,0,0,0,0,0,0);

      var timeStr = timeToStr(time,value);



      ctx.strokeStyle = "black";

      if(value>=view.tx) {
        ctx.moveTo(pos, this.y);
        ctx.lineTo(pos, this.y+10);

        ctx.font =fontSize+"px Roboto";
        ctx.textAlign = "center";

        ctx.lineWidth = "1";
        ctx.textBaseline='middle';
        ctx.strokeText(timeStr, pos, this.y+30);
      }
      

      var sub=1/4;

      for (var k = 1; k*sub < 1; k++) {
        var frac = Math.round(sub*k*10000)/10000;
        var halfValue = Math.round((this.first+(i+frac)*this.delta)*100000)/100000;
        if(halfValue<=audio.duration) {
          var halfPos = (halfValue-view.tx)/sPx*view.rx+this.xstart;

          ctx.strokeStyle = "black";
          ctx.moveTo(halfPos, this.y);
          var len = 6;
          if(frac==.5) {
            len=8;
          }

          

          if(halfValue>=view.tx) {
            ctx.lineTo(halfPos, this.y+len);
          }

        }


      }

      
    }

    ctx.moveTo(this.xstart,this.y);
    ctx.lineTo(this.xend,this.y);

    ctx.stroke();

  };
}


function yAx(parent) {

  this.unit= "Hz";

  this.ystart = tinfocvsheight;
  this.yend =  tinfocvsheight+fqheight;
  this.x = fqwidth;

  

  this.deltas = parent.deltas;
  this.updateDelta = function() {
      var i = 0;
      var j =-1;
      while(Math.pow(10,j)*this.deltas[i]/HzPx*view.ry<cvsheight/4) {
        i++;
        if(i==this.deltas.length) {
          i=0;
          j++;
        }
      }

      if(i==0) {
        j--;
        i=this.deltas.length-1;
      }
      else {
        i--;
      }
      this.delta = Math.pow(10,j)*this.deltas[i];
  };

  this.updatePos = function() {
      this.first = Math.ceil(view.fyend/this.delta-1)*this.delta;
      if (this.first<0) this.first=0;
  };

  this.updateAll = function() {
    this.updateDelta();
    this.updatePos();
  }



  this.clear = function() {
    ctx.clearRect(0, 0, fqwidth, fqheight+tinfocvsheight+timelineheight);
  }

  this.inside = function(val) {
    return val<=view.fy && val>=view.fyend;
  }


  this.drawOnCanvas = function() {

    ctx.beginPath();

    for (var i = 0; this.first+i*this.delta <= view.fy; i++) {
      var value = Math.round((this.first+i*this.delta)*1000)/1000;
      var pos = (view.fy-value)/HzPx*view.ry+this.ystart;

      
      if(this.inside(value)) {
        ctx.strokeStyle = "black";
        ctx.moveTo(this.x, pos);
        ctx.lineTo(this.x-10, pos);

        ctx.font =fontSize+"px Roboto";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        ctx.strokeText(value, this.x-15, pos);
      }

      var sub=1/4

      for (var k = 1; k*sub < 1; k++) {
        var frac = Math.round(sub*k*10000)/10000;
        var halfValue = Math.round((this.first+(i+frac)*this.delta)*100000)/100000;
        var halfPos = (view.fy-halfValue)/HzPx*view.ry+this.ystart;
        if(this.inside(halfValue)) {
          ctx.moveTo(this.x, halfPos);
          var len = 6;
          if(frac==.5) {
            len=8;
          }
  
          ctx.lineTo(this.x-len, halfPos);
        }


      }

      


    }
    ctx.stroke();

  };
}
