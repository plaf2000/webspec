class xAx extends Ax {
    unit = "s";
  
    rConv = sPx;
    r = view.rx;
    l = cvs.width;
  
    unitStart = view.tx;
    unitEnd = view.txend;
    w = timeline.width;
    h = timeline.height;
    ctxAx = ctxTimeline;
  
    constructor(parent: Axes) {
      super(parent);
    }