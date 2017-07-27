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

        describe('addingAnnotation', () => {
            beforeEach(resetVJS);

            it('enters the adding mode for Controls', (done) => {
                plugin = simplePluginSetup();

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        expect(plugin.components.controls.uiState.adding).to.equal(false);
                        plugin.fire('addingAnnotation');
                        expect(plugin.components.controls.uiState.adding).to.equal(true);
                        done();
                    });
                })
            });
        });

        describe('cancelAddingAnnotation', () => {
            beforeEach(resetVJS);

            it('cancels the adding mode for Controls', (done) => {
                plugin = simplePluginSetup();

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        plugin.components.controls.startAddNew();
                        expect(plugin.components.controls.uiState.adding).to.equal(true);
                        plugin.fire('cancelAddingAnnotation');
                        expect(plugin.components.controls.uiState.adding).to.equal(false);
                        done();
                    });
                });
            });
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

        describe('addingAnnotationDataChanged', () => {
            beforeEach(resetVJS);

            it('is triggered during the add annotation process when a selectable shape is changed', (done) => {
                plugin = simplePluginSetup();

                // Add listener
                plugin.on('addingAnnotationDataChanged', (event) => {
                    expect(event.detail.shape).to.not.be.undefined;
                    console.log(event.detail.shape);
                    done();
                });

                player.on('loadedmetadata', () => {
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
                            shape = plugin.components.controls.selectableShape;

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
                    console.log(event.detail.range);
                    done();
                });

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        addingAnnotation();

                        // mock click and drag behavior
                        let markerOffsetLeft = $(player.el()).offset().left + 250,
                            mockedDragEvent = { pageX: markerOffsetLeft },
                            mockedRange = { start: null, end: null },
                            marker = plugin.components.controls.marker;

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
                    console.log(event.detail.range);
                    done();
                });

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        addingAnnotation();

                        // mock range
                        let mockedRange = { start: 10, end: 20 },
                            marker = plugin.components.controls.marker;

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
                    console.log('adding annotation state entered')
                    done();
                });

                player.on('loadedmetadata', () => {
                    player.play().then(() => {
                        toggleAnnotationMode();
                        addingAnnotation();
                    });
                });
            });
        });
    });
});
