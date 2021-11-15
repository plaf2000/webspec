export class Canvas {
    loadCvs(cvs) {
        Canvas.cvs = cvs;
        let ctx = cvs.getContext("2d");
        if (ctx == null) {
            throw new Error("Context is null!");
        }
        Canvas.ctx = ctx;
    }
    static drawCanvas() {
    }
}
