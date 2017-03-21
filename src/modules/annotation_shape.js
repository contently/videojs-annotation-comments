"use strict";

const PlayerComponent = require("./player_component").class;

class AnnotationShape extends PlayerComponent {

  constructor(shape, playerId) {
  	super(playerId);
    this.shape = shape;
  }

  draw () {
    if(!this.shape) return;

    this.$el = $("<div/>").addClass("vac-shape").css({
      top: this.shape.x1 + "%",
      left: this.shape.y1 + "%",
      width: (this.shape.x2-this.shape.x1) + "%",
      height: (this.shape.y2-this.shape.y1) + "%"
    });

    this.$player.append(this.$el);
  }


  teardown () {
    if(this.shape){
      this.$el.remove();
    }
  }

}

module.exports = {
	class: AnnotationShape
};
