"use strict";

const MarkerTemplate = require("./../templates/marker").markerTemplate;
const PlayerComponent = require("./player_component").class;

class Marker extends PlayerComponent {

  constructor(range, comment, playerId) {
  	super(playerId);
    this.range = range;
    this.comment = comment;

    this.template = MarkerTemplate;
    this.draw();
  }

  get $el () {
  	return this.$marker;
  }
  
  draw () {
  	// Draw marker on timeline for this.range;
    var $timeline = this.$player.find('.vjs-progress-control')
    var $markerWrap = $timeline.find(".vac-marker-wrap");

    if(!$markerWrap.length){
      var $outerWrap = $("<div/>").addClass("vac-marker-owrap"),
          $markerWrap = $("<div/>").addClass("vac-marker-wrap");

      $timeline.append($outerWrap.append($markerWrap));
    }

    var $marker = $(this.renderTemplate(this.template, this.buildMarkerData()));

    // handle dimming other markers + highlighting this one
    $marker.mouseenter(() => {
      $markerWrap.addClass('dim-all');
      $marker.addClass('hovering');
    }).mouseleave(() => {
      $markerWrap.removeClass('dim-all');
      $marker.removeClass('hovering');
    });

    $markerWrap.append($marker);
    this.$marker = $marker;
  }

  // Build object for template
  buildMarkerData () {
    var left = (this.range.start / this.duration) * 100;
    var width = ((this.range.end / this.duration) * 100) - left;
    return {
      "left"        : left + "%",
      "width"       : width + "%",
      "tooltipRight": left > 50,
      "tooltipTime" : this.humanTime(),
      "tooltipBody" : this.comment.body,
      "rangeShow"  : !!this.range.end
    }
  }

  // Convert num seconds to human readable format (M:SS)
  humanTime () {
    var mins = Math.floor(this.range.start/60),
        secs = String(this.range.start % 60);
    return mins + ":" + (secs.length==1 ? "0" : "") + secs;
  }

}

module.exports = {
	class: Marker
};