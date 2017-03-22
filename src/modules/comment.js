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

  static newFromData(user_id, body, plugin) {
    let data = {
      meta: {
        user_id,
        datetime: moment().toISOString()
      },
      body
    };

    return new Comment(data, plugin.playerId);
  }

}

module.exports = {
	class: Comment
};
