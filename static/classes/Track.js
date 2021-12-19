"use strict";
exports.__esModule = true;
exports.Track = void 0;
var Cursors_1 = require("./Cursors");
var Track = /** @class */ (function () {
    function Track() {
    }
    Track.getAudio = function (fname, sr, offset) {
        var fnameURI = encodeURIComponent(fname);
        var url = '/audio/?f=' + fnameURI;
        Track.audio = new Audio(url);
        Track.audio.onloadeddata = function () {
            Track.audio.currentTime = offset;
        };
        Track.audio.onplay = function () {
            Cursors_1.Cursors.cursor.move();
        };
        Track.audio.onpause = function () {
            Cursors_1.Cursors.cursor.stop();
        };
        Track.sr = sr;
    };
    Track.playPause = function () {
        if (!Track.audio.paused) {
            Track.audio.pause();
        }
        else {
            Track.audio.play();
        }
    };
    return Track;
}());
exports.Track = Track;
