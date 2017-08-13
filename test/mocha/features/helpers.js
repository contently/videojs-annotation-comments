const   expect               = chai.expect;
        videoHTML            = '<video id="main_player" class="video-js" controls preload="auto" width="720" height="405" data-setup="{}"><source src="./../../contently-platform-overview.mp4" type="video/mp4"></video>'
        addVideo             = () => $('#mocha-video-container').html(videoHTML);
        initVJS              = () => videojs('main_player');
        firstPlay            = () => $('.vjs-big-play-button').click();
        toggleAnnotationMode = () => $('.vac-player-btn').click();
        addingAnnotation     = () => $('.vac-controls .vac-button').click();
        clickContinue        = () => $(".vac-add-controls .vac-button").click();
        fillCommentForm      = (text) => $(".vac-comment-showbox textarea").text(text);
        saveComment          = () => $('.vac-comment-showbox .vac-button').click();

var player, plugin;

const resetVJS = () => {
    if(plugin) plugin.dispose();
    if(player) player.dispose();
    player = null;
    plugin = null;
    addVideo();
    player = videojs('main_player');
};

const simplePluginSetup = () => {
    return player.annotationComments({
        annotationsObjects: annotations,
        meta: {
            user_id: 1,
            user_name: 'Jack Pope'
        }
    });
}

const clickAndDragShape = (shape, $canvasEl) => {
    let mousedown = $.Event('mousedown'),
        mousemove = $.Event('mousemove'),
        mouseup   = $.Event('mouseup');

    // set coordinates
    mousedown.pageX = shape.x1;
    mousedown.pageY = shape.y1;
    mousemove.pageX = shape.x2;
    mousemove.pageY = shape.y2;
    mouseup.pageX   = shape.x2;
    mouseup.pageY   = shape.y2

    // trigger events
    $canvasEl.trigger(mousedown);
    $(document).trigger(mousemove);
    $(document).trigger(mouseup);
}

const clickAndDragMarker = (length, $marker) => {
    let mousedown = $.Event('mousedown'),
        mousemove = $.Event('mousemove'),
        mouseup   = $.Event('mouseup');

    // set coordinates
    mousemove.pageX = length;

    // trigger events
    $marker.trigger(mousedown);
    $(document).trigger(mousemove);
    $(document).trigger(mouseup);
}
