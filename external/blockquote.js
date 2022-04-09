! function (t, e) {
  "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.BlockQuote = e() : t.BlockQuote = e()
}(window, (function () {
  return function (t) {
    var e = {};

    function n(r) {
      if (e[r]) return e[r].exports;
      var o = e[r] = {
        i: r,
        l: !1,
        exports: {}
      };
      return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    return n.m = t, n.c = e, n.d = function (t, e, r) {
      n.o(t, e) || Object.defineProperty(t, e, {
        enumerable: !0,
        get: r
      })
    }, n.r = function (t) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(t, "__esModule", {
        value: !0
      })
    }, n.t = function (t, e) {
      if (1 & e && (t = n(t)), 8 & e) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var r = Object.create(null);
      if (n.r(r), Object.defineProperty(r, "default", {
          enumerable: !0,
          value: t
        }), 2 & e && "string" != typeof t)
        for (var o in t) n.d(r, o, function (e) {
          return t[e]
        }.bind(null, o));
      return r
    }, n.n = function (t) {
      var e = t && t.__esModule ? function () {
        return t.default
      } : function () {
        return t
      };
      return n.d(e, "a", e), e
    }, n.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e)
    }, n.p = "/", n(n.s = 1)
  }([function (t, e) {
    t.exports = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="18px" viewBox="0 0 475.082 475.081" xml:space="preserve"><g><g><path d="M164.45,219.27h-63.954c-7.614,0-14.087-2.664-19.417-7.994c-5.327-5.33-7.994-11.801-7.994-19.417v-9.132 c0-20.177,7.139-37.401,21.416-51.678c14.276-14.272,31.503-21.411,51.678-21.411h18.271c4.948,0,9.229-1.809,12.847-5.424 c3.616-3.617,5.424-7.898,5.424-12.847V54.819c0-4.948-1.809-9.233-5.424-12.85c-3.617-3.612-7.898-5.424-12.847-5.424h-18.271 c-19.797,0-38.684,3.858-56.673,11.563c-17.987,7.71-33.545,18.132-46.68,31.267c-13.134,13.129-23.553,28.688-31.262,46.677 C3.855,144.039,0,162.931,0,182.726v200.991c0,15.235,5.327,28.171,15.986,38.834c10.66,10.657,23.606,15.985,38.832,15.985 h109.639c15.225,0,28.167-5.328,38.828-15.985c10.657-10.663,15.987-23.599,15.987-38.834V274.088 c0-15.232-5.33-28.168-15.994-38.832C192.622,224.6,179.675,219.27,164.45,219.27z"></path><path d="M459.103,235.256c-10.656-10.656-23.599-15.986-38.828-15.986h-63.953c-7.61,0-14.089-2.664-19.41-7.994 c-5.332-5.33-7.994-11.801-7.994-19.417v-9.132c0-20.177,7.139-37.401,21.409-51.678c14.271-14.272,31.497-21.411,51.682-21.411 h18.267c4.949,0,9.233-1.809,12.848-5.424c3.613-3.617,5.428-7.898,5.428-12.847V54.819c0-4.948-1.814-9.233-5.428-12.85 c-3.614-3.612-7.898-5.424-12.848-5.424h-18.267c-19.808,0-38.691,3.858-56.685,11.563c-17.984,7.71-33.537,18.132-46.672,31.267 c-13.135,13.129-23.559,28.688-31.265,46.677c-7.707,17.987-11.567,36.879-11.567,56.674v200.991 c0,15.235,5.332,28.171,15.988,38.834c10.657,10.657,23.6,15.985,38.828,15.985h109.633c15.229,0,28.171-5.328,38.827-15.985 c10.664-10.663,15.985-23.599,15.985-38.834V274.088C475.082,258.855,469.76,245.92,459.103,235.256z"></path></g></g></svg>'
  }, function (t, e, n) {
    "use strict";
    n.r(e), n.d(e, "default", (function () {
      return u
    }));
    var r = n(0),
      o = n.n(r);
    n(2);

    function a(t) {
      return function (t) {
        if (Array.isArray(t)) {
          for (var e = 0, n = new Array(t.length); e < t.length; e++) n[e] = t[e];
          return n
        }
      }(t) || function (t) {
        if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) return Array.from(t)
      }(t) || function () {
        throw new TypeError("Invalid attempt to spread non-iterable instance")
      }()
    }

    function i(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
      }
    }

    function c(t, e, n) {
      return e && i(t.prototype, e), n && i(t, n), t
    }
    /**
     * Image Tool for the Editor.js
     * @author Prashant Singh <prashantco111@gmail.com>
     * @license MIT
     * @see {@link https://github.com/prashant1k99/blockquote}
     *
     * To developers.
     * To simplify Tool structure, I split it in 3 parts:
     * 1) index.js - It contins main code which goes to EditorJs
     * 2) svg/ - It is the Folder which contins svg icons for the EditorJs
     * 3) index.css - The Styling for the Plugin is in this css file
     *
     * Tools config:
     *
     * blockquote: {
     *   class: BlockQuote,
     *   config: {
     *     placeholder: "Your Placeholder here",
     *   },
     * },
     */
    var u = function () {
        function t(e) {
          var n = e.data,
            r = e.config,
            o = e.api;
          ! function (t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
          }(this, t), this.api = o, this.config = {
            placeholder: r.placeholder || "Let' write something good..."
          }, this.data = {
            value: n.value || ""
          }, this.wrapper = void 0
        }
        return c(t, null, [{
          key: "toolbox",
          get: function () {
            return {
              icon: o.a,
              title: "BlockQuote"
            }
          }
        }]), c(t, [{
          key: "render",
          value: function () {
            var t = l("textarea", "textarea-content", {
                placeholder: this.config.placeholder,
                value: 0 !== Object.keys(this.data).length ? this.data.value : null
              }),
              e = l("div", "blockquote");
            return e.appendChild(t), this.value, t.oninput = function () {
              t.style.height = "auto", t.style.height = t.scrollHeight + "px"
            }, e
          }
        }, {
          key: "save",
          value: function (t) {
            var e = t.querySelector(".textarea-content");
            return Object.assign(this.data, {
              value: e.value
            })
          }
        }, {
          key: "validate",
          value: function (t) {
            return !!t.value.trim()
          }
        }]), t
      }(),
      l = function (t) {
        var e, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
          r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
          o = document.createElement(t);
        Array.isArray(n) ? (e = o.classList).add.apply(e, a(n)) : n && o.classList.add(n);
        for (var i in r) o[i] = r[i];
        return o
      }
  }, function (t, e, n) {
    var r = n(3);
    "string" == typeof r && (r = [
      [t.i, r, ""]
    ]);
    var o = {
      insert: "head",
      singleton: !1
    };
    n(5)(r, o);
    r.locals && (t.exports = r.locals)
  }, function (t, e, n) {
    (t.exports = n(4)(!1)).push([t.i, '.blockquote::before,\r\n\t.blockquote::after {\r\n\t\tposition: absolute;\r\n\t\tcolor: #f1efe6;\r\n\t\tfont-size: 8rem;\r\n\t\twidth: 4rem;\r\n\t\theight: 4rem;\r\n\t}\r\n\t.blockquote::before {\r\n\t\tcontent: "“";\r\n\t\tleft: -5rem;\r\n\t\ttop: -2rem;\r\n\t}\r\n\t.blockquote::after {\r\n\t\tcontent: "”";\r\n\t\tright: -5rem;\r\n\t\tbottom: 1rem;\r\n\t}\r\n\t.blockquote .textarea-content {\r\n\t\tpadding: 10px;\r\n\t\tmargin: 10px auto 0 auto;\r\n\t\tresize: none;\r\n\t\toverflow: hidden;\r\n\t\tfont-weight: 700;\r\n\t\tfont-size: 30px;\r\n\t\twidth: 100%;\r\n\t\tborder: 0;\r\n\t\toutline: none;\r\n\t}\r\n', ""])
  }, function (t, e, n) {
    "use strict";
    t.exports = function (t) {
      var e = [];
      return e.toString = function () {
        return this.map((function (e) {
          var n = function (t, e) {
            var n = t[1] || "",
              r = t[3];
            if (!r) return n;
            if (e && "function" == typeof btoa) {
              var o = (i = r, c = btoa(unescape(encodeURIComponent(JSON.stringify(i)))), u = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(c), "/*# ".concat(u, " */")),
                a = r.sources.map((function (t) {
                  return "/*# sourceURL=".concat(r.sourceRoot).concat(t, " */")
                }));
              return [n].concat(a).concat([o]).join("\n")
            }
            var i, c, u;
            return [n].join("\n")
          }(e, t);
          return e[2] ? "@media ".concat(e[2], "{").concat(n, "}") : n
        })).join("")
      }, e.i = function (t, n) {
        "string" == typeof t && (t = [
          [null, t, ""]
        ]);
        for (var r = {}, o = 0; o < this.length; o++) {
          var a = this[o][0];
          null != a && (r[a] = !0)
        }
        for (var i = 0; i < t.length; i++) {
          var c = t[i];
          null != c[0] && r[c[0]] || (n && !c[2] ? c[2] = n : n && (c[2] = "(".concat(c[2], ") and (").concat(n, ")")), e.push(c))
        }
      }, e
    }
  }, function (t, e, n) {
    "use strict";
    var r, o = {},
      a = function () {
        return void 0 === r && (r = Boolean(window && document && document.all && !window.atob)), r
      },
      i = function () {
        var t = {};
        return function (e) {
          if (void 0 === t[e]) {
            var n = document.querySelector(e);
            if (window.HTMLIFrameElement && n instanceof window.HTMLIFrameElement) try {
              n = n.contentDocument.head
            } catch (t) {
              n = null
            }
            t[e] = n
          }
          return t[e]
        }
      }();

    function c(t, e) {
      for (var n = [], r = {}, o = 0; o < t.length; o++) {
        var a = t[o],
          i = e.base ? a[0] + e.base : a[0],
          c = {
            css: a[1],
            media: a[2],
            sourceMap: a[3]
          };
        r[i] ? r[i].parts.push(c) : n.push(r[i] = {
          id: i,
          parts: [c]
        })
      }
      return n
    }

    function u(t, e) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n],
          a = o[r.id],
          i = 0;
        if (a) {
          for (a.refs++; i < a.parts.length; i++) a.parts[i](r.parts[i]);
          for (; i < r.parts.length; i++) a.parts.push(b(r.parts[i], e))
        } else {
          for (var c = []; i < r.parts.length; i++) c.push(b(r.parts[i], e));
          o[r.id] = {
            id: r.id,
            refs: 1,
            parts: c
          }
        }
      }
    }

    function l(t) {
      var e = document.createElement("style");
      if (void 0 === t.attributes.nonce) {
        var r = n.nc;
        r && (t.attributes.nonce = r)
      }
      if (Object.keys(t.attributes).forEach((function (n) {
          e.setAttribute(n, t.attributes[n])
        })), "function" == typeof t.insert) t.insert(e);
      else {
        var o = i(t.insert || "head");
        if (!o) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
        o.appendChild(e)
      }
      return e
    }
    var s, f = (s = [], function (t, e) {
      return s[t] = e, s.filter(Boolean).join("\n")
    });

    function p(t, e, n, r) {
      var o = n ? "" : r.css;
      if (t.styleSheet) t.styleSheet.cssText = f(e, o);
      else {
        var a = document.createTextNode(o),
          i = t.childNodes;
        i[e] && t.removeChild(i[e]), i.length ? t.insertBefore(a, i[e]) : t.appendChild(a)
      }
    }

    function d(t, e, n) {
      var r = n.css,
        o = n.media,
        a = n.sourceMap;
      if (o && t.setAttribute("media", o), a && btoa && (r += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a)))), " */")), t.styleSheet) t.styleSheet.cssText = r;
      else {
        for (; t.firstChild;) t.removeChild(t.firstChild);
        t.appendChild(document.createTextNode(r))
      }
    }
    var h = null,
      v = 0;

    function b(t, e) {
      var n, r, o;
      if (e.singleton) {
        var a = v++;
        n = h || (h = l(e)), r = p.bind(null, n, a, !1), o = p.bind(null, n, a, !0)
      } else n = l(e), r = d.bind(null, n, e), o = function () {
        ! function (t) {
          if (null === t.parentNode) return !1;
          t.parentNode.removeChild(t)
        }(n)
      };
      return r(t),
        function (e) {
          if (e) {
            if (e.css === t.css && e.media === t.media && e.sourceMap === t.sourceMap) return;
            r(t = e)
          } else o()
        }
    }
    t.exports = function (t, e) {
      (e = e || {}).attributes = "object" == typeof e.attributes ? e.attributes : {}, e.singleton || "boolean" == typeof e.singleton || (e.singleton = a());
      var n = c(t, e);
      return u(n, e),
        function (t) {
          for (var r = [], a = 0; a < n.length; a++) {
            var i = n[a],
              l = o[i.id];
            l && (l.refs--, r.push(l))
          }
          t && u(c(t, e), e);
          for (var s = 0; s < r.length; s++) {
            var f = r[s];
            if (0 === f.refs) {
              for (var p = 0; p < f.parts.length; p++) f.parts[p]();
              delete o[f.id]
            }
          }
        }
    }
  }]).default
}));