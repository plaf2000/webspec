import {Cursor} from "./Cursor"


export class Cursors {
    static cursor: Cursor;

    static createCursor(xstart: number, xend: number, ystart: number, yend: number, t: number) {
        Cursors.cursor = new Cursor(xstart, xend, ystart, yend, t);
    }
}