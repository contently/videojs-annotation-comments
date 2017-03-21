var commentListTemplate = `
  <div class="vac-comments-container" style="height: {{height}};">
    {{#each comments as |comment|}}
      <div class="comment">
        <div class="comment-header">
          <div class="author-name">{{comment.meta.user_id}}</div>
          <div class="timestamp">{{comment.timeSince}} ago</div>
        </div>
        <div class="comment-body">
          {{comment.body}}
        </div>
      </div>
    {{/each}}
    <div class="reply-btn">Create reply</div>
  </div>
`;

module.exports = {commentListTemplate};
