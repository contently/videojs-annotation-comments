'use strict';

const EventDispatcher = require("../../../src/js/lib/event_dispatcher"),
    expect = require('chai').expect;

const MockedEventRegistry = {
    ClassOne: {
        myFirstEvent: () => {},
        mySecondEvent: () => {}
    },
    ClassTwo: {
        myThirdEvent: () => {}
    }
};

describe('EventDispatcher', () => {

    describe('constructor', () => {
        it('creates an EventDispatcher instance w a listener cache and a plugin reference', () => {
            let eventDispatcher = new EventDispatcher();
            expect(eventDispatcher.registeredListeners).to.be.an("array").that.is.empty;
        });
    });

    describe('registerListener', () => {
        it('caches the type as a registered listener', () => {
            let eventDispatcher = new EventDispatcher();
            eventDispatcher.registerListener('my-type', (changeMe) => { changeMe = 'changed' });
            expect(eventDispatcher.registeredListeners).to.include('my-type');
        });
    });

    describe('registerListenersFor', () => {
        it('iterates through the registry and registers listeners based on object type', () => {
            let eventDispatcher = new EventDispatcher();
            eventDispatcher.eventRegistry = MockedEventRegistry;

            eventDispatcher.registerListenersFor({}, 'ClassOne');
            expect(eventDispatcher.registeredListeners).to.include('myFirstEvent');
            expect(eventDispatcher.registeredListeners).to.include('mySecondEvent');
            expect(eventDispatcher.registeredListeners).to.not.include('myThirdEvent');

            eventDispatcher.registerListenersFor({}, 'ClassTwo');
            expect(eventDispatcher.registeredListeners).to.include('myThirdEvent');
        });

        it('does not create duplicate event listeners', () => {
            let eventDispatcher = new EventDispatcher();
            eventDispatcher.eventRegistry = MockedEventRegistry;

            eventDispatcher.registerListenersFor({}, 'ClassOne');
            eventDispatcher.registerListenersFor({}, 'ClassOne');

            expect(eventDispatcher.registeredListeners.length).to.equal(2);
        });
    });
});
