'use strict';

describe('external event-based API', () => {

    describe('externally fired events', () => {
        describe('openAnnotation', () => {
            beforeEach(resetVJS);

            it('activates an annotation when triggered', (done) => {
                plugin = simplePluginSetup();

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        let openId = plugin.annotationState.annotations[0].id;
                        plugin.fire('openAnnotation', { id: openId });
                        expect($('.vac-marker').first().hasClass('vac-active')).to.equal(true);
                        done();
                    });
                });
            });
        });

        describe('closeActiveAnnotation', () => {
            beforeEach(resetVJS);

            it('closes the active annotation', (done) => {
                plugin = simplePluginSetup();

                plugin.onReady(() => {
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

            it('adds an annotation when triggered', (done) => {
                plugin = simplePluginSetup();

                plugin.onReady(() => {
                    player.play().then(() => {
                        let startingLength = plugin.annotationState.annotations.length
                        plugin.fire('newAnnotation', { id: 1, range: { start: 20, end: null }, commentStr: "yeoooop" });

                        expect(plugin.annotationState.annotations.length).to.equal(startingLength + 1)

                        expect(plugin.annotationState.annotations[0].id).to.equal(1);
                        expect(plugin.annotationState.annotations[0].range["start"]).to.equal(20);
                        expect(plugin.annotationState.annotations[0].range["end"]).to.equal(null);
                        expect(plugin.annotationState.annotations[0].commentList.comments[0].body).to.equal("yeoooop")

                        expect($('.vac-marker:visible').last().hasClass('vac-active')).to.equal(true);
                        done();
                    });
                });
            })
        });

        describe('destroyAnnotation', () => {
            beforeEach(resetVJS);

            it('removes an annotation when triggered', (done) => {
                plugin = simplePluginSetup();

                plugin.onReady(() => {
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

        describe('addingAnnotation', () => {
            beforeEach(resetVJS);

            it('enters the adding mode for Controls', (done) => {
                plugin = simplePluginSetup();

                plugin.onReady(() => {
                    player.play().then(() => {
                        expect(plugin.controls.uiState.adding).to.equal(false);
                        plugin.fire('addingAnnotation');
                        expect(plugin.controls.uiState.adding).to.equal(true);
                        done();
                    });
                })
            });
        });

        describe('cancelAddingAnnotation', () => {
            beforeEach(resetVJS);

            it('cancels the adding mode for Controls', (done) => {
                plugin = simplePluginSetup();

                plugin.onReady(() => {
                    player.play().then(() => {
                        plugin.controls.startAddNew();
                        expect(plugin.controls.uiState.adding).to.equal(true);
                        plugin.fire('cancelAddingAnnotation');
                        expect(plugin.controls.uiState.adding).to.equal(false);
                        done();
                    });
                });
            });
        });

        describe('newComment', () => {
            beforeEach(resetVJS)

            it('adds a new comment to an Annotation', (done) => {
                plugin = simplePluginSetup();

                plugin.onReady(() => {
                    player.play().then(() => {
                        let annotation = plugin.annotationState.annotations[0],
                            commentList = annotation.commentList,
                            startingLength = commentList.comments.length
                        plugin.fire('newComment', { annotationId: annotation.id, body: 'My new comment' });

                        expect(commentList.comments.length).to.equal(startingLength + 1);
                        expect(commentList.comments[commentList.comments.length - 1].body).to.equal('My new comment');

                        done();
                    });
                });
            });
        });

        describe('destroyComment', () => {
            beforeEach(resetVJS)

            it('removes a comment by id', (done) => {
                plugin = simplePluginSetup();

                plugin.onReady(() => {
                    player.play().then(() => {
                        let annotation = plugin.annotationState.annotations[0],
                            commentList = annotation.commentList,
                            startingLength = commentList.comments.length,
                            commentId = commentList.comments[0].id
                        plugin.fire('destroyComment', { id: commentId });

                        expect(commentList.comments.length).to.equal(startingLength - 1);
                        expect(plugin.annotationState.findComment(commentId)).to.be.undefined;

                        done();
                    });
                });
            });
        });
    });

    describe('internally fired events', () => {

        describe('onStateChanged', () => {
            beforeEach(resetVJS);

            it('is triggered when plugin state is changed', (done) => {
                plugin = simplePluginSetup();

                plugin.on('onStateChanged', (event) => {
                    expect(event.detail[0].id).to.equal(2);
                    done();
                });

                plugin.onReady(() => {
                    let firstAnnotation = plugin.annotationState.annotations[0];
                        plugin.annotationState.removeAnnotation(firstAnnotation);
                });

            });
        });

        describe('annotationDeleted', () => {
            beforeEach(resetVJS);

            it('is triggered when comment is deleted', (done) => {
                plugin = simplePluginSetup();

                plugin.on('annotationDeleted', (event) => {
                    expect(event.detail.id).to.equal(2);
                    done();
                });

                plugin.onReady(() => {
                    player.play().then(() => {
                        plugin.annotationState.openAnnotationById(2);
                        $('a.vac-delete-annotation').click();
                        $('a.vac-delete-confirm').click();
                    });
                });
            });
        });


        describe('annotationOpened', () => {
            beforeEach(resetVJS);

            it('is triggered when an annotation is opened via click and includes annotation data', (done) => {
                plugin = simplePluginSetup();

                // Add listener
                plugin.on('annotationOpened', (event) => {
                    expect(event.detail.triggered_by_timeline).to.equal(false);
                    expect(event.detail.annotation.id).to.equal(1);
                    expect(event.detail.annotation.range.end).to.equal(60);

                    // remove this listener to play nicely with other tests
                    plugin.off('annotationOpened');
                    done();
                });

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        // Marker click triggers annotationOpened
                        $('.vac-marker').first().click();
                    });
                });
            });

            it('is triggered when an annotation is opened via timeline and includes annotation data', (done) => {
                plugin = simplePluginSetup();

                // Add listener
                plugin.on('annotationOpened', (event) => {
                    expect(event.detail.triggered_by_timeline).to.equal(true);
                    expect(event.detail.annotation.id).to.equal(1);
                    expect(event.detail.annotation.range.end).to.equal(60);

                    // remove this listener to play nicely with other tests
                    plugin.off('annotationOpened');
                    done();
                });

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        //scrub timeline to where annotation is
                        player.currentTime(55);
                    });
                });
            }).timeout(4000);
        });

        describe('addingAnnotationDataChanged', () => {
            beforeEach(resetVJS);

            it('is triggered during the add annotation process when a selectable shape is changed', (done) => {
                plugin = simplePluginSetup();

                // Add listener
                plugin.on('addingAnnotationDataChanged', (event) => {
                    expect(event.detail.shape).to.not.be.undefined;
                    done();
                });

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        addingAnnotation();

                        // mock click and drag behavior
                        // mock starter shape and stub css display func
                        let shapeOffsetTop = $(player.el()).offset().top + 20,
                            shapeOffsetLeft = $(player.el()).offset().left + 20,
                            mockedDragEvent = { pageY: shapeOffsetTop, pageX: shapeOffsetLeft },
                            mockedShape = { x1: null, x2: null, y1: null, y2: null },
                            stubbedSetDims = (()=>{}),
                            shape = plugin.controls.selectableShape;

                        shape.shape = mockedShape;
                        shape.setDimsFromShape = stubbedSetDims;
                        shape.originX = shapeOffsetLeft + 40;
                        shape.originY = shapeOffsetTop + 40;

                        shape.onDrag(mockedDragEvent);
                    });
                });
            });

            it('is triggered during the add annotation process when a draggable marker is changed', (done) => {
                plugin = simplePluginSetup();

                // Add listener
                plugin.on('addingAnnotationDataChanged', (event) => {
                    expect(event.detail.range).to.not.be.undefined;
                    done();
                });

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        addingAnnotation();

                        // mock click and drag behavior
                        let markerOffsetLeft = $(player.el()).offset().left + 250,
                            mockedDragEvent = { pageX: markerOffsetLeft },
                            mockedRange = { start: null, end: null },
                            marker = plugin.controls.marker;

                        marker.range = mockedRange;
                        marker.onDrag(mockedDragEvent);
                    });
                });
            });

            it('is triggered during the add annotation process when the start of the annotation is moved', (done) => {
                plugin = simplePluginSetup();

                // Add listener
                plugin.on('addingAnnotationDataChanged', (event) => {
                    expect(event.detail.range.start).to.equal(9);
                    expect(event.detail.range.end).to.equal(20);
                    done();
                });

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        addingAnnotation();

                        // mock range
                        let mockedRange = { start: 10, end: 20 },
                            marker = plugin.controls.marker;

                        marker.range = mockedRange;
                        marker.rangePin = 10;
                        marker.scrubStart(-1);
                    });
                });
            });
        });

        describe('enteredAddingAnnotation', () => {
            beforeEach(resetVJS);

            it('is triggered when the controls enters adding annotation state', (done) => {
                plugin = simplePluginSetup();

                // Add listener
                plugin.on('enteredAddingAnnotation', (event) => {
                    expect(event.detail.range.start).to.not.be.undefined;
                    done();
                });

                plugin.onReady(() => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        addingAnnotation();
                    });
                });
            });
        });
    });
});
