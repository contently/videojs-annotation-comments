"use strict";

const PlayerComponent = require("./player_component").class;
const Comment = require("./comment").class;
const Marker = require("./marker").class;
const Templates = require("./../templates/annotation")
const CommentsTemplate = Templates.commentsTemplate;

class Annotation extends PlayerComponent {

  constructor(data, playerId) {
    super(playerId);
    this.id = data.id;
    this.range = data.range;
    this.shape = data.shape;
    this.comments = data.comments.map( (c) => new Comment(c, playerId) );

    this.commentsTemplate = CommentsTemplate;

    this.marker = new Marker(this.range, this.comments[0], playerId);
    this.marker.draw();
    this.bindMarkerEvents();
  }

  bindMarkerEvents() {
    this.marker.$el.click(() => this.renderComments())
  }

  renderComments () {
    $(".vac-comments-container").remove()

    var $commentsContainer = $(this.renderTemplate(
      this.commentsTemplate,
      {comments: this.comments, height: $(".vjs-text-track-display").height() + 'px'}
    ));
    this.$player.append($commentsContainer);

    this.player.pause();
    this.player.currentTime(this.range.start);
  }
}

module.exports = {
  class: Annotation
};
