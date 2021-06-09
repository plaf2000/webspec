class Label {

    position: string;
    html: string;
    jqueryElement: any;


    constructor(id: number, position: string = "top") {
        this.position = position;
        this.html =
        '<div class="label ' +
        this.position +
        '"><span class="label-text"><div class="id" contenteditable="true">' +
        id +
        '</div></span><span><div class="delete-det"></div></span></div>';
    }

    append(detectionJQuery: any): void {
        detectionJQuery.append(this.html);
        this.jqueryElement = detectionJQuery.find(".label");
    };

    updatePos(position: string, translationY: boolean = false): void {
        if (typeof this.jqueryElement != "undefined") {
        this.jqueryElement.removeClass(this.position);
        this.jqueryElement.addClass(position);
        if (translationY) {
            this.jqueryElement.css({
            top: translationY,
            });
        } else {
            this.jqueryElement.css({
            top: "auto",
            });
        }
        }

        this.position = position;
    };

    id(): number {
        var id = parseInt(this.jqueryElement.find(".id").html());
        return isNaN(id) ? 0 : id;
    };

    setId(id: number) {
        this.jqueryElement.find(".id").html(id);
    };
}
  
