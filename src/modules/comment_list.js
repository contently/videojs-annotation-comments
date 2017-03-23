"use strict";

const PlayerComponent = require("./player_component").class;
const Comment = require("./comment").class;
const Templates = require("./../templates/comment_list");
const CommentListTemplate = Templates.commentListTemplate;
const NewCommentTemplate = Templates.newCommentTemplate;

class CommentList extends PlayerComponent {

  constructor(data, playerId) {
    super(playerId);

    this.annotation = data.annotation;
    this.comments = data.comments.map((c) => new Comment(c, playerId));
    this.commentsTemplate = CommentListTemplate;
    this.newCommentTemplate = NewCommentTemplate;
  }

  bindListEvents() {
    this.$el.find(".vac-close-comment-list").click(() => this.annotation.close());
    this.$el.find(".reply-btn").click(() => this.addNewComment());
  }

  bindCommentFormEvents() {
    this.$newCommentForm
      .on("click", ".vac-add-controls a, .vac-video-write-new.comment a", this.closeNewComment.bind(this))
      .on("click", ".vac-video-write-new.comment button", this.saveNewComment.bind(this));
  }

  render() {
    console.log(this.annotation);
    this.$el = $(this.renderTemplate(
      this.commentsTemplate,
      {
        comments: this.comments,
        rangeStr: this.humanTime(this.annotation.range)
      }
    ));

    this.$player.append(this.$el);
    this.bindListEvents();
  }

  reRender() {
    this.teardown();
    this.render();
  }

  addNewComment() {
    this.$newCommentForm = $(this.renderTemplate(this.newCommentTemplate));
    this.bindCommentFormEvents();
    this.$player.append(this.$newCommentForm);
  }

  saveNewComment() {
    var user_id = 1,
      body = this.$player.find(".vac-video-write-new textarea").val();
    var comment = Comment.newFromData(user_id, body, this.plugin);
    this.comments.push(comment);
    this.closeNewComment();
    this.reRender();
  }

  closeNewComment() {
    if(this.$newCommentForm) this.$newCommentForm.remove();
  }

  teardown() {
    if(this.$el) this.$el.remove();
  }
}

module.exports = {
  class: CommentList
};
