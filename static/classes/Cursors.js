"use strict";
exports.__esModule = true;
exports.Cursors = void 0;
var Cursor_1 = require("./Cursor");
var Cursors = /** @class */ (function () {
    function Cursors() {
    }
    Cursors.createCursor = function (xstart, xend, ystart, yend, t) {
        Cursors.cursor = new Cursor_1.Cursor(xstart, xend, ystart, yend, t);
    };
    return Cursors;
}());
exports.Cursors = Cursors;
