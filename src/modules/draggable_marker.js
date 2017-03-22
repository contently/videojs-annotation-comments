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
    this.$parent = this.$marker.closest(".vac-marker-wrap"); // Set parent as marker wrap
  }

  // Bind needed evnets for UI interaction
  bindMarkerEvents () {
    // On mouse down init drag
    this.$marker.mousedown((e) => {
      e.preventDefault();
      this.dragging = true;
      // When mouse moves (with mouse down) call onDrag, throttling to once each 250 ms
      $(document).on("mousemove.draggableMarker", _.throttle(this.onDrag.bind(this), 250) );
    });

    // On mouse up end drag action and unbind mousemove event
    $(document).on("mouseup.draggableMarker", (e) => {
       if(!this.dragging) return;
       $(document).off("mousemove.draggableMarker");
       this.dragging = false;
    });
  }

  // On drag action, calculate new range and redraw marker
  onDrag (e) {
    var dragPercent = this.percentValFromXpos(e.pageX),
        secVal = parseInt(this.duration * dragPercent);

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

  // Cal percentage (of video) position for a pixel-based X position on the document
  percentValFromXpos (xpos) {
    var x = Math.max(0, xpos - this.$parent.offset().left), // px val
        max = this.$parent.innerWidth(),
        per = (x / max);
    if(per > 1) per = 1;
    if(per < 0) per = 0;
    return per;
  }

  // Remove bound events on destructon
  teardown () {
    super.teardown();
    $(document).off("mousemove.draggableMarker");
    $(document).off("mouseup.draggableMarker");
  }
}

module.exports = {
	class: draggableMarker
};