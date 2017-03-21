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
    this.bindMarkerEvents();
  }

  bindMarkerEvents() {
    this.marker.$el.click(() => this.open());
  }

  open() {
    this.activeAnnotation.close()

    this.commentList.render();
    this.annotationShape.draw();

    this.marker.$el.addClass("active");
    this.player.activeAnnotation = this;
  }

  close() {
    this.marker.$el.removeClass("active");
    this.commentList.teardown();
    this.annotationShape.teardown();
  }
}

module.exports = {
  class: Annotation
};
