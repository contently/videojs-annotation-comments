var commentTemplate = `
  <div class="vac-comment" data-id="{{id}}">
    <div class="vac-comment-header">
      <div class="vac-author-name">{{meta.user_name}}</div>
      <div class="vac-timestamp">{{timeSince}} ago
        <span class="vac-delete-comment">&nbsp;&nbsp;X</span>
      </div>
    </div>
    <div class="vac-comment-body">
      {{breaklines body}}
    </div>
  </div>
`;

module.exports = {commentTemplate};
