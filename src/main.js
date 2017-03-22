"use strict";

(($, videojs) => {

	const _ = require("underscore");
	const Plugin = videojs.getPlugin('plugin');
	const Annotation = require("./modules/annotation").class;
	const Controls = require("./modules/controls").class;

	class Main extends Plugin {

		constructor(player, options) {
	    	super(player, options);

	    	this.playerId = $(player.el()).attr('id');
	    	this.player = player;

	    	//assign reference to this class to player for access later by components where needed
	    	this.player.annotationComments = this;

	    	// setup initial state and draw UI after video is loaded
	    	player.on("loadedmetadata", () => {
		    	this.annotations = annotations.map((a) => new Annotation(a, this.playerId));
		    	this.drawUI(player);

		    	this.toggleAnnotations(); 	//TODO - for dev, remove
		    	player.muted(true);			//TODO - for dev, remove
				player.play();				//TODO - for dev, remove
		    });
	  	}

	  	drawUI() {
	  		this.components = {};

	  		// Add button to player
	  		// TODO - clean this shit up - move this & bubble to seperate component module file??
	  		this.components.playerBtn = player.getChild('controlBar').addChild('button', {});
	  		this.components.playerBtn.addClass('vac-player-btn');
		  	this.components.playerBtn.on('click', () => {
	  			this.components.playerBtn.toggleClass('vac-active');
	  			this.toggleAnnotations();
	  		});
	  		this.components.playerBtn.controlText("Toggle Animations");

	  		// Add controls box
	  		this.components.controls = new Controls(this.playerId);

	  		this.updateAnnotationBubble();
	  	}

	  	toggleAnnotations() {
	  		this.active = !this.active;
	  		this.player.toggleClass('vac-active'); // Toggle global class to player to toggle display of elements
	  		if(!this.active){
	  			this.components.controls.clear(true);
          		this.player.activeAnnotation.close();
	  		}else{
	  			this.components.controls.draw();
	  		}
	  	}

	  	dispose() {
	    	super.dispose();
	    	videojs.log('the advanced plugin is being disposed');
	  	}

	  	updateAnnotationBubble () {
	  		var $el = $(this.components.playerBtn.el()),
	  			$bubble = $el.find("b");

	  		if(!$bubble.length){
	  			$bubble = $("<b/>");
	  			$el.append($bubble);
	  		}

	  		var num = this.annotations.length;
	  		$bubble.text(num);
	  		num > 0 ? $el.addClass('show') : $el.addClass('hide');
	  	}
	}

	videojs.registerPlugin('annotationComments', Main);

})(jQuery, window.videojs);
