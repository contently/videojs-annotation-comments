describe('videojs-annotation-comments', () => {
    beforeEach(resetVJS);

    it('initializes', (done) => {
        expect(player.activePlugins_).to.be.undefined;

        plugin = player.annotationComments({});
        expect(player.activePlugins_.annotationComments).to.equal(true);

        player.on('loadedmetadata', () => {
            expect(plugin.annotationState).to.not.be.undefined;
            done();
        });
    });

    describe('configurations', () => {
        beforeEach(resetVJS);

        it('initializes with default configuration', (done) => {
            plugin = player.annotationComments({});
            player.on('loadedmetadata', () => {
                expect(plugin.options).to.deep.equal({
                    annotationsObjects: [],
                    bindArrowKeys: true,
                    meta: { user_id: null, user_name: null },
                    onStateChanged: null,
                    showCommentList: true,
                    showControls: true,
                    showFullScreen: true
                });
                done();
            });
        });

        describe('annotationObjects', () => {
            beforeEach(resetVJS);

            it('can be initialized without annnotationObjects', (done) => {
                plugin = player.annotationComments({ annotationsObjects: [] });

                player.on('loadedmetadata', () => {
                    expect(plugin.annotationState.annotations.length).to.equal(0);
                    done();
                });
            });

            it('can be initialized with annotationObjects', (done) => {
                plugin = player.annotationComments({ annotationsObjects: annotations });

                player.on('loadedmetadata', () => {
                    expect(plugin.annotationState.annotations.length).to.equal(2);
                    done();
                });
            });
        });

        describe('bindArrowKeys', () => {
            beforeEach(resetVJS);

            it('sets the plugin options', (done) => {
                plugin = player.annotationComments({ bindArrowKeys: false });

                player.on('loadedmetadata', () => {
                    expect(plugin.options.bindArrowKeys).to.equal(false);
                    done();
                });
            });
        });

        describe('meta', () => {
            beforeEach(resetVJS);

            it('sets the plugin options with flexible data', (done) => {
                plugin = player.annotationComments({ meta: { testData: 'hi' } });

                player.on('loadedmetadata', () => {
                    expect(plugin.options.meta.testData).to.equal('hi');
                    done();
                });
            });
        });

        describe('onStateChanged', () => {
            beforeEach(resetVJS);

            it('sets a callback that will be fired when the plugin state is altered', (done) => {
                const myCallback = (state) => window.vacState = state;

                plugin = player.annotationComments({
                    annotationsObjects: annotations,
                    onStateChanged: myCallback
                });

                player.on('loadedmetadata', () => {
                    let firstAnnotation = plugin.annotationState.annotations[0];
                    plugin.annotationState.removeAnnotation(firstAnnotation);

                    let remainingAnnotations = plugin.annotationState.annotations;
                    expect(window.vacState[0].id).to.equal(annotations[1].id);
                    done();
                });
            });
        });

        describe('showControls', () => {
            beforeEach(resetVJS);

            it('has a default of true and shows the control UI', (done) => {
                plugin = player.annotationComments({});

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        $('.vac-player-btn').click();
                        expect($('.vac-controls').length).to.equal(1);
                        done();
                    });
                });
            });

            it('can be set to false to hide the control UI', (done) => {
                plugin = player.annotationComments({ showControls: false });

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        $('.vac-player-btn').click();
                        expect($('.vac-controls').length).to.equal(0);
                        done();
                    });
                });
            });
        });

        describe('showCommentList', () => {
            beforeEach(resetVJS);

            it('has a default of true and shows the comment list UI', (done) => {
                plugin = player.annotationComments({ annotationsObjects: annotations });

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        $('.vac-player-btn').click();
                        $('.vac-marker').click();
                        expect($('.vac-comments-container').length).to.equal(1);
                        done();
                    });
                });
            });

            it('can be set to false to hide the comment list UI', (done) => {
                plugin = player.annotationComments({
                    annotationsObjects: annotations,
                    showCommentList: false
                });

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        $('.vac-player-btn').click();
                        $('.vac-marker').click();
                        expect($('.vac-comments-container').length).to.equal(0);
                        done();
                    });
                });
            });
        });

        describe('showFullScreen', () => {
            beforeEach(resetVJS);

            it('has a default of true and shows the full screen button', (done) => {
                plugin = player.annotationComments({});

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        expect($('.vjs-fullscreen-control').length).to.equal(1);
                        done();
                    });
                });
            });

            it('can be set to false to hide the full screen button', (done) => {
                plugin = player.annotationComments({ showFullScreen: false });

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        expect($('.vjs-fullscreen-control').length).to.equal(0);
                        done();
                    });
                });
            });
        });
    });
});
