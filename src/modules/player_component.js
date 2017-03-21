"use strict";

const Handlebars = require("handlebars");

class PlayerComponent {
  constructor(playerId) {
  	this.playerId = playerId;
  }

  get player () {
  	return videojs(this.playerId);
  }

  get $player () {
  	return $(this.player.el());
  }

  get duration () {
    return this.player.duration();
  }

  get activeAnnotation () {
    return this.player.activeAnnotation || {"close": (function (){return null})};
  }

  set activeAnnotation(aa) {
    this.player.activeAnnotation = aa;
  }

  disablePlayingAndControl () {
    this.$player.addClass('vac-disable-play');
    //TODO - catch spacebar being hit
    //TODO - prevent scrubbing and timeline click to seek
  }

  enablePlayingAndControl () {
    this.$player.removeClass('vac-disable-play');
  }

  renderTemplate(htmlString, options = {}) {
    var template = Handlebars.compile(htmlString);
    return template(options);
  }
}

module.exports = {
  class: PlayerComponent
};
