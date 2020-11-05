
$(document).ready(function(){

<<<<<<< HEAD
  window.fname='/var/www/html/ZOOM0043.WAV';
=======
  window.csrftoken = getCookie('csrftoken');

  window.fname='/var/www/html/ZOOM0043.WAV';
  window.analysisId = 1;
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
  window.dfn=2048;
  window.wfft=dfn;
  window.zoomRatio=.8;
  window.fontSize=15;
  var detectionStart = 1570;
  var detectionEnd = 1580;

  $('#nfft option[value="' + dfn + '"]').prop('selected',true);
  $('#wfft option[value="' + wfft + '"]').prop('selected',true);

  window.tinfocvs=document.getElementById("tinfo");
  tinfocvs.width=parseInt(window.innerWidth*95/100-2);
  tinfocvs.height=parseInt(window.innerHeight/20);
  window.ctxTinfo=tinfo.getContext("2d");

  window.cvs=document.getElementById("spec");
  cvs.width=parseInt(window.innerWidth*95/100-2);
  cvs.height=parseInt(window.innerHeight*3/4);
  window.ctx=cvs.getContext("2d");



  window.timeline=document.getElementById("timeline");
  timeline.width=parseInt(window.innerWidth*95/100-2);
  timeline.height=parseInt(window.innerHeight/20);
  window.ctxTimeline=timeline.getContext("2d");

  window.fq=document.getElementById("frequencies");
  fq.width=parseInt(window.innerWidth*5/100);
  fq.height=parseInt(window.innerHeight*3/4);
  window.ctxFq=fq.getContext("2d");

  getAudio();


  updateVal();



<<<<<<< HEAD
  window.view = new View(offset);

=======


  window.view = new View(offset);


>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
  window.cursor = new Cursor();
  window.tinfo = new Tinfo();

  var data = [
    {
<<<<<<< HEAD
      tStart: 1562.6,
      tEnd: 1568.2,
      fStart: 800,
      fEnd: 7200,
      id: 3,
      labelId: 0,
      label:'Veryveryverylonglabel'
    },
    {
      tStart: 1559.746,
      tEnd: 1560.191,
      fStart: 1300,
      fEnd: 7200,
      id: 1,
      labelId: 1,
      label:'CORCOI'
    },
    {
      tStart: 1560.6,
      tEnd: 1561.2,
      fStart: 1300,
      fEnd: 7200,
      id: 2,
      labelId: 1,
=======
      tstart: 1562.6,
      tend: 1568.2,
      fstart: 800,
      fend: 7200,
      id: 3+2,
      label_id: 0,
      label:'Veryveryverylonglabel'
    },
    {
      tstart: 1559.746,
      tend: 1560.191,
      fstart: 1300,
      fend: 7200,
      id: 1+2,
      label_id: 1,
      label:'CORCOI'
    },
    {
      tstart: 1560.6,
      tend: 1561.2,
      fstart: 1300,
      fend: 7200,
      id: 2+2,
      label_id: 1,
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
      label:'CORCOI'
    }
  ];

  var wasEditing;


  window.detections = [];

<<<<<<< HEAD
  for (var i = 0; i < data.length; i++) {
    detections[i] = new Detection(data[i]);
  }
=======
  // for (var i = 0; i < data.length; i++) {
  //   detections[i] = new Detection(data[i]);
  // }
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f



  window.playing=false;


  window.specImgs=[];
  addToCanvas(offset);
  view.moveTo(xPx=0,yPx=0);

<<<<<<< HEAD
=======
  window.memoryStart = view.tx;
  window.memoryEnd = view.txend;

  loadDetections(view.tx,view.txend);

>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
  window.axes = new Axes();

  window.isFirefox = (/Firefox/i.test(navigator.userAgent));

  var border = 10;

  window.mp = {x:0,y:0};
  window.md=false;
  window.moveDet=false;
  window.mm=false;
<<<<<<< HEAD
=======
  window.hoverI;
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f

  window.scaleTopDet = false;
  window.scaleBottomDet = false;
  window.scaleLeftDet = false;
  window.scaleRightDet = false;

  window.scaleDet=false;

  window.wl=false;

  window.creatingDet = false;



  window.resizeClass = "";

  window.focusedI;
  window.detI;

  window.specLeft = $("#spec").offset().left;
  window.specTop = $("#spec").offset().top;


  if(isFirefox) {
    $("#spec-td").on('DOMMouseScroll',function(e){
      zoomCanvas(e.originalEvent.detail,e.clientX-specLeft,e.clientY-specTop,e.shiftKey);
    });
  }
  else {
    $("#spec-td").on('mousewheel',function(e){
      zoomCanvas(-(e.originalEvent.wheelDelta/120),e.clientX-specLeft,e.clientY-specTop,e.shiftKey);
    });

  }

  $("#spec").mousedown(function(e) {


    if(e.which != 3) {

      if (e.which == 1 && e.shiftKey) {
        detI = detections.length;
        var newDet = new Detection(false,e.offsetX,e.offsetY);
        detections.push(newDet);
        scaleDet = true;
        creatingDet = true;
      }

      else {

        md=true;

      }

      mp.x=e.clientX;
      mp.y=e.clientY;



    }


  });



  $("#spec-td").on('mousedown','.detection',function(e) {

    mp.x=e.clientX;
    mp.y=e.clientY;

    detI =$(".detection").index($(this));

    if(e.which == 1) {
      if (e.target == this) {
        scaleDet = (scaleTopDet || scaleBottomDet || scaleLeftDet || scaleRightDet) && (this==e.target);
        moveDet = (!scaleDet);

        detections[detI].focus();


      }


<<<<<<< HEAD
=======

>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
    }

    else if(e.which == 2) {
      md=true;
    }
  });




  $("#spec-td").on('mousemove','.detection',function(e) {

<<<<<<< HEAD

    if(this == e.target) {

      focusedI = $(".detection").index($(this));
=======
    var triggeredI = $(".detection").index($(this));

    if(this == e.target) {

      focusedI = triggeredI;
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f

      if(!scaleDet && !moveDet) {

        scaleTopDet = (e.offsetY<border);
        scaleBottomDet = (detections[focusedI].height-e.offsetY<border);
        scaleLeftDet = (e.offsetX<border);
        scaleRightDet = (detections[focusedI].width-e.offsetX<border);



      }
    }

<<<<<<< HEAD
=======
    if(!scaleDet && !moveDet) {

      hoverI = triggeredI;
      detections[hoverI].updateCssLabel();
      detections[hoverI].focus();

    }


  });

  $("#spec-td").on('mouseleave','.detection',function(e) {

  if(!scaleDet && !moveDet) {
    if(hoverI<detections.length) {

      detections[hoverI].unFocus();
    }

  }

>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
  });


  $("#spec-td").on('keydown','.label-text',function(e) {


    if(e.keyCode == 13) {

      e.target.blur();
    }

  });



  $(document).mousemove(function(e) {
    mouseMove(e);
  })

  $(document).mouseup(function(e) {
    mouseUp(e);
  });

  $("input, select").change(function(e) {
    updateVal((e.currentTarget.id=="nfft"));
    updateCanvas();
  });

  $("#spec-td").on('mousedown','.detection .delete-det',function() {
<<<<<<< HEAD
    var i = $(".delete-det").index($(this));
=======
    var parentDet = $(this).parents(".detection");
    var i = $(".detection").index(parentDet);
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
    var detToDel = detections[i];
    if(confirm("Are you sure you want to delete this detection: "+detToDel.label.text+"?")) {
      detToDel.delete();
      detections.splice(i,1);
    }
    else {
      detToDel.unFocus();
    }
  });

  $("#spec-td").on('click','.detection',function(e) {
    if(this == e.target) {

      if(!mm && !wasEditing) {
        var i = $(".detection").index($(this));
        var x = detections[i].x + e.offsetX;
        setCursor(x);
      }
      else {
        wasEditing = false;
      }
      mm=false;
    }


  });


<<<<<<< HEAD
  $("#spec-td").on('focus','.detection .label-it',function() {
=======
  $("#spec-td").on('focus','.detection .id',function() {
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
    wl=true;
  });


<<<<<<< HEAD
  $("#spec-td").on('focusout','.detection .label-it',function() {
    var i = $(".label-it").index($(this));
=======
  $("#spec-td").on('focusout','.detection .id',function() {
    var i = $(".id").index($(this));
>>>>>>> 0f0842fc19203c92eccb15cf41006400f4b1055f
    detections[i].unFocus();
    wl=false;
    wasEditing=true;
  });

  $("#spec").click(function(e) {
    if(!mm) {
      setCursor(e.offsetX);
    }
    mm=false;

  });

  $(document).click(function(e) {
    if(!$(e.target).hasClass('detection')){
      wasEditing=false;
    }
  })

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
        panView(-20,0);
      }
      else if(e.keyCode == 37) {
        panView(20,0);
      }
    }
  })

});
