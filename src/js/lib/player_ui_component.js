/*
    Base class all player UI components interit from - it includes lots of helper functions (to get reference to
    the player $el, various classes/helpers, template rendering, etc)
*/

import PlayerComponent from './player_component';
import Utils from '../lib/utils';

export default class PlayerUIComponent extends PlayerComponent {
  constructor(player) {
    super(player);
  }

  // helpers to get various UI components of the player quickly, keeping commonly reused class names
  // consolidated in case of need to change in the future (and for quick access)
  get $UI() {
    return Object.freeze({
      commentsContainer: this.$player.find('.vac-comments-container'), // outer container for all comments
      controlElements: this.$player.find('.vac-control'), // Each of multiple control elements in the control bar
      newCommentTextarea: this.$player.find('.vac-video-write-new textarea'), // Textarea for writing a new comment
      timeline: this.$player.find('.vjs-progress-control'), // Timeline element
      markerCursorHelpText: this.$player.find('.vac-cursor-help-text'), // Help text that appears with 'click/drag..' on timeline
      controlBar: this.$player.find('.vjs-control-bar'), // Conrol bar wrapper for vjs
      markerWrap: this.$player.find('.vac-marker-wrap'), // wrapper element to place markers in on timeline
      coverCanvas: this.$player.find('.vac-video-cover-canvas') // Player cover during adding annotation state
    });
  }

  // utility classes used in various components
  get UI_CLASSES() {
    return Object.freeze({
      hidden: 'vac-hidden',
      active: 'vac-active'
    });
  }

  // attribute to get player jquery element
  get $player() {
    return $(this.player.el());
  }

  // attribute to get player id from DOM
  get playerId() {
    return this.$player.attr('id');
  }

  // Generate a pseudo-guid ID for this component, to use as an ID in the DOM
  get componentId() {
    this.cid_ = this.cid_ || Utils.guid();
    return this.cid_;
  }

  // Disable play/control actions on the current player
  disablePlayingAndControl() {
    this.$player.addClass('vac-disable-play');
    //TODO - catch spacebar being hit
    //TODO - prevent scrubbing and timeline click to seek
  }

  // Enable play/control actions on the controller
  enablePlayingAndControl() {
    this.$player.removeClass('vac-disable-play');
  }

  // Provide basic teardown function to inherit
  teardown() {
    if (this.$el) this.$el.remove();
    super.teardown();
  }
}
