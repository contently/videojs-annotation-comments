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

  renderTemplate(htmlString, options = {}) {
    var template = Handlebars.compile(htmlString);
    return template(options);
  }
}

module.exports = {
  class: PlayerComponent
};
