"use strict";

const PlayerComponent = require("./player_component").class;
const Comment = require("./comment").class;
const Templates = require("./../templates/annotation")
const MarkerTemplate = Templates.markerTemplate;
const CommentsTemplate = Templates.commentsTemplate;

class Annotation extends PlayerComponent {

  constructor(data, playerId) {
    super(playerId);
    this.id = data.id;
    this.range = data.range;
    this.shape = data.shape;
    this.comments = data.comments.map( (c) => new Comment(c, playerId) );

    this.markerTemplate = MarkerTemplate;
    this.commentsTemplate = CommentsTemplate;

    this.drawMarker();
  }

  drawMarker () {
    // Draw marker on timeline for this.range;
    var $timeline = this.$player.find('.vjs-progress-control')
    var $markerWrap = $timeline.find(".vac-marker-wrap");

    if(!$markerWrap.length){
      var $outerWrap = $("<div/>").addClass("vac-marker-owrap"),
          $markerWrap = $("<div/>").addClass("vac-marker-wrap");

      $timeline.append($outerWrap.append($markerWrap));
    }

    var $marker = $(this.renderTemplate(this.markerTemplate, this.buildMarkerData()));

    // handle dimming other markers + highlighting this one
    $marker.mouseenter(() => {
      $markerWrap.addClass('dim-all');
      $marker.addClass('hovering');
    }).mouseleave(() => {
      $markerWrap.removeClass('dim-all');
      $marker.removeClass('hovering');
    });

    $marker.click(() => this.renderComments())

    $markerWrap.append($marker);
  }

  renderComments () {
    this.$player.find(".comments-container").remove()

    var $commentsContainer = $(this.renderTemplate(
      this.commentsTemplate,
      {
        comments: this.comments,

      }
    ));
    this.$player.append($commentsContainer);
  }

  // Convert num seconds to human readable format (M:SS)
  humanTime () {
    var mins = Math.floor(this.range.start/60),
        secs = String(this.range.start % 60);
    return mins + ":" + (secs.length==1 ? "0" : "") + secs;
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
      "tooltipBody" : this.comments[0].body,
      "rangeShow"  : !!this.range.end
    }
  }
}

module.exports = {
  class: Annotation
};
