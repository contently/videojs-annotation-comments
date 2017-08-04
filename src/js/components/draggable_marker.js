"use strict";
/*
    Component for a timeline marker that is draggable when user clicks/drags on it, and rebuilds underlying range
    as drag occurs
*/

const   Marker = require("./marker").class,
        Utils = require('./../lib/utils'),
        markerTemplateName = 'draggable_marker';

class DraggableMarker extends Marker {

    constructor (playerId, range) {
        super(playerId, range);                   
        this.range = range;                       // NOTE - this shouldn't be required and is a HACK for how transpilation works in IE10  
        this.templateName = markerTemplateName;   // Change template from base Marker template
        this.dragging = false;                    // Is a drag action currently occring?
        this.rangePin = range.start;              // What's the original pinned timeline point when marker was added
        this.draw();
        this.$parent = this.$UI.markerWrap;       // Set parent as marker wrap
    }

    // Bind needed evnets for UI interaction
    bindMarkerEvents () {
        // On mouse down init drag
        this.$el.mousedown((e) => {
            e.preventDefault();
            this.dragging = true;
            // When mouse moves (with mouse down) call onDrag, throttling to once each 250 ms
            $(document).on("mousemove.draggableMarker", Utils.throttle(this.onDrag.bind(this), 250) );

            // Add drag class to cursor tooltip if available
            if(!this.plugin.options.showControls) {
                this.$player.find('.vac-cursor-tool-tip')
                    .addClass('vac-cursor-dragging')
                    .removeClass('vac-marker-hover');
            }
        });

        // On mouse up end drag action and unbind mousemove event
        $(document).on("mouseup.draggableMarker", (e) => {
             if(!this.dragging) return;
             $(document).off("mousemove.draggableMarker");
             this.dragging = false;

             // Remove drag class and hover class from cursor tooltip if available
             if(!this.plugin.options.showControls) {
                 this.$player.find('.vac-cursor-tool-tip')
                    .removeClass('vac-cursor-dragging')
                    .removeClass('vac-marker-hover');
             }
        });

        // On mouse mouse enter, show cursor tooltip if controls are not shown
        // This adds the class which is picked up in Controls
        if(!this.plugin.options.showControls) {
            var self = this;
            self.$el
                .on('mouseenter.vac-cursor-tool-tip', () => {
                    self.$player.find('.vac-cursor-tool-tip').addClass('vac-marker-hover');
                })
                .on('mouseleave.vac-cursor-tool-tip', () => {
                    self.$player.find('.vac-cursor-tool-tip').removeClass('vac-marker-hover');
                });
        };
    }

    // On drag action, calculate new range and redraw marker
    onDrag (e) {
        var dragPercent = this.percentValFromXpos(e.pageX),
            secVal = parseInt(this.duration * dragPercent);

        if(secVal > this.rangePin){
            this.range = {
                start:  this.rangePin,
                end:    secVal
            };
        }else{
            this.range = {
                start:  secVal,
                end:    this.rangePin
            };
        }
        this.draw();
        this.plugin.fire('addingAnnotationDataChanged', { range: this.range });
    }

    // Cal percentage (of video) position for a pixel-based X position on the document
    percentValFromXpos (xpos) {
        var x = Math.max(0, xpos - this.$parent.offset().left), // px val
            max = this.$parent.innerWidth(),
            per = (x / max);
        if(per > 1) per = 1;
        if(per < 0) per = 0;
        return per;
    }

    // Remove bound events on destructon
    teardown () {
        super.teardown();
        $(document).off('mousemove.draggableMarker');
        $(document).off('mouseup.draggableMarker');
        this.$el.off('mouseenter.vac-cursor-tool-tip');
        this.$el.off('mouseleave.vac-cursor-tool-tip')
    }

    // Move the video & marker start by some num seconds (pos or neg)
    scrubStart (secondsChanged) {
        let newStart = this.range.start + secondsChanged;
        this.player.currentTime(newStart);

        this.range.start = newStart;
        this.rangePin = newStart;
        this.teardown();
        this.draw();

        this.plugin.fire('addingAnnotationDataChanged', { range: this.range });
    }
}

module.exports = {
    class: DraggableMarker
};
