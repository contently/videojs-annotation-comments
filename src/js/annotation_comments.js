"use strict";
/*
    Main function and entry point
    Can be registered to a videojs instance as a plugin
*/

module.exports = (videojs) => {
    require('./lib/polyfills');

    const Plugin = videojs.getPlugin('plugin'),
          Utils = require('./lib/utils'),
          Controls = require("./components/controls"),
          AnnotationState = require("./components/annotation_state"),
          EventDispatcher = require("./lib/event_dispatcher");

    const DEFAULT_OPTIONS = Object.freeze({
        bindArrowKeys:              true,
        meta:                       { user_id: null, user_name: null },
        annotationsObjects:         [],
        showControls:               true,
        showCommentList:            true,
        showFullScreen:             true,
        showMarkerShapeAndTooltips: true,
        internalCommenting:         true,
        startInAnnotationMode:      false
    });

    return class AnnotationComments extends Plugin {

        constructor (player, options) {
            options = Object.assign(Utils.cloneObject(DEFAULT_OPTIONS), options);
            super(player, options);

            this.eventDispatcher = new EventDispatcher();
            this.eventDispatcher.registerListenersFor(this, 'AnnotationComments');

            this.player = player;
            this.meta = options.meta;
            this.options = options;

            this._readyCallbacks = [];

            // Assign reference to this class to player for access later by components where needed
            player.annotationComments = (() => { return this }).bind(this);

            // Assert that components are initialized AFTER metadata + play data is loaded so we metadata/duration
            // NOTE - this check is required because player loadeddata doesn't always fire if readystate is > 3
            if(player.readyState() >= 3){
                this.postLoadDataConstructor();
            }else{
                player.on('loadeddata', this.postLoadDataConstructor.bind(this));
            }
        }

        // Additional init/setup after video data + metadata is available
        postLoadDataConstructor () {
            // setup initial state and render UI
            this.annotationState = new AnnotationState(this.player);
            this.annotationState.annotations = this.options.annotationsObjects;

            this.controls = new Controls(this.player, this.options.bindArrowKeys);
            this.bindEvents();
            this.setBounds(false);
            if(this.options.startInAnnotationMode) this.toggleAnnotationMode();

            this.pluginReady();
        }

        // Bind needed events for interaction w/ components
        bindEvents () {
            // Set player boundaries on window size change or fullscreen change
            $(window).on('resize.vac-window-resize', Utils.throttle(this.setBounds.bind(this), 500));
            this.player.on('fullscreenchange', Utils.throttle(this.setBounds.bind(this), 500));

            // Remove annotation features on fullscreen if showFullScreen: false
            if (!this.options.showFullScreen) {
                this.player.on('fullscreenchange', (() => {
                    if (this.player.isFullscreen_) {
                        this.preFullscreenAnnotationsEnabled = this.active;
                        $(this.player.el()).addClass('vac-disable-fullscreen');
                    } else {
                        $(this.player.el()).removeClass('vac-disable-fullscreen');
                    }
                    if(this.preFullscreenAnnotationsEnabled){
                        // If we were previously in annotation mode (pre-fullscreen) or entering fullscreeen and are
                        // in annotation mode, toggle the mode
                        this.toggleAnnotationMode();
                    }
                }).bind(this));
            }
        }

        // A wrapper func to make it easier to use EventDispatcher from the client
        // Ex: plugin.fire(type, data);
        fire (type, data={}) {
            this.eventDispatcher.fire(type, data);
        }

        // Toggle annotations mode on/off
        toggleAnnotationMode() {
            this.active = !this.active;
            this.player.toggleClass('vac-active'); // Toggle global class to player to toggle display of elements
            this.annotationState.enabled = this.active;

            if(this.active){
                this.fire("annotationModeEnabled");
            }else{
                this.fire("annotationModeDisabled")
            }

            // Handle control component UI if showControls: true
            if(this.options.showControls){
                if(!this.active){
                    this.controls.clear(true);
                }else{
                    this.controls.render();
                }
            }
        }

        // Set player UI boundaries
        setBounds (triggerChange=true) {
            this.bounds = {};
            let $player = $(this.player.el()),
                $ctrls  = $player.find('.vjs-control-bar');

            this.bounds.left = $player.offset().left;
            this.bounds.top = $player.offset().top;
            this.bounds.right = this.bounds.left + $player.width();
            this.bounds.bottom = this.bounds.top + $player.height();
            this.bounds.bottomWithoutControls = this.bounds.bottom - $ctrls.height();

            // fires an event when bounds have changed during resizing
            if(triggerChange) this.fire('playerBoundsChanged', this.bounds);
        }

        // Public function to register a callback for when plugin is ready
        onReady (callback) {
            if(this.eventDispatcher.pluginReady){
                return callback();
            }
            this._readyCallbacks.push(callback);
        }

        // Mark plugin as ready and fire any pending callbacks
        pluginReady () {
            this.eventDispatcher.pluginReady = true;
            while(this._readyCallbacks.length){
                this._readyCallbacks.pop()();
            }
        }

        // Teardown all components, remove all listeners, and remove elements from DOM
        dispose () {
            this.controls = this.controls.teardown();
            this.annotationState = this.annotationState.teardown();
            this.eventDispatcher = this.eventDispatcher.teardown();
            this.teardown();
            if(this.player) {
                this.player.annotationComments = null;
                $(this.player.el()).removeClass('vac-active');
                $(this.player.el()).find("[class^='vac-']").remove();
            }
            super.dispose();
        }

        teardown () {
            if(this.player) this.player.off('fullscreenchange');
            $(window).off('resize.vac-window-resize');
        }
    }
}
