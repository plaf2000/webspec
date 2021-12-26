import { Cursor } from "./Cursor";
export class Cursors {
    static createCursor(xstart, xend, ystart, yend, t) {
        Cursors.cursor = new Cursor(xstart, xend, ystart, yend, t);
    }
}
