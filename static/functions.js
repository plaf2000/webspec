<<<<<<< HEAD
=======
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


>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
function getAudio() {
  var fnameURI = encodeURIComponent(fname);
  var url = '/webspec/audio/?f='+fnameURI;
  window.audio = new Audio('http://localhost/ZOOM0043.WAV');
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
<<<<<<< HEAD
=======

>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
  for(var i =0; i<detections.length; i++) {
    detections[i].update();
  }

<<<<<<< HEAD
=======
  // if(hoverI)  {
  //
  // }



>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f

}

function zoomCanvas(dir,x,y,shiftPressed) {
  clearCanvas();

  var ratio=Math.pow(zoomRatio,dir);

  view.zoom(dir,ratio,x,y,shiftPressed);
<<<<<<< HEAD

=======
  updateMemory();
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f

  axes.updateAll();
  tinfo.update();

  drawCanvas();
<<<<<<< HEAD
=======

  if(hoverI!='') {

    detections[hoverI].updateCssLabel();
  }






>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
}

function panView(x,y) {
  clearCanvas();

  view.pan(x,y);
  axes.updatePos();
  tinfo.update();

<<<<<<< HEAD
=======
  updateMemory();

>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f

  drawCanvas();
}


function moveViewTo(x,y,xT,yF) {

  view.moveTo(xPx=x,yPx=y,xT=xT,yF=yF);
<<<<<<< HEAD
=======
  updateMemory();

>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f

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

<<<<<<< HEAD
=======
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
  console.log("Loading");
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

          }
        );
}

>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f

function updateVal(nfftChanged) {

  window.sr = 48000;
  window.wfft=parseInt($("#wfft").val());
  window.nfft=parseInt($("#nfft").val());
  window.lf=parseInt($("#lf").val());
  window.hf=parseInt($("#hf").val());
  window.offset=parseInt($("#offset").val());
  if(nfftChanged || wfft>nfft) {
    $('#wfft option[value="' + nfft + '"]').prop('selected',true);
    window.wfft=nfft;
  }
  window.channel=$("input[name=channels]:checked").val();
  window.sens=parseInt($("#sens").val());
  window.con=parseInt($("#con").val());
  window.dur=cvs.width*dfn/sr/4
  window.sPx = dfn/sr/4;
  window.HzPx = (hf-lf)/cvs.height;

}

<<<<<<< HEAD
function request(offset,duration = dur) {
=======
function requestSpec(offset,duration = dur) {
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f

  window.requestPending=true;

  return $.get(
      '/webspec/spec/',
      {
        fname: fname,
        offset: offset,
        lf: lf,
        hf: hf,
        dur: duration,
        ch: channel,
        sens: sens,
        con: con,
        nfft: nfft,
        wfft: wfft,
        sr: sr,
        spx: sPx
      });
}

function updateCanvas() {



  ctx.save();
  view.pan(0,0);
  axes.updateAll();


  var is = [];

  for (var i = 0; i < specImgs.length; i++) {
    is[i] = i;
  }

  is.sort(function(a, b) {
    return Math.abs(a - view.actualI) - Math.abs(b - view.actualI);
  });

  $.each(specImgs,function(index) {
    $("#loading").show();

    var i = is[index];
    var specImg = specImgs[i];

<<<<<<< HEAD
    request(specImg.start).done(
=======
    requestSpec(specImg.start).done(
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
      function(data) {

        specImgs[i] = new SpecImg(data,specImg.start);
        requestPending=false;
        if(index==specImgs.length-1) {
          $("#loading").hide();
        }
      }
    );
  });




}

function addToCanvas(offset,left=false,duration=dur) {

  $("#loading").show();


  ctx.save();
<<<<<<< HEAD
  request(offset,dur).done(
=======
  requestSpec(offset,dur).done(
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
    function(data) {
      $("#loading").show();

      var specImg=new SpecImg(data,offset,true,duration);
      (!left) ? specImgs.push(specImg) : specImgs.unshift(specImg);
      requestPending=false;

      if(left){view.origFrame+=1};

    }
  );


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

<<<<<<< HEAD
  // else if(creatingDet) {
  //   var x = e.clientX-specLeft;
  //   var y = e.clientY-specTop;
  //
  //   if(x<mp.x) {
  //     scaleLeftDet = true;
  //   }
  //   else {
  //     scaleRightDet = true;
  //   }
  //
  //   if(y<mp.y) {
  //     scaleTopDet = true;
  //   }
  //   else {
  //     scaleBottomDet = true;
  //   }
  //   detections[detections.length-1].resize(x,y,scaleTopDet,scaleBottomDet,scaleLeftDet,scaleRightDet);
  //
  // }
=======
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
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
<<<<<<< HEAD
   }


=======
     detections[detI].save();

   }



>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
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
  if(resizeClass !="") {
    $("*").removeClass(resizeClass);
  }
  resizeClass = "resize-";
  if (scaleTopDet) { resizeClass += "n"; }
  else if (scaleBottomDet) { resizeClass += "s"; }
  if (scaleLeftDet) { resizeClass += "w"; }
  else if (scaleRightDet) { resizeClass += "e"; }

  if(resizeClass=="resize-") {
    resizeClass="";
  }
  else {
    $("*").addClass(resizeClass);
  }
}
