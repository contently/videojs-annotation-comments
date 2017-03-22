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

  bindListEvents() {
    this.$el.find(".vac-close-comment-list").click(() => this.annotation.close());
  }

  render() {
    this.$el = $(this.renderTemplate(
      this.commentsTemplate,
      {
        comments: this.comments,
        height: $(".vjs-text-track-display").height() - 40 + 'px',
        timeSince: this.comments[0].timeSince
      }
    ));

    this.$player.append(this.$el);
    this.bindListEvents();

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
