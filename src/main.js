"use strict";

(($, videojs) => {

    const _ = require("underscore");
    const Plugin = videojs.getPlugin('plugin');
    const Controls = require("./modules/controls").class;
    const PlayerButton = require("./modules/player_button").class;
    const AnnotationState = require("./modules/annotation_state").class;

    const DEFAULT_OPTIONS = Object.freeze({
        bindArrowKeys:      true,
        meta:               {},
        onStateChanged:     null,
        annotationsObjects: []
    });

    class Main extends Plugin {

        constructor(player, options) {
            // TODO - fix this!
            //options = _.extend(options, DEFAULT_OPTIONS);

            super(player, options);

            this.playerId = $(player.el()).attr('id');
            this.player = player;
            this.meta = options.meta;
            this.options = options;

            //assign reference to this class to player for access later by components where needed
            let self = this;
            player.annotationComments = () => { return self };

            // setup initial state and draw UI after video is loaded
            player.on("loadedmetadata", () => {
                this.annotationState = new AnnotationState(this.playerId, options.onStateChanged);
                this.annotationState.annotations = options.annotationsObjects;

                this.drawUI();
                this.bindEvents();
            });
        }

        // Draw UI components for interaction
        drawUI () {
            this.components = {
                playerButton:   new PlayerButton(this.playerId),
                controls:       new Controls(this.playerId, this.options.bindArrowKeys)
            };

            this.components.playerButton.updateNumAnnotations(this.annotationState.annotations.length);
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
            this.annotationState.enabled = this.active;
            if(!this.active){
                this.components.controls.clear(true);
            }else{
                this.components.controls.draw();
            }
        }
    }

    videojs.registerPlugin('annotationComments', Main);

})(jQuery, window.videojs);
