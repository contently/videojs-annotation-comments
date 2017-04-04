var ControlsTemplate = `
	{{#unless adding}}
	  	<div class="vac-controls vac-control">
		  	Annotations
			<button class="vac-button">+ NEW</button>
			{{#if showNav}}
				<div class="vac-annotation-nav">
					<div class="vac-a-prev">Prev</div>
					<div class="vac-a-next">Next</div>
				</div>
			{{/if}}
		</div>
	{{/unless}}

	{{#if adding}}
		<div class="vac-video-cover vac-control">
			<div class="vac-video-cover-canvas"></div>
		</div>

		<div class="vac-add-controls vac-control">
		  	New Annotation
			<i>Select shape + range</i>
			<button class="vac-button">CONTINUE</button>
			<a>cancel</a>
			<div class="vac-video-move">
				<div class="vac-a-prev">-1 sec</div>
				<div class="vac-a-next">+1 sec</div>
			</div>
		</div>

		{{#if writingComment}}
			<div class="vac-video-write-new-wrap vac-control">
				<div class="vac-video-write-new vac-is-annotation">
					<div>
						<h5><b>New Annotation</b> @ {{rangeStr}}</h5>
						<div class="vac-comment-showbox">
							<textarea placeholder="Enter comment..."></textarea>
							<div>
								<button class="vac-button">SAVE</button>
								<a>Cancel</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		{{/if}}

	{{/if}}
`;

module.exports = {ControlsTemplate};
