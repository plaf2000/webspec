import { View } from "./View";

export class Canvas {
    cvs: HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    // view : View;
    

    constructor(cvs: HTMLCanvasElement) {
        this.cvs = cvs;
        let ctx = cvs.getContext("2d");
        if(ctx == null) {
            throw new Error("Context is null!");
        }
        this.ctx = ctx;

    }
    drawCanvas() {
        
    }
}