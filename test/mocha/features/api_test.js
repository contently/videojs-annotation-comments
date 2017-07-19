'use strict';

describe('external event-based API', () => {

    describe('externally fired events', () => {
        describe('openAnnotation', () => {
            beforeEach(resetVJS);

            it('activates an annotation when triggered', (done) => {
                plugin = simplePluginSetup();

                player.on('loadedmetadata', () => {
                    enableVJS();
                    let openId = plugin.annotationState.annotations[0].id;
                    plugin.fire('openAnnotation', { id: openId });
                    expect($('.vac-marker').first().hasClass('vac-active')).to.equal(true);
                    done();
                });
            })
        });
    });

    describe('internally fired events', () => {
        // None yet!
    });
});
