'use strict';
/*
    Classes for registering and handling custom events for external interaction support.
    Will be bound to plugin object as a message gateway between external elements and the plugin.
*/

const Logger = require("./logger");
const mitt = require("mitt");

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
            _this.openAnnotationById(event.detail.id);
        },
        closeActiveAnnotation: (event, _this) => {
            _this.clearActive();
        },
        newAnnotation: (event, _this) => {
            _this.createAndAddAnnotation(event.detail);
        },
        destroyAnnotation: (event, _this) => {
            _this.destroyAnnotationById(event.detail.id);
        },
        newComment: (event, _this) => {
            let annotation = _this.findAnnotation(event.detail.annotationId);
            if(annotation) annotation.commentList.createComment(event.detail.body);
        },
        destroyComment: (event, _this) => {
            let comment = _this.findComment(event.detail.id);
            if(comment) comment.commentList.destroyComment(event);
        }
    },
    Controls: {
        addingAnnotation: (event, _this) => {
            _this.startAddNew();
        },
        cancelAddingAnnotation: (event, _this) => {
            _this.cancelAddNew();
        }
    },
    PlayerButton: {
        onStateChanged: (event, _this) => {
            _this.updateNumAnnotations();
        }
    },
    AnnotationComments: {
        toggleAnnotationMode: (event, _this) => {
            _this.toggleAnnotationMode();
        }
    }
};

module.exports = class EventDispatcher {

    constructor () {
        this.pluginReady = false;
        this.pendingEvts = [];
        this.registeredListeners = [];
        this.eventRegistry = EventRegistry;
        this.eventEmitter = mitt();
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
                        this.logCallback(key, className, evt);
                        callback(evt, obj);
                    }).bind(this));
                }
            });
        }
    }

    // Bind a listener
    registerListener (type, callback) {
        this.eventEmitter.on(type, callback);
        this.registeredListeners.push(type);
    }

    // Unbind a listener
    unregisterListener (type) {
        this.eventEmitter.off(type);
        let i = this.registeredListeners.indexOf(type);
        this.registeredListeners.splice(i, 1);
    }

    // Trigger an event
    fire (type, data) {
        if(!this.pluginReady) return;
        Logger.log("evt-dispatch-FIRE", type, data);
        this.eventEmitter.emit(type, { detail: data });
    }

    teardown () {
        this.registeredListeners.forEach((type) => { this.unregisterListener(type) });
    }

    logCallback (eventName, className, event) {
        Logger.log("evt-dispatch-RECEIVE", `${eventName} (${className})`, event);
    }
}
