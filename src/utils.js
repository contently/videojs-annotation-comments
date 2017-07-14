'use strict';

const Utils = {
    cloneObject: (obj) => Object.assign({}, obj),
    throttle: (func, wait) => {
        var time = Date.now();
        return function() {
            if ((time + wait - Date.now()) < 0) {
                func();
                time = Date.now();
            }
        }
    }
}

module.exports = {
    cloneObject: Utils.cloneObject,
    throttle: Utils.throttle
}
