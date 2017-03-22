"use strict";

const PlayerComponent = require("./player_component").class;

class AnnotationState extends PlayerComponent {

  constructor(playerId) {
    super(playerId);
  }

  setState(annotations = [], activeAnnotation = null) {
    this.player.annotationState = {
      annotations: annotations,
      annotationTimeMap: this.annotationTimeMap(annotations),
      activeAnnotation: activeAnnotation || {close: (function (){return null})}
    };
  }

  annotationTimeMap(annotations) {
    var timeMap = {};
    annotations.forEach((annotation) => {
      annotation.secondsActive.forEach((second) => {
        var val = (timeMap[second.toString()] || [])
        val.push(annotations.indexOf(annotation));
        timeMap[second.toString()] = val;
      });
    });

    return timeMap;
  }
}

module.exports = {
  class: AnnotationState
};
