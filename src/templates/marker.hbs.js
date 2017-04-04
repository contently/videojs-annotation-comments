var markerTemplate = `
  <div id="{{id}}" class="vac-marker {{#if rangeShow}}ranged-marker{{/if}}" style="left: {{left}}; {{#if rangeShow}}width:{{width}};{{/if}}">
    {{#if tooltipBody}}
    	<div>
	     	<span class="vac-tooltip {{#if tooltipRight}}vac-right-side{{/if}}">
	        	<b>{{tooltipTime}}</b> - {{tooltipBody}}
	      	</span>
    	</div>
    {{/if}}
  </div>
`;

var draggableMarkerTemplate = `
	<div id="{{id}}" class="vac-marker-draggable ranged-marker" style="left: {{left}}; width:{{width}};">
  	</div>
`;

module.exports = {markerTemplate, draggableMarkerTemplate};