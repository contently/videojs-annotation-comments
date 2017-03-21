"use strict";

const PlayerComponent = require("./player_component").class;
const CommentList = require("./comment_list").class;
const Marker = require("./marker").class;

class Annotation extends PlayerComponent {

  constructor(data, playerId) {
    super(playerId);
    this.id = data.id;
    this.range = data.range;
    this.shape = data.shape;

    this.commentList = new CommentList({"comments": data.comments, "annotation": this}, playerId)
    this.marker = new Marker(this.range, this.commentList.comments[0], playerId);
    this.marker.draw();
    this.bindMarkerEvents();
  }

  bindMarkerEvents() {
    this.marker.$el.click(() => this.commentList.render());
  }
}

module.exports = {
  class: Annotation
};
