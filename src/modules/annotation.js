"use strict";

const PlayerComponent = require("./player_component").class;
const CommentList = require("./comment_list").class;
const Marker = require("./marker").class;
const AnnotationShape = require("./annotation_shape").class;

class Annotation extends PlayerComponent {

  constructor(data, playerId) {
    super(playerId);
    this.id = data.id;
    this.range = data.range;
    this.shape = data.shape;

    this.commentList = new CommentList({"comments": data.comments, "annotation": this}, playerId)
    this.marker = new Marker(this.range, this.commentList.comments[0], playerId);
    this.marker.draw();
    this.annotationShape = new AnnotationShape(this.shape, playerId);
    this.secondsActive = this.secondsActive();
    this.bindMarkerEvents();
  }

  bindMarkerEvents() {
    this.marker.$el.click(() => this.open());
  }

  open(withPause = true) {
    this.player.annotationState.activeAnnotation.close()

    this.commentList.render();
    this.annotationShape.draw();

    this.marker.$el.addClass("active");
    this.player.annotationState.activeAnnotation = this;

    if(withPause) {
      this.player.pause();
      this.player.currentTime(this.range.start);
    }
  }

  close() {
    this.marker.$el.removeClass("active");
    this.commentList.teardown();
    this.annotationShape.teardown();
  }

  secondsActive() {
    if(!!this.range.end) {
      var seconds = [];
      for (var i = this.range.start; i <= this.range.end; i++) {
        seconds.push(i);
      }
    } else {
      var start = this.range.start;
      var seconds = [start - 1, start, start + 1];
    }
    return seconds;
  }
}

module.exports = {
  class: Annotation
};
