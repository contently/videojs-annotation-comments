"use strict";

const PlayerComponent = require("./player_component").class;
const moment = require("moment");

class Comment extends PlayerComponent {

  constructor(data, playerId) {
  	super(playerId);
    this.meta = data.meta;
    this.body = data.body;
    this.timeSince = this.timeSince();
  }

  timeSince () {
    return moment(this.meta.datetime).fromNow();
  }

}

module.exports = {
	class: Comment
};
