/*
    Component for a shape that can be drug/sized on top of the video while adding a new annotation
*/

const Shape = require('./shape');
const Utils = require('./../lib/utils');

module.exports = class SelectableShape extends Shape {
  constructor(player) {
    super(player);
    this.$parent = this.$player.find('.vac-video-cover-canvas');
    this.bindEvents();
    this.dragging = false;
  }

  // Bind all needed events for drag action
  bindEvents() {
    // On mousedown initialize drag
    this.$parent.on('mousedown.vac-selectable-shape', e => {
      // Check a few conditions to see if we should *not* start drag
      if (!$(e.target).hasClass('vac-video-cover-canvas')) return; // didn't click on overlay
      if ($(e.target).hasClass('vac-shape')) return; // user clicked on annotation

      // Remove old shape if one existed
      if (this.$el) this.$el.remove();

      // Define default starting shape (just x/y coords of where user clicked no width/height yet)
      const shape = {
        x1: this.xCoordToPercent(e.pageX),
        y1: this.YCoordToPercent(e.pageY)
      };
      shape.x2 = shape.x1;
      shape.y2 = shape.y2;
      this.shape = shape;

      // Save origin points for future use
      this.originX = shape.x1;
      this.originY = shape.y1;

      // Draw shape and start drag state
      this.render();
      this.dragging = true;
      this.dragMoved = false; // used to determine if user actually dragged or just clicked

      // Bind event on doc mousemove to track drag, throttled to once each 100ms
      $(document).on(
        `mousemove.vac-sshape-${this.playerId}`,
        Utils.throttle(this.onDrag.bind(this), 100)
      );

      // Add drag class to cursor tooltip if available
      if (!this.plugin.options.showControls) {
        this.$player.find('.vac-cursor-tool-tip').addClass('vac-cursor-dragging');
      }
    });

    // On mouseup, if during drag cancel drag event listeners
    $(document).on(`mouseup.vac-sshape-${this.playerId}`, e => {
      if (!this.dragging) return;

      $(document).off(`mousemove.vac-sshape-${this.playerId}`);

      if (!this.dragMoved) {
        // clear shape if it's just a click (and not a drag)
        this.shape = null;
        if (this.$el) this.$el.remove();
      }

      this.dragging = false;

      // Remove drag class from cursor tooltip if available
      if (!this.plugin.options.showControls) {
        this.$player.find('.vac-cursor-tool-tip').removeClass('vac-cursor-dragging');
      }
    });
  }

  // On each interation of drag action (mouse movement), recalc position and redraw shape
  onDrag(e) {
    this.dragMoved = true;

    const xPer = this.xCoordToPercent(e.pageX);
    const yPer = this.YCoordToPercent(e.pageY);

    if (xPer < this.originX) {
      this.shape.x2 = this.originX;
      this.shape.x1 = Math.max(0, xPer);
    } else {
      this.shape.x2 = Math.min(100, xPer);
      this.shape.x1 = this.originX;
    }
    if (yPer < this.originY) {
      this.shape.y2 = this.originY;
      this.shape.y1 = Math.max(0, yPer);
    } else {
      this.shape.y2 = Math.min(100, yPer);
      this.shape.y1 = this.originY;
    }
    this.setDimsFromShape();

    this.plugin.fire('addingAnnotationDataChanged', { shape: this.shape });
  }

  // Convert pixel-based x position (relative to document) to percentage in video
  xCoordToPercent(x) {
    x -= this.$parent.offset().left; // pixel position
    const max = this.$parent.innerWidth();
    return Number(((x / max) * 100).toFixed(2)); // round to 2 decimal places
  }

  // Convert pixel-based y position (relative to document) to percentage in video
  YCoordToPercent(y) {
    y -= this.$parent.offset().top; // pixel position
    const max = this.$parent.innerHeight();
    return Number(((y / max) * 100).toFixed(2)); // round to 2 decimal places
  }

  // Unbind events and remove element
  teardown() {
    this.$parent.off('mousedown.vac-selectable-shape');
    $(document).off(`mouseup.vac-sshape-${this.playerId} mousemove.vac-sshape-${this.playerId}`);
    super.teardown();
  }
};
