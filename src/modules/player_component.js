"use strict";
/*
    Base class all player components interit from - it includes lots of helper functions (to get reference to
    the player, the plugin, video state, template rendering, etc)
*/

const EventDispatcher = require("./event_dispatcher").class,
      Handlebars = require('handlebars/runtime'),
      Templates = require('./../compiled_templates');

class PlayerComponent {

    constructor (playerId) {
        this.playerId = playerId;
        this.generateComponentId();
        this.buildEventDispatcher();
        this.registerHandlebarsHelpers(); // TODO: does this need to be inherited for every object init?
    }

    // helpers to get various UI components of the player quickly, keeping commonly reused class names
    // consolidated in case of need to change in the future (and for quick access)
    get $UI () {
        return Object.freeze({
            commentsContainer:          this.$player.find(".vac-comments-container"),       // outer container for all comments
            controlElements:            this.$player.find(".vac-control"),                  // Each of multiple control elements in the control bar
            newCommentTextarea:         this.$player.find(".vac-video-write-new textarea"), // Textarea for writing a new comment
            timeline:                   this.$player.find('.vjs-progress-control'),         // Timeline element
            markerCursorHelpText:       this.$player.find('.vac-cursor-help-text'),         // Help text that appears with 'click/drag..' on timeline
            controlBar:                 this.$player.find('.vjs-control-bar'),              // Conrol bar wrapper for vjs
        });
    }

    // utility classes used in various components
    get UI_CLASSES () {
        return Object.freeze({
            hidden: "vac-hidden",
            active: "vac-active"
        });
    }

    // attribute to get reference to the main plugin object (main.js instance)
    get plugin () {
        return this.player.annotationComments();
    }

    // attribute to get player javascript instance
    get player () {
        return videojs(this.playerId);
    }

    // attribute to get player jquery element
    get $player () {
        return $(this.player.el());
    }

    // attribute to get video duration (in seconds)
    get duration () {
        return this.player.duration();
    }

    // Disable play/control actions on the current player
    disablePlayingAndControl () {
        this.$player.addClass('vac-disable-play');
        //TODO - catch spacebar being hit
        //TODO - prevent scrubbing and timeline click to seek
    }

    // Enable play/control actions on the controller
    enablePlayingAndControl () {
        this.$player.removeClass('vac-disable-play');
    }

    // Render a handlebars template with local data passed in via key/val in object
    renderTemplate (templateName, options = {}) {
        return Templates[templateName](options);
    }

    // Handle escaped breaklines in Handlebars
    registerHandlebarsHelpers () {
        Handlebars.registerHelper('breaklines', (text) => {
            text = Handlebars.Utils.escapeExpression(text);
            text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
            return new Handlebars.SafeString(text);
        });
    }

    // Convert a time range to human readable format (M:SS) or (M:SS-M:SS)
    humanTime (range) {
        function readable(sec){
            let mins = Math.floor(sec/60),
            secs = String(sec % 60);
            return mins + ":" + (secs.length==1 ? "0" : "") + secs;
        }
        let time = [readable(range.start)];
        if(range.end) time.push(readable(range.end));
        return time.join("-");
    }

    // Generate a pseudo-guid ID for this component, to use as an ID in the DOM
    generateComponentId () {
        this.componentId = this.constructor.guid();
    }

    // Provide basic teardown function to inherit
    teardown () {
        if(this.$el) this.$el.remove();
    }

    // Initialize the event listener if needed
    buildEventDispatcher () {
        if (!this.plugin.eventDispatcher) {
            this.plugin.eventDispatcher = new EventDispatcher(this.plugin);
        }
    }

    // Register all events in the EventRegistry matching this className
    initAPI (obj, className) {
        this.plugin.eventDispatcher.registerListenersFor(obj, className);
    }

    // Generate unique ids
    static guid () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +  s4() + '-' + s4() + s4() + s4();
    }
}

module.exports = {
    class: PlayerComponent
};
