import '../css/annotations.scss';
import AnnotationComments from './annotation_comments';
/*
    Load plugin and register to global videojs
*/

(($, videojs) => {
  videojs.registerPlugin('annotationComments', AnnotationComments(videojs));
})(jQuery, window.videojs);
