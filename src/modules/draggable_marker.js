"use strict";

const _ = require("underscore");
const Marker = require("./marker").class;
const DraggableMarkerTemplate = require("./../templates/marker").draggableMarkerTemplate;

class draggableMarker extends Marker {

  constructor(range, playerId) {
    super(range, null, playerId);
    this.template = DraggableMarkerTemplate;
    this.dragging = false;
    this.rangePin = range.start;
    this.draw();
    this.$parent = this.$marker.closest(".vac-marker-wrap");
  }

  onDrag (e) {
    var dragPercent = this.percentValFromXpos(e.pageX),
        secVal = this.duration * dragPercent;

    if(secVal > this.rangePin){
      this.range = {
        start: this.rangePin,
        end: secVal
      };
    }else{
      this.range = {
        start: secVal,
        end: this.rangePin
      };
    }
    this.draw();
  }

  bindMarkerEvents () {

    this.$marker.mousedown((e) => {
      e.preventDefault();
      this.dragging = true;
      $(document).on("mousemove.draggableMarker", _.throttle(this.onDrag.bind(this), 250) );
    });

    $(document).on("mouseup.draggableMarker", (e) => {
       if(!this.dragging) return;
       $(document).off("mousemove.draggableMarker");
       this.dragging = false;
    });
  }

  percentValFromXpos (xpos) {
    var x = Math.max(0, xpos - this.$parent.offset().left), // px val
        max = this.$parent.innerWidth(),
        per = (x / max);
    if(per > 1) per = 1;
    if(per < 0) per = 0;
    return per;
  }
  teardown () {
    super.teardown();
    $(document).off("mousemove.draggableMarker");
    $(document).off("mouseup.draggableMarker");
  }
}

module.exports = {
	class: draggableMarker
};