"use strict";

const _ = require("underscore");
const moment = require("moment");
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
    this.secondsActive = this.buildSecondsActiveArray();
    this.bindMarkerEvents();
  }

  bindMarkerEvents() {
    this.marker.$el.click(() => { this.plugin.annotationState.openAnnotation(this) });
  }

  open(withPause = true) {
    this.commentList.render();
    this.annotationShape.draw();
    this.marker.$el.addClass("active");

    if(withPause) {
      this.player.pause();
      this.player.currentTime(this.range.start);
    }
  }

  close() {
    this.marker.$el.removeClass("active");
    this.commentList.teardown();
    this.annotationShape.teardown();
    this.plugin.annotationState.clearActive();
  }

  buildSecondsActiveArray () {
    var seconds = [];
    if(!!this.range.end) {
      for (var i = this.range.start; i <= this.range.end; i++) {
        seconds.push(i);
      }
    } else {
      var start = this.range.start;
      if(start > 0) seconds.push(start-1);
      seconds.push(start);
      if(start < this.duration) seconds.push(start+1);
    }
    return seconds;
  }

  static newFromData (range, shape, commentStr, plugin) {
    let comment = {
      body: commentStr,
      meta: _.extend({
          datetime: moment().toISOString()
        }, plugin.meta)
    };
    let data = {
      range,
      shape,
      comments: [comment]
    }
    return new Annotation(data, plugin.playerId);
  }
}

module.exports = {
  class: Annotation
};
