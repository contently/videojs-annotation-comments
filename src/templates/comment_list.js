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
    <div class="reply-btn">CREATE REPLY</div>
  </div>
  <div class="vac-comments-control-bar">
    <div class="timestamp">{{timeSince}} ago</div>
    <div class="control-buttons">
      <a>DELETE</a> | <a class="vac-close-comment-list">CLOSE</a>
    </div>
  </div>
`;

module.exports = {commentListTemplate};
