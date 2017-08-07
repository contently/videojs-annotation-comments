"use strict";
/*
    Component for managing annotation "control box" in upper left of video when in annotation mode,
    including all functionality to add new annotations
*/

const   PlayerUIComponent = require("./../lib/player_ui_component").class,
        Utils = require("./../lib/utils"),
        DraggableMarker = require("./draggable_marker.js").class,
        SelectableShape = require("./selectable_shape.js").class,
        Annotation = require("./annotation").class,
        templateName = 'controls';

// Control uses a "ui state" to determine how UI is rendered - this object is the base state, containing a
// default value for each item in the state
const BASE_UI_STATE = Object.freeze({
    adding: false,          // Are we currently adding a new annotation? (step 1 of flow)
    writingComment: false   // Are we currently writing the comment for annotation (step 2 of flow)
});

class Controls extends PlayerUIComponent {

    constructor (playerId, bindArrowKeys) {
        super(playerId);
        this.initAPI(this, 'Controls');

        this.internalCommenting = this.plugin.options.internalCommenting;
        this.showControls = this.plugin.options.showControls;
        this.uiState = Utils.cloneObject(BASE_UI_STATE);
        this.bindEvents(bindArrowKeys);

        this.draw();
    }

    // Bind all the events we need for UI interaction
    bindEvents (bindArrowKeys) {
        this.$player.on("click", ".vac-controls button", this.startAddNew.bind(this)) // Add new button click
            .on("click", ".vac-annotation-nav .vac-a-next", () => this.plugin.annotationState.nextAnnotation() ) // Click 'next' on annotation nav
            .on("click", ".vac-annotation-nav .vac-a-prev", () => this.plugin.annotationState.prevAnnotation() ) // Click 'prev' on annotation nav
            .on("click", ".vac-video-move .vac-a-next", () => this.marker.scrubStart(1) ) // Click '+1 sec' on marker nav
            .on("click", ".vac-video-move .vac-a-prev", () => this.marker.scrubStart(-1) ); // Click '-1 sec' on marker nav

        if(this.internalCommenting) {
            this.$player.on("click", ".vac-add-controls button", this.writeComment.bind(this)) // 'Next' button click while adding
                .on("click", ".vac-video-write-new.vac-is-annotation button", this.saveNew.bind(this)) // 'Save' button click while adding
                .on("click", ".vac-add-controls a, .vac-video-write-new.vac-is-annotation a", this.cancelAddNew.bind(this)) // Cancel link click
        }
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
            this.uiState = Utils.cloneObject(BASE_UI_STATE);
            this.$player.find('.vac-video-cover-canvas')
                .off('mousedown.vac-cursor-tooltip')
                .off('mouseup.vac-cursor-tooltip');
            $(document).off('mousemove.vac-cursor-tooltip');
        }
        this.$UI.controlElements.remove();
    }

    // Draw the UI elements (based on uiState)
    draw (reset=false) {
        this.clear(reset);
        let data = Object.assign(
            {
                rangeStr: this.marker ? Utils.humanTime(this.marker.range) : null,
                showNav: this.plugin.annotationState.annotations.length > 1
            },
            this.uiState,
            { internalCommenting: this.internalCommenting, showControls: this.showControls }
        );

        let $ctrls = this.renderTemplate(templateName, data);
        this.$player.append($ctrls);
    }

    // User clicked to cancel in-progress add - restore to normal state
    cancelAddNew () {
        if(!(this.uiState.adding || this.uiState.writingComment)) return;
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
        this.marker = new DraggableMarker(this.playerId, range);
        this.selectableShape = new SelectableShape(this.playerId);

        // show cursor help text if controls are hidden
        if(!this.showControls) this.bindCursorTooltip();

        this.plugin.fire('enteredAddingAnnotation', { range: range });
    }

    // User clicked 'next' action - show UI to write comment
    writeComment () {
        this.uiState.writingComment = true;
        this.draw();
    }

    // User clicked to save a new annotation/comment during add new flow
    saveNew () {
        let comment = this.$UI.newCommentTextarea.val();
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
        this.plugin.annotationState.enabled = this.plugin.active;
        this.enablePlayingAndControl();
        $(document).off('mousemove.vac-cursor-tool-tip');
    }

    // On arrow key press, navigate to next or prev Annotation
    handleArrowKeys (e) {
        if(!this.plugin.active) return;
        let keyId = e.which;

        if(keyId == 37) this.plugin.annotationState.prevAnnotation();
        if(keyId == 39) this.plugin.annotationState.nextAnnotation();
    }

    // Adds help text to cursor during annotation mode
    bindCursorTooltip () {
        let self = this,
            $tooltip = self.$player.find('.vac-cursor-tool-tip'),
            tooltipArea = Utils.areaOfHiddenEl($tooltip, self.$UI.coverCanvas, self.UI_CLASSES.hidden);

        $(document).on('mousemove.vac-cursor-tool-tip', Utils.throttle((event) => {
            let x = event.pageX,
                y = event.pageY,
                outOfBounds =
                    (x < this.plugin.bounds.left || x > this.plugin.bounds.right) ||
                    (y < this.plugin.bounds.top || y > this.plugin.bounds.bottom),
                withinControls = !outOfBounds && y >= this.plugin.bounds.bottomWithoutControls,
                markerHovered = $tooltip.hasClass('vac-marker-hover');

            if(outOfBounds) {
                $tooltip.addClass(self.UI_CLASSES.hidden);
                return
            }

            let cursorX      = x - this.plugin.bounds.left,
                cursorY      = y - this.plugin.bounds.top,
                margin       = 10,
                rightEdge    = self.$player.width(),
                bottomEdge   = self.$player.height() - self.$UI.controlBar.height(),
                atRightEdge  = (cursorX + tooltipArea.width + margin*2) >= rightEdge,
                atBottomEdge = (cursorY + tooltipArea.height + margin*2) >= bottomEdge;

            // is the tooltip too close to the right or bottom edge?
            let posX = atRightEdge ? (rightEdge - tooltipArea.width - margin) : (cursorX + margin),
                posY = atBottomEdge ? (bottomEdge - tooltipArea.height - margin) : (cursorY + margin);

            // hide if the cursor is over the control bar but not hovering over the draggable marker
            // also hide if mouse is down
            if((withinControls && !markerHovered) || $tooltip.hasClass('vac-cursor-dragging')) {
                $tooltip.addClass(self.UI_CLASSES.hidden);
            } else {
                $tooltip.removeClass(self.UI_CLASSES.hidden);
            }

            $tooltip.css({
                left: `${posX}px`,
                top: `${posY}px`
            });
        }, 50));
    }
}

module.exports = {
    class: Controls
};
