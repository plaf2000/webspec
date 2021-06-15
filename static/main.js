
$(function(){


  window.fontSize=15;
  var detectionStart = 1570;
  var detectionEnd = 1580;

  

  $('#nfft option[value="' + dfn + '"]').prop('selected',true);
  $('#wfft option[value="' + wfft + '"]').prop('selected',true);



  window.cvs=document.getElementById("spec");
  cvs.width=parseInt(cvs.offsetWidth);
  cvs.height=parseInt(cvs.offsetHeight);
  window.ctx=cvs.getContext("2d");

  window.cvswidth = parseInt(window.innerWidth*96/100-2);
  window.cvsheight=parseInt(window.innerHeight*3/4);

  window.tinfocvswidth = parseInt(window.innerWidth*96/100-2);
  window.tinfocvsheight=parseInt(window.innerHeight/20);




  window.timelinewidth=parseInt(window.innerWidth*96/100-2);
  window.timelineheight=parseInt(window.innerHeight/20);



  window.fqwidth=parseInt(window.innerWidth*4/100);
  window.fqheight=parseInt(window.innerHeight*3/4);


  getAudio();

  updateVal();


  window.pending = [];
  



  window.view = new View(offset);
  window.detections = new Detections();


  window.cursor = new Cursor();
  window.tinfo = new Tinfo();

  var wasEditing;



  window.playing=false;


  window.specImgs=[];
  window.nSpecs = 0;
  addToCanvas(offset,0);
  view.moveTo(xPx=0,yPx=0);

  window.axes = new Axes();

  window.isFirefox = (/Firefox/i.test(navigator.userAgent));

  var border = 10;

  window.mp = {x:0,y:0};
  window.md=false;
  window.moveDet=false;
  window.mm=false;

  window.scaleTopDet = false;
  window.scaleBottomDet = false;
  window.scaleLeftDet = false;
  window.scaleRightDet = false;

  window.cursorType = "auto";


  window.scaleDet=false;

  window.wl=false;

  window.creatingDet = false;



  window.resizeClass = "";

  window.focusedI;
  window.detI;

  window.specLeft = fqwidth;
  window.specTop = tinfocvsheight;

  window.movingLeft=false;
  window.movingRight=false;


  if(isFirefox) {
    $("#spec").on('DOMMouseScroll',function(e){
      zoomCanvas(e.originalEvent.detail,e.clientX-specLeft,e.clientY-specTop,e.shiftKey);
    });
  }
  else {
    $("#spec").on('mousewheel',function(e){
      zoomCanvas(-(e.originalEvent.wheelDelta/120),e.clientX-specLeft,e.clientY-specTop,e.shiftKey);
    });

  }




  $("#spec").on('mousedown', (e) => {
    mp.x=e.offsetX;
    mp.y=e.offsetY;

    if(e.button==0) {
      detections.checkResize(mp.x,mp.y);
      if(detections.resizeDir>0) {
        md=false;
        detections.setResize();
      }
      else {
        // Start panning
        md=true;
      }
    }

    else if(e.button==0 && e.shiftKey) {
      // Create new detection

      md=true;
    }
  });








  

  $("#spec").on('mousemove', e => {
    mouseMove(e);
  })

  $("#spec").on('mouseup', e => {
    mouseUp(e);
  });

  $("input, select").change(function(e) {
    updateVal((e.currentTarget.id=="nfft"));
    updateCanvas();
  });




  $(document).keyup(function(e){
     if(e.keyCode == 32 && !wl){
       if(!audio.paused) {
         audio.pause();
       }
       else {
         audio.play();
       }
     }
  });

  $(document).keydown(function(e) {
    if(!wl) {
      if(e.keyCode == 39) {
        if(!movingRight) {
          movingRight=true;
          panView(-20,0);
          movingRight=false;
        }
      }
      else if(e.keyCode == 37) {

        if(!movingRight) {
          movingRight=true;
          panView(20,0);
          movingRight=false;
        }
      }
    }
  })

});
