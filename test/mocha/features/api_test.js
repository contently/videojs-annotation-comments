'use strict';

describe('external event-based API', () => {

    describe('externally fired events', () => {
        describe('openAnnotation', () => {
            beforeEach(resetVJS);

            it('activates an annotation when triggered', (done) => {
                plugin = simplePluginSetup();

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        let openId = plugin.annotationState.annotations[0].id;
                        plugin.fire('openAnnotation', { id: openId });
                        expect($('.vac-marker').first().hasClass('vac-active')).to.equal(true);
                        done();
                    });
                });
            })
        });
    });

    describe('internally fired events', () => {
        describe('annotationOpened', () => {
            beforeEach(resetVJS);

            it('is triggered when an annotation is opened and includes annotation data', (done) => {
                plugin = simplePluginSetup();

                // Add listener
                plugin.on('annotationOpened.videoAnnotations', (event) => {
                    expect(event.detail.id).to.equal(1);
                    expect(event.detail.range.end).to.equal(60);
                    done();
                });

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        // Marker click triggers annotationOpened.videoAnnotations
                        $('.vac-marker').first().click();
                    });
                });
            });
        });
    });
});
