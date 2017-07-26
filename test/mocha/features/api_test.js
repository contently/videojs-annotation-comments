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

        describe('closeActiveAnnotation', () => {
            beforeEach(resetVJS);

            it('closes the active annotation', (done) => {
                plugin = simplePluginSetup();

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        $('.vac-marker').first().click();
                        expect(plugin.annotationState.activeAnnotation.id).to.equal(1);

                        plugin.fire('closeActiveAnnotation');

                        expect(plugin.annotationState.activeAnnotation.id).to.be.undefined;
                        done();
                    });
                });
            });
        });

        describe('newAnnotation', () => {
            beforeEach(resetVJS);

            it('activates an annotation when triggered', (done) => {
                plugin = simplePluginSetup();

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        let startingLength = plugin.annotationState.annotations.length
                        plugin.fire('newAnnotation', { id: 1, range: { start: 20, end: null }, commentStr: "yeoooop" });

                        expect(plugin.annotationState.annotations.length).to.equal(startingLength + 1)

                        expect(plugin.annotationState.annotations[0].id).to.equal(1);
                        expect(plugin.annotationState.annotations[0].range["start"]).to.equal(20);
                        expect(plugin.annotationState.annotations[0].range["end"]).to.equal(null);
                        expect(plugin.annotationState.annotations[0].commentList.comments[0].body).to.equal("yeoooop")

                        expect($('.vac-marker').last().hasClass('vac-active')).to.equal(true);
                        done();
                    });
                });
            })
        });

        describe('destroyAnnotation', () => {
            beforeEach(resetVJS);

            it('removes an annotation when triggered', (done) => {
                plugin = simplePluginSetup();

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        let startingLength = plugin.annotationState.annotations.length
                        let openId = plugin.annotationState.annotations[0].id;
                        plugin.fire('destroyAnnotation', { id: openId });

                        expect(plugin.annotationState.annotations.length).to.equal(startingLength - 1)
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
                plugin.on('annotationOpened', (event) => {
                    expect(event.detail.id).to.equal(1);
                    expect(event.detail.range.end).to.equal(60);

                    // remove this listener to play nicely with other tests
                    plugin.off('annotationOpened');
                    done();
                });

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        // Marker click triggers annotationOpened
                        $('.vac-marker').first().click();
                    });
                });
            });
        });
    });
});
