import { Cursors } from "./Cursors";
export class Track {
    static getAudio(fname, sr, offset) {
        let fnameURI = encodeURIComponent(fname);
        let url = '/audio/?f=' + fnameURI;
        Track.audio = new Audio(url);
        Track.audio.onloadeddata = () => {
            Track.audio.currentTime = offset;
        };
        Track.audio.onplay = function () {
            Cursors.cursor.move();
        };
        Track.audio.onpause = function () {
            Cursors.cursor.stop();
        };
        Track.sr = sr;
    }
    static playPause() {
        if (!Track.audio.paused) {
            Track.audio.pause();
        }
        else {
            Track.audio.play();
        }
    }
}
