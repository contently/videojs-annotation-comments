"use strict";

const _ = require("underscore");
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
    this.sortComments();
    this.commentsTemplate = CommentListTemplate;
    this.newCommentTemplate = NewCommentTemplate;
  }

  // Serialize object
  get data () {
    return this.comments.map((c) => c.data);
  }

  bindListEvents() {
    this.$el.find(".vac-close-comment-list").click(() => this.annotation.close());
    this.$el.find(".reply-btn").click(() => this.addNewComment());
    this.$el.find(".vac-delete-annotation").click(() => this.annotation.destroy());
    this.$el.find(".vac-comments-wrap").on("mousewheel DOMMouseScroll", (e) => this.limitScroll(e));
    this.$el.find(".delete-comment").click((e) => this.destroyComment(e));
  }

  bindCommentFormEvents() {
    this.$newCommentForm
      .on("click", ".vac-add-controls a, .vac-video-write-new.comment a", this.closeNewComment.bind(this))
      .on("click", ".vac-video-write-new.comment button", this.saveNewComment.bind(this));
  }

  render() {
    this.$el = $(this.renderTemplate(
      this.commentsTemplate,
      {
        comments: this.comments,
        rangeStr: this.humanTime(this.annotation.range)
      }
    ));

    this.$player.append(this.$el);
    this.$wrap = this.$player.find(".vac-comments-container");
    this.bindListEvents();
  }

  reRender() {
    this.teardown();
    this.render();
  }

  addNewComment() {
    this.$wrap.addClass("active").find(".vac-comments-wrap").scrollTop(999999);
    var $shapebox = this.$wrap.find(".add-new-shapebox"),
        width = $shapebox.outerWidth(),
        top = $shapebox.position().top + 10,
        right = this.$wrap.outerWidth() - ($shapebox.position().left + width);

    this.$newCommentForm = $(this.renderTemplate(this.newCommentTemplate, {width, top, right}));
    this.bindCommentFormEvents();
    this.$player.append(this.$newCommentForm);
  }

  saveNewComment() {
    this.$wrap.removeClass("active");

    var user_id = 1,
      body = this.$player.find(".vac-video-write-new textarea").val();
    var comment = Comment.newFromData(body, this.plugin);
    this.comments.push(comment);
    this.sortComments();
    this.closeNewComment();
    this.reRender();
  }

  closeNewComment() {
    this.$wrap.removeClass("active");
    if(this.$newCommentForm) this.$newCommentForm.remove();
  }

  destroyComment(event) {
    if(this.comments.length == 1) {
      this.annotation.destroy();
    } else {
      var $comment   = $(event.target).closest(".comment");
      var commentId  = $comment.data('id');
      var commentObj = _.find(this.comments, (c) => { return c.id == commentId });

      var i = this.comments.indexOf(commentObj);
      this.comments.splice(i, 1);

      this.reRender();
    }
  }

  teardown() {
    if(this.$el) this.$el.remove();
  }

  limitScroll(event) {
    var $target    = $(event.currentTarget);
    var currentPos = $target.scrollTop();
    var ogEvent    = event.originalEvent;
    var delta      = ogEvent.wheelDelta || -ogEvent.detail;

    $(event.currentTarget).scrollTop(currentPos + (delta < 0 ? 1 : -1) * 30);
    event.preventDefault();
  }

  sortComments () {
    this.comments.sort((a,b) => {
      return a.timestamp < b.timestamp ? -1 : (a.timestamp > b.timestamp ? 1 : 0);
    });
  }
}

module.exports = {
  class: CommentList
};
