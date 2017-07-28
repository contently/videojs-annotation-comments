"use strict";
/*
    Component main 'annotation toggle' button in the player controls, including notifier for # annotations
*/


const PlayerUIComponent = require("./player_ui_component").class,
      templateName = "player_button";

class PlayerButton extends PlayerUIComponent {

    constructor (playerId) {
        super(playerId);
        this.draw();
    }

    // Add button to player
    draw () {
        let btn = this.player.getChild('controlBar').addChild('button', {});
        btn.controlText("Toggle Animations");
        this.$el = $(btn.el());
        this.$el.addClass('vac-player-btn').find(".vjs-icon-placeholder").html(this.renderTemplate(templateName));
    }

    // Update the number of annotations displayed in the bubble
    updateNumAnnotations (num) {
        let $bubble = this.$el.find("b");
        $bubble.text(num);
        num > 0 ? $bubble.removeClass(this.UI_CLASSES.hidden) : $bubble.addClass(this.UI_CLASSES.hidden);
    }
}

module.exports = {
    class: PlayerButton
};
