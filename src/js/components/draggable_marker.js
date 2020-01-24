/*
    Component for a timeline marker that is draggable when user clicks/drags on it, and rebuilds underlying range
    as drag occurs
*/

const Marker = require('./marker');
const Utils = require('./../lib/utils');

const markerTemplateName = 'draggable_marker';

module.exports = class DraggableMarker extends Marker {
  constructor(player, range) {
    super(player, range);
    this.range = range; // NOTE - this shouldn't be required and is a HACK for how transpilation works in IE10
    this.templateName = markerTemplateName; // Change template from base Marker template
    this.dragging = false; // Is a drag action currently occring?
    this.rangePin = range.start; // What's the original pinned timeline point when marker was added
    this.render();
    this.$parent = this.$UI.markerWrap; // Set parent as marker wrap
  }

  // Bind needed evnets for UI interaction
  bindMarkerEvents() {
    // On mouse down init drag
    this.$el.on('mousedown.vac-marker', e => {
      e.preventDefault();
      this.dragging = true;
      // When mouse moves (with mouse down) call onDrag, throttling to once each 250 ms
      $(document).on(
        `mousemove.vac-dmarker-${this.playerId}`,
        Utils.throttle(this.onDrag.bind(this), 250)
      );

      // Add drag class to cursor tooltip if available
      if (!this.plugin.options.showControls) {
        this.$player
          .find('.vac-cursor-tool-tip')
          .addClass('vac-cursor-dragging')
          .removeClass('vac-marker-hover');
      }
    });

    // On mouse up end drag action and unbind mousemove event
    $(document).on(`mouseup.vac-dmarker-${this.playerId}`, e => {
      if (!this.dragging) return;
      $(document).off(`mousemove.vac-dmarker-${this.playerId}`);
      this.dragging = false;

      // Remove drag class and hover class from cursor tooltip if available
      if (!this.plugin.options.showControls) {
        this.$player
          .find('.vac-cursor-tool-tip')
          .removeClass('vac-cursor-dragging')
          .removeClass('vac-marker-hover');
      }
    });

    // On mouse mouse enter, show cursor tooltip if controls are not shown
    // This adds the class which is picked up in Controls
    if (!this.plugin.options.showControls) {
      const self = this;
      self.$el
        .on('mouseenter.vac-cursor-tool-tip', () => {
          self.$player.find('.vac-cursor-tool-tip').addClass('vac-marker-hover');
        })
        .on('mouseleave.vac-cursor-tool-tip', () => {
          self.$player.find('.vac-cursor-tool-tip').removeClass('vac-marker-hover');
        });
    }
  }

  // On drag action, calculate new range and re-render marker
  onDrag(e) {
    const dragPercent = this.percentValFromXpos(e.pageX);
    const secVal = parseInt(this.duration * dragPercent);

    if (secVal > this.rangePin) {
      this.range = {
        start: this.rangePin,
        end: secVal
      };
    } else {
      this.range = {
        start: secVal,
        end: this.rangePin
      };
    }
    this.render();
    this.plugin.fire('addingAnnotationDataChanged', { range: this.range });
  }

  // Cal percentage (of video) position for a pixel-based X position on the document
  percentValFromXpos(xpos) {
    const x = Math.max(0, xpos - this.$parent.offset().left); // px val
    const max = this.$parent.innerWidth();
    let per = x / max;
    if (per > 1) per = 1;
    if (per < 0) per = 0;
    return per;
  }

  // Remove bound events on destructon
  teardown() {
    $(document).off(`mousemove.vac-dmarker-${this.playerId} mouseup.vac-dmarker-${this.playerId}`);
    this.$el.off('mouseenter.vac-cursor-tool-tip');
    this.$el.off('mouseleave.vac-cursor-tool-tip');
    this.$el.off('mousedown.vac-marker');
    this.$el.remove();
  }

  // Move the video & marker start by some num seconds (pos or neg)
  scrubStart(secondsChanged) {
    const newStart = this.range.start + secondsChanged;
    this.currentTime = newStart;
    this.range.start = newStart;
    this.rangePin = newStart;
    this.teardown();
    this.render();

    this.plugin.fire('addingAnnotationDataChanged', { range: this.range });
  }
};
