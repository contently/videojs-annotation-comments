'use strict';

const EventDispatcher = require("../../../src/modules/event_dispatcher").class,
    expect = require('chai').expect;

const MockedPlugin = { on: (type, callback) => {} };
const mockedClassOneInstance = { constructor: { name: 'ClassOne' } };
const mockedClassTwoInstance = { constructor: { name: 'ClassTwo' } };
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
            let eventDispatcher = new EventDispatcher(MockedPlugin);
            expect(eventDispatcher.plugin).to.deep.equal(MockedPlugin);
            expect(eventDispatcher.registeredListeners).to.be.an("array").that.is.empty;
        });
    });

    describe('nameSpacedType', () => {
        it('creates a consistent namespace for VAC events', () => {
            let eventDispatcher = new EventDispatcher(MockedPlugin);
            // expect(eventDispatcher.nameSpacedType('my-type')).to.equal('my-type.videoAnnotations');
        });
    });

    describe('registerListener', () => {
        it('caches the type as a registered listener', () => {
            let eventDispatcher = new EventDispatcher(MockedPlugin);
            eventDispatcher.registerListener('my-type', (changeMe) => { changeMe = 'changed' });
            expect(eventDispatcher.registeredListeners).to.include('my-type');
        });
    });

    describe('registerListenersFor', () => {
        it('iterates through the registry and registers listeners based on object type', () => {
            let eventDispatcher = new EventDispatcher(MockedPlugin);
            eventDispatcher.eventRegistry = MockedEventRegistry;

            eventDispatcher.registerListenersFor(mockedClassOneInstance);
            expect(eventDispatcher.registeredListeners).to.include('myFirstEvent');
            expect(eventDispatcher.registeredListeners).to.include('mySecondEvent');
            expect(eventDispatcher.registeredListeners).to.not.include('myThirdEvent');

            eventDispatcher.registerListenersFor(mockedClassTwoInstance);
            expect(eventDispatcher.registeredListeners).to.include('myThirdEvent');
        });

        it('does not create duplicate event listeners', () => {
            let eventDispatcher = new EventDispatcher(MockedPlugin);
            eventDispatcher.eventRegistry = MockedEventRegistry;

            eventDispatcher.registerListenersFor(mockedClassOneInstance);
            eventDispatcher.registerListenersFor(mockedClassOneInstance);

            expect(eventDispatcher.registeredListeners.length).to.equal(2);
        });
    });
});
