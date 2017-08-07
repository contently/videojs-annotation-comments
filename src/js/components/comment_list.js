"use strict";
/*
  Component for a list of comments in a visible/active annotation
*/

const   PlayerUIComponent = require("./../lib/player_ui_component").class,
        Utils = require("./../lib/utils"),
        Comment = require("./comment").class,
        commentListTemplateName = 'comment_list',
        newCommentTemplateName = 'new_comment';

class CommentList extends PlayerUIComponent {

    constructor (data, playerId) {
        super(playerId);

        this.annotation = data.annotation;
        this.comments = data.comments.map((c) => new Comment(c, playerId));
        this.sortComments();
    }

    // Serialize object
    get data () {
        return this.comments.map((c) => c.data);
    }

    // Bind all events needed for the comment list
    bindListEvents () {
        this.$el
            .on("click.comment", ".vac-close-comment-list", () => this.annotation.close()) // Hide CommentList UI with close button
            .on("click.comment", ".vac-reply-btn", () => this.addNewComment()) // Open new reply UI with reply button
            .on("click.comment", ".vac-delete-annotation", (e) => this.handleDeleteAnnotationClick(e)) // Delete annotation with main delete button
            .on("click.comment", ".vac-delete-comment", (e) => this.destroyComment(e)) // Delete comment with delete comment button
            .on("mousewheel.comment DOMMouseScroll.comment", ".vac-comments-wrap", this.disablePageScroll); // Prevent outer page scroll when scrolling inside of the CommentList UI
    }

    // Bind event listeners for new comments form
    bindCommentFormEvents () {
        this.$newCommentForm
            .on("click.comment", ".vac-add-controls a, .vac-video-write-new.vac-is-comment a", this.closeNewComment.bind(this)) // Cancel new comment creation with cancel link
            .on("click.comment", ".vac-video-write-new.vac-is-comment button", this.saveNewComment.bind(this)); // Save new comment with save button
    }

    // Render CommentList UI with all comments using template
    render () {
        this.$el = $(this.renderTemplate(
            commentListTemplateName,
            {
                commentsHTML: this.comments.map((c) => c.HTML),
                rangeStr: Utils.humanTime(this.annotation.range)
            }
        ));

        this.$player.append(this.$el);
        this.$wrap = this.$UI.commentsContainer;
        this.bindListEvents();
    }

    // Re-render UI on state change
    reRender () {
        this.teardown();
        this.render();
    }

    // Render new comment form
    addNewComment () {
        this.$wrap.addClass(this.UI_CLASSES.active).find(".vac-comments-wrap").scrollTop(999999);
        var $shapebox = this.$wrap.find(".vac-add-new-shapebox"),
            width = $shapebox.outerWidth(),
            top = $shapebox.position().top + 10,
            right = this.$wrap.outerWidth() - ($shapebox.position().left + width);

        this.$newCommentForm = $(this.renderTemplate(newCommentTemplateName, {width, top, right}));
        this.bindCommentFormEvents();
        this.$player.append(this.$newCommentForm);
    }

    // Save comment from new comment form, update state and re-render UI
    saveNewComment () {
        this.$wrap.removeClass(this.UI_CLASSES.active);

        let user_id = 1,
            body = this.$UI.newCommentTextarea.val();

        if(!body) return; // empty comment - TODO add validation / err message

        let comment = Comment.newFromData(body, this.plugin);
        this.comments.push(comment);
        this.sortComments();
        this.closeNewComment();
        this.reRender();

        this.plugin.annotationState.stateChanged();
    }

    // Cancel comment adding process
    closeNewComment () {
        this.$wrap.removeClass(this.UI_CLASSES.active);
        if(this.$newCommentForm) this.$newCommentForm.remove();
    }

    // Delete a comment. If it is the only comment, delete the annotation
    // Update state and re-render UI
    destroyComment (event) {
        let annotationId = this.annotation.id;
        if(this.comments.length == 1) {
            this.annotation.destroy();
        } else {
            let $comment   = $(event.target).closest(".vac-comment"),
                commentId  = $comment.data('id'),
                commentObj = this.comments.find((c) => c.id == commentId),
                i = this.comments.indexOf(commentObj);
            this.comments.splice(i, 1);
            this.reRender();
        }

        this.plugin.annotationState.stateChanged();
    }

    // Prevents outer page scroll when at the top or bottom of CommentList UI
    // TODO: This might need to be fine-tuned?
    disablePageScroll (event) {
        let $target = $(event.currentTarget),
            height  = $target.height(),
            ogEvent = event.originalEvent,
            delta   = ogEvent.wheelDelta || -ogEvent.detail,
            dir     = delta < 0 ? "down" : "up",
            scrollDiff = Math.abs(event.currentTarget.scrollHeight - event.currentTarget.clientHeight);

        // if scrolling into top of div
        if ($target.scrollTop() < 20 && dir == "up") {
            $target.stop();
            $target.animate({scrollTop: 0}, 100);
            event.preventDefault();
        }

        // if scrolling into bottom of div
        if ($target.scrollTop() > (scrollDiff - 10) && dir == "down") {
            $target.stop();
            $target.animate({scrollTop: height + 40}, 100);
            event.preventDefault();
        }
    }

    // Sort comments by timestamp
    sortComments () {
        this.comments.sort((a,b) => {
            return a.timestamp < b.timestamp ? -1 : (a.timestamp > b.timestamp ? 1 : 0);
        });
    }

    // Delete the annotation
    handleDeleteAnnotationClick (e) {
        let $confirmEl = $("<a/>").addClass("vac-delete-confirm").text("CONFIRM");
        $confirmEl.on("click.comment", () => {
            $confirmEl.off("click.comment");
            this.annotation.destroy();
        });
        $(e.target).replaceWith($confirmEl);
    }

    // Teardown CommentList UI, unbind events
    teardown () {
        super.teardown();
        if(this.$el) {
            this.$el
                .off("click.comment", ".vac-close-comment-list")
                .off("click.comment", ".vac-reply-btn")
                .off("click.comment", ".vac-delete-annotation")
                .off("click.comment", ".vac-delete-comment")
                .off("mousewheel.comment DOMMouseScroll.comment", ".vac-comments-wrap");
        }
        if(this.$newCommentForm){
            this.$newCommentForm
                .off("click.comment", ".vac-add-controls a, .vac-video-write-new.vac-comment a")
                .off("click.comment", ".vac-video-write-new.vac-comment button");
        }
    }
}

module.exports = {
    class: CommentList
};
