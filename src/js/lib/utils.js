/*
    Geneal utility functions, sourced from underscore & scratch built as needed
*/

module.exports = {
  // Clone an object
  cloneObject: obj => ({ ...obj }),

  // _throttle from underscore
  throttle: (func, wait, options) => {
    let context;
    let args;
    let result;
    let timeout = null;
    let previous = 0;
    if (!options) options = {};
    const later = function() {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      const now = Date.now();
      if (!previous && options.leading === false) previous = now;
      const remaining = wait - (now - previous);
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

  // Parse all keys of an object to int
  parseIntObj: obj => {
    Object.keys(obj).forEach(key => {
      if (parseInt(obj[key])) {
        obj[key] = parseInt(obj[key]);
      }
    });
    return obj;
  },

  // Convert a range {start: int, (optional) end: int} to human readable time
  humanTime: range => {
    function readable(sec) {
      const mins = Math.floor(sec / 60);
      const secs = String(sec % 60);
      return `${mins}:${secs.length == 1 ? '0' : ''}${secs}`;
    }
    const time = [readable(range.start)];
    if (range.end) time.push(readable(range.end));
    return time.join('-');
  },

  // Pseduo-random guid generator
  guid: () => {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  },

  // Returns the height and width of an element that is not visible
  // clones el and tricks DOM into rendering it w the correct size
  // beware the container may be important for scoped styles
  areaOfHiddenEl: ($el, $container, hideClass = '') => {
    const $clone = $el.clone();
    const data = {};
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

  // Determine if a value (n) is within a range (start <= n <= end)
  isWithinRange: (start, end, n) => {
    end = end || start + 1; // for ranges with NO end defined, assume a 1s range
    return n >= start && n <= end;
  }
};
