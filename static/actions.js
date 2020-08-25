$(document).ready(function(){

  window.dfn=2048;
  window.wfft=dfn;

  $('#nfft option[value="' + dfn + '"]').prop('selected',true);
  $('#wfft option[value="' + wfft + '"]').prop('selected',true);

  updateVal();

  window.cvs=document.getElementById("spec");
  window.cvs.width=parseInt(window.innerWidth);
  window.cvs.height=parseInt(window.innerHeight/2);
  window.ctx=window.cvs.getContext("2d");


  window.cursor = new Cursor();
  window.view = new View();

  window.playing=false;



  request(calcscale=true);




  var mp = {x:0,y:0};
  var md=false;



  $("#spec").bind('mousewheel',function(e){
    zoomCanvas(-(e.originalEvent.wheelDelta/120),e.offsetX,e.offsetY,e.shiftKey);
  });

  $("#spec").mousedown(function(e) {
    mp.x=e.offsetX;
    mp.y=e.offsetY;
    md=true

  });

  $("#spec").mousemove(function(e) {
    if(md) {
      panCanvas(e.offsetX-mp.x,e.offsetY-mp.y);
      mp.x=e.offsetX;
      mp.y=e.offsetY;
    }
  });

  $(document).mouseup(function() {
    md=false;
  });

  $("input, select").change(function() {
    updateVal();
    request(redo=true);
  });

  $("#spec").dblclick(function(e) {
    cursor.x=e.offsetX;
    drawCanvas();
  });

  $('body').keyup(function(e){
     if(e.keyCode == 32){
       if(playing) {
         pause();
       }
       else {
         play();
       }

     }
  });

});
