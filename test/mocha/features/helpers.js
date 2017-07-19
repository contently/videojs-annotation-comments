const expect = chai.expect;
const videoHTML = '<video id="main_player" class="video-js" controls preload="auto" width="720" height="405" data-setup="{}"><source src="./../../contently-platform-overview.mp4" type="video/mp4"></video>'
const addVideo = () => $('#video-container').html(videoHTML);
const initVJS = () => videojs('main_player');
var player, plugin;

const resetVJS = () => {
    if(player) player.dispose();
    player = null;
    plugin = null;
    addVideo();
    player = videojs('main_player');
};
