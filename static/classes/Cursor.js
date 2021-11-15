import { View } from "./View";
import { Canvas } from "./Canvas";
import { Values } from "./Values";
import { Track } from "./Track";
import { DrawableBox } from "./Box";
import { Tinfo } from "./Tinfo";
// export class Cursor {
//     x: number = 0;
//     tx: number = View.origOffset;
//     width: number = 12;
//     playInterval: number = 0;
//     scaledWidth(): number {
//       return this.width / View.rx;
//     }
//     set(x: number): void {
//       this.x = View.x + x / View.rx;
//       this.tx = View.pxtoS(this.x);
//     }
//     setT(tx: number): void {
//       this.tx = tx;
//       this.x = View.stoPx(tx);
//     }
//     relx(): number {
//       return (this.x - View.x) * View.rx;
//     }
//     drawOnCanvas(): void {
//       var scw = this.scaledWidth();
//       var triangleTip = ((this.width / 2) * Math.sqrt(3)) / View.ry;
//       var grdr = Canvas.Canvas.ctx.createLinearGradient(this.x, 0, this.x + scw / 2, 0);
//       grdr.addColorStop(0, "black");
//       grdr.addColorStop(1, "rgba(170,170,170,0)");
//       Canvas.Canvas.ctx.fillStyle = grdr;
//       Canvas.Canvas.ctx.fillRect(this.x, View.y + triangleTip, scw / 2, Canvas.cvs.height);
//       var grdl = Canvas.Canvas.ctx.createLinearGradient(this.x, 0, this.x - scw / 2, 0);
//       grdl.addColorStop(0, "black");
//       grdl.addColorStop(1, "rgba(170,170,170,0)");
//       Canvas.Canvas.ctx.fillStyle = grdl;
//       Canvas.Canvas.ctx.fillRect(this.x - scw / 2, View.y + triangleTip, scw / 2, Canvas.cvs.height);
//       Canvas.Canvas.ctx.beginPath();
//       Canvas.Canvas.ctx.lineWidth = scw / 6;
//       Canvas.Canvas.ctx.strokeStyle = "#fff";
//       Canvas.Canvas.ctx.moveTo(this.x, 0);
//       Canvas.Canvas.ctx.lineTo(this.x, Canvas.cvs.height);
//       Canvas.Canvas.ctx.stroke();
//       let l: number =
//         (2 * this.width * 2 * Math.cos(Math.atan(View.rx / View.ry))) /
//         Math.sqrt(Math.pow(View.rx, 2) + Math.pow(View.ry, 2));
//       let alpha: number = Math.atan((View.rx / View.ry) * Math.tan(Math.PI / 3));
//       let t: number = l * Math.cos(alpha);
//       let p: number = l * Math.sin(alpha);
//       let stepOne: number = Math.sqrt(3) / 8;
//       let stepTwo: number = stepOne + 5 / 24;
//       let grdlu: CanvasGradient = Canvas.Canvas.ctx.createLinearGradient(
//         this.x,
//         View.y,
//         this.x - p,
//         View.y + t
//       );
//       grdlu.addColorStop(stepOne, "black");
//       grdlu.addColorStop(stepTwo, "rgba(170,170,170,0)");
//       Canvas.Canvas.ctx.fillStyle = grdlu;
//       Canvas.Canvas.ctx.fillRect(View.x, View.y, this.x - View.x, triangleTip);
//       let grdru: CanvasGradient = Canvas.Canvas.ctx.createLinearGradient(
//         this.x,
//         View.y,
//         this.x + p,
//         View.y + t
//       );
//       grdru.addColorStop(stepOne, "black");
//       grdru.addColorStop(stepTwo, "rgba(170,170,170,0)");
//       Canvas.Canvas.ctx.fillStyle = grdru;
//       Canvas.Canvas.ctx.fillRect(this.x, View.y, View.xend - this.x, triangleTip);
//       let grdld: CanvasGradient = Canvas.Canvas.ctx.createLinearGradient(
//         this.x,
//         View.yend,
//         this.x - p,
//         View.yend - t
//       );
//       grdld.addColorStop(stepOne, "black");
//       grdld.addColorStop(stepTwo, "rgba(170,170,170,0)");
//       Canvas.Canvas.ctx.fillStyle = grdld;
//       Canvas.Canvas.ctx.fillRect(View.x, View.yend, this.x - View.x, -triangleTip);
//       let grdrd: CanvasGradient = Canvas.Canvas.ctx.createLinearGradient(
//         this.x,
//         View.yend,
//         this.x + p,
//         View.yend - t
//       );
//       grdrd.addColorStop(stepOne, "black");
//       grdrd.addColorStop(stepTwo, "rgba(170,170,170,0)");
//       Canvas.Canvas.ctx.fillStyle = grdrd;
//       Canvas.Canvas.ctx.fillRect(this.x, View.yend, View.xend - this.x, -triangleTip);
//       Canvas.Canvas.ctx.moveTo(this.x, View.y);
//       Canvas.Canvas.ctx.beginPath();
//       Canvas.Canvas.ctx.fillStyle = "#fff";
//       Canvas.Canvas.ctx.lineTo(this.x - scw / 2, View.y);
//       Canvas.Canvas.ctx.lineTo(this.x, View.y + triangleTip);
//       Canvas.Canvas.ctx.lineTo(this.x + scw / 2, View.y);
//       Canvas.Canvas.ctx.lineTo(this.x, View.y);
//       Canvas.Canvas.ctx.closePath();
//       Canvas.Canvas.ctx.fill();
//       Canvas.Canvas.ctx.moveTo(this.x, View.yend);
//       Canvas.Canvas.ctx.beginPath();
//       Canvas.Canvas.ctx.fillStyle = "#fff";
//       Canvas.Canvas.ctx.lineTo(this.x - scw / 2, View.yend);
//       Canvas.Canvas.ctx.lineTo(this.x, View.yend - triangleTip);
//       Canvas.Canvas.ctx.lineTo(this.x + scw / 2, View.yend);
//       Canvas.Canvas.ctx.lineTo(this.x, View.yend);
//       Canvas.Canvas.ctx.closePath();
//       Canvas.Canvas.ctx.fill();
//       Canvas.Canvas.ctx.font = Values.fontSize + "px Roboto";
//       Canvas.Canvas.ctx.textBaseline = "top";
//       Canvas.Canvas.ctx.textAlign = "center";
//       Canvas.Canvas.ctx.fillStyle = "white";
//       Canvas.Canvas.ctx.strokeStyle = "black";
//     }
//     move(): void {
//       var timedelta = (Values.sPx / View.rx) * 1000;
//       this.playInterval = setInterval(() => {
//         this.setT(Track.audio.currentTime);
//         tinfo.update();
//         drawCanvas();
//       }, timedelta);
//     }
//     stop(): void {
//       clearInterval(this.playInterval);
//     }
//   }
export class Cursor extends DrawableBox {
    constructor(xstart, xend, ystart, yend, t) {
        super(xstart, xend, ystart, yend);
        this.width = 12;
        this.playInterval = 0;
        this.setT(t);
    }
    updatePos() {
        this.x = this.stoPx(this.tx);
    }
    updateTime() {
        this.tx = this.pxtoS(this.x);
    }
    set(x) {
        this.x = (x < this.xstart) ? this.xstart : x;
        this.updateTime();
    }
    ;
    setT(tx) {
        this.tx = (tx < 0) ? 0 : tx;
        this.updatePos();
    }
    ;
    drawOnCanvas() {
        this.updatePos();
        var triangleTip = (this.width / 2 * Math.sqrt(3));
        var grdr = Canvas.ctx.createLinearGradient(this.x, 0, this.x + this.width / 2, 0);
        grdr.addColorStop(0, "black");
        grdr.addColorStop(1, "rgba(170,170,170,0)");
        Canvas.ctx.fillStyle = grdr;
        Canvas.ctx.fillRect(this.x, this.ystart + triangleTip, this.width / 2, Canvas.cvs.height - 2 * triangleTip);
        var grdl = Canvas.ctx.createLinearGradient(this.x, 0, this.x - this.width / 2, 0);
        grdl.addColorStop(0, "black");
        grdl.addColorStop(1, "rgba(170,170,170,0)");
        Canvas.ctx.fillStyle = grdl;
        Canvas.ctx.fillRect(this.x - this.width / 2, this.ystart + triangleTip, this.width / 2, Canvas.cvs.height - 2 * triangleTip);
        Canvas.ctx.beginPath();
        Canvas.ctx.lineWidth = this.width / 6;
        Canvas.ctx.strokeStyle = "#fff";
        Canvas.ctx.moveTo(this.x, this.ystart);
        Canvas.ctx.lineTo(this.x, this.yend);
        Canvas.ctx.stroke();
        var l = 2 * this.width;
        var alpha = Math.PI / 3;
        var t = l * Math.cos(alpha);
        var p = l * Math.sin(alpha);
        var stepOne = Math.sqrt(3) / 8;
        var stepTwo = stepOne + 5 / 24;
        var grdlu = Canvas.ctx.createLinearGradient(this.x, this.ystart, this.x - p, this.ystart + t);
        grdlu.addColorStop(stepOne, "black");
        grdlu.addColorStop(stepTwo, "rgba(170,170,170,0)");
        Canvas.ctx.fillStyle = grdlu;
        Canvas.ctx.fillRect(this.xstart, this.ystart, this.x - this.xstart, triangleTip);
        var grdru = Canvas.ctx.createLinearGradient(this.x, this.ystart, this.x + p, this.ystart + t);
        grdru.addColorStop(stepOne, "black");
        grdru.addColorStop(stepTwo, "rgba(170,170,170,0)");
        Canvas.ctx.fillStyle = grdru;
        Canvas.ctx.fillRect(this.x, this.ystart, this.xend - this.x, triangleTip);
        var grdld = Canvas.ctx.createLinearGradient(this.x, this.yend, this.x - p, this.yend - t);
        grdld.addColorStop(stepOne, "black");
        grdld.addColorStop(stepTwo, "rgba(170,170,170,0)");
        Canvas.ctx.fillStyle = grdld;
        Canvas.ctx.fillRect(this.xstart, this.yend, this.x - this.xstart, -triangleTip);
        var grdrd = Canvas.ctx.createLinearGradient(this.x, this.yend, this.x + p, this.yend - t);
        grdrd.addColorStop(stepOne, "black");
        grdrd.addColorStop(stepTwo, "rgba(170,170,170,0)");
        Canvas.ctx.fillStyle = grdrd;
        Canvas.ctx.fillRect(this.x, this.yend, this.xend - this.x, -triangleTip);
        Canvas.ctx.moveTo(this.x, this.ystart);
        Canvas.ctx.beginPath();
        Canvas.ctx.fillStyle = "#fff";
        Canvas.ctx.lineTo(this.x - this.width / 2, this.ystart);
        Canvas.ctx.lineTo(this.x, this.ystart + triangleTip);
        Canvas.ctx.lineTo(this.x + this.width / 2, this.ystart);
        Canvas.ctx.lineTo(this.x, this.ystart);
        Canvas.ctx.closePath();
        Canvas.ctx.fill();
        Canvas.ctx.moveTo(this.x, this.yend);
        Canvas.ctx.beginPath();
        Canvas.ctx.fillStyle = "#fff";
        Canvas.ctx.lineTo(this.x - this.width / 2, this.yend);
        Canvas.ctx.lineTo(this.x, this.yend - triangleTip);
        Canvas.ctx.lineTo(this.x + this.width / 2, this.yend);
        Canvas.ctx.lineTo(this.x, this.yend);
        Canvas.ctx.closePath();
        Canvas.ctx.fill();
        Canvas.ctx.font = Values.fontSize + "px Roboto";
        Canvas.ctx.textBaseline = "top";
        Canvas.ctx.textAlign = "center";
        // Canvas.ctx.lineWidth = 2;
        Canvas.ctx.fillStyle = "white";
        Canvas.ctx.strokeStyle = "black";
    }
    ;
    move() {
        var timedelta = (Values.sPx / View.rx) * 1000;
        this.playInterval = setInterval(() => {
            this.setT(Track.audio.currentTime);
            Tinfo.update();
            Canvas.drawCanvas();
        }, timedelta);
    }
    ;
    stop() {
        clearInterval(this.playInterval);
    }
}
