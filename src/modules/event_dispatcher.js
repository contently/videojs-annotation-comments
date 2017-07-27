'use strict';
/*
    Component for registering and handling custom events for external interaction support.
    Will be bound to plugin object as a message gateway between external elements and the plugin.
*/

class EventDispatcher {

    constructor (plugin) {
        this.plugin = plugin;
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
                    this.registerListener(key, callback);
                }
            });
        }
    }

    // Bind a listener to the plugin
    registerListener (type, callback) {
        this.plugin.on(type, callback);
        this.registeredListeners.push(type);
    }

    // Trigger an event on the plugin
    fire (type, data) {
        let evt = new CustomEvent(type, { 'detail': data });
        this.plugin.trigger(evt);
    }
}

/*
    A centralized collection of event callbacks organized by component and name
    Main reference for external event api
    These events will be bound to the plugin on initialization of their respective components
*/

const EventRegistry = {
    AnnotationState: {
        openAnnotation: function (event) {
            let annotationId = event.detail.id;
            let annotation = this.annotations.find((a) => a.id === parseInt(annotationId));
            if (annotation) this.openAnnotation(annotation);
        },
        closeActiveAnnotation: function (event) {
            this.clearActive();
        },
        newAnnotation: function (event) {
            let controls = this.plugin.components.controls;
            if(controls.uiState.adding) controls.cancelAddNew();
            this.createAndAddAnnotation(event.detail);
        },
        destroyAnnotation: function (event) {
            let annotationId = event.detail.id;
            let annotation = this.annotations.find((a) => a.id === parseInt(annotationId));
            if (annotation) annotation.destroy();
        }
    },
    Controls: {
        addingAnnotation: function (event) {
            if(!this.plugin.active) this.plugin.toggleAnnotations();
            this.startAddNew();
        },
        cancelAddingAnnotation: function (event) {
            this.cancelAddNew();
        }
    }
};

module.exports = {
    class: EventDispatcher,
    registry: EventRegistry
};
