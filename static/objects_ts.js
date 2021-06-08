var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SpecImg = /** @class */ (function () {
    function SpecImg(base64data, offset, adding, duration) {
        if (adding === void 0) { adding = false; }
        if (duration === void 0) { duration = dur; }
        this.base64 = window.btoa(base64data);
        this.start = offset;
        this.end = offset + duration;
        this.duration = duration;
        this.img = new Image();
        this.img.src = "data:image/png;base64," + this.base64;
        this.img.setAttribute("style", "-webkit-filter: blur(500px);  filter: blur(500px);");
        this.img.onload = function () {
            drawCanvas();
        };
    }
    SpecImg.prototype.drawOnCanvas = function () {
        ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, stoPx(this.start), 0, this.duration / sPx, window.cvs.height);
    };
    return SpecImg;
}());
var Cursor = /** @class */ (function () {
    function Cursor() {
        this.x = 0;
        this.tx = view.origOffset;
        this.width = 12;
    }
    Cursor.prototype.scaledWidth = function () {
        return this.width / view.rx;
    };
    Cursor.prototype.set = function (x) {
        this.x = view.x + x / view.rx;
        this.tx = pxtoS(this.x);
    };
    Cursor.prototype.setT = function (tx) {
        this.tx = tx;
        this.x = stoPx(tx);
    };
    Cursor.prototype.relx = function () {
        return (this.x - view.x) * view.rx;
    };
    Cursor.prototype.drawOnCanvas = function () {
        var scw = this.scaledWidth();
        var triangleTip = ((this.width / 2) * Math.sqrt(3)) / view.ry;
        var grdr = ctx.createLinearGradient(this.x, 0, this.x + scw / 2, 0);
        grdr.addColorStop(0, "black");
        grdr.addColorStop(1, "rgba(170,170,170,0)");
        ctx.fillStyle = grdr;
        ctx.fillRect(this.x, view.y + triangleTip, scw / 2, cvs.height);
        var grdl = ctx.createLinearGradient(this.x, 0, this.x - scw / 2, 0);
        grdl.addColorStop(0, "black");
        grdl.addColorStop(1, "rgba(170,170,170,0)");
        ctx.fillStyle = grdl;
        ctx.fillRect(this.x - scw / 2, view.y + triangleTip, scw / 2, cvs.height);
        ctx.beginPath();
        ctx.lineWidth = scw / 6;
        ctx.strokeStyle = "#fff";
        ctx.moveTo(this.x, 0);
        ctx.lineTo(this.x, cvs.height);
        ctx.stroke();
        var l = (2 * this.width * 2 * Math.cos(Math.atan(view.rx / view.ry))) /
            Math.sqrt(Math.pow(view.rx, 2) + Math.pow(view.ry, 2));
        var alpha = Math.atan((view.rx / view.ry) * Math.tan(Math.PI / 3));
        var t = l * Math.cos(alpha);
        var p = l * Math.sin(alpha);
        var stepOne = Math.sqrt(3) / 8;
        var stepTwo = stepOne + 5 / 24;
        var grdlu = ctx.createLinearGradient(this.x, view.y, this.x - p, view.y + t);
        grdlu.addColorStop(stepOne, "black");
        grdlu.addColorStop(stepTwo, "rgba(170,170,170,0)");
        ctx.fillStyle = grdlu;
        ctx.fillRect(view.x, view.y, this.x - view.x, triangleTip);
        var grdru = ctx.createLinearGradient(this.x, view.y, this.x + p, view.y + t);
        grdru.addColorStop(stepOne, "black");
        grdru.addColorStop(stepTwo, "rgba(170,170,170,0)");
        ctx.fillStyle = grdru;
        ctx.fillRect(this.x, view.y, view.xend - this.x, triangleTip);
        var grdld = ctx.createLinearGradient(this.x, view.yend, this.x - p, view.yend - t);
        grdld.addColorStop(stepOne, "black");
        grdld.addColorStop(stepTwo, "rgba(170,170,170,0)");
        ctx.fillStyle = grdld;
        ctx.fillRect(view.x, view.yend, this.x - view.x, -triangleTip);
        var grdrd = ctx.createLinearGradient(this.x, view.yend, this.x + p, view.yend - t);
        grdrd.addColorStop(stepOne, "black");
        grdrd.addColorStop(stepTwo, "rgba(170,170,170,0)");
        ctx.fillStyle = grdrd;
        ctx.fillRect(this.x, view.yend, view.xend - this.x, -triangleTip);
        ctx.moveTo(this.x, view.y);
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.lineTo(this.x - scw / 2, view.y);
        ctx.lineTo(this.x, view.y + triangleTip);
        ctx.lineTo(this.x + scw / 2, view.y);
        ctx.lineTo(this.x, view.y);
        ctx.closePath();
        ctx.fill();
        ctx.moveTo(this.x, view.yend);
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.lineTo(this.x - scw / 2, view.yend);
        ctx.lineTo(this.x, view.yend - triangleTip);
        ctx.lineTo(this.x + scw / 2, view.yend);
        ctx.lineTo(this.x, view.yend);
        ctx.closePath();
        ctx.fill();
        ctxTinfo.font = fontSize + "px Roboto";
        ctxTinfo.textBaseline = "top";
        ctxTinfo.textAlign = "center";
        ctxTinfo.fillStyle = "white";
        ctxTinfo.strokeStyle = "black";
    };
    Cursor.prototype.move = function () {
        var timedelta = (sPx / view.rx) * 1000;
        this.playInterval = setInterval(function () {
            cursor.setT(audio.currentTime);
            tinfo.update();
            drawCanvas();
        }, timedelta);
    };
    Cursor.prototype.stop = function () {
        clearInterval(this.playInterval);
    };
    return Cursor;
}());
var Detection = /** @class */ (function () {
    function Detection(data, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        // this.css = "";
        if (data) {
            this.label = new Label(data["label_id"]);
            this.pinned = data && data["pinned"];
            this.manual = data["manual"];
            this.id = data["id"];
            this.tStart = data["tstart"];
            this.tEnd = data["tend"];
            this.fStart = data["fstart"];
            this.fEnd = data["fend"];
            this.append();
            this.update();
        }
        else {
            this.label = new Label(-1);
            this.id = -1;
            this.manual = true;
            this.pinned = false;
            this.x = x;
            this.y = y;
            this.width = 0;
            this.height = 0;
            this.updateTF();
            this.append();
            this.create();
        }
    }
    Detection.prototype.update = function () {
        this.x = (stoPx(this.tStart) - view.x) * view.rx;
        this.y = (HztoPx(this.fEnd) - view.y) * view.ry;
        this.width = (stoPx(this.tEnd) - view.x) * view.rx - this.x;
        this.height = (HztoPx(this.fStart) - view.y) * view.ry - this.y;
        this.updateCss();
    };
    Detection.prototype.updateCssLabel = function () {
        var labelHeight = this.label.jqueryElement.outerHeight();
        if (this.y < labelHeight) {
            if (cvs.height - (this.height + this.y) < labelHeight) {
                this.label.updatePos("top-inside", -this.y);
            }
            else {
                this.label.updatePos("bottom");
            }
        }
        else {
            this.label.updatePos("top");
        }
    };
    Detection.prototype.updateCss = function () {
        if (this.tEnd >= view.tx && this.tStart <= view.txend) {
            this.css = {
                display: "block",
                left: this.x + "px",
                top: this.y + "px",
                width: this.width + "px",
                height: this.height + "px"
            };
            this.jqueryElement.css(this.css);
        }
        else {
            this.css = { display: "none" };
            this.jqueryElement.css(this.css);
        }
    };
    Detection.prototype.addClass = function (className) {
        this.jqueryElement.addClass(className);
    };
    Detection.prototype.removeClass = function (className) {
        this.jqueryElement.removeClass(className);
    };
    Detection.prototype.focus = function () {
        this.addClass("focus");
    };
    Detection.prototype.unFocus = function () {
        this.removeClass("focus");
    };
    Detection.prototype.updateTF = function () {
        this.tStart = pxtoS(this.x / view.rx + view.x);
        this.fEnd = pxtoHz(this.y / view.ry + view.y);
        this.tEnd = pxtoS((this.width + this.x) / view.rx + view.x);
        this.fStart = pxtoHz((this.height + this.y) / view.ry + view.y);
    };
    Detection.prototype.resize = function (x, y, t, b, l, r) {
        this.manual = true;
        var xend = this.x + this.width;
        var yend = this.y + this.height;
        if (l) {
            this.x = x;
        }
        else if (r) {
            xend = x;
        }
        this.width = xend - this.x;
        if (this.width < 0) {
            this.width = 0;
            if (l) {
                this.x = xend;
            }
        }
        if (t) {
            this.y = y;
        }
        else if (b) {
            yend = y;
        }
        this.height = yend - this.y;
        if (this.height < 0) {
            this.height = 0;
            if (t) {
                this.y = yend;
            }
        }
        xend = this.x + this.width;
        yend = this.y + this.height;
        this.updateTF();
        if (this.tStart < 0) {
            this.tStart = 0;
        }
        if (this.tEnd > audio.duration) {
            this.tEnd = audio.duration;
        }
        if (this.fEnd > hf) {
            this.fEnd = hf;
        }
        if (this.fStart < lf) {
            this.fStart = lf;
        }
        this.update();
        this.updateCssLabel();
    };
    Detection.prototype.move = function (dx, dy) {
        this.manual = true;
        var deltaT = this.tEnd - this.tStart;
        var deltaF = this.fEnd - this.fStart;
        this.x += dx;
        this.y += dy;
        this.updateTF();
        if (this.tStart < 0) {
            this.tStart = 0;
            this.tEnd = deltaT;
        }
        if (this.tEnd > audio.duration) {
            this.tEnd = audio.duration;
            this.tStart = this.tEnd - deltaT;
        }
        if (this.fEnd > hf) {
            this.fEnd = hf;
            this.fStart = this.fEnd - deltaF;
        }
        if (this.fStart < lf) {
            this.fStart = lf;
            this.fEnd = this.fStart + deltaF;
        }
        this.update();
        this.updateCssLabel();
    };
    Detection.prototype.append = function () {
        this.html = '<div class="detection" id="' + this.id + '"></div>';
        $("#spec-td").append(this.html);
        this.jqueryElement = $(".detection#" + this.id);
        this.label.append(this.jqueryElement);
    };
    Detection.prototype.setId = function (id) {
        this.id = id;
        this.jqueryElement.attr("id", id);
    };
    Detection.prototype.getData = function () {
        return {
            id: id,
            pinned: pinned,
            manual: manual,
            tstart: tstart,
            tend: tend,
            fstart: fstart,
            fend: fend,
            analysisid: analysisid,
            labelid: labelid
        };
    };
    Detection.prototype.create = function () {
        this.manual = true;
        var det = this;
        $.ajax({
            url: "/det/create/",
            method: "POST",
            headers: { "X-CSRFToken": csrftoken },
            data: det.getData()
        })
            .done(function (response) {
            det.setId(response.id);
            det.label.setId(response.id);
            det.save();
        })
            .fail(function (error) {
            console.log(error);
        });
    };
    Detection.prototype.save = function () {
        if (this.id != -1) {
            this.manual = true;
            var det = this;
            $.ajax({
                url: "/det/save/",
                method: "POST",
                headers: { "X-CSRFToken": csrftoken },
                data: det.getData()
            })
                .done(function (response) {
                // console.log(response);
            })
                .fail(function (error) {
                throw { message: error };
            });
        }
    };
    Detection.prototype["delete"] = function () {
        var det = this;
        $.ajax({
            url: "/det/delete/",
            method: "POST",
            headers: { "X-CSRFToken": csrftoken },
            data: { id: det.id }
        })
            .done(function (response) {
            det.jqueryElement.fadeOut(400, function () {
                this.remove();
            });
        })
            .fail(function (error) {
            console.log(error);
        });
    };
    return Detection;
}());
var Label = /** @class */ (function () {
    function Label(id, position) {
        if (position === void 0) { position = "top"; }
        this.position = position;
        this.html =
            '<div class="label ' +
                this.position +
                '"><span class="label-text"><div class="id" contenteditable="true">' +
                id +
                '</div></span><span><div class="delete-det"></div></span></div>';
    }
    Label.prototype.append = function (detectionJQuery) {
        detectionJQuery.append(this.html);
        this.jqueryElement = detectionJQuery.find(".label");
    };
    ;
    Label.prototype.updatePos = function (position, translationY) {
        if (translationY === void 0) { translationY = false; }
        if (typeof this.jqueryElement != "undefined") {
            this.jqueryElement.removeClass(this.position);
            this.jqueryElement.addClass(position);
            if (translationY) {
                this.jqueryElement.css({
                    top: translationY
                });
            }
            else {
                this.jqueryElement.css({
                    top: "auto"
                });
            }
        }
        this.position = position;
    };
    ;
    Label.prototype.id = function () {
        var id = parseInt(this.jqueryElement.find(".id").html());
        return isNaN(id) ? 0 : id;
    };
    ;
    Label.prototype.setId = function (id) {
        this.jqueryElement.find(".id").html(id);
    };
    ;
    return Label;
}());
var Tinfo = /** @class */ (function () {
    function Tinfo() {
        this.update();
    }
    Tinfo.prototype.update = function () {
        this.cursor.x = cursor.relx();
        var time = new Date(0, 0, 0, 0, 0, 0, 0);
        this.cursor.timeStr = timeToStr(time, cursor.tx, true);
    };
    Tinfo.prototype.drawOnCanvas = function () {
        var margin = 10;
        var l = 20;
        ctxTinfo.fillStyle = "white";
        ctxTinfo.strokeStyle = "black";
        if (this.cursor.x < 0) {
            ctxTinfo.beginPath();
            ctxTinfo.moveTo(margin, tinfocvs.height / 2);
            ctxTinfo.lineTo(margin + (l * Math.sqrt(3)) / 2, tinfocvs.height / 2 - l / 2);
            ctxTinfo.lineTo(margin + (l * Math.sqrt(3)) / 2, tinfocvs.height / 2 + l / 2);
            ctxTinfo.lineTo(margin, tinfocvs.height / 2);
            ctxTinfo.stroke();
        }
        else if (this.cursor.x > tinfocvs.width) {
            ctxTinfo.beginPath();
            ctxTinfo.moveTo(tinfocvs.width - margin, tinfocvs.height / 2);
            ctxTinfo.lineTo(tinfocvs.width - (margin + (l * Math.sqrt(3)) / 2), tinfocvs.height / 2 - l / 2);
            ctxTinfo.lineTo(tinfocvs.width - (margin + (l * Math.sqrt(3)) / 2), tinfocvs.height / 2 + l / 2);
            ctxTinfo.lineTo(tinfocvs.width - margin, tinfocvs.height / 2);
            ctxTinfo.stroke();
        }
        else {
            ctxTinfo.font = fontSize + "px Roboto";
            ctxTinfo.textBaseline = "top";
            ctxTinfo.strokeText(this.cursor.timeStr, this.cursor.x, tinfocvs.height - fontSize);
        }
    };
    return Tinfo;
}());
var View = /** @class */ (function () {
    function View(offset) {
        this.rx = 1;
        this.ry = 1;
        this.x = 0;
        this.y = 0;
        this.detx = 0;
        this.dety = 0;
        this.origFrame = 0;
        this.actualI = 0;
        this.yf = 0;
        this.tx = 0;
        this.txend = 0;
        this.fyend = 0;
        this.origOffset = offset;
        this.start = offset;
        this.end = offset + dur;
    }
    View.prototype.zoom = function (dir, ratio, x, y, shiftPressed) {
        var newRx = this.rx * ratio;
        // if(newRx<.018) return;
        newRx =
            Math.round(newRx * Math.pow(10, 12)) / Math.pow(10, 12) == 1 ? 1 : newRx;
        var newRy = this.ry * ratio;
        newRy =
            Math.round(newRy * Math.pow(10, 12)) / Math.pow(10, 12) <= 1 ? 1 : newRy;
        ctx.resetTransform();
        var absx = this.x + x / this.rx;
        var absy = this.y + y / this.ry;
        var ry = 1;
        if (!shiftPressed) {
            ry = ratio;
            this.ry = newRy;
        }
        if (newRx <= 1) {
            ry = 1;
            this.ry = 1;
        }
        this.rx = newRx;
        this.x = 0;
        this.y = 0;
        ctx.scale(this.rx, this.ry);
        var dx = x - absx * this.rx;
        var dy = y - absy * this.ry;
        this.pan(dx, dy);
    };
    View.prototype.pan = function (dx, dy) {
        var x = this.x - dx / this.rx;
        var y = this.y - dy / this.ry;
        this.moveTo(x, y, undefined, undefined);
    };
    View.prototype.moveTo = function (xPx, yPx, xT, yF) {
        if (!yPx) {
            yPx = yF ? HztoPx(yF) : this.y;
            yF = yF ? yF : this.yf;
        }
        if (!xPx) {
            xPx = xT ? HztoPx(xT) : this.x;
            xT = xT ? xT : this.tx;
        }
        if (yPx < 0) {
            yPx = 0;
            yF = hf;
        }
        else if (yPx + cvs.height / this.ry > cvs.height) {
            yPx = cvs.height * (1 - 1 / this.ry);
            yF = hf - (hf - lf) * (1 - 1 / this.ry);
        }
        if (xT + (cvs.width * sPx) / this.rx > audio.duration) {
            xT = audio.duration - (cvs.width * sPx) / this.rx;
            xPx = stoPx(xT);
        }
        if (xT < 0) {
            xT = 0;
            xPx = stoPx(0);
        }
        var dx = this.x - xPx;
        var dy = this.y - yPx;
        ctx.translate(dx, dy);
        this.detx += dx * this.rx;
        this.dety += dy * this.ry;
        this.x = xPx;
        this.y = yPx;
        this.xend = this.x + cvs.width / this.rx;
        this.yend = this.y + cvs.height / this.ry;
        this.tx = xT;
        this.fy = yF;
        this.txend = pxtoS(this.xend);
        this.fyend = pxtoHz(this.yend);
        while (this.tx < this.start && this.start > 0) {
            // this.start =  ? 0 : this.start-dur;
            // addToCanvas(this.start,true);
            if (this.start > dur) {
                this.start -= dur;
                addToCanvas(this.start, nSpecs, true);
            }
            else {
                addToCanvas(0, nSpecs, true);
                // addToCanvas(0,true,this.start);
                this.start = 0;
            }
            nSpecs++;
        }
        while (this.txend > this.end && this.end < audio.duration) {
            if (this.end + dur < audio.duration) {
                addToCanvas(this.end, nSpecs, false);
                this.end += dur;
            }
            else {
                addToCanvas(this.end, nSpecs, false, audio.duration - this.end);
                this.end = audio.duration;
            }
            nSpecs++;
        }
        this.actualI =
            Math.floor((this.tx + dur / 2 / view.rx - this.origOffset) / dur) +
                this.origFrame;
        if (this.actualI < 0) {
            this.actualI = 0;
        }
        if (this.actualI >= specImgs.length) {
            this.actualI = specImgs.length - 1;
        }
    };
    ;
    return View;
}());
var Axes = /** @class */ (function () {
    function Axes() {
        this.deltas = [1, 2, 5];
        this.x = new xAx(this);
        this.y = new yAx(this);
        this.updateAll();
        this.drawOnCanvas();
    }
    Axes.prototype.updateAll = function () {
        this.x.updateAll();
        this.y.updateAll();
    };
    ;
    Axes.prototype.updatePos = function () {
        this.x.updatePos();
        this.y.updatePos();
    };
    ;
    Axes.prototype.drawOnCanvas = function () {
        this.x.drawOnCanvas();
        this.y.drawOnCanvas();
    };
    ;
    return Axes;
}());
var Ax = /** @class */ (function () {
    function Ax(parent) {
        this.first = 0;
        this.delta = 0;
        this.deltas = parent.deltas;
        this.updateDelta();
    }
    Ax.prototype.updateDelta = function () {
        var i = 0;
        var j = -2;
        while (((Math.pow(10, j) * this.deltas[i]) / this.rConv) * this.r < this.l / 6) {
            i++;
            if (i == this.deltas.length) {
                i = 0;
                j++;
            }
        }
        if (i == 0) {
            j--;
            i = this.deltas.length - 1;
        }
        else {
            i--;
        }
        this.delta = Math.pow(10, j) * this.deltas[i];
    };
    Ax.prototype.updatePos = function () {
        this.first = Math.ceil(this.unitStart / this.delta - 1) * this.delta;
        if (this.first < 0)
            this.first = 0;
    };
    Ax.prototype.updateAll = function () {
        this.updateDelta();
        this.updatePos();
    };
    ;
    Ax.prototype.drawOnCanvas = function () {
        this.ctxAx.clearRect(0, 0, this.w, this.h);
        this.ctxAx.beginPath();
        for (var i = 0; this.first + i * this.delta <= this.unitEnd &&
            this.first + i * this.delta <= audio.duration; i++) {
            var value = Math.round((this.first + i * this.delta) * 1000) / 1000;
            var pos = ((value - this.unitStart) / this.rConv) * this.r;
            var time = new Date(0, 0, 0, 0, 0, 0, 0);
            var timeStr = timeToStr(time, value);
            this.ctxAx.strokeStyle = "black";
            this.ctxAx.moveTo(pos, 0);
            this.ctxAx.lineTo(pos, 10);
            var sub = 1 / 4;
            for (var k = 1; k * sub < 1; k++) {
                var frac = Math.round(sub * k * 10000) / 10000;
                var halfValue = Math.round((this.first + (i + frac) * this.delta) * 100000) / 100000;
                if (halfValue <= audio.duration) {
                    var halfPos = ((halfValue - this.unitStart) / this.rConv) * this.r;
                    this.ctxAx.strokeStyle = "black";
                    this.ctxAx.moveTo(halfPos, 0);
                    var len = 6;
                    if (frac == 0.5) {
                        len = 8;
                    }
                    this.ctxAx.lineTo(halfPos, len);
                }
            }
            this.ctxAx.font = fontSize + "px Roboto";
            if (this.unitEnd - value <= this.delta / 6) {
                this.ctxAx.textAlign = "right";
            }
            else if (value - this.unitStart <= this.delta / 6) {
                this.ctxAx.textAlign = "left";
            }
            else {
                this.ctxAx.textAlign = "center";
            }
            this.ctxAx.strokeText(timeStr, pos, 30);
            this.ctxAx.lineWidth = 1;
        }
        this.ctxAx.moveTo(0, 0);
        this.ctxAx.lineTo(this.w, 0);
        this.ctxAx.stroke();
    };
    ;
    return Ax;
}());
var xAx = /** @class */ (function (_super) {
    __extends(xAx, _super);
    function xAx(parent) {
        var _this = _super.call(this, parent) || this;
        _this.unit = "s";
        _this.rConv = sPx;
        _this.r = view.rx;
        _this.l = cvs.width;
        _this.unitStart = view.tx;
        _this.unitEnd = view.txend;
        _this.w = timeline.width;
        _this.h = timeline.height;
        _this.ctxAx = ctxTimeline;
        return _this;
    }
    return xAx;
}(Ax));
var yAx = /** @class */ (function (_super) {
    __extends(yAx, _super);
    function yAx(parent) {
        var _this = _super.call(this, parent) || this;
        _this.unit = "Hz";
        _this.rConv = HzPx;
        _this.r = view.ry;
        _this.l = cvs.height;
        _this.unitStart = view.fy;
        _this.unitEnd = view.fyend;
        _this.w = fq.width;
        _this.h = fq.height;
        _this.ctxAx = ctxFq;
        return _this;
    }
    return yAx;
}(Ax));
