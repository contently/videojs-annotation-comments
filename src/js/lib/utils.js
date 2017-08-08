"use strict";
/*
    Geneal utility functions, sourced from underscore & scratch built as needed
*/

module.exports = {
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
    },
    humanTime: (range) => {
        function readable(sec){
            let mins = Math.floor(sec/60),
            secs = String(sec % 60);
            return mins + ":" + (secs.length==1 ? "0" : "") + secs;
        }
        let time = [readable(range.start)];
        if(range.end) time.push(readable(range.end));
        return time.join("-");
    },
    guid: () => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +  s4() + '-' + s4() + s4() + s4();
    },
    // returns the height and width of an element that is not visible
    // clones el and tricks DOM into rendering it w the correct size
    // beware the container may be important for scoped styles
    areaOfHiddenEl: ($el, $container, hideClass='') => {
        let $clone = $el.clone(),
            data = {};
        $clone.css({
            visibility: 'hidden',
            display: 'inline-block'
        });
        $clone.removeClass(hideClass);
        $container.append($clone);
        data.width = $clone.outerWidth();
        data.height = $clone.outerHeight();
        $clone.remove();

        return data;
    },
    isWithinRange: (start, end, n) => n >= start && n <= end,
};
