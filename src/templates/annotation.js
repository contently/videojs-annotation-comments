var commentsTemplate = `
  <div class="comments-container">
    Some text {{id}}
    {{#each comments as |comment|}}
      <div class="comment">
        <div class="comment-header">
          <span class="author-name">{{comment.meta.user_id}}</span>
          <span class="timestamp">{{comment.meta.datetime}}</span>
        </div>
        <div class="comment-body">
          {{comment.body}}
        </div>
      </div>
    {{/each}}
  </div>
`;

module.exports = {commentsTemplate};
