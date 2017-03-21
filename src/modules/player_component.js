"use strict";

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
}

module.exports = {
  class: PlayerComponent
};