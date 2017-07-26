"use strict";
/*
   Base class all player components interit from - it includes lots of helper functions (to get reference to
   the player, the plugin, video state, template rendering, etc)
*/

const EventDispatcher = require("./event_dispatcher").class;
const Handlebars = require('handlebars/runtime');
require('./../compiled_templates');

class PlayerComponent {

  constructor (playerId) {
  	this.playerId = playerId;
    this.generateComponentId();
    this.buildEventDispatcher();
    this.registerHandlebarsHelpers(); // TODO: does this need to be inherited for every object init?
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
      return Handlebars.templates[templateName](options);
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
