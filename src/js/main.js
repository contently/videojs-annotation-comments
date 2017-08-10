"use strict";

(($, videojs) => {
    require('./lib/polyfills');

    const Plugin = videojs.getPlugin('plugin'),
          Utils = require('./lib/utils'),
          Controls = require("./components/controls").class,
          AnnotationState = require("./components/annotation_state").class,
          EventDispatcher = require("./lib/event_dispatcher").class;

    const DEFAULT_OPTIONS =     Object.freeze({
        bindArrowKeys:          true,
        meta:                   { user_id: null, user_name: null },
        annotationsObjects:     [],
        showControls:           true,
        showCommentList:        true,
        showFullScreen:         true,
        showMarkerTooltips:     true,
        internalCommenting:     true,
        startInAnnotationMode:  false
    });

    class Main extends Plugin {

        constructor (player, options){
            options = Object.assign(Utils.cloneObject(DEFAULT_OPTIONS), options);
            super(player, options);

            this.eventDispatcher = new EventDispatcher(this);
            this.eventDispatcher.registerListenersFor(this, 'Main');

            this.playerId = $(player.el()).attr('id');
            this.player = player;
            this.meta = options.meta;
            this.options = options;

            // assign reference to this class to player for access later by components where needed
            player.annotationComments = (() => { return this }).bind(this);

            // assert that components are initialized AFTER metadata is loaded so we metadata/duration

            // NOTE - this check is required because player loadedmetadata doesn't always fire if readystate is > 2
            if(player.readyState() >= 2){
                this.postMetadataConstructor();
            }else{
                player.on('loadedmetadata', this.postMetadataConstructor.bind(this));
            }
        }

        postMetadataConstructor () {
            // setup initial state and draw UI
            this.annotationState = new AnnotationState(this.playerId);
            this.annotationState.annotations = this.options.annotationsObjects;

            this.controls = new Controls(this.playerId, this.options.bindArrowKeys);
            this.bindEvents();
            this.setBounds(false);
            if(this.options.startInAnnotationMode) this.toggleAnnotationMode();

            this.fire('pluginReady');
        }

        // Bind needed events for interaction w/ components
        bindEvents () {
            // set player boundaries on window size change or fullscreen change
            $(window).on('resize.vac-window-resize', Utils.throttle(this.setBounds.bind(this), 500));
            this.player.on('fullscreenchange', Utils.throttle(this.setBounds.bind(this), 500));

            // remove annotation features on fullscreen if showFullScreen: false
            if (!this.options.showFullScreen) {
                this.player.on('fullscreenchange', (() => {
                    if (this.player.isFullscreen_) {
                        this.preFullscreenAnnotationsEnabled = this.active;
                        $(this.player.el()).addClass('vac-disable-fullscreen');
                    } else {
                        $(this.player.el()).removeClass('vac-disable-fullscreen');
                    }
                    if(this.preFullscreenAnnotationsEnabled){
                        // if we were previously in annotation mode (pre-fullscreen) or entering fullscreeen and are
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

            // handle control component UI if showControls: true
            if(this.options.showControls){
                if(!this.active){
                    this.controls.clear(true);
                }else{
                    this.controls.draw();
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

        // teardown all components, remove all listeners, and remove elements from DOM
        dispose () {
            this.annotationState.teardown();
            this.controls.teardown();
            this.eventDispatcher.teardown();
            this.teardown();
            super.dispose();
        }

        teardown () {
            this.player.off('fullscreenchange');
            $(window).off('resize.vac-window-resize');
        }
    }

    videojs.registerPlugin('annotationComments', Main);

})(jQuery, window.videojs);
