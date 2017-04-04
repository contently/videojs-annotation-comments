var commentListTemplate = `
  <div class="vac-comments-container">
    <div class="vac-comments-wrap">
      {{#each commentsHTML as |comment|}}
        {{{comment}}}
      {{/each}}
      <div class="vac-reply-btn vac-button">ADD REPLY</div>
      <div class="vac-add-new-shapebox"></div>
    </div>
    <div class="vac-comments-control-bar">
      <div class="vac-range"><b>@</b> {{rangeStr}}</div>
      <div class="vac-control-buttons">
        <a class="vac-delete-annotation">DELETE</a> | <a class="vac-close-comment-list">CLOSE</a>
      </div>
    </div>
  </div>
`;

var newCommentTemplate = `
  <div class="vac-video-write-new-wrap vac-new-comment">
    <div class="vac-video-write-new vac-is-comment">
      <div class="vac-comment-showbox" style="width:{{width}}px;top:{{top}}px;right:{{right}}px">
        <textarea placeholder="Enter comment..."></textarea>
        <div>
          <button class="vac-button">SAVE</button>
          <a>Cancel</a>
        </div>
      </div>
  </div>
`;

module.exports = {commentListTemplate, newCommentTemplate};
