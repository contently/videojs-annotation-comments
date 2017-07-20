const expect               = chai.expect;
const videoHTML            = '<video id="main_player" class="video-js" controls preload="auto" width="720" height="405" data-setup="{}"><source src="./../../contently-platform-overview.mp4" type="video/mp4"></video>'
const addVideo             = () => $('#mocha-video-container').html(videoHTML);
const initVJS              = () => videojs('main_player');
const firstPlay            = () => $('.vjs-big-play-button').click();
const toggleAnnotationMode = () => $('.vac-player-btn').click();

var player, plugin;

const resetVJS = () => {
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
