var ControlsTemplate = `
	{{#unless adding}}
	  	<div class="vac-controls vac-control">
		  	Annotations
			<button class="vac-button">+ NEW</button>
			<div class="nav">
				<div class="prev">Prev</div>
				<div class="next">Next</div>
			</div>
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
		</div>

		{{#if writingComment}}
			<div class="vac-video-write-new-wrap vac-control">
				<div class="vac-video-write-new">
					<div>
						<h5><b>New Annotation</b> @ {{rangeStr}}</h5>
						<div>
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
