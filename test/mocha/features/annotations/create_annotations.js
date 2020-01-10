'use strict';

describe('creating annotations', () => {
  beforeEach(resetVJS);

  it('from the control UI', () => {
    plugin = player.annotationComments();

    plugin.onReady(() => {
      player.play().then(() => {
        toggleAnnotationMode();
        player.currentTime(20);
        addingAnnotation();
        let shape = {
          x1: plugin.bounds.left + 50,
          x2: plugin.bounds.right - 50,
          y1: plugin.bounds.top + 50,
          y2: plugin.bounds.bottomWithoutControls - 50
        };

        clickAndDragShape(shape, $('.vac-video-cover-canvas'));

        let $dMarker = $('.vac-marker-draggable'),
          markerLength = $dMarker.offset().left + 50;

        clickAndDragMarker(markerLength, $dMarker);

        clickContinue();
        fillCommentForm('Testing new comments!');
        saveComment();

        let newAnnotation = plugin.annotationState.annotations[0];
        expect(newAnnotation).not.to.be.undefined;
        expect(newAnnotation.annotationShape.shape).not.to.be.undefined;
        expect(newAnnotation.marker.range).not.to.be.undefined;
        expect(newAnnotation.commentList.comments[0].body).to.equal('Testing new comments!');
      });
    });
  });
});
