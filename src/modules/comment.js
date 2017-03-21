"use strict";

const PlayerComponent = require("./player_component").class;

class Comment extends PlayerComponent {

  constructor(data, playerId) {
  	super(playerId);
    this.meta = data.meta;
    this.body = data.body;
    this.timeSince = this.timeSince();
  }

  timeSince () {
    var date = new Date(this.meta.datetime);

    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }

    return Math.floor(seconds) + " seconds";
  }

}

module.exports = {
	class: Comment
};
