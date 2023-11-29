!(function () {
  "use strict";

  function t(o) {
    if (!o) throw new Error("No options passed to Waypoint constructor");
    if (!o.element)
      throw new Error("No element option passed to Waypoint constructor");
    if (!o.handler)
      throw new Error("No handler option passed to Waypoint constructor");
    (this.key = "waypoint-" + e),
      (this.options = t.Adapter.extend({}, t.defaults, o)),
      (this.element = this.options.element),
      (this.adapter = new t.Adapter(this.element)),
      (this.callback = o.handler),
      (this.axis = this.options.horizontal ? "horizontal" : "vertical"),
      (this.enabled = this.options.enabled),
      (this.triggerPoint = null),
      (this.group = t.Group.findOrCreate({
        name: this.options.group,
        axis: this.axis,
      })),
      (this.context = t.Context.findOrCreateByElement(this.options.context)),
      t.offsetAliases[this.options.offset] &&
        (this.options.offset = t.offsetAliases[this.options.offset]),
      this.group.add(this),
      this.context.add(this),
      (i[this.key] = this),
      (e += 1);
  }
  var e = 0,
    i = {};
  (t.prototype.queueTrigger = function (t) {
    this.group.queueTrigger(this, t);
  }),
    (t.prototype.trigger = function (t) {
      this.enabled && this.callback && this.callback.apply(this, t);
    }),
    (t.prototype.destroy = function () {
      this.context.remove(this), this.group.remove(this), delete i[this.key];
    }),
    (t.prototype.disable = function () {
      return (this.enabled = !1), this;
    }),
    (t.prototype.enable = function () {
      return this.context.refresh(), (this.enabled = !0), this;
    }),
    (t.prototype.next = function () {
      return this.group.next(this);
    }),
    (t.prototype.previous = function () {
      return this.group.previous(this);
    }),
    (t.invokeAll = function (t) {
      var e = [];
      for (var o in i) e.push(i[o]);
      for (var n = 0, r = e.length; r > n; n++) e[n][t]();
    }),
    (t.destroyAll = function () {
      t.invokeAll("destroy");
    }),
    (t.disableAll = function () {
      t.invokeAll("disable");
    }),
    (t.enableAll = function () {
      t.Context.refreshAll();
      for (var e in i) i[e].enabled = !0;
      return this;
    }),
    (t.refreshAll = function () {
      t.Context.refreshAll();
    }),
    (t.viewportHeight = function () {
      return window.innerHeight || document.documentElement.clientHeight;
    }),
    (t.viewportWidth = function () {
      return document.documentElement.clientWidth;
    }),
    (t.adapters = []),
    (t.defaults = {
      context: window,
      continuous: !0,
      enabled: !0,
      group: "default",
      horizontal: !1,
      offset: 0,
    }),
    (t.offsetAliases = {
      "bottom-in-view": function () {
        return this.context.innerHeight() - this.adapter.outerHeight();
      },
      "right-in-view": function () {
        return this.context.innerWidth() - this.adapter.outerWidth();
      },
    }),
    (window.Waypoint = t);
})(),
  (function () {
    "use strict";

    function t(t) {
      window.setTimeout(t, 1e3 / 60);
    }

    function e(t) {
      (this.element = t),
        (this.Adapter = n.Adapter),
        (this.adapter = new this.Adapter(t)),
        (this.key = "waypoint-context-" + i),
        (this.didScroll = !1),
        (this.didResize = !1),
        (this.oldScroll = {
          x: this.adapter.scrollLeft(),
          y: this.adapter.scrollTop(),
        }),
        (this.waypoints = {
          vertical: {},
          horizontal: {},
        }),
        (t.waypointContextKey = this.key),
        (o[t.waypointContextKey] = this),
        (i += 1),
        n.windowContext ||
          ((n.windowContext = !0), (n.windowContext = new e(window))),
        this.createThrottledScrollHandler(),
        this.createThrottledResizeHandler();
    }
    var i = 0,
      o = {},
      n = window.Waypoint,
      r = window.onload;
    (e.prototype.add = function (t) {
      var e = t.options.horizontal ? "horizontal" : "vertical";
      (this.waypoints[e][t.key] = t), this.refresh();
    }),
      (e.prototype.checkEmpty = function () {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
          e = this.Adapter.isEmptyObject(this.waypoints.vertical),
          i = this.element == this.element.window;
        t && e && !i && (this.adapter.off(".waypoints"), delete o[this.key]);
      }),
      (e.prototype.createThrottledResizeHandler = function () {
        function t() {
          e.handleResize(), (e.didResize = !1);
        }
        var e = this;
        this.adapter.on("resize.waypoints", function () {
          e.didResize || ((e.didResize = !0), n.requestAnimationFrame(t));
        });
      }),
      (e.prototype.createThrottledScrollHandler = function () {
        function t() {
          e.handleScroll(), (e.didScroll = !1);
        }
        var e = this;
        this.adapter.on("scroll.waypoints", function () {
          (!e.didScroll || n.isTouch) &&
            ((e.didScroll = !0), n.requestAnimationFrame(t));
        });
      }),
      (e.prototype.handleResize = function () {
        n.Context.refreshAll();
      }),
      (e.prototype.handleScroll = function () {
        var t = {},
          e = {
            horizontal: {
              newScroll: this.adapter.scrollLeft(),
              oldScroll: this.oldScroll.x,
              forward: "right",
              backward: "left",
            },
            vertical: {
              newScroll: this.adapter.scrollTop(),
              oldScroll: this.oldScroll.y,
              forward: "down",
              backward: "up",
            },
          };
        for (var i in e) {
          var o = e[i],
            n = o.newScroll > o.oldScroll,
            r = n ? o.forward : o.backward;
          for (var s in this.waypoints[i]) {
            var a = this.waypoints[i][s];
            if (null !== a.triggerPoint) {
              var l = o.oldScroll < a.triggerPoint,
                h = o.newScroll >= a.triggerPoint,
                p = l && h,
                u = !l && !h;
              (p || u) && (a.queueTrigger(r), (t[a.group.id] = a.group));
            }
          }
        }
        for (var c in t) t[c].flushTriggers();
        this.oldScroll = {
          x: e.horizontal.newScroll,
          y: e.vertical.newScroll,
        };
      }),
      (e.prototype.innerHeight = function () {
        return this.element == this.element.window
          ? n.viewportHeight()
          : this.adapter.innerHeight();
      }),
      (e.prototype.remove = function (t) {
        delete this.waypoints[t.axis][t.key], this.checkEmpty();
      }),
      (e.prototype.innerWidth = function () {
        return this.element == this.element.window
          ? n.viewportWidth()
          : this.adapter.innerWidth();
      }),
      (e.prototype.destroy = function () {
        var t = [];
        for (var e in this.waypoints)
          for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
        for (var o = 0, n = t.length; n > o; o++) t[o].destroy();
      }),
      (e.prototype.refresh = function () {
        var t,
          e = this.element == this.element.window,
          i = e ? void 0 : this.adapter.offset(),
          o = {};
        this.handleScroll(),
          (t = {
            horizontal: {
              contextOffset: e ? 0 : i.left,
              contextScroll: e ? 0 : this.oldScroll.x,
              contextDimension: this.innerWidth(),
              oldScroll: this.oldScroll.x,
              forward: "right",
              backward: "left",
              offsetProp: "left",
            },
            vertical: {
              contextOffset: e ? 0 : i.top,
              contextScroll: e ? 0 : this.oldScroll.y,
              contextDimension: this.innerHeight(),
              oldScroll: this.oldScroll.y,
              forward: "down",
              backward: "up",
              offsetProp: "top",
            },
          });
        for (var r in t) {
          var s = t[r];
          for (var a in this.waypoints[r]) {
            var l,
              h,
              p,
              u,
              c,
              d = this.waypoints[r][a],
              f = d.options.offset,
              w = d.triggerPoint,
              y = 0,
              g = null == w;
            d.element !== d.element.window &&
              (y = d.adapter.offset()[s.offsetProp]),
              "function" == typeof f
                ? (f = f.apply(d))
                : "string" == typeof f &&
                  ((f = parseFloat(f)),
                  d.options.offset.indexOf("%") > -1 &&
                    (f = Math.ceil((s.contextDimension * f) / 100))),
              (l = s.contextScroll - s.contextOffset),
              (d.triggerPoint = Math.floor(y + l - f)),
              (h = w < s.oldScroll),
              (p = d.triggerPoint >= s.oldScroll),
              (u = h && p),
              (c = !h && !p),
              !g && u
                ? (d.queueTrigger(s.backward), (o[d.group.id] = d.group))
                : !g && c
                ? (d.queueTrigger(s.forward), (o[d.group.id] = d.group))
                : g &&
                  s.oldScroll >= d.triggerPoint &&
                  (d.queueTrigger(s.forward), (o[d.group.id] = d.group));
          }
        }
        return (
          n.requestAnimationFrame(function () {
            for (var t in o) o[t].flushTriggers();
          }),
          this
        );
      }),
      (e.findOrCreateByElement = function (t) {
        return e.findByElement(t) || new e(t);
      }),
      (e.refreshAll = function () {
        for (var t in o) o[t].refresh();
      }),
      (e.findByElement = function (t) {
        return o[t.waypointContextKey];
      }),
      (window.onload = function () {
        r && r(), e.refreshAll();
      }),
      (n.requestAnimationFrame = function (e) {
        var i =
          window.requestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          t;
        i.call(window, e);
      }),
      (n.Context = e);
  })(),
  (function () {
    "use strict";

    function t(t, e) {
      return t.triggerPoint - e.triggerPoint;
    }

    function e(t, e) {
      return e.triggerPoint - t.triggerPoint;
    }

    function i(t) {
      (this.name = t.name),
        (this.axis = t.axis),
        (this.id = this.name + "-" + this.axis),
        (this.waypoints = []),
        this.clearTriggerQueues(),
        (o[this.axis][this.name] = this);
    }
    var o = {
        vertical: {},
        horizontal: {},
      },
      n = window.Waypoint;
    (i.prototype.add = function (t) {
      this.waypoints.push(t);
    }),
      (i.prototype.clearTriggerQueues = function () {
        this.triggerQueues = {
          up: [],
          down: [],
          left: [],
          right: [],
        };
      }),
      (i.prototype.flushTriggers = function () {
        for (var i in this.triggerQueues) {
          var o = this.triggerQueues[i],
            n = "up" === i || "left" === i;
          o.sort(n ? e : t);
          for (var r = 0, s = o.length; s > r; r += 1) {
            var a = o[r];
            (a.options.continuous || r === o.length - 1) && a.trigger([i]);
          }
        }
        this.clearTriggerQueues();
      }),
      (i.prototype.next = function (e) {
        this.waypoints.sort(t);
        var i = n.Adapter.inArray(e, this.waypoints),
          o = i === this.waypoints.length - 1;
        return o ? null : this.waypoints[i + 1];
      }),
      (i.prototype.previous = function (e) {
        this.waypoints.sort(t);
        var i = n.Adapter.inArray(e, this.waypoints);
        return i ? this.waypoints[i - 1] : null;
      }),
      (i.prototype.queueTrigger = function (t, e) {
        this.triggerQueues[e].push(t);
      }),
      (i.prototype.remove = function (t) {
        var e = n.Adapter.inArray(t, this.waypoints);
        e > -1 && this.waypoints.splice(e, 1);
      }),
      (i.prototype.first = function () {
        return this.waypoints[0];
      }),
      (i.prototype.last = function () {
        return this.waypoints[this.waypoints.length - 1];
      }),
      (i.findOrCreate = function (t) {
        return o[t.axis][t.name] || new i(t);
      }),
      (n.Group = i);
  })(),
  (function () {
    "use strict";

    function t(t) {
      this.$element = e(t);
    }
    var e = window.jQuery,
      i = window.Waypoint;
    e.each(
      [
        "innerHeight",
        "innerWidth",
        "off",
        "offset",
        "on",
        "outerHeight",
        "outerWidth",
        "scrollLeft",
        "scrollTop",
      ],
      function (e, i) {
        t.prototype[i] = function () {
          var t = Array.prototype.slice.call(arguments);
          return this.$element[i].apply(this.$element, t);
        };
      }
    ),
      e.each(["extend", "inArray", "isEmptyObject"], function (i, o) {
        t[o] = e[o];
      }),
      i.adapters.push({
        name: "jquery",
        Adapter: t,
      }),
      (i.Adapter = t);
  })(),
  (function () {
    "use strict";

    function t(t) {
      return function () {
        var i = [],
          o = arguments[0];
        return (
          t.isFunction(arguments[0]) &&
            ((o = t.extend({}, arguments[1])), (o.handler = arguments[0])),
          this.each(function () {
            var n = t.extend({}, o, {
              element: this,
            });
            "string" == typeof n.context &&
              (n.context = t(this).closest(n.context)[0]),
              i.push(new e(n));
          }),
          i
        );
      };
    }
    var e = window.Waypoint;
    window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)),
      window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto));
  })();

/*!
 * Isotope PACKAGED v3.0.6
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * https://isotope.metafizzy.co
 * Copyright 2010-2018 Metafizzy
 */

!(function (t, e) {
  "function" == typeof define && define.amd
    ? define("jquery-bridget/jquery-bridget", ["jquery"], function (i) {
        return e(t, i);
      })
    : "object" == typeof module && module.exports
    ? (module.exports = e(t, require("jquery")))
    : (t.jQueryBridget = e(t, t.jQuery));
})(window, function (t, e) {
  "use strict";

  function i(i, s, a) {
    function u(t, e, o) {
      var n,
        s = "$()." + i + '("' + e + '")';
      return (
        t.each(function (t, u) {
          var h = a.data(u, i);
          if (!h)
            return void r(
              i + " not initialized. Cannot call methods, i.e. " + s
            );
          var d = h[e];
          if (!d || "_" == e.charAt(0))
            return void r(s + " is not a valid method");
          var l = d.apply(h, o);
          n = void 0 === n ? l : n;
        }),
        void 0 !== n ? n : t
      );
    }

    function h(t, e) {
      t.each(function (t, o) {
        var n = a.data(o, i);
        n ? (n.option(e), n._init()) : ((n = new s(o, e)), a.data(o, i, n));
      });
    }
    (a = a || e || t.jQuery),
      a &&
        (s.prototype.option ||
          (s.prototype.option = function (t) {
            a.isPlainObject(t) &&
              (this.options = a.extend(!0, this.options, t));
          }),
        (a.fn[i] = function (t) {
          if ("string" == typeof t) {
            var e = n.call(arguments, 1);
            return u(this, t, e);
          }
          return h(this, t), this;
        }),
        o(a));
  }

  function o(t) {
    !t || (t && t.bridget) || (t.bridget = i);
  }
  var n = Array.prototype.slice,
    s = t.console,
    r =
      "undefined" == typeof s
        ? function () {}
        : function (t) {
            s.error(t);
          };
  return o(e || t.jQuery), i;
}),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("ev-emitter/ev-emitter", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.EvEmitter = e());
  })("undefined" != typeof window ? window : this, function () {
    function t() {}
    var e = t.prototype;
    return (
      (e.on = function (t, e) {
        if (t && e) {
          var i = (this._events = this._events || {}),
            o = (i[t] = i[t] || []);
          return o.indexOf(e) == -1 && o.push(e), this;
        }
      }),
      (e.once = function (t, e) {
        if (t && e) {
          this.on(t, e);
          var i = (this._onceEvents = this._onceEvents || {}),
            o = (i[t] = i[t] || {});
          return (o[e] = !0), this;
        }
      }),
      (e.off = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          var o = i.indexOf(e);
          return o != -1 && i.splice(o, 1), this;
        }
      }),
      (e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          (i = i.slice(0)), (e = e || []);
          for (
            var o = this._onceEvents && this._onceEvents[t], n = 0;
            n < i.length;
            n++
          ) {
            var s = i[n],
              r = o && o[s];
            r && (this.off(t, s), delete o[s]), s.apply(this, e);
          }
          return this;
        }
      }),
      (e.allOff = function () {
        delete this._events, delete this._onceEvents;
      }),
      t
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("get-size/get-size", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.getSize = e());
  })(window, function () {
    "use strict";

    function t(t) {
      var e = parseFloat(t),
        i = t.indexOf("%") == -1 && !isNaN(e);
      return i && e;
    }

    function e() {}

    function i() {
      for (
        var t = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0,
          },
          e = 0;
        e < h;
        e++
      ) {
        var i = u[e];
        t[i] = 0;
      }
      return t;
    }

    function o(t) {
      var e = getComputedStyle(t);
      return (
        e ||
          a(
            "Style returned " +
              e +
              ". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"
          ),
        e
      );
    }

    function n() {
      if (!d) {
        d = !0;
        var e = document.createElement("div");
        (e.style.width = "200px"),
          (e.style.padding = "1px 2px 3px 4px"),
          (e.style.borderStyle = "solid"),
          (e.style.borderWidth = "1px 2px 3px 4px"),
          (e.style.boxSizing = "border-box");
        var i = document.body || document.documentElement;
        i.appendChild(e);
        var n = o(e);
        (r = 200 == Math.round(t(n.width))),
          (s.isBoxSizeOuter = r),
          i.removeChild(e);
      }
    }

    function s(e) {
      if (
        (n(),
        "string" == typeof e && (e = document.querySelector(e)),
        e && "object" == typeof e && e.nodeType)
      ) {
        var s = o(e);
        if ("none" == s.display) return i();
        var a = {};
        (a.width = e.offsetWidth), (a.height = e.offsetHeight);
        for (
          var d = (a.isBorderBox = "border-box" == s.boxSizing), l = 0;
          l < h;
          l++
        ) {
          var f = u[l],
            c = s[f],
            m = parseFloat(c);
          a[f] = isNaN(m) ? 0 : m;
        }
        var p = a.paddingLeft + a.paddingRight,
          y = a.paddingTop + a.paddingBottom,
          g = a.marginLeft + a.marginRight,
          v = a.marginTop + a.marginBottom,
          _ = a.borderLeftWidth + a.borderRightWidth,
          z = a.borderTopWidth + a.borderBottomWidth,
          I = d && r,
          x = t(s.width);
        x !== !1 && (a.width = x + (I ? 0 : p + _));
        var S = t(s.height);
        return (
          S !== !1 && (a.height = S + (I ? 0 : y + z)),
          (a.innerWidth = a.width - (p + _)),
          (a.innerHeight = a.height - (y + z)),
          (a.outerWidth = a.width + g),
          (a.outerHeight = a.height + v),
          a
        );
      }
    }
    var r,
      a =
        "undefined" == typeof console
          ? e
          : function (t) {
              console.error(t);
            },
      u = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "marginLeft",
        "marginRight",
        "marginTop",
        "marginBottom",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth",
        "borderBottomWidth",
      ],
      h = u.length,
      d = !1;
    return s;
  }),
  (function (t, e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define("desandro-matches-selector/matches-selector", e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.matchesSelector = e());
  })(window, function () {
    "use strict";
    var t = (function () {
      var t = window.Element.prototype;
      if (t.matches) return "matches";
      if (t.matchesSelector) return "matchesSelector";
      for (var e = ["webkit", "moz", "ms", "o"], i = 0; i < e.length; i++) {
        var o = e[i],
          n = o + "MatchesSelector";
        if (t[n]) return n;
      }
    })();
    return function (e, i) {
      return e[t](i);
    };
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "fizzy-ui-utils/utils",
          ["desandro-matches-selector/matches-selector"],
          function (i) {
            return e(t, i);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(t, require("desandro-matches-selector")))
      : (t.fizzyUIUtils = e(t, t.matchesSelector));
  })(window, function (t, e) {
    var i = {};
    (i.extend = function (t, e) {
      for (var i in e) t[i] = e[i];
      return t;
    }),
      (i.modulo = function (t, e) {
        return ((t % e) + e) % e;
      });
    var o = Array.prototype.slice;
    (i.makeArray = function (t) {
      if (Array.isArray(t)) return t;
      if (null === t || void 0 === t) return [];
      var e = "object" == typeof t && "number" == typeof t.length;
      return e ? o.call(t) : [t];
    }),
      (i.removeFrom = function (t, e) {
        var i = t.indexOf(e);
        i != -1 && t.splice(i, 1);
      }),
      (i.getParent = function (t, i) {
        for (; t.parentNode && t != document.body; )
          if (((t = t.parentNode), e(t, i))) return t;
      }),
      (i.getQueryElement = function (t) {
        return "string" == typeof t ? document.querySelector(t) : t;
      }),
      (i.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
      }),
      (i.filterFindElements = function (t, o) {
        t = i.makeArray(t);
        var n = [];
        return (
          t.forEach(function (t) {
            if (t instanceof HTMLElement) {
              if (!o) return void n.push(t);
              e(t, o) && n.push(t);
              for (var i = t.querySelectorAll(o), s = 0; s < i.length; s++)
                n.push(i[s]);
            }
          }),
          n
        );
      }),
      (i.debounceMethod = function (t, e, i) {
        i = i || 100;
        var o = t.prototype[e],
          n = e + "Timeout";
        t.prototype[e] = function () {
          var t = this[n];
          clearTimeout(t);
          var e = arguments,
            s = this;
          this[n] = setTimeout(function () {
            o.apply(s, e), delete s[n];
          }, i);
        };
      }),
      (i.docReady = function (t) {
        var e = document.readyState;
        "complete" == e || "interactive" == e
          ? setTimeout(t)
          : document.addEventListener("DOMContentLoaded", t);
      }),
      (i.toDashed = function (t) {
        return t
          .replace(/(.)([A-Z])/g, function (t, e, i) {
            return e + "-" + i;
          })
          .toLowerCase();
      });
    var n = t.console;
    return (
      (i.htmlInit = function (e, o) {
        i.docReady(function () {
          var s = i.toDashed(o),
            r = "data-" + s,
            a = document.querySelectorAll("[" + r + "]"),
            u = document.querySelectorAll(".js-" + s),
            h = i.makeArray(a).concat(i.makeArray(u)),
            d = r + "-options",
            l = t.jQuery;
          h.forEach(function (t) {
            var i,
              s = t.getAttribute(r) || t.getAttribute(d);
            try {
              i = s && JSON.parse(s);
            } catch (a) {
              return void (
                n &&
                n.error("Error parsing " + r + " on " + t.className + ": " + a)
              );
            }
            var u = new e(t, i);
            l && l.data(t, o, u);
          });
        });
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "outlayer/item",
          ["ev-emitter/ev-emitter", "get-size/get-size"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("ev-emitter"), require("get-size")))
      : ((t.Outlayer = {}), (t.Outlayer.Item = e(t.EvEmitter, t.getSize)));
  })(window, function (t, e) {
    "use strict";

    function i(t) {
      for (var e in t) return !1;
      return (e = null), !0;
    }

    function o(t, e) {
      t &&
        ((this.element = t),
        (this.layout = e),
        (this.position = {
          x: 0,
          y: 0,
        }),
        this._create());
    }

    function n(t) {
      return t.replace(/([A-Z])/g, function (t) {
        return "-" + t.toLowerCase();
      });
    }
    var s = document.documentElement.style,
      r = "string" == typeof s.transition ? "transition" : "WebkitTransition",
      a = "string" == typeof s.transform ? "transform" : "WebkitTransform",
      u = {
        WebkitTransition: "webkitTransitionEnd",
        transition: "transitionend",
      }[r],
      h = {
        transform: a,
        transition: r,
        transitionDuration: r + "Duration",
        transitionProperty: r + "Property",
        transitionDelay: r + "Delay",
      },
      d = (o.prototype = Object.create(t.prototype));
    (d.constructor = o),
      (d._create = function () {
        (this._transn = {
          ingProperties: {},
          clean: {},
          onEnd: {},
        }),
          this.css({
            position: "absolute",
          });
      }),
      (d.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
      }),
      (d.getSize = function () {
        this.size = e(this.element);
      }),
      (d.css = function (t) {
        var e = this.element.style;
        for (var i in t) {
          var o = h[i] || i;
          e[o] = t[i];
        }
      }),
      (d.getPosition = function () {
        var t = getComputedStyle(this.element),
          e = this.layout._getOption("originLeft"),
          i = this.layout._getOption("originTop"),
          o = t[e ? "left" : "right"],
          n = t[i ? "top" : "bottom"],
          s = parseFloat(o),
          r = parseFloat(n),
          a = this.layout.size;
        o.indexOf("%") != -1 && (s = (s / 100) * a.width),
          n.indexOf("%") != -1 && (r = (r / 100) * a.height),
          (s = isNaN(s) ? 0 : s),
          (r = isNaN(r) ? 0 : r),
          (s -= e ? a.paddingLeft : a.paddingRight),
          (r -= i ? a.paddingTop : a.paddingBottom),
          (this.position.x = s),
          (this.position.y = r);
      }),
      (d.layoutPosition = function () {
        var t = this.layout.size,
          e = {},
          i = this.layout._getOption("originLeft"),
          o = this.layout._getOption("originTop"),
          n = i ? "paddingLeft" : "paddingRight",
          s = i ? "left" : "right",
          r = i ? "right" : "left",
          a = this.position.x + t[n];
        (e[s] = this.getXValue(a)), (e[r] = "");
        var u = o ? "paddingTop" : "paddingBottom",
          h = o ? "top" : "bottom",
          d = o ? "bottom" : "top",
          l = this.position.y + t[u];
        (e[h] = this.getYValue(l)),
          (e[d] = ""),
          this.css(e),
          this.emitEvent("layout", [this]);
      }),
      (d.getXValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && !e
          ? (t / this.layout.size.width) * 100 + "%"
          : t + "px";
      }),
      (d.getYValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && e
          ? (t / this.layout.size.height) * 100 + "%"
          : t + "px";
      }),
      (d._transitionTo = function (t, e) {
        this.getPosition();
        var i = this.position.x,
          o = this.position.y,
          n = t == this.position.x && e == this.position.y;
        if ((this.setPosition(t, e), n && !this.isTransitioning))
          return void this.layoutPosition();
        var s = t - i,
          r = e - o,
          a = {};
        (a.transform = this.getTranslate(s, r)),
          this.transition({
            to: a,
            onTransitionEnd: {
              transform: this.layoutPosition,
            },
            isCleaning: !0,
          });
      }),
      (d.getTranslate = function (t, e) {
        var i = this.layout._getOption("originLeft"),
          o = this.layout._getOption("originTop");
        return (
          (t = i ? t : -t),
          (e = o ? e : -e),
          "translate3d(" + t + "px, " + e + "px, 0)"
        );
      }),
      (d.goTo = function (t, e) {
        this.setPosition(t, e), this.layoutPosition();
      }),
      (d.moveTo = d._transitionTo),
      (d.setPosition = function (t, e) {
        (this.position.x = parseFloat(t)), (this.position.y = parseFloat(e));
      }),
      (d._nonTransition = function (t) {
        this.css(t.to), t.isCleaning && this._removeStyles(t.to);
        for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this);
      }),
      (d.transition = function (t) {
        if (!parseFloat(this.layout.options.transitionDuration))
          return void this._nonTransition(t);
        var e = this._transn;
        for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
        for (i in t.to)
          (e.ingProperties[i] = !0), t.isCleaning && (e.clean[i] = !0);
        if (t.from) {
          this.css(t.from);
          var o = this.element.offsetHeight;
          o = null;
        }
        this.enableTransition(t.to),
          this.css(t.to),
          (this.isTransitioning = !0);
      });
    var l = "opacity," + n(a);
    (d.enableTransition = function () {
      if (!this.isTransitioning) {
        var t = this.layout.options.transitionDuration;
        (t = "number" == typeof t ? t + "ms" : t),
          this.css({
            transitionProperty: l,
            transitionDuration: t,
            transitionDelay: this.staggerDelay || 0,
          }),
          this.element.addEventListener(u, this, !1);
      }
    }),
      (d.onwebkitTransitionEnd = function (t) {
        this.ontransitionend(t);
      }),
      (d.onotransitionend = function (t) {
        this.ontransitionend(t);
      });
    var f = {
      "-webkit-transform": "transform",
    };
    (d.ontransitionend = function (t) {
      if (t.target === this.element) {
        var e = this._transn,
          o = f[t.propertyName] || t.propertyName;
        if (
          (delete e.ingProperties[o],
          i(e.ingProperties) && this.disableTransition(),
          o in e.clean &&
            ((this.element.style[t.propertyName] = ""), delete e.clean[o]),
          o in e.onEnd)
        ) {
          var n = e.onEnd[o];
          n.call(this), delete e.onEnd[o];
        }
        this.emitEvent("transitionEnd", [this]);
      }
    }),
      (d.disableTransition = function () {
        this.removeTransitionStyles(),
          this.element.removeEventListener(u, this, !1),
          (this.isTransitioning = !1);
      }),
      (d._removeStyles = function (t) {
        var e = {};
        for (var i in t) e[i] = "";
        this.css(e);
      });
    var c = {
      transitionProperty: "",
      transitionDuration: "",
      transitionDelay: "",
    };
    return (
      (d.removeTransitionStyles = function () {
        this.css(c);
      }),
      (d.stagger = function (t) {
        (t = isNaN(t) ? 0 : t), (this.staggerDelay = t + "ms");
      }),
      (d.removeElem = function () {
        this.element.parentNode.removeChild(this.element),
          this.css({
            display: "",
          }),
          this.emitEvent("remove", [this]);
      }),
      (d.remove = function () {
        return r && parseFloat(this.layout.options.transitionDuration)
          ? (this.once("transitionEnd", function () {
              this.removeElem();
            }),
            void this.hide())
          : void this.removeElem();
      }),
      (d.reveal = function () {
        delete this.isHidden,
          this.css({
            display: "",
          });
        var t = this.layout.options,
          e = {},
          i = this.getHideRevealTransitionEndProperty("visibleStyle");
        (e[i] = this.onRevealTransitionEnd),
          this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e,
          });
      }),
      (d.onRevealTransitionEnd = function () {
        this.isHidden || this.emitEvent("reveal");
      }),
      (d.getHideRevealTransitionEndProperty = function (t) {
        var e = this.layout.options[t];
        if (e.opacity) return "opacity";
        for (var i in e) return i;
      }),
      (d.hide = function () {
        (this.isHidden = !0),
          this.css({
            display: "",
          });
        var t = this.layout.options,
          e = {},
          i = this.getHideRevealTransitionEndProperty("hiddenStyle");
        (e[i] = this.onHideTransitionEnd),
          this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e,
          });
      }),
      (d.onHideTransitionEnd = function () {
        this.isHidden &&
          (this.css({
            display: "none",
          }),
          this.emitEvent("hide"));
      }),
      (d.destroy = function () {
        this.css({
          position: "",
          left: "",
          right: "",
          top: "",
          bottom: "",
          transition: "",
          transform: "",
        });
      }),
      o
    );
  }),
  (function (t, e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(
          "outlayer/outlayer",
          [
            "ev-emitter/ev-emitter",
            "get-size/get-size",
            "fizzy-ui-utils/utils",
            "./item",
          ],
          function (i, o, n, s) {
            return e(t, i, o, n, s);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(
          t,
          require("ev-emitter"),
          require("get-size"),
          require("fizzy-ui-utils"),
          require("./item")
        ))
      : (t.Outlayer = e(
          t,
          t.EvEmitter,
          t.getSize,
          t.fizzyUIUtils,
          t.Outlayer.Item
        ));
  })(window, function (t, e, i, o, n) {
    "use strict";

    function s(t, e) {
      var i = o.getQueryElement(t);
      if (!i)
        return void (
          u &&
          u.error(
            "Bad element for " + this.constructor.namespace + ": " + (i || t)
          )
        );
      (this.element = i),
        h && (this.$element = h(this.element)),
        (this.options = o.extend({}, this.constructor.defaults)),
        this.option(e);
      var n = ++l;
      (this.element.outlayerGUID = n), (f[n] = this), this._create();
      var s = this._getOption("initLayout");
      s && this.layout();
    }

    function r(t) {
      function e() {
        t.apply(this, arguments);
      }
      return (
        (e.prototype = Object.create(t.prototype)),
        (e.prototype.constructor = e),
        e
      );
    }

    function a(t) {
      if ("number" == typeof t) return t;
      var e = t.match(/(^\d*\.?\d*)(\w*)/),
        i = e && e[1],
        o = e && e[2];
      if (!i.length) return 0;
      i = parseFloat(i);
      var n = m[o] || 1;
      return i * n;
    }
    var u = t.console,
      h = t.jQuery,
      d = function () {},
      l = 0,
      f = {};
    (s.namespace = "outlayer"),
      (s.Item = n),
      (s.defaults = {
        containerStyle: {
          position: "relative",
        },
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: {
          opacity: 0,
          transform: "scale(0.001)",
        },
        visibleStyle: {
          opacity: 1,
          transform: "scale(1)",
        },
      });
    var c = s.prototype;
    o.extend(c, e.prototype),
      (c.option = function (t) {
        o.extend(this.options, t);
      }),
      (c._getOption = function (t) {
        var e = this.constructor.compatOptions[t];
        return e && void 0 !== this.options[e]
          ? this.options[e]
          : this.options[t];
      }),
      (s.compatOptions = {
        initLayout: "isInitLayout",
        horizontal: "isHorizontal",
        layoutInstant: "isLayoutInstant",
        originLeft: "isOriginLeft",
        originTop: "isOriginTop",
        resize: "isResizeBound",
        resizeContainer: "isResizingContainer",
      }),
      (c._create = function () {
        this.reloadItems(),
          (this.stamps = []),
          this.stamp(this.options.stamp),
          o.extend(this.element.style, this.options.containerStyle);
        var t = this._getOption("resize");
        t && this.bindResize();
      }),
      (c.reloadItems = function () {
        this.items = this._itemize(this.element.children);
      }),
      (c._itemize = function (t) {
        for (
          var e = this._filterFindItemElements(t),
            i = this.constructor.Item,
            o = [],
            n = 0;
          n < e.length;
          n++
        ) {
          var s = e[n],
            r = new i(s, this);
          o.push(r);
        }
        return o;
      }),
      (c._filterFindItemElements = function (t) {
        return o.filterFindElements(t, this.options.itemSelector);
      }),
      (c.getItemElements = function () {
        return this.items.map(function (t) {
          return t.element;
        });
      }),
      (c.layout = function () {
        this._resetLayout(), this._manageStamps();
        var t = this._getOption("layoutInstant"),
          e = void 0 !== t ? t : !this._isLayoutInited;
        this.layoutItems(this.items, e), (this._isLayoutInited = !0);
      }),
      (c._init = c.layout),
      (c._resetLayout = function () {
        this.getSize();
      }),
      (c.getSize = function () {
        this.size = i(this.element);
      }),
      (c._getMeasurement = function (t, e) {
        var o,
          n = this.options[t];
        n
          ? ("string" == typeof n
              ? (o = this.element.querySelector(n))
              : n instanceof HTMLElement && (o = n),
            (this[t] = o ? i(o)[e] : n))
          : (this[t] = 0);
      }),
      (c.layoutItems = function (t, e) {
        (t = this._getItemsForLayout(t)),
          this._layoutItems(t, e),
          this._postLayout();
      }),
      (c._getItemsForLayout = function (t) {
        return t.filter(function (t) {
          return !t.isIgnored;
        });
      }),
      (c._layoutItems = function (t, e) {
        if ((this._emitCompleteOnItems("layout", t), t && t.length)) {
          var i = [];
          t.forEach(function (t) {
            var o = this._getItemLayoutPosition(t);
            (o.item = t), (o.isInstant = e || t.isLayoutInstant), i.push(o);
          }, this),
            this._processLayoutQueue(i);
        }
      }),
      (c._getItemLayoutPosition = function () {
        return {
          x: 0,
          y: 0,
        };
      }),
      (c._processLayoutQueue = function (t) {
        this.updateStagger(),
          t.forEach(function (t, e) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e);
          }, this);
      }),
      (c.updateStagger = function () {
        var t = this.options.stagger;
        return null === t || void 0 === t
          ? void (this.stagger = 0)
          : ((this.stagger = a(t)), this.stagger);
      }),
      (c._positionItem = function (t, e, i, o, n) {
        o ? t.goTo(e, i) : (t.stagger(n * this.stagger), t.moveTo(e, i));
      }),
      (c._postLayout = function () {
        this.resizeContainer();
      }),
      (c.resizeContainer = function () {
        var t = this._getOption("resizeContainer");
        if (t) {
          var e = this._getContainerSize();
          e &&
            (this._setContainerMeasure(e.width, !0),
            this._setContainerMeasure(e.height, !1));
        }
      }),
      (c._getContainerSize = d),
      (c._setContainerMeasure = function (t, e) {
        if (void 0 !== t) {
          var i = this.size;
          i.isBorderBox &&
            (t += e
              ? i.paddingLeft +
                i.paddingRight +
                i.borderLeftWidth +
                i.borderRightWidth
              : i.paddingBottom +
                i.paddingTop +
                i.borderTopWidth +
                i.borderBottomWidth),
            (t = Math.max(t, 0)),
            (this.element.style[e ? "width" : "height"] = t + "px");
        }
      }),
      (c._emitCompleteOnItems = function (t, e) {
        function i() {
          n.dispatchEvent(t + "Complete", null, [e]);
        }

        function o() {
          r++, r == s && i();
        }
        var n = this,
          s = e.length;
        if (!e || !s) return void i();
        var r = 0;
        e.forEach(function (e) {
          e.once(t, o);
        });
      }),
      (c.dispatchEvent = function (t, e, i) {
        var o = e ? [e].concat(i) : i;
        if ((this.emitEvent(t, o), h))
          if (((this.$element = this.$element || h(this.element)), e)) {
            var n = h.Event(e);
            (n.type = t), this.$element.trigger(n, i);
          } else this.$element.trigger(t, i);
      }),
      (c.ignore = function (t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0);
      }),
      (c.unignore = function (t) {
        var e = this.getItem(t);
        e && delete e.isIgnored;
      }),
      (c.stamp = function (t) {
        (t = this._find(t)),
          t &&
            ((this.stamps = this.stamps.concat(t)),
            t.forEach(this.ignore, this));
      }),
      (c.unstamp = function (t) {
        (t = this._find(t)),
          t &&
            t.forEach(function (t) {
              o.removeFrom(this.stamps, t), this.unignore(t);
            }, this);
      }),
      (c._find = function (t) {
        if (t)
          return (
            "string" == typeof t && (t = this.element.querySelectorAll(t)),
            (t = o.makeArray(t))
          );
      }),
      (c._manageStamps = function () {
        this.stamps &&
          this.stamps.length &&
          (this._getBoundingRect(),
          this.stamps.forEach(this._manageStamp, this));
      }),
      (c._getBoundingRect = function () {
        var t = this.element.getBoundingClientRect(),
          e = this.size;
        this._boundingRect = {
          left: t.left + e.paddingLeft + e.borderLeftWidth,
          top: t.top + e.paddingTop + e.borderTopWidth,
          right: t.right - (e.paddingRight + e.borderRightWidth),
          bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth),
        };
      }),
      (c._manageStamp = d),
      (c._getElementOffset = function (t) {
        var e = t.getBoundingClientRect(),
          o = this._boundingRect,
          n = i(t),
          s = {
            left: e.left - o.left - n.marginLeft,
            top: e.top - o.top - n.marginTop,
            right: o.right - e.right - n.marginRight,
            bottom: o.bottom - e.bottom - n.marginBottom,
          };
        return s;
      }),
      (c.handleEvent = o.handleEvent),
      (c.bindResize = function () {
        t.addEventListener("resize", this), (this.isResizeBound = !0);
      }),
      (c.unbindResize = function () {
        t.removeEventListener("resize", this), (this.isResizeBound = !1);
      }),
      (c.onresize = function () {
        this.resize();
      }),
      o.debounceMethod(s, "onresize", 100),
      (c.resize = function () {
        this.isResizeBound && this.needsResizeLayout() && this.layout();
      }),
      (c.needsResizeLayout = function () {
        var t = i(this.element),
          e = this.size && t;
        return e && t.innerWidth !== this.size.innerWidth;
      }),
      (c.addItems = function (t) {
        var e = this._itemize(t);
        return e.length && (this.items = this.items.concat(e)), e;
      }),
      (c.appended = function (t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0), this.reveal(e));
      }),
      (c.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
          var i = this.items.slice(0);
          (this.items = e.concat(i)),
            this._resetLayout(),
            this._manageStamps(),
            this.layoutItems(e, !0),
            this.reveal(e),
            this.layoutItems(i);
        }
      }),
      (c.reveal = function (t) {
        if ((this._emitCompleteOnItems("reveal", t), t && t.length)) {
          var e = this.updateStagger();
          t.forEach(function (t, i) {
            t.stagger(i * e), t.reveal();
          });
        }
      }),
      (c.hide = function (t) {
        if ((this._emitCompleteOnItems("hide", t), t && t.length)) {
          var e = this.updateStagger();
          t.forEach(function (t, i) {
            t.stagger(i * e), t.hide();
          });
        }
      }),
      (c.revealItemElements = function (t) {
        var e = this.getItems(t);
        this.reveal(e);
      }),
      (c.hideItemElements = function (t) {
        var e = this.getItems(t);
        this.hide(e);
      }),
      (c.getItem = function (t) {
        for (var e = 0; e < this.items.length; e++) {
          var i = this.items[e];
          if (i.element == t) return i;
        }
      }),
      (c.getItems = function (t) {
        t = o.makeArray(t);
        var e = [];
        return (
          t.forEach(function (t) {
            var i = this.getItem(t);
            i && e.push(i);
          }, this),
          e
        );
      }),
      (c.remove = function (t) {
        var e = this.getItems(t);
        this._emitCompleteOnItems("remove", e),
          e &&
            e.length &&
            e.forEach(function (t) {
              t.remove(), o.removeFrom(this.items, t);
            }, this);
      }),
      (c.destroy = function () {
        var t = this.element.style;
        (t.height = ""),
          (t.position = ""),
          (t.width = ""),
          this.items.forEach(function (t) {
            t.destroy();
          }),
          this.unbindResize();
        var e = this.element.outlayerGUID;
        delete f[e],
          delete this.element.outlayerGUID,
          h && h.removeData(this.element, this.constructor.namespace);
      }),
      (s.data = function (t) {
        t = o.getQueryElement(t);
        var e = t && t.outlayerGUID;
        return e && f[e];
      }),
      (s.create = function (t, e) {
        var i = r(s);
        return (
          (i.defaults = o.extend({}, s.defaults)),
          o.extend(i.defaults, e),
          (i.compatOptions = o.extend({}, s.compatOptions)),
          (i.namespace = t),
          (i.data = s.data),
          (i.Item = r(n)),
          o.htmlInit(i, t),
          h && h.bridget && h.bridget(t, i),
          i
        );
      });
    var m = {
      ms: 1,
      s: 1e3,
    };
    return (s.Item = n), s;
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope-layout/js/item", ["outlayer/outlayer"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("outlayer")))
      : ((t.Isotope = t.Isotope || {}), (t.Isotope.Item = e(t.Outlayer)));
  })(window, function (t) {
    "use strict";

    function e() {
      t.Item.apply(this, arguments);
    }
    var i = (e.prototype = Object.create(t.Item.prototype)),
      o = i._create;
    (i._create = function () {
      (this.id = this.layout.itemGUID++), o.call(this), (this.sortData = {});
    }),
      (i.updateSortData = function () {
        if (!this.isIgnored) {
          (this.sortData.id = this.id),
            (this.sortData["original-order"] = this.id),
            (this.sortData.random = Math.random());
          var t = this.layout.options.getSortData,
            e = this.layout._sorters;
          for (var i in t) {
            var o = e[i];
            this.sortData[i] = o(this.element, this);
          }
        }
      });
    var n = i.destroy;
    return (
      (i.destroy = function () {
        n.apply(this, arguments),
          this.css({
            display: "",
          });
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "isotope-layout/js/layout-mode",
          ["get-size/get-size", "outlayer/outlayer"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("get-size"), require("outlayer")))
      : ((t.Isotope = t.Isotope || {}),
        (t.Isotope.LayoutMode = e(t.getSize, t.Outlayer)));
  })(window, function (t, e) {
    "use strict";

    function i(t) {
      (this.isotope = t),
        t &&
          ((this.options = t.options[this.namespace]),
          (this.element = t.element),
          (this.items = t.filteredItems),
          (this.size = t.size));
    }
    var o = i.prototype,
      n = [
        "_resetLayout",
        "_getItemLayoutPosition",
        "_manageStamp",
        "_getContainerSize",
        "_getElementOffset",
        "needsResizeLayout",
        "_getOption",
      ];
    return (
      n.forEach(function (t) {
        o[t] = function () {
          return e.prototype[t].apply(this.isotope, arguments);
        };
      }),
      (o.needsVerticalResizeLayout = function () {
        var e = t(this.isotope.element),
          i = this.isotope.size && e;
        return i && e.innerHeight != this.isotope.size.innerHeight;
      }),
      (o._getMeasurement = function () {
        this.isotope._getMeasurement.apply(this, arguments);
      }),
      (o.getColumnWidth = function () {
        this.getSegmentSize("column", "Width");
      }),
      (o.getRowHeight = function () {
        this.getSegmentSize("row", "Height");
      }),
      (o.getSegmentSize = function (t, e) {
        var i = t + e,
          o = "outer" + e;
        if ((this._getMeasurement(i, o), !this[i])) {
          var n = this.getFirstItemSize();
          this[i] = (n && n[o]) || this.isotope.size["inner" + e];
        }
      }),
      (o.getFirstItemSize = function () {
        var e = this.isotope.filteredItems[0];
        return e && e.element && t(e.element);
      }),
      (o.layout = function () {
        this.isotope.layout.apply(this.isotope, arguments);
      }),
      (o.getSize = function () {
        this.isotope.getSize(), (this.size = this.isotope.size);
      }),
      (i.modes = {}),
      (i.create = function (t, e) {
        function n() {
          i.apply(this, arguments);
        }
        return (
          (n.prototype = Object.create(o)),
          (n.prototype.constructor = n),
          e && (n.options = e),
          (n.prototype.namespace = t),
          (i.modes[t] = n),
          n
        );
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "masonry-layout/masonry",
          ["outlayer/outlayer", "get-size/get-size"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("outlayer"), require("get-size")))
      : (t.Masonry = e(t.Outlayer, t.getSize));
  })(window, function (t, e) {
    var i = t.create("masonry");
    i.compatOptions.fitWidth = "isFitWidth";
    var o = i.prototype;
    return (
      (o._resetLayout = function () {
        this.getSize(),
          this._getMeasurement("columnWidth", "outerWidth"),
          this._getMeasurement("gutter", "outerWidth"),
          this.measureColumns(),
          (this.colYs = []);
        for (var t = 0; t < this.cols; t++) this.colYs.push(0);
        (this.maxY = 0), (this.horizontalColIndex = 0);
      }),
      (o.measureColumns = function () {
        if ((this.getContainerWidth(), !this.columnWidth)) {
          var t = this.items[0],
            i = t && t.element;
          this.columnWidth = (i && e(i).outerWidth) || this.containerWidth;
        }
        var o = (this.columnWidth += this.gutter),
          n = this.containerWidth + this.gutter,
          s = n / o,
          r = o - (n % o),
          a = r && r < 1 ? "round" : "floor";
        (s = Math[a](s)), (this.cols = Math.max(s, 1));
      }),
      (o.getContainerWidth = function () {
        var t = this._getOption("fitWidth"),
          i = t ? this.element.parentNode : this.element,
          o = e(i);
        this.containerWidth = o && o.innerWidth;
      }),
      (o._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth % this.columnWidth,
          i = e && e < 1 ? "round" : "ceil",
          o = Math[i](t.size.outerWidth / this.columnWidth);
        o = Math.min(o, this.cols);
        for (
          var n = this.options.horizontalOrder
              ? "_getHorizontalColPosition"
              : "_getTopColPosition",
            s = this[n](o, t),
            r = {
              x: this.columnWidth * s.col,
              y: s.y,
            },
            a = s.y + t.size.outerHeight,
            u = o + s.col,
            h = s.col;
          h < u;
          h++
        )
          this.colYs[h] = a;
        return r;
      }),
      (o._getTopColPosition = function (t) {
        var e = this._getTopColGroup(t),
          i = Math.min.apply(Math, e);
        return {
          col: e.indexOf(i),
          y: i,
        };
      }),
      (o._getTopColGroup = function (t) {
        if (t < 2) return this.colYs;
        for (var e = [], i = this.cols + 1 - t, o = 0; o < i; o++)
          e[o] = this._getColGroupY(o, t);
        return e;
      }),
      (o._getColGroupY = function (t, e) {
        if (e < 2) return this.colYs[t];
        var i = this.colYs.slice(t, t + e);
        return Math.max.apply(Math, i);
      }),
      (o._getHorizontalColPosition = function (t, e) {
        var i = this.horizontalColIndex % this.cols,
          o = t > 1 && i + t > this.cols;
        i = o ? 0 : i;
        var n = e.size.outerWidth && e.size.outerHeight;
        return (
          (this.horizontalColIndex = n ? i + t : this.horizontalColIndex),
          {
            col: i,
            y: this._getColGroupY(i, t),
          }
        );
      }),
      (o._manageStamp = function (t) {
        var i = e(t),
          o = this._getElementOffset(t),
          n = this._getOption("originLeft"),
          s = n ? o.left : o.right,
          r = s + i.outerWidth,
          a = Math.floor(s / this.columnWidth);
        a = Math.max(0, a);
        var u = Math.floor(r / this.columnWidth);
        (u -= r % this.columnWidth ? 0 : 1), (u = Math.min(this.cols - 1, u));
        for (
          var h = this._getOption("originTop"),
            d = (h ? o.top : o.bottom) + i.outerHeight,
            l = a;
          l <= u;
          l++
        )
          this.colYs[l] = Math.max(d, this.colYs[l]);
      }),
      (o._getContainerSize = function () {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = {
          height: this.maxY,
        };
        return (
          this._getOption("fitWidth") &&
            (t.width = this._getContainerFitWidth()),
          t
        );
      }),
      (o._getContainerFitWidth = function () {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e]; ) t++;
        return (this.cols - t) * this.columnWidth - this.gutter;
      }),
      (o.needsResizeLayout = function () {
        var t = this.containerWidth;
        return this.getContainerWidth(), t != this.containerWidth;
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          "isotope-layout/js/layout-modes/masonry",
          ["../layout-mode", "masonry-layout/masonry"],
          e
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(
          require("../layout-mode"),
          require("masonry-layout")
        ))
      : e(t.Isotope.LayoutMode, t.Masonry);
  })(window, function (t, e) {
    "use strict";
    var i = t.create("masonry"),
      o = i.prototype,
      n = {
        _getElementOffset: !0,
        layout: !0,
        _getMeasurement: !0,
      };
    for (var s in e.prototype) n[s] || (o[s] = e.prototype[s]);
    var r = o.measureColumns;
    o.measureColumns = function () {
      (this.items = this.isotope.filteredItems), r.call(this);
    };
    var a = o._getOption;
    return (
      (o._getOption = function (t) {
        return "fitWidth" == t
          ? void 0 !== this.options.isFitWidth
            ? this.options.isFitWidth
            : this.options.fitWidth
          : a.apply(this.isotope, arguments);
      }),
      i
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope-layout/js/layout-modes/fit-rows", ["../layout-mode"], e)
      : "object" == typeof exports
      ? (module.exports = e(require("../layout-mode")))
      : e(t.Isotope.LayoutMode);
  })(window, function (t) {
    "use strict";
    var e = t.create("fitRows"),
      i = e.prototype;
    return (
      (i._resetLayout = function () {
        (this.x = 0),
          (this.y = 0),
          (this.maxY = 0),
          this._getMeasurement("gutter", "outerWidth");
      }),
      (i._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth + this.gutter,
          i = this.isotope.size.innerWidth + this.gutter;
        0 !== this.x && e + this.x > i && ((this.x = 0), (this.y = this.maxY));
        var o = {
          x: this.x,
          y: this.y,
        };
        return (
          (this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight)),
          (this.x += e),
          o
        );
      }),
      (i._getContainerSize = function () {
        return {
          height: this.maxY,
        };
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define("isotope-layout/js/layout-modes/vertical", ["../layout-mode"], e)
      : "object" == typeof module && module.exports
      ? (module.exports = e(require("../layout-mode")))
      : e(t.Isotope.LayoutMode);
  })(window, function (t) {
    "use strict";
    var e = t.create("vertical", {
        horizontalAlignment: 0,
      }),
      i = e.prototype;
    return (
      (i._resetLayout = function () {
        this.y = 0;
      }),
      (i._getItemLayoutPosition = function (t) {
        t.getSize();
        var e =
            (this.isotope.size.innerWidth - t.size.outerWidth) *
            this.options.horizontalAlignment,
          i = this.y;
        return (
          (this.y += t.size.outerHeight),
          {
            x: e,
            y: i,
          }
        );
      }),
      (i._getContainerSize = function () {
        return {
          height: this.y,
        };
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(
          [
            "outlayer/outlayer",
            "get-size/get-size",
            "desandro-matches-selector/matches-selector",
            "fizzy-ui-utils/utils",
            "isotope-layout/js/item",
            "isotope-layout/js/layout-mode",
            "isotope-layout/js/layout-modes/masonry",
            "isotope-layout/js/layout-modes/fit-rows",
            "isotope-layout/js/layout-modes/vertical",
          ],
          function (i, o, n, s, r, a) {
            return e(t, i, o, n, s, r, a);
          }
        )
      : "object" == typeof module && module.exports
      ? (module.exports = e(
          t,
          require("outlayer"),
          require("get-size"),
          require("desandro-matches-selector"),
          require("fizzy-ui-utils"),
          require("isotope-layout/js/item"),
          require("isotope-layout/js/layout-mode"),
          require("isotope-layout/js/layout-modes/masonry"),
          require("isotope-layout/js/layout-modes/fit-rows"),
          require("isotope-layout/js/layout-modes/vertical")
        ))
      : (t.Isotope = e(
          t,
          t.Outlayer,
          t.getSize,
          t.matchesSelector,
          t.fizzyUIUtils,
          t.Isotope.Item,
          t.Isotope.LayoutMode
        ));
  })(window, function (t, e, i, o, n, s, r) {
    function a(t, e) {
      return function (i, o) {
        for (var n = 0; n < t.length; n++) {
          var s = t[n],
            r = i.sortData[s],
            a = o.sortData[s];
          if (r > a || r < a) {
            var u = void 0 !== e[s] ? e[s] : e,
              h = u ? 1 : -1;
            return (r > a ? 1 : -1) * h;
          }
        }
        return 0;
      };
    }
    var u = t.jQuery,
      h = String.prototype.trim
        ? function (t) {
            return t.trim();
          }
        : function (t) {
            return t.replace(/^\s+|\s+$/g, "");
          },
      d = e.create("isotope", {
        layoutMode: "masonry",
        isJQueryFiltering: !0,
        sortAscending: !0,
      });
    (d.Item = s), (d.LayoutMode = r);
    var l = d.prototype;
    (l._create = function () {
      (this.itemGUID = 0),
        (this._sorters = {}),
        this._getSorters(),
        e.prototype._create.call(this),
        (this.modes = {}),
        (this.filteredItems = this.items),
        (this.sortHistory = ["original-order"]);
      for (var t in r.modes) this._initLayoutMode(t);
    }),
      (l.reloadItems = function () {
        (this.itemGUID = 0), e.prototype.reloadItems.call(this);
      }),
      (l._itemize = function () {
        for (
          var t = e.prototype._itemize.apply(this, arguments), i = 0;
          i < t.length;
          i++
        ) {
          var o = t[i];
          o.id = this.itemGUID++;
        }
        return this._updateItemsSortData(t), t;
      }),
      (l._initLayoutMode = function (t) {
        var e = r.modes[t],
          i = this.options[t] || {};
        (this.options[t] = e.options ? n.extend(e.options, i) : i),
          (this.modes[t] = new e(this));
      }),
      (l.layout = function () {
        return !this._isLayoutInited && this._getOption("initLayout")
          ? void this.arrange()
          : void this._layout();
      }),
      (l._layout = function () {
        var t = this._getIsInstant();
        this._resetLayout(),
          this._manageStamps(),
          this.layoutItems(this.filteredItems, t),
          (this._isLayoutInited = !0);
      }),
      (l.arrange = function (t) {
        this.option(t), this._getIsInstant();
        var e = this._filter(this.items);
        (this.filteredItems = e.matches),
          this._bindArrangeComplete(),
          this._isInstant
            ? this._noTransition(this._hideReveal, [e])
            : this._hideReveal(e),
          this._sort(),
          this._layout();
      }),
      (l._init = l.arrange),
      (l._hideReveal = function (t) {
        this.reveal(t.needReveal), this.hide(t.needHide);
      }),
      (l._getIsInstant = function () {
        var t = this._getOption("layoutInstant"),
          e = void 0 !== t ? t : !this._isLayoutInited;
        return (this._isInstant = e), e;
      }),
      (l._bindArrangeComplete = function () {
        function t() {
          e &&
            i &&
            o &&
            n.dispatchEvent("arrangeComplete", null, [n.filteredItems]);
        }
        var e,
          i,
          o,
          n = this;
        this.once("layoutComplete", function () {
          (e = !0), t();
        }),
          this.once("hideComplete", function () {
            (i = !0), t();
          }),
          this.once("revealComplete", function () {
            (o = !0), t();
          });
      }),
      (l._filter = function (t) {
        var e = this.options.filter;
        e = e || "*";
        for (
          var i = [], o = [], n = [], s = this._getFilterTest(e), r = 0;
          r < t.length;
          r++
        ) {
          var a = t[r];
          if (!a.isIgnored) {
            var u = s(a);
            u && i.push(a),
              u && a.isHidden ? o.push(a) : u || a.isHidden || n.push(a);
          }
        }
        return {
          matches: i,
          needReveal: o,
          needHide: n,
        };
      }),
      (l._getFilterTest = function (t) {
        return u && this.options.isJQueryFiltering
          ? function (e) {
              return u(e.element).is(t);
            }
          : "function" == typeof t
          ? function (e) {
              return t(e.element);
            }
          : function (e) {
              return o(e.element, t);
            };
      }),
      (l.updateSortData = function (t) {
        var e;
        t ? ((t = n.makeArray(t)), (e = this.getItems(t))) : (e = this.items),
          this._getSorters(),
          this._updateItemsSortData(e);
      }),
      (l._getSorters = function () {
        var t = this.options.getSortData;
        for (var e in t) {
          var i = t[e];
          this._sorters[e] = f(i);
        }
      }),
      (l._updateItemsSortData = function (t) {
        for (var e = t && t.length, i = 0; e && i < e; i++) {
          var o = t[i];
          o.updateSortData();
        }
      });
    var f = (function () {
      function t(t) {
        if ("string" != typeof t) return t;
        var i = h(t).split(" "),
          o = i[0],
          n = o.match(/^\[(.+)\]$/),
          s = n && n[1],
          r = e(s, o),
          a = d.sortDataParsers[i[1]];
        return (t = a
          ? function (t) {
              return t && a(r(t));
            }
          : function (t) {
              return t && r(t);
            });
      }

      function e(t, e) {
        return t
          ? function (e) {
              return e.getAttribute(t);
            }
          : function (t) {
              var i = t.querySelector(e);
              return i && i.textContent;
            };
      }
      return t;
    })();
    (d.sortDataParsers = {
      parseInt: function (t) {
        return parseInt(t, 10);
      },
      parseFloat: function (t) {
        return parseFloat(t);
      },
    }),
      (l._sort = function () {
        if (this.options.sortBy) {
          var t = n.makeArray(this.options.sortBy);
          this._getIsSameSortBy(t) ||
            (this.sortHistory = t.concat(this.sortHistory));
          var e = a(this.sortHistory, this.options.sortAscending);
          this.filteredItems.sort(e);
        }
      }),
      (l._getIsSameSortBy = function (t) {
        for (var e = 0; e < t.length; e++)
          if (t[e] != this.sortHistory[e]) return !1;
        return !0;
      }),
      (l._mode = function () {
        var t = this.options.layoutMode,
          e = this.modes[t];
        if (!e) throw new Error("No layout mode: " + t);
        return (e.options = this.options[t]), e;
      }),
      (l._resetLayout = function () {
        e.prototype._resetLayout.call(this), this._mode()._resetLayout();
      }),
      (l._getItemLayoutPosition = function (t) {
        return this._mode()._getItemLayoutPosition(t);
      }),
      (l._manageStamp = function (t) {
        this._mode()._manageStamp(t);
      }),
      (l._getContainerSize = function () {
        return this._mode()._getContainerSize();
      }),
      (l.needsResizeLayout = function () {
        return this._mode().needsResizeLayout();
      }),
      (l.appended = function (t) {
        var e = this.addItems(t);
        if (e.length) {
          var i = this._filterRevealAdded(e);
          this.filteredItems = this.filteredItems.concat(i);
        }
      }),
      (l.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
          this._resetLayout(), this._manageStamps();
          var i = this._filterRevealAdded(e);
          this.layoutItems(this.filteredItems),
            (this.filteredItems = i.concat(this.filteredItems)),
            (this.items = e.concat(this.items));
        }
      }),
      (l._filterRevealAdded = function (t) {
        var e = this._filter(t);
        return (
          this.hide(e.needHide),
          this.reveal(e.matches),
          this.layoutItems(e.matches, !0),
          e.matches
        );
      }),
      (l.insert = function (t) {
        var e = this.addItems(t);
        if (e.length) {
          var i,
            o,
            n = e.length;
          for (i = 0; i < n; i++)
            (o = e[i]), this.element.appendChild(o.element);
          var s = this._filter(e).matches;
          for (i = 0; i < n; i++) e[i].isLayoutInstant = !0;
          for (this.arrange(), i = 0; i < n; i++) delete e[i].isLayoutInstant;
          this.reveal(s);
        }
      });
    var c = l.remove;
    return (
      (l.remove = function (t) {
        t = n.makeArray(t);
        var e = this.getItems(t);
        c.call(this, t);
        for (var i = e && e.length, o = 0; i && o < i; o++) {
          var s = e[o];
          n.removeFrom(this.filteredItems, s);
        }
      }),
      (l.shuffle = function () {
        for (var t = 0; t < this.items.length; t++) {
          var e = this.items[t];
          e.sortData.random = Math.random();
        }
        (this.options.sortBy = "random"), this._sort(), this._layout();
      }),
      (l._noTransition = function (t, e) {
        var i = this.options.transitionDuration;
        this.options.transitionDuration = 0;
        var o = t.apply(this, e);
        return (this.options.transitionDuration = i), o;
      }),
      (l.getFilteredItemElements = function () {
        return this.filteredItems.map(function (t) {
          return t.element;
        });
      }),
      d
    );
  });

// onePageNav
!(function (t, i, n, s) {
  var e = function (s, e) {
    (this.elem = s),
      (this.$elem = t(s)),
      (this.options = e),
      (this.metadata = this.$elem.data("plugin-options")),
      (this.$win = t(i)),
      (this.sections = {}),
      (this.didScroll = !1),
      (this.$doc = t(n)),
      (this.docHeight = this.$doc.height());
  };
  (e.prototype = {
    defaults: {
      navItems: "a",
      currentClass: "current",
      changeHash: !1,
      easing: "swing",
      filter: "",
      scrollSpeed: 750,
      scrollThreshold: 0.5,
      begin: !1,
      end: !1,
      scrollChange: !1,
    },
    init: function () {
      return (
        (this.config = t.extend(
          {},
          this.defaults,
          this.options,
          this.metadata
        )),
        (this.$nav = this.$elem.find(this.config.navItems)),
        "" !== this.config.filter &&
          (this.$nav = this.$nav.filter(this.config.filter)),
        this.$nav.on("click.onePageNav", t.proxy(this.handleClick, this)),
        this.getPositions(),
        this.bindInterval(),
        this.$win.on("resize.onePageNav", t.proxy(this.getPositions, this)),
        this
      );
    },
    adjustNav: function (t, i) {
      t.$elem
        .find("." + t.config.currentClass)
        .removeClass(t.config.currentClass),
        i.addClass(t.config.currentClass);
    },
    bindInterval: function () {
      var t,
        i = this;
      i.$win.on("scroll.onePageNav", function () {
        i.didScroll = !0;
      }),
        (i.t = setInterval(function () {
          (t = i.$doc.height()),
            i.didScroll && ((i.didScroll = !1), i.scrollChange()),
            t !== i.docHeight && ((i.docHeight = t), i.getPositions());
        }, 250));
    },
    getHash: function (t) {
      return t.attr("href").split("#")[1];
    },
    getPositions: function () {
      var i,
        n,
        s,
        e = this;
      e.$nav.each(function () {
        "" != (i = e.getHash(t(this))) &&
          (s = t("#" + i)).length &&
          ((n = s.offset().top), (e.sections[i] = Math.round(n)));
      });
    },
    getSection: function (t) {
      var i = null,
        n = Math.round(this.$win.height() * this.config.scrollThreshold);
      for (var s in this.sections) this.sections[s] - n < t && (i = s);
      return i;
    },
    handleClick: function (n) {
      var s = this,
        e = t(n.currentTarget),
        o = e.parent(),
        a = "#" + s.getHash(e);
      o.hasClass(s.config.currentClass) ||
        (s.config.begin && s.config.begin(),
        s.adjustNav(s, o),
        s.unbindInterval(),
        s.scrollTo(a, function () {
          s.config.changeHash && (i.location.hash = a),
            s.bindInterval(),
            s.config.end && s.config.end();
        })),
        n.preventDefault();
    },
    scrollChange: function () {
      var t,
        i = this.$win.scrollTop(),
        n = this.getSection(i);
      null !== n &&
        !(t = this.$elem.find('a[href$="#' + n + '"]').parent()).hasClass(
          this.config.currentClass
        ) &&
        (this.adjustNav(this, t),
        this.config.scrollChange && this.config.scrollChange(t));
    },
    scrollTo: function (i, n) {
      var s = t(i).offset().top;
      t("html, body").animate(
        {
          scrollTop: s - 150,
        },
        this.config.scrollSpeed,
        this.config.easing,
        n
      );
    },
    unbindInterval: function () {
      clearInterval(this.t), this.$win.unbind("scroll.onePageNav");
    },
  }),
    (e.defaults = e.prototype.defaults),
    (t.fn.onePageNav = function (t) {
      return this.each(function () {
        new e(this, t).init();
      });
    });
})(jQuery, window, document);

/*! tooltipster v4.2.6 */
!(function (a, b) {
  "function" == typeof define && define.amd
    ? define(["jquery"], function (a) {
        return b(a);
      })
    : "object" == typeof exports
    ? (module.exports = b(require("jquery")))
    : b(jQuery);
})(this, function (a) {
  function b(a) {
    this.$container, (this.constraints = null), this.__$tooltip, this.__init(a);
  }

  function c(b, c) {
    var d = !0;
    return (
      a.each(b, function (a, e) {
        return void 0 === c[a] || b[a] !== c[a] ? ((d = !1), !1) : void 0;
      }),
      d
    );
  }

  function d(b) {
    var c = b.attr("id"),
      d = c ? h.window.document.getElementById(c) : null;
    return d ? d === b[0] : a.contains(h.window.document.body, b[0]);
  }

  function e() {
    if (!g) return !1;
    var a = g.document.body || g.document.documentElement,
      b = a.style,
      c = "transition",
      d = ["Moz", "Webkit", "Khtml", "O", "ms"];
    if ("string" == typeof b[c]) return !0;
    c = c.charAt(0).toUpperCase() + c.substr(1);
    for (var e = 0; e < d.length; e++)
      if ("string" == typeof b[d[e] + c]) return !0;
    return !1;
  }
  var f = {
      animation: "fade",
      animationDuration: 350,
      content: null,
      contentAsHTML: !1,
      contentCloning: !1,
      debug: !0,
      delay: 300,
      delayTouch: [300, 500],
      functionInit: null,
      functionBefore: null,
      functionReady: null,
      functionAfter: null,
      functionFormat: null,
      IEmin: 6,
      interactive: !1,
      multiple: !1,
      parent: null,
      plugins: ["sideTip"],
      repositionOnScroll: !1,
      restoration: "none",
      selfDestruction: !0,
      theme: [],
      timer: 0,
      trackerInterval: 500,
      trackOrigin: !1,
      trackTooltip: !1,
      trigger: "hover",
      triggerClose: {
        click: !1,
        mouseleave: !1,
        originClick: !1,
        scroll: !1,
        tap: !1,
        touchleave: !1,
      },
      triggerOpen: {
        click: !1,
        mouseenter: !1,
        tap: !1,
        touchstart: !1,
      },
      updateAnimation: "rotate",
      zIndex: 9999999,
    },
    g = "undefined" != typeof window ? window : null,
    h = {
      hasTouchCapability: !(
        !g ||
        !(
          "ontouchstart" in g ||
          (g.DocumentTouch && g.document instanceof g.DocumentTouch) ||
          g.navigator.maxTouchPoints
        )
      ),
      hasTransitions: e(),
      IE: !1,
      semVer: "4.2.6",
      window: g,
    },
    i = function () {
      (this.__$emitterPrivate = a({})),
        (this.__$emitterPublic = a({})),
        (this.__instancesLatestArr = []),
        (this.__plugins = {}),
        (this._env = h);
    };
  (i.prototype = {
    __bridge: function (b, c, d) {
      if (!c[d]) {
        var e = function () {};
        e.prototype = b;
        var g = new e();
        g.__init && g.__init(c),
          a.each(b, function (a, b) {
            0 != a.indexOf("__") &&
              (c[a]
                ? f.debug
                : ((c[a] = function () {
                    return g[a].apply(
                      g,
                      Array.prototype.slice.apply(arguments)
                    );
                  }),
                  (c[a].bridged = g)));
          }),
          (c[d] = g);
      }
      return this;
    },
    __setWindow: function (a) {
      return (h.window = a), this;
    },
    _getRuler: function (a) {
      return new b(a);
    },
    _off: function () {
      return (
        this.__$emitterPrivate.off.apply(
          this.__$emitterPrivate,
          Array.prototype.slice.apply(arguments)
        ),
        this
      );
    },
    _on: function () {
      return (
        this.__$emitterPrivate.on.apply(
          this.__$emitterPrivate,
          Array.prototype.slice.apply(arguments)
        ),
        this
      );
    },
    _one: function () {
      return (
        this.__$emitterPrivate.one.apply(
          this.__$emitterPrivate,
          Array.prototype.slice.apply(arguments)
        ),
        this
      );
    },
    _plugin: function (b) {
      var c = this;
      if ("string" == typeof b) {
        var d = b,
          e = null;
        return (
          d.indexOf(".") > 0
            ? (e = c.__plugins[d])
            : a.each(c.__plugins, function (a, b) {
                return b.name.substring(b.name.length - d.length - 1) == "." + d
                  ? ((e = b), !1)
                  : void 0;
              }),
          e
        );
      }
      if (b.name.indexOf(".") < 0)
        throw new Error("Plugins must be namespaced");
      return (
        (c.__plugins[b.name] = b), b.core && c.__bridge(b.core, c, b.name), this
      );
    },
    _trigger: function () {
      var a = Array.prototype.slice.apply(arguments);
      return (
        "string" == typeof a[0] &&
          (a[0] = {
            type: a[0],
          }),
        this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate, a),
        this.__$emitterPublic.trigger.apply(this.__$emitterPublic, a),
        this
      );
    },
    instances: function (b) {
      var c = [],
        d = b || ".tooltipstered";
      return (
        a(d).each(function () {
          var b = a(this),
            d = b.data("tooltipster-ns");
          d &&
            a.each(d, function (a, d) {
              c.push(b.data(d));
            });
        }),
        c
      );
    },
    instancesLatest: function () {
      return this.__instancesLatestArr;
    },
    off: function () {
      return (
        this.__$emitterPublic.off.apply(
          this.__$emitterPublic,
          Array.prototype.slice.apply(arguments)
        ),
        this
      );
    },
    on: function () {
      return (
        this.__$emitterPublic.on.apply(
          this.__$emitterPublic,
          Array.prototype.slice.apply(arguments)
        ),
        this
      );
    },
    one: function () {
      return (
        this.__$emitterPublic.one.apply(
          this.__$emitterPublic,
          Array.prototype.slice.apply(arguments)
        ),
        this
      );
    },
    origins: function (b) {
      var c = b ? b + " " : "";
      return a(c + ".tooltipstered").toArray();
    },
    setDefaults: function (b) {
      return a.extend(f, b), this;
    },
    triggerHandler: function () {
      return (
        this.__$emitterPublic.triggerHandler.apply(
          this.__$emitterPublic,
          Array.prototype.slice.apply(arguments)
        ),
        this
      );
    },
  }),
    (a.tooltipster = new i()),
    (a.Tooltipster = function (b, c) {
      (this.__callbacks = {
        close: [],
        open: [],
      }),
        this.__closingTime,
        this.__Content,
        this.__contentBcr,
        (this.__destroyed = !1),
        (this.__$emitterPrivate = a({})),
        (this.__$emitterPublic = a({})),
        (this.__enabled = !0),
        this.__garbageCollector,
        this.__Geometry,
        this.__lastPosition,
        (this.__namespace = "tooltipster-" + Math.round(1e6 * Math.random())),
        this.__options,
        this.__$originParents,
        (this.__pointerIsOverOrigin = !1),
        (this.__previousThemes = []),
        (this.__state = "closed"),
        (this.__timeouts = {
          close: [],
          open: null,
        }),
        (this.__touchEvents = []),
        (this.__tracker = null),
        this._$origin,
        this._$tooltip,
        this.__init(b, c);
    }),
    (a.Tooltipster.prototype = {
      __init: function (b, c) {
        var d = this;
        if (
          ((d._$origin = a(b)),
          (d.__options = a.extend(!0, {}, f, c)),
          d.__optionsFormat(),
          !h.IE || h.IE >= d.__options.IEmin)
        ) {
          var e = null;
          if (
            (void 0 === d._$origin.data("tooltipster-initialTitle") &&
              ((e = d._$origin.attr("title")),
              void 0 === e && (e = null),
              d._$origin.data("tooltipster-initialTitle", e)),
            null !== d.__options.content)
          )
            d.__contentSet(d.__options.content);
          else {
            var g,
              i = d._$origin.attr("data-tooltip-content");
            i && (g = a(i)),
              g && g[0] ? d.__contentSet(g.first()) : d.__contentSet(e);
          }
          d._$origin.removeAttr("title").addClass("tooltipstered"),
            d.__prepareOrigin(),
            d.__prepareGC(),
            a.each(d.__options.plugins, function (a, b) {
              d._plug(b);
            }),
            h.hasTouchCapability &&
              a(h.window.document.body).on(
                "touchmove." + d.__namespace + "-triggerOpen",
                function (a) {
                  d._touchRecordEvent(a);
                }
              ),
            d
              ._on("created", function () {
                d.__prepareTooltip();
              })
              ._on("repositioned", function (a) {
                d.__lastPosition = a.position;
              });
        } else d.__options.disabled = !0;
      },
      __contentInsert: function () {
        var a = this,
          b = a._$tooltip.find(".tooltipster-content"),
          c = a.__Content,
          d = function (a) {
            c = a;
          };
        return (
          a._trigger({
            type: "format",
            content: a.__Content,
            format: d,
          }),
          a.__options.functionFormat &&
            (c = a.__options.functionFormat.call(
              a,
              a,
              {
                origin: a._$origin[0],
              },
              a.__Content
            )),
          "string" != typeof c || a.__options.contentAsHTML
            ? b.empty().append(c)
            : b.text(c),
          a
        );
      },
      __contentSet: function (b) {
        return (
          b instanceof a && this.__options.contentCloning && (b = b.clone(!0)),
          (this.__Content = b),
          this._trigger({
            type: "updated",
            content: b,
          }),
          this
        );
      },
      __destroyError: function () {
        throw new Error(
          "This tooltip has been destroyed and cannot execute your method call."
        );
      },
      __geometry: function () {
        var b = this,
          c = b._$origin,
          d = b._$origin.is("area");
        if (d) {
          var e = b._$origin.parent().attr("name");
          c = a('img[usemap="#' + e + '"]');
        }
        var f = c[0].getBoundingClientRect(),
          g = a(h.window.document),
          i = a(h.window),
          j = c,
          k = {
            available: {
              document: null,
              window: null,
            },
            document: {
              size: {
                height: g.height(),
                width: g.width(),
              },
            },
            window: {
              scroll: {
                left:
                  h.window.scrollX ||
                  h.window.document.documentElement.scrollLeft,
                top:
                  h.window.scrollY ||
                  h.window.document.documentElement.scrollTop,
              },
              size: {
                height: i.height(),
                width: i.width(),
              },
            },
            origin: {
              fixedLineage: !1,
              offset: {},
              size: {
                height: f.bottom - f.top,
                width: f.right - f.left,
              },
              usemapImage: d ? c[0] : null,
              windowOffset: {
                bottom: f.bottom,
                left: f.left,
                right: f.right,
                top: f.top,
              },
            },
          };
        if (d) {
          var l = b._$origin.attr("shape"),
            m = b._$origin.attr("coords");
          if (
            (m &&
              ((m = m.split(",")),
              a.map(m, function (a, b) {
                m[b] = parseInt(a);
              })),
            "default" != l)
          )
            switch (l) {
              case "circle":
                var n = m[0],
                  o = m[1],
                  p = m[2],
                  q = o - p,
                  r = n - p;
                (k.origin.size.height = 2 * p),
                  (k.origin.size.width = k.origin.size.height),
                  (k.origin.windowOffset.left += r),
                  (k.origin.windowOffset.top += q);
                break;
              case "rect":
                var s = m[0],
                  t = m[1],
                  u = m[2],
                  v = m[3];
                (k.origin.size.height = v - t),
                  (k.origin.size.width = u - s),
                  (k.origin.windowOffset.left += s),
                  (k.origin.windowOffset.top += t);
                break;
              case "poly":
                for (
                  var w = 0, x = 0, y = 0, z = 0, A = "even", B = 0;
                  B < m.length;
                  B++
                ) {
                  var C = m[B];
                  "even" == A
                    ? (C > y && ((y = C), 0 === B && (w = y)),
                      w > C && (w = C),
                      (A = "odd"))
                    : (C > z && ((z = C), 1 == B && (x = z)),
                      x > C && (x = C),
                      (A = "even"));
                }
                (k.origin.size.height = z - x),
                  (k.origin.size.width = y - w),
                  (k.origin.windowOffset.left += w),
                  (k.origin.windowOffset.top += x);
            }
        }
        var D = function (a) {
          (k.origin.size.height = a.height),
            (k.origin.windowOffset.left = a.left),
            (k.origin.windowOffset.top = a.top),
            (k.origin.size.width = a.width);
        };
        for (
          b._trigger({
            type: "geometry",
            edit: D,
            geometry: {
              height: k.origin.size.height,
              left: k.origin.windowOffset.left,
              top: k.origin.windowOffset.top,
              width: k.origin.size.width,
            },
          }),
            k.origin.windowOffset.right =
              k.origin.windowOffset.left + k.origin.size.width,
            k.origin.windowOffset.bottom =
              k.origin.windowOffset.top + k.origin.size.height,
            k.origin.offset.left =
              k.origin.windowOffset.left + k.window.scroll.left,
            k.origin.offset.top =
              k.origin.windowOffset.top + k.window.scroll.top,
            k.origin.offset.bottom = k.origin.offset.top + k.origin.size.height,
            k.origin.offset.right = k.origin.offset.left + k.origin.size.width,
            k.available.document = {
              bottom: {
                height: k.document.size.height - k.origin.offset.bottom,
                width: k.document.size.width,
              },
              left: {
                height: k.document.size.height,
                width: k.origin.offset.left,
              },
              right: {
                height: k.document.size.height,
                width: k.document.size.width - k.origin.offset.right,
              },
              top: {
                height: k.origin.offset.top,
                width: k.document.size.width,
              },
            },
            k.available.window = {
              bottom: {
                height: Math.max(
                  k.window.size.height -
                    Math.max(k.origin.windowOffset.bottom, 0),
                  0
                ),
                width: k.window.size.width,
              },
              left: {
                height: k.window.size.height,
                width: Math.max(k.origin.windowOffset.left, 0),
              },
              right: {
                height: k.window.size.height,
                width: Math.max(
                  k.window.size.width -
                    Math.max(k.origin.windowOffset.right, 0),
                  0
                ),
              },
              top: {
                height: Math.max(k.origin.windowOffset.top, 0),
                width: k.window.size.width,
              },
            };
          "html" != j[0].tagName.toLowerCase();

        ) {
          if ("fixed" == j.css("position")) {
            k.origin.fixedLineage = !0;
            break;
          }
          j = j.parent();
        }
        return k;
      },
      __optionsFormat: function () {
        return (
          "number" == typeof this.__options.animationDuration &&
            (this.__options.animationDuration = [
              this.__options.animationDuration,
              this.__options.animationDuration,
            ]),
          "number" == typeof this.__options.delay &&
            (this.__options.delay = [
              this.__options.delay,
              this.__options.delay,
            ]),
          "number" == typeof this.__options.delayTouch &&
            (this.__options.delayTouch = [
              this.__options.delayTouch,
              this.__options.delayTouch,
            ]),
          "string" == typeof this.__options.theme &&
            (this.__options.theme = [this.__options.theme]),
          null === this.__options.parent
            ? (this.__options.parent = a(h.window.document.body))
            : "string" == typeof this.__options.parent &&
              (this.__options.parent = a(this.__options.parent)),
          "hover" == this.__options.trigger
            ? ((this.__options.triggerOpen = {
                mouseenter: !0,
                touchstart: !0,
              }),
              (this.__options.triggerClose = {
                mouseleave: !0,
                originClick: !0,
                touchleave: !0,
              }))
            : "click" == this.__options.trigger &&
              ((this.__options.triggerOpen = {
                click: !0,
                tap: !0,
              }),
              (this.__options.triggerClose = {
                click: !0,
                tap: !0,
              })),
          this._trigger("options"),
          this
        );
      },
      __prepareGC: function () {
        var b = this;
        return (
          b.__options.selfDestruction
            ? (b.__garbageCollector = setInterval(function () {
                var c = new Date().getTime();
                (b.__touchEvents = a.grep(b.__touchEvents, function (a, b) {
                  return c - a.time > 6e4;
                })),
                  d(b._$origin) ||
                    b.close(function () {
                      b.destroy();
                    });
              }, 2e4))
            : clearInterval(b.__garbageCollector),
          b
        );
      },
      __prepareOrigin: function () {
        var a = this;
        if (
          (a._$origin.off("." + a.__namespace + "-triggerOpen"),
          h.hasTouchCapability &&
            a._$origin.on(
              "touchstart." +
                a.__namespace +
                "-triggerOpen touchend." +
                a.__namespace +
                "-triggerOpen touchcancel." +
                a.__namespace +
                "-triggerOpen",
              function (b) {
                a._touchRecordEvent(b);
              }
            ),
          a.__options.triggerOpen.click ||
            (a.__options.triggerOpen.tap && h.hasTouchCapability))
        ) {
          var b = "";
          a.__options.triggerOpen.click &&
            (b += "click." + a.__namespace + "-triggerOpen "),
            a.__options.triggerOpen.tap &&
              h.hasTouchCapability &&
              (b += "touchend." + a.__namespace + "-triggerOpen"),
            a._$origin.on(b, function (b) {
              a._touchIsMeaningfulEvent(b) && a._open(b);
            });
        }
        if (
          a.__options.triggerOpen.mouseenter ||
          (a.__options.triggerOpen.touchstart && h.hasTouchCapability)
        ) {
          var b = "";
          a.__options.triggerOpen.mouseenter &&
            (b += "mouseenter." + a.__namespace + "-triggerOpen "),
            a.__options.triggerOpen.touchstart &&
              h.hasTouchCapability &&
              (b += "touchstart." + a.__namespace + "-triggerOpen"),
            a._$origin.on(b, function (b) {
              (!a._touchIsTouchEvent(b) && a._touchIsEmulatedEvent(b)) ||
                ((a.__pointerIsOverOrigin = !0), a._openShortly(b));
            });
        }
        if (
          a.__options.triggerClose.mouseleave ||
          (a.__options.triggerClose.touchleave && h.hasTouchCapability)
        ) {
          var b = "";
          a.__options.triggerClose.mouseleave &&
            (b += "mouseleave." + a.__namespace + "-triggerOpen "),
            a.__options.triggerClose.touchleave &&
              h.hasTouchCapability &&
              (b +=
                "touchend." +
                a.__namespace +
                "-triggerOpen touchcancel." +
                a.__namespace +
                "-triggerOpen"),
            a._$origin.on(b, function (b) {
              a._touchIsMeaningfulEvent(b) && (a.__pointerIsOverOrigin = !1);
            });
        }
        return a;
      },
      __prepareTooltip: function () {
        var b = this,
          c = b.__options.interactive ? "auto" : "";
        return (
          b._$tooltip.attr("id", b.__namespace).css({
            "pointer-events": c,
            zIndex: b.__options.zIndex,
          }),
          a.each(b.__previousThemes, function (a, c) {
            b._$tooltip.removeClass(c);
          }),
          a.each(b.__options.theme, function (a, c) {
            b._$tooltip.addClass(c);
          }),
          (b.__previousThemes = a.merge([], b.__options.theme)),
          b
        );
      },
      __scrollHandler: function (b) {
        var c = this;
        if (c.__options.triggerClose.scroll) c._close(b);
        else if (d(c._$origin) && d(c._$tooltip)) {
          var e = null;
          if (b.target === h.window.document)
            c.__Geometry.origin.fixedLineage ||
              (c.__options.repositionOnScroll && c.reposition(b));
          else {
            e = c.__geometry();
            var f = !1;
            if (
              ("fixed" != c._$origin.css("position") &&
                c.__$originParents.each(function (b, c) {
                  var d = a(c),
                    g = d.css("overflow-x"),
                    h = d.css("overflow-y");
                  if ("visible" != g || "visible" != h) {
                    var i = c.getBoundingClientRect();
                    if (
                      "visible" != g &&
                      (e.origin.windowOffset.left < i.left ||
                        e.origin.windowOffset.right > i.right)
                    )
                      return (f = !0), !1;
                    if (
                      "visible" != h &&
                      (e.origin.windowOffset.top < i.top ||
                        e.origin.windowOffset.bottom > i.bottom)
                    )
                      return (f = !0), !1;
                  }
                  return "fixed" == d.css("position") ? !1 : void 0;
                }),
              f)
            )
              c._$tooltip.css("visibility", "hidden");
            else if (
              (c._$tooltip.css("visibility", "visible"),
              c.__options.repositionOnScroll)
            )
              c.reposition(b);
            else {
              var g = e.origin.offset.left - c.__Geometry.origin.offset.left,
                i = e.origin.offset.top - c.__Geometry.origin.offset.top;
              c._$tooltip.css({
                left: c.__lastPosition.coord.left + g,
                top: c.__lastPosition.coord.top + i,
              });
            }
          }
          c._trigger({
            type: "scroll",
            event: b,
            geo: e,
          });
        }
        return c;
      },
      __stateSet: function (a) {
        return (
          (this.__state = a),
          this._trigger({
            type: "state",
            state: a,
          }),
          this
        );
      },
      __timeoutsClear: function () {
        return (
          clearTimeout(this.__timeouts.open),
          (this.__timeouts.open = null),
          a.each(this.__timeouts.close, function (a, b) {
            clearTimeout(b);
          }),
          (this.__timeouts.close = []),
          this
        );
      },
      __trackerStart: function () {
        var a = this,
          b = a._$tooltip.find(".tooltipster-content");
        return (
          a.__options.trackTooltip &&
            (a.__contentBcr = b[0].getBoundingClientRect()),
          (a.__tracker = setInterval(function () {
            if (d(a._$origin) && d(a._$tooltip)) {
              if (a.__options.trackOrigin) {
                var e = a.__geometry(),
                  f = !1;
                c(e.origin.size, a.__Geometry.origin.size) &&
                  (a.__Geometry.origin.fixedLineage
                    ? c(
                        e.origin.windowOffset,
                        a.__Geometry.origin.windowOffset
                      ) && (f = !0)
                    : c(e.origin.offset, a.__Geometry.origin.offset) &&
                      (f = !0)),
                  f ||
                    (a.__options.triggerClose.mouseleave
                      ? a._close()
                      : a.reposition());
              }
              if (a.__options.trackTooltip) {
                var g = b[0].getBoundingClientRect();
                (g.height === a.__contentBcr.height &&
                  g.width === a.__contentBcr.width) ||
                  (a.reposition(), (a.__contentBcr = g));
              }
            } else a._close();
          }, a.__options.trackerInterval)),
          a
        );
      },
      _close: function (b, c, d) {
        var e = this,
          f = !0;
        if (
          (e._trigger({
            type: "close",
            event: b,
            stop: function () {
              f = !1;
            },
          }),
          f || d)
        ) {
          c && e.__callbacks.close.push(c),
            (e.__callbacks.open = []),
            e.__timeoutsClear();
          var g = function () {
            a.each(e.__callbacks.close, function (a, c) {
              c.call(e, e, {
                event: b,
                origin: e._$origin[0],
              });
            }),
              (e.__callbacks.close = []);
          };
          if ("closed" != e.__state) {
            var i = !0,
              j = new Date(),
              k = j.getTime(),
              l = k + e.__options.animationDuration[1];
            if (
              ("disappearing" == e.__state &&
                l > e.__closingTime &&
                e.__options.animationDuration[1] > 0 &&
                (i = !1),
              i)
            ) {
              (e.__closingTime = l),
                "disappearing" != e.__state && e.__stateSet("disappearing");
              var m = function () {
                clearInterval(e.__tracker),
                  e._trigger({
                    type: "closing",
                    event: b,
                  }),
                  e._$tooltip
                    .off("." + e.__namespace + "-triggerClose")
                    .removeClass("tooltipster-dying"),
                  a(h.window).off("." + e.__namespace + "-triggerClose"),
                  e.__$originParents.each(function (b, c) {
                    a(c).off("scroll." + e.__namespace + "-triggerClose");
                  }),
                  (e.__$originParents = null),
                  a(h.window.document.body).off(
                    "." + e.__namespace + "-triggerClose"
                  ),
                  e._$origin.off("." + e.__namespace + "-triggerClose"),
                  e._off("dismissable"),
                  e.__stateSet("closed"),
                  e._trigger({
                    type: "after",
                    event: b,
                  }),
                  e.__options.functionAfter &&
                    e.__options.functionAfter.call(e, e, {
                      event: b,
                      origin: e._$origin[0],
                    }),
                  g();
              };
              h.hasTransitions
                ? (e._$tooltip.css({
                    "-moz-animation-duration":
                      e.__options.animationDuration[1] + "ms",
                    "-ms-animation-duration":
                      e.__options.animationDuration[1] + "ms",
                    "-o-animation-duration":
                      e.__options.animationDuration[1] + "ms",
                    "-webkit-animation-duration":
                      e.__options.animationDuration[1] + "ms",
                    "animation-duration":
                      e.__options.animationDuration[1] + "ms",
                    "transition-duration":
                      e.__options.animationDuration[1] + "ms",
                  }),
                  e._$tooltip
                    .clearQueue()
                    .removeClass("tooltipster-show")
                    .addClass("tooltipster-dying"),
                  e.__options.animationDuration[1] > 0 &&
                    e._$tooltip.delay(e.__options.animationDuration[1]),
                  e._$tooltip.queue(m))
                : e._$tooltip
                    .stop()
                    .fadeOut(e.__options.animationDuration[1], m);
            }
          } else g();
        }
        return e;
      },
      _off: function () {
        return (
          this.__$emitterPrivate.off.apply(
            this.__$emitterPrivate,
            Array.prototype.slice.apply(arguments)
          ),
          this
        );
      },
      _on: function () {
        return (
          this.__$emitterPrivate.on.apply(
            this.__$emitterPrivate,
            Array.prototype.slice.apply(arguments)
          ),
          this
        );
      },
      _one: function () {
        return (
          this.__$emitterPrivate.one.apply(
            this.__$emitterPrivate,
            Array.prototype.slice.apply(arguments)
          ),
          this
        );
      },
      _open: function (b, c) {
        var e = this;
        if (!e.__destroying && d(e._$origin) && e.__enabled) {
          var f = !0;
          if (
            ("closed" == e.__state &&
              (e._trigger({
                type: "before",
                event: b,
                stop: function () {
                  f = !1;
                },
              }),
              f &&
                e.__options.functionBefore &&
                (f = e.__options.functionBefore.call(e, e, {
                  event: b,
                  origin: e._$origin[0],
                }))),
            f !== !1 && null !== e.__Content)
          ) {
            c && e.__callbacks.open.push(c),
              (e.__callbacks.close = []),
              e.__timeoutsClear();
            var g,
              i = function () {
                "stable" != e.__state && e.__stateSet("stable"),
                  a.each(e.__callbacks.open, function (a, b) {
                    b.call(e, e, {
                      origin: e._$origin[0],
                      tooltip: e._$tooltip[0],
                    });
                  }),
                  (e.__callbacks.open = []);
              };
            if ("closed" !== e.__state)
              (g = 0),
                "disappearing" === e.__state
                  ? (e.__stateSet("appearing"),
                    h.hasTransitions
                      ? (e._$tooltip
                          .clearQueue()
                          .removeClass("tooltipster-dying")
                          .addClass("tooltipster-show"),
                        e.__options.animationDuration[0] > 0 &&
                          e._$tooltip.delay(e.__options.animationDuration[0]),
                        e._$tooltip.queue(i))
                      : e._$tooltip.stop().fadeIn(i))
                  : "stable" == e.__state && i();
            else {
              if (
                (e.__stateSet("appearing"),
                (g = e.__options.animationDuration[0]),
                e.__contentInsert(),
                e.reposition(b, !0),
                h.hasTransitions
                  ? (e._$tooltip
                      .addClass("tooltipster-" + e.__options.animation)
                      .addClass("tooltipster-initial")
                      .css({
                        "-moz-animation-duration":
                          e.__options.animationDuration[0] + "ms",
                        "-ms-animation-duration":
                          e.__options.animationDuration[0] + "ms",
                        "-o-animation-duration":
                          e.__options.animationDuration[0] + "ms",
                        "-webkit-animation-duration":
                          e.__options.animationDuration[0] + "ms",
                        "animation-duration":
                          e.__options.animationDuration[0] + "ms",
                        "transition-duration":
                          e.__options.animationDuration[0] + "ms",
                      }),
                    setTimeout(function () {
                      "closed" != e.__state &&
                        (e._$tooltip
                          .addClass("tooltipster-show")
                          .removeClass("tooltipster-initial"),
                        e.__options.animationDuration[0] > 0 &&
                          e._$tooltip.delay(e.__options.animationDuration[0]),
                        e._$tooltip.queue(i));
                    }, 0))
                  : e._$tooltip
                      .css("display", "none")
                      .fadeIn(e.__options.animationDuration[0], i),
                e.__trackerStart(),
                a(h.window)
                  .on(
                    "resize." + e.__namespace + "-triggerClose",
                    function (b) {
                      var c = a(document.activeElement);
                      ((c.is("input") || c.is("textarea")) &&
                        a.contains(e._$tooltip[0], c[0])) ||
                        e.reposition(b);
                    }
                  )
                  .on(
                    "scroll." + e.__namespace + "-triggerClose",
                    function (a) {
                      e.__scrollHandler(a);
                    }
                  ),
                (e.__$originParents = e._$origin.parents()),
                e.__$originParents.each(function (b, c) {
                  a(c).on(
                    "scroll." + e.__namespace + "-triggerClose",
                    function (a) {
                      e.__scrollHandler(a);
                    }
                  );
                }),
                e.__options.triggerClose.mouseleave ||
                  (e.__options.triggerClose.touchleave && h.hasTouchCapability))
              ) {
                e._on("dismissable", function (a) {
                  a.dismissable
                    ? a.delay
                      ? ((m = setTimeout(function () {
                          e._close(a.event);
                        }, a.delay)),
                        e.__timeouts.close.push(m))
                      : e._close(a)
                    : clearTimeout(m);
                });
                var j = e._$origin,
                  k = "",
                  l = "",
                  m = null;
                e.__options.interactive && (j = j.add(e._$tooltip)),
                  e.__options.triggerClose.mouseleave &&
                    ((k += "mouseenter." + e.__namespace + "-triggerClose "),
                    (l += "mouseleave." + e.__namespace + "-triggerClose ")),
                  e.__options.triggerClose.touchleave &&
                    h.hasTouchCapability &&
                    ((k += "touchstart." + e.__namespace + "-triggerClose"),
                    (l +=
                      "touchend." +
                      e.__namespace +
                      "-triggerClose touchcancel." +
                      e.__namespace +
                      "-triggerClose")),
                  j
                    .on(l, function (a) {
                      if (
                        e._touchIsTouchEvent(a) ||
                        !e._touchIsEmulatedEvent(a)
                      ) {
                        var b =
                          "mouseleave" == a.type
                            ? e.__options.delay
                            : e.__options.delayTouch;
                        e._trigger({
                          delay: b[1],
                          dismissable: !0,
                          event: a,
                          type: "dismissable",
                        });
                      }
                    })
                    .on(k, function (a) {
                      (!e._touchIsTouchEvent(a) &&
                        e._touchIsEmulatedEvent(a)) ||
                        e._trigger({
                          dismissable: !1,
                          event: a,
                          type: "dismissable",
                        });
                    });
              }
              e.__options.triggerClose.originClick &&
                e._$origin.on(
                  "click." + e.__namespace + "-triggerClose",
                  function (a) {
                    e._touchIsTouchEvent(a) ||
                      e._touchIsEmulatedEvent(a) ||
                      e._close(a);
                  }
                ),
                (e.__options.triggerClose.click ||
                  (e.__options.triggerClose.tap && h.hasTouchCapability)) &&
                  setTimeout(function () {
                    if ("closed" != e.__state) {
                      var b = "",
                        c = a(h.window.document.body);
                      e.__options.triggerClose.click &&
                        (b += "click." + e.__namespace + "-triggerClose "),
                        e.__options.triggerClose.tap &&
                          h.hasTouchCapability &&
                          (b += "touchend." + e.__namespace + "-triggerClose"),
                        c.on(b, function (b) {
                          e._touchIsMeaningfulEvent(b) &&
                            (e._touchRecordEvent(b),
                            (e.__options.interactive &&
                              a.contains(e._$tooltip[0], b.target)) ||
                              e._close(b));
                        }),
                        e.__options.triggerClose.tap &&
                          h.hasTouchCapability &&
                          c.on(
                            "touchstart." + e.__namespace + "-triggerClose",
                            function (a) {
                              e._touchRecordEvent(a);
                            }
                          );
                    }
                  }, 0),
                e._trigger("ready"),
                e.__options.functionReady &&
                  e.__options.functionReady.call(e, e, {
                    origin: e._$origin[0],
                    tooltip: e._$tooltip[0],
                  });
            }
            if (e.__options.timer > 0) {
              var m = setTimeout(function () {
                e._close();
              }, e.__options.timer + g);
              e.__timeouts.close.push(m);
            }
          }
        }
        return e;
      },
      _openShortly: function (a) {
        var b = this,
          c = !0;
        if (
          "stable" != b.__state &&
          "appearing" != b.__state &&
          !b.__timeouts.open &&
          (b._trigger({
            type: "start",
            event: a,
            stop: function () {
              c = !1;
            },
          }),
          c)
        ) {
          var d =
            0 == a.type.indexOf("touch")
              ? b.__options.delayTouch
              : b.__options.delay;
          d[0]
            ? (b.__timeouts.open = setTimeout(function () {
                (b.__timeouts.open = null),
                  b.__pointerIsOverOrigin && b._touchIsMeaningfulEvent(a)
                    ? (b._trigger("startend"), b._open(a))
                    : b._trigger("startcancel");
              }, d[0]))
            : (b._trigger("startend"), b._open(a));
        }
        return b;
      },
      _optionsExtract: function (b, c) {
        var d = this,
          e = a.extend(!0, {}, c),
          f = d.__options[b];
        return (
          f ||
            ((f = {}),
            a.each(c, function (a, b) {
              var c = d.__options[a];
              void 0 !== c && (f[a] = c);
            })),
          a.each(e, function (b, c) {
            void 0 !== f[b] &&
              ("object" != typeof c ||
              c instanceof Array ||
              null == c ||
              "object" != typeof f[b] ||
              f[b] instanceof Array ||
              null == f[b]
                ? (e[b] = f[b])
                : a.extend(e[b], f[b]));
          }),
          e
        );
      },
      _plug: function (b) {
        var c = a.tooltipster._plugin(b);
        if (!c) throw new Error('The "' + b + '" plugin is not defined');
        return (
          c.instance && a.tooltipster.__bridge(c.instance, this, c.name), this
        );
      },
      _touchIsEmulatedEvent: function (a) {
        for (
          var b = !1,
            c = new Date().getTime(),
            d = this.__touchEvents.length - 1;
          d >= 0;
          d--
        ) {
          var e = this.__touchEvents[d];
          if (!(c - e.time < 500)) break;
          e.target === a.target && (b = !0);
        }
        return b;
      },
      _touchIsMeaningfulEvent: function (a) {
        return (
          (this._touchIsTouchEvent(a) && !this._touchSwiped(a.target)) ||
          (!this._touchIsTouchEvent(a) && !this._touchIsEmulatedEvent(a))
        );
      },
      _touchIsTouchEvent: function (a) {
        return 0 == a.type.indexOf("touch");
      },
      _touchRecordEvent: function (a) {
        return (
          this._touchIsTouchEvent(a) &&
            ((a.time = new Date().getTime()), this.__touchEvents.push(a)),
          this
        );
      },
      _touchSwiped: function (a) {
        for (var b = !1, c = this.__touchEvents.length - 1; c >= 0; c--) {
          var d = this.__touchEvents[c];
          if ("touchmove" == d.type) {
            b = !0;
            break;
          }
          if ("touchstart" == d.type && a === d.target) break;
        }
        return b;
      },
      _trigger: function () {
        var b = Array.prototype.slice.apply(arguments);
        return (
          "string" == typeof b[0] &&
            (b[0] = {
              type: b[0],
            }),
          (b[0].instance = this),
          (b[0].origin = this._$origin ? this._$origin[0] : null),
          (b[0].tooltip = this._$tooltip ? this._$tooltip[0] : null),
          this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate, b),
          a.tooltipster._trigger.apply(a.tooltipster, b),
          this.__$emitterPublic.trigger.apply(this.__$emitterPublic, b),
          this
        );
      },
      _unplug: function (b) {
        var c = this;
        if (c[b]) {
          var d = a.tooltipster._plugin(b);
          d.instance &&
            a.each(d.instance, function (a, d) {
              c[a] && c[a].bridged === c[b] && delete c[a];
            }),
            c[b].__destroy && c[b].__destroy(),
            delete c[b];
        }
        return c;
      },
      close: function (a) {
        return (
          this.__destroyed ? this.__destroyError() : this._close(null, a), this
        );
      },
      content: function (a) {
        var b = this;
        if (void 0 === a) return b.__Content;
        if (b.__destroyed) b.__destroyError();
        else if ((b.__contentSet(a), null !== b.__Content)) {
          if (
            "closed" !== b.__state &&
            (b.__contentInsert(), b.reposition(), b.__options.updateAnimation)
          )
            if (h.hasTransitions) {
              var c = b.__options.updateAnimation;
              b._$tooltip.addClass("tooltipster-update-" + c),
                setTimeout(function () {
                  "closed" != b.__state &&
                    b._$tooltip.removeClass("tooltipster-update-" + c);
                }, 1e3);
            } else
              b._$tooltip.fadeTo(200, 0.5, function () {
                "closed" != b.__state && b._$tooltip.fadeTo(200, 1);
              });
        } else b._close();
        return b;
      },
      destroy: function () {
        var b = this;
        if (b.__destroyed) b.__destroyError();
        else {
          "closed" != b.__state
            ? b.option("animationDuration", 0)._close(null, null, !0)
            : b.__timeoutsClear(),
            b._trigger("destroy"),
            (b.__destroyed = !0),
            b._$origin
              .removeData(b.__namespace)
              .off("." + b.__namespace + "-triggerOpen"),
            a(h.window.document.body).off("." + b.__namespace + "-triggerOpen");
          var c = b._$origin.data("tooltipster-ns");
          if (c)
            if (1 === c.length) {
              var d = null;
              "previous" == b.__options.restoration
                ? (d = b._$origin.data("tooltipster-initialTitle"))
                : "current" == b.__options.restoration &&
                  (d =
                    "string" == typeof b.__Content
                      ? b.__Content
                      : a("<div></div>").append(b.__Content).html()),
                d && b._$origin.attr("title", d),
                b._$origin.removeClass("tooltipstered"),
                b._$origin
                  .removeData("tooltipster-ns")
                  .removeData("tooltipster-initialTitle");
            } else
              (c = a.grep(c, function (a, c) {
                return a !== b.__namespace;
              })),
                b._$origin.data("tooltipster-ns", c);
          b._trigger("destroyed"),
            b._off(),
            b.off(),
            (b.__Content = null),
            (b.__$emitterPrivate = null),
            (b.__$emitterPublic = null),
            (b.__options.parent = null),
            (b._$origin = null),
            (b._$tooltip = null),
            (a.tooltipster.__instancesLatestArr = a.grep(
              a.tooltipster.__instancesLatestArr,
              function (a, c) {
                return b !== a;
              }
            )),
            clearInterval(b.__garbageCollector);
        }
        return b;
      },
      disable: function () {
        return this.__destroyed
          ? (this.__destroyError(), this)
          : (this._close(), (this.__enabled = !1), this);
      },
      elementOrigin: function () {
        return this.__destroyed ? void this.__destroyError() : this._$origin[0];
      },
      elementTooltip: function () {
        return this._$tooltip ? this._$tooltip[0] : null;
      },
      enable: function () {
        return (this.__enabled = !0), this;
      },
      hide: function (a) {
        return this.close(a);
      },
      instance: function () {
        return this;
      },
      off: function () {
        return (
          this.__destroyed ||
            this.__$emitterPublic.off.apply(
              this.__$emitterPublic,
              Array.prototype.slice.apply(arguments)
            ),
          this
        );
      },
      on: function () {
        return (
          this.__destroyed
            ? this.__destroyError()
            : this.__$emitterPublic.on.apply(
                this.__$emitterPublic,
                Array.prototype.slice.apply(arguments)
              ),
          this
        );
      },
      one: function () {
        return (
          this.__destroyed
            ? this.__destroyError()
            : this.__$emitterPublic.one.apply(
                this.__$emitterPublic,
                Array.prototype.slice.apply(arguments)
              ),
          this
        );
      },
      open: function (a) {
        return (
          this.__destroyed ? this.__destroyError() : this._open(null, a), this
        );
      },
      option: function (b, c) {
        return void 0 === c
          ? this.__options[b]
          : (this.__destroyed
              ? this.__destroyError()
              : ((this.__options[b] = c),
                this.__optionsFormat(),
                a.inArray(b, ["trigger", "triggerClose", "triggerOpen"]) >= 0 &&
                  this.__prepareOrigin(),
                "selfDestruction" === b && this.__prepareGC()),
            this);
      },
      reposition: function (a, b) {
        var c = this;
        return (
          c.__destroyed
            ? c.__destroyError()
            : "closed" != c.__state &&
              d(c._$origin) &&
              (b || d(c._$tooltip)) &&
              (b || c._$tooltip.detach(),
              (c.__Geometry = c.__geometry()),
              c._trigger({
                type: "reposition",
                event: a,
                helper: {
                  geo: c.__Geometry,
                },
              })),
          c
        );
      },
      show: function (a) {
        return this.open(a);
      },
      status: function () {
        return {
          destroyed: this.__destroyed,
          enabled: this.__enabled,
          open: "closed" !== this.__state,
          state: this.__state,
        };
      },
      triggerHandler: function () {
        return (
          this.__destroyed
            ? this.__destroyError()
            : this.__$emitterPublic.triggerHandler.apply(
                this.__$emitterPublic,
                Array.prototype.slice.apply(arguments)
              ),
          this
        );
      },
    }),
    (a.fn.tooltipster = function () {
      var b = Array.prototype.slice.apply(arguments),
        c =
          "You are using a single HTML element as content for several tooltips. You probably want to set the contentCloning option to TRUE.";
      if (0 === this.length) return this;
      if ("string" == typeof b[0]) {
        var d = "#*$~&";
        return (
          this.each(function () {
            var e = a(this).data("tooltipster-ns"),
              f = e ? a(this).data(e[0]) : null;
            if (!f)
              throw new Error(
                "You called Tooltipster's \"" +
                  b[0] +
                  '" method on an uninitialized element'
              );
            if ("function" != typeof f[b[0]])
              throw new Error('Unknown method "' + b[0] + '"');
            this.length > 1 &&
              "content" == b[0] &&
              (b[1] instanceof a ||
                ("object" == typeof b[1] && null != b[1] && b[1].tagName)) &&
              !f.__options.contentCloning &&
              f.__options.debug &&
              console.log(c);
            var g = f[b[0]](b[1], b[2]);
            return g !== f || "instance" === b[0] ? ((d = g), !1) : void 0;
          }),
          "#*$~&" !== d ? d : this
        );
      }
      a.tooltipster.__instancesLatestArr = [];
      var e = b[0] && void 0 !== b[0].multiple,
        g = (e && b[0].multiple) || (!e && f.multiple),
        h = b[0] && void 0 !== b[0].content,
        i = (h && b[0].content) || (!h && f.content),
        j = b[0] && void 0 !== b[0].contentCloning,
        k = (j && b[0].contentCloning) || (!j && f.contentCloning),
        l = b[0] && void 0 !== b[0].debug,
        m = (l && b[0].debug) || (!l && f.debug);
      return (
        this.length > 1 &&
          (i instanceof a ||
            ("object" == typeof i && null != i && i.tagName)) &&
          !k &&
          m &&
          console.log(c),
        this.each(function () {
          var c = !1,
            d = a(this),
            e = d.data("tooltipster-ns"),
            f = null;
          e ? (g ? (c = !0) : m) : (c = !0),
            c &&
              ((f = new a.Tooltipster(this, b[0])),
              e || (e = []),
              e.push(f.__namespace),
              d.data("tooltipster-ns", e),
              d.data(f.__namespace, f),
              f.__options.functionInit &&
                f.__options.functionInit.call(f, f, {
                  origin: this,
                }),
              f._trigger("init")),
            a.tooltipster.__instancesLatestArr.push(f);
        }),
        this
      );
    }),
    (b.prototype = {
      __init: function (b) {
        (this.__$tooltip = b),
          this.__$tooltip
            .css({
              left: 0,
              overflow: "hidden",
              position: "absolute",
              top: 0,
            })
            .find(".tooltipster-content")
            .css("overflow", "auto"),
          (this.$container = a('<div class="tooltipster-ruler"></div>')
            .append(this.__$tooltip)
            .appendTo(h.window.document.body));
      },
      __forceRedraw: function () {
        var a = this.__$tooltip.parent();
        this.__$tooltip.detach(), this.__$tooltip.appendTo(a);
      },
      constrain: function (a, b) {
        return (
          (this.constraints = {
            width: a,
            height: b,
          }),
          this.__$tooltip.css({
            display: "block",
            height: "",
            overflow: "auto",
            width: a,
          }),
          this
        );
      },
      destroy: function () {
        this.__$tooltip.detach().find(".tooltipster-content").css({
          display: "",
          overflow: "",
        }),
          this.$container.remove();
      },
      free: function () {
        return (
          (this.constraints = null),
          this.__$tooltip.css({
            display: "",
            height: "",
            overflow: "visible",
            width: "",
          }),
          this
        );
      },
      measure: function () {
        this.__forceRedraw();
        var a = this.__$tooltip[0].getBoundingClientRect(),
          b = {
            size: {
              height: a.height || a.bottom - a.top,
              width: a.width || a.right - a.left,
            },
          };
        if (this.constraints) {
          var c = this.__$tooltip.find(".tooltipster-content"),
            d = this.__$tooltip.outerHeight(),
            e = c[0].getBoundingClientRect(),
            f = {
              height: d <= this.constraints.height,
              width:
                a.width <= this.constraints.width &&
                e.width >= c[0].scrollWidth - 1,
            };
          b.fits = f.height && f.width;
        }
        return (
          h.IE &&
            h.IE <= 11 &&
            b.size.width !== h.window.document.documentElement.clientWidth &&
            (b.size.width = Math.ceil(b.size.width) + 1),
          b
        );
      },
    });
  var j = navigator.userAgent.toLowerCase();
  -1 != j.indexOf("msie")
    ? (h.IE = parseInt(j.split("msie")[1]))
    : -1 !== j.toLowerCase().indexOf("trident") && -1 !== j.indexOf(" rv:11")
    ? (h.IE = 11)
    : -1 != j.toLowerCase().indexOf("edge/") &&
      (h.IE = parseInt(j.toLowerCase().split("edge/")[1]));
  var k = "tooltipster.sideTip";
  return (
    a.tooltipster._plugin({
      name: k,
      instance: {
        __defaults: function () {
          return {
            arrow: !0,
            distance: 6,
            functionPosition: null,
            maxWidth: null,
            minIntersection: 16,
            minWidth: 0,
            position: null,
            side: "top",
            viewportAware: !0,
          };
        },
        __init: function (a) {
          var b = this;
          (b.__instance = a),
            (b.__namespace =
              "tooltipster-sideTip-" + Math.round(1e6 * Math.random())),
            (b.__previousState = "closed"),
            b.__options,
            b.__optionsFormat(),
            b.__instance._on("state." + b.__namespace, function (a) {
              "closed" == a.state
                ? b.__close()
                : "appearing" == a.state &&
                  "closed" == b.__previousState &&
                  b.__create(),
                (b.__previousState = a.state);
            }),
            b.__instance._on("options." + b.__namespace, function () {
              b.__optionsFormat();
            }),
            b.__instance._on("reposition." + b.__namespace, function (a) {
              b.__reposition(a.event, a.helper);
            });
        },
        __close: function () {
          this.__instance.content() instanceof a &&
            this.__instance.content().detach(),
            this.__instance._$tooltip.remove(),
            (this.__instance._$tooltip = null);
        },
        __create: function () {
          var b = a(
            '<div class="tooltipster-base tooltipster-sidetip"><div class="tooltipster-box"><div class="tooltipster-content"></div></div><div class="tooltipster-arrow"><div class="tooltipster-arrow-uncropped"><div class="tooltipster-arrow-border"></div><div class="tooltipster-arrow-background"></div></div></div></div>'
          );
          this.__options.arrow ||
            b
              .find(".tooltipster-box")
              .css("margin", 0)
              .end()
              .find(".tooltipster-arrow")
              .hide(),
            this.__options.minWidth &&
              b.css("min-width", this.__options.minWidth + "px"),
            this.__options.maxWidth &&
              b.css("max-width", this.__options.maxWidth + "px"),
            (this.__instance._$tooltip = b),
            this.__instance._trigger("created");
        },
        __destroy: function () {
          this.__instance._off("." + self.__namespace);
        },
        __optionsFormat: function () {
          var b = this;
          if (
            ((b.__options = b.__instance._optionsExtract(k, b.__defaults())),
            b.__options.position && (b.__options.side = b.__options.position),
            "object" != typeof b.__options.distance &&
              (b.__options.distance = [b.__options.distance]),
            b.__options.distance.length < 4 &&
              (void 0 === b.__options.distance[1] &&
                (b.__options.distance[1] = b.__options.distance[0]),
              void 0 === b.__options.distance[2] &&
                (b.__options.distance[2] = b.__options.distance[0]),
              void 0 === b.__options.distance[3] &&
                (b.__options.distance[3] = b.__options.distance[1]),
              (b.__options.distance = {
                top: b.__options.distance[0],
                right: b.__options.distance[1],
                bottom: b.__options.distance[2],
                left: b.__options.distance[3],
              })),
            "string" == typeof b.__options.side)
          ) {
            var c = {
              top: "bottom",
              right: "left",
              bottom: "top",
              left: "right",
            };
            (b.__options.side = [b.__options.side, c[b.__options.side]]),
              "left" == b.__options.side[0] || "right" == b.__options.side[0]
                ? b.__options.side.push("top", "bottom")
                : b.__options.side.push("right", "left");
          }
          6 === a.tooltipster._env.IE &&
            b.__options.arrow !== !0 &&
            (b.__options.arrow = !1);
        },
        __reposition: function (b, c) {
          var d,
            e = this,
            f = e.__targetFind(c),
            g = [];
          e.__instance._$tooltip.detach();
          var h = e.__instance._$tooltip.clone(),
            i = a.tooltipster._getRuler(h),
            j = !1,
            k = e.__instance.option("animation");
          switch (
            (k && h.removeClass("tooltipster-" + k),
            a.each(["window", "document"], function (d, k) {
              var l = null;
              if (
                (e.__instance._trigger({
                  container: k,
                  helper: c,
                  satisfied: j,
                  takeTest: function (a) {
                    l = a;
                  },
                  results: g,
                  type: "positionTest",
                }),
                1 == l ||
                  (0 != l &&
                    0 == j &&
                    ("window" != k || e.__options.viewportAware)))
              )
                for (var d = 0; d < e.__options.side.length; d++) {
                  var m = {
                      horizontal: 0,
                      vertical: 0,
                    },
                    n = e.__options.side[d];
                  "top" == n || "bottom" == n
                    ? (m.vertical = e.__options.distance[n])
                    : (m.horizontal = e.__options.distance[n]),
                    e.__sideChange(h, n),
                    a.each(["natural", "constrained"], function (a, d) {
                      if (
                        ((l = null),
                        e.__instance._trigger({
                          container: k,
                          event: b,
                          helper: c,
                          mode: d,
                          results: g,
                          satisfied: j,
                          side: n,
                          takeTest: function (a) {
                            l = a;
                          },
                          type: "positionTest",
                        }),
                        1 == l || (0 != l && 0 == j))
                      ) {
                        var h = {
                            container: k,
                            distance: m,
                            fits: null,
                            mode: d,
                            outerSize: null,
                            side: n,
                            size: null,
                            target: f[n],
                            whole: null,
                          },
                          o =
                            "natural" == d
                              ? i.free()
                              : i.constrain(
                                  c.geo.available[k][n].width - m.horizontal,
                                  c.geo.available[k][n].height - m.vertical
                                ),
                          p = o.measure();
                        if (
                          ((h.size = p.size),
                          (h.outerSize = {
                            height: p.size.height + m.vertical,
                            width: p.size.width + m.horizontal,
                          }),
                          "natural" == d
                            ? c.geo.available[k][n].width >=
                                h.outerSize.width &&
                              c.geo.available[k][n].height >= h.outerSize.height
                              ? (h.fits = !0)
                              : (h.fits = !1)
                            : (h.fits = p.fits),
                          "window" == k &&
                            (h.fits
                              ? "top" == n || "bottom" == n
                                ? (h.whole =
                                    c.geo.origin.windowOffset.right >=
                                      e.__options.minIntersection &&
                                    c.geo.window.size.width -
                                      c.geo.origin.windowOffset.left >=
                                      e.__options.minIntersection)
                                : (h.whole =
                                    c.geo.origin.windowOffset.bottom >=
                                      e.__options.minIntersection &&
                                    c.geo.window.size.height -
                                      c.geo.origin.windowOffset.top >=
                                      e.__options.minIntersection)
                              : (h.whole = !1)),
                          g.push(h),
                          h.whole)
                        )
                          j = !0;
                        else if (
                          "natural" == h.mode &&
                          (h.fits ||
                            h.size.width <= c.geo.available[k][n].width)
                        )
                          return !1;
                      }
                    });
                }
            }),
            e.__instance._trigger({
              edit: function (a) {
                g = a;
              },
              event: b,
              helper: c,
              results: g,
              type: "positionTested",
            }),
            g.sort(function (a, b) {
              if (a.whole && !b.whole) return -1;
              if (!a.whole && b.whole) return 1;
              if (a.whole && b.whole) {
                var c = e.__options.side.indexOf(a.side),
                  d = e.__options.side.indexOf(b.side);
                return d > c ? -1 : c > d ? 1 : "natural" == a.mode ? -1 : 1;
              }
              if (a.fits && !b.fits) return -1;
              if (!a.fits && b.fits) return 1;
              if (a.fits && b.fits) {
                var c = e.__options.side.indexOf(a.side),
                  d = e.__options.side.indexOf(b.side);
                return d > c ? -1 : c > d ? 1 : "natural" == a.mode ? -1 : 1;
              }
              return "document" == a.container &&
                "bottom" == a.side &&
                "natural" == a.mode
                ? -1
                : 1;
            }),
            (d = g[0]),
            (d.coord = {}),
            d.side)
          ) {
            case "left":
            case "right":
              d.coord.top = Math.floor(d.target - d.size.height / 2);
              break;
            case "bottom":
            case "top":
              d.coord.left = Math.floor(d.target - d.size.width / 2);
          }
          switch (d.side) {
            case "left":
              d.coord.left = c.geo.origin.windowOffset.left - d.outerSize.width;
              break;
            case "right":
              d.coord.left =
                c.geo.origin.windowOffset.right + d.distance.horizontal;
              break;
            case "top":
              d.coord.top = c.geo.origin.windowOffset.top - d.outerSize.height;
              break;
            case "bottom":
              d.coord.top =
                c.geo.origin.windowOffset.bottom + d.distance.vertical;
          }
          "window" == d.container
            ? "top" == d.side || "bottom" == d.side
              ? d.coord.left < 0
                ? c.geo.origin.windowOffset.right -
                    this.__options.minIntersection >=
                  0
                  ? (d.coord.left = 0)
                  : (d.coord.left =
                      c.geo.origin.windowOffset.right -
                      this.__options.minIntersection -
                      1)
                : d.coord.left > c.geo.window.size.width - d.size.width &&
                  (c.geo.origin.windowOffset.left +
                    this.__options.minIntersection <=
                  c.geo.window.size.width
                    ? (d.coord.left = c.geo.window.size.width - d.size.width)
                    : (d.coord.left =
                        c.geo.origin.windowOffset.left +
                        this.__options.minIntersection +
                        1 -
                        d.size.width))
              : d.coord.top < 0
              ? c.geo.origin.windowOffset.bottom -
                  this.__options.minIntersection >=
                0
                ? (d.coord.top = 0)
                : (d.coord.top =
                    c.geo.origin.windowOffset.bottom -
                    this.__options.minIntersection -
                    1)
              : d.coord.top > c.geo.window.size.height - d.size.height &&
                (c.geo.origin.windowOffset.top +
                  this.__options.minIntersection <=
                c.geo.window.size.height
                  ? (d.coord.top = c.geo.window.size.height - d.size.height)
                  : (d.coord.top =
                      c.geo.origin.windowOffset.top +
                      this.__options.minIntersection +
                      1 -
                      d.size.height))
            : (d.coord.left > c.geo.window.size.width - d.size.width &&
                (d.coord.left = c.geo.window.size.width - d.size.width),
              d.coord.left < 0 && (d.coord.left = 0)),
            e.__sideChange(h, d.side),
            (c.tooltipClone = h[0]),
            (c.tooltipParent = e.__instance.option("parent").parent[0]),
            (c.mode = d.mode),
            (c.whole = d.whole),
            (c.origin = e.__instance._$origin[0]),
            (c.tooltip = e.__instance._$tooltip[0]),
            delete d.container,
            delete d.fits,
            delete d.mode,
            delete d.outerSize,
            delete d.whole,
            (d.distance = d.distance.horizontal || d.distance.vertical);
          var l = a.extend(!0, {}, d);
          if (
            (e.__instance._trigger({
              edit: function (a) {
                d = a;
              },
              event: b,
              helper: c,
              position: l,
              type: "position",
            }),
            e.__options.functionPosition)
          ) {
            var m = e.__options.functionPosition.call(e, e.__instance, c, l);
            m && (d = m);
          }
          i.destroy();
          var n, o;
          "top" == d.side || "bottom" == d.side
            ? ((n = {
                prop: "left",
                val: d.target - d.coord.left,
              }),
              (o = d.size.width - this.__options.minIntersection))
            : ((n = {
                prop: "top",
                val: d.target - d.coord.top,
              }),
              (o = d.size.height - this.__options.minIntersection)),
            n.val < this.__options.minIntersection
              ? (n.val = this.__options.minIntersection)
              : n.val > o && (n.val = o);
          var p;
          (p = c.geo.origin.fixedLineage
            ? c.geo.origin.windowOffset
            : {
                left: c.geo.origin.windowOffset.left + c.geo.window.scroll.left,
                top: c.geo.origin.windowOffset.top + c.geo.window.scroll.top,
              }),
            (d.coord = {
              left: p.left + (d.coord.left - c.geo.origin.windowOffset.left),
              top: p.top + (d.coord.top - c.geo.origin.windowOffset.top),
            }),
            e.__sideChange(e.__instance._$tooltip, d.side),
            c.geo.origin.fixedLineage
              ? e.__instance._$tooltip.css("position", "fixed")
              : e.__instance._$tooltip.css("position", ""),
            e.__instance._$tooltip
              .css({
                left: d.coord.left,
                top: d.coord.top,
                height: d.size.height,
                width: d.size.width,
              })
              .find(".tooltipster-arrow")
              .css({
                left: "",
                top: "",
              })
              .css(n.prop, n.val),
            e.__instance._$tooltip.appendTo(e.__instance.option("parent")),
            e.__instance._trigger({
              type: "repositioned",
              event: b,
              position: d,
            });
        },
        __sideChange: function (a, b) {
          a.removeClass("tooltipster-bottom")
            .removeClass("tooltipster-left")
            .removeClass("tooltipster-right")
            .removeClass("tooltipster-top")
            .addClass("tooltipster-" + b);
        },
        __targetFind: function (a) {
          var b = {},
            c = this.__instance._$origin[0].getClientRects();
          if (c.length > 1) {
            var d = this.__instance._$origin.css("opacity");
            1 == d &&
              (this.__instance._$origin.css("opacity", 0.99),
              (c = this.__instance._$origin[0].getClientRects()),
              this.__instance._$origin.css("opacity", 1));
          }
          if (c.length < 2)
            (b.top = Math.floor(
              a.geo.origin.windowOffset.left + a.geo.origin.size.width / 2
            )),
              (b.bottom = b.top),
              (b.left = Math.floor(
                a.geo.origin.windowOffset.top + a.geo.origin.size.height / 2
              )),
              (b.right = b.left);
          else {
            var e = c[0];
            (b.top = Math.floor(e.left + (e.right - e.left) / 2)),
              (e = c.length > 2 ? c[Math.ceil(c.length / 2) - 1] : c[0]),
              (b.right = Math.floor(e.top + (e.bottom - e.top) / 2)),
              (e = c[c.length - 1]),
              (b.bottom = Math.floor(e.left + (e.right - e.left) / 2)),
              (e =
                c.length > 2
                  ? c[Math.ceil((c.length + 1) / 2) - 1]
                  : c[c.length - 1]),
              (b.left = Math.floor(e.top + (e.bottom - e.top) / 2));
          }
          return b;
        },
      },
    }),
    a
  );
});

/**
 * jQuery.marquee - scrolling text like old marquee element
 * @author Aamir Afridi - aamirafridi(at)gmail(dot)com / http://aamirafridi.com/jquery/jquery-marquee-plugin
 */
(function (f) {
  f.fn.marquee = function (x) {
    return this.each(function () {
      var a = f.extend({}, f.fn.marquee.defaults, x),
        b = f(this),
        c,
        t,
        e = 3,
        y = "animation-play-state",
        p = !1,
        E = function (a, b, c) {
          for (
            var e = ["webkit", "moz", "MS", "o", ""], d = 0;
            d < e.length;
            d++
          )
            e[d] || (b = b.toLowerCase()), a.addEventListener(e[d] + b, c, !1);
        },
        F = function (a) {
          var b = [],
            c;
          for (c in a) a.hasOwnProperty(c) && b.push(c + ":" + a[c]);
          b.push();
          return "{" + b.join(",") + "}";
        },
        l = {
          pause: function () {
            p && a.allowCss3Support
              ? c.css(y, "paused")
              : f.fn.pause && c.pause();
            b.data("runningStatus", "paused");
            b.trigger("paused");
          },
          resume: function () {
            p && a.allowCss3Support
              ? c.css(y, "running")
              : f.fn.resume && c.resume();
            b.data("runningStatus", "resumed");
            b.trigger("resumed");
          },
          toggle: function () {
            l["resumed" == b.data("runningStatus") ? "pause" : "resume"]();
          },
          destroy: function () {
            clearTimeout(b.timer);
            b.find("*").addBack().unbind();
            b.html(b.find(".js-marquee:first").html());
          },
        };
      if ("string" === typeof x)
        f.isFunction(l[x]) &&
          (c || (c = b.find(".js-marquee-wrapper")),
          !0 === b.data("css3AnimationIsSupported") && (p = !0),
          l[x]());
      else {
        var u;
        f.each(a, function (c, d) {
          u = b.attr("data-" + c);
          if ("undefined" !== typeof u) {
            switch (u) {
              case "true":
                u = !0;
                break;
              case "false":
                u = !1;
            }
            a[c] = u;
          }
        });
        a.speed && (a.duration = (parseInt(b.width(), 10) / a.speed) * 1e3);
        var v = "up" == a.direction || "down" == a.direction;
        a.gap = a.duplicated ? parseInt(a.gap) : 0;
        b.wrapInner('<div class="js-marquee"></div>');
        var h = b.find(".js-marquee").css({
          "margin-right": a.gap,
          float: "left",
        });
        a.duplicated && h.clone(!0).appendTo(b);
        b.wrapInner(
          '<div style="width:100000px" class="js-marquee-wrapper"></div>'
        );
        c = b.find(".js-marquee-wrapper");
        if (v) {
          var k = b.height();
          c.removeAttr("style");
          b.height(k);
          b.find(".js-marquee").css({
            float: "none",
            "margin-bottom": a.gap,
            "margin-right": 0,
          });
          a.duplicated &&
            b.find(".js-marquee:last").css({
              "margin-bottom": 0,
            });
          var q = b.find(".js-marquee:first").height() + a.gap;
          a.startVisible && !a.duplicated
            ? ((a._completeDuration =
                ((parseInt(q, 10) + parseInt(k, 10)) / parseInt(k, 10)) *
                a.duration),
              (a.duration *= parseInt(q, 10) / parseInt(k, 10)))
            : (a.duration *=
                (parseInt(q, 10) + parseInt(k, 10)) / parseInt(k, 10));
        } else {
          var m = b.find(".js-marquee:first").width() + a.gap;
          var n = b.width();
          a.startVisible && !a.duplicated
            ? ((a._completeDuration =
                ((parseInt(m, 10) + parseInt(n, 10)) / parseInt(n, 10)) *
                a.duration),
              (a.duration *= parseInt(m, 10) / parseInt(n, 10)))
            : (a.duration *=
                (parseInt(m, 10) + parseInt(n, 10)) / parseInt(n, 10));
        }
        a.duplicated && (a.duration /= 2);
        if (a.allowCss3Support) {
          h = document.body || document.createElement("div");
          var g = "marqueeAnimation-" + Math.floor(1e7 * Math.random()),
            A = ["Webkit", "Moz", "O", "ms", "Khtml"],
            B = "animation",
            d = "",
            r = "";
          h.style.animation && ((r = "@keyframes " + g + " "), (p = !0));
          if (!1 === p)
            for (var z = 0; z < A.length; z++)
              if (void 0 !== h.style[A[z] + "AnimationName"]) {
                h = "-" + A[z].toLowerCase() + "-";
                B = h + B;
                y = h + y;
                r = "@" + h + "keyframes " + g + " ";
                p = !0;
                break;
              }
          p &&
            ((d =
              g +
              " " +
              a.duration / 1e3 +
              "s " +
              a.delayBeforeStart / 1e3 +
              "s infinite " +
              a.css3easing),
            b.data("css3AnimationIsSupported", !0));
        }
        var C = function () {
            c.css(
              "transform",
              "translateY(" +
                ("up" == a.direction ? k + "px" : "-" + q + "px") +
                ")"
            );
          },
          D = function () {
            c.css(
              "transform",
              "translateX(" +
                ("left" == a.direction ? n + "px" : "-" + m + "px") +
                ")"
            );
          };
        a.duplicated
          ? (v
              ? a.startVisible
                ? c.css("transform", "translateY(0)")
                : c.css(
                    "transform",
                    "translateY(" +
                      ("up" == a.direction
                        ? k + "px"
                        : "-" + (2 * q - a.gap) + "px") +
                      ")"
                  )
              : a.startVisible
              ? c.css("transform", "translateX(0)")
              : c.css(
                  "transform",
                  "translateX(" +
                    ("left" == a.direction
                      ? n + "px"
                      : "-" + (2 * m - a.gap) + "px") +
                    ")"
                ),
            a.startVisible || (e = 1))
          : a.startVisible
          ? (e = 2)
          : v
          ? C()
          : D();
        var w = function () {
          a.duplicated &&
            (1 === e
              ? ((a._originalDuration = a.duration),
                (a.duration = v
                  ? "up" == a.direction
                    ? a.duration + k / (q / a.duration)
                    : 2 * a.duration
                  : "left" == a.direction
                  ? a.duration + n / (m / a.duration)
                  : 2 * a.duration),
                d &&
                  (d =
                    g +
                    " " +
                    a.duration / 1e3 +
                    "s " +
                    a.delayBeforeStart / 1e3 +
                    "s " +
                    a.css3easing),
                e++)
              : 2 === e &&
                ((a.duration = a._originalDuration),
                d &&
                  ((g += "0"),
                  (r = f.trim(r) + "0 "),
                  (d =
                    g +
                    " " +
                    a.duration / 1e3 +
                    "s 0s infinite " +
                    a.css3easing)),
                e++));
          v
            ? a.duplicated
              ? (2 < e &&
                  c.css(
                    "transform",
                    "translateY(" +
                      ("up" == a.direction ? 0 : "-" + q + "px") +
                      ")"
                  ),
                (t = {
                  transform:
                    "translateY(" +
                    ("up" == a.direction ? "-" + q + "px" : 0) +
                    ")",
                }))
              : a.startVisible
              ? 2 === e
                ? (d &&
                    (d =
                      g +
                      " " +
                      a.duration / 1e3 +
                      "s " +
                      a.delayBeforeStart / 1e3 +
                      "s " +
                      a.css3easing),
                  (t = {
                    transform:
                      "translateY(" +
                      ("up" == a.direction ? "-" + q + "px" : k + "px") +
                      ")",
                  }),
                  e++)
                : 3 === e &&
                  ((a.duration = a._completeDuration),
                  d &&
                    ((g += "0"),
                    (r = f.trim(r) + "0 "),
                    (d =
                      g +
                      " " +
                      a.duration / 1e3 +
                      "s 0s infinite " +
                      a.css3easing)),
                  C())
              : (C(),
                (t = {
                  transform:
                    "translateY(" +
                    ("up" == a.direction ? "-" + c.height() + "px" : k + "px") +
                    ")",
                }))
            : a.duplicated
            ? (2 < e &&
                c.css(
                  "transform",
                  "translateX(" +
                    ("left" == a.direction ? 0 : "-" + m + "px") +
                    ")"
                ),
              (t = {
                transform:
                  "translateX(" +
                  ("left" == a.direction ? "-" + m + "px" : 0) +
                  ")",
              }))
            : a.startVisible
            ? 2 === e
              ? (d &&
                  (d =
                    g +
                    " " +
                    a.duration / 1e3 +
                    "s " +
                    a.delayBeforeStart / 1e3 +
                    "s " +
                    a.css3easing),
                (t = {
                  transform:
                    "translateX(" +
                    ("left" == a.direction ? "-" + m + "px" : n + "px") +
                    ")",
                }),
                e++)
              : 3 === e &&
                ((a.duration = a._completeDuration),
                d &&
                  ((g += "0"),
                  (r = f.trim(r) + "0 "),
                  (d =
                    g +
                    " " +
                    a.duration / 1e3 +
                    "s 0s infinite " +
                    a.css3easing)),
                D())
            : (D(),
              (t = {
                transform:
                  "translateX(" +
                  ("left" == a.direction ? "-" + m + "px" : n + "px") +
                  ")",
              }));
          b.trigger("beforeStarting");
          if (p) {
            c.css(B, d);
            var h = r + " { 100%  " + F(t) + "}",
              l = c.find("style");
            0 !== l.length
              ? l.filter(":last").html(h)
              : f("head").append("<style>" + h + "</style>");
            E(c[0], "AnimationIteration", function () {
              b.trigger("finished");
            });
            E(c[0], "AnimationEnd", function () {
              w();
              b.trigger("finished");
            });
          } else
            c.animate(t, a.duration, a.easing, function () {
              b.trigger("finished");
              a.pauseOnCycle
                ? (b.timer = setTimeout(w, a.delayBeforeStart))
                : w();
            });
          b.data("runningStatus", "resumed");
        };
        b.bind("pause", l.pause);
        b.bind("resume", l.resume);
        a.pauseOnHover &&
          (b.bind("mouseenter", l.pause), b.bind("mouseleave", l.resume));
        p && a.allowCss3Support
          ? w()
          : (b.timer = setTimeout(w, a.delayBeforeStart));
      }
    });
  };
  f.fn.marquee.defaults = {
    allowCss3Support: !0,
    css3easing: "linear",
    easing: "linear",
    delayBeforeStart: 1e3,
    direction: "left",
    duplicated: !1,
    duration: 5e3,
    gap: 20,
    pauseOnCycle: !1,
    pauseOnHover: !1,
    startVisible: !1,
  };
})(jQuery);
