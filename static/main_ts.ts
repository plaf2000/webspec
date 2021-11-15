import { Detection } from './classes/Detection';
import { globals } from './global.js';


export const fontSize: number = 15;
export let detections: Detection[] = [];

export let tinfocvs: any = undefined;
export let ctxTinfo: any = undefined;

console.log("👋😂");


// $(function(){

//   $('#nfft option[value="' + dfn + '"]').prop('selected',true);
//   $('#wfft option[value="' + wfft + '"]').prop('selected',true);
//   🏙️
//   tinfocvs = document.getElementById("tinfo");
//   tinfocvs.width=parseInt(window.innerWidth*95/100-2);
//   tinfocvs.height=parseInt(window.innerHeight/20);
//   ctxTinfo=tinfocvs.getContext("2d");

//   window.cvs=document.getElementById("spec");
//   cvs.width=parseInt(window.innerWidth*95/100-2);
//   cvs.height=parseInt(window.innerHeight*3/4);
//   window.ctx=cvs.getContext("2d");



//   window.timeline=document.getElementById("timeline");
//   timeline.width=parseInt(window.innerWidth*95/100-2);
//   timeline.height=parseInt(window.innerHeight/20);
//   window.ctxTimeline=timeline.getContext("2d");

//   window.fq=document.getElementById("frequencies");
//   fq.width=parseInt(window.innerWidth*5/100);
//   fq.height=parseInt(window.innerHeight*3/4);
//   window.ctxFq=fq.getContext("2d");


//   getAudio();

//   updateVal();


//   window.pending = [];
  



//   window.view = new View(offset);


//   window.cursor = new Cursor();
//   window.tinfo = new Tinfo();

//   var wasEditing;



//   window.playing=false;


//   window.specImgs=[];
//   window.nSpecs = 0;
//   addToCanvas(offset,0);
//   view.moveTo(xPx=0,yPx=0);

//   window.memoryStart = view.tx;
//   window.memoryEnd = view.txend;

//   loadDetections(view.tx,view.txend);

//   window.axes = new Axes();

//   window.isFirefox = (/Firefox/i.test(navigator.userAgent));

//   var border = 10;

//   window.mp = {x:0,y:0};
//   window.md=false;
//   window.moveDet=false;
//   window.mm=false;
//   window.hoverI;

//   window.scaleTopDet = false;
//   window.scaleBottomDet = false;
//   window.scaleLeftDet = false;
//   window.scaleRightDet = false;


//   window.scaleDet=false;

//   window.wl=false;

//   window.creatingDet = false;



//   window.resizeClass = "";

//   window.focusedI;
//   window.detI;

//   window.specLeft = $("#spec").offset().left;
//   window.specTop = $("#spec").offset().top;


//   if(isFirefox) {
//     $("#spec-td").on('DOMMouseScroll',function(e){
//       zoomCanvas(e.originalEvent.detail,e.clientX-specLeft,e.clientY-specTop,e.shiftKey);
//     });
//   }
//   else {
//     $("#spec-td").on('mousewheel',function(e){
//       zoomCanvas(-(e.originalEvent.wheelDelta/120),e.clientX-specLeft,e.clientY-specTop,e.shiftKey);
//     });

//   }

//   $("#spec").on('mousedown', function(e) {

//     if(e.which != 3) {

//       if (e.which == 1 && e.shiftKey) {
//         detI = detections.length;
//         var newDet = new Detection(false,e.offsetX,e.offsetY);
//         detections.push(newDet);
//         scaleDet = true;
//         creatingDet = true;
//       }

//       else {
//         md=true;
//       }

//       mp.x=e.clientX;
//       mp.y=e.clientY;

//     }

//   });



  // $("#spec-td").on('mousedown','.detection',function(e) {

  //   mp.x=e.clientX;
  //   mp.y=e.clientY;

  //   detI =$(".detection").index($(this));

  //   if(e.which == 1 && e.target == this) {
  //     scaleDet = (scaleTopDet || scaleBottomDet || scaleLeftDet || scaleRightDet) && (this==e.target);
  //     moveDet = (!scaleDet);
  //     detections[detI].focus();
  //   }

  //   else if(e.which == 2) {
  //     md=true;
  //   }
  // });




//   $("#spec-td").on('mousemove','.detection',function(e) {

//     var triggeredI = $(".detection").index($(this));

//     if(this == e.target) {

//       focusedI = triggeredI;

//       if(!scaleDet && !moveDet) {

//         scaleTopDet = (e.offsetY<border);
//         scaleBottomDet = (detections[focusedI].height-e.offsetY<border);
//         scaleLeftDet = (e.offsetX<border);
//         scaleRightDet = (detections[focusedI].width-e.offsetX<border);
//       }
//     }

//     if(!scaleDet && !moveDet) {

//       hoverI = triggeredI;
//       detections[hoverI].updateCssLabel();
//       detections[hoverI].focus();

//     }
//   });


//   $("#spec-td").on('mouseleave','.detection',function(e) {
//     if(!scaleDet && !moveDet) {
//       if(hoverI<detections.length) {
//         detections[hoverI].unFocus();
//       }
//     }
//   });


//   $("#spec-td").on('keydown','.label-text',function(e) {
//     if(e.keyCode == 13) {
//       e.target.blur();
//     }
//   });

//   $(document).mousemove(function(e) {
//     mouseMove(e);
//   })

//   $(document).mouseup(function(e) {
//     mouseUp(e);
//   });

//   $("input, select").change(function(e) {
//     updateVal((e.currentTarget.id=="nfft"));
//     updateCanvas();
//   });


//   $("#spec-td").on('mousedown','.detection .delete-det',function() {
//     var parentDet = $(this).parents(".detection");
//     var i = $(".detection").index(parentDet);
//     var detToDel = detections[i];
//     if(confirm("Are you sure you want to delete this detection: "+detToDel.label.text+"?")) {
//       detToDel.delete();
//       detections.splice(i,1);
//     }
//     else {
//       detToDel.unFocus();
//     }
//   });


//   $("#spec-td").on('click','.detection',function(e) {
//     if(this == e.target) {

//       if(!mm && !wasEditing) {
//         var i = $(".detection").index($(this));
//         var x = detections[i].x + e.offsetX;
//         setCursor(x);
//       }
//       else {
//         wasEditing = false;
//       }
//       mm=false;
//     }
//   });


//   $("#spec-td").on('focus','.detection .id',function() {
//     wl=true;
//   });


//   $("#spec-td").on('focusout','.detection .id',function() {
//     var i = $(".id").index($(this));
//     detections[i].unFocus();
//     wl=false;
//     wasEditing=true;
//   });

//   $("#spec").click(function(e) {
//     if(!mm) {
//       setCursor(e.offsetX);
//     }
//     mm=false;

//   });

//   $(document).click(function(e) {
//     if(!$(e.target).hasClass('detection')){
//       wasEditing=false;
//     }
//   })

//   $(document).keyup(function(e){
//      if(e.keyCode == 32 && !wl){
//        if(!audio.paused) {
//          audio.pause();
//        }
//        else {
//          audio.play();
//        }
//      }
//   });

//   $(document).keydown(function(e) {
//     if(!wl) {
//       if(e.keyCode == 39) {
//         panView(-20,0);
//       }
//       else if(e.keyCode == 37) {
//         panView(20,0);
//       }
//     }
//   })

// });
