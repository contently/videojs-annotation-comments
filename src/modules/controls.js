"use strict";

const _ = require("underscore");
const PlayerComponent = require("./player_component").class;
const ControlsTemplate = require("./../templates/controls").ControlsTemplate;

const BASE_UI_STATE = Object.freeze({
  adding: false,          // are we currently adding a new annotaiton?
  writingComment: false
});

class Controls extends PlayerComponent {

  constructor(playerId) {
    super(playerId);
    this.template = ControlsTemplate;
    this.uiState = _.clone(BASE_UI_STATE);
    this.bindEvents();
    this.draw();
  }

  bindEvents () {
    // Bind all the events we need
    this.$player.on("click", ".vac-controls button", this.startAddNew.bind(this));
    this.$player.on("click", ".vac-add-controls a", this.cancelAddNew.bind(this));
  }

  clear(reset=false) {
    if(reset){
      if(this.uiState.adding) this.restoreNormalUI();
      this.uiState = _.clone(BASE_UI_STATE);
    }
    this.$player.find(".vac-control").remove();
  }

  draw (reset=false) {
    this.clear(reset);
    console.log("STATE", this.uiState);
    var $ctrls = this.renderTemplate(this.template, this.uiState);
    this.$player.append($ctrls);
  }

  cancelAddNew () {
    this.draw(true);
  }

  startAddNew () {
    this.player.pause();
    //TODO - prevent play
    this.setAddingUI();
    this.uiState.adding = true;
    this.draw();
  }

  setAddingUI () {
    //change normal UI (hide markers, hide playback, etc)
    this.$player.addClass('vac-adding');
  }

  restoreNormalUI () {
    this.$player.removeClass('vac-adding');
  }

};

module.exports = {
  class: Controls
};
