const expect = chai.expect;
const videoHTML = '<video id="main_player" class="video-js" controls preload="auto" width="720" height="405" data-setup="{}"><source src="./../Docal_announmt_final.mp4" type="video/mp4"></video>'

const addVideo = () => $('#video-container').html(videoHTML);
var player, plugin;
const initVJS = () => videojs('main_player');

const resetVJS = () => {
    if(player) player.dispose();
    player = null;
    plugin = null;
    addVideo();
    player = videojs('main_player');
};

describe('videojs-annotation-comments', function() {
    beforeEach(resetVJS);

    it('initializes', function() {
        expect(player.activePlugins_).to.be.undefined;

        plugin = player.annotationComments({});
        expect(player.activePlugins_.annotationComments).to.equal(true);

        player.on("loadedmetadata", () => {
            expect(plugin.annotationState).to.not.be.undefined;
        });
    });

    describe('configurations', function() {
        describe('annotationObjects', function() {
            beforeEach(resetVJS);

            it('can be initialized without annnotationObjects', function() {
                plugin = player.annotationComments({ annotationsObjects: [] });

                player.on('loadedmetadata', () => {
                    expect(plugin.annotationState.annotations.length).to.equal(0);
                });
            });

            it('can be initialized with annotationObjects', function() {
                plugin = player.annotationComments({ annotationsObjects: annotations });

                player.on('loadedmetadata', () => {
                    expect(plugin.annotationState.annotations.length).to.equal(2);
                });
            });
        });
    });
});
