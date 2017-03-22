"use strict";

const MarkerTemplate = require("./../templates/marker").markerTemplate;
const PlayerComponent = require("./player_component").class;

class Marker extends PlayerComponent {

  constructor(range, comment, playerId) {
  	super(playerId);
    this.range = range;
    this.comment = comment;
    this.template = MarkerTemplate;
  }

  get markerId () {
  	return "vacmarker_"+this.componentId;
  }

  get $el () {
  	return this.$marker;
  }

  draw () {
  	// Draw marker on timeline for this.range;
    var $timeline = this.$player.find('.vjs-progress-control'),
    	$markerWrap = $timeline.find(".vac-marker-wrap");

    if(!$markerWrap.length){
      var $outerWrap = $("<div/>").addClass("vac-marker-owrap");
      $markerWrap = $("<div/>").addClass("vac-marker-wrap");
      $timeline.append($outerWrap.append($markerWrap));
    }

    // clear existing marker if this one exists
    $timeline.find("#"+this.markerId).remove();

    this.$marker = $(this.renderTemplate(this.template, this.buildMarkerData()));
    $markerWrap.append(this.$marker);
    this.bindMarkerEvents();
  }

  bindMarkerEvents () {
  	// handle dimming other markers + highlighting this one
    this.$marker.mouseenter(() => {
      this.$marker.addClass('hovering').closest(".vac-marker-wrap").addClass('dim-all')
    }).mouseleave(() => {
      this.$marker.removeClass('hovering').closest(".vac-marker-wrap").removeClass('dim-all');
    });
  }

  // Build object for template
  buildMarkerData () {
    var left = (this.range.start / this.duration) * 100;
    var width = ((this.range.end / this.duration) * 100) - left;
    return {
      "left"        : left + "%",
      "width"       : width + "%",
      "tooltipRight": left > 50,
      "tooltipTime" : this.humanTime(this.range),
      "tooltipBody" : !this.comment ? null : this.comment.body,
      "rangeShow"   : !!this.range.end,
      "id"			: this.markerId
    }
  }

  teardown () {
  	this.$marker.remove();
  }
}

module.exports = {
	class: Marker
};
