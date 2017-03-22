"use strict";

const _ = require("underscore");
const PlayerComponent = require("./player_component").class;
const Annotation = require("./annotation").class;
  
class AnnotationState extends PlayerComponent {

  constructor(playerId) {
    super(playerId);
    
    this.annotations = [];
    this.annotationTimeMap = {};
    this.activeAnnotation = null;
    this.enabled = false;

    this.bindEvents()
  }

  set enabled (val){
    if(!val) this.activeAnnotation.close();
    this._enabled = val;
  }

  get enabled () {
    return this._enabled;
  }

  // set annottions w/ input of annotations objects - sets internal variable to array of annotations instances
  // NOTE stord internally as this._annotations
  set annotations (annotationsData) {
    // Sort annotations by range.start
    annotationsData.sort((a,b) => {
      return a.range.start < b.range.start ? -1 : (a.range.start > b.range.start ? 1 : 0);
    });
    this._annotations = annotationsData.map((a) => new Annotation(a, this.playerId));
    this.rebuildAnnotationTimeMap()
  }

  get annotations (){
    return this._annotations;
  }

  set activeAnnotation (annotation=null) {
    this._activeAnnotation = annotation
  }

  // Get current active annotation or something close to it
  get activeAnnotation () {
    return this._activeAnnotation || {close: (function (){return null})}
  }

  // Bind events for setting liveAnnotation on video time change
  bindEvents() {
    this.player.on("timeupdate", _.throttle(this.setLiveAnnotation.bind(this), 750));
  }

  // Set the live annotation based on current video time
  setLiveAnnotation() {
    if(!this.enabled) return;
    var time = Math.floor(this.player.currentTime()),
        matches = this.activeAnnotationsForTime(time);

    if(!matches.length) return this.activeAnnotation.close();

    var liveAnnotation = this.annotations[matches[matches.length-1]];
    liveAnnotation.open(false);
    this.activeAnnotation = liveAnnotation;
  }

  // Get all active annotations for a time (in seconds)
  activeAnnotationsForTime (time) {
    if(!this.annotations.length) return [];
    return this.annotationTimeMap[time] || [];
  }

  // Rebuild the annotation time map
  rebuildAnnotationTimeMap() {
    var timeMap = {};
    this.annotations.forEach((annotation) => {
      annotation.secondsActive.forEach((second) => {
        var val = (timeMap[second] || [])
        val.push(this.annotations.indexOf(annotation));
        timeMap[second] = val;
      });
    });
    this.annotationTimeMap = timeMap;
  }

  clearActive () {
    this.activeAnnotation = null;
  }

  openAnnotation (annotation) {
    this.activeAnnotation.close();
    annotation.open();
    this.activeAnnotation = annotation;
  }

  nextAnnotation () {
    if(this._activeAnnotation){
      var ind = this.annotations.indexOf(this._activeAnnotation),
          nextInd = (ind === this.annotations.length-1 ? 0 : ind+1);
      return this.openAnnotation(this.annotations[nextInd]);
    }
    var time = Math.floor(this.player.currentTime());
    for(let i=0; i<this.annotations.length; i++){
      if(this.annotations[i].range.start > time) return this.openAnnotation(this.annotations[i]);
    }
    this.openAnnotation(this.annotations[0]);
  }

  prevAnnotation () {
    if(this._activeAnnotation){
      var ind = this.annotations.indexOf(this._activeAnnotation),
          nextInd = (ind === 0 ? this.annotations.length-1 : ind-1);
      return this.openAnnotation(this.annotations[nextInd]);
    }
    var time = Math.floor(this.player.currentTime());
    for(let i=this.annotations.length-1; i>=0; i--){
      if(this.annotations[i].range.start < time) return this.openAnnotation(this.annotations[i]);
    }
    this.openAnnotation(this.annotations[this.annotations.length-1]);
  }
}

module.exports = {
  class: AnnotationState
};
