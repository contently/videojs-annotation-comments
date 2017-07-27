"use strict";
/*
    Component for an annotation, which includes controlling the marker/shape, rendering a commentList, etc
*/

const parseIntObj = require("./../utils.js").parseIntObj;
const PlayerComponent = require("./player_component").class;
const CommentList = require("./comment_list").class;
const Marker = require("./marker").class;
const Comment = require("./comment").class;
const AnnotationShape = require("./annotation_shape").class;

class Annotation extends PlayerComponent {

    constructor (data, playerId) {
        super(playerId);
        this.id = data.id || this.componentId;
        this.range = data.range;
        this.shape = data.shape;
        this.secondsActive = this.buildSecondsActiveArray();
        this.buildComments(data);
        this.buildMarker();
        this.buildShape();
        this.bindEvents();
    }

    buildComments(data) {
        this.commentList = new CommentList(
            {"comments": data.comments, "annotation": this},
            this.playerId
        );
    }

    buildMarker () {
        this.marker = new Marker(this.range, this.commentList.comments[0], this.playerId);
        this.marker.draw();
    }

    buildShape() {
        this.annotationShape = new AnnotationShape(this.shape, this.playerId);
    }

    // Serialize object
    get data () {
        return {
            id:         this.id,
            range:      this.range,
            shape:      this.shape,
            comments:   this.commentList.data
        };
    }

    bindEvents () {
        this.marker.$el.click(() => { this.plugin.annotationState.openAnnotation(this); });
    }

    // Opens the annotation. Handles marker, commentList, shape, Annotation state, and player state
    open (withPause=true, previewOnly=false) {
        if(previewOnly || !this.plugin.options.showCommentList) {
            this.marker.setActive(true);
        } else {
            this.commentList.render();
            this.marker.setActive(false);
        }

        this.annotationShape.draw();
        if(this.shape) {
            this.annotationShape.$el.on("click.annotation", () => {
                this.plugin.annotationState.openAnnotation(this, false, false, false);
            });
        }

        if(withPause) {
            this.player.pause();
            this.player.currentTime(this.range.start);
        }
    }

    // Closes the annotation. Handles marker, commendList, shape, and AnnotationState
    close (clearActive=true) {
        this.marker.deactivate();
        this.commentList.teardown();
        if(this.annotationShape.$el) this.annotationShape.$el.off("click.annotation");
        this.annotationShape.teardown();
        if(clearActive) this.plugin.annotationState.clearActive();
    }

    // For preloading an array of seconds active on initialization
    // Values used to build timeMap in AnnotationState
    buildSecondsActiveArray () {
        let seconds = [];
        if(!!this.range.end) {
            for (let i = this.range.start; i <= this.range.end; i++) {
                seconds.push(i);
            }
        } else {
            let start = this.range.start;
            if(start > 0) seconds.push(start-1);
            seconds.push(start);
            if(start < this.duration) seconds.push(start+1);
        }
        return seconds;
    }

    // Tearsdown annotation and marker, removes object from AnnotationState
    destroy () {
        this.close(true);
        this.plugin.annotationState.removeAnnotation(this);
        this.marker.teardown();
    }

    // Build a new annotation instance by passing in data for range, shape, comment, & plugin ref
    static newFromData (range, shape, commentStr, plugin, id=null) {
        let comment = Comment.dataObj(commentStr, plugin);
        if(range) range = parseIntObj(range);
        if(shape) shape = parseIntObj(shape);
        let data = {
            id,
            range,
            shape,
            comments: [comment]
        };
        return new Annotation(data, plugin.playerId);
    }
}

module.exports = {
    class: Annotation
};
