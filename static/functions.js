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
  center = (view.tx+view.txend)/2;
  view.start = view.tx;
  view.end = view.tx;
}

function alternativeClearMemory(clear=false) {
  if(clear) { clearCanvas() };
  specImgs = [];

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

function clearCanvas() {

  ctx.clearRect(view.x, view.y, cvs.width/view.rx, cvs.height/view.ry);
  ctxTinfo.clearRect(0, 0, tinfocvs.width, tinfocvs.height);

}

function drawCanvas() {

  clearCanvas()
  for(var i =0; i<specImgs.length; i++) {
    specImgs[i].drawOnCanvas();
  }

  axes.drawOnCanvas();
  cursor.drawOnCanvas();
  tinfo.drawOnCanvas();

  for(var i =0; i<detections.length; i++) {
    detections[i].update();
  }





}

function zoomCanvas(dir,x,y,shiftPressed) {
  clearCanvas();

  var ratio=Math.pow(zoomRatio,dir);

  view.zoom(dir,ratio,x,y,shiftPressed);
  updateMemory();

  axes.updateAll();
  tinfo.update();

  drawCanvas();

  if(hoverI!='') {

    detections[hoverI].updateCssLabel();
  }
}




function panView(x,y) {
  clearCanvas();

  view.pan(x,y);
  axes.updatePos();
  tinfo.update();

  updateMemory();


  drawCanvas();
}


function moveViewTo(x,y,xT,yF) {
  view.moveTo(xPx=x,yPx=y,xT=xT,yF=yF);
  updateMemory();
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

function updateMemory() {
  var buffer = view.txend-view.tx;
  if(view.tx<memoryStart) {
    loadDetections(view.tx-buffer,memoryStart);
    memoryStart = view.tx-buffer;
  }
  if(view.txend>memoryEnd) {
    loadDetections(memoryEnd,view.txend+buffer);
    memoryEnd = view.txend+buffer;
  }

}

function loadDetections(tStart,tEnd) {
  loading();
  $.get(
        '/det/get',
        {
          ts: tStart,
          te: tEnd
        }).done(
          function(detsToAdd) {
            var lenDet = detections.length;
            for (var i = 0; i < detsToAdd.length; i++) {
              detections[i+lenDet] = new Detection(detsToAdd[i]);
            }
            stopLoading();
          }
        );
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
  window.sPx = dfn/sr/4;
  window.dur = cvs.width*sPx;
  window.HzPx = (hf-lf)/cvs.height;

}

function requestSpec(offset,duration = dur) {
  last = (offset+duration>audio.duration) ? 1 : 0;

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
        last: last
      }
  );
  return request;
}

function updateCanvas() {

  

  axes.updateAll();
  // clearMemory(false);
  alternativeClearMemory(false);
  view.pan(0,0);

  // ctx.save();
  // view.pan(0,0);
  // axes.updateAll();


  // var is = [];

  // for (var i = 0; i < specImgs.length; i++) {
  //   is[i] = i;
  // }

  // is.sort(function(a, b) {
  //   return Math.abs(a - view.actualI) - Math.abs(b - view.actualI);
  // });

  // $.each(specImgs,function(index) {
  //   $("#loading").show();

  //   var i = is[index];
  //   var specImg = specImgs[i];

  //   requestSpec(specImg.start).done(
  //     function(data) {

  //       specImgs[i] = new SpecImg(data,specImg.start);
  //       requestPending=false;
  //       if(index==specImgs.length-1) {
  //         $("#loading").hide();
  //       }
  //     }
  //   );
  // });
  

}

function addToCanvas(offset,left=false,duration=dur) {

  loading();

  ctx.save();
  console.log(offset,duration);
  requestSpec(offset,duration).done(
    function(data) {

      var specImg=new SpecImg(data,offset,true,duration);
      (!left) ? specImgs.push(specImg) : specImgs.unshift(specImg);

      if(left){view.origFrame++};
      stopLoading();

    }
  ).fail(function() {
    stopLoading();
    addToCanvas(offset,left,duration);
  });


}


function stoPx(x) {
  return (x-view.origOffset)/sPx;
}

function pxtoS(x) {
  return x*sPx+view.origOffset;
}

function HztoPx(y) {
  return (hf-y)/HzPx;
}

function pxtoHz(y) {
  return hf-y*HzPx;
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

  if(!$(e.target).hasClass('detection') && !scaleDet) {

    scaleTopDet = false;
    scaleBottomDet = false;
    scaleLeftDet = false;
    scaleRightDet = false;
  }


  if(md) {
    panView(e.clientX-mp.x,e.clientY-mp.y);
    mp.x=e.clientX;
    mp.y=e.clientY;

  }
  else if (moveDet) {
    var x = e.clientX;
    var y = e.clientY;

    detections[detI].move(x-mp.x,y-mp.y);

    mp.x=x;
    mp.y=y;

  }

  else if (scaleDet) {
    if(creatingDet) {
      if(x<mp.x) {
        scaleLeftDet = true;
      }
      else {
        scaleRightDet = true;
      }

      if(y<mp.y) {
        scaleTopDet = true;
      }
      else {
        scaleBottomDet = true;
      }
    creatingDet = false;

    }
    else {
      if(detections[detI].width==0) {
        scaleLeftDet = !scaleLeftDet;
        scaleRightDet = !scaleRightDet;
        detections[detI].width=0;
      }

      if(detections[detI].height==0) {
        scaleTopDet = !scaleTopDet;
        scaleBottomDet = !scaleBottomDet;
        detections[detI].height=0;
      }
    }

    var x = e.clientX-specLeft;
    var y = e.clientY-specTop;
    detections[detI].resize(x,y,scaleTopDet,scaleBottomDet,scaleLeftDet,scaleRightDet);



  }

  else {
    mm=false;

  }

  updateCursorType();
}

function mouseUp(e) {
  if(scaleDet || moveDet) {
     detections[detI].unFocus();
     if(scaleDet) {
       updateCursorType();
     }
     detections[detI].save();

   }



  md=false;
  moveDet=false;
  scaleDet = false;

  scaleTopDet = false;
  scaleBottomDet = false;
  scaleLeftDet = false;
  scaleRightDet = false;

  creatingDet = false;

}

function updateCursorType() {

  current = resizeClass;
  
  resizeClass = "resize-";
  if (scaleTopDet) { resizeClass += "n"; }
  else if (scaleBottomDet) { resizeClass += "s"; }
  if (scaleLeftDet) { resizeClass += "w"; }
  else if (scaleRightDet) { resizeClass += "e"; }

  if(resizeClass!=current) {
    if(current !="") {
      $("*").removeClass(current);
    }
    if(resizeClass=="resize-") {
      resizeClass="";
    }
    else {
      $("*").addClass(resizeClass);
    }
  }  
}
