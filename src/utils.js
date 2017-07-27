const Utils = {
    cloneObject: (obj) => Object.assign({}, obj),
    // _throttle from underscore
    throttle: (func, wait, options) => {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function() {
          previous = options.leading === false ? 0 : Date.now();
          timeout = null;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        };
        return function() {
          var now = Date.now();
          if (!previous && options.leading === false) previous = now;
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0 || remaining > wait) {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
          }
          return result;
        };
    },
    parseIntObj: (obj) => {
        Object.keys(obj).forEach((key) => {
            if(parseInt(obj[key])) {
                obj[key] = parseInt(obj[key]);
            }
        });
        return obj;
    }
}

module.exports = {
    cloneObject: Utils.cloneObject,
    throttle: Utils.throttle,
    parseIntObj: Utils.parseIntObj
}
