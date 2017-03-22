"use strict";

(($, videojs) => {

	const _ = require("underscore");
	const Plugin = videojs.getPlugin('plugin');
	const Annotation = require("./modules/annotation").class;
	const Controls = require("./modules/controls").class;
	const PlayerButton = require("./modules/player_button").class;

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
		    	this.drawUI();
		    	this.bindEvents();

		    	this.toggleAnnotations(); 	//TODO - for dev, remove
		    	player.muted(true);			//TODO - for dev, remove
				player.play();				//TODO - for dev, remove
		    });
	  	}

	  	// Draw UI components for interaction
	  	drawUI () {
	  		this.components = {
	  			playerButton: new PlayerButton(this.playerId),
	  			controls: new Controls(this.playerId)
	  		};

	  		this.components.playerButton.updateNumAnnotations(this.annotations.length);
	  	}

	  	// Bind needed events for interaction w/ components
	  	bindEvents () {
	  		this.components.playerButton.$el.on('click', () => {
		        this.toggleAnnotations();
		    });
	  	}

	  	// Toggle annotations mode on/off
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
	}

	videojs.registerPlugin('annotationComments', Main);

})(jQuery, window.videojs);
