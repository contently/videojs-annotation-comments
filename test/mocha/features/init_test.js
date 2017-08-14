'use strict';

describe('plugin initialization', () => {
    beforeEach(resetVJS);

    it('initializes', (done) => {
        expect(player.activePlugins_).to.be.undefined;

        plugin = player.annotationComments({});
        expect(player.activePlugins_.annotationComments).to.equal(true);

        plugin.onReady(() => {
            expect(plugin.annotationState).to.not.be.undefined;
            done();
        });
    });

    describe('configurations', () => {
        beforeEach(resetVJS);

        it('initializes with default configuration', (done) => {
            plugin = player.annotationComments({});
            plugin.onReady(() => {
                expect(plugin.options).to.deep.equal({
                    annotationsObjects: [],
                    bindArrowKeys: true,
                    meta: { user_id: null, user_name: null },
                    showCommentList: true,
                    showControls: true,
                    showFullScreen: true,
                    showMarkerShapeAndTooltips: true,
                    internalCommenting: true,
                    startInAnnotationMode: false
                });
                done();
            });
        });

        describe('annotationObjects', () => {
            beforeEach(resetVJS);

            it('can be initialized without annnotationObjects', (done) => {
                plugin = player.annotationComments({ annotationsObjects: [] });

                plugin.onReady(() => {
                    expect(plugin.annotationState.annotations.length).to.equal(0);
                    done();
                });
            });

            it('can be initialized with annotationObjects', (done) => {
                plugin = player.annotationComments({ annotationsObjects: annotations });

                plugin.onReady(() => {
                    expect(plugin.annotationState.annotations.length).to.equal(2);
                    done();
                });
            });
        });

        describe('bindArrowKeys', () => {
            beforeEach(resetVJS);

            it('sets the plugin options', (done) => {
                plugin = player.annotationComments({ bindArrowKeys: false });

                plugin.onReady(() => {
                    expect(plugin.options.bindArrowKeys).to.equal(false);
                    done();
                });
            });
        });

        describe('meta', () => {
            beforeEach(resetVJS);

            it('sets the plugin options with flexible data', (done) => {
                plugin = player.annotationComments({ meta: { testData: 'hi' } });

                plugin.onReady(() => {
                    expect(plugin.options.meta.testData).to.equal('hi');
                    done();
                });
            });
        });

        describe('showControls', () => {
            beforeEach(resetVJS);

            it('has a default of true and shows the control UI', (done) => {
                plugin = player.annotationComments({});

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        expect($('.vac-controls').length).to.equal(1);
                        done();
                    });
                });
            });

            it('can be set to false to hide the control UI but show cursor help text', (done) => {
                plugin = player.annotationComments({ showControls: false });

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        expect($('.vac-controls').length).to.equal(0);

                        plugin.controls.startAddNew();
                        expect($('.vac-cursor-tool-tip').text()).to.equal('Click and drag to select');

                        done();
                    });
                });
            });
        });

        describe('showCommentList', () => {
            beforeEach(resetVJS);

            it('has a default of true and shows the comment list UI', (done) => {
                plugin = player.annotationComments({ annotationsObjects: annotations });

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        $('.vac-marker').first().click();
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

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        $('.vac-marker').click();
                        expect($('.vac-comments-container').length).to.equal(0);
                        done();
                    });
                });
            });
        });

        describe('showPlayerButtonAnnotationsNumberBubble', () => {
            beforeEach(resetVJS);

            it('player annotations # bubble is not shown if no annotations exist', (done) => {
                plugin = player.annotationComments();

                plugin.onReady(() => {
                    player.play().then(() => {
                        expect($('.vac-player-btn b:visible').length).to.equal(0);
                        done();
                    });
                });
            });

            it('player annotations # bubble is shown if annotations exist', (done) => {
                plugin = player.annotationComments({ annotationsObjects: annotations });

                plugin.onReady(() => {
                    player.play().then(() => {
                        expect($('.vac-player-btn b:visible').length).to.equal(1);
                        done();
                    });
                });
            })
        });

        describe('showFullScreen', () => {
            beforeEach(resetVJS);

            it('adds a class to the player to disable annotation mode', (done) => {
                // NOTE: Cannot test full screen api due to browser restrictions
                // testing that adding the class removed the button instead

                plugin = player.annotationComments({ annotationsObjects: annotations });

                plugin.onReady(() => {
                    player.play().then(() => {
                        $('.video-js').addClass('vac-disable-fullscreen');
                        expect($('.vac-player-btn:visible').length).to.equal(0);

                        $('.video-js').removeClass('vac-disable-fullscreen');
                        expect($('.vac-player-btn:visible').length).to.equal(1);

                        done();
                    });
                });
            });
        });

        describe('showMarkerShapeAndTooltips', () => {
            beforeEach(resetVJS);

            it('has a default of true and shows tooltips', (done) => {
                plugin = player.annotationComments({ annotationsObjects: annotations });

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        expect($('.vac-marker').first().find('span.vac-tooltip').length).to.equal(1);
                        done();
                    });
                });
            });

            it('can be set to false to hide the tooltips', (done) => {
                plugin = player.annotationComments({
                    annotationsObjects: annotations,
                    showMarkerShapeAndTooltips: false
                });

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        expect($('.vac-marker').first().find('span.vac-tooltip').length).to.equal(0);
                        done();
                    });
                });
            });
        });

        describe('internalCommenting', () => {
            beforeEach(resetVJS);

            it('has a default of true and allows internal commenting', (done) => {
                plugin = player.annotationComments({});

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        addingAnnotation();
                        expect($('.vac-button').length).to.equal(1);
                        done();
                    });
                });
            });

            it('can be set to false and does not allow internal commenting', (done) => {
                plugin = player.annotationComments({ internalCommenting: false });

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        addingAnnotation();
                        expect($('.vac-button').length).to.equal(0);
                        done();
                    });
                });
            });
        });
    });
});
