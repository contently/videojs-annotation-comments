var markerTemplate = `
  <div class="vac-marker {{#if rangeShow}}ranged-marker{{/if}}" style="left: {{left}}; {{#if rangeShow}}width:{{width}};{{/if}}">
    <div>
      <span class="vac-tooltip {{#if tooltipRight}}right-side{{/if}}">
        <b>{{tooltipTime}}</b> - {{tooltipBody}}
      </span>
    </div>
  </div>
`;

module.exports = {markerTemplate};