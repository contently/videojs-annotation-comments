/*
    Load plugin and register to global videojs
*/

(($, videojs) => {
  const AnnotationComments = require('./annotation_comments.js');
  videojs.registerPlugin('annotationComments', AnnotationComments(videojs));
})(jQuery, window.videojs);
