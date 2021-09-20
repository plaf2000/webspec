export class Tinfo {
    cursor: {
        x: number,
        timeStr: number,
        tx: number
    };

    constructor() {
        this.update();
    }

    static update(): void {
        this.cursor.x = cursor.relx();
        let time = new Date(0, 0, 0, 0, 0, 0, 0);
        this.cursor.timeStr = timeToStr(time, cursor.tx, true);
    }

    static drawOnCanvas(): void {
        let margin = 10;
        let l = 20;

        ctxTinfo.fillStyle = "white";
        ctxTinfo.strokeStyle = "black";

        if (this.cursor.x < 0) {
        ctxTinfo.beginPath();
        ctxTinfo.moveTo(margin, tinfocvs.height / 2);
        ctxTinfo.lineTo(
            margin + (l * Math.sqrt(3)) / 2,
            tinfocvs.height / 2 - l / 2
        );
        ctxTinfo.lineTo(
            margin + (l * Math.sqrt(3)) / 2,
            tinfocvs.height / 2 + l / 2
        );
        ctxTinfo.lineTo(margin, tinfocvs.height / 2);

        ctxTinfo.stroke();
        } else if (this.cursor.x > tinfocvs.width) {
        ctxTinfo.beginPath();

        ctxTinfo.moveTo(tinfocvs.width - margin, tinfocvs.height / 2);
        ctxTinfo.lineTo(
            tinfocvs.width - (margin + (l * Math.sqrt(3)) / 2),
            tinfocvs.height / 2 - l / 2
        );
        ctxTinfo.lineTo(
            tinfocvs.width - (margin + (l * Math.sqrt(3)) / 2),
            tinfocvs.height / 2 + l / 2
        );
        ctxTinfo.lineTo(tinfocvs.width - margin, tinfocvs.height / 2);

        ctxTinfo.stroke();
        } else {
        ctxTinfo.font = fontSize + "px Roboto";
        ctxTinfo.textBaseline = "top";
        ctxTinfo.strokeText(
            this.cursor.timeStr,
            this.cursor.x,
            tinfocvs.height - fontSize
        );
        }
    }
}