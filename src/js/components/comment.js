"use strict";
/*
  Component for an invidual comment
*/

const   PlayerUIComponent = require("./../lib/player_ui_component").class,
        Utils = require("./../lib/utils"),
        moment = require("moment"),
        templateName = 'comment';

class Comment extends PlayerUIComponent {

    constructor (data, playerId) {
        super(playerId);
        this.id = data.id || this.componentId;
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

    // Render HTML for this comment
    get HTML () {
        return this.renderTemplate(
            templateName,
            {
                id:         this.id,
                body:       this.body,
                meta:       this.meta,
                timeSince:  this.timeSince
            }
        );
    }

    // Return time since comment timestamp
    timeSince () {
        return moment(this.meta.datetime).fromNow();
    }

    // Return a Comment obj given body content and plugin reference
    static newFromData (body, plugin) {
        let data = this.dataObj(body, plugin);
        return new Comment(data, plugin.playerId);
    }

    // Return an object with plugin data, timestamp, unique id, and body content
    static dataObj (body, plugin) {
        return {
            meta:   Object.assign({
                        datetime: moment().toISOString()
                    }, plugin.meta),
            id:     Utils.guid(),
            body
        };
    }
}

module.exports = {
    class: Comment
};
