/*
    Base class all player components interit from - it includes lots of helper functions (to get reference to
    the player, the plugin, video state, etc)
*/

module.exports = class PlayerComponent {
  constructor(player) {
    this._player = player;
  }

  // attribute to get reference to the main plugin object (main.js instance)
  get plugin() {
    return this.player.annotationComments();
  }

  // attribute to get player javascript instance
  get player() {
    return this._player;
  }

  // attribute to get video duration (in seconds)
  get duration() {
    return this.player.duration();
  }

  // attribute to get player current time
  get currentTime() {
    return this.player.currentTime();
  }

  // set current time of player
  set currentTime(time) {
    this.player.currentTime(time);
  }

  // Register all events in the EventRegistry matching this className
  initAPI(obj, className) {
    this.plugin.eventDispatcher.registerListenersFor(obj, className);
  }

  // Nullify player reference so objects can be removed safely
  // All components should call super.teardown() within their teardown funcs
  teardown(destroy = false) {
    if (destroy) this._player = null;
  }
};
