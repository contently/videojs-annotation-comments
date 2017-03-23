"use strict";

const _ = require("underscore");
const PlayerComponent = require("./player_component").class;
const moment = require("moment");

class Comment extends PlayerComponent {

  constructor(data, playerId) {
  	super(playerId);
    this.id = data.id;
    this.meta = data.meta;
    this.body = data.body;
    this.timeSince = this.timeSince();
  }

  timeSince () {
    return moment(this.meta.datetime).fromNow();
  }

  static newFromData(body, plugin) {
    let data = this.dataObj(body, plugin);
    return new Comment(data, plugin.playerId);
  }

  static dataObj(body, plugin) {
    return {
        meta:  _.extend({
                datetime: moment().toISOString()
            }, plugin.meta),
        id: this.guid(),
        body
    };
  }

}

module.exports = {
	class: Comment
};
