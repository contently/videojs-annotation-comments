var commentTemplate = `
  <div class="comment" data-id="{{id}}">
    <div class="comment-header">
      <div class="author-name">{{meta.user_name}}</div>
      <div class="timestamp">{{timeSince}} ago
        <span class="delete-comment">&nbsp;&nbsp;X</span>
      </div>
    </div>
    <div class="comment-body">
      {{breaklines body}}
    </div>
  </div>
`;

module.exports = {commentTemplate};
