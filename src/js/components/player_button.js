/*
    Component main 'annotation toggle' button in the player controls, including notifier for # annotations
*/

const PlayerUIComponent = require('./../lib/player_ui_component');

const templateName = 'player_button';

module.exports = class PlayerButton extends PlayerUIComponent {
  constructor(player) {
    super(player);
    this.render();

    this.initAPI(this, 'PlayerButton');

    this.$el.querySelectorAll('.vac-player-button').forEach(el => el.addEventListener('click', () => this.plugin.toggleAnnotationMode()));
  }

  // Add button to player
  render() {
    const btn = this.player.getChild('controlBar').addChild('button', {});
    btn.controlText('Toggle Animations');
    this.$el = btn.el();
    this.$el.classList.add('vac-player-btn');
    const placeholder = this.$el.querySelector('.vjs-icon-placeholder')
    placeholder.outerHTML = this.renderTemplate(templateName);
  }

  // Update the number of annotations displayed in the bubble
  updateNumAnnotations() {
    const num = this.plugin.annotationState.annotations.length;
    const $bubble = this.$el.querySelector('b');
    $bubble.innerHTML.match(num);
    num > 0
      ? $bubble.classList.remove(this.UI_CLASSES.hidden)
      : $bubble.classList.add(this.UI_CLASSES.hidden);
  }

  // Unbind event listeners on teardown and remove DOM nodes
  teardown() {
    this.$el.off('click.vac-player-button');
    super.teardown();
  }
};
