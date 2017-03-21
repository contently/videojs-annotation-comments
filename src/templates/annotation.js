var markerTemplate = `
  <div class="vac-marker {{#if rangeShow}}ranged-marker{{/if}}" style="left: {{left}}; {{#if rangeShow}}width:{{width}};{{/if}}">
    <div>
      <span class="vac-tooltip {{#if tooltipRight}}right-side{{/if}}">
        <b>{{tooltipTime}}</b> - {{tooltipBody}}
      </span>
    </div>
  </div>
`;

var commentsTemplate = `
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

module.exports = {markerTemplate, commentsTemplate};
