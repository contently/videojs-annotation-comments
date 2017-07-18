describe('videojs-annotation-comments', function() {
    const expect = chai.expect;

    it('initializes', function() {
        expect(player.activePlugins_).to.be.undefined;
        player.annotationComments({});
        expect(player.activePlugins_.annotationComments).to.equal(true);
    });
});
