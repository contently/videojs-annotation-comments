"use strict";
/*
  Component for managing annotation "control box" in upper left of video when in annotation mode, including all
  functionality to add new annotations
*/

const _ = require("underscore");
const DraggableMarker = require("./draggable_marker.js").class;
const SelectableShape = require("./selectable_shape.js").class;
const PlayerComponent = require("./player_component").class;
const ControlsTemplate = require("./../templates/controls").ControlsTemplate;

const BASE_UI_STATE = Object.freeze({
  adding: false,          // Are we currently adding a new annotaiton? (step 1 of flow)
  writingComment: false,  // Are we currently writing the comment for annotation (step 2 of flow)
  rangeStr: null          // Range string for displaying what range we are adding annotation to
});

class Controls extends PlayerComponent {

  constructor(playerId) {
    super(playerId);
    this.template = ControlsTemplate;
    this.uiState = _.clone(BASE_UI_STATE);
    this.bindEvents();
    this.draw();
  }

  // Bind all the events we need for UI interaction
  bindEvents () {
    this.$player.on("click", ".vac-controls button", this.startAddNew.bind(this)) // Add new button click
      .on("click", ".vac-add-controls a, .vac-video-write-new a", this.cancelAddNew.bind(this)) // Cancel link click
      .on("click", ".vac-add-controls button", this.writeComment.bind(this)) // 'Next' button click while adding
      .on("click", ".vac-video-write-new button", this.saveNew.bind(this)); // 'Save' button click while adding
  }

  // Clear existing UI (resetting components if need be)
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

  // Draw the UI elements (based on uiState)
  draw (reset=false) {
    this.clear(reset);
    var $ctrls = this.renderTemplate(this.template, this.uiState);
    this.$player.append($ctrls);
  }

  // User clicked to cancel in-progress add - restore to normal state
  cancelAddNew () {
    this.draw(true);
    this.marker.teardown();
    this.marker = null;
  }

  // User clicked 'add' button in the controls - setup UI and marker
  startAddNew () {
    this.player.pause();
    this.setAddingUI();
    this.uiState.adding = true;
    this.draw();
    this.player.annotationState.activeAnnotation.close();

    // construct new range and create marker
    let range = {
      start: parseInt(this.player.currentTime(),10),
      stop: parseInt(this.player.currentTime(),10)
    };
    this.marker = new DraggableMarker(range, this.playerId);
    this.selectableShape = new SelectableShape(this.playerId);
  }

  // User clicked 'next' action - show UI to write comment
  writeComment () {
    this.uiState.rangeStr = this.humanTime(this.marker.range);
    this.uiState.writingComment = true;
    this.draw();
  }

  // User clicked to save a new annotation/comment during add new flow
  saveNew () {
    var comment = this.$player.find(".vac-video-write-new textarea").val();
    if(!comment) return; // empty comment - TODO add validation / err message in future
    console.log("NEW ANNOTATION", {range: this.marker.range, shape: this.selectableShape.shape, comment});
    // TODO - save annotation
    this.cancelAddNew();
  }

  // Change normal UI (hide markers, hide playback, etc) on init add state
  setAddingUI () {
    this.disablePlayingAndControl();
  }

  // Restore normal UI after add state
  restoreNormalUI () {
    this.enablePlayingAndControl();
  }

};

module.exports = {
  class: Controls
};
