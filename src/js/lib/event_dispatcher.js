'use strict';
/*
    Classes for registering and handling custom events for external interaction support.
    Will be bound to plugin object as a message gateway between external elements and the plugin.
*/

const Logger = require("./logger");

class EventDispatcher {

    constructor (plugin) {
        this.plugin = plugin;
        this.pluginReady = false;
        this.pendingEvts = [];
        this.registeredListeners = [];
        this.eventRegistry = EventRegistry;
    }

    // Use the EventRegistry to mass register events on each component initialization
    registerListenersFor (obj, className) {
        let matchingEvents = this.eventRegistry[className];
        if (matchingEvents) {
            Object.keys(matchingEvents).forEach((key) => {
                // Don't register again if already in cached collection
                if (!~this.registeredListeners.indexOf(key)) {
                    let callback = matchingEvents[key].bind(obj);
                    this.registerListener(key, ((evt) => {
                        if(!this.pluginReady) return;
                        callback(evt, obj);
                    }).bind(this));
                }
            });
        }
    }

    // Bind a listener to the plugin
    registerListener (type, callback) {
        this.plugin.on(type, callback);
        this.registeredListeners.push(type);
    }

    // Unbind a listener from the plugin
    unregisterListener (type) {
        this.plugin.off(type);
        let i = this.registeredListeners.indexOf(type);
        this.registeredListeners.splice(i, 1);
    }

    // Trigger an event on the plugin
    fire (type, data) {
        Logger.log("evt-dispatch-FIRE", type, data);
        if(type === "pluginReady") this.pluginReady = true;
        let evt = new CustomEvent(type, { 'detail': data });
        this.plugin.trigger(evt);
    }

    teardown () {
        this.registeredListeners.forEach((type) => { this.unregisterListener(type) });
    }
}

/*
    A centralized collection of event callbacks organized by component and name
    Main reference for external event api
    These events will be bound to the plugin on initialization of their respective components
    NOTE - 'self' as second param in each function is a workaround for transpiler not properly
    keeping this , so we pass in instance to use as this for each fn - can't rely on bind
    because this is rewritten from symbol registry in transpiler and it's not present
*/

const EventRegistry = {
    AnnotationState: {
        openAnnotation: (event, _this) => {
            Logger.log("evt-dispatch-RECEIVE", "openAnnotation (AnnotationState)", event);
            _this.openAnnotationById(event.detail.id);
        },
        closeActiveAnnotation: (event, _this) => {
            Logger.log("evt-dispatch-RECEIVE", "closeActiveAnnotation (AnnotationState)", event);
            _this.clearActive();
        },
        newAnnotation: (event, _this) => {
            Logger.log("evt-dispatch-RECEIVE", "newAnnotation (AnnotationState)", event);
            _this.createAndAddAnnotation(event.detail);
        },
        destroyAnnotation: (event, _this) => {
            Logger.log("evt-dispatch-RECEIVE", "destroyAnnotation (AnnotationState)", event);
            _this.destroyAnnotationById(event.detail.id);
        }
    },
    Controls: {
        addingAnnotation: (event, _this) => {
            Logger.log("evt-dispatch-RECEIVE", "addingAnnotation (Controls)", event);
            _this.startAddNew();
        },
        cancelAddingAnnotation: (event, _this) => {
            Logger.log("evt-dispatch-RECEIVE", "cancelAddingAnnotation (Controls)", event);
            _this.cancelAddNew();
        }
    },
    PlayerButton: {
        onStateChanged: (event, _this) => {
            Logger.log("evt-dispatch-RECEIVE", "onStateChanged (PlayerButton)", event);
            _this.updateNumAnnotations();
        }
    },
    Main: {
        toggleAnnotationMode: (event, _this) => {
            Logger.log("evt-dispatch-RECEIVE", "toggleAnnotationMode (Main)", event);
            _this.toggleAnnotationMode();
        }
    }
};

module.exports = {
    class: EventDispatcher,
    registry: EventRegistry
};
