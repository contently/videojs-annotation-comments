"use strict";

const PlayerComponent = require("./player_component").class;
const Comment = require("./comment").class;

class Annotation extends PlayerComponent {
  
  constructor(data, playerId) {
    super(playerId);
    this.id = data.id;
    this.range = data.range;
    this.shape = data.shape;
    this.comments = data.comments.map( (c) => new Comment(c, playerId) );

    this.drawMarker();
  }

  drawMarker () {
    // Draw marker on timeline for this.range;

    var $timeline = this.$player.find('.vjs-progress-control'),
        duration = this.player.duration();

    //TODO - move this shit to a template file/engine

    var $markerWrap = $timeline.find(".vac-marker-wrap");
    if(!$markerWrap.length){
      var $outerWrap = $("<div/>").addClass("vac-marker-owrap"),
          $markerWrap = $("<div/>").addClass("vac-marker-wrap");

      $timeline.append($outerWrap.append($markerWrap));
    }

    var $marker = $("<div/>").addClass("vac-marker"),
        left = (this.range.start / duration) * 100;

    $marker.css({
      "margin-left" : -parseFloat($marker.css("width"))/2 + 'px',
      "left" : left + '%',
    });
    var $markerInner = $("<div/>");
    $marker.append( $markerInner );

    // create tooltip
    var $tooltip = $("<span/>").addClass('vac-tooltip');
    if(left > 50) $tooltip.addClass('right-side');

    $tooltip.append($('<b/>').text(this.humanTime())).append(" - "+this.comments[0].body);
    $markerInner.append($tooltip);

    // handle dimming other markers + highlighting this one
    $marker.mouseenter(() => {
      $markerWrap.addClass('dim-all');
      $marker.addClass('hovering');
    }).mouseleave(() => {
      $markerWrap.removeClass('dim-all');
      $marker.removeClass('hovering');
    });

    if(!!this.range.end){
      $marker.addClass("ranged-marker");
      var right = ((this.range.end / duration) * 100) - left;
      $marker.css({"width": right + "%"});
    }

    $markerWrap.append($marker);
  }

  // Convert num seconds to human readable format (M:SS)
  humanTime () {
    var mins = Math.floor(this.range.start/60),
        secs = String(this.range.start % 60);
    return mins + ":" + (secs.length==1 ? "0" : "") + secs;
  }
}

module.exports = {
  class: Annotation
};
