"use strict";

(($, videojs) => {

    const cloneObject = require("./utils").cloneObject;
    const Plugin = videojs.getPlugin('plugin');
    const Controls = require("./modules/controls").class;
    const PlayerButton = require("./modules/player_button").class;
    const AnnotationState = require("./modules/annotation_state").class;

    const DEFAULT_OPTIONS = Object.freeze({
        bindArrowKeys:      true,
        meta:               { user_id: null, user_name: null },
        onStateChanged:     null,
        annotationsObjects: [],
        showControls:       true,
        showCommentList:    true,
        showFullScreen:     true,
        showMarkerTooltips: true,
        internalCommenting: true
    });

    class Main extends Plugin {

        constructor(player, options) {
            options = Object.assign(cloneObject(DEFAULT_OPTIONS), options);
            super(player, options);

            this.playerId = $(player.el()).attr('id');
            this.player = player;
            this.meta = options.meta;
            this.options = options;

            // assign reference to this class to player for access later by components where needed
            var self = this;
            player.annotationComments = () => { return self };

            // remove annotation features on fullscreen if showFullScreen: false
            if (!this.options.showFullScreen) {
                player.on('fullscreenchange', () => {
                    if (player.isFullscreen_) {
                        if(self.active) self.toggleAnnotations();
                        $(player.el()).addClass('vac-disable-fullscreen');
                    } else {
                        $(player.el()).removeClass('vac-disable-fullscreen');
                    }
                });
            }

            // setup initial state and draw UI
            this.annotationState = new AnnotationState(this.playerId, options.onStateChanged);
            this.annotationState.annotations = options.annotationsObjects;

            this.drawUI();
            this.bindEvents();
        }

        // Draw UI components for interaction
        drawUI () {
            this.components = {
                playerButton: new PlayerButton(this.playerId),
                controls: new Controls(this.playerId, this.options.bindArrowKeys)
            };
            this.components.playerButton.updateNumAnnotations(this.annotationState.annotations.length);
        }

        // Bind needed events for interaction w/ components
        bindEvents () {
            this.components.playerButton.$el.on('click', () => {
                this.toggleAnnotations();
            });
        }

        // A wrapper func to make it easier to use EventDispatcher from the client
        // Ex: plugin.fire(type, data);
        fire (type, data) {
            this.eventDispatcher.fire(type, data);
        }

        // Toggle annotations mode on/off
        toggleAnnotations() {
            this.active = !this.active;
            this.player.toggleClass('vac-active'); // Toggle global class to player to toggle display of elements
            this.annotationState.enabled = this.active;

            // handle control component UI if showControls: true
            if(this.components.controls && this.options.showControls){
                if(!this.active){
                    this.components.controls.clear(true);
                }else{
                    this.components.controls.draw();
                }
            }
        }
    }

    videojs.registerPlugin('annotationComments', Main);

})(jQuery, window.videojs);
