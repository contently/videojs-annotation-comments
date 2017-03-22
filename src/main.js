"use strict";

(($, videojs) => {

	const _ = require("underscore");
	const Plugin = videojs.getPlugin('plugin');
	const Annotation = require("./modules/annotation").class;
	const Controls = require("./modules/controls").class;
	const PlayerButton = require("./modules/player_button").class;
	const AnnotationState = require("./modules/annotation_state").class;

	class Main extends Plugin {

		constructor(player, options) {
    	super(player, options);

    	this.playerId = $(player.el()).attr('id');
    	this.player = player;

    	//assign reference to this class to player for access later by components where needed
    	this.player.annotationComments = this;

			player.on("timeupdate", _.throttle(this.onTimeUpdate.bind(this), 750));

    	// setup initial state and draw UI after video is loaded
    	player.on("loadedmetadata", () => {

	    	this.annotations = annotations.map((a) => new Annotation(a, this.playerId));
	    	this.drawUI();
	    	this.bindEvents();

				this.annotationState = new AnnotationState(this.playerId);
				this.annotationState.setState(this.annotations);

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

		liveAnnotation(time) {
			if(!this.player.annotationState || !this.player.annotationState.annotations.length) return;

			var matchingAnnotations = this.player.annotationState.annotationTimeMap[Math.floor(time)];

			if(!!matchingAnnotations) {
				var liveAnnotationIndex = matchingAnnotations[matchingAnnotations.length - 1];
				var liveAnnotation = this.player.annotationState.annotations[liveAnnotationIndex];
			} else {
				var liveAnnotation = null;
			}

			if(!!liveAnnotation) {
				liveAnnotation.open(false);
				this.player.annotationState.activeAnnotation = liveAnnotation;
			} else {
				this.player.annotationState.activeAnnotation.close();
			}
		}

		onTimeUpdate() {
			var currentTime = player.currentTime();
			this.liveAnnotation(currentTime);
		}
	}

	videojs.registerPlugin('annotationComments', Main);

})(jQuery, window.videojs);
