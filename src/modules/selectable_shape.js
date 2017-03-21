"use strict";

const _ = require("underscore");
const AnnotationShape = require("./annotation_shape").class;

class SelectableShape extends AnnotationShape {

  constructor(playerId) {
  	super(null, playerId);
    this.$parent = this.$player.find(".vac-video-cover-canvas");
    this.bindEvents();
    this.dragging = false;
  }

  bindEvents () {
    this.$parent.on("mousedown.selectableShape", (e) => {
      if( !($(e.target).hasClass('vac-video-cover-canvas')) ) return; //didn't click on overlay
      if( $(e.target).hasClass('vac-shape') ) return; //user clicked on annotation

      // remove old shape if one existed
      if(this.$el) this.$el.remove();

      // define defaul shape (just x/y coords of where user clicked no width/height yet)
      let shape = {
        x1: this.xCoordToPercent(e.pageX),
        y1: this.YCoordToPercent(e.pageY)
      }
      this.originX = shape.x1;
      this.originY = shape.y1;
      shape.x2 = shape.x1;
      shape.y2 = shape.y2;
      this.shape = shape;

      this.draw();
      this.dragging = true;
      this.dragMoved = false;

     $(document).on("mousemove.selectableShape", _.throttle(this.onDrag.bind(this), 250) );
    });

    $(document).on("mouseup.selectableShape", (e) => {
      if(!this.dragging) return;
      $(document).off("mousemove.selectableShape");
      if(!this.dragMoved){
        //clear shape if it's just a click (and not a drag)
        this.shape = null;
        if(this.$el) this.$el.remove();
      }
      this.dragging = false;
    });
  }

  onDrag (e) {
    this.dragMoved = true;

    var xPer = this.xCoordToPercent(e.pageX),
        yPer = this.YCoordToPercent(e.pageY);

    if(xPer < this.originX){
      this.shape.x2 = this.originX;
      this.shape.x1 = Math.max(0, xPer);
    }else{
      this.shape.x2 = Math.min(100, xPer);
      this.shape.x1 = this.originX;
    }
    if(yPer < this.originY){
      this.shape.y2 = this.originY;
      this.shape.y1 = Math.max(0, yPer);
    }else{
      this.shape.y2 = Math.min(100, yPer);
      this.shape.y1 = this.originY;
    }
    this.setDimsFromShape();
  }

  xCoordToPercent (x) {
    x = x - this.$parent.offset().left; //pixel position
    var max = this.$parent.innerWidth();
    return (x / max) * 100;
  }

  YCoordToPercent (y) {
    y = y - this.$parent.offset().top; //pixel position
    var max = this.$parent.innerHeight();
    return (y / max) * 100;
  }

  teardown () {
    this.$parent.off("mousedown.selectableShape");
    $(document).off("mouseup.selectableShape");
    super.teardown();
  }


}

module.exports = {
	class: SelectableShape
};