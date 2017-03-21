"use strict";

const PlayerComponent = require("./player_component").class;

class Comment extends PlayerComponent {

  constructor(data, playerId) {
  	super(playerId);
    this.meta = data.meta;
    this.body = data.body;
  }
  
}

module.exports = {
	class: Comment
};