/*
    Component for an annotation, which includes controlling the marker/shape, rendering a commentList, etc
*/

const PlayerUIComponent = require('./../lib/player_ui_component');
const Utils = require('./../lib/utils.js');
const CommentList = require('./comment_list');
const Marker = require('./marker');
const Comment = require('./comment');
const Shape = require('./shape');

module.exports = class Annotation extends PlayerUIComponent {
  constructor(data, player) {
    super(player);
    this.id = data.id || this.componentId;
    this.range = data.range;
    this.shape = data.shape;
    this.secondsActive = this.buildSecondsActiveArray();
    this.buildComments(data);
    this.buildMarker();
    this.buildShape();
    this.bindEvents();

    this.isOpen = false;
  }

  buildComments(data) {
    this.commentList = new CommentList({ comments: data.comments, annotation: this }, this.player);
  }

  buildMarker() {
    this.marker = new Marker(this.player, this.range, this.commentList.comments[0]);
    this.marker.render();
  }

  buildShape() {
    this.annotationShape = new Shape(this.player, this.shape);
  }

  // Serialize object
  get data() {
    return {
      id: this.id,
      range: this.range,
      shape: this.shape,
      comments: this.commentList.data
    };
  }

  bindEvents() {
    this.marker.$el.on('click.vac-marker', e =>
      this.plugin.annotationState.openAnnotation(this, true)
    );
  }

  // Opens the annotation. Handles marker, commentList, shape, Annotation state, and player state
  open(withPause = true, previewOnly = false, forceSnapToStart = false) {
    this.isOpen = true;
    const snapToStart =
      forceSnapToStart ||
      !Utils.isWithinRange(this.range.start, this.range.end, Math.floor(this.currentTime));

    const showTooltip = previewOnly && this.plugin.options.showMarkerShapeAndTooltips;
    this.marker.setActive(showTooltip);
    if (!previewOnly && this.plugin.options.showCommentList) {
      this.commentList.render();
    }

    if (!previewOnly || (previewOnly && this.plugin.options.showMarkerShapeAndTooltips)) {
      this.annotationShape.render();

      if (this.shape) {
        this.annotationShape.$el.on('click.vac-annotation', () => {
          this.plugin.annotationState.openAnnotation(this, false, false, false);
        });
      }
    }

    if (withPause) this.player.pause();
    if (snapToStart) this.currentTime = this.range.start;

    this.plugin.fire('annotationOpened', {
      annotation: this.data,
      triggered_by_timeline: previewOnly
    });
  }

  // Closes the annotation. Handles marker, commendList, shape, and AnnotationState
  close(clearActive = true) {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.marker.deactivate();
    this.commentList.teardown(false);
    if (this.annotationShape.$el) this.annotationShape.$el.off('click.vac-annotation');
    this.annotationShape.teardown();
    if (clearActive) this.plugin.annotationState.clearActive();
    this.plugin.fire('annotationClosed', this.data);
  }

  // For preloading an array of seconds active on initialization
  // Values used to build timeMap in AnnotationState
  buildSecondsActiveArray() {
    const seconds = [];
    if (this.range.end) {
      for (let i = this.range.start; i <= this.range.end; i++) {
        seconds.push(i);
      }
    } else {
      const { start } = this.range;
      seconds.push(start);
      if (start < this.duration) seconds.push(start + 1);
    }
    return seconds;
  }

  // Tearsdown annotation and marker, removes object from AnnotationState
  teardown(removeFromCollection = true) {
    this.close(true);
    this.marker.teardown();
    if (this.commentList) this.commentList.teardown(removeFromCollection);
    if (removeFromCollection) this.plugin.annotationState.removeAnnotation(this);
    if (this.annotationShape) this.annotationShape.teardown();
    if (removeFromCollection) super.teardown();
  }

  // Build a new annotation instance by passing in data for range, shape, comment, & plugin ref
  static newFromData(range, shape, commentStr, plugin, id = null) {
    const comment = Comment.dataObj(commentStr, plugin);
    if (range) range = Utils.parseIntObj(range);
    if (shape) shape = Utils.parseIntObj(shape);
    const data = {
      id,
      range,
      shape,
      comments: [comment]
    };
    return new Annotation(data, plugin.player);
  }

  get isActive() {
    return this.plugin.annotationState.activeAnnotation === this;
  }
};
