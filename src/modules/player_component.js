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

  renderTemplate(htmlString, options = {}) {
    var template = Handlebars.compile(htmlString);
    return template(options);
  }
}

module.exports = {
  class: PlayerComponent
};
