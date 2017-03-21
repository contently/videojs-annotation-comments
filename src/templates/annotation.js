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

module.exports = {markerTemplate, commentsTemplate};
