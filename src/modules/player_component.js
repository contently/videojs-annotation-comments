"use strict";

const Handlebars = require("handlebars");

class PlayerComponent {
  constructor(playerId) {
  	this.playerId = playerId;
    this.generateComponentId();
    this.registerHandlebarsHelpers();
  }

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
  renderTemplate(htmlString, options = {}) {
    var template = Handlebars.compile(htmlString);
    return template(options);
  }

  registerHandlebarsHelpers() {
    Handlebars.registerHelper('breaklines', function(text) {
      text = Handlebars.Utils.escapeExpression(text);
      text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
      return new Handlebars.SafeString(text);
    });
  }

  // Convert a range to human readable format (M:SS) or (M:SS-M:SS)
  humanTime (range) {
    function readable(sec){
      var mins = Math.floor(sec/60),
          secs = String(sec % 60);
      return mins + ":" + (secs.length==1 ? "0" : "") + secs;
    }
    var time = [readable(range.start)];
    if(range.end) time.push(readable(range.end));
    return time.join("-");
  }

  // Generate a pseudo-guid ID for this component, to use as an ID in the DOM
  generateComponentId () {
    this.componentId = this.constructor.guid();
  }

  static guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +  s4() + '-' + s4() + s4() + s4();
  }

}

module.exports = {
  class: PlayerComponent
};
