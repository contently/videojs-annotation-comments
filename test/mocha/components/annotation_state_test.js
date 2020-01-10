'use strict';

/*
    Currently testing AnnotationState.setLiveAnnotation function
    The MockedAnnotationState stubs many methods required to make setLiveAnnotation unit-testable
    Testing more methods on this object may require abstracting the mock or creating more mocks
*/

global.videojs = require('video.js');

const AnnotationState = require('../../../src/js/components/annotation_state'),
  expect = require('chai').expect;

const timeMap = {
  1: [0, 1],
  2: [1],
  3: [1],
  4: [1, 2],
  5: []
};

class MockedAnnotationState extends AnnotationState {
  initAPI() {}
  resetData() {}
  bindEvents() {}
  get currentTime() {
    return this._currentTime;
  }
  set currentTime(time) {
    this._currentTime = time;
  }
  // set annotations (annotations) { this._annotations = annotations }
  set activeAnnotation(annotation) {
    this._activeAnnotation = annotation;
  }
  get activeAnnotation() {
    return (
      this._activeAnnotation || {
        close: () => {
          return 'closing annotation!';
        }
      }
    );
  }
  activeAnnotationsForTime(time) {
    return timeMap[time];
  }
  openAnnotation() {
    this._annotationWasOpened = true;
  }
}

describe('AnnotationState', () => {
  describe('this.setLiveAnnotation()', () => {
    it('returns early if AnnotationState is not enabled', () => {
      let state = new MockedAnnotationState('playerId');
      state._enabled = false;

      expect(state.setLiveAnnotation()).to.equal(undefined);
      expect(state._annotationWasOpened).to.equal(undefined);
    });

    describe('this.skipLiveCheck', () => {
      it('returns early if true', () => {
        let state = new MockedAnnotationState('playerId');
        state._enabled = true;
        state.skipLiveCheck = true;

        expect(state.setLiveAnnotation()).to.equal(undefined);
        expect(state._annotationWasOpened).to.equal(undefined);
      });

      it('sets it to false if the current time does not match this.lastVideoTime', () => {
        let state = new MockedAnnotationState('playerId');
        state._enabled = true;
        state.skipLiveCheck = true;
        state.currentTime = 5;
        state.lastVideoTime = 15;

        expect(state.setLiveAnnotation()).to.equal(undefined);
        expect(state.skipLiveCheck).to.equal(false);
        expect(state._annotationWasOpened).to.equal(undefined);
      });
    });

    it('returns early and closes the active annotation if there are no matches', () => {
      let state = new MockedAnnotationState('playerId');
      state._enabled = true;
      state.skipLiveCheck = false;
      state.currentTime = 5;
      state.lastVideoTime = 15;

      expect(state.setLiveAnnotation()).to.equal('closing annotation!');
      expect(state._annotationWasOpened).to.equal(undefined);
    });

    it('returns early if the live annotation is the active annotation', () => {
      let state = new MockedAnnotationState('playerId'),
        annotation = { id: 1, range: { start: 1, end: 5 } };

      state._enabled = true;
      state.skipLiveCheck = false;
      state.currentTime = 1;
      state.lastVideoTime = 15;

      // liveAnnotation at currentTime:1 will map to 'annotation'
      state._annotations = [{ id: 0 }, annotation];
      state.activeAnnotation = annotation;

      expect(state.setLiveAnnotation()).to.equal(undefined);
      expect(state._annotationWasOpened).to.equal(undefined);
    });

    it('returns early if the the live annotation start time is the same as the active annotation start time', () => {
      let state = new MockedAnnotationState('playerId'),
        annotation = { id: 1, range: { start: 1, end: 5 } },
        otherAnnotation = { id: 2, range: { start: 1, end: null } };

      state._enabled = true;
      state.skipLiveCheck = false;
      state.currentTime = 1;
      state.lastVideoTime = 15;

      // liveAnnotation at currentTime:2 will map to 'annotation'
      state._annotations = [otherAnnotation, annotation];
      state.activeAnnotation = otherAnnotation;

      expect(state.setLiveAnnotation()).to.equal(undefined);
      expect(state._annotationWasOpened).to.equal(undefined);
    });

    it('triggers this.openAnnotation when there is a valid annotation at the current timestamp', () => {
      let state = new MockedAnnotationState('playerId'),
        annotation = { id: 1, range: { start: 1, end: 5 } };

      state._enabled = true;
      state.skipLiveCheck = false;
      state.currentTime = 2;
      state.lastVideoTime = 15;

      // liveAnnotation at currentTime:1 will map to 'annotation'
      state._annotations = [{}, annotation];

      state.setLiveAnnotation();
      expect(state._annotationWasOpened).to.equal(true);
    });
  });
});
