"use strict";
/*
    Component for managing a shape (i.e. box drawn on the player) for an annotation
*/

const PlayerComponent = require("./player_component").class;

class AnnotationShape extends PlayerComponent {

    constructor (shape, playerId) {
        super(playerId);
        this.shape = shape;
        this.$parent = this.$player;
    }

    // Draw the shape element on the $parent
    draw () {
        if(!this.shape) return;
        if(this.$el) this.$el.remove();

        this.$el = $("<div/>").addClass("vac-shape");
        this.setDimsFromShape();
        this.$parent.append(this.$el);
    }

    // Set/update the dimensions of the shape based  on this.shape
    setDimsFromShape () {
        this.$el.css({
            left:   this.shape.x1 + "%",
            top:    this.shape.y1 + "%",
            width:  (this.shape.x2-this.shape.x1) + "%",
            height: (this.shape.y2-this.shape.y1) + "%"
        });
    }
}

module.exports = {
    class: AnnotationShape
};
