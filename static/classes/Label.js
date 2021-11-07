"use strict";
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
                    top: translationY,
                });
            }
            else {
                this.jqueryElement.css({
                    top: "auto",
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
