/*
    Component for a timeline marker with capabilities to render on timeline, including tooltip for comment
*/

const PlayerUIComponent = require('./../lib/player_ui_component');
const Utils = require('./../lib/utils');

const markerTemplateName = 'marker';
const markerWrapTemplateName = 'marker_wrap';

module.exports = class Marker extends PlayerUIComponent {
  constructor(player, range, comment = null) {
    super(player);
    this.range = range;
    this.comment = comment;
    this.templateName = markerTemplateName;
    console.warn('this $UI is: ', this.$UI);

    if (!this.$UI.markerWrap || !this.$UI.markerWrap.length) {
      console.warn('adding...');
      const frag = document.createRange().createContextualFragment(
        this.renderTemplate(markerWrapTemplateName)
      );
      this.$UI.timeline.append(frag);
    }
  }

  // Set this marker as active (highlight) and optionally show tooltip also
  setActive(showTooltip = false) {
    this.$el.addClass(this.UI_CLASSES.active);
    if (showTooltip) this.$el.addClass('vac-force-tooltip');
  }

  // Deactivate this marker
  deactivate() {
    this.$el.removeClass(`${this.UI_CLASSES.active} vac-force-tooltip`);
  }

  // Draw marker on timeline for this.range;
  render() {
    // clear existing marker if this one was already rendered
    const existingMarker = this.$UI.timeline.querySelector(`[data-marker-id="${this.componentId}"]`);
    if (existingMarker) existingMarker.remove();

    // Bind to local instance var, add to DOM, and setup events

    const marker = this.renderTemplate(this.templateName, this.markerTemplateData);
    this.$el = document.createRange().createContextualFragment(marker);
    this.$UI.markerWrap.append(this.$el);
    console.warn('marker $el is: ', this.$el);
    this.bindMarkerEvents();
  }

  // Bind needed events for this marker
  bindMarkerEvents() {
    // handle dimming other markers + highlighting this one on mouseenter/leave
    this.$el.addEventListener('mouseenter', () => {
        this.$el.classList.add('vac-hovering');
        this.$el.closest('.vac-marker-wrap').classList.add('vac-dim-all');
      });
    this.$el.addEventListener('mouseleave', () => {
        this.$el.classList.remove('vac-hovering');
        this.$el.closest('.vac-marker-wrap').classList.remove('vac-dim-all');
      });
  }

  // Build object for template
  get markerTemplateData() {
    // the smaller the width, the higher the z-index so overlaps are clickable
    const left = (this.range.start / this.duration) * 100;
    const width = (this.range.end / this.duration) * 100 - left;
    const zIndex = 100 - Math.floor(width) || 100;
    return {
      left: `${left}%`,
      width: `${width}%`,
      zIndex,
      showTooltip: this.plugin.options.showMarkerShapeAndTooltips,
      tooltipRight: left > 50,
      tooltipTime: Utils.humanTime(this.range),
      tooltipBody: !this.comment ? null : this.comment.body,
      rangeShow: !!this.range.end,
      id: this.componentId
    };
  }

  // Unbind event listeners on teardown and remove DOM nodes
  teardown() {
    this.$el
      .off('mouseenter.vac-marker')
      .off('mouseleave.vac-marker')
      .off('click.vac-marker');
    super.teardown();
  }
};
