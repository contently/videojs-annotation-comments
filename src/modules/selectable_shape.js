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

  // Bind all needed events for drag action
  bindEvents () {
    // On mousedown initialize drag
    this.$parent.on("mousedown.selectableShape", (e) => {
      // Check a few conditions to see if we should *not* start drag
      if( !($(e.target).hasClass('vac-video-cover-canvas')) ) return; //didn't click on overlay
      if( $(e.target).hasClass('vac-shape') ) return; //user clicked on annotation

      // Remove old shape if one existed
      if(this.$el) this.$el.remove();

      // Define default starting shape (just x/y coords of where user clicked no width/height yet)
      let shape = {
        x1: this.xCoordToPercent(e.pageX),
        y1: this.YCoordToPercent(e.pageY)
      };
      shape.x2 = shape.x1;
      shape.y2 = shape.y2;
      this.shape = shape;

      // Save origin points for future use
      this.originX = shape.x1;
      this.originY = shape.y1;

      // Draw shape and start drag state
      this.draw();
      this.dragging = true;
      this.dragMoved = false; // used to determine if user actually dragged or just clicked

      // Bind event on doc mousemove to track drag, throttled to once each 250ms
      $(document).on("mousemove.selectableShape", _.throttle(this.onDrag.bind(this), 250) );
    });

    // On mouseup, if during drag cancel drag event listeners
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

  // On each interation of drag action (mouse movement), recalc position and redraw shape
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
    return Number(((x / max) * 100).toFixed(2)); //round to 2 decimal places
  }

  YCoordToPercent (y) {
    y = y - this.$parent.offset().top; //pixel position
    var max = this.$parent.innerHeight();
    return Number(((y / max) * 100).toFixed(2)); //round to 2 decimal places
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