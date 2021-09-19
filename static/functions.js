function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}




function clearMemory(clear=false) {
  if(clear) { clearCanvas() };
  specImgs = [];
  window.nSpecs=0;
  // $.get('clear/');

  k=Math.ceil(view.tx/dur);
  view.start = k*dur;
  view.end = k*dur;
}




function loading() {
  $("#loading").show();
  pending.push(true);
}

function stopLoading() {
  pending.pop();
  if(pending.length == 0){ $("#loading").hide() };
}


function getAudio() {
  var fnameURI = encodeURIComponent(fname);
  var url = '/audio/?f='+fnameURI;
  window.audio = new Audio(url);
  audio.onloadeddata = function() {
    this.currentTime = offset;
  };
  audio.onplay = function() {
    cursor.move();
  };
  audio.onpause = function() {
    cursor.stop();
  }
}

function clearAll() {
  // console.log("clearing");
  ctx.save();
  ctx.resetTransform();
  ctx.clearRect(0,0,cvs.width,cvs.height);
  ctx.restore();

}

function clearInfos() {
  axes.clear();
  tinfo.clear();
}

function drawSpecBorder() {
  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "black";
  ctx.rect(fqwidth,tinfocvsheight,cvswidth,cvsheight);
  ctx.stroke();
}

function drawCanvas() {


  clearAll();
  ctx.save();
  

  for(var i =0; i<specImgs.length; i++) {
    specImgs[i].drawOnCanvas();
  }



  

  ctx.resetTransform();
  detections.drawOnCanvas();


  cursor.drawOnCanvas();

  detections.drawOnFocusOnCanvas();

  clearInfos();
  drawSpecBorder();

  axes.drawOnCanvas();
  tinfo.drawOnCanvas();

  ctx.restore();

}



function zoomCanvas(dir,x,y,shiftPressed) {
  // clearCanvas();

  var ratio=Math.pow(zoomRatio,dir);

  view.zoom(dir,ratio,x,y,shiftPressed);

  axes.updateAll();
  tinfo.update();

  drawCanvas();

  if(!audio.paused) {
    audio.pause();
    audio.play();
  }

}




function panView(x,y) {
  // clearAll();

  view.pan(x,y);
  axes.updatePos();
  tinfo.update();



  drawCanvas();
}


function moveViewTo(x,y,xT,yF) {
  view.moveTo(xPx=x,yPx=y,xT=xT,yF=yF);
  drawCanvas();
}

function setCursor(x) {
  cursor.set(x);
  audio.currentTime = cursor.tx;
  tinfo.update();


  drawCanvas();
}

function setMarker(x,marker) {
  marker.set(x);
  tinfo.update();


  drawCanvas();
}




function updateVal(nfftChanged) {
  
  window.wfft=parseInt($("#wfft").val());
  window.nfft=parseInt($("#nfft").val());
  window.lf=parseInt($("#lf").val());
  window.hf=parseInt($("#hf").val());
  window.offset=parseInt($("#offset").val());
  if(nfftChanged || wfft>nfft) {
    $('#wfft option[value="' + nfft + '"]').prop('selected',true);
    window.wfft=nfft;
  }
  window.channel = ($("input[name=channels]").length>0) ? $("input[name=channels]:checked").val() : "mono";
  window.sens=parseInt($("#sens").val());
  window.con=parseInt($("#con").val());
  // window.sPx = dfn/sr/4;
  window.dur = 15;
  window.sPx= dur/cvswidth;
  window.HzPx = (hf-lf)/cvsheight;

}

function requestSpec(offset,i,duration = dur) {
  last = (offset+duration>audio.duration) ? 1 : 0;
  factor=1;

  var request = $.get(
      'spec/',
      {
        offset: offset,
        lf: lf,
        hf: hf,
        dur: duration,
        ch: channel,
        sens: sens,
        con: con,
        nfft: nfft,
        wfft: wfft,
        spx: sPx,
        last: last,
        i: i,
        factor : factor
      }
  );
  return request;
}

function updateCanvas() {

  

  axes.updateAll();
  clearMemory(false);
  view.pan(0,0);
  

}

function addToCanvas(offset,i,left=false,duration=dur) {

  loading();

  ctx.save();
  requestSpec(offset,i,duration).done(
    function(data) {

      var specImg=new SpecImg(data,offset,true,duration);
      (!left) ? specImgs.push(specImg) : specImgs.unshift(specImg);

      if(left){view.origFrame++};
      stopLoading();

    }
  ).fail(function() {
    stopLoading();
    addToCanvas(offset,i,left,duration);
  });


}


function stoPx(x) {
  return ((x-view.origOffset)/sPx)+fqwidth/view.rx;
}

function pxtoS(x) {
  return (x-fqwidth/view.rx)*sPx+view.origOffset;
}

function HztoPx(y) {
  return (hf-y)/HzPx+tinfocvsheight/view.ry;
}

function pxtoHz(y) {
  return hf-(y-tinfocvsheight/view.ry)*HzPx;
}

function timeToStr(time,value,cs=false) {
  var s=parseInt(value);
  var ms=(value-s);
  time.setSeconds(s);
  var sms=String(Math.round((time.getSeconds()+ms)*1000)/1000);
  if(cs) {
    if(sms.indexOf(".")==-1) {
      sms+=".";
    }
    while(sms.split(".")[1].length<3) {
      sms+="0";
    }
  }

  var timeStr = "";
  var timeArray = [time.getHours(),time.getMinutes(),sms]
  for (var j = 0; j < timeArray.length; j++) {
    var unit = String(timeArray[j]);
    var unitLength = (j==2) ? unit.split(".")[0].length : unit.length;
    if(timeArray[j]==0) {
      if(timeStr!="") {
        timeStr+="00";
        if(j<2) {
          timeStr+=":";
        }
      }
      else if (j==2) {
        timeStr+=0;
      }
    }
    else {
      if(unitLength<2&&timeStr!="") {
        timeStr+="0"+unit;
      }
      else {
        timeStr+=unit;
      }
      if(j<2) {
        timeStr+=":";
      }

    }
  }
  return timeStr;
}

function mouseMove(e) {

  mm=true;

  if(detections.resizing) {
    detections.resize(e.offsetX,e.offsetY);
    drawCanvas();
  }
  else {
    let upt, uf
    if(detections.hover(e.offsetX, e.offsetY)) {
      upt = updateCursorType(detections.checkResize(e.offsetX, e.offsetY))
      uf = updateFocus(true)
    }
    else {
      upt = updateCursorType("auto")
      uf = updateFocus(false)
    }
    
    if(uf || upt) {
      drawCanvas();
    }
  }

  if(md) {
    panView(e.clientX-mp.x,e.clientY-mp.y);
    mp.x=e.clientX;
    mp.y=e.clientY;
    drawCanvas();
  }

  else {
    mm=false;

  }

  
  
}

function mouseUp(e) {
  if(detections.resizing) {
     detections.stopResize();
   }
  else if(!mm) {
    setCursor(e.offsetX);
  }


  mm=false;
  md=false;
  moveDet=false;
  scaleDet = false;

  scaleTopDet = false;
  scaleBottomDet = false;
  scaleLeftDet = false;
  scaleRightDet = false;

  creatingDet = false;

}

function updateCursorType(newType) {
  if(newType!=cursorType) {
    console.log(newType,"!=",cursorType)
    $("#spec").css("cursor",newType);
    window.cursorType=newType;
    return true
  }
  return false
}

function updateFocus(f) {
  if(f!=focusSomething) {
    focusSomething = f
    return true
  }
} 
