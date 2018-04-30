"use strict";
/*
    Load plugin and register to global videojs
*/

(($, videojs) => {
    const AnnotationComments = require('./annotation_comments.js').class;
    videojs.registerPlugin(
        'annotationComments',
        AnnotationComments.bind(this, videojs.getPlugin('plugin'))
    );
})(jQuery, window.videojs);
