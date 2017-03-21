"use strict";

const _ = require("underscore");
const DraggableMarker = require("./draggable_marker.js").class;
const SelectableShape = require("./selectable_shape.js").class;
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
      if(this.uiState.adding){
        this.restoreNormalUI();
        this.marker.teardown();
        this.selectableShape.teardown();
      }
      this.uiState = _.clone(BASE_UI_STATE);
    }
    this.$player.find(".vac-control").remove();
  }

  draw (reset=false) {
    this.clear(reset);
    var $ctrls = this.renderTemplate(this.template, this.uiState);
    this.$player.append($ctrls);
  }

  cancelAddNew () {
    this.draw(true);
    this.marker.teardown();
    this.marker = null;
  }

  startAddNew () {
    this.player.pause();
    this.setAddingUI();
    this.uiState.adding = true;
    this.draw();

    // construct new range and create marker
    let range = {
      start: this.player.currentTime(),
      stop: this.player.currentTime()
    };
    this.marker = new DraggableMarker(range, this.playerId);
    this.selectableShape = new SelectableShape(this.playerId);
  }

  setAddingUI () {
    //change normal UI (hide markers, hide playback, etc)
    this.$player.addClass('vac-disable-play');
  }

  restoreNormalUI () {
    this.$player.removeClass('vac-disable-play');
  }

};

module.exports = {
  class: Controls
};
