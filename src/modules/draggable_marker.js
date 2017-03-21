"use strict";

const _ = require("underscore");
const Marker = require("./marker").class;
const DraggableMarkerTemplate = require("./../templates/marker").draggableMarkerTemplate;

class draggableMarker extends Marker {

  constructor(range, playerId) {
    super(range, null, playerId);
    this.template = DraggableMarkerTemplate;
    this.draw();
    this.dragging = false;
  }

  onDrag (e) {
    var len = Math.max(0, e.pageX - this.$marker.offset().left);
    //translate len in px to percentage
    var max = this.$marker.closest(".vac-marker-wrap").innerWidth(),
        lenPercent = (len / max) * 100;

    this.$marker.css('width', lenPercent + "%");
    this.range.end = this.player.currentTime();
    if(len === 0){
      // scrubbed earlier than marker
      this.player.currentTime(this.range.start);
    }
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

  teardown () {
    super.teardown();
    $(document).off("mousemove.draggableMarker");
    $(document).off("mouseup.draggableMarker");
  }
}

module.exports = {
	class: draggableMarker
};