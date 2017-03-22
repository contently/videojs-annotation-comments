"use strict";
/*
  Component for managing annotation "control box" in upper left of video when in annotation mode, including all
  functionality to add new annotations
*/

const _ = require("underscore");
const DraggableMarker = require("./draggable_marker.js").class;
const SelectableShape = require("./selectable_shape.js").class;
const PlayerComponent = require("./player_component").class;
const Annotation = require("./annotation").class;
const ControlsTemplate = require("./../templates/controls").ControlsTemplate;

const BASE_UI_STATE = Object.freeze({
  adding: false,          // Are we currently adding a new annotaiton? (step 1 of flow)
  writingComment: false  // Are we currently writing the comment for annotation (step 2 of flow)
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
      .on("click", ".vac-add-controls a, .vac-video-write-new.annotation a", this.cancelAddNew.bind(this)) // Cancel link click
      .on("click", ".vac-add-controls button", this.writeComment.bind(this)) // 'Next' button click while adding
      .on("click", ".vac-video-write-new.annotation button", this.saveNew.bind(this)) // 'Save' button click while adding
      .on("click", ".vac-controls .next", () => this.plugin.annotationState.nextAnnotation() ) // Click 'next'
      .on("click", ".vac-controls .prev", () => this.plugin.annotationState.prevAnnotation() ); // Click 'prev'
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
    var data = _.extend({
                  rangeStr: this.marker ? this.humanTime(this.marker.range) : null,
                  showNav: this.plugin.annotationState.annotations.length > 1
                }, this.uiState);

    var $ctrls = this.renderTemplate(this.template, data);
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
    this.uiState.writingComment = true;
    this.draw();
  }

  // User clicked to save a new annotation/comment during add new flow
  saveNew () {
    var comment = this.$player.find(".vac-video-write-new textarea").val();
    if(!comment) return; // empty comment - TODO add validation / err message in future

    var a = Annotation.newFromData(this.marker.range, this.marker.shape, comment, this.plugin);
    this.plugin.annotationState.addNewAnnotation(a);

    this.cancelAddNew();
  }

  // Change normal UI (hide markers, hide playback, etc) on init add state
  setAddingUI () {
    this.plugin.annotationState.enabled = false;
    this.disablePlayingAndControl();
  }

  // Restore normal UI after add state
  restoreNormalUI () {
    this.plugin.annotationState.enabled = true;
    this.enablePlayingAndControl();
  }

};

module.exports = {
  class: Controls
};
