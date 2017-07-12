"use strict";
/*
    Component for managing annotation "control box" in upper left of video when in annotation mode,
    including all functionality to add new annotations
*/

const _ = require("underscore");
const DraggableMarker = require("./draggable_marker.js").class;
const SelectableShape = require("./selectable_shape.js").class;
const PlayerComponent = require("./player_component").class;
const Annotation = require("./annotation").class;
const ControlsTemplate = require("./../templates/controls.hbs").ControlsTemplate;

// Control uses a "ui state" to determine how UI is rendered - this object is the base state, containing a
// default value for each item in the state
const BASE_UI_STATE = Object.freeze({
    adding: false,          // Are we currently adding a new annotation? (step 1 of flow)
    writingComment: false   // Are we currently writing the comment for annotation (step 2 of flow)
});

class Controls extends PlayerComponent {

    constructor (playerId, bindArrowKeys) {
        super(playerId);
        this.template = ControlsTemplate;
        this.uiState = _.clone(BASE_UI_STATE);
        this.bindEvents(bindArrowKeys);
        this.draw();
    }

    // Bind all the events we need for UI interaction
    bindEvents (bindArrowKeys) {
        this.$player.on("click", ".vac-controls button", this.startAddNew.bind(this)) // Add new button click
            .on("click", ".vac-add-controls a, .vac-video-write-new.vac-is-annotation a", this.cancelAddNew.bind(this)) // Cancel link click
            .on("click", ".vac-add-controls button", this.writeComment.bind(this)) // 'Next' button click while adding
            .on("click", ".vac-video-write-new.vac-is-annotation button", this.saveNew.bind(this)) // 'Save' button click while adding
            .on("click", ".vac-annotation-nav .vac-a-next", () => this.plugin.annotationState.nextAnnotation() ) // Click 'next' on annotation nav
            .on("click", ".vac-annotation-nav .vac-a-prev", () => this.plugin.annotationState.prevAnnotation() ) // Click 'prev' on annotation nav
            .on("click", ".vac-video-move .vac-a-next", () => this.scrubVideo(1) ) // Click '+1 sec' on marker nav
            .on("click", ".vac-video-move .vac-a-prev", () => this.scrubVideo(-1) ); // Click '-1 sec' on marker nav
        if(bindArrowKeys){
            $(document).on("keyup.vac-nav", (e) => this.handleArrowKeys(e)); // Use arrow keys to navigate annotations
        }
    }

    // Clear existing UI (resetting components if need be)
    clear (reset=false) {
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
        let data = _.extend({
                        rangeStr:   this.marker ? this.humanTime(this.marker.range) : null,
                        showNav:    this.plugin.annotationState.annotations.length > 1
                    }, this.uiState);

        let $ctrls = this.renderTemplate(this.template, data);
        this.$player.append($ctrls);
    }

    // Move the video & marker start by some num seconds (pos or neg)
    scrubVideo (secs) {
        // TODO - write this
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
        let comment = this.$player.find(".vac-video-write-new textarea").val();
        if(!comment) return; // empty comment - TODO add validation / err message

        let a = Annotation.newFromData(this.marker.range, this.selectableShape.shape, comment, this.plugin);
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

    // On arrow key press, navigate to next or prev Annotation
    handleArrowKeys (e) {
        if(!this.plugin.active) return;
        let keyId = e.which;

        if(keyId == 37) this.plugin.annotationState.prevAnnotation();
        if(keyId == 39) this.plugin.annotationState.nextAnnotation();
    }
};

module.exports = {
    class: Controls
};
