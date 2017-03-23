"use strict";

const _ = require("underscore");
const PlayerComponent = require("./player_component").class;
const moment = require("moment");
const CommentTemplate = require("./../templates/comment").commentTemplate;

class Comment extends PlayerComponent {

  constructor(data, playerId) {
  	super(playerId);
    this.id = data.id;
    this.meta = data.meta;
    this.body = data.body;
    this.timestamp = moment(data.meta.datetime).unix();
    this.timeSince = this.timeSince();
  }

  // Serialize data
  get data () {
    return {
        id: this.id,
        meta: this.meta,
        body: this.body
    };
  }

  get HTML () {
    return this.renderTemplate(
      CommentTemplate,
      {
        id: this.id,
        body: this.body,
        meta: this.meta,
        timeSince: this.timeSince
      }
    );
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
