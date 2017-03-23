"use strict";
/*
  Component for a timeline marker with capabilities to draw on timeline, including tooltip for comment
*/

const MarkerTemplate = require("./../templates/marker").markerTemplate;
const PlayerComponent = require("./player_component").class;

class Marker extends PlayerComponent {

  constructor(range, comment, playerId) {
  	super(playerId);
    this.range = range;
    this.comment = comment;
    this.template = MarkerTemplate;
  }

  // attribute to get the DOM id for this marker node
  get markerId () {
  	return "vacmarker_"+this.componentId;
  }

  setActive (showTooltip=false) {
    this.$el.addClass("active");
    if(showTooltip){
      this.$el.addClass('force-tooltip');
    }
  }

  deactivate () {
    this.$el.removeClass("active force-tooltip");
  }

  // Draw marker on timeline for this.range;
  draw () {
    var $timeline = this.$player.find('.vjs-progress-control'),
    	$markerWrap = $timeline.find(".vac-marker-wrap");

    // If markerWrap does NOT exist yet, draw it on the timeline and grab it's jquery ref
    if(!$markerWrap.length){
      var $outerWrap = $("<div/>").addClass("vac-marker-owrap");
      $markerWrap = $("<div/>").addClass("vac-marker-wrap");
      $timeline.append($outerWrap.append($markerWrap));
    }

    // clear existing marker if this one was already drawn
    $timeline.find("#"+this.markerId).remove();

    // Bind to local instance var, add to DOM, and setup events
    this.$el = $(this.renderTemplate(this.template, this.markerTemplateData));
    $markerWrap.append(this.$el);
    this.bindMarkerEvents();
  }

  // Bind needed events for this marker
  bindMarkerEvents () {
  	// handle dimming other markers + highlighting this one on mouseenter/leave
    this.$el.on("mouseenter.marker", () => {
      this.$el.addClass('hovering').closest(".vac-marker-wrap").addClass('dim-all')
    }).on("mouseleave.marker", () => {
      this.$el.removeClass('hovering').closest(".vac-marker-wrap").removeClass('dim-all');
    });
  }

  // Build object for template
  get markerTemplateData () {
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

  // Unbind event listeners on teardown and remove DOM nodes
  teardown () {
    this.$el.off("mouseenter.marker mousleave.marker")
    super.teardown();
  }
}

module.exports = {
	class: Marker
};
