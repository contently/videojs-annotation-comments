"use strict";
/*
    Base class all player UI components interit from - it includes lots of helper functions (to get reference to
    the player $el, various classes/helpers, template rendering, etc)
*/

const PlayerComponent = require("./player_component").class,
      Handlebars = require('handlebars/runtime'),
      Templates = require('./../compiled_templates'),
      Utils = require('./../utils');

class PlayerUIComponent extends PlayerComponent{

    constructor (playerId) {
        super(playerId);
    }

    // helpers to get various UI components of the player quickly, keeping commonly reused class names
    // consolidated in case of need to change in the future (and for quick access)
    get $UI () {
        return Object.freeze({
            commentsContainer:      this.$player.find(".vac-comments-container"),       // outer container for all comments
            controlElements:        this.$player.find(".vac-control"),                  // Each of multiple control elements in the control bar
            newCommentTextarea:     this.$player.find(".vac-video-write-new textarea"), // Textarea for writing a new comment
            timeline:               this.$player.find('.vjs-progress-control'),         // Timeline element
            markerCursorHelpText:   this.$player.find('.vac-cursor-help-text'),         // Help text that appears with 'click/drag..' on timeline
            controlBar:             this.$player.find('.vjs-control-bar'),              // Conrol bar wrapper for vjs
            markerWrap:             this.$player.find('.vac-marker-wrap'),               // wrapper element to place markers in on timeline
            coverCanvas:            this.$player.find('.vac-video-cover-canvas')        // Player cover during adding annotation state
        });
    }

    // utility classes used in various components
    get UI_CLASSES () {
        return Object.freeze({
            hidden: "vac-hidden",
            active: "vac-active"
        });
    }

    // attribute to get player jquery element
    get $player () {
        return $(this.player.el());
    }

        // Generate a pseudo-guid ID for this component, to use as an ID in the DOM
    get componentId () {
        this._id = this._id || Utils.guid()
        return this._id;
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
        this.registerHandlebarsHelpers();
        return Templates[templateName](options);
    }

    // Handle escaped breaklines in Handlebars
    registerHandlebarsHelpers () {
        if('breaklines' in Handlebars.helpers) return;
        Handlebars.registerHelper('breaklines', (text) => {
            text = Handlebars.Utils.escapeExpression(text);
            text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
            return new Handlebars.SafeString(text);
        });
    }

    // Provide basic teardown function to inherit
    teardown () {
        if(this.$el) this.$el.remove();
    }
}

module.exports = {
    class: PlayerUIComponent
};
