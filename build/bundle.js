(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('ie-array-find-polyfill'), require('es6-object-assign'), require('handlebars'), require('moment')) :
	typeof define === 'function' && define.amd ? define(['ie-array-find-polyfill', 'es6-object-assign', 'handlebars', 'moment'], factory) :
	(global = global || self, factory(null, global.es6ObjectAssign, global.Handlebars, global.moment));
}(this, function (ieArrayFindPolyfill, es6ObjectAssign, Handlebars, moment) { 'use strict';

	Handlebars = Handlebars && Handlebars.hasOwnProperty('default') ? Handlebars['default'] : Handlebars;
	moment = moment && moment.hasOwnProperty('default') ? moment['default'] : moment;

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (typeof call === "object" || typeof call === "function")) {
	    return call;
	  }

	  return _assertThisInitialized(self);
	}

	function _superPropBase(object, property) {
	  while (!Object.prototype.hasOwnProperty.call(object, property)) {
	    object = _getPrototypeOf(object);
	    if (object === null) break;
	  }

	  return object;
	}

	function _get(target, property, receiver) {
	  if (typeof Reflect !== "undefined" && Reflect.get) {
	    _get = Reflect.get;
	  } else {
	    _get = function _get(target, property, receiver) {
	      var base = _superPropBase(target, property);

	      if (!base) return;
	      var desc = Object.getOwnPropertyDescriptor(base, property);

	      if (desc.get) {
	        return desc.get.call(receiver);
	      }

	      return desc.value;
	    };
	  }

	  return _get(target, property, receiver || target);
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  }
	}

	function _iterableToArray(iter) {
	  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance");
	}

	/*
	    Collection of polyfills neededf or IE10+ support
	*/
	// Not yet supported by babel
	// https://gist.github.com/edoardocavazza/47246856759f2273e48b

	(function () {
	  if (typeof Object.setPrototypeOf === 'undefined' && typeof Object.getOwnPropertyNames === 'function') {
	    var _exclude = ['length', 'name', 'arguments', 'caller', 'prototype'];

	    function bindFunction(ctx, fn) {
	      return function () {
	        return fn.apply(this, arguments);
	      };
	    }

	    function bindProperty(ctx, prop, parentDescriptor) {
	      if (!parentDescriptor) {
	        var defaultValue = ctx.__proto__[prop];
	        parentDescriptor = {
	          get: function get() {
	            return ctx['__' + prop] || defaultValue;
	          },
	          set: function set(val) {
	            ctx['__' + prop] = val;
	          }
	        };
	      }

	      Object.defineProperty(ctx, prop, {
	        get: parentDescriptor.get ? parentDescriptor.get.bind(ctx) : undefined,
	        set: parentDescriptor.set ? parentDescriptor.set.bind(ctx) : undefined,
	        configurable: true
	      });
	    }

	    function iterateProps(subClass, superClass) {
	      var props = Object.getOwnPropertyNames(superClass),
	          proto;
	      subClass.__proto__ = superClass;

	      for (var i = 0, len = props.length; i < len; i++) {
	        var prop = props[i];

	        if (prop === '__proto__') {
	          proto = superClass[prop];
	        } else if (_exclude.indexOf(i) === -1) {
	          var descriptor = Object.getOwnPropertyDescriptor(subClass, prop);

	          if (!descriptor) {
	            var superDescriptor = Object.getOwnPropertyDescriptor(superClass, prop);

	            if (typeof superDescriptor.get !== 'function' && typeof superClass[prop] === 'function') {
	              subClass[prop] = bindFunction(subClass, superClass[prop]);
	            } else if (typeof superDescriptor.get == 'function') {
	              bindProperty(subClass, prop, superDescriptor);
	            } else {
	              bindProperty(subClass, prop);
	            }
	          }
	        }
	      }

	      if (proto) {
	        iterateProps(subClass, proto);
	      }
	    }

	    Object.setPrototypeOf = iterateProps;
	  }
	})(); // Use CustomEvent in IE


	(function () {
	  if (typeof window.CustomEvent === 'function') return false;

	  function CustomEvent(event, params) {
	    params = params || {
	      bubbles: false,
	      cancelable: false,
	      detail: undefined
	    };
	    var evt = document.createEvent('CustomEvent');
	    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	    return evt;
	  }

	  CustomEvent.prototype = window.Event.prototype;
	  window.CustomEvent = CustomEvent;
	})();

	/*
	  General utility functions, sourced from underscore & scratch built as needed
	*/
	var Utils = {
	  // Clone an object
	  cloneObject: function cloneObject(obj) {
	    return Object.assign({}, obj);
	  },
	  // _throttle from underscore
	  throttle: function throttle(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};

	    var later = function later() {
	      previous = options.leading === false ? 0 : Date.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };

	    return function () {
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
	  // Parse all keys of an object to int
	  parseIntObj: function parseIntObj(obj) {
	    Object.keys(obj).forEach(function (key) {
	      if (parseInt(obj[key])) {
	        obj[key] = parseInt(obj[key]);
	      }
	    });
	    return obj;
	  },
	  // Convert a range {start: int, (optional) end: int} to human readable time
	  humanTime: function humanTime(range) {
	    function readable(sec) {
	      var mins = Math.floor(sec / 60),
	          secs = String(sec % 60);
	      return mins + ':' + (secs.length == 1 ? '0' : '') + secs;
	    }

	    var time = [readable(range.start)];
	    if (range.end) time.push(readable(range.end));
	    return time.join('-');
	  },
	  // Pseduo-random guid generator
	  guid: function guid() {
	    function s4() {
	      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	    }

	    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	  },
	  // Returns the height and width of an element that is not visible
	  // clones el and tricks DOM into rendering it w the correct size
	  // beware the container may be important for scoped styles
	  areaOfHiddenEl: function areaOfHiddenEl($el, $container) {
	    var hideClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
	    var $clone = $el.clone(),
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
	  // Determine if a value (n) is within a range (start <= n <= end)
	  isWithinRange: function isWithinRange(start, end, n) {
	    end = end || start + 1; // for ranges with NO end defined, assume a 1s range

	    return n >= start && n <= end;
	  }
	};

	/*
	    Base class all player components interit from - it includes lots of helper functions (to get reference to
	    the player, the plugin, video state, etc)
	*/
	var PlayerComponent =
	/*#__PURE__*/
	function () {
	  function PlayerComponent(player) {
	    _classCallCheck(this, PlayerComponent);

	    this._player = player;
	  } // attribute to get reference to the main plugin object (main.js instance)


	  _createClass(PlayerComponent, [{
	    key: "initAPI",
	    // Register all events in the EventRegistry matching this className
	    value: function initAPI(obj, className) {
	      this.plugin.eventDispatcher.registerListenersFor(obj, className);
	    } // Nullify player reference so objects can be removed safely
	    // All components should call super.teardown() within their teardown funcs

	  }, {
	    key: "teardown",
	    value: function teardown() {
	      var destroy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	      if (destroy) this._player = null;
	    }
	  }, {
	    key: "plugin",
	    get: function get() {
	      return this.player.annotationComments();
	    } // attribute to get player javascript instance

	  }, {
	    key: "player",
	    get: function get() {
	      return this._player;
	    } // attribute to get video duration (in seconds)

	  }, {
	    key: "duration",
	    get: function get() {
	      return this.player.duration();
	    } // attribute to get player current time

	  }, {
	    key: "currentTime",
	    get: function get() {
	      return this.player.currentTime();
	    } // set current time of player
	    ,
	    set: function set(time) {
	      this.player.currentTime(time);
	    }
	  }]);

	  return PlayerComponent;
	}();

	var PlayerUIComponent =
	/*#__PURE__*/
	function (_PlayerComponent) {
	  _inherits(PlayerUIComponent, _PlayerComponent);

	  function PlayerUIComponent(player) {
	    _classCallCheck(this, PlayerUIComponent);

	    return _possibleConstructorReturn(this, _getPrototypeOf(PlayerUIComponent).call(this, player));
	  } // helpers to get various UI components of the player quickly, keeping commonly reused class names
	  // consolidated in case of need to change in the future (and for quick access)


	  _createClass(PlayerUIComponent, [{
	    key: "disablePlayingAndControl",
	    // Disable play/control actions on the current player
	    value: function disablePlayingAndControl() {
	      this.$player.addClass('vac-disable-play'); //TODO - catch spacebar being hit
	      //TODO - prevent scrubbing and timeline click to seek
	    } // Enable play/control actions on the controller

	  }, {
	    key: "enablePlayingAndControl",
	    value: function enablePlayingAndControl() {
	      this.$player.removeClass('vac-disable-play');
	    } // Provide basic teardown function to inherit

	  }, {
	    key: "teardown",
	    value: function teardown() {
	      if (this.$el) this.$el.remove();

	      _get(_getPrototypeOf(PlayerUIComponent.prototype), "teardown", this).call(this);
	    }
	  }, {
	    key: "$UI",
	    get: function get() {
	      return Object.freeze({
	        commentsContainer: this.$player.find('.vac-comments-container'),
	        // outer container for all comments
	        controlElements: this.$player.find('.vac-control'),
	        // Each of multiple control elements in the control bar
	        newCommentTextarea: this.$player.find('.vac-video-write-new textarea'),
	        // Textarea for writing a new comment
	        timeline: this.$player.find('.vjs-progress-control'),
	        // Timeline element
	        markerCursorHelpText: this.$player.find('.vac-cursor-help-text'),
	        // Help text that appears with 'click/drag..' on timeline
	        controlBar: this.$player.find('.vjs-control-bar'),
	        // Conrol bar wrapper for vjs
	        markerWrap: this.$player.find('.vac-marker-wrap'),
	        // wrapper element to place markers in on timeline
	        coverCanvas: this.$player.find('.vac-video-cover-canvas') // Player cover during adding annotation state

	      });
	    } // utility classes used in various components

	  }, {
	    key: "UI_CLASSES",
	    get: function get() {
	      return Object.freeze({
	        hidden: 'vac-hidden',
	        active: 'vac-active'
	      });
	    } // attribute to get player jquery element

	  }, {
	    key: "$player",
	    get: function get() {
	      return $(this.player.el());
	    } // attribute to get player id from DOM

	  }, {
	    key: "playerId",
	    get: function get() {
	      return this.$player.attr('id');
	    } // Generate a pseudo-guid ID for this component, to use as an ID in the DOM

	  }, {
	    key: "componentId",
	    get: function get() {
	      this.cid_ = this.cid_ || Utils.guid();
	      return this.cid_;
	    }
	  }]);

	  return PlayerUIComponent;
	}(PlayerComponent);

	var Template = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
	    return "vac-ranged-marker";
	},"3":function(container,depth0,helpers,partials,data) {
	    var helper, alias1=container.propertyIsEnumerable;

	  return "width:"
	    + container.escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"width","hash":{},"data":data}) : helper)))
	    + ";";
	},"5":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.propertyIsEnumerable;

	  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.tooltipBody : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
	},"6":function(container,depth0,helpers,partials,data) {
	    var stack1, helper, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", alias5=container.escapeExpression;

	  return "            <div>\n                <span class=\"vac-tooltip "
	    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.tooltipRight : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
	    + "\">\n                    <b>"
	    + alias5(((helper = (helper = helpers.tooltipTime || (depth0 != null ? depth0.tooltipTime : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"tooltipTime","hash":{},"data":data}) : helper)))
	    + "</b> - "
	    + alias5(((helper = (helper = helpers.tooltipBody || (depth0 != null ? depth0.tooltipBody : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"tooltipBody","hash":{},"data":data}) : helper)))
	    + "\n                </span>\n            </div>\n";
	},"7":function(container,depth0,helpers,partials,data) {
	    return "vac-right-side";
	},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, helper, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", alias5=container.escapeExpression;

	  return "<div data-marker-id=\""
	    + alias5(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"id","hash":{},"data":data}) : helper)))
	    + "\" class=\"vac-marker "
	    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.rangeShow : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
	    + "\" style=\"left: "
	    + alias5(((helper = (helper = helpers.left || (depth0 != null ? depth0.left : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"left","hash":{},"data":data}) : helper)))
	    + "; "
	    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.rangeShow : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
	    + " z-index: "
	    + alias5(((helper = (helper = helpers.zIndex || (depth0 != null ? depth0.zIndex : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"zIndex","hash":{},"data":data}) : helper)))
	    + "\">\n"
	    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.showTooltip : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
	    + "</div>\n";
	},"useData":true});
	function MarkerTemplate(data, options, asString) {
	  var html = Template(data, options);
	  return (asString || true) ? html : $(html);
	}

	var Template$1 = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
	    return "<div class=\"vac-marker-owrap\">\n	<div class=\"vac-marker-wrap\"></div>\n</div>";
	},"useData":true});
	function MarkerWrapTemplate(data, options, asString) {
	  var html = Template$1(data, options);
	  return (asString || true) ? html : $(html);
	}

	var Marker =
	/*#__PURE__*/
	function (_PlayerUIComponent) {
	  _inherits(Marker, _PlayerUIComponent);

	  function Marker(player, range) {
	    var _this;

	    var comment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	    _classCallCheck(this, Marker);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(Marker).call(this, player));
	    _this.range = range;
	    _this.comment = comment;

	    if (!_this.$UI.markerWrap.length) {
	      _this.$UI.timeline.append(MarkerWrapTemplate());
	    }

	    return _this;
	  } // Set this marker as active (highlight) and optionally show tooltip also


	  _createClass(Marker, [{
	    key: "setActive",
	    value: function setActive() {
	      var showTooltip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	      this.$el.addClass(this.UI_CLASSES.active);
	      if (showTooltip) this.$el.addClass('vac-force-tooltip');
	    } // Deactivate this marker

	  }, {
	    key: "deactivate",
	    value: function deactivate() {
	      this.$el.removeClass("".concat(this.UI_CLASSES.active, " vac-force-tooltip"));
	    } // Draw marker on timeline for this.range;

	  }, {
	    key: "render",
	    value: function render() {
	      // clear existing marker if this one was already rendered
	      this.$UI.timeline.find("[data-marker-id=\"".concat(this.componentId, "\"]")).remove(); // Bind to local instance var, add to DOM, and setup events

	      this.$el = $(MarkerTemplate(this.markerTemplateData));
	      this.$UI.markerWrap.append(this.$el);
	      this.bindMarkerEvents();
	    } // Bind needed events for this marker

	  }, {
	    key: "bindMarkerEvents",
	    value: function bindMarkerEvents() {
	      var _this2 = this;

	      // handle dimming other markers + highlighting this one on mouseenter/leave
	      this.$el.on('mouseenter.vac-marker', function () {
	        _this2.$el.addClass('vac-hovering').closest('.vac-marker-wrap').addClass('vac-dim-all');
	      }).on('mouseleave.vac-marker', function () {
	        _this2.$el.removeClass('vac-hovering').closest('.vac-marker-wrap').removeClass('vac-dim-all');
	      });
	    } // Build object for template

	  }, {
	    key: "teardown",
	    // Unbind event listeners on teardown and remove DOM nodes
	    value: function teardown() {
	      this.$el.off('mouseenter.vac-marker').off('mouseleave.vac-marker').off('click.vac-marker');

	      _get(_getPrototypeOf(Marker.prototype), "teardown", this).call(this);
	    }
	  }, {
	    key: "markerTemplateData",
	    get: function get() {
	      // the smaller the width, the higher the z-index so overlaps are clickable
	      var left = this.range.start / this.duration * 100,
	          width = this.range.end / this.duration * 100 - left,
	          zIndex = 100 - Math.floor(width) || 100;
	      return {
	        left: left + '%',
	        width: width + '%',
	        zIndex: zIndex,
	        showTooltip: this.plugin.options.showMarkerShapeAndTooltips,
	        tooltipRight: left > 50,
	        tooltipTime: Utils.humanTime(this.range),
	        tooltipBody: !this.comment ? null : this.comment.body,
	        rangeShow: !!this.range.end,
	        id: this.componentId
	      };
	    }
	  }]);

	  return Marker;
	}(PlayerUIComponent);

	var Template$2 = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
	    var helper, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", alias5=container.escapeExpression;

	  return "<div data-marker-id=\""
	    + alias5(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"id","hash":{},"data":data}) : helper)))
	    + "\" class=\"vac-marker-draggable vac-ranged-marker\" style=\"left: "
	    + alias5(((helper = (helper = helpers.left || (depth0 != null ? depth0.left : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"left","hash":{},"data":data}) : helper)))
	    + "; width:"
	    + alias5(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"width","hash":{},"data":data}) : helper)))
	    + ";\">\n</div>\n";
	},"useData":true});
	function MarkerTemplate$1(data, options, asString) {
	  var html = Template$2(data, options);
	  return (asString || true) ? html : $(html);
	}

	var DraggableMarker =
	/*#__PURE__*/
	function (_Marker) {
	  _inherits(DraggableMarker, _Marker);

	  function DraggableMarker(player, range) {
	    var _this;

	    _classCallCheck(this, DraggableMarker);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(DraggableMarker).call(this, player, range));
	    _this.range = range; // NOTE - this shouldn't be required and is a HACK for how transpilation works in IE10

	    _this.dragging = false; // Is a drag action currently occring?

	    _this.rangePin = range.start; // What's the original pinned timeline point when marker was added

	    _this.render();

	    _this.$parent = _this.$UI.markerWrap; // Set parent as marker wrap

	    return _this;
	  } // Bind needed evnets for UI interaction


	  _createClass(DraggableMarker, [{
	    key: "bindMarkerEvents",
	    value: function bindMarkerEvents() {
	      var _this2 = this;

	      // On mouse down init drag
	      this.$el.on('mousedown.vac-marker', function (e) {
	        e.preventDefault();
	        _this2.dragging = true; // When mouse moves (with mouse down) call onDrag, throttling to once each 250 ms

	        $(document).on("mousemove.vac-dmarker-".concat(_this2.playerId), Utils.throttle(_this2.onDrag.bind(_this2), 250)); // Add drag class to cursor tooltip if available

	        if (!_this2.plugin.options.showControls) {
	          _this2.$player.find('.vac-cursor-tool-tip').addClass('vac-cursor-dragging').removeClass('vac-marker-hover');
	        }
	      }); // On mouse up end drag action and unbind mousemove event

	      $(document).on("mouseup.vac-dmarker-".concat(this.playerId), function (e) {
	        if (!_this2.dragging) return;
	        $(document).off("mousemove.vac-dmarker-".concat(_this2.playerId));
	        _this2.dragging = false; // Remove drag class and hover class from cursor tooltip if available

	        if (!_this2.plugin.options.showControls) {
	          _this2.$player.find('.vac-cursor-tool-tip').removeClass('vac-cursor-dragging').removeClass('vac-marker-hover');
	        }
	      }); // On mouse mouse enter, show cursor tooltip if controls are not shown
	      // This adds the class which is picked up in Controls

	      if (!this.plugin.options.showControls) {
	        var self = this;
	        self.$el.on('mouseenter.vac-cursor-tool-tip', function () {
	          self.$player.find('.vac-cursor-tool-tip').addClass('vac-marker-hover');
	        }).on('mouseleave.vac-cursor-tool-tip', function () {
	          self.$player.find('.vac-cursor-tool-tip').removeClass('vac-marker-hover');
	        });
	      }
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      // clear existing marker if this one was already rendered
	      this.$UI.timeline.find("[data-marker-id=\"".concat(this.componentId, "\"]")).remove(); // Bind to local instance var, add to DOM, and setup events

	      this.$el = $(MarkerTemplate$1(this.markerTemplateData));
	      this.$UI.markerWrap.append(this.$el);
	      this.bindMarkerEvents();
	    } // On drag action, calculate new range and re-render marker

	  }, {
	    key: "onDrag",
	    value: function onDrag(e) {
	      var dragPercent = this.percentValFromXpos(e.pageX),
	          secVal = parseInt(this.duration * dragPercent);

	      if (secVal > this.rangePin) {
	        this.range = {
	          start: this.rangePin,
	          end: secVal
	        };
	      } else {
	        this.range = {
	          start: secVal,
	          end: this.rangePin
	        };
	      }

	      this.render();
	      this.plugin.fire('addingAnnotationDataChanged', {
	        range: this.range
	      });
	    } // Cal percentage (of video) position for a pixel-based X position on the document

	  }, {
	    key: "percentValFromXpos",
	    value: function percentValFromXpos(xpos) {
	      var x = Math.max(0, xpos - this.$parent.offset().left),
	          // px val
	      max = this.$parent.innerWidth(),
	          per = x / max;
	      if (per > 1) per = 1;
	      if (per < 0) per = 0;
	      return per;
	    } // Remove bound events on destructon

	  }, {
	    key: "teardown",
	    value: function teardown() {
	      $(document).off("mousemove.vac-dmarker-".concat(this.playerId, " mouseup.vac-dmarker-").concat(this.playerId));
	      this.$el.off('mouseenter.vac-cursor-tool-tip');
	      this.$el.off('mouseleave.vac-cursor-tool-tip');
	      this.$el.off('mousedown.vac-marker');
	      this.$el.remove();
	    } // Move the video & marker start by some num seconds (pos or neg)

	  }, {
	    key: "scrubStart",
	    value: function scrubStart(secondsChanged) {
	      var newStart = this.range.start + secondsChanged;
	      this.currentTime = newStart;
	      this.range.start = newStart;
	      this.rangePin = newStart;
	      this.teardown();
	      this.render();
	      this.plugin.fire('addingAnnotationDataChanged', {
	        range: this.range
	      });
	    }
	  }]);

	  return DraggableMarker;
	}(Marker);

	var Shape =
	/*#__PURE__*/
	function (_PlayerUIComponent) {
	  _inherits(Shape, _PlayerUIComponent);

	  function Shape(player) {
	    var _this;

	    var shape = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	    _classCallCheck(this, Shape);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(Shape).call(this, player));
	    _this.shape = shape;
	    _this.$parent = _this.$player;
	    return _this;
	  } // Draw the shape element on the $parent


	  _createClass(Shape, [{
	    key: "render",
	    value: function render() {
	      if (!this.shape) return;
	      if (this.$el) this.$el.remove();
	      this.$el = $('<div/>').addClass('vac-shape');
	      this.setDimsFromShape();
	      this.$parent.append(this.$el);
	    } // Set/update the dimensions of the shape based  on this.shape

	  }, {
	    key: "setDimsFromShape",
	    value: function setDimsFromShape() {
	      this.$el.css({
	        left: this.shape.x1 + '%',
	        top: this.shape.y1 + '%',
	        width: this.shape.x2 - this.shape.x1 + '%',
	        height: this.shape.y2 - this.shape.y1 + '%'
	      });
	    }
	  }]);

	  return Shape;
	}(PlayerUIComponent);

	var SelectableShape =
	/*#__PURE__*/
	function (_Shape) {
	  _inherits(SelectableShape, _Shape);

	  function SelectableShape(player) {
	    var _this;

	    _classCallCheck(this, SelectableShape);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(SelectableShape).call(this, player));
	    _this.$parent = _this.$player.find('.vac-video-cover-canvas');

	    _this.bindEvents();

	    _this.dragging = false;
	    return _this;
	  } // Bind all needed events for drag action


	  _createClass(SelectableShape, [{
	    key: "bindEvents",
	    value: function bindEvents() {
	      var _this2 = this;

	      // On mousedown initialize drag
	      this.$parent.on('mousedown.vac-selectable-shape', function (e) {
	        // Check a few conditions to see if we should *not* start drag
	        if (!$(e.target).hasClass('vac-video-cover-canvas')) return; //didn't click on overlay

	        if ($(e.target).hasClass('vac-shape')) return; //user clicked on annotation
	        // Remove old shape if one existed

	        if (_this2.$el) _this2.$el.remove(); // Define default starting shape (just x/y coords of where user clicked no width/height yet)

	        var shape = {
	          x1: _this2.xCoordToPercent(e.pageX),
	          y1: _this2.YCoordToPercent(e.pageY)
	        };
	        shape.x2 = shape.x1;
	        shape.y2 = shape.y2;
	        _this2.shape = shape; // Save origin points for future use

	        _this2.originX = shape.x1;
	        _this2.originY = shape.y1; // Draw shape and start drag state

	        _this2.render();

	        _this2.dragging = true;
	        _this2.dragMoved = false; // used to determine if user actually dragged or just clicked
	        // Bind event on doc mousemove to track drag, throttled to once each 100ms

	        $(document).on("mousemove.vac-sshape-".concat(_this2.playerId), Utils.throttle(_this2.onDrag.bind(_this2), 100)); // Add drag class to cursor tooltip if available

	        if (!_this2.plugin.options.showControls) {
	          _this2.$player.find('.vac-cursor-tool-tip').addClass('vac-cursor-dragging');
	        }
	      }); // On mouseup, if during drag cancel drag event listeners

	      $(document).on("mouseup.vac-sshape-".concat(this.playerId), function (e) {
	        if (!_this2.dragging) return;
	        $(document).off("mousemove.vac-sshape-".concat(_this2.playerId));

	        if (!_this2.dragMoved) {
	          //clear shape if it's just a click (and not a drag)
	          _this2.shape = null;
	          if (_this2.$el) _this2.$el.remove();
	        }

	        _this2.dragging = false; // Remove drag class from cursor tooltip if available

	        if (!_this2.plugin.options.showControls) {
	          _this2.$player.find('.vac-cursor-tool-tip').removeClass('vac-cursor-dragging');
	        }
	      });
	    } // On each interation of drag action (mouse movement), recalc position and redraw shape

	  }, {
	    key: "onDrag",
	    value: function onDrag(e) {
	      this.dragMoved = true;
	      var xPer = this.xCoordToPercent(e.pageX),
	          yPer = this.YCoordToPercent(e.pageY);

	      if (xPer < this.originX) {
	        this.shape.x2 = this.originX;
	        this.shape.x1 = Math.max(0, xPer);
	      } else {
	        this.shape.x2 = Math.min(100, xPer);
	        this.shape.x1 = this.originX;
	      }

	      if (yPer < this.originY) {
	        this.shape.y2 = this.originY;
	        this.shape.y1 = Math.max(0, yPer);
	      } else {
	        this.shape.y2 = Math.min(100, yPer);
	        this.shape.y1 = this.originY;
	      }

	      this.setDimsFromShape();
	      this.plugin.fire('addingAnnotationDataChanged', {
	        shape: this.shape
	      });
	    } // Convert pixel-based x position (relative to document) to percentage in video

	  }, {
	    key: "xCoordToPercent",
	    value: function xCoordToPercent(x) {
	      x = x - this.$parent.offset().left; //pixel position

	      var max = this.$parent.innerWidth();
	      return Number((x / max * 100).toFixed(2)); //round to 2 decimal places
	    } // Convert pixel-based y position (relative to document) to percentage in video

	  }, {
	    key: "YCoordToPercent",
	    value: function YCoordToPercent(y) {
	      y = y - this.$parent.offset().top; //pixel position

	      var max = this.$parent.innerHeight();
	      return Number((y / max * 100).toFixed(2)); //round to 2 decimal places
	    } // Unbind events and remove element

	  }, {
	    key: "teardown",
	    value: function teardown() {
	      this.$parent.off('mousedown.vac-selectable-shape');
	      $(document).off("mouseup.vac-sshape-".concat(this.playerId, " mousemove.vac-sshape-").concat(this.playerId));

	      _get(_getPrototypeOf(SelectableShape.prototype), "teardown", this).call(this);
	    }
	  }]);

	  return SelectableShape;
	}(Shape);

	var Template$3 = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
	    return "<b></b>\n<i class=\"vac-player-icon\">\n	<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\">\n	    <path d=\"M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z\"/>\n	    <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n	</svg>\n</i>";
	},"useData":true});
	function PlayerButtonTemplate(data, options, asString) {
	  var html = Template$3(data, options);
	  return (asString || true) ? html : $(html);
	}

	var PlayerButton =
	/*#__PURE__*/
	function (_PlayerUIComponent) {
	  _inherits(PlayerButton, _PlayerUIComponent);

	  function PlayerButton(player) {
	    var _this;

	    _classCallCheck(this, PlayerButton);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(PlayerButton).call(this, player));

	    _this.render();

	    _this.initAPI(_assertThisInitialized(_this), 'PlayerButton');

	    _this.$el.on('click.vac-player-button', function () {
	      _this.plugin.toggleAnnotationMode();
	    });

	    return _this;
	  } // Add button to player


	  _createClass(PlayerButton, [{
	    key: "render",
	    value: function render() {
	      var btn = this.player.getChild('controlBar').addChild('button', {});
	      btn.controlText('Toggle Animations');
	      this.$el = $(btn.el());
	      this.$el.addClass('vac-player-btn').find('.vjs-icon-placeholder').html(PlayerButtonTemplate());
	    } // Update the number of annotations displayed in the bubble

	  }, {
	    key: "updateNumAnnotations",
	    value: function updateNumAnnotations() {
	      var num = this.plugin.annotationState.annotations.length,
	          $bubble = this.$el.find('b');
	      $bubble.text(num);
	      num > 0 ? $bubble.removeClass(this.UI_CLASSES.hidden) : $bubble.addClass(this.UI_CLASSES.hidden);
	    } // Unbind event listeners on teardown and remove DOM nodes

	  }, {
	    key: "teardown",
	    value: function teardown() {
	      this.$el.off('click.vac-player-button');

	      _get(_getPrototypeOf(PlayerButton.prototype), "teardown", this).call(this);
	    }
	  }]);

	  return PlayerButton;
	}(PlayerUIComponent);

	var Template$4 = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, helper, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", alias5=container.escapeExpression;

	  return "<div class=\"vac-comment\" data-id=\""
	    + alias5(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"id","hash":{},"data":data}) : helper)))
	    + "\">\n  <div class=\"vac-comment-header\">\n    <div class=\"vac-author-name\">"
	    + alias5(container.lambda(((stack1 = (depth0 != null ? depth0.meta : depth0)) != null ? stack1.user_name : stack1), depth0))
	    + "</div>\n    <div class=\"vac-timestamp\">"
	    + alias5(((helper = (helper = helpers.timeSince || (depth0 != null ? depth0.timeSince : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"timeSince","hash":{},"data":data}) : helper)))
	    + "\n      <span class=\"vac-delete-comment\">&nbsp;&nbsp;X</span>\n    </div>\n  </div>\n  <div class=\"vac-comment-body\">\n    "
	    + alias5((helpers.breaklines||(depth0 && depth0.breaklines)||alias3).call(alias2,(depth0 != null ? depth0.body : depth0),{"name":"breaklines","hash":{},"data":data}))
	    + "\n  </div>\n</div>\n";
	},"useData":true});
	function CommentTemplate(data, options, asString) {
	  var html = Template$4(data, options);
	  return (asString || true) ? html : $(html);
	}

	var Comment =
	/*#__PURE__*/
	function (_PlayerUIComponent) {
	  _inherits(Comment, _PlayerUIComponent);

	  function Comment(data, player) {
	    var _this;

	    _classCallCheck(this, Comment);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(Comment).call(this, player));
	    _this.commentList = data.commentList;
	    _this.id = data.id || _this.componentId;
	    _this.meta = data.meta;
	    _this.body = data.body;
	    _this.timestamp = moment(data.meta.datetime).unix();
	    _this.timeSince = _this.timeSince();
	    _this.$el = $(_this.render());
	    return _this;
	  } // Serialize data


	  _createClass(Comment, [{
	    key: "render",
	    value: function render() {
	      return CommentTemplate({
	        id: this.id,
	        body: this.body,
	        meta: this.meta,
	        timeSince: this.timeSince
	      });
	    } // Return time since comment timestamp

	  }, {
	    key: "timeSince",
	    value: function timeSince() {
	      return moment(this.meta.datetime).fromNow();
	    }
	  }, {
	    key: "teardown",
	    value: function teardown() {
	      var destroy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	      _get(_getPrototypeOf(Comment.prototype), "teardown", this).call(this, destroy);
	    } // Return a Comment obj given body content and plugin reference

	  }, {
	    key: "data",
	    get: function get() {
	      return {
	        id: this.id,
	        meta: this.meta,
	        body: this.body
	      };
	    }
	  }, {
	    key: "HTML",
	    get: function get() {
	      return this.$el[0].outerHTML;
	    }
	  }], [{
	    key: "newFromData",
	    value: function newFromData(body, commentList, plugin) {
	      var data = this.dataObj(body, plugin);
	      return new Comment(data, plugin.player);
	    } // Return an object with plugin data, timestamp, unique id, and body content

	  }, {
	    key: "dataObj",
	    value: function dataObj(body, plugin) {
	      return {
	        meta: Object.assign({
	          datetime: moment().toISOString()
	        }, plugin.meta),
	        id: Utils.guid(),
	        body: body
	      };
	    }
	  }]);

	  return Comment;
	}(PlayerUIComponent);

	var Template$5 = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "      "
	    + ((stack1 = container.lambda(blockParams[0][0], depth0)) != null ? stack1 : "")
	    + "\n";
	},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, helper, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {});

	  return "<div class=\"vac-comments-container\">\n  <div class=\"vac-comments-wrap\">\n"
	    + ((stack1 = helpers.each.call(alias2,(depth0 != null ? depth0.commentsHTML : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "    <div class=\"vac-reply-btn vac-button\">ADD REPLY</div>\n    <div class=\"vac-add-new-shapebox\"></div>\n  </div>\n  <div class=\"vac-comments-control-bar\">\n    <div class=\"vac-range\"><b>@</b> "
	    + container.escapeExpression(((helper = (helper = helpers.rangeStr || (depth0 != null ? depth0.rangeStr : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"rangeStr","hash":{},"data":data,"blockParams":blockParams}) : helper)))
	    + "</div>\n    <div class=\"vac-control-buttons\">\n      <a class=\"vac-delete-annotation\">DELETE</a> | <a class=\"vac-close-comment-list\">CLOSE</a>\n    </div>\n  </div>\n</div>\n";
	},"useData":true,"useBlockParams":true});
	function CommentListTemplate(data, options, asString) {
	  var html = Template$5(data, options);
	  return (asString || true) ? html : $(html);
	}

	var Template$6 = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
	    var helper, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", alias5=container.escapeExpression;

	  return "<div class=\"vac-video-write-new-wrap vac-new-comment\">\n  <div class=\"vac-video-write-new vac-is-comment\">\n    <div class=\"vac-comment-showbox\" style=\"width:"
	    + alias5(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"width","hash":{},"data":data}) : helper)))
	    + "px;top:"
	    + alias5(((helper = (helper = helpers.top || (depth0 != null ? depth0.top : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"top","hash":{},"data":data}) : helper)))
	    + "px;right:"
	    + alias5(((helper = (helper = helpers.right || (depth0 != null ? depth0.right : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"right","hash":{},"data":data}) : helper)))
	    + "px\">\n      <textarea placeholder=\"Enter comment...\"></textarea>\n      <div>\n        <button class=\"vac-button\">SAVE</button>\n        <a>Cancel</a>\n      </div>\n    </div>\n</div>\n";
	},"useData":true});
	function NewCommentTemplate(data, options, asString) {
	  var html = Template$6(data, options);
	  return (asString || true) ? html : $(html);
	}

	var CommentList =
	/*#__PURE__*/
	function (_PlayerUIComponent) {
	  _inherits(CommentList, _PlayerUIComponent);

	  function CommentList(data, player) {
	    var _this;

	    _classCallCheck(this, CommentList);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(CommentList).call(this, player));
	    _this.annotation = data.annotation;
	    _this.comments = data.comments.map(function (commentData) {
	      commentData.commentList = _assertThisInitialized(_this);
	      return new Comment(commentData, player);
	    });

	    _this.sortComments();

	    return _this;
	  } // Serialize object


	  _createClass(CommentList, [{
	    key: "bindListEvents",
	    // Bind all events needed for the comment list
	    value: function bindListEvents() {
	      var _this2 = this;

	      this.$el.on('click.vac-comment', '.vac-close-comment-list', function () {
	        return _this2.annotation.close();
	      }.bind(this)) // Hide CommentList UI with close button
	      .on('click.vac-comment', '.vac-reply-btn', this.addNewComment.bind(this)) // Open new reply UI with reply button
	      .on('click.vac-comment', '.vac-delete-annotation', this.handleDeleteAnnotationClick.bind(this)) // Delete annotation with main delete button
	      .on('click.vac-comment', '.vac-delete-comment', this.destroyComment.bind(this)) // Delete comment with delete comment button
	      .on('mousewheel.vac-comment DOMMouseScroll.vac-comment', '.vac-comments-wrap', this.disablePageScroll.bind(this)); // Prevent outer page scroll when scrolling inside of the CommentList UI
	    } // Bind event listeners for new comments form

	  }, {
	    key: "bindCommentFormEvents",
	    value: function bindCommentFormEvents() {
	      this.$newCommentForm.on('click.vac-comment', '.vac-add-controls a, .vac-video-write-new.vac-is-comment a', this.closeNewComment.bind(this)) // Cancel new comment creation with cancel link
	      .on('click.vac-comment', '.vac-video-write-new.vac-is-comment button', this.saveNewComment.bind(this)); // Save new comment with save button
	    } // Render CommentList UI with all comments using template

	  }, {
	    key: "render",
	    value: function render() {
	      this.$el = $(CommentListTemplate({
	        commentsHTML: this.comments.map(function (c) {
	          return c.HTML;
	        }),
	        rangeStr: Utils.humanTime(this.annotation.range)
	      }));
	      this.$player.append(this.$el);
	      this.$wrap = this.$UI.commentsContainer;
	      this.bindListEvents();
	    } // Re-render UI on state change

	  }, {
	    key: "reRender",
	    value: function reRender() {
	      this.teardown(false);
	      this.render();
	    } // Render new comment form

	  }, {
	    key: "addNewComment",
	    value: function addNewComment() {
	      this.$wrap.addClass(this.UI_CLASSES.active).find('.vac-comments-wrap').scrollTop(999999);
	      var $shapebox = this.$wrap.find('.vac-add-new-shapebox'),
	          width = $shapebox.outerWidth(),
	          top = $shapebox.position().top + 10,
	          right = this.$wrap.outerWidth() - ($shapebox.position().left + width);
	      this.$newCommentForm = $(NewCommentTemplate({
	        width: width,
	        top: top,
	        right: right
	      }));
	      this.bindCommentFormEvents();
	      this.$player.append(this.$newCommentForm);
	    } // Save comment from new comment form, update state and re-render UI

	  }, {
	    key: "saveNewComment",
	    value: function saveNewComment() {
	      this.$wrap.removeClass(this.UI_CLASSES.active);
	      var body = this.$UI.newCommentTextarea.val();
	      if (!body) return; // empty comment - TODO add validation / err message

	      this.createComment(body);
	    }
	  }, {
	    key: "createComment",
	    value: function createComment(body) {
	      var comment = Comment.newFromData(body, this, this.plugin);
	      this.comments.push(comment);
	      this.sortComments(); // Don't mutate UI if comment is being created for an inactive annotation (via API)

	      if (this.annotation.isActive) {
	        this.reRender(false);
	        this.closeNewComment();
	      }

	      this.plugin.annotationState.stateChanged();
	    } // Cancel comment adding process

	  }, {
	    key: "closeNewComment",
	    value: function closeNewComment() {
	      this.unbindCommentFormEvents();
	      if (this.$wrap) this.$wrap.removeClass(this.UI_CLASSES.active);
	      if (this.$newCommentForm) this.$newCommentForm.remove();
	    } // Delete a comment. If it is the only comment, delete the annotation
	    // Update state and re-render UI

	  }, {
	    key: "destroyComment",
	    value: function destroyComment(event) {
	      var annotationId = this.annotation.id;

	      if (this.comments.length == 1) {
	        this.annotation.teardown();
	      } else {
	        var commentId = this.findCommentId(event),
	            comment = this.comments.find(function (c) {
	          return c.id == commentId;
	        }),
	            i = this.comments.indexOf(comment);
	        this.comments.splice(i, 1);
	        this.reRender();
	      }

	      this.plugin.annotationState.stateChanged();
	    }
	  }, {
	    key: "findCommentId",
	    value: function findCommentId(event) {
	      var id = typeof event.detail.id === 'undefined' ? $(event.target).closest('.vac-comment').data('id') : event.detail.id;
	      return id;
	    } // Prevents outer page scroll when at the top or bottom of CommentList UI
	    // TODO: This might need to be fine-tuned?

	  }, {
	    key: "disablePageScroll",
	    value: function disablePageScroll(event) {
	      var $target = $(event.currentTarget),
	          height = $target.height(),
	          ogEvent = event.originalEvent,
	          delta = ogEvent.wheelDelta || -ogEvent.detail,
	          dir = delta < 0 ? 'down' : 'up',
	          scrollDiff = Math.abs(event.currentTarget.scrollHeight - event.currentTarget.clientHeight); // if scrolling into top of div

	      if ($target.scrollTop() < 20 && dir == 'up') {
	        $target.stop();
	        $target.animate({
	          scrollTop: 0
	        }, 100);
	        event.preventDefault();
	      } // if scrolling into bottom of div


	      if ($target.scrollTop() > scrollDiff - 10 && dir == 'down') {
	        $target.stop();
	        $target.animate({
	          scrollTop: height + 40
	        }, 100);
	        event.preventDefault();
	      }
	    } // Sort comments by timestamp

	  }, {
	    key: "sortComments",
	    value: function sortComments() {
	      this.comments.sort(function (a, b) {
	        return a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0;
	      });
	    } // Delete the annotation

	  }, {
	    key: "handleDeleteAnnotationClick",
	    value: function handleDeleteAnnotationClick(e) {
	      var _this3 = this;

	      var $confirmEl = $('<a/>').addClass('vac-delete-confirm').text('CONFIRM');
	      $confirmEl.on('click.comment', function () {
	        $confirmEl.off('click.comment');

	        _this3.annotation.teardown();
	      });
	      $(e.target).replaceWith($confirmEl);
	    } // Unbind listeners for new comments form

	  }, {
	    key: "unbindCommentFormEvents",
	    value: function unbindCommentFormEvents() {
	      if (this.$newCommentForm) this.$newCommentForm.off('click.vac-comment');
	    } // Teardown CommentList UI, unbind events

	  }, {
	    key: "teardown",
	    value: function teardown() {
	      var destroyComments = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	      if (this.$el) {
	        this.$el.off('click.vac-comment mousewheel.vac-comment DOMMouseScroll.vac-comment');
	      }

	      this.comments.forEach(function (c) {
	        return c.teardown(destroyComments);
	      });
	      if (destroyComments) this.comments = [];

	      _get(_getPrototypeOf(CommentList.prototype), "teardown", this).call(this);
	    }
	  }, {
	    key: "data",
	    get: function get() {
	      return this.comments.map(function (c) {
	        return c.data;
	      });
	    }
	  }]);

	  return CommentList;
	}(PlayerUIComponent);

	var Annotation =
	/*#__PURE__*/
	function (_PlayerUIComponent) {
	  _inherits(Annotation, _PlayerUIComponent);

	  function Annotation(data, player) {
	    var _this;

	    _classCallCheck(this, Annotation);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(Annotation).call(this, player));
	    _this.id = data.id || _this.componentId;
	    _this.range = data.range;
	    _this.shape = data.shape;
	    _this.secondsActive = _this.buildSecondsActiveArray();

	    _this.buildComments(data);

	    _this.buildMarker();

	    _this.buildShape();

	    _this.bindEvents();

	    _this.isOpen = false;
	    return _this;
	  }

	  _createClass(Annotation, [{
	    key: "buildComments",
	    value: function buildComments(data) {
	      this.commentList = new CommentList({
	        comments: data.comments,
	        annotation: this
	      }, this.player);
	    }
	  }, {
	    key: "buildMarker",
	    value: function buildMarker() {
	      this.marker = new Marker(this.player, this.range, this.commentList.comments[0]);
	      this.marker.render();
	    }
	  }, {
	    key: "buildShape",
	    value: function buildShape() {
	      this.annotationShape = new Shape(this.player, this.shape);
	    } // Serialize object

	  }, {
	    key: "bindEvents",
	    value: function bindEvents() {
	      var _this2 = this;

	      this.marker.$el.on('click.vac-marker', function (e) {
	        return _this2.plugin.annotationState.openAnnotation(_this2, true);
	      });
	    } // Opens the annotation. Handles marker, commentList, shape, Annotation state, and player state

	  }, {
	    key: "open",
	    value: function open() {
	      var _this3 = this;

	      var withPause = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	      var previewOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	      var forceSnapToStart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	      this.isOpen = true;
	      var snapToStart = forceSnapToStart || !Utils.isWithinRange(this.range.start, this.range.end, Math.floor(this.currentTime));
	      var showTooltip = previewOnly && this.plugin.options.showMarkerShapeAndTooltips;
	      this.marker.setActive(showTooltip);

	      if (!previewOnly && this.plugin.options.showCommentList) {
	        this.commentList.render();
	      }

	      if (!previewOnly || previewOnly && this.plugin.options.showMarkerShapeAndTooltips) {
	        this.annotationShape.render();

	        if (this.shape) {
	          this.annotationShape.$el.on('click.vac-annotation', function () {
	            _this3.plugin.annotationState.openAnnotation(_this3, false, false, false);
	          });
	        }
	      }

	      if (withPause) this.player.pause();
	      if (snapToStart) this.currentTime = this.range.start;
	      this.plugin.fire('annotationOpened', {
	        annotation: this.data,
	        triggered_by_timeline: previewOnly
	      });
	    } // Closes the annotation. Handles marker, commendList, shape, and AnnotationState

	  }, {
	    key: "close",
	    value: function close() {
	      var clearActive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	      if (!this.isOpen) return;
	      this.isOpen = false;
	      this.marker.deactivate();
	      this.commentList.teardown(false);
	      if (this.annotationShape.$el) this.annotationShape.$el.off('click.vac-annotation');
	      this.annotationShape.teardown();
	      if (clearActive) this.plugin.annotationState.clearActive();
	      this.plugin.fire('annotationClosed', this.data);
	    } // For preloading an array of seconds active on initialization
	    // Values used to build timeMap in AnnotationState

	  }, {
	    key: "buildSecondsActiveArray",
	    value: function buildSecondsActiveArray() {
	      var seconds = [];

	      if (!!this.range.end) {
	        for (var i = this.range.start; i <= this.range.end; i++) {
	          seconds.push(i);
	        }
	      } else {
	        var start = this.range.start;
	        seconds.push(start);
	        if (start < this.duration) seconds.push(start + 1);
	      }

	      return seconds;
	    } // Tearsdown annotation and marker, removes object from AnnotationState

	  }, {
	    key: "teardown",
	    value: function teardown() {
	      var removeFromCollection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	      this.close(true);
	      this.marker.teardown();
	      if (this.commentList) this.commentList.teardown(removeFromCollection);
	      if (removeFromCollection) this.plugin.annotationState.removeAnnotation(this);
	      if (this.annotationShape) this.annotationShape.teardown();
	      if (removeFromCollection) _get(_getPrototypeOf(Annotation.prototype), "teardown", this).call(this);
	    } // Build a new annotation instance by passing in data for range, shape, comment, & plugin ref

	  }, {
	    key: "data",
	    get: function get() {
	      return {
	        id: this.id,
	        range: this.range,
	        shape: this.shape,
	        comments: this.commentList.data
	      };
	    }
	  }, {
	    key: "isActive",
	    get: function get() {
	      return this.plugin.annotationState.activeAnnotation === this;
	    }
	  }], [{
	    key: "newFromData",
	    value: function newFromData(range, shape, commentStr, plugin) {
	      var id = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
	      var comment = Comment.dataObj(commentStr, plugin);
	      if (range) range = Utils.parseIntObj(range);
	      if (shape) shape = Utils.parseIntObj(shape);
	      var data = {
	        id: id,
	        range: range,
	        shape: shape,
	        comments: [comment]
	      };
	      return new Annotation(data, plugin.player);
	    }
	  }]);

	  return Annotation;
	}(PlayerUIComponent);

	var Template$7 = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.propertyIsEnumerable;

	  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.showControls : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
	},"2":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.propertyIsEnumerable;

	  return "        <div class=\"vac-controls vac-control\">\n            <button class=\"vac-button\">+ NEW</button>\n"
	    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.showNav : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
	    + "        </div>\n";
	},"3":function(container,depth0,helpers,partials,data) {
	    return "                <div class=\"vac-annotation-nav\">\n                    <div class=\"vac-a-prev\">Prev</div>\n                    <div class=\"vac-a-next\">Next</div>\n                </div>\n";
	},"5":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {});

	  return "    <div class=\"vac-video-cover vac-control\">\n        <div class=\"vac-video-cover-canvas\">\n            <div class=\"vac-cursor-tool-tip vac-hidden\">Click and drag to select</div>\n        </div>\n    </div>\n"
	    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.showControls : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
	    + "\n"
	    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.writingComment : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
	},"6":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.propertyIsEnumerable;

	  return "        <div class=\"vac-add-controls vac-control\">\n            <i>Select shape + range</i>\n"
	    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.internalCommenting : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
	    + "            <div class=\"vac-video-move\">\n                <div class=\"vac-a-prev\">-1 sec</div>\n                <div class=\"vac-a-next\">+1 sec</div>\n            </div>\n        </div>\n";
	},"7":function(container,depth0,helpers,partials,data) {
	    return "                <button class=\"vac-button\">CONTINUE</button>\n                <a>cancel</a>\n";
	},"9":function(container,depth0,helpers,partials,data) {
	    var helper, alias1=container.propertyIsEnumerable;

	  return "        <div class=\"vac-video-write-new-wrap vac-control\">\n            <div class=\"vac-video-write-new vac-is-annotation\">\n                <div>\n                    <h5><b>New Annotation</b> @ "
	    + container.escapeExpression(((helper = (helper = helpers.rangeStr || (depth0 != null ? depth0.rangeStr : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"rangeStr","hash":{},"data":data}) : helper)))
	    + "</h5>\n                    <div class=\"vac-comment-showbox\">\n                        <textarea placeholder=\"Enter comment...\"></textarea>\n                        <div>\n                            <button class=\"vac-button\">SAVE</button>\n                            <a>Cancel</a>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n";
	},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {});

	  return ((stack1 = helpers.unless.call(alias2,(depth0 != null ? depth0.adding : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
	    + "\n"
	    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.adding : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
	},"useData":true});
	function ControlsTemplate(data, options, asString) {
	  var html = Template$7(data, options);
	  return (asString || true) ? html : $(html);
	}

	// default value for each item in the state

	var BASE_UI_STATE = Object.freeze({
	  adding: false,
	  // Are we currently adding a new annotation? (step 1 of flow)
	  writingComment: false // Are we currently writing the comment for annotation (step 2 of flow)

	});

	var Controls =
	/*#__PURE__*/
	function (_PlayerUIComponent) {
	  _inherits(Controls, _PlayerUIComponent);

	  function Controls(player, bindArrowKeys) {
	    var _this;

	    _classCallCheck(this, Controls);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(Controls).call(this, player));

	    _this.initAPI(_assertThisInitialized(_this), 'Controls');

	    _this.internalCommenting = _this.plugin.options.internalCommenting;
	    _this.showControls = _this.plugin.options.showControls;
	    _this.uiState = Utils.cloneObject(BASE_UI_STATE);

	    _this.bindEvents(bindArrowKeys);

	    if (_this.showControls) {
	      // create player button in the control bar if controls are shown
	      _this.playerButton = new PlayerButton(_this.player);
	    }

	    _this.render();

	    return _this;
	  } // Bind all the events we need for UI interaction


	  _createClass(Controls, [{
	    key: "bindEvents",
	    value: function bindEvents(bindArrowKeys) {
	      var _this2 = this;

	      this.$player.on('click.vac-controls', '.vac-controls button', this.startAddNew.bind(this)) // Add new button click
	      .on('click.vac-controls', '.vac-annotation-nav .vac-a-next', function () {
	        return _this2.plugin.annotationState.nextAnnotation();
	      }) // Click 'next' on annotation nav
	      .on('click.vac-controls', '.vac-annotation-nav .vac-a-prev', function () {
	        return _this2.plugin.annotationState.prevAnnotation();
	      }) // Click 'prev' on annotation nav
	      .on('click.vac-controls', '.vac-video-move .vac-a-next', function () {
	        return _this2.marker.scrubStart(1);
	      }) // Click '+1 sec' on marker nav
	      .on('click.vac-controls', '.vac-video-move .vac-a-prev', function () {
	        return _this2.marker.scrubStart(-1);
	      }); // Click '-1 sec' on marker nav

	      if (this.internalCommenting) {
	        this.$player.on('click.vac-controls', '.vac-add-controls button', this.writeComment.bind(this)) // 'Next' button click while adding
	        .on('click.vac-controls', '.vac-video-write-new.vac-is-annotation button', this.saveNew.bind(this)) // 'Save' button click while adding
	        .on('click.vac-controls', '.vac-add-controls a, .vac-video-write-new.vac-is-annotation a', this.cancelAddNew.bind(this)); // Cancel link click
	      }

	      if (bindArrowKeys) {
	        $(document).on("keyup.vac-nav-".concat(this.playerId), function (e) {
	          return _this2.handleArrowKeys(e);
	        }); // Use arrow keys to navigate annotations
	      }
	    } // Remove UI and unbind events for this and child components

	  }, {
	    key: "teardown",
	    value: function teardown() {
	      this.clear(true);
	      this.$player.off('click.vac-controls');
	      $(document).off("keyup.vac-nav-".concat(this.playerId, " mousemove.vac-tooltip-").concat(this.playerId));
	      if (this.playerButton) this.playerButton.teardown();

	      _get(_getPrototypeOf(Controls.prototype), "teardown", this).call(this);
	    } // Clear existing UI (resetting components if need be)

	  }, {
	    key: "clear",
	    value: function clear() {
	      var reset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	      if (reset) {
	        if (this.uiState.adding) {
	          this.restoreNormalUI();
	          this.marker.teardown();
	          this.selectableShape.teardown();
	        }

	        this.uiState = Utils.cloneObject(BASE_UI_STATE);
	        this.$player.find('.vac-video-cover-canvas').off('mousedown.vac-cursor-tooltip').off('mouseup.vac-cursor-tooltip');
	      }

	      this.$tooltip_ = null;
	      this.$UI.controlElements.remove();
	    } // Render the UI elements (based on uiState)

	  }, {
	    key: "render",
	    value: function render() {
	      var reset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	      this.clear(reset);
	      var data = Object.assign({
	        rangeStr: this.marker ? Utils.humanTime(this.marker.range) : null,
	        showNav: this.plugin.annotationState.annotations.length > 1
	      }, this.uiState, {
	        internalCommenting: this.internalCommenting,
	        showControls: this.showControls
	      });
	      var $ctrls = ControlsTemplate(data);
	      this.$player.append($ctrls);
	      if (this.playerButton) this.playerButton.updateNumAnnotations();
	    } // User clicked to cancel in-progress add - restore to normal state

	  }, {
	    key: "cancelAddNew",
	    value: function cancelAddNew() {
	      if (!(this.uiState.adding || this.uiState.writingComment)) return;
	      this.render(true);
	      this.marker.teardown();
	      this.marker = null;
	    } // User clicked 'add' button in the controls - setup UI and marker

	  }, {
	    key: "startAddNew",
	    value: function startAddNew() {
	      if (!this.plugin.active) this.plugin.toggleAnnotationMode();
	      this.player.pause();
	      this.setAddingUI();
	      this.uiState.adding = true;
	      this.render(); // construct new range and create marker

	      var range = {
	        start: parseInt(this.currentTime, 10),
	        stop: parseInt(this.currentTime, 10)
	      };
	      this.marker = new DraggableMarker(this.player, range);
	      this.selectableShape = new SelectableShape(this.player); // show cursor help text if controls are hidden

	      if (!this.showControls) this.bindCursorTooltip();
	      this.plugin.fire('enteredAddingAnnotation', {
	        range: range
	      });
	    } // User clicked 'next' action - show UI to write comment

	  }, {
	    key: "writeComment",
	    value: function writeComment() {
	      this.uiState.writingComment = true;
	      this.render();
	    } // User clicked to save a new annotation/comment during add new flow

	  }, {
	    key: "saveNew",
	    value: function saveNew() {
	      var comment = this.$UI.newCommentTextarea.val();
	      if (!comment) return; // empty comment - TODO add validation / err message

	      var a = Annotation.newFromData(this.marker.range, this.selectableShape.shape, comment, this.plugin);
	      this.plugin.annotationState.addNewAnnotation(a);
	      this.cancelAddNew();
	    } // Change normal UI (hide markers, hide playback, etc) on init add state

	  }, {
	    key: "setAddingUI",
	    value: function setAddingUI() {
	      this.plugin.annotationState.enabled = false;
	      this.disablePlayingAndControl();
	    } // Restore normal UI after add state

	  }, {
	    key: "restoreNormalUI",
	    value: function restoreNormalUI() {
	      this.plugin.annotationState.enabled = this.plugin.active;
	      this.enablePlayingAndControl();
	      $(document).off("mousemove.vac-tooltip-".concat(this.playerId));
	    } // On arrow key press, navigate to next or prev Annotation

	  }, {
	    key: "handleArrowKeys",
	    value: function handleArrowKeys(e) {
	      if (!this.plugin.active) return;
	      var keyId = e.which;
	      if (keyId == 37) this.plugin.annotationState.prevAnnotation();
	      if (keyId == 39) this.plugin.annotationState.nextAnnotation();
	    } // Adds help text to cursor during annotation mode

	  }, {
	    key: "bindCursorTooltip",
	    value: function bindCursorTooltip() {
	      var _this3 = this;

	      this.tooltipArea = Utils.areaOfHiddenEl(this.$tooltip, this.$UI.coverCanvas, this.UI_CLASSES.hidden); // Assert bounds are updated in plugin in case page was modified since creation, so tooltip math is correct

	      this.plugin.setBounds(false);
	      $(document).on("mousemove.vac-tooltip-".concat(this.playerId), Utils.throttle(function (event) {
	        if (!_this3.plugin.bounds) return;

	        var x = event.pageX,
	            y = event.pageY,
	            outOfBounds = x < _this3.plugin.bounds.left || x > _this3.plugin.bounds.right || y < _this3.plugin.bounds.top || y > _this3.plugin.bounds.bottom,
	            withinControls = !outOfBounds && y >= _this3.plugin.bounds.bottomWithoutControls,
	            markerHovered = _this3.$tooltip.hasClass('vac-marker-hover');

	        if (outOfBounds) {
	          _this3.$tooltip.addClass(_this3.UI_CLASSES.hidden);

	          return;
	        }

	        var cursorX = x - _this3.plugin.bounds.left,
	            cursorY = y - _this3.plugin.bounds.top,
	            margin = 10,
	            rightEdge = _this3.$player.width(),
	            bottomEdge = _this3.$player.height() - _this3.$UI.controlBar.height(),
	            atRightEdge = cursorX + _this3.tooltipArea.width + margin * 2 >= rightEdge,
	            atBottomEdge = cursorY + _this3.tooltipArea.height + margin * 2 >= bottomEdge; // is the tooltip too close to the right or bottom edge?


	        var posX = atRightEdge ? rightEdge - _this3.tooltipArea.width - margin : cursorX + margin,
	            posY = atBottomEdge ? bottomEdge - _this3.tooltipArea.height - margin : cursorY + margin; // hide if the cursor is over the control bar but not hovering over the draggable marker
	        // also hide if mouse is down

	        if (withinControls && !markerHovered || _this3.$tooltip.hasClass('vac-cursor-dragging')) {
	          _this3.$tooltip.addClass(_this3.UI_CLASSES.hidden);
	        } else {
	          _this3.$tooltip.removeClass(_this3.UI_CLASSES.hidden);
	        }

	        _this3.$tooltip.css({
	          left: "".concat(posX, "px"),
	          top: "".concat(posY, "px")
	        });
	      }.bind(this), 50));
	    }
	  }, {
	    key: "$tooltip",
	    get: function get() {
	      this.$tooltip_ = this.$tooltip_ || this.$player.find('.vac-cursor-tool-tip');
	      return this.$tooltip_;
	    }
	  }]);

	  return Controls;
	}(PlayerUIComponent);

	var AnnotationState =
	/*#__PURE__*/
	function (_PlayerComponent) {
	  _inherits(AnnotationState, _PlayerComponent);

	  function AnnotationState(player) {
	    var _this;

	    _classCallCheck(this, AnnotationState);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(AnnotationState).call(this, player));

	    _this.initAPI(_assertThisInitialized(_this), 'AnnotationState');

	    _this.resetData();

	    _this.bindEvents();

	    return _this;
	  } // sets _enabled and closes or opens annotation as needed


	  _createClass(AnnotationState, [{
	    key: "bindEvents",
	    // Bind events for setting liveAnnotation on video time change
	    value: function bindEvents() {
	      this.player.on('timeupdate', Utils.throttle(this.setLiveAnnotation.bind(this), 100));
	    } // Sort annotations by range.start

	  }, {
	    key: "sortAnnotations",
	    value: function sortAnnotations() {
	      this._annotations.sort(function (a, b) {
	        return a.range.start < b.range.start ? -1 : a.range.start > b.range.start ? 1 : 0;
	      });
	    } // Add a new annotation

	  }, {
	    key: "addNewAnnotation",
	    value: function addNewAnnotation(annotation) {
	      this._annotations.push(annotation);

	      this.openAnnotation(annotation, true, true, false, true);
	      this.stateChanged();
	    } // Create and add a annotation

	  }, {
	    key: "createAndAddAnnotation",
	    value: function createAndAddAnnotation(data) {
	      this.plugin.controls.uiState.adding && this.plugin.controls.cancelAddNew();
	      var annotation = Annotation.newFromData(data.range, data.shape, data.commentStr || '', this.plugin, data.id);
	      this.addNewAnnotation(annotation);
	    } // Destroy an existing annotation

	  }, {
	    key: "destroyAnnotationById",
	    value: function destroyAnnotationById(id) {
	      var annotation = this.findAnnotation(id);
	      if (annotation) annotation.teardown();
	    } // Remove an annotation

	  }, {
	    key: "removeAnnotation",
	    value: function removeAnnotation(annotation) {
	      var id = annotation.id,
	          i = this._annotations.indexOf(annotation);

	      this._annotations.splice(i, 1);

	      this.stateChanged();
	      this.plugin.fire('annotationDeleted', {
	        id: id
	      });
	    } // Set the live annotation based on current video time

	  }, {
	    key: "setLiveAnnotation",
	    value: function setLiveAnnotation() {
	      if (!this.enabled) return;
	      var time = Math.floor(this.currentTime);

	      if (this.skipLiveCheck) {
	        if (time !== this.lastVideoTime) this.skipLiveCheck = false;
	        return;
	      }

	      var matches = this.activeAnnotationsForTime(time);
	      if (!matches.length) return this.activeAnnotation.close(); // Set live annotation as the last match

	      var liveAnnotation = this.annotations[matches[matches.length - 1]]; // Special cases if this or another annotation is active

	      if (this.activeAnnotation.range) {
	        if (liveAnnotation === this.activeAnnotation) return; // Check if the active annotation and live annotation share a start time
	        // Is that start time at the current playhead?
	        // If so, don't switch which is active.

	        var liveStart = liveAnnotation.range.start,
	            activeStart = this.activeAnnotation.range.start;
	        if (liveStart === activeStart && liveStart === time) return;
	      }

	      this.openAnnotation(liveAnnotation, false, false, true);
	    } // Get all active annotations for a time (in seconds)

	  }, {
	    key: "activeAnnotationsForTime",
	    value: function activeAnnotationsForTime(time) {
	      if (!this.annotations.length) return [];
	      return this.annotationTimeMap[time] || [];
	    }
	    /*
	          Rebuild the annotation time map
	          Example: this._annotations[1] and this._annotations[3] are active during second 4
	              this.annotationTimeMap = { 4: [1, 3] }
	      */

	  }, {
	    key: "rebuildAnnotationTimeMap",
	    value: function rebuildAnnotationTimeMap() {
	      var _this2 = this;

	      var timeMap = {};
	      this.annotations.forEach(function (annotation) {
	        annotation.secondsActive.forEach(function (second) {
	          var val = timeMap[second] || [];
	          val.push(_this2.annotations.indexOf(annotation));
	          timeMap[second] = val;
	        });
	      });
	      this.annotationTimeMap = timeMap;
	    } // Close active annotation and remove reference in state

	  }, {
	    key: "clearActive",
	    value: function clearActive() {
	      this.activeAnnotation.close(false);
	      this._activeAnnotation = null;
	    } // Open annotation with options to pause and show preview
	    // skipLiveCheck will short circuit setLiveAnnotation()

	  }, {
	    key: "openAnnotation",
	    value: function openAnnotation(annotation) {
	      var skipLiveCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	      var pause = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
	      var previewOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
	      var forceSnapToStart = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
	      if (!this.plugin.active) this.plugin.toggleAnnotationMode();
	      this.skipLiveCheck = skipLiveCheck;
	      this.clearActive();
	      annotation.open(pause, previewOnly, forceSnapToStart);
	      this.activeAnnotation = annotation;
	      this.lastVideoTime = this.activeAnnotation.range.start;
	    } // Open an annotation by ID (if it exists)

	  }, {
	    key: "openAnnotationById",
	    value: function openAnnotationById(id) {
	      var annotation = this.findAnnotation(id);
	      if (annotation) this.openAnnotation(annotation);
	    } // Returns annotation object given ID

	  }, {
	    key: "findAnnotation",
	    value: function findAnnotation(id) {
	      return this.annotations.find(function (a) {
	        return a.id == id;
	      });
	    } // Returns comment object given ID

	  }, {
	    key: "findComment",
	    value: function findComment(id) {
	      var _ref;

	      var comments = this.annotations.map(function (a) {
	        return a.commentList.comments;
	      });
	      comments = (_ref = []).concat.apply(_ref, _toConsumableArray(comments)); // flatten 2d array

	      return comments.find(function (c) {
	        return c.id == id;
	      });
	    } // Finds the next annotation in collection and opens it

	  }, {
	    key: "nextAnnotation",
	    value: function nextAnnotation() {
	      if (this._activeAnnotation) {
	        var ind = this.annotations.indexOf(this._activeAnnotation),
	            nextInd = ind === this.annotations.length - 1 ? 0 : ind + 1;
	        return this.openAnnotation(this.annotations[nextInd], true);
	      }

	      var time = Math.floor(this.currentTime);

	      for (var i = 0; i < this.annotations.length; i++) {
	        if (this.annotations[i].range.start > time) return this.openAnnotation(this.annotations[i], true);
	      }

	      this.openAnnotation(this.annotations[0], true);
	    } // Finds the previous annotation in collection and opens it

	  }, {
	    key: "prevAnnotation",
	    value: function prevAnnotation() {
	      if (this._activeAnnotation) {
	        var ind = this.annotations.indexOf(this._activeAnnotation),
	            nextInd = ind === 0 ? this.annotations.length - 1 : ind - 1;
	        return this.openAnnotation(this.annotations[nextInd], true);
	      }

	      var time = Math.floor(this.currentTime);

	      for (var i = this.annotations.length - 1; i >= 0; i--) {
	        if (this.annotations[i].range.start < time) return this.openAnnotation(this.annotations[i], true);
	      }

	      this.openAnnotation(this.annotations[this.annotations.length - 1], true);
	    } // Use anywhere the annotation data changes
	    // Cleans internal state data, updates player button, triggers configurable callback

	  }, {
	    key: "stateChanged",
	    value: function stateChanged() {
	      this.sortAnnotations();
	      this.rebuildAnnotationTimeMap();
	      this.plugin.fire('onStateChanged', this.data);
	    } // Reset internal state properties

	  }, {
	    key: "resetData",
	    value: function resetData() {
	      this.annotations = [];
	      this.annotationTimeMap = {};
	      this.activeAnnotation = null;
	      this.enabled = false;
	      this.skipNextTimeCheck = false;
	      this.lastVideoTime = 0;
	    } // Remove UI and unbind events for this and child components

	  }, {
	    key: "teardown",
	    value: function teardown() {
	      this.annotations.forEach(function (annotation) {
	        annotation.teardown(false);
	      });
	      this.resetData();

	      _get(_getPrototypeOf(AnnotationState.prototype), "teardown", this).call(this);
	    }
	  }, {
	    key: "enabled",
	    set: function set(shouldBeEnabled) {
	      this._enabled = shouldBeEnabled;
	      if (!shouldBeEnabled) this.activeAnnotation.close();

	      if (shouldBeEnabled) {
	        this.skipLiveCheck = false;
	        this.setLiveAnnotation();
	      }
	    },
	    get: function get() {
	      return this._enabled;
	    } // Sets _annotations w/Annoation objects from input array

	  }, {
	    key: "annotations",
	    set: function set(annotationsData) {
	      var _this3 = this;

	      this._annotations = annotationsData.map(function (a) {
	        return new Annotation(a, _this3.player);
	      });
	      this.sortAnnotations();
	      this.rebuildAnnotationTimeMap();
	    },
	    get: function get() {
	      return this._annotations;
	    }
	  }, {
	    key: "activeAnnotation",
	    set: function set() {
	      var annotation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	      this._activeAnnotation = annotation;
	    } // Get current active annotation or a null object with .close()
	    ,
	    get: function get() {
	      return this._activeAnnotation || {
	        close: function close() {}
	      };
	    } // Serialize data

	  }, {
	    key: "data",
	    get: function get() {
	      return this._annotations.map(function (a) {
	        return a.data;
	      });
	    }
	  }]);

	  return AnnotationState;
	}(PlayerComponent);

	/*
		General logging library, checking to see if window.VAC_DEBUG is present and true to enable debugging
	*/
	// Prefix for appending to all logger messages
	var LOG_PREFIX = '::VAC::'; // Are we in debug mode?

	function debug() {
	  return !!window.VAC_DEBUG;
	} // Build arguments for console fn, adding prefix


	function buildArgs(args) {
	  return [LOG_PREFIX].concat(args);
	} // Log message/data


	var log = function log() {
	  if (!debug()) return;

	  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  console.log.apply(null, buildArgs(args));
	}; // Error message/data

	/*
	    A centralized collection of event callbacks organized by component and name
	    Main reference for external event api
	    These events will be bound to the plugin on initialization of their respective components
	    NOTE - 'self' as second param in each function is a workaround for transpiler not properly
	    keeping this , so we pass in instance to use as this for each fn - can't rely on bind
	    because this is rewritten from symbol registry in transpiler and it's not present
	*/

	var EventRegistry = {
	  AnnotationState: {
	    openAnnotation: function openAnnotation(event, _this) {
	      _this.openAnnotationById(event.detail.id);
	    },
	    closeActiveAnnotation: function closeActiveAnnotation(event, _this) {
	      _this.clearActive();
	    },
	    newAnnotation: function newAnnotation(event, _this) {
	      _this.createAndAddAnnotation(event.detail);
	    },
	    destroyAnnotation: function destroyAnnotation(event, _this) {
	      _this.destroyAnnotationById(event.detail.id);
	    },
	    newComment: function newComment(event, _this) {
	      var annotation = _this.findAnnotation(event.detail.annotationId);

	      if (annotation) annotation.commentList.createComment(event.detail.body);
	    },
	    destroyComment: function destroyComment(event, _this) {
	      var comment = _this.findComment(event.detail.id);

	      if (comment) comment.commentList.destroyComment(event);
	    }
	  },
	  Controls: {
	    addingAnnotation: function addingAnnotation(event, _this) {
	      _this.startAddNew();
	    },
	    cancelAddingAnnotation: function cancelAddingAnnotation(event, _this) {
	      _this.cancelAddNew();
	    }
	  },
	  PlayerButton: {
	    onStateChanged: function onStateChanged(event, _this) {
	      _this.updateNumAnnotations();
	    }
	  },
	  AnnotationComments: {
	    toggleAnnotationMode: function toggleAnnotationMode(event, _this) {
	      _this.toggleAnnotationMode();
	    }
	  }
	};

	var EventDispatcher =
	/*#__PURE__*/
	function () {
	  function EventDispatcher(plugin) {
	    _classCallCheck(this, EventDispatcher);

	    this.plugin = plugin;
	    this.pluginReady = false;
	    this.pendingEvts = [];
	    this.registeredListeners = [];
	    this.eventRegistry = EventRegistry;
	  } // Use the EventRegistry to mass register events on each component initialization


	  _createClass(EventDispatcher, [{
	    key: "registerListenersFor",
	    value: function registerListenersFor(obj, className) {
	      var _this2 = this;

	      var matchingEvents = this.eventRegistry[className];

	      if (matchingEvents) {
	        Object.keys(matchingEvents).forEach(function (key) {
	          // Don't register again if already in cached collection
	          if (!~_this2.registeredListeners.indexOf(key)) {
	            var callback = matchingEvents[key].bind(obj);

	            _this2.registerListener(key, function (evt) {
	              if (!_this2.pluginReady) return;

	              _this2.logCallback(key, className, evt);

	              callback(evt, obj);
	            }.bind(_this2));
	          }
	        });
	      }
	    } // Bind a listener to the plugin

	  }, {
	    key: "registerListener",
	    value: function registerListener(type, callback) {
	      this.plugin.on(type, callback);
	      this.registeredListeners.push(type);
	    } // Unbind a listener from the plugin

	  }, {
	    key: "unregisterListener",
	    value: function unregisterListener(type) {
	      this.plugin.off(type);
	      var i = this.registeredListeners.indexOf(type);
	      this.registeredListeners.splice(i, 1);
	    } // Trigger an event on the plugin

	  }, {
	    key: "fire",
	    value: function fire(type, data) {
	      if (!this.pluginReady) return;
	      log('evt-dispatch-FIRE', type, data);
	      var evt = new CustomEvent(type, {
	        detail: data
	      });
	      this.plugin.trigger(evt);
	    }
	  }, {
	    key: "teardown",
	    value: function teardown() {
	      var _this3 = this;

	      this.registeredListeners.forEach(function (type) {
	        _this3.unregisterListener(type);
	      });
	    }
	  }, {
	    key: "logCallback",
	    value: function logCallback(eventName, className, event) {
	      log('evt-dispatch-RECEIVE', "".concat(eventName, " (").concat(className, ")"), event);
	    }
	  }]);

	  return EventDispatcher;
	}();

	var AnnotationComments = (function (videojs) {
	  var Plugin = videojs.getPlugin('plugin');
	  var DEFAULT_OPTIONS = Object.freeze({
	    bindArrowKeys: true,
	    meta: {
	      user_id: null,
	      user_name: null
	    },
	    annotationsObjects: [],
	    showControls: true,
	    showCommentList: true,
	    showFullScreen: true,
	    showMarkerShapeAndTooltips: true,
	    internalCommenting: true,
	    startInAnnotationMode: false
	  });
	  return (
	    /*#__PURE__*/
	    function (_Plugin) {
	      _inherits(AnnotationComments, _Plugin);

	      function AnnotationComments(player, options) {
	        var _this;

	        _classCallCheck(this, AnnotationComments);

	        options = Object.assign(Utils.cloneObject(DEFAULT_OPTIONS), options);
	        _this = _possibleConstructorReturn(this, _getPrototypeOf(AnnotationComments).call(this, player, options));
	        _this.eventDispatcher = new EventDispatcher(_assertThisInitialized(_this));

	        _this.eventDispatcher.registerListenersFor(_assertThisInitialized(_this), 'AnnotationComments');

	        _this.player = player;
	        _this.meta = options.meta;
	        _this.options = options;
	        _this._readyCallbacks = []; // Assign reference to this class to player for access later by components where needed

	        player.annotationComments = function () {
	          return _assertThisInitialized(_this);
	        }.bind(_assertThisInitialized(_this)); // Assert that components are initialized AFTER metadata + play data is loaded so we metadata/duration
	        // NOTE - this check is required because player loadeddata doesn't always fire if readystate is > 3


	        if (player.readyState() >= 3) {
	          _this.postLoadDataConstructor();
	        } else {
	          player.on('loadeddata', _this.postLoadDataConstructor.bind(_assertThisInitialized(_this)));
	        }

	        return _this;
	      } // Additional init/setup after video data + metadata is available


	      _createClass(AnnotationComments, [{
	        key: "postLoadDataConstructor",
	        value: function postLoadDataConstructor() {
	          // setup initial state and render UI
	          this.annotationState = new AnnotationState(this.player);
	          this.annotationState.annotations = this.options.annotationsObjects;
	          this.controls = new Controls(this.player, this.options.bindArrowKeys);
	          this.bindEvents();
	          this.setBounds(false);
	          if (this.options.startInAnnotationMode) this.toggleAnnotationMode();
	          this.pluginReady();
	        } // Bind needed events for interaction w/ components

	      }, {
	        key: "bindEvents",
	        value: function bindEvents() {
	          var _this2 = this;

	          // Set player boundaries on window size change or fullscreen change
	          $(window).on('resize.vac-window-resize', Utils.throttle(this.setBounds.bind(this), 500));
	          this.player.on('fullscreenchange', Utils.throttle(this.setBounds.bind(this), 500)); // Remove annotation features on fullscreen if showFullScreen: false

	          if (!this.options.showFullScreen) {
	            this.player.on('fullscreenchange', function () {
	              if (_this2.player.isFullscreen_) {
	                _this2.preFullscreenAnnotationsEnabled = _this2.active;
	                $(_this2.player.el()).addClass('vac-disable-fullscreen');
	              } else {
	                $(_this2.player.el()).removeClass('vac-disable-fullscreen');
	              }

	              if (_this2.preFullscreenAnnotationsEnabled) {
	                // If we were previously in annotation mode (pre-fullscreen) or entering fullscreeen and are
	                // in annotation mode, toggle the mode
	                _this2.toggleAnnotationMode();
	              }
	            }.bind(this));
	          }
	        } // A wrapper func to make it easier to use EventDispatcher from the client
	        // Ex: plugin.fire(type, data);

	      }, {
	        key: "fire",
	        value: function fire(type) {
	          var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	          this.eventDispatcher.fire(type, data);
	        } // Toggle annotations mode on/off

	      }, {
	        key: "toggleAnnotationMode",
	        value: function toggleAnnotationMode() {
	          this.active = !this.active;
	          this.player.toggleClass('vac-active'); // Toggle global class to player to toggle display of elements

	          this.annotationState.enabled = this.active;

	          if (this.active) {
	            this.fire('annotationModeEnabled');
	          } else {
	            this.fire('annotationModeDisabled');
	          } // Handle control component UI if showControls: true


	          if (this.options.showControls) {
	            if (!this.active) {
	              this.controls.clear(true);
	            } else {
	              this.controls.render();
	            }
	          }
	        } // Set player UI boundaries

	      }, {
	        key: "setBounds",
	        value: function setBounds() {
	          var triggerChange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	          this.bounds = {};
	          var $player = $(this.player.el()),
	              $ctrls = $player.find('.vjs-control-bar');
	          this.bounds.left = $player.offset().left;
	          this.bounds.top = $player.offset().top;
	          this.bounds.right = this.bounds.left + $player.width();
	          this.bounds.bottom = this.bounds.top + $player.height();
	          this.bounds.bottomWithoutControls = this.bounds.bottom - $ctrls.height(); // fires an event when bounds have changed during resizing

	          if (triggerChange) this.fire('playerBoundsChanged', this.bounds);
	        } // Public function to register a callback for when plugin is ready

	      }, {
	        key: "onReady",
	        value: function onReady(callback) {
	          if (this.eventDispatcher.pluginReady) {
	            return callback();
	          }

	          this._readyCallbacks.push(callback);
	        } // Mark plugin as ready and fire any pending callbacks

	      }, {
	        key: "pluginReady",
	        value: function pluginReady() {
	          this.eventDispatcher.pluginReady = true;

	          while (this._readyCallbacks.length) {
	            this._readyCallbacks.pop()();
	          }
	        } // Teardown all components, remove all listeners, and remove elements from DOM

	      }, {
	        key: "dispose",
	        value: function dispose() {
	          this.controls = this.controls.teardown();
	          this.annotationState = this.annotationState.teardown();
	          this.eventDispatcher = this.eventDispatcher.teardown();
	          this.teardown();

	          if (this.player) {
	            this.player.annotationComments = null;
	            $(this.player.el()).removeClass('vac-active');
	            $(this.player.el()).find("[class^='vac-']").remove();
	          }

	          _get(_getPrototypeOf(AnnotationComments.prototype), "dispose", this).call(this);
	        }
	      }, {
	        key: "teardown",
	        value: function teardown() {
	          if (this.player) this.player.off('fullscreenchange');
	          $(window).off('resize.vac-window-resize');
	        }
	      }]);

	      return AnnotationComments;
	    }(Plugin)
	  );
	});

	/*
	    Load plugin and register to global videojs
	*/

	(function ($, videojs) {
	  videojs.registerPlugin('annotationComments', AnnotationComments(videojs));
	})(jQuery, window.videojs);

}));
