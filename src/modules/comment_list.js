"use strict";

const PlayerComponent = require("./player_component").class;
const Comment = require("./comment").class;
const CommentListTemplate = require("./../templates/comment_list").commentListTemplate

class CommentList extends PlayerComponent {

  constructor(data, playerId) {
    super(playerId);

    this.annotation = data.annotation;
    this.comments = data.comments.map((c) => new Comment(c, playerId));
    this.commentsTemplate = CommentListTemplate;
  }

  render() {
    // this.$player.find(".vac-comments-container").remove();

    this.$el = $(this.renderTemplate(
      this.commentsTemplate,
      {comments: this.comments, height: $(".vjs-text-track-display").height() + 'px'}
    ));
    this.$player.append(this.$el);

    this.player.pause();
    this.player.currentTime(this.annotation.range.start);
  }

  teardown() {
    if(!!this.$el){
      this.$el.remove();
    }
  }
}

module.exports = {
  class: CommentList
};
