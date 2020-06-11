'use strict';
(function(klass, sr) {
  /**
   * @param {!Function} func
   * @param {number} threshold
   * @param {?} execAsap
   * @return {?}
   */
  var debounce = function(func, threshold, execAsap) {
    var _takingTooLongTimeout;
    return function() {
      var tmpthis = this;
      /** @type {!Arguments} */
      var arg = arguments;
      if (_takingTooLongTimeout) {
        clearTimeout(_takingTooLongTimeout);
      } else {
        if (execAsap) {
          func.apply(tmpthis, arg);
        }
      }
      /** @type {number} */
      _takingTooLongTimeout = setTimeout(function() {
        if (!execAsap) {
          func.apply(tmpthis, arg);
        }
        /** @type {null} */
        _takingTooLongTimeout = null;
      }, threshold || 500);
    };
  };
  /**
   * @param {!Function} fn
   * @return {?}
   */
  jQuery.fn[sr] = function(fn) {
    return fn ? this.bind("resize", debounce(fn)) : this.trigger(sr);
  };
})(jQuery, "smartresize");
(function(options, $) {
  var testbed;
  var $nav;
  options.responsive = {
    mobileLayoutWidth : options.preferences.mobileLayoutWidth,
    initialized : false,
    init : function() {
      if (!this.initialized) {
        testbed = $("body");
        $nav = $(".navigation");
        $nav.find(".navigation_header").click(function() {
          $(this).toggleClass("expanded").siblings(".level_1_list").toggle();
        });
        if (testbed.width() <= this.mobileLayoutWidth) {
          options.responsive.enableMobileNav();
        }
        if (screen.width > this.mobileLayoutWidth - 1) {
          $(window).smartresize(function() {
            if (jQuery("body").width() <= options.responsive.mobileLayoutWidth) {
              options.responsive.enableMobileNav();
            } else {
              options.responsive.disableMobileNav();
            }
          });
        }
        /** @type {boolean} */
        this.initialized = true;
      }
    },
    enableMobileNav : function() {
      if ($nav) {
        $nav.find(".level_1_list>li>a:not(.non_expandable)").click(function() {
          if (0 < jQuery(this).siblings().length && !jQuery(this).siblings().is(":visible")) {
            return jQuery(this).append('<span class="subnavigation_close">close</span>').children("span").click(function() {
              jQuery(this).parent().siblings().hide();
              jQuery(this).parents(".level_1_list_item").toggleClass("expanded");
              jQuery(this).remove();
              return false;
            }).parent().siblings().show(), jQuery(this).parent().toggleClass("expanded"), $nav.trigger("responsivesubmenu.opened", {
              target : jQuery(this)
            }), false;
          }
        });
      }
    },
    disableMobileNav : function() {
      if ($nav) {
        $nav.find(".level_1_list").removeAttr("style");
        $nav.find(".navigation_dropdown").removeAttr("style");
        $nav.find(".subnavigation_close").remove();
      }
    },
    toggleGridWideTileView : function() {
      if (0 == jQuery(".toggle_grid").length) {
        jQuery(".results_hits").prepend('<a class="toggle_grid" href="' + location.href + '"># &equiv;</a>');
        jQuery(".toggle_grid").click(function() {
          jQuery(".search_result_content").toggleClass("wide_tiles");
          return false;
        });
      }
    }
  };
  $(document).ready(function() {
    options.responsive.init();
  });
})(window.app = window.app || {}, jQuery);
(function(window) {
  /**
   * @return {undefined}
   */
  function Class() {
  }
  /** @type {!RegExp} */
  var tap = /xyz/.test(function() {
    xyz;
  }) ? /\b_super\b/ : /.*/;
  /**
   * @param {!Function} obj
   * @return {?}
   */
  Class.extend = function(obj) {
    var base = this.prototype;
    /** @type {!Object} */
    var proto = Object.create(base);
    var prop;
    for (prop in obj) {
      proto[prop] = "function" === typeof obj[prop] && "function" == typeof base[prop] && tap.test(obj[prop]) ? function(name, CropAreaRectangle) {
        return function() {
          var tmp = this._super;
          this._super = base[name];
          var cssobj = CropAreaRectangle.apply(this, arguments);
          this._super = tmp;
          return cssobj;
        };
      }(prop, obj[prop]) : obj[prop];
    }
    /** @type {!Function} */
    obj = "function" === typeof proto.init ? proto.hasOwnProperty("init") ? proto.init : function() {
      base.init.apply(this, arguments);
    } : function() {
    };
    /** @type {!Object} */
    obj.prototype = proto;
    /** @type {!Function} */
    proto.constructor = obj;
    /** @type {function(!Function): ?} */
    obj.extend = Class.extend;
    return obj;
  };
  /** @type {function(): undefined} */
  window.Class = Class;
})(this);
(function(V) {
  var Component = Class.extend({
    init : function(a) {
      if (!a.element) {
        throw Error("Element is mandatory");
      }
      this.element = $(a.element);
      this.element.data("instance", this);
      this.selectors = {};
      this.state = {};
      this.defaultOptions = $.extend({}, {
        classNames : {}
      }, this.getOptions());
      this.options = $.extend({}, this.defaultOptions, a.options, this.element.data("component-options"));
      this.initCache();
      this.initState();
      this.bindEvents();
      this.afterInit();
    },
    getOptions : function() {
      return {};
    },
    initCache : function() {
    },
    initState : function() {
    },
    bindEvents : function() {
    },
    afterInit : function() {
    }
  });
  V.Component = Component;
})(window.app = window.app || {}, jQuery);
(function($, undefined) {
  /**
   * @param {!Object} element
   * @param {string} isTabIndexNotNaN
   * @return {?}
   */
  function focusable(element, isTabIndexNotNaN) {
    var d;
    var c;
    var baz;
    var nodeName = element.nodeName.toLowerCase();
    return "area" === nodeName ? (d = element.parentNode, c = d.name, element.href && c && "map" === d.nodeName.toLowerCase() ? (baz = $("img[usemap=#" + c + "]")[0], !!baz && visible(baz)) : false) : (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : "a" === nodeName ? element.href || isTabIndexNotNaN : isTabIndexNotNaN) && visible(element);
  }
  /**
   * @param {!Object} a
   * @return {?}
   */
  function visible(a) {
    return $.expr.filters.visible(a) && !$(a).parents().addBack().filter(function() {
      return "hidden" === $.css(this, "visibility");
    }).length;
  }
  /** @type {number} */
  var uuid = 0;
  /** @type {!RegExp} */
  var reLodash = /^ui-id-\d+$/;
  $.ui = $.ui || {};
  $.extend($.ui, {
    version : "1.10.3",
    keyCode : {
      BACKSPACE : 8,
      COMMA : 188,
      DELETE : 46,
      DOWN : 40,
      END : 35,
      ENTER : 13,
      ESCAPE : 27,
      HOME : 36,
      LEFT : 37,
      NUMPAD_ADD : 107,
      NUMPAD_DECIMAL : 110,
      NUMPAD_DIVIDE : 111,
      NUMPAD_ENTER : 108,
      NUMPAD_MULTIPLY : 106,
      NUMPAD_SUBTRACT : 109,
      PAGE_DOWN : 34,
      PAGE_UP : 33,
      PERIOD : 190,
      RIGHT : 39,
      SPACE : 32,
      TAB : 9,
      UP : 38
    }
  });
  $.fn.extend({
    focus : function(CropAreaRectangle) {
      return function(buffer, e) {
        return "number" == typeof buffer ? this.each(function() {
          var a = this;
          setTimeout(function() {
            $(a).focus();
            if (e) {
              e.call(a);
            }
          }, buffer);
        }) : CropAreaRectangle.apply(this, arguments);
      };
    }($.fn.focus),
    scrollParent : function() {
      var expRecords;
      return expRecords = $.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
        return /(relative|absolute|fixed)/.test($.css(this, "position")) && /(auto|scroll)/.test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
      }).eq(0) : this.parents().filter(function() {
        return /(auto|scroll)/.test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
      }).eq(0), /fixed/.test(this.css("position")) || !expRecords.length ? $(document) : expRecords;
    },
    zIndex : function(a) {
      if (a !== undefined) {
        return this.css("zIndex", a);
      }
      if (this.length) {
        var undefined;
        var value;
        a = $(this[0]);
        for (; a.length && a[0] !== document;) {
          if (undefined = a.css("position"), ("absolute" === undefined || "relative" === undefined || "fixed" === undefined) && (value = parseInt(a.css("zIndex"), 10), !isNaN(value) && 0 !== value)) {
            return value;
          }
          a = a.parent();
        }
      }
      return 0;
    },
    uniqueId : function() {
      return this.each(function() {
        if (!this.id) {
          /** @type {string} */
          this.id = "ui-id-" + ++uuid;
        }
      });
    },
    removeUniqueId : function() {
      return this.each(function() {
        if (reLodash.test(this.id)) {
          $(this).removeAttr("id");
        }
      });
    }
  });
  $.extend($.expr[":"], {
    data : $.expr.createPseudo ? $.expr.createPseudo(function(a) {
      return function(c) {
        return !!$.data(c, a);
      };
    }) : function(name, value, obj) {
      return !!$.data(name, obj[3]);
    },
    focusable : function(element) {
      return focusable(element, !isNaN($.attr(element, "tabindex")));
    },
    tabbable : function(element) {
      var tabIndex = $.attr(element, "tabindex");
      /** @type {boolean} */
      var isTabIndexNaN = isNaN(tabIndex);
      return (isTabIndexNaN || 0 <= tabIndex) && focusable(element, !isTabIndexNaN);
    }
  });
  if (!$("<a>").outerWidth(1).jquery) {
    $.each(["Width", "Height"], function(canCreateDiscussions, name) {
      /**
       * @param {?} elem
       * @param {!Object} measure
       * @param {boolean} isOuter
       * @param {?} name
       * @return {?}
       */
      function getWH(elem, measure, isOuter, name) {
        return $.each(tablesongs, function() {
          /** @type {number} */
          measure = measure - (parseFloat($.css(elem, "padding" + this)) || 0);
          if (isOuter) {
            /** @type {number} */
            measure = measure - (parseFloat($.css(elem, "border" + this + "Width")) || 0);
          }
          if (name) {
            /** @type {number} */
            measure = measure - (parseFloat($.css(elem, "margin" + this)) || 0);
          }
        }), measure;
      }
      /** @type {!Array} */
      var tablesongs = "Width" === name ? ["Left", "Right"] : ["Top", "Bottom"];
      var itemCSS = name.toLowerCase();
      var orig = {
        innerWidth : $.fn.innerWidth,
        innerHeight : $.fn.innerHeight,
        outerWidth : $.fn.outerWidth,
        outerHeight : $.fn.outerHeight
      };
      /**
       * @param {!Object} width
       * @return {?}
       */
      $.fn["inner" + name] = function(width) {
        return width === undefined ? orig["inner" + name].call(this) : this.each(function() {
          $(this).css(itemCSS, getWH(this, width) + "px");
        });
      };
      /**
       * @param {(Object|string)} width
       * @param {?} fontSize
       * @return {?}
       */
      $.fn["outer" + name] = function(width, fontSize) {
        return "number" != typeof width ? orig["outer" + name].call(this, width) : this.each(function() {
          $(this).css(itemCSS, getWH(this, width, true, fontSize) + "px");
        });
      };
    });
  }
  if (!$.fn.addBack) {
    /**
     * @param {!Object} selector
     * @return {?}
     */
    $.fn.addBack = function(selector) {
      return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector));
    };
  }
  if ($("<a>").data("a-b", "a").removeData("a-b").data("a-b")) {
    $.fn.removeData = function(removeData) {
      return function(key) {
        return arguments.length ? removeData.call(this, $.camelCase(key)) : removeData.call(this);
      };
    }($.fn.removeData);
  }
  /** @type {boolean} */
  $.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
  /** @type {boolean} */
  $.support.selectstart = "onselectstart" in document.createElement("div");
  $.fn.extend({
    disableSelection : function() {
      return this.bind(($.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(event) {
        event.preventDefault();
      });
    },
    enableSelection : function() {
      return this.unbind(".ui-disableSelection");
    }
  });
  $.extend($.ui, {
    plugin : {
      add : function(name, value, obj) {
        var id;
        name = $.ui[name].prototype;
        for (id in obj) {
          name.plugins[id] = name.plugins[id] || [];
          name.plugins[id].push([value, obj[id]]);
        }
      },
      call : function(options, name, value) {
        var existing = options.plugins[name];
        if (existing && options.element[0].parentNode && 11 !== options.element[0].parentNode.nodeType) {
          /** @type {number} */
          name = 0;
          for (; existing.length > name; name++) {
            if (options.options[existing[name][0]]) {
              existing[name][1].apply(options.element, value);
            }
          }
        }
      }
    },
    hasScroll : function(e, b) {
      if ("hidden" === $(e).css("overflow")) {
        return false;
      }
      /** @type {string} */
      b = b && "left" === b ? "scrollLeft" : "scrollTop";
      /** @type {boolean} */
      var el = false;
      return 0 < e[b] ? true : (e[b] = 1, el = 0 < e[b], e[b] = 0, el);
    }
  });
})(jQuery);
(function($, undefined) {
  /** @type {number} */
  var uuid = 0;
  /** @type {function(this:(IArrayLike<T>|string), *=, *=): !Array<T>} */
  var slice = Array.prototype.slice;
  /** @type {function(number): undefined} */
  var oldClean = $.cleanData;
  /**
   * @param {number} elems
   * @return {undefined}
   */
  $.cleanData = function(elems) {
    var elem;
    /** @type {number} */
    var i = 0;
    for (; null != (elem = elems[i]); i++) {
      try {
        $(elem).triggerHandler("remove");
      } catch (k) {
      }
    }
    oldClean(elems);
  };
  /**
   * @param {string} name
   * @param {!Function} base
   * @param {!Function} prototype
   * @return {undefined}
   */
  $.widget = function(name, base, prototype) {
    var fullName;
    var existingConstructor;
    var o;
    var basePrototype;
    var method = {};
    var namespace = name.split(".")[0];
    name = name.split(".")[1];
    /** @type {string} */
    fullName = namespace + "-" + name;
    if (!prototype) {
      /** @type {!Function} */
      prototype = base;
      /** @type {function(): undefined} */
      base = $.Widget;
    }
    /**
     * @param {undefined} a
     * @return {?}
     */
    $.expr[":"][fullName.toLowerCase()] = function(a) {
      return !!$.data(a, fullName);
    };
    $[namespace] = $[namespace] || {};
    existingConstructor = $[namespace][name];
    /** @type {function(string, !Object): ?} */
    o = $[namespace][name] = function(e, t) {
      return this._createWidget ? (arguments.length && this._createWidget(e, t), undefined) : new o(e, t);
    };
    $.extend(o, existingConstructor, {
      version : prototype.version,
      _proto : $.extend({}, prototype),
      _childConstructors : []
    });
    basePrototype = new base;
    basePrototype.options = $.widget.extend({}, basePrototype.options);
    $.each(prototype, function(m, name) {
      return $.isFunction(name) ? (method[m] = function() {
        /**
         * @return {?}
         */
        var e = function() {
          return base.prototype[m].apply(this, arguments);
        };
        /**
         * @param {!Array} name
         * @return {?}
         */
        var n = function(name) {
          return base.prototype[m].apply(this, name);
        };
        return function() {
          var _ref12;
          var tmp = this._super;
          var __superApply = this._superApply;
          return this._super = e, this._superApply = n, _ref12 = name.apply(this, arguments), this._super = tmp, this._superApply = __superApply, _ref12;
        };
      }(), undefined) : (method[m] = name, undefined);
    });
    o.prototype = $.widget.extend(basePrototype, {
      widgetEventPrefix : existingConstructor ? basePrototype.widgetEventPrefix : name
    }, method, {
      constructor : o,
      namespace : namespace,
      widgetName : name,
      widgetFullName : fullName
    });
    if (existingConstructor) {
      $.each(existingConstructor._childConstructors, function(props, child) {
        props = child.prototype;
        $.widget(props.namespace + "." + props.widgetName, o, child._proto);
      });
      delete existingConstructor._childConstructors;
    } else {
      base._childConstructors.push(o);
    }
    $.widget.bridge(name, o);
  };
  /**
   * @param {string} obj
   * @return {?}
   */
  $.widget.extend = function(obj) {
    var key;
    var value;
    /** @type {!Array<?>} */
    var result = slice.call(arguments, 1);
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var diff = result.length;
    for (; diff > i; i++) {
      for (key in result[i]) {
        value = result[i][key];
        if (result[i].hasOwnProperty(key) && value !== undefined) {
          obj[key] = $.isPlainObject(value) ? $.isPlainObject(obj[key]) ? $.widget.extend({}, obj[key], value) : $.widget.extend({}, value) : value;
        }
      }
    }
    return obj;
  };
  /**
   * @param {string} name
   * @param {!Function} object
   * @return {undefined}
   */
  $.widget.bridge = function(name, object) {
    var id = object.prototype.widgetFullName || name;
    /**
     * @param {?} options
     * @return {?}
     */
    $.fn[name] = function(options) {
      /** @type {boolean} */
      var o = "string" == typeof options;
      /** @type {!Array<?>} */
      var args = slice.call(arguments, 1);
      var returnValue = this;
      return options = !o && args.length ? $.widget.extend.apply(null, [options].concat(args)) : options, o ? this.each(function() {
        var methodValue;
        var instance = $.data(this, id);
        return instance ? $.isFunction(instance[options]) && "_" !== options.charAt(0) ? (methodValue = instance[options].apply(instance, args), methodValue !== instance && methodValue !== undefined ? (returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue, false) : undefined) : $.error("no such method '" + options + "' for " + name + " widget instance") : $.error("cannot call methods on " + name + " prior to initialization; attempted to call method '" + 
        options + "'");
      }) : this.each(function() {
        var instance = $.data(this, id);
        if (instance) {
          instance.option(options || {})._init();
        } else {
          $.data(this, id, new object(options, this));
        }
      }), returnValue;
    };
  };
  /**
   * @return {undefined}
   */
  $.Widget = function() {
  };
  /** @type {!Array} */
  $.Widget._childConstructors = [];
  $.Widget.prototype = {
    widgetName : "widget",
    widgetEventPrefix : "",
    defaultElement : "<div>",
    options : {
      disabled : false,
      create : null
    },
    _createWidget : function(options, element) {
      element = $(element || this.defaultElement || this)[0];
      this.element = $(element);
      /** @type {number} */
      this.uuid = uuid++;
      /** @type {string} */
      this.eventNamespace = "." + this.widgetName + this.uuid;
      this.options = $.widget.extend({}, this.options, this._getCreateOptions(), options);
      this.bindings = $();
      this.hoverable = $();
      this.focusable = $();
      if (element !== this) {
        $.data(element, this.widgetFullName, this);
        this._on(true, this.element, {
          remove : function(name) {
            if (name.target === element) {
              this.destroy();
            }
          }
        });
        this.document = $(element.style ? element.ownerDocument : element.document || element);
        this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
      }
      this._create();
      this._trigger("create", null, this._getCreateEventData());
      this._init();
    },
    _getCreateOptions : $.noop,
    _getCreateEventData : $.noop,
    _create : $.noop,
    _init : $.noop,
    destroy : function() {
      this._destroy();
      this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData($.camelCase(this.widgetFullName));
      this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled");
      this.bindings.unbind(this.eventNamespace);
      this.hoverable.removeClass("ui-state-hover");
      this.focusable.removeClass("ui-state-focus");
    },
    _destroy : $.noop,
    widget : function() {
      return this.element;
    },
    option : function(key, value) {
      var keys;
      var o;
      var i;
      /** @type {string} */
      var options = key;
      if (0 === arguments.length) {
        return $.widget.extend({}, this.options);
      }
      if ("string" == typeof key) {
        if (options = {}, keys = key.split("."), key = keys.shift(), keys.length) {
          o = options[key] = $.widget.extend({}, this.options[key]);
          /** @type {number} */
          i = 0;
          for (; keys.length - 1 > i; i++) {
            o[keys[i]] = o[keys[i]] || {};
            o = o[keys[i]];
          }
          if (key = keys.pop(), value === undefined) {
            return o[key] === undefined ? null : o[key];
          }
          o[key] = value;
        } else {
          if (value === undefined) {
            return this.options[key] === undefined ? null : this.options[key];
          }
          options[key] = value;
        }
      }
      return this._setOptions(options), this;
    },
    _setOptions : function(options) {
      var key;
      for (key in options) {
        this._setOption(key, options[key]);
      }
      return this;
    },
    _setOption : function(value, option) {
      return this.options[value] = option, "disabled" === value && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!option).attr("aria-disabled", option), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this;
    },
    enable : function() {
      return this._setOption("disabled", false);
    },
    disable : function() {
      return this._setOption("disabled", true);
    },
    _on : function(t, i, name) {
      var n;
      var a = this;
      if ("boolean" != typeof t) {
        /** @type {!Object} */
        name = i;
        /** @type {string} */
        i = t;
        /** @type {boolean} */
        t = false;
      }
      if (name) {
        i = n = $(i);
        this.bindings = this.bindings.add(i);
      } else {
        /** @type {!Object} */
        name = i;
        i = this.element;
        n = this.widget();
      }
      $.each(name, function(b, o) {
        /**
         * @return {?}
         */
        function r() {
          return t || true !== a.options.disabled && !$(this).hasClass("ui-state-disabled") ? ("string" == typeof o ? a[o] : o).apply(a, arguments) : undefined;
        }
        if ("string" != typeof o) {
          r.guid = o.guid = o.guid || r.guid || $.guid++;
        }
        var type = b.match(/^(\w+)\s*(.*)$/);
        b = type[1] + a.eventNamespace;
        if (type = type[2]) {
          n.delegate(type, b, r);
        } else {
          i.bind(b, r);
        }
      });
    },
    _off : function(element, eventName) {
      eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
      element.unbind(eventName).undelegate(eventName);
    },
    _delay : function(e, t) {
      var a = this;
      return setTimeout(function() {
        return ("string" == typeof e ? a[e] : e).apply(a, arguments);
      }, t || 0);
    },
    _hoverable : function(element) {
      this.hoverable = this.hoverable.add(element);
      this._on(element, {
        mouseenter : function(event) {
          $(event.currentTarget).addClass("ui-state-hover");
        },
        mouseleave : function(name) {
          $(name.currentTarget).removeClass("ui-state-hover");
        }
      });
    },
    _focusable : function(element) {
      this.focusable = this.focusable.add(element);
      this._on(element, {
        focusin : function(name) {
          $(name.currentTarget).addClass("ui-state-focus");
        },
        focusout : function(name) {
          $(name.currentTarget).removeClass("ui-state-focus");
        }
      });
    },
    _trigger : function(type, event, data) {
      var key;
      var callback = this.options[type];
      if (data = data || {}, event = $.Event(event), event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase(), event.target = this.element[0], type = event.originalEvent) {
        for (key in type) {
          if (!(key in event)) {
            event[key] = type[key];
          }
        }
      }
      return this.element.trigger(event, data), !($.isFunction(callback) && false === callback.apply(this.element[0], [event].concat(data)) || event.isDefaultPrevented());
    }
  };
  $.each({
    show : "fadeIn",
    hide : "fadeOut"
  }, function(method, defaultEffect) {
    /**
     * @param {!Object} element
     * @param {!Object} options
     * @param {!Function} callback
     * @return {undefined}
     */
    $.Widget.prototype["_" + method] = function(element, options, callback) {
      if ("string" == typeof options) {
        options = {
          effect : options
        };
      }
      var hasOptions;
      var effectName = options ? true === options || "number" == typeof options ? defaultEffect : options.effect || defaultEffect : method;
      options = options || {};
      if ("number" == typeof options) {
        options = {
          duration : options
        };
      }
      /** @type {boolean} */
      hasOptions = !$.isEmptyObject(options);
      /** @type {!Function} */
      options.complete = callback;
      if (options.delay) {
        element.delay(options.delay);
      }
      if (hasOptions && $.effects && $.effects.effect[effectName]) {
        element[method](options);
      } else {
        if (effectName !== method && element[effectName]) {
          element[effectName](options.duration, options.easing, callback);
        } else {
          element.queue(function(saveNotifs) {
            $(this)[method]();
            if (callback) {
              callback.call(element[0]);
            }
            saveNotifs();
          });
        }
      }
    };
  });
})(jQuery);
(function($) {
  /** @type {boolean} */
  var a = false;
  $(document).mouseup(function() {
    /** @type {boolean} */
    a = false;
  });
  $.widget("ui.mouse", {
    version : "1.10.3",
    options : {
      cancel : "input,textarea,button,select,option",
      distance : 1,
      delay : 0
    },
    _mouseInit : function() {
      var that = this;
      this.element.bind("mousedown." + this.widgetName, function(event) {
        return that._mouseDown(event);
      }).bind("click." + this.widgetName, function(event) {
        return true === $.data(event.target, that.widgetName + ".preventClickEvent") ? ($.removeData(event.target, that.widgetName + ".preventClickEvent"), event.stopImmediatePropagation(), false) : void 0;
      });
      /** @type {boolean} */
      this.started = false;
    },
    _mouseDestroy : function() {
      this.element.unbind("." + this.widgetName);
      if (this._mouseMoveDelegate) {
        $(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
      }
    },
    _mouseDown : function(event) {
      if (!a) {
        if (this._mouseStarted) {
          this._mouseUp(event);
        }
        /** @type {!Object} */
        this._mouseDownEvent = event;
        var that = this;
        /** @type {boolean} */
        var isIE = 1 === event.which;
        var isIE8 = "string" == typeof this.options.cancel && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false;
        return isIE && !isIE8 && this._mouseCapture(event) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
          /** @type {boolean} */
          that.mouseDelayMet = true;
        }, this.options.delay)), this._mouseDistanceMet(event) && this._mouseDelayMet(event) && (this._mouseStarted = false !== this._mouseStart(event), !this._mouseStarted) ? (event.preventDefault(), true) : (true === $.data(event.target, this.widgetName + ".preventClickEvent") && $.removeData(event.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(e) {
          return that._mouseMove(e);
        }, this._mouseUpDelegate = function(event) {
          return that._mouseUp(event);
        }, $(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), event.preventDefault(), a = true, true)) : true;
      }
    },
    _mouseMove : function(e) {
      return $.ui.ie && (!document.documentMode || 9 > document.documentMode) && !e.button ? this._mouseUp(e) : this._mouseStarted ? (this._mouseDrag(e), e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = false !== this._mouseStart(this._mouseDownEvent, e), this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted);
    },
    _mouseUp : function(event) {
      return $(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = false, event.target === this._mouseDownEvent.target && $.data(event.target, this.widgetName + ".preventClickEvent", true), this._mouseStop(event)), false;
    },
    _mouseDistanceMet : function(event) {
      return Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance;
    },
    _mouseDelayMet : function() {
      return this.mouseDelayMet;
    },
    _mouseStart : function() {
    },
    _mouseDrag : function() {
    },
    _mouseStop : function() {
    },
    _mouseCapture : function() {
      return true;
    }
  });
})(jQuery);
(function($) {
  $.widget("ui.draggable", $.ui.mouse, {
    version : "1.10.3",
    widgetEventPrefix : "drag",
    options : {
      addClasses : true,
      appendTo : "parent",
      axis : false,
      connectToSortable : false,
      containment : false,
      cursor : "auto",
      cursorAt : false,
      grid : false,
      handle : false,
      helper : "original",
      iframeFix : false,
      opacity : false,
      refreshPositions : false,
      revert : false,
      revertDuration : 500,
      scope : "default",
      scroll : true,
      scrollSensitivity : 20,
      scrollSpeed : 20,
      snap : false,
      snapMode : "both",
      snapTolerance : 20,
      stack : false,
      zIndex : false,
      drag : null,
      start : null,
      stop : null
    },
    _create : function() {
      if (!("original" !== this.options.helper || /^(?:r|a|f)/.test(this.element.css("position")))) {
        /** @type {string} */
        this.element[0].style.position = "relative";
      }
      if (this.options.addClasses) {
        this.element.addClass("ui-draggable");
      }
      if (this.options.disabled) {
        this.element.addClass("ui-draggable-disabled");
      }
      this._mouseInit();
    },
    _destroy : function() {
      this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
      this._mouseDestroy();
    },
    _mouseCapture : function(event) {
      var o = this.options;
      return this.helper || o.disabled || 0 < $(event.target).closest(".ui-resizable-handle").length ? false : (this.handle = this._getHandle(event), this.handle ? ($(true === o.iframeFix ? "iframe" : o.iframeFix).each(function() {
        $("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({
          width : this.offsetWidth + "px",
          height : this.offsetHeight + "px",
          position : "absolute",
          opacity : "0.001",
          zIndex : 1E3
        }).css($(this).offset()).appendTo("body");
      }), true) : false);
    },
    _mouseStart : function(event) {
      var o = this.options;
      return this.helper = this._createHelper(event), this.helper.addClass("ui-draggable-dragging"), this._cacheHelperProportions(), $.ui.ddmanager && ($.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(), this.offsetParent = this.helper.offsetParent(), this.offsetParentCssPosition = this.offsetParent.css("position"), this.offset = this.positionAbs = this.element.offset(), this.offset = {
        top : this.offset.top - this.margins.top,
        left : this.offset.left - this.margins.left
      }, this.offset.scroll = false, $.extend(this.offset, {
        click : {
          left : event.pageX - this.offset.left,
          top : event.pageY - this.offset.top
        },
        parent : this._getParentOffset(),
        relative : this._getRelativeOffset()
      }), this.originalPosition = this.position = this._generatePosition(event), this.originalPageX = event.pageX, this.originalPageY = event.pageY, o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt), this._setContainment(), false === this._trigger("start", event) ? (this._clear(), false) : (this._cacheHelperProportions(), $.ui.ddmanager && !o.dropBehaviour && $.ui.ddmanager.prepareOffsets(this, event), this._mouseDrag(event, true), $.ui.ddmanager && $.ui.ddmanager.dragStart(this, event), true);
    },
    _mouseDrag : function(event, e) {
      if ("fixed" === this.offsetParentCssPosition && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(event), this.positionAbs = this._convertPositionTo("absolute"), !e) {
        e = this._uiHash();
        if (false === this._trigger("drag", event, e)) {
          return this._mouseUp({}), false;
        }
        this.position = e.position;
      }
      return this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"), this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"), $.ui.ddmanager && $.ui.ddmanager.drag(this, event), false;
    },
    _mouseStop : function(event) {
      var self = this;
      /** @type {boolean} */
      var dropped = false;
      return $.ui.ddmanager && !this.options.dropBehaviour && (dropped = $.ui.ddmanager.drop(this, event)), this.dropped && (dropped = this.dropped, this.dropped = false), "original" !== this.options.helper || $.contains(this.element[0].ownerDocument, this.element[0]) ? ("invalid" === this.options.revert && !dropped || "valid" === this.options.revert && dropped || true === this.options.revert || $.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped) ? $(this.helper).animate(this.originalPosition, 
      parseInt(this.options.revertDuration, 10), function() {
        if (false !== self._trigger("stop", event)) {
          self._clear();
        }
      }) : false !== this._trigger("stop", event) && this._clear(), false) : false;
    },
    _mouseUp : function(event) {
      return $("div.ui-draggable-iframeFix").each(function() {
        this.parentNode.removeChild(this);
      }), $.ui.ddmanager && $.ui.ddmanager.dragStop(this, event), $.ui.mouse.prototype._mouseUp.call(this, event);
    },
    cancel : function() {
      return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), this;
    },
    _getHandle : function(event) {
      return this.options.handle ? !!$(event.target).closest(this.element.find(this.options.handle)).length : true;
    },
    _createHelper : function(input) {
      var opts = this.options;
      input = $.isFunction(opts.helper) ? $(opts.helper.apply(this.element[0], [input])) : "clone" === opts.helper ? this.element.clone().removeAttr("id") : this.element;
      return input.parents("body").length || input.appendTo("parent" === opts.appendTo ? this.element[0].parentNode : opts.appendTo), input[0] === this.element[0] || /(fixed|absolute)/.test(input.css("position")) || input.css("position", "absolute"), input;
    },
    _adjustOffsetFromHelper : function(obj) {
      if ("string" == typeof obj) {
        /** @type {!Array<string>} */
        obj = obj.split(" ");
      }
      if ($.isArray(obj)) {
        obj = {
          left : +obj[0],
          top : +obj[1] || 0
        };
      }
      if ("left" in obj) {
        this.offset.click.left = obj.left + this.margins.left;
      }
      if ("right" in obj) {
        this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
      }
      if ("top" in obj) {
        this.offset.click.top = obj.top + this.margins.top;
      }
      if ("bottom" in obj) {
        this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
      }
    },
    _getParentOffset : function() {
      var cssStart = this.offsetParent.offset();
      return "absolute" === this.cssPosition && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0]) && (cssStart.left += this.scrollParent.scrollLeft(), cssStart.top += this.scrollParent.scrollTop()), (this.offsetParent[0] === document.body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && $.ui.ie) && (cssStart = {
        top : 0,
        left : 0
      }), {
        top : cssStart.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
        left : cssStart.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
      };
    },
    _getRelativeOffset : function() {
      if ("relative" === this.cssPosition) {
        var anchorBoundingBoxViewport = this.element.position();
        return {
          top : anchorBoundingBoxViewport.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
          left : anchorBoundingBoxViewport.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
        };
      }
      return {
        top : 0,
        left : 0
      };
    },
    _cacheMargins : function() {
      this.margins = {
        left : parseInt(this.element.css("marginLeft"), 10) || 0,
        top : parseInt(this.element.css("marginTop"), 10) || 0,
        right : parseInt(this.element.css("marginRight"), 10) || 0,
        bottom : parseInt(this.element.css("marginBottom"), 10) || 0
      };
    },
    _cacheHelperProportions : function() {
      this.helperProportions = {
        width : this.helper.outerWidth(),
        height : this.helper.outerHeight()
      };
    },
    _setContainment : function() {
      var over;
      var c;
      var ce;
      var o = this.options;
      return o.containment ? "window" === o.containment ? (this.containment = [$(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, $(window).scrollLeft() + $(window).width() - this.helperProportions.width - this.margins.left, $(window).scrollTop() + ($(window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], void 0) : "document" === o.containment ? 
      (this.containment = [0, 0, $(document).width() - this.helperProportions.width - this.margins.left, ($(document).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], void 0) : o.containment.constructor === Array ? (this.containment = o.containment, void 0) : ("parent" === o.containment && (o.containment = this.helper[0].parentNode), c = $(o.containment), ce = c[0], ce && (over = "hidden" !== c.css("overflow"), this.containment = [(parseInt(c.css("borderLeftWidth"), 
      10) || 0) + (parseInt(c.css("paddingLeft"), 10) || 0), (parseInt(c.css("borderTopWidth"), 10) || 0) + (parseInt(c.css("paddingTop"), 10) || 0), (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt(c.css("borderRightWidth"), 10) || 0) - (parseInt(c.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt(c.css("borderBottomWidth"), 10) || 
      0) - (parseInt(c.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relative_container = c), void 0) : (this.containment = null, void 0);
    },
    _convertPositionTo : function(pos, d) {
      if (!d) {
        d = this.position;
      }
      /** @type {number} */
      pos = "absolute" === pos ? 1 : -1;
      var offsetParent = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent;
      return this.offset.scroll || (this.offset.scroll = {
        top : offsetParent.scrollTop(),
        left : offsetParent.scrollLeft()
      }), {
        top : d.top + this.offset.relative.top * pos + this.offset.parent.top * pos - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : this.offset.scroll.top) * pos,
        left : d.left + this.offset.relative.left * pos + this.offset.parent.left * pos - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : this.offset.scroll.left) * pos
      };
    },
    _generatePosition : function(event) {
      var containment;
      var co;
      var top;
      var left;
      var o = this.options;
      var offsetParent = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent;
      var pageX = event.pageX;
      var pageY = event.pageY;
      return this.offset.scroll || (this.offset.scroll = {
        top : offsetParent.scrollTop(),
        left : offsetParent.scrollLeft()
      }), this.originalPosition && (this.containment && (this.relative_container ? (co = this.relative_container.offset(), containment = [this.containment[0] + co.left, this.containment[1] + co.top, this.containment[2] + co.left, this.containment[3] + co.top]) : containment = this.containment, event.pageX - this.offset.click.left < containment[0] && (pageX = containment[0] + this.offset.click.left), event.pageY - this.offset.click.top < containment[1] && (pageY = containment[1] + this.offset.click.top), 
      event.pageX - this.offset.click.left > containment[2] && (pageX = containment[2] + this.offset.click.left), event.pageY - this.offset.click.top > containment[3] && (pageY = containment[3] + this.offset.click.top)), o.grid && (top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY, pageY = containment ? top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3] ? top : top - this.offset.click.top >= 
      containment[1] ? top - o.grid[1] : top + o.grid[1] : top, left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX, pageX = containment ? left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2] ? left : left - this.offset.click.left >= containment[0] ? left - o.grid[0] : left + o.grid[0] : left)), {
        top : pageY - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : this.offset.scroll.top),
        left : pageX - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : this.offset.scroll.left)
      };
    },
    _clear : function() {
      this.helper.removeClass("ui-draggable-dragging");
      if (!(this.helper[0] === this.element[0] || this.cancelHelperRemoval)) {
        this.helper.remove();
      }
      /** @type {null} */
      this.helper = null;
      /** @type {boolean} */
      this.cancelHelperRemoval = false;
    },
    _trigger : function(type, event, data) {
      return data = data || this._uiHash(), $.ui.plugin.call(this, type, [event, data]), "drag" === type && (this.positionAbs = this._convertPositionTo("absolute")), $.Widget.prototype._trigger.call(this, type, event, data);
    },
    plugins : {},
    _uiHash : function() {
      return {
        helper : this.helper,
        position : this.position,
        originalPosition : this.originalPosition,
        offset : this.positionAbs
      };
    }
  });
  $.ui.plugin.add("draggable", "connectToSortable", {
    start : function(event, ui) {
      var inst = $(this).data("ui-draggable");
      var o = inst.options;
      var uiSortable = $.extend({}, ui, {
        item : inst.element
      });
      /** @type {!Array} */
      inst.sortables = [];
      $(o.connectToSortable).each(function() {
        var sortable = $.data(this, "ui-sortable");
        if (sortable && !sortable.options.disabled) {
          inst.sortables.push({
            instance : sortable,
            shouldRevert : sortable.options.revert
          });
          sortable.refreshPositions();
          sortable._trigger("activate", event, uiSortable);
        }
      });
    },
    stop : function(event, ui) {
      var inst = $(this).data("ui-draggable");
      var uiSortable = $.extend({}, ui, {
        item : inst.element
      });
      $.each(inst.sortables, function() {
        if (this.instance.isOver) {
          /** @type {number} */
          this.instance.isOver = 0;
          /** @type {boolean} */
          inst.cancelHelperRemoval = true;
          /** @type {boolean} */
          this.instance.cancelHelperRemoval = false;
          if (this.shouldRevert) {
            this.instance.options.revert = this.shouldRevert;
          }
          this.instance._mouseStop(event);
          this.instance.options.helper = this.instance.options._helper;
          if ("original" === inst.options.helper) {
            this.instance.currentItem.css({
              top : "auto",
              left : "auto"
            });
          }
        } else {
          /** @type {boolean} */
          this.instance.cancelHelperRemoval = false;
          this.instance._trigger("deactivate", event, uiSortable);
        }
      });
    },
    drag : function(event, ui) {
      var inst = $(this).data("ui-draggable");
      var sampleTest1 = this;
      $.each(inst.sortables, function() {
        /** @type {boolean} */
        var e = false;
        var thisSortable = this;
        this.instance.positionAbs = inst.positionAbs;
        this.instance.helperProportions = inst.helperProportions;
        this.instance.offset.click = inst.offset.click;
        if (this.instance._intersectsWith(this.instance.containerCache)) {
          /** @type {boolean} */
          e = true;
          $.each(inst.sortables, function() {
            return this.instance.positionAbs = inst.positionAbs, this.instance.helperProportions = inst.helperProportions, this.instance.offset.click = inst.offset.click, this !== thisSortable && this.instance._intersectsWith(this.instance.containerCache) && $.contains(thisSortable.instance.element[0], this.instance.element[0]) && (e = false), e;
          });
        }
        if (e) {
          if (!this.instance.isOver) {
            /** @type {number} */
            this.instance.isOver = 1;
            this.instance.currentItem = $(sampleTest1).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item", true);
            this.instance.options._helper = this.instance.options.helper;
            /**
             * @return {?}
             */
            this.instance.options.helper = function() {
              return ui.helper[0];
            };
            event.target = this.instance.currentItem[0];
            this.instance._mouseCapture(event, true);
            this.instance._mouseStart(event, true, true);
            this.instance.offset.click.top = inst.offset.click.top;
            this.instance.offset.click.left = inst.offset.click.left;
            this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
            this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;
            inst._trigger("toSortable", event);
            inst.dropped = this.instance.element;
            inst.currentItem = inst.element;
            this.instance.fromOutside = inst;
          }
          if (this.instance.currentItem) {
            this.instance._mouseDrag(event);
          }
        } else {
          if (this.instance.isOver) {
            /** @type {number} */
            this.instance.isOver = 0;
            /** @type {boolean} */
            this.instance.cancelHelperRemoval = true;
            /** @type {boolean} */
            this.instance.options.revert = false;
            this.instance._trigger("out", event, this.instance._uiHash(this.instance));
            this.instance._mouseStop(event, true);
            this.instance.options.helper = this.instance.options._helper;
            this.instance.currentItem.remove();
            if (this.instance.placeholder) {
              this.instance.placeholder.remove();
            }
            inst._trigger("fromSortable", event);
            /** @type {boolean} */
            inst.dropped = false;
          }
        }
      });
    }
  });
  $.ui.plugin.add("draggable", "cursor", {
    start : function() {
      var t = $("body");
      var o = $(this).data("ui-draggable").options;
      if (t.css("cursor")) {
        o._cursor = t.css("cursor");
      }
      t.css("cursor", o.cursor);
    },
    stop : function() {
      var o = $(this).data("ui-draggable").options;
      if (o._cursor) {
        $("body").css("cursor", o._cursor);
      }
    }
  });
  $.ui.plugin.add("draggable", "opacity", {
    start : function(el, o) {
      el = $(o.helper);
      o = $(this).data("ui-draggable").options;
      if (el.css("opacity")) {
        o._opacity = el.css("opacity");
      }
      el.css("opacity", o.opacity);
    },
    stop : function(options, type) {
      options = $(this).data("ui-draggable").options;
      if (options._opacity) {
        $(type.helper).css("opacity", options._opacity);
      }
    }
  });
  $.ui.plugin.add("draggable", "scroll", {
    start : function() {
      var i = $(this).data("ui-draggable");
      if (i.scrollParent[0] !== document && "HTML" !== i.scrollParent[0].tagName) {
        i.overflowOffset = i.scrollParent.offset();
      }
    },
    drag : function(event) {
      var i = $(this).data("ui-draggable");
      var o = i.options;
      /** @type {boolean} */
      var scrolled = false;
      if (i.scrollParent[0] !== document && "HTML" !== i.scrollParent[0].tagName) {
        if (!(o.axis && "x" === o.axis)) {
          if (i.overflowOffset.top + i.scrollParent[0].offsetHeight - event.pageY < o.scrollSensitivity) {
            i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
          } else {
            if (event.pageY - i.overflowOffset.top < o.scrollSensitivity) {
              /** @type {number} */
              i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
            }
          }
        }
        if (!(o.axis && "y" === o.axis)) {
          if (i.overflowOffset.left + i.scrollParent[0].offsetWidth - event.pageX < o.scrollSensitivity) {
            i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
          } else {
            if (event.pageX - i.overflowOffset.left < o.scrollSensitivity) {
              /** @type {number} */
              i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
            }
          }
        }
      } else {
        if (!(o.axis && "x" === o.axis)) {
          if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
            scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
          } else {
            if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
              scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
            }
          }
        }
        if (!(o.axis && "y" === o.axis)) {
          if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
            scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
          } else {
            if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
              scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
            }
          }
        }
      }
      if (false !== scrolled && $.ui.ddmanager && !o.dropBehaviour) {
        $.ui.ddmanager.prepareOffsets(i, event);
      }
    }
  });
  $.ui.plugin.add("draggable", "snap", {
    start : function() {
      var inst = $(this).data("ui-draggable");
      var o = inst.options;
      /** @type {!Array} */
      inst.snapElements = [];
      $(o.snap.constructor !== String ? o.snap.items || ":data(ui-draggable)" : o.snap).each(function() {
        var jqDom = $(this);
        var elLocation = jqDom.offset();
        if (this !== inst.element[0]) {
          inst.snapElements.push({
            item : this,
            width : jqDom.outerWidth(),
            height : jqDom.outerHeight(),
            top : elLocation.top,
            left : elLocation.left
          });
        }
      });
    },
    drag : function(event, ui) {
      var ts;
      var bs;
      var ls;
      var rs;
      var x;
      var x1;
      var t;
      var b;
      var i;
      var first;
      var inst = $(this).data("ui-draggable");
      var o = inst.options;
      var d = o.snapTolerance;
      var cx = ui.offset.left;
      var x0 = cx + inst.helperProportions.width;
      var y1 = ui.offset.top;
      var y = y1 + inst.helperProportions.height;
      /** @type {number} */
      i = inst.snapElements.length - 1;
      for (; 0 <= i; i--) {
        x = inst.snapElements[i].left;
        x1 = x + inst.snapElements[i].width;
        t = inst.snapElements[i].top;
        b = t + inst.snapElements[i].height;
        if (x - d > x0 || cx > x1 + d || t - d > y || y1 > b + d || !$.contains(inst.snapElements[i].item.ownerDocument, inst.snapElements[i].item)) {
          if (inst.snapElements[i].snapping && inst.options.snap.release) {
            inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), {
              snapItem : inst.snapElements[i].item
            }));
          }
          /** @type {boolean} */
          inst.snapElements[i].snapping = false;
        } else {
          if ("inner" !== o.snapMode) {
            /** @type {boolean} */
            ts = d >= Math.abs(t - y);
            /** @type {boolean} */
            bs = d >= Math.abs(b - y1);
            /** @type {boolean} */
            ls = d >= Math.abs(x - x0);
            /** @type {boolean} */
            rs = d >= Math.abs(x1 - cx);
            if (ts) {
              /** @type {number} */
              ui.position.top = inst._convertPositionTo("relative", {
                top : t - inst.helperProportions.height,
                left : 0
              }).top - inst.margins.top;
            }
            if (bs) {
              /** @type {number} */
              ui.position.top = inst._convertPositionTo("relative", {
                top : b,
                left : 0
              }).top - inst.margins.top;
            }
            if (ls) {
              /** @type {number} */
              ui.position.left = inst._convertPositionTo("relative", {
                top : 0,
                left : x - inst.helperProportions.width
              }).left - inst.margins.left;
            }
            if (rs) {
              /** @type {number} */
              ui.position.left = inst._convertPositionTo("relative", {
                top : 0,
                left : x1
              }).left - inst.margins.left;
            }
          }
          /** @type {(boolean|undefined)} */
          first = ts || bs || ls || rs;
          if ("outer" !== o.snapMode) {
            /** @type {boolean} */
            ts = d >= Math.abs(t - y1);
            /** @type {boolean} */
            bs = d >= Math.abs(b - y);
            /** @type {boolean} */
            ls = d >= Math.abs(x - cx);
            /** @type {boolean} */
            rs = d >= Math.abs(x1 - x0);
            if (ts) {
              /** @type {number} */
              ui.position.top = inst._convertPositionTo("relative", {
                top : t,
                left : 0
              }).top - inst.margins.top;
            }
            if (bs) {
              /** @type {number} */
              ui.position.top = inst._convertPositionTo("relative", {
                top : b - inst.helperProportions.height,
                left : 0
              }).top - inst.margins.top;
            }
            if (ls) {
              /** @type {number} */
              ui.position.left = inst._convertPositionTo("relative", {
                top : 0,
                left : x
              }).left - inst.margins.left;
            }
            if (rs) {
              /** @type {number} */
              ui.position.left = inst._convertPositionTo("relative", {
                top : 0,
                left : x1 - inst.helperProportions.width
              }).left - inst.margins.left;
            }
          }
          if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first) && inst.options.snap.snap) {
            inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), {
              snapItem : inst.snapElements[i].item
            }));
          }
          /** @type {(boolean|undefined)} */
          inst.snapElements[i].snapping = ts || bs || ls || rs || first;
        }
      }
    }
  });
  $.ui.plugin.add("draggable", "stack", {
    start : function() {
      var min;
      var options = this.data("ui-draggable").options;
      options = $.makeArray($(options.stack)).sort(function(entryEl, stage_ele) {
        return (parseInt($(entryEl).css("zIndex"), 10) || 0) - (parseInt($(stage_ele).css("zIndex"), 10) || 0);
      });
      if (options.length) {
        /** @type {number} */
        min = parseInt($(options[0]).css("zIndex"), 10) || 0;
        $(options).each(function(i) {
          $(this).css("zIndex", min + i);
        });
        this.css("zIndex", min + options.length);
      }
    }
  });
  $.ui.plugin.add("draggable", "zIndex", {
    start : function(el, o) {
      el = $(o.helper);
      o = $(this).data("ui-draggable").options;
      if (el.css("zIndex")) {
        o._zIndex = el.css("zIndex");
      }
      el.css("zIndex", o.zIndex);
    },
    stop : function(obj, that) {
      obj = $(this).data("ui-draggable").options;
      if (obj._zIndex) {
        $(that.helper).css("zIndex", obj._zIndex);
      }
    }
  });
})(jQuery);
(function($) {
  $.widget("ui.droppable", {
    version : "1.10.3",
    widgetEventPrefix : "drop",
    options : {
      accept : "*",
      activeClass : false,
      addClasses : true,
      greedy : false,
      hoverClass : false,
      scope : "default",
      tolerance : "intersect",
      activate : null,
      deactivate : null,
      drop : null,
      out : null,
      over : null
    },
    _create : function() {
      var o = this.options;
      var accept = o.accept;
      /** @type {boolean} */
      this.isover = false;
      /** @type {boolean} */
      this.isout = true;
      this.accept = $.isFunction(accept) ? accept : function(name) {
        return name.is(accept);
      };
      this.proportions = {
        width : this.element[0].offsetWidth,
        height : this.element[0].offsetHeight
      };
      $.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
      $.ui.ddmanager.droppables[o.scope].push(this);
      if (o.addClasses) {
        this.element.addClass("ui-droppable");
      }
    },
    _destroy : function() {
      /** @type {number} */
      var i = 0;
      var array = $.ui.ddmanager.droppables[this.options.scope];
      for (; array.length > i; i++) {
        if (array[i] === this) {
          array.splice(i, 1);
        }
      }
      this.element.removeClass("ui-droppable ui-droppable-disabled");
    },
    _setOption : function(option, value) {
      if ("accept" === option) {
        this.accept = $.isFunction(value) ? value : function(name) {
          return name.is(value);
        };
      }
      $.Widget.prototype._setOption.apply(this, arguments);
    },
    _activate : function(name) {
      var draggable = $.ui.ddmanager.current;
      if (this.options.activeClass) {
        this.element.addClass(this.options.activeClass);
      }
      if (draggable) {
        this._trigger("activate", name, this.ui(draggable));
      }
    },
    _deactivate : function(e) {
      var draggable = $.ui.ddmanager.current;
      if (this.options.activeClass) {
        this.element.removeClass(this.options.activeClass);
      }
      if (draggable) {
        this._trigger("deactivate", e, this.ui(draggable));
      }
    },
    _over : function(e) {
      var draggable = $.ui.ddmanager.current;
      if (draggable && (draggable.currentItem || draggable.element)[0] !== this.element[0] && this.accept.call(this.element[0], draggable.currentItem || draggable.element)) {
        if (this.options.hoverClass) {
          this.element.addClass(this.options.hoverClass);
        }
        this._trigger("over", e, this.ui(draggable));
      }
    },
    _out : function(e) {
      var draggable = $.ui.ddmanager.current;
      if (draggable && (draggable.currentItem || draggable.element)[0] !== this.element[0] && this.accept.call(this.element[0], draggable.currentItem || draggable.element)) {
        if (this.options.hoverClass) {
          this.element.removeClass(this.options.hoverClass);
        }
        this._trigger("out", e, this.ui(draggable));
      }
    },
    _drop : function(event, custom) {
      var draggable = custom || $.ui.ddmanager.current;
      /** @type {boolean} */
      var d = false;
      return draggable && (draggable.currentItem || draggable.element)[0] !== this.element[0] ? (this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function() {
        var inst = $.data(this, "ui-droppable");
        return inst.options.greedy && !inst.options.disabled && inst.options.scope === draggable.options.scope && inst.accept.call(inst.element[0], draggable.currentItem || draggable.element) && $.ui.intersect(draggable, $.extend(inst, {
          offset : inst.element.offset()
        }), inst.options.tolerance) ? (d = true, false) : void 0;
      }), d ? false : this.accept.call(this.element[0], draggable.currentItem || draggable.element) ? (this.options.activeClass && this.element.removeClass(this.options.activeClass), this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("drop", event, this.ui(draggable)), this.element) : false) : false;
    },
    ui : function(c) {
      return {
        draggable : c.currentItem || c.element,
        helper : c.helper,
        position : c.position,
        offset : c.positionAbs
      };
    }
  });
  /**
   * @param {!Object} draggable
   * @param {!Object} droppable
   * @param {?} toleranceMode
   * @return {?}
   */
  $.ui.intersect = function(draggable, droppable, toleranceMode) {
    if (!droppable.offset) {
      return false;
    }
    var length;
    var x0;
    var total = (draggable.positionAbs || draggable.position.absolute).left;
    var next = total + draggable.helperProportions.width;
    var y1 = (draggable.positionAbs || draggable.position.absolute).top;
    var y = y1 + draggable.helperProportions.height;
    var index = droppable.offset.left;
    var current = index + droppable.proportions.width;
    var y0 = droppable.offset.top;
    var y2 = y0 + droppable.proportions.height;
    switch(toleranceMode) {
      case "fit":
        return total >= index && current >= next && y1 >= y0 && y2 >= y;
      case "intersect":
        return total + draggable.helperProportions.width / 2 > index && current > next - draggable.helperProportions.width / 2 && y1 + draggable.helperProportions.height / 2 > y0 && y2 > y - draggable.helperProportions.height / 2;
      case "pointer":
        return length = (draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left, x0 = (draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top, x0 > y0 && y0 + droppable.proportions.height > x0 && length > index && index + droppable.proportions.width > length;
      case "touch":
        return (y1 >= y0 && y2 >= y1 || y >= y0 && y2 >= y || y0 > y1 && y > y2) && (total >= index && current >= total || next >= index && current >= next || index > total && next > current);
      default:
        return false;
    }
  };
  $.ui.ddmanager = {
    current : null,
    droppables : {
      "default" : []
    },
    prepareOffsets : function(t, event) {
      var i;
      var j;
      var m = $.ui.ddmanager.droppables[t.options.scope] || [];
      var name = event ? event.type : null;
      var _mutators = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();
      /** @type {number} */
      i = 0;
      a: for (; m.length > i; i++) {
        if (!(m[i].options.disabled || t && !m[i].accept.call(m[i].element[0], t.currentItem || t.element))) {
          /** @type {number} */
          j = 0;
          for (; _mutators.length > j; j++) {
            if (_mutators[j] === m[i].element[0]) {
              /** @type {number} */
              m[i].proportions.height = 0;
              continue a;
            }
          }
          /** @type {boolean} */
          m[i].visible = "none" !== m[i].element.css("display");
          if (m[i].visible) {
            if ("mousedown" === name) {
              m[i]._activate.call(m[i], event);
            }
            m[i].offset = m[i].element.offset();
            m[i].proportions = {
              width : m[i].element[0].offsetWidth,
              height : m[i].element[0].offsetHeight
            };
          }
        }
      }
    },
    drop : function(draggable, event) {
      /** @type {boolean} */
      var added = false;
      return $.each(($.ui.ddmanager.droppables[draggable.options.scope] || []).slice(), function() {
        if (this.options) {
          if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance)) {
            added = this._drop.call(this, event) || added;
          }
          if (!this.options.disabled && this.visible && this.accept.call(this.element[0], draggable.currentItem || draggable.element)) {
            /** @type {boolean} */
            this.isout = true;
            /** @type {boolean} */
            this.isover = false;
            this._deactivate.call(this, event);
          }
        }
      }), added;
    },
    dragStart : function(draggable, event) {
      draggable.element.parentsUntil("body").bind("scroll.droppable", function() {
        if (!draggable.options.refreshPositions) {
          $.ui.ddmanager.prepareOffsets(draggable, event);
        }
      });
    },
    drag : function(draggable, event) {
      if (draggable.options.refreshPositions) {
        $.ui.ddmanager.prepareOffsets(draggable, event);
      }
      $.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {
        if (!this.options.disabled && !this.greedyChild && this.visible) {
          var parentInstance;
          var scope;
          var $pickers;
          var intersects = $.ui.intersect(draggable, this, this.options.tolerance);
          if (intersects = !intersects && this.isover ? "isout" : intersects && !this.isover ? "isover" : null) {
            if (this.options.greedy) {
              scope = this.options.scope;
              $pickers = this.element.parents(":data(ui-droppable)").filter(function() {
                return $.data(this, "ui-droppable").options.scope === scope;
              });
              if ($pickers.length) {
                parentInstance = $.data($pickers[0], "ui-droppable");
                /** @type {boolean} */
                parentInstance.greedyChild = "isover" === intersects;
              }
            }
            if (parentInstance && "isover" === intersects) {
              /** @type {boolean} */
              parentInstance.isover = false;
              /** @type {boolean} */
              parentInstance.isout = true;
              parentInstance._out.call(parentInstance, event);
            }
            /** @type {boolean} */
            this[intersects] = true;
            /** @type {boolean} */
            this["isout" === intersects ? "isover" : "isout"] = false;
            this["isover" === intersects ? "_over" : "_out"].call(this, event);
            if (parentInstance && "isout" === intersects) {
              /** @type {boolean} */
              parentInstance.isout = false;
              /** @type {boolean} */
              parentInstance.isover = true;
              parentInstance._over.call(parentInstance, event);
            }
          }
        }
      });
    },
    dragStop : function(draggable, event) {
      draggable.element.parentsUntil("body").unbind("scroll.droppable");
      if (!draggable.options.refreshPositions) {
        $.ui.ddmanager.prepareOffsets(draggable, event);
      }
    }
  };
})(jQuery);
(function($) {
  /**
   * @param {?} s
   * @return {?}
   */
  function num(s) {
    return parseInt(s, 10) || 0;
  }
  /**
   * @param {?} value
   * @return {?}
   */
  function isNumber(value) {
    return !isNaN(parseInt(value, 10));
  }
  $.widget("ui.resizable", $.ui.mouse, {
    version : "1.10.3",
    widgetEventPrefix : "resize",
    options : {
      alsoResize : false,
      animate : false,
      animateDuration : "slow",
      animateEasing : "swing",
      aspectRatio : false,
      autoHide : false,
      containment : false,
      ghost : false,
      grid : false,
      handles : "e,s,se",
      helper : false,
      maxHeight : null,
      maxWidth : null,
      minHeight : 10,
      minWidth : 10,
      zIndex : 90,
      resize : null,
      start : null,
      stop : null
    },
    _create : function() {
      var rows;
      var i;
      var handle;
      var axis;
      var hname;
      var self = this;
      var o = this.options;
      if (this.element.addClass("ui-resizable"), $.extend(this, {
        _aspectRatio : !!o.aspectRatio,
        aspectRatio : o.aspectRatio,
        originalElement : this.element,
        _proportionallyResizeElements : [],
        _helper : o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
      }), this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i) && (this.element.wrap($("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
        position : this.element.css("position"),
        width : this.element.outerWidth(),
        height : this.element.outerHeight(),
        top : this.element.css("top"),
        left : this.element.css("left")
      })), this.element = this.element.parent().data("ui-resizable", this.element.data("ui-resizable")), this.elementIsWrapper = true, this.element.css({
        marginLeft : this.originalElement.css("marginLeft"),
        marginTop : this.originalElement.css("marginTop"),
        marginRight : this.originalElement.css("marginRight"),
        marginBottom : this.originalElement.css("marginBottom")
      }), this.originalElement.css({
        marginLeft : 0,
        marginTop : 0,
        marginRight : 0,
        marginBottom : 0
      }), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({
        position : "static",
        zoom : 1,
        display : "block"
      })), this.originalElement.css({
        margin : this.originalElement.css("margin")
      }), this._proportionallyResize()), this.handles = o.handles || ($(".ui-resizable-handle", this.element).length ? {
        n : ".ui-resizable-n",
        e : ".ui-resizable-e",
        s : ".ui-resizable-s",
        w : ".ui-resizable-w",
        se : ".ui-resizable-se",
        sw : ".ui-resizable-sw",
        ne : ".ui-resizable-ne",
        nw : ".ui-resizable-nw"
      } : "e,s,se"), this.handles.constructor === String) {
        if ("all" === this.handles) {
          /** @type {string} */
          this.handles = "n,e,s,w,se,sw,ne,nw";
        }
        rows = this.handles.split(",");
        this.handles = {};
        /** @type {number} */
        i = 0;
        for (; rows.length > i; i++) {
          handle = $.trim(rows[i]);
          /** @type {string} */
          hname = "ui-resizable-" + handle;
          axis = $("<div class='ui-resizable-handle " + hname + "'></div>");
          axis.css({
            zIndex : o.zIndex
          });
          if ("se" === handle) {
            axis.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
          }
          /** @type {string} */
          this.handles[handle] = ".ui-resizable-" + handle;
          this.element.append(axis);
        }
      }
      /**
       * @param {(Object|string)} target
       * @return {undefined}
       */
      this._renderAxis = function(target) {
        var i;
        var axis;
        var d;
        var windowDeltaOriginY;
        target = target || this.element;
        for (i in this.handles) {
          if (this.handles[i].constructor === String) {
            this.handles[i] = $(this.handles[i], this.element).show();
          }
          if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
            axis = $(this.handles[i], this.element);
            windowDeltaOriginY = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();
            /** @type {string} */
            d = ["padding", /ne|nw|n/.test(i) ? "Top" : /se|sw|s/.test(i) ? "Bottom" : /^e$/.test(i) ? "Right" : "Left"].join("");
            target.css(d, windowDeltaOriginY);
            this._proportionallyResize();
          }
          $(this.handles[i]).length;
        }
      };
      this._renderAxis(this.element);
      this._handles = $(".ui-resizable-handle", this.element).disableSelection();
      this._handles.mouseover(function() {
        if (!self.resizing) {
          if (this.className) {
            axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
          }
          self.axis = axis && axis[1] ? axis[1] : "se";
        }
      });
      if (o.autoHide) {
        this._handles.hide();
        $(this.element).addClass("ui-resizable-autohide").mouseenter(function() {
          if (!o.disabled) {
            $(this).removeClass("ui-resizable-autohide");
            self._handles.show();
          }
        }).mouseleave(function() {
          if (!(o.disabled || self.resizing)) {
            $(this).addClass("ui-resizable-autohide");
            self._handles.hide();
          }
        });
      }
      this._mouseInit();
    },
    _destroy : function() {
      this._mouseDestroy();
      var wrapper;
      /**
       * @param {?} obj
       * @return {undefined}
       */
      var _destroy = function(obj) {
        $(obj).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove();
      };
      return this.elementIsWrapper && (_destroy(this.element), wrapper = this.element, this.originalElement.css({
        position : wrapper.css("position"),
        width : wrapper.outerWidth(),
        height : wrapper.outerHeight(),
        top : wrapper.css("top"),
        left : wrapper.css("left")
      }).insertAfter(wrapper), wrapper.remove()), this.originalElement.css("resize", this.originalResizeStyle), _destroy(this.originalElement), this;
    },
    _mouseCapture : function(event) {
      var i;
      var handle;
      /** @type {boolean} */
      var g = false;
      for (i in this.handles) {
        handle = $(this.handles[i])[0];
        if (handle === event.target || $.contains(handle, event.target)) {
          /** @type {boolean} */
          g = true;
        }
      }
      return !this.options.disabled && g;
    },
    _mouseStart : function(event) {
      var curleft;
      var curtop;
      var value;
      var o = this.options;
      var elLocation = this.element.position();
      var el = this.element;
      return this.resizing = true, /absolute/.test(el.css("position")) ? el.css({
        position : "absolute",
        top : el.css("top"),
        left : el.css("left")
      }) : el.is(".ui-draggable") && el.css({
        position : "absolute",
        top : elLocation.top,
        left : elLocation.left
      }), this._renderProxy(), curleft = num(this.helper.css("left")), curtop = num(this.helper.css("top")), o.containment && (curleft = curleft + ($(o.containment).scrollLeft() || 0), curtop = curtop + ($(o.containment).scrollTop() || 0)), this.offset = this.helper.offset(), this.position = {
        left : curleft,
        top : curtop
      }, this.size = this._helper ? {
        width : el.outerWidth(),
        height : el.outerHeight()
      } : {
        width : el.width(),
        height : el.height()
      }, this.originalSize = this._helper ? {
        width : el.outerWidth(),
        height : el.outerHeight()
      } : {
        width : el.width(),
        height : el.height()
      }, this.originalPosition = {
        left : curleft,
        top : curtop
      }, this.sizeDiff = {
        width : el.outerWidth() - el.width(),
        height : el.outerHeight() - el.height()
      }, this.originalMousePosition = {
        left : event.pageX,
        top : event.pageY
      }, this.aspectRatio = "number" == typeof o.aspectRatio ? o.aspectRatio : this.originalSize.width / this.originalSize.height || 1, value = $(".ui-resizable-" + this.axis).css("cursor"), $("body").css("cursor", "auto" === value ? this.axis + "-resize" : value), el.addClass("ui-resizable-resizing"), this._propagate("start", event), true;
    },
    _mouseDrag : function(event) {
      var data;
      var el = this.helper;
      var css = {};
      var smp = this.originalMousePosition;
      var prevTop = this.position.top;
      var prevLeft = this.position.left;
      var prevWidth = this.size.width;
      var prevHeight = this.size.height;
      /** @type {number} */
      var dx = event.pageX - smp.left || 0;
      /** @type {number} */
      smp = event.pageY - smp.top || 0;
      var trigger = this._change[this.axis];
      return trigger ? (data = trigger.apply(this, [event, dx, smp]), this._updateVirtualBoundaries(event.shiftKey), (this._aspectRatio || event.shiftKey) && (data = this._updateRatio(data, event)), data = this._respectSize(data, event), this._updateCache(data), this._propagate("resize", event), this.position.top !== prevTop && (css.top = this.position.top + "px"), this.position.left !== prevLeft && (css.left = this.position.left + "px"), this.size.width !== prevWidth && (css.width = this.size.width + 
      "px"), this.size.height !== prevHeight && (css.height = this.size.height + "px"), el.css(css), !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(), $.isEmptyObject(css) || this._trigger("resize", event, this.ui()), false) : false;
    },
    _mouseStop : function(event) {
      /** @type {boolean} */
      this.resizing = false;
      var pr;
      var ista;
      var paddingAndBorders;
      var soffsetw;
      var s;
      var _ileft;
      var tabPadding;
      var options = this.options;
      return this._helper && (pr = this._proportionallyResizeElements, ista = pr.length && /textarea/i.test(pr[0].nodeName), paddingAndBorders = ista && $.ui.hasScroll(pr[0], "left") ? 0 : this.sizeDiff.height, soffsetw = ista ? 0 : this.sizeDiff.width, s = {
        width : this.helper.width() - soffsetw,
        height : this.helper.height() - paddingAndBorders
      }, _ileft = parseInt(this.element.css("left"), 10) + (this.position.left - this.originalPosition.left) || null, tabPadding = parseInt(this.element.css("top"), 10) + (this.position.top - this.originalPosition.top) || null, options.animate || this.element.css($.extend(s, {
        top : tabPadding,
        left : _ileft
      })), this.helper.height(this.size.height), this.helper.width(this.size.width), this._helper && !options.animate && this._proportionallyResize()), $("body").css("cursor", "auto"), this.element.removeClass("ui-resizable-resizing"), this._propagate("stop", event), this._helper && this.helper.remove(), false;
    },
    _updateVirtualBoundaries : function(forceAspectRatio) {
      var pMinWidth;
      var pMaxWidth;
      var pMinHeight;
      var pMaxHeight;
      var b;
      b = this.options;
      b = {
        minWidth : isNumber(b.minWidth) ? b.minWidth : 0,
        maxWidth : isNumber(b.maxWidth) ? b.maxWidth : 1 / 0,
        minHeight : isNumber(b.minHeight) ? b.minHeight : 0,
        maxHeight : isNumber(b.maxHeight) ? b.maxHeight : 1 / 0
      };
      if (this._aspectRatio || forceAspectRatio) {
        /** @type {number} */
        pMinWidth = b.minHeight * this.aspectRatio;
        /** @type {number} */
        pMinHeight = b.minWidth / this.aspectRatio;
        /** @type {number} */
        pMaxWidth = b.maxHeight * this.aspectRatio;
        /** @type {number} */
        pMaxHeight = b.maxWidth / this.aspectRatio;
        if (pMinWidth > b.minWidth) {
          /** @type {number} */
          b.minWidth = pMinWidth;
        }
        if (pMinHeight > b.minHeight) {
          /** @type {number} */
          b.minHeight = pMinHeight;
        }
        if (b.maxWidth > pMaxWidth) {
          /** @type {number} */
          b.maxWidth = pMaxWidth;
        }
        if (b.maxHeight > pMaxHeight) {
          /** @type {number} */
          b.maxHeight = pMaxHeight;
        }
      }
      this._vBoundaries = b;
    },
    _updateCache : function(data) {
      this.offset = this.helper.offset();
      if (isNumber(data.left)) {
        this.position.left = data.left;
      }
      if (isNumber(data.top)) {
        this.position.top = data.top;
      }
      if (isNumber(data.height)) {
        this.size.height = data.height;
      }
      if (isNumber(data.width)) {
        this.size.width = data.width;
      }
    },
    _updateRatio : function(data) {
      var cpos = this.position;
      var csize = this.size;
      var a = this.axis;
      return isNumber(data.height) ? data.width = data.height * this.aspectRatio : isNumber(data.width) && (data.height = data.width / this.aspectRatio), "sw" === a && (data.left = cpos.left + (csize.width - data.width), data.top = null), "nw" === a && (data.top = cpos.top + (csize.height - data.height), data.left = cpos.left + (csize.width - data.width)), data;
    },
    _respectSize : function(data) {
      var o = this._vBoundaries;
      var a = this.axis;
      var k = isNumber(data.width) && o.maxWidth && o.maxWidth < data.width;
      var b = isNumber(data.height) && o.maxHeight && o.maxHeight < data.height;
      var parenDepth = isNumber(data.width) && o.minWidth && o.minWidth > data.width;
      var bindings = isNumber(data.height) && o.minHeight && o.minHeight > data.height;
      var dw = this.originalPosition.left + this.originalSize.width;
      var dh = this.position.top + this.size.height;
      /** @type {boolean} */
      var d = /sw|nw|w/.test(a);
      /** @type {boolean} */
      a = /nw|ne|n/.test(a);
      return parenDepth && (data.width = o.minWidth), bindings && (data.height = o.minHeight), k && (data.width = o.maxWidth), b && (data.height = o.maxHeight), parenDepth && d && (data.left = dw - o.minWidth), k && d && (data.left = dw - o.maxWidth), bindings && a && (data.top = dh - o.minHeight), b && a && (data.top = dh - o.maxHeight), data.width || data.height || data.left || !data.top ? data.width || data.height || data.top || !data.left || (data.left = null) : data.top = null, data;
    },
    _proportionallyResize : function() {
      if (this._proportionallyResizeElements.length) {
        var i;
        var j;
        var v1;
        var bc_check;
        var prel;
        var element = this.helper || this.element;
        /** @type {number} */
        i = 0;
        for (; this._proportionallyResizeElements.length > i; i++) {
          if (prel = this._proportionallyResizeElements[i], !this.borderDif) {
            /** @type {!Array} */
            this.borderDif = [];
            /** @type {!Array} */
            v1 = [prel.css("borderTopWidth"), prel.css("borderRightWidth"), prel.css("borderBottomWidth"), prel.css("borderLeftWidth")];
            /** @type {!Array} */
            bc_check = [prel.css("paddingTop"), prel.css("paddingRight"), prel.css("paddingBottom"), prel.css("paddingLeft")];
            /** @type {number} */
            j = 0;
            for (; v1.length > j; j++) {
              /** @type {number} */
              this.borderDif[j] = (parseInt(v1[j], 10) || 0) + (parseInt(bc_check[j], 10) || 0);
            }
          }
          prel.css({
            height : element.height() - this.borderDif[0] - this.borderDif[2] || 0,
            width : element.width() - this.borderDif[1] - this.borderDif[3] || 0
          });
        }
      }
    },
    _renderProxy : function() {
      var options = this.options;
      this.elementOffset = this.element.offset();
      if (this._helper) {
        this.helper = this.helper || $("<div style='overflow:hidden;'></div>");
        this.helper.addClass(this._helper).css({
          width : this.element.outerWidth() - 1,
          height : this.element.outerHeight() - 1,
          position : "absolute",
          left : this.elementOffset.left + "px",
          top : this.elementOffset.top + "px",
          zIndex : ++options.zIndex
        });
        this.helper.appendTo("body").disableSelection();
      } else {
        this.helper = this.element;
      }
    },
    _change : {
      e : function(i, dx) {
        return {
          width : this.originalSize.width + dx
        };
      },
      w : function(name, value) {
        return {
          left : this.originalPosition.left + value,
          width : this.originalSize.width - value
        };
      },
      n : function(name, n, y) {
        return {
          top : this.originalPosition.top + y,
          height : this.originalSize.height - y
        };
      },
      s : function(event, dx, dy) {
        return {
          height : this.originalSize.height + dy
        };
      },
      se : function(event, dx, dy) {
        return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
      },
      sw : function(event, dx, dy) {
        return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
      },
      ne : function(dx, dy, event) {
        return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [dx, dy, event]));
      },
      nw : function(event, dx, dy) {
        return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
      }
    },
    _propagate : function(event, name) {
      $.ui.plugin.call(this, event, [name, this.ui()]);
      if ("resize" !== event) {
        this._trigger(event, name, this.ui());
      }
    },
    plugins : {},
    ui : function() {
      return {
        originalElement : this.originalElement,
        element : this.element,
        helper : this.helper,
        position : this.position,
        size : this.size,
        originalSize : this.originalSize,
        originalPosition : this.originalPosition
      };
    }
  });
  $.ui.plugin.add("resizable", "animate", {
    stop : function(event) {
      var that = $(this).data("ui-resizable");
      var o = that.options;
      var pr = that._proportionallyResizeElements;
      var options = pr.length && /textarea/i.test(pr[0].nodeName);
      var left = options && $.ui.hasScroll(pr[0], "left") ? 0 : that.sizeDiff.height;
      options = {
        width : that.size.width - (options ? 0 : that.sizeDiff.width),
        height : that.size.height - left
      };
      /** @type {(null|number)} */
      left = parseInt(that.element.css("left"), 10) + (that.position.left - that.originalPosition.left) || null;
      /** @type {(null|number)} */
      var top = parseInt(that.element.css("top"), 10) + (that.position.top - that.originalPosition.top) || null;
      that.element.animate($.extend(options, top && left ? {
        top : top,
        left : left
      } : {}), {
        duration : o.animateDuration,
        easing : o.animateEasing,
        step : function() {
          var data = {
            width : parseInt(that.element.css("width"), 10),
            height : parseInt(that.element.css("height"), 10),
            top : parseInt(that.element.css("top"), 10),
            left : parseInt(that.element.css("left"), 10)
          };
          if (pr && pr.length) {
            $(pr[0]).css({
              width : data.width,
              height : data.height
            });
          }
          that._updateCache(data);
          that._propagate("resize", event);
        }
      });
    }
  });
  $.ui.plugin.add("resizable", "containment", {
    start : function() {
      var element;
      var p;
      var co;
      var ch;
      var cw;
      var width;
      var height;
      var that = $(this).data("ui-resizable");
      var ce = that.element;
      var oc = that.options.containment;
      if (ce = oc instanceof $ ? oc.get(0) : /parent/.test(oc) ? ce.parent().get(0) : oc) {
        that.containerElement = $(ce);
        if (/document/.test(oc) || oc === document) {
          that.containerOffset = {
            left : 0,
            top : 0
          };
          that.containerPosition = {
            left : 0,
            top : 0
          };
          that.parentData = {
            element : $(document),
            left : 0,
            top : 0,
            width : $(document).width(),
            height : $(document).height() || document.body.parentNode.scrollHeight
          };
        } else {
          element = $(ce);
          /** @type {!Array} */
          p = [];
          $(["Top", "Right", "Left", "Bottom"]).each(function(i, name) {
            p[i] = num(element.css("padding" + name));
          });
          that.containerOffset = element.offset();
          that.containerPosition = element.position();
          that.containerSize = {
            height : element.innerHeight() - p[3],
            width : element.innerWidth() - p[1]
          };
          co = that.containerOffset;
          /** @type {number} */
          ch = that.containerSize.height;
          /** @type {number} */
          cw = that.containerSize.width;
          width = $.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw;
          height = $.ui.hasScroll(ce) ? ce.scrollHeight : ch;
          that.parentData = {
            element : ce,
            left : co.left,
            top : co.top,
            width : width,
            height : height
          };
        }
      }
    },
    resize : function(event) {
      var x;
      var co;
      var _ref1;
      var boundaries;
      var that = $(this).data("ui-resizable");
      x = that.options;
      co = that.containerOffset;
      _ref1 = that.position;
      event = that._aspectRatio || event.shiftKey;
      boundaries = {
        top : 0,
        left : 0
      };
      var ce = that.containerElement;
      if (ce[0] !== document && /static/.test(ce.css("position"))) {
        boundaries = co;
      }
      if (_ref1.left < (that._helper ? co.left : 0)) {
        that.size.width += that._helper ? that.position.left - co.left : that.position.left - boundaries.left;
        if (event) {
          /** @type {number} */
          that.size.height = that.size.width / that.aspectRatio;
        }
        that.position.left = x.helper ? co.left : 0;
      }
      if (_ref1.top < (that._helper ? co.top : 0)) {
        that.size.height += that._helper ? that.position.top - co.top : that.position.top;
        if (event) {
          /** @type {number} */
          that.size.width = that.size.height * that.aspectRatio;
        }
        that.position.top = that._helper ? co.top : 0;
      }
      that.offset.left = that.parentData.left + that.position.left;
      that.offset.top = that.parentData.top + that.position.top;
      /** @type {number} */
      x = Math.abs(that.offset.left - boundaries.left + that.sizeDiff.width);
      /** @type {number} */
      co = Math.abs((that._helper ? that.offset.top - boundaries.top : that.offset.top - co.top) + that.sizeDiff.height);
      /** @type {boolean} */
      _ref1 = that.containerElement.get(0) === that.element.parent().get(0);
      /** @type {boolean} */
      boundaries = /relative|absolute/.test(that.containerElement.css("position"));
      if (_ref1 && boundaries) {
        /** @type {number} */
        x = x - that.parentData.left;
      }
      if (x + that.size.width >= that.parentData.width) {
        /** @type {number} */
        that.size.width = that.parentData.width - x;
        if (event) {
          /** @type {number} */
          that.size.height = that.size.width / that.aspectRatio;
        }
      }
      if (co + that.size.height >= that.parentData.height) {
        /** @type {number} */
        that.size.height = that.parentData.height - co;
        if (event) {
          /** @type {number} */
          that.size.width = that.size.height * that.aspectRatio;
        }
      }
    },
    stop : function() {
      var that = $(this).data("ui-resizable");
      var options = that.options;
      var co = that.containerOffset;
      var cop = that.containerPosition;
      var ce = that.containerElement;
      var f = $(that.helper);
      var ho = f.offset();
      /** @type {number} */
      var neededWidth = f.outerWidth() - that.sizeDiff.width;
      /** @type {number} */
      f = f.outerHeight() - that.sizeDiff.height;
      if (that._helper && !options.animate && /relative/.test(ce.css("position"))) {
        $(this).css({
          left : ho.left - cop.left - co.left,
          width : neededWidth,
          height : f
        });
      }
      if (that._helper && !options.animate && /static/.test(ce.css("position"))) {
        $(this).css({
          left : ho.left - cop.left - co.left,
          width : neededWidth,
          height : f
        });
      }
    }
  });
  $.ui.plugin.add("resizable", "alsoResize", {
    start : function() {
      var o = $(this).data("ui-resizable").options;
      /**
       * @param {?} exp
       * @return {undefined}
       */
      var _store = function(exp) {
        $(exp).each(function() {
          var el = $(this);
          el.data("ui-resizable-alsoresize", {
            width : parseInt(el.width(), 10),
            height : parseInt(el.height(), 10),
            left : parseInt(el.css("left"), 10),
            top : parseInt(el.css("top"), 10)
          });
        });
      };
      if ("object" != typeof o.alsoResize || o.alsoResize.parentNode) {
        _store(o.alsoResize);
      } else {
        if (o.alsoResize.length) {
          o.alsoResize = o.alsoResize[0];
          _store(o.alsoResize);
        } else {
          $.each(o.alsoResize, function(exp) {
            _store(exp);
          });
        }
      }
    },
    resize : function(that, object) {
      that = $(this).data("ui-resizable");
      var o = that.options;
      var os = that.originalSize;
      var op = that.originalPosition;
      var delta = {
        height : that.size.height - os.height || 0,
        width : that.size.width - os.width || 0,
        top : that.position.top - op.top || 0,
        left : that.position.left - op.left || 0
      };
      /**
       * @param {?} exp
       * @param {!Object} c
       * @return {undefined}
       */
      var _alsoResize = function(exp, c) {
        $(exp).each(function() {
          var helper = $(this);
          var start = $(this).data("ui-resizable-alsoresize");
          var labels = {};
          var css = c && c.length ? c : helper.parents(object.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
          $.each(css, function(otherslabel, j) {
            if ((otherslabel = (start[j] || 0) + (delta[j] || 0)) && 0 <= otherslabel) {
              labels[j] = otherslabel || null;
            }
          });
          helper.css(labels);
        });
      };
      if ("object" != typeof o.alsoResize || o.alsoResize.nodeType) {
        _alsoResize(o.alsoResize);
      } else {
        $.each(o.alsoResize, function(exp, c) {
          _alsoResize(exp, c);
        });
      }
    },
    stop : function() {
      $(this).removeData("resizable-alsoresize");
    }
  });
  $.ui.plugin.add("resizable", "ghost", {
    start : function() {
      var that = $(this).data("ui-resizable");
      var params = that.options;
      var cs = that.size;
      that.ghost = that.originalElement.clone();
      that.ghost.css({
        opacity : .25,
        display : "block",
        position : "relative",
        height : cs.height,
        width : cs.width,
        margin : 0,
        left : 0,
        top : 0
      }).addClass("ui-resizable-ghost").addClass("string" == typeof params.ghost ? params.ghost : "");
      that.ghost.appendTo(that.helper);
    },
    resize : function() {
      var that = $(this).data("ui-resizable");
      if (that.ghost) {
        that.ghost.css({
          position : "relative",
          height : that.size.height,
          width : that.size.width
        });
      }
    },
    stop : function() {
      var that = $(this).data("ui-resizable");
      if (that.ghost && that.helper) {
        that.helper.get(0).removeChild(that.ghost.get(0));
      }
    }
  });
  $.ui.plugin.add("resizable", "grid", {
    resize : function() {
      var that = $(this).data("ui-resizable");
      var options = that.options;
      var d = that.size;
      var s = that.originalSize;
      var rect = that.originalPosition;
      var a = that.axis;
      var g = "number" == typeof options.grid ? [options.grid, options.grid] : options.grid;
      var distance = g[0] || 1;
      var c = g[1] || 1;
      /** @type {number} */
      var x = Math.round((d.width - s.width) / distance) * distance;
      /** @type {number} */
      d = Math.round((d.height - s.height) / c) * c;
      var width = s.width + x;
      s = s.height + d;
      var n = options.maxWidth && width > options.maxWidth;
      var u = options.maxHeight && s > options.maxHeight;
      var ox = options.minWidth && options.minWidth > width;
      var w = options.minHeight && options.minHeight > s;
      options.grid = g;
      if (ox) {
        width = width + distance;
      }
      if (w) {
        s = s + c;
      }
      if (n) {
        /** @type {number} */
        width = width - distance;
      }
      if (u) {
        /** @type {number} */
        s = s - c;
      }
      if (/^(se|s|e)$/.test(a)) {
        that.size.width = width;
        that.size.height = s;
      } else {
        if (/^(ne)$/.test(a)) {
          that.size.width = width;
          that.size.height = s;
          /** @type {number} */
          that.position.top = rect.top - d;
        } else {
          if (/^(sw)$/.test(a)) {
            that.size.width = width;
            that.size.height = s;
            /** @type {number} */
            that.position.left = rect.left - x;
          } else {
            that.size.width = width;
            that.size.height = s;
            /** @type {number} */
            that.position.top = rect.top - d;
            /** @type {number} */
            that.position.left = rect.left - x;
          }
        }
      }
    }
  });
})(jQuery);
(function($) {
  $.widget("ui.selectable", $.ui.mouse, {
    version : "1.10.3",
    options : {
      appendTo : "body",
      autoRefresh : true,
      distance : 0,
      filter : "*",
      tolerance : "touch",
      selected : null,
      selecting : null,
      start : null,
      stop : null,
      unselected : null,
      unselecting : null
    },
    _create : function() {
      var selectees;
      var f = this;
      this.element.addClass("ui-selectable");
      /** @type {boolean} */
      this.dragged = false;
      /**
       * @return {undefined}
       */
      this.refresh = function() {
        selectees = $(f.options.filter, f.element[0]);
        selectees.addClass("ui-selectee");
        selectees.each(function() {
          var $this = $(this);
          var elLocation = $this.offset();
          $.data(this, "selectable-item", {
            element : this,
            $element : $this,
            left : elLocation.left,
            top : elLocation.top,
            right : elLocation.left + $this.outerWidth(),
            bottom : elLocation.top + $this.outerHeight(),
            startselected : false,
            selected : $this.hasClass("ui-selected"),
            selecting : $this.hasClass("ui-selecting"),
            unselecting : $this.hasClass("ui-unselecting")
          });
        });
      };
      this.refresh();
      this.selectees = selectees.addClass("ui-selectee");
      this._mouseInit();
      this.helper = $("<div class='ui-selectable-helper'></div>");
    },
    _destroy : function() {
      this.selectees.removeClass("ui-selectee").removeData("selectable-item");
      this.element.removeClass("ui-selectable ui-selectable-disabled");
      this._mouseDestroy();
    },
    _mouseStart : function(e) {
      var self = this;
      var options = this.options;
      /** @type {!Array} */
      this.opos = [e.pageX, e.pageY];
      if (!this.options.disabled) {
        this.selectees = $(options.filter, this.element[0]);
        this._trigger("start", e);
        $(options.appendTo).append(this.helper);
        this.helper.css({
          left : e.pageX,
          top : e.pageY,
          width : 0,
          height : 0
        });
        if (options.autoRefresh) {
          this.refresh();
        }
        this.selectees.filter(".ui-selected").each(function() {
          var selectee = $.data(this, "selectable-item");
          /** @type {boolean} */
          selectee.startselected = true;
          if (!(e.metaKey || e.ctrlKey)) {
            selectee.$element.removeClass("ui-selected");
            /** @type {boolean} */
            selectee.selected = false;
            selectee.$element.addClass("ui-unselecting");
            /** @type {boolean} */
            selectee.unselecting = true;
            self._trigger("unselecting", e, {
              unselecting : selectee.element
            });
          }
        });
        $(e.target).parents().addBack().each(function() {
          var doSelect;
          var selectee = $.data(this, "selectable-item");
          return selectee ? (doSelect = !e.metaKey && !e.ctrlKey || !selectee.$element.hasClass("ui-selected"), selectee.$element.removeClass(doSelect ? "ui-unselecting" : "ui-selected").addClass(doSelect ? "ui-selecting" : "ui-unselecting"), selectee.unselecting = !doSelect, selectee.selecting = doSelect, selectee.selected = doSelect, doSelect ? self._trigger("selecting", e, {
            selecting : selectee.element
          }) : self._trigger("unselecting", e, {
            unselecting : selectee.element
          }), false) : void 0;
        });
      }
    },
    _mouseDrag : function(event) {
      if (this.dragged = true, !this.options.disabled) {
        var tmp;
        var self = this;
        var options = this.options;
        var x1 = this.opos[0];
        var y1 = this.opos[1];
        var x2 = event.pageX;
        var y2 = event.pageY;
        return x1 > x2 && (tmp = x2, x2 = x1, x1 = tmp), y1 > y2 && (tmp = y2, y2 = y1, y1 = tmp), this.helper.css({
          left : x1,
          top : y1,
          width : x2 - x1,
          height : y2 - y1
        }), this.selectees.each(function() {
          var selectee = $.data(this, "selectable-item");
          /** @type {boolean} */
          var m = false;
          if (selectee && selectee.element !== self.element[0]) {
            if ("touch" === options.tolerance) {
              /** @type {boolean} */
              m = !(selectee.left > x2 || x1 > selectee.right || selectee.top > y2 || y1 > selectee.bottom);
            } else {
              if ("fit" === options.tolerance) {
                /** @type {boolean} */
                m = selectee.left > x1 && x2 > selectee.right && selectee.top > y1 && y2 > selectee.bottom;
              }
            }
            if (m) {
              if (selectee.selected) {
                selectee.$element.removeClass("ui-selected");
                /** @type {boolean} */
                selectee.selected = false;
              }
              if (selectee.unselecting) {
                selectee.$element.removeClass("ui-unselecting");
                /** @type {boolean} */
                selectee.unselecting = false;
              }
              if (!selectee.selecting) {
                selectee.$element.addClass("ui-selecting");
                /** @type {boolean} */
                selectee.selecting = true;
                self._trigger("selecting", event, {
                  selecting : selectee.element
                });
              }
            } else {
              if (selectee.selecting) {
                if ((event.metaKey || event.ctrlKey) && selectee.startselected) {
                  selectee.$element.removeClass("ui-selecting");
                  /** @type {boolean} */
                  selectee.selecting = false;
                  selectee.$element.addClass("ui-selected");
                  /** @type {boolean} */
                  selectee.selected = true;
                } else {
                  selectee.$element.removeClass("ui-selecting");
                  /** @type {boolean} */
                  selectee.selecting = false;
                  if (selectee.startselected) {
                    selectee.$element.addClass("ui-unselecting");
                    /** @type {boolean} */
                    selectee.unselecting = true;
                  }
                  self._trigger("unselecting", event, {
                    unselecting : selectee.element
                  });
                }
              }
              if (selectee.selected) {
                if (!(event.metaKey || event.ctrlKey || selectee.startselected)) {
                  selectee.$element.removeClass("ui-selected");
                  /** @type {boolean} */
                  selectee.selected = false;
                  selectee.$element.addClass("ui-unselecting");
                  /** @type {boolean} */
                  selectee.unselecting = true;
                  self._trigger("unselecting", event, {
                    unselecting : selectee.element
                  });
                }
              }
            }
          }
        }), false;
      }
    },
    _mouseStop : function(event) {
      var self = this;
      return this.dragged = false, $(".ui-unselecting", this.element[0]).each(function() {
        var selectee = $.data(this, "selectable-item");
        selectee.$element.removeClass("ui-unselecting");
        /** @type {boolean} */
        selectee.unselecting = false;
        /** @type {boolean} */
        selectee.startselected = false;
        self._trigger("unselected", event, {
          unselected : selectee.element
        });
      }), $(".ui-selecting", this.element[0]).each(function() {
        var selectee = $.data(this, "selectable-item");
        selectee.$element.removeClass("ui-selecting").addClass("ui-selected");
        /** @type {boolean} */
        selectee.selecting = false;
        /** @type {boolean} */
        selectee.selected = true;
        /** @type {boolean} */
        selectee.startselected = true;
        self._trigger("selected", event, {
          selected : selectee.element
        });
      }), this._trigger("stop", event), this.helper.remove(), false;
    }
  });
})(jQuery);
(function($) {
  /**
   * @param {!Object} b
   * @param {!Object} a
   * @param {!Object} size
   * @return {?}
   */
  function isOverAxis(b, a, size) {
    return b > a && a + size > b;
  }
  /**
   * @param {!Object} item
   * @return {?}
   */
  function isFloating(item) {
    return /left|right/.test(item.css("float")) || /inline|table-cell/.test(item.css("display"));
  }
  $.widget("ui.sortable", $.ui.mouse, {
    version : "1.10.3",
    widgetEventPrefix : "sort",
    ready : false,
    options : {
      appendTo : "parent",
      axis : false,
      connectWith : false,
      containment : false,
      cursor : "auto",
      cursorAt : false,
      dropOnEmpty : true,
      forcePlaceholderSize : false,
      forceHelperSize : false,
      grid : false,
      handle : false,
      helper : "original",
      items : "> *",
      opacity : false,
      placeholder : false,
      revert : false,
      scroll : true,
      scrollSensitivity : 20,
      scrollSpeed : 20,
      scope : "default",
      tolerance : "intersect",
      zIndex : 1E3,
      activate : null,
      beforeStop : null,
      change : null,
      deactivate : null,
      out : null,
      over : null,
      receive : null,
      remove : null,
      sort : null,
      start : null,
      stop : null,
      update : null
    },
    _create : function() {
      var options = this.options;
      this.containerCache = {};
      this.element.addClass("ui-sortable");
      this.refresh();
      this.floating = this.items.length ? "x" === options.axis || isFloating(this.items[0].item) : false;
      this.offset = this.element.offset();
      this._mouseInit();
      /** @type {boolean} */
      this.ready = true;
    },
    _destroy : function() {
      this.element.removeClass("ui-sortable ui-sortable-disabled");
      this._mouseDestroy();
      /** @type {number} */
      var j = this.items.length - 1;
      for (; 0 <= j; j--) {
        this.items[j].item.removeData(this.widgetName + "-item");
      }
      return this;
    },
    _setOption : function(value, option) {
      if ("disabled" === value) {
        /** @type {string} */
        this.options[value] = option;
        this.widget().toggleClass("ui-sortable-disabled", !!option);
      } else {
        $.Widget.prototype._setOption.apply(this, arguments);
      }
    },
    _mouseCapture : function(event, overrideHandle) {
      /** @type {null} */
      var currentItem = null;
      /** @type {boolean} */
      var g = false;
      var that = this;
      return this.reverting ? false : this.options.disabled || "static" === this.options.type ? false : (this._refreshItems(event), $(event.target).parents().each(function() {
        return $.data(this, that.widgetName + "-item") === that ? (currentItem = $(this), false) : void 0;
      }), $.data(event.target, that.widgetName + "-item") === that && (currentItem = $(event.target)), currentItem ? !this.options.handle || overrideHandle || ($(this.options.handle, currentItem).find("*").addBack().each(function() {
        if (this === event.target) {
          /** @type {boolean} */
          g = true;
        }
      }), g) ? (this.currentItem = currentItem, this._removeCurrentsFromItems(), true) : false : false);
    },
    _mouseStart : function(event, o, i) {
      var body;
      o = this.options;
      if (this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(event), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {
        top : this.offset.top - this.margins.top,
        left : this.offset.left - this.margins.left
      }, $.extend(this.offset, {
        click : {
          left : event.pageX - this.offset.left,
          top : event.pageY - this.offset.top
        },
        parent : this._getParentOffset(),
        relative : this._getRelativeOffset()
      }), this.helper.css("position", "absolute"), this.cssPosition = this.helper.css("position"), this.originalPosition = this._generatePosition(event), this.originalPageX = event.pageX, this.originalPageY = event.pageY, o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt), this.domPosition = {
        prev : this.currentItem.prev()[0],
        parent : this.currentItem.parent()[0]
      }, this.helper[0] !== this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), o.containment && this._setContainment(), o.cursor && "auto" !== o.cursor && (body = this.document.find("body"), this.storedCursor = body.css("cursor"), body.css("cursor", o.cursor), this.storedStylesheet = $("<style>*{ cursor: " + o.cursor + " !important; }</style>").appendTo(body)), o.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", 
      o.opacity)), o.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", o.zIndex)), this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", event, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions(), !i) {
        /** @type {number} */
        i = this.containers.length - 1;
        for (; 0 <= i; i--) {
          this.containers[i]._trigger("activate", event, this._uiHash(this));
        }
      }
      return $.ui.ddmanager && ($.ui.ddmanager.current = this), $.ui.ddmanager && !o.dropBehaviour && $.ui.ddmanager.prepareOffsets(this, event), this.dragging = true, this.helper.addClass("ui-sortable-helper"), this._mouseDrag(event), true;
    },
    _mouseDrag : function(event) {
      var o;
      var item;
      var itemElement;
      var number;
      o = this.options;
      /** @type {boolean} */
      var scrolled = false;
      this.position = this._generatePosition(event);
      this.positionAbs = this._convertPositionTo("absolute");
      if (!this.lastPositionAbs) {
        this.lastPositionAbs = this.positionAbs;
      }
      if (this.options.scroll) {
        if (this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName) {
          if (this.overflowOffset.top + this.scrollParent[0].offsetHeight - event.pageY < o.scrollSensitivity) {
            this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
          } else {
            if (event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
              /** @type {number} */
              this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
            }
          }
          if (this.overflowOffset.left + this.scrollParent[0].offsetWidth - event.pageX < o.scrollSensitivity) {
            this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
          } else {
            if (event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
              /** @type {number} */
              this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
            }
          }
        } else {
          if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
            scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
          } else {
            if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
              scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
            }
          }
          if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
            scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
          } else {
            if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
              scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
            }
          }
        }
        if (false !== scrolled && $.ui.ddmanager && !o.dropBehaviour) {
          $.ui.ddmanager.prepareOffsets(this, event);
        }
      }
      this.positionAbs = this._convertPositionTo("absolute");
      if (!(this.options.axis && "y" === this.options.axis)) {
        /** @type {string} */
        this.helper[0].style.left = this.position.left + "px";
      }
      if (!(this.options.axis && "x" === this.options.axis)) {
        /** @type {string} */
        this.helper[0].style.top = this.position.top + "px";
      }
      /** @type {number} */
      o = this.items.length - 1;
      for (; 0 <= o; o--) {
        if (item = this.items[o], itemElement = item.item[0], number = this._intersectsWithPointer(item), number && item.instance === this.currentContainer && itemElement !== this.currentItem[0] && this.placeholder[1 === number ? "next" : "prev"]()[0] !== itemElement && !$.contains(this.placeholder[0], itemElement) && ("semi-dynamic" === this.options.type ? !$.contains(this.element[0], itemElement) : true)) {
          if (this.direction = 1 === number ? "down" : "up", "pointer" !== this.options.tolerance && !this._intersectsWithSides(item)) {
            break;
          }
          this._rearrange(event, item);
          this._trigger("change", event, this._uiHash());
          break;
        }
      }
      return this._contactContainers(event), $.ui.ddmanager && $.ui.ddmanager.drag(this, event), this._trigger("sort", event, this._uiHash()), this.lastPositionAbs = this.positionAbs, false;
    },
    _mouseStop : function(event, e) {
      if (event) {
        if ($.ui.ddmanager && !this.options.dropBehaviour && $.ui.ddmanager.drop(this, event), this.options.revert) {
          var that = this;
          e = this.placeholder.offset();
          var value = this.options.axis;
          var h = {};
          if (!(value && "x" !== value)) {
            h.left = e.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft);
          }
          if (!(value && "y" !== value)) {
            h.top = e.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop);
          }
          /** @type {boolean} */
          this.reverting = true;
          $(this.helper).animate(h, parseInt(this.options.revert, 10) || 500, function() {
            that._clear(event);
          });
        } else {
          this._clear(event, e);
        }
        return false;
      }
    },
    cancel : function() {
      if (this.dragging) {
        this._mouseUp({
          target : null
        });
        if ("original" === this.options.helper) {
          this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
        } else {
          this.currentItem.show();
        }
        /** @type {number} */
        var i = this.containers.length - 1;
        for (; 0 <= i; i--) {
          this.containers[i]._trigger("deactivate", null, this._uiHash(this));
          if (this.containers[i].containerCache.over) {
            this.containers[i]._trigger("out", null, this._uiHash(this));
            /** @type {number} */
            this.containers[i].containerCache.over = 0;
          }
        }
      }
      return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), "original" !== this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(), $.extend(this, {
        helper : null,
        dragging : false,
        reverting : false,
        _noFinalSort : null
      }), this.domPosition.prev ? $(this.domPosition.prev).after(this.currentItem) : $(this.domPosition.parent).prepend(this.currentItem)), this;
    },
    serialize : function(o) {
      var items = this._getItemsAsjQuery(o && o.connected);
      /** @type {!Array} */
      var responseGroup = [];
      return o = o || {}, $(items).each(function() {
        var c = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || /(.+)[\-=_](.+)/);
        if (c) {
          responseGroup.push((o.key || c[1] + "[]") + "=" + (o.key && o.expression ? c[1] : c[2]));
        }
      }), !responseGroup.length && o.key && responseGroup.push(o.key + "="), responseGroup.join("&");
    },
    toArray : function(o) {
      var items = this._getItemsAsjQuery(o && o.connected);
      /** @type {!Array} */
      var canonParts = [];
      return o = o || {}, items.each(function() {
        canonParts.push($(o.item || this).attr(o.attribute || "id") || "");
      }), canonParts;
    },
    _intersectsWith : function(item) {
      var x1 = this.positionAbs.left;
      var scrollLeft = x1 + this.helperProportions.width;
      var y1 = this.positionAbs.top;
      var y2 = y1 + this.helperProportions.height;
      var l = item.left;
      var firstColLeft = l + item.width;
      var t = item.top;
      var r = t + item.height;
      var dyClick = this.offset.click.top;
      var dxClick = this.offset.click.left;
      /** @type {boolean} */
      dyClick = "x" === this.options.axis || y1 + dyClick > t && r > y1 + dyClick;
      /** @type {boolean} */
      dxClick = "y" === this.options.axis || x1 + dxClick > l && firstColLeft > x1 + dxClick;
      return "pointer" === this.options.tolerance || this.options.forcePointerForContainers || "pointer" !== this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"] ? dyClick && dxClick : x1 + this.helperProportions.width / 2 > l && firstColLeft > scrollLeft - this.helperProportions.width / 2 && y1 + this.helperProportions.height / 2 > t && r > y2 - this.helperProportions.height / 2;
    },
    _intersectsWithPointer : function(item) {
      var extension = "x" === this.options.axis || isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height);
      item = "y" === this.options.axis || isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width);
      extension = extension && item;
      item = this._getDragVerticalDirection();
      var origin = this._getDragHorizontalDirection();
      return extension ? this.floating ? origin && "right" === origin || "down" === item ? 2 : 1 : item && ("down" === item ? 2 : 1) : false;
    },
    _intersectsWithSides : function(item) {
      var isOpen = isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + item.height / 2, item.height);
      item = isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + item.width / 2, item.width);
      var POSITION_L = this._getDragVerticalDirection();
      var undefined = this._getDragHorizontalDirection();
      return this.floating && undefined ? "right" === undefined && item || "left" === undefined && !item : POSITION_L && ("down" === POSITION_L && isOpen || "up" === POSITION_L && !isOpen);
    },
    _getDragVerticalDirection : function() {
      /** @type {number} */
      var ts = this.positionAbs.top - this.lastPositionAbs.top;
      return 0 !== ts && (0 < ts ? "down" : "up");
    },
    _getDragHorizontalDirection : function() {
      /** @type {number} */
      var hoverCenterX = this.positionAbs.left - this.lastPositionAbs.left;
      return 0 !== hoverCenterX && (0 < hoverCenterX ? "right" : "left");
    },
    refresh : function(event) {
      return this._refreshItems(event), this.refreshPositions(), this;
    },
    _connectWith : function() {
      var options = this.options;
      return options.connectWith.constructor === String ? [options.connectWith] : options.connectWith;
    },
    _getItemsAsjQuery : function(v) {
      var colIndex;
      var $titles;
      var inst;
      /** @type {!Array} */
      var h = [];
      /** @type {!Array} */
      var vertexCoords = [];
      var l = this._connectWith();
      if (l && v) {
        /** @type {number} */
        v = l.length - 1;
        for (; 0 <= v; v--) {
          $titles = $(l[v]);
          /** @type {number} */
          colIndex = $titles.length - 1;
          for (; 0 <= colIndex; colIndex--) {
            if ((inst = $.data($titles[colIndex], this.widgetFullName)) && inst !== this && !inst.options.disabled) {
              vertexCoords.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
            }
          }
        }
      }
      vertexCoords.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
        options : this.options,
        item : this.currentItem
      }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);
      /** @type {number} */
      v = vertexCoords.length - 1;
      for (; 0 <= v; v--) {
        vertexCoords[v][0].each(function() {
          h.push(this);
        });
      }
      return $(h);
    },
    _removeCurrentsFromItems : function() {
      var qLimages = this.currentItem.find(":data(" + this.widgetName + "-item)");
      this.items = $.grep(this.items, function(template_args) {
        /** @type {number} */
        var i = 0;
        for (; qLimages.length > i; i++) {
          if (qLimages[i] === template_args.item[0]) {
            return false;
          }
        }
        return true;
      });
    },
    _refreshItems : function(value) {
      /** @type {!Array} */
      this.items = [];
      /** @type {!Array} */
      this.containers = [this];
      var fn;
      var i;
      var elems;
      var item;
      var l;
      /** @type {!Array} */
      var items = this.items;
      /** @type {!Array} */
      var result = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], value, {
        item : this.currentItem
      }) : $(this.options.items, this.element), this]];
      if ((l = this._connectWith()) && this.ready) {
        /** @type {number} */
        fn = l.length - 1;
        for (; 0 <= fn; fn--) {
          elems = $(l[fn]);
          /** @type {number} */
          i = elems.length - 1;
          for (; 0 <= i; i--) {
            if ((item = $.data(elems[i], this.widgetFullName)) && item !== this && !item.options.disabled) {
              result.push([$.isFunction(item.options.items) ? item.options.items.call(item.element[0], value, {
                item : this.currentItem
              }) : $(item.options.items, item.element), item]);
              this.containers.push(item);
            }
          }
        }
      }
      /** @type {number} */
      fn = result.length - 1;
      for (; 0 <= fn; fn--) {
        value = result[fn][1];
        elems = result[fn][0];
        /** @type {number} */
        i = 0;
        l = elems.length;
        for (; l > i; i++) {
          item = $(elems[i]);
          item.data(this.widgetName + "-item", value);
          items.push({
            item : item,
            instance : value,
            width : 0,
            height : 0,
            left : 0,
            top : 0
          });
        }
      }
    },
    refreshPositions : function(fast) {
      if (this.offsetParent && this.helper) {
        this.offset.parent = this._getParentOffset();
      }
      var i;
      var item;
      var $tooltipanchor;
      var p;
      /** @type {number} */
      i = this.items.length - 1;
      for (; 0 <= i; i--) {
        item = this.items[i];
        if (!(item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0])) {
          $tooltipanchor = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;
          if (!fast) {
            item.width = $tooltipanchor.outerWidth();
            item.height = $tooltipanchor.outerHeight();
          }
          p = $tooltipanchor.offset();
          item.left = p.left;
          item.top = p.top;
        }
      }
      if (this.options.custom && this.options.custom.refreshContainers) {
        this.options.custom.refreshContainers.call(this);
      } else {
        /** @type {number} */
        i = this.containers.length - 1;
        for (; 0 <= i; i--) {
          p = this.containers[i].element.offset();
          this.containers[i].containerCache.left = p.left;
          this.containers[i].containerCache.top = p.top;
          this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
          this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
        }
      }
      return this;
    },
    _createPlaceholder : function(that) {
      that = that || this;
      var className;
      var o = that.options;
      if (!(o.placeholder && o.placeholder.constructor !== String)) {
        className = o.placeholder;
        o.placeholder = {
          element : function() {
            var tagName = that.currentItem[0].nodeName.toLowerCase();
            var element = $("<" + tagName + ">", that.document[0]).addClass(className || that.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper");
            return "tr" === tagName ? that.currentItem.children().each(function() {
              $("<td>&#160;</td>", that.document[0]).attr("colspan", $(this).attr("colspan") || 1).appendTo(element);
            }) : "img" === tagName && element.attr("src", that.currentItem.attr("src")), className || element.css("visibility", "hidden"), element;
          },
          update : function(container, scene) {
            if (!className || o.forcePlaceholderSize) {
              if (!scene.height()) {
                scene.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop") || 0, 10) - parseInt(that.currentItem.css("paddingBottom") || 0, 10));
              }
              if (!scene.width()) {
                scene.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft") || 0, 10) - parseInt(that.currentItem.css("paddingRight") || 0, 10));
              }
            }
          }
        };
      }
      that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));
      that.currentItem.after(that.placeholder);
      o.placeholder.update(that, that.placeholder);
    },
    _contactContainers : function(event) {
      var i;
      var j;
      var item;
      var posProperty;
      var sizeProperty;
      var base;
      var cur;
      var nearBottom;
      var floating;
      /** @type {null} */
      var innermostIndex = j = null;
      /** @type {number} */
      i = this.containers.length - 1;
      for (; 0 <= i; i--) {
        if (!$.contains(this.currentItem[0], this.containers[i].element[0])) {
          if (this._intersectsWith(this.containers[i].containerCache)) {
            if (!(j && $.contains(this.containers[i].element[0], j.element[0]))) {
              j = this.containers[i];
              /** @type {number} */
              innermostIndex = i;
            }
          } else {
            if (this.containers[i].containerCache.over) {
              this.containers[i]._trigger("out", event, this._uiHash(this));
              /** @type {number} */
              this.containers[i].containerCache.over = 0;
            }
          }
        }
      }
      if (j) {
        if (1 === this.containers.length) {
          if (!this.containers[innermostIndex].containerCache.over) {
            this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
            /** @type {number} */
            this.containers[innermostIndex].containerCache.over = 1;
          }
        } else {
          /** @type {number} */
          i = 1E4;
          /** @type {null} */
          item = null;
          /** @type {string} */
          posProperty = (floating = j.floating || isFloating(this.currentItem)) ? "left" : "top";
          /** @type {string} */
          sizeProperty = floating ? "width" : "height";
          base = this.positionAbs[posProperty] + this.offset.click[posProperty];
          /** @type {number} */
          j = this.items.length - 1;
          for (; 0 <= j; j--) {
            if ($.contains(this.containers[innermostIndex].element[0], this.items[j].item[0]) && this.items[j].item[0] !== this.currentItem[0] && (!floating || isOverAxis(this.positionAbs.top + this.offset.click.top, this.items[j].top, this.items[j].height))) {
              cur = this.items[j].item.offset()[posProperty];
              /** @type {boolean} */
              nearBottom = false;
              if (Math.abs(cur - base) > Math.abs(cur + this.items[j][sizeProperty] - base)) {
                /** @type {boolean} */
                nearBottom = true;
                cur = cur + this.items[j][sizeProperty];
              }
              if (i > Math.abs(cur - base)) {
                /** @type {number} */
                i = Math.abs(cur - base);
                item = this.items[j];
                /** @type {string} */
                this.direction = nearBottom ? "up" : "down";
              }
            }
          }
          if ((item || this.options.dropOnEmpty) && this.currentContainer !== this.containers[innermostIndex]) {
            if (item) {
              this._rearrange(event, item, null, true);
            } else {
              this._rearrange(event, null, this.containers[innermostIndex].element, true);
            }
            this._trigger("change", event, this._uiHash());
            this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));
            this.currentContainer = this.containers[innermostIndex];
            this.options.placeholder.update(this.currentContainer, this.placeholder);
            this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
            /** @type {number} */
            this.containers[innermostIndex].containerCache.over = 1;
          }
        }
      }
    },
    _createHelper : function(a) {
      var o = this.options;
      a = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [a, this.currentItem])) : "clone" === o.helper ? this.currentItem.clone() : this.currentItem;
      return a.parents("body").length || $("parent" !== o.appendTo ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(a[0]), a[0] === this.currentItem[0] && (this._storedCSS = {
        width : this.currentItem[0].style.width,
        height : this.currentItem[0].style.height,
        position : this.currentItem.css("position"),
        top : this.currentItem.css("top"),
        left : this.currentItem.css("left")
      }), (!a[0].style.width || o.forceHelperSize) && a.width(this.currentItem.width()), (!a[0].style.height || o.forceHelperSize) && a.height(this.currentItem.height()), a;
    },
    _adjustOffsetFromHelper : function(obj) {
      if ("string" == typeof obj) {
        /** @type {!Array<string>} */
        obj = obj.split(" ");
      }
      if ($.isArray(obj)) {
        obj = {
          left : +obj[0],
          top : +obj[1] || 0
        };
      }
      if ("left" in obj) {
        this.offset.click.left = obj.left + this.margins.left;
      }
      if ("right" in obj) {
        this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
      }
      if ("top" in obj) {
        this.offset.click.top = obj.top + this.margins.top;
      }
      if ("bottom" in obj) {
        this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
      }
    },
    _getParentOffset : function() {
      this.offsetParent = this.helper.offsetParent();
      var cssStart = this.offsetParent.offset();
      return "absolute" === this.cssPosition && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0]) && (cssStart.left += this.scrollParent.scrollLeft(), cssStart.top += this.scrollParent.scrollTop()), (this.offsetParent[0] === document.body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && $.ui.ie) && (cssStart = {
        top : 0,
        left : 0
      }), {
        top : cssStart.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
        left : cssStart.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
      };
    },
    _getRelativeOffset : function() {
      if ("relative" === this.cssPosition) {
        var anchorBoundingBoxViewport = this.currentItem.position();
        return {
          top : anchorBoundingBoxViewport.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
          left : anchorBoundingBoxViewport.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
        };
      }
      return {
        top : 0,
        left : 0
      };
    },
    _cacheMargins : function() {
      this.margins = {
        left : parseInt(this.currentItem.css("marginLeft"), 10) || 0,
        top : parseInt(this.currentItem.css("marginTop"), 10) || 0
      };
    },
    _cacheHelperProportions : function() {
      this.helperProportions = {
        width : this.helper.outerWidth(),
        height : this.helper.outerHeight()
      };
    },
    _setContainment : function() {
      var ce;
      var co;
      var over;
      var e = this.options;
      if ("parent" === e.containment) {
        e.containment = this.helper[0].parentNode;
      }
      if (!("document" !== e.containment && "window" !== e.containment)) {
        /** @type {!Array} */
        this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, $("document" === e.containment ? document : window).width() - this.helperProportions.width - this.margins.left, ($("document" === e.containment ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
      }
      if (!/^(document|window|parent)$/.test(e.containment)) {
        ce = $(e.containment)[0];
        co = $(e.containment).offset();
        /** @type {boolean} */
        over = "hidden" !== $(ce).css("overflow");
        /** @type {!Array} */
        this.containment = [co.left + (parseInt($(ce).css("borderLeftWidth"), 10) || 0) + (parseInt($(ce).css("paddingLeft"), 10) || 0) - this.margins.left, co.top + (parseInt($(ce).css("borderTopWidth"), 10) || 0) + (parseInt($(ce).css("paddingTop"), 10) || 0) - this.margins.top, co.left + (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"), 10) || 0) - (parseInt($(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, 
        co.top + (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"), 10) || 0) - (parseInt($(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top];
      }
    },
    _convertPositionTo : function(pos, d) {
      if (!d) {
        d = this.position;
      }
      /** @type {number} */
      pos = "absolute" === pos ? 1 : -1;
      var offsetParent = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent;
      /** @type {boolean} */
      var g = /(html|body)/i.test(offsetParent[0].tagName);
      return {
        top : d.top + this.offset.relative.top * pos + this.offset.parent.top * pos - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : g ? 0 : offsetParent.scrollTop()) * pos,
        left : d.left + this.offset.relative.left * pos + this.offset.parent.left * pos - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : g ? 0 : offsetParent.scrollLeft()) * pos
      };
    },
    _generatePosition : function(event) {
      var top;
      var left;
      var o = this.options;
      var pageX = event.pageX;
      var pageY = event.pageY;
      var offsetParent = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent;
      /** @type {boolean} */
      var m = /(html|body)/i.test(offsetParent[0].tagName);
      return "relative" !== this.cssPosition || this.scrollParent[0] !== document && this.scrollParent[0] !== this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset()), this.originalPosition && (this.containment && (event.pageX - this.offset.click.left < this.containment[0] && (pageX = this.containment[0] + this.offset.click.left), event.pageY - this.offset.click.top < this.containment[1] && (pageY = this.containment[1] + this.offset.click.top), event.pageX - this.offset.click.left > 
      this.containment[2] && (pageX = this.containment[2] + this.offset.click.left), event.pageY - this.offset.click.top > this.containment[3] && (pageY = this.containment[3] + this.offset.click.top)), o.grid && (top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1], pageY = this.containment ? top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3] ? top : top - this.offset.click.top >= this.containment[1] ? top - 
      o.grid[1] : top + o.grid[1] : top, left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0], pageX = this.containment ? left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2] ? left : left - this.offset.click.left >= this.containment[0] ? left - o.grid[0] : left + o.grid[0] : left)), {
        top : pageY - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : m ? 0 : offsetParent.scrollTop()),
        left : pageX - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : m ? 0 : offsetParent.scrollLeft())
      };
    },
    _rearrange : function(i, event, a, hardRefresh) {
      if (a) {
        a[0].appendChild(this.placeholder[0]);
      } else {
        event.item[0].parentNode.insertBefore(this.placeholder[0], "down" === this.direction ? event.item[0] : event.item[0].nextSibling);
      }
      /** @type {number} */
      var counter = this.counter = this.counter ? ++this.counter : 1;
      this._delay(function() {
        if (counter === this.counter) {
          this.refreshPositions(!hardRefresh);
        }
      });
    },
    _clear : function(event, noPropagation) {
      /** @type {boolean} */
      this.reverting = false;
      var i;
      /** @type {!Array} */
      var delayedTriggers = [];
      if (!this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null, this.helper[0] === this.currentItem[0]) {
        for (i in this._storedCSS) {
          if (!("auto" !== this._storedCSS[i] && "static" !== this._storedCSS[i])) {
            /** @type {string} */
            this._storedCSS[i] = "";
          }
        }
        this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
      } else {
        this.currentItem.show();
      }
      if (this.fromOutside && !noPropagation) {
        delayedTriggers.push(function(error) {
          this._trigger("receive", error, this._uiHash(this.fromOutside));
        });
      }
      if (!(!this.fromOutside && this.domPosition.prev === this.currentItem.prev().not(".ui-sortable-helper")[0] && this.domPosition.parent === this.currentItem.parent()[0] || noPropagation)) {
        delayedTriggers.push(function(error) {
          this._trigger("update", error, this._uiHash());
        });
      }
      if (this !== this.currentContainer) {
        if (!noPropagation) {
          delayedTriggers.push(function(error) {
            this._trigger("remove", error, this._uiHash());
          });
          delayedTriggers.push(function(c) {
            return function(e) {
              c._trigger("receive", e, this._uiHash(this));
            };
          }.call(this, this.currentContainer));
          delayedTriggers.push(function(c) {
            return function(e) {
              c._trigger("update", e, this._uiHash(this));
            };
          }.call(this, this.currentContainer));
        }
      }
      /** @type {number} */
      i = this.containers.length - 1;
      for (; 0 <= i; i--) {
        if (!noPropagation) {
          delayedTriggers.push(function(c) {
            return function(e) {
              c._trigger("deactivate", e, this._uiHash(this));
            };
          }.call(this, this.containers[i]));
        }
        if (this.containers[i].containerCache.over) {
          delayedTriggers.push(function(c) {
            return function(e) {
              c._trigger("out", e, this._uiHash(this));
            };
          }.call(this, this.containers[i]));
          /** @type {number} */
          this.containers[i].containerCache.over = 0;
        }
      }
      if (this.storedCursor && (this.document.find("body").css("cursor", this.storedCursor), this.storedStylesheet.remove()), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", "auto" === this._storedZIndex ? "" : this._storedZIndex), this.dragging = false, this.cancelHelperRemoval) {
        if (!noPropagation) {
          this._trigger("beforeStop", event, this._uiHash());
          /** @type {number} */
          i = 0;
          for (; delayedTriggers.length > i; i++) {
            delayedTriggers[i].call(this, event);
          }
          this._trigger("stop", event, this._uiHash());
        }
        return this.fromOutside = false, false;
      }
      if (noPropagation || this._trigger("beforeStop", event, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.helper[0] !== this.currentItem[0] && this.helper.remove(), this.helper = null, !noPropagation) {
        /** @type {number} */
        i = 0;
        for (; delayedTriggers.length > i; i++) {
          delayedTriggers[i].call(this, event);
        }
        this._trigger("stop", event, this._uiHash());
      }
      return this.fromOutside = false, true;
    },
    _trigger : function() {
      if (false === $.Widget.prototype._trigger.apply(this, arguments)) {
        this.cancel();
      }
    },
    _uiHash : function(_inst) {
      var inst = _inst || this;
      return {
        helper : inst.helper,
        placeholder : inst.placeholder || $([]),
        position : inst.position,
        originalPosition : inst.originalPosition,
        offset : inst.positionAbs,
        item : inst.currentItem,
        sender : _inst ? _inst.element : null
      };
    }
  });
})(jQuery);
(function($, undefined) {
  $.effects = {
    effect : {}
  };
  (function(jQuery, undefined) {
    /**
     * @param {number} value
     * @param {!Object} prop
     * @param {boolean} allowEmpty
     * @return {?}
     */
    function clamp(value, prop, allowEmpty) {
      var type = propTypes[prop.type] || {};
      return null == value ? allowEmpty || !prop.def ? null : prop.def : (value = type.floor ? ~~value : parseFloat(value), isNaN(value) ? prop.def : type.mod ? (value + type.mod) % type.mod : 0 > value ? 0 : value > type.max ? type.max : value);
    }
    /**
     * @param {!Object} string
     * @return {?}
     */
    function stringParse(string) {
      var inst = color();
      /** @type {!Array} */
      var self = inst._rgba = [];
      return string = string.toLowerCase(), each(modModuleList, function(match, key) {
        var parsed;
        match = (match = key.re.exec(string)) && key.parse(match);
        key = key.space || "rgba";
        return match ? (parsed = inst[key](match), inst[spaces[key].cache] = parsed[spaces[key].cache], self = inst._rgba = parsed._rgba, false) : undefined;
      }), self.length ? ("0,0,0,0" === self.join() && jQuery.extend(self, colors.transparent), inst) : colors[string];
    }
    /**
     * @param {number} x
     * @param {number} a
     * @param {number} v
     * @return {?}
     */
    function put(x, a, v) {
      return v = (v + 1) % 1, 1 > 6 * v ? x + 6 * (a - x) * v : 1 > 2 * v ? a : 2 > 3 * v ? x + 6 * (a - x) * (2 / 3 - v) : x;
    }
    var colors;
    /** @type {!RegExp} */
    var f = /^([\-+])=\s*(\d+\.?\d*)/;
    /** @type {!Array} */
    var modModuleList = [{
      re : /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
      parse : function(text) {
        return [text[1], text[2], text[3], text[4]];
      }
    }, {
      re : /rgba?\(\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
      parse : function(text) {
        return [2.55 * text[1], 2.55 * text[2], 2.55 * text[3], text[4]];
      }
    }, {
      re : /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
      parse : function(text) {
        return [parseInt(text[1], 16), parseInt(text[2], 16), parseInt(text[3], 16)];
      }
    }, {
      re : /#([a-f0-9])([a-f0-9])([a-f0-9])/,
      parse : function(text) {
        return [parseInt(text[1] + text[1], 16), parseInt(text[2] + text[2], 16), parseInt(text[3] + text[3], 16)];
      }
    }, {
      re : /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
      space : "hsla",
      parse : function(text) {
        return [text[1], text[2] / 100, text[3] / 100, text[4]];
      }
    }];
    /** @type {function(string, string, !Object, !Object): ?} */
    var color = jQuery.Color = function(color, green, blue, alpha) {
      return new jQuery.Color.fn.parse(color, green, blue, alpha);
    };
    var spaces = {
      rgba : {
        props : {
          red : {
            idx : 0,
            type : "byte"
          },
          green : {
            idx : 1,
            type : "byte"
          },
          blue : {
            idx : 2,
            type : "byte"
          }
        }
      },
      hsla : {
        props : {
          hue : {
            idx : 0,
            type : "degrees"
          },
          saturation : {
            idx : 1,
            type : "percent"
          },
          lightness : {
            idx : 2,
            type : "percent"
          }
        }
      }
    };
    var propTypes = {
      "byte" : {
        floor : true,
        max : 255
      },
      percent : {
        max : 1
      },
      degrees : {
        mod : 360,
        floor : true
      }
    };
    var colorProps = color.support = {};
    var n = jQuery("<p>")[0];
    var each = jQuery.each;
    /** @type {string} */
    n.style.cssText = "background-color:rgba(1,1,1,.5)";
    /** @type {boolean} */
    colorProps.rgba = -1 < n.style.backgroundColor.indexOf("rgba");
    each(spaces, function(spaceName, space) {
      /** @type {string} */
      space.cache = "_" + spaceName;
      space.props.alpha = {
        idx : 3,
        type : "percent",
        def : 1
      };
    });
    color.fn = jQuery.extend(color.prototype, {
      parse : function(red, green, blue, alpha) {
        if (red === undefined) {
          return this._rgba = [null, null, null, null], this;
        }
        if (red.jquery || red.nodeType) {
          red = jQuery(red).css(green);
          /** @type {!Function} */
          green = undefined;
        }
        var inst = this;
        var type = jQuery.type(red);
        /** @type {!Array} */
        var rgba = this._rgba = [];
        return green !== undefined && (red = [red, green, blue, alpha], type = "array"), "string" === type ? this.parse(stringParse(red) || colors._default) : "array" === type ? (each(spaces.rgba.props, function(a, prop) {
          rgba[prop.idx] = clamp(red[prop.idx], prop);
        }), this) : "object" === type ? (red instanceof color ? each(spaces, function(a, space) {
          if (red[space.cache]) {
            inst[space.cache] = red[space.cache].slice();
          }
        }) : each(spaces, function(b, space) {
          var cache = space.cache;
          each(space.props, function(key, prop) {
            if (!inst[cache] && space.to) {
              if ("alpha" === key || null == red[key]) {
                return;
              }
              inst[cache] = space.to(inst._rgba);
            }
            inst[cache][prop.idx] = clamp(red[key], prop, true);
          });
          if (inst[cache] && 0 > jQuery.inArray(null, inst[cache].slice(0, 3))) {
            /** @type {number} */
            inst[cache][3] = 1;
            if (space.from) {
              inst._rgba = space.from(inst[cache]);
            }
          }
        }), this) : undefined;
      },
      is : function(name) {
        var is = color(name);
        /** @type {boolean} */
        var e = true;
        var inst = this;
        return each(spaces, function(a, space) {
          var localCache;
          var isCache = is[space.cache];
          return isCache && (localCache = inst[space.cache] || space.to && space.to(inst._rgba) || [], each(space.props, function(a, prop) {
            return null != isCache[prop.idx] ? e = isCache[prop.idx] === localCache[prop.idx] : undefined;
          })), e;
        }), e;
      },
      _space : function() {
        /** @type {!Array} */
        var insideInvocation = [];
        var userPickIndex = this;
        return each(spaces, function(tmp, object) {
          if (userPickIndex[object.cache]) {
            insideInvocation.push(tmp);
          }
        }), insideInvocation.pop();
      },
      transition : function(name, distance) {
        var end = color(name);
        name = end._space();
        var space = spaces[name];
        var inst = 0 === this.alpha() ? color("transparent") : this;
        var obj = inst[space.cache] || space.to(inst._rgba);
        var result = obj.slice();
        return end = end[space.cache], each(space.props, function(index, prop) {
          index = prop.idx;
          var startValue = obj[index];
          var endValue = end[index];
          var type = propTypes[prop.type] || {};
          if (null !== endValue) {
            if (null === startValue) {
              result[index] = endValue;
            } else {
              if (type.mod) {
                if (endValue - startValue > type.mod / 2) {
                  startValue = startValue + type.mod;
                } else {
                  if (startValue - endValue > type.mod / 2) {
                    /** @type {number} */
                    startValue = startValue - type.mod;
                  }
                }
              }
              result[index] = clamp((endValue - startValue) * distance + startValue, prop);
            }
          }
        }), this[name](result);
      },
      blend : function(opaque) {
        if (1 === this._rgba[3]) {
          return this;
        }
        var rgb = this._rgba.slice();
        var a = rgb.pop();
        var blend = color(opaque)._rgba;
        return color(jQuery.map(rgb, function(b, i) {
          return (1 - a) * blend[i] + a * b;
        }));
      },
      toRgbaString : function() {
        /** @type {string} */
        var b = "rgba(";
        var rgba = jQuery.map(this._rgba, function(a, b) {
          return null == a ? 2 < b ? 1 : 0 : a;
        });
        return 1 === rgba[3] && (rgba.pop(), b = "rgb("), b + rgba.join() + ")";
      },
      toHslaString : function() {
        /** @type {string} */
        var b = "hsla(";
        var absParts = jQuery.map(this.hsla(), function(opacity, width) {
          return null == opacity && (opacity = 2 < width ? 1 : 0), width && 3 > width && (opacity = Math.round(100 * opacity) + "%"), opacity;
        });
        return 1 === absParts[3] && (absParts.pop(), b = "hsl("), b + absParts.join() + ")";
      },
      toHexString : function(allow3Char) {
        var c = this._rgba.slice();
        var e = c.pop();
        return allow3Char && c.push(~~(255 * e)), "#" + jQuery.map(c, function(str) {
          return str = (str || 0).toString(16), 1 === str.length ? "0" + str : str;
        }).join("");
      },
      toString : function() {
        return 0 === this._rgba[3] ? "transparent" : this.toRgbaString();
      }
    });
    color.fn.parse.prototype = color.fn;
    /**
     * @param {number} value
     * @return {?}
     */
    spaces.hsla.to = function(value) {
      if (null == value[0] || null == value[1] || null == value[2]) {
        return [null, null, null, value[3]];
      }
      var y;
      var yOff;
      /** @type {number} */
      var e = value[0] / 255;
      /** @type {number} */
      var s = value[1] / 255;
      /** @type {number} */
      var c = value[2] / 255;
      value = value[3];
      /** @type {number} */
      var n = Math.max(e, s, c);
      /** @type {number} */
      var i = Math.min(e, s, c);
      /** @type {number} */
      var width = n - i;
      /** @type {number} */
      var count = n + i;
      /** @type {number} */
      var widgetHeight = .5 * count;
      return y = i === n ? 0 : e === n ? 60 * (s - c) / width + 360 : s === n ? 60 * (c - e) / width + 120 : 60 * (e - s) / width + 240, yOff = 0 === width ? 0 : .5 >= widgetHeight ? width / count : width / (2 - count), [Math.round(y) % 360, yOff, widgetHeight, null == value ? 1 : value];
    };
    /**
     * @param {!Array} options
     * @return {?}
     */
    spaces.hsla.from = function(options) {
      if (null == options[0] || null == options[1] || null == options[2]) {
        return [null, null, null, options[3]];
      }
      /** @type {number} */
      var page = options[0] / 360;
      var width = options[1];
      var x = options[2];
      options = options[3];
      /** @type {number} */
      width = .5 >= x ? x * (1 + width) : x + width - x * width;
      /** @type {number} */
      x = 2 * x - width;
      return [Math.round(255 * put(x, width, page + 1 / 3)), Math.round(255 * put(x, width, page)), Math.round(255 * put(x, width, page - 1 / 3)), options];
    };
    each(spaces, function(spaceName, space) {
      var props = space.props;
      var cache = space.cache;
      var to = space.to;
      var from = space.from;
      /**
       * @param {!Object} value
       * @return {?}
       */
      color.fn[spaceName] = function(value) {
        if (to && !this[cache] && (this[cache] = to(this._rgba)), value === undefined) {
          return this[cache].slice();
        }
        var ret;
        var objectProxy = jQuery.type(value);
        var values = "array" === objectProxy || "object" === objectProxy ? value : arguments;
        var local = this[cache].slice();
        return each(props, function(val, prop) {
          val = values["object" === objectProxy ? val : prop.idx];
          if (null == val) {
            val = local[prop.idx];
          }
          local[prop.idx] = clamp(val, prop);
        }), from ? (ret = color(from(local)), ret[cache] = local, ret) : color(local);
      };
      each(props, function(key, data) {
        if (!color.fn[key]) {
          /**
           * @param {!Object} a
           * @return {?}
           */
          color.fn[key] = function(a) {
            var item;
            var type = jQuery.type(a);
            var fn = "alpha" === key ? this._hsla ? "hsla" : "rgba" : spaceName;
            var n = this[fn]();
            var i = n[data.idx];
            return "undefined" === type ? i : ("function" === type && (a = a.call(this, i), type = jQuery.type(a)), null == a && data.empty ? this : ("string" === type && (item = f.exec(a), item && (a = i + parseFloat(item[2]) * ("+" === item[1] ? 1 : -1))), n[data.idx] = a, this[fn](n)));
          };
        }
      });
    });
    /**
     * @param {string} args
     * @return {undefined}
     */
    color.hook = function(args) {
      args = args.split(" ");
      each(args, function(b, hook) {
        jQuery.cssHooks[hook] = {
          set : function(elem, value) {
            var curElem;
            /** @type {string} */
            var backgroundColor = "";
            if ("transparent" !== value && ("string" !== jQuery.type(value) || (curElem = stringParse(value)))) {
              if (value = color(curElem || value), !colorProps.rgba && 1 !== value._rgba[3]) {
                curElem = "backgroundColor" === hook ? elem.parentNode : elem;
                for (; ("" === backgroundColor || "transparent" === backgroundColor) && curElem && curElem.style;) {
                  try {
                    backgroundColor = jQuery.css(curElem, "backgroundColor");
                    curElem = curElem.parentNode;
                  } catch (z) {
                  }
                }
                value = value.blend(backgroundColor && "transparent" !== backgroundColor ? backgroundColor : "_default");
              }
              value = value.toRgbaString();
            }
            try {
              /** @type {!Object} */
              elem.style[hook] = value;
            } catch (z) {
            }
          }
        };
        /**
         * @param {!Object} fx
         * @return {undefined}
         */
        jQuery.fx.step[hook] = function(fx) {
          if (!fx.colorInit) {
            fx.start = color(fx.elem, hook);
            fx.end = color(fx.end);
            /** @type {boolean} */
            fx.colorInit = true;
          }
          jQuery.cssHooks[hook].set(fx.elem, fx.start.transition(fx.end, fx.pos));
        };
      });
    };
    color.hook("backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor");
    jQuery.cssHooks.borderColor = {
      expand : function(type) {
        var self = {};
        return each(["Top", "Right", "Bottom", "Left"], function(canCreateDiscussions, side) {
          /** @type {!Object} */
          self["border" + side + "Color"] = type;
        }), self;
      }
    };
    colors = jQuery.Color.names = {
      aqua : "#00ffff",
      black : "#000000",
      blue : "#0000ff",
      fuchsia : "#ff00ff",
      gray : "#808080",
      green : "#008000",
      lime : "#00ff00",
      maroon : "#800000",
      navy : "#000080",
      olive : "#808000",
      purple : "#800080",
      red : "#ff0000",
      silver : "#c0c0c0",
      teal : "#008080",
      white : "#ffffff",
      yellow : "#ffff00",
      transparent : [null, null, null, 0],
      _default : "#ffffff"
    };
  })(jQuery);
  (function() {
    /**
     * @param {!Object} elem
     * @return {?}
     */
    function getElementStyles(elem) {
      var name;
      var options = elem.ownerDocument.defaultView ? elem.ownerDocument.defaultView.getComputedStyle(elem, null) : elem.currentStyle;
      var processedOptions = {};
      if (options && options.length && options[0] && options[options[0]]) {
        elem = options.length;
        for (; elem--;) {
          name = options[elem];
          if ("string" == typeof options[name]) {
            processedOptions[$.camelCase(name)] = options[name];
          }
        }
      } else {
        for (name in options) {
          if ("string" == typeof options[name]) {
            processedOptions[name] = options[name];
          }
        }
      }
      return processedOptions;
    }
    /** @type {!Array} */
    var classAnimationActions = ["add", "remove", "toggle"];
    var shorthandStyles = {
      border : 1,
      borderBottom : 1,
      borderColor : 1,
      borderLeft : 1,
      borderRight : 1,
      borderTop : 1,
      borderWidth : 1,
      margin : 1,
      padding : 1
    };
    $.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function(a, name) {
      /**
       * @param {!Object} fx
       * @return {undefined}
       */
      $.fx.step[name] = function(fx) {
        if ("none" !== fx.end && !fx.setAttr || 1 === fx.pos && !fx.setAttr) {
          jQuery.style(fx.elem, name, fx.end);
          /** @type {boolean} */
          fx.setAttr = true;
        }
      };
    });
    if (!$.fn.addBack) {
      /**
       * @param {!Object} selector
       * @return {?}
       */
      $.fn.addBack = function(selector) {
        return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector));
      };
    }
    /**
     * @param {!Object} value
     * @param {?} duration
     * @param {?} easing
     * @param {?} callback
     * @return {?}
     */
    $.effects.animateClass = function(value, duration, easing, callback) {
      var o = $.speed(duration, easing, callback);
      return this.queue(function() {
        var applyClassChange;
        var animated = $(this);
        var k = animated.attr("class") || "";
        var allAnimations = o.children ? animated.find("*").addBack() : animated;
        allAnimations = allAnimations.map(function() {
          return {
            el : $(this),
            start : getElementStyles(this)
          };
        });
        /**
         * @return {undefined}
         */
        applyClassChange = function() {
          $.each(classAnimationActions, function(b, action) {
            if (value[action]) {
              animated[action + "Class"](value[action]);
            }
          });
        };
        applyClassChange();
        allAnimations = allAnimations.map(function() {
          this.end = getElementStyles(this.el[0]);
          var a = this.start;
          var b = this.end;
          var i;
          var line;
          var lines = {};
          for (i in b) {
            line = b[i];
            if (a[i] !== line) {
              if (!shorthandStyles[i]) {
                if ($.fx.step[i] || !isNaN(parseFloat(line))) {
                  lines[i] = line;
                }
              }
            }
          }
          return this.diff = lines, this;
        });
        animated.attr("class", k);
        allAnimations = allAnimations.map(function() {
          var compressedJavaScript = this;
          var Promise = $.Deferred();
          var val = $.extend({}, o, {
            queue : false,
            complete : function() {
              Promise.resolve(compressedJavaScript);
            }
          });
          return this.el.animate(this.diff, val), Promise.promise();
        });
        $.when.apply($, allAnimations.get()).done(function() {
          applyClassChange();
          $.each(arguments, function() {
            var self = this.el;
            $.each(this.diff, function(b) {
              self.css(b, "");
            });
          });
          o.complete.call(animated[0]);
        });
      });
    };
    $.fn.extend({
      addClass : function(CropAreaRectangle) {
        return function(addUsers, speed, easing, callback) {
          return speed ? $.effects.animateClass.call(this, {
            add : addUsers
          }, speed, easing, callback) : CropAreaRectangle.apply(this, arguments);
        };
      }($.fn.addClass),
      removeClass : function(CropAreaRectangle) {
        return function(res, e, entry__3995__auto__, eSpec) {
          return 1 < arguments.length ? $.effects.animateClass.call(this, {
            remove : res
          }, e, entry__3995__auto__, eSpec) : CropAreaRectangle.apply(this, arguments);
        };
      }($.fn.removeClass),
      toggleClass : function(CropAreaRectangle) {
        return function(classNames, force, speed, easing, callback) {
          return "boolean" == typeof force || force === undefined ? speed ? $.effects.animateClass.call(this, force ? {
            add : classNames
          } : {
            remove : classNames
          }, speed, easing, callback) : CropAreaRectangle.apply(this, arguments) : $.effects.animateClass.call(this, {
            toggle : classNames
          }, force, speed, easing);
        };
      }($.fn.toggleClass),
      switchClass : function(remove, add, speed, easing, callback) {
        return $.effects.animateClass.call(this, {
          add : add,
          remove : remove
        }, speed, easing, callback);
      }
    });
  })();
  (function() {
    /**
     * @param {!Object} effect
     * @param {!Object} options
     * @param {!Object} speed
     * @param {!Object} callback
     * @return {?}
     */
    function _normalizeArguments(effect, options, speed, callback) {
      return $.isPlainObject(effect) && (options = effect, effect = effect.effect), effect = {
        effect : effect
      }, null == options && (options = {}), $.isFunction(options) && (callback = options, speed = null, options = {}), ("number" == typeof options || $.fx.speeds[options]) && (callback = speed, speed = options, options = {}), $.isFunction(speed) && (callback = speed, speed = null), options && $.extend(effect, options), speed = speed || options.duration, effect.duration = $.fx.off ? 0 : "number" == typeof speed ? speed : speed in $.fx.speeds ? $.fx.speeds[speed] : $.fx.speeds._default, effect.complete = 
      callback || options.complete, effect;
    }
    /**
     * @param {!Object} v
     * @return {?}
     */
    function standardSpeed(v) {
      return !v || "number" == typeof v || $.fx.speeds[v] ? true : "string" != typeof v || $.effects.effect[v] ? $.isFunction(v) ? true : "object" != typeof v || v.effect ? false : true : true;
    }
    $.extend($.effects, {
      version : "1.10.3",
      save : function(element, set) {
        /** @type {number} */
        var i = 0;
        for (; set.length > i; i++) {
          if (null !== set[i]) {
            element.data("ui-effects-" + set[i], element[0].style[set[i]]);
          }
        }
      },
      restore : function(element, set) {
        var e;
        var i;
        /** @type {number} */
        i = 0;
        for (; set.length > i; i++) {
          if (null !== set[i]) {
            e = element.data("ui-effects-" + set[i]);
            if (e === undefined) {
              /** @type {string} */
              e = "";
            }
            element.css(set[i], e);
          }
        }
      },
      setMode : function(e, mode) {
        return "toggle" === mode && (mode = e.is(":hidden") ? "show" : "hide"), mode;
      },
      getBaseline : function(origin, original) {
        var languageOffsetY;
        switch(origin[0]) {
          case "top":
            /** @type {number} */
            languageOffsetY = 0;
            break;
          case "middle":
            /** @type {number} */
            languageOffsetY = .5;
            break;
          case "bottom":
            /** @type {number} */
            languageOffsetY = 1;
            break;
          default:
            /** @type {number} */
            languageOffsetY = origin[0] / original.height;
        }
        switch(origin[1]) {
          case "left":
            /** @type {number} */
            origin = 0;
            break;
          case "center":
            /** @type {number} */
            origin = .5;
            break;
          case "right":
            /** @type {number} */
            origin = 1;
            break;
          default:
            /** @type {number} */
            origin = origin[1] / original.width;
        }
        return {
          x : origin,
          y : languageOffsetY
        };
      },
      createWrapper : function(element) {
        if (element.parent().is(".ui-effects-wrapper")) {
          return element.parent();
        }
        var props = {
          width : element.outerWidth(true),
          height : element.outerHeight(true),
          "float" : element.css("float")
        };
        var wrapper = $("<div></div>").addClass("ui-effects-wrapper").css({
          fontSize : "100%",
          background : "transparent",
          border : "none",
          margin : 0,
          padding : 0
        });
        var newElProp = {
          width : element.width(),
          height : element.height()
        };
        var active = document.activeElement;
        try {
          active.id;
        } catch (l) {
          /** @type {!HTMLBodyElement} */
          active = document.body;
        }
        return element.wrap(wrapper), (element[0] === active || $.contains(element[0], active)) && $(active).focus(), wrapper = element.parent(), "static" === element.css("position") ? (wrapper.css({
          position : "relative"
        }), element.css({
          position : "relative"
        })) : ($.extend(props, {
          position : element.css("position"),
          zIndex : element.css("z-index")
        }), $.each(["top", "left", "bottom", "right"], function(b, pos) {
          props[pos] = element.css(pos);
          if (isNaN(parseInt(props[pos], 10))) {
            /** @type {string} */
            props[pos] = "auto";
          }
        }), element.css({
          position : "relative",
          top : 0,
          left : 0,
          right : "auto",
          bottom : "auto"
        })), element.css(newElProp), wrapper.css(props).show();
      },
      removeWrapper : function(element) {
        var active = document.activeElement;
        return element.parent().is(".ui-effects-wrapper") && (element.parent().replaceWith(element), (element[0] === active || $.contains(element[0], active)) && $(active).focus()), element;
      },
      setTransition : function(el, list, val, duration) {
        return duration = duration || {}, $.each(list, function(vec, i) {
          vec = el.cssUnit(i);
          if (0 < vec[0]) {
            duration[i] = vec[0] * val + vec[1];
          }
        }), duration;
      }
    });
    $.fn.extend({
      effect : function() {
        /**
         * @param {?} a
         * @return {undefined}
         */
        function run(a) {
          /**
           * @return {undefined}
           */
          function done() {
            if ($.isFunction(complete)) {
              complete.call(elem[0]);
            }
            if ($.isFunction(a)) {
              a();
            }
          }
          var elem = $(this);
          var complete = args.complete;
          var mode = args.mode;
          if (elem.is(":hidden") ? "hide" === mode : "show" === mode) {
            elem[mode]();
            done();
          } else {
            effectMethod.call(elem[0], args, done);
          }
        }
        var args = _normalizeArguments.apply(this, arguments);
        var mode = args.mode;
        var queue = args.queue;
        var effectMethod = $.effects.effect[args.effect];
        return $.fx.off || !effectMethod ? mode ? this[mode](args.duration, args.complete) : this.each(function() {
          if (args.complete) {
            args.complete.call(this);
          }
        }) : false === queue ? this.each(run) : this.queue(queue || "fx", run);
      },
      show : function(CropAreaRectangle) {
        return function(speed) {
          if (standardSpeed(speed)) {
            return CropAreaRectangle.apply(this, arguments);
          }
          var args = _normalizeArguments.apply(this, arguments);
          return args.mode = "show", this.effect.call(this, args);
        };
      }($.fn.show),
      hide : function(CropAreaRectangle) {
        return function(speed) {
          if (standardSpeed(speed)) {
            return CropAreaRectangle.apply(this, arguments);
          }
          var args = _normalizeArguments.apply(this, arguments);
          return args.mode = "hide", this.effect.call(this, args);
        };
      }($.fn.hide),
      toggle : function(CropAreaRectangle) {
        return function(val) {
          if (standardSpeed(val) || "boolean" == typeof val) {
            return CropAreaRectangle.apply(this, arguments);
          }
          var args = _normalizeArguments.apply(this, arguments);
          return args.mode = "toggle", this.effect.call(this, args);
        };
      }($.fn.toggle),
      cssUnit : function(key) {
        var style = this.css(key);
        /** @type {!Array} */
        var getClosestResult = [];
        return $.each(["em", "px", "%", "pt"], function(a, b) {
          if (0 < style.indexOf(b)) {
            /** @type {!Array} */
            getClosestResult = [parseFloat(style), b];
          }
        }), getClosestResult;
      }
    });
  })();
  (function() {
    var a = {};
    $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(diff, howMany) {
      /**
       * @param {?} preLabValue
       * @return {?}
       */
      a[howMany] = function(preLabValue) {
        return Math.pow(preLabValue, diff + 2);
      };
    });
    $.extend(a, {
      Sine : function(p) {
        return 1 - Math.cos(p * Math.PI / 2);
      },
      Circ : function(p) {
        return 1 - Math.sqrt(1 - p * p);
      },
      Elastic : function(p) {
        return 0 === p || 1 === p ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin((80 * (p - 1) - 7.5) * Math.PI / 15);
      },
      Back : function(p) {
        return p * p * (3 * p - 2);
      },
      Bounce : function(p) {
        var b;
        /** @type {number} */
        var bounce = 4;
        for (; ((b = Math.pow(2, --bounce)) - 1) / 11 > p;) {
        }
        return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((3 * b - 2) / 22 - p, 2);
      }
    });
    $.each(a, function(name, abs) {
      $.easing["easeIn" + name] = abs;
      /**
       * @param {number} value
       * @return {?}
       */
      $.easing["easeOut" + name] = function(value) {
        return 1 - abs(1 - value);
      };
      /**
       * @param {number} result
       * @return {?}
       */
      $.easing["easeInOut" + name] = function(result) {
        return .5 > result ? abs(2 * result) / 2 : 1 - abs(-2 * result + 2) / 2;
      };
    });
  })();
})(jQuery);
(function($) {
  /** @type {number} */
  var globalId = 0;
  var obj = {};
  var props = {};
  /** @type {string} */
  obj.height = obj.paddingTop = obj.paddingBottom = obj.borderTopWidth = obj.borderBottomWidth = "hide";
  /** @type {string} */
  props.height = props.paddingTop = props.paddingBottom = props.borderTopWidth = props.borderBottomWidth = "show";
  $.widget("ui.accordion", {
    version : "1.10.3",
    options : {
      active : 0,
      animate : {},
      collapsible : false,
      event : "click",
      header : "> li > :first-child,> :not(li):even",
      heightStyle : "auto",
      icons : {
        activeHeader : "ui-icon-triangle-1-s",
        header : "ui-icon-triangle-1-e"
      },
      activate : null,
      beforeActivate : null
    },
    _create : function() {
      var options = this.options;
      this.prevShow = this.prevHide = $();
      this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role", "tablist");
      if (!(options.collapsible || false !== options.active && null != options.active)) {
        /** @type {number} */
        options.active = 0;
      }
      this._processPanels();
      if (0 > options.active) {
        options.active += this.headers.length;
      }
      this._refresh();
    },
    _getCreateEventData : function() {
      return {
        header : this.active,
        panel : this.active.length ? this.active.next() : $(),
        content : this.active.length ? this.active.next() : $()
      };
    },
    _createIcons : function() {
      var icons = this.options.icons;
      if (icons) {
        $("<span>").addClass("ui-accordion-header-icon ui-icon " + icons.header).prependTo(this.headers);
        this.active.children(".ui-accordion-header-icon").removeClass(icons.header).addClass(icons.activeHeader);
        this.headers.addClass("ui-accordion-icons");
      }
    },
    _destroyIcons : function() {
      this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove();
    },
    _destroy : function() {
      var $pContent;
      this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role");
      this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function() {
        if (/^ui-accordion/.test(this.id)) {
          this.removeAttribute("id");
        }
      });
      this._destroyIcons();
      $pContent = this.headers.next().css("display", "").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function() {
        if (/^ui-accordion/.test(this.id)) {
          this.removeAttribute("id");
        }
      });
      if ("content" !== this.options.heightStyle) {
        $pContent.css("height", "");
      }
    },
    _setOption : function(name, value) {
      return "active" === name ? (this._activate(value), void 0) : ("event" === name && (this.options.event && this._off(this.headers, this.options.event), this._setupEvents(value)), this._super(name, value), "collapsible" !== name || value || false !== this.options.active || this._activate(0), "icons" === name && (this._destroyIcons(), value && this._createIcons()), "disabled" === name && this.headers.add(this.headers.next()).toggleClass("ui-state-disabled", !!value), void 0);
    },
    _keydown : function(event) {
      if (!event.altKey && !event.ctrlKey) {
        var keyCode = $.ui.keyCode;
        var length = this.headers.length;
        var currentIndex = this.headers.index(event.target);
        /** @type {boolean} */
        var toFocus = false;
        switch(event.keyCode) {
          case keyCode.RIGHT:
          case keyCode.DOWN:
            toFocus = this.headers[(currentIndex + 1) % length];
            break;
          case keyCode.LEFT:
          case keyCode.UP:
            toFocus = this.headers[(currentIndex - 1 + length) % length];
            break;
          case keyCode.SPACE:
          case keyCode.ENTER:
            this._eventHandler(event);
            break;
          case keyCode.HOME:
            toFocus = this.headers[0];
            break;
          case keyCode.END:
            toFocus = this.headers[length - 1];
        }
        if (toFocus) {
          $(event.target).attr("tabIndex", -1);
          $(toFocus).attr("tabIndex", 0);
          toFocus.focus();
          event.preventDefault();
        }
      }
    },
    _panelKeyDown : function(event) {
      if (event.keyCode === $.ui.keyCode.UP && event.ctrlKey) {
        $(event.currentTarget).prev().focus();
      }
    },
    refresh : function() {
      var options = this.options;
      this._processPanels();
      if (false === options.active && true === options.collapsible || !this.headers.length) {
        /** @type {boolean} */
        options.active = false;
        this.active = $();
      } else {
        if (false === options.active) {
          this._activate(0);
        } else {
          if (this.active.length && !$.contains(this.element[0], this.active[0])) {
            if (this.headers.length === this.headers.find(".ui-state-disabled").length) {
              /** @type {boolean} */
              options.active = false;
              this.active = $();
            } else {
              this._activate(Math.max(0, options.active - 1));
            }
          } else {
            options.active = this.headers.index(this.active);
          }
        }
      }
      this._destroyIcons();
      this._refresh();
    },
    _processPanels : function() {
      this.headers = this.element.find(this.options.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all");
      this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide();
    },
    _refresh : function() {
      var maxHeight;
      var options = this.options;
      var heightStyle = options.heightStyle;
      var cssChanges = this.element.parent();
      var accordionId = this.accordionId = "ui-accordion-" + (this.element.attr("id") || ++globalId);
      this.active = this._findActive(options.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all");
      this.active.next().addClass("ui-accordion-content-active").show();
      this.headers.attr("role", "tab").each(function(i) {
        var target = $(this);
        var e = target.attr("id");
        var self = target.next();
        var g = self.attr("id");
        if (!e) {
          /** @type {string} */
          e = accordionId + "-header-" + i;
          target.attr("id", e);
        }
        if (!g) {
          /** @type {string} */
          g = accordionId + "-panel-" + i;
          self.attr("id", g);
        }
        target.attr("aria-controls", g);
        self.attr("aria-labelledby", e);
      }).next().attr("role", "tabpanel");
      this.headers.not(this.active).attr({
        "aria-selected" : "false",
        tabIndex : -1
      }).next().attr({
        "aria-expanded" : "false",
        "aria-hidden" : "true"
      }).hide();
      if (this.active.length) {
        this.active.attr({
          "aria-selected" : "true",
          tabIndex : 0
        }).next().attr({
          "aria-expanded" : "true",
          "aria-hidden" : "false"
        });
      } else {
        this.headers.eq(0).attr("tabIndex", 0);
      }
      this._createIcons();
      this._setupEvents(options.event);
      if ("fill" === heightStyle) {
        maxHeight = cssChanges.height();
        this.element.siblings(":visible").each(function() {
          var $scrollerElement = $(this);
          var undefined = $scrollerElement.css("position");
          if ("absolute" !== undefined && "fixed" !== undefined) {
            /** @type {number} */
            maxHeight = maxHeight - $scrollerElement.outerHeight(true);
          }
        });
        this.headers.each(function() {
          /** @type {number} */
          maxHeight = maxHeight - $(this).outerHeight(true);
        });
        this.headers.next().each(function() {
          $(this).height(Math.max(0, maxHeight - $(this).innerHeight() + $(this).height()));
        }).css("overflow", "auto");
      } else {
        if ("auto" === heightStyle) {
          /** @type {number} */
          maxHeight = 0;
          this.headers.next().each(function() {
            /** @type {number} */
            maxHeight = Math.max(maxHeight, $(this).css("height", "").height());
          }).height(maxHeight);
        }
      }
    },
    _activate : function(index) {
      index = this._findActive(index)[0];
      if (index !== this.active[0]) {
        index = index || this.active[0];
        this._eventHandler({
          target : index,
          currentTarget : index,
          preventDefault : $.noop
        });
      }
    },
    _findActive : function(index) {
      return "number" == typeof index ? this.headers.eq(index) : $();
    },
    _setupEvents : function(event) {
      var events = {
        keydown : "_keydown"
      };
      if (event) {
        $.each(event.split(" "), function(a, eventName) {
          /** @type {string} */
          events[eventName] = "_eventHandler";
        });
      }
      this._off(this.headers.add(this.headers.next()));
      this._on(this.headers, events);
      this._on(this.headers.next(), {
        keydown : "_panelKeyDown"
      });
      this._hoverable(this.headers);
      this._focusable(this.headers);
    },
    _eventHandler : function(e) {
      var options = this.options;
      var active = this.active;
      var clicked = $(e.currentTarget);
      /** @type {boolean} */
      var clickedIsActive = clicked[0] === active[0];
      var collapsing = clickedIsActive && options.collapsible;
      var item = collapsing ? $() : clicked.next();
      var toHide = active.next();
      item = {
        oldHeader : active,
        oldPanel : toHide,
        newHeader : collapsing ? $() : clicked,
        newPanel : item
      };
      e.preventDefault();
      if (!(clickedIsActive && !options.collapsible || false === this._trigger("beforeActivate", e, item))) {
        options.active = collapsing ? false : this.headers.index(clicked);
        this.active = clickedIsActive ? $() : clicked;
        this._toggle(item);
        active.removeClass("ui-accordion-header-active ui-state-active");
        if (options.icons) {
          active.children(".ui-accordion-header-icon").removeClass(options.icons.activeHeader).addClass(options.icons.header);
        }
        if (!clickedIsActive) {
          clicked.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top");
          if (options.icons) {
            clicked.children(".ui-accordion-header-icon").removeClass(options.icons.header).addClass(options.icons.activeHeader);
          }
          clicked.next().addClass("ui-accordion-content-active");
        }
      }
    },
    _toggle : function(data) {
      var toShow = data.newPanel;
      var toHide = this.prevShow.length ? this.prevShow : data.oldPanel;
      this.prevShow.add(this.prevHide).stop(true, true);
      this.prevShow = toShow;
      this.prevHide = toHide;
      if (this.options.animate) {
        this._animate(toShow, toHide, data);
      } else {
        toHide.hide();
        toShow.show();
        this._toggleComplete(data);
      }
      toHide.attr({
        "aria-expanded" : "false",
        "aria-hidden" : "true"
      });
      toHide.prev().attr("aria-selected", "false");
      if (toShow.length && toHide.length) {
        toHide.prev().attr("tabIndex", -1);
      } else {
        if (toShow.length) {
          this.headers.filter(function() {
            return 0 === $(this).attr("tabIndex");
          }).attr("tabIndex", -1);
        }
      }
      toShow.attr({
        "aria-expanded" : "true",
        "aria-hidden" : "false"
      }).prev().attr({
        "aria-selected" : "true",
        tabIndex : 0
      });
    },
    _animate : function(toShow, toHide, data) {
      var total;
      var easing;
      var duration;
      var that = this;
      /** @type {number} */
      var adjust = 0;
      var options = toShow.length && (!toHide.length || toShow.index() < toHide.index());
      var animate = this.options.animate || {};
      options = options && animate.down || animate;
      /**
       * @return {undefined}
       */
      var complete = function() {
        that._toggleComplete(data);
      };
      return "number" == typeof options && (duration = options), "string" == typeof options && (easing = options), easing = easing || options.easing || animate.easing, duration = duration || options.duration || animate.duration, toHide.length ? toShow.length ? (total = toShow.show().outerHeight(), toHide.animate(obj, {
        duration : duration,
        easing : easing,
        step : function(p, a) {
          /** @type {number} */
          a.now = Math.round(p);
        }
      }), toShow.hide().animate(props, {
        duration : duration,
        easing : easing,
        complete : complete,
        step : function(now, fx) {
          /** @type {number} */
          fx.now = Math.round(now);
          if ("height" !== fx.prop) {
            adjust = adjust + fx.now;
          } else {
            if ("content" !== that.options.heightStyle) {
              /** @type {number} */
              fx.now = Math.round(total - toHide.outerHeight() - adjust);
              /** @type {number} */
              adjust = 0;
            }
          }
        }
      }), void 0) : toHide.animate(obj, duration, easing, complete) : toShow.animate(props, duration, easing, complete);
    },
    _toggleComplete : function(data) {
      var toHide = data.oldPanel;
      toHide.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all");
      if (toHide.length) {
        toHide.parent()[0].className = toHide.parent()[0].className;
      }
      this._trigger("activate", null, data);
    }
  });
})(jQuery);
(function($) {
  /** @type {number} */
  var a = 0;
  $.widget("ui.autocomplete", {
    version : "1.10.3",
    defaultElement : "<input>",
    options : {
      appendTo : null,
      autoFocus : false,
      delay : 300,
      minLength : 1,
      position : {
        my : "left top",
        at : "left bottom",
        collision : "none"
      },
      source : null,
      change : null,
      close : null,
      focus : null,
      open : null,
      response : null,
      search : null,
      select : null
    },
    pending : 0,
    _create : function() {
      var a;
      var g;
      var b;
      var isInput = this.element[0].nodeName.toLowerCase();
      /** @type {boolean} */
      var isTextarea = "textarea" === isInput;
      /** @type {boolean} */
      isInput = "input" === isInput;
      this.isMultiLine = isTextarea ? true : isInput ? false : this.element.prop("isContentEditable");
      this.valueMethod = this.element[isTextarea || isInput ? "val" : "text"];
      /** @type {boolean} */
      this.isNewMenu = true;
      this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off");
      this._on(this.element, {
        keydown : function(event) {
          if (this.element.prop("readOnly")) {
            return a = true, b = true, g = true, void 0;
          }
          /** @type {boolean} */
          g = b = a = false;
          var keyCode = $.ui.keyCode;
          switch(event.keyCode) {
            case keyCode.PAGE_UP:
              /** @type {boolean} */
              a = true;
              this._move("previousPage", event);
              break;
            case keyCode.PAGE_DOWN:
              /** @type {boolean} */
              a = true;
              this._move("nextPage", event);
              break;
            case keyCode.UP:
              /** @type {boolean} */
              a = true;
              this._keyEvent("previous", event);
              break;
            case keyCode.DOWN:
              /** @type {boolean} */
              a = true;
              this._keyEvent("next", event);
              break;
            case keyCode.ENTER:
            case keyCode.NUMPAD_ENTER:
              if (this.menu.active) {
                /** @type {boolean} */
                a = true;
                event.preventDefault();
                this.menu.select(event);
              }
              break;
            case keyCode.TAB:
              if (this.menu.active) {
                this.menu.select(event);
              }
              break;
            case keyCode.ESCAPE:
              if (this.menu.element.is(":visible")) {
                this._value(this.term);
                this.close(event);
                event.preventDefault();
              }
              break;
            default:
              /** @type {boolean} */
              g = true;
              this._searchTimeout(event);
          }
        },
        keypress : function(event) {
          if (a) {
            return a = false, (!this.isMultiLine || this.menu.element.is(":visible")) && event.preventDefault(), void 0;
          }
          if (!g) {
            var keyCode = $.ui.keyCode;
            switch(event.keyCode) {
              case keyCode.PAGE_UP:
                this._move("previousPage", event);
                break;
              case keyCode.PAGE_DOWN:
                this._move("nextPage", event);
                break;
              case keyCode.UP:
                this._keyEvent("previous", event);
                break;
              case keyCode.DOWN:
                this._keyEvent("next", event);
            }
          }
        },
        input : function(event) {
          return b ? (b = false, event.preventDefault(), void 0) : (this._searchTimeout(event), void 0);
        },
        focus : function() {
          /** @type {null} */
          this.selectedItem = null;
          this.previous = this._value();
        },
        blur : function(event) {
          return this.cancelBlur ? (delete this.cancelBlur, void 0) : (clearTimeout(this.searching), this.close(event), this._change(event), void 0);
        }
      });
      this._initSource();
      this.menu = $("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({
        role : null
      }).hide().data("ui-menu");
      this._on(this.menu.element, {
        mousedown : function(event) {
          event.preventDefault();
          /** @type {boolean} */
          this.cancelBlur = true;
          this._delay(function() {
            delete this.cancelBlur;
          });
          var menuElement = this.menu.element[0];
          if (!$(event.target).closest(".ui-menu-item").length) {
            this._delay(function() {
              var hueb = this;
              this.document.one("mousedown", function(event) {
                if (!(event.target === hueb.element[0] || event.target === menuElement || $.contains(menuElement, event.target))) {
                  hueb.close();
                }
              });
            });
          }
        },
        menufocus : function(event, item) {
          if (this.isNewMenu && (this.isNewMenu = false, event.originalEvent && /^mouse/.test(event.originalEvent.type))) {
            return this.menu.blur(), this.document.one("mousemove", function() {
              $(event.target).trigger(event.originalEvent);
            }), void 0;
          }
          item = item.item.data("ui-autocomplete-item");
          if (false !== this._trigger("focus", event, {
            item : item
          })) {
            if (event.originalEvent && /^key/.test(event.originalEvent.type)) {
              this._value(item.value);
            }
          } else {
            this.liveRegion.text(item.value);
          }
        },
        menuselect : function(event, ui) {
          var item = ui.item.data("ui-autocomplete-item");
          var previous = this.previous;
          if (this.element[0] !== this.document[0].activeElement) {
            this.element.focus();
            this.previous = previous;
            this._delay(function() {
              this.previous = previous;
              this.selectedItem = item;
            });
          }
          if (false !== this._trigger("select", event, {
            item : item
          })) {
            this._value(item.value);
          }
          this.term = this._value();
          this.close(event);
          this.selectedItem = item;
        }
      });
      this.liveRegion = $("<span>", {
        role : "status",
        "aria-live" : "polite"
      }).addClass("ui-helper-hidden-accessible").insertBefore(this.element);
      this._on(this.window, {
        beforeunload : function() {
          this.element.removeAttr("autocomplete");
        }
      });
    },
    _destroy : function() {
      clearTimeout(this.searching);
      this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete");
      this.menu.element.remove();
      this.liveRegion.remove();
    },
    _setOption : function(key, value) {
      this._super(key, value);
      if ("source" === key) {
        this._initSource();
      }
      if ("appendTo" === key) {
        this.menu.element.appendTo(this._appendTo());
      }
      if ("disabled" === key && value && this.xhr) {
        this.xhr.abort();
      }
    },
    _appendTo : function() {
      var element = this.options.appendTo;
      return element && (element = element.jquery || element.nodeType ? $(element) : this.document.find(element).eq(0)), element || (element = this.element.closest(".ui-front")), element.length || (element = this.document[0].body), element;
    },
    _initSource : function() {
      var key;
      var callbackUrl;
      var _longpollRequest = this;
      if ($.isArray(this.options.source)) {
        key = this.options.source;
        /**
         * @param {!Object} name
         * @param {string} value
         * @return {undefined}
         */
        this.source = function(name, value) {
          value($.ui.autocomplete.filter(key, name.term));
        };
      } else {
        if ("string" == typeof this.options.source) {
          /** @type {string} */
          callbackUrl = this.options.source;
          /**
           * @param {!Object} name
           * @param {string} value
           * @return {undefined}
           */
          this.source = function(name, value) {
            if (_longpollRequest.xhr) {
              _longpollRequest.xhr.abort();
            }
            _longpollRequest.xhr = $.ajax({
              url : callbackUrl,
              data : name,
              dataType : "json",
              success : function(label) {
                value(label);
              },
              error : function() {
                value([]);
              }
            });
          };
        } else {
          this.source = this.options.source;
        }
      }
    },
    _searchTimeout : function(event) {
      clearTimeout(this.searching);
      this.searching = this._delay(function() {
        if (this.term !== this._value()) {
          /** @type {null} */
          this.selectedItem = null;
          this.search(null, event);
        }
      }, this.options.delay);
    },
    search : function(value, event) {
      return value = null != value ? value : this._value(), this.term = this._value(), value.length < this.options.minLength ? this.close(event) : false !== this._trigger("search", event) ? this._search(value) : void 0;
    },
    _search : function(value) {
      this.pending++;
      this.element.addClass("ui-autocomplete-loading");
      /** @type {boolean} */
      this.cancelSearch = false;
      this.source({
        term : value
      }, this._response());
    },
    _response : function() {
      var that = this;
      /** @type {number} */
      var b = ++a;
      return function(content) {
        if (b === a) {
          that.__response(content);
        }
        that.pending--;
        if (!that.pending) {
          that.element.removeClass("ui-autocomplete-loading");
        }
      };
    },
    __response : function(content) {
      if (content) {
        content = this._normalize(content);
      }
      this._trigger("response", null, {
        content : content
      });
      if (!this.options.disabled && content && content.length && !this.cancelSearch) {
        this._suggest(content);
        this._trigger("open");
      } else {
        this._close();
      }
    },
    close : function(event) {
      /** @type {boolean} */
      this.cancelSearch = true;
      this._close(event);
    },
    _close : function(event) {
      if (this.menu.element.is(":visible")) {
        this.menu.element.hide();
        this.menu.blur();
        /** @type {boolean} */
        this.isNewMenu = true;
        this._trigger("close", event);
      }
    },
    _change : function(e) {
      if (this.previous !== this._value()) {
        this._trigger("change", e, {
          item : this.selectedItem
        });
      }
    },
    _normalize : function(items) {
      return items.length && items[0].label && items[0].value ? items : $.map(items, function(item) {
        return "string" == typeof item ? {
          label : item,
          value : item
        } : $.extend({
          label : item.label || item.value,
          value : item.value || item.label
        }, item);
      });
    },
    _suggest : function(items) {
      var ul = this.menu.element.empty();
      this._renderMenu(ul, items);
      /** @type {boolean} */
      this.isNewMenu = true;
      this.menu.refresh();
      ul.show();
      this._resizeMenu();
      ul.position($.extend({
        of : this.element
      }, this.options.position));
      if (this.options.autoFocus) {
        this.menu.next();
      }
    },
    _resizeMenu : function() {
      var ul = this.menu.element;
      ul.outerWidth(Math.max(ul.width("").outerWidth() + 1, this.element.outerWidth()));
    },
    _renderMenu : function(ul, items) {
      var that = this;
      $.each(items, function(b, item) {
        that._renderItemData(ul, item);
      });
    },
    _renderItemData : function(ul, item) {
      return this._renderItem(ul, item).data("ui-autocomplete-item", item);
    },
    _renderItem : function(ui, item) {
      return $("<li>").append($("<a>").text(item.label)).appendTo(ui);
    },
    _move : function(direction, event) {
      return this.menu.element.is(":visible") ? this.menu.isFirstItem() && /^previous/.test(direction) || this.menu.isLastItem() && /^next/.test(direction) ? (this._value(this.term), this.menu.blur(), void 0) : (this.menu[direction](event), void 0) : (this.search(null, event), void 0);
    },
    widget : function() {
      return this.menu.element;
    },
    _value : function() {
      return this.valueMethod.apply(this.element, arguments);
    },
    _keyEvent : function(keyEvent, event) {
      if (!(this.isMultiLine && !this.menu.element.is(":visible"))) {
        this._move(keyEvent, event);
        event.preventDefault();
      }
    }
  });
  $.extend($.ui.autocomplete, {
    escapeRegex : function(value) {
      return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    },
    filter : function(name, value) {
      /** @type {!RegExp} */
      var matcher = RegExp($.ui.autocomplete.escapeRegex(value), "i");
      return $.grep(name, function(value) {
        return matcher.test(value.label || value.value || value);
      });
    }
  });
  $.widget("ui.autocomplete", $.ui.autocomplete, {
    options : {
      messages : {
        noResults : "No search results.",
        results : function(mainUi) {
          return mainUi + (1 < mainUi ? " results are" : " result is") + " available, use up and down arrow keys to navigate.";
        }
      }
    },
    __response : function(content) {
      var message;
      this._superApply(arguments);
      if (!(this.options.disabled || this.cancelSearch)) {
        message = content && content.length ? this.options.messages.results(content.length) : this.options.messages.noResults;
        this.liveRegion.text(message);
      }
    }
  });
})(jQuery);
(function($) {
  var a;
  var startXPos;
  var startYPos;
  var clickDragged;
  /**
   * @return {undefined}
   */
  var toggle = function() {
    var $sharepreview = $(this);
    setTimeout(function() {
      $sharepreview.find(":ui-button").button("refresh");
    }, 1);
  };
  /**
   * @param {!Object} radio
   * @return {?}
   */
  var radioGroup = function(radio) {
    var n = radio.name;
    var form = radio.form;
    var r = $([]);
    return n && (n = n.replace(/'/g, "\\'"), r = form ? $(form).find("[name='" + n + "']") : $("[name='" + n + "']", radio.ownerDocument).filter(function() {
      return !this.form;
    })), r;
  };
  $.widget("ui.button", {
    version : "1.10.3",
    defaultElement : "<button>",
    options : {
      disabled : null,
      text : true,
      label : null,
      icons : {
        primary : null,
        secondary : null
      }
    },
    _create : function() {
      this.element.closest("form").unbind("reset" + this.eventNamespace).bind("reset" + this.eventNamespace, toggle);
      if ("boolean" != typeof this.options.disabled) {
        /** @type {boolean} */
        this.options.disabled = !!this.element.prop("disabled");
      } else {
        this.element.prop("disabled", this.options.disabled);
      }
      this._determineButtonType();
      /** @type {boolean} */
      this.hasTitle = !!this.buttonElement.attr("title");
      var that = this;
      var options = this.options;
      /** @type {boolean} */
      var l = "checkbox" === this.type || "radio" === this.type;
      /** @type {string} */
      var v = l ? "" : "ui-state-active";
      if (null === options.label) {
        options.label = "input" === this.type ? this.buttonElement.val() : this.buttonElement.html();
      }
      this._hoverable(this.buttonElement);
      this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role", "button").bind("mouseenter" + this.eventNamespace, function() {
        if (!options.disabled) {
          if (this === a) {
            $(this).addClass("ui-state-active");
          }
        }
      }).bind("mouseleave" + this.eventNamespace, function() {
        if (!options.disabled) {
          $(this).removeClass(v);
        }
      }).bind("click" + this.eventNamespace, function(event) {
        if (options.disabled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      });
      this.element.bind("focus" + this.eventNamespace, function() {
        that.buttonElement.addClass("ui-state-focus");
      }).bind("blur" + this.eventNamespace, function() {
        that.buttonElement.removeClass("ui-state-focus");
      });
      if (l) {
        this.element.bind("change" + this.eventNamespace, function() {
          if (!clickDragged) {
            that.refresh();
          }
        });
        this.buttonElement.bind("mousedown" + this.eventNamespace, function(event) {
          if (!options.disabled) {
            /** @type {boolean} */
            clickDragged = false;
            startXPos = event.pageX;
            startYPos = event.pageY;
          }
        }).bind("mouseup" + this.eventNamespace, function(event) {
          if (!options.disabled) {
            if (startXPos !== event.pageX || startYPos !== event.pageY) {
              /** @type {boolean} */
              clickDragged = true;
            }
          }
        });
      }
      if ("checkbox" === this.type) {
        this.buttonElement.bind("click" + this.eventNamespace, function() {
          return options.disabled || clickDragged ? false : void 0;
        });
      } else {
        if ("radio" === this.type) {
          this.buttonElement.bind("click" + this.eventNamespace, function() {
            if (options.disabled || clickDragged) {
              return false;
            }
            $(this).addClass("ui-state-active");
            that.buttonElement.attr("aria-pressed", "true");
            var radio = that.element[0];
            radioGroup(radio).not(radio).map(function() {
              return $(this).button("widget")[0];
            }).removeClass("ui-state-active").attr("aria-pressed", "false");
          });
        } else {
          this.buttonElement.bind("mousedown" + this.eventNamespace, function() {
            return options.disabled ? false : ($(this).addClass("ui-state-active"), a = this, that.document.one("mouseup", function() {
              /** @type {null} */
              a = null;
            }), void 0);
          }).bind("mouseup" + this.eventNamespace, function() {
            return options.disabled ? false : ($(this).removeClass("ui-state-active"), void 0);
          }).bind("keydown" + this.eventNamespace, function(event) {
            return options.disabled ? false : ((event.keyCode === $.ui.keyCode.SPACE || event.keyCode === $.ui.keyCode.ENTER) && $(this).addClass("ui-state-active"), void 0);
          }).bind("keyup" + this.eventNamespace + " blur" + this.eventNamespace, function() {
            $(this).removeClass("ui-state-active");
          });
          if (this.buttonElement.is("a")) {
            this.buttonElement.keyup(function(event) {
              if (event.keyCode === $.ui.keyCode.SPACE) {
                $(this).click();
              }
            });
          }
        }
      }
      this._setOption("disabled", options.disabled);
      this._resetButton();
    },
    _determineButtonType : function() {
      var a;
      var b;
      var checked;
      /** @type {string} */
      this.type = this.element.is("[type=checkbox]") ? "checkbox" : this.element.is("[type=radio]") ? "radio" : this.element.is("input") ? "input" : "button";
      if ("checkbox" === this.type || "radio" === this.type) {
        a = this.element.parents().last();
        /** @type {string} */
        b = "label[for='" + this.element.attr("id") + "']";
        this.buttonElement = a.find(b);
        if (!this.buttonElement.length) {
          a = a.length ? a.siblings() : this.element.siblings();
          this.buttonElement = a.filter(b);
          if (!this.buttonElement.length) {
            this.buttonElement = a.find(b);
          }
        }
        this.element.addClass("ui-helper-hidden-accessible");
        checked = this.element.is(":checked");
        if (checked) {
          this.buttonElement.addClass("ui-state-active");
        }
        this.buttonElement.prop("aria-pressed", checked);
      } else {
        this.buttonElement = this.element;
      }
    },
    widget : function() {
      return this.buttonElement;
    },
    _destroy : function() {
      this.element.removeClass("ui-helper-hidden-accessible");
      this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active  ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());
      if (!this.hasTitle) {
        this.buttonElement.removeAttr("title");
      }
    },
    _setOption : function(value, key) {
      return this._super(value, key), "disabled" === value ? (key ? this.element.prop("disabled", true) : this.element.prop("disabled", false), void 0) : (this._resetButton(), void 0);
    },
    refresh : function() {
      var value = this.element.is("input, button") ? this.element.is(":disabled") : this.element.hasClass("ui-button-disabled");
      if (value !== this.options.disabled) {
        this._setOption("disabled", value);
      }
      if ("radio" === this.type) {
        radioGroup(this.element[0]).each(function() {
          if ($(this).is(":checked")) {
            $(this).button("widget").addClass("ui-state-active").attr("aria-pressed", "true");
          } else {
            $(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false");
          }
        });
      } else {
        if ("checkbox" === this.type) {
          if (this.element.is(":checked")) {
            this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true");
          } else {
            this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", "false");
          }
        }
      }
    },
    _resetButton : function() {
      if ("input" === this.type) {
        return this.options.label && this.element.val(this.options.label), void 0;
      }
      var element = this.buttonElement.removeClass("ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only");
      var value = $("<span></span>", this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(element.empty()).text();
      var icons = this.options.icons;
      var multipleIcons = icons.primary && icons.secondary;
      /** @type {!Array} */
      var buttonClasses = [];
      if (icons.primary || icons.secondary) {
        if (this.options.text) {
          buttonClasses.push("ui-button-text-icon" + (multipleIcons ? "s" : icons.primary ? "-primary" : "-secondary"));
        }
        if (icons.primary) {
          element.prepend("<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>");
        }
        if (icons.secondary) {
          element.append("<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>");
        }
        if (!this.options.text) {
          buttonClasses.push(multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only");
          if (!this.hasTitle) {
            element.attr("title", $.trim(value));
          }
        }
      } else {
        buttonClasses.push("ui-button-text-only");
      }
      element.addClass(buttonClasses.join(" "));
    }
  });
  $.widget("ui.buttonset", {
    version : "1.10.3",
    options : {
      items : "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"
    },
    _create : function() {
      this.element.addClass("ui-buttonset");
    },
    _init : function() {
      this.refresh();
    },
    _setOption : function(key, value) {
      if ("disabled" === key) {
        this.buttons.button("option", key, value);
      }
      this._super(key, value);
    },
    refresh : function() {
      /** @type {boolean} */
      var rtl = "rtl" === this.element.css("direction");
      this.buttons = this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function() {
        return $(this).button("widget")[0];
      }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(rtl ? "ui-corner-right" : "ui-corner-left").end().filter(":last").addClass(rtl ? "ui-corner-left" : "ui-corner-right").end().end();
    },
    _destroy : function() {
      this.element.removeClass("ui-buttonset");
      this.buttons.map(function() {
        return $(this).button("widget")[0];
      }).removeClass("ui-corner-left ui-corner-right").end().button("destroy");
    }
  });
})(jQuery);
(function($, undefined) {
  /**
   * @return {undefined}
   */
  function Datepicker() {
    /** @type {null} */
    this._curInst = null;
    /** @type {boolean} */
    this._keyEvent = false;
    /** @type {!Array} */
    this._disabledInputs = [];
    /** @type {boolean} */
    this._inDialog = this._datepickerShowing = false;
    /** @type {string} */
    this._mainDivId = "ui-datepicker-div";
    /** @type {string} */
    this._inlineClass = "ui-datepicker-inline";
    /** @type {string} */
    this._appendClass = "ui-datepicker-append";
    /** @type {string} */
    this._triggerClass = "ui-datepicker-trigger";
    /** @type {string} */
    this._dialogClass = "ui-datepicker-dialog";
    /** @type {string} */
    this._disableClass = "ui-datepicker-disabled";
    /** @type {string} */
    this._unselectableClass = "ui-datepicker-unselectable";
    /** @type {string} */
    this._currentClass = "ui-datepicker-current-day";
    /** @type {string} */
    this._dayOverClass = "ui-datepicker-days-cell-over";
    /** @type {!Array} */
    this.regional = [];
    this.regional[""] = {
      closeText : "Done",
      prevText : "Prev",
      nextText : "Next",
      currentText : "Today",
      monthNames : "January February March April May June July August September October November December".split(" "),
      monthNamesShort : "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
      dayNames : "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
      dayNamesShort : "Sun Mon Tue Wed Thu Fri Sat".split(" "),
      dayNamesMin : "Su Mo Tu We Th Fr Sa".split(" "),
      weekHeader : "Wk",
      dateFormat : "mm/dd/yy",
      firstDay : 0,
      isRTL : false,
      showMonthAfterYear : false,
      yearSuffix : ""
    };
    this._defaults = {
      showOn : "focus",
      showAnim : "fadeIn",
      showOptions : {},
      defaultDate : null,
      appendText : "",
      buttonText : "...",
      buttonImage : "",
      buttonImageOnly : false,
      hideIfNoPrevNext : false,
      navigationAsDateFormat : false,
      gotoCurrent : false,
      changeMonth : false,
      changeYear : false,
      yearRange : "c-10:c+10",
      showOtherMonths : false,
      selectOtherMonths : false,
      showWeek : false,
      calculateWeek : this.iso8601Week,
      shortYearCutoff : "+10",
      minDate : null,
      maxDate : null,
      duration : "fast",
      beforeShowDay : null,
      beforeShow : null,
      onSelect : null,
      onChangeMonthYear : null,
      onClose : null,
      numberOfMonths : 1,
      showCurrentAtPos : 0,
      stepMonths : 1,
      stepBigMonths : 12,
      altField : "",
      altFormat : "",
      constrainInput : true,
      showButtonPanel : false,
      autoSize : false,
      disabled : false
    };
    $.extend(this._defaults, this.regional[""]);
    this.dpDiv = bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
  }
  /**
   * @param {!Object} dpDiv
   * @return {?}
   */
  function bindHover(dpDiv) {
    return dpDiv.delegate("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a", "mouseout", function() {
      $(this).removeClass("ui-state-hover");
      if (-1 !== this.className.indexOf("ui-datepicker-prev")) {
        $(this).removeClass("ui-datepicker-prev-hover");
      }
      if (-1 !== this.className.indexOf("ui-datepicker-next")) {
        $(this).removeClass("ui-datepicker-next-hover");
      }
    }).delegate("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a", "mouseover", function() {
      if (!$.datepicker._isDisabledDatepicker(datepicker_instActive.inline ? dpDiv.parent()[0] : datepicker_instActive.input[0])) {
        $(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
        $(this).addClass("ui-state-hover");
        if (-1 !== this.className.indexOf("ui-datepicker-prev")) {
          $(this).addClass("ui-datepicker-prev-hover");
        }
        if (-1 !== this.className.indexOf("ui-datepicker-next")) {
          $(this).addClass("ui-datepicker-next-hover");
        }
      }
    });
  }
  /**
   * @param {undefined} target
   * @param {!Object} props
   * @return {?}
   */
  function extendRemove(target, props) {
    $.extend(target, props);
    var name;
    for (name in props) {
      if (null == props[name]) {
        target[name] = props[name];
      }
    }
    return target;
  }
  $.extend($.ui, {
    datepicker : {
      version : "1.10.3"
    }
  });
  var datepicker_instActive;
  $.extend(Datepicker.prototype, {
    markerClassName : "hasDatepicker",
    maxRows : 4,
    _widgetDatepicker : function() {
      return this.dpDiv;
    },
    setDefaults : function(options) {
      return extendRemove(this._defaults, options || {}), this;
    },
    _attachDatepicker : function(target, settings) {
      var nodeName;
      var inline;
      var inst;
      nodeName = target.nodeName.toLowerCase();
      /** @type {boolean} */
      inline = "div" === nodeName || "span" === nodeName;
      if (!target.id) {
        this.uuid += 1;
        /** @type {string} */
        target.id = "dp" + this.uuid;
      }
      inst = this._newInst($(target), inline);
      inst.settings = $.extend({}, settings || {});
      if ("input" === nodeName) {
        this._connectDatepicker(target, inst);
      } else {
        if (inline) {
          this._inlineDatepicker(target, inst);
        }
      }
    },
    _newInst : function(target, inline) {
      return {
        id : target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"),
        input : target,
        selectedDay : 0,
        selectedMonth : 0,
        selectedYear : 0,
        drawMonth : 0,
        drawYear : 0,
        inline : inline,
        dpDiv : inline ? bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) : this.dpDiv
      };
    },
    _connectDatepicker : function(target, inst) {
      var input = $(target);
      inst.append = $([]);
      inst.trigger = $([]);
      if (!input.hasClass(this.markerClassName)) {
        this._attachments(input, inst);
        input.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp);
        this._autoSize(inst);
        $.data(target, "datepicker", inst);
        if (inst.settings.disabled) {
          this._disableDatepicker(target);
        }
      }
    },
    _attachments : function(input, inst) {
      var showOn;
      var buttonText;
      var buttonImage;
      showOn = this._get(inst, "appendText");
      var isRTL = this._get(inst, "isRTL");
      if (inst.append) {
        inst.append.remove();
      }
      if (showOn) {
        inst.append = $("<span class='" + this._appendClass + "'>" + showOn + "</span>");
        input[isRTL ? "before" : "after"](inst.append);
      }
      input.unbind("focus", this._showDatepicker);
      if (inst.trigger) {
        inst.trigger.remove();
      }
      showOn = this._get(inst, "showOn");
      if (!("focus" !== showOn && "both" !== showOn)) {
        input.focus(this._showDatepicker);
      }
      if (!("button" !== showOn && "both" !== showOn)) {
        buttonText = this._get(inst, "buttonText");
        buttonImage = this._get(inst, "buttonImage");
        inst.trigger = $(this._get(inst, "buttonImageOnly") ? $("<img/>").addClass(this._triggerClass).attr({
          src : buttonImage,
          alt : buttonText,
          title : buttonText
        }) : $("<button type='button'></button>").addClass(this._triggerClass).html(buttonImage ? $("<img/>").attr({
          src : buttonImage,
          alt : buttonText,
          title : buttonText
        }) : buttonText));
        input[isRTL ? "before" : "after"](inst.trigger);
        inst.trigger.click(function() {
          return $.datepicker._datepickerShowing && $.datepicker._lastInput === input[0] ? $.datepicker._hideDatepicker() : $.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0] ? ($.datepicker._hideDatepicker(), $.datepicker._showDatepicker(input[0])) : $.datepicker._showDatepicker(input[0]), false;
        });
      }
    },
    _autoSize : function(inst) {
      if (this._get(inst, "autoSize") && !inst.inline) {
        var findMax;
        var m;
        var x;
        var i;
        /** @type {!Date} */
        var date = new Date(2009, 11, 20);
        var dateFormat = this._get(inst, "dateFormat");
        if (dateFormat.match(/[DM]/)) {
          /**
           * @param {!NodeList} names
           * @return {?}
           */
          findMax = function(names) {
            /** @type {number} */
            i = x = m = 0;
            for (; names.length > i; i++) {
              if (names[i].length > m) {
                m = names[i].length;
                /** @type {number} */
                x = i;
              }
            }
            return x;
          };
          date.setMonth(findMax(this._get(inst, dateFormat.match(/MM/) ? "monthNames" : "monthNamesShort")));
          date.setDate(findMax(this._get(inst, dateFormat.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - date.getDay());
        }
        inst.input.attr("size", this._formatDate(inst, date).length);
      }
    },
    _inlineDatepicker : function(target, inst) {
      var divSpan = $(target);
      if (!divSpan.hasClass(this.markerClassName)) {
        divSpan.addClass(this.markerClassName).append(inst.dpDiv);
        $.data(target, "datepicker", inst);
        this._setDate(inst, this._getDefaultDate(inst), true);
        this._updateDatepicker(inst);
        this._updateAlternate(inst);
        if (inst.settings.disabled) {
          this._disableDatepicker(target);
        }
        inst.dpDiv.css("display", "block");
      }
    },
    _dialogDatepicker : function(inst, date, onSelect, settings, pos) {
      var id;
      var $c$;
      var ch;
      var n;
      var l;
      inst = this._dialogInst;
      return inst || (this.uuid += 1, id = "dp" + this.uuid, this._dialogInput = $("<input type='text' id='" + id + "' style='position: absolute; top: -100px; width: 0px;'/>"), this._dialogInput.keydown(this._doKeyDown), $("body").append(this._dialogInput), inst = this._dialogInst = this._newInst(this._dialogInput, false), inst.settings = {}, $.data(this._dialogInput[0], "datepicker", inst)), extendRemove(inst.settings, settings || {}), date = date && date.constructor === Date ? this._formatDate(inst, 
      date) : date, this._dialogInput.val(date), this._pos = pos ? pos.length ? pos : [pos.pageX, pos.pageY] : null, this._pos || ($c$ = document.documentElement.clientWidth, ch = document.documentElement.clientHeight, n = document.documentElement.scrollLeft || document.body.scrollLeft, l = document.documentElement.scrollTop || document.body.scrollTop, this._pos = [$c$ / 2 - 100 + n, ch / 2 - 150 + l]), this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), inst.settings.onSelect = 
      onSelect, this._inDialog = true, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), $.blockUI && $.blockUI(this.dpDiv), $.data(this._dialogInput[0], "datepicker", inst), this;
    },
    _destroyDatepicker : function(target) {
      var nodeName;
      var $target = $(target);
      var inst = $.data(target, "datepicker");
      if ($target.hasClass(this.markerClassName)) {
        nodeName = target.nodeName.toLowerCase();
        $.removeData(target, "datepicker");
        if ("input" === nodeName) {
          inst.append.remove();
          inst.trigger.remove();
          $target.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp);
        } else {
          if ("div" === nodeName || "span" === nodeName) {
            $target.removeClass(this.markerClassName).empty();
          }
        }
      }
    },
    _enableDatepicker : function(target) {
      var nodeName;
      var tthisli;
      var $target = $(target);
      var inst = $.data(target, "datepicker");
      if ($target.hasClass(this.markerClassName)) {
        nodeName = target.nodeName.toLowerCase();
        if ("input" === nodeName) {
          /** @type {boolean} */
          target.disabled = false;
          inst.trigger.filter("button").each(function() {
            /** @type {boolean} */
            this.disabled = false;
          }).end().filter("img").css({
            opacity : "1.0",
            cursor : ""
          });
        } else {
          if ("div" === nodeName || "span" === nodeName) {
            tthisli = $target.children("." + this._inlineClass);
            tthisli.children().removeClass("ui-state-disabled");
            tthisli.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", false);
          }
        }
        this._disabledInputs = $.map(this._disabledInputs, function(value) {
          return value === target ? null : value;
        });
      }
    },
    _disableDatepicker : function(target) {
      var nodeName;
      var tthisli;
      var $target = $(target);
      var inst = $.data(target, "datepicker");
      if ($target.hasClass(this.markerClassName)) {
        nodeName = target.nodeName.toLowerCase();
        if ("input" === nodeName) {
          /** @type {boolean} */
          target.disabled = true;
          inst.trigger.filter("button").each(function() {
            /** @type {boolean} */
            this.disabled = true;
          }).end().filter("img").css({
            opacity : "0.5",
            cursor : "default"
          });
        } else {
          if ("div" === nodeName || "span" === nodeName) {
            tthisli = $target.children("." + this._inlineClass);
            tthisli.children().addClass("ui-state-disabled");
            tthisli.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", true);
          }
        }
        this._disabledInputs = $.map(this._disabledInputs, function(value) {
          return value === target ? null : value;
        });
        /** @type {!Object} */
        this._disabledInputs[this._disabledInputs.length] = target;
      }
    },
    _isDisabledDatepicker : function(target) {
      if (!target) {
        return false;
      }
      /** @type {number} */
      var i = 0;
      for (; this._disabledInputs.length > i; i++) {
        if (this._disabledInputs[i] === target) {
          return true;
        }
      }
      return false;
    },
    _getInst : function(target) {
      try {
        return $.data(target, "datepicker");
      } catch (h) {
        throw "Missing instance data for this datepicker";
      }
    },
    _optionDatepicker : function(target, name, value) {
      var options;
      var date;
      var minDate;
      var maxDate;
      var inst = this._getInst(target);
      return 2 === arguments.length && "string" == typeof name ? "defaults" === name ? $.extend({}, $.datepicker._defaults) : inst ? "all" === name ? $.extend({}, inst.settings) : this._get(inst, name) : null : (options = name || {}, "string" == typeof name && (options = {}, options[name] = value), inst && (this._curInst === inst && this._hideDatepicker(), date = this._getDateDatepicker(target, true), minDate = this._getMinMaxDate(inst, "min"), maxDate = this._getMinMaxDate(inst, "max"), extendRemove(inst.settings, 
      options), null !== minDate && options.dateFormat !== undefined && options.minDate === undefined && (inst.settings.minDate = this._formatDate(inst, minDate)), null !== maxDate && options.dateFormat !== undefined && options.maxDate === undefined && (inst.settings.maxDate = this._formatDate(inst, maxDate)), "disabled" in options && (options.disabled ? this._disableDatepicker(target) : this._enableDatepicker(target)), this._attachments($(target), inst), this._autoSize(inst), this._setDate(inst, 
      date), this._updateAlternate(inst), this._updateDatepicker(inst)), undefined);
    },
    _changeDatepicker : function(target, name, value) {
      this._optionDatepicker(target, name, value);
    },
    _refreshDatepicker : function(inst) {
      if (inst = this._getInst(inst)) {
        this._updateDatepicker(inst);
      }
    },
    _setDateDatepicker : function(inst, date) {
      if (inst = this._getInst(inst)) {
        this._setDate(inst, date);
        this._updateDatepicker(inst);
        this._updateAlternate(inst);
      }
    },
    _getDateDatepicker : function(inst, noDefault) {
      inst = this._getInst(inst);
      return inst && !inst.inline && this._setDateFromField(inst, noDefault), inst ? this._getDate(inst) : null;
    },
    _doKeyDown : function(event) {
      var onSelect;
      var dateStr;
      var sel;
      var inst = $.datepicker._getInst(event.target);
      /** @type {boolean} */
      var f = true;
      var isRTL = inst.dpDiv.is(".ui-datepicker-rtl");
      if (inst._keyEvent = true, $.datepicker._datepickerShowing) {
        switch(event.keyCode) {
          case 9:
            $.datepicker._hideDatepicker();
            /** @type {boolean} */
            f = false;
            break;
          case 13:
            return sel = $("td." + $.datepicker._dayOverClass + ":not(." + $.datepicker._currentClass + ")", inst.dpDiv), sel[0] && $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]), onSelect = $.datepicker._get(inst, "onSelect"), onSelect ? (dateStr = $.datepicker._formatDate(inst), onSelect.apply(inst.input ? inst.input[0] : null, [dateStr, inst])) : $.datepicker._hideDatepicker(), false;
          case 27:
            $.datepicker._hideDatepicker();
            break;
          case 33:
            $.datepicker._adjustDate(event.target, event.ctrlKey ? -$.datepicker._get(inst, "stepBigMonths") : -$.datepicker._get(inst, "stepMonths"), "M");
            break;
          case 34:
            $.datepicker._adjustDate(event.target, event.ctrlKey ? +$.datepicker._get(inst, "stepBigMonths") : +$.datepicker._get(inst, "stepMonths"), "M");
            break;
          case 35:
            if (event.ctrlKey || event.metaKey) {
              $.datepicker._clearDate(event.target);
            }
            f = event.ctrlKey || event.metaKey;
            break;
          case 36:
            if (event.ctrlKey || event.metaKey) {
              $.datepicker._gotoToday(event.target);
            }
            f = event.ctrlKey || event.metaKey;
            break;
          case 37:
            if (event.ctrlKey || event.metaKey) {
              $.datepicker._adjustDate(event.target, isRTL ? 1 : -1, "D");
            }
            f = event.ctrlKey || event.metaKey;
            if (event.originalEvent.altKey) {
              $.datepicker._adjustDate(event.target, event.ctrlKey ? -$.datepicker._get(inst, "stepBigMonths") : -$.datepicker._get(inst, "stepMonths"), "M");
            }
            break;
          case 38:
            if (event.ctrlKey || event.metaKey) {
              $.datepicker._adjustDate(event.target, -7, "D");
            }
            f = event.ctrlKey || event.metaKey;
            break;
          case 39:
            if (event.ctrlKey || event.metaKey) {
              $.datepicker._adjustDate(event.target, isRTL ? -1 : 1, "D");
            }
            f = event.ctrlKey || event.metaKey;
            if (event.originalEvent.altKey) {
              $.datepicker._adjustDate(event.target, event.ctrlKey ? +$.datepicker._get(inst, "stepBigMonths") : +$.datepicker._get(inst, "stepMonths"), "M");
            }
            break;
          case 40:
            if (event.ctrlKey || event.metaKey) {
              $.datepicker._adjustDate(event.target, 7, "D");
            }
            f = event.ctrlKey || event.metaKey;
            break;
          default:
            /** @type {boolean} */
            f = false;
        }
      } else {
        if (36 === event.keyCode && event.ctrlKey) {
          $.datepicker._showDatepicker(this);
        } else {
          /** @type {boolean} */
          f = false;
        }
      }
      if (f) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    _doKeyPress : function(event) {
      var s;
      var i;
      var inst = $.datepicker._getInst(event.target);
      return $.datepicker._get(inst, "constrainInput") ? (s = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat")), i = String.fromCharCode(null == event.charCode ? event.keyCode : event.charCode), event.ctrlKey || event.metaKey || " " > i || !s || -1 < s.indexOf(i)) : undefined;
    },
    _doKeyUp : function(inst) {
      var c;
      inst = $.datepicker._getInst(inst.target);
      if (inst.input.val() !== inst.lastVal) {
        try {
          if (c = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), inst.input ? inst.input.val() : null, $.datepicker._getFormatConfig(inst))) {
            $.datepicker._setDateFromField(inst);
            $.datepicker._updateAlternate(inst);
            $.datepicker._updateDatepicker(inst);
          }
        } catch (k) {
        }
      }
      return true;
    },
    _showDatepicker : function(input) {
      if (input = input.target || input, "input" !== input.nodeName.toLowerCase() && (input = $("input", input.parentNode)[0]), !$.datepicker._isDisabledDatepicker(input) && $.datepicker._lastInput !== input) {
        var inst;
        var beforeShow;
        var isFixed;
        var offset;
        var showAnim;
        var duration;
        inst = $.datepicker._getInst(input);
        if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
          $.datepicker._curInst.dpDiv.stop(true, true);
          if (inst && $.datepicker._datepickerShowing) {
            $.datepicker._hideDatepicker($.datepicker._curInst.input[0]);
          }
        }
        beforeShow = (beforeShow = $.datepicker._get(inst, "beforeShow")) ? beforeShow.apply(input, [input, inst]) : {};
        if (false !== beforeShow) {
          extendRemove(inst.settings, beforeShow);
          /** @type {null} */
          inst.lastVal = null;
          /** @type {!Object} */
          $.datepicker._lastInput = input;
          $.datepicker._setDateFromField(inst);
          if ($.datepicker._inDialog) {
            /** @type {string} */
            input.value = "";
          }
          if (!$.datepicker._pos) {
            $.datepicker._pos = $.datepicker._findPos(input);
            $.datepicker._pos[1] += input.offsetHeight;
          }
          /** @type {boolean} */
          isFixed = false;
          $(input).parents().each(function() {
            return isFixed = isFixed | "fixed" === $(this).css("position"), !isFixed;
          });
          offset = {
            left : $.datepicker._pos[0],
            top : $.datepicker._pos[1]
          };
          /** @type {null} */
          $.datepicker._pos = null;
          inst.dpDiv.empty();
          inst.dpDiv.css({
            position : "absolute",
            display : "block",
            top : "-1000px"
          });
          $.datepicker._updateDatepicker(inst);
          offset = $.datepicker._checkOffset(inst, offset, isFixed);
          inst.dpDiv.css({
            position : $.datepicker._inDialog && $.blockUI ? "static" : isFixed ? "fixed" : "absolute",
            display : "none",
            left : offset.left + "px",
            top : offset.top + "px"
          });
          if (!inst.inline) {
            showAnim = $.datepicker._get(inst, "showAnim");
            duration = $.datepicker._get(inst, "duration");
            inst.dpDiv.zIndex($(input).zIndex() + 1);
            /** @type {boolean} */
            $.datepicker._datepickerShowing = true;
            if ($.effects && $.effects.effect[showAnim]) {
              inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
            } else {
              inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
            }
            if ($.datepicker._shouldFocusInput(inst)) {
              inst.input.focus();
            }
            $.datepicker._curInst = inst;
          }
        }
      }
    },
    _updateDatepicker : function(inst) {
      /** @type {number} */
      this.maxRows = 4;
      /** @type {!Object} */
      datepicker_instActive = inst;
      inst.dpDiv.empty().append(this._generateHTML(inst));
      this._attachHandlers(inst);
      inst.dpDiv.find("." + this._dayOverClass + " a").mouseover();
      var origyearshtml;
      var numMonths = this._getNumberOfMonths(inst);
      var cols = numMonths[1];
      inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
      if (1 < cols) {
        inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", 17 * cols + "em");
      }
      inst.dpDiv[(1 !== numMonths[0] || 1 !== numMonths[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi");
      inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl");
      if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput(inst)) {
        inst.input.focus();
      }
      if (inst.yearshtml) {
        origyearshtml = inst.yearshtml;
        setTimeout(function() {
          if (origyearshtml === inst.yearshtml && inst.yearshtml) {
            inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
          }
          /** @type {null} */
          origyearshtml = inst.yearshtml = null;
        }, 0);
      }
    },
    _shouldFocusInput : function(inst) {
      return inst.input && inst.input.is(":visible") && !inst.input.is(":disabled") && !inst.input.is(":focus");
    },
    _checkOffset : function(inst, offset, isFixed) {
      var dpWidth = inst.dpDiv.outerWidth();
      var dpHeight = inst.dpDiv.outerHeight();
      var inputWidth = inst.input ? inst.input.outerWidth() : 0;
      var inputHeight = inst.input ? inst.input.outerHeight() : 0;
      var viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft());
      var viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());
      return offset.left -= this._get(inst, "isRTL") ? dpWidth - inputWidth : 0, offset.left -= isFixed && offset.left === inst.input.offset().left ? $(document).scrollLeft() : 0, offset.top -= isFixed && offset.top === inst.input.offset().top + inputHeight ? $(document).scrollTop() : 0, offset.left -= Math.min(offset.left, offset.left + dpWidth > viewWidth && viewWidth > dpWidth ? Math.abs(offset.left + dpWidth - viewWidth) : 0), offset.top -= Math.min(offset.top, offset.top + dpHeight > viewHeight && 
      viewHeight > dpHeight ? Math.abs(dpHeight + inputHeight) : 0), offset;
    },
    _findPos : function(obj) {
      var anchorBoundingBoxViewport;
      var inst = this._getInst(obj);
      inst = this._get(inst, "isRTL");
      for (; obj && ("hidden" === obj.type || 1 !== obj.nodeType || $.expr.filters.hidden(obj));) {
        obj = obj[inst ? "previousSibling" : "nextSibling"];
      }
      return anchorBoundingBoxViewport = $(obj).offset(), [anchorBoundingBoxViewport.left, anchorBoundingBoxViewport.top];
    },
    _hideDatepicker : function(input) {
      var showAnim;
      var duration;
      var postProcess;
      var onClose;
      var inst = this._curInst;
      if (!(!inst || input && inst !== $.data(input, "datepicker"))) {
        if (this._datepickerShowing) {
          showAnim = this._get(inst, "showAnim");
          duration = this._get(inst, "duration");
          /**
           * @return {undefined}
           */
          postProcess = function() {
            $.datepicker._tidyDialog(inst);
          };
          if ($.effects && ($.effects.effect[showAnim] || $.effects[showAnim])) {
            inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
          } else {
            inst.dpDiv["slideDown" === showAnim ? "slideUp" : "fadeIn" === showAnim ? "fadeOut" : "hide"](showAnim ? duration : null, postProcess);
          }
          if (!showAnim) {
            postProcess();
          }
          /** @type {boolean} */
          this._datepickerShowing = false;
          onClose = this._get(inst, "onClose");
          if (onClose) {
            onClose.apply(inst.input ? inst.input[0] : null, [inst.input ? inst.input.val() : "", inst]);
          }
          /** @type {null} */
          this._lastInput = null;
          if (this._inDialog) {
            this._dialogInput.css({
              position : "absolute",
              left : "0",
              top : "-100px"
            });
            if ($.blockUI) {
              $.unblockUI();
              $("body").append(this.dpDiv);
            }
          }
          /** @type {boolean} */
          this._inDialog = false;
        }
      }
    },
    _tidyDialog : function(inst) {
      inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
    },
    _checkExternalClick : function($target) {
      if ($.datepicker._curInst) {
        $target = $($target.target);
        var inst = $.datepicker._getInst($target[0]);
        if (!($target[0].id === $.datepicker._mainDivId || 0 !== $target.parents("#" + $.datepicker._mainDivId).length || $target.hasClass($.datepicker.markerClassName) || $target.closest("." + $.datepicker._triggerClass).length || !$.datepicker._datepickerShowing || $.datepicker._inDialog && $.blockUI) || $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst) {
          $.datepicker._hideDatepicker();
        }
      }
    },
    _adjustDate : function(target, offset, period) {
      target = $(target);
      var inst = this._getInst(target[0]);
      if (!this._isDisabledDatepicker(target[0])) {
        this._adjustInstDate(inst, offset + ("M" === period ? this._get(inst, "showCurrentAtPos") : 0), period);
        this._updateDatepicker(inst);
      }
    },
    _gotoToday : function(target) {
      var dTempDate1;
      target = $(target);
      var inst = this._getInst(target[0]);
      if (this._get(inst, "gotoCurrent") && inst.currentDay) {
        inst.selectedDay = inst.currentDay;
        inst.drawMonth = inst.selectedMonth = inst.currentMonth;
        inst.drawYear = inst.selectedYear = inst.currentYear;
      } else {
        /** @type {!Date} */
        dTempDate1 = new Date;
        /** @type {number} */
        inst.selectedDay = dTempDate1.getDate();
        /** @type {number} */
        inst.drawMonth = inst.selectedMonth = dTempDate1.getMonth();
        /** @type {number} */
        inst.drawYear = inst.selectedYear = dTempDate1.getFullYear();
      }
      this._notifyChange(inst);
      this._adjustDate(target);
    },
    _selectMonthYear : function(target, select, period) {
      target = $(target);
      var inst = this._getInst(target[0]);
      /** @type {number} */
      inst["selected" + ("M" === period ? "Month" : "Year")] = inst["draw" + ("M" === period ? "Month" : "Year")] = parseInt(select.options[select.selectedIndex].value, 10);
      this._notifyChange(inst);
      this._adjustDate(target);
    },
    _selectDay : function(id, month, year, td) {
      var inst;
      var target = $(id);
      if (!($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0]))) {
        inst = this._getInst(target[0]);
        inst.selectedDay = inst.currentDay = $("a", td).html();
        inst.selectedMonth = inst.currentMonth = month;
        inst.selectedYear = inst.currentYear = year;
        this._selectDate(id, this._formatDate(inst, inst.currentDay, inst.currentMonth, inst.currentYear));
      }
    },
    _clearDate : function(id) {
      id = $(id);
      this._selectDate(id, "");
    },
    _selectDate : function(onSelect, dateStr) {
      onSelect = $(onSelect);
      var inst = this._getInst(onSelect[0]);
      dateStr = null != dateStr ? dateStr : this._formatDate(inst);
      if (inst.input) {
        inst.input.val(dateStr);
      }
      this._updateAlternate(inst);
      if (onSelect = this._get(inst, "onSelect")) {
        onSelect.apply(inst.input ? inst.input[0] : null, [dateStr, inst]);
      } else {
        if (inst.input) {
          inst.input.trigger("change");
        }
      }
      if (inst.inline) {
        this._updateDatepicker(inst);
      } else {
        this._hideDatepicker();
        this._lastInput = inst.input[0];
        if ("object" != typeof inst.input[0]) {
          inst.input.focus();
        }
        /** @type {null} */
        this._lastInput = null;
      }
    },
    _updateAlternate : function(inst) {
      var d;
      var date;
      var dateStr;
      var altField = this._get(inst, "altField");
      if (altField) {
        d = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
        date = this._getDate(inst);
        dateStr = this.formatDate(d, date, this._getFormatConfig(inst));
        $(altField).each(function() {
          $(this).val(dateStr);
        });
      }
    },
    noWeekends : function(date) {
      date = date.getDay();
      return [0 < date && 6 > date, ""];
    },
    iso8601Week : function(date) {
      var cur;
      /** @type {!Date} */
      date = new Date(date.getTime());
      return date.setDate(date.getDate() + 4 - (date.getDay() || 7)), cur = date.getTime(), date.setMonth(0), date.setDate(1), Math.floor(Math.round((cur - date) / 864E5) / 7) + 1;
    },
    parseDate : function(text, value, settings) {
      if (null == text || null == value) {
        throw "Invalid arguments";
      }
      if (value = "object" == typeof value ? "" + value : value + "", "" === value) {
        return null;
      }
      var i;
      var dim;
      var cookieValue;
      var date;
      /** @type {number} */
      var offset = 0;
      var y = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff;
      y = "string" != typeof y ? y : (new Date).getFullYear() % 100 + parseInt(y, 10);
      var balancer = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
      var un = (settings ? settings.dayNames : null) || this._defaults.dayNames;
      var min = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
      settings = (settings ? settings.monthNames : null) || this._defaults.monthNames;
      /** @type {number} */
      var year = -1;
      /** @type {number} */
      var month = -1;
      /** @type {number} */
      var day = -1;
      /** @type {number} */
      var doy = -1;
      /** @type {boolean} */
      var J = false;
      /**
       * @param {string} name
       * @return {?}
       */
      var match = function(name) {
        /** @type {boolean} */
        name = text.length > i + 1 && text.charAt(i + 1) === name;
        return name && i++, name;
      };
      /**
       * @param {string} string
       * @return {?}
       */
      var getNumber = function(string) {
        var m = match(string);
        /** @type {!RegExp} */
        string = RegExp("^\\d{1," + ("@" === string ? 14 : "!" === string ? 20 : "y" === string && m ? 4 : "o" === string ? 3 : 2) + "}");
        string = value.substring(offset).match(string);
        if (!string) {
          throw "Missing number at position " + offset;
        }
        return offset = offset + string[0].length, parseInt(string[0], 10);
      };
      /**
       * @param {string} value
       * @param {(!Function|boolean)} type
       * @param {!Function} val
       * @return {?}
       */
      var format = function(value, type, val) {
        /** @type {number} */
        var r = -1;
        value = $.map(match(value) ? val : type, function(a, b) {
          return [[b, a]];
        }).sort(function(sortedValueArrays, b) {
          return -(sortedValueArrays[1].length - b[1].length);
        });
        if ($.each(value, function(string, colors) {
          string = colors[1];
          return value.substr(offset, string.length).toLowerCase() === string.toLowerCase() ? (r = colors[0], offset = offset + string.length, false) : undefined;
        }), -1 !== r) {
          return r + 1;
        }
        throw "Unknown name at position " + offset;
      };
      /**
       * @return {undefined}
       */
      var checkLiteral = function() {
        if (value.charAt(offset) !== text.charAt(i)) {
          throw "Unexpected literal at position " + offset;
        }
        offset++;
      };
      /** @type {number} */
      i = 0;
      for (; text.length > i; i++) {
        if (J) {
          if ("'" !== text.charAt(i) || match("'")) {
            checkLiteral();
          } else {
            /** @type {boolean} */
            J = false;
          }
        } else {
          switch(text.charAt(i)) {
            case "d":
              day = getNumber("d");
              break;
            case "D":
              format("D", balancer, un);
              break;
            case "o":
              doy = getNumber("o");
              break;
            case "m":
              month = getNumber("m");
              break;
            case "M":
              month = format("M", min, settings);
              break;
            case "y":
              year = getNumber("y");
              break;
            case "@":
              /** @type {!Date} */
              date = new Date(getNumber("@"));
              /** @type {number} */
              year = date.getFullYear();
              /** @type {number} */
              month = date.getMonth() + 1;
              /** @type {number} */
              day = date.getDate();
              break;
            case "!":
              /** @type {!Date} */
              date = new Date((getNumber("!") - this._ticksTo1970) / 1E4);
              /** @type {number} */
              year = date.getFullYear();
              /** @type {number} */
              month = date.getMonth() + 1;
              /** @type {number} */
              day = date.getDate();
              break;
            case "'":
              if (match("'")) {
                checkLiteral();
              } else {
                /** @type {boolean} */
                J = true;
              }
              break;
            default:
              checkLiteral();
          }
        }
      }
      if (value.length > offset && (cookieValue = value.substr(offset), !/^\s+/.test(cookieValue))) {
        throw "Extra/unparsed characters found in date: " + cookieValue;
      }
      if (-1 === year ? year = (new Date).getFullYear() : 100 > year && (year = year + ((new Date).getFullYear() - (new Date).getFullYear() % 100 + (y >= year ? 0 : -100))), -1 < doy) {
        /** @type {number} */
        month = 1;
        day = doy;
        for (; !(dim = this._getDaysInMonth(year, month - 1), dim >= day);) {
          month++;
          /** @type {number} */
          day = day - dim;
        }
      }
      if (date = this._daylightSavingAdjust(new Date(year, month - 1, day)), date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        throw "Invalid date";
      }
      return date;
    },
    ATOM : "yy-mm-dd",
    COOKIE : "D, dd M yy",
    ISO_8601 : "yy-mm-dd",
    RFC_822 : "D, d M y",
    RFC_850 : "DD, dd-M-y",
    RFC_1036 : "D, d M y",
    RFC_1123 : "D, d M yy",
    RFC_2822 : "D, d M yy",
    RSS : "D, d M y",
    TICKS : "!",
    TIMESTAMP : "@",
    W3C : "yy-mm-dd",
    _ticksTo1970 : 864E9 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)),
    formatDate : function(str, date, settings) {
      if (!date) {
        return "";
      }
      var i;
      var hex = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
      var charMidX = (settings ? settings.dayNames : null) || this._defaults.dayNames;
      var red = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
      settings = (settings ? settings.monthNames : null) || this._defaults.monthNames;
      /**
       * @param {string} m
       * @return {?}
       */
      var look = function(m) {
        /** @type {boolean} */
        m = str.length > i + 1 && str.charAt(i + 1) === m;
        return m && i++, m;
      };
      /**
       * @param {string} m
       * @param {string} str
       * @param {number} n
       * @return {?}
       */
      var formatNumber = function(m, str, n) {
        /** @type {string} */
        str = "" + str;
        if (look(m)) {
          for (; n > str.length;) {
            /** @type {string} */
            str = "0" + str;
          }
        }
        return str;
      };
      /**
       * @param {string} m
       * @param {string} val
       * @param {!Object} s
       * @param {!Object} l
       * @return {?}
       */
      var f2 = function(m, val, s, l) {
        return look(m) ? l[val] : s[val];
      };
      /** @type {string} */
      var output = "";
      /** @type {boolean} */
      var w = false;
      if (date) {
        /** @type {number} */
        i = 0;
        for (; str.length > i; i++) {
          if (w) {
            if ("'" !== str.charAt(i) || look("'")) {
              output = output + str.charAt(i);
            } else {
              /** @type {boolean} */
              w = false;
            }
          } else {
            switch(str.charAt(i)) {
              case "d":
                output = output + formatNumber("d", date.getDate(), 2);
                break;
              case "D":
                output = output + f2("D", date.getDay(), hex, charMidX);
                break;
              case "o":
                output = output + formatNumber("o", Math.round(((new Date(date.getFullYear(), date.getMonth(), date.getDate())).getTime() - (new Date(date.getFullYear(), 0, 0)).getTime()) / 864E5), 3);
                break;
              case "m":
                output = output + formatNumber("m", date.getMonth() + 1, 2);
                break;
              case "M":
                output = output + f2("M", date.getMonth(), red, settings);
                break;
              case "y":
                output = output + (look("y") ? date.getFullYear() : (10 > date.getYear() % 100 ? "0" : "") + date.getYear() % 100);
                break;
              case "@":
                output = output + date.getTime();
                break;
              case "!":
                output = output + (1E4 * date.getTime() + this._ticksTo1970);
                break;
              case "'":
                if (look("'")) {
                  /** @type {string} */
                  output = output + "'";
                } else {
                  /** @type {boolean} */
                  w = true;
                }
                break;
              default:
                output = output + str.charAt(i);
            }
          }
        }
      }
      return output;
    },
    _possibleChars : function(format) {
      var iFormat;
      /** @type {string} */
      var chars = "";
      /** @type {boolean} */
      var e = false;
      /**
       * @param {string} n
       * @return {?}
       */
      var lookAhead = function(n) {
        /** @type {boolean} */
        n = format.length > iFormat + 1 && format.charAt(iFormat + 1) === n;
        return n && iFormat++, n;
      };
      /** @type {number} */
      iFormat = 0;
      for (; format.length > iFormat; iFormat++) {
        if (e) {
          if ("'" !== format.charAt(iFormat) || lookAhead("'")) {
            chars = chars + format.charAt(iFormat);
          } else {
            /** @type {boolean} */
            e = false;
          }
        } else {
          switch(format.charAt(iFormat)) {
            case "d":
            case "m":
            case "y":
            case "@":
              /** @type {string} */
              chars = chars + "0123456789";
              break;
            case "D":
            case "M":
              return null;
            case "'":
              if (lookAhead("'")) {
                /** @type {string} */
                chars = chars + "'";
              } else {
                /** @type {boolean} */
                e = true;
              }
              break;
            default:
              chars = chars + format.charAt(iFormat);
          }
        }
      }
      return chars;
    },
    _get : function(data, name) {
      return data.settings[name] !== undefined ? data.settings[name] : this._defaults[name];
    },
    _setDateFromField : function(inst, noDefault) {
      if (inst.input.val() !== inst.lastVal) {
        var dateFormat = this._get(inst, "dateFormat");
        var dates = inst.lastVal = inst.input ? inst.input.val() : null;
        var defaultDate = this._getDefaultDate(inst);
        var date = defaultDate;
        var settings = this._getFormatConfig(inst);
        try {
          date = this.parseDate(dateFormat, dates, settings) || defaultDate;
        } catch (r) {
          dates = noDefault ? "" : dates;
        }
        inst.selectedDay = date.getDate();
        inst.drawMonth = inst.selectedMonth = date.getMonth();
        inst.drawYear = inst.selectedYear = date.getFullYear();
        inst.currentDay = dates ? date.getDate() : 0;
        inst.currentMonth = dates ? date.getMonth() : 0;
        inst.currentYear = dates ? date.getFullYear() : 0;
        this._adjustInstDate(inst);
      }
    },
    _getDefaultDate : function(inst) {
      return this._restrictMinMax(inst, this._determineDate(inst, this._get(inst, "defaultDate"), new Date));
    },
    _determineDate : function(inst, data, val) {
      /**
       * @param {string} delta
       * @return {?}
       */
      var offsetNumeric = function(delta) {
        /** @type {!Date} */
        var date = new Date;
        return date.setDate(date.getDate() + delta), date;
      };
      /**
       * @param {string} offset
       * @return {?}
       */
      var offsetString = function(offset) {
        try {
          return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), offset, $.datepicker._getFormatConfig(inst));
        } catch (w) {
        }
        var day = (offset.toLowerCase().match(/^c/) ? $.datepicker._getDate(inst) : null) || new Date;
        var year = day.getFullYear();
        var month = day.getMonth();
        day = day.getDate();
        /** @type {!RegExp} */
        var RE_PART = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
        /** @type {(Array<string>|null)} */
        var matches = RE_PART.exec(offset);
        for (; matches;) {
          switch(matches[2] || "d") {
            case "d":
            case "D":
              day = day + parseInt(matches[1], 10);
              break;
            case "w":
            case "W":
              day = day + 7 * parseInt(matches[1], 10);
              break;
            case "m":
            case "M":
              month = month + parseInt(matches[1], 10);
              /** @type {number} */
              day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
              break;
            case "y":
            case "Y":
              year = year + parseInt(matches[1], 10);
              /** @type {number} */
              day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
          }
          /** @type {(Array<string>|null)} */
          matches = RE_PART.exec(offset);
        }
        return new Date(year, month, day);
      };
      data = null == data || "" === data ? val : "string" == typeof data ? offsetString(data) : "number" == typeof data ? isNaN(data) ? val : offsetNumeric(data) : new Date(data.getTime());
      return data = data && "Invalid Date" == "" + data ? val : data, data && (data.setHours(0), data.setMinutes(0), data.setSeconds(0), data.setMilliseconds(0)), this._daylightSavingAdjust(data);
    },
    _daylightSavingAdjust : function(date) {
      return date ? (date.setHours(12 < date.getHours() ? date.getHours() + 2 : 0), date) : null;
    },
    _setDate : function(inst, date, noChange) {
      /** @type {boolean} */
      var clear = !date;
      var drawYear = inst.selectedMonth;
      var drawMonth = inst.selectedYear;
      date = this._restrictMinMax(inst, this._determineDate(inst, date, new Date));
      inst.selectedDay = inst.currentDay = date.getDate();
      inst.drawMonth = inst.selectedMonth = inst.currentMonth = date.getMonth();
      inst.drawYear = inst.selectedYear = inst.currentYear = date.getFullYear();
      if (!(drawYear === inst.selectedMonth && drawMonth === inst.selectedYear || noChange)) {
        this._notifyChange(inst);
      }
      this._adjustInstDate(inst);
      if (inst.input) {
        inst.input.val(clear ? "" : this._formatDate(inst));
      }
    },
    _getDate : function(inst) {
      return !inst.currentYear || inst.input && "" === inst.input.val() ? null : this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay));
    },
    _attachHandlers : function(inst) {
      var stepMonths = this._get(inst, "stepMonths");
      var id = "#" + inst.id.replace(/\\\\/g, "\\");
      inst.dpDiv.find("[data-handler]").map(function() {
        $(this).bind(this.getAttribute("data-event"), {
          prev : function() {
            $.datepicker._adjustDate(id, -stepMonths, "M");
          },
          next : function() {
            $.datepicker._adjustDate(id, +stepMonths, "M");
          },
          hide : function() {
            $.datepicker._hideDatepicker();
          },
          today : function() {
            $.datepicker._gotoToday(id);
          },
          selectDay : function() {
            return $.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this), false;
          },
          selectMonth : function() {
            return $.datepicker._selectMonthYear(id, this, "M"), false;
          },
          selectYear : function() {
            return $.datepicker._selectMonthYear(id, this, "Y"), false;
          }
        }[this.getAttribute("data-handler")]);
      });
    },
    _generateHTML : function(inst) {
      var val;
      var date;
      var hideIfNoPrevNext;
      var currentText;
      var firstDay;
      var args;
      var dayNamesMin;
      var monthNames;
      var monthNamesShort;
      var beforeShowDay;
      var showOtherMonths;
      var selectOtherMonths;
      var defaultDate;
      var result;
      var i;
      var MIN_RUNS;
      var content;
      var MIN_RUN_TIME;
      var max;
      var text;
      var c;
      var printDate;
      var midcolumn;
      var js;
      var daySettings;
      var otherMonth;
      var unselectable;
      /** @type {!Date} */
      var today = new Date;
      today = this._daylightSavingAdjust(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
      var isRTL = this._get(inst, "isRTL");
      args = this._get(inst, "showButtonPanel");
      hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext");
      firstDay = this._get(inst, "navigationAsDateFormat");
      var numMonths = this._getNumberOfMonths(inst);
      var drawMonth = this._get(inst, "showCurrentAtPos");
      currentText = this._get(inst, "stepMonths");
      /** @type {boolean} */
      var o = 1 !== numMonths[0] || 1 !== numMonths[1];
      var selectedDate = this._daylightSavingAdjust(inst.currentDay ? new Date(inst.currentYear, inst.currentMonth, inst.currentDay) : new Date(9999, 9, 9));
      var minDate = this._getMinMaxDate(inst, "min");
      var maxDate = this._getMinMaxDate(inst, "max");
      /** @type {number} */
      drawMonth = inst.drawMonth - drawMonth;
      var drawYear = inst.drawYear;
      if (0 > drawMonth && (drawMonth = drawMonth + 12, drawYear--), maxDate) {
        val = this._daylightSavingAdjust(new Date(maxDate.getFullYear(), maxDate.getMonth() - numMonths[0] * numMonths[1] + 1, maxDate.getDate()));
        val = minDate && minDate > val ? minDate : val;
        for (; this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > val;) {
          drawMonth--;
          if (0 > drawMonth) {
            /** @type {number} */
            drawMonth = 11;
            drawYear--;
          }
        }
      }
      /** @type {number} */
      inst.drawMonth = drawMonth;
      inst.drawYear = drawYear;
      val = this._get(inst, "prevText");
      val = firstDay ? this.formatDate(val, this._daylightSavingAdjust(new Date(drawYear, drawMonth - currentText, 1)), this._getFormatConfig(inst)) : val;
      /** @type {string} */
      val = this._canAdjustMonth(inst, -1, drawYear, drawMonth) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" + val + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "e" : "w") + "'>" + val + "</span></a>" : hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + val + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "e" : "w") + "'>" + val + "</span></a>";
      date = this._get(inst, "nextText");
      date = firstDay ? this.formatDate(date, this._daylightSavingAdjust(new Date(drawYear, drawMonth + currentText, 1)), this._getFormatConfig(inst)) : date;
      /** @type {string} */
      hideIfNoPrevNext = this._canAdjustMonth(inst, 1, drawYear, drawMonth) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" + date + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "w" : "e") + "'>" + date + "</span></a>" : hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + date + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "w" : "e") + "'>" + date + "</span></a>";
      currentText = this._get(inst, "currentText");
      date = this._get(inst, "gotoCurrent") && inst.currentDay ? selectedDate : today;
      currentText = firstDay ? this.formatDate(currentText, date, this._getFormatConfig(inst)) : currentText;
      /** @type {string} */
      firstDay = inst.inline ? "" : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(inst, "closeText") + "</button>";
      /** @type {string} */
      args = args ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? firstDay : "") + (this._isInRange(inst, date) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" + currentText + "</button>" : "") + (isRTL ? "" : firstDay) + "</div>" : "";
      /** @type {number} */
      firstDay = parseInt(this._get(inst, "firstDay"), 10);
      /** @type {number} */
      firstDay = isNaN(firstDay) ? 0 : firstDay;
      currentText = this._get(inst, "showWeek");
      date = this._get(inst, "dayNames");
      dayNamesMin = this._get(inst, "dayNamesMin");
      monthNames = this._get(inst, "monthNames");
      monthNamesShort = this._get(inst, "monthNamesShort");
      beforeShowDay = this._get(inst, "beforeShowDay");
      showOtherMonths = this._get(inst, "showOtherMonths");
      selectOtherMonths = this._get(inst, "selectOtherMonths");
      defaultDate = this._getDefaultDate(inst);
      /** @type {string} */
      result = "";
      /** @type {number} */
      MIN_RUNS = 0;
      for (; numMonths[0] > MIN_RUNS; MIN_RUNS++) {
        /** @type {string} */
        content = "";
        /** @type {number} */
        this.maxRows = 4;
        /** @type {number} */
        MIN_RUN_TIME = 0;
        for (; numMonths[1] > MIN_RUN_TIME; MIN_RUN_TIME++) {
          if (max = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay)), i = " ui-corner-all", text = "", o) {
            if (text = text + "<div class='ui-datepicker-group", 1 < numMonths[1]) {
              switch(MIN_RUN_TIME) {
                case 0:
                  /** @type {string} */
                  text = text + " ui-datepicker-group-first";
                  /** @type {string} */
                  i = " ui-corner-" + (isRTL ? "right" : "left");
                  break;
                case numMonths[1] - 1:
                  /** @type {string} */
                  text = text + " ui-datepicker-group-last";
                  /** @type {string} */
                  i = " ui-corner-" + (isRTL ? "left" : "right");
                  break;
                default:
                  /** @type {string} */
                  text = text + " ui-datepicker-group-middle";
                  /** @type {string} */
                  i = "";
              }
            }
            /** @type {string} */
            text = text + "'>";
          }
          /** @type {string} */
          text = text + ("<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + i + "'>" + (/all|left/.test(i) && 0 === MIN_RUNS ? isRTL ? hideIfNoPrevNext : val : "") + (/all|right/.test(i) && 0 === MIN_RUNS ? isRTL ? val : hideIfNoPrevNext : "") + this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate, 0 < MIN_RUNS || 0 < MIN_RUN_TIME, monthNames, monthNamesShort) + "</div><table class='ui-datepicker-calendar'><thead><tr>");
          /** @type {string} */
          c = currentText ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "";
          /** @type {number} */
          i = 0;
          for (; 7 > i; i++) {
            /** @type {number} */
            printDate = (i + firstDay) % 7;
            /** @type {string} */
            c = c + ("<th" + (5 <= (i + firstDay + 6) % 7 ? " class='ui-datepicker-week-end'" : "") + "><span title='" + date[printDate] + "'>" + dayNamesMin[printDate] + "</span></th>");
          }
          /** @type {string} */
          text = text + (c + "</tr></thead><tbody>");
          c = this._getDaysInMonth(drawYear, drawMonth);
          if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
            /** @type {number} */
            inst.selectedDay = Math.min(inst.selectedDay, c);
          }
          /** @type {number} */
          i = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
          /** @type {number} */
          c = Math.ceil((i + c) / 7);
          /** @type {number} */
          this.maxRows = c = o ? this.maxRows > c ? this.maxRows : c : c;
          printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - i));
          /** @type {number} */
          midcolumn = 0;
          for (; c > midcolumn; midcolumn++) {
            /** @type {string} */
            text = text + "<tr>";
            /** @type {string} */
            js = currentText ? "<td class='ui-datepicker-week-col'>" + this._get(inst, "calculateWeek")(printDate) + "</td>" : "";
            /** @type {number} */
            i = 0;
            for (; 7 > i; i++) {
              daySettings = beforeShowDay ? beforeShowDay.apply(inst.input ? inst.input[0] : null, [printDate]) : [true, ""];
              unselectable = (otherMonth = printDate.getMonth() !== drawMonth) && !selectOtherMonths || !daySettings[0] || minDate && minDate > printDate || maxDate && printDate > maxDate;
              /** @type {string} */
              js = js + ("<td class='" + (5 <= (i + firstDay + 6) % 7 ? " ui-datepicker-week-end" : "") + (otherMonth ? " ui-datepicker-other-month" : "") + (printDate.getTime() === max.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent || defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === max.getTime() ? " " + this._dayOverClass : "") + (unselectable ? " " + this._unselectableClass + " ui-state-disabled" : "") + (otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + 
              (printDate.getTime() === selectedDate.getTime() ? " " + this._currentClass : "") + (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + (otherMonth && !showOtherMonths || !daySettings[2] ? "" : " title='" + daySettings[2].replace(/'/g, "&#39;") + "'") + (unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + (otherMonth && !showOtherMonths ? "&#xa0;" : 
              unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" + (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") + (printDate.getTime() === selectedDate.getTime() ? " ui-state-active" : "") + (otherMonth ? " ui-priority-secondary" : "") + "' href='#'>" + printDate.getDate() + "</a>") + "</td>");
              printDate.setDate(printDate.getDate() + 1);
              printDate = this._daylightSavingAdjust(printDate);
            }
            /** @type {string} */
            text = text + (js + "</tr>");
          }
          drawMonth++;
          if (11 < drawMonth) {
            /** @type {number} */
            drawMonth = 0;
            drawYear++;
          }
          /** @type {string} */
          text = text + ("</tbody></table>" + (o ? "</div>" + (0 < numMonths[0] && MIN_RUN_TIME === numMonths[1] - 1 ? "<div class='ui-datepicker-row-break'></div>" : "") : ""));
          /** @type {string} */
          content = content + text;
        }
        /** @type {string} */
        result = result + content;
      }
      return result = result + args, inst._keyEvent = false, result;
    },
    _generateMonthYearHeader : function(inst, year, drawYear, minDate, maxDate, secondary, determineYear, m) {
      var v;
      var d;
      var result;
      var changeMonth = this._get(inst, "changeMonth");
      var changeYear = this._get(inst, "changeYear");
      var showMonthAfterYear = this._get(inst, "showMonthAfterYear");
      /** @type {string} */
      var html = "<div class='ui-datepicker-title'>";
      /** @type {string} */
      var key = "";
      if (secondary || !changeMonth) {
        /** @type {string} */
        key = key + ("<span class='ui-datepicker-month'>" + determineYear[year] + "</span>");
      } else {
        determineYear = minDate && minDate.getFullYear() === drawYear;
        v = maxDate && maxDate.getFullYear() === drawYear;
        /** @type {string} */
        key = key + "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
        /** @type {number} */
        d = 0;
        for (; 12 > d; d++) {
          if ((!determineYear || d >= minDate.getMonth()) && (!v || maxDate.getMonth() >= d)) {
            /** @type {string} */
            key = key + ("<option value='" + d + "'" + (d === year ? " selected='selected'" : "") + ">" + m[d] + "</option>");
          }
        }
        /** @type {string} */
        key = key + "</select>";
      }
      if (showMonthAfterYear || (html = html + (key + (!secondary && changeMonth && changeYear ? "" : "&#xa0;"))), !inst.yearshtml) {
        if (inst.yearshtml = "", secondary || !changeYear) {
          /** @type {string} */
          html = html + ("<span class='ui-datepicker-year'>" + drawYear + "</span>");
        } else {
          m = this._get(inst, "yearRange").split(":");
          /** @type {number} */
          result = (new Date).getFullYear();
          /**
           * @param {string} value
           * @return {?}
           */
          determineYear = function(value) {
            value = value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) : value.match(/[+\-].*/) ? result + parseInt(value, 10) : parseInt(value, 10);
            return isNaN(value) ? result : value;
          };
          year = determineYear(m[0]);
          /** @type {number} */
          m = Math.max(year, determineYear(m[1] || ""));
          year = minDate ? Math.max(year, minDate.getFullYear()) : year;
          /** @type {number} */
          m = maxDate ? Math.min(m, maxDate.getFullYear()) : m;
          inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
          for (; m >= year; year++) {
            inst.yearshtml += "<option value='" + year + "'" + (year === drawYear ? " selected='selected'" : "") + ">" + year + "</option>";
          }
          inst.yearshtml += "</select>";
          /** @type {string} */
          html = html + inst.yearshtml;
          /** @type {null} */
          inst.yearshtml = null;
        }
      }
      return html = html + this._get(inst, "yearSuffix"), showMonthAfterYear && (html = html + ((!secondary && changeMonth && changeYear ? "" : "&#xa0;") + key)), html = html + "</div>";
    },
    _adjustInstDate : function(inst, offset, period) {
      var date = inst.drawYear + ("Y" === period ? offset : 0);
      var month = inst.drawMonth + ("M" === period ? offset : 0);
      offset = Math.min(inst.selectedDay, this._getDaysInMonth(date, month)) + ("D" === period ? offset : 0);
      date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(date, month, offset)));
      inst.selectedDay = date.getDate();
      inst.drawMonth = inst.selectedMonth = date.getMonth();
      inst.drawYear = inst.selectedYear = date.getFullYear();
      if (!("M" !== period && "Y" !== period)) {
        this._notifyChange(inst);
      }
    },
    _restrictMinMax : function(maxDate, date) {
      var minDate = this._getMinMaxDate(maxDate, "min");
      maxDate = this._getMinMaxDate(maxDate, "max");
      date = minDate && minDate > date ? minDate : date;
      return maxDate && date > maxDate ? maxDate : date;
    },
    _notifyChange : function(inst) {
      var onChange = this._get(inst, "onChangeMonthYear");
      if (onChange) {
        onChange.apply(inst.input ? inst.input[0] : null, [inst.selectedYear, inst.selectedMonth + 1, inst]);
      }
    },
    _getNumberOfMonths : function(o) {
      o = this._get(o, "numberOfMonths");
      return null == o ? [1, 1] : "number" == typeof o ? [1, o] : o;
    },
    _getMinMaxDate : function(inst, minMax) {
      return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
    },
    _getDaysInMonth : function(year, month) {
      return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
    },
    _getFirstDayOfMonth : function(year, month) {
      return (new Date(year, month, 1)).getDay();
    },
    _canAdjustMonth : function(inst, offset, date, curMonth) {
      var numMonths = this._getNumberOfMonths(inst);
      date = this._daylightSavingAdjust(new Date(date, curMonth + (0 > offset ? offset : numMonths[0] * numMonths[1]), 1));
      return 0 > offset && date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth())), this._isInRange(inst, date);
    },
    _isInRange : function(inst, date) {
      var d;
      var e;
      var minDate = this._getMinMaxDate(inst, "min");
      var maxDate = this._getMinMaxDate(inst, "max");
      /** @type {null} */
      var w = null;
      /** @type {null} */
      var value = null;
      inst = this._get(inst, "yearRange");
      return inst && (d = inst.split(":"), e = (new Date).getFullYear(), w = parseInt(d[0], 10), value = parseInt(d[1], 10), d[0].match(/[+\-].*/) && (w = w + e), d[1].match(/[+\-].*/) && (value = value + e)), (!minDate || date.getTime() >= minDate.getTime()) && (!maxDate || date.getTime() <= maxDate.getTime()) && (!w || date.getFullYear() >= w) && (!value || value >= date.getFullYear());
    },
    _getFormatConfig : function(inst) {
      var shortYearCutoff = this._get(inst, "shortYearCutoff");
      return shortYearCutoff = "string" != typeof shortYearCutoff ? shortYearCutoff : (new Date).getFullYear() % 100 + parseInt(shortYearCutoff, 10), {
        shortYearCutoff : shortYearCutoff,
        dayNamesShort : this._get(inst, "dayNamesShort"),
        dayNames : this._get(inst, "dayNames"),
        monthNamesShort : this._get(inst, "monthNamesShort"),
        monthNames : this._get(inst, "monthNames")
      };
    },
    _formatDate : function(inst, day, month, year) {
      if (!day) {
        inst.currentDay = inst.selectedDay;
        inst.currentMonth = inst.selectedMonth;
        inst.currentYear = inst.selectedYear;
      }
      day = day ? "object" == typeof day ? day : this._daylightSavingAdjust(new Date(year, month, day)) : this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay));
      return this.formatDate(this._get(inst, "dateFormat"), day, this._getFormatConfig(inst));
    }
  });
  /**
   * @param {string} options
   * @return {?}
   */
  $.fn.datepicker = function(options) {
    if (!this.length) {
      return this;
    }
    if (!$.datepicker.initialized) {
      $(document).mousedown($.datepicker._checkExternalClick);
      /** @type {boolean} */
      $.datepicker.initialized = true;
    }
    if (0 === $("#" + $.datepicker._mainDivId).length) {
      $("body").append($.datepicker.dpDiv);
    }
    /** @type {!Array<?>} */
    var c = Array.prototype.slice.call(arguments, 1);
    return "string" != typeof options || "isDisabled" !== options && "getDate" !== options && "widget" !== options ? "option" === options && 2 === arguments.length && "string" == typeof arguments[1] ? $.datepicker["_" + options + "Datepicker"].apply($.datepicker, [this[0]].concat(c)) : this.each(function() {
      if ("string" == typeof options) {
        $.datepicker["_" + options + "Datepicker"].apply($.datepicker, [this].concat(c));
      } else {
        $.datepicker._attachDatepicker(this, options);
      }
    }) : $.datepicker["_" + options + "Datepicker"].apply($.datepicker, [this[0]].concat(c));
  };
  $.datepicker = new Datepicker;
  /** @type {boolean} */
  $.datepicker.initialized = false;
  /** @type {number} */
  $.datepicker.uuid = (new Date).getTime();
  /** @type {string} */
  $.datepicker.version = "1.10.3";
})(jQuery);
(function($) {
  var sizeRelatedOptions = {
    buttons : true,
    height : true,
    maxHeight : true,
    maxWidth : true,
    minHeight : true,
    minWidth : true,
    width : true
  };
  var resizableRelatedOptions = {
    maxHeight : true,
    maxWidth : true,
    minHeight : true,
    minWidth : true
  };
  $.widget("ui.dialog", {
    version : "1.10.3",
    options : {
      appendTo : "body",
      autoOpen : true,
      buttons : [],
      closeOnEscape : true,
      closeText : "close",
      dialogClass : "",
      draggable : true,
      hide : null,
      height : "auto",
      maxHeight : null,
      maxWidth : null,
      minHeight : 150,
      minWidth : 150,
      modal : false,
      position : {
        my : "center",
        at : "center",
        of : window,
        collision : "fit",
        using : function(pos) {
          var topOffset = $(this).css(pos).offset().top;
          if (0 > topOffset) {
            $(this).css("top", pos.top - topOffset);
          }
        }
      },
      resizable : true,
      show : null,
      title : null,
      width : 300,
      beforeClose : null,
      close : null,
      drag : null,
      dragStart : null,
      dragStop : null,
      focus : null,
      open : null,
      resize : null,
      resizeStart : null,
      resizeStop : null
    },
    _create : function() {
      this.originalCss = {
        display : this.element[0].style.display,
        width : this.element[0].style.width,
        minHeight : this.element[0].style.minHeight,
        maxHeight : this.element[0].style.maxHeight,
        height : this.element[0].style.height
      };
      this.originalPosition = {
        parent : this.element.parent(),
        index : this.element.parent().children().index(this.element)
      };
      this.originalTitle = this.element.attr("title");
      this.options.title = this.options.title || this.originalTitle;
      this._createWrapper();
      this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog);
      this._createTitlebar();
      this._createButtonPane();
      if (this.options.draggable && $.fn.draggable) {
        this._makeDraggable();
      }
      if (this.options.resizable && $.fn.resizable) {
        this._makeResizable();
      }
      /** @type {boolean} */
      this._isOpen = false;
    },
    _init : function() {
      if (this.options.autoOpen) {
        this.open();
      }
    },
    _appendTo : function() {
      var element = this.options.appendTo;
      return element && (element.jquery || element.nodeType) ? $(element) : this.document.find(element || "body").eq(0);
    },
    _destroy : function() {
      var next;
      var originalPosition = this.originalPosition;
      this._destroyOverlay();
      this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach();
      this.uiDialog.stop(true, true).remove();
      if (this.originalTitle) {
        this.element.attr("title", this.originalTitle);
      }
      next = originalPosition.parent.children().eq(originalPosition.index);
      if (next.length && next[0] !== this.element[0]) {
        next.before(this.element);
      } else {
        originalPosition.parent.append(this.element);
      }
    },
    widget : function() {
      return this.uiDialog;
    },
    disable : $.noop,
    enable : $.noop,
    close : function(event) {
      var self = this;
      if (this._isOpen && false !== this._trigger("beforeClose", event)) {
        /** @type {boolean} */
        this._isOpen = false;
        this._destroyOverlay();
        if (!this.opener.filter(":focusable").focus().length) {
          $(this.document[0].activeElement).blur();
        }
        this._hide(this.uiDialog, this.options.hide, function() {
          self._trigger("close", event);
        });
      }
    },
    isOpen : function() {
      return this._isOpen;
    },
    moveToTop : function() {
      this._moveToTop();
    },
    _moveToTop : function(event, silent) {
      /** @type {boolean} */
      var dc = !!this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length;
      return dc && !silent && this._trigger("focus", event), dc;
    },
    open : function() {
      var that = this;
      return this._isOpen ? (this._moveToTop() && this._focusTabbable(), void 0) : (this._isOpen = true, this.opener = $(this.document[0].activeElement), this._size(), this._position(), this._createOverlay(), this._moveToTop(null, true), this._show(this.uiDialog, this.options.show, function() {
        that._focusTabbable();
        that._trigger("focus");
      }), this._trigger("open"), void 0);
    },
    _focusTabbable : function() {
      var hasFocus = this.element.find("[autofocus]");
      if (!hasFocus.length) {
        hasFocus = this.element.find(":tabbable");
      }
      if (!hasFocus.length) {
        hasFocus = this.uiDialogButtonPane.find(":tabbable");
      }
      if (!hasFocus.length) {
        hasFocus = this.uiDialogTitlebarClose.filter(":tabbable");
      }
      if (!hasFocus.length) {
        hasFocus = this.uiDialog;
      }
      hasFocus.eq(0).focus();
    },
    _keepFocus : function(event) {
      /**
       * @return {undefined}
       */
      function checkFocus() {
        var activeElement = this.document[0].activeElement;
        if (!(this.uiDialog[0] === activeElement || $.contains(this.uiDialog[0], activeElement))) {
          this._focusTabbable();
        }
      }
      event.preventDefault();
      checkFocus.call(this);
      this._delay(checkFocus);
    },
    _createWrapper : function() {
      this.uiDialog = $("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front " + this.options.dialogClass).hide().attr({
        tabIndex : -1,
        role : "dialog"
      }).appendTo(this._appendTo());
      this._on(this.uiDialog, {
        keydown : function(event) {
          if (this.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {
            return event.preventDefault(), this.close(event), void 0;
          }
          if (event.keyCode === $.ui.keyCode.TAB) {
            var elem = this.uiDialog.find(":tabbable");
            var element = elem.filter(":first");
            elem = elem.filter(":last");
            if (event.target !== elem[0] && event.target !== this.uiDialog[0] || event.shiftKey) {
              if (!(event.target !== element[0] && event.target !== this.uiDialog[0] || !event.shiftKey)) {
                elem.focus(1);
                event.preventDefault();
              }
            } else {
              element.focus(1);
              event.preventDefault();
            }
          }
        },
        mousedown : function(event) {
          if (this._moveToTop(event)) {
            this._focusTabbable();
          }
        }
      });
      if (!this.element.find("[aria-describedby]").length) {
        this.uiDialog.attr({
          "aria-describedby" : this.element.uniqueId().attr("id")
        });
      }
    },
    _createTitlebar : function() {
      var uiDialogTitle;
      this.uiDialogTitlebar = $("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog);
      this._on(this.uiDialogTitlebar, {
        mousedown : function(event) {
          if (!$(event.target).closest(".ui-dialog-titlebar-close")) {
            this.uiDialog.focus();
          }
        }
      });
      this.uiDialogTitlebarClose = $("<button></button>").button({
        label : this.options.closeText,
        icons : {
          primary : "ui-icon-closethick"
        },
        text : false
      }).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar);
      this._on(this.uiDialogTitlebarClose, {
        click : function(event) {
          event.preventDefault();
          this.close(event);
        }
      });
      uiDialogTitle = $("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar);
      this._title(uiDialogTitle);
      this.uiDialog.attr({
        "aria-labelledby" : uiDialogTitle.attr("id")
      });
    },
    _title : function(title) {
      if (!this.options.title) {
        title.html("&#160;");
      }
      title.text(this.options.title);
    },
    _createButtonPane : function() {
      this.uiDialogButtonPane = $("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix");
      this.uiButtonSet = $("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane);
      this._createButtons();
    },
    _createButtons : function() {
      var that = this;
      var buttons = this.options.buttons;
      return this.uiDialogButtonPane.remove(), this.uiButtonSet.empty(), $.isEmptyObject(buttons) || $.isArray(buttons) && !buttons.length ? (this.uiDialog.removeClass("ui-dialog-buttons"), void 0) : ($.each(buttons, function(options, props) {
        var click;
        props = $.isFunction(props) ? {
          click : props,
          text : options
        } : props;
        props = $.extend({
          type : "button"
        }, props);
        click = props.click;
        /**
         * @return {undefined}
         */
        props.click = function() {
          click.apply(that.element[0], arguments);
        };
        options = {
          icons : props.icons,
          text : props.showText
        };
        delete props.icons;
        delete props.showText;
        $("<button></button>", props).button(options).appendTo(that.uiButtonSet);
      }), this.uiDialog.addClass("ui-dialog-buttons"), this.uiDialogButtonPane.appendTo(this.uiDialog), void 0);
    },
    _makeDraggable : function() {
      /**
       * @param {!Object} ui
       * @return {?}
       */
      function filteredUi(ui) {
        return {
          position : ui.position,
          offset : ui.offset
        };
      }
      var that = this;
      var options = this.options;
      this.uiDialog.draggable({
        cancel : ".ui-dialog-content, .ui-dialog-titlebar-close",
        handle : ".ui-dialog-titlebar",
        containment : "document",
        start : function(e, ui) {
          $(this).addClass("ui-dialog-dragging");
          that._blockFrames();
          that._trigger("dragStart", e, filteredUi(ui));
        },
        drag : function(e, ui) {
          that._trigger("drag", e, filteredUi(ui));
        },
        stop : function(name, ui) {
          /** @type {!Array} */
          options.position = [ui.position.left - that.document.scrollLeft(), ui.position.top - that.document.scrollTop()];
          $(this).removeClass("ui-dialog-dragging");
          that._unblockFrames();
          that._trigger("dragStop", name, filteredUi(ui));
        }
      });
    },
    _makeResizable : function() {
      /**
       * @param {!Object} ui
       * @return {?}
       */
      function filteredUi(ui) {
        return {
          originalPosition : ui.originalPosition,
          originalSize : ui.originalSize,
          position : ui.position,
          size : ui.size
        };
      }
      var that = this;
      var options = this.options;
      var handles = options.resizable;
      var $selfPosition = this.uiDialog.css("position");
      /** @type {string} */
      handles = "string" == typeof handles ? handles : "n,e,s,w,se,sw,ne,nw";
      this.uiDialog.resizable({
        cancel : ".ui-dialog-content",
        containment : "document",
        alsoResize : this.element,
        maxWidth : options.maxWidth,
        maxHeight : options.maxHeight,
        minWidth : options.minWidth,
        minHeight : this._minHeight(),
        handles : handles,
        start : function(e, ui) {
          $(this).addClass("ui-dialog-resizing");
          that._blockFrames();
          that._trigger("resizeStart", e, filteredUi(ui));
        },
        resize : function(e, ui) {
          that._trigger("resize", e, filteredUi(ui));
        },
        stop : function(name, ui) {
          options.height = $(this).height();
          options.width = $(this).width();
          $(this).removeClass("ui-dialog-resizing");
          that._unblockFrames();
          that._trigger("resizeStop", name, filteredUi(ui));
        }
      }).css("position", $selfPosition);
    },
    _minHeight : function() {
      var options = this.options;
      return "auto" === options.height ? options.minHeight : Math.min(options.minHeight, options.height);
    },
    _position : function() {
      var a = this.uiDialog.is(":visible");
      if (!a) {
        this.uiDialog.show();
      }
      this.uiDialog.position(this.options.position);
      if (!a) {
        this.uiDialog.hide();
      }
    },
    _setOptions : function(options) {
      var that = this;
      /** @type {boolean} */
      var e = false;
      var resizableOptions = {};
      $.each(options, function(key, value) {
        that._setOption(key, value);
        if (key in sizeRelatedOptions) {
          /** @type {boolean} */
          e = true;
        }
        if (key in resizableRelatedOptions) {
          resizableOptions[key] = value;
        }
      });
      if (e) {
        this._size();
        this._position();
      }
      if (this.uiDialog.is(":data(ui-resizable)")) {
        this.uiDialog.resizable("option", resizableOptions);
      }
    },
    _setOption : function(name, value) {
      var isDraggable;
      var match;
      var uiDialog = this.uiDialog;
      if ("dialogClass" === name) {
        uiDialog.removeClass(this.options.dialogClass).addClass(value);
      }
      if ("disabled" !== name) {
        this._super(name, value);
        if ("appendTo" === name) {
          this.uiDialog.appendTo(this._appendTo());
        }
        if ("buttons" === name) {
          this._createButtons();
        }
        if ("closeText" === name) {
          this.uiDialogTitlebarClose.button({
            label : "" + value
          });
        }
        if ("draggable" === name) {
          isDraggable = uiDialog.is(":data(ui-draggable)");
          if (isDraggable && !value) {
            uiDialog.draggable("destroy");
          }
          if (!isDraggable && value) {
            this._makeDraggable();
          }
        }
        if ("position" === name) {
          this._position();
        }
        if ("resizable" === name) {
          match = uiDialog.is(":data(ui-resizable)");
          if (match && !value) {
            uiDialog.resizable("destroy");
          }
          if (match && "string" == typeof value) {
            uiDialog.resizable("option", "handles", value);
          }
          if (!(match || false === value)) {
            this._makeResizable();
          }
        }
        if ("title" === name) {
          this._title(this.uiDialogTitlebar.find(".ui-dialog-title"));
        }
      }
    },
    _size : function() {
      var nonContentHeight;
      var Height;
      var maxContentHeight;
      var options = this.options;
      this.element.show().css({
        width : "auto",
        minHeight : 0,
        maxHeight : "none",
        height : 0
      });
      if (options.minWidth > options.width) {
        options.width = options.minWidth;
      }
      nonContentHeight = this.uiDialog.css({
        height : "auto",
        width : options.width
      }).outerHeight();
      /** @type {number} */
      Height = Math.max(0, options.minHeight - nonContentHeight);
      /** @type {(number|string)} */
      maxContentHeight = "number" == typeof options.maxHeight ? Math.max(0, options.maxHeight - nonContentHeight) : "none";
      if ("auto" === options.height) {
        this.element.css({
          minHeight : Height,
          maxHeight : maxContentHeight,
          height : "auto"
        });
      } else {
        this.element.height(Math.max(0, options.height - nonContentHeight));
      }
      if (this.uiDialog.is(":data(ui-resizable)")) {
        this.uiDialog.resizable("option", "minHeight", this._minHeight());
      }
    },
    _blockFrames : function() {
      this.iframeBlocks = this.document.find("iframe").map(function() {
        var $overlayContent = $(this);
        return $("<div>").css({
          position : "absolute",
          width : $overlayContent.outerWidth(),
          height : $overlayContent.outerHeight()
        }).appendTo($overlayContent.parent()).offset($overlayContent.offset())[0];
      });
    },
    _unblockFrames : function() {
      if (this.iframeBlocks) {
        this.iframeBlocks.remove();
        delete this.iframeBlocks;
      }
    },
    _allowInteraction : function(event) {
      return $(event.target).closest(".ui-dialog").length ? true : !!$(event.target).closest(".ui-datepicker").length;
    },
    _createOverlay : function() {
      if (this.options.modal) {
        var that = this;
        var fullName = this.widgetFullName;
        if (!$.ui.dialog.overlayInstances) {
          this._delay(function() {
            if ($.ui.dialog.overlayInstances) {
              this.document.bind("focusin.dialog", function(event) {
                if (!that._allowInteraction(event)) {
                  event.preventDefault();
                  $(".ui-dialog:visible:last .ui-dialog-content").data(fullName)._focusTabbable();
                }
              });
            }
          });
        }
        this.overlay = $("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo());
        this._on(this.overlay, {
          mousedown : "_keepFocus"
        });
        $.ui.dialog.overlayInstances++;
      }
    },
    _destroyOverlay : function() {
      if (this.options.modal && this.overlay) {
        $.ui.dialog.overlayInstances--;
        if (!$.ui.dialog.overlayInstances) {
          this.document.unbind("focusin.dialog");
        }
        this.overlay.remove();
        /** @type {null} */
        this.overlay = null;
      }
    }
  });
  /** @type {number} */
  $.ui.dialog.overlayInstances = 0;
  if (false !== $.uiBackCompat) {
    $.widget("ui.dialog", $.ui.dialog, {
      _position : function() {
        var a;
        var position = this.options.position;
        /** @type {!Array} */
        var files = [];
        /** @type {!Array} */
        var result = [0, 0];
        if (position) {
          if ("string" == typeof position || "object" == typeof position && "0" in position) {
            files = position.split ? position.split(" ") : [position[0], position[1]];
            if (1 === files.length) {
              files[1] = files[0];
            }
            $.each(["left", "top"], function(name, childFiles) {
              if (+files[name] === files[name]) {
                result[name] = files[name];
                files[name] = childFiles;
              }
            });
            position = {
              my : files[0] + (0 > result[0] ? result[0] : "+" + result[0]) + " " + files[1] + (0 > result[1] ? result[1] : "+" + result[1]),
              at : files.join(" ")
            };
          }
          position = $.extend({}, $.ui.dialog.prototype.options.position, position);
        } else {
          position = $.ui.dialog.prototype.options.position;
        }
        if (!(a = this.uiDialog.is(":visible"))) {
          this.uiDialog.show();
        }
        this.uiDialog.position(position);
        if (!a) {
          this.uiDialog.hide();
        }
      }
    });
  }
})(jQuery);
(function($) {
  /** @type {!RegExp} */
  var KEY_GETTER = /up|down|vertical/;
  /** @type {!RegExp} */
  var reMaxWidth = /up|left|vertical|horizontal/;
  /**
   * @param {!Object} o
   * @param {?} done
   * @return {undefined}
   */
  $.effects.effect.blind = function(o, done) {
    var query;
    var val;
    var value;
    var el = $(this);
    /** @type {!Array<string>} */
    var props = "position top bottom left right height width".split(" ");
    var propertyName = $.effects.setMode(el, o.mode || "hide");
    query = o.direction || "up";
    /** @type {boolean} */
    var vertical = KEY_GETTER.test(query);
    /** @type {string} */
    var prop = vertical ? "height" : "width";
    /** @type {string} */
    var key = vertical ? "top" : "left";
    /** @type {boolean} */
    var fragmentedQuery = reMaxWidth.test(query);
    var obj = {};
    /** @type {boolean} */
    var isArray = "show" === propertyName;
    if (el.parent().is(".ui-effects-wrapper")) {
      $.effects.save(el.parent(), props);
    } else {
      $.effects.save(el, props);
    }
    el.show();
    query = $.effects.createWrapper(el).css({
      overflow : "hidden"
    });
    val = query[prop]();
    /** @type {number} */
    value = parseFloat(query.css(key)) || 0;
    obj[prop] = isArray ? val : 0;
    if (!fragmentedQuery) {
      el.css(vertical ? "bottom" : "right", 0).css(vertical ? "top" : "left", "auto").css({
        position : "absolute"
      });
      obj[key] = isArray ? value : val + value;
    }
    if (isArray) {
      query.css(prop, 0);
      if (!fragmentedQuery) {
        query.css(key, value + val);
      }
    }
    query.animate(obj, {
      duration : o.duration,
      easing : o.easing,
      queue : false,
      complete : function() {
        if ("hide" === propertyName) {
          el.hide();
        }
        $.effects.restore(el, props);
        $.effects.removeWrapper(el);
        done();
      }
    });
  };
})(jQuery);
(function($) {
  /**
   * @param {!Object} o
   * @param {?} done
   * @return {undefined}
   */
  $.effects.effect.bounce = function(o, done) {
    var active;
    var css;
    var animation;
    var el = $(this);
    /** @type {!Array<string>} */
    var props = "position top bottom left right height width".split(" ");
    var value = $.effects.setMode(el, o.mode || "effect");
    /** @type {boolean} */
    var selected = "hide" === value;
    /** @type {boolean} */
    active = "show" === value;
    var dir = o.direction || "up";
    value = o.distance;
    var strLenSize = o.times || 5;
    /** @type {number} */
    var anims = 2 * strLenSize + (active || selected ? 1 : 0);
    /** @type {number} */
    var duration = o.duration / anims;
    o = o.easing;
    /** @type {string} */
    var key = "up" === dir || "down" === dir ? "top" : "left";
    /** @type {boolean} */
    dir = "up" === dir || "left" === dir;
    var queue = el.queue();
    var i = queue.length;
    if (active || selected) {
      props.push("opacity");
    }
    $.effects.save(el, props);
    el.show();
    $.effects.createWrapper(el);
    if (!value) {
      /** @type {number} */
      value = el["top" === key ? "outerHeight" : "outerWidth"]() / 3;
    }
    if (active) {
      animation = {
        opacity : 1
      };
      /** @type {number} */
      animation[key] = 0;
      el.css("opacity", 0).css(key, dir ? 2 * -value : 2 * value).animate(animation, duration, o);
    }
    if (selected) {
      /** @type {number} */
      value = value / Math.pow(2, strLenSize - 1);
    }
    animation = {};
    /** @type {number} */
    active = animation[key] = 0;
    for (; strLenSize > active; active++) {
      css = {};
      /** @type {string} */
      css[key] = (dir ? "-=" : "+=") + value;
      el.animate(css, duration, o).animate(animation, duration, o);
      /** @type {number} */
      value = selected ? 2 * value : value / 2;
    }
    if (selected) {
      css = {
        opacity : 0
      };
      /** @type {string} */
      css[key] = (dir ? "-=" : "+=") + value;
      el.animate(css, duration, o);
    }
    el.queue(function() {
      if (selected) {
        el.hide();
      }
      $.effects.restore(el, props);
      $.effects.removeWrapper(el);
      done();
    });
    if (1 < i) {
      queue.splice.apply(queue, [1, 0].concat(queue.splice(i, anims + 1)));
    }
    el.dequeue();
  };
})(jQuery);
(function($) {
  /**
   * @param {!Object} o
   * @param {?} done
   * @return {undefined}
   */
  $.effects.effect.clip = function(o, done) {
    var element;
    var distance;
    var el = $(this);
    /** @type {!Array<string>} */
    var props = "position top bottom left right height width".split(" ");
    /** @type {boolean} */
    var show = "show" === $.effects.setMode(el, o.mode || "hide");
    /** @type {boolean} */
    var dir = "vertical" === (o.direction || "vertical");
    /** @type {string} */
    var ref = dir ? "height" : "width";
    /** @type {string} */
    dir = dir ? "top" : "left";
    var animation = {};
    $.effects.save(el, props);
    el.show();
    element = $.effects.createWrapper(el).css({
      overflow : "hidden"
    });
    element = "IMG" === el[0].tagName ? element : el;
    distance = element[ref]();
    if (show) {
      element.css(ref, 0);
      element.css(dir, distance / 2);
    }
    animation[ref] = show ? distance : 0;
    /** @type {number} */
    animation[dir] = show ? 0 : distance / 2;
    element.animate(animation, {
      queue : false,
      duration : o.duration,
      easing : o.easing,
      complete : function() {
        if (!show) {
          el.hide();
        }
        $.effects.restore(el, props);
        $.effects.removeWrapper(el);
        done();
      }
    });
  };
})(jQuery);
(function($) {
  /**
   * @param {!Object} o
   * @param {!Object} callback
   * @return {undefined}
   */
  $.effects.effect.drop = function(o, callback) {
    var dir;
    var el = $(this);
    /** @type {!Array<string>} */
    var props = "position top bottom left right opacity height width".split(" ");
    var propertyName = $.effects.setMode(el, o.mode || "hide");
    /** @type {boolean} */
    var itemAddStr = "show" === propertyName;
    dir = o.direction || "left";
    /** @type {string} */
    var pos = "up" === dir || "down" === dir ? "top" : "left";
    /** @type {string} */
    var motion = "up" === dir || "left" === dir ? "pos" : "neg";
    var style = {
      opacity : itemAddStr ? 1 : 0
    };
    $.effects.save(el, props);
    el.show();
    $.effects.createWrapper(el);
    dir = o.distance || el["top" === pos ? "outerHeight" : "outerWidth"](true) / 2;
    if (itemAddStr) {
      el.css("opacity", 0).css(pos, "pos" === motion ? -dir : dir);
    }
    /** @type {string} */
    style[pos] = (itemAddStr ? "pos" === motion ? "+=" : "-=" : "pos" === motion ? "-=" : "+=") + dir;
    el.animate(style, {
      queue : false,
      duration : o.duration,
      easing : o.easing,
      complete : function() {
        if ("hide" === propertyName) {
          el.hide();
        }
        $.effects.restore(el, props);
        $.effects.removeWrapper(el);
        callback();
      }
    });
  };
})(jQuery);
(function($) {
  /**
   * @param {!Object} o
   * @param {?} done
   * @return {undefined}
   */
  $.effects.effect.explode = function(o, done) {
    /**
     * @return {undefined}
     */
    function onHide() {
      pieces.push(this);
      if (pieces.length === rows * cells) {
        el.css({
          visibility : "visible"
        });
        $(pieces).remove();
        if (!show) {
          el.hide();
        }
        done();
      }
    }
    var i;
    var j;
    var left;
    var top;
    var mx;
    var my;
    /** @type {number} */
    var rows = o.pieces ? Math.round(Math.sqrt(o.pieces)) : 3;
    /** @type {number} */
    var cells = rows;
    var el = $(this);
    /** @type {boolean} */
    var show = "show" === $.effects.setMode(el, o.mode || "hide");
    var offset = el.show().css("visibility", "hidden").offset();
    /** @type {number} */
    var width = Math.ceil(el.outerWidth() / cells);
    /** @type {number} */
    var height = Math.ceil(el.outerHeight() / rows);
    /** @type {!Array} */
    var pieces = [];
    /** @type {number} */
    i = 0;
    for (; rows > i; i++) {
      top = offset.top + i * height;
      /** @type {number} */
      my = i - (rows - 1) / 2;
      /** @type {number} */
      j = 0;
      for (; cells > j; j++) {
        left = offset.left + j * width;
        /** @type {number} */
        mx = j - (cells - 1) / 2;
        el.clone().appendTo("body").wrap("<div></div>").css({
          position : "absolute",
          visibility : "visible",
          left : -j * width,
          top : -i * height
        }).parent().addClass("ui-effects-explode").css({
          position : "absolute",
          overflow : "hidden",
          width : width,
          height : height,
          left : left + (show ? mx * width : 0),
          top : top + (show ? my * height : 0),
          opacity : show ? 0 : 1
        }).animate({
          left : left + (show ? 0 : mx * width),
          top : top + (show ? 0 : my * height),
          opacity : show ? 1 : 0
        }, o.duration || 500, o.easing, onHide);
      }
    }
  };
})(jQuery);
(function($) {
  /**
   * @param {!Object} o
   * @param {!Function} done
   * @return {undefined}
   */
  $.effects.effect.fade = function(o, done) {
    var el = $(this);
    var mode = $.effects.setMode(el, o.mode || "toggle");
    el.animate({
      opacity : mode
    }, {
      queue : false,
      duration : o.duration,
      easing : o.easing,
      complete : done
    });
  };
})(jQuery);
(function($) {
  /**
   * @param {!Object} o
   * @param {?} done
   * @return {undefined}
   */
  $.effects.effect.fold = function(o, done) {
    var wrapper;
    var d;
    var el = $(this);
    /** @type {!Array<string>} */
    var props = "position top bottom left right height width".split(" ");
    wrapper = $.effects.setMode(el, o.mode || "hide");
    /** @type {boolean} */
    var h = "show" === wrapper;
    /** @type {boolean} */
    var condition = "hide" === wrapper;
    var v = o.size || 15;
    /** @type {(Array<string>|null)} */
    var tags = /([0-9]+)%/.exec(v);
    /** @type {boolean} */
    var horizFirst = !!o.horizFirst;
    /** @type {!Array} */
    var names = (d = h !== horizFirst) ? ["width", "height"] : ["height", "width"];
    /** @type {number} */
    var duration = o.duration / 2;
    var value = {};
    var prop = {};
    $.effects.save(el, props);
    el.show();
    wrapper = $.effects.createWrapper(el).css({
      overflow : "hidden"
    });
    /** @type {!Array} */
    d = d ? [wrapper.width(), wrapper.height()] : [wrapper.height(), wrapper.width()];
    if (tags) {
      /** @type {number} */
      v = parseInt(tags[1], 10) / 100 * d[condition ? 0 : 1];
    }
    if (h) {
      wrapper.css(horizFirst ? {
        height : 0,
        width : v
      } : {
        height : v,
        width : 0
      });
    }
    value[names[0]] = h ? d[0] : v;
    prop[names[1]] = h ? d[1] : 0;
    wrapper.animate(value, duration, o.easing).animate(prop, duration, o.easing, function() {
      if (condition) {
        el.hide();
      }
      $.effects.restore(el, props);
      $.effects.removeWrapper(el);
      done();
    });
  };
})(jQuery);
(function($) {
  /**
   * @param {!Object} options
   * @param {?} callback
   * @return {undefined}
   */
  $.effects.effect.highlight = function(options, callback) {
    var el = $(this);
    /** @type {!Array} */
    var props = ["backgroundImage", "backgroundColor", "opacity"];
    var value = $.effects.setMode(el, options.mode || "show");
    var option = {
      backgroundColor : el.css("backgroundColor")
    };
    if ("hide" === value) {
      /** @type {number} */
      option.opacity = 0;
    }
    $.effects.save(el, props);
    el.show().css({
      backgroundImage : "none",
      backgroundColor : options.color || "#ffff99"
    }).animate(option, {
      queue : false,
      duration : options.duration,
      easing : options.easing,
      complete : function() {
        if ("hide" === value) {
          el.hide();
        }
        $.effects.restore(el, props);
        callback();
      }
    });
  };
})(jQuery);
(function($) {
  /**
   * @param {!Object} o
   * @param {?} done
   * @return {undefined}
   */
  $.effects.effect.pulsate = function(o, done) {
    var c;
    var el = $(this);
    var anims = $.effects.setMode(el, o.mode || "show");
    /** @type {boolean} */
    c = "show" === anims;
    /** @type {boolean} */
    var g = "hide" === anims;
    /** @type {number} */
    anims = 2 * (o.times || 5) + (c || "hide" === anims ? 1 : 0);
    /** @type {number} */
    var duration = o.duration / anims;
    /** @type {number} */
    var op = 0;
    var queue = el.queue();
    var i = queue.length;
    if (c || !el.is(":visible")) {
      el.css("opacity", 0).show();
      /** @type {number} */
      op = 1;
    }
    /** @type {number} */
    c = 1;
    for (; anims > c; c++) {
      el.animate({
        opacity : op
      }, duration, o.easing);
      /** @type {number} */
      op = 1 - op;
    }
    el.animate({
      opacity : op
    }, duration, o.easing);
    el.queue(function() {
      if (g) {
        el.hide();
      }
      done();
    });
    if (1 < i) {
      queue.splice.apply(queue, [1, 0].concat(queue.splice(i, anims + 1)));
    }
    el.dequeue();
  };
})(jQuery);
(function($) {
  /**
   * @param {!Object} o
   * @param {!Function} done
   * @return {undefined}
   */
  $.effects.effect.puff = function(o, done) {
    var el = $(this);
    var mode = $.effects.setMode(el, o.mode || "hide");
    /** @type {boolean} */
    var hide = "hide" === mode;
    /** @type {number} */
    var percent = parseInt(o.percent, 10) || 150;
    /** @type {number} */
    var factor = percent / 100;
    var original = {
      height : el.height(),
      width : el.width(),
      outerHeight : el.outerHeight(),
      outerWidth : el.outerWidth()
    };
    $.extend(o, {
      effect : "scale",
      queue : false,
      fade : true,
      mode : mode,
      complete : done,
      percent : hide ? percent : 100,
      from : hide ? original : {
        height : original.height * factor,
        width : original.width * factor,
        outerHeight : original.outerHeight * factor,
        outerWidth : original.outerWidth * factor
      }
    });
    el.effect(o);
  };
  /**
   * @param {!Object} name
   * @param {!Object} value
   * @return {undefined}
   */
  $.effects.effect.scale = function(name, value) {
    var el = $(this);
    var options = $.extend(true, {}, name);
    var undefined = $.effects.setMode(el, name.mode || "effect");
    /** @type {number} */
    var factor = parseInt(name.percent, 10) || (0 === parseInt(name.percent, 10) ? 0 : "hide" === undefined ? 0 : 100);
    var SHIFT = name.direction || "both";
    var origin = name.origin;
    var original = {
      height : el.height(),
      width : el.width(),
      outerHeight : el.outerHeight(),
      outerWidth : el.outerWidth()
    };
    /** @type {number} */
    var y = "horizontal" !== SHIFT ? factor / 100 : 1;
    /** @type {number} */
    factor = "vertical" !== SHIFT ? factor / 100 : 1;
    /** @type {string} */
    options.effect = "size";
    /** @type {boolean} */
    options.queue = false;
    /** @type {!Object} */
    options.complete = value;
    if ("effect" !== undefined) {
      options.origin = origin || ["middle", "center"];
      /** @type {boolean} */
      options.restore = true;
    }
    options.from = name.from || ("show" === undefined ? {
      height : 0,
      width : 0,
      outerHeight : 0,
      outerWidth : 0
    } : original);
    options.to = {
      height : original.height * y,
      width : original.width * factor,
      outerHeight : original.outerHeight * y,
      outerWidth : original.outerWidth * factor
    };
    if (options.fade) {
      if ("show" === undefined) {
        /** @type {number} */
        options.from.opacity = 0;
        /** @type {number} */
        options.to.opacity = 1;
      }
      if ("hide" === undefined) {
        /** @type {number} */
        options.from.opacity = 1;
        /** @type {number} */
        options.to.opacity = 0;
      }
    }
    el.effect(options);
  };
  /**
   * @param {!Object} name
   * @param {string} value
   * @return {undefined}
   */
  $.effects.effect.size = function(name, value) {
    var y;
    var x;
    var value;
    var diff;
    var original;
    var baseline;
    var el = $(this);
    /** @type {!Array<string>} */
    var props0 = "position top bottom left right width height overflow opacity".split(" ");
    /** @type {!Array<string>} */
    original = "position top bottom left right overflow opacity".split(" ");
    /** @type {!Array} */
    var props2 = ["width", "height", "overflow"];
    /** @type {!Array} */
    var cProps = ["fontSize"];
    /** @type {!Array} */
    var vProps = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"];
    /** @type {!Array} */
    var hProps = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"];
    var show = $.effects.setMode(el, name.mode || "effect");
    var restore = name.restore || "effect" !== show;
    var undefined = name.scale || "both";
    var origin = name.origin || ["middle", "center"];
    var affixType = el.css("position");
    /** @type {!Array<string>} */
    var props = restore ? props0 : original;
    var zero = {
      height : 0,
      width : 0,
      outerHeight : 0,
      outerWidth : 0
    };
    if ("show" === show) {
      el.show();
    }
    original = {
      height : el.height(),
      width : el.width(),
      outerHeight : el.outerHeight(),
      outerWidth : el.outerWidth()
    };
    if ("toggle" === name.mode && "show" === show) {
      el.from = name.to || zero;
      el.to = name.from || original;
    } else {
      el.from = name.from || ("show" === show ? zero : original);
      el.to = name.to || ("hide" === show ? zero : original);
    }
    /** @type {number} */
    value = el.from.height / original.height;
    /** @type {number} */
    diff = el.from.width / original.width;
    /** @type {number} */
    y = el.to.height / original.height;
    /** @type {number} */
    x = el.to.width / original.width;
    if ("box" === undefined || "both" === undefined) {
      if (value !== y) {
        /** @type {!Array<?>} */
        props = props.concat(vProps);
        el.from = $.effects.setTransition(el, vProps, value, el.from);
        el.to = $.effects.setTransition(el, vProps, y, el.to);
      }
      if (diff !== x) {
        /** @type {!Array<?>} */
        props = props.concat(hProps);
        el.from = $.effects.setTransition(el, hProps, diff, el.from);
        el.to = $.effects.setTransition(el, hProps, x, el.to);
      }
    }
    if (("content" === undefined || "both" === undefined) && value !== y) {
      /** @type {!Array<?>} */
      props = props.concat(cProps).concat(props2);
      el.from = $.effects.setTransition(el, cProps, value, el.from);
      el.to = $.effects.setTransition(el, cProps, y, el.to);
    }
    $.effects.save(el, props);
    el.show();
    $.effects.createWrapper(el);
    el.css("overflow", "hidden").css(el.from);
    if (origin) {
      baseline = $.effects.getBaseline(origin, original);
      /** @type {number} */
      el.from.top = (original.outerHeight - el.outerHeight()) * baseline.y;
      /** @type {number} */
      el.from.left = (original.outerWidth - el.outerWidth()) * baseline.x;
      /** @type {number} */
      el.to.top = (original.outerHeight - el.to.outerHeight) * baseline.y;
      /** @type {number} */
      el.to.left = (original.outerWidth - el.to.outerWidth) * baseline.x;
    }
    el.css(el.from);
    if (!("content" !== undefined && "both" !== undefined)) {
      /** @type {!Array<?>} */
      vProps = vProps.concat(["marginTop", "marginBottom"]).concat(cProps);
      /** @type {!Array<?>} */
      hProps = hProps.concat(["marginLeft", "marginRight"]);
      /** @type {!Array<?>} */
      props2 = props0.concat(vProps).concat(hProps);
      el.find("*[width]").each(function() {
        var child = $(this);
        var height = child.height();
        var i = child.width();
        var changeHeight = child.outerHeight();
        var perc = child.outerWidth();
        if (restore) {
          $.effects.save(child, props2);
        }
        child.from = {
          height : height * value,
          width : i * diff,
          outerHeight : changeHeight * value,
          outerWidth : perc * diff
        };
        child.to = {
          height : height * y,
          width : i * x,
          outerHeight : height * y,
          outerWidth : i * x
        };
        if (value !== y) {
          child.from = $.effects.setTransition(child, vProps, value, child.from);
          child.to = $.effects.setTransition(child, vProps, y, child.to);
        }
        if (diff !== x) {
          child.from = $.effects.setTransition(child, hProps, diff, child.from);
          child.to = $.effects.setTransition(child, hProps, x, child.to);
        }
        child.css(child.from);
        child.animate(child.to, name.duration, name.easing, function() {
          if (restore) {
            $.effects.restore(child, props2);
          }
        });
      });
    }
    el.animate(el.to, {
      queue : false,
      duration : name.duration,
      easing : name.easing,
      complete : function() {
        if (0 === el.to.opacity) {
          el.css("opacity", el.from.opacity);
        }
        if ("hide" === show) {
          el.hide();
        }
        $.effects.restore(el, props);
        if (!restore) {
          if ("static" === affixType) {
            el.css({
              position : "relative",
              top : el.to.top,
              left : el.to.left
            });
          } else {
            $.each(["top", "left"], function(isX, b) {
              el.css(b, function(margin, right) {
                /** @type {number} */
                margin = parseInt(right, 10);
                var left = isX ? el.to.left : el.to.top;
                return "auto" === right ? left + "px" : margin + left + "px";
              });
            });
          }
        }
        $.effects.removeWrapper(el);
        value();
      }
    });
  };
})(jQuery);
(function($) {
  /**
   * @param {!Object} o
   * @param {?} done
   * @return {undefined}
   */
  $.effects.effect.shake = function(o, done) {
    var length;
    var el = $(this);
    /** @type {!Array<string>} */
    var props = "position top bottom left right height width".split(" ");
    var value = $.effects.setMode(el, o.mode || "effect");
    var dir = o.direction || "left";
    length = o.distance || 20;
    var _i = o.times || 3;
    /** @type {number} */
    var anims = 2 * _i + 1;
    /** @type {number} */
    var duration = Math.round(o.duration / anims);
    /** @type {string} */
    var i = "up" === dir || "down" === dir ? "top" : "left";
    /** @type {boolean} */
    var writeStartMarker = "up" === dir || "left" === dir;
    dir = {};
    var fx = {};
    var endColorCoords = {};
    var queue = el.queue();
    var queuelen = queue.length;
    $.effects.save(el, props);
    el.show();
    $.effects.createWrapper(el);
    /** @type {string} */
    dir[i] = (writeStartMarker ? "-=" : "+=") + length;
    /** @type {string} */
    fx[i] = (writeStartMarker ? "+=" : "-=") + 2 * length;
    /** @type {string} */
    endColorCoords[i] = (writeStartMarker ? "-=" : "+=") + 2 * length;
    el.animate(dir, duration, o.easing);
    /** @type {number} */
    length = 1;
    for (; _i > length; length++) {
      el.animate(fx, duration, o.easing).animate(endColorCoords, duration, o.easing);
    }
    el.animate(fx, duration, o.easing).animate(dir, duration / 2, o.easing).queue(function() {
      if ("hide" === value) {
        el.hide();
      }
      $.effects.restore(el, props);
      $.effects.removeWrapper(el);
      done();
    });
    if (1 < queuelen) {
      queue.splice.apply(queue, [1, 0].concat(queue.splice(queuelen, anims + 1)));
    }
    el.dequeue();
  };
})(jQuery);
(function($) {
  /**
   * @param {!Object} o
   * @param {?} done
   * @return {undefined}
   */
  $.effects.effect.slide = function(o, done) {
    var distance;
    var el = $(this);
    /** @type {!Array<string>} */
    var props = "position top bottom left right width height".split(" ");
    var propertyName = $.effects.setMode(el, o.mode || "show");
    /** @type {boolean} */
    var show = "show" === propertyName;
    distance = o.direction || "left";
    /** @type {string} */
    var ref = "up" === distance || "down" === distance ? "top" : "left";
    /** @type {boolean} */
    var positiveMotion = "up" === distance || "left" === distance;
    var animation = {};
    $.effects.save(el, props);
    el.show();
    distance = o.distance || el["top" === ref ? "outerHeight" : "outerWidth"](true);
    $.effects.createWrapper(el).css({
      overflow : "hidden"
    });
    if (show) {
      el.css(ref, positiveMotion ? isNaN(distance) ? "-" + distance : -distance : distance);
    }
    /** @type {string} */
    animation[ref] = (show ? positiveMotion ? "+=" : "-=" : positiveMotion ? "-=" : "+=") + distance;
    el.animate(animation, {
      queue : false,
      duration : o.duration,
      easing : o.easing,
      complete : function() {
        if ("hide" === propertyName) {
          el.hide();
        }
        $.effects.restore(el, props);
        $.effects.removeWrapper(el);
        done();
      }
    });
  };
})(jQuery);
(function($) {
  /**
   * @param {!Object} o
   * @param {?} done
   * @return {undefined}
   */
  $.effects.effect.transfer = function(o, done) {
    var $area = $(this);
    var style = $(o.to);
    /** @type {boolean} */
    var targetFixed = "fixed" === style.css("position");
    var b = $("body");
    var fixTop = targetFixed ? b.scrollTop() : 0;
    b = targetFixed ? b.scrollLeft() : 0;
    var startPosition = style.offset();
    style = {
      top : startPosition.top - fixTop,
      left : startPosition.left - b,
      height : style.innerHeight(),
      width : style.innerWidth()
    };
    startPosition = $area.offset();
    var $sections = $("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(o.className).css({
      top : startPosition.top - fixTop,
      left : startPosition.left - b,
      height : $area.innerHeight(),
      width : $area.innerWidth(),
      position : targetFixed ? "fixed" : "absolute"
    }).animate(style, o.duration, o.easing, function() {
      $sections.remove();
      done();
    });
  };
})(jQuery);
(function($) {
  $.widget("ui.menu", {
    version : "1.10.3",
    defaultElement : "<ul>",
    delay : 300,
    options : {
      icons : {
        submenu : "ui-icon-carat-1-e"
      },
      menus : "ul",
      position : {
        my : "left top",
        at : "right top"
      },
      role : "menu",
      blur : null,
      focus : null,
      select : null
    },
    _create : function() {
      this.activeMenu = this.element;
      /** @type {boolean} */
      this.mouseHandled = false;
      this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({
        role : this.options.role,
        tabIndex : 0
      }).bind("click" + this.eventNamespace, $.proxy(function(event) {
        if (this.options.disabled) {
          event.preventDefault();
        }
      }, this));
      if (this.options.disabled) {
        this.element.addClass("ui-state-disabled").attr("aria-disabled", "true");
      }
      this._on({
        "mousedown .ui-menu-item > a" : function(event) {
          event.preventDefault();
        },
        "click .ui-state-disabled > a" : function(event) {
          event.preventDefault();
        },
        "click .ui-menu-item:has(a)" : function(event) {
          var $example = $(event.target).closest(".ui-menu-item");
          if (!this.mouseHandled && $example.not(".ui-state-disabled").length) {
            /** @type {boolean} */
            this.mouseHandled = true;
            this.select(event);
            if ($example.has(".ui-menu").length) {
              this.expand(event);
            } else {
              if (!this.element.is(":focus")) {
                this.element.trigger("focus", [true]);
                if (this.active && 1 === this.active.parents(".ui-menu").length) {
                  clearTimeout(this.timer);
                }
              }
            }
          }
        },
        "mouseenter .ui-menu-item" : function(event) {
          var item = $(event.currentTarget);
          item.siblings().children(".ui-state-active").removeClass("ui-state-active");
          this.focus(event, item);
        },
        mouseleave : "collapseAll",
        "mouseleave .ui-menu" : "collapseAll",
        focus : function(value, item) {
          var newItem = this.active || this.element.children(".ui-menu-item").eq(0);
          if (!item) {
            this.focus(value, newItem);
          }
        },
        blur : function(event) {
          this._delay(function() {
            if (!$.contains(this.element[0], this.document[0].activeElement)) {
              this.collapseAll(event);
            }
          });
        },
        keydown : "_keydown"
      });
      this.refresh();
      this._on(this.document, {
        click : function(event) {
          if (!$(event.target).closest(".ui-menu").length) {
            this.collapseAll(event);
          }
          /** @type {boolean} */
          this.mouseHandled = false;
        }
      });
    },
    _destroy : function() {
      this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show();
      this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function() {
        var elem = $(this);
        if (elem.data("ui-menu-submenu-carat")) {
          elem.remove();
        }
      });
      this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content");
    },
    _keydown : function(event) {
      /**
       * @param {string} string
       * @return {?}
       */
      function escape(string) {
        return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
      }
      var prev;
      var character;
      var curr;
      var rex;
      /** @type {boolean} */
      var h = true;
      switch(event.keyCode) {
        case $.ui.keyCode.PAGE_UP:
          this.previousPage(event);
          break;
        case $.ui.keyCode.PAGE_DOWN:
          this.nextPage(event);
          break;
        case $.ui.keyCode.HOME:
          this._move("first", "first", event);
          break;
        case $.ui.keyCode.END:
          this._move("last", "last", event);
          break;
        case $.ui.keyCode.UP:
          this.previous(event);
          break;
        case $.ui.keyCode.DOWN:
          this.next(event);
          break;
        case $.ui.keyCode.LEFT:
          this.collapse(event);
          break;
        case $.ui.keyCode.RIGHT:
          if (this.active && !this.active.is(".ui-state-disabled")) {
            this.expand(event);
          }
          break;
        case $.ui.keyCode.ENTER:
        case $.ui.keyCode.SPACE:
          this._activate(event);
          break;
        case $.ui.keyCode.ESCAPE:
          this.collapse(event);
          break;
        default:
          /** @type {boolean} */
          h = false;
          prev = this.previousFilter || "";
          /** @type {string} */
          character = String.fromCharCode(event.keyCode);
          /** @type {boolean} */
          curr = false;
          clearTimeout(this.filterTimer);
          if (character === prev) {
            /** @type {boolean} */
            curr = true;
          } else {
            /** @type {string} */
            character = prev + character;
          }
          /** @type {!RegExp} */
          rex = RegExp("^" + escape(character), "i");
          prev = this.activeMenu.children(".ui-menu-item").filter(function() {
            return rex.test($(this).children("a").text());
          });
          prev = curr && -1 !== prev.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : prev;
          if (!prev.length) {
            /** @type {string} */
            character = String.fromCharCode(event.keyCode);
            /** @type {!RegExp} */
            rex = RegExp("^" + escape(character), "i");
            prev = this.activeMenu.children(".ui-menu-item").filter(function() {
              return rex.test($(this).children("a").text());
            });
          }
          if (prev.length) {
            this.focus(event, prev);
            if (1 < prev.length) {
              /** @type {string} */
              this.previousFilter = character;
              this.filterTimer = this._delay(function() {
                delete this.previousFilter;
              }, 1E3);
            } else {
              delete this.previousFilter;
            }
          } else {
            delete this.previousFilter;
          }
      }
      if (h) {
        event.preventDefault();
      }
    },
    _activate : function(event) {
      if (!this.active.is(".ui-state-disabled")) {
        if (this.active.children("a[aria-haspopup='true']").length) {
          this.expand(event);
        } else {
          this.select(event);
        }
      }
    },
    refresh : function() {
      var data;
      var icon = this.options.icons.submenu;
      data = this.element.find(this.options.menus);
      data.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({
        role : this.options.role,
        "aria-hidden" : "true",
        "aria-expanded" : "false"
      }).each(function() {
        var $input = $(this);
        var link = $input.prev("a");
        var submenuCarat = $("<span>").addClass("ui-menu-icon ui-icon " + icon).data("ui-menu-submenu-carat", true);
        link.attr("aria-haspopup", "true").prepend(submenuCarat);
        $input.attr("aria-labelledby", link.attr("id"));
      });
      data = data.add(this.element);
      data.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "presentation").children("a").uniqueId().addClass("ui-corner-all").attr({
        tabIndex : -1,
        role : this._itemRole()
      });
      data.children(":not(.ui-menu-item)").each(function() {
        var a = $(this);
        if (!/[^\-\u2014\u2013\s]/.test(a.text())) {
          a.addClass("ui-widget-content ui-menu-divider");
        }
      });
      data.children(".ui-state-disabled").attr("aria-disabled", "true");
      if (this.active && !$.contains(this.element[0], this.active[0])) {
        this.blur();
      }
    },
    _itemRole : function() {
      return {
        menu : "menuitem",
        listbox : "option"
      }[this.options.role];
    },
    _setOption : function(key, value) {
      if ("icons" === key) {
        this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(value.submenu);
      }
      this._super(key, value);
    },
    focus : function(event, item) {
      var focused;
      this.blur(event, event && "focus" === event.type);
      this._scrollIntoView(item);
      this.active = item.first();
      focused = this.active.children("a").addClass("ui-state-focus");
      if (this.options.role) {
        this.element.attr("aria-activedescendant", focused.attr("id"));
      }
      this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active");
      if (event && "keydown" === event.type) {
        this._close();
      } else {
        this.timer = this._delay(function() {
          this._close();
        }, this.delay);
      }
      focused = item.children(".ui-menu");
      if (focused.length && /^mouse/.test(event.type)) {
        this._startOpening(focused);
      }
      this.activeMenu = item.parent();
      this._trigger("focus", event, {
        item : item
      });
    },
    _scrollIntoView : function(item) {
      var RectBegin;
      var RectEnd;
      var offset;
      var scroll;
      var elementHeight;
      var itemHeight;
      if (this._hasScroll()) {
        /** @type {number} */
        RectBegin = parseFloat($.css(this.activeMenu[0], "borderTopWidth")) || 0;
        /** @type {number} */
        RectEnd = parseFloat($.css(this.activeMenu[0], "paddingTop")) || 0;
        /** @type {number} */
        offset = item.offset().top - this.activeMenu.offset().top - RectBegin - RectEnd;
        scroll = this.activeMenu.scrollTop();
        elementHeight = this.activeMenu.height();
        itemHeight = item.height();
        if (0 > offset) {
          this.activeMenu.scrollTop(scroll + offset);
        } else {
          if (offset + itemHeight > elementHeight) {
            this.activeMenu.scrollTop(scroll + offset - elementHeight + itemHeight);
          }
        }
      }
    },
    blur : function(e, size) {
      if (!size) {
        clearTimeout(this.timer);
      }
      if (this.active) {
        this.active.children("a").removeClass("ui-state-focus");
        /** @type {null} */
        this.active = null;
        this._trigger("blur", e, {
          item : this.active
        });
      }
    },
    _startOpening : function(submenu) {
      clearTimeout(this.timer);
      if ("true" === submenu.attr("aria-hidden")) {
        this.timer = this._delay(function() {
          this._close();
          this._open(submenu);
        }, this.delay);
      }
    },
    _open : function(submenu) {
      var cols = $.extend({
        of : this.active
      }, this.options.position);
      clearTimeout(this.timer);
      this.element.find(".ui-menu").not(submenu.parents(".ui-menu")).hide().attr("aria-hidden", "true");
      submenu.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(cols);
    },
    collapseAll : function(event, all) {
      clearTimeout(this.timer);
      this.timer = this._delay(function() {
        var currentMenu = all ? this.element : $(event && event.target).closest(this.element.find(".ui-menu"));
        if (!currentMenu.length) {
          currentMenu = this.element;
        }
        this._close(currentMenu);
        this.blur(event);
        this.activeMenu = currentMenu;
      }, this.delay);
    },
    _close : function(startMenu) {
      if (!startMenu) {
        startMenu = this.active ? this.active.parent() : this.element;
      }
      startMenu.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find("a.ui-state-active").removeClass("ui-state-active");
    },
    collapse : function(event) {
      var newItem = this.active && this.active.parent().closest(".ui-menu-item", this.element);
      if (newItem && newItem.length) {
        this._close();
        this.focus(event, newItem);
      }
    },
    expand : function(event) {
      var newItem = this.active && this.active.children(".ui-menu ").children(".ui-menu-item").first();
      if (newItem && newItem.length) {
        this._open(newItem.parent());
        this._delay(function() {
          this.focus(event, newItem);
        });
      }
    },
    next : function(name) {
      this._move("next", "first", name);
    },
    previous : function(name) {
      this._move("prev", "last", name);
    },
    isFirstItem : function() {
      return this.active && !this.active.prevAll(".ui-menu-item").length;
    },
    isLastItem : function() {
      return this.active && !this.active.nextAll(".ui-menu-item").length;
    },
    _move : function(direction, position, event) {
      var next;
      if (this.active) {
        next = "first" === direction || "last" === direction ? this.active["first" === direction ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[direction + "All"](".ui-menu-item").eq(0);
      }
      if (!(next && next.length && this.active)) {
        next = this.activeMenu.children(".ui-menu-item")[position]();
      }
      this.focus(event, next);
    },
    nextPage : function(event) {
      var item;
      var s;
      var d;
      return this.active ? (this.isLastItem() || (this._hasScroll() ? (s = this.active.offset().top, d = this.element.height(), this.active.nextAll(".ui-menu-item").each(function() {
        return item = $(this), 0 > item.offset().top - s - d;
      }), this.focus(event, item)) : this.focus(event, this.activeMenu.children(".ui-menu-item")[this.active ? "last" : "first"]())), void 0) : (this.next(event), void 0);
    },
    previousPage : function(event) {
      var item;
      var positionTop;
      var d;
      return this.active ? (this.isFirstItem() || (this._hasScroll() ? (positionTop = this.active.offset().top, d = this.element.height(), this.active.prevAll(".ui-menu-item").each(function() {
        return item = $(this), 0 < item.offset().top - positionTop + d;
      }), this.focus(event, item)) : this.focus(event, this.activeMenu.children(".ui-menu-item").first())), void 0) : (this.next(event), void 0);
    },
    _hasScroll : function() {
      return this.element.outerHeight() < this.element.prop("scrollHeight");
    },
    select : function(event) {
      this.active = this.active || $(event.target).closest(".ui-menu-item");
      var data = {
        item : this.active
      };
      if (!this.active.has(".ui-menu").length) {
        this.collapseAll(event, true);
      }
      this._trigger("select", event, data);
    }
  });
})(jQuery);
(function($, value) {
  /**
   * @param {!Object} offsets
   * @param {number} width
   * @param {number} height
   * @return {?}
   */
  function getOffsets(offsets, width, height) {
    return [parseFloat(offsets[0]) * (rpercent.test(offsets[0]) ? width / 100 : 1), parseFloat(offsets[1]) * (rpercent.test(offsets[1]) ? height / 100 : 1)];
  }
  /**
   * @param {!Object} n
   * @return {?}
   */
  function getDimensions(n) {
    var item = n[0];
    return 9 === item.nodeType ? {
      width : n.width(),
      height : n.height(),
      offset : {
        top : 0,
        left : 0
      }
    } : $.isWindow(item) ? {
      width : n.width(),
      height : n.height(),
      offset : {
        top : n.scrollTop(),
        left : n.scrollLeft()
      }
    } : item.preventDefault ? {
      width : 0,
      height : 0,
      offset : {
        top : item.pageY,
        left : item.pageX
      }
    } : {
      width : n.outerWidth(),
      height : n.outerHeight(),
      offset : n.offset()
    };
  }
  $.ui = $.ui || {};
  var result;
  /** @type {function(...?): number} */
  var max = Math.max;
  /** @type {function(?): number} */
  var abs = Math.abs;
  /** @type {function(?): number} */
  var round = Math.round;
  /** @type {!RegExp} */
  var rhorizontal = /left|center|right/;
  /** @type {!RegExp} */
  var rvertical = /top|center|bottom/;
  /** @type {!RegExp} */
  var roffset = /[\+\-]\d+(\.[\d]+)?%?/;
  /** @type {!RegExp} */
  var rposition = /^\w+/;
  /** @type {!RegExp} */
  var rpercent = /%$/;
  /** @type {function(!Object): ?} */
  var oldSetupComputes = $.fn.position;
  $.position = {
    scrollbarWidth : function() {
      if (result !== value) {
        return result;
      }
      var width;
      var x;
      var div = $("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>");
      var target = div.children()[0];
      return $("body").append(div), width = target.offsetWidth, div.css("overflow", "scroll"), x = target.offsetWidth, width === x && (x = div[0].clientWidth), div.remove(), result = width - x;
    },
    getScrollInfo : function(within) {
      var overflowY = within.isWindow ? "" : within.element.css("overflow-x");
      var undefined = within.isWindow ? "" : within.element.css("overflow-y");
      /** @type {boolean} */
      overflowY = "scroll" === overflowY || "auto" === overflowY && within.width < within.element[0].scrollWidth;
      return {
        width : "scroll" === undefined || "auto" === undefined && within.height < within.element[0].scrollHeight ? $.position.scrollbarWidth() : 0,
        height : overflowY ? $.position.scrollbarWidth() : 0
      };
    },
    getWithinInfo : function(element) {
      element = $(element || window);
      var isWindow = $.isWindow(element[0]);
      return {
        element : element,
        isWindow : isWindow,
        offset : element.offset() || {
          left : 0,
          top : 0
        },
        scrollLeft : element.scrollLeft(),
        scrollTop : element.scrollTop(),
        width : isWindow ? element.width() : element.outerWidth(),
        height : isWindow ? element.height() : element.outerHeight()
      };
    }
  };
  /**
   * @param {!Object} name
   * @return {?}
   */
  $.fn.position = function(name) {
    if (!name || !name.of) {
      return oldSetupComputes.apply(this, arguments);
    }
    name = $.extend({}, name);
    var atOffset;
    var targetWidth;
    var targetHeight;
    var targetOffset;
    var basePosition;
    var dimensions;
    var target = $(name.of);
    var within = $.position.getWithinInfo(name.within);
    var scrollInfo = $.position.getScrollInfo(within);
    var collision = (name.collision || "flip").split(" ");
    var offsets = {};
    return dimensions = getDimensions(target), target[0].preventDefault && (name.at = "left top"), targetWidth = dimensions.width, targetHeight = dimensions.height, targetOffset = dimensions.offset, basePosition = $.extend({}, targetOffset), $.each(["my", "at"], function() {
      var b;
      var c;
      var pos = (name[this] || "").split(" ");
      if (1 === pos.length) {
        pos = rhorizontal.test(pos[0]) ? pos.concat(["center"]) : rvertical.test(pos[0]) ? ["center"].concat(pos) : ["center", "center"];
      }
      pos[0] = rhorizontal.test(pos[0]) ? pos[0] : "center";
      pos[1] = rvertical.test(pos[1]) ? pos[1] : "center";
      /** @type {(Array<string>|null)} */
      b = roffset.exec(pos[0]);
      /** @type {(Array<string>|null)} */
      c = roffset.exec(pos[1]);
      /** @type {!Array} */
      offsets[this] = [b ? b[0] : 0, c ? c[0] : 0];
      /** @type {!Array} */
      name[this] = [rposition.exec(pos[0])[0], rposition.exec(pos[1])[0]];
    }), 1 === collision.length && (collision[1] = collision[0]), "right" === name.at[0] ? basePosition.left += targetWidth : "center" === name.at[0] && (basePosition.left += targetWidth / 2), "bottom" === name.at[1] ? basePosition.top += targetHeight : "center" === name.at[1] && (basePosition.top += targetHeight / 2), atOffset = getOffsets(offsets.at, targetWidth, targetHeight), basePosition.left += atOffset[0], basePosition.top += atOffset[1], this.each(function() {
      var collisionPosition;
      var using;
      var self = $(this);
      var elemWidth = self.outerWidth();
      var elemHeight = self.outerHeight();
      /** @type {number} */
      var marginLeft = parseInt($.css(this, "marginLeft"), 10) || 0;
      /** @type {number} */
      var marginTop = parseInt($.css(this, "marginTop"), 10) || 0;
      var collisionWidth = elemWidth + marginLeft + (parseInt($.css(this, "marginRight"), 10) || 0) + scrollInfo.width;
      var collisionHeight = elemHeight + marginTop + (parseInt($.css(this, "marginBottom"), 10) || 0) + scrollInfo.height;
      var position = $.extend({}, basePosition);
      var myOffset = getOffsets(offsets.my, self.outerWidth(), self.outerHeight());
      if ("right" === name.my[0]) {
        position.left -= elemWidth;
      } else {
        if ("center" === name.my[0]) {
          position.left -= elemWidth / 2;
        }
      }
      if ("bottom" === name.my[1]) {
        position.top -= elemHeight;
      } else {
        if ("center" === name.my[1]) {
          position.top -= elemHeight / 2;
        }
      }
      position.left += myOffset[0];
      position.top += myOffset[1];
      if (!$.support.offsetFractions) {
        /** @type {number} */
        position.left = round(position.left);
        /** @type {number} */
        position.top = round(position.top);
      }
      collisionPosition = {
        marginLeft : marginLeft,
        marginTop : marginTop
      };
      $.each(["left", "top"], function(i, dir) {
        if ($.ui.position[collision[i]]) {
          $.ui.position[collision[i]][dir](position, {
            targetWidth : targetWidth,
            targetHeight : targetHeight,
            elemWidth : elemWidth,
            elemHeight : elemHeight,
            collisionPosition : collisionPosition,
            collisionWidth : collisionWidth,
            collisionHeight : collisionHeight,
            offset : [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
            my : name.my,
            at : name.at,
            within : within,
            elem : self
          });
        }
      });
      if (name.using) {
        /**
         * @param {?} ui
         * @return {undefined}
         */
        using = function(ui) {
          /** @type {number} */
          var left = targetOffset.left - position.left;
          /** @type {number} */
          var right = left + targetWidth - elemWidth;
          /** @type {number} */
          var top = targetOffset.top - position.top;
          /** @type {number} */
          var bottom = top + targetHeight - elemHeight;
          var feedback = {
            target : {
              element : target,
              left : targetOffset.left,
              top : targetOffset.top,
              width : targetWidth,
              height : targetHeight
            },
            element : {
              element : self,
              left : position.left,
              top : position.top,
              width : elemWidth,
              height : elemHeight
            },
            horizontal : 0 > right ? "left" : 0 < left ? "right" : "center",
            vertical : 0 > bottom ? "top" : 0 < top ? "bottom" : "middle"
          };
          if (elemWidth > targetWidth && targetWidth > abs(left + right)) {
            /** @type {string} */
            feedback.horizontal = "center";
          }
          if (elemHeight > targetHeight && targetHeight > abs(top + bottom)) {
            /** @type {string} */
            feedback.vertical = "middle";
          }
          /** @type {string} */
          feedback.important = max(abs(left), abs(right)) > max(abs(top), abs(bottom)) ? "horizontal" : "vertical";
          name.using.call(this, ui, feedback);
        };
      }
      self.offset($.extend(position, {
        using : using
      }));
    });
  };
  $.ui.position = {
    fit : {
      left : function(name, value) {
        var newOverRight;
        var within = value.within;
        var withinOffset = within.isWindow ? within.scrollLeft : within.offset.left;
        within = within.width;
        /** @type {number} */
        var collisionPosLeft = name.left - value.collisionPosition.marginLeft;
        /** @type {number} */
        var overLeft = withinOffset - collisionPosLeft;
        /** @type {number} */
        var overRight = collisionPosLeft + value.collisionWidth - within - withinOffset;
        if (value.collisionWidth > within) {
          if (0 < overLeft && 0 >= overRight) {
            /** @type {number} */
            newOverRight = name.left + overLeft + value.collisionWidth - within - withinOffset;
            name.left += overLeft - newOverRight;
          } else {
            name.left = 0 < overRight && 0 >= overLeft ? withinOffset : overLeft > overRight ? withinOffset + within - value.collisionWidth : withinOffset;
          }
        } else {
          if (0 < overLeft) {
            name.left += overLeft;
          } else {
            if (0 < overRight) {
              name.left -= overRight;
            } else {
              /** @type {number} */
              name.left = max(name.left - collisionPosLeft, name.left);
            }
          }
        }
      },
      top : function(name, value) {
        var newOverBottom;
        var within = value.within;
        within = within.isWindow ? within.scrollTop : within.offset.top;
        var outerHeight = value.within.height;
        /** @type {number} */
        var collisionPosTop = name.top - value.collisionPosition.marginTop;
        /** @type {number} */
        var overTop = within - collisionPosTop;
        /** @type {number} */
        var overBottom = collisionPosTop + value.collisionHeight - outerHeight - within;
        if (value.collisionHeight > outerHeight) {
          if (0 < overTop && 0 >= overBottom) {
            /** @type {number} */
            newOverBottom = name.top + overTop + value.collisionHeight - outerHeight - within;
            name.top += overTop - newOverBottom;
          } else {
            name.top = 0 < overBottom && 0 >= overTop ? within : overTop > overBottom ? within + outerHeight - value.collisionHeight : within;
          }
        } else {
          if (0 < overTop) {
            name.top += overTop;
          } else {
            if (0 < overBottom) {
              name.top -= overBottom;
            } else {
              /** @type {number} */
              name.top = max(name.top - collisionPosTop, name.top);
            }
          }
        }
      }
    },
    flip : {
      left : function(name, value) {
        var threshold;
        var phaser_offset;
        var within = value.within;
        var offsetLeft = within.offset.left + within.scrollLeft;
        var outerWidth = within.width;
        within = within.isWindow ? within.scrollLeft : within.offset.left;
        /** @type {number} */
        var collisionPosLeft = name.left - value.collisionPosition.marginLeft;
        /** @type {number} */
        var overLeft = collisionPosLeft - within;
        /** @type {number} */
        collisionPosLeft = collisionPosLeft + value.collisionWidth - outerWidth - within;
        var nbytes = "left" === value.my[0] ? -value.elemWidth : "right" === value.my[0] ? value.elemWidth : 0;
        var ibytes = "left" === value.at[0] ? value.targetWidth : "right" === value.at[0] ? -value.targetWidth : 0;
        /** @type {number} */
        var offset = -2 * value.offset[0];
        if (0 > overLeft) {
          /** @type {number} */
          threshold = name.left + nbytes + ibytes + offset + value.collisionWidth - outerWidth - offsetLeft;
          if (0 > threshold || abs(overLeft) > threshold) {
            name.left += nbytes + ibytes + offset;
          }
        } else {
          if (0 < collisionPosLeft) {
            /** @type {number} */
            phaser_offset = name.left - value.collisionPosition.marginLeft + nbytes + ibytes + offset - within;
            if (0 < phaser_offset || collisionPosLeft > abs(phaser_offset)) {
              name.left += nbytes + ibytes + offset;
            }
          }
        }
      },
      top : function(name, value) {
        var phaser_offset;
        var threshold;
        var within = value.within;
        var offsetTop = within.offset.top + within.scrollTop;
        var outerHeight = within.height;
        within = within.isWindow ? within.scrollTop : within.offset.top;
        /** @type {number} */
        var collisionPosTop = name.top - value.collisionPosition.marginTop;
        /** @type {number} */
        var overTop = collisionPosTop - within;
        /** @type {number} */
        collisionPosTop = collisionPosTop + value.collisionHeight - outerHeight - within;
        var nbytes = "top" === value.my[1] ? -value.elemHeight : "bottom" === value.my[1] ? value.elemHeight : 0;
        var ibytes = "top" === value.at[1] ? value.targetHeight : "bottom" === value.at[1] ? -value.targetHeight : 0;
        /** @type {number} */
        var offset = -2 * value.offset[1];
        if (0 > overTop) {
          /** @type {number} */
          threshold = name.top + nbytes + ibytes + offset + value.collisionHeight - outerHeight - offsetTop;
          if (name.top + nbytes + ibytes + offset > overTop && (0 > threshold || abs(overTop) > threshold)) {
            name.top += nbytes + ibytes + offset;
          }
        } else {
          if (0 < collisionPosTop) {
            /** @type {number} */
            phaser_offset = name.top - value.collisionPosition.marginTop + nbytes + ibytes + offset - within;
            if (name.top + nbytes + ibytes + offset > collisionPosTop && (0 < phaser_offset || collisionPosTop > abs(phaser_offset))) {
              name.top += nbytes + ibytes + offset;
            }
          }
        }
      }
    },
    flipfit : {
      left : function() {
        $.ui.position.flip.left.apply(this, arguments);
        $.ui.position.fit.left.apply(this, arguments);
      },
      top : function() {
        $.ui.position.flip.top.apply(this, arguments);
        $.ui.position.fit.top.apply(this, arguments);
      }
    }
  };
  (function() {
    var a;
    var c;
    var e;
    var n;
    /** @type {!Element} */
    var body = document.getElementsByTagName("body")[0];
    /** @type {!Element} */
    e = document.createElement("div");
    /** @type {!Element} */
    a = document.createElement(body ? "div" : "body");
    c = {
      visibility : "hidden",
      width : 0,
      height : 0,
      border : 0,
      margin : 0,
      background : "none"
    };
    if (body) {
      $.extend(c, {
        position : "absolute",
        left : "-1000px",
        top : "-1000px"
      });
    }
    for (n in c) {
      a.style[n] = c[n];
    }
    a.appendChild(e);
    /** @type {!Element} */
    c = body || document.documentElement;
    c.insertBefore(a, c.firstChild);
    /** @type {string} */
    e.style.cssText = "position: absolute; left: 10.7432222px;";
    e = $(e).offset().left;
    /** @type {boolean} */
    $.support.offsetFractions = 10 < e && 11 > e;
    /** @type {string} */
    a.innerHTML = "";
    c.removeChild(a);
  })();
})(jQuery);
(function($, undefined) {
  $.widget("ui.progressbar", {
    version : "1.10.3",
    options : {
      max : 100,
      value : 0,
      change : null,
      complete : null
    },
    min : 0,
    _create : function() {
      this.oldValue = this.options.value = this._constrainedValue();
      this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({
        role : "progressbar",
        "aria-valuemin" : this.min
      });
      this.valueDiv = $("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element);
      this._refreshValue();
    },
    _destroy : function() {
      this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
      this.valueDiv.remove();
    },
    value : function(name) {
      return name === undefined ? this.options.value : (this.options.value = this._constrainedValue(name), this._refreshValue(), undefined);
    },
    _constrainedValue : function(id) {
      return id === undefined && (id = this.options.value), this.indeterminate = false === id, "number" != typeof id && (id = 0), this.indeterminate ? false : Math.min(this.options.max, Math.max(this.min, id));
    },
    _setOptions : function(options) {
      var value = options.value;
      delete options.value;
      this._super(options);
      this.options.value = this._constrainedValue(value);
      this._refreshValue();
    },
    _setOption : function(key, value) {
      if ("max" === key) {
        /** @type {number} */
        value = Math.max(this.min, value);
      }
      this._super(key, value);
    },
    _percentage : function() {
      return this.indeterminate ? 100 : 100 * (this.options.value - this.min) / (this.options.max - this.min);
    },
    _refreshValue : function() {
      var value = this.options.value;
      var percentage = this._percentage();
      this.valueDiv.toggle(this.indeterminate || value > this.min).toggleClass("ui-corner-right", value === this.options.max).width(percentage.toFixed(0) + "%");
      this.element.toggleClass("ui-progressbar-indeterminate", this.indeterminate);
      if (this.indeterminate) {
        this.element.removeAttr("aria-valuenow");
        if (!this.overlayDiv) {
          this.overlayDiv = $("<div class='ui-progressbar-overlay'></div>").appendTo(this.valueDiv);
        }
      } else {
        this.element.attr({
          "aria-valuemax" : this.options.max,
          "aria-valuenow" : value
        });
        if (this.overlayDiv) {
          this.overlayDiv.remove();
          /** @type {null} */
          this.overlayDiv = null;
        }
      }
      if (this.oldValue !== value) {
        this.oldValue = value;
        this._trigger("change");
      }
      if (value === this.options.max) {
        this._trigger("complete");
      }
    }
  });
})(jQuery);
(function($) {
  $.widget("ui.slider", $.ui.mouse, {
    version : "1.10.3",
    widgetEventPrefix : "slide",
    options : {
      animate : false,
      distance : 0,
      max : 100,
      min : 0,
      orientation : "horizontal",
      range : false,
      step : 1,
      value : 0,
      values : null,
      change : null,
      slide : null,
      start : null,
      stop : null
    },
    _create : function() {
      /** @type {boolean} */
      this._mouseSliding = this._keySliding = false;
      /** @type {boolean} */
      this._animateOff = true;
      /** @type {null} */
      this._handleIndex = null;
      this._detectOrientation();
      this._mouseInit();
      this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all");
      this._refresh();
      this._setOption("disabled", this.options.disabled);
      /** @type {boolean} */
      this._animateOff = false;
    },
    _refresh : function() {
      this._createRange();
      this._createHandles();
      this._setupEvents();
      this._refreshValue();
    },
    _createHandles : function() {
      var m;
      var n;
      m = this.options;
      var a = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all");
      /** @type {!Array} */
      var outChance = [];
      n = m.values && m.values.length || 1;
      if (a.length > n) {
        a.slice(n).remove();
        a = a.slice(0, n);
      }
      m = a.length;
      for (; n > m; m++) {
        outChance.push("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>");
      }
      this.handles = a.add($(outChance.join("")).appendTo(this.element));
      this.handle = this.handles.eq(0);
      this.handles.each(function(a) {
        $(this).data("ui-slider-handle-index", a);
      });
    },
    _createRange : function() {
      var value = this.options;
      /** @type {string} */
      var classes = "";
      if (value.range) {
        if (true === value.range) {
          if (value.values) {
            if (value.values.length && 2 !== value.values.length) {
              /** @type {!Array} */
              value.values = [value.values[0], value.values[0]];
            } else {
              if ($.isArray(value.values)) {
                value.values = value.values.slice(0);
              }
            }
          } else {
            /** @type {!Array} */
            value.values = [this._valueMin(), this._valueMin()];
          }
        }
        if (this.range && this.range.length) {
          this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({
            left : "",
            bottom : ""
          });
        } else {
          this.range = $("<div></div>").appendTo(this.element);
          /** @type {string} */
          classes = "ui-slider-range ui-widget-header ui-corner-all";
        }
        this.range.addClass(classes + ("min" === value.range || "max" === value.range ? " ui-slider-range-" + value.range : ""));
      } else {
        this.range = $([]);
      }
    },
    _setupEvents : function() {
      var elements = this.handles.add(this.range).filter("a");
      this._off(elements);
      this._on(elements, this._handleEvents);
      this._hoverable(elements);
      this._focusable(elements);
    },
    _destroy : function() {
      this.handles.remove();
      this.range.remove();
      this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all");
      this._mouseDestroy();
    },
    _mouseCapture : function(event) {
      var position;
      var normValue;
      var d;
      var closestHandle;
      var index;
      var allowed;
      var gamePos;
      var mouseOverHandle;
      var that = this;
      var o = this.options;
      return o.disabled ? false : (this.elementSize = {
        width : this.element.outerWidth(),
        height : this.element.outerHeight()
      }, this.elementOffset = this.element.offset(), position = {
        x : event.pageX,
        y : event.pageY
      }, normValue = this._normValueFromMouse(position), d = this._valueMax() - this._valueMin() + 1, this.handles.each(function(i) {
        /** @type {number} */
        var c = Math.abs(normValue - that.values(i));
        if (d > c || d === c && (i === that._lastChangedValue || that.values(i) === o.min)) {
          /** @type {number} */
          d = c;
          closestHandle = $(this);
          /** @type {!Object} */
          index = i;
        }
      }), allowed = this._start(event, index), false === allowed ? false : (this._mouseSliding = true, this._handleIndex = index, closestHandle.addClass("ui-state-active").focus(), gamePos = closestHandle.offset(), mouseOverHandle = !$(event.target).parents().addBack().is(".ui-slider-handle"), this._clickOffset = mouseOverHandle ? {
        left : 0,
        top : 0
      } : {
        left : event.pageX - gamePos.left - closestHandle.width() / 2,
        top : event.pageY - gamePos.top - closestHandle.height() / 2 - (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) - (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) + (parseInt(closestHandle.css("marginTop"), 10) || 0)
      }, this.handles.hasClass("ui-state-hover") || this._slide(event, index, normValue), this._animateOff = true, true));
    },
    _mouseStart : function() {
      return true;
    },
    _mouseDrag : function(event) {
      var normValue = this._normValueFromMouse({
        x : event.pageX,
        y : event.pageY
      });
      return this._slide(event, this._handleIndex, normValue), false;
    },
    _mouseStop : function(event) {
      return this.handles.removeClass("ui-state-active"), this._mouseSliding = false, this._stop(event, this._handleIndex), this._change(event, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = false, false;
    },
    _detectOrientation : function() {
      /** @type {string} */
      this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal";
    },
    _normValueFromMouse : function(position) {
      var pixelTotal;
      var pixelMouse;
      var percentMouse;
      var valueTotal;
      var valueMouse;
      return "horizontal" === this.orientation ? (pixelTotal = this.elementSize.width, pixelMouse = position.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (pixelTotal = this.elementSize.height, pixelMouse = position.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), percentMouse = pixelMouse / pixelTotal, 1 < percentMouse && (percentMouse = 1), 0 > percentMouse && (percentMouse = 0), "vertical" === this.orientation && (percentMouse = 
      1 - percentMouse), valueTotal = this._valueMax() - this._valueMin(), valueMouse = this._valueMin() + percentMouse * valueTotal, this._trimAlignValue(valueMouse);
    },
    _start : function(event, index) {
      var uiHash = {
        handle : this.handles[index],
        value : this.value()
      };
      return this.options.values && this.options.values.length && (uiHash.value = this.values(index), uiHash.values = this.values()), this._trigger("start", event, uiHash);
    },
    _slide : function(event, index, val) {
      var result;
      var newVal;
      var allowed;
      if (this.options.values && this.options.values.length) {
        result = this.values(index ? 0 : 1);
        if (2 === this.options.values.length && true === this.options.range && (0 === index && val > result || 1 === index && result > val)) {
          val = result;
        }
        if (val !== this.values(index)) {
          newVal = this.values();
          /** @type {number} */
          newVal[index] = val;
          allowed = this._trigger("slide", event, {
            handle : this.handles[index],
            value : val,
            values : newVal
          });
          this.values(index ? 0 : 1);
          if (false !== allowed) {
            this.values(index, val, true);
          }
        }
      } else {
        if (val !== this.value()) {
          allowed = this._trigger("slide", event, {
            handle : this.handles[index],
            value : val
          });
          if (false !== allowed) {
            this.value(val);
          }
        }
      }
    },
    _stop : function(e, index) {
      var uiHash = {
        handle : this.handles[index],
        value : this.value()
      };
      if (this.options.values && this.options.values.length) {
        uiHash.value = this.values(index);
        uiHash.values = this.values();
      }
      this._trigger("stop", e, uiHash);
    },
    _change : function(e, index) {
      if (!this._keySliding && !this._mouseSliding) {
        var uiHash = {
          handle : this.handles[index],
          value : this.value()
        };
        if (this.options.values && this.options.values.length) {
          uiHash.value = this.values(index);
          uiHash.values = this.values();
        }
        /** @type {!Object} */
        this._lastChangedValue = index;
        this._trigger("change", e, uiHash);
      }
    },
    value : function(name) {
      return arguments.length ? (this.options.value = this._trimAlignValue(name), this._refreshValue(), this._change(null, 0), void 0) : this._value();
    },
    values : function(name, value) {
      var vals;
      var newValues;
      var i;
      if (1 < arguments.length) {
        return this.options.values[name] = this._trimAlignValue(value), this._refreshValue(), this._change(null, name), void 0;
      }
      if (!arguments.length) {
        return this._values();
      }
      if (!$.isArray(arguments[0])) {
        return this.options.values && this.options.values.length ? this._values(name) : this.value();
      }
      vals = this.options.values;
      newValues = arguments[0];
      /** @type {number} */
      i = 0;
      for (; vals.length > i; i = i + 1) {
        vals[i] = this._trimAlignValue(newValues[i]);
        this._change(null, i);
      }
      this._refreshValue();
    },
    _setOption : function(option, value) {
      var i;
      /** @type {number} */
      var countRep = 0;
      switch("range" === option && true === this.options.range && ("min" === value ? (this.options.value = this._values(0), this.options.values = null) : "max" === value && (this.options.value = this._values(this.options.values.length - 1), this.options.values = null)), $.isArray(this.options.values) && (countRep = this.options.values.length), $.Widget.prototype._setOption.apply(this, arguments), option) {
        case "orientation":
          this._detectOrientation();
          this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
          this._refreshValue();
          break;
        case "value":
          /** @type {boolean} */
          this._animateOff = true;
          this._refreshValue();
          this._change(null, 0);
          /** @type {boolean} */
          this._animateOff = false;
          break;
        case "values":
          /** @type {boolean} */
          this._animateOff = true;
          this._refreshValue();
          /** @type {number} */
          i = 0;
          for (; countRep > i; i = i + 1) {
            this._change(null, i);
          }
          /** @type {boolean} */
          this._animateOff = false;
          break;
        case "min":
        case "max":
          /** @type {boolean} */
          this._animateOff = true;
          this._refreshValue();
          /** @type {boolean} */
          this._animateOff = false;
          break;
        case "range":
          /** @type {boolean} */
          this._animateOff = true;
          this._refresh();
          /** @type {boolean} */
          this._animateOff = false;
      }
    },
    _value : function() {
      return this._trimAlignValue(this.options.value);
    },
    _values : function(key) {
      var vals;
      var i;
      if (arguments.length) {
        return vals = this.options.values[key], this._trimAlignValue(vals);
      }
      if (this.options.values && this.options.values.length) {
        vals = this.options.values.slice();
        /** @type {number} */
        i = 0;
        for (; vals.length > i; i = i + 1) {
          vals[i] = this._trimAlignValue(vals[i]);
        }
        return vals;
      }
      return [];
    },
    _trimAlignValue : function(val) {
      if (this._valueMin() >= val) {
        return this._valueMin();
      }
      if (val >= this._valueMax()) {
        return this._valueMax();
      }
      var step = 0 < this.options.step ? this.options.step : 1;
      /** @type {number} */
      var diff = (val - this._valueMin()) % step;
      /** @type {number} */
      val = val - diff;
      return 2 * Math.abs(diff) >= step && (val = val + (0 < diff ? step : -step)), parseFloat(val.toFixed(5));
    },
    _valueMin : function() {
      return this.options.min;
    },
    _valueMax : function() {
      return this.options.max;
    },
    _refreshValue : function() {
      var rectangleWidth;
      var width;
      var value;
      var valueMin;
      var valueMax;
      var r = this.options.range;
      var options = this.options;
      var self = this;
      var animate = this._animateOff ? false : options.animate;
      var style = {};
      if (this.options.values && this.options.values.length) {
        this.handles.each(function(c) {
          /** @type {number} */
          width = 100 * ((self.values(c) - self._valueMin()) / (self._valueMax() - self._valueMin()));
          /** @type {string} */
          style["horizontal" === self.orientation ? "left" : "bottom"] = width + "%";
          $(this).stop(1, 1)[animate ? "animate" : "css"](style, options.animate);
          if (true === self.options.range) {
            if ("horizontal" === self.orientation) {
              if (0 === c) {
                self.range.stop(1, 1)[animate ? "animate" : "css"]({
                  left : width + "%"
                }, options.animate);
              }
              if (1 === c) {
                self.range[animate ? "animate" : "css"]({
                  width : width - rectangleWidth + "%"
                }, {
                  queue : false,
                  duration : options.animate
                });
              }
            } else {
              if (0 === c) {
                self.range.stop(1, 1)[animate ? "animate" : "css"]({
                  bottom : width + "%"
                }, options.animate);
              }
              if (1 === c) {
                self.range[animate ? "animate" : "css"]({
                  height : width - rectangleWidth + "%"
                }, {
                  queue : false,
                  duration : options.animate
                });
              }
            }
          }
          /** @type {number} */
          rectangleWidth = width;
        });
      } else {
        value = this.value();
        valueMin = this._valueMin();
        valueMax = this._valueMax();
        /** @type {number} */
        width = valueMax !== valueMin ? (value - valueMin) / (valueMax - valueMin) * 100 : 0;
        style["horizontal" === this.orientation ? "left" : "bottom"] = width + "%";
        this.handle.stop(1, 1)[animate ? "animate" : "css"](style, options.animate);
        if ("min" === r && "horizontal" === this.orientation) {
          this.range.stop(1, 1)[animate ? "animate" : "css"]({
            width : width + "%"
          }, options.animate);
        }
        if ("max" === r && "horizontal" === this.orientation) {
          this.range[animate ? "animate" : "css"]({
            width : 100 - width + "%"
          }, {
            queue : false,
            duration : options.animate
          });
        }
        if ("min" === r && "vertical" === this.orientation) {
          this.range.stop(1, 1)[animate ? "animate" : "css"]({
            height : width + "%"
          }, options.animate);
        }
        if ("max" === r && "vertical" === this.orientation) {
          this.range[animate ? "animate" : "css"]({
            height : 100 - width + "%"
          }, {
            queue : false,
            duration : options.animate
          });
        }
      }
    },
    _handleEvents : {
      keydown : function(event) {
        var curVal;
        var newVal;
        var step;
        var index = $(event.target).data("ui-slider-handle-index");
        switch(event.keyCode) {
          case $.ui.keyCode.HOME:
          case $.ui.keyCode.END:
          case $.ui.keyCode.PAGE_UP:
          case $.ui.keyCode.PAGE_DOWN:
          case $.ui.keyCode.UP:
          case $.ui.keyCode.RIGHT:
          case $.ui.keyCode.DOWN:
          case $.ui.keyCode.LEFT:
            if (event.preventDefault(), !this._keySliding && (this._keySliding = true, $(event.target).addClass("ui-state-active"), curVal = this._start(event, index), false === curVal)) {
              return;
            }
        }
        switch(step = this.options.step, curVal = newVal = this.options.values && this.options.values.length ? this.values(index) : this.value(), event.keyCode) {
          case $.ui.keyCode.HOME:
            newVal = this._valueMin();
            break;
          case $.ui.keyCode.END:
            newVal = this._valueMax();
            break;
          case $.ui.keyCode.PAGE_UP:
            newVal = this._trimAlignValue(curVal + (this._valueMax() - this._valueMin()) / 5);
            break;
          case $.ui.keyCode.PAGE_DOWN:
            newVal = this._trimAlignValue(curVal - (this._valueMax() - this._valueMin()) / 5);
            break;
          case $.ui.keyCode.UP:
          case $.ui.keyCode.RIGHT:
            if (curVal === this._valueMax()) {
              return;
            }
            newVal = this._trimAlignValue(curVal + step);
            break;
          case $.ui.keyCode.DOWN:
          case $.ui.keyCode.LEFT:
            if (curVal === this._valueMin()) {
              return;
            }
            newVal = this._trimAlignValue(curVal - step);
        }
        this._slide(event, index, newVal);
      },
      click : function(event) {
        event.preventDefault();
      },
      keyup : function(event) {
        var index = $(event.target).data("ui-slider-handle-index");
        if (this._keySliding) {
          /** @type {boolean} */
          this._keySliding = false;
          this._stop(event, index);
          this._change(event, index);
          $(event.target).removeClass("ui-state-active");
        }
      }
    }
  });
})(jQuery);
(function($) {
  /**
   * @param {!Function} fn
   * @return {?}
   */
  function spinnerModifer(fn) {
    return function() {
      var b = this.element.val();
      fn.apply(this, arguments);
      this._refresh();
      if (b !== this.element.val()) {
        this._trigger("change");
      }
    };
  }
  $.widget("ui.spinner", {
    version : "1.10.3",
    defaultElement : "<input>",
    widgetEventPrefix : "spin",
    options : {
      culture : null,
      icons : {
        down : "ui-icon-triangle-1-s",
        up : "ui-icon-triangle-1-n"
      },
      incremental : true,
      max : null,
      min : null,
      numberFormat : null,
      page : 10,
      step : 1,
      change : null,
      spin : null,
      start : null,
      stop : null
    },
    _create : function() {
      this._setOption("max", this.options.max);
      this._setOption("min", this.options.min);
      this._setOption("step", this.options.step);
      this._value(this.element.val(), true);
      this._draw();
      this._on(this._events);
      this._refresh();
      this._on(this.window, {
        beforeunload : function() {
          this.element.removeAttr("autocomplete");
        }
      });
    },
    _getCreateOptions : function() {
      var s = {};
      var contentHtml = this.element;
      return $.each(["min", "max", "step"], function(value, style) {
        value = contentHtml.attr(style);
        if (void 0 !== value && value.length) {
          /** @type {number} */
          s[style] = value;
        }
      }), s;
    },
    _events : {
      keydown : function(event) {
        if (this._start(event) && this._keydown(event)) {
          event.preventDefault();
        }
      },
      keyup : "_stop",
      focus : function() {
        this.previous = this.element.val();
      },
      blur : function(e) {
        return this.cancelBlur ? (delete this.cancelBlur, void 0) : (this._stop(), this._refresh(), this.previous !== this.element.val() && this._trigger("change", e), void 0);
      },
      mousewheel : function(event, fn) {
        if (fn) {
          if (!this.spinning && !this._start(event)) {
            return false;
          }
          this._spin((0 < fn ? 1 : -1) * this.options.step, event);
          clearTimeout(this.mousewheelTimer);
          this.mousewheelTimer = this._delay(function() {
            if (this.spinning) {
              this._stop(event);
            }
          }, 100);
          event.preventDefault();
        }
      },
      "mousedown .ui-spinner-button" : function(event) {
        /**
         * @return {undefined}
         */
        function checkFocus() {
          if (!(this.element[0] === this.document[0].activeElement)) {
            this.element.focus();
            this.previous = previous;
            this._delay(function() {
              this.previous = previous;
            });
          }
        }
        var previous;
        previous = this.element[0] === this.document[0].activeElement ? this.previous : this.element.val();
        event.preventDefault();
        checkFocus.call(this);
        /** @type {boolean} */
        this.cancelBlur = true;
        this._delay(function() {
          delete this.cancelBlur;
          checkFocus.call(this);
        });
        if (false !== this._start(event)) {
          this._repeat(null, $(event.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, event);
        }
      },
      "mouseup .ui-spinner-button" : "_stop",
      "mouseenter .ui-spinner-button" : function(event) {
        return $(event.currentTarget).hasClass("ui-state-active") ? false === this._start(event) ? false : (this._repeat(null, $(event.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, event), void 0) : void 0;
      },
      "mouseleave .ui-spinner-button" : "_stop"
    },
    _draw : function() {
      var uiSpinner = this.uiSpinner = this.element.addClass("ui-spinner-input").attr("autocomplete", "off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());
      this.element.attr("role", "spinbutton");
      this.buttons = uiSpinner.find(".ui-spinner-button").attr("tabIndex", -1).button().removeClass("ui-corner-all");
      if (this.buttons.height() > Math.ceil(.5 * uiSpinner.height()) && 0 < uiSpinner.height()) {
        uiSpinner.height(uiSpinner.height());
      }
      if (this.options.disabled) {
        this.disable();
      }
    },
    _keydown : function(event) {
      var options = this.options;
      var keyCode = $.ui.keyCode;
      switch(event.keyCode) {
        case keyCode.UP:
          return this._repeat(null, 1, event), true;
        case keyCode.DOWN:
          return this._repeat(null, -1, event), true;
        case keyCode.PAGE_UP:
          return this._repeat(null, options.page, event), true;
        case keyCode.PAGE_DOWN:
          return this._repeat(null, -options.page, event), true;
      }
      return false;
    },
    _uiSpinnerHtml : function() {
      return "<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>";
    },
    _buttonHtml : function() {
      return "<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon " + this.options.icons.up + "'>&#9650;</span></a><a class='ui-spinner-button ui-spinner-down ui-corner-br'><span class='ui-icon " + this.options.icons.down + "'>&#9660;</span></a>";
    },
    _start : function(event) {
      return this.spinning || false !== this._trigger("start", event) ? (this.counter || (this.counter = 1), this.spinning = true, true) : false;
    },
    _repeat : function(i, steps, event) {
      i = i || 500;
      clearTimeout(this.timer);
      this.timer = this._delay(function() {
        this._repeat(40, steps, event);
      }, i);
      this._spin(steps * this.options.step, event);
    },
    _spin : function(step, event) {
      var value = this.value() || 0;
      if (!this.counter) {
        /** @type {number} */
        this.counter = 1;
      }
      value = this._adjustValue(value + step * this._increment(this.counter));
      if (!(this.spinning && false === this._trigger("spin", event, {
        value : value
      }))) {
        this._value(value);
        this.counter++;
      }
    },
    _increment : function(i) {
      var incremental = this.options.incremental;
      return incremental ? $.isFunction(incremental) ? incremental(i) : Math.floor(i * i * i / 5E4 - i * i / 500 + 17 * i / 200 + 1) : 1;
    },
    _precision : function() {
      var precision = this._precisionOf(this.options.step);
      return null !== this.options.min && (precision = Math.max(precision, this._precisionOf(this.options.min))), precision;
    },
    _precisionOf : function(num) {
      /** @type {string} */
      num = "" + num;
      /** @type {number} */
      var digits = num.indexOf(".");
      return -1 === digits ? 0 : num.length - digits - 1;
    },
    _adjustValue : function(value) {
      var base;
      var aboveMin;
      var options = this.options;
      return base = null !== options.min ? options.min : 0, aboveMin = value - base, aboveMin = Math.round(aboveMin / options.step) * options.step, value = base + aboveMin, value = parseFloat(value.toFixed(this._precision())), null !== options.max && value > options.max ? options.max : null !== options.min && options.min > value ? options.min : value;
    },
    _stop : function(e) {
      if (this.spinning) {
        clearTimeout(this.timer);
        clearTimeout(this.mousewheelTimer);
        /** @type {number} */
        this.counter = 0;
        /** @type {boolean} */
        this.spinning = false;
        this._trigger("stop", e);
      }
    },
    _setOption : function(name, value) {
      if ("culture" === name || "numberFormat" === name) {
        var prevValue = this._parse(this.element.val());
        return this.options[name] = value, this.element.val(this._format(prevValue)), void 0;
      }
      if (!("max" !== name && "min" !== name && "step" !== name || "string" != typeof value)) {
        value = this._parse(value);
      }
      if ("icons" === name) {
        this.buttons.first().find(".ui-icon").removeClass(this.options.icons.up).addClass(value.up);
        this.buttons.last().find(".ui-icon").removeClass(this.options.icons.down).addClass(value.down);
      }
      this._super(name, value);
      if ("disabled" === name) {
        if (value) {
          this.element.prop("disabled", true);
          this.buttons.button("disable");
        } else {
          this.element.prop("disabled", false);
          this.buttons.button("enable");
        }
      }
    },
    _setOptions : spinnerModifer(function(key) {
      this._super(key);
      this._value(this.element.val());
    }),
    _parse : function(value) {
      return "string" == typeof value && "" !== value && (value = window.Globalize && this.options.numberFormat ? Globalize.parseFloat(value, 10, this.options.culture) : +value), "" === value || isNaN(value) ? null : value;
    },
    _format : function(value) {
      return "" === value ? "" : window.Globalize && this.options.numberFormat ? Globalize.format(value, this.options.numberFormat, this.options.culture) : value;
    },
    _refresh : function() {
      this.element.attr({
        "aria-valuemin" : this.options.min,
        "aria-valuemax" : this.options.max,
        "aria-valuenow" : this._parse(this.element.val())
      });
    },
    _value : function(value, allowAny) {
      var parsed;
      if ("" !== value) {
        parsed = this._parse(value);
        if (null !== parsed) {
          if (!allowAny) {
            parsed = this._adjustValue(parsed);
          }
          value = this._format(parsed);
        }
      }
      this.element.val(value);
      this._refresh();
    },
    _destroy : function() {
      this.element.removeClass("ui-spinner-input").prop("disabled", false).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
      this.uiSpinner.replaceWith(this.element);
    },
    stepUp : spinnerModifer(function(steps) {
      this._stepUp(steps);
    }),
    _stepUp : function(steps) {
      if (this._start()) {
        this._spin((steps || 1) * this.options.step);
        this._stop();
      }
    },
    stepDown : spinnerModifer(function(steps) {
      this._stepDown(steps);
    }),
    _stepDown : function(steps) {
      if (this._start()) {
        this._spin((steps || 1) * -this.options.step);
        this._stop();
      }
    },
    pageUp : spinnerModifer(function(pages) {
      this._stepUp((pages || 1) * this.options.page);
    }),
    pageDown : spinnerModifer(function(pages) {
      this._stepDown((pages || 1) * this.options.page);
    }),
    value : function(name) {
      return arguments.length ? (spinnerModifer(this._value).call(this, name), void 0) : this._parse(this.element.val());
    },
    widget : function() {
      return this.uiSpinner;
    }
  });
})(jQuery);
(function($, events) {
  /**
   * @param {!Object} href
   * @return {?}
   */
  function isLocal(href) {
    return 1 < href.hash.length && decodeURIComponent(href.href.replace(hashStrip, "")) === decodeURIComponent(location.href.replace(hashStrip, ""));
  }
  /** @type {number} */
  var listId = 0;
  /** @type {!RegExp} */
  var hashStrip = /#.*$/;
  $.widget("ui.tabs", {
    version : "1.10.3",
    delay : 300,
    options : {
      active : null,
      collapsible : false,
      event : "click",
      heightStyle : "content",
      hide : null,
      show : null,
      activate : null,
      beforeActivate : null,
      beforeLoad : null,
      load : null
    },
    _create : function() {
      var local = this;
      var options = this.options;
      /** @type {boolean} */
      this.running = false;
      this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", options.collapsible).delegate(".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function(event) {
        if ($(this).is(".ui-state-disabled")) {
          event.preventDefault();
        }
      }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
        if ($(this).closest("li").is(".ui-state-disabled")) {
          this.blur();
        }
      });
      this._processTabs();
      options.active = this._initialActive();
      if ($.isArray(options.disabled)) {
        options.disabled = $.unique(options.disabled.concat($.map(this.tabs.filter(".ui-state-disabled"), function(b) {
          return local.tabs.index(b);
        }))).sort();
      }
      this.active = false !== this.options.active && this.anchors.length ? this._findActive(options.active) : $();
      this._refresh();
      if (this.active.length) {
        this.load(options.active);
      }
    },
    _initialActive : function() {
      var i = this.options.active;
      var isDisabled = this.options.collapsible;
      /** @type {string} */
      var IS_EVENT = location.hash.substring(1);
      return null === i && (IS_EVENT && this.tabs.each(function(maxAtomIndex, clicked_el) {
        return $(clicked_el).attr("aria-controls") === IS_EVENT ? (i = maxAtomIndex, false) : events;
      }), null === i && (i = this.tabs.index(this.tabs.filter(".ui-tabs-active"))), (null === i || -1 === i) && (i = this.tabs.length ? 0 : false)), false !== i && (i = this.tabs.index(this.tabs.eq(i)), -1 === i && (i = isDisabled ? false : 0)), !isDisabled && false === i && this.anchors.length && (i = 0), i;
    },
    _getCreateEventData : function() {
      return {
        tab : this.active,
        panel : this.active.length ? this._getPanelForTab(this.active) : $()
      };
    },
    _tabKeydown : function(event) {
      var item = $(this.document[0].activeElement).closest("li");
      var selectedIndex = this.tabs.index(item);
      /** @type {boolean} */
      var goingForward = true;
      if (!this._handlePageNav(event)) {
        switch(event.keyCode) {
          case $.ui.keyCode.RIGHT:
          case $.ui.keyCode.DOWN:
            selectedIndex++;
            break;
          case $.ui.keyCode.UP:
          case $.ui.keyCode.LEFT:
            /** @type {boolean} */
            goingForward = false;
            selectedIndex--;
            break;
          case $.ui.keyCode.END:
            /** @type {number} */
            selectedIndex = this.anchors.length - 1;
            break;
          case $.ui.keyCode.HOME:
            /** @type {number} */
            selectedIndex = 0;
            break;
          case $.ui.keyCode.SPACE:
            return event.preventDefault(), clearTimeout(this.activating), this._activate(selectedIndex), events;
          case $.ui.keyCode.ENTER:
            return event.preventDefault(), clearTimeout(this.activating), this._activate(selectedIndex === this.options.active ? false : selectedIndex), events;
          default:
            return;
        }
        event.preventDefault();
        clearTimeout(this.activating);
        selectedIndex = this._focusNextTab(selectedIndex, goingForward);
        if (!event.ctrlKey) {
          item.attr("aria-selected", "false");
          this.tabs.eq(selectedIndex).attr("aria-selected", "true");
          this.activating = this._delay(function() {
            this.option("active", selectedIndex);
          }, this.delay);
        }
      }
    },
    _panelKeydown : function(event) {
      if (!this._handlePageNav(event)) {
        if (event.ctrlKey && event.keyCode === $.ui.keyCode.UP) {
          event.preventDefault();
          this.active.focus();
        }
      }
    },
    _handlePageNav : function(event) {
      return event.altKey && event.keyCode === $.ui.keyCode.PAGE_UP ? (this._activate(this._focusNextTab(this.options.active - 1, false)), true) : event.altKey && event.keyCode === $.ui.keyCode.PAGE_DOWN ? (this._activate(this._focusNextTab(this.options.active + 1, true)), true) : events;
    },
    _findNextTab : function(index, goingForward) {
      /** @type {number} */
      var total = this.tabs.length - 1;
      for (; -1 !== $.inArray((index > total && (index = 0), 0 > index && (index = total), index), this.options.disabled);) {
        index = goingForward ? index + 1 : index - 1;
      }
      return index;
    },
    _focusNextTab : function(index, goingForward) {
      return index = this._findNextTab(index, goingForward), this.tabs.eq(index).focus(), index;
    },
    _setOption : function(name, value) {
      return "active" === name ? (this._activate(value), events) : "disabled" === name ? (this._setupDisabled(value), events) : (this._super(name, value), "collapsible" === name && (this.element.toggleClass("ui-tabs-collapsible", value), value || false !== this.options.active || this._activate(0)), "event" === name && this._setupEvents(value), "heightStyle" === name && this._setupHeightStyle(value), events);
    },
    _tabId : function(tab) {
      return tab.attr("aria-controls") || "ui-tabs-" + ++listId;
    },
    _sanitizeSelector : function(hash) {
      return hash ? hash.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : "";
    },
    refresh : function() {
      var options = this.options;
      var c = this.tablist.children(":has(a[href])");
      options.disabled = $.map(c.filter(".ui-state-disabled"), function(a) {
        return c.index(a);
      });
      this._processTabs();
      if (false !== options.active && this.anchors.length) {
        if (this.active.length && !$.contains(this.tablist[0], this.active[0])) {
          if (this.tabs.length === options.disabled.length) {
            /** @type {boolean} */
            options.active = false;
            this.active = $();
          } else {
            this._activate(this._findNextTab(Math.max(0, options.active - 1), false));
          }
        } else {
          options.active = this.tabs.index(this.active);
        }
      } else {
        /** @type {boolean} */
        options.active = false;
        this.active = $();
      }
      this._refresh();
    },
    _refresh : function() {
      this._setupDisabled(this.options.disabled);
      this._setupEvents(this.options.event);
      this._setupHeightStyle(this.options.heightStyle);
      this.tabs.not(this.active).attr({
        "aria-selected" : "false",
        tabIndex : -1
      });
      this.panels.not(this._getPanelForTab(this.active)).hide().attr({
        "aria-expanded" : "false",
        "aria-hidden" : "true"
      });
      if (this.active.length) {
        this.active.addClass("ui-tabs-active ui-state-active").attr({
          "aria-selected" : "true",
          tabIndex : 0
        });
        this._getPanelForTab(this.active).show().attr({
          "aria-expanded" : "true",
          "aria-hidden" : "false"
        });
      } else {
        this.tabs.eq(0).attr("tabIndex", 0);
      }
    },
    _processTabs : function() {
      var that = this;
      this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist");
      this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({
        role : "tab",
        tabIndex : -1
      });
      this.anchors = this.tabs.map(function() {
        return $("a", this)[0];
      }).addClass("ui-tabs-anchor").attr({
        role : "presentation",
        tabIndex : -1
      });
      this.panels = $();
      this.anchors.each(function(i, anchor) {
        var selector;
        var panel;
        var panelId;
        var anchorId = $(anchor).uniqueId().attr("id");
        var tab = $(anchor).closest("li");
        var id = tab.attr("aria-controls");
        if (isLocal(anchor)) {
          selector = anchor.hash;
          panel = that.element.find(that._sanitizeSelector(selector));
        } else {
          panelId = that._tabId(tab);
          /** @type {string} */
          selector = "#" + panelId;
          panel = that.element.find(selector);
          if (!panel.length) {
            panel = that._createPanel(panelId);
            panel.insertAfter(that.panels[i - 1] || that.tablist);
          }
          panel.attr("aria-live", "polite");
        }
        if (panel.length) {
          that.panels = that.panels.add(panel);
        }
        if (id) {
          tab.data("ui-tabs-aria-controls", id);
        }
        tab.attr({
          "aria-controls" : selector.substring(1),
          "aria-labelledby" : anchorId
        });
        panel.attr("aria-labelledby", anchorId);
      });
      this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel");
    },
    _getList : function() {
      return this.element.find("ol,ul").eq(0);
    },
    _createPanel : function(id) {
      return $("<div>").attr("id", id).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", true);
    },
    _setupDisabled : function(disabled) {
      if ($.isArray(disabled)) {
        if (disabled.length) {
          if (disabled.length === this.anchors.length) {
            /** @type {boolean} */
            disabled = true;
          }
        } else {
          /** @type {boolean} */
          disabled = false;
        }
      }
      var li;
      /** @type {number} */
      var i = 0;
      for (; li = this.tabs[i]; i++) {
        if (true === disabled || -1 !== $.inArray(i, disabled)) {
          $(li).addClass("ui-state-disabled").attr("aria-disabled", "true");
        } else {
          $(li).removeClass("ui-state-disabled").removeAttr("aria-disabled");
        }
      }
      /** @type {boolean} */
      this.options.disabled = disabled;
    },
    _setupEvents : function(event) {
      var events = {
        click : function(event) {
          event.preventDefault();
        }
      };
      if (event) {
        $.each(event.split(" "), function(a, eventName) {
          /** @type {string} */
          events[eventName] = "_eventHandler";
        });
      }
      this._off(this.anchors.add(this.tabs).add(this.panels));
      this._on(this.anchors, events);
      this._on(this.tabs, {
        keydown : "_tabKeydown"
      });
      this._on(this.panels, {
        keydown : "_panelKeydown"
      });
      this._focusable(this.tabs);
      this._hoverable(this.tabs);
    },
    _setupHeightStyle : function(heightStyle) {
      var maxHeight;
      var cssChanges = this.element.parent();
      if ("fill" === heightStyle) {
        maxHeight = cssChanges.height();
        /** @type {number} */
        maxHeight = maxHeight - (this.element.outerHeight() - this.element.height());
        this.element.siblings(":visible").each(function() {
          var $scrollerElement = $(this);
          var undefined = $scrollerElement.css("position");
          if ("absolute" !== undefined && "fixed" !== undefined) {
            /** @type {number} */
            maxHeight = maxHeight - $scrollerElement.outerHeight(true);
          }
        });
        this.element.children().not(this.panels).each(function() {
          /** @type {number} */
          maxHeight = maxHeight - $(this).outerHeight(true);
        });
        this.panels.each(function() {
          $(this).height(Math.max(0, maxHeight - $(this).innerHeight() + $(this).height()));
        }).css("overflow", "auto");
      } else {
        if ("auto" === heightStyle) {
          /** @type {number} */
          maxHeight = 0;
          this.panels.each(function() {
            /** @type {number} */
            maxHeight = Math.max(maxHeight, $(this).height("").height());
          }).height(maxHeight);
        }
      }
    },
    _eventHandler : function(event) {
      var options = this.options;
      var data = this.active;
      var tab = $(event.currentTarget).closest("li");
      /** @type {boolean} */
      var clickedIsActive = tab[0] === data[0];
      var collapsing = clickedIsActive && options.collapsible;
      var addqueue = collapsing ? $() : this._getPanelForTab(tab);
      var removequeue = data.length ? this._getPanelForTab(data) : $();
      data = {
        oldTab : data,
        oldPanel : removequeue,
        newTab : collapsing ? $() : tab,
        newPanel : addqueue
      };
      event.preventDefault();
      if (!(tab.hasClass("ui-state-disabled") || tab.hasClass("ui-tabs-loading") || this.running || clickedIsActive && !options.collapsible || false === this._trigger("beforeActivate", event, data))) {
        options.active = collapsing ? false : this.tabs.index(tab);
        this.active = clickedIsActive ? $() : tab;
        if (this.xhr) {
          this.xhr.abort();
        }
        if (!(removequeue.length || addqueue.length)) {
          $.error("jQuery UI Tabs: Mismatching fragment identifier.");
        }
        if (addqueue.length) {
          this.load(this.tabs.index(tab), event);
        }
        this._toggle(event, data);
      }
    },
    _toggle : function(e, data) {
      /**
       * @return {undefined}
       */
      function complete() {
        /** @type {boolean} */
        that.running = false;
        that._trigger("activate", e, data);
      }
      /**
       * @return {undefined}
       */
      function show() {
        data.newTab.closest("li").addClass("ui-tabs-active ui-state-active");
        if (toShow.length && that.options.show) {
          that._show(toShow, that.options.show, complete);
        } else {
          toShow.show();
          complete();
        }
      }
      var that = this;
      var toShow = data.newPanel;
      var toHide = data.oldPanel;
      /** @type {boolean} */
      this.running = true;
      if (toHide.length && this.options.hide) {
        this._hide(toHide, this.options.hide, function() {
          data.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");
          show();
        });
      } else {
        data.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");
        toHide.hide();
        show();
      }
      toHide.attr({
        "aria-expanded" : "false",
        "aria-hidden" : "true"
      });
      data.oldTab.attr("aria-selected", "false");
      if (toShow.length && toHide.length) {
        data.oldTab.attr("tabIndex", -1);
      } else {
        if (toShow.length) {
          this.tabs.filter(function() {
            return 0 === $(this).attr("tabIndex");
          }).attr("tabIndex", -1);
        }
      }
      toShow.attr({
        "aria-expanded" : "true",
        "aria-hidden" : "false"
      });
      data.newTab.attr({
        "aria-selected" : "true",
        tabIndex : 0
      });
    },
    _activate : function(index) {
      var item;
      index = this._findActive(index);
      if (index[0] !== this.active[0]) {
        if (!index.length) {
          index = this.active;
        }
        item = index.find(".ui-tabs-anchor")[0];
        this._eventHandler({
          target : item,
          currentTarget : item,
          preventDefault : $.noop
        });
      }
    },
    _findActive : function(index) {
      return false === index ? $() : this.tabs.eq(index);
    },
    _getIndex : function(index) {
      return "string" == typeof index && (index = this.anchors.index(this.anchors.filter("[href$='" + index + "']"))), index;
    },
    _destroy : function() {
      if (this.xhr) {
        this.xhr.abort();
      }
      this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible");
      this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role");
      this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId();
      this.tabs.add(this.panels).each(function() {
        if ($.data(this, "ui-tabs-destroy")) {
          $(this).remove();
        } else {
          $(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role");
        }
      });
      this.tabs.each(function() {
        var li = $(this);
        var prev = li.data("ui-tabs-aria-controls");
        if (prev) {
          li.attr("aria-controls", prev).removeData("ui-tabs-aria-controls");
        } else {
          li.removeAttr("aria-controls");
        }
      });
      this.panels.show();
      if ("content" !== this.options.heightStyle) {
        this.panels.css("height", "");
      }
    },
    enable : function(name) {
      var disabled = this.options.disabled;
      if (false !== disabled) {
        if (name === events) {
          /** @type {boolean} */
          disabled = false;
        } else {
          name = this._getIndex(name);
          disabled = $.isArray(disabled) ? $.map(disabled, function(originalName) {
            return originalName !== name ? originalName : null;
          }) : $.map(this.tabs, function(a, originalName) {
            return originalName !== name ? originalName : null;
          });
        }
        this._setupDisabled(disabled);
      }
    },
    disable : function(name) {
      var disabled = this.options.disabled;
      if (true !== disabled) {
        if (name === events) {
          /** @type {boolean} */
          disabled = true;
        } else {
          if (name = this._getIndex(name), -1 !== $.inArray(name, disabled)) {
            return;
          }
          disabled = $.isArray(disabled) ? $.merge([name], disabled).sort() : [name];
        }
        this._setupDisabled(disabled);
      }
    },
    load : function(index, event) {
      index = this._getIndex(index);
      var self = this;
      var tab = this.tabs.eq(index);
      index = tab.find(".ui-tabs-anchor");
      var panel = this._getPanelForTab(tab);
      var eventData = {
        tab : tab,
        panel : panel
      };
      if (!isLocal(index[0])) {
        this.xhr = $.ajax(this._ajaxSettings(index, event, eventData));
        if (this.xhr && "canceled" !== this.xhr.statusText) {
          tab.addClass("ui-tabs-loading");
          panel.attr("aria-busy", "true");
          this.xhr.success(function(a) {
            setTimeout(function() {
              panel.html(a);
              self._trigger("load", event, eventData);
            }, 1);
          }).complete(function(xhr, status) {
            setTimeout(function() {
              if ("abort" === status) {
                self.panels.stop(false, true);
              }
              tab.removeClass("ui-tabs-loading");
              panel.removeAttr("aria-busy");
              if (xhr === self.xhr) {
                delete self.xhr;
              }
            }, 1);
          });
        }
      }
    },
    _ajaxSettings : function(ui, event, eventData) {
      var that = this;
      return {
        url : ui.attr("href"),
        beforeSend : function(xhr, settings) {
          return that._trigger("beforeLoad", event, $.extend({
            jqXHR : xhr,
            ajaxSettings : settings
          }, eventData));
        }
      };
    },
    _getPanelForTab : function(id) {
      id = $(id).attr("aria-controls");
      return this.element.find(this._sanitizeSelector("#" + id));
    }
  });
})(jQuery);
(function($) {
  /**
   * @param {!Object} elem
   * @param {undefined} id
   * @return {undefined}
   */
  function addDescribedBy(elem, id) {
    var newDeletedIds = (elem.attr("aria-describedby") || "").split(/\s+/);
    newDeletedIds.push(id);
    elem.data("ui-tooltip-id", id).attr("aria-describedby", $.trim(newDeletedIds.join(" ")));
  }
  /**
   * @param {!Object} elem
   * @return {undefined}
   */
  function removeDescribedBy(elem) {
    var id = elem.data("ui-tooltip-id");
    var current = (elem.attr("aria-describedby") || "").split(/\s+/);
    id = $.inArray(id, current);
    if (-1 !== id) {
      current.splice(id, 1);
    }
    elem.removeData("ui-tooltip-id");
    if (current = $.trim(current.join(" "))) {
      elem.attr("aria-describedby", current);
    } else {
      elem.removeAttr("aria-describedby");
    }
  }
  /** @type {number} */
  var increments = 0;
  $.widget("ui.tooltip", {
    version : "1.10.3",
    options : {
      content : function() {
        var a = $(this).attr("title") || "";
        return $("<a>").text(a).html();
      },
      hide : true,
      items : "[title]:not([disabled])",
      position : {
        my : "left top+15",
        at : "left bottom",
        collision : "flipfit flip"
      },
      show : true,
      tooltipClass : null,
      track : false,
      close : null,
      open : null
    },
    _create : function() {
      this._on({
        mouseover : "open",
        focusin : "open"
      });
      this.tooltips = {};
      this.parents = {};
      if (this.options.disabled) {
        this._disable();
      }
    },
    _setOption : function(value, option) {
      var that = this;
      return "disabled" === value ? (this[option ? "_disable" : "_enable"](), this.options[value] = option, void 0) : (this._super(value, option), "content" === value && $.each(this.tooltips, function(a, v) {
        that._updateContent(v);
      }), void 0);
    },
    _disable : function() {
      var a = this;
      $.each(this.tooltips, function(event, element) {
        event = $.Event("blur");
        event.target = event.currentTarget = element[0];
        a.close(event, true);
      });
      this.element.find(this.options.items).addBack().each(function() {
        var element = $(this);
        if (element.is("[title]")) {
          element.data("ui-tooltip-title", element.attr("title")).attr("title", "");
        }
      });
    },
    _enable : function() {
      this.element.find(this.options.items).addBack().each(function() {
        var element = $(this);
        if (element.data("ui-tooltip-title")) {
          element.attr("title", element.data("ui-tooltip-title"));
        }
      });
    },
    open : function(name) {
      var that = this;
      var target = $(name ? name.target : this.element).closest(this.options.items);
      if (target.length && !target.data("ui-tooltip-id")) {
        if (target.attr("title")) {
          target.data("ui-tooltip-title", target.attr("title"));
        }
        target.data("ui-tooltip-open", true);
        if (name && "mouseover" === name.type) {
          target.parents().each(function() {
            var e;
            var parent = $(this);
            if (parent.data("ui-tooltip-open")) {
              e = $.Event("blur");
              e.target = e.currentTarget = this;
              that.close(e, true);
            }
            if (parent.attr("title")) {
              parent.uniqueId();
              that.parents[this.id] = {
                element : this,
                title : parent.attr("title")
              };
              parent.attr("title", "");
            }
          });
        }
        this._updateContent(target, name);
      }
    },
    _updateContent : function(target, event) {
      var data;
      var v = this.options.content;
      var that = this;
      var eventType = event ? event.type : null;
      return "string" == typeof v ? this._open(event, target, v) : (data = v.call(target[0], function(response) {
        if (target.data("ui-tooltip-open")) {
          that._delay(function() {
            if (event) {
              event.type = eventType;
            }
            this._open(event, target, response);
          });
        }
      }), data && this._open(event, target, data), void 0);
    },
    _open : function(event, target, events) {
      /**
       * @param {!Object} element
       * @return {undefined}
       */
      function position(element) {
        /** @type {!Object} */
        parent.of = element;
        if (!tooltip.is(":hidden")) {
          tooltip.position(parent);
        }
      }
      var tooltip;
      var delayedShow;
      var parent = $.extend({}, this.options.position);
      if (events) {
        if (tooltip = this._find(target), tooltip.length) {
          return tooltip.find(".ui-tooltip-content").html(events), void 0;
        }
        if (target.is("[title]")) {
          if (event && "mouseover" === event.type) {
            target.attr("title", "");
          } else {
            target.removeAttr("title");
          }
        }
        tooltip = this._tooltip(target);
        addDescribedBy(target, tooltip.attr("id"));
        tooltip.find(".ui-tooltip-content").html(events);
        if (this.options.track && event && /^mouse/.test(event.type)) {
          this._on(this.document, {
            mousemove : position
          });
          position(event);
        } else {
          tooltip.position($.extend({
            of : target
          }, this.options.position));
        }
        tooltip.hide();
        this._show(tooltip, this.options.show);
        if (this.options.show && this.options.show.delay) {
          /** @type {number} */
          delayedShow = this.delayedShow = setInterval(function() {
            if (tooltip.is(":visible")) {
              position(parent.of);
              clearInterval(delayedShow);
            }
          }, $.fx.interval);
        }
        this._trigger("open", event, {
          tooltip : tooltip
        });
        events = {
          keyup : function(e) {
            if (e.keyCode === $.ui.keyCode.ESCAPE) {
              e = $.Event(e);
              e.currentTarget = target[0];
              this.close(e, true);
            }
          },
          remove : function() {
            this._removeTooltip(tooltip);
          }
        };
        if (!(event && "mouseover" !== event.type)) {
          /** @type {string} */
          events.mouseleave = "close";
        }
        if (!(event && "focusin" !== event.type)) {
          /** @type {string} */
          events.focusout = "close";
        }
        this._on(true, target, events);
      }
    },
    close : function(event) {
      var that = this;
      var target = $(event ? event.currentTarget : this.element);
      var tooltip = this._find(target);
      if (!this.closing) {
        clearInterval(this.delayedShow);
        if (target.data("ui-tooltip-title")) {
          target.attr("title", target.data("ui-tooltip-title"));
        }
        removeDescribedBy(target);
        tooltip.stop(true);
        this._hide(tooltip, this.options.hide, function() {
          that._removeTooltip($(this));
        });
        target.removeData("ui-tooltip-open");
        this._off(target, "mouseleave focusout keyup");
        if (target[0] !== this.element[0]) {
          this._off(target, "remove");
        }
        this._off(this.document, "mousemove");
        if (event && "mouseleave" === event.type) {
          $.each(this.parents, function(k, e) {
            $(e.element).attr("title", e.title);
            delete that.parents[k];
          });
        }
        /** @type {boolean} */
        this.closing = true;
        this._trigger("close", event, {
          tooltip : tooltip
        });
        /** @type {boolean} */
        this.closing = false;
      }
    },
    _tooltip : function(element) {
      /** @type {string} */
      var id = "ui-tooltip-" + increments++;
      var d = $("<div>").attr({
        id : id,
        role : "tooltip"
      }).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content " + (this.options.tooltipClass || ""));
      return $("<div>").addClass("ui-tooltip-content").appendTo(d), d.appendTo(this.document[0].body), this.tooltips[id] = element, d;
    },
    _find : function(target) {
      return (target = target.data("ui-tooltip-id")) ? $("#" + target) : $();
    },
    _removeTooltip : function(tooltip) {
      tooltip.remove();
      delete this.tooltips[tooltip.attr("id")];
    },
    _destroy : function() {
      var msgBase = this;
      $.each(this.tooltips, function(domRootID, target) {
        var e = $.Event("blur");
        e.target = e.currentTarget = target[0];
        msgBase.close(e, true);
        $("#" + domRootID).remove();
        if (target.data("ui-tooltip-title")) {
          target.attr("title", target.data("ui-tooltip-title"));
          target.removeData("ui-tooltip-title");
        }
      });
    }
  });
})(jQuery);
/** @type {function(new:MutationObserver, function((Array<(MutationRecord|null)>|null), (MutationObserver|null)): ?): ?} */
this.MutationObserver = this.MutationObserver || this.WebKitMutationObserver || function(value) {
  /**
   * @param {!Function} callback
   * @return {undefined}
   */
  function MutationObserver(callback) {
    var self = this;
    /** @type {!Array} */
    self._watched = [];
    /**
     * @return {undefined}
     */
    self._checker = function() {
      var owners = self.takeRecords();
      if (owners.length) {
        callback.call(self, owners, self);
      }
      /** @type {number} */
      self._timeout = setTimeout(self._checker, MutationObserver._period);
    };
  }
  /**
   * @param {!Array} data
   * @return {?}
   */
  function MutationRecord(data) {
    var settings = {
      type : null,
      target : null,
      addedNodes : [],
      removedNodes : [],
      previousSibling : null,
      nextSibling : null,
      attributeName : null,
      attributeNamespace : null,
      oldValue : null
    };
    var i;
    for (i in data) {
      if (settings[i] !== value && data[i] !== value) {
        settings[i] = data[i];
      }
    }
    return settings;
  }
  /**
   * @param {!Element} $target
   * @param {!Object} config
   * @return {?}
   */
  function createMutationSearcher($target, config) {
    var $oldstate = clone($target, config);
    return function(mutations) {
      var olen = mutations.length;
      if (config.attr && $oldstate.attr) {
        findAttributeMutations(mutations, $target, $oldstate.attr, config.afilter);
      }
      if (config.kids || config.descendents) {
        searchSubtree(mutations, $target, $oldstate, config);
      }
      if (mutations.length !== olen) {
        $oldstate = clone($target, config);
      }
    };
  }
  /**
   * @param {!Object} mutations
   * @param {!Element} $target
   * @param {!Object} $oldstate
   * @param {!Object} filter
   * @return {undefined}
   */
  function findAttributeMutations(mutations, $target, $oldstate, filter) {
    var processedOptions = {};
    var attributes = $target.attributes;
    var attr;
    var name;
    var i = attributes.length;
    for (; i--;) {
      attr = attributes[i];
      name = attr.name;
      if (!(filter && filter[name] === value)) {
        if (attr.value !== $oldstate[name]) {
          mutations.push(MutationRecord({
            type : "attributes",
            target : $target,
            attributeName : name,
            oldValue : $oldstate[name],
            attributeNamespace : attr.namespaceURI
          }));
        }
        /** @type {boolean} */
        processedOptions[name] = true;
      }
    }
    for (name in $oldstate) {
      if (!processedOptions[name]) {
        mutations.push(MutationRecord({
          target : $target,
          type : "attributes",
          attributeName : name,
          oldValue : $oldstate[name]
        }));
      }
    }
  }
  /**
   * @param {!Object} mutations
   * @param {!Object} $target
   * @param {!Object} $oldstate
   * @param {!Object} config
   * @return {undefined}
   */
  function searchSubtree(mutations, $target, $oldstate, config) {
    /**
     * @param {string} conflicts
     * @param {!Object} node
     * @param {?} $kids
     * @param {?} $oldkids
     * @param {number} numAddedNodes
     * @return {undefined}
     */
    function resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes) {
      /** @type {number} */
      var distance = conflicts.length - 1;
      /** @type {number} */
      numAddedNodes = -~((distance - numAddedNodes) / 2);
      var $cur;
      var oldstruct;
      var conflict;
      for (; conflict = conflicts.pop();) {
        $cur = $kids[conflict.i];
        oldstruct = $oldkids[conflict.j];
        if (config.kids && numAddedNodes && Math.abs(conflict.i - conflict.j) >= distance) {
          mutations.push(MutationRecord({
            type : "childList",
            target : node,
            addedNodes : [$cur],
            removedNodes : [$cur],
            nextSibling : $cur.nextSibling,
            previousSibling : $cur.previousSibling
          }));
          numAddedNodes--;
        }
        if (config.attr && oldstruct.attr) {
          findAttributeMutations(mutations, $cur, oldstruct.attr, config.afilter);
        }
        if (config.charData && 3 === $cur.nodeType && $cur.nodeValue !== oldstruct.charData) {
          mutations.push(MutationRecord({
            type : "characterData",
            target : $cur,
            oldValue : oldstruct.charData
          }));
        }
        if (config.descendents) {
          findMutations($cur, oldstruct);
        }
      }
    }
    /**
     * @param {!Object} node
     * @param {!Object} old
     * @return {undefined}
     */
    function findMutations(node, old) {
      var $kids = node.childNodes;
      var $oldkids = old.kids;
      var klen = $kids.length;
      var olen = $oldkids.length;
      var r;
      var conflicts;
      var oldstruct;
      var idx;
      var $cur;
      var $old;
      /** @type {number} */
      var numAddedNodes = 0;
      /** @type {number} */
      var i = 0;
      /** @type {number} */
      var j = 0;
      for (; i < klen || j < olen;) {
        $cur = $kids[i];
        $old = (oldstruct = $oldkids[j]) && oldstruct.node;
        if ($cur === $old) {
          if (config.attr && oldstruct.attr) {
            findAttributeMutations(mutations, $cur, oldstruct.attr, config.afilter);
          }
          if (config.charData && 3 === $cur.nodeType && $cur.nodeValue !== oldstruct.charData) {
            mutations.push(MutationRecord({
              type : "characterData",
              target : $cur,
              oldValue : oldstruct.charData
            }));
          }
          if (conflicts) {
            resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes);
          }
          if (config.descendents && ($cur.childNodes.length || oldstruct.kids.length)) {
            findMutations($cur, oldstruct);
          }
          i++;
          j++;
        } else {
          if (!r) {
            r = {};
            /** @type {!Array} */
            conflicts = [];
          }
          if ($cur) {
            if (!r[oldstruct = getElementId($cur)]) {
              if (-1 === (idx = indexOf($oldkids, $cur, j, JSCompiler_renameProperty("node")))) {
                if (config.kids) {
                  mutations.push(MutationRecord({
                    type : "childList",
                    target : node,
                    addedNodes : [$cur],
                    nextSibling : $cur.nextSibling,
                    previousSibling : $cur.previousSibling
                  }));
                  numAddedNodes++;
                }
              } else {
                /** @type {boolean} */
                r[oldstruct] = true;
                conflicts.push({
                  i : i,
                  j : idx
                });
              }
            }
            i++;
          }
          if ($old && $old !== $kids[i]) {
            if (!r[oldstruct = getElementId($old)]) {
              if (-1 === (idx = indexOf($kids, $old, i))) {
                if (config.kids) {
                  mutations.push(MutationRecord({
                    type : "childList",
                    target : old.node,
                    removedNodes : [$old],
                    nextSibling : $oldkids[j + 1],
                    previousSibling : $oldkids[j - 1]
                  }));
                  numAddedNodes--;
                }
              } else {
                /** @type {boolean} */
                r[oldstruct] = true;
                conflicts.push({
                  i : idx,
                  j : j
                });
              }
            }
            j++;
          }
        }
      }
      if (conflicts) {
        resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes);
      }
    }
    findMutations($target, $oldstate);
  }
  /**
   * @param {!Node} $target
   * @param {!Object} config
   * @return {?}
   */
  function clone($target, config) {
    /** @type {boolean} */
    var turnServers = true;
    return function copy($target) {
      /** @type {boolean} */
      var immediate = 3 === $target.nodeType;
      var elestruct = {
        node : $target,
        kids : []
      };
      if (8 === $target.nodeType) {
        return elestruct;
      }
      if (config.attr && !immediate && (turnServers || config.descendents)) {
        elestruct.attr = reduce($target.attributes, function(memo, attr) {
          if (!config.afilter || config.afilter[attr.name]) {
            memo[attr.name] = attr.value;
          }
          return memo;
        }, {});
      }
      if (config.charData && immediate) {
        elestruct.charData = $target.nodeValue;
      }
      if ((config.kids || config.charData) && (turnServers || config.descendents) || config.attr && config.descendents) {
        /** @type {boolean} */
        turnServers = false;
        elestruct.kids = map($target.childNodes, copy);
      }
      return elestruct;
    }($target);
  }
  /**
   * @param {!Object} $ele
   * @return {?}
   */
  function getElementId($ele) {
    try {
      return $ele.id || ($ele.mo_id = $ele.mo_id || t++);
    } catch (n) {
      try {
        return $ele.nodeValue;
      } catch (u) {
        return t++;
      }
    }
  }
  /**
   * @param {!NodeList} array
   * @param {!Function} callback
   * @return {?}
   */
  function map(array, callback) {
    /** @type {!Array} */
    var result = [];
    /** @type {number} */
    var i = 0;
    for (; i < array.length; i++) {
      result[i] = callback(array[i], i, array);
    }
    return result;
  }
  /**
   * @param {!NodeList} index
   * @param {!Function} callback
   * @param {?} basis
   * @return {?}
   */
  function reduce(index, callback, basis) {
    if (index) {
      /** @type {number} */
      var i = 0;
      for (; i < index.length; i++) {
        basis = callback(basis, index[i], i, index);
      }
      return basis;
    }
  }
  /**
   * @param {!NodeList} set
   * @param {!Object} item
   * @param {number} idx
   * @param {?} prop
   * @return {?}
   */
  function indexOf(set, item, idx, prop) {
    for (; idx < set.length; idx++) {
      if ((prop ? set[idx][prop] : set[idx]) === item) {
        return idx;
      }
    }
    return -1;
  }
  /**
   * @param {string} a
   * @return {?}
   */
  function JSCompiler_renameProperty(a) {
    return a;
  }
  /** @type {number} */
  MutationObserver._period = 30;
  MutationObserver.prototype = {
    observe : function($target, config) {
      var settings = {
        attr : !!(config.attributes || config.attributeFilter || config.attributeOldValue),
        kids : !!config.childList,
        descendents : !!config.subtree,
        charData : !(!config.characterData && !config.characterDataOldValue)
      };
      var watched = this._watched;
      /** @type {number} */
      var i = 0;
      for (; i < watched.length; i++) {
        if (watched[i].tar === $target) {
          watched.splice(i, 1);
        }
      }
      if (config.attributeFilter) {
        settings.afilter = reduce(config.attributeFilter, function(value, subel) {
          /** @type {boolean} */
          value[subel] = true;
          return value;
        }, {});
      }
      watched.push({
        tar : $target,
        fn : createMutationSearcher($target, settings)
      });
      if (!this._timeout) {
        this._checker();
      }
    },
    takeRecords : function() {
      /** @type {!Array} */
      var mutations = [];
      var watched = this._watched;
      /** @type {number} */
      var i = 0;
      for (; i < watched.length; i++) {
        watched[i].fn(mutations);
      }
      return mutations;
    },
    disconnect : function() {
      /** @type {!Array} */
      this._watched = [];
      clearTimeout(this._timeout);
      /** @type {null} */
      this._timeout = null;
    }
  };
  /** @type {number} */
  var t = 1;
  return MutationObserver;
}();
var MODETECT = MODETECT || {};
MODETECT.device = function() {
  /**
   * @param {!RegExp} keys
   * @param {string} key
   * @return {?}
   */
  function _testIt(keys, key) {
    return keys.test(window.navigator[key]);
  }
  /**
   * @param {!Object} i
   * @param {!Object} value
   * @param {string} undefined
   * @return {?}
   */
  function match(i, value, undefined) {
    i = i.exec(window.navigator.userAgent);
    if (null === i) {
      return false;
    }
    /** @type {number} */
    i = parseInt(i[1], 10);
    return "match" === undefined && i === value ? true : "greaterThan" === undefined && i > value ? true : "lessThan" === undefined && i < value ? true : false;
  }
  /**
   * @param {?} patterns
   * @param {string} obj
   * @return {?}
   */
  function filter(patterns, obj) {
    return match(/Android\s(\d+\.\d+)/i, patterns, obj);
  }
  var device = {
    phone : false,
    tablet : false
  };
  /** @type {boolean} */
  device.iphone = _testIt(/iPhone/i, "platform") || _testIt(/iPhone/i, "userAgent") ? true : false;
  if (device.iphone) {
    /** @type {boolean} */
    device.phone = true;
  }
  /** @type {boolean} */
  device.ipad = _testIt(/iPad/i, "platform") || _testIt(/iPad/i, "userAgent") ? true : false;
  if (device.ipad) {
    /** @type {boolean} */
    device.tablet = true;
  }
  /** @type {boolean} */
  device.ipod = _testIt(/iPod/i, "platform") || _testIt(/iPod/i, "userAgent") ? true : false;
  if (device.ipod) {
    /** @type {boolean} */
    device.phone = true;
  }
  device.android = _testIt(/Android/i, "userAgent");
  if (device.android) {
    if (filter(3, "match")) {
      /** @type {boolean} */
      device.tablet = true;
    } else {
      if (_testIt(/Mobile/i, "userAgent")) {
        /** @type {boolean} */
        device.phone = true;
      } else {
        /** @type {boolean} */
        device.tablet = true;
      }
    }
  }
  /** @type {boolean} */
  device.blackberry = _testIt(/Blackberry/i, "userAgent") && _testIt(/Mobile/i, "userAgent") ? true : false;
  if (device.blackberry) {
    /** @type {boolean} */
    device.phone = true;
  }
  device.blackberryplaybook = _testIt(/RIM\sTablet/i, "userAgent");
  if (device.blackberryplaybook) {
    /** @type {boolean} */
    device.tablet = true;
  }
  device.windowsphone = _testIt(/Windows\sPhone/i, "userAgent");
  if (device.windowsphone) {
    /** @type {boolean} */
    device.phone = true;
  }
  device.kindlefire = _testIt(/Silk/i, "userAgent");
  if (device.kindlefire) {
    /** @type {boolean} */
    device.tablet = true;
  }
  /** @type {boolean} */
  device.othermobile = device.phone || device.tablet || device.ipod ? false : 320 >= Math.min(screen.width, screen.height) / ("devicePixelRatio" in window ? window.devicePixelRatio : 1) ? true : false;
  if (device.othermobile) {
    /** @type {boolean} */
    device.phone = true;
  }
  /** @type {boolean} */
  device.desktop = device.phone || device.tablet || device.ipod ? false : true;
  /**
   * @param {!Object} message
   * @param {string} context
   * @return {?}
   */
  device.testIOSVersion = function(message, context) {
    return match(/OS (\d+)_(\d+)_?(\d+)?/, message, context);
  };
  /** @type {function(?, string): ?} */
  device.testAndroidVersion = filter;
  return device;
}();
if ("object" !== typeof JSON) {
  JSON = {};
}
(function() {
  /**
   * @param {number} y1
   * @return {?}
   */
  function b$jscomp$237(y1) {
    return 10 > y1 ? "0" + y1 : y1;
  }
  /**
   * @param {string} s
   * @return {?}
   */
  function a$jscomp$605(s) {
    /** @type {number} */
    d$jscomp$199.lastIndex = 0;
    return d$jscomp$199.test(s) ? '"' + s.replace(d$jscomp$199, function(name) {
      var s = h$jscomp$103[name];
      return "string" === typeof s ? s : "\\u" + ("0000" + name.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + s + '"';
  }
  /**
   * @param {number} i
   * @param {string} m
   * @return {?}
   */
  function f$jscomp$173(i, m) {
    var v;
    var l;
    var exception = e$jscomp$231;
    var result;
    var value = m[i];
    if (value && "object" === typeof value && "function" === typeof value.toJSON) {
      value = value.toJSON(i);
    }
    if ("function" === typeof k$jscomp$50) {
      value = k$jscomp$50.call(m, i, value);
    }
    switch(typeof value) {
      case "string":
        return a$jscomp$605(value);
      case "number":
        return isFinite(value) ? String(value) : "null";
      case "boolean":
      case "null":
        return String(value);
      case "object":
        if (!value) {
          return "null";
        }
        e$jscomp$231 = e$jscomp$231 + g$jscomp$131;
        /** @type {!Array} */
        result = [];
        if ("[object Array]" === Object.prototype.toString.apply(value)) {
          l = value.length;
          /** @type {number} */
          i = 0;
          for (; i < l; i = i + 1) {
            result[i] = f$jscomp$173(i, value) || "null";
          }
          /** @type {string} */
          m = 0 === result.length ? "[]" : e$jscomp$231 ? "[\n" + e$jscomp$231 + result.join(",\n" + e$jscomp$231) + "\n" + exception + "]" : "[" + result.join(",") + "]";
          e$jscomp$231 = exception;
          return m;
        }
        if (k$jscomp$50 && "object" === typeof k$jscomp$50) {
          l = k$jscomp$50.length;
          /** @type {number} */
          i = 0;
          for (; i < l; i = i + 1) {
            if ("string" === typeof k$jscomp$50[i]) {
              v = k$jscomp$50[i];
              if (m = f$jscomp$173(v, value)) {
                result.push(a$jscomp$605(v) + (e$jscomp$231 ? ": " : ":") + m);
              }
            }
          }
        } else {
          for (v in value) {
            if (Object.prototype.hasOwnProperty.call(value, v) && (m = f$jscomp$173(v, value))) {
              result.push(a$jscomp$605(v) + (e$jscomp$231 ? ": " : ":") + m);
            }
          }
        }
        /** @type {string} */
        m = 0 === result.length ? "{}" : e$jscomp$231 ? "{\n" + e$jscomp$231 + result.join(",\n" + e$jscomp$231) + "\n" + exception + "}" : "{" + result.join(",") + "}";
        e$jscomp$231 = exception;
        return m;
    }
  }
  if ("function" !== typeof Date.prototype.toJSON) {
    /**
     * @param {*=} p0
     * @return {string}
     */
    Date.prototype.toJSON = function() {
      return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + b$jscomp$237(this.getUTCMonth() + 1) + "-" + b$jscomp$237(this.getUTCDate()) + "T" + b$jscomp$237(this.getUTCHours()) + ":" + b$jscomp$237(this.getUTCMinutes()) + ":" + b$jscomp$237(this.getUTCSeconds()) + "Z" : null;
    };
    /** @type {function(this:Boolean, string=): *} */
    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
      return this.valueOf();
    };
  }
  /** @type {!RegExp} */
  var c$jscomp$330 = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  /** @type {!RegExp} */
  var d$jscomp$199 = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var e$jscomp$231;
  var g$jscomp$131;
  var h$jscomp$103 = {
    "\b" : "\\b",
    "\t" : "\\t",
    "\n" : "\\n",
    "\f" : "\\f",
    "\r" : "\\r",
    '"' : '\\"',
    "\\" : "\\\\"
  };
  var k$jscomp$50;
  if ("function" !== typeof JSON.stringify) {
    /**
     * @param {*} o
     * @param {(Array<string>|function(string, *): *|null)=} parent
     * @param {(number|string)=} x
     * @return {string}
     */
    JSON.stringify = function(o, parent, x) {
      var max_x;
      /** @type {string} */
      g$jscomp$131 = e$jscomp$231 = "";
      if ("number" === typeof x) {
        /** @type {number} */
        max_x = 0;
        for (; max_x < x; max_x = max_x + 1) {
          /** @type {string} */
          g$jscomp$131 = g$jscomp$131 + " ";
        }
      } else {
        if ("string" === typeof x) {
          /** @type {string} */
          g$jscomp$131 = x;
        }
      }
      if ((k$jscomp$50 = parent) && "function" !== typeof parent && ("object" !== typeof parent || "number" !== typeof parent.length)) {
        throw Error("JSON.stringify");
      }
      return f$jscomp$173("", {
        "" : o
      });
    };
  }
  if ("function" !== typeof JSON.parse) {
    /**
     * @param {string} a$jscomp$610
     * @param {function(string, *): *=} b$jscomp$241
     * @return {*}
     */
    JSON.parse = function(a$jscomp$610, b$jscomp$241) {
      /**
       * @param {!Object} a
       * @param {string} n
       * @return {?}
       */
      function e$jscomp$232(a, n) {
        var i;
        var d;
        var val = a[n];
        if (val && "object" === typeof val) {
          for (i in val) {
            if (Object.prototype.hasOwnProperty.call(val, i)) {
              d = e$jscomp$232(val, i);
              if (void 0 !== d) {
                val[i] = d;
              } else {
                delete val[i];
              }
            }
          }
        }
        return b$jscomp$241.call(a, n, val);
      }
      /** @type {string} */
      a$jscomp$610 = String(a$jscomp$610);
      /** @type {number} */
      c$jscomp$330.lastIndex = 0;
      if (c$jscomp$330.test(a$jscomp$610)) {
        /** @type {string} */
        a$jscomp$610 = a$jscomp$610.replace(c$jscomp$330, function(strUtf8) {
          return "\\u" + ("0000" + strUtf8.charCodeAt(0).toString(16)).slice(-4);
        });
      }
      if (/^[\],:{}\s]*$/.test(a$jscomp$610.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
        return a$jscomp$610 = eval("(" + a$jscomp$610 + ")"), "function" === typeof b$jscomp$241 ? e$jscomp$232({
          "" : a$jscomp$610
        }, "") : a$jscomp$610;
      }
      throw new SyntaxError("JSON.parse");
    };
  }
})();
(function(factory) {
  factory(window.jQuery, window, document);
})(function($, window, where, undefined) {
  $.widget("selectBox.selectBoxIt", {
    VERSION : "3.8.1",
    options : {
      showEffect : "none",
      showEffectOptions : {},
      showEffectSpeed : "medium",
      hideEffect : "none",
      hideEffectOptions : {},
      hideEffectSpeed : "medium",
      showFirstOption : true,
      defaultText : "",
      defaultIcon : "",
      downArrowIcon : "",
      theme : "default",
      keydownOpen : true,
      isMobile : function() {
        return /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/.test(navigator.userAgent || navigator.vendor || window.opera);
      },
      "native" : false,
      aggressiveChange : false,
      selectWhenHidden : true,
      viewport : $(window),
      similarSearch : false,
      copyAttributes : ["title", "rel"],
      copyClasses : "button",
      nativeMousedown : false,
      customShowHideEvent : false,
      autoWidth : true,
      html : true,
      populate : "",
      dynamicPositioning : true,
      hideCurrent : false,
      placeAfterSelect : true,
      dropdownHiddenClass : ""
    },
    getThemes : function() {
      var theme = $(this.element).attr("data-theme") || "c";
      return {
        bootstrap : {
          focus : "active",
          hover : "",
          enabled : "enabled",
          disabled : "disabled",
          arrow : "caret",
          button : "btn",
          list : "dropdown-menu",
          container : "bootstrap",
          open : "open"
        },
        jqueryui : {
          focus : "ui-state-focus",
          hover : "ui-state-hover",
          enabled : "ui-state-enabled",
          disabled : "ui-state-disabled",
          arrow : "ui-icon ui-icon-triangle-1-s",
          button : "ui-widget ui-state-default",
          list : "ui-widget ui-widget-content",
          container : "jqueryui",
          open : "selectboxit-open"
        },
        jquerymobile : {
          focus : "ui-btn-down-" + theme,
          hover : "ui-btn-hover-" + theme,
          enabled : "ui-enabled",
          disabled : "ui-disabled",
          arrow : "ui-icon ui-icon-arrow-d ui-icon-shadow",
          button : "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" + theme,
          list : "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" + theme,
          container : "jquerymobile",
          open : "selectboxit-open"
        },
        "default" : {
          focus : "selectboxit-focus",
          hover : "selectboxit-hover",
          enabled : "selectboxit-enabled",
          disabled : "selectboxit-disabled",
          arrow : "selectboxit-default-arrow",
          button : "selectboxit-btn",
          list : "selectboxit-list",
          container : "selectboxit-container",
          open : "selectboxit-open"
        }
      };
    },
    isDeferred : function(def) {
      return $.isPlainObject(def) && def.promise && def.done;
    },
    _create : function(name) {
      var pop = this.options.populate;
      var style = this.options.theme;
      if (this.element.is("select")) {
        return this.widgetProto = $.Widget.prototype, this.originalElem = this.element[0], this.selectBox = this.element, this.options.populate && this.add && !name && this.add(pop), this.selectItems = this.element.find("option"), this.firstSelectItem = this.selectItems.slice(0, 1), this.documentHeight = $(where).height(), this.theme = $.isPlainObject(style) ? $.extend({}, this.getThemes()["default"], style) : this.getThemes()[style] ? this.getThemes()[style] : this.getThemes()["default"], this.currentFocus = 
        0, this.blur = true, this.textArray = [], this.currentIndex = 0, this.currentText = "", this.flipped = false, name || (this.selectBoxStyles = this.selectBox.attr("style")), this._createDropdownButton()._createUnorderedList()._copyAttributes()._replaceSelectBox()._addClasses(this.theme)._eventHandlers(), this.originalElem.disabled && this.disable && this.disable(), this._ariaAccessibility && this._ariaAccessibility(), this.isMobile = this.options.isMobile(), this._mobile && this._mobile(), 
        this.options["native"] && this._applyNativeSelect(), this.triggerEvent("create"), this;
      }
    },
    _createDropdownButton : function() {
      var originalElemId = this.originalElemId = this.originalElem.id || "";
      var c = this.originalElemValue = this.originalElem.value || "";
      var sel_construtor_name = this.originalElemName = this.originalElem.name || "";
      var prev = this.options.copyClasses;
      var selected = this.selectBox.attr("class") || "";
      this.dropdownText = $("<span/>", {
        id : originalElemId && originalElemId + "SelectBoxItText",
        "class" : "selectboxit-text",
        unselectable : "on",
        text : this.firstSelectItem.text()
      }).attr("data-val", c);
      this.dropdownImageContainer = $("<span/>", {
        "class" : "selectboxit-option-icon-container"
      });
      this.dropdownImage = $("<i/>", {
        id : originalElemId && originalElemId + "SelectBoxItDefaultIcon",
        "class" : "selectboxit-default-icon",
        unselectable : "on"
      });
      this.dropdown = $("<span/>", {
        id : originalElemId && originalElemId + "SelectBoxIt",
        "class" : "selectboxit " + ("button" === prev ? selected : "") + " " + (this.selectBox.prop("disabled") ? this.theme.disabled : this.theme.enabled),
        name : sel_construtor_name,
        tabindex : this.selectBox.attr("tabindex") || "0",
        unselectable : "on"
      }).append(this.dropdownImageContainer.append(this.dropdownImage)).append(this.dropdownText);
      this.dropdownContainer = $("<span/>", {
        id : originalElemId && originalElemId + "SelectBoxItContainer",
        "aria-label" : this.firstSelectItem.text(),
        "class" : "selectboxit-container " + this.theme.container + " " + ("container" === prev ? selected : "")
      }).append(this.dropdown);
      return this;
    },
    _createUnorderedList : function() {
      var self = this;
      var dataDisabled;
      var optgroupClass;
      var title;
      var getextensions;
      var excludedName;
      var desc;
      var view;
      var resizewidth;
      /** @type {string} */
      var value = "";
      var originalElemId = self.originalElemId || "";
      originalElemId = $("<ul/>", {
        id : originalElemId && originalElemId + "SelectBoxItOptions",
        "aria-labelledby" : originalElemId && originalElemId + "SelectBoxIt",
        "class" : "selectboxit-options",
        tabindex : -1
      });
      var currentDataSelectedText;
      var currentDataText;
      var currentDataSearch;
      var currentText;
      var currentOption;
      var $el;
      if (!self.options.showFirstOption) {
        self.selectItems.first().attr("disabled", "disabled");
        self.selectItems = self.selectBox.find("option").slice(1);
      }
      self.selectItems.each(function(index) {
        currentOption = $(this);
        /** @type {string} */
        title = optgroupClass = "";
        dataDisabled = currentOption.prop("disabled");
        /** @type {string} */
        getextensions = "";
        if (currentOption.attr("data-htmlcolor")) {
          getextensions = currentOption.attr("data-htmlcolor") || "";
        }
        excludedName = currentOption.attr("data-icon") || "";
        /** @type {string} */
        view = (desc = currentOption.attr("data-iconurl") || "") ? "selectboxit-option-icon-url" : "";
        /** @type {string} */
        resizewidth = "";
        if (getextensions) {
          /** @type {string} */
          resizewidth = 'style="background-color:' + getextensions + ';"';
        } else {
          if (desc) {
            /** @type {string} */
            resizewidth = "style=\"background-image:url('" + desc + "');\"";
          }
        }
        currentDataSelectedText = currentOption.attr("data-selectedtext");
        currentText = (currentDataText = currentOption.attr("data-text")) ? currentDataText : currentOption.text();
        $el = currentOption.parent();
        if ($el.is("optgroup")) {
          /** @type {string} */
          optgroupClass = "selectboxit-optgroup-option";
          if (0 === currentOption.index()) {
            /** @type {string} */
            title = '<span class="selectboxit-optgroup-header ' + $el.first().attr("class") + '"data-disabled="true">' + $el.first().attr("label") + "</span>";
          }
        }
        currentOption.attr("value", this.value);
        value = value + (title + '<li data-id="' + index + '" data-val="' + this.value + '" data-disabled="' + dataDisabled + '" class="' + optgroupClass + " selectboxit-option " + ($(this).attr("class") || "") + '"><a class="selectboxit-option-anchor" aria-label="' + (self.options.html ? currentText : self.htmlEscape(currentText)) + '"><span class="selectboxit-option-icon-container"><i class="selectboxit-option-icon ' + excludedName + " " + (view || self.theme.container) + '"' + resizewidth + "></i></span>" + 
        (self.options.html ? currentText : self.htmlEscape(currentText)) + "</a></li>");
        currentDataSearch = currentOption.attr("data-search");
        self.textArray[index] = dataDisabled ? "" : currentDataSearch ? currentDataSearch : currentText;
        if (this.selected) {
          self._setText(self.dropdownText, currentDataSelectedText || currentText);
          /** @type {number} */
          self.currentFocus = index;
        }
      });
      if (self.options.defaultText || self.selectBox.attr("data-text")) {
        var currentText = self.options.defaultText || self.selectBox.attr("data-text");
        self._setText(self.dropdownText, currentText);
        self.options.defaultText = currentText;
      }
      originalElemId.append(value);
      self.list = originalElemId;
      self.dropdownContainer.append(self.list);
      self.listItems = self.list.children("li");
      self.listAnchors = self.list.find("a");
      self.listItems.first().addClass("selectboxit-option-first");
      self.listItems.last().addClass("selectboxit-option-last");
      self.list.find("li[data-disabled='true']").not(".optgroupHeader").addClass(self.theme.disabled);
      self.dropdownImage.addClass(self.selectBox.attr("data-icon") || self.options.defaultIcon || self.listItems.eq(self.currentFocus).find("i").attr("class"));
      self.dropdownImage.attr("style", self.listItems.eq(self.currentFocus).find("i").attr("style"));
      return self;
    },
    _replaceSelectBox : function() {
      var originalElemId = this.originalElem.id || "";
      var size = this.selectBox.attr("data-size");
      /** @type {(number|string)} */
      size = this.listSize = size === undefined ? "auto" : "0" === size ? "auto" : +size;
      var FOLD_SIZE;
      if (this.options.dropdownHiddenClass) {
        if (!this.selectBox.hasClass(this.options.dropdownHiddenClass)) {
          this.selectBox.addClass(this.options.dropdownHiddenClass);
        }
      } else {
        this.selectBox.css("display", "none");
      }
      this.selectBox.after(this.dropdownContainer);
      this.dropdownContainer.appendTo("body").addClass("selectboxit-rendering");
      this.selectBox[this.options.placeAfterSelect ? "after" : "before"](this.dropdownContainer);
      this.dropdown.height();
      this.downArrow = $("<i/>", {
        id : originalElemId && originalElemId + "SelectBoxItArrow",
        "class" : "selectboxit-arrow",
        unselectable : "on"
      });
      this.downArrowContainer = $("<span/>", {
        id : originalElemId && originalElemId + "SelectBoxItArrowContainer",
        "class" : "selectboxit-arrow-container",
        unselectable : "on"
      }).append(this.downArrow);
      this.dropdown.append(this.downArrowContainer);
      this.listItems.removeClass("selectboxit-selected").eq(this.currentFocus).addClass("selectboxit-selected");
      originalElemId = this.downArrowContainer.outerWidth(true);
      FOLD_SIZE = this.dropdownImage.outerWidth(true);
      if (this.options.autoWidth) {
        this.dropdown.css({
          width : "auto"
        }).css({
          width : this.list.outerWidth(true) + originalElemId + FOLD_SIZE
        });
        this.list.css({
          "min-width" : this.dropdown.width()
        });
      }
      this.dropdownText.css({
        "max-width" : this.dropdownContainer.outerWidth(true) - (originalElemId + FOLD_SIZE)
      });
      this.dropdownContainer.removeClass("selectboxit-rendering");
      if ("number" === $.type(size)) {
        /** @type {number} */
        this.maxHeight = this.listAnchors.outerHeight(true) * size;
      }
      return this;
    },
    _scrollToView : function(direction) {
      var b = this.listItems.eq(this.currentFocus);
      var listScrollTop = this.list.scrollTop();
      var t = b.height();
      b = b.position().top;
      /** @type {number} */
      var y = Math.abs(b);
      var r = this.list.height();
      if ("search" === direction) {
        if (r - b < t) {
          this.list.scrollTop(listScrollTop + (b - (r - t)));
        } else {
          if (-1 > b) {
            this.list.scrollTop(b - t);
          }
        }
      } else {
        if ("up" === direction) {
          if (-1 > b) {
            this.list.scrollTop(listScrollTop - y);
          }
        } else {
          if ("down" === direction && r - b < t) {
            this.list.scrollTop(listScrollTop + (y - r + t));
          }
        }
      }
      return this;
    },
    _callbackSupport : function(callback) {
      if ($.isFunction(callback)) {
        callback.call(this, this.dropdown);
      }
      return this;
    },
    _setText : function(value, element) {
      if (this.options.html) {
        value.html(element);
      } else {
        value.text(element);
      }
      return this;
    },
    open : function(name) {
      var self = this;
      var c = self.options.showEffect;
      var data = self.options.showEffectSpeed;
      var inputValue = self.options.showEffectOptions;
      var isNative = self.options["native"];
      var isMobile = self.isMobile;
      if (!self.listItems.length || self.dropdown.hasClass(self.theme.disabled)) {
        return self;
      }
      if (!isNative && !isMobile && !this.list.is(":visible")) {
        self.triggerEvent("open");
        if (self._dynamicPositioning && self.options.dynamicPositioning) {
          self._dynamicPositioning();
        }
        if ("none" === c) {
          self.list.show();
        } else {
          if ("show" === c || "slideDown" === c || "fadeIn" === c) {
            self.list[c](data);
          } else {
            self.list.show(c, inputValue, data);
          }
        }
        self.list.promise().done(function() {
          self._scrollToView("search");
          self.triggerEvent("opened");
        });
      }
      self._callbackSupport(name);
      return self;
    },
    close : function(callback) {
      var self = this;
      var name = self.options.hideEffect;
      var value = self.options.hideEffectSpeed;
      var TAG = self.options.hideEffectOptions;
      var isMobile = self.isMobile;
      if (!self.options["native"] && !isMobile && self.list.is(":visible")) {
        self.triggerEvent("close");
        if ("none" === name) {
          self.list.hide();
        } else {
          if ("hide" === name || "slideUp" === name || "fadeOut" === name) {
            self.list[name](value);
          } else {
            self.list.hide(name, TAG, value);
          }
        }
        self.list.promise().done(function() {
          self.triggerEvent("closed");
        });
      }
      self._callbackSupport(callback);
      return self;
    },
    toggle : function() {
      var a = this.list.is(":visible");
      if (a) {
        this.close();
      } else {
        if (!a) {
          this.open();
        }
      }
    },
    _keyMappings : {
      38 : "up",
      40 : "down",
      13 : "enter",
      8 : "backspace",
      9 : "tab",
      32 : "space",
      27 : "esc"
    },
    _keydownMethods : function() {
      var self = this;
      var moveToOption = self.list.is(":visible") || !self.options.keydownOpen;
      return {
        down : function() {
          if (self.moveDown && moveToOption) {
            self.moveDown();
          }
        },
        up : function() {
          if (self.moveUp && moveToOption) {
            self.moveUp();
          }
        },
        enter : function() {
          var data = self.listItems.eq(self.currentFocus);
          self._update(data);
          if ("true" !== data.attr("data-preventclose")) {
            self.close();
          }
          self.triggerEvent("enter");
        },
        tab : function() {
          self.triggerEvent("tab-blur");
          self.close();
        },
        backspace : function() {
          self.triggerEvent("backspace");
        },
        esc : function() {
          self.close();
        }
      };
    },
    _eventHandlers : function() {
      var self = this;
      var c = self.options.nativeMousedown;
      var d = self.options.customShowHideEvent;
      var currentDataText;
      var currentText;
      var focusClass = self.focusClass;
      var hoverClass = self.hoverClass;
      var openClass = self.openClass;
      this.dropdown.on({
        "click.selectBoxIt" : function() {
          self.dropdown.trigger("focus", true);
          if (!self.originalElem.disabled) {
            self.triggerEvent("click");
            if (!(c || d)) {
              self.toggle();
            }
          }
        },
        "mousedown.selectBoxIt" : function() {
          $(this).data("mdown", true);
          self.triggerEvent("mousedown");
          if (c && !d) {
            self.toggle();
          }
        },
        "mouseup.selectBoxIt" : function() {
          self.triggerEvent("mouseup");
        },
        "blur.selectBoxIt" : function() {
          if (self.blur) {
            self.triggerEvent("blur");
            self.close();
            $(this).removeClass(focusClass);
          }
        },
        "focus.selectBoxIt" : function(beforeZero, afterZero) {
          beforeZero = $(this).data("mdown");
          $(this).removeData("mdown");
          if (!(beforeZero || afterZero)) {
            setTimeout(function() {
              self.triggerEvent("tab-focus");
            }, 0);
          }
          if (!afterZero) {
            if (!$(this).hasClass(self.theme.disabled)) {
              $(this).addClass(focusClass);
            }
            self.triggerEvent("focus");
          }
        },
        "keydown.selectBoxIt" : function(e) {
          var direction = self._keyMappings[e.keyCode];
          var num = self._keydownMethods()[direction];
          if (num) {
            num();
            if (!(!self.options.keydownOpen || "up" !== direction && "down" !== direction)) {
              self.open();
            }
          }
          if (num && "tab" !== direction) {
            e.preventDefault();
          }
        },
        "keypress.selectBoxIt" : function(e) {
          var tab = self._keyMappings[e.charCode || e.keyCode];
          /** @type {string} */
          var event = String.fromCharCode(e.charCode || e.keyCode);
          if (self.search && (!tab || tab && "space" === tab)) {
            self.search(event, true, true);
          }
          if ("space" === tab) {
            e.preventDefault();
          }
        },
        "mouseenter.selectBoxIt" : function() {
          self.triggerEvent("mouseenter");
        },
        "mouseleave.selectBoxIt" : function() {
          self.triggerEvent("mouseleave");
        }
      });
      self.list.on({
        "mouseover.selectBoxIt" : function() {
          /** @type {boolean} */
          self.blur = false;
        },
        "mouseout.selectBoxIt" : function() {
          /** @type {boolean} */
          self.blur = true;
        },
        "focusin.selectBoxIt" : function() {
          self.dropdown.trigger("focus", true);
        }
      });
      self.list.on({
        "mousedown.selectBoxIt" : function() {
          self._update($(this));
          self.triggerEvent("option-click");
          if ("false" === $(this).attr("data-disabled") && "true" !== $(this).attr("data-preventclose")) {
            self.close();
          }
          setTimeout(function() {
            self.dropdown.trigger("focus", true);
          }, 0);
        },
        "focusin.selectBoxIt" : function() {
          self.listItems.not($(this)).removeAttr("data-active");
          $(this).attr("data-active", "");
          var c = self.list.is(":hidden");
          if (self.options.searchWhenHidden && c || self.options.aggressiveChange || c && self.options.selectWhenHidden) {
            self._update($(this));
          }
          $(this).addClass(focusClass);
        },
        "mouseup.selectBoxIt" : function() {
          if (c && !d) {
            self._update($(this));
            self.triggerEvent("option-mouseup");
            if ("false" === $(this).attr("data-disabled") && "true" !== $(this).attr("data-preventclose")) {
              self.close();
            }
          }
        },
        "mouseenter.selectBoxIt" : function() {
          if ("false" === $(this).attr("data-disabled")) {
            self.listItems.removeAttr("data-active");
            $(this).addClass(focusClass).attr("data-active", "");
            self.listItems.not($(this)).removeClass(focusClass);
            $(this).addClass(focusClass);
            /** @type {number} */
            self.currentFocus = +$(this).attr("data-id");
          }
        },
        "mouseleave.selectBoxIt" : function() {
          if ("false" === $(this).attr("data-disabled")) {
            self.listItems.not($(this)).removeClass(focusClass).removeAttr("data-active");
            $(this).addClass(focusClass);
            /** @type {number} */
            self.currentFocus = +$(this).attr("data-id");
          }
        },
        "blur.selectBoxIt" : function() {
          $(this).removeClass(focusClass);
        }
      }, ".selectboxit-option");
      self.list.on({
        "click.selectBoxIt" : function(event) {
          event.preventDefault();
        }
      }, "a");
      self.selectBox.on({
        "change.selectBoxIt, internal-change.selectBoxIt" : function(currentOption, currentDataSelectedText) {
          if (!currentDataSelectedText) {
            currentOption = self.list.find('li[data-val="' + self.originalElem.value + '"]');
            if (currentOption.length) {
              self.listItems.eq(self.currentFocus).removeClass(self.focusClass);
              /** @type {number} */
              self.currentFocus = +currentOption.attr("data-id");
            }
          }
          currentOption = self.listItems.eq(self.currentFocus);
          currentDataSelectedText = currentOption.attr("data-selectedtext");
          currentText = (currentDataText = currentOption.attr("data-text")) ? currentDataText : currentOption.find("a").text();
          self._setText(self.dropdownText, currentDataSelectedText || currentText);
          self.dropdownText.attr("data-val", self.originalElem.value);
          if (currentOption.find("i").attr("class")) {
            self.dropdownImage.attr("class", currentOption.find("i").attr("class")).addClass("selectboxit-default-icon");
            self.dropdownImage.attr("style", currentOption.find("i").attr("style"));
          }
          self.triggerEvent("changed");
        },
        "disable.selectBoxIt" : function() {
          self.dropdown.addClass(self.theme.disabled);
        },
        "enable.selectBoxIt" : function() {
          self.dropdown.removeClass(self.theme.disabled);
        },
        "open.selectBoxIt" : function() {
          var $li = self.list.find('li[data-val="' + self.dropdownText.attr("data-val") + '"]');
          if (!$li.length) {
            $li = self.listItems.not("[data-disabled=true]").first();
          }
          /** @type {number} */
          self.currentFocus = +$li.attr("data-id");
          $li = self.listItems.eq(self.currentFocus);
          self.dropdown.addClass(openClass).removeClass(hoverClass).addClass(focusClass);
          self.listItems.removeClass(self.selectedClass).removeAttr("data-active").not($li).removeClass(focusClass);
          $li.addClass(self.selectedClass).addClass(focusClass);
          if (self.options.hideCurrent) {
            self.listItems.show();
            $li.hide();
          }
        },
        "close.selectBoxIt" : function() {
          self.dropdown.removeClass(openClass);
        },
        "blur.selectBoxIt" : function() {
          self.dropdown.removeClass(focusClass);
        },
        "mouseenter.selectBoxIt" : function() {
          if (!$(this).hasClass(self.theme.disabled)) {
            self.dropdown.addClass(hoverClass);
          }
        },
        "mouseleave.selectBoxIt" : function() {
          self.dropdown.removeClass(hoverClass);
        },
        destroy : function(event) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
      return self;
    },
    _update : function(elem) {
      var currentDataText;
      var attrs = this.options.defaultText || this.selectBox.attr("data-text");
      var sel = this.listItems.eq(this.currentFocus);
      if ("false" === elem.attr("data-disabled")) {
        this.listItems.eq(this.currentFocus).attr("data-selectedtext");
        if (!(currentDataText = sel.attr("data-text"))) {
          sel.text();
        }
        if ((attrs && this.options.html ? this.dropdownText.html() === attrs : this.dropdownText.text() === attrs) && this.selectBox.val() === elem.attr("data-val")) {
          this.triggerEvent("change");
        } else {
          this.selectBox.val(elem.attr("data-val"));
          /** @type {number} */
          this.currentFocus = +elem.attr("data-id");
          if (this.originalElem.value !== this.dropdownText.attr("data-val")) {
            this.triggerEvent("change");
          }
        }
      }
    },
    _addClasses : function(el) {
      this.focusClass = el.focus;
      this.hoverClass = el.hover;
      var path = el.button;
      var list = el.list;
      var node = el.arrow;
      var className = el.container;
      this.openClass = el.open;
      /** @type {string} */
      this.selectedClass = "selectboxit-selected";
      this.downArrow.addClass(this.selectBox.attr("data-downarrow") || this.options.downArrowIcon || node);
      this.dropdownContainer.addClass(className);
      this.dropdown.addClass(path);
      this.list.addClass(list);
      return this;
    },
    refresh : function(callback, retryCount) {
      this._destroySelectBoxIt()._create(true);
      if (!retryCount) {
        this.triggerEvent("refresh");
      }
      this._callbackSupport(callback);
      return this;
    },
    htmlEscape : function(text) {
      return String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
    triggerEvent : function(eventName) {
      this.selectBox.trigger(eventName, {
        selectbox : this.selectBox,
        selectboxOption : this.selectItems.eq(this.options.showFirstOption ? this.currentFocus : 0 <= this.currentFocus - 1 ? this.currentFocus : 0),
        dropdown : this.dropdown,
        dropdownOption : this.listItems.eq(this.currentFocus)
      });
      return this;
    },
    _copyAttributes : function() {
      if (this._addSelectBoxAttributes) {
        this._addSelectBoxAttributes();
      }
      return this;
    },
    _realOuterWidth : function(elem) {
      if (elem.is(":visible")) {
        return elem.outerWidth(true);
      }
      elem = elem.clone();
      var outerWidth;
      elem.css({
        visibility : "hidden",
        display : "block",
        position : "absolute"
      }).appendTo("body");
      outerWidth = elem.outerWidth(true);
      elem.remove();
      return outerWidth;
    }
  });
  var selectBoxIt = $.selectBox.selectBoxIt.prototype;
  /**
   * @return {?}
   */
  selectBoxIt._ariaAccessibility = function() {
    var self = this;
    var c = $("label[for='" + self.originalElem.id + "']");
    self.dropdownContainer.attr({
      role : "combobox",
      "aria-autocomplete" : "list",
      "aria-haspopup" : "true",
      "aria-expanded" : "false",
      "aria-owns" : self.list[0].id
    });
    self.dropdownText.attr({
      "aria-live" : "polite"
    });
    self.dropdown.on({
      "disable.selectBoxIt" : function() {
        self.dropdownContainer.attr("aria-disabled", "true");
      },
      "enable.selectBoxIt" : function() {
        self.dropdownContainer.attr("aria-disabled", "false");
      }
    });
    if (c.length) {
      self.dropdownContainer.attr("aria-labelledby", c[0].id);
    }
    self.list.attr({
      role : "listbox",
      "aria-hidden" : "true"
    });
    self.listItems.attr({
      role : "option"
    });
    self.selectBox.on({
      "open.selectBoxIt" : function() {
        self.list.attr("aria-hidden", "false");
        self.dropdownContainer.attr("aria-expanded", "true");
      },
      "close.selectBoxIt" : function() {
        self.list.attr("aria-hidden", "true");
        self.dropdownContainer.attr("aria-expanded", "false");
      }
    });
    return self;
  };
  /**
   * @return {?}
   */
  selectBoxIt._addSelectBoxAttributes = function() {
    var self = this;
    self._addAttributes(self.selectBox.prop("attributes"), self.dropdown);
    self.selectItems.each(function(iterator) {
      self._addAttributes($(this).prop("attributes"), self.listItems.eq(iterator));
    });
    return self;
  };
  /**
   * @param {!NodeList} items
   * @param {!Object} elem
   * @return {?}
   */
  selectBoxIt._addAttributes = function(items, elem) {
    var compareTerms = this.options.copyAttributes;
    if (items.length) {
      $.each(items, function(a, value) {
        a = value.name.toLowerCase();
        value = value.value;
        if (!("null" === value || -1 === $.inArray(a, compareTerms) && -1 === a.indexOf("data"))) {
          elem.attr(a, value);
        }
      });
    }
    return this;
  };
  /**
   * @param {!Object} callback
   * @return {?}
   */
  selectBoxIt.destroy = function(callback) {
    this._destroySelectBoxIt();
    this.widgetProto.destroy.call(this);
    this._callbackSupport(callback);
    return this;
  };
  /**
   * @return {?}
   */
  selectBoxIt._destroySelectBoxIt = function() {
    this.dropdown.off(".selectBoxIt");
    if ($.contains(this.dropdownContainer[0], this.originalElem)) {
      this.dropdownContainer.before(this.selectBox);
    }
    this.dropdownContainer.remove();
    this.selectBox.removeAttr("style").attr("style", this.selectBoxStyles);
    if (this.options.dropdownHiddenClass) {
      this.selectBox.removeClass(this.options.dropdownHiddenClass);
    }
    this.triggerEvent("destroy");
    return this;
  };
  /**
   * @param {!Object} name
   * @return {?}
   */
  selectBoxIt.disable = function(name) {
    if (!this.options.disabled) {
      this.close();
      this.selectBox.attr("disabled", "disabled");
      this.dropdown.removeAttr("tabindex").removeClass(this.theme.enabled).addClass(this.theme.disabled);
      this.setOption("disabled", true);
      this.triggerEvent("disable");
    }
    this._callbackSupport(name);
    return this;
  };
  /**
   * @param {undefined} index
   * @param {!Object} callback
   * @return {?}
   */
  selectBoxIt.disableOption = function(index, callback) {
    var currentSelectBoxOption;
    if ("number" === $.type(index)) {
      this.close();
      currentSelectBoxOption = this.selectBox.find("option").eq(index);
      this.triggerEvent("disable-option");
      currentSelectBoxOption.attr("disabled", "disabled");
      this.listItems.eq(index).attr("data-disabled", "true").addClass(this.theme.disabled);
      if (this.currentFocus === index) {
        index = this.listItems.eq(this.currentFocus).nextAll("li").not("[data-disabled='true']").first().length;
        currentSelectBoxOption = this.listItems.eq(this.currentFocus).prevAll("li").not("[data-disabled='true']").first().length;
        if (index) {
          this.moveDown();
        } else {
          if (currentSelectBoxOption) {
            this.moveUp();
          } else {
            this.disable();
          }
        }
      }
    }
    this._callbackSupport(callback);
    return this;
  };
  /**
   * @param {?} callback
   * @return {?}
   */
  selectBoxIt._isDisabled = function(callback) {
    if (this.originalElem.disabled) {
      this.disable();
    }
    return this;
  };
  /**
   * @return {?}
   */
  selectBoxIt._dynamicPositioning = function() {
    if ("number" === $.type(this.listSize)) {
      this.list.css("max-height", this.maxHeight || "none");
    } else {
      var w = this.dropdown.offset().top;
      var r = this.list.data("max-height") || this.list.outerHeight();
      var padding = this.dropdown.outerHeight();
      var b = this.options.viewport;
      var x = b.height();
      b = $.isWindow(b.get(0)) ? b.scrollTop() : b.offset().top;
      /** @type {boolean} */
      var m = !(w + padding + r <= x + b);
      if (!this.list.data("max-height")) {
        this.list.data("max-height", this.list.outerHeight());
      }
      if (m) {
        if (this.dropdown.offset().top - b >= r) {
          this.list.css("max-height", r);
          this.list.css("top", this.dropdown.position().top - this.list.outerHeight());
        } else {
          /** @type {number} */
          w = Math.abs(w + padding + r - (x + b));
          /** @type {number} */
          x = Math.abs(this.dropdown.offset().top - b - r);
          if (w < x) {
            this.list.css("max-height", r - w - padding / 2);
            this.list.css("top", "auto");
          } else {
            this.list.css("max-height", r - x - padding / 2);
            this.list.css("top", this.dropdown.position().top - this.list.outerHeight());
          }
        }
      } else {
        this.list.css("max-height", r);
        this.list.css("top", "auto");
      }
    }
    return this;
  };
  /**
   * @param {!Object} name
   * @return {?}
   */
  selectBoxIt.enable = function(name) {
    if (this.options.disabled) {
      this.triggerEvent("enable");
      this.selectBox.removeAttr("disabled");
      this.dropdown.attr("tabindex", 0).removeClass(this.theme.disabled).addClass(this.theme.enabled);
      this.setOption("disabled", false);
      this._callbackSupport(name);
    }
    return this;
  };
  /**
   * @param {undefined} index
   * @param {!Object} callback
   * @return {?}
   */
  selectBoxIt.enableOption = function(index, callback) {
    var currentSelectBoxOption;
    if ("number" === $.type(index)) {
      currentSelectBoxOption = this.selectBox.find("option").eq(index);
      this.triggerEvent("enable-option");
      currentSelectBoxOption.removeAttr("disabled");
      this.listItems.eq(index).attr("data-disabled", "false").removeClass(this.theme.disabled);
    }
    this._callbackSupport(callback);
    return this;
  };
  /**
   * @param {!Object} callback
   * @return {?}
   */
  selectBoxIt.moveDown = function(callback) {
    this.currentFocus += 1;
    /** @type {boolean} */
    var b = "true" === this.listItems.eq(this.currentFocus).attr("data-disabled") ? true : false;
    var a = this.listItems.eq(this.currentFocus).nextAll("li").not("[data-disabled='true']").first().length;
    if (this.currentFocus === this.listItems.length) {
      --this.currentFocus;
    } else {
      if (b && a) {
        this.listItems.eq(this.currentFocus - 1).blur();
        this.moveDown();
        return;
      }
      if (b && !a) {
        --this.currentFocus;
      } else {
        this.listItems.eq(this.currentFocus - 1).blur().end().eq(this.currentFocus).focusin();
        this._scrollToView("down");
        this.triggerEvent("moveDown");
      }
    }
    this._callbackSupport(callback);
    return this;
  };
  /**
   * @param {!Object} callback
   * @return {?}
   */
  selectBoxIt.moveUp = function(callback) {
    --this.currentFocus;
    /** @type {boolean} */
    var b = "true" === this.listItems.eq(this.currentFocus).attr("data-disabled") ? true : false;
    var a = this.listItems.eq(this.currentFocus).prevAll("li").not("[data-disabled='true']").first().length;
    if (-1 === this.currentFocus) {
      this.currentFocus += 1;
    } else {
      if (b && a) {
        this.listItems.eq(this.currentFocus + 1).blur();
        this.moveUp();
        return;
      }
      if (b && !a) {
        this.currentFocus += 1;
      } else {
        this.listItems.eq(this.currentFocus + 1).blur().end().eq(this.currentFocus).focusin();
        this._scrollToView("up");
        this.triggerEvent("moveUp");
      }
    }
    this._callbackSupport(callback);
    return this;
  };
  /**
   * @param {number} currentOption
   * @return {?}
   */
  selectBoxIt._setCurrentSearchOption = function(currentOption) {
    if ((this.options.aggressiveChange || this.options.selectWhenHidden || this.listItems.eq(currentOption).is(":visible")) && true !== this.listItems.eq(currentOption).data("disabled")) {
      this.listItems.eq(this.currentFocus).blur();
      this.currentFocus = this.currentIndex = currentOption;
      this.listItems.eq(this.currentFocus).focusin();
      this._scrollToView("search");
      this.triggerEvent("search");
    }
    return this;
  };
  /**
   * @param {number} x
   * @param {string} alphaNumeric
   * @return {?}
   */
  selectBoxIt._searchAlgorithm = function(x, alphaNumeric) {
    /** @type {boolean} */
    var c = false;
    var y;
    var arrayLength;
    var currentSearch;
    var textArray = this.textArray;
    var currentText = this.currentText;
    arrayLength = textArray.length;
    for (; x < arrayLength; x = x + 1) {
      currentSearch = textArray[x];
      /** @type {number} */
      y = 0;
      for (; y < arrayLength; y = y + 1) {
        if (-1 !== textArray[y].search(alphaNumeric)) {
          /** @type {boolean} */
          c = true;
          y = arrayLength;
        }
      }
      if (!c) {
        currentText = this.currentText = this.currentText.charAt(this.currentText.length - 1).replace(/[|()\[{.+*?$\\]/g, "\\$0");
      }
      /** @type {!RegExp} */
      alphaNumeric = new RegExp(currentText, "gi");
      if (3 > currentText.length) {
        if (alphaNumeric = new RegExp(currentText.charAt(0), "gi"), -1 !== currentSearch.charAt(0).search(alphaNumeric)) {
          this._setCurrentSearchOption(x);
          if (currentSearch.substring(0, currentText.length).toLowerCase() !== currentText.toLowerCase() || this.options.similarSearch) {
            this.currentIndex += 1;
          }
          return false;
        }
      } else {
        if (-1 !== currentSearch.search(alphaNumeric)) {
          return this._setCurrentSearchOption(x), false;
        }
      }
      if (currentSearch.toLowerCase() === this.currentText.toLowerCase()) {
        return this._setCurrentSearchOption(x), this.currentText = "", false;
      }
    }
    return true;
  };
  /**
   * @param {string} name
   * @param {?} callback
   * @param {!Function} rememberPreviousSearch
   * @return {?}
   */
  selectBoxIt.search = function(name, callback, rememberPreviousSearch) {
    this.currentText = rememberPreviousSearch ? this.currentText + name.replace(/[|()\[{.+*?$\\]/g, "\\$0") : name.replace(/[|()\[{.+*?$\\]/g, "\\$0");
    if (this._searchAlgorithm(this.currentIndex, new RegExp(this.currentText, "gi"))) {
      this._searchAlgorithm(0, this.currentText);
    }
    this._callbackSupport(callback);
    return this;
  };
  /**
   * @return {undefined}
   */
  selectBoxIt._updateMobileText = function() {
    var sel;
    var value;
    sel = this.selectBox.find("option").filter(":selected");
    value = (value = sel.attr("data-text")) ? value : sel.text();
    this._setText(this.dropdownText, value);
    if (this.list.find('li[data-val="' + sel.val() + '"]').find("i").attr("class")) {
      this.dropdownImage.attr("class", this.list.find('li[data-val="' + sel.val() + '"]').find("i").attr("class")).addClass("selectboxit-default-icon");
    }
  };
  /**
   * @return {?}
   */
  selectBoxIt._applyNativeSelect = function() {
    this.dropdownContainer.append(this.selectBox);
    this.dropdown.attr("tabindex", "-1");
    this.selectBox.css({
      display : "block",
      visibility : "visible",
      width : this._realOuterWidth(this.dropdown),
      height : this.dropdown.outerHeight(),
      opacity : "0",
      position : "absolute",
      top : "0",
      left : "0",
      cursor : "pointer",
      "z-index" : "999999",
      margin : this.dropdown.css("margin"),
      padding : "0",
      "-webkit-appearance" : "menulist-button"
    });
    if (this.originalElem.disabled) {
      this.triggerEvent("disable");
    }
    return this;
  };
  /**
   * @return {undefined}
   */
  selectBoxIt._mobileEvents = function() {
    var self = this;
    self.selectBox.on({
      "changed.selectBoxIt" : function() {
        /** @type {boolean} */
        self.hasChanged = true;
        self._updateMobileText();
        self.triggerEvent("option-click");
      },
      "mousedown.selectBoxIt" : function() {
        if (!(self.hasChanged || !self.options.defaultText || self.originalElem.disabled)) {
          self._updateMobileText();
          self.triggerEvent("option-click");
        }
      },
      "enable.selectBoxIt" : function() {
        self.selectBox.removeClass("selectboxit-rendering");
      },
      "disable.selectBoxIt" : function() {
        self.selectBox.addClass("selectboxit-rendering");
      }
    });
  };
  /**
   * @param {?} callback
   * @return {?}
   */
  selectBoxIt._mobile = function(callback) {
    if (this.isMobile) {
      this._applyNativeSelect();
      this._mobileEvents();
    }
    return this;
  };
  /**
   * @param {undefined} value
   * @param {!Object} callback
   * @return {?}
   */
  selectBoxIt.selectOption = function(value, callback) {
    var type = $.type(value);
    if ("number" === type) {
      this.selectBox.val(this.selectItems.eq(value).val()).change();
    } else {
      if ("string" === type) {
        this.selectBox.val(value).change();
      }
    }
    this._callbackSupport(callback);
    return this;
  };
  /**
   * @param {!Object} c
   * @param {string} v
   * @param {!Object} callback
   * @return {?}
   */
  selectBoxIt.setOption = function(c, v, callback) {
    var self = this;
    if ("string" === $.type(c)) {
      /** @type {string} */
      self.options[c] = v;
    }
    self.refresh(function() {
      self._callbackSupport(callback);
    }, true);
    return self;
  };
  /**
   * @param {?} options
   * @param {!Object} callback
   * @return {?}
   */
  selectBoxIt.setOptions = function(options, callback) {
    var self = this;
    if ($.isPlainObject(options)) {
      self.options = $.extend({}, self.options, options);
    }
    self.refresh(function() {
      self._callbackSupport(callback);
    }, true);
    return self;
  };
  /**
   * @param {string} a
   * @param {?} b
   * @return {?}
   */
  selectBoxIt.wait = function(a, b) {
    this.widgetProto._delay.call(this, b, a);
    return this;
  };
  /**
   * @param {!Object} name
   * @param {string} value
   * @return {undefined}
   */
  selectBoxIt.add = function(name, value) {
    this._populate(name, function(data) {
      var self = this;
      var type = $.type(data);
      /** @type {number} */
      var j = 0;
      var r;
      /** @type {!Array} */
      var calendar = [];
      var options = (r = self._isJSON(data)) && self._parseJSON(data);
      if (data && ("array" === type || r && options.data && "array" === $.type(options.data)) || "object" === type && data.data && "array" === $.type(data.data)) {
        if (self._isJSON(data)) {
          data = options;
        }
        if (data.data) {
          data = data.data;
        }
        r = data.length;
        for (; j <= r - 1; j = j + 1) {
          type = data[j];
          if ($.isPlainObject(type)) {
            calendar.push($("<option/>", type));
          } else {
            if ("string" === $.type(type)) {
              calendar.push($("<option/>", {
                text : type,
                value : type
              }));
            }
          }
        }
        self.selectBox.append(calendar);
      } else {
        if (data && "string" === type && !self._isJSON(data)) {
          self.selectBox.append(data);
        } else {
          if (data && "object" === type) {
            self.selectBox.append($("<option/>", data));
          } else {
            if (data && self._isJSON(data) && $.isPlainObject(self._parseJSON(data))) {
              self.selectBox.append($("<option/>", self._parseJSON(data)));
            }
          }
        }
      }
      if (self.dropdown) {
        self.refresh(function() {
          self._callbackSupport(value);
        }, true);
      } else {
        self._callbackSupport(value);
      }
      return self;
    });
  };
  /**
   * @param {string} data
   * @return {?}
   */
  selectBoxIt._parseJSON = function(data) {
    return JSON && JSON.parse && JSON.parse(data) || $.parseJSON(data);
  };
  /**
   * @param {boolean} data
   * @return {?}
   */
  selectBoxIt._isJSON = function(data) {
    try {
      return this._parseJSON(data), true;
    } catch (g) {
      return false;
    }
  };
  /**
   * @param {!Object} data
   * @param {!Function} callback
   * @return {?}
   */
  selectBoxIt._populate = function(data, callback) {
    var self = this;
    data = $.isFunction(data) ? data.call() : data;
    if (self.isDeferred(data)) {
      data.done(function(a) {
        callback.call(self, a);
      });
    } else {
      callback.call(self, data);
    }
    return self;
  };
  /**
   * @param {!Object} name
   * @param {string} value
   * @return {?}
   */
  selectBoxIt.remove = function(name, value) {
    var self = this;
    var value = $.type(name);
    /** @type {number} */
    var i = 0;
    var l;
    /** @type {string} */
    var res = "";
    if ("array" === value) {
      l = name.length;
      for (; i <= l - 1; i = i + 1) {
        value = name[i];
        if ("number" === $.type(value)) {
          /** @type {string} */
          res = res.length ? res + (", option:eq(" + value + ")") : res + ("option:eq(" + value + ")");
        }
      }
      self.selectBox.find(res).remove();
    } else {
      if ("number" === value) {
        self.selectBox.find("option").eq(name).remove();
      } else {
        self.selectBox.find("option").remove();
      }
    }
    if (self.dropdown) {
      self.refresh(function() {
        self._callbackSupport(value);
      }, true);
    } else {
      self._callbackSupport(value);
    }
    return self;
  };
});
(function() {
  /** @type {function(this:(IArrayLike<T>|string), T, number=): number} */
  var __indexOf = [].indexOf || function(item) {
    /** @type {number} */
    var i = 0;
    var l = this.length;
    for (; i < l; i++) {
      if (i in this && this[i] === item) {
        return i;
      }
    }
    return -1;
  };
  /** @type {function(this:(IArrayLike<T>|string), *=, *=): !Array<T>} */
  var slice = [].slice;
  (function(window, factory) {
    return "function" === typeof define && define.amd ? define("waypoints", ["jquery"], function(jQuery) {
      return factory(jQuery, window);
    }) : factory(window.jQuery, window);
  })(this, function($, window) {
    var $window;
    var Context;
    var Waypoint;
    var allWaypoints;
    var contextCounter;
    var contexts;
    var m;
    var jQMethods;
    var methods;
    var waypointCounter;
    $window = $(window);
    /** @type {boolean} */
    m = 0 <= __indexOf.call(window, "ontouchstart");
    allWaypoints = {
      horizontal : {},
      vertical : {}
    };
    /** @type {number} */
    contextCounter = 1;
    contexts = {};
    /** @type {number} */
    waypointCounter = 1;
    Context = function() {
      /**
       * @param {!Object} $element
       * @return {undefined}
       */
      function Context($element) {
        var _this = this;
        /** @type {!Object} */
        this.$element = $element;
        this.element = $element[0];
        /** @type {boolean} */
        this.didScroll = this.didResize = false;
        /** @type {string} */
        this.id = "context" + contextCounter++;
        this.oldScroll = {
          x : $element.scrollLeft(),
          y : $element.scrollTop()
        };
        this.waypoints = {
          horizontal : {},
          vertical : {}
        };
        $element.data("waypoints-context-id", this.id);
        contexts[this.id] = this;
        $element.bind("scroll.waypoints", function() {
          if (!_this.didScroll && !m) {
            return _this.didScroll = true, window.setTimeout(function() {
              _this.doScroll();
              return _this.didScroll = false;
            }, $.waypoints.settings.scrollThrottle);
          }
        });
        $element.bind("resize.waypoints", function() {
          if (!_this.didResize) {
            return _this.didResize = true, window.setTimeout(function() {
              $.waypoints("refresh");
              return _this.didResize = false;
            }, $.waypoints.settings.resizeThrottle);
          }
        });
      }
      /**
       * @return {?}
       */
      Context.prototype.doScroll = function() {
        var axes;
        var _this = this;
        axes = {
          horizontal : {
            newScroll : this.$element.scrollLeft(),
            oldScroll : this.oldScroll.x,
            forward : "right",
            backward : "left"
          },
          vertical : {
            newScroll : this.$element.scrollTop(),
            oldScroll : this.oldScroll.y,
            forward : "down",
            backward : "up"
          }
        };
        if (!(!m || axes.vertical.oldScroll && axes.vertical.newScroll)) {
          $.waypoints("refresh");
        }
        $.each(axes, function(aKey, axis) {
          var direction;
          var e;
          var g;
          /** @type {!Array} */
          g = [];
          direction = (e = axis.newScroll > axis.oldScroll) ? axis.forward : axis.backward;
          $.each(_this.waypoints[aKey], function(a, e) {
            var _ref;
            var _ref1;
            if (axis.oldScroll < (_ref = e.offset) && _ref <= axis.newScroll || axis.newScroll < (_ref1 = e.offset) && _ref1 <= axis.oldScroll) {
              return g.push(e);
            }
          });
          g.sort(function(a, b) {
            return a.offset - b.offset;
          });
          if (!e) {
            g.reverse();
          }
          return $.each(g, function(i, self) {
            if (self.options.continuous || i === g.length - 1) {
              return self.trigger([direction]);
            }
          });
        });
        return this.oldScroll = {
          x : axes.horizontal.newScroll,
          y : axes.vertical.newScroll
        };
      };
      /**
       * @return {?}
       */
      Context.prototype.refresh = function() {
        var found;
        var isWin;
        var _this = this;
        isWin = $.isWindow(this.element);
        found = this.$element.offset();
        this.doScroll();
        found = {
          horizontal : {
            contextOffset : isWin ? 0 : found.left,
            contextScroll : isWin ? 0 : this.oldScroll.x,
            contextDimension : this.$element.width(),
            oldScroll : this.oldScroll.x,
            forward : "right",
            backward : "left",
            offsetProp : "left"
          },
          vertical : {
            contextOffset : isWin ? 0 : found.top,
            contextScroll : isWin ? 0 : this.oldScroll.y,
            contextDimension : isWin ? $.waypoints("viewportHeight") : this.$element.height(),
            oldScroll : this.oldScroll.y,
            forward : "down",
            backward : "up",
            offsetProp : "top"
          }
        };
        return $.each(found, function(aKey, axis) {
          return $.each(_this.waypoints[aKey], function(adjustment, waypoint) {
            var elementOffset;
            var oldOffset;
            var _ref;
            var _ref1;
            adjustment = waypoint.options.offset;
            oldOffset = waypoint.offset;
            elementOffset = $.isWindow(waypoint.element) ? 0 : waypoint.$element.offset()[axis.offsetProp];
            if ($.isFunction(adjustment)) {
              adjustment = adjustment.apply(waypoint.element);
            } else {
              if ("string" === typeof adjustment) {
                /** @type {number} */
                adjustment = parseFloat(adjustment);
                if (-1 < waypoint.options.offset.indexOf("%")) {
                  /** @type {number} */
                  adjustment = Math.ceil(axis.contextDimension * adjustment / 100);
                }
              }
            }
            /** @type {number} */
            waypoint.offset = elementOffset - axis.contextOffset + axis.contextScroll - adjustment;
            if ((!waypoint.options.onlyOnScroll || null == oldOffset) && waypoint.enabled) {
              if (null !== oldOffset && oldOffset < (_ref = axis.oldScroll) && _ref <= waypoint.offset) {
                return waypoint.trigger([axis.backward]);
              }
              if (null !== oldOffset && oldOffset > (_ref1 = axis.oldScroll) && _ref1 >= waypoint.offset || null === oldOffset && axis.oldScroll >= waypoint.offset) {
                return waypoint.trigger([axis.forward]);
              }
            }
          });
        });
      };
      /**
       * @return {?}
       */
      Context.prototype.checkEmpty = function() {
        if ($.isEmptyObject(this.waypoints.horizontal) && $.isEmptyObject(this.waypoints.vertical)) {
          return this.$element.unbind("resize.waypoints scroll.waypoints"), delete contexts[this.id];
        }
      };
      return Context;
    }();
    Waypoint = function() {
      /**
       * @param {!Object} $element
       * @param {!Object} context
       * @param {!Object} options
       * @return {undefined}
       */
      function Waypoint($element, context, options) {
        var siteOptions;
        options = $.extend({}, $.fn.waypoint.defaults, options);
        if ("bottom-in-view" === options.offset) {
          /**
           * @return {?}
           */
          options.offset = function() {
            var contextHeight;
            contextHeight = $.waypoints("viewportHeight");
            if (!$.isWindow(context.element)) {
              contextHeight = context.$element.height();
            }
            return contextHeight - $(this).outerHeight();
          };
        }
        /** @type {!Object} */
        this.$element = $element;
        this.element = $element[0];
        /** @type {string} */
        this.axis = options.horizontal ? "horizontal" : "vertical";
        this.callback = options.handler;
        /** @type {!Object} */
        this.context = context;
        this.enabled = options.enabled;
        /** @type {string} */
        this.id = "waypoints" + waypointCounter++;
        /** @type {null} */
        this.offset = null;
        /** @type {!Object} */
        this.options = options;
        context.waypoints[this.axis][this.id] = this;
        allWaypoints[this.axis][this.id] = this;
        options = null != (siteOptions = $element.data("waypoints-waypoint-ids")) ? siteOptions : [];
        options.push(this.id);
        $element.data("waypoints-waypoint-ids", options);
      }
      /**
       * @param {string} event
       * @return {?}
       */
      Waypoint.prototype.trigger = function(event) {
        if (this.enabled && (null != this.callback && this.callback.apply(this.element, event), this.options.triggerOnce)) {
          return this.destroy();
        }
      };
      /**
       * @return {?}
       */
      Waypoint.prototype.disable = function() {
        return this.enabled = false;
      };
      /**
       * @return {?}
       */
      Waypoint.prototype.enable = function() {
        this.context.refresh();
        return this.enabled = true;
      };
      /**
       * @return {?}
       */
      Waypoint.prototype.destroy = function() {
        delete allWaypoints[this.axis][this.id];
        delete this.context.waypoints[this.axis][this.id];
        return this.context.checkEmpty();
      };
      /**
       * @param {?} element
       * @return {?}
       */
      Waypoint.getWaypointsByElement = function(element) {
        var b;
        element = $(element).data("waypoints-waypoint-ids");
        if (!element) {
          return [];
        }
        b = $.extend({}, allWaypoints.horizontal, allWaypoints.vertical);
        return $.map(element, function(inFlowOrd) {
          return b[inFlowOrd];
        });
      };
      return Waypoint;
    }();
    methods = {
      init : function(method, options) {
        if (null == options) {
          options = {};
        }
        if (null == options.handler) {
          /** @type {!Function} */
          options.handler = method;
        }
        this.each(function() {
          var $this;
          var context;
          var contextElement;
          $this = $(this);
          contextElement = null != (context = options.context) ? context : $.fn.waypoint.defaults.context;
          if (!$.isWindow(contextElement)) {
            contextElement = $this.closest(contextElement);
          }
          contextElement = $(contextElement);
          if (!(context = contexts[contextElement.data("waypoints-context-id")])) {
            context = new Context(contextElement);
          }
          return new Waypoint($this, context, options);
        });
        $.waypoints("refresh");
        return this;
      },
      disable : function() {
        return methods._invoke(this, "disable");
      },
      enable : function() {
        return methods._invoke(this, "enable");
      },
      destroy : function() {
        return methods._invoke(this, "destroy");
      },
      prev : function(name, value) {
        return methods._traverse.call(this, name, value, function(systems, b, siblings) {
          if (0 < b) {
            return systems.push(siblings[b - 1]);
          }
        });
      },
      next : function(name, value) {
        return methods._traverse.call(this, name, value, function(results, spos, src) {
          if (spos < src.length - 1) {
            return results.push(src[spos + 1]);
          }
        });
      },
      _traverse : function(axis, selector, push) {
        var node;
        var waypoints;
        if (null == axis) {
          /** @type {string} */
          axis = "vertical";
        }
        if (null == selector) {
          /** @type {!Object} */
          selector = window;
        }
        waypoints = jQMethods.aggregate(selector);
        /** @type {!Array} */
        node = [];
        this.each(function() {
          var MIN_PRECISION;
          MIN_PRECISION = $.inArray(this, waypoints[axis]);
          return push(node, MIN_PRECISION, waypoints[axis]);
        });
        return this.pushStack(node);
      },
      _invoke : function(fn, type) {
        fn.each(function() {
          var fields_to_add;
          fields_to_add = Waypoint.getWaypointsByElement(this);
          return $.each(fields_to_add, function(a, toolTipTexts) {
            toolTipTexts[type]();
            return true;
          });
        });
        return this;
      }
    };
    /**
     * @return {?}
     */
    $.fn.waypoint = function() {
      var value;
      var method;
      method = arguments[0];
      /** @type {!Array<?>} */
      value = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return methods[method] ? methods[method].apply(this, value) : $.isFunction(method) ? methods.init.apply(this, arguments) : $.isPlainObject(method) ? methods.init.apply(this, [null, method]) : method ? $.error("The " + method + " method does not exist in jQuery Waypoints.") : $.error("jQuery Waypoints needs a callback function or handler option.");
    };
    $.fn.waypoint.defaults = {
      context : window,
      continuous : true,
      enabled : true,
      horizontal : false,
      offset : 0,
      triggerOnce : false
    };
    jQMethods = {
      refresh : function() {
        return $.each(contexts, function(a, latestService) {
          return latestService.refresh();
        });
      },
      viewportHeight : function() {
        var positionOut;
        return null != (positionOut = window.innerHeight) ? positionOut : $window.height();
      },
      aggregate : function(selector) {
        var collection;
        var waypoints;
        var context;
        collection = allWaypoints;
        if (selector) {
          collection = null != (context = contexts[$(selector).data("waypoints-context-id")]) ? context.waypoints : void 0;
        }
        if (!collection) {
          return [];
        }
        waypoints = {
          horizontal : [],
          vertical : []
        };
        $.each(waypoints, function(axis, arr) {
          $.each(collection[axis], function(a, currentComment) {
            return arr.push(currentComment);
          });
          arr.sort(function(a, b) {
            return a.offset - b.offset;
          });
          waypoints[axis] = $.map(arr, function(arrowIcon) {
            return arrowIcon.element;
          });
          return waypoints[axis] = $.unique(waypoints[axis]);
        });
        return waypoints;
      },
      above : function(contextSelector) {
        if (null == contextSelector) {
          /** @type {!Object} */
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, "vertical", function(context, b) {
          return b.offset <= context.oldScroll.y;
        });
      },
      below : function(contextSelector) {
        if (null == contextSelector) {
          /** @type {!Object} */
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, "vertical", function(context, bullet) {
          return bullet.offset > context.oldScroll.y;
        });
      },
      left : function(name) {
        if (null == name) {
          /** @type {!Object} */
          name = window;
        }
        return jQMethods._filter(name, "horizontal", function(context, b) {
          return b.offset <= context.oldScroll.x;
        });
      },
      right : function(name) {
        if (null == name) {
          /** @type {!Object} */
          name = window;
        }
        return jQMethods._filter(name, "horizontal", function(context, other) {
          return other.offset > context.oldScroll.x;
        });
      },
      enable : function() {
        return jQMethods._invoke("enable");
      },
      disable : function() {
        return jQMethods._invoke("disable");
      },
      destroy : function() {
        return jQMethods._invoke("destroy");
      },
      extendFn : function(methodName, fn) {
        return methods[methodName] = fn;
      },
      _invoke : function(type) {
        var fields_to_add;
        fields_to_add = $.extend({}, allWaypoints.vertical, allWaypoints.horizontal);
        return $.each(fields_to_add, function(b, toolTipTexts) {
          toolTipTexts[type]();
          return true;
        });
      },
      _filter : function(selector, axis, test) {
        var context;
        var sortedInputNames;
        context = contexts[$(selector).data("waypoints-context-id")];
        if (!context) {
          return [];
        }
        /** @type {!Array} */
        sortedInputNames = [];
        $.each(context.waypoints[axis], function(a, name) {
          if (test(context, name)) {
            return sortedInputNames.push(name);
          }
        });
        sortedInputNames.sort(function(a, b) {
          return a.offset - b.offset;
        });
        return $.map(sortedInputNames, function(arrowIcon) {
          return arrowIcon.element;
        });
      }
    };
    /**
     * @return {?}
     */
    $.waypoints = function() {
      var value;
      var method;
      method = arguments[0];
      /** @type {!Array<?>} */
      value = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return jQMethods[method] ? jQMethods[method].apply(null, value) : jQMethods.aggregate.call(null, method);
    };
    $.waypoints.settings = {
      resizeThrottle : 100,
      scrollThrottle : 30
    };
    return $window.load(function() {
      return $.waypoints("refresh");
    });
  });
}).call(this);
(function($) {
  /**
   * @param {?} settings
   * @return {?}
   */
  $.fn.touchwipe = function(settings) {
    var config = {
      min_move_x : 20,
      min_move_y : 20,
      wipeLeft : function(e) {
      },
      wipeRight : function(e) {
      },
      wipeUp : function(e) {
      },
      wipeDown : function(e) {
      },
      preventDefaultEvents : true,
      isMSPointerEvents : !!window.navigator.msPointerEnabled
    };
    /** @type {string} */
    var type = config.isMSPointerEvents ? "MSPointerMove" : "touchmove";
    /** @type {string} */
    var eventName = config.isMSPointerEvents ? "MSPointerDown" : "touchstart";
    if (settings) {
      $.extend(config, settings);
    }
    this.each(function() {
      /**
       * @return {undefined}
       */
      function cancelTouch() {
        this.removeEventListener(type, onTouchMove);
        /** @type {null} */
        x = null;
        /** @type {boolean} */
        m = false;
      }
      /**
       * @param {!Object} e
       * @return {undefined}
       */
      function onTouchMove(e) {
        if (config.preventDefaultEvents) {
          e.preventDefault();
        }
        if (m) {
          var i;
          if (config.isMSPointerEvents) {
            /** @type {!Object} */
            i = e;
          } else {
            if (1 !== e.touches.length) {
              return;
            }
            i = e.touches[0];
          }
          /** @type {number} */
          var dx = x - i.pageX;
          /** @type {number} */
          i = y - i.pageY;
          if (Math.abs(dx) >= config.min_move_x) {
            cancelTouch();
            if (0 < dx) {
              config.wipeLeft(e);
            } else {
              config.wipeRight(e);
            }
          } else {
            if (Math.abs(i) >= config.min_move_y) {
              cancelTouch();
              if (0 < i) {
                config.wipeDown(e);
              } else {
                config.wipeUp(e);
              }
            }
          }
        }
      }
      /**
       * @param {!Object} event
       * @return {undefined}
       */
      function onTouchStart(event) {
        if (!config.isMSPointerEvents) {
          if (1 !== event.touches.length) {
            return;
          }
          event = event.touches[0];
        }
        x = event.pageX;
        y = event.pageY;
        /** @type {boolean} */
        m = true;
        this.addEventListener(type, onTouchMove, false);
      }
      var x;
      var y;
      /** @type {boolean} */
      var m = false;
      if ("ontouchstart" in window || config.isMSPointerEvents) {
        this.addEventListener(eventName, onTouchStart, false);
      }
    });
    return this;
  };
})(jQuery);
(function($) {
  var jCarousel = $.jCarousel = {};
  /** @type {string} */
  jCarousel.version = "0.3.0";
  /** @type {!RegExp} */
  var f = /^([+\-]=)?(.+)$/;
  /**
   * @param {number} target
   * @return {?}
   */
  jCarousel.parseTarget = function(target) {
    /** @type {boolean} */
    var relative = false;
    /** @type {(Array<string>|null)} */
    var sArrDayId = "object" !== typeof target ? f.exec(target) : null;
    if (sArrDayId) {
      /** @type {number} */
      target = parseInt(sArrDayId[2], 10) || 0;
      if (sArrDayId[1]) {
        /** @type {boolean} */
        relative = true;
        if ("-=" === sArrDayId[1]) {
          /** @type {number} */
          target = target * -1;
        }
      }
    } else {
      if ("object" !== typeof target) {
        /** @type {number} */
        target = parseInt(target, 10) || 0;
      }
    }
    return {
      target : target,
      relative : relative
    };
  };
  /**
   * @param {!Object} element
   * @return {?}
   */
  jCarousel.detectCarousel = function(element) {
    var carousel;
    for (; 0 < element.length;) {
      carousel = element.filter("[data-jcarousel]");
      if (0 < carousel.length) {
        return carousel;
      }
      carousel = element.find("[data-jcarousel]");
      if (0 < carousel.length) {
        return carousel;
      }
      element = element.parent();
    }
    return null;
  };
  /**
   * @param {!Object} name
   * @return {?}
   */
  jCarousel.base = function(name) {
    return {
      version : jCarousel.version,
      _options : {},
      _element : null,
      _carousel : null,
      _init : $.noop,
      _create : $.noop,
      _destroy : $.noop,
      _reload : $.noop,
      create : function() {
        this._element.attr("data-" + name.toLowerCase(), true).data(name, this);
        if (false === this._trigger("create")) {
          return this;
        }
        this._create();
        this._trigger("createend");
        return this;
      },
      destroy : function() {
        if (false === this._trigger("destroy")) {
          return this;
        }
        this._destroy();
        this._trigger("destroyend");
        this._element.removeData(name).removeAttr("data-" + name.toLowerCase());
        return this;
      },
      reload : function(list) {
        if (false === this._trigger("reload")) {
          return this;
        }
        if (list) {
          this.options(list);
        }
        this._reload();
        this._trigger("reloadend");
        return this;
      },
      element : function() {
        return this._element;
      },
      options : function(name, value) {
        if (0 === arguments.length) {
          return $.extend({}, this._options);
        }
        if ("string" === typeof name) {
          if ("undefined" === typeof value) {
            return "undefined" === typeof this._options[name] ? null : this._options[name];
          }
          /** @type {string} */
          this._options[name] = value;
        } else {
          this._options = $.extend({}, this._options, name);
        }
        return this;
      },
      carousel : function() {
        if (!(this._carousel || (this._carousel = jCarousel.detectCarousel(this.options("carousel") || this._element)))) {
          $.error('Could not detect carousel for plugin "' + name + '"');
        }
        return this._carousel;
      },
      _trigger : function(type, element, data) {
        var event;
        /** @type {boolean} */
        var g = false;
        /** @type {!Array<?>} */
        data = [this].concat(data || []);
        (element || this._element).each(function() {
          event = $.Event((name + ":" + type).toLowerCase());
          $(this).trigger(event, data);
          if (event.isDefaultPrevented()) {
            /** @type {boolean} */
            g = true;
          }
        });
        return !g;
      }
    };
  };
  /**
   * @param {!Object} pluginName
   * @param {?} pluginPrototype
   * @return {?}
   */
  jCarousel.plugin = function(pluginName, pluginPrototype) {
    /** @type {function(?, undefined): undefined} */
    var Plugin = $[pluginName] = function(selector, watch) {
      this._element = $(selector);
      this.options(watch);
      this._init();
      this.create();
    };
    Plugin.fn = Plugin.prototype = $.extend({}, jCarousel.base(pluginName), pluginPrototype);
    /**
     * @param {string} name
     * @return {?}
     */
    $.fn[pluginName] = function(name) {
      /** @type {!Array<?>} */
      var i = Array.prototype.slice.call(arguments, 1);
      var validationVM = this;
      if ("string" === typeof name) {
        this.each(function() {
          var elem = $(this).data(pluginName);
          if (!elem) {
            return $.error("Cannot call methods on " + pluginName + ' prior to initialization; attempted to call method "' + name + '"');
          }
          if (!$.isFunction(elem[name]) || "_" === name.charAt(0)) {
            return $.error('No such method "' + name + '" for ' + pluginName + " instance");
          }
          var v = elem[name].apply(elem, i);
          if (v !== elem && "undefined" !== typeof v) {
            return validationVM = v, false;
          }
        });
      } else {
        this.each(function() {
          var plugin = $(this).data(pluginName);
          if (plugin instanceof Plugin) {
            plugin.reload(name);
          } else {
            new Plugin(this, name);
          }
        });
      }
      return validationVM;
    };
    return Plugin;
  };
})(jQuery);
(function($, elem) {
  /**
   * @param {?} value
   * @return {?}
   */
  var toFloat = function(value) {
    return parseFloat(value) || 0;
  };
  $.jCarousel.plugin("jcarousel", {
    animating : false,
    tail : 0,
    inTail : false,
    resizeTimer : null,
    lt : null,
    vertical : false,
    rtl : false,
    circular : false,
    underflow : false,
    relative : false,
    _options : {
      list : function() {
        return this.element().children().eq(0);
      },
      items : function() {
        return this.list().children();
      },
      animation : 400,
      transitions : false,
      wrap : null,
      vertical : null,
      rtl : null,
      center : false
    },
    _list : null,
    _items : null,
    _target : null,
    _first : null,
    _last : null,
    _visible : null,
    _fullyvisible : null,
    _init : function() {
      var self = this;
      /**
       * @return {undefined}
       */
      this.onWindowResize = function() {
        if (self.resizeTimer) {
          clearTimeout(self.resizeTimer);
        }
        /** @type {number} */
        self.resizeTimer = setTimeout(function() {
          self.reload();
        }, 100);
      };
      return this;
    },
    _create : function() {
      this._reload();
      $(elem).on("resize.jcarousel", this.onWindowResize);
    },
    _destroy : function() {
      $(elem).off("resize.jcarousel", this.onWindowResize);
    },
    _reload : function() {
      this.vertical = this.options("vertical");
      if (null == this.vertical) {
        /** @type {boolean} */
        this.vertical = this.list().height() > this.list().width();
      }
      this.rtl = this.options("rtl");
      if (null == this.rtl) {
        this.rtl = function($slide) {
          if ("rtl" === ("" + $slide.attr("dir")).toLowerCase()) {
            return true;
          }
          /** @type {boolean} */
          var found = false;
          $slide.parents("[dir]").each(function() {
            if (/rtl/i.test($(this).attr("dir"))) {
              return found = true, false;
            }
          });
          return found;
        }(this._element);
      }
      /** @type {string} */
      this.lt = this.vertical ? "top" : "left";
      /** @type {boolean} */
      this.relative = "relative" === this.list().css("position");
      /** @type {null} */
      this._items = this._list = null;
      var item = this._target && 0 <= this.index(this._target) ? this._target : this.closest();
      /** @type {boolean} */
      this.circular = "circular" === this.options("wrap");
      /** @type {boolean} */
      this.underflow = false;
      var props = {
        left : 0,
        top : 0
      };
      if (0 < item.length) {
        this._prepare(item);
        this.list().find("[data-jcarousel-clone]").remove();
        /** @type {null} */
        this._items = null;
        /** @type {boolean} */
        this.underflow = this._fullyvisible.length >= this.items().length;
        /** @type {boolean} */
        this.circular = this.circular && !this.underflow;
        props[this.lt] = this._position(item) + "px";
      }
      this.move(props);
      return this;
    },
    list : function() {
      if (null === this._list) {
        var option = this.options("list");
        this._list = $.isFunction(option) ? option.call(this) : this._element.find(option);
      }
      return this._list;
    },
    items : function() {
      if (null === this._items) {
        var item = this.options("items");
        this._items = ($.isFunction(item) ? item.call(this) : this.list().find(item)).not("[data-jcarousel-clone]");
      }
      return this._items;
    },
    index : function(key) {
      return this.items().index(key);
    },
    closest : function() {
      var proxy = this;
      var pos = this.list().position()[this.lt];
      var closest = $();
      /** @type {boolean} */
      var g = false;
      /** @type {string} */
      var lrb = this.vertical ? "bottom" : this.rtl && !this.relative ? "left" : "right";
      var width;
      if (this.rtl && this.relative && !this.vertical) {
        pos = pos + (this.list().width() - this.clipping());
      }
      this.items().each(function() {
        closest = $(this);
        if (g) {
          return false;
        }
        var dim = proxy.dimension(closest);
        pos = pos + dim;
        if (0 <= pos) {
          if (width = dim - toFloat(closest.css("margin-" + lrb)), 0 >= Math.abs(pos) - dim + width / 2) {
            /** @type {boolean} */
            g = true;
          } else {
            return false;
          }
        }
      });
      return closest;
    },
    target : function() {
      return this._target;
    },
    first : function() {
      return this._first;
    },
    last : function() {
      return this._last;
    },
    visible : function() {
      return this._visible;
    },
    fullyvisible : function() {
      return this._fullyvisible;
    },
    hasNext : function() {
      if (false === this._trigger("hasnext")) {
        return true;
      }
      var path = this.options("wrap");
      /** @type {number} */
      var end = this.items().length - 1;
      return 0 <= end && (path && "first" !== path || this.index(this._last) < end || this.tail && !this.inTail) ? true : false;
    },
    hasPrev : function() {
      if (false === this._trigger("hasprev")) {
        return true;
      }
      var expr = this.options("wrap");
      return 0 < this.items().length && (expr && "last" !== expr || 0 < this.index(this._first) || this.tail && this.inTail) ? true : false;
    },
    clipping : function() {
      return this._element["inner" + (this.vertical ? "Height" : "Width")]();
    },
    dimension : function(element) {
      return element["outer" + (this.vertical ? "Height" : "Width")](true);
    },
    scroll : function(end, animate, callback) {
      if (this.animating || false === this._trigger("scroll", null, [end, animate])) {
        return this;
      }
      if ($.isFunction(animate)) {
        /** @type {boolean} */
        callback = animate;
        /** @type {boolean} */
        animate = true;
      }
      var current = $.jCarousel.parseTarget(end);
      if (current.relative) {
        /** @type {number} */
        end = this.items().length - 1;
        /** @type {number} */
        var index = Math.abs(current.target);
        var i = this.options("wrap");
        var last;
        if (0 < current.target) {
          if (last = this.index(this._last), last >= end && this.tail) {
            if (this.inTail) {
              if ("both" === i || "last" === i) {
                this._scroll(0, animate, callback);
              } else {
                if ($.isFunction(callback)) {
                  callback.call(this, false);
                }
              }
            } else {
              this._scrollTail(animate, callback);
            }
          } else {
            if (current = this.index(this._target), this.underflow && current === end && ("circular" === i || "both" === i || "last" === i) || !this.underflow && last === end && ("both" === i || "last" === i)) {
              this._scroll(0, animate, callback);
            } else {
              if (index = current + index, this.circular && index > end) {
                /** @type {string} */
                i = end;
                end = this.items().get(-1);
                for (; i++ < index;) {
                  end = this.items().eq(0);
                  if (current = 0 <= this._visible.index(end)) {
                    end.after(end.clone(true).attr("data-jcarousel-clone", true));
                  }
                  this.list().append(end);
                  if (!current) {
                    current = {};
                    current[this.lt] = this.dimension(end);
                    this.moveBy(current);
                  }
                  /** @type {null} */
                  this._items = null;
                }
                this._scroll(end, animate, callback);
              } else {
                this._scroll(Math.min(index, end), animate, callback);
              }
            }
          }
        } else {
          if (this.inTail) {
            this._scroll(Math.max(this.index(this._first) - index + 1, 0), animate, callback);
          } else {
            if (last = this.index(this._first), current = this.index(this._target), current = this.underflow ? current : last, index = current - index, 0 >= current && (this.underflow && "circular" === i || "both" === i || "first" === i)) {
              this._scroll(end, animate, callback);
            } else {
              if (this.circular && 0 > index) {
                /** @type {number} */
                i = index;
                end = this.items().get(0);
                for (; 0 > i++;) {
                  end = this.items().eq(-1);
                  if (current = 0 <= this._visible.index(end)) {
                    end.after(end.clone(true).attr("data-jcarousel-clone", true));
                  }
                  this.list().prepend(end);
                  /** @type {null} */
                  this._items = null;
                  index = this.dimension(end);
                  current = {};
                  /** @type {number} */
                  current[this.lt] = -index;
                  this.moveBy(current);
                }
                this._scroll(end, animate, callback);
              } else {
                this._scroll(Math.max(index, 0), animate, callback);
              }
            }
          }
        }
      } else {
        this._scroll(current.target, animate, callback);
      }
      this._trigger("scrollend");
      $(document).trigger("promoSlideChange", {
        index : $(this._first).attr("data-index"),
        item : this._first
      });
      return this;
    },
    moveBy : function(properties, opts) {
      var cfg = this.list().position();
      /** @type {number} */
      var multiplier = 1;
      /** @type {number} */
      var correction = 0;
      if (this.rtl && !this.vertical) {
        /** @type {number} */
        multiplier = -1;
        if (this.relative) {
          /** @type {number} */
          correction = this.list().width() - this.clipping();
        }
      }
      if (properties.left) {
        /** @type {string} */
        properties.left = cfg.left + correction + toFloat(properties.left) * multiplier + "px";
      }
      if (properties.top) {
        /** @type {string} */
        properties.top = cfg.top + correction + toFloat(properties.top) * multiplier + "px";
      }
      return this.move(properties, opts);
    },
    move : function(properties, opts) {
      opts = opts || {};
      var option = this.options("transitions");
      /** @type {boolean} */
      var leftToRight = !!option;
      /** @type {boolean} */
      var h = !!option.transforms;
      /** @type {boolean} */
      var m = !!option.transforms3d;
      var maxColumn = opts.duration || 0;
      var list = this.list();
      if (!leftToRight && 0 < maxColumn) {
        list.animate(properties, opts);
      } else {
        var next = opts.complete || $.noop;
        var css = {};
        if (leftToRight) {
          var itemCSS = list.css(["transitionDuration", "transitionTimingFunction", "transitionProperty"]);
          var prevNext = next;
          /**
           * @return {undefined}
           */
          next = function() {
            $(this).css(itemCSS);
            prevNext.call(this);
          };
          opts = option.easing || opts.easing;
          /** @type {string} */
          option = 0 < maxColumn ? h || m ? "all" : properties.left ? "left" : "top" : "none";
          css = {
            transitionDuration : (0 < maxColumn ? maxColumn / 1E3 : 0) + "s",
            transitionTimingFunction : opts,
            transitionProperty : option,
            transform : "none"
          };
        }
        if (m) {
          /** @type {string} */
          css.transform = "translate3d(" + (properties.left || 0) + "," + (properties.top || 0) + ",0)";
        } else {
          if (h) {
            /** @type {string} */
            css.transform = "translate(" + (properties.left || 0) + "," + (properties.top || 0) + ")";
          } else {
            $.extend(css, properties);
          }
        }
        if (leftToRight && 0 < maxColumn) {
          list.one("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", next);
        }
        list.css(css);
        if (0 >= maxColumn) {
          list.each(function() {
            next.call(this);
          });
        }
      }
    },
    _scroll : function(item, animate, callback) {
      if (this.animating) {
        return $.isFunction(callback) && callback.call(this, false), this;
      }
      if ("object" !== typeof item) {
        item = this.items().eq(item);
      } else {
        if ("undefined" === typeof item.jquery) {
          item = $(item);
        }
      }
      if (0 === item.length) {
        return $.isFunction(callback) && callback.call(this, false), this;
      }
      /** @type {boolean} */
      this.inTail = false;
      this._prepare(item);
      item = this._position(item);
      var value = this.list().position()[this.lt];
      if (item === value) {
        return $.isFunction(callback) && callback.call(this, false), this;
      }
      value = {};
      /** @type {string} */
      value[this.lt] = item + "px";
      this._animate(value, animate, callback);
      $(document).trigger("afterJcarouselScroll", this._target);
      return this;
    },
    _scrollTail : function(animate, callback) {
      if (this.animating || !this.tail) {
        return $.isFunction(callback) && callback.call(this, false), this;
      }
      var pos = this.list().position()[this.lt];
      if (this.rtl && this.relative && !this.vertical) {
        pos = pos + (this.list().width() - this.clipping());
      }
      pos = this.rtl && !this.vertical ? pos + this.tail : pos - this.tail;
      /** @type {boolean} */
      this.inTail = true;
      var properties = {};
      /** @type {string} */
      properties[this.lt] = pos + "px";
      this._update({
        target : this._target.next(),
        fullyvisible : this._fullyvisible.slice(1).add(this._visible.last())
      });
      this._animate(properties, animate, callback);
      return this;
    },
    _animate : function(props, callback, fn) {
      fn = fn || $.noop;
      if (false === this._trigger("animate")) {
        return fn.call(this, false), this;
      }
      /** @type {boolean} */
      this.animating = true;
      var options = this.options("animation");
      var getClasspathFromDependencies = $.proxy(function() {
        /** @type {boolean} */
        this.animating = false;
        var otweets = this.list().find("[data-jcarousel-clone]");
        if (0 < otweets.length) {
          otweets.remove();
          this._reload();
        }
        this._trigger("animateend");
        fn.call(this, true);
      }, this);
      options = "object" === typeof options ? $.extend({}, options) : {
        duration : options
      };
      /** @type {function(): undefined} */
      var intersection__3365 = options.complete || $.noop;
      if (false === callback) {
        /** @type {number} */
        options.duration = 0;
      } else {
        if ("undefined" !== typeof $.fx.speeds[options.duration]) {
          options.duration = $.fx.speeds[options.duration];
        }
      }
      /**
       * @return {undefined}
       */
      options.complete = function() {
        getClasspathFromDependencies();
        intersection__3365.call(this);
      };
      this.move(props, options);
      return this;
    },
    _prepare : function(item) {
      var index = this.index(item);
      var i = index;
      var wh = this.dimension(item);
      var clip = this.clipping();
      /** @type {string} */
      var lrb = this.vertical ? "bottom" : this.rtl ? "left" : "right";
      var center = this.options("center");
      var update = {
        target : item,
        first : item,
        last : item,
        visible : item,
        fullyvisible : wh <= clip ? item : $()
      };
      var curr;
      var props;
      if (center) {
        /** @type {number} */
        wh = wh / 2;
        /** @type {number} */
        clip = clip / 2;
      }
      if (wh < clip) {
        for (;;) {
          curr = this.items().eq(++i);
          if (0 === curr.length) {
            if (!this.circular) {
              break;
            }
            curr = this.items().eq(0);
            if (item.get(0) === curr.get(0)) {
              break;
            }
            if (props = 0 <= this._visible.index(curr)) {
              curr.after(curr.clone(true).attr("data-jcarousel-clone", true));
            }
            this.list().append(curr);
            if (!props) {
              props = {};
              props[this.lt] = this.dimension(curr);
              this.moveBy(props);
            }
            /** @type {null} */
            this._items = null;
          }
          props = this.dimension(curr);
          if (0 === props) {
            break;
          }
          wh = wh + props;
          update.last = curr;
          update.visible = update.visible.add(curr);
          props = toFloat(curr.css("margin-" + lrb));
          if (wh - props <= clip) {
            update.fullyvisible = update.fullyvisible.add(curr);
          }
          if (wh >= clip) {
            break;
          }
        }
      }
      if (!this.circular && !center && wh < clip) {
        i = index;
        for (; !(0 > --i);) {
          curr = this.items().eq(i);
          if (0 === curr.length) {
            break;
          }
          props = this.dimension(curr);
          if (0 === props) {
            break;
          }
          wh = wh + props;
          update.first = curr;
          update.visible = update.visible.add(curr);
          props = toFloat(curr.css("margin-" + lrb));
          if (wh - props <= clip) {
            update.fullyvisible = update.fullyvisible.add(curr);
          }
          if (wh >= clip) {
            break;
          }
        }
      }
      this._update(update);
      /** @type {number} */
      this.tail = 0;
      if (!(center || "circular" === this.options("wrap") || "custom" === this.options("wrap") || this.index(update.last) !== this.items().length - 1)) {
        /** @type {number} */
        wh = wh - toFloat(update.last.css("margin-" + lrb));
        if (wh > clip) {
          /** @type {number} */
          this.tail = wh - clip;
        }
      }
      return this;
    },
    _position : function(item) {
      var first = this._first;
      var pos = first.position()[this.lt];
      var center = this.options("center");
      /** @type {number} */
      var centerOffset = center ? this.clipping() / 2 - this.dimension(first) / 2 : 0;
      if (this.rtl && !this.vertical) {
        /** @type {number} */
        pos = this.relative ? pos - (this.list().width() - this.dimension(first)) : pos - (this.clipping() - this.dimension(first));
        /** @type {number} */
        pos = pos + centerOffset;
      } else {
        /** @type {number} */
        pos = pos - centerOffset;
      }
      if (!center && (this.index(item) > this.index(first) || this.inTail) && this.tail) {
        pos = this.rtl && !this.vertical ? pos - this.tail : pos + this.tail;
        /** @type {boolean} */
        this.inTail = true;
      } else {
        /** @type {boolean} */
        this.inTail = false;
      }
      return -pos;
    },
    _update : function(update) {
      var self = this;
      var current = {
        target : this._target || $(),
        first : this._first || $(),
        last : this._last || $(),
        visible : this._visible || $(),
        fullyvisible : this._fullyvisible || $()
      };
      /** @type {boolean} */
      var f = this.index(update.first || current.first) < this.index(current.first);
      var key;
      /**
       * @param {string} key
       * @return {undefined}
       */
      var doUpdate = function(key) {
        /** @type {!Array} */
        var e = [];
        /** @type {!Array} */
        var elIn = [];
        update[key].each(function() {
          if (0 > current[key].index(this)) {
            e.push(this);
          }
        });
        current[key].each(function() {
          if (0 > update[key].index(this)) {
            elIn.push(this);
          }
        });
        if (f) {
          /** @type {!Array} */
          e = e.reverse();
        } else {
          /** @type {!Array} */
          elIn = elIn.reverse();
        }
        self._trigger(key + "in", $(e));
        self._trigger(key + "out", $(elIn));
        self["_" + key] = update[key];
      };
      for (key in update) {
        doUpdate(key);
      }
      return this;
    }
  });
})(jQuery, window);
(function($) {
  /**
   * @param {string} index
   * @param {boolean} animate
   * @param {!Function} callback
   * @return {?}
   */
  $.jcarousel.fn.scrollIntoView = function(index, animate, callback) {
    index = $.jCarousel.parseTarget(index);
    var first = this.index(this._fullyvisible.first());
    var last = this.index(this._fullyvisible.last());
    index = index.relative ? 0 > index.target ? Math.max(0, first + index.target) : last + index.target : "object" !== typeof index.target ? index.target : this.index(index.target);
    if (index < first) {
      return this.scroll(index, animate, callback);
    }
    if (index >= first && index <= last) {
      return $.isFunction(callback) && callback.call(this, false), this;
    }
    var children = this.items();
    first = this.clipping();
    /** @type {string} */
    var lrb = this.vertical ? "bottom" : this.rtl ? "left" : "right";
    /** @type {number} */
    last = 0;
    var curr;
    for (;;) {
      curr = children.eq(index);
      if (0 === curr.length) {
        break;
      }
      last = last + this.dimension(curr);
      if (last >= first) {
        /** @type {number} */
        children = parseFloat(curr.css("margin-" + lrb)) || 0;
        if (last - children !== first) {
          index++;
        }
        break;
      }
      if (0 >= index) {
        break;
      }
      index--;
    }
    return this.scroll(index, animate, callback);
  };
})(jQuery);
(function($) {
  $.jCarousel.plugin("jcarouselControl", {
    _options : {
      target : "+=1",
      event : "click",
      method : "scroll"
    },
    _active : null,
    _init : function() {
      this.onDestroy = $.proxy(function() {
        this._destroy();
        this.carousel().one("jcarousel:createend", $.proxy(this._create, this));
      }, this);
      this.onReload = $.proxy(this._reload, this);
      this.onEvent = $.proxy(function(options) {
        options.preventDefault();
        options = this.options("method");
        if ($.isFunction(options)) {
          options.call(this);
        } else {
          this.carousel().jcarousel(this.options("method"), this.options("target"));
        }
      }, this);
    },
    _create : function() {
      this.carousel().one("jcarousel:destroy", this.onDestroy).on("jcarousel:reloadend jcarousel:scrollend", this.onReload);
      this._element.on(this.options("event") + ".jcarouselcontrol", this.onEvent);
      this._reload();
    },
    _destroy : function() {
      this._element.off(".jcarouselcontrol", this.onEvent);
      this.carousel().off("jcarousel:destroy", this.onDestroy).off("jcarousel:reloadend jcarousel:scrollend", this.onReload);
    },
    _reload : function() {
      var a = $.jCarousel.parseTarget(this.options("target"));
      var carousel = this.carousel();
      if (a.relative) {
        carousel = carousel.jcarousel(0 < a.target ? "hasNext" : "hasPrev");
      } else {
        a = "object" !== typeof a.target ? carousel.jcarousel("items").eq(a.target) : a.target;
        /** @type {boolean} */
        carousel = 0 <= carousel.jcarousel("target").index(a);
      }
      if (this._active !== carousel) {
        this._trigger(carousel ? "active" : "inactive");
        this._active = carousel;
      }
      return this;
    }
  });
})(jQuery);
(function($) {
  $.jCarousel.plugin("jcarouselPagination", {
    _options : {
      perPage : null,
      item : function(name) {
        return '<a href="#' + name + '">' + name + "</a>";
      },
      event : "click",
      method : "scroll"
    },
    _pages : {},
    _items : {},
    _currentPage : null,
    _init : function() {
      this.onDestroy = $.proxy(function() {
        this._destroy();
        this.carousel().one("jcarousel:createend", $.proxy(this._create, this));
      }, this);
      this.onReload = $.proxy(this._reload, this);
      this.onScroll = $.proxy(this._update, this);
    },
    _create : function() {
      this.carousel().one("jcarousel:destroy", this.onDestroy).on("jcarousel:reloadend", this.onReload).on("jcarousel:scrollend", this.onScroll);
      this._reload();
    },
    _destroy : function() {
      this._clear();
      this.carousel().off("jcarousel:destroy", this.onDestroy).off("jcarousel:reloadend", this.onReload).off("jcarousel:scrollend", this.onScroll);
    },
    _reload : function() {
      var perPage = this.options("perPage");
      this._pages = {};
      this._items = {};
      if ($.isFunction(perPage)) {
        perPage = perPage.call(this);
      }
      if (null == perPage) {
        this._pages = this._calculatePages();
      } else {
        /** @type {number} */
        perPage = parseInt(perPage, 10) || 0;
        var lines = this.carousel().jcarousel("items");
        /** @type {number} */
        var page = 1;
        /** @type {number} */
        var i = 0;
        var none;
        for (;;) {
          none = lines.eq(i++);
          if (0 === none.length) {
            break;
          }
          this._pages[page] = this._pages[page] ? this._pages[page].add(none) : none;
          if (0 === i % perPage) {
            page++;
          }
        }
      }
      this._clear();
      var self = this;
      var carousel = this.carousel().data("jcarousel");
      var container = this._element;
      var item = this.options("item");
      $.each(this._pages, function(page, id) {
        var $form = self._items[page] = $(item.call(self, page, id));
        $form.on(self.options("event") + ".jcarouselpagination", $.proxy(function() {
          var target = id.eq(0);
          if (carousel.circular) {
            var d = carousel.index(carousel.target());
            var t = carousel.index(target);
            if (parseFloat(page) > parseFloat(self._currentPage)) {
              if (t < d) {
                /** @type {string} */
                target = "+=" + (carousel.items().length - d + t);
              }
            } else {
              if (t > d) {
                /** @type {string} */
                target = "-=" + (d + (carousel.items().length - t));
              }
            }
          }
          carousel[this.options("method")](target);
        }, self));
        container.append($form);
      });
      this._update();
    },
    _update : function() {
      var a = this.carousel().jcarousel("target");
      var currentPage;
      $.each(this._pages, function(n, ticket_list) {
        ticket_list.each(function() {
          if (a.is(this)) {
            return currentPage = n, false;
          }
        });
        if (currentPage) {
          return false;
        }
      });
      if (this._currentPage !== currentPage) {
        this._trigger("inactive", this._items[this._currentPage]);
        this._trigger("active", this._items[currentPage]);
      }
      this._currentPage = currentPage;
    },
    items : function() {
      return this._items;
    },
    _clear : function() {
      this._element.empty();
      /** @type {null} */
      this._currentPage = null;
    },
    _calculatePages : function() {
      var carousel = this.carousel().data("jcarousel");
      var $ths2 = carousel.items();
      var maxReconnectTryTimes = carousel.clipping();
      /** @type {number} */
      var reconnectTryTimes = 0;
      /** @type {number} */
      var jj = 0;
      /** @type {number} */
      var j = 1;
      var selector = {};
      var i;
      for (;;) {
        i = $ths2.eq(jj++);
        if (0 === i.length) {
          break;
        }
        selector[j] = selector[j] ? selector[j].add(i) : i;
        reconnectTryTimes = reconnectTryTimes + carousel.dimension(i);
        if (reconnectTryTimes >= maxReconnectTryTimes) {
          j++;
          /** @type {number} */
          reconnectTryTimes = 0;
        }
      }
      return selector;
    }
  });
})(jQuery);
(function($) {
  $.jCarousel.plugin("jcarouselAutoscroll", {
    _options : {
      target : "+=1",
      interval : 3E3,
      autostart : true
    },
    _timer : null,
    _init : function() {
      this.onDestroy = $.proxy(function() {
        this._destroy();
        this.carousel().one("jcarousel:createend", $.proxy(this._create, this));
      }, this);
      this.onAnimateEnd = $.proxy(this.start, this);
    },
    _create : function() {
      this.carousel().one("jcarousel:destroy", this.onDestroy);
      if (this.options("autostart")) {
        this.start();
      }
    },
    _destroy : function() {
      this.stop();
      this.carousel().off("jcarousel:destroy", this.onDestroy);
    },
    start : function() {
      this.stop();
      this.carousel().one("jcarousel:animateend", this.onAnimateEnd);
      /** @type {number} */
      this._timer = setTimeout($.proxy(function() {
        this.carousel().jcarousel("scroll", this.options("target"));
      }, this), this.options("interval"));
      return this;
    },
    stop : function() {
      if (this._timer) {
        this._timer = clearTimeout(this._timer);
      }
      this.carousel().off("jcarousel:animateend", this.onAnimateEnd);
      return this;
    }
  });
})(jQuery);
jQuery.easing.jswing = jQuery.easing.swing;
jQuery.extend(jQuery.easing, {
  def : "easeOutQuad",
  swing : function(p, t, diff, n, c) {
    return jQuery.easing[jQuery.easing.def](p, t, diff, n, c);
  },
  easeInQuad : function(duration, t, b, c, d) {
    return c * (t = t / d) * t + b;
  },
  easeOutQuad : function(b, x, c, t, by) {
    return -t * (x = x / by) * (x - 2) + c;
  },
  easeInOutQuad : function(x, t, b, c, d) {
    return 1 > (t = t / (d / 2)) ? c / 2 * t * t + b : -c / 2 * (--t * (t - 2) - 1) + b;
  },
  easeInCubic : function(duration, t, b, c, d) {
    return c * (t = t / d) * t * t + b;
  },
  easeOutCubic : function(d, t, b, c, a) {
    return c * ((t = t / a - 1) * t * t + 1) + b;
  },
  easeInOutCubic : function(value, i, x, width, pos) {
    return 1 > (i = i / (pos / 2)) ? width / 2 * i * i * i + x : width / 2 * ((i = i - 2) * i * i + 2) + x;
  },
  easeInQuart : function(x, t, b, c, d) {
    return c * (t = t / d) * t * t * t + b;
  },
  easeOutQuart : function(t, d, pos, value, x) {
    return -value * ((d = d / x - 1) * d * d * d - 1) + pos;
  },
  easeInOutQuart : function(pos, x, c, width, value) {
    return 1 > (x = x / (value / 2)) ? width / 2 * x * x * x * x + c : -width / 2 * ((x = x - 2) * x * x * x - 2) + c;
  },
  easeInQuint : function(t, a, b, d, sx) {
    return d * (a = a / sx) * a * a * a * a + b;
  },
  easeOutQuint : function(t, d, b, c, dx) {
    return c * ((d = d / dx - 1) * d * d * d * d + 1) + b;
  },
  easeInOutQuint : function(t, i, x, width, pos) {
    return 1 > (i = i / (pos / 2)) ? width / 2 * i * i * i * i * i + x : width / 2 * ((i = i - 2) * i * i * i * i + 2) + x;
  },
  easeInSine : function(b, t, c, x, d) {
    return -x * Math.cos(t / d * (Math.PI / 2)) + x + c;
  },
  easeOutSine : function(pos, x, d, b, c) {
    return b * Math.sin(x / c * (Math.PI / 2)) + d;
  },
  easeInOutSine : function(x, t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  },
  easeInExpo : function(pos, d, i, t, n) {
    return 0 == d ? i : t * Math.pow(2, 10 * (d / n - 1)) + i;
  },
  easeOutExpo : function(x, t, b, c, d) {
    return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  },
  easeInOutExpo : function(duration, t, b, c, d) {
    return 0 == t ? b : t == d ? b + c : 1 > (t = t / (d / 2)) ? c / 2 * Math.pow(2, 10 * (t - 1)) + b : c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  easeInCirc : function(d, pos, value, change, duration) {
    return -change * (Math.sqrt(1 - (pos = pos / duration) * pos) - 1) + value;
  },
  easeOutCirc : function(d, t, b, x, c) {
    return x * Math.sqrt(1 - (t = t / c - 1) * t) + b;
  },
  easeInOutCirc : function(b, x, t, c, pos) {
    return 1 > (x = x / (pos / 2)) ? -c / 2 * (Math.sqrt(1 - x * x) - 1) + t : c / 2 * (Math.sqrt(1 - (x = x - 2) * x) + 1) + t;
  },
  easeInElastic : function(w, t, x_min, dx, d) {
    /** @type {number} */
    w = 0;
    /** @type {number} */
    var a = dx;
    if (0 == t) {
      return x_min;
    }
    if (1 == (t = t / d)) {
      return x_min + dx;
    }
    if (!w) {
      /** @type {number} */
      w = .3 * d;
    }
    if (a < Math.abs(dx)) {
      /** @type {number} */
      a = dx;
      /** @type {number} */
      dx = w / 4;
    } else {
      /** @type {number} */
      dx = w / (2 * Math.PI) * Math.asin(dx / a);
    }
    return -(a * Math.pow(2, 10 * --t) * Math.sin(2 * (t * d - dx) * Math.PI / w)) + x_min;
  },
  easeOutElastic : function(s, t, b, c, d) {
    /** @type {number} */
    var p = 0;
    /** @type {number} */
    var a = c;
    if (0 == t) {
      return b;
    }
    if (1 == (t = t / d)) {
      return b + c;
    }
    if (!p) {
      /** @type {number} */
      p = .3 * d;
    }
    if (a < Math.abs(c)) {
      /** @type {number} */
      a = c;
      /** @type {number} */
      s = p / 4;
    } else {
      /** @type {number} */
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin(2 * (t * d - s) * Math.PI / p) + c + b;
  },
  easeInOutElastic : function(s, t, x_min, dx, d) {
    /** @type {number} */
    var p = 0;
    /** @type {number} */
    var a = dx;
    if (0 == t) {
      return x_min;
    }
    if (2 == (t = t / (d / 2))) {
      return x_min + dx;
    }
    if (!p) {
      /** @type {number} */
      p = .3 * d * 1.5;
    }
    if (a < Math.abs(dx)) {
      /** @type {number} */
      a = dx;
      /** @type {number} */
      s = p / 4;
    } else {
      /** @type {number} */
      s = p / (2 * Math.PI) * Math.asin(dx / a);
    }
    return 1 > t ? -.5 * a * Math.pow(2, 10 * --t) * Math.sin(2 * (t * d - s) * Math.PI / p) + x_min : a * Math.pow(2, -10 * --t) * Math.sin(2 * (t * d - s) * Math.PI / p) * .5 + dx + x_min;
  },
  easeInBack : function(b, t, c, e, d, s) {
    if (void 0 == s) {
      /** @type {number} */
      s = 1.70158;
    }
    return e * (t = t / d) * t * ((s + 1) * t - s) + c;
  },
  easeOutBack : function(x, t, d, b, c, s) {
    if (void 0 == s) {
      /** @type {number} */
      s = 1.70158;
    }
    return b * ((t = t / c - 1) * t * ((s + 1) * t + s) + 1) + d;
  },
  easeInOutBack : function(x, t, b, c, d, s) {
    if (void 0 == s) {
      /** @type {number} */
      s = 1.70158;
    }
    return 1 > (t = t / (d / 2)) ? c / 2 * t * t * (((s = s * 1.525) + 1) * t - s) + b : c / 2 * ((t = t - 2) * t * (((s = s * 1.525) + 1) * t + s) + 2) + b;
  },
  easeInBounce : function(x, t, b, c, d) {
    return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
  },
  easeOutBounce : function(x, t, b, c, d) {
    return (t = t / d) < 1 / 2.75 ? 7.5625 * c * t * t + b : t < 2 / 2.75 ? c * (7.5625 * (t = t - 1.5 / 2.75) * t + .75) + b : t < 2.5 / 2.75 ? c * (7.5625 * (t = t - 2.25 / 2.75) * t + .9375) + b : c * (7.5625 * (t = t - 2.625 / 2.75) * t + .984375) + b;
  },
  easeInOutBounce : function(x, t, b, c, d) {
    return t < d / 2 ? .5 * jQuery.easing.easeInBounce(x, 2 * t, 0, c, d) + b : .5 * jQuery.easing.easeOutBounce(x, 2 * t - d, 0, c, d) + .5 * c + b;
  }
});
(function($) {
  /**
   * @param {undefined} key
   * @return {?}
   */
  function settings(key) {
    return $.data(key, "tooltip");
  }
  /**
   * @param {!Object} width
   * @return {undefined}
   */
  function handle(width) {
    if (settings(this).delay) {
      /** @type {number} */
      timer = setTimeout(show, settings(this).delay);
    } else {
      show();
    }
    /** @type {boolean} */
    t = !!settings(this).track;
    $(document.body).bind("mousemove", update);
    update(width);
  }
  /**
   * @return {undefined}
   */
  function save() {
    if (!$.tooltip.blocked && this != current && (this.tooltipText || settings(this).bodyHandler)) {
      current = this;
      title = this.tooltipText;
      if (settings(this).bodyHandler) {
        helper.title.hide();
        var content = settings(this).bodyHandler.call(this);
        if (content.nodeType || content.jquery) {
          helper.body.empty().append(content);
        } else {
          helper.body.html(content);
        }
        helper.body.show();
      } else {
        if (settings(this).showBody) {
          content = title.split(settings(this).showBody);
          helper.title.html(content.shift()).show();
          helper.body.empty();
          /** @type {number} */
          var i = 0;
          var cur;
          for (; cur = content[i]; i++) {
            if (0 < i) {
              helper.body.append("<br/>");
            }
            helper.body.append(cur);
          }
          helper.body.hideWhenEmpty();
        } else {
          helper.title.html(title).show();
          helper.body.hide();
        }
      }
      if (settings(this).showURL && $(this).url()) {
        helper.url.html($(this).url().replace("http://", "")).show();
      } else {
        helper.url.hide();
      }
      helper.parent.addClass(settings(this).extraClass);
      if (settings(this).fixPNG) {
        helper.parent.fixPNG();
      }
      handle.apply(this, arguments);
    }
  }
  /**
   * @return {undefined}
   */
  function show() {
    /** @type {null} */
    timer = null;
    if (IE && $.fn.bgiframe || !settings(current).fade) {
      helper.parent.show();
    } else {
      if (helper.parent.is(":animated")) {
        helper.parent.stop().show().fadeTo(settings(current).fade, current.tOpacity);
      } else {
        if (helper.parent.is(":visible")) {
          helper.parent.fadeTo(settings(current).fade, current.tOpacity);
        } else {
          helper.parent.fadeIn(settings(current).fade);
        }
      }
    }
    update();
  }
  /**
   * @param {!Object} a
   * @return {undefined}
   */
  function update(a) {
    if (!($.tooltip.blocked || a && "OPTION" == a.target.tagName)) {
      if (!t && helper.parent.is(":visible") && $(document.body).unbind("mousemove", update), null == current) {
        $(document.body).unbind("mousemove", update);
      } else {
        helper.parent.removeClass("viewport-right").removeClass("viewport-bottom");
        var x = helper.parent[0].offsetLeft;
        var top = helper.parent[0].offsetTop;
        if (a) {
          x = a.pageX + settings(current).left;
          top = a.pageY + settings(current).top;
          /** @type {string} */
          a = "auto";
          if (settings(current).positionLeft) {
            /** @type {number} */
            a = $(window).width() - x;
            /** @type {string} */
            x = "auto";
          }
          helper.parent.css({
            left : x,
            right : a,
            top : top
          });
        }
        a = $(window).scrollLeft();
        var g = $(window).scrollTop();
        var b = $(window).width();
        var scaleG = $(window).height();
        var calDiv = helper.parent[0];
        if (a + b < calDiv.offsetLeft + calDiv.offsetWidth) {
          /** @type {number} */
          x = x - (calDiv.offsetWidth + 20 + settings(current).left);
          helper.parent.css({
            left : x + "px"
          }).addClass("viewport-right");
        }
        if (g + scaleG < calDiv.offsetTop + calDiv.offsetHeight) {
          /** @type {number} */
          top = top - (calDiv.offsetHeight + 20 + settings(current).top);
          helper.parent.css({
            top : top + "px"
          }).addClass("viewport-bottom");
        }
      }
    }
  }
  /**
   * @param {?} keepCurrentModal
   * @return {undefined}
   */
  function hide(keepCurrentModal) {
    /**
     * @return {undefined}
     */
    function complete() {
      helper.parent.removeClass(tsettings.extraClass).hide().css("opacity", "");
    }
    if (!$.tooltip.blocked) {
      if (timer) {
        clearTimeout(timer);
      }
      /** @type {null} */
      current = null;
      var tsettings = settings(this);
      if (IE && $.fn.bgiframe || !tsettings.fade) {
        complete();
      } else {
        if (helper.parent.is(":animated")) {
          helper.parent.stop().fadeTo(tsettings.fade, 0, complete);
        } else {
          helper.parent.stop().fadeOut(tsettings.fade, complete);
        }
      }
      if (settings(this).fixPNG) {
        helper.parent.unfixPNG();
      }
    }
  }
  var helper = {};
  var current;
  var title;
  var timer;
  var IE = $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent);
  /** @type {boolean} */
  var t = false;
  $.tooltip = {
    blocked : false,
    defaults : {
      delay : 200,
      fade : false,
      showURL : true,
      extraClass : "",
      top : 15,
      left : 15,
      id : "tooltip"
    },
    block : function() {
      /** @type {boolean} */
      $.tooltip.blocked = !$.tooltip.blocked;
    }
  };
  $.fn.extend({
    tooltip : function(value) {
      value = $.extend({}, $.tooltip.defaults, value);
      if (!helper.parent) {
        helper.parent = $('<div id="' + value.id + '"><div class="body"></div><div class="url"></div></div>').appendTo(document.body).hide();
        if ($.fn.bgiframe) {
          helper.parent.bgiframe();
        }
        helper.title = $("h3", helper.parent);
        helper.body = $("div.body", helper.parent);
        helper.url = $("div.url", helper.parent);
      }
      return this.each(function() {
        $.data(this, "tooltip", value);
        this.tOpacity = helper.parent.css("opacity");
        this.tooltipText = this.title;
        $(this).removeAttr("title");
        /** @type {string} */
        this.alt = "";
      }).mouseover(save).mouseout(hide).click(hide);
    },
    fixPNG : IE ? function() {
      return this.each(function() {
        var id = $(this).css("backgroundImage");
        if (id.match(/^url\(["']?(.*\.png)["']?\)$/i)) {
          /** @type {string} */
          id = RegExp.$1;
          $(this).css({
            backgroundImage : "none",
            filter : "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + id + "')"
          }).each(function() {
            var basepath = $(this).css("position");
            if ("absolute" != basepath && "relative" != basepath) {
              $(this).css("position", "relative");
            }
          });
        }
      });
    } : function() {
      return this;
    },
    unfixPNG : IE ? function() {
      return this.each(function() {
        $(this).css({
          filter : "",
          backgroundImage : ""
        });
      });
    } : function() {
      return this;
    },
    hideWhenEmpty : function() {
      return this.each(function() {
        $(this)[$(this).html() ? "show" : "hide"]();
      });
    },
    url : function() {
      return this.attr("href") || this.attr("src");
    }
  });
})(jQuery);
(function($, window, infinite) {
  /**
   * @param {!Object} src
   * @return {?}
   */
  function normalize(src) {
    src = src || location.href;
    return "#" + src.replace(/^[^#]*#?(.*)$/, "$1");
  }
  /** @type {!HTMLDocument} */
  var doc = document;
  var e;
  var that = $.event.special;
  var iter = doc.documentMode;
  /** @type {boolean} */
  var supports_onhashchange = "onhashchange" in window && (iter === infinite || 7 < iter);
  /**
   * @param {!Function} callback
   * @return {?}
   */
  $.fn.hashchange = function(callback) {
    return callback ? this.bind("hashchange", callback) : this.trigger("hashchange");
  };
  /** @type {number} */
  $.fn.hashchange.delay = 50;
  that.hashchange = $.extend(that.hashchange, {
    setup : function() {
      if (supports_onhashchange) {
        return false;
      }
      $(e.start);
    },
    teardown : function() {
      if (supports_onhashchange) {
        return false;
      }
      $(e.stop);
    }
  });
  e = function() {
    /**
     * @return {undefined}
     */
    function start() {
      var x = normalize();
      var value = get(y);
      if (x !== y) {
        load(y = x, value);
        $(window).trigger("hashchange");
      } else {
        if (value !== y) {
          /** @type {string} */
          location.href = location.href.replace(/#.*/, "") + value;
        }
      }
      /** @type {number} */
      startTimeout = setTimeout(start, $.fn.hashchange.delay);
    }
    var subject = {};
    var startTimeout;
    var y = normalize();
    /**
     * @param {number} err
     * @return {?}
     */
    var date = function(err) {
      return err;
    };
    /** @type {function(number): ?} */
    var load = date;
    /** @type {function(number): ?} */
    var get = date;
    /**
     * @return {undefined}
     */
    subject.start = function() {
      if (!startTimeout) {
        start();
      }
    };
    /**
     * @return {undefined}
     */
    subject.stop = function() {
      if (startTimeout) {
        clearTimeout(startTimeout);
      }
      /** @type {number} */
      startTimeout = infinite;
    };
    if ($.browser.msie && !supports_onhashchange) {
      (function() {
        var window;
        var base;
        /**
         * @return {undefined}
         */
        subject.start = function() {
          if (!window) {
            base = (base = $.fn.hashchange.src) && base + normalize();
            window = $('<iframe tabindex="-1" title="empty"/>').hide().one("load", function() {
              if (!base) {
                load(normalize());
              }
              start();
            }).attr("src", base || "javascript:0").insertAfter("body")[0].contentWindow;
            /**
             * @return {undefined}
             */
            doc.onpropertychange = function() {
              try {
                if ("title" === event.propertyName) {
                  /** @type {string} */
                  window.document.title = doc.title;
                }
              } catch (y) {
              }
            };
          }
        };
        /** @type {function(number): ?} */
        subject.stop = date;
        /**
         * @return {?}
         */
        get = function() {
          return normalize(window.location.href);
        };
        /**
         * @param {!Object} id
         * @param {?} e
         * @return {undefined}
         */
        load = function(id, e) {
          var document = window.document;
          var httpfa = $.fn.hashchange.domain;
          if (id !== e) {
            /** @type {string} */
            document.title = doc.title;
            document.open();
            if (httpfa) {
              document.write('<script>document.domain="' + httpfa + '"\x3c/script>');
            }
            document.close();
            /** @type {!Object} */
            window.location.hash = id;
          }
        };
      })();
    }
    return subject;
  }();
})(jQuery, this);
(function($, selector, outside) {
  /**
   * @param {string} event_name
   * @param {string} outside_event_name
   * @return {undefined}
   */
  function jq_addOutsideEvent(event_name, outside_event_name) {
    /**
     * @param {!Event} event
     * @return {undefined}
     */
    function initialize(event) {
      $(k).each(function() {
        var elem = $(this);
        if (!(this === event.target || elem.has(event.target).length)) {
          elem.triggerHandler(outside_event_name, [event.target]);
        }
      });
    }
    outside_event_name = outside_event_name || event_name + outside;
    var k = $();
    /** @type {string} */
    var h = event_name + "." + outside_event_name + "-special-event";
    $.event.special[outside_event_name] = {
      setup : function() {
        k = k.add(this);
        if (1 === k.length) {
          $(selector).bind(h, initialize);
        }
      },
      teardown : function() {
        k = k.not(this);
        if (0 === k.length) {
          $(selector).unbind(h);
        }
      },
      add : function(name) {
        /** @type {function(!Object, string): undefined} */
        var j = name.handler;
        /**
         * @param {!Object} name
         * @param {string} value
         * @return {undefined}
         */
        name.handler = function(name, value) {
          /** @type {string} */
          name.target = value;
          j.apply(this, arguments);
        };
      }
    };
  }
  $.map("click dblclick mousemove mousedown mouseup mouseover mouseout change select submit keydown keypress keyup".split(" "), function(event_name) {
    jq_addOutsideEvent(event_name);
  });
  jq_addOutsideEvent("focusin", "focus" + outside);
  jq_addOutsideEvent("focusout", "blur" + outside);
  /** @type {function(string, string): undefined} */
  $.addOutsideEvent = jq_addOutsideEvent;
})(jQuery, document, "outside");
(function($) {
  $.extend($.fn, {
    validate : function(options) {
      if (this.length) {
        var validator = $.data(this[0], "validator");
        if (validator) {
          return validator;
        }
        this.attr("novalidate", "novalidate");
        validator = new $.validator(options, this[0]);
        $.data(this[0], "validator", validator);
        if (validator.settings.onsubmit) {
          options = this.find("input, button");
          options.filter(".cancel").click(function() {
            /** @type {boolean} */
            validator.cancelSubmit = true;
          });
          if (validator.settings.submitHandler) {
            options.filter(":submit").click(function() {
              validator.submitButton = this;
            });
          }
          this.submit(function(event) {
            /**
             * @return {?}
             */
            function handle() {
              if (validator.settings.submitHandler) {
                if (validator.submitButton) {
                  var exMap = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
                }
                validator.settings.submitHandler.call(validator, validator.currentForm);
                if (validator.submitButton) {
                  exMap.remove();
                }
                return false;
              }
              return true;
            }
            if (validator.settings.debug) {
              event.preventDefault();
            }
            if (validator.cancelSubmit) {
              return validator.cancelSubmit = false, handle();
            }
            if (validator.form()) {
              return validator.pendingRequest ? (validator.formSubmitted = true, false) : handle();
            }
            validator.focusInvalid();
            return false;
          });
        }
        return validator;
      }
      if (options && options.debug && window.console) {
        console.warn("nothing selected, can't validate, returning nothing");
      }
    },
    valid : function() {
      if ($(this[0]).is("form")) {
        return this.validate().form();
      }
      /** @type {boolean} */
      var valid = true;
      var oStartData = $(this[0].form).validate();
      this.each(function() {
        /** @type {number} */
        valid = valid & oStartData.element(this);
      });
      return valid;
    },
    removeAttrs : function(attrs) {
      var result = {};
      var currentSelectBoxOption = this;
      $.each(attrs.split(/\s/), function(a, value) {
        result[value] = currentSelectBoxOption.attr(value);
        currentSelectBoxOption.removeAttr(value);
      });
      return result;
    },
    rules : function(method, argument) {
      var element = this[0];
      if (method) {
        var settings = $.data(element.form, "validator").settings;
        var data = settings.rules;
        var p = $.validator.staticRules(element);
        switch(method) {
          case "add":
            $.extend(p, $.validator.normalizeRule(argument));
            data[element.name] = p;
            if (argument.messages) {
              settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
            }
            break;
          case "remove":
            if (!argument) {
              return delete data[element.name], p;
            }
            var formattedParams = {};
            $.each(argument.split(/\s/), function(a, j) {
              formattedParams[j] = p[j];
              delete p[j];
            });
            return formattedParams;
        }
      }
      method = $.validator.normalizeRules($.extend({}, $.validator.metadataRules(element), $.validator.classRules(element), $.validator.attributeRules(element), $.validator.staticRules(element)), element);
      if (method.required) {
        argument = method.required;
        delete method.required;
        method = $.extend({
          required : argument
        }, method);
      }
      return method;
    }
  });
  $.extend($.expr[":"], {
    blank : function(a) {
      return !$.trim("" + a.value);
    },
    filled : function(a) {
      return !!$.trim("" + a.value);
    },
    unchecked : function(a) {
      return !a.checked;
    }
  });
  /**
   * @param {?} options
   * @param {string} form
   * @return {undefined}
   */
  $.validator = function(options, form) {
    this.settings = $.extend(true, {}, $.validator.defaults, options);
    /** @type {string} */
    this.currentForm = form;
    this.init();
  };
  /**
   * @param {string} url
   * @param {string} params
   * @return {?}
   */
  $.validator.format = function(url, params) {
    if (1 == arguments.length) {
      return function() {
        var c = $.makeArray(arguments);
        c.unshift(url);
        return $.validator.format.apply(this, c);
      };
    }
    if (2 < arguments.length && params.constructor != Array) {
      params = $.makeArray(arguments).slice(1);
    }
    if (params.constructor != Array) {
      /** @type {!Array} */
      params = [params];
    }
    $.each(params, function(b, osPath) {
      url = url.replace(new RegExp("\\{" + b + "\\}", "g"), osPath);
    });
    return url;
  };
  $.extend($.validator, {
    defaults : {
      messages : {},
      groups : {},
      rules : {},
      errorClass : "error",
      validClass : "valid",
      errorElement : "label",
      focusInvalid : true,
      errorContainer : $([]),
      errorLabelContainer : $([]),
      onsubmit : true,
      ignore : "input:hidden, textarea:hidden",
      ignoreTitle : false,
      onfocusin : function(element, event) {
        this.lastActive = element;
        if (this.settings.focusCleanup && !this.blockFocusCleanup) {
          if (this.settings.unhighlight) {
            this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
          }
          this.addWrapper(this.errorsFor(element)).hide();
        }
      },
      onfocusout : function(element, event) {
        if (!(this.checkable(element) || !(element.name in this.submitted) && this.optional(element))) {
          this.element(element);
        }
      },
      onkeyup : function(element, event) {
        if (element.name in this.submitted || element == this.lastElement) {
          this.element(element);
        }
      },
      onclick : function(element, event) {
        if (element.name in this.submitted) {
          this.element(element);
        } else {
          if (element.parentNode.name in this.submitted) {
            this.element(element.parentNode);
          }
        }
      },
      highlight : function(el, widget, className) {
        if ("radio" === el.type) {
          this.findByName(el.name).addClass(widget).removeClass(className);
        } else {
          $(el).addClass(widget).removeClass(className);
        }
      },
      unhighlight : function(element, errorClass, validClass) {
        if ("radio" === element.type) {
          this.findByName(element.name).removeClass(errorClass).addClass(validClass);
        } else {
          $(element).removeClass(errorClass).addClass(validClass);
        }
      }
    },
    setDefaults : function(settings) {
      $.extend($.validator.defaults, settings);
    },
    messages : {
      required : "This field is required.",
      remote : "Please fix this field.",
      email : "Please enter a valid email address.",
      url : "Please enter a valid URL.",
      date : "Please enter a valid date.",
      dateISO : "Please enter a valid date (ISO).",
      number : "Please enter a valid number.",
      digits : "Please enter only digits.",
      creditcard : "Please enter a valid credit card number.",
      equalTo : "Please enter the same value again.",
      accept : "Please enter a value with a valid extension.",
      maxlength : $.validator.format("Please enter no more than {0} characters."),
      minlength : $.validator.format("Please enter at least {0} characters."),
      rangelength : $.validator.format("Please enter a value between {0} and {1} characters long."),
      range : $.validator.format("Please enter a value between {0} and {1}."),
      max : $.validator.format("Please enter a value less than or equal to {0}."),
      min : $.validator.format("Please enter a value greater than or equal to {0}.")
    },
    autoCreateRanges : false,
    prototype : {
      init : function() {
        /**
         * @param {string} event
         * @return {undefined}
         */
        function delegate(event) {
          var validator = $.data(this[0].form, "validator");
          var eventType = "on" + event.type.replace(/^validate/, "");
          if (validator.settings[eventType]) {
            validator.settings[eventType].call(validator, this[0], event);
          }
        }
        this.labelContainer = $(this.settings.errorLabelContainer);
        this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
        this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
        this.submitted = {};
        this.valueCache = {};
        /** @type {number} */
        this.pendingRequest = 0;
        this.pending = {};
        this.invalid = {};
        this.reset();
        var groups = this.groups = {};
        $.each(this.settings.groups, function($this, clusterShardData) {
          $.each(clusterShardData.split(/\s/), function(b, i) {
            groups[i] = $this;
          });
        });
        var rules = this.settings.rules;
        $.each(rules, function(name, value) {
          rules[name] = $.validator.normalizeRule(value);
        });
        $(this.currentForm).validateDelegate("[type='text'], [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ", "focusin focusout keyup", delegate).validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);
        if (this.settings.invalidHandler) {
          $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
        }
      },
      form : function() {
        this.checkForm();
        $.extend(this.submitted, this.errorMap);
        this.invalid = $.extend({}, this.errorMap);
        if (!this.valid()) {
          $(this.currentForm).triggerHandler("invalid-form", [this]);
        }
        this.showErrors();
        return this.valid();
      },
      checkForm : function() {
        this.prepareForm();
        /** @type {number} */
        var i = 0;
        var elements = this.currentElements = this.elements();
        for (; elements[i]; i++) {
          this.check(elements[i]);
        }
        return this.valid();
      },
      element : function(name) {
        this.lastElement = name = this.validationTargetFor(this.clean(name));
        this.prepareElement(name);
        this.currentElements = $(name);
        var result = this.check(name);
        if (result) {
          delete this.invalid[name.name];
        } else {
          /** @type {boolean} */
          this.invalid[name.name] = true;
        }
        if (!this.numberOfInvalids()) {
          this.toHide = this.toHide.add(this.containers);
        }
        this.showErrors();
        return result;
      },
      showErrors : function(errors) {
        if (errors) {
          $.extend(this.errorMap, errors);
          /** @type {!Array} */
          this.errorList = [];
          var name;
          for (name in errors) {
            this.errorList.push({
              message : errors[name],
              element : this.findByName(name)[0]
            });
          }
          this.successList = $.grep(this.successList, function(element) {
            return !(element.name in errors);
          });
        }
        if (this.settings.showErrors) {
          this.settings.showErrors.call(this, this.errorMap, this.errorList);
        } else {
          this.defaultShowErrors();
        }
      },
      resetForm : function() {
        if ($.fn.resetForm) {
          $(this.currentForm).resetForm();
        }
        this.submitted = {};
        /** @type {null} */
        this.lastElement = null;
        this.prepareForm();
        this.hideErrors();
        this.elements().removeClass(this.settings.errorClass);
      },
      numberOfInvalids : function() {
        return this.objectLength(this.invalid);
      },
      objectLength : function(o) {
        /** @type {number} */
        var count = 0;
        var k;
        for (k in o) {
          count++;
        }
        return count;
      },
      hideErrors : function() {
        this.addWrapper(this.toHide).hide();
      },
      valid : function() {
        return 0 == this.size();
      },
      size : function() {
        return this.errorList.length;
      },
      focusInvalid : function() {
        if (this.settings.focusInvalid) {
          try {
            $(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin");
          } catch (a) {
          }
        }
      },
      findLastActive : function() {
        var lastActive = this.lastActive;
        return lastActive && 1 == $.grep(this.errorList, function(b) {
          return b.element.name == lastActive.name;
        }).length && lastActive;
      },
      elements : function() {
        var validator = this;
        var rulesCache = {};
        return $(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function() {
          if (!this.name && validator.settings.debug && window.console) {
            console.error("%o has no name assigned", this);
          }
          return this.name in rulesCache || !validator.objectLength($(this).rules()) ? false : rulesCache[this.name] = true;
        });
      },
      clean : function(s) {
        return $(s)[0];
      },
      errors : function() {
        return $(this.settings.errorElement + "." + this.settings.errorClass, this.errorContext);
      },
      reset : function() {
        /** @type {!Array} */
        this.successList = [];
        /** @type {!Array} */
        this.errorList = [];
        this.errorMap = {};
        this.toShow = $([]);
        this.toHide = $([]);
        this.currentElements = $([]);
      },
      prepareForm : function() {
        this.reset();
        this.toHide = this.errors().add(this.containers);
      },
      prepareElement : function(element) {
        this.reset();
        this.toHide = this.errorsFor(element);
      },
      check : function(element) {
        element = this.validationTargetFor(this.clean(element));
        var rules = $(element).rules();
        /** @type {boolean} */
        var c = false;
        var method;
        for (method in rules) {
          var rule = {
            method : method,
            parameters : rules[method]
          };
          try {
            var current = $.validator.methods[method].call(this, element.value.replace(/\r/g, ""), element, rule.parameters);
            if ("dependency-mismatch" == current) {
              /** @type {boolean} */
              c = true;
            } else {
              /** @type {boolean} */
              c = false;
              if ("pending" == current) {
                this.toHide = this.toHide.not(this.errorsFor(element));
                return;
              }
              if (!current) {
                return this.formatAndAdd(element, rule), false;
              }
            }
          } catch (size_buffer) {
            throw this.settings.debug && window.console && console.log("exception occured when checking element " + element.id + ", check the '" + rule.method + "' method", size_buffer), size_buffer;
          }
        }
        if (!c) {
          return this.objectLength(rules) && this.successList.push(element), true;
        }
      },
      customMetaMessage : function(element, method) {
        if ($.metadata) {
          return (element = this.settings.meta ? $(element).metadata()[this.settings.meta] : $(element).metadata()) && element.messages && element.messages[method];
        }
      },
      customMessage : function(rule, method) {
        return (rule = this.settings.messages[rule]) && (rule.constructor == String ? rule : rule[method]);
      },
      findDefined : function() {
        /** @type {number} */
        var i = 0;
        for (; i < arguments.length; i++) {
          if (void 0 !== arguments[i]) {
            return arguments[i];
          }
        }
      },
      defaultMessage : function(element, method) {
        return this.findDefined(this.customMessage(element.name, method), this.customMetaMessage(element, method), !this.settings.ignoreTitle && element.title || void 0, $.validator.messages[method], "<strong>Warning: No message defined for " + element.name + "</strong>");
      },
      formatAndAdd : function(element, rule) {
        var message = this.defaultMessage(element, rule.method);
        /** @type {!RegExp} */
        var theregex = /\$?\{(\d+)\}/g;
        if ("function" == typeof message) {
          message = message.call(this, rule.parameters, element);
        } else {
          if (theregex.test(message)) {
            message = jQuery.format(message.replace(theregex, "{$1}"), rule.parameters);
          }
        }
        this.errorList.push({
          message : message,
          element : element
        });
        this.errorMap[element.name] = message;
        this.submitted[element.name] = message;
      },
      addWrapper : function(toToggle) {
        if (this.settings.wrapper) {
          toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
        }
        return toToggle;
      },
      defaultShowErrors : function() {
        /** @type {number} */
        var i = 0;
        for (; this.errorList[i]; i++) {
          var error = this.errorList[i];
          if (this.settings.highlight) {
            this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
          }
          this.showLabel(error.element, error.message);
        }
        if (this.errorList.length) {
          this.toShow = this.toShow.add(this.containers);
        }
        if (this.settings.success) {
          /** @type {number} */
          i = 0;
          for (; this.successList[i]; i++) {
            this.showLabel(this.successList[i]);
          }
        }
        if (this.settings.unhighlight) {
          /** @type {number} */
          i = 0;
          error = this.validElements();
          for (; error[i]; i++) {
            this.settings.unhighlight.call(this, error[i], this.settings.errorClass, this.settings.validClass);
          }
        }
        this.toHide = this.toHide.not(this.toShow);
        this.hideErrors();
        this.addWrapper(this.toShow).show();
      },
      validElements : function() {
        return this.currentElements.not(this.invalidElements());
      },
      invalidElements : function() {
        return $(this.errorList).map(function() {
          return this.element;
        });
      },
      showLabel : function(element, message) {
        var label = this.errorsFor(element);
        if (label.length) {
          label.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
          if (label.data("generated") || label.attr("generated")) {
            label.html(message);
          }
        } else {
          label = $("<" + this.settings.errorElement + "/>").attr({
            "data-for" : this.idOrName(element),
            "data-generated" : true
          }).addClass(this.settings.errorClass).html(message || "");
          if (this.settings.wrapper) {
            label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
          }
          if (!this.labelContainer.append(label).length) {
            if (this.settings.errorPlacement) {
              this.settings.errorPlacement(label, $(element));
            } else {
              label.insertAfter(element);
            }
          }
        }
        if (!message && this.settings.success) {
          label.text("");
          if ("string" == typeof this.settings.success) {
            label.addClass(this.settings.success);
          } else {
            this.settings.success(label);
          }
        }
        this.toShow = this.toShow.add(label);
      },
      errorsFor : function(element) {
        var name = this.idOrName(element);
        return this.errors().filter(function() {
          return $(this).data("for") == name || $(this).attr("for") == name;
        });
      },
      idOrName : function(element) {
        return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
      },
      validationTargetFor : function(element) {
        if (this.checkable(element)) {
          element = this.findByName(element.name).not(this.settings.ignore)[0];
        }
        return element;
      },
      checkable : function(element) {
        return /radio|checkbox/i.test(element.type);
      },
      findByName : function(name) {
        return $(this.currentForm).find("[name='" + name + "']");
      },
      getLength : function(value, element) {
        switch(element.nodeName.toLowerCase()) {
          case "select":
            return $("option:selected", element).length;
          case "input":
            if (this.checkable(element)) {
              return this.findByName(element.name).filter(":checked").length;
            }
        }
        return value.length;
      },
      depend : function(param, element) {
        return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
      },
      dependTypes : {
        "boolean" : function(val, options) {
          return val;
        },
        string : function(elem, data) {
          return !!$(elem, data.form).length;
        },
        "function" : function(param, element) {
          return param(element);
        }
      },
      optional : function(data) {
        return !$.validator.methods.required.call(this, $.trim(data.value), data) && "dependency-mismatch";
      },
      startRequest : function(element) {
        if (!this.pending[element.name]) {
          this.pendingRequest++;
          /** @type {boolean} */
          this.pending[element.name] = true;
        }
      },
      stopRequest : function(element, valid) {
        this.pendingRequest--;
        if (0 > this.pendingRequest) {
          /** @type {number} */
          this.pendingRequest = 0;
        }
        delete this.pending[element.name];
        if (valid && 0 == this.pendingRequest && this.formSubmitted && this.form()) {
          $(this.currentForm).submit();
          /** @type {boolean} */
          this.formSubmitted = false;
        } else {
          if (!valid && 0 == this.pendingRequest && this.formSubmitted) {
            $(this.currentForm).triggerHandler("invalid-form", [this]);
            /** @type {boolean} */
            this.formSubmitted = false;
          }
        }
      },
      previousValue : function(element) {
        return $.data(element, "previousValue") || $.data(element, "previousValue", {
          old : null,
          valid : true,
          message : this.defaultMessage(element, "remote")
        });
      }
    },
    classRuleSettings : {
      required : {
        required : true
      },
      email : {
        email : true
      },
      url : {
        url : true
      },
      date : {
        date : true
      },
      dateISO : {
        dateISO : true
      },
      dateDE : {
        dateDE : true
      },
      number : {
        number : true
      },
      numberDE : {
        numberDE : true
      },
      digits : {
        digits : true
      },
      creditcard : {
        creditcard : true
      }
    },
    addClassRules : function(className, rules) {
      if (className.constructor == String) {
        this.classRuleSettings[className] = rules;
      } else {
        $.extend(this.classRuleSettings, className);
      }
    },
    classRules : function(item) {
      var rules = {};
      if (item = $(item).attr("class")) {
        $.each(item.split(" "), function() {
          if (this in $.validator.classRuleSettings) {
            $.extend(rules, $.validator.classRuleSettings[this]);
          }
        });
      }
      return rules;
    },
    attributeRules : function(element) {
      var rules = {};
      element = $(element);
      var type;
      for (type in $.validator.methods) {
        var conf;
        if (conf = "required" === type && "function" === typeof $.fn.prop ? element.prop(type) : element.attr(type)) {
          rules[type] = conf;
        } else {
          if (element[0].getAttribute("type") === type) {
            /** @type {boolean} */
            rules[type] = true;
          }
        }
      }
      if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
        delete rules.maxlength;
      }
      return rules;
    },
    metadataRules : function(element) {
      if (!$.metadata) {
        return {};
      }
      var meta = $.data(element.form, "validator").settings.meta;
      return meta ? $(element).metadata()[meta] : $(element).metadata();
    },
    staticRules : function(element) {
      var rules = {};
      var validator = $.data(element.form, "validator");
      if (validator.settings.rules) {
        rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
      }
      return rules;
    },
    normalizeRules : function(rules, element) {
      $.each(rules, function(languageCode, val) {
        if (false === val) {
          delete rules[languageCode];
        } else {
          if (val.param || val.depends) {
            /** @type {boolean} */
            var $elementsCovered = true;
            switch(typeof val.depends) {
              case "string":
                /** @type {boolean} */
                $elementsCovered = !!$(val.depends, element.form).length;
                break;
              case "function":
                $elementsCovered = val.depends.call(element, element);
            }
            if ($elementsCovered) {
              rules[languageCode] = void 0 !== val.param ? val.param : true;
            } else {
              delete rules[languageCode];
            }
          }
        }
      });
      $.each(rules, function(rule, parameter) {
        rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
      });
      $.each(["minlength", "maxlength", "min", "max"], function() {
        if (rules[this]) {
          /** @type {number} */
          rules[this] = Number(rules[this]);
        }
      });
      $.each(["rangelength", "range"], function() {
        if (rules[this]) {
          /** @type {!Array} */
          rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
        }
      });
      if ($.validator.autoCreateRanges) {
        if (rules.min && rules.max) {
          /** @type {!Array} */
          rules.range = [rules.min, rules.max];
          delete rules.min;
          delete rules.max;
        }
        if (rules.minlength && rules.maxlength) {
          /** @type {!Array} */
          rules.rangelength = [rules.minlength, rules.maxlength];
          delete rules.minlength;
          delete rules.maxlength;
        }
      }
      if (rules.messages) {
        delete rules.messages;
      }
      return rules;
    },
    normalizeRule : function(data) {
      if ("string" == typeof data) {
        var pathOrData = {};
        $.each(data.split(/\s/), function() {
          /** @type {boolean} */
          pathOrData[this] = true;
        });
        data = pathOrData;
      }
      return data;
    },
    addMethod : function(name, fn, data) {
      /** @type {!Function} */
      $.validator.methods[name] = fn;
      $.validator.messages[name] = void 0 != data ? data : $.validator.messages[name];
      if (3 > fn.length) {
        $.validator.addClassRules(name, $.validator.normalizeRule(name));
      }
    },
    methods : {
      required : function(value, element, param) {
        if (!this.depend(param, element)) {
          return "dependency-mismatch";
        }
        switch(element.nodeName.toLowerCase()) {
          case "select":
            return (value = $(element).val()) && 0 < value.length;
          case "input":
            if (this.checkable(element)) {
              return 0 < this.getLength(value, element);
            }
          default:
            return 0 < $.trim(value).length;
        }
      },
      remote : function(value, element, options) {
        if (this.optional(element)) {
          return "dependency-mismatch";
        }
        var previous = this.previousValue(element);
        if (!this.settings.messages[element.name]) {
          this.settings.messages[element.name] = {};
        }
        previous.originalMessage = this.settings.messages[element.name].remote;
        this.settings.messages[element.name].remote = previous.message;
        options = "string" == typeof options && {
          url : options
        } || options;
        if (this.pending[element.name]) {
          return "pending";
        }
        if (previous.old === value) {
          return previous.valid;
        }
        /** @type {!Object} */
        previous.old = value;
        var validator = this;
        this.startRequest(element);
        var data = {};
        /** @type {!Object} */
        data[element.name] = value;
        $.ajax($.extend(true, {
          url : options,
          mode : "abort",
          port : "validate" + element.name,
          dataType : "json",
          data : data,
          success : function(message) {
            validator.settings.messages[element.name].remote = previous.originalMessage;
            /** @type {boolean} */
            var valid = true === message;
            if (valid) {
              var errors = validator.formSubmitted;
              validator.prepareElement(element);
              validator.formSubmitted = errors;
              validator.successList.push(element);
              validator.showErrors();
            } else {
              errors = {};
              message = message || validator.defaultMessage(element, "remote");
              errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
              validator.showErrors(errors);
            }
            /** @type {boolean} */
            previous.valid = valid;
            validator.stopRequest(element, valid);
          }
        }, options));
        return "pending";
      },
      minlength : function(value, element, param) {
        return this.optional(element) || this.getLength($.trim(value), element) >= param;
      },
      maxlength : function(value, element, param) {
        return this.optional(element) || this.getLength($.trim(value), element) <= param;
      },
      rangelength : function(value, element, param) {
        value = this.getLength($.trim(value), element);
        return this.optional(element) || value >= param[0] && value <= param[1];
      },
      min : function(value, element, param) {
        return this.optional(element) || value >= param;
      },
      max : function(value, element, param) {
        return this.optional(element) || value <= param;
      },
      range : function(name, value, obj) {
        return this.optional(value) || name >= obj[0] && name <= obj[1];
      },
      email : function(value, element) {
        return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
      },
      url : function(name, value) {
        return this.optional(value) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(name);
      },
      date : function(value, element) {
        return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
      },
      dateISO : function(value, element) {
        return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
      },
      number : function(value, element) {
        return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
      },
      digits : function(value, element) {
        return this.optional(element) || /^\d+$/.test(value);
      },
      creditcard : function(value, element) {
        if (this.optional(element)) {
          return "dependency-mismatch";
        }
        if (/[^0-9 -]+/.test(value)) {
          return false;
        }
        /** @type {number} */
        element = 0;
        var t;
        /** @type {boolean} */
        var d = false;
        value = value.replace(/\D/g, "");
        /** @type {number} */
        var i = value.length - 1;
        for (; 0 <= i; i--) {
          t = value.charAt(i);
          /** @type {number} */
          t = parseInt(t, 10);
          if (d && 9 < (t = t * 2)) {
            /** @type {number} */
            t = t - 9;
          }
          /** @type {number} */
          element = element + t;
          /** @type {boolean} */
          d = !d;
        }
        return 0 == element % 10;
      },
      accept : function(name, value, type) {
        /** @type {string} */
        type = "string" == typeof type ? type.replace(/,/g, "|") : "png|jpe?g|gif";
        return this.optional(value) || name.match(new RegExp(".(" + type + ")$", "i"));
      },
      equalTo : function(param, value, element) {
        element = $(element).unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
          $(value).valid();
        });
        return param == element.val();
      }
    }
  });
  /** @type {function(string, string): ?} */
  $.format = $.validator.format;
})(jQuery);
(function($) {
  var pendingRequests = {};
  if ($.ajaxPrefilter) {
    $.ajaxPrefilter(function(other, i, promise) {
      i = other.port;
      if ("abort" == other.mode) {
        if (pendingRequests[i]) {
          pendingRequests[i].abort();
        }
        pendingRequests[i] = promise;
      }
    });
  } else {
    var ajax = $.ajax;
    /**
     * @param {!Object} settings
     * @return {?}
     */
    $.ajax = function(settings) {
      var port = ("port" in settings ? settings : $.ajaxSettings).port;
      return "abort" == ("mode" in settings ? settings : $.ajaxSettings).mode ? (pendingRequests[port] && pendingRequests[port].abort(), pendingRequests[port] = ajax.apply(this, arguments)) : ajax.apply(this, arguments);
    };
  }
})(jQuery);
(function($) {
  if (!(jQuery.event.special.focusin || jQuery.event.special.focusout || !document.addEventListener)) {
    $.each({
      focus : "focusin",
      blur : "focusout"
    }, function(type, fix) {
      /**
       * @param {!Object} event
       * @return {?}
       */
      function handler(event) {
        event = $.event.fix(event);
        /** @type {!Object} */
        event.type = fix;
        return $.event.handle.call(this, event);
      }
      $.event.special[fix] = {
        setup : function() {
          this.addEventListener(type, handler, true);
        },
        teardown : function() {
          this.removeEventListener(type, handler, true);
        },
        handler : function(name) {
          arguments[0] = $.event.fix(name);
          /** @type {!Object} */
          arguments[0].type = fix;
          return $.event.handle.apply(this, arguments);
        }
      };
    });
  }
  $.extend($.fn, {
    validateDelegate : function(delegate, type, handler) {
      return this.bind(type, function(jEvent) {
        var target = $(jEvent.target);
        if (target.is(delegate)) {
          return handler.apply(target, arguments);
        }
      });
    }
  });
})(jQuery);
(function($) {
  /**
   * @param {string} container
   * @return {undefined}
   */
  function addAccountInfo(container) {
    $.ajax({
      url : "https://gdata.youtube.com/feeds/api/videos/" + container + "?v=2&alt=json",
      dataType : "jsonp",
      cache : true,
      success : function(data) {
        dialog.dialog({
          title : data.entry.title.$t
        });
      }
    });
  }
  /**
   * @param {string} url
   * @return {?}
   */
  function _launch(url) {
    return (url = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&\?]*).*/)) && 11 == url[2].length ? url[2] : false;
  }
  /** @type {null} */
  var dialog = null;
  var methods = {
    init : function(options) {
      options = $.extend({}, $.fn.YouTubePopup.defaults, options);
      if (null == dialog) {
        dialog = $("<div>").css({
          display : "none",
          padding : 0
        });
        if ("" != options.cssClass) {
          dialog.addClass(options.cssClass);
        }
        $("body").append(dialog);
        dialog.dialog({
          autoOpen : false,
          resizable : false,
          draggable : options.draggable,
          modal : options.modal,
          dialogClass : options.dialogClass,
          close : function() {
            dialog.html("");
            $(".ui-dialog-titlebar").show();
          }
        });
      }
      return this.each(function() {
        var self = $(this);
        if (!self.data("YouTube")) {
          self.data("YouTube", {
            target : self,
            active : true
          });
          $(self).bind("click.YouTubePopup", function() {
            var i = options.youtubeId;
            if ("" == $.trim(i) && self.is("a")) {
              i = _launch(self.attr("href"));
            }
            if ("" == $.trim(i) || false === i) {
              i = self.attr(options.idAttribute);
            }
            var value = $.trim(options.title);
            if ("" == value) {
              if (options.useYouTubeTitle) {
                addAccountInfo(i);
              } else {
                value = self.attr("title");
              }
            }
            /** @type {string} */
            i = window.location.protocol + "//www.youtube.com/embed/" + i + "?rel=0&showsearch=0&autohide=" + options.autohide;
            /** @type {string} */
            i = i + ("&autoplay=" + options.autoplay + "&controls=" + options.controls + "&fs=" + options.fs + "&loop=" + options.loop);
            /** @type {string} */
            i = i + ("&showinfo=" + options.showinfo + "&color=" + options.color + "&theme=" + options.theme);
            dialog.html('<iframe title="YouTube video player" style="margin:0; padding:0;" width="' + options.width + '" ' + ('height="' + options.height + '" src="' + i + '" frameborder="0" allowfullscreen></iframe>'));
            dialog.dialog({
              width : "auto",
              height : "auto"
            });
            dialog.dialog({
              minWidth : options.width,
              minHeight : options.height,
              title : value
            });
            dialog.dialog("open");
            $(".ui-widget-overlay").fadeTo("fast", options.overlayOpacity);
            if (options.hideTitleBar && options.modal) {
              $(".ui-dialog-titlebar").hide();
              $(".ui-widget-overlay").click(function() {
                dialog.dialog("close");
              });
            }
            if (options.clickOutsideClose && options.modal) {
              $(".ui-widget-overlay").click(function() {
                dialog.dialog("close");
              });
            }
            return false;
          });
        }
      });
    },
    destroy : function() {
      return this.each(function() {
        $(this).unbind(".YouTubePopup");
        $(this).removeData("YouTube");
      });
    }
  };
  /**
   * @param {string} action
   * @return {?}
   */
  $.fn.YouTubePopup = function(action) {
    if (methods[action]) {
      return methods[action].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    if ("object" !== typeof action && action) {
      $.error("Method " + action + " does not exist on jQuery.YouTubePopup");
    } else {
      return methods.init.apply(this, arguments);
    }
  };
  $.fn.YouTubePopup.defaults = {
    youtubeId : "",
    title : "",
    useYouTubeTitle : true,
    idAttribute : "rel",
    cssClass : "",
    dialogClass : "",
    draggable : false,
    modal : true,
    width : 640,
    height : 480,
    hideTitleBar : false,
    clickOutsideClose : false,
    overlayOpacity : .5,
    autohide : 2,
    autoplay : 1,
    color : "red",
    controls : 1,
    fs : 1,
    loop : 0,
    showinfo : 0,
    theme : "light"
  };
})(jQuery);
(function($) {
  /**
   * @param {string} message
   * @return {?}
   */
  function format(message) {
    /** @type {number} */
    var i = 1;
    for (; i < arguments.length; i++) {
      message = message.replace("%" + (i - 1), arguments[i]);
    }
    return message;
  }
  /**
   * @param {!Object} jWin
   * @param {!Object} opts
   * @return {undefined}
   */
  function init(jWin, opts) {
    /**
     * @return {undefined}
     */
    function f() {
      /** @type {!Image} */
      img = new Image;
      $(img).load(function() {
        ctx.init2(this, 0);
      });
      img.src = sImg.attr("src");
      /** @type {!Image} */
      img2 = new Image;
      $(img2).load(function() {
        ctx.init2(this, 1);
      });
      img2.src = jWin.attr("href");
    }
    var sImg = $("img", jWin);
    var img;
    var img2;
    /** @type {null} */
    var zoomDiv = null;
    /** @type {null} */
    var $mouseTrap = null;
    /** @type {null} */
    var lens = null;
    /** @type {null} */
    var $tint = null;
    /** @type {null} */
    var $elem = null;
    /** @type {null} */
    var $ie6Fix = null;
    var zoomImage;
    /** @type {number} */
    var _takingTooLongTimeout = 0;
    var cw;
    var ch;
    /** @type {number} */
    var destU = 0;
    /** @type {number} */
    var destV = 0;
    /** @type {number} */
    var currV = 0;
    /** @type {number} */
    var currU = 0;
    /** @type {number} */
    var A = 0;
    var xaxis;
    var posY;
    var ctx = this;
    var zw;
    setTimeout(function() {
      if (null === $mouseTrap) {
        var w = jWin.width();
        jWin.parent().append(format('<div style="width:%0px;position:absolute;top:75%;left:%1px;text-align:center" class="cloud-zoom-loading" >Loading...</div>', w / 3, w / 2 - w / 6)).find(":last").css("opacity", .5);
      }
    }, 200);
    /**
     * @return {undefined}
     */
    this.removeBits = function() {
      if (lens) {
        lens.remove();
        /** @type {null} */
        lens = null;
      }
      if ($tint) {
        $tint.remove();
        /** @type {null} */
        $tint = null;
      }
      if ($elem) {
        $elem.remove();
        /** @type {null} */
        $elem = null;
      }
      if (null !== $ie6Fix) {
        $ie6Fix.remove();
        /** @type {null} */
        $ie6Fix = null;
      }
      $(".cloud-zoom-loading", jWin.parent()).remove();
    };
    /**
     * @return {undefined}
     */
    this.destroy = function() {
      jWin.data("zoom", null);
      if ($mouseTrap) {
        $mouseTrap.unbind();
        $mouseTrap.remove();
        /** @type {null} */
        $mouseTrap = null;
      }
      if (zoomDiv) {
        zoomDiv.remove();
        /** @type {null} */
        zoomDiv = null;
      }
      this.removeBits();
    };
    /**
     * @return {undefined}
     */
    this.fadedOut = function() {
      if (zoomDiv) {
        zoomDiv.remove();
        /** @type {null} */
        zoomDiv = null;
      }
      this.removeBits();
    };
    /**
     * @return {undefined}
     */
    this.controlLoop = function() {
      if (lens) {
        /** @type {number} */
        var x = xaxis - sImg.offset().left - .5 * cw >> 0;
        /** @type {number} */
        var y = posY - sImg.offset().top - .5 * ch >> 0;
        if (0 > x) {
          /** @type {number} */
          x = 0;
        } else {
          if (x > sImg.outerWidth() - cw) {
            /** @type {number} */
            x = sImg.outerWidth() - cw;
          }
        }
        if (0 > y) {
          /** @type {number} */
          y = 0;
        } else {
          if (y > sImg.outerHeight() - ch) {
            /** @type {number} */
            y = sImg.outerHeight() - ch;
          }
        }
        lens.css({
          left : x,
          top : y
        });
        lens.css("background-position", -x + "px " + -y + "px");
        /** @type {number} */
        destU = x / sImg.outerWidth() * zoomImage.width >> 0;
        /** @type {number} */
        destV = y / sImg.outerHeight() * zoomImage.height >> 0;
        currU = currU + (destU - currU) / opts.smoothMove;
        currV = currV + (destV - currV) / opts.smoothMove;
        zoomDiv.css("background-position", -(currU >> 0) + "px " + (-(currV >> 0) + "px"));
      }
      /** @type {number} */
      _takingTooLongTimeout = setTimeout(function() {
        ctx.controlLoop();
      }, 30);
    };
    /**
     * @param {boolean} img
     * @param {number} pos
     * @return {undefined}
     */
    this.init2 = function(img, pos) {
      A++;
      if (1 === pos) {
        /** @type {boolean} */
        zoomImage = img;
      }
      if (2 === A) {
        this.init();
      }
    };
    /**
     * @return {undefined}
     */
    this.init = function() {
      $(".cloud-zoom-loading", jWin.parent()).remove();
      var buttons = jWin.find("img").length ? jWin.find("img").position().top : 0;
      var color = jWin.find("img").length ? jWin.find("img").position().left : 0;
      if (jWin.find(".mousetrap").length) {
        $(".mousetrap").remove();
      }
      $mouseTrap = jWin.parent().append(format("<div class='mousetrap transparent_bg' style='z-index:899;position:absolute;width:%0px;height:%1px;left:%2px;top:%3px;'></div>", sImg.outerWidth(), sImg.outerHeight(), color, buttons)).find(":last");
      $mouseTrap.bind("mousemove", this, function(event) {
        xaxis = event.pageX;
        posY = event.pageY;
      });
      $mouseTrap.bind("mouseleave", this, function(a) {
        clearTimeout(_takingTooLongTimeout);
        clearTimeout(paintNodesTimeout);
        if (lens) {
          lens.fadeOut(299);
        }
        if ($tint) {
          $tint.fadeOut(299);
        }
        if ($elem) {
          $elem.fadeOut(299);
        }
        if (zoomDiv) {
          zoomDiv.fadeOut(300, function() {
            ctx.fadedOut();
          });
        }
        return false;
      });
      $mouseTrap.bind("mouseenter", this, function(event) {
        if (opts.lazyLoad) {
          f();
        }
        xaxis = event.pageX;
        posY = event.pageY;
        zw = event.data;
        if (zoomDiv) {
          zoomDiv.stop(true, false);
          zoomDiv.remove();
        }
        /** @type {number} */
        paintNodesTimeout = setTimeout(function() {
          var xPos = opts.adjustX;
          var yPos = opts.adjustY;
          var siw = sImg.outerWidth();
          var sih = sImg.outerHeight();
          var w = opts.zoomWidth;
          var h = opts.zoomHeight;
          if ("auto" == opts.zoomWidth) {
            w = siw;
          }
          if ("auto" == opts.zoomHeight) {
            h = sih;
          }
          var appendTo = jWin.parent();
          switch(opts.position) {
            case "top":
              /** @type {number} */
              yPos = yPos - h;
              break;
            case "right":
              xPos = xPos + siw;
              break;
            case "bottom":
              yPos = yPos + sih;
              break;
            case "left":
              /** @type {number} */
              xPos = xPos - w;
              break;
            case "inside":
              w = siw;
              h = sih;
              break;
            default:
              appendTo = $("#" + opts.position);
              if (appendTo.length) {
                w = appendTo.innerWidth();
                h = appendTo.innerHeight();
              } else {
                /** @type {!Object} */
                appendTo = jWin;
                xPos = xPos + siw;
                yPos = yPos + sih;
              }
          }
          zoomDiv = appendTo.append(format('<div id="cloud-zoom-big" class="cloud-zoom-big" style="display:none;position:absolute;left:%0px;top:%1px;width:%2px;height:%3px;background-image:url(\'%4\');z-index:99;"></div>', xPos, yPos, w, h, zoomImage.src)).find(":last");
          if (sImg.attr("title") && opts.showTitle) {
            zoomDiv.append(format('<div class="cloud-zoom-title">%0</div>', sImg.attr("title"))).find(":last").css("opacity", opts.titleOpacity);
          }
          if ($.browser.msie && 7 > $.browser.version) {
            $ie6Fix = $('<iframe frameborder="0" src="#"></iframe>').css({
              position : "absolute",
              left : xPos,
              top : yPos,
              zIndex : 99,
              width : w,
              height : h
            }).insertBefore(zoomDiv);
          }
          zoomDiv.fadeIn(500);
          if (lens) {
            lens.remove();
            /** @type {null} */
            lens = null;
          }
          /** @type {number} */
          cw = sImg.outerWidth() / zoomImage.width * zoomDiv.width();
          /** @type {number} */
          ch = sImg.outerHeight() / zoomImage.height * zoomDiv.height();
          if ($(".cloud-zoom-lens").length) {
            $(".cloud-zoom-lens").remove();
          }
          lens = jWin.append(format("<div class = 'cloud-zoom-lens' style='display:none;z-index:98;position:absolute;width:%0px;height:%1px;'></div>", cw, ch)).find(":last");
          $mouseTrap.css("cursor", lens.css("cursor"));
          /** @type {boolean} */
          xPos = false;
          if (opts.tint) {
            lens.css("background", 'url("' + sImg.attr("src") + '")');
            $tint = jWin.append(format('<div class="overlay" style="display:none;position:absolute; left:0px; top:0px; width:%0px; height:%1px; background-color:%2;" />', sImg.outerWidth(), sImg.outerHeight(), opts.tint)).find(":last");
            $tint.css("opacity", opts.tintOpacity);
            /** @type {boolean} */
            xPos = true;
            $tint.fadeIn(500);
          }
          if (opts.softFocus) {
            lens.css("background", 'url("' + sImg.attr("src") + '")');
            $elem = jWin.append(format('<div style="position:absolute;display:none;top:2px; left:2px; width:%0px; height:%1px;" />', sImg.outerWidth() - 2, sImg.outerHeight() - 2, opts.tint)).find(":last");
            $elem.css("background", 'url("' + sImg.attr("src") + '")');
            $elem.css("opacity", .5);
            /** @type {boolean} */
            xPos = true;
            $elem.fadeIn(500);
          }
          if (!xPos) {
            lens.css("opacity", opts.lensOpacity);
          }
          if ("inside" !== opts.position) {
            lens.fadeIn(500);
          }
          zw.controlLoop();
        }, opts.delay);
      });
    };
    if (opts.lazyLoad) {
      this.init();
    } else {
      f();
    }
  }
  var paintNodesTimeout;
  /**
   * @param {?} opts
   * @return {?}
   */
  $.fn.CloudZoom = function(opts) {
    try {
      document.execCommand("BackgroundImageCache", false, true);
    } catch (e) {
    }
    this.each(function() {
      var defaultConfig;
      var config;
      defaultConfig = $.parseJSON("{" + ($(this).attr("rel") || "") + "}");
      if ($(this).is(".cloud-zoom")) {
        $(this).css({
          position : "relative",
          display : "block"
        });
        $("img", $(this)).css({
          display : "block"
        });
        if ("wrap" != $(this).parent().attr("id")) {
          $(this).wrap('<div id="wrap" style="top:0px;position:relative;"></div>');
        }
        config = $.extend({}, $.fn.CloudZoom.defaults, opts);
        config = $.extend({}, config, defaultConfig);
        $(this).data("zoom", new init($(this), config));
      } else {
        if ($(this).is(".cloud-zoom-gallery")) {
          config = $.extend({}, defaultConfig, opts);
          $(this).data("relOpts", config);
          $(this).bind("click", $(this), function(selectedNode) {
            var data = selectedNode.data.data("relOpts");
            $("#" + data.useZoom).data("zoom").destroy();
            $("#" + data.useZoom).attr("href", selectedNode.data.attr("href"));
            $("#" + data.useZoom + " img").attr("src", selectedNode.data.data("relOpts").smallImage);
            $("#" + selectedNode.data.data("relOpts").useZoom).CloudZoom();
            return false;
          });
        }
      }
    });
    return this;
  };
  $.fn.CloudZoom.defaults = {
    zoomWidth : "450",
    zoomHeight : "483",
    position : "right",
    tint : true,
    tintOpacity : .75,
    lensOpacity : 1,
    softFocus : false,
    smoothMove : 3,
    showTitle : false,
    titleOpacity : .5,
    adjustX : 40,
    adjustY : 0,
    delay : "10",
    lazyLoad : false
  };
})(jQuery);
/**
 * @param {string} props
 * @param {string} value
 * @param {!Object} m
 * @return {?}
 */
jQuery.cookie = function(props, value, m) {
  if ("undefined" != typeof value) {
    m = m || {};
    if (null === value) {
      /** @type {string} */
      value = "";
      /** @type {number} */
      m.expires = -1;
    }
    /** @type {string} */
    var t = "";
    if (m.expires && ("number" == typeof m.expires || m.expires.toUTCString)) {
      if ("number" == typeof m.expires) {
        /** @type {!Date} */
        t = new Date;
        t.setTime(t.getTime() + 864E5 * m.expires);
      } else {
        t = m.expires;
      }
      t = "; expires=" + t.toUTCString();
    }
    /** @type {string} */
    var outputFile = m.path ? "; path=" + m.path : "";
    /** @type {string} */
    var inlineClass = m.domain ? "; domain=" + m.domain : "";
    /** @type {string} */
    m = m.secure ? "; secure" : "";
    /** @type {string} */
    document.cookie = [props, "=", encodeURIComponent(value), t, outputFile, inlineClass, m].join("");
  } else {
    /** @type {null} */
    value = null;
    if (document.cookie && "" != document.cookie) {
      /** @type {!Array<string>} */
      m = document.cookie.split(";");
      /** @type {number} */
      t = 0;
      for (; t < m.length; t++) {
        if (outputFile = jQuery.trim(m[t]), outputFile.substring(0, props.length + 1) == props + "=") {
          /** @type {string} */
          value = decodeURIComponent(outputFile.substring(props.length + 1));
          break;
        }
      }
    }
    return value;
  }
};
var debugDW = {
  init : function() {
    if (null != jQuery("#__DW__SFToolkit").contents().find("#dw-sf-control-menu ul")) {
      jQuery("#__DW__SFToolkit").contents().find("#dw-sf-control-menu ul").append('<li class="x-menu-list-item" id="build_listitem"><a href="#" class="x-menu-item" id="build-anchor"><img class="x-menu-item-icon dw-sf-control-menu-log" src="/on/demandware.static/Sites-Site/-/-/internal/images/s.gif">Build Information</a></li>');
    }
  },
  showBuildInfo : function() {
    jQuery("#build_information").show();
  }
};
jQuery(document).ready(function() {
  debugDW.init();
  jQuery("#__DW__SFToolkit").contents().find("#build-anchor").on("click", debugDW.showBuildInfo);
});
var json_parse = function() {
  var index;
  var ch;
  var escapee = {
    '"' : '"',
    "\\" : "\\",
    "/" : "/",
    b : "\b",
    f : "\f",
    n : "\n",
    r : "\r",
    t : "\t"
  };
  var options;
  /**
   * @param {string} s
   * @return {?}
   */
  var test = function(s) {
    throw {
      name : "SyntaxError",
      message : s,
      at : index,
      text : options
    };
  };
  /**
   * @param {string} c
   * @return {?}
   */
  var print = function(c) {
    if (c && c !== ch) {
      test("Expected '" + c + "' instead of '" + ch + "'");
    }
    ch = options.charAt(index);
    index = index + 1;
    return ch;
  };
  /**
   * @return {?}
   */
  var next = function() {
    var value;
    /** @type {string} */
    value = "";
    if ("-" === ch) {
      /** @type {string} */
      value = "-";
      print("-");
    }
    for (; "0" <= ch && "9" >= ch;) {
      value = value + ch;
      print();
    }
    if ("." === ch) {
      /** @type {string} */
      value = value + ".";
      for (; print() && "0" <= ch && "9" >= ch;) {
        value = value + ch;
      }
    }
    if ("e" === ch || "E" === ch) {
      value = value + ch;
      print();
      if ("-" === ch || "+" === ch) {
        value = value + ch;
        print();
      }
      for (; "0" <= ch && "9" >= ch;) {
        value = value + ch;
        print();
      }
    }
    /** @type {number} */
    value = +value;
    if (isFinite(value)) {
      return value;
    }
    test("Bad number");
  };
  /**
   * @return {?}
   */
  var toString = function() {
    var i;
    var newCSS;
    /** @type {string} */
    var s = "";
    var n;
    if ('"' === ch) {
      for (; print();) {
        if ('"' === ch) {
          return print(), s;
        }
        if ("\\" === ch) {
          if (print(), "u" === ch) {
            /** @type {number} */
            newCSS = n = 0;
            for (; 4 > newCSS; newCSS = newCSS + 1) {
              /** @type {number} */
              i = parseInt(print(), 16);
              if (!isFinite(i)) {
                break;
              }
              /** @type {number} */
              n = 16 * n + i;
            }
            /** @type {string} */
            s = s + String.fromCharCode(n);
          } else {
            if ("string" === typeof escapee[ch]) {
              s = s + escapee[ch];
            } else {
              break;
            }
          }
        } else {
          s = s + ch;
        }
      }
    }
    test("Bad string");
  };
  /**
   * @return {undefined}
   */
  var usageOne = function() {
    for (; ch && " " >= ch;) {
      print();
    }
  };
  /**
   * @return {?}
   */
  var sscanf = function() {
    switch(ch) {
      case "t":
        return print("t"), print("r"), print("u"), print("e"), true;
      case "f":
        return print("f"), print("a"), print("l"), print("s"), print("e"), false;
      case "n":
        return print("n"), print("u"), print("l"), print("l"), null;
    }
    test("Unexpected '" + ch + "'");
  };
  var f;
  /**
   * @return {?}
   */
  f = function() {
    usageOne();
    switch(ch) {
      case "{":
        var x;
        a: {
          var data = {};
          if ("{" === ch) {
            print("{");
            usageOne();
            if ("}" === ch) {
              print("}");
              x = data;
              break a;
            }
            for (; ch;) {
              x = toString();
              usageOne();
              print(":");
              if (Object.hasOwnProperty.call(data, x)) {
                test('Duplicate key "' + x + '"');
              }
              data[x] = f();
              usageOne();
              if ("}" === ch) {
                print("}");
                x = data;
                break a;
              }
              print(",");
              usageOne();
            }
          }
          test("Bad object");
          x = void 0;
        }
        return x;
      case "[":
        a: {
          /** @type {!Array} */
          x = [];
          if ("[" === ch) {
            print("[");
            usageOne();
            if ("]" === ch) {
              print("]");
              break a;
            }
            for (; ch;) {
              x.push(f());
              usageOne();
              if ("]" === ch) {
                print("]");
                break a;
              }
              print(",");
              usageOne();
            }
          }
          test("Bad array");
          x = void 0;
        }
        return x;
      case '"':
        return toString();
      case "-":
        return next();
      default:
        return "0" <= ch && "9" >= ch ? next() : sscanf();
    }
  };
  return function(o, context) {
    /** @type {!Object} */
    options = o;
    /** @type {number} */
    index = 0;
    /** @type {string} */
    ch = " ";
    o = f();
    usageOne();
    if (ch) {
      test("Syntax error");
    }
    return "function" === typeof context ? function extend(settings, key) {
      var v;
      var d;
      var value = settings[key];
      if (value && "object" === typeof value) {
        for (v in value) {
          if (Object.prototype.hasOwnProperty.call(value, v)) {
            d = extend(value, v);
            if (void 0 !== d) {
              value[v] = d;
            } else {
              delete value[v];
            }
          }
        }
      }
      return context.call(settings, key, value);
    }({
      "" : o
    }, "") : o;
  };
}();
(function($) {
  /**
   * @param {!Object} e
   * @return {undefined}
   */
  function doAjaxSubmit(e) {
    var options = e.data;
    if (!e.isDefaultPrevented()) {
      e.preventDefault();
      $(this).ajaxSubmit(options);
    }
  }
  /**
   * @param {!Event} e
   * @return {undefined}
   */
  function captureSubmittingElement(e) {
    var target = e.target;
    var tr = $(target);
    if (!tr.is("[type=submit],[type=image]")) {
      target = tr.closest("[type=submit]");
      if (0 === target.length) {
        return;
      }
      target = target[0];
    }
    var form = this;
    form.clk = target;
    if ("image" == target.type) {
      if (void 0 !== e.offsetX) {
        form.clk_x = e.offsetX;
        form.clk_y = e.offsetY;
      } else {
        if ("function" == typeof $.fn.offset) {
          tr = tr.offset();
          /** @type {number} */
          form.clk_x = e.pageX - tr.left;
          /** @type {number} */
          form.clk_y = e.pageY - tr.top;
        } else {
          /** @type {number} */
          form.clk_x = e.pageX - target.offsetLeft;
          /** @type {number} */
          form.clk_y = e.pageY - target.offsetTop;
        }
      }
    }
    setTimeout(function() {
      /** @type {null} */
      form.clk = form.clk_x = form.clk_y = null;
    }, 100);
  }
  /**
   * @return {undefined}
   */
  function log() {
    if ($.fn.ajaxSubmit.debug) {
      /** @type {string} */
      var msg = "[jquery.form] " + Array.prototype.join.call(arguments, "");
      if (window.console && window.console.log) {
        window.console.log(msg);
      } else {
        if (window.opera && window.opera.postError) {
          window.opera.postError(msg);
        }
      }
    }
  }
  var d;
  var forceNew;
  /** @type {boolean} */
  d = void 0 !== $("<input type='file'/>").get(0).files;
  /** @type {boolean} */
  forceNew = void 0 !== window.FormData;
  /** @type {boolean} */
  var g = !!$.fn.prop;
  /**
   * @return {?}
   */
  $.fn.attr2 = function() {
    if (!g) {
      return this.attr.apply(this, arguments);
    }
    var option = this.prop.apply(this, arguments);
    return option && option.jquery || "string" === typeof option ? option : this.attr.apply(this, arguments);
  };
  /**
   * @param {(Object|string)} options
   * @return {?}
   */
  $.fn.ajaxSubmit = function(options) {
    /**
     * @param {!Array} keys
     * @return {?}
     */
    function deepSerialize(keys) {
      keys = $.param(keys, options.traditional).split("&");
      var jn = keys.length;
      /** @type {!Array} */
      var result = [];
      var j;
      var parsedQR;
      /** @type {number} */
      j = 0;
      for (; j < jn; j++) {
        keys[j] = keys[j].replace(/\+/g, " ");
        parsedQR = keys[j].split("=");
        result.push([decodeURIComponent(parsedQR[0]), decodeURIComponent(parsedQR[1])]);
      }
      return result;
    }
    /**
     * @param {number} a
     * @return {?}
     */
    function fileUploadXhr(a) {
      /** @type {!FormData} */
      var formData = new FormData;
      /** @type {number} */
      var s = 0;
      for (; s < a.length; s++) {
        formData.append(a[s].name, a[s].value);
      }
      if (options.extraData) {
        a = deepSerialize(options.extraData);
        /** @type {number} */
        s = 0;
        for (; s < a.length; s++) {
          if (a[s]) {
            formData.append(a[s][0], a[s][1]);
          }
        }
      }
      /** @type {null} */
      options.data = null;
      s = $.extend(true, {}, $.ajaxSettings, options, {
        contentType : false,
        processData : false,
        cache : false,
        type : method || "POST"
      });
      if (options.uploadProgress) {
        /**
         * @return {?}
         */
        s.xhr = function() {
          var myXhr = $.ajaxSettings.xhr();
          if (myXhr.upload) {
            myXhr.upload.addEventListener("progress", function(event) {
              /** @type {number} */
              var percent = 0;
              var position = event.loaded || event.position;
              var total = event.total;
              if (event.lengthComputable) {
                /** @type {number} */
                percent = Math.ceil(position / total * 100);
              }
              options.uploadProgress(event, position, total, percent);
            }, false);
          }
          return myXhr;
        };
      }
      /** @type {null} */
      s.data = null;
      /** @type {function(?, string): undefined} */
      var beforeSend = s.beforeSend;
      /**
       * @param {?} xhr
       * @param {string} options
       * @return {undefined}
       */
      s.beforeSend = function(xhr, options) {
        /** @type {!FormData} */
        options.data = formData;
        if (beforeSend) {
          beforeSend.call(this, xhr, options);
        }
      };
      return $.ajax(s);
    }
    /**
     * @param {!Object} a
     * @return {?}
     */
    function fileUploadIframe(a) {
      /**
       * @param {!Element} frame
       * @return {?}
       */
      function getDoc(frame) {
        /** @type {null} */
        var doc = null;
        try {
          if (frame.contentWindow) {
            doc = frame.contentWindow.document;
          }
        } catch (CalcMethod) {
          log("cannot get iframe.contentWindow document: " + CalcMethod);
        }
        if (doc) {
          return doc;
        }
        try {
          doc = frame.contentDocument ? frame.contentDocument : frame.document;
        } catch (CalcMethod) {
          log("cannot get iframe.contentDocument: " + CalcMethod);
          doc = frame.document;
        }
        return doc;
      }
      /**
       * @return {undefined}
       */
      function doSubmit() {
        /**
         * @return {undefined}
         */
        function checkState() {
          try {
            var state = getDoc(io).readyState;
            log("state = " + state);
            if (state && "uninitialized" == state.toLowerCase()) {
              setTimeout(checkState, 50);
            }
          } catch (clip) {
            log("Server abort: ", clip, " (", clip.name, ")");
            cb(2);
            if (_takingTooLongTimeout) {
              clearTimeout(_takingTooLongTimeout);
            }
            _takingTooLongTimeout = void 0;
          }
        }
        var oldTarget = $form.attr2("target");
        var a = $form.attr2("action");
        form.setAttribute("target", id);
        if (!method) {
          form.setAttribute("method", "POST");
        }
        if (a != s.url) {
          form.setAttribute("action", s.url);
        }
        if (!(s.skipEncodingOverride || method && !/post/i.test(method))) {
          $form.attr({
            encoding : "multipart/form-data",
            enctype : "multipart/form-data"
          });
        }
        if (s.timeout) {
          /** @type {number} */
          _takingTooLongTimeout = setTimeout(function() {
            /** @type {boolean} */
            D = true;
            cb(1);
          }, s.timeout);
        }
        /** @type {!Array} */
        var puzzle = [];
        try {
          if (s.extraData) {
            var n;
            for (n in s.extraData) {
              if (s.extraData.hasOwnProperty(n)) {
                if ($.isPlainObject(s.extraData[n]) && s.extraData[n].hasOwnProperty("name") && s.extraData[n].hasOwnProperty("value")) {
                  puzzle.push($('<input type="hidden" name="' + s.extraData[n].name + '">').val(s.extraData[n].value).appendTo(form)[0]);
                } else {
                  puzzle.push($('<input type="hidden" name="' + n + '">').val(s.extraData[n]).appendTo(form)[0]);
                }
              }
            }
          }
          if (!s.iframeTarget) {
            $io.appendTo("body");
            if (io.attachEvent) {
              io.attachEvent("onload", cb);
            } else {
              io.addEventListener("load", cb, false);
            }
          }
          setTimeout(checkState, 15);
          try {
            form.submit();
          } catch (U) {
            document.createElement("form").submit.apply(form);
          }
        } finally {
          form.setAttribute("action", a);
          if (oldTarget) {
            form.setAttribute("target", oldTarget);
          } else {
            $form.removeAttr("target");
          }
          $(puzzle).remove();
        }
      }
      /**
       * @param {number} status
       * @return {undefined}
       */
      function cb(status) {
        if (!xhr.aborted && !Z) {
          if (doc = getDoc(io), doc || (log("cannot access response document"), status = 2), 1 === status && xhr) {
            xhr.abort("timeout");
            deferred.reject(xhr, "timeout");
          } else {
            if (2 == status && xhr) {
              xhr.abort("server abort");
              deferred.reject(xhr, "error", "server abort");
            } else {
              if (doc && doc.location.href != s.iframeSrc || D) {
                if (io.detachEvent) {
                  io.detachEvent("onload", cb);
                } else {
                  io.removeEventListener("load", cb, false);
                }
                /** @type {string} */
                status = "success";
                var errMsg;
                try {
                  if (D) {
                    throw "timeout";
                  }
                  var isXml = "xml" == s.dataType || doc.XMLDocument || $.isXMLDoc(doc);
                  log("isXml=" + isXml);
                  if (!isXml && window.opera && (null === doc.body || !doc.body.innerHTML) && --T) {
                    log("requeing onLoad callback, DOM not available");
                    setTimeout(cb, 250);
                    return;
                  }
                  var docRoot = doc.body ? doc.body : doc.documentElement;
                  xhr.responseText = docRoot ? docRoot.innerHTML : null;
                  xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                  if (isXml) {
                    /** @type {string} */
                    s.dataType = "xml";
                  }
                  /**
                   * @param {string} header
                   * @return {?}
                   */
                  xhr.getResponseHeader = function(header) {
                    return {
                      "content-type" : s.dataType
                    }[header];
                  };
                  if (docRoot) {
                    xhr.status = Number(docRoot.getAttribute("status")) || xhr.status;
                    xhr.statusText = docRoot.getAttribute("statusText") || xhr.statusText;
                  }
                  var dt = (s.dataType || "").toLowerCase();
                  /** @type {boolean} */
                  var scr = /(json|script|text)/.test(dt);
                  if (scr || s.textarea) {
                    var ta = doc.getElementsByTagName("textarea")[0];
                    if (ta) {
                      xhr.responseText = ta.value;
                      xhr.status = Number(ta.getAttribute("status")) || xhr.status;
                      xhr.statusText = ta.getAttribute("statusText") || xhr.statusText;
                    } else {
                      if (scr) {
                        var pre = doc.getElementsByTagName("pre")[0];
                        var b = doc.getElementsByTagName("body")[0];
                        if (pre) {
                          xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
                        } else {
                          if (b) {
                            xhr.responseText = b.textContent ? b.textContent : b.innerText;
                          }
                        }
                      }
                    }
                  } else {
                    if ("xml" == dt && !xhr.responseXML && xhr.responseText) {
                      xhr.responseXML = toXml(xhr.responseText);
                    }
                  }
                  try {
                    data = httpData(xhr, dt, s);
                  } catch (e) {
                    /** @type {string} */
                    status = "parsererror";
                    xhr.error = errMsg = e || status;
                  }
                } catch (e) {
                  log("error caught: ", e);
                  /** @type {string} */
                  status = "error";
                  xhr.error = errMsg = e || status;
                }
                if (xhr.aborted) {
                  log("upload aborted");
                  /** @type {null} */
                  status = null;
                }
                if (xhr.status) {
                  /** @type {string} */
                  status = 200 <= xhr.status && 300 > xhr.status || 304 === xhr.status ? "success" : "error";
                }
                if ("success" === status) {
                  if (s.success) {
                    s.success.call(s.context, data, "success", xhr);
                  }
                  deferred.resolve(xhr.responseText, "success", xhr);
                  if (g) {
                    $.event.trigger("ajaxSuccess", [xhr, s]);
                  }
                } else {
                  if (status) {
                    if (void 0 === errMsg) {
                      errMsg = xhr.statusText;
                    }
                    if (s.error) {
                      s.error.call(s.context, xhr, status, errMsg);
                    }
                    deferred.reject(xhr, "error", errMsg);
                    if (g) {
                      $.event.trigger("ajaxError", [xhr, s, errMsg]);
                    }
                  }
                }
                if (g) {
                  $.event.trigger("ajaxComplete", [xhr, s]);
                }
                if (g && !--$.active) {
                  $.event.trigger("ajaxStop");
                }
                if (s.complete) {
                  s.complete.call(s.context, xhr, status);
                }
                /** @type {boolean} */
                Z = true;
                if (s.timeout) {
                  clearTimeout(_takingTooLongTimeout);
                }
                setTimeout(function() {
                  if (!s.iframeTarget) {
                    $io.remove();
                  }
                  /** @type {null} */
                  xhr.responseXML = null;
                }, 100);
              }
            }
          }
        }
      }
      var form = $form[0];
      var n;
      var s;
      var g;
      var id;
      var $io;
      var io;
      var xhr;
      var D;
      var _takingTooLongTimeout;
      var deferred = $.Deferred();
      /**
       * @param {string} error
       * @return {undefined}
       */
      deferred.abort = function(error) {
        xhr.abort(error);
      };
      if (a) {
        /** @type {number} */
        n = 0;
        for (; n < elements.length; n++) {
          a = $(elements[n]);
          if (g) {
            a.prop("disabled", false);
          } else {
            a.removeAttr("disabled");
          }
        }
      }
      s = $.extend(true, {}, $.ajaxSettings, options);
      s.context = s.context || s;
      /** @type {string} */
      id = "jqFormIO" + (new Date).getTime();
      if (s.iframeTarget) {
        $io = $(s.iframeTarget);
        if (n = $io.attr2("name")) {
          id = n;
        } else {
          $io.attr2("name", id);
        }
      } else {
        $io = $('<iframe name="' + id + '" src="' + s.iframeSrc + '" />');
        $io.css({
          position : "absolute",
          top : "-1000px",
          left : "-1000px"
        });
      }
      io = $io[0];
      xhr = {
        aborted : 0,
        responseText : null,
        responseXML : null,
        status : 0,
        statusText : "n/a",
        getAllResponseHeaders : function() {
        },
        getResponseHeader : function() {
        },
        setRequestHeader : function() {
        },
        abort : function(error) {
          /** @type {string} */
          var e = "timeout" === error ? "timeout" : "aborted";
          log("aborting upload... " + e);
          /** @type {number} */
          this.aborted = 1;
          try {
            if (io.contentWindow.document.execCommand) {
              io.contentWindow.document.execCommand("Stop");
            }
          } catch (S) {
          }
          $io.attr("src", s.iframeSrc);
          /** @type {string} */
          xhr.error = e;
          if (s.error) {
            s.error.call(s.context, xhr, e, error);
          }
          if (g) {
            $.event.trigger("ajaxError", [xhr, s, e]);
          }
          if (s.complete) {
            s.complete.call(s.context, xhr, e);
          }
        }
      };
      if ((g = s.global) && 0 === $.active++) {
        $.event.trigger("ajaxStart");
      }
      if (g) {
        $.event.trigger("ajaxSend", [xhr, s]);
      }
      if (s.beforeSend && false === s.beforeSend.call(s.context, xhr, s)) {
        return s.global && $.active--, deferred.reject(), deferred;
      }
      if (xhr.aborted) {
        return deferred.reject(), deferred;
      }
      if ((a = form.clk) && (n = a.name) && !a.disabled) {
        s.extraData = s.extraData || {};
        s.extraData[n] = a.value;
        if ("image" == a.type) {
          s.extraData[n + ".x"] = form.clk_x;
          s.extraData[n + ".y"] = form.clk_y;
        }
      }
      a = $("meta[name=csrf-token]").attr("content");
      if ((n = $("meta[name=csrf-param]").attr("content")) && a) {
        s.extraData = s.extraData || {};
        /** @type {!Object} */
        s.extraData[n] = a;
      }
      if (s.forceSync) {
        doSubmit();
      } else {
        setTimeout(doSubmit, 10);
      }
      var data;
      var doc;
      /** @type {number} */
      var T = 50;
      var Z;
      var toXml = $.parseXML || function(xmlString, doc) {
        if (window.ActiveXObject) {
          doc = new ActiveXObject("Microsoft.XMLDOM");
          /** @type {string} */
          doc.async = "false";
          doc.loadXML(xmlString);
        } else {
          /** @type {(Document|null)} */
          doc = (new DOMParser).parseFromString(xmlString, "text/xml");
        }
        return doc && doc.documentElement && "parsererror" != doc.documentElement.nodeName ? doc : null;
      };
      /**
       * @param {!Object} data
       * @param {string} type
       * @param {!Object} s
       * @return {?}
       */
      var httpData = function(data, type, s) {
        var ct = data.getResponseHeader("content-type") || "";
        /** @type {boolean} */
        var xml = "xml" === type || !type && 0 <= ct.indexOf("xml");
        data = xml ? data.responseXML : data.responseText;
        if (xml && "parsererror" === data.documentElement.nodeName && $.error) {
          $.error("parsererror");
        }
        if (s && s.dataFilter) {
          data = s.dataFilter(data, type);
        }
        if ("string" === typeof data) {
          if ("json" === type || !type && 0 <= ct.indexOf("json")) {
            data = json_parse(data);
          } else {
            if ("script" === type || !type && 0 <= ct.indexOf("javascript")) {
              $.globalEval(data);
            }
          }
        }
        return data;
      };
      return deferred;
    }
    if (!this.length) {
      return log("ajaxSubmit: skipping submit process - no element selected"), this;
    }
    var method;
    var value;
    var $form = this;
    if ("function" == typeof options) {
      options = {
        success : options
      };
    } else {
      if (void 0 === options) {
        options = {};
      }
    }
    method = options.type || this.attr2("method");
    value = options.url || this.attr2("action");
    if (value = (value = "string" === typeof value ? $.trim(value) : "") || window.location.href || "") {
      value = (value.match(/^([^#]+)/) || [])[1];
    }
    options = $.extend(true, {
      url : value,
      success : $.ajaxSettings.success,
      type : method || $.ajaxSettings.type,
      iframeSrc : /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
    }, options);
    value = {};
    this.trigger("form-pre-serialize", [this, options, value]);
    if (value.veto) {
      return log("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this;
    }
    if (options.beforeSerialize && false === options.beforeSerialize(this, options)) {
      return log("ajaxSubmit: submit aborted via beforeSerialize callback"), this;
    }
    var data = options.traditional;
    if (void 0 === data) {
      data = $.ajaxSettings.traditional;
    }
    /** @type {!Array} */
    var elements = [];
    var key;
    var a = this.formToArray(options.semantic, elements);
    if (options.data) {
      options.extraData = options.data;
      key = $.param(options.data, data);
    }
    if (options.beforeSubmit && false === options.beforeSubmit(a, this, options)) {
      return log("ajaxSubmit: submit aborted via beforeSubmit callback"), this;
    }
    this.trigger("form-submit-validate", [a, this, options, value]);
    if (value.veto) {
      return log("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this;
    }
    value = $.param(a, data);
    if (key) {
      value = value ? value + "&" + key : key;
    }
    if ("GET" == options.type.toUpperCase()) {
      options.url += (0 <= options.url.indexOf("?") ? "&" : "?") + value;
      /** @type {null} */
      options.data = null;
    } else {
      options.data = value;
    }
    /** @type {!Array} */
    var callbacks = [];
    if (options.resetForm) {
      callbacks.push(function() {
        $form.resetForm();
      });
    }
    if (options.clearForm) {
      callbacks.push(function() {
        $form.clearForm(options.includeHidden);
      });
    }
    if (!options.dataType && options.target) {
      var methodsToOverwrite = options.success || function() {
      };
      callbacks.push(function(val) {
        /** @type {string} */
        var fn = options.replaceTarget ? "replaceWith" : "html";
        $(options.target)[fn](val).each(methodsToOverwrite, arguments);
      });
    } else {
      if (options.success) {
        callbacks.push(options.success);
      }
    }
    /**
     * @param {!Function} status
     * @param {?} response
     * @param {(Object|string)} xhr
     * @return {undefined}
     */
    options.success = function(status, response, xhr) {
      var _whitespaceCharClass = options.context || this;
      /** @type {number} */
      var i = 0;
      /** @type {number} */
      var len = callbacks.length;
      for (; i < len; i++) {
        callbacks[i].apply(_whitespaceCharClass, [status, response, xhr || $form, $form]);
      }
    };
    if (options.error) {
      var onError = options.error;
      /**
       * @param {!Object} name
       * @param {string} value
       * @param {string} obj
       * @return {undefined}
       */
      options.error = function(name, value, obj) {
        onError.apply(options.context || this, [name, value, obj, $form]);
      };
    }
    if (options.complete) {
      var oldComplete = options.complete;
      /**
       * @param {!Object} name
       * @param {string} value
       * @return {undefined}
       */
      options.complete = function(name, value) {
        oldComplete.apply(options.context || this, [name, value, $form]);
      };
    }
    /** @type {boolean} */
    key = 0 < $('input[type=file]:enabled:not([value=""])', this).length;
    /** @type {boolean} */
    value = "multipart/form-data" == $form.attr("enctype") || "multipart/form-data" == $form.attr("encoding");
    data = d && forceNew;
    log("fileAPI :" + data);
    var mockDomainObject;
    if (false !== options.iframe && (options.iframe || (key || value) && !data)) {
      if (options.closeKeepAlive) {
        $.get(options.closeKeepAlive, function() {
          mockDomainObject = fileUploadIframe(a);
        });
      } else {
        mockDomainObject = fileUploadIframe(a);
      }
    } else {
      mockDomainObject = (key || value) && data ? fileUploadXhr(a) : $.ajax(options);
    }
    $form.removeData("jqxhr").data("jqxhr", mockDomainObject);
    /** @type {number} */
    key = 0;
    for (; key < elements.length; key++) {
      /** @type {null} */
      elements[key] = null;
    }
    this.trigger("form-submit-notify", [this, options]);
    return this;
  };
  /**
   * @param {!Object} options
   * @return {?}
   */
  $.fn.ajaxForm = function(options) {
    options = options || {};
    options.delegation = options.delegation && $.isFunction($.fn.on);
    if (!options.delegation && 0 === this.length) {
      var selector = this.selector;
      var modalContent = this.context;
      if (!$.isReady && selector) {
        return log("DOM not ready, queuing ajaxForm"), $(function() {
          $(selector, modalContent).ajaxForm(options);
        }), this;
      }
      log("terminating; zero elements found by selector" + ($.isReady ? "" : " (DOM not ready)"));
      return this;
    }
    return options.delegation ? ($(document).off("submit.form-plugin", this.selector, doAjaxSubmit).off("click.form-plugin", this.selector, captureSubmittingElement).on("submit.form-plugin", this.selector, options, doAjaxSubmit).on("click.form-plugin", this.selector, options, captureSubmittingElement), this) : this.ajaxFormUnbind().bind("submit.form-plugin", options, doAjaxSubmit).bind("click.form-plugin", options, captureSubmittingElement);
  };
  /**
   * @return {?}
   */
  $.fn.ajaxFormUnbind = function() {
    return this.unbind("submit.form-plugin click.form-plugin");
  };
  /**
   * @param {string} semantic
   * @param {!Object} elements
   * @return {?}
   */
  $.fn.formToArray = function(semantic, elements) {
    /** @type {!Array} */
    var a = [];
    if (0 === this.length) {
      return a;
    }
    var form = this[0];
    var els = semantic ? form.getElementsByTagName("*") : form.elements;
    if (!els) {
      return a;
    }
    var i;
    var j;
    var key;
    var obj;
    var el;
    var l;
    /** @type {number} */
    i = 0;
    l = els.length;
    for (; i < l; i++) {
      if (el = els[i], (key = el.name) && !el.disabled) {
        if (semantic && form.clk && "image" == el.type) {
          if (form.clk == el) {
            a.push({
              name : key,
              value : $(el).val(),
              type : el.type
            });
            a.push({
              name : key + ".x",
              value : form.clk_x
            }, {
              name : key + ".y",
              value : form.clk_y
            });
          }
        } else {
          if ((obj = $.fieldValue(el, true)) && obj.constructor == Array) {
            if (elements) {
              elements.push(el);
            }
            /** @type {number} */
            j = 0;
            el = obj.length;
            for (; j < el; j++) {
              a.push({
                name : key,
                value : obj[j]
              });
            }
          } else {
            if (d && "file" == el.type) {
              if (elements && elements.push(el), obj = el.files, obj.length) {
                /** @type {number} */
                j = 0;
                for (; j < obj.length; j++) {
                  a.push({
                    name : key,
                    value : obj[j],
                    type : el.type
                  });
                }
              } else {
                a.push({
                  name : key,
                  value : "",
                  type : el.type
                });
              }
            } else {
              if (null !== obj && "undefined" != typeof obj) {
                if (elements) {
                  elements.push(el);
                }
                a.push({
                  name : key,
                  value : obj,
                  type : el.type,
                  required : el.required
                });
              }
            }
          }
        }
      }
    }
    if (!semantic && form.clk) {
      semantic = $(form.clk);
      elements = semantic[0];
      if ((key = elements.name) && !elements.disabled && "image" == elements.type) {
        a.push({
          name : key,
          value : semantic.val()
        });
        a.push({
          name : key + ".x",
          value : form.clk_x
        }, {
          name : key + ".y",
          value : form.clk_y
        });
      }
    }
    return a;
  };
  /**
   * @param {string} semantic
   * @return {?}
   */
  $.fn.formSerialize = function(semantic) {
    return $.param(this.formToArray(semantic));
  };
  /**
   * @param {!Object} successful
   * @return {?}
   */
  $.fn.fieldSerialize = function(successful) {
    /** @type {!Array} */
    var parameters = [];
    this.each(function() {
      var name = this.name;
      if (name) {
        var value = $.fieldValue(this, successful);
        if (value && value.constructor == Array) {
          /** @type {number} */
          var j = 0;
          var valueLength = value.length;
          for (; j < valueLength; j++) {
            parameters.push({
              name : name,
              value : value[j]
            });
          }
        } else {
          if (null !== value && "undefined" != typeof value) {
            parameters.push({
              name : this.name,
              value : value
            });
          }
        }
      }
    });
    return $.param(parameters);
  };
  /**
   * @param {!Object} object
   * @return {?}
   */
  $.fn.fieldValue = function(object) {
    /** @type {!Array} */
    var a = [];
    /** @type {number} */
    var i = 0;
    var l = this.length;
    for (; i < l; i++) {
      var obj = $.fieldValue(this[i], object);
      if (!(null === obj || "undefined" == typeof obj || obj.constructor == Array && !obj.length)) {
        if (obj.constructor == Array) {
          $.merge(a, obj);
        } else {
          a.push(obj);
        }
      }
    }
    return a;
  };
  /**
   * @param {!Object} el
   * @param {!Object} a
   * @return {?}
   */
  $.fieldValue = function(el, a) {
    var n = el.name;
    var type = el.type;
    var i = el.tagName.toLowerCase();
    if (void 0 === a) {
      /** @type {boolean} */
      a = true;
    }
    if (a && (!n || el.disabled || "reset" == type || "button" == type || ("checkbox" == type || "radio" == type) && !el.checked || ("submit" == type || "image" == type) && el.form && el.form.clk != el || "select" == i && -1 == el.selectedIndex)) {
      return null;
    }
    if ("select" == i) {
      i = el.selectedIndex;
      if (0 > i) {
        return null;
      }
      /** @type {!Array} */
      a = [];
      el = el.options;
      n = (type = "select-one" == type) ? i + 1 : el.length;
      i = type ? i : 0;
      for (; i < n; i++) {
        var node = el[i];
        if (node.selected) {
          var val = node.value;
          if (!val) {
            val = node.attributes && node.attributes.value && !node.attributes.value.specified ? node.text : node.value;
          }
          if (type) {
            return val;
          }
          a.push(val);
        }
      }
      return a;
    }
    return $(el).val();
  };
  /**
   * @param {?} includeHidden
   * @return {?}
   */
  $.fn.clearForm = function(includeHidden) {
    return this.each(function() {
      $("input,select,textarea", this).clearFields(includeHidden);
    });
  };
  /** @type {function(boolean): ?} */
  $.fn.clearFields = $.fn.clearInputs = function(message) {
    /** @type {!RegExp} */
    var c = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
    return this.each(function() {
      var type = this.type;
      var name = this.tagName.toLowerCase();
      if (c.test(type) || "textarea" == name) {
        /** @type {string} */
        this.value = "";
      } else {
        if ("checkbox" == type || "radio" == type) {
          /** @type {boolean} */
          this.checked = false;
        } else {
          if ("select" == name) {
            /** @type {number} */
            this.selectedIndex = -1;
          } else {
            if ("file" == type) {
              if (/MSIE/.test(navigator.userAgent)) {
                $(this).replaceWith($(this).clone(true));
              } else {
                $(this).val("");
              }
            } else {
              if (message && (true === message && /hidden/.test(type) || "string" == typeof message && $(this).is(message))) {
                /** @type {string} */
                this.value = "";
              }
            }
          }
        }
      }
    });
  };
  /**
   * @return {?}
   */
  $.fn.resetForm = function() {
    return this.each(function() {
      if ("function" == typeof this.reset || "object" == typeof this.reset && !this.reset.nodeType) {
        this.reset();
      }
    });
  };
  /**
   * @param {!Object} name
   * @return {?}
   */
  $.fn.enable = function(name) {
    if (void 0 === name) {
      /** @type {boolean} */
      name = true;
    }
    return this.each(function() {
      /** @type {boolean} */
      this.disabled = !name;
    });
  };
  /**
   * @param {!Object} name
   * @return {?}
   */
  $.fn.selected = function(name) {
    if (void 0 === name) {
      /** @type {boolean} */
      name = true;
    }
    return this.each(function() {
      var type = this.type;
      if ("checkbox" == type || "radio" == type) {
        this.checked = name;
      } else {
        if ("option" == this.tagName.toLowerCase()) {
          type = $(this).parent("select");
          if (name && type[0] && "select-one" == type[0].type) {
            type.find("option").selected(false);
          }
          /** @type {!Object} */
          this.selected = name;
        }
      }
    });
  };
  /** @type {boolean} */
  $.fn.ajaxSubmit.debug = false;
})("undefined" != typeof jQuery ? jQuery : window.Zepto);
var NO_JQUERY = {};
(function(window, $, undefined) {
  if (!("console" in window)) {
    var loggingMethods = window.console = {};
    /** @type {function(): undefined} */
    loggingMethods.log = loggingMethods.warn = loggingMethods.error = loggingMethods.debug = function() {
    };
  }
  if ($ === NO_JQUERY) {
    $ = {
      fn : {},
      extend : function() {
        var a = arguments[0];
        /** @type {number} */
        var i = 1;
        /** @type {number} */
        var argl = arguments.length;
        for (; i < argl; i++) {
          var b = arguments[i];
          var prop;
          for (prop in b) {
            a[prop] = b[prop];
          }
        }
        return a;
      }
    };
  }
  /**
   * @return {?}
   */
  $.fn.pm = function() {
    console.log("usage: \nto send: $.pm(options)\nto receive: $.pm.bind(type, fn, [origin])");
    return this;
  };
  /** @type {function(undefined): undefined} */
  $.pm = window.pm = function(data) {
    pm.send(data);
  };
  /** @type {function(string, !Function=, !Function=, string=, boolean=): function(...?): undefined} */
  $.pm.bind = window.pm.bind = function(name, fn, origin, hash, when) {
    pm.bind(name, fn, origin, hash, true === when);
  };
  /** @type {function(string, !Function): undefined} */
  $.pm.unbind = window.pm.unbind = function(type, fn) {
    pm.unbind(type, fn);
  };
  /** @type {null} */
  $.pm.origin = window.pm.origin = null;
  /** @type {number} */
  $.pm.poll = window.pm.poll = 200;
  var pm = {
    send : function(o) {
      o = $.extend({}, pm.defaults, o);
      var target = o.target;
      if (o.target) {
        if (o.type) {
          var msg = {
            data : o.data,
            type : o.type
          };
          if (o.success) {
            msg.callback = pm._callback(o.success);
          }
          if (o.error) {
            msg.errback = pm._callback(o.error);
          }
          if ("postMessage" in target && !o.hash) {
            pm._bind();
            target.postMessage(JSON.stringify(msg), o.origin || "*");
          } else {
            pm.hash._bind();
            pm.hash.send(o, msg);
          }
        } else {
          console.warn("postmessage type required");
        }
      } else {
        console.warn("postmessage target window required");
      }
    },
    bind : function(type, fn, origin, hash, async_reply) {
      pm._replyBind(type, fn, origin, hash, async_reply);
    },
    _replyBind : function(type, fn, origin, hash, isCallback) {
      if ("postMessage" in window && !hash) {
        pm._bind();
      } else {
        pm.hash._bind();
      }
      hash = pm.data("listeners.postmessage");
      if (!hash) {
        hash = {};
        pm.data("listeners.postmessage", hash);
      }
      var fns = hash[type];
      if (!fns) {
        /** @type {!Array} */
        fns = [];
        /** @type {!Array} */
        hash[type] = fns;
      }
      fns.push({
        fn : fn,
        callback : isCallback,
        origin : origin || $.pm.origin
      });
    },
    unbind : function(type, callback) {
      var map = pm.data("listeners.postmessage");
      if (map) {
        if (type) {
          if (callback) {
            var listeners = map[type];
            if (listeners) {
              /** @type {!Array} */
              var next = [];
              /** @type {number} */
              var i = 0;
              var l = listeners.length;
              for (; i < l; i++) {
                var listener = listeners[i];
                if (listener.fn !== callback) {
                  next.push(listener);
                }
              }
              /** @type {!Array} */
              map[type] = next;
            }
          } else {
            delete map[type];
          }
        } else {
          for (i in map) {
            delete map[i];
          }
        }
      }
    },
    data : function(name, value) {
      return value === undefined ? pm._data[name] : pm._data[name] = value;
    },
    _data : {},
    _CHARS : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
    _random : function() {
      /** @type {!Array} */
      var b = [];
      /** @type {number} */
      var $orderCol = 0;
      for (; 32 > $orderCol; $orderCol++) {
        /** @type {string} */
        b[$orderCol] = pm._CHARS[0 | 32 * Math.random()];
      }
      return b.join("");
    },
    _callback : function(fn) {
      var cbs = pm.data("callbacks.postmessage");
      if (!cbs) {
        cbs = {};
        pm.data("callbacks.postmessage", cbs);
      }
      var r = pm._random();
      cbs[r] = fn;
      return r;
    },
    _bind : function() {
      if (!pm.data("listening.postmessage")) {
        if (window.addEventListener) {
          window.addEventListener("message", pm._dispatch, false);
        } else {
          if (window.attachEvent) {
            window.attachEvent("onmessage", pm._dispatch);
          }
        }
        pm.data("listening.postmessage", 1);
      }
    },
    _dispatch : function(e) {
      if (e && e.data && "" != e.data) {
        try {
          /** @type {*} */
          var options = JSON.parse(e.data);
        } catch (t) {
          return;
        }
        if (options.type) {
          var element = (pm.data("callbacks.postmessage") || {})[options.type];
          if (element) {
            element(options.data);
          } else {
            element = (pm.data("listeners.postmessage") || {})[options.type] || [];
            /** @type {number} */
            var x = 0;
            var o = element.length;
            for (; x < o; x++) {
              /**
               * @param {!Object} result
               * @return {undefined}
               */
              var sendReply = function(result) {
                if (options.callback) {
                  pm.send({
                    target : e.source,
                    data : result,
                    type : options.callback
                  });
                }
              };
              var o = element[x];
              if (o.origin && "*" !== o.origin && e.origin !== o.origin) {
                console.warn("postmessage message origin mismatch", e.origin, o.origin);
                if (options.errback) {
                  pm.send({
                    target : e.source,
                    data : {
                      message : "postmessage origin mismatch",
                      origin : [e.origin, o.origin]
                    },
                    type : options.errback
                  });
                }
              } else {
                try {
                  if (o.callback) {
                    o.fn(options.data, sendReply, e);
                  } else {
                    sendReply(o.fn(options.data, e));
                  }
                } catch (maindata3) {
                  if (options.errback) {
                    pm.send({
                      target : e.source,
                      data : maindata3,
                      type : options.errback
                    });
                  } else {
                    throw maindata3;
                  }
                }
              }
            }
          }
        }
      }
    },
    hash : {
      send : function(a, obj) {
        var e = a.target;
        if (a = a.url) {
          a = pm.hash._url(a);
          var p;
          var requestOrUrl = pm.hash._url(window.location.href);
          if (window == e.parent) {
            /** @type {string} */
            p = "parent";
          } else {
            try {
              /** @type {number} */
              var i = 0;
              var patchLen = parent.frames.length;
              for (; i < patchLen; i++) {
                if (parent.frames[i] == window) {
                  /** @type {number} */
                  p = i;
                  break;
                }
              }
            } catch (t) {
              /** @type {string} */
              p = window.name;
            }
          }
          if (null == p) {
            console.warn("postmessage windows must be direct parent/child windows and the child must be available through the parent window.frames list");
          } else {
            obj = {
              "x-requested-with" : "postmessage",
              source : {
                name : p,
                url : requestOrUrl
              },
              postmessage : obj
            };
            /** @type {string} */
            p = "#x-postmessage-id=" + pm._random();
            /** @type {string} */
            e.location = a + p + encodeURIComponent(JSON.stringify(obj));
          }
        } else {
          console.warn("postmessage target window url is required");
        }
      },
      _regex : /^#x\-postmessage\-id=(\w{32})/,
      _regex_len : 50,
      _bind : function() {
        if (!pm.data("polling.postmessage")) {
          setInterval(function() {
            /** @type {string} */
            var hash = "" + window.location.hash;
            /** @type {(Array<string>|null)} */
            var id = pm.hash._regex.exec(hash);
            if (id) {
              /** @type {string} */
              id = id[1];
              if (pm.hash._last !== id) {
                /** @type {string} */
                pm.hash._last = id;
                pm.hash._dispatch(hash.substring(pm.hash._regex_len));
              }
            }
          }, $.pm.poll || 200);
          pm.data("polling.postmessage", 1);
        }
      },
      _dispatch : function(hash) {
        if (hash) {
          try {
            if (hash = JSON.parse(decodeURIComponent(hash)), !("postmessage" === hash["x-requested-with"] && hash.source && null != hash.source.name && hash.source.url && hash.postmessage)) {
              return;
            }
          } catch (n) {
            return;
          }
          var msg = hash.postmessage;
          var action = (pm.data("callbacks.postmessage") || {})[msg.type];
          if (action) {
            action(msg.data);
          } else {
            var $submenuTarget;
            $submenuTarget = "parent" === hash.source.name ? window.parent : window.frames[hash.source.name];
            action = (pm.data("listeners.postmessage") || {})[msg.type] || [];
            /** @type {number} */
            var j = 0;
            var range_length = action.length;
            for (; j < range_length; j++) {
              /**
               * @param {!Object} result
               * @return {undefined}
               */
              var sendReply = function(result) {
                if (msg.callback) {
                  pm.send({
                    target : $submenuTarget,
                    data : result,
                    type : msg.callback,
                    hash : true,
                    url : hash.source.url
                  });
                }
              };
              var o = action[j];
              if (o.origin) {
                /** @type {string} */
                var origin = /https?:\/\/[^\/]*/.exec(hash.source.url)[0];
                if ("*" !== o.origin && origin !== o.origin) {
                  console.warn("postmessage message origin mismatch", origin, o.origin);
                  if (msg.errback) {
                    pm.send({
                      target : $submenuTarget,
                      data : {
                        message : "postmessage origin mismatch",
                        origin : [origin, o.origin]
                      },
                      type : msg.errback,
                      hash : true,
                      url : hash.source.url
                    });
                  }
                  continue;
                }
              }
              try {
                if (o.callback) {
                  o.fn(msg.data, sendReply);
                } else {
                  sendReply(o.fn(msg.data));
                }
              } catch (maindata3) {
                if (msg.errback) {
                  pm.send({
                    target : $submenuTarget,
                    data : maindata3,
                    type : msg.errback,
                    hash : true,
                    url : hash.source.url
                  });
                } else {
                  throw maindata3;
                }
              }
            }
          }
        }
      },
      _url : function(name) {
        return ("" + name).replace(/#.*$/, "");
      }
    }
  };
  $.extend(pm, {
    defaults : {
      target : null,
      url : null,
      type : null,
      data : null,
      success : null,
      error : null,
      origin : "*",
      hash : false
    }
  });
})(this, "undefined" === typeof jQuery ? NO_JQUERY : jQuery);
(function(window, document, $, undefined) {
  var H = $("html");
  var W = $(window);
  var D = $(document);
  /** @type {function(): undefined} */
  var F = $.fancybox = function() {
    F.open.apply(this, arguments);
  };
  /** @type {(Array<string>|null)} */
  var enable_keys = navigator.userAgent.match(/msie/i);
  /** @type {null} */
  var _takingTooLongTimeout = null;
  /** @type {boolean} */
  var isTouch = document.createTouch !== undefined;
  /**
   * @param {!Object} obj
   * @return {?}
   */
  var isQuery = function(obj) {
    return obj && obj.hasOwnProperty && obj instanceof $;
  };
  /**
   * @param {!Object} name
   * @return {?}
   */
  var isString = function(name) {
    return name && "string" === $.type(name);
  };
  /**
   * @param {!Object} value
   * @return {?}
   */
  var isPercentage = function(value) {
    return isString(value) && 0 < value.indexOf("%");
  };
  /**
   * @param {number} value
   * @param {string} dim
   * @return {?}
   */
  var getScalar = function(value, dim) {
    /** @type {number} */
    var n = parseInt(value, 10) || 0;
    if (dim && isPercentage(value)) {
      /** @type {number} */
      n = n * (F.getViewport()[dim] / 100);
    }
    return Math.ceil(n);
  };
  /**
   * @param {number} value
   * @param {string} dim
   * @return {?}
   */
  var getValue = function(value, dim) {
    return getScalar(value, dim) + "px";
  };
  $.extend(F, {
    version : "2.1.5",
    defaults : {
      padding : 15,
      margin : 20,
      width : 800,
      height : 600,
      minWidth : 100,
      minHeight : 100,
      maxWidth : 9999,
      maxHeight : 9999,
      pixelRatio : 1,
      autoSize : true,
      autoHeight : false,
      autoWidth : false,
      autoResize : true,
      autoCenter : !isTouch,
      fitToView : true,
      aspectRatio : false,
      topRatio : .5,
      leftRatio : .5,
      scrolling : "auto",
      wrapCSS : "",
      arrows : true,
      closeBtn : true,
      closeClick : false,
      nextClick : false,
      mouseWheel : true,
      autoPlay : false,
      playSpeed : 3E3,
      preload : 3,
      modal : false,
      loop : true,
      ajax : {
        dataType : "html",
        headers : {
          "X-fancyBox" : true
        }
      },
      iframe : {
        scrolling : "auto",
        preload : true
      },
      swf : {
        wmode : "transparent",
        allowfullscreen : "true",
        allowscriptaccess : "always"
      },
      keys : {
        next : {
          13 : "left",
          34 : "up",
          39 : "left",
          40 : "up"
        },
        prev : {
          8 : "right",
          33 : "down",
          37 : "right",
          38 : "down"
        },
        close : [27],
        play : [32],
        toggle : [70]
      },
      direction : {
        next : "left",
        prev : "right"
      },
      scrollOutside : true,
      index : 0,
      type : null,
      href : null,
      content : null,
      title : null,
      tpl : {
        wrap : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
        image : '<img class="fancybox-image" src="{href}" alt="" />',
        iframe : '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (enable_keys ? ' allowtransparency="true"' : "") + "></iframe>",
        error : '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
        closeBtn : '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
        next : '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
        prev : '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
      },
      openEffect : "fade",
      openSpeed : 250,
      openEasing : "swing",
      openOpacity : true,
      openMethod : "zoomIn",
      closeEffect : "fade",
      closeSpeed : 250,
      closeEasing : "swing",
      closeOpacity : true,
      closeMethod : "zoomOut",
      nextEffect : "elastic",
      nextSpeed : 250,
      nextEasing : "swing",
      nextMethod : "changeIn",
      prevEffect : "elastic",
      prevSpeed : 250,
      prevEasing : "swing",
      prevMethod : "changeOut",
      helpers : {
        overlay : true,
        title : true
      },
      onCancel : $.noop,
      beforeLoad : $.noop,
      afterLoad : $.noop,
      beforeShow : $.noop,
      afterShow : $.noop,
      beforeChange : $.noop,
      beforeClose : $.noop,
      afterClose : $.noop
    },
    group : {},
    opts : {},
    previous : null,
    coming : null,
    current : null,
    isActive : false,
    isOpen : false,
    isOpened : false,
    wrap : null,
    skin : null,
    outer : null,
    inner : null,
    player : {
      timer : null,
      isActive : false
    },
    ajaxLoad : null,
    imgPreload : null,
    transitions : {},
    helpers : {},
    open : function(name, value) {
      if (name && ($.isPlainObject(value) || (value = {}), false !== F.close(true))) {
        return $.isArray(name) || (name = isQuery(name) ? $(name).get() : [name]), $.each(name, function(key, element) {
          var obj = {};
          var href;
          var torrent_title;
          var content;
          var type;
          var binding;
          if ("object" === $.type(element)) {
            if (element.nodeType) {
              element = $(element);
            }
            if (isQuery(element)) {
              obj = {
                href : element.data("fancybox-href") || element.attr("href"),
                title : element.data("fancybox-title") || element.attr("title"),
                isDom : true,
                element : element
              };
              if ($.metadata) {
                $.extend(true, obj, element.metadata());
              }
            } else {
              /** @type {!Object} */
              obj = element;
            }
          }
          href = value.href || obj.href || (isString(element) ? element : null);
          torrent_title = value.title !== undefined ? value.title : obj.title || "";
          type = (content = value.content || obj.content) ? "html" : value.type || obj.type;
          if (!type && obj.isDom) {
            type = element.data("fancybox-type");
            if (!type) {
              type = (type = element.prop("class").match(/fancybox\.(\w+)/)) ? type[1] : null;
            }
          }
          if (isString(href)) {
            if (!type) {
              if (F.isImage(href)) {
                /** @type {string} */
                type = "image";
              } else {
                if (F.isSWF(href)) {
                  /** @type {string} */
                  type = "swf";
                } else {
                  if ("#" === href.charAt(0)) {
                    /** @type {string} */
                    type = "inline";
                  } else {
                    if (isString(element)) {
                      /** @type {string} */
                      type = "html";
                      /** @type {!Object} */
                      content = element;
                    }
                  }
                }
              }
            }
            if ("ajax" === type) {
              binding = href.split(/\s+/, 2);
              href = binding.shift();
              binding = binding.shift();
            }
          }
          if (!content) {
            if ("inline" === type) {
              if (href) {
                content = $(isString(href) ? href.replace(/.*(?=#[^\s]+$)/, "") : href);
              } else {
                if (obj.isDom) {
                  /** @type {!Object} */
                  content = element;
                }
              }
            } else {
              if ("html" === type) {
                content = href;
              } else {
                if (!(type || href || !obj.isDom)) {
                  /** @type {string} */
                  type = "inline";
                  /** @type {!Object} */
                  content = element;
                }
              }
            }
          }
          $.extend(obj, {
            href : href,
            type : type,
            content : content,
            title : torrent_title,
            selector : binding
          });
          name[key] = obj;
        }), F.opts = $.extend(true, {}, F.defaults, value), value.keys !== undefined && (F.opts.keys = value.keys ? $.extend({}, F.defaults.keys, value.keys) : false), H.addClass("html_fancybox_opened"), F.group = name, F._start(F.opts.index);
      }
    },
    cancel : function() {
      var obj = F.coming;
      if (obj && false !== F.trigger("onCancel")) {
        F.hideLoading();
        if (F.ajaxLoad) {
          F.ajaxLoad.abort();
        }
        /** @type {null} */
        F.ajaxLoad = null;
        if (F.imgPreload) {
          /** @type {null} */
          F.imgPreload.onload = F.imgPreload.onerror = null;
        }
        if (obj.wrap) {
          obj.wrap.stop(true, true).trigger("onReset").remove();
        }
        /** @type {null} */
        F.coming = null;
        if (!F.current) {
          F._afterZoomOut(obj);
        }
      }
    },
    close : function(value) {
      F.cancel();
      if (false !== F.trigger("beforeClose")) {
        F.unbindEvents();
        if (F.isActive) {
          if (F.isOpen && true !== value) {
            /** @type {boolean} */
            F.isOpen = F.isOpened = false;
            /** @type {boolean} */
            F.isClosing = true;
            $(".fancybox-item, .fancybox-nav").remove();
            F.wrap.stop(true, true).removeClass("fancybox-opened");
            F.transitions[F.current.closeMethod]();
          } else {
            $(".fancybox-wrap").stop(true).trigger("onReset").remove();
            F._afterZoomOut();
          }
          H.removeClass("html_fancybox_opened");
        }
      }
    },
    play : function(startTimeAnimalB) {
      /**
       * @return {undefined}
       */
      var clear = function() {
        clearTimeout(F.player.timer);
      };
      /**
       * @return {undefined}
       */
      var set = function() {
        clear();
        if (F.current && F.player.isActive) {
          /** @type {number} */
          F.player.timer = setTimeout(F.next, F.current.playSpeed);
        }
      };
      /**
       * @return {undefined}
       */
      var stop = function() {
        clear();
        D.unbind(".player");
        /** @type {boolean} */
        F.player.isActive = false;
        F.trigger("onPlayEnd");
      };
      if (true === startTimeAnimalB || !F.player.isActive && false !== startTimeAnimalB) {
        if (F.current && (F.current.loop || F.current.index < F.group.length - 1)) {
          /** @type {boolean} */
          F.player.isActive = true;
          D.bind({
            "onCancel.player beforeClose.player" : stop,
            "onUpdate.player" : set,
            "beforeLoad.player" : clear
          });
          set();
          F.trigger("onPlayStart");
        }
      } else {
        stop();
      }
    },
    next : function(name) {
      var previous = F.current;
      if (previous) {
        if (!isString(name)) {
          name = previous.direction.next;
        }
        F.jumpto(previous.index + 1, name, "next");
      }
    },
    prev : function(name) {
      var current = F.current;
      if (current) {
        if (!isString(name)) {
          name = current.direction.prev;
        }
        F.jumpto(current.index - 1, name, "prev");
      }
    },
    jumpto : function(index, direction, router) {
      var current = F.current;
      if (current) {
        index = getScalar(index);
        F.direction = direction || current.direction[index >= current.index ? "next" : "prev"];
        F.router = router || "jumpto";
        if (current.loop) {
          if (0 > index) {
            index = current.group.length + index % current.group.length;
          }
          /** @type {number} */
          index = index % current.group.length;
        }
        if (current.group[index] !== undefined) {
          F.cancel();
          F._start(index);
        }
      }
    },
    reposition : function(e, a) {
      var current = F.current;
      var wrap = current ? current.wrap : null;
      if (wrap) {
        a = F._getPosition(a);
        if (e && "scroll" === e.type) {
          delete a.position;
          wrap.stop(true, true).animate(a, 200);
        } else {
          wrap.css(a);
          current.pos = $.extend({}, current.dim, a);
        }
      }
    },
    update : function(el) {
      var undefined = el && el.type;
      /** @type {boolean} */
      var start_opt = !undefined || "orientationchange" === undefined;
      if (start_opt) {
        clearTimeout(_takingTooLongTimeout);
        /** @type {null} */
        _takingTooLongTimeout = null;
      }
      if (F.isOpen && !_takingTooLongTimeout) {
        /** @type {number} */
        _takingTooLongTimeout = setTimeout(function() {
          var current = F.current;
          if (current && !F.isClosing) {
            F.wrap.removeClass("fancybox-tmp");
            if (start_opt || "load" === undefined || "resize" === undefined && current.autoResize) {
              F._setDimension();
            }
            if (!("scroll" === undefined && current.canShrink)) {
              F.reposition(el);
            }
            F.trigger("onUpdate");
            /** @type {null} */
            _takingTooLongTimeout = null;
          }
        }, start_opt && !isTouch ? 0 : 300);
      }
    },
    toggle : function(name) {
      if (F.isOpen) {
        F.current.fitToView = "boolean" === $.type(name) ? name : !F.current.fitToView;
        if (isTouch) {
          F.wrap.removeAttr("style").addClass("fancybox-tmp");
          F.trigger("onUpdate");
        }
        F.update();
      }
    },
    hideLoading : function() {
      D.unbind(".loading");
      $("#fancybox-loading").remove();
    },
    showLoading : function() {
      var mask;
      var theSelection;
      F.hideLoading();
      mask = $('<div id="fancybox-loading"><div></div></div>').click(F.cancel).appendTo("body");
      D.bind("keydown.loading", function(event) {
        if (27 === (event.which || event.keyCode)) {
          event.preventDefault();
          F.cancel();
        }
      });
      if (!F.defaults.fixed) {
        theSelection = F.getViewport();
        mask.css({
          position : "absolute",
          top : .5 * theSelection.h + theSelection.y,
          left : .5 * theSelection.w + theSelection.x
        });
      }
    },
    getViewport : function() {
      var groupitems = F.current && F.current.locked || false;
      var rez = {
        x : W.scrollLeft(),
        y : W.scrollTop()
      };
      if (groupitems) {
        rez.w = groupitems[0].clientWidth;
        rez.h = groupitems[0].clientHeight;
      } else {
        rez.w = isTouch && window.innerWidth ? window.innerWidth : W.width();
        rez.h = isTouch && window.innerHeight ? window.innerHeight : W.height();
      }
      return rez;
    },
    unbindEvents : function() {
      if (F.wrap && isQuery(F.wrap)) {
        F.wrap.unbind(".fb");
      }
      D.unbind(".fb");
      W.unbind(".fb");
    },
    bindEvents : function() {
      var current = F.current;
      var keys;
      if (current) {
        W.bind("orientationchange.fb" + (isTouch ? "" : " resize.fb") + (current.autoCenter && !current.locked ? " scroll.fb" : ""), F.update);
        if (keys = current.keys) {
          D.bind("keydown.fb", function(event) {
            var code = event.which || event.keyCode;
            var realNode = event.target || event.srcElement;
            if (27 === code && F.coming) {
              return false;
            }
            if (!(event.ctrlKey || event.altKey || event.shiftKey || event.metaKey || realNode && (realNode.type || $(realNode).is("[contenteditable]")))) {
              $.each(keys, function(i, val) {
                if (1 < current.group.length && val[code] !== undefined) {
                  return F[i](val[code]), event.preventDefault(), false;
                }
                if (-1 < $.inArray(code, val)) {
                  return F[i](), event.preventDefault(), false;
                }
              });
            }
          });
        }
        if ($.fn.mousewheel && current.mouseWheel) {
          F.wrap.bind("mousewheel.fb", function(event, isSlidingUp, boardManager, newPercent) {
            var children = $(event.target || null);
            /** @type {boolean} */
            var el = false;
            for (; children.length && !(el || children.is(".fancybox-skin") || children.is(".fancybox-wrap"));) {
              el = (el = children[0]) && !(el.style.overflow && "hidden" === el.style.overflow) && (el.clientWidth && el.scrollWidth > el.clientWidth || el.clientHeight && el.scrollHeight > el.clientHeight);
              children = $(children).parent();
            }
            if (0 !== isSlidingUp && !el && 1 < F.group.length && !current.canShrink) {
              if (0 < newPercent || 0 < boardManager) {
                F.prev(0 < newPercent ? "down" : "left");
              } else {
                if (0 > newPercent || 0 > boardManager) {
                  F.next(0 > newPercent ? "up" : "right");
                }
              }
              event.preventDefault();
            }
          });
        }
      }
    },
    trigger : function(event, o) {
      var prox2;
      var el = o || F.coming || F.current;
      if (el) {
        if ($.isFunction(el[event])) {
          prox2 = el[event].apply(el, Array.prototype.slice.call(arguments, 1));
        }
        if (false === prox2) {
          return false;
        }
        if (el.helpers) {
          $.each(el.helpers, function(helper, opts) {
            if (opts && F.helpers[helper] && $.isFunction(F.helpers[helper][event])) {
              F.helpers[helper][event]($.extend(true, {}, F.helpers[helper].defaults, opts), el);
            }
          });
        }
        D.trigger(event);
      }
    },
    isImage : function(url) {
      return isString(url) && url.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
    },
    isSWF : function(str) {
      return isString(str) && str.match(/\.(swf)((\?|#).*)?$/i);
    },
    _start : function(index) {
      var coming = {};
      var margin;
      var padding;
      index = getScalar(index);
      margin = F.group[index] || null;
      if (!margin) {
        return false;
      }
      coming = $.extend(true, {}, F.opts, margin);
      margin = coming.margin;
      padding = coming.padding;
      if ("number" === $.type(margin)) {
        /** @type {!Array} */
        coming.margin = [margin, margin, margin, margin];
      }
      if ("number" === $.type(padding)) {
        /** @type {!Array} */
        coming.padding = [padding, padding, padding, padding];
      }
      if (coming.modal) {
        $.extend(true, coming, {
          closeBtn : false,
          closeClick : false,
          nextClick : false,
          arrows : false,
          mouseWheel : false,
          keys : null,
          helpers : {
            overlay : {
              closeClick : false
            }
          }
        });
      }
      if (coming.autoSize) {
        /** @type {boolean} */
        coming.autoWidth = coming.autoHeight = true;
      }
      if ("auto" === coming.width) {
        /** @type {boolean} */
        coming.autoWidth = true;
      }
      if ("auto" === coming.height) {
        /** @type {boolean} */
        coming.autoHeight = true;
      }
      coming.group = F.group;
      /** @type {number} */
      coming.index = index;
      F.coming = coming;
      if (false === F.trigger("beforeLoad")) {
        /** @type {null} */
        F.coming = null;
      } else {
        padding = coming.type;
        margin = coming.href;
        if (!padding) {
          return F.coming = null, F.current && F.router && "jumpto" !== F.router ? (F.current.index = index, F[F.router](F.direction)) : false;
        }
        /** @type {boolean} */
        F.isActive = true;
        if ("image" === padding || "swf" === padding) {
          /** @type {boolean} */
          coming.autoHeight = coming.autoWidth = false;
          /** @type {string} */
          coming.scrolling = "visible";
        }
        if ("image" === padding) {
          /** @type {boolean} */
          coming.aspectRatio = true;
        }
        if ("iframe" === padding && isTouch) {
          /** @type {string} */
          coming.scrolling = "scroll";
        }
        coming.wrap = $(coming.tpl.wrap).addClass("fancybox-" + (isTouch ? "mobile" : "desktop") + " fancybox-type-" + padding + " fancybox-tmp " + coming.wrapCSS).appendTo(coming.parent || "body");
        $.extend(coming, {
          skin : $(".fancybox-skin", coming.wrap),
          outer : $(".fancybox-outer", coming.wrap),
          inner : $(".fancybox-inner", coming.wrap)
        });
        $.each(["Top", "Right", "Bottom", "Left"], function(i, name) {
          coming.skin.css("padding" + name, getValue(coming.padding[i]));
        });
        F.trigger("onReady");
        if ("inline" === padding || "html" === padding) {
          if (!coming.content || !coming.content.length) {
            return F._error("content");
          }
        } else {
          if (!margin) {
            return F._error("href");
          }
        }
        if ("image" === padding) {
          F._loadImage();
        } else {
          if ("ajax" === padding) {
            F._loadAjax();
          } else {
            if ("iframe" === padding) {
              F._loadIframe();
            } else {
              F._afterLoad();
            }
          }
        }
      }
    },
    _error : function(type) {
      $.extend(F.coming, {
        type : "html",
        autoWidth : true,
        autoHeight : true,
        minWidth : 0,
        minHeight : 0,
        scrolling : "no",
        hasError : type,
        content : F.coming.tpl.error
      });
      F._afterLoad();
    },
    _loadImage : function() {
      /** @type {!Image} */
      var img = F.imgPreload = new Image;
      /**
       * @return {undefined}
       */
      img.onload = function() {
        /** @type {null} */
        this.onload = this.onerror = null;
        /** @type {number} */
        F.coming.width = this.width / F.opts.pixelRatio;
        /** @type {number} */
        F.coming.height = this.height / F.opts.pixelRatio;
        F._afterLoad();
      };
      /**
       * @return {undefined}
       */
      img.onerror = function() {
        /** @type {null} */
        this.onload = this.onerror = null;
        F._error("image");
      };
      img.src = F.coming.href;
      if (true !== img.complete) {
        F.showLoading();
      }
    },
    _loadAjax : function() {
      var coming = F.coming;
      F.showLoading();
      F.ajaxLoad = $.ajax($.extend({}, coming.ajax, {
        url : coming.href,
        error : function(name, value) {
          if (F.coming && "abort" !== value) {
            F._error("ajax", name);
          } else {
            F.hideLoading();
          }
        },
        success : function(data, success) {
          if ("success" === success) {
            /** @type {string} */
            coming.content = data;
            F._afterLoad();
          }
        }
      }));
    },
    _loadIframe : function() {
      var coming = F.coming;
      var iframe = $(coming.tpl.iframe.replace(/\{rnd\}/g, (new Date).getTime())).attr("scrolling", isTouch ? "auto" : coming.iframe.scrolling).attr("src", coming.href);
      $(coming.wrap).bind("onReset", function() {
        try {
          $(this).find("iframe").hide().attr("src", "//about:blank").end().empty();
        } catch (y) {
        }
      });
      if (coming.iframe.preload) {
        F.showLoading();
        iframe.one("load", function() {
          $(this).data("ready", 1);
          if (!isTouch) {
            $(this).bind("load.fb", F.update);
          }
          $(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();
          F._afterLoad();
        });
      }
      coming.content = iframe.appendTo(coming.inner);
      if (!coming.iframe.preload) {
        F._afterLoad();
      }
    },
    _preloadImages : function() {
      var elements = F.group;
      var current = F.current;
      var length = elements.length;
      /** @type {number} */
      var verticalCount = current.preload ? Math.min(current.preload, length - 1) : 0;
      var elem;
      var i;
      /** @type {number} */
      i = 1;
      for (; i <= verticalCount; i = i + 1) {
        elem = elements[(current.index + i) % length];
        if ("image" === elem.type && elem.href) {
          (new Image).src = elem.href;
        }
      }
    },
    _afterLoad : function() {
      var current = F.coming;
      var previous = F.current;
      var content;
      var type;
      var parent;
      var href;
      var stdout_buffer;
      F.hideLoading();
      if (current && false !== F.isActive) {
        if (false === F.trigger("afterLoad", current, previous)) {
          current.wrap.stop(true).trigger("onReset").remove();
          /** @type {null} */
          F.coming = null;
        } else {
          if (previous) {
            F.trigger("beforeChange", previous);
            previous.wrap.stop(true).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove();
          }
          F.unbindEvents();
          content = current.content;
          type = current.type;
          parent = current.scrolling;
          $.extend(F, {
            wrap : current.wrap,
            skin : current.skin,
            outer : current.outer,
            inner : current.inner,
            current : current,
            previous : previous
          });
          href = current.href;
          switch(type) {
            case "inline":
            case "ajax":
            case "html":
              if (current.selector) {
                content = $("<div>").html(content).find(current.selector);
              } else {
                if (isQuery(content)) {
                  if (!content.data("fancybox-placeholder")) {
                    content.data("fancybox-placeholder", $('<div class="fancybox-placeholder"></div>').insertAfter(content).hide());
                  }
                  content = content.show().detach();
                  current.wrap.bind("onReset", function() {
                    if ($(this).find(content).length) {
                      content.hide().replaceAll(content.data("fancybox-placeholder")).data("fancybox-placeholder", false);
                    }
                  });
                }
              }
              break;
            case "image":
              content = current.tpl.image.replace("{href}", href);
              break;
            case "swf":
              /** @type {string} */
              content = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + href + '"></param>';
              /** @type {string} */
              stdout_buffer = "";
              $.each(current.swf, function(a, b) {
                content = content + ('<param name="' + a + '" value="' + b + '"></param>');
                stdout_buffer = stdout_buffer + (" " + a + '="' + b + '"');
              });
              content = content + ('<embed src="' + href + '" type="application/x-shockwave-flash" width="100%" height="100%"' + stdout_buffer + "></embed></object>");
          }
          if (!(isQuery(content) && content.parent().is(current.inner))) {
            current.inner.append(content);
          }
          F.trigger("beforeShow");
          current.inner.css("overflow", "yes" === parent ? "scroll" : "no" === parent ? "hidden" : parent);
          F._setDimension();
          F.reposition();
          /** @type {boolean} */
          F.isOpen = false;
          /** @type {null} */
          F.coming = null;
          F.bindEvents();
          if (!F.isOpened) {
            $(".fancybox-wrap").not(current.wrap).stop(true).trigger("onReset").remove();
          } else {
            if (previous.prevMethod) {
              F.transitions[previous.prevMethod]();
            }
          }
          F.transitions[F.isOpened ? current.nextMethod : current.openMethod]();
          F._preloadImages();
        }
      }
    },
    _setDimension : function() {
      var width_ = F.getViewport();
      /** @type {number} */
      var canShrink = 0;
      var width;
      var wrap = F.wrap;
      var skin = F.skin;
      var inner = F.inner;
      var current = F.current;
      width = current.width;
      var height = current.height;
      var minWidth = current.minWidth;
      var minHeight = current.minHeight;
      var maxWidth = current.maxWidth;
      var maxHeight = current.maxHeight;
      var scrolling = current.scrolling;
      var scrollOut = current.scrollOutside ? current.scrollbarWidth : 0;
      var wPadding = current.margin;
      var height_ = getScalar(wPadding[1] + wPadding[3]);
      var maxHeight_ = getScalar(wPadding[0] + wPadding[2]);
      var hPadding;
      var wSpace;
      var hSpace;
      var value;
      var size;
      var origMaxWidth;
      var origMaxHeight;
      var ratio;
      var iframe;
      wrap.add(skin).add(inner).width("auto").height("auto").removeClass("fancybox-tmp");
      wPadding = getScalar(skin.outerWidth(true) - skin.width());
      hPadding = getScalar(skin.outerHeight(true) - skin.height());
      wSpace = height_ + wPadding;
      hSpace = maxHeight_ + hPadding;
      value = isPercentage(width) ? (width_.w - wSpace) * getScalar(width) / 100 : width;
      size = isPercentage(height) ? (width_.h - hSpace) * getScalar(height) / 100 : height;
      if ("iframe" === current.type) {
        if (iframe = current.content, current.autoHeight && 1 === iframe.data("ready")) {
          try {
            if (iframe[0].contentWindow.document.location) {
              inner.width(value).height(9999);
              origMaxWidth = iframe.contents().find("body");
              if (scrollOut) {
                origMaxWidth.css("overflow-x", "hidden");
              }
              size = origMaxWidth.outerHeight(true);
            }
          } catch (H) {
          }
        }
      } else {
        if (current.autoWidth || current.autoHeight) {
          inner.addClass("fancybox-tmp");
          if (!current.autoWidth) {
            inner.width(value);
          }
          if (!current.autoHeight) {
            inner.height(size);
          }
          if (current.autoWidth) {
            value = inner.width();
          }
          if (current.autoHeight) {
            size = inner.height();
          }
          inner.removeClass("fancybox-tmp");
        }
      }
      width = getScalar(value);
      height = getScalar(size);
      /** @type {number} */
      ratio = value / size;
      minWidth = getScalar(isPercentage(minWidth) ? getScalar(minWidth, "w") - wSpace : minWidth);
      maxWidth = getScalar(isPercentage(maxWidth) ? getScalar(maxWidth, "w") - wSpace : maxWidth);
      minHeight = getScalar(isPercentage(minHeight) ? getScalar(minHeight, "h") - hSpace : minHeight);
      maxHeight = getScalar(isPercentage(maxHeight) ? getScalar(maxHeight, "h") - hSpace : maxHeight);
      origMaxWidth = maxWidth;
      origMaxHeight = maxHeight;
      if (current.fitToView) {
        /** @type {number} */
        maxWidth = Math.min(width_.w - wSpace, maxWidth);
        /** @type {number} */
        maxHeight = Math.min(width_.h - hSpace, maxHeight);
      }
      /** @type {number} */
      wSpace = width_.w - height_;
      /** @type {number} */
      maxHeight_ = width_.h - maxHeight_;
      if (current.aspectRatio) {
        if (width > maxWidth) {
          width = maxWidth;
          height = getScalar(width / ratio);
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = getScalar(height * ratio);
        }
        if (width < minWidth) {
          width = minWidth;
          height = getScalar(width / ratio);
        }
        if (height < minHeight) {
          height = minHeight;
          width = getScalar(height * ratio);
        }
      } else {
        /** @type {number} */
        width = Math.max(minWidth, Math.min(width, maxWidth));
        if (current.autoHeight && "iframe" !== current.type) {
          inner.width(width);
          height = inner.height();
        }
        /** @type {number} */
        height = Math.max(minHeight, Math.min(height, maxHeight));
      }
      if (current.fitToView) {
        if (inner.width(width).height(height), wrap.width(width + wPadding), width_ = wrap.width(), height_ = wrap.height(), current.aspectRatio) {
          for (; (width_ > wSpace || height_ > maxHeight_) && width > minWidth && height > minHeight && !(19 < canShrink++);) {
            /** @type {number} */
            height = Math.max(minHeight, Math.min(maxHeight, height - 10));
            width = getScalar(height * ratio);
            if (width < minWidth) {
              width = minWidth;
              height = getScalar(width / ratio);
            }
            if (width > maxWidth) {
              width = maxWidth;
              height = getScalar(width / ratio);
            }
            inner.width(width).height(height);
            wrap.width(width + wPadding);
            width_ = wrap.width();
            height_ = wrap.height();
          }
        } else {
          /** @type {number} */
          width = Math.max(minWidth, Math.min(width, width - (width_ - wSpace)));
          /** @type {number} */
          height = Math.max(minHeight, Math.min(height, height - (height_ - maxHeight_)));
        }
      }
      if (scrollOut && "auto" === scrolling && height < size && width + wPadding + scrollOut < wSpace) {
        width = width + scrollOut;
      }
      inner.width(width).height(height);
      wrap.width(width + wPadding);
      width_ = wrap.width();
      height_ = wrap.height();
      /** @type {boolean} */
      canShrink = (width_ > wSpace || height_ > maxHeight_) && width > minWidth && height > minHeight;
      /** @type {boolean} */
      width = current.aspectRatio ? width < origMaxWidth && height < origMaxHeight && width < value && height < size : (width < origMaxWidth || height < origMaxHeight) && (width < value || height < size);
      $.extend(current, {
        dim : {
          width : getValue(width_),
          height : getValue(height_)
        },
        origWidth : value,
        origHeight : size,
        canShrink : canShrink,
        canExpand : width,
        wPadding : wPadding,
        hPadding : hPadding,
        wrapSpace : height_ - skin.outerHeight(true),
        skinSpace : skin.height() - height
      });
      if (!iframe && current.autoHeight && height > minHeight && height < maxHeight && !width) {
        inner.height("auto");
      }
    },
    _getPosition : function(name) {
      var current = F.current;
      var viewport = F.getViewport();
      var rez = current.margin;
      var width = F.wrap.width() + rez[1] + rez[3];
      var height = F.wrap.height() + rez[0] + rez[2];
      rez = {
        position : "absolute",
        top : rez[0],
        left : rez[3]
      };
      if (current.autoCenter && current.fixed && !name && height <= viewport.h && width <= viewport.w) {
        /** @type {string} */
        rez.position = "fixed";
      } else {
        if (!current.locked) {
          rez.top += viewport.y;
          rez.left += viewport.x;
        }
      }
      rez.top = getValue(Math.max(rez.top, rez.top + (viewport.h - height) * current.topRatio));
      rez.left = getValue(Math.max(rez.left, rez.left + (viewport.w - width) * current.leftRatio));
      return rez;
    },
    _afterZoomIn : function() {
      var current = F.current;
      if (current) {
        if (F.isOpen = F.isOpened = true, F.wrap.css("overflow", "visible").addClass("fancybox-opened"), F.update(), (current.closeClick || current.nextClick && 1 < F.group.length) && F.inner.css("cursor", "pointer").bind("click.fb", function(event) {
          if (!($(event.target).is("a") || $(event.target).parent().is("a"))) {
            event.preventDefault();
            F[current.closeClick ? "close" : "next"]();
          }
        }), current.closeBtn && $(current.tpl.closeBtn).appendTo(F.skin).bind("click.fb", function(event) {
          event.preventDefault();
          F.close();
        }), current.arrows && 1 < F.group.length && ((current.loop || 0 < current.index) && $(current.tpl.prev).appendTo(F.outer).bind("click.fb", F.prev), (current.loop || current.index < F.group.length - 1) && $(current.tpl.next).appendTo(F.outer).bind("click.fb", F.next)), F.trigger("afterShow"), current.loop || current.index !== current.group.length - 1) {
          if (F.opts.autoPlay && !F.player.isActive) {
            /** @type {boolean} */
            F.opts.autoPlay = false;
            F.play();
          }
        } else {
          F.play(false);
        }
      }
    },
    _afterZoomOut : function(name) {
      name = name || F.current;
      $(".fancybox-wrap").trigger("onReset").remove();
      $.extend(F, {
        group : {},
        opts : {},
        router : false,
        current : null,
        isActive : false,
        isOpened : false,
        isOpen : false,
        isClosing : false,
        wrap : null,
        skin : null,
        outer : null,
        inner : null
      });
      F.trigger("afterClose", name);
    }
  });
  F.transitions = {
    getOrigPosition : function() {
      var current = F.current;
      var element = current.element;
      var orig = current.orig;
      var pos = {};
      /** @type {number} */
      var width = 50;
      /** @type {number} */
      var height = 50;
      var hPadding = current.hPadding;
      var wPadding = current.wPadding;
      var viewport = F.getViewport();
      if (!orig && current.isDom && element.is(":visible")) {
        orig = element.find("img:first");
        if (!orig.length) {
          orig = element;
        }
      }
      if (isQuery(orig)) {
        pos = orig.offset();
        if (orig.is("img")) {
          width = orig.outerWidth();
          height = orig.outerHeight();
        }
      } else {
        pos.top = viewport.y + (viewport.h - height) * current.topRatio;
        pos.left = viewport.x + (viewport.w - width) * current.leftRatio;
      }
      if ("fixed" === F.wrap.css("position") || current.locked) {
        pos.top -= viewport.y;
        pos.left -= viewport.x;
      }
      return pos = {
        top : getValue(pos.top - hPadding * current.topRatio),
        left : getValue(pos.left - wPadding * current.leftRatio),
        width : getValue(width + wPadding),
        height : getValue(height + hPadding)
      };
    },
    step : function(value, item) {
      var current;
      var prop = item.prop;
      current = F.current;
      var wrapSpace = current.wrapSpace;
      var skinSpace = current.skinSpace;
      if ("width" === prop || "height" === prop) {
        /** @type {number} */
        item = item.end === item.start ? 1 : (value - item.start) / (item.end - item.start);
        if (F.isClosing) {
          /** @type {number} */
          item = 1 - item;
        }
        current = "width" === prop ? current.wPadding : current.hPadding;
        /** @type {number} */
        value = value - current;
        F.skin[prop](getScalar("width" === prop ? value : value - wrapSpace * item));
        F.inner[prop](getScalar("width" === prop ? value : value - wrapSpace * item - skinSpace * item));
      }
    },
    zoomIn : function() {
      var current = F.current;
      var startPos = current.pos;
      var effect = current.openEffect;
      /** @type {boolean} */
      var elastic = "elastic" === effect;
      var progress = $.extend({
        opacity : 1
      }, startPos);
      delete progress.position;
      if (elastic) {
        startPos = this.getOrigPosition();
        if (current.openOpacity) {
          /** @type {number} */
          startPos.opacity = .1;
        }
      } else {
        if ("fade" === effect) {
          /** @type {number} */
          startPos.opacity = .1;
        }
      }
      F.wrap.css(startPos).animate(progress, {
        duration : "none" === effect ? 0 : current.openSpeed,
        easing : current.openEasing,
        step : elastic ? this.step : null,
        complete : F._afterZoomIn
      });
    },
    zoomOut : function() {
      var current = F.current;
      var effect = current.closeEffect;
      /** @type {boolean} */
      var elastic = "elastic" === effect;
      var style = {
        opacity : .1
      };
      if (elastic) {
        style = this.getOrigPosition();
        if (current.closeOpacity) {
          /** @type {number} */
          style.opacity = .1;
        }
      }
      F.wrap.animate(style, {
        duration : "none" === effect ? 0 : current.closeSpeed,
        easing : current.closeEasing,
        step : elastic ? this.step : null,
        complete : F._afterZoomOut
      });
    },
    changeIn : function() {
      var current = F.current;
      var effect = current.nextEffect;
      var startPos = current.pos;
      var style = {
        opacity : 1
      };
      var direction = F.direction;
      var field;
      /** @type {number} */
      startPos.opacity = .1;
      if ("elastic" === effect) {
        /** @type {string} */
        field = "down" === direction || "up" === direction ? "top" : "left";
        if ("down" === direction || "right" === direction) {
          startPos[field] = getValue(getScalar(startPos[field]) - 200);
          /** @type {string} */
          style[field] = "+=200px";
        } else {
          startPos[field] = getValue(getScalar(startPos[field]) + 200);
          /** @type {string} */
          style[field] = "-=200px";
        }
      }
      if ("none" === effect) {
        F._afterZoomIn();
      } else {
        F.wrap.css(startPos).animate(style, {
          duration : current.nextSpeed,
          easing : current.nextEasing,
          complete : F._afterZoomIn
        });
      }
    },
    changeOut : function() {
      var previous = F.previous;
      var effect = previous.prevEffect;
      var style = {
        opacity : .1
      };
      var dir = F.direction;
      if ("elastic" === effect) {
        /** @type {string} */
        style["down" === dir || "up" === dir ? "top" : "left"] = ("up" === dir || "left" === dir ? "-" : "+") + "=200px";
      }
      previous.wrap.animate(style, {
        duration : "none" === effect ? 0 : previous.prevSpeed,
        easing : previous.prevEasing,
        complete : function() {
          $(this).trigger("onReset").remove();
        }
      });
    }
  };
  F.helpers.overlay = {
    defaults : {
      closeClick : true,
      speedOut : 200,
      showEarly : true,
      css : {},
      locked : !isTouch,
      fixed : true
    },
    overlay : null,
    fixed : false,
    el : $("html"),
    create : function(opts) {
      opts = $.extend({}, this.defaults, opts);
      if (this.overlay) {
        this.close();
      }
      this.overlay = $('<div class="fancybox-overlay"></div>').appendTo(F.coming ? F.coming.parent : opts.parent);
      /** @type {boolean} */
      this.fixed = false;
      if (opts.fixed && F.defaults.fixed) {
        this.overlay.addClass("fancybox-overlay-fixed");
        /** @type {boolean} */
        this.fixed = true;
      }
    },
    open : function(name) {
      var rejectingServer = this;
      name = $.extend({}, this.defaults, name);
      if (this.overlay) {
        this.overlay.unbind(".overlay").width("auto").height("auto");
      } else {
        this.create(name);
      }
      if (!this.fixed) {
        W.bind("resize.overlay", $.proxy(this.update, this));
        this.update();
      }
      if (name.closeClick) {
        this.overlay.bind("click.overlay", function(jEvent) {
          if ($(jEvent.target).hasClass("fancybox-overlay")) {
            return F.isActive ? F.close() : rejectingServer.close(), false;
          }
        });
      }
      this.overlay.css(name.css).show();
    },
    close : function() {
      var name;
      var value;
      W.unbind("resize.overlay");
      if (this.el.hasClass("fancybox-lock")) {
        $(".fancybox-margin").removeClass("fancybox-margin");
        name = W.scrollTop();
        value = W.scrollLeft();
        this.el.removeClass("fancybox-lock");
        W.scrollTop(name).scrollLeft(value);
      }
      $(".fancybox-overlay").remove().hide();
      $.extend(this, {
        overlay : null,
        fixed : false
      });
    },
    update : function() {
      /** @type {string} */
      var width = "100%";
      var c;
      this.overlay.width(width).height("100%");
      if (enable_keys) {
        /** @type {number} */
        c = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);
        if (D.width() > c) {
          width = D.width();
        }
      } else {
        if (D.width() > W.width()) {
          width = D.width();
        }
      }
      this.overlay.width(width).height(D.height());
    },
    onReady : function(opts, obj) {
      var overlay = this.overlay;
      $(".fancybox-overlay").stop(true, true);
      if (!overlay) {
        this.create(opts);
      }
      if (opts.locked && this.fixed && obj.fixed) {
        if (!overlay) {
          this.margin = D.height() > W.height() ? $("html").css("margin-right").replace("px", "") : false;
        }
        obj.locked = this.overlay.append(obj.wrap);
        /** @type {boolean} */
        obj.fixed = false;
      }
      if (true === opts.showEarly) {
        this.beforeShow.apply(this, arguments);
      }
    },
    beforeShow : function(name, value) {
      var scrollLeft;
      if (value.locked) {
        if (false !== this.margin) {
          $("*").filter(function() {
            return "fixed" === $(this).css("position") && !$(this).hasClass("fancybox-overlay") && !$(this).hasClass("fancybox-wrap");
          }).addClass("fancybox-margin");
          this.el.addClass("fancybox-margin");
        }
        value = W.scrollTop();
        scrollLeft = W.scrollLeft();
        this.el.addClass("fancybox-lock");
        W.scrollTop(value).scrollLeft(scrollLeft);
      }
      this.open(name);
    },
    onUpdate : function() {
      if (!this.fixed) {
        this.update();
      }
    },
    afterClose : function(name) {
      if (this.overlay && !F.coming) {
        this.overlay.fadeOut(name.speedOut, $.proxy(this.close, this));
      }
    }
  };
  F.helpers.title = {
    defaults : {
      type : "float",
      position : "bottom"
    },
    beforeShow : function(name) {
      var title = F.current;
      var t = title.title;
      var target = name.type;
      if ($.isFunction(t)) {
        t = t.call(title.element, title);
      }
      if (isString(t) && "" !== $.trim(t)) {
        title = $('<div class="fancybox-title fancybox-title-' + target + '-wrap">' + t + "</div>");
        switch(target) {
          case "inside":
            target = F.skin;
            break;
          case "outside":
            target = F.wrap;
            break;
          case "over":
            target = F.inner;
            break;
          default:
            target = F.skin;
            title.appendTo("body");
            if (enable_keys) {
              title.width(title.width());
            }
            title.wrapInner('<span class="child"></span>');
            F.current.margin[2] += Math.abs(getScalar(title.css("margin-bottom")));
        }
        title["top" === name.position ? "prependTo" : "appendTo"](target);
      }
    }
  };
  /**
   * @param {!Object} options
   * @return {?}
   */
  $.fn.fancybox = function(options) {
    var NORMAL_REGISTER;
    var that = $(this);
    var selector = this.selector || "";
    /**
     * @param {!Event} event
     * @return {undefined}
     */
    var run = function(event) {
      var image = $(this).blur();
      var n = NORMAL_REGISTER;
      var name;
      var c;
      if (!(event.ctrlKey || event.altKey || event.shiftKey || event.metaKey || image.is(".fancybox-wrap"))) {
        name = options.groupAttr || "data-fancybox-group";
        c = image.attr(name);
        if (!c) {
          /** @type {string} */
          name = "rel";
          c = image.get(0)[name];
        }
        if (c && "" !== c && "nofollow" !== c) {
          image = selector.length ? $(selector) : that;
          image = image.filter("[" + name + '="' + c + '"]');
          n = image.index(this);
        }
        options.index = n;
        if (false !== F.open(image, options)) {
          event.preventDefault();
        }
      }
    };
    options = options || {};
    NORMAL_REGISTER = options.index || 0;
    if (selector && false !== options.live) {
      D.undelegate(selector, "click.fb-start").delegate(selector + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", run);
    } else {
      that.unbind("click.fb-start").bind("click.fb-start", run);
    }
    this.filter("[data-fancybox-start=1]").trigger("click");
    return this;
  };
  D.ready(function() {
    var b;
    var a;
    if ($.scrollbarWidth === undefined) {
      /**
       * @return {?}
       */
      $.scrollbarWidth = function() {
        var parent_item = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body");
        var faElem = parent_item.children();
        /** @type {number} */
        faElem = faElem.innerWidth() - faElem.height(99).innerWidth();
        parent_item.remove();
        return faElem;
      };
    }
    if ($.support.fixedPosition === undefined) {
      $.support.fixedPosition = function() {
        var elem = $('<div style="position:fixed;top:20px;"></div>').appendTo("body");
        /** @type {boolean} */
        var b = 20 === elem[0].offsetTop || 15 === elem[0].offsetTop;
        elem.remove();
        return b;
      }();
    }
    $.extend(F.defaults, {
      scrollbarWidth : $.scrollbarWidth(),
      fixed : $.support.fixedPosition,
      parent : $("body")
    });
    b = $(window).width();
    H.addClass("fancybox-lock-test");
    a = $(window).width();
    H.removeClass("fancybox-lock-test");
    $("<style type='text/css'>.fancybox-margin{margin-right:" + (a - b) + "px;}</style>").appendTo("head");
  });
})(window, document, jQuery);
(function(window) {
  /**
   * @param {!Object} context
   * @return {undefined}
   */
  function resolver(context) {
    if (context && context.printPage) {
      context.printPage();
    } else {
      setTimeout(function() {
        resolver(context);
      }, 50);
    }
  }
  /**
   * @param {string} element
   * @return {?}
   */
  function _getElementHTMLIncludingFormElements(element) {
    element = $(element);
    $(":checked", element).each(function() {
      this.setAttribute("checked", "checked");
    });
    $("input[type='text']", element).each(function() {
      this.setAttribute("value", $(this).val());
    });
    $("select", element).each(function() {
      var $holder = $(this);
      $("option", $holder).each(function() {
        if ($holder.val() == $(this).val()) {
          this.setAttribute("selected", "selected");
        }
      });
    });
    $("textarea", element).each(function() {
      var value = $(this).attr("value");
      if ($.browser.b && this.firstChild) {
        this.firstChild.textContent = value;
      } else {
        this.innerHTML = value;
      }
    });
    return $("<div></div>").append(element.clone()).html();
  }
  /**
   * @param {string} target
   * @param {!Object} options
   * @return {?}
   */
  function init(target, options) {
    var g = $(target);
    target = _getElementHTMLIncludingFormElements(target);
    /** @type {!Array} */
    var outChance = [];
    outChance.push("<html><head><title>" + options.pageTitle + "</title>");
    if (options.overrideElementCSS) {
      if (0 < options.overrideElementCSS.length) {
        /** @type {number} */
        var i = 0;
        for (; i < options.overrideElementCSS.length; i++) {
          var a = options.overrideElementCSS[i];
          if ("string" == typeof a) {
            outChance.push('<link type="text/css" rel="stylesheet" href="' + a + '" >');
          } else {
            outChance.push('<link type="text/css" rel="stylesheet" href="' + a.href + '" media="' + a.media + '" >');
          }
        }
      }
    } else {
      $("link", document).filter(function() {
        return "stylesheet" == $(this).attr("rel").toLowerCase();
      }).each(function() {
        outChance.push('<link type="text/css" rel="stylesheet" href="' + $(this).attr("href") + '" media="' + $(this).attr("media") + '" >');
      });
    }
    outChance.push('<base href="' + (window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + window.location.pathname) + '" />');
    outChance.push('</head><body style="' + options.printBodyOptions.styleToAdd + '" class="' + options.printBodyOptions.classNameToAdd + '">');
    outChance.push('<div class="' + g.attr("class") + '">' + target + "</div>");
    outChance.push('<script type="text/javascript">function printPage(){focus();print();' + ($.browser.opera || options.leaveOpen || "popup" != options.printMode.toLowerCase() ? "" : "close();") + "}\x3c/script>");
    outChance.push("</body></html>");
    return outChance.join("");
  }
  var document = window.document;
  var $ = window.jQuery;
  /**
   * @param {?} defaultSetting
   * @return {?}
   */
  $.fn.printElement = function(defaultSetting) {
    var options = $.extend({}, $.fn.printElement.defaults, defaultSetting);
    if ("iframe" == options.printMode && ($.browser.opera || /chrome/.test(navigator.userAgent.toLowerCase()))) {
      /** @type {string} */
      options.printMode = "popup";
    }
    $("[id^='printElement_']").remove();
    return this.each(function() {
      var data = $.a ? $.extend({}, options, $(this).data()) : options;
      var obj = $(this);
      obj = init(obj, data);
      var id;
      if ("popup" == data.printMode.toLowerCase()) {
        /** @type {(Window|null)} */
        id = window.open("about:blank", "printElementWindow", "width=650,height=440,scrollbars=yes");
        data = id.document;
      } else {
        /** @type {string} */
        id = "printElement_" + Math.round(99999 * Math.random()).toString();
        var iframe = document.createElement("IFRAME");
        $(iframe).attr({
          style : data.iframeElementOptions.styleToAdd,
          id : id,
          className : data.iframeElementOptions.classNameToAdd,
          frameBorder : 0,
          scrolling : "no",
          src : "about:blank"
        });
        document.body.appendChild(iframe);
        data = iframe.contentWindow || iframe.contentDocument;
        if (data.document) {
          data = data.document;
        }
        iframe = document.frames ? document.frames[id] : document.getElementById(id);
        id = iframe.contentWindow || iframe;
      }
      focus();
      data.open();
      data.write(obj);
      data.close();
      resolver(id);
    });
  };
  $.fn.printElement.defaults = {
    printMode : "iframe",
    pageTitle : "",
    overrideElementCSS : null,
    printBodyOptions : {
      styleToAdd : "padding:10px;margin:10px;",
      classNameToAdd : ""
    },
    leaveOpen : false,
    iframeElementOptions : {
      styleToAdd : "border:none;position:absolute;width:0px;height:0px;bottom:0px;left:0px;",
      classNameToAdd : ""
    }
  };
  $.fn.printElement.cssElement = {
    href : "",
    media : ""
  };
})(window);
(function($) {
  /**
   * @return {?}
   */
  $.fn.PlaceholderShow = function() {
    return this.not("[type=submit]").each(function() {
      if (0 !== $(this).nextAll(".f_placeholder").length) {
        $(this).nextAll(".f_placeholder").show();
      }
    });
  };
  /**
   * @return {?}
   */
  $.fn.PlaceholderHide = function() {
    return this.not("[type=submit]").each(function() {
      if (0 !== $(this).nextAll(".f_placeholder").length) {
        $(this).nextAll(".f_placeholder").hide();
      }
    });
  };
  /**
   * @return {?}
   */
  $.fn.PlaceholderRemove = function() {
    return this.not("[type=submit]").each(function() {
      if (0 !== $(this).nextAll(".f_placeholder").length && $(this).parent().hasClass("f_placeholder_wrapper")) {
        $(this).attr("placeholder", $(this).nextAll(".f_placeholder").text());
        $(this).nextAll(".f_placeholder").remove();
        $(this).parent().replaceWith($(this));
      }
    });
  };
  /**
   * @param {?} a
   * @return {?}
   */
  $.fn.PlaceholderFallback = function(a) {
    return this.not("[type=submit]").each(function() {
      var label = $(this).attr("placeholder");
      if (label && label.length) {
        var element = $(this).on("blur", function(event) {
          event.preventDefault();
          if (!$(this).val()) {
            d.show();
          }
        }).on("keyup keydown change", function(a) {
          if ($(this).val()) {
            d.hide();
          } else {
            d.show();
          }
        });
        var d = $(document.createElement("div")).text(label).css({
          display : "none",
          position : "absolute",
          left : 0,
          top : 0,
          width : element.width(),
          height : element.height()
        }).on("click", function(event) {
          element.focus();
          event.preventDefault();
        }).addClass("f_placeholder");
        $(document.createElement("div")).css("position", "relative").insertAfter(element).append(element, d).addClass("f_placeholder_wrapper");
        if (!element.val()) {
          d.show();
        }
        element.removeAttr("placeholder");
      }
    });
  };
})(jQuery);
(function($) {
  $.fn.addBack = $.fn.addBack || $.fn.andSelf;
  $.fn.extend({
    actual : function(b, init) {
      if (!this[b]) {
        throw '$.actual => The jQuery method "' + b + '" you called does not exist';
      }
      var i = $.extend({
        absolute : false,
        clone : false,
        includeMargin : false
      }, init);
      var e = this.eq(0);
      var h;
      if (true === i.clone) {
        /**
         * @return {undefined}
         */
        h = function() {
          e = e.clone().attr("style", "position: absolute !important; top: -1000 !important; ").appendTo("body");
        };
        /**
         * @return {undefined}
         */
        init = function() {
          e.remove();
        };
      } else {
        /** @type {!Array} */
        var rs = [];
        /** @type {string} */
        var key = "";
        var syncedAnimals;
        /**
         * @return {undefined}
         */
        h = function() {
          syncedAnimals = e.parents().addBack().filter(":hidden");
          key = key + "visibility: hidden !important; display: block !important; ";
          if (true === i.absolute) {
            /** @type {string} */
            key = key + "position: absolute !important; ";
          }
          syncedAnimals.each(function() {
            var element = $(this);
            var i = element.attr("style");
            rs.push(i);
            element.attr("style", i ? i + ";" + key : key);
          });
        };
        /**
         * @return {undefined}
         */
        init = function() {
          syncedAnimals.each(function(r) {
            var menu = $(this);
            r = rs[r];
            if (void 0 === r) {
              menu.removeAttr("style");
            } else {
              menu.attr("style", r);
            }
          });
        };
      }
      h();
      b = /(outer)/.test(b) ? e[b](i.includeMargin) : e[b]();
      init();
      return b;
    }
  });
})(jQuery);
