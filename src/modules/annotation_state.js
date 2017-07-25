"use strict";
/*
	Component for managing the state of annotations, including showing active annotation during playback,
	toggling active states for annotations, navigating annotations forward/back, etc
*/

const throttle = require('./../utils').throttle;
const PlayerComponent = require("./player_component").class;
const Annotation = require("./annotation").class;

class AnnotationState extends PlayerComponent {

	constructor (playerId, onStateChanged) {
		super(playerId);
		this.onStateChanged = onStateChanged || (() => {});

		this.annotations = [];
		this.annotationTimeMap = {};
		this.activeAnnotation = null;
		this.enabled = false;
		this.skipNextTimeCheck = false;

		this.lastVideoTime = 0;

		this.bindEvents();
	}

	// sets _enabled and closes or opens annotation as needed
	set enabled (shouldBeEnabled) {
		this._enabled = shouldBeEnabled;
		if(!shouldBeEnabled) this.activeAnnotation.close();
		if(shouldBeEnabled){
			this.skipLiveCheck = false;
			this.setLiveAnnotation();
		}
	}

	get enabled () {
		return this._enabled;
	}

	// Sets _annotations w/Annoation objects from input array
	set annotations (annotationsData) {
		this._annotations = annotationsData.map((a) => new Annotation(a, this.playerId));
		this.sortAnnotations();
		this.rebuildAnnotationTimeMap();
	}

	get annotations () {
		return this._annotations;
	}

	set activeAnnotation (annotation=null) {
		this._activeAnnotation = annotation;
	}

	// Get current active annotation or a null object with .close()
	get activeAnnotation () {
		return this._activeAnnotation || { close: (() => {}) };
	}

	// Serialize data
	get data () {
		return this._annotations.map((a) => a.data);
	}

	// Bind events for setting liveAnnotation on video time change
	bindEvents () {
		this.player.on("timeupdate", throttle(this.setLiveAnnotation.bind(this), 1000));
	}

	// Sort annotations by range.start
	sortAnnotations () {
		this._annotations.sort((a,b) => {
			return a.range.start < b.range.start ? -1 : (a.range.start > b.range.start ? 1 : 0);
		});
	}

	// Add a new annotation
	addNewAnnotation (annotation) {
		this._annotations.push(annotation);
		this.openAnnotation(annotation, true);
		this.stateChanged();
	}

	// Create and add a annotation
	createAndAddAnnotation (data) {
		let annotation = Annotation.newFromData(data.range, data.shape, data.commentStr || "", this.plugin, data.id)
		this.addNewAnnotation(annotation)
	}

	// Remove an annotation
	removeAnnotation (annotation) {
		var i = this._annotations.indexOf(annotation);
		this._annotations.splice(i, 1);
		this.stateChanged();
	}

	// Set the live annotation based on current video time
	setLiveAnnotation () {
		if(!this.enabled) return;

		let time = Math.floor(this.player.currentTime());

		if(this.skipLiveCheck) {
			if(time !== this.lastVideoTime) this.skipLiveCheck = false;
			return;
		}

		let matches = this.activeAnnotationsForTime(time);
		if(!matches.length) return this.activeAnnotation.close();

		// Set live annotation as the last match
		let liveAnnotation = this.annotations[matches[matches.length-1]];
		if(liveAnnotation === this.activeAnnotation) return;

		this.openAnnotation(liveAnnotation, false, false, true);
	}

	// Get all active annotations for a time (in seconds)
	activeAnnotationsForTime (time) {
		if(!this.annotations.length) return [];
		return this.annotationTimeMap[time] || [];
	}

	/*
		Rebuild the annotation time map
		Example: this._annotations[1] and this._annotations[3] are active during second 4
			this.annotationTimeMap = { 4: [1, 3] }
	*/
	rebuildAnnotationTimeMap () {
		let timeMap = {};
		this.annotations.forEach((annotation) => {
			annotation.secondsActive.forEach((second) => {
				let val = (timeMap[second] || []);
				val.push(this.annotations.indexOf(annotation));
				timeMap[second] = val;
			});
		});
		this.annotationTimeMap = timeMap;
	}

	// Close active annotation and remove reference in state
	clearActive () {
		this.activeAnnotation.close(false);
		this._activeAnnotation = null;
	}

	// Open annotation with options to pause and show preview
	// skipLiveCheck will short circuit setLiveAnnotation()
	openAnnotation (annotation, skipLiveCheck=false, pause=true, previewOnly=false) {
		if(!this.plugin.active) this.plugin.toggleAnnotations();
		this.skipLiveCheck = skipLiveCheck;
		this.clearActive();
		annotation.open(pause, previewOnly);
		this.activeAnnotation = annotation;
		this.lastVideoTime = this.activeAnnotation.range.start;
		this.plugin.eventDispatcher.fire('annotationOpened', annotation.data);
	}

	// Finds the next annotation in collection and opens it
	nextAnnotation () {
		if(this._activeAnnotation){
			let ind = this.annotations.indexOf(this._activeAnnotation),
				nextInd = (ind === this.annotations.length-1 ? 0 : ind+1);
			return this.openAnnotation(this.annotations[nextInd], true);
		}
		let time = Math.floor(this.player.currentTime());
		for(let i=0; i<this.annotations.length; i++){
			if(this.annotations[i].range.start > time) return this.openAnnotation(this.annotations[i], true);
		}
		this.openAnnotation(this.annotations[0], true);
	}

	// Finds the previous annotation in collection and opens it
	prevAnnotation () {
		if(this._activeAnnotation){
			let ind = this.annotations.indexOf(this._activeAnnotation),
					nextInd = (ind === 0 ? this.annotations.length-1 : ind-1);
			return this.openAnnotation(this.annotations[nextInd], true);
		}
		let time = Math.floor(this.player.currentTime());
		for(let i=this.annotations.length-1; i>=0; i--){
			if(this.annotations[i].range.start < time) return this.openAnnotation(this.annotations[i], true);
		}
		this.openAnnotation(this.annotations[this.annotations.length-1], true);
	}

	// Use anywhere the annotation data changes
	// Cleans internal state data, updates player button, triggers configurable callback
	stateChanged () {
		this.sortAnnotations();
		this.rebuildAnnotationTimeMap();
		this.plugin.components.playerButton.updateNumAnnotations(this._annotations.length);

		this.onStateChanged(this.data);
	}
}

module.exports = {
	class: AnnotationState
};
