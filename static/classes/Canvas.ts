import { View } from "./View";

export class Canvas {
    static cvs: HTMLCanvasElement;
    static ctx : CanvasRenderingContext2D;
    loadCvs(cvs: HTMLCanvasElement) {
        Canvas.cvs = cvs;
        let ctx = cvs.getContext("2d");
        if(ctx == null) {
            throw new Error("Context is null!");
        }
        Canvas.ctx = ctx;
    }
    static drawCanvas() {
        
    }
}