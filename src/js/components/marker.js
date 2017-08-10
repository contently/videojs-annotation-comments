"use strict";
/*
    Component for a timeline marker with capabilities to draw on timeline, including tooltip for comment
*/

const   PlayerUIComponent = require("./../lib/player_ui_component").class,
        Utils = require("./../lib/utils"),
        markerTemplateName = 'marker',
        markerWrapTemplateName = 'marker_wrap';

class Marker extends PlayerUIComponent {

    constructor (playerId, range, comment=null) {
        super(playerId);
        this.range = range;
        this.comment = comment;
        this.templateName = markerTemplateName;

        if(!this.$UI.markerWrap.length){
            this.$UI.timeline.append(
                this.renderTemplate(markerWrapTemplateName)
            );
        }
    }

    // attribute to get the DOM id for this marker node
    get markerId () {
        return `vacmarker_${this.componentId}`;
    }
    // Set this marker as active (highlight) and optionally show tooltip also
    setActive (showTooltip=false) {
        this.$el.addClass(this.UI_CLASSES.active);
        if(showTooltip && this.plugin.options.showMarkerTooltips){
            this.$el.addClass('vac-force-tooltip');
        }
    }

    // Deactivate this marker
    deactivate () {
        this.$el.removeClass(`${this.UI_CLASSES.active} vac-force-tooltip`);
    }

    // Draw marker on timeline for this.range;
    draw () {
        // clear existing marker if this one was already drawn
        this.$UI.timeline.find(`#${this.markerId}`).remove();

        // Bind to local instance var, add to DOM, and setup events
        this.$el = $(this.renderTemplate(this.templateName, this.markerTemplateData));
        this.$UI.markerWrap.append(this.$el);
        this.bindMarkerEvents();
    }

    // Bind needed events for this marker
    bindMarkerEvents () {
        // handle dimming other markers + highlighting this one on mouseenter/leave
        this.$el.on("mouseenter.vac-marker", () => {
            this.$el.addClass('vac-hovering').closest(".vac-marker-wrap").addClass('vac-dim-all');
        }).on("mouseleave.vac-marker", () => {
            this.$el.removeClass('vac-hovering').closest(".vac-marker-wrap").removeClass('vac-dim-all');
        });
    }

    // Build object for template
    get markerTemplateData () {
         // the smaller the width, the higher the z-index so overlaps are clickable
        let left = (this.range.start / this.duration) * 100,
            width = ((this.range.end / this.duration) * 100) - left,
            zIndex = (100 - Math.floor(width)) || 100;
        return {
            left:         left + '%',
            width:        width + '%',
            zIndex:       zIndex,
            showTooltip:  this.plugin.options.showMarkerTooltips,
            tooltipRight: left > 50,
            tooltipTime:  Utils.humanTime(this.range),
            tooltipBody:  !this.comment ? null : this.comment.body,
            rangeShow:    !!this.range.end,
            id:           this.markerId
        };
    }

    // Unbind event listeners on teardown and remove DOM nodes
    teardown () {
        this.$el
            .off('mouseenter.vac-marker')
            .off('mouseleave.vac-marker')
            .off('click.vac-marker');
        super.teardown();
    }
}

module.exports = {
    class: Marker
};
