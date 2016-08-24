! function(e, t) {
    "function" == typeof define && define.amd ? define(t) : "object" == typeof exports ? module.exports = t() : e.ScrollMagic = t()
}(this, function() {
    "use strict";
    var e = function() {};
    e.version = "2.0.5", window.addEventListener("mousewheel", function() {});
    var t = "data-scrollmagic-pin-spacer";
    e.Controller = function(r) {
        var o, s, a = "ScrollMagic.Controller",
            l = "FORWARD",
            c = "REVERSE",
            u = "PAUSED",
            f = n.defaults,
            d = this,
            h = i.extend({}, f, r),
            g = [],
            p = !1,
            v = 0,
            m = u,
            w = !0,
            y = 0,
            S = !0,
            b = function() {
                for (var e in h) f.hasOwnProperty(e) || delete h[e];
                if (h.container = i.get.elements(h.container)[0], !h.container) throw a + " init failed.";
                w = h.container === window || h.container === document.body || !document.body.contains(h.container), w && (h.container = window), y = z(), h.container.addEventListener("resize", T), h.container.addEventListener("scroll", T), h.refreshInterval = parseInt(h.refreshInterval) || f.refreshInterval, E()
            },
            E = function() {
                h.refreshInterval > 0 && (s = window.setTimeout(A, h.refreshInterval))
            },
            x = function() {
                return h.vertical ? i.get.scrollTop(h.container) : i.get.scrollLeft(h.container)
            },
            z = function() {
                return h.vertical ? i.get.height(h.container) : i.get.width(h.container)
            },
            C = this._setScrollPos = function(e) {
                h.vertical ? w ? window.scrollTo(i.get.scrollLeft(), e) : h.container.scrollTop = e : w ? window.scrollTo(e, i.get.scrollTop()) : h.container.scrollLeft = e
            },
            F = function() {
                if (S && p) {
                    var e = i.type.Array(p) ? p : g.slice(0);
                    p = !1;
                    var t = v;
                    v = d.scrollPos();
                    var n = v - t;
                    0 !== n && (m = n > 0 ? l : c), m === c && e.reverse(), e.forEach(function(e) {
                        e.update(!0)
                    })
                }
            },
            L = function() {
                o = i.rAF(F)
            },
            T = function(e) {
                "resize" == e.type && (y = z(), m = u), p !== !0 && (p = !0, L())
            },
            A = function() {
                if (!w && y != z()) {
                    var e;
                    try {
                        e = new Event("resize", {
                            bubbles: !1,
                            cancelable: !1
                        })
                    } catch (t) {
                        e = document.createEvent("Event"), e.initEvent("resize", !1, !1)
                    }
                    h.container.dispatchEvent(e)
                }
                g.forEach(function(e) {
                    e.refresh()
                }), E()
            };
        this._options = h;
        var O = function(e) {
            if (e.length <= 1) return e;
            var t = e.slice(0);
            return t.sort(function(e, t) {
                return e.scrollOffset() > t.scrollOffset() ? 1 : -1
            }), t
        };
        return this.addScene = function(t) {
            if (i.type.Array(t)) t.forEach(function(e) {
                d.addScene(e)
            });
            else if (t instanceof e.Scene)
                if (t.controller() !== d) t.addTo(d);
                else if (g.indexOf(t) < 0) {
                g.push(t), g = O(g), t.on("shift.controller_sort", function() {
                    g = O(g)
                });
                for (var n in h.globalSceneOptions) t[n] && t[n].call(t, h.globalSceneOptions[n])
            }
            return d
        }, this.removeScene = function(e) {
            if (i.type.Array(e)) e.forEach(function(e) {
                d.removeScene(e)
            });
            else {
                var t = g.indexOf(e);
                t > -1 && (e.off("shift.controller_sort"), g.splice(t, 1), e.remove())
            }
            return d
        }, this.updateScene = function(t, n) {
            return i.type.Array(t) ? t.forEach(function(e) {
                d.updateScene(e, n)
            }) : n ? t.update(!0) : p !== !0 && t instanceof e.Scene && (p = p || [], -1 == p.indexOf(t) && p.push(t), p = O(p), L()), d
        }, this.update = function(e) {
            return T({
                type: "resize"
            }), e && F(), d
        }, this.scrollTo = function(n, r) {
            if (i.type.Number(n)) C.call(h.container, n, r);
            else if (n instanceof e.Scene) n.controller() === d && d.scrollTo(n.scrollOffset(), r);
            else if (i.type.Function(n)) C = n;
            else {
                var o = i.get.elements(n)[0];
                if (o) {
                    for (; o.parentNode.hasAttribute(t);) o = o.parentNode;
                    var s = h.vertical ? "top" : "left",
                        a = i.get.offset(h.container),
                        l = i.get.offset(o);
                    w || (a[s] -= d.scrollPos()), d.scrollTo(l[s] - a[s], r)
                }
            }
            return d
        }, this.scrollPos = function(e) {
            return arguments.length ? (i.type.Function(e) && (x = e), d) : x.call(d)
        }, this.info = function(e) {
            var t = {
                size: y,
                vertical: h.vertical,
                scrollPos: v,
                scrollDirection: m,
                container: h.container,
                isDocument: w
            };
            return arguments.length ? void 0 !== t[e] ? t[e] : void 0 : t
        }, this.loglevel = function() {
            return d
        }, this.enabled = function(e) {
            return arguments.length ? (S != e && (S = !!e, d.updateScene(g, !0)), d) : S
        }, this.destroy = function(e) {
            window.clearTimeout(s);
            for (var t = g.length; t--;) g[t].destroy(e);
            return h.container.removeEventListener("resize", T), h.container.removeEventListener("scroll", T), i.cAF(o), null
        }, b(), d
    };
    var n = {
        defaults: {
            container: window,
            vertical: !0,
            globalSceneOptions: {},
            loglevel: 2,
            refreshInterval: 100
        }
    };
    e.Controller.addOption = function(e, t) {
        n.defaults[e] = t
    }, e.Controller.extend = function(t) {
        var n = this;
        e.Controller = function() {
            return n.apply(this, arguments), this.$super = i.extend({}, this), t.apply(this, arguments) || this
        }, i.extend(e.Controller, n), e.Controller.prototype = n.prototype, e.Controller.prototype.constructor = e.Controller
    }, e.Scene = function(n) {
        var o, s, a = "BEFORE",
            l = "DURING",
            c = "AFTER",
            u = r.defaults,
            f = this,
            d = i.extend({}, u, n),
            h = a,
            g = 0,
            p = {
                start: 0,
                end: 0
            },
            v = 0,
            m = !0,
            w = function() {
                for (var e in d) u.hasOwnProperty(e) || delete d[e];
                for (var t in u) L(t);
                C()
            },
            y = {};
        this.on = function(e, t) {
            return i.type.Function(t) && (e = e.trim().split(" "), e.forEach(function(e) {
                var n = e.split("."),
                    r = n[0],
                    i = n[1];
                "*" != r && (y[r] || (y[r] = []), y[r].push({
                    namespace: i || "",
                    callback: t
                }))
            })), f
        }, this.off = function(e, t) {
            return e ? (e = e.trim().split(" "), e.forEach(function(e) {
                var n = e.split("."),
                    r = n[0],
                    i = n[1] || "",
                    o = "*" === r ? Object.keys(y) : [r];
                o.forEach(function(e) {
                    for (var n = y[e] || [], r = n.length; r--;) {
                        var o = n[r];
                        !o || i !== o.namespace && "*" !== i || t && t != o.callback || n.splice(r, 1)
                    }
                    n.length || delete y[e]
                })
            }), f) : f
        }, this.trigger = function(t, n) {
            if (t) {
                var r = t.trim().split("."),
                    i = r[0],
                    o = r[1],
                    s = y[i];
                s && s.forEach(function(t) {
                    o && o !== t.namespace || t.callback.call(f, new e.Event(i, t.namespace, f, n))
                })
            }
            return f
        }, f.on("change.internal", function(e) {
            "loglevel" !== e.what && "tweenChanges" !== e.what && ("triggerElement" === e.what ? E() : "reverse" === e.what && f.update())
        }).on("shift.internal", function() {
            S(), f.update()
        }), this.addTo = function(t) {
            return t instanceof e.Controller && s != t && (s && s.removeScene(f), s = t, C(), b(!0), E(!0), S(), s.info("container").addEventListener("resize", x), t.addScene(f), f.trigger("add", {
                controller: s
            }), f.update()), f
        }, this.enabled = function(e) {
            return arguments.length ? (m != e && (m = !!e, f.update(!0)), f) : m
        }, this.remove = function() {
            if (s) {
                s.info("container").removeEventListener("resize", x);
                var e = s;
                s = void 0, e.removeScene(f), f.trigger("remove")
            }
            return f
        }, this.destroy = function(e) {
            return f.trigger("destroy", {
                reset: e
            }), f.remove(), f.off("*.*"), null
        }, this.update = function(e) {
            if (s)
                if (e)
                    if (s.enabled() && m) {
                        var t, n = s.info("scrollPos");
                        t = d.duration > 0 ? (n - p.start) / (p.end - p.start) : n >= p.start ? 1 : 0, f.trigger("update", {
                            startPos: p.start,
                            endPos: p.end,
                            scrollPos: n
                        }), f.progress(t)
                    } else T && h === l && O(!0);
            else s.updateScene(f, !1);
            return f
        }, this.refresh = function() {
            return b(), E(), f
        }, this.progress = function(e) {
            if (arguments.length) {
                var t = !1,
                    n = h,
                    r = s ? s.info("scrollDirection") : "PAUSED",
                    i = d.reverse || e >= g;
                if (0 === d.duration ? (t = g != e, g = 1 > e && i ? 0 : 1, h = 0 === g ? a : l) : 0 > e && h !== a && i ? (g = 0, h = a, t = !0) : e >= 0 && 1 > e && i ? (g = e, h = l, t = !0) : e >= 1 && h !== c ? (g = 1, h = c, t = !0) : h !== l || i || O(), t) {
                    var o = {
                            progress: g,
                            state: h,
                            scrollDirection: r
                        },
                        u = h != n,
                        p = function(e) {
                            f.trigger(e, o)
                        };
                    u && n !== l && (p("enter"), p(n === a ? "start" : "end")), p("progress"), u && h !== l && (p(h === a ? "start" : "end"), p("leave"))
                }
                return f
            }
            return g
        };
        var S = function() {
                p = {
                    start: v + d.offset
                }, s && d.triggerElement && (p.start -= s.info("size") * d.triggerHook), p.end = p.start + d.duration
            },
            b = function(e) {
                if (o) {
                    var t = "duration";
                    F(t, o.call(f)) && !e && (f.trigger("change", {
                        what: t,
                        newval: d[t]
                    }), f.trigger("shift", {
                        reason: t
                    }))
                }
            },
            E = function(e) {
                var n = 0,
                    r = d.triggerElement;
                if (s && r) {
                    for (var o = s.info(), a = i.get.offset(o.container), l = o.vertical ? "top" : "left"; r.parentNode.hasAttribute(t);) r = r.parentNode;
                    var c = i.get.offset(r);
                    o.isDocument || (a[l] -= s.scrollPos()), n = c[l] - a[l]
                }
                var u = n != v;
                v = n, u && !e && f.trigger("shift", {
                    reason: "triggerElementPosition"
                })
            },
            x = function() {
                d.triggerHook > 0 && f.trigger("shift", {
                    reason: "containerResize"
                })
            },
            z = i.extend(r.validate, {
                duration: function(e) {
                    if (i.type.String(e) && e.match(/^(\.|\d)*\d+%$/)) {
                        var t = parseFloat(e) / 100;
                        e = function() {
                            return s ? s.info("size") * t : 0
                        }
                    }
                    if (i.type.Function(e)) {
                        o = e;
                        try {
                            e = parseFloat(o())
                        } catch (n) {
                            e = -1
                        }
                    }
                    if (e = parseFloat(e), !i.type.Number(e) || 0 > e) throw o ? (o = void 0, 0) : 0;
                    return e
                }
            }),
            C = function(e) {
                e = arguments.length ? [e] : Object.keys(z), e.forEach(function(e) {
                    var t;
                    if (z[e]) try {
                        t = z[e](d[e])
                    } catch (n) {
                        t = u[e]
                    } finally {
                        d[e] = t
                    }
                })
            },
            F = function(e, t) {
                var n = !1,
                    r = d[e];
                return d[e] != t && (d[e] = t, C(e), n = r != d[e]), n
            },
            L = function(e) {
                f[e] || (f[e] = function(t) {
                    return arguments.length ? ("duration" === e && (o = void 0), F(e, t) && (f.trigger("change", {
                        what: e,
                        newval: d[e]
                    }), r.shifts.indexOf(e) > -1 && f.trigger("shift", {
                        reason: e
                    })), f) : d[e]
                })
            };
        this.controller = function() {
            return s
        }, this.state = function() {
            return h
        }, this.scrollOffset = function() {
            return p.start
        }, this.triggerPosition = function() {
            var e = d.offset;
            return s && (e += d.triggerElement ? v : s.info("size") * f.triggerHook()), e
        };
        var T, A;
        f.on("shift.internal", function(e) {
            var t = "duration" === e.reason;
            (h === c && t || h === l && 0 === d.duration) && O(), t && _()
        }).on("progress.internal", function() {
            O()
        }).on("add.internal", function() {
            _()
        }).on("destroy.internal", function(e) {
            f.removePin(e.reset)
        });
        var O = function(e) {
                if (T && s) {
                    var t = s.info(),
                        n = A.spacer.firstChild;
                    if (e || h !== l) {
                        var r = {
                                position: A.inFlow ? "relative" : "absolute",
                                top: 0,
                                left: 0
                            },
                            o = i.css(n, "position") != r.position;
                        A.pushFollowers ? d.duration > 0 && (h === c && 0 === parseFloat(i.css(A.spacer, "padding-top")) ? o = !0 : h === a && 0 === parseFloat(i.css(A.spacer, "padding-bottom")) && (o = !0)) : r[t.vertical ? "top" : "left"] = d.duration * g, i.css(n, r), o && _()
                    } else {
                        "fixed" != i.css(n, "position") && (i.css(n, {
                            position: "fixed"
                        }), _());
                        var u = i.get.offset(A.spacer, !0),
                            f = d.reverse || 0 === d.duration ? t.scrollPos - p.start : Math.round(g * d.duration * 10) / 10;
                        u[t.vertical ? "top" : "left"] += f, i.css(A.spacer.firstChild, {
                            top: u.top,
                            left: u.left
                        })
                    }
                }
            },
            _ = function() {
                if (T && s && A.inFlow) {
                    var e = h === l,
                        t = s.info("vertical"),
                        n = A.spacer.firstChild,
                        r = i.isMarginCollapseType(i.css(A.spacer, "display")),
                        o = {};
                    A.relSize.width || A.relSize.autoFullWidth ? e ? i.css(T, {
                        width: i.get.width(A.spacer)
                    }) : i.css(T, {
                        width: "100%"
                    }) : (o["min-width"] = i.get.width(t ? T : n, !0, !0), o.width = e ? o["min-width"] : "auto"), A.relSize.height ? e ? i.css(T, {
                        height: i.get.height(A.spacer) - (A.pushFollowers ? d.duration : 0)
                    }) : i.css(T, {
                        height: "100%"
                    }) : (o["min-height"] = i.get.height(t ? n : T, !0, !r), o.height = e ? o["min-height"] : "auto"), A.pushFollowers && (o["padding" + (t ? "Top" : "Left")] = d.duration * g, o["padding" + (t ? "Bottom" : "Right")] = d.duration * (1 - g)), i.css(A.spacer, o)
                }
            },
            N = function() {
                s && T && h === l && !s.info("isDocument") && O()
            },
            P = function() {
                s && T && h === l && ((A.relSize.width || A.relSize.autoFullWidth) && i.get.width(window) != i.get.width(A.spacer.parentNode) || A.relSize.height && i.get.height(window) != i.get.height(A.spacer.parentNode)) && _()
            },
            D = function(e) {
                s && T && h === l && !s.info("isDocument") && (e.preventDefault(), s._setScrollPos(s.info("scrollPos") - ((e.wheelDelta || e[s.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || 30 * -e.detail)))
            };
        this.setPin = function(e, n) {
            var r = {
                pushFollowers: !0,
                spacerClass: "scrollmagic-pin-spacer"
            };
            if (n = i.extend({}, r, n), e = i.get.elements(e)[0], !e) return f;
            if ("fixed" === i.css(e, "position")) return f;
            if (T) {
                if (T === e) return f;
                f.removePin()
            }
            T = e;
            var o = T.parentNode.style.display,
                s = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
            T.parentNode.style.display = "none";
            var a = "absolute" != i.css(T, "position"),
                l = i.css(T, s.concat(["display"])),
                c = i.css(T, ["width", "height"]);
            T.parentNode.style.display = o, !a && n.pushFollowers && (n.pushFollowers = !1);
            var u = T.parentNode.insertBefore(document.createElement("div"), T),
                d = i.extend(l, {
                    position: a ? "relative" : "absolute",
                    boxSizing: "content-box",
                    mozBoxSizing: "content-box",
                    webkitBoxSizing: "content-box"
                });
            if (a || i.extend(d, i.css(T, ["width", "height"])), i.css(u, d), u.setAttribute(t, ""), i.addClass(u, n.spacerClass), A = {
                    spacer: u,
                    relSize: {
                        width: "%" === c.width.slice(-1),
                        height: "%" === c.height.slice(-1),
                        autoFullWidth: "auto" === c.width && a && i.isMarginCollapseType(l.display)
                    },
                    pushFollowers: n.pushFollowers,
                    inFlow: a
                }, !T.___origStyle) {
                T.___origStyle = {};
                var h = T.style,
                    g = s.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]);
                g.forEach(function(e) {
                    T.___origStyle[e] = h[e] || ""
                })
            }
            return A.relSize.width && i.css(u, {
                width: c.width
            }), A.relSize.height && i.css(u, {
                height: c.height
            }), u.appendChild(T), i.css(T, {
                position: a ? "relative" : "absolute",
                margin: "auto",
                top: "auto",
                left: "auto",
                bottom: "auto",
                right: "auto"
            }), (A.relSize.width || A.relSize.autoFullWidth) && i.css(T, {
                boxSizing: "border-box",
                mozBoxSizing: "border-box",
                webkitBoxSizing: "border-box"
            }), window.addEventListener("scroll", N), window.addEventListener("resize", N), window.addEventListener("resize", P), T.addEventListener("mousewheel", D), T.addEventListener("DOMMouseScroll", D), O(), f
        }, this.removePin = function(e) {
            if (T) {
                if (h === l && O(!0), e || !s) {
                    var n = A.spacer.firstChild;
                    if (n.hasAttribute(t)) {
                        var r = A.spacer.style,
                            o = ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
                        margins = {}, o.forEach(function(e) {
                            margins[e] = r[e] || ""
                        }), i.css(n, margins)
                    }
                    A.spacer.parentNode.insertBefore(n, A.spacer), A.spacer.parentNode.removeChild(A.spacer), T.parentNode.hasAttribute(t) || (i.css(T, T.___origStyle), delete T.___origStyle)
                }
                window.removeEventListener("scroll", N), window.removeEventListener("resize", N), window.removeEventListener("resize", P), T.removeEventListener("mousewheel", D), T.removeEventListener("DOMMouseScroll", D), T = void 0
            }
            return f
        };
        var R, k = [];
        return f.on("destroy.internal", function(e) {
            f.removeClassToggle(e.reset)
        }), this.setClassToggle = function(e, t) {
            var n = i.get.elements(e);
            return 0 !== n.length && i.type.String(t) ? (k.length > 0 && f.removeClassToggle(), R = t, k = n, f.on("enter.internal_class leave.internal_class", function(e) {
                var t = "enter" === e.type ? i.addClass : i.removeClass;
                k.forEach(function(e) {
                    t(e, R)
                })
            }), f) : f
        }, this.removeClassToggle = function(e) {
            return e && k.forEach(function(e) {
                i.removeClass(e, R)
            }), f.off("start.internal_class end.internal_class"), R = void 0, k = [], f
        }, w(), f
    };
    var r = {
        defaults: {
            duration: 0,
            offset: 0,
            triggerElement: void 0,
            triggerHook: .5,
            reverse: !0,
            loglevel: 2
        },
        validate: {
            offset: function(e) {
                if (e = parseFloat(e), !i.type.Number(e)) throw 0;
                return e
            },
            triggerElement: function(e) {
                if (e = e || void 0) {
                    var t = i.get.elements(e)[0];
                    if (!t) throw 0;
                    e = t
                }
                return e
            },
            triggerHook: function(e) {
                var t = {
                    onCenter: .5,
                    onEnter: 1,
                    onLeave: 0
                };
                if (i.type.Number(e)) e = Math.max(0, Math.min(parseFloat(e), 1));
                else {
                    if (!(e in t)) throw 0;
                    e = t[e]
                }
                return e
            },
            reverse: function(e) {
                return !!e
            }
        },
        shifts: ["duration", "offset", "triggerHook"]
    };
    e.Scene.addOption = function(e, t, n, i) {
        e in r.defaults || (r.defaults[e] = t, r.validate[e] = n, i && r.shifts.push(e))
    }, e.Scene.extend = function(t) {
        var n = this;
        e.Scene = function() {
            return n.apply(this, arguments), this.$super = i.extend({}, this), t.apply(this, arguments) || this
        }, i.extend(e.Scene, n), e.Scene.prototype = n.prototype, e.Scene.prototype.constructor = e.Scene
    }, e.Event = function(e, t, n, r) {
        r = r || {};
        for (var i in r) this[i] = r[i];
        return this.type = e, this.target = this.currentTarget = n, this.namespace = t || "", this.timeStamp = this.timestamp = Date.now(), this
    };
    var i = e._util = function(e) {
        var t, n = {},
            r = function(e) {
                return parseFloat(e) || 0
            },
            i = function(t) {
                return t.currentStyle ? t.currentStyle : e.getComputedStyle(t)
            },
            o = function(t, n, o, s) {
                if (n = n === document ? e : n, n === e) s = !1;
                else if (!f.DomElement(n)) return 0;
                t = t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
                var a = (o ? n["offset" + t] || n["outer" + t] : n["client" + t] || n["inner" + t]) || 0;
                if (o && s) {
                    var l = i(n);
                    a += "Height" === t ? r(l.marginTop) + r(l.marginBottom) : r(l.marginLeft) + r(l.marginRight)
                }
                return a
            },
            s = function(e) {
                return e.replace(/^[^a-z]+([a-z])/g, "$1").replace(/-([a-z])/g, function(e) {
                    return e[1].toUpperCase()
                })
            };
        n.extend = function(e) {
            for (e = e || {}, t = 1; t < arguments.length; t++)
                if (arguments[t])
                    for (var n in arguments[t]) arguments[t].hasOwnProperty(n) && (e[n] = arguments[t][n]);
            return e
        }, n.isMarginCollapseType = function(e) {
            return ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(e) > -1
        };
        var a = 0,
            l = ["ms", "moz", "webkit", "o"],
            c = e.requestAnimationFrame,
            u = e.cancelAnimationFrame;
        for (t = 0; !c && t < l.length; ++t) c = e[l[t] + "RequestAnimationFrame"], u = e[l[t] + "CancelAnimationFrame"] || e[l[t] + "CancelRequestAnimationFrame"];
        c || (c = function(t) {
            var n = (new Date).getTime(),
                r = Math.max(0, 16 - (n - a)),
                i = e.setTimeout(function() {
                    t(n + r)
                }, r);
            return a = n + r, i
        }), u || (u = function(t) {
            e.clearTimeout(t)
        }), n.rAF = c.bind(e), n.cAF = u.bind(e);
        var f = n.type = function(e) {
            return Object.prototype.toString.call(e).replace(/^\[object (.+)\]$/, "$1").toLowerCase()
        };
        f.String = function(e) {
            return "string" === f(e)
        }, f.Function = function(e) {
            return "function" === f(e)
        }, f.Array = function(e) {
            return Array.isArray(e)
        }, f.Number = function(e) {
            return !f.Array(e) && e - parseFloat(e) + 1 >= 0
        }, f.DomElement = function(e) {
            return "object" == typeof HTMLElement ? e instanceof HTMLElement : e && "object" == typeof e && null !== e && 1 === e.nodeType && "string" == typeof e.nodeName
        };
        var d = n.get = {};
        return d.elements = function(t) {
            var n = [];
            if (f.String(t)) try {
                t = document.querySelectorAll(t)
            } catch (r) {
                return n
            }
            if ("nodelist" === f(t) || f.Array(t))
                for (var i = 0, o = n.length = t.length; o > i; i++) {
                    var s = t[i];
                    n[i] = f.DomElement(s) ? s : d.elements(s)
                } else(f.DomElement(t) || t === document || t === e) && (n = [t]);
            return n
        }, d.scrollTop = function(t) {
            return t && "number" == typeof t.scrollTop ? t.scrollTop : e.pageYOffset || 0
        }, d.scrollLeft = function(t) {
            return t && "number" == typeof t.scrollLeft ? t.scrollLeft : e.pageXOffset || 0
        }, d.width = function(e, t, n) {
            return o("width", e, t, n)
        }, d.height = function(e, t, n) {
            return o("height", e, t, n)
        }, d.offset = function(e, t) {
            var n = {
                top: 0,
                left: 0
            };
            if (e && e.getBoundingClientRect) {
                var r = e.getBoundingClientRect();
                n.top = r.top, n.left = r.left, t || (n.top += d.scrollTop(), n.left += d.scrollLeft())
            }
            return n
        }, n.addClass = function(e, t) {
            t && (e.classList ? e.classList.add(t) : e.className += " " + t)
        }, n.removeClass = function(e, t) {
            t && (e.classList ? e.classList.remove(t) : e.className = e.className.replace(RegExp("(^|\\b)" + t.split(" ").join("|") + "(\\b|$)", "gi"), " "))
        }, n.css = function(e, t) {
            if (f.String(t)) return i(e)[s(t)];
            if (f.Array(t)) {
                var n = {},
                    r = i(e);
                return t.forEach(function(e) {
                    n[e] = r[s(e)]
                }), n
            }
            for (var o in t) {
                var a = t[o];
                a == parseFloat(a) && (a += "px"), e.style[s(o)] = a
            }
        }, n
    }(window || {});
    return e
});;
jQuery.easing.jswing = jQuery.easing.swing, jQuery.extend(jQuery.easing, {
        def: "easeOutQuad",
        swing: function(t, e, i, n, a) {
            return jQuery.easing[jQuery.easing.def](t, e, i, n, a)
        },
        easeInQuad: function(t, e, i, n, a) {
            return n * (e /= a) * e + i
        },
        easeOutQuad: function(t, e, i, n, a) {
            return -n * (e /= a) * (e - 2) + i
        },
        easeInOutQuad: function(t, e, i, n, a) {
            return (e /= a / 2) < 1 ? n / 2 * e * e + i : -n / 2 * (--e * (e - 2) - 1) + i
        },
        easeInCubic: function(t, e, i, n, a) {
            return n * (e /= a) * e * e + i
        },
        easeOutCubic: function(t, e, i, n, a) {
            return n * ((e = e / a - 1) * e * e + 1) + i
        },
        easeInOutCubic: function(t, e, i, n, a) {
            return (e /= a / 2) < 1 ? n / 2 * e * e * e + i : n / 2 * ((e -= 2) * e * e + 2) + i
        },
        easeInQuart: function(t, e, i, n, a) {
            return n * (e /= a) * e * e * e + i
        },
        easeOutQuart: function(t, e, i, n, a) {
            return -n * ((e = e / a - 1) * e * e * e - 1) + i
        },
        easeInOutQuart: function(t, e, i, n, a) {
            return (e /= a / 2) < 1 ? n / 2 * e * e * e * e + i : -n / 2 * ((e -= 2) * e * e * e - 2) + i
        },
        easeInQuint: function(t, e, i, n, a) {
            return n * (e /= a) * e * e * e * e + i
        },
        easeOutQuint: function(t, e, i, n, a) {
            return n * ((e = e / a - 1) * e * e * e * e + 1) + i
        },
        easeInOutQuint: function(t, e, i, n, a) {
            return (e /= a / 2) < 1 ? n / 2 * e * e * e * e * e + i : n / 2 * ((e -= 2) * e * e * e * e + 2) + i
        },
        easeInSine: function(t, e, i, n, a) {
            return -n * Math.cos(e / a * (Math.PI / 2)) + n + i
        },
        easeOutSine: function(t, e, i, n, a) {
            return n * Math.sin(e / a * (Math.PI / 2)) + i
        },
        easeInOutSine: function(t, e, i, n, a) {
            return -n / 2 * (Math.cos(Math.PI * e / a) - 1) + i
        },
        easeInExpo: function(t, e, i, n, a) {
            return 0 == e ? i : n * Math.pow(2, 10 * (e / a - 1)) + i
        },
        easeOutExpo: function(t, e, i, n, a) {
            return e == a ? i + n : n * (-Math.pow(2, -10 * e / a) + 1) + i
        },
        easeInOutExpo: function(t, e, i, n, a) {
            return 0 == e ? i : e == a ? i + n : (e /= a / 2) < 1 ? n / 2 * Math.pow(2, 10 * (e - 1)) + i : n / 2 * (-Math.pow(2, -10 * --e) + 2) + i
        },
        easeInCirc: function(t, e, i, n, a) {
            return -n * (Math.sqrt(1 - (e /= a) * e) - 1) + i
        },
        easeOutCirc: function(t, e, i, n, a) {
            return n * Math.sqrt(1 - (e = e / a - 1) * e) + i
        },
        easeInOutCirc: function(t, e, i, n, a) {
            return (e /= a / 2) < 1 ? -n / 2 * (Math.sqrt(1 - e * e) - 1) + i : n / 2 * (Math.sqrt(1 - (e -= 2) * e) + 1) + i
        },
        easeInElastic: function(t, e, i, n, a) {
            var r = 1.70158,
                o = 0,
                s = n;
            if (0 == e) return i;
            if (1 == (e /= a)) return i + n;
            if (o || (o = .3 * a), s < Math.abs(n)) {
                s = n;
                var r = o / 4
            } else var r = o / (2 * Math.PI) * Math.asin(n / s);
            return -(s * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e * a - r) * Math.PI / o)) + i
        },
        easeOutElastic: function(t, e, i, n, a) {
            var r = 1.70158,
                o = 0,
                s = n;
            if (0 == e) return i;
            if (1 == (e /= a)) return i + n;
            if (o || (o = .3 * a), s < Math.abs(n)) {
                s = n;
                var r = o / 4
            } else var r = o / (2 * Math.PI) * Math.asin(n / s);
            return s * Math.pow(2, -10 * e) * Math.sin(2 * (e * a - r) * Math.PI / o) + n + i
        },
        easeInOutElastic: function(t, e, i, n, a) {
            var r = 1.70158,
                o = 0,
                s = n;
            if (0 == e) return i;
            if (2 == (e /= a / 2)) return i + n;
            if (o || (o = .3 * a * 1.5), s < Math.abs(n)) {
                s = n;
                var r = o / 4
            } else var r = o / (2 * Math.PI) * Math.asin(n / s);
            return 1 > e ? -.5 * s * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e * a - r) * Math.PI / o) + i : s * Math.pow(2, -10 * (e -= 1)) * Math.sin(2 * (e * a - r) * Math.PI / o) * .5 + n + i
        },
        easeInBack: function(t, e, i, n, a, r) {
            return void 0 == r && (r = 1.70158), n * (e /= a) * e * ((r + 1) * e - r) + i
        },
        easeOutBack: function(t, e, i, n, a, r) {
            return void 0 == r && (r = 1.70158), n * ((e = e / a - 1) * e * ((r + 1) * e + r) + 1) + i
        },
        easeInOutBack: function(t, e, i, n, a, r) {
            return void 0 == r && (r = 1.70158), (e /= a / 2) < 1 ? n / 2 * e * e * (((r *= 1.525) + 1) * e - r) + i : n / 2 * ((e -= 2) * e * (((r *= 1.525) + 1) * e + r) + 2) + i
        },
        easeInBounce: function(t, e, i, n, a) {
            return n - jQuery.easing.easeOutBounce(t, a - e, 0, n, a) + i
        },
        easeOutBounce: function(t, e, i, n, a) {
            return (e /= a) < 1 / 2.75 ? 7.5625 * n * e * e + i : 2 / 2.75 > e ? n * (7.5625 * (e -= 1.5 / 2.75) * e + .75) + i : 2.5 / 2.75 > e ? n * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) + i : n * (7.5625 * (e -= 2.625 / 2.75) * e + .984375) + i
        },
        easeInOutBounce: function(t, e, i, n, a) {
            return a / 2 > e ? .5 * jQuery.easing.easeInBounce(t, 2 * e, 0, n, a) + i : .5 * jQuery.easing.easeOutBounce(t, 2 * e - a, 0, n, a) + .5 * n + i
        }
    }), jQuery.extend(jQuery.easing, {
        easeInOutMaterial: function(t, e, i, n, a) {
            return (e /= a / 2) < 1 ? n / 2 * e * e + i : n / 4 * ((e -= 2) * e * e + 2) + i
        }
    }), ! function(t) {
        function e(t) {
            var e = t.length,
                n = i.type(t);
            return "function" === n || i.isWindow(t) ? !1 : 1 === t.nodeType && e ? !0 : "array" === n || 0 === e || "number" == typeof e && e > 0 && e - 1 in t
        }
        if (!t.jQuery) {
            var i = function(t, e) {
                return new i.fn.init(t, e)
            };
            i.isWindow = function(t) {
                return null != t && t == t.window
            }, i.type = function(t) {
                return null == t ? t + "" : "object" == typeof t || "function" == typeof t ? a[o.call(t)] || "object" : typeof t
            }, i.isArray = Array.isArray || function(t) {
                return "array" === i.type(t)
            }, i.isPlainObject = function(t) {
                var e;
                if (!t || "object" !== i.type(t) || t.nodeType || i.isWindow(t)) return !1;
                try {
                    if (t.constructor && !r.call(t, "constructor") && !r.call(t.constructor.prototype, "isPrototypeOf")) return !1
                } catch (n) {
                    return !1
                }
                for (e in t);
                return void 0 === e || r.call(t, e)
            }, i.each = function(t, i, n) {
                var a, r = 0,
                    o = t.length,
                    s = e(t);
                if (n) {
                    if (s)
                        for (; o > r && (a = i.apply(t[r], n), a !== !1); r++);
                    else
                        for (r in t)
                            if (a = i.apply(t[r], n), a === !1) break
                } else if (s)
                    for (; o > r && (a = i.call(t[r], r, t[r]), a !== !1); r++);
                else
                    for (r in t)
                        if (a = i.call(t[r], r, t[r]), a === !1) break;
                return t
            }, i.data = function(t, e, a) {
                if (void 0 === a) {
                    var r = t[i.expando],
                        o = r && n[r];
                    if (void 0 === e) return o;
                    if (o && e in o) return o[e]
                } else if (void 0 !== e) {
                    var r = t[i.expando] || (t[i.expando] = ++i.uuid);
                    return n[r] = n[r] || {}, n[r][e] = a, a
                }
            }, i.removeData = function(t, e) {
                var a = t[i.expando],
                    r = a && n[a];
                r && i.each(e, function(t, e) {
                    delete r[e]
                })
            }, i.extend = function() {
                var t, e, n, a, r, o, s = arguments[0] || {},
                    l = 1,
                    u = arguments.length,
                    c = !1;
                for ("boolean" == typeof s && (c = s, s = arguments[l] || {}, l++), "object" != typeof s && "function" !== i.type(s) && (s = {}), l === u && (s = this, l--); u > l; l++)
                    if (null != (r = arguments[l]))
                        for (a in r) t = s[a], n = r[a], s !== n && (c && n && (i.isPlainObject(n) || (e = i.isArray(n))) ? (e ? (e = !1, o = t && i.isArray(t) ? t : []) : o = t && i.isPlainObject(t) ? t : {}, s[a] = i.extend(c, o, n)) : void 0 !== n && (s[a] = n));
                return s
            }, i.queue = function(t, n, a) {
                function r(t, i) {
                    var n = i || [];
                    return null != t && (e(Object(t)) ? ! function(t, e) {
                        for (var i = +e.length, n = 0, a = t.length; i > n;) t[a++] = e[n++];
                        if (i !== i)
                            for (; void 0 !== e[n];) t[a++] = e[n++];
                        return t.length = a, t
                    }(n, "string" == typeof t ? [t] : t) : [].push.call(n, t)), n
                }
                if (t) {
                    n = (n || "fx") + "queue";
                    var o = i.data(t, n);
                    return a ? (!o || i.isArray(a) ? o = i.data(t, n, r(a)) : o.push(a), o) : o || []
                }
            }, i.dequeue = function(t, e) {
                i.each(t.nodeType ? [t] : t, function(t, n) {
                    e = e || "fx";
                    var a = i.queue(n, e),
                        r = a.shift();
                    "inprogress" === r && (r = a.shift()), r && ("fx" === e && a.unshift("inprogress"), r.call(n, function() {
                        i.dequeue(n, e)
                    }))
                })
            }, i.fn = i.prototype = {
                init: function(t) {
                    if (t.nodeType) return this[0] = t, this;
                    throw new Error("Not a DOM node.")
                },
                offset: function() {
                    var e = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : {
                        top: 0,
                        left: 0
                    };
                    return {
                        top: e.top + (t.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
                        left: e.left + (t.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
                    }
                },
                position: function() {
                    function t() {
                        for (var t = this.offsetParent || document; t && "html" === !t.nodeType.toLowerCase && "static" === t.style.position;) t = t.offsetParent;
                        return t || document
                    }
                    var e = this[0],
                        t = t.apply(e),
                        n = this.offset(),
                        a = /^(?:body|html)$/i.test(t.nodeName) ? {
                            top: 0,
                            left: 0
                        } : i(t).offset();
                    return n.top -= parseFloat(e.style.marginTop) || 0, n.left -= parseFloat(e.style.marginLeft) || 0, t.style && (a.top += parseFloat(t.style.borderTopWidth) || 0, a.left += parseFloat(t.style.borderLeftWidth) || 0), {
                        top: n.top - a.top,
                        left: n.left - a.left
                    }
                }
            };
            var n = {};
            i.expando = "velocity" + (new Date).getTime(), i.uuid = 0;
            for (var a = {}, r = a.hasOwnProperty, o = a.toString, s = "Boolean Number String Function Array Date RegExp Object Error".split(" "), l = 0; l < s.length; l++) a["[object " + s[l] + "]"] = s[l].toLowerCase();
            i.fn.init.prototype = i.fn, t.Velocity = {
                Utilities: i
            }
        }
    }(window),
    function(t) {
        "object" == typeof module && "object" == typeof module.exports ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : t()
    }(function() {
        return function(t, e, i, n) {
            function a(t) {
                for (var e = -1, i = t ? t.length : 0, n = []; ++e < i;) {
                    var a = t[e];
                    a && n.push(a)
                }
                return n
            }

            function r(t) {
                return v.isWrapped(t) ? t = [].slice.call(t) : v.isNode(t) && (t = [t]), t
            }

            function o(t) {
                var e = p.data(t, "velocity");
                return null === e ? n : e
            }

            function s(t) {
                return function(e) {
                    return Math.round(e * t) * (1 / t)
                }
            }

            function l(t, i, n, a) {
                function r(t, e) {
                    return 1 - 3 * e + 3 * t
                }

                function o(t, e) {
                    return 3 * e - 6 * t
                }

                function s(t) {
                    return 3 * t
                }

                function l(t, e, i) {
                    return ((r(e, i) * t + o(e, i)) * t + s(e)) * t
                }

                function u(t, e, i) {
                    return 3 * r(e, i) * t * t + 2 * o(e, i) * t + s(e)
                }

                function c(e, i) {
                    for (var a = 0; v > a; ++a) {
                        var r = u(i, t, n);
                        if (0 === r) return i;
                        var o = l(i, t, n) - e;
                        i -= o / r
                    }
                    return i
                }

                function d() {
                    for (var e = 0; b > e; ++e) k[e] = l(e * w, t, n)
                }

                function p(e, i, a) {
                    var r, o, s = 0;
                    do o = i + (a - i) / 2, r = l(o, t, n) - e, r > 0 ? a = o : i = o; while (Math.abs(r) > m && ++s < y);
                    return o
                }

                function f(e) {
                    for (var i = 0, a = 1, r = b - 1; a != r && k[a] <= e; ++a) i += w;
                    --a;
                    var o = (e - k[a]) / (k[a + 1] - k[a]),
                        s = i + o * w,
                        l = u(s, t, n);
                    return l >= g ? c(e, s) : 0 == l ? s : p(e, i, i + w)
                }

                function h() {
                    S = !0, (t != i || n != a) && d()
                }
                var v = 4,
                    g = .001,
                    m = 1e-7,
                    y = 10,
                    b = 11,
                    w = 1 / (b - 1),
                    x = "Float32Array" in e;
                if (4 !== arguments.length) return !1;
                for (var C = 0; 4 > C; ++C)
                    if ("number" != typeof arguments[C] || isNaN(arguments[C]) || !isFinite(arguments[C])) return !1;
                t = Math.min(t, 1), n = Math.min(n, 1), t = Math.max(t, 0), n = Math.max(n, 0);
                var k = x ? new Float32Array(b) : new Array(b),
                    S = !1,
                    T = function(e) {
                        return S || h(), t === i && n === a ? e : 0 === e ? 0 : 1 === e ? 1 : l(f(e), i, a)
                    };
                T.getControlPoints = function() {
                    return [{
                        x: t,
                        y: i
                    }, {
                        x: n,
                        y: a
                    }]
                };
                var O = "generateBezier(" + [t, i, n, a] + ")";
                return T.toString = function() {
                    return O
                }, T
            }

            function u(t, e) {
                var i = t;
                return v.isString(t) ? b.Easings[t] || (i = !1) : i = v.isArray(t) && 1 === t.length ? s.apply(null, t) : v.isArray(t) && 2 === t.length ? w.apply(null, t.concat([e])) : v.isArray(t) && 4 === t.length ? l.apply(null, t) : !1, i === !1 && (i = b.Easings[b.defaults.easing] ? b.defaults.easing : y), i
            }

            function c(t) {
                if (t) {
                    var e = (new Date).getTime(),
                        i = b.State.calls.length;
                    i > 1e4 && (b.State.calls = a(b.State.calls));
                    for (var r = 0; i > r; r++)
                        if (b.State.calls[r]) {
                            var s = b.State.calls[r],
                                l = s[0],
                                u = s[2],
                                f = s[3],
                                h = !!f,
                                g = null;
                            f || (f = b.State.calls[r][3] = e - 16);
                            for (var m = Math.min((e - f) / u.duration, 1), y = 0, w = l.length; w > y; y++) {
                                var C = l[y],
                                    S = C.element;
                                if (o(S)) {
                                    var T = !1;
                                    if (u.display !== n && null !== u.display && "none" !== u.display) {
                                        if ("flex" === u.display) {
                                            var O = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];
                                            p.each(O, function(t, e) {
                                                x.setPropertyValue(S, "display", e)
                                            })
                                        }
                                        x.setPropertyValue(S, "display", u.display)
                                    }
                                    u.visibility !== n && "hidden" !== u.visibility && x.setPropertyValue(S, "visibility", u.visibility);
                                    for (var P in C)
                                        if ("element" !== P) {
                                            var A, E = C[P],
                                                q = v.isString(E.easing) ? b.Easings[E.easing] : E.easing;
                                            if (1 === m) A = E.endValue;
                                            else {
                                                var M = E.endValue - E.startValue;
                                                if (A = E.startValue + M * q(m, u, M), !h && A === E.currentValue) continue
                                            }
                                            if (E.currentValue = A, "tween" === P) g = A;
                                            else {
                                                if (x.Hooks.registered[P]) {
                                                    var I = x.Hooks.getRoot(P),
                                                        _ = o(S).rootPropertyValueCache[I];
                                                    _ && (E.rootPropertyValue = _)
                                                }
                                                var V = x.setPropertyValue(S, P, E.currentValue + (0 === parseFloat(A) ? "" : E.unitType), E.rootPropertyValue, E.scrollData);
                                                x.Hooks.registered[P] && (o(S).rootPropertyValueCache[I] = x.Normalizations.registered[I] ? x.Normalizations.registered[I]("extract", null, V[1]) : V[1]), "transform" === V[0] && (T = !0)
                                            }
                                        }
                                    u.mobileHA && o(S).transformCache.translate3d === n && (o(S).transformCache.translate3d = "(0px, 0px, 0px)", T = !0), T && x.flushTransformCache(S)
                                }
                            }
                            u.display !== n && "none" !== u.display && (b.State.calls[r][2].display = !1), u.visibility !== n && "hidden" !== u.visibility && (b.State.calls[r][2].visibility = !1), u.progress && u.progress.call(s[1], s[1], m, Math.max(0, f + u.duration - e), f, g), 1 === m && d(r)
                        }
                }
                b.State.isTicking && k(c)
            }

            function d(t, e) {
                if (!b.State.calls[t]) return !1;
                for (var i = b.State.calls[t][0], a = b.State.calls[t][1], r = b.State.calls[t][2], s = b.State.calls[t][4], l = !1, u = 0, c = i.length; c > u; u++) {
                    var d = i[u].element;
                    if (e || r.loop || ("none" === r.display && x.setPropertyValue(d, "display", r.display), "hidden" === r.visibility && x.setPropertyValue(d, "visibility", r.visibility)), r.loop !== !0 && (p.queue(d)[1] === n || !/\.velocityQueueEntryFlag/i.test(p.queue(d)[1])) && o(d)) {
                        o(d).isAnimating = !1, o(d).rootPropertyValueCache = {};
                        var f = !1;
                        p.each(x.Lists.transforms3D, function(t, e) {
                            var i = /^scale/.test(e) ? 1 : 0,
                                a = o(d).transformCache[e];
                            o(d).transformCache[e] !== n && new RegExp("^\\(" + i + "[^.]").test(a) && (f = !0, delete o(d).transformCache[e])
                        }), r.mobileHA && (f = !0, delete o(d).transformCache.translate3d), f && x.flushTransformCache(d), x.Values.removeClass(d, "velocity-animating")
                    }
                    if (!e && r.complete && !r.loop && u === c - 1) try {
                        r.complete.call(a, a)
                    } catch (h) {
                        setTimeout(function() {
                            throw h
                        }, 1)
                    }
                    s && r.loop !== !0 && s(a), o(d) && r.loop === !0 && !e && (p.each(o(d).tweensContainer, function(t, e) {
                        /^rotate/.test(t) && 360 === parseFloat(e.endValue) && (e.endValue = 0, e.startValue = 360), /^backgroundPosition/.test(t) && 100 === parseFloat(e.endValue) && "%" === e.unitType && (e.endValue = 0, e.startValue = 100)
                    }), b(d, "reverse", {
                        loop: !0,
                        delay: r.delay
                    })), r.queue !== !1 && p.dequeue(d, r.queue)
                }
                b.State.calls[t] = !1;
                for (var v = 0, g = b.State.calls.length; g > v; v++)
                    if (b.State.calls[v] !== !1) {
                        l = !0;
                        break
                    }
                l === !1 && (b.State.isTicking = !1, delete b.State.calls, b.State.calls = [])
            }
            var p, f = function() {
                    if (i.documentMode) return i.documentMode;
                    for (var t = 7; t > 4; t--) {
                        var e = i.createElement("div");
                        if (e.innerHTML = "<!--[if IE " + t + "]><span></span><![endif]-->", e.getElementsByTagName("span").length) return e = null, t
                    }
                    return n
                }(),
                h = function() {
                    var t = 0;
                    return e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || function(e) {
                        var i, n = (new Date).getTime();
                        return i = Math.max(0, 16 - (n - t)), t = n + i, setTimeout(function() {
                            e(n + i)
                        }, i)
                    }
                }(),
                v = {
                    isString: function(t) {
                        return "string" == typeof t
                    },
                    isArray: Array.isArray || function(t) {
                        return "[object Array]" === Object.prototype.toString.call(t)
                    },
                    isFunction: function(t) {
                        return "[object Function]" === Object.prototype.toString.call(t)
                    },
                    isNode: function(t) {
                        return t && t.nodeType
                    },
                    isNodeList: function(t) {
                        return "object" == typeof t && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(t)) && t.length !== n && (0 === t.length || "object" == typeof t[0] && t[0].nodeType > 0)
                    },
                    isWrapped: function(t) {
                        return t && (t.jquery || e.Zepto && e.Zepto.zepto.isZ(t))
                    },
                    isSVG: function(t) {
                        return e.SVGElement && t instanceof e.SVGElement
                    },
                    isEmptyObject: function(t) {
                        for (var e in t) return !1;
                        return !0
                    }
                },
                g = !1;
            if (t.fn && t.fn.jquery ? (p = t, g = !0) : p = e.Velocity.Utilities, 8 >= f && !g) throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
            if (7 >= f) return void(jQuery.fn.velocity = jQuery.fn.animate);
            var m = 400,
                y = "swing",
                b = {
                    State: {
                        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                        isAndroid: /Android/i.test(navigator.userAgent),
                        isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
                        isChrome: e.chrome,
                        isFirefox: /Firefox/i.test(navigator.userAgent),
                        prefixElement: i.createElement("div"),
                        prefixMatches: {},
                        scrollAnchor: null,
                        scrollPropertyLeft: null,
                        scrollPropertyTop: null,
                        isTicking: !1,
                        calls: []
                    },
                    CSS: {},
                    Utilities: p,
                    Redirects: {},
                    Easings: {},
                    Promise: e.Promise,
                    defaults: {
                        queue: "",
                        duration: m,
                        easing: y,
                        begin: n,
                        complete: n,
                        progress: n,
                        display: n,
                        visibility: n,
                        loop: !1,
                        delay: !1,
                        mobileHA: !0,
                        _cacheValues: !0
                    },
                    init: function(t) {
                        p.data(t, "velocity", {
                            isSVG: v.isSVG(t),
                            isAnimating: !1,
                            computedStyle: null,
                            tweensContainer: null,
                            rootPropertyValueCache: {},
                            transformCache: {}
                        })
                    },
                    hook: null,
                    mock: !1,
                    version: {
                        major: 1,
                        minor: 2,
                        patch: 2
                    },
                    debug: !1
                };
            e.pageYOffset !== n ? (b.State.scrollAnchor = e, b.State.scrollPropertyLeft = "pageXOffset", b.State.scrollPropertyTop = "pageYOffset") : (b.State.scrollAnchor = i.documentElement || i.body.parentNode || i.body, b.State.scrollPropertyLeft = "scrollLeft", b.State.scrollPropertyTop = "scrollTop");
            var w = function() {
                function t(t) {
                    return -t.tension * t.x - t.friction * t.v
                }

                function e(e, i, n) {
                    var a = {
                        x: e.x + n.dx * i,
                        v: e.v + n.dv * i,
                        tension: e.tension,
                        friction: e.friction
                    };
                    return {
                        dx: a.v,
                        dv: t(a)
                    }
                }

                function i(i, n) {
                    var a = {
                            dx: i.v,
                            dv: t(i)
                        },
                        r = e(i, .5 * n, a),
                        o = e(i, .5 * n, r),
                        s = e(i, n, o),
                        l = 1 / 6 * (a.dx + 2 * (r.dx + o.dx) + s.dx),
                        u = 1 / 6 * (a.dv + 2 * (r.dv + o.dv) + s.dv);
                    return i.x = i.x + l * n, i.v = i.v + u * n, i
                }
                return function n(t, e, a) {
                    var r, o, s, l = {
                            x: -1,
                            v: 0,
                            tension: null,
                            friction: null
                        },
                        u = [0],
                        c = 0,
                        d = 1e-4,
                        p = .016;
                    for (t = parseFloat(t) || 500, e = parseFloat(e) || 20, a = a || null, l.tension = t, l.friction = e, r = null !== a, r ? (c = n(t, e), o = c / a * p) : o = p; s = i(s || l, o), u.push(1 + s.x), c += 16, Math.abs(s.x) > d && Math.abs(s.v) > d;);
                    return r ? function(t) {
                        return u[t * (u.length - 1) | 0]
                    } : c
                }
            }();
            b.Easings = {
                linear: function(t) {
                    return t
                },
                swing: function(t) {
                    return .5 - Math.cos(t * Math.PI) / 2
                },
                spring: function(t) {
                    return 1 - Math.cos(4.5 * t * Math.PI) * Math.exp(6 * -t)
                }
            }, p.each([
                ["ease", [.25, .1, .25, 1]],
                ["ease-in", [.42, 0, 1, 1]],
                ["ease-out", [0, 0, .58, 1]],
                ["ease-in-out", [.42, 0, .58, 1]],
                ["easeInSine", [.47, 0, .745, .715]],
                ["easeOutSine", [.39, .575, .565, 1]],
                ["easeInOutSine", [.445, .05, .55, .95]],
                ["easeInQuad", [.55, .085, .68, .53]],
                ["easeOutQuad", [.25, .46, .45, .94]],
                ["easeInOutQuad", [.455, .03, .515, .955]],
                ["easeInCubic", [.55, .055, .675, .19]],
                ["easeOutCubic", [.215, .61, .355, 1]],
                ["easeInOutCubic", [.645, .045, .355, 1]],
                ["easeInQuart", [.895, .03, .685, .22]],
                ["easeOutQuart", [.165, .84, .44, 1]],
                ["easeInOutQuart", [.77, 0, .175, 1]],
                ["easeInQuint", [.755, .05, .855, .06]],
                ["easeOutQuint", [.23, 1, .32, 1]],
                ["easeInOutQuint", [.86, 0, .07, 1]],
                ["easeInExpo", [.95, .05, .795, .035]],
                ["easeOutExpo", [.19, 1, .22, 1]],
                ["easeInOutExpo", [1, 0, 0, 1]],
                ["easeInCirc", [.6, .04, .98, .335]],
                ["easeOutCirc", [.075, .82, .165, 1]],
                ["easeInOutCirc", [.785, .135, .15, .86]]
            ], function(t, e) {
                b.Easings[e[0]] = l.apply(null, e[1])
            });
            var x = b.CSS = {
                RegEx: {
                    isHex: /^#([A-f\d]{3}){1,2}$/i,
                    valueUnwrap: /^[A-z]+\((.*)\)$/i,
                    wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
                    valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi
                },
                Lists: {
                    colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"],
                    transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"],
                    transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"]
                },
                Hooks: {
                    templates: {
                        textShadow: ["Color X Y Blur", "black 0px 0px 0px"],
                        boxShadow: ["Color X Y Blur Spread", "black 0px 0px 0px 0px"],
                        clip: ["Top Right Bottom Left", "0px 0px 0px 0px"],
                        backgroundPosition: ["X Y", "0% 0%"],
                        transformOrigin: ["X Y Z", "50% 50% 0px"],
                        perspectiveOrigin: ["X Y", "50% 50%"]
                    },
                    registered: {},
                    register: function() {
                        for (var t = 0; t < x.Lists.colors.length; t++) {
                            var e = "color" === x.Lists.colors[t] ? "0 0 0 1" : "255 255 255 1";
                            x.Hooks.templates[x.Lists.colors[t]] = ["Red Green Blue Alpha", e]
                        }
                        var i, n, a;
                        if (f)
                            for (i in x.Hooks.templates) {
                                n = x.Hooks.templates[i], a = n[0].split(" ");
                                var r = n[1].match(x.RegEx.valueSplit);
                                "Color" === a[0] && (a.push(a.shift()), r.push(r.shift()), x.Hooks.templates[i] = [a.join(" "), r.join(" ")])
                            }
                        for (i in x.Hooks.templates) {
                            n = x.Hooks.templates[i], a = n[0].split(" ");
                            for (var t in a) {
                                var o = i + a[t],
                                    s = t;
                                x.Hooks.registered[o] = [i, s]
                            }
                        }
                    },
                    getRoot: function(t) {
                        var e = x.Hooks.registered[t];
                        return e ? e[0] : t
                    },
                    cleanRootPropertyValue: function(t, e) {
                        return x.RegEx.valueUnwrap.test(e) && (e = e.match(x.RegEx.valueUnwrap)[1]), x.Values.isCSSNullValue(e) && (e = x.Hooks.templates[t][1]), e
                    },
                    extractValue: function(t, e) {
                        var i = x.Hooks.registered[t];
                        if (i) {
                            var n = i[0],
                                a = i[1];
                            return e = x.Hooks.cleanRootPropertyValue(n, e), e.toString().match(x.RegEx.valueSplit)[a]
                        }
                        return e
                    },
                    injectValue: function(t, e, i) {
                        var n = x.Hooks.registered[t];
                        if (n) {
                            var a, r, o = n[0],
                                s = n[1];
                            return i = x.Hooks.cleanRootPropertyValue(o, i), a = i.toString().match(x.RegEx.valueSplit), a[s] = e, r = a.join(" ")
                        }
                        return i
                    }
                },
                Normalizations: {
                    registered: {
                        clip: function(t, e, i) {
                            switch (t) {
                                case "name":
                                    return "clip";
                                case "extract":
                                    var n;
                                    return x.RegEx.wrappedValueAlreadyExtracted.test(i) ? n = i : (n = i.toString().match(x.RegEx.valueUnwrap), n = n ? n[1].replace(/,(\s+)?/g, " ") : i), n;
                                case "inject":
                                    return "rect(" + i + ")"
                            }
                        },
                        blur: function(t, e, i) {
                            switch (t) {
                                case "name":
                                    return b.State.isFirefox ? "filter" : "-webkit-filter";
                                case "extract":
                                    var n = parseFloat(i);
                                    if (!n && 0 !== n) {
                                        var a = i.toString().match(/blur\(([0-9]+[A-z]+)\)/i);
                                        n = a ? a[1] : 0
                                    }
                                    return n;
                                case "inject":
                                    return parseFloat(i) ? "blur(" + i + ")" : "none"
                            }
                        },
                        opacity: function(t, e, i) {
                            if (8 >= f) switch (t) {
                                case "name":
                                    return "filter";
                                case "extract":
                                    var n = i.toString().match(/alpha\(opacity=(.*)\)/i);
                                    return i = n ? n[1] / 100 : 1;
                                case "inject":
                                    return e.style.zoom = 1, parseFloat(i) >= 1 ? "" : "alpha(opacity=" + parseInt(100 * parseFloat(i), 10) + ")"
                            } else switch (t) {
                                case "name":
                                    return "opacity";
                                case "extract":
                                    return i;
                                case "inject":
                                    return i
                            }
                        }
                    },
                    register: function() {
                        9 >= f || b.State.isGingerbread || (x.Lists.transformsBase = x.Lists.transformsBase.concat(x.Lists.transforms3D));
                        for (var t = 0; t < x.Lists.transformsBase.length; t++) ! function() {
                            var e = x.Lists.transformsBase[t];
                            x.Normalizations.registered[e] = function(t, i, a) {
                                switch (t) {
                                    case "name":
                                        return "transform";
                                    case "extract":
                                        return o(i) === n || o(i).transformCache[e] === n ? /^scale/i.test(e) ? 1 : 0 : o(i).transformCache[e].replace(/[()]/g, "");
                                    case "inject":
                                        var r = !1;
                                        switch (e.substr(0, e.length - 1)) {
                                            case "translate":
                                                r = !/(%|px|em|rem|vw|vh|\d)$/i.test(a);
                                                break;
                                            case "scal":
                                            case "scale":
                                                b.State.isAndroid && o(i).transformCache[e] === n && 1 > a && (a = 1), r = !/(\d)$/i.test(a);
                                                break;
                                            case "skew":
                                                r = !/(deg|\d)$/i.test(a);
                                                break;
                                            case "rotate":
                                                r = !/(deg|\d)$/i.test(a)
                                        }
                                        return r || (o(i).transformCache[e] = "(" + a + ")"), o(i).transformCache[e]
                                }
                            }
                        }();
                        for (var t = 0; t < x.Lists.colors.length; t++) ! function() {
                            var e = x.Lists.colors[t];
                            x.Normalizations.registered[e] = function(t, i, a) {
                                switch (t) {
                                    case "name":
                                        return e;
                                    case "extract":
                                        var r;
                                        if (x.RegEx.wrappedValueAlreadyExtracted.test(a)) r = a;
                                        else {
                                            var o, s = {
                                                black: "rgb(0, 0, 0)",
                                                blue: "rgb(0, 0, 255)",
                                                gray: "rgb(128, 128, 128)",
                                                green: "rgb(0, 128, 0)",
                                                red: "rgb(255, 0, 0)",
                                                white: "rgb(255, 255, 255)"
                                            };
                                            /^[A-z]+$/i.test(a) ? o = s[a] !== n ? s[a] : s.black : x.RegEx.isHex.test(a) ? o = "rgb(" + x.Values.hexToRgb(a).join(" ") + ")" : /^rgba?\(/i.test(a) || (o = s.black), r = (o || a).toString().match(x.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ")
                                        }
                                        return 8 >= f || 3 !== r.split(" ").length || (r += " 1"), r;
                                    case "inject":
                                        return 8 >= f ? 4 === a.split(" ").length && (a = a.split(/\s+/).slice(0, 3).join(" ")) : 3 === a.split(" ").length && (a += " 1"), (8 >= f ? "rgb" : "rgba") + "(" + a.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")"
                                }
                            }
                        }()
                    }
                },
                Names: {
                    camelCase: function(t) {
                        return t.replace(/-(\w)/g, function(t, e) {
                            return e.toUpperCase()
                        })
                    },
                    SVGAttribute: function(t) {
                        var e = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";
                        return (f || b.State.isAndroid && !b.State.isChrome) && (e += "|transform"), new RegExp("^(" + e + ")$", "i").test(t)
                    },
                    prefixCheck: function(t) {
                        if (b.State.prefixMatches[t]) return [b.State.prefixMatches[t], !0];
                        for (var e = ["", "Webkit", "Moz", "ms", "O"], i = 0, n = e.length; n > i; i++) {
                            var a;
                            if (a = 0 === i ? t : e[i] + t.replace(/^\w/, function(t) {
                                    return t.toUpperCase()
                                }), v.isString(b.State.prefixElement.style[a])) return b.State.prefixMatches[t] = a, [a, !0]
                        }
                        return [t, !1]
                    }
                },
                Values: {
                    hexToRgb: function(t) {
                        var e, i = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                            n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
                        return t = t.replace(i, function(t, e, i, n) {
                            return e + e + i + i + n + n
                        }), e = n.exec(t), e ? [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)] : [0, 0, 0]
                    },
                    isCSSNullValue: function(t) {
                        return 0 == t || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(t)
                    },
                    getUnitType: function(t) {
                        return /^(rotate|skew)/i.test(t) ? "deg" : /(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(t) ? "" : "px"
                    },
                    getDisplayType: function(t) {
                        var e = t && t.tagName.toString().toLowerCase();
                        return /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(e) ? "inline" : /^(li)$/i.test(e) ? "list-item" : /^(tr)$/i.test(e) ? "table-row" : /^(table)$/i.test(e) ? "table" : /^(tbody)$/i.test(e) ? "table-row-group" : "block"
                    },
                    addClass: function(t, e) {
                        t.classList ? t.classList.add(e) : t.className += (t.className.length ? " " : "") + e
                    },
                    removeClass: function(t, e) {
                        t.classList ? t.classList.remove(e) : t.className = t.className.toString().replace(new RegExp("(^|\\s)" + e.split(" ").join("|") + "(\\s|$)", "gi"), " ")
                    }
                },
                getPropertyValue: function(t, i, a, r) {
                    function s(t, i) {
                        function a() {
                            u && x.setPropertyValue(t, "display", "none")
                        }
                        var l = 0;
                        if (8 >= f) l = p.css(t, i);
                        else {
                            var u = !1;
                            if (/^(width|height)$/.test(i) && 0 === x.getPropertyValue(t, "display") && (u = !0, x.setPropertyValue(t, "display", x.Values.getDisplayType(t))), !r) {
                                if ("height" === i && "border-box" !== x.getPropertyValue(t, "boxSizing").toString().toLowerCase()) {
                                    var c = t.offsetHeight - (parseFloat(x.getPropertyValue(t, "borderTopWidth")) || 0) - (parseFloat(x.getPropertyValue(t, "borderBottomWidth")) || 0) - (parseFloat(x.getPropertyValue(t, "paddingTop")) || 0) - (parseFloat(x.getPropertyValue(t, "paddingBottom")) || 0);
                                    return a(), c
                                }
                                if ("width" === i && "border-box" !== x.getPropertyValue(t, "boxSizing").toString().toLowerCase()) {
                                    var d = t.offsetWidth - (parseFloat(x.getPropertyValue(t, "borderLeftWidth")) || 0) - (parseFloat(x.getPropertyValue(t, "borderRightWidth")) || 0) - (parseFloat(x.getPropertyValue(t, "paddingLeft")) || 0) - (parseFloat(x.getPropertyValue(t, "paddingRight")) || 0);
                                    return a(), d
                                }
                            }
                            var h;
                            h = o(t) === n ? e.getComputedStyle(t, null) : o(t).computedStyle ? o(t).computedStyle : o(t).computedStyle = e.getComputedStyle(t, null), "borderColor" === i && (i = "borderTopColor"), l = 9 === f && "filter" === i ? h.getPropertyValue(i) : h[i], ("" === l || null === l) && (l = t.style[i]), a()
                        }
                        if ("auto" === l && /^(top|right|bottom|left)$/i.test(i)) {
                            var v = s(t, "position");
                            ("fixed" === v || "absolute" === v && /top|left/i.test(i)) && (l = p(t).position()[i] + "px")
                        }
                        return l
                    }
                    var l;
                    if (x.Hooks.registered[i]) {
                        var u = i,
                            c = x.Hooks.getRoot(u);
                        a === n && (a = x.getPropertyValue(t, x.Names.prefixCheck(c)[0])), x.Normalizations.registered[c] && (a = x.Normalizations.registered[c]("extract", t, a)), l = x.Hooks.extractValue(u, a)
                    } else if (x.Normalizations.registered[i]) {
                        var d, h;
                        d = x.Normalizations.registered[i]("name", t), "transform" !== d && (h = s(t, x.Names.prefixCheck(d)[0]), x.Values.isCSSNullValue(h) && x.Hooks.templates[i] && (h = x.Hooks.templates[i][1])), l = x.Normalizations.registered[i]("extract", t, h)
                    }
                    if (!/^[\d-]/.test(l))
                        if (o(t) && o(t).isSVG && x.Names.SVGAttribute(i))
                            if (/^(height|width)$/i.test(i)) try {
                                l = t.getBBox()[i]
                            } catch (v) {
                                l = 0
                            } else l = t.getAttribute(i);
                            else l = s(t, x.Names.prefixCheck(i)[0]);
                    return x.Values.isCSSNullValue(l) && (l = 0), b.debug >= 2 && console.log("Get " + i + ": " + l), l
                },
                setPropertyValue: function(t, i, n, a, r) {
                    var s = i;
                    if ("scroll" === i) r.container ? r.container["scroll" + r.direction] = n : "Left" === r.direction ? e.scrollTo(n, r.alternateValue) : e.scrollTo(r.alternateValue, n);
                    else if (x.Normalizations.registered[i] && "transform" === x.Normalizations.registered[i]("name", t)) x.Normalizations.registered[i]("inject", t, n), s = "transform", n = o(t).transformCache[i];
                    else {
                        if (x.Hooks.registered[i]) {
                            var l = i,
                                u = x.Hooks.getRoot(i);
                            a = a || x.getPropertyValue(t, u), n = x.Hooks.injectValue(l, n, a), i = u
                        }
                        if (x.Normalizations.registered[i] && (n = x.Normalizations.registered[i]("inject", t, n), i = x.Normalizations.registered[i]("name", t)), s = x.Names.prefixCheck(i)[0], 8 >= f) try {
                            t.style[s] = n
                        } catch (c) {
                            b.debug && console.log("Browser does not support [" + n + "] for [" + s + "]")
                        } else o(t) && o(t).isSVG && x.Names.SVGAttribute(i) ? t.setAttribute(i, n) : t.style[s] = n;
                        b.debug >= 2 && console.log("Set " + i + " (" + s + "): " + n)
                    }
                    return [s, n]
                },
                flushTransformCache: function(t) {
                    function e(e) {
                        return parseFloat(x.getPropertyValue(t, e))
                    }
                    var i = "";
                    if ((f || b.State.isAndroid && !b.State.isChrome) && o(t).isSVG) {
                        var n = {
                            translate: [e("translateX"), e("translateY")],
                            skewX: [e("skewX")],
                            skewY: [e("skewY")],
                            scale: 1 !== e("scale") ? [e("scale"), e("scale")] : [e("scaleX"), e("scaleY")],
                            rotate: [e("rotateZ"), 0, 0]
                        };
                        p.each(o(t).transformCache, function(t) {
                            /^translate/i.test(t) ? t = "translate" : /^scale/i.test(t) ? t = "scale" : /^rotate/i.test(t) && (t = "rotate"), n[t] && (i += t + "(" + n[t].join(" ") + ") ", delete n[t])
                        })
                    } else {
                        var a, r;
                        p.each(o(t).transformCache, function(e) {
                            return a = o(t).transformCache[e], "transformPerspective" === e ? (r = a, !0) : (9 === f && "rotateZ" === e && (e = "rotate"), void(i += e + a + " "))
                        }), r && (i = "perspective" + r + " " + i)
                    }
                    x.setPropertyValue(t, "transform", i)
                }
            };
            x.Hooks.register(), x.Normalizations.register(), b.hook = function(t, e, i) {
                var a = n;
                return t = r(t), p.each(t, function(t, r) {
                    if (o(r) === n && b.init(r), i === n) a === n && (a = b.CSS.getPropertyValue(r, e));
                    else {
                        var s = b.CSS.setPropertyValue(r, e, i);
                        "transform" === s[0] && b.CSS.flushTransformCache(r), a = s
                    }
                }), a
            };
            var C = function() {
                function t() {
                    return s ? P.promise || null : l
                }

                function a() {
                    function t() {
                        function t(t, e) {
                            var i = n,
                                a = n,
                                o = n;
                            return v.isArray(t) ? (i = t[0], !v.isArray(t[1]) && /^[\d-]/.test(t[1]) || v.isFunction(t[1]) || x.RegEx.isHex.test(t[1]) ? o = t[1] : (v.isString(t[1]) && !x.RegEx.isHex.test(t[1]) || v.isArray(t[1])) && (a = e ? t[1] : u(t[1], s.duration), t[2] !== n && (o = t[2]))) : i = t, e || (a = a || s.easing), v.isFunction(i) && (i = i.call(r, S, k)), v.isFunction(o) && (o = o.call(r, S, k)), [i || 0, a, o]
                        }

                        function d(t, e) {
                            var i, n;
                            return n = (e || "0").toString().toLowerCase().replace(/[%A-z]+$/, function(t) {
                                return i = t, ""
                            }), i || (i = x.Values.getUnitType(t)), [n, i]
                        }

                        function f() {
                            var t = {
                                    myParent: r.parentNode || i.body,
                                    position: x.getPropertyValue(r, "position"),
                                    fontSize: x.getPropertyValue(r, "fontSize")
                                },
                                n = t.position === V.lastPosition && t.myParent === V.lastParent,
                                a = t.fontSize === V.lastFontSize;
                            V.lastParent = t.myParent, V.lastPosition = t.position, V.lastFontSize = t.fontSize;
                            var s = 100,
                                l = {};
                            if (a && n) l.emToPx = V.lastEmToPx, l.percentToPxWidth = V.lastPercentToPxWidth, l.percentToPxHeight = V.lastPercentToPxHeight;
                            else {
                                var u = o(r).isSVG ? i.createElementNS("http://www.w3.org/2000/svg", "rect") : i.createElement("div");
                                b.init(u), t.myParent.appendChild(u), p.each(["overflow", "overflowX", "overflowY"], function(t, e) {
                                    b.CSS.setPropertyValue(u, e, "hidden")
                                }), b.CSS.setPropertyValue(u, "position", t.position), b.CSS.setPropertyValue(u, "fontSize", t.fontSize), b.CSS.setPropertyValue(u, "boxSizing", "content-box"), p.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], function(t, e) {
                                    b.CSS.setPropertyValue(u, e, s + "%")
                                }), b.CSS.setPropertyValue(u, "paddingLeft", s + "em"), l.percentToPxWidth = V.lastPercentToPxWidth = (parseFloat(x.getPropertyValue(u, "width", null, !0)) || 1) / s, l.percentToPxHeight = V.lastPercentToPxHeight = (parseFloat(x.getPropertyValue(u, "height", null, !0)) || 1) / s, l.emToPx = V.lastEmToPx = (parseFloat(x.getPropertyValue(u, "paddingLeft")) || 1) / s, t.myParent.removeChild(u)
                            }
                            return null === V.remToPx && (V.remToPx = parseFloat(x.getPropertyValue(i.body, "fontSize")) || 16), null === V.vwToPx && (V.vwToPx = parseFloat(e.innerWidth) / 100, V.vhToPx = parseFloat(e.innerHeight) / 100), l.remToPx = V.remToPx, l.vwToPx = V.vwToPx, l.vhToPx = V.vhToPx, b.debug >= 1 && console.log("Unit ratios: " + JSON.stringify(l), r), l
                        }
                        if (s.begin && 0 === S) try {
                            s.begin.call(h, h)
                        } catch (m) {
                            setTimeout(function() {
                                throw m
                            }, 1)
                        }
                        if ("scroll" === A) {
                            var w, C, T, O = /^x$/i.test(s.axis) ? "Left" : "Top",
                                E = parseFloat(s.offset) || 0;
                            s.container ? v.isWrapped(s.container) || v.isNode(s.container) ? (s.container = s.container[0] || s.container, w = s.container["scroll" + O], T = w + p(r).position()[O.toLowerCase()] + E) : s.container = null : (w = b.State.scrollAnchor[b.State["scrollProperty" + O]], C = b.State.scrollAnchor[b.State["scrollProperty" + ("Left" === O ? "Top" : "Left")]], T = p(r).offset()[O.toLowerCase()] + E), l = {
                                scroll: {
                                    rootPropertyValue: !1,
                                    startValue: w,
                                    currentValue: w,
                                    endValue: T,
                                    unitType: "",
                                    easing: s.easing,
                                    scrollData: {
                                        container: s.container,
                                        direction: O,
                                        alternateValue: C
                                    }
                                },
                                element: r
                            }, b.debug && console.log("tweensContainer (scroll): ", l.scroll, r)
                        } else if ("reverse" === A) {
                            if (!o(r).tweensContainer) return void p.dequeue(r, s.queue);
                            "none" === o(r).opts.display && (o(r).opts.display = "auto"), "hidden" === o(r).opts.visibility && (o(r).opts.visibility = "visible"), o(r).opts.loop = !1, o(r).opts.begin = null, o(r).opts.complete = null, y.easing || delete s.easing, y.duration || delete s.duration, s = p.extend({}, o(r).opts, s);
                            var q = p.extend(!0, {}, o(r).tweensContainer);
                            for (var M in q)
                                if ("element" !== M) {
                                    var I = q[M].startValue;
                                    q[M].startValue = q[M].currentValue = q[M].endValue, q[M].endValue = I, v.isEmptyObject(y) || (q[M].easing = s.easing), b.debug && console.log("reverse tweensContainer (" + M + "): " + JSON.stringify(q[M]), r)
                                }
                            l = q
                        } else if ("start" === A) {
                            var q;
                            o(r).tweensContainer && o(r).isAnimating === !0 && (q = o(r).tweensContainer), p.each(g, function(e, i) {
                                if (RegExp("^" + x.Lists.colors.join("$|^") + "$").test(e)) {
                                    var a = t(i, !0),
                                        r = a[0],
                                        o = a[1],
                                        s = a[2];
                                    if (x.RegEx.isHex.test(r)) {
                                        for (var l = ["Red", "Green", "Blue"], u = x.Values.hexToRgb(r), c = s ? x.Values.hexToRgb(s) : n, d = 0; d < l.length; d++) {
                                            var p = [u[d]];
                                            o && p.push(o), c !== n && p.push(c[d]), g[e + l[d]] = p
                                        }
                                        delete g[e]
                                    }
                                }
                            });
                            for (var _ in g) {
                                var $ = t(g[_]),
                                    D = $[0],
                                    Q = $[1],
                                    L = $[2];
                                _ = x.Names.camelCase(_);
                                var z = x.Hooks.getRoot(_),
                                    F = !1;
                                if (o(r).isSVG || "tween" === z || x.Names.prefixCheck(z)[1] !== !1 || x.Normalizations.registered[z] !== n) {
                                    (s.display !== n && null !== s.display && "none" !== s.display || s.visibility !== n && "hidden" !== s.visibility) && /opacity|filter/.test(_) && !L && 0 !== D && (L = 0), s._cacheValues && q && q[_] ? (L === n && (L = q[_].endValue + q[_].unitType), F = o(r).rootPropertyValueCache[z]) : x.Hooks.registered[_] ? L === n ? (F = x.getPropertyValue(r, z), L = x.getPropertyValue(r, _, F)) : F = x.Hooks.templates[z][1] : L === n && (L = x.getPropertyValue(r, _));
                                    var N, W, R, H = !1;
                                    if (N = d(_, L), L = N[0], R = N[1], N = d(_, D), D = N[0].replace(/^([+-\/*])=/, function(t, e) {
                                            return H = e, ""
                                        }), W = N[1], L = parseFloat(L) || 0, D = parseFloat(D) || 0, "%" === W && (/^(fontSize|lineHeight)$/.test(_) ? (D /= 100, W = "em") : /^scale/.test(_) ? (D /= 100, W = "") : /(Red|Green|Blue)$/i.test(_) && (D = D / 100 * 255, W = "")), /[\/*]/.test(H)) W = R;
                                    else if (R !== W && 0 !== L)
                                        if (0 === D) W = R;
                                        else {
                                            a = a || f();
                                            var X = /margin|padding|left|right|width|text|word|letter/i.test(_) || /X$/.test(_) || "x" === _ ? "x" : "y";
                                            switch (R) {
                                                case "%":
                                                    L *= "x" === X ? a.percentToPxWidth : a.percentToPxHeight;
                                                    break;
                                                case "px":
                                                    break;
                                                default:
                                                    L *= a[R + "ToPx"]
                                            }
                                            switch (W) {
                                                case "%":
                                                    L *= 1 / ("x" === X ? a.percentToPxWidth : a.percentToPxHeight);
                                                    break;
                                                case "px":
                                                    break;
                                                default:
                                                    L *= 1 / a[W + "ToPx"]
                                            }
                                        }
                                    switch (H) {
                                        case "+":
                                            D = L + D;
                                            break;
                                        case "-":
                                            D = L - D;
                                            break;
                                        case "*":
                                            D = L * D;
                                            break;
                                        case "/":
                                            D = L / D
                                    }
                                    l[_] = {
                                        rootPropertyValue: F,
                                        startValue: L,
                                        currentValue: L,
                                        endValue: D,
                                        unitType: W,
                                        easing: Q
                                    }, b.debug && console.log("tweensContainer (" + _ + "): " + JSON.stringify(l[_]), r)
                                } else b.debug && console.log("Skipping [" + z + "] due to a lack of browser support.")
                            }
                            l.element = r
                        }
                        l.element && (x.Values.addClass(r, "velocity-animating"), j.push(l), "" === s.queue && (o(r).tweensContainer = l, o(r).opts = s), o(r).isAnimating = !0, S === k - 1 ? (b.State.calls.push([j, h, s, null, P.resolver]), b.State.isTicking === !1 && (b.State.isTicking = !0, c())) : S++)
                    }
                    var a, r = this,
                        s = p.extend({}, b.defaults, y),
                        l = {};
                    switch (o(r) === n && b.init(r), parseFloat(s.delay) && s.queue !== !1 && p.queue(r, s.queue, function(t) {
                        b.velocityQueueEntryFlag = !0, o(r).delayTimer = {
                            setTimeout: setTimeout(t, parseFloat(s.delay)),
                            next: t
                        }
                    }), s.duration.toString().toLowerCase()) {
                        case "fast":
                            s.duration = 200;
                            break;
                        case "normal":
                            s.duration = m;
                            break;
                        case "slow":
                            s.duration = 600;
                            break;
                        default:
                            s.duration = parseFloat(s.duration) || 1
                    }
                    b.mock !== !1 && (b.mock === !0 ? s.duration = s.delay = 1 : (s.duration *= parseFloat(b.mock) || 1, s.delay *= parseFloat(b.mock) || 1)), s.easing = u(s.easing, s.duration), s.begin && !v.isFunction(s.begin) && (s.begin = null), s.progress && !v.isFunction(s.progress) && (s.progress = null), s.complete && !v.isFunction(s.complete) && (s.complete = null), s.display !== n && null !== s.display && (s.display = s.display.toString().toLowerCase(), "auto" === s.display && (s.display = b.CSS.Values.getDisplayType(r))), s.visibility !== n && null !== s.visibility && (s.visibility = s.visibility.toString().toLowerCase()), s.mobileHA = s.mobileHA && b.State.isMobile && !b.State.isGingerbread, s.queue === !1 ? s.delay ? setTimeout(t, s.delay) : t() : p.queue(r, s.queue, function(e, i) {
                        return i === !0 ? (P.promise && P.resolver(h), !0) : (b.velocityQueueEntryFlag = !0, void t(e))
                    }), "" !== s.queue && "fx" !== s.queue || "inprogress" === p.queue(r)[0] || p.dequeue(r)
                }
                var s, l, f, h, g, y, w = arguments[0] && (arguments[0].p || p.isPlainObject(arguments[0].properties) && !arguments[0].properties.names || v.isString(arguments[0].properties));
                if (v.isWrapped(this) ? (s = !1, f = 0, h = this, l = this) : (s = !0, f = 1, h = w ? arguments[0].elements || arguments[0].e : arguments[0]), h = r(h)) {
                    w ? (g = arguments[0].properties || arguments[0].p, y = arguments[0].options || arguments[0].o) : (g = arguments[f], y = arguments[f + 1]);
                    var k = h.length,
                        S = 0;
                    if (!/^(stop|finish)$/i.test(g) && !p.isPlainObject(y)) {
                        var T = f + 1;
                        y = {};
                        for (var O = T; O < arguments.length; O++) v.isArray(arguments[O]) || !/^(fast|normal|slow)$/i.test(arguments[O]) && !/^\d/.test(arguments[O]) ? v.isString(arguments[O]) || v.isArray(arguments[O]) ? y.easing = arguments[O] : v.isFunction(arguments[O]) && (y.complete = arguments[O]) : y.duration = arguments[O]
                    }
                    var P = {
                        promise: null,
                        resolver: null,
                        rejecter: null
                    };
                    s && b.Promise && (P.promise = new b.Promise(function(t, e) {
                        P.resolver = t, P.rejecter = e
                    }));
                    var A;
                    switch (g) {
                        case "scroll":
                            A = "scroll";
                            break;
                        case "reverse":
                            A = "reverse";
                            break;
                        case "finish":
                        case "stop":
                            p.each(h, function(t, e) {
                                o(e) && o(e).delayTimer && (clearTimeout(o(e).delayTimer.setTimeout), o(e).delayTimer.next && o(e).delayTimer.next(), delete o(e).delayTimer)
                            });
                            var E = [];
                            return p.each(b.State.calls, function(t, e) {
                                e && p.each(e[1], function(i, a) {
                                    var r = y === n ? "" : y;
                                    return r === !0 || e[2].queue === r || y === n && e[2].queue === !1 ? void p.each(h, function(i, n) {
                                        n === a && ((y === !0 || v.isString(y)) && (p.each(p.queue(n, v.isString(y) ? y : ""), function(t, e) {
                                            v.isFunction(e) && e(null, !0)
                                        }), p.queue(n, v.isString(y) ? y : "", [])), "stop" === g ? (o(n) && o(n).tweensContainer && r !== !1 && p.each(o(n).tweensContainer, function(t, e) {
                                            e.endValue = e.currentValue
                                        }), E.push(t)) : "finish" === g && (e[2].duration = 1))
                                    }) : !0
                                })
                            }), "stop" === g && (p.each(E, function(t, e) {
                                d(e, !0)
                            }), P.promise && P.resolver(h)), t();
                        default:
                            if (!p.isPlainObject(g) || v.isEmptyObject(g)) {
                                if (v.isString(g) && b.Redirects[g]) {
                                    var q = p.extend({}, y),
                                        M = q.duration,
                                        I = q.delay || 0;
                                    return q.backwards === !0 && (h = p.extend(!0, [], h).reverse()), p.each(h, function(t, e) {
                                        parseFloat(q.stagger) ? q.delay = I + parseFloat(q.stagger) * t : v.isFunction(q.stagger) && (q.delay = I + q.stagger.call(e, t, k)), q.drag && (q.duration = parseFloat(M) || (/^(callout|transition)/.test(g) ? 1e3 : m), q.duration = Math.max(q.duration * (q.backwards ? 1 - t / k : (t + 1) / k), .75 * q.duration, 200)), b.Redirects[g].call(e, e, q || {}, t, k, h, P.promise ? P : n)
                                    }), t()
                                }
                                var _ = "Velocity: First argument (" + g + ") was not a property map, a known action, or a registered redirect. Aborting.";
                                return P.promise ? P.rejecter(new Error(_)) : console.log(_), t()
                            }
                            A = "start"
                    }
                    var V = {
                            lastParent: null,
                            lastPosition: null,
                            lastFontSize: null,
                            lastPercentToPxWidth: null,
                            lastPercentToPxHeight: null,
                            lastEmToPx: null,
                            remToPx: null,
                            vwToPx: null,
                            vhToPx: null
                        },
                        j = [];
                    p.each(h, function(t, e) {
                        v.isNode(e) && a.call(e)
                    });
                    var $, q = p.extend({}, b.defaults, y);
                    if (q.loop = parseInt(q.loop), $ = 2 * q.loop - 1, q.loop)
                        for (var D = 0; $ > D; D++) {
                            var Q = {
                                delay: q.delay,
                                progress: q.progress
                            };
                            D === $ - 1 && (Q.display = q.display, Q.visibility = q.visibility, Q.complete = q.complete), C(h, "reverse", Q)
                        }
                    return t()
                }
            };
            b = p.extend(C, b), b.animate = C;
            var k = e.requestAnimationFrame || h;
            return b.State.isMobile || i.hidden === n || i.addEventListener("visibilitychange", function() {
                i.hidden ? (k = function(t) {
                    return setTimeout(function() {
                        t(!0)
                    }, 16)
                }, c()) : k = e.requestAnimationFrame || h
            }), t.Velocity = b, t !== e && (t.fn.velocity = C, t.fn.velocity.defaults = b.defaults), p.each(["Down", "Up"], function(t, e) {
                b.Redirects["slide" + e] = function(t, i, a, r, o, s) {
                    var l = p.extend({}, i),
                        u = l.begin,
                        c = l.complete,
                        d = {
                            height: "",
                            marginTop: "",
                            marginBottom: "",
                            paddingTop: "",
                            paddingBottom: ""
                        },
                        f = {};
                    l.display === n && (l.display = "Down" === e ? "inline" === b.CSS.Values.getDisplayType(t) ? "inline-block" : "block" : "none"), l.begin = function() {
                        u && u.call(o, o);
                        for (var i in d) {
                            f[i] = t.style[i];
                            var n = b.CSS.getPropertyValue(t, i);
                            d[i] = "Down" === e ? [n, 0] : [0, n]
                        }
                        f.overflow = t.style.overflow, t.style.overflow = "hidden"
                    }, l.complete = function() {
                        for (var e in f) t.style[e] = f[e];
                        c && c.call(o, o), s && s.resolver(o)
                    }, b(t, d, l)
                }
            }), p.each(["In", "Out"], function(t, e) {
                b.Redirects["fade" + e] = function(t, i, a, r, o, s) {
                    var l = p.extend({}, i),
                        u = {
                            opacity: "In" === e ? 1 : 0
                        },
                        c = l.complete;
                    l.complete = a !== r - 1 ? l.begin = null : function() {
                        c && c.call(o, o), s && s.resolver(o)
                    }, l.display === n && (l.display = "In" === e ? "auto" : "none"), b(this, u, l)
                }
            }), b
        }(window.jQuery || window.Zepto || window, window, document)
    }), ! function(t, e, i, n) {
        "use strict";

        function a(t, e, i) {
            return setTimeout(c(t, i), e)
        }

        function r(t, e, i) {
            return Array.isArray(t) ? (o(t, i[e], i), !0) : !1
        }

        function o(t, e, i) {
            var a;
            if (t)
                if (t.forEach) t.forEach(e, i);
                else if (t.length !== n)
                for (a = 0; a < t.length;) e.call(i, t[a], a, t), a++;
            else
                for (a in t) t.hasOwnProperty(a) && e.call(i, t[a], a, t)
        }

        function s(t, e, i) {
            for (var a = Object.keys(e), r = 0; r < a.length;)(!i || i && t[a[r]] === n) && (t[a[r]] = e[a[r]]), r++;
            return t
        }

        function l(t, e) {
            return s(t, e, !0)
        }

        function u(t, e, i) {
            var n, a = e.prototype;
            n = t.prototype = Object.create(a), n.constructor = t, n._super = a, i && s(n, i)
        }

        function c(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        }

        function d(t, e) {
            return typeof t == ce ? t.apply(e ? e[0] || n : n, e) : t
        }

        function p(t, e) {
            return t === n ? e : t
        }

        function f(t, e, i) {
            o(m(e), function(e) {
                t.addEventListener(e, i, !1)
            })
        }

        function h(t, e, i) {
            o(m(e), function(e) {
                t.removeEventListener(e, i, !1)
            })
        }

        function v(t, e) {
            for (; t;) {
                if (t == e) return !0;
                t = t.parentNode
            }
            return !1
        }

        function g(t, e) {
            return t.indexOf(e) > -1
        }

        function m(t) {
            return t.trim().split(/\s+/g)
        }

        function y(t, e, i) {
            if (t.indexOf && !i) return t.indexOf(e);
            for (var n = 0; n < t.length;) {
                if (i && t[n][i] == e || !i && t[n] === e) return n;
                n++
            }
            return -1
        }

        function b(t) {
            return Array.prototype.slice.call(t, 0)
        }

        function w(t, e, i) {
            for (var n = [], a = [], r = 0; r < t.length;) {
                var o = e ? t[r][e] : t[r];
                y(a, o) < 0 && n.push(t[r]), a[r] = o, r++
            }
            return i && (n = e ? n.sort(function(t, i) {
                return t[e] > i[e]
            }) : n.sort()), n
        }

        function x(t, e) {
            for (var i, a, r = e[0].toUpperCase() + e.slice(1), o = 0; o < le.length;) {
                if (i = le[o], a = i ? i + r : e, a in t) return a;
                o++
            }
            return n
        }

        function C() {
            return he++
        }

        function k(t) {
            var e = t.ownerDocument;
            return e.defaultView || e.parentWindow
        }

        function S(t, e) {
            var i = this;
            this.manager = t, this.callback = e, this.element = t.element, this.target = t.options.inputTarget, this.domHandler = function(e) {
                d(t.options.enable, [t]) && i.handler(e)
            }, this.init()
        }

        function T(t) {
            var e, i = t.options.inputClass;
            return new(e = i ? i : me ? L : ye ? N : ge ? R : Q)(t, O)
        }

        function O(t, e, i) {
            var n = i.pointers.length,
                a = i.changedPointers.length,
                r = e & Se && 0 === n - a,
                o = e & (Oe | Pe) && 0 === n - a;
            i.isFirst = !!r, i.isFinal = !!o, r && (t.session = {}), i.eventType = e, P(t, i), t.emit("hammer.input", i), t.recognize(i), t.session.prevInput = i
        }

        function P(t, e) {
            var i = t.session,
                n = e.pointers,
                a = n.length;
            i.firstInput || (i.firstInput = q(e)), a > 1 && !i.firstMultiple ? i.firstMultiple = q(e) : 1 === a && (i.firstMultiple = !1);
            var r = i.firstInput,
                o = i.firstMultiple,
                s = o ? o.center : r.center,
                l = e.center = M(n);
            e.timeStamp = fe(), e.deltaTime = e.timeStamp - r.timeStamp, e.angle = j(s, l), e.distance = V(s, l), A(i, e), e.offsetDirection = _(e.deltaX, e.deltaY), e.scale = o ? D(o.pointers, n) : 1, e.rotation = o ? $(o.pointers, n) : 0, E(i, e);
            var u = t.element;
            v(e.srcEvent.target, u) && (u = e.srcEvent.target), e.target = u
        }

        function A(t, e) {
            var i = e.center,
                n = t.offsetDelta || {},
                a = t.prevDelta || {},
                r = t.prevInput || {};
            (e.eventType === Se || r.eventType === Oe) && (a = t.prevDelta = {
                x: r.deltaX || 0,
                y: r.deltaY || 0
            }, n = t.offsetDelta = {
                x: i.x,
                y: i.y
            }), e.deltaX = a.x + (i.x - n.x), e.deltaY = a.y + (i.y - n.y)
        }

        function E(t, e) {
            var i, a, r, o, s = t.lastInterval || e,
                l = e.timeStamp - s.timeStamp;
            if (e.eventType != Pe && (l > ke || s.velocity === n)) {
                var u = s.deltaX - e.deltaX,
                    c = s.deltaY - e.deltaY,
                    d = I(l, u, c);
                a = d.x, r = d.y, i = pe(d.x) > pe(d.y) ? d.x : d.y, o = _(u, c), t.lastInterval = e
            } else i = s.velocity, a = s.velocityX, r = s.velocityY, o = s.direction;
            e.velocity = i, e.velocityX = a, e.velocityY = r, e.direction = o
        }

        function q(t) {
            for (var e = [], i = 0; i < t.pointers.length;) e[i] = {
                clientX: de(t.pointers[i].clientX),
                clientY: de(t.pointers[i].clientY)
            }, i++;
            return {
                timeStamp: fe(),
                pointers: e,
                center: M(e),
                deltaX: t.deltaX,
                deltaY: t.deltaY
            }
        }

        function M(t) {
            var e = t.length;
            if (1 === e) return {
                x: de(t[0].clientX),
                y: de(t[0].clientY)
            };
            for (var i = 0, n = 0, a = 0; e > a;) i += t[a].clientX, n += t[a].clientY, a++;
            return {
                x: de(i / e),
                y: de(n / e)
            }
        }

        function I(t, e, i) {
            return {
                x: e / t || 0,
                y: i / t || 0
            }
        }

        function _(t, e) {
            return t === e ? Ae : pe(t) >= pe(e) ? t > 0 ? Ee : qe : e > 0 ? Me : Ie
        }

        function V(t, e, i) {
            i || (i = $e);
            var n = e[i[0]] - t[i[0]],
                a = e[i[1]] - t[i[1]];
            return Math.sqrt(n * n + a * a)
        }

        function j(t, e, i) {
            i || (i = $e);
            var n = e[i[0]] - t[i[0]],
                a = e[i[1]] - t[i[1]];
            return 180 * Math.atan2(a, n) / Math.PI
        }

        function $(t, e) {
            return j(e[1], e[0], De) - j(t[1], t[0], De)
        }

        function D(t, e) {
            return V(e[0], e[1], De) / V(t[0], t[1], De)
        }

        function Q() {
            this.evEl = Le, this.evWin = ze, this.allow = !0, this.pressed = !1, S.apply(this, arguments)
        }

        function L() {
            this.evEl = We, this.evWin = Re, S.apply(this, arguments), this.store = this.manager.session.pointerEvents = []
        }

        function z() {
            this.evTarget = Xe, this.evWin = Ye, this.started = !1, S.apply(this, arguments)
        }

        function F(t, e) {
            var i = b(t.touches),
                n = b(t.changedTouches);
            return e & (Oe | Pe) && (i = w(i.concat(n), "identifier", !0)), [i, n]
        }

        function N() {
            this.evTarget = Ge, this.targetIds = {}, S.apply(this, arguments)
        }

        function W(t, e) {
            var i = b(t.touches),
                n = this.targetIds;
            if (e & (Se | Te) && 1 === i.length) return n[i[0].identifier] = !0, [i, i];
            var a, r, o = b(t.changedTouches),
                s = [],
                l = this.target;
            if (r = i.filter(function(t) {
                    return v(t.target, l)
                }), e === Se)
                for (a = 0; a < r.length;) n[r[a].identifier] = !0, a++;
            for (a = 0; a < o.length;) n[o[a].identifier] && s.push(o[a]), e & (Oe | Pe) && delete n[o[a].identifier], a++;
            return s.length ? [w(r.concat(s), "identifier", !0), s] : void 0
        }

        function R() {
            S.apply(this, arguments);
            var t = c(this.handler, this);
            this.touch = new N(this.manager, t), this.mouse = new Q(this.manager, t)
        }

        function H(t, e) {
            this.manager = t, this.set(e)
        }

        function X(t) {
            if (g(t, ei)) return ei;
            var e = g(t, ii),
                i = g(t, ni);
            return e && i ? ii + " " + ni : e || i ? e ? ii : ni : g(t, ti) ? ti : Ke
        }

        function Y(t) {
            this.id = C(), this.manager = null, this.options = l(t || {}, this.defaults), this.options.enable = p(this.options.enable, !0), this.state = ai, this.simultaneous = {}, this.requireFail = []
        }

        function B(t) {
            return t & ui ? "cancel" : t & si ? "end" : t & oi ? "move" : t & ri ? "start" : ""
        }

        function G(t) {
            return t == Ie ? "down" : t == Me ? "up" : t == Ee ? "left" : t == qe ? "right" : ""
        }

        function U(t, e) {
            var i = e.manager;
            return i ? i.get(t) : t
        }

        function Z() {
            Y.apply(this, arguments)
        }

        function J() {
            Z.apply(this, arguments), this.pX = null, this.pY = null
        }

        function K() {
            Z.apply(this, arguments)
        }

        function te() {
            Y.apply(this, arguments), this._timer = null, this._input = null
        }

        function ee() {
            Z.apply(this, arguments)
        }

        function ie() {
            Z.apply(this, arguments)
        }

        function ne() {
            Y.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0
        }

        function ae(t, e) {
            return e = e || {}, e.recognizers = p(e.recognizers, ae.defaults.preset), new re(t, e)
        }

        function re(t, e) {
            e = e || {}, this.options = l(e, ae.defaults), this.options.inputTarget = this.options.inputTarget || t, this.handlers = {}, this.session = {}, this.recognizers = [], this.element = t, this.input = T(this), this.touchAction = new H(this, this.options.touchAction), oe(this, !0), o(e.recognizers, function(t) {
                var e = this.add(new t[0](t[1]));
                t[2] && e.recognizeWith(t[2]), t[3] && e.requireFailure(t[3])
            }, this)
        }

        function oe(t, e) {
            var i = t.element;
            o(t.options.cssProps, function(t, n) {
                i.style[x(i.style, n)] = e ? t : ""
            })
        }

        function se(t, i) {
            var n = e.createEvent("Event");
            n.initEvent(t, !0, !0), n.gesture = i, i.target.dispatchEvent(n)
        }
        var le = ["", "webkit", "moz", "MS", "ms", "o"],
            ue = e.createElement("div"),
            ce = "function",
            de = Math.round,
            pe = Math.abs,
            fe = Date.now,
            he = 1,
            ve = /mobile|tablet|ip(ad|hone|od)|android/i,
            ge = "ontouchstart" in t,
            me = x(t, "PointerEvent") !== n,
            ye = ge && ve.test(navigator.userAgent),
            be = "touch",
            we = "pen",
            xe = "mouse",
            Ce = "kinect",
            ke = 25,
            Se = 1,
            Te = 2,
            Oe = 4,
            Pe = 8,
            Ae = 1,
            Ee = 2,
            qe = 4,
            Me = 8,
            Ie = 16,
            _e = Ee | qe,
            Ve = Me | Ie,
            je = _e | Ve,
            $e = ["x", "y"],
            De = ["clientX", "clientY"];
        S.prototype = {
            handler: function() {},
            init: function() {
                this.evEl && f(this.element, this.evEl, this.domHandler), this.evTarget && f(this.target, this.evTarget, this.domHandler), this.evWin && f(k(this.element), this.evWin, this.domHandler)
            },
            destroy: function() {
                this.evEl && h(this.element, this.evEl, this.domHandler), this.evTarget && h(this.target, this.evTarget, this.domHandler), this.evWin && h(k(this.element), this.evWin, this.domHandler)
            }
        };
        var Qe = {
                mousedown: Se,
                mousemove: Te,
                mouseup: Oe
            },
            Le = "mousedown",
            ze = "mousemove mouseup";
        u(Q, S, {
            handler: function(t) {
                var e = Qe[t.type];
                e & Se && 0 === t.button && (this.pressed = !0), e & Te && 1 !== t.which && (e = Oe), this.pressed && this.allow && (e & Oe && (this.pressed = !1), this.callback(this.manager, e, {
                    pointers: [t],
                    changedPointers: [t],
                    pointerType: xe,
                    srcEvent: t
                }))
            }
        });
        var Fe = {
                pointerdown: Se,
                pointermove: Te,
                pointerup: Oe,
                pointercancel: Pe,
                pointerout: Pe
            },
            Ne = {
                2: be,
                3: we,
                4: xe,
                5: Ce
            },
            We = "pointerdown",
            Re = "pointermove pointerup pointercancel";
        t.MSPointerEvent && (We = "MSPointerDown", Re = "MSPointerMove MSPointerUp MSPointerCancel"), u(L, S, {
            handler: function(t) {
                var e = this.store,
                    i = !1,
                    n = t.type.toLowerCase().replace("ms", ""),
                    a = Fe[n],
                    r = Ne[t.pointerType] || t.pointerType,
                    o = r == be,
                    s = y(e, t.pointerId, "pointerId");
                a & Se && (0 === t.button || o) ? 0 > s && (e.push(t), s = e.length - 1) : a & (Oe | Pe) && (i = !0), 0 > s || (e[s] = t, this.callback(this.manager, a, {
                    pointers: e,
                    changedPointers: [t],
                    pointerType: r,
                    srcEvent: t
                }), i && e.splice(s, 1))
            }
        });
        var He = {
                touchstart: Se,
                touchmove: Te,
                touchend: Oe,
                touchcancel: Pe
            },
            Xe = "touchstart",
            Ye = "touchstart touchmove touchend touchcancel";
        u(z, S, {
            handler: function(t) {
                var e = He[t.type];
                if (e === Se && (this.started = !0), this.started) {
                    var i = F.call(this, t, e);
                    e & (Oe | Pe) && 0 === i[0].length - i[1].length && (this.started = !1), this.callback(this.manager, e, {
                        pointers: i[0],
                        changedPointers: i[1],
                        pointerType: be,
                        srcEvent: t
                    })
                }
            }
        });
        var Be = {
                touchstart: Se,
                touchmove: Te,
                touchend: Oe,
                touchcancel: Pe
            },
            Ge = "touchstart touchmove touchend touchcancel";
        u(N, S, {
            handler: function(t) {
                var e = Be[t.type],
                    i = W.call(this, t, e);
                i && this.callback(this.manager, e, {
                    pointers: i[0],
                    changedPointers: i[1],
                    pointerType: be,
                    srcEvent: t
                })
            }
        }), u(R, S, {
            handler: function(t, e, i) {
                var n = i.pointerType == be,
                    a = i.pointerType == xe;
                if (n) this.mouse.allow = !1;
                else if (a && !this.mouse.allow) return;
                e & (Oe | Pe) && (this.mouse.allow = !0), this.callback(t, e, i)
            },
            destroy: function() {
                this.touch.destroy(), this.mouse.destroy()
            }
        });
        var Ue = x(ue.style, "touchAction"),
            Ze = Ue !== n,
            Je = "compute",
            Ke = "auto",
            ti = "manipulation",
            ei = "none",
            ii = "pan-x",
            ni = "pan-y";
        H.prototype = {
            set: function(t) {
                t == Je && (t = this.compute()), Ze && (this.manager.element.style[Ue] = t), this.actions = t.toLowerCase().trim()
            },
            update: function() {
                this.set(this.manager.options.touchAction)
            },
            compute: function() {
                var t = [];
                return o(this.manager.recognizers, function(e) {
                    d(e.options.enable, [e]) && (t = t.concat(e.getTouchAction()))
                }), X(t.join(" "))
            },
            preventDefaults: function(t) {
                if (!Ze) {
                    var e = t.srcEvent,
                        i = t.offsetDirection;
                    if (this.manager.session.prevented) return void e.preventDefault();
                    var n = this.actions,
                        a = g(n, ei),
                        r = g(n, ni),
                        o = g(n, ii);
                    return a || r && i & _e || o && i & Ve ? this.preventSrc(e) : void 0
                }
            },
            preventSrc: function(t) {
                this.manager.session.prevented = !0, t.preventDefault()
            }
        };
        var ai = 1,
            ri = 2,
            oi = 4,
            si = 8,
            li = si,
            ui = 16,
            ci = 32;
        Y.prototype = {
            defaults: {},
            set: function(t) {
                return s(this.options, t), this.manager && this.manager.touchAction.update(), this
            },
            recognizeWith: function(t) {
                if (r(t, "recognizeWith", this)) return this;
                var e = this.simultaneous;
                return t = U(t, this), e[t.id] || (e[t.id] = t, t.recognizeWith(this)), this
            },
            dropRecognizeWith: function(t) {
                return r(t, "dropRecognizeWith", this) ? this : (t = U(t, this), delete this.simultaneous[t.id], this)
            },
            requireFailure: function(t) {
                if (r(t, "requireFailure", this)) return this;
                var e = this.requireFail;
                return t = U(t, this), -1 === y(e, t) && (e.push(t), t.requireFailure(this)), this
            },
            dropRequireFailure: function(t) {
                if (r(t, "dropRequireFailure", this)) return this;
                t = U(t, this);
                var e = y(this.requireFail, t);
                return e > -1 && this.requireFail.splice(e, 1), this
            },
            hasRequireFailures: function() {
                return this.requireFail.length > 0
            },
            canRecognizeWith: function(t) {
                return !!this.simultaneous[t.id]
            },
            emit: function(t) {
                function e(e) {
                    i.manager.emit(i.options.event + (e ? B(n) : ""), t)
                }
                var i = this,
                    n = this.state;
                si > n && e(!0), e(), n >= si && e(!0)
            },
            tryEmit: function(t) {
                return this.canEmit() ? this.emit(t) : void(this.state = ci)
            },
            canEmit: function() {
                for (var t = 0; t < this.requireFail.length;) {
                    if (!(this.requireFail[t].state & (ci | ai))) return !1;
                    t++
                }
                return !0
            },
            recognize: function(t) {
                var e = s({}, t);
                return d(this.options.enable, [this, e]) ? (this.state & (li | ui | ci) && (this.state = ai), this.state = this.process(e), void(this.state & (ri | oi | si | ui) && this.tryEmit(e))) : (this.reset(), void(this.state = ci))
            },
            process: function() {},
            getTouchAction: function() {},
            reset: function() {}
        }, u(Z, Y, {
            defaults: {
                pointers: 1
            },
            attrTest: function(t) {
                var e = this.options.pointers;
                return 0 === e || t.pointers.length === e
            },
            process: function(t) {
                var e = this.state,
                    i = t.eventType,
                    n = e & (ri | oi),
                    a = this.attrTest(t);
                return n && (i & Pe || !a) ? e | ui : n || a ? i & Oe ? e | si : e & ri ? e | oi : ri : ci
            }
        }), u(J, Z, {
            defaults: {
                event: "pan",
                threshold: 10,
                pointers: 1,
                direction: je
            },
            getTouchAction: function() {
                var t = this.options.direction,
                    e = [];
                return t & _e && e.push(ni), t & Ve && e.push(ii), e
            },
            directionTest: function(t) {
                var e = this.options,
                    i = !0,
                    n = t.distance,
                    a = t.direction,
                    r = t.deltaX,
                    o = t.deltaY;
                return a & e.direction || (e.direction & _e ? (a = 0 === r ? Ae : 0 > r ? Ee : qe, i = r != this.pX, n = Math.abs(t.deltaX)) : (a = 0 === o ? Ae : 0 > o ? Me : Ie, i = o != this.pY, n = Math.abs(t.deltaY))), t.direction = a, i && n > e.threshold && a & e.direction
            },
            attrTest: function(t) {
                return Z.prototype.attrTest.call(this, t) && (this.state & ri || !(this.state & ri) && this.directionTest(t))
            },
            emit: function(t) {
                this.pX = t.deltaX, this.pY = t.deltaY;
                var e = G(t.direction);
                e && this.manager.emit(this.options.event + e, t), this._super.emit.call(this, t)
            }
        }), u(K, Z, {
            defaults: {
                event: "pinch",
                threshold: 0,
                pointers: 2
            },
            getTouchAction: function() {
                return [ei]
            },
            attrTest: function(t) {
                return this._super.attrTest.call(this, t) && (Math.abs(t.scale - 1) > this.options.threshold || this.state & ri)
            },
            emit: function(t) {
                if (this._super.emit.call(this, t), 1 !== t.scale) {
                    var e = t.scale < 1 ? "in" : "out";
                    this.manager.emit(this.options.event + e, t)
                }
            }
        }), u(te, Y, {
            defaults: {
                event: "press",
                pointers: 1,
                time: 500,
                threshold: 5
            },
            getTouchAction: function() {
                return [Ke]
            },
            process: function(t) {
                var e = this.options,
                    i = t.pointers.length === e.pointers,
                    n = t.distance < e.threshold,
                    r = t.deltaTime > e.time;
                if (this._input = t, !n || !i || t.eventType & (Oe | Pe) && !r) this.reset();
                else if (t.eventType & Se) this.reset(), this._timer = a(function() {
                    this.state = li, this.tryEmit()
                }, e.time, this);
                else if (t.eventType & Oe) return li;
                return ci
            },
            reset: function() {
                clearTimeout(this._timer)
            },
            emit: function(t) {
                this.state === li && (t && t.eventType & Oe ? this.manager.emit(this.options.event + "up", t) : (this._input.timeStamp = fe(), this.manager.emit(this.options.event, this._input)))
            }
        }), u(ee, Z, {
            defaults: {
                event: "rotate",
                threshold: 0,
                pointers: 2
            },
            getTouchAction: function() {
                return [ei]
            },
            attrTest: function(t) {
                return this._super.attrTest.call(this, t) && (Math.abs(t.rotation) > this.options.threshold || this.state & ri)
            }
        }), u(ie, Z, {
            defaults: {
                event: "swipe",
                threshold: 10,
                velocity: .65,
                direction: _e | Ve,
                pointers: 1
            },
            getTouchAction: function() {
                return J.prototype.getTouchAction.call(this)
            },
            attrTest: function(t) {
                var e, i = this.options.direction;
                return i & (_e | Ve) ? e = t.velocity : i & _e ? e = t.velocityX : i & Ve && (e = t.velocityY), this._super.attrTest.call(this, t) && i & t.direction && t.distance > this.options.threshold && pe(e) > this.options.velocity && t.eventType & Oe
            },
            emit: function(t) {
                var e = G(t.direction);
                e && this.manager.emit(this.options.event + e, t), this.manager.emit(this.options.event, t)
            }
        }), u(ne, Y, {
            defaults: {
                event: "tap",
                pointers: 1,
                taps: 1,
                interval: 300,
                time: 250,
                threshold: 2,
                posThreshold: 10
            },
            getTouchAction: function() {
                return [ti]
            },
            process: function(t) {
                var e = this.options,
                    i = t.pointers.length === e.pointers,
                    n = t.distance < e.threshold,
                    r = t.deltaTime < e.time;
                if (this.reset(), t.eventType & Se && 0 === this.count) return this.failTimeout();
                if (n && r && i) {
                    if (t.eventType != Oe) return this.failTimeout();
                    var o = this.pTime ? t.timeStamp - this.pTime < e.interval : !0,
                        s = !this.pCenter || V(this.pCenter, t.center) < e.posThreshold;
                    this.pTime = t.timeStamp, this.pCenter = t.center, s && o ? this.count += 1 : this.count = 1, this._input = t;
                    var l = this.count % e.taps;
                    if (0 === l) return this.hasRequireFailures() ? (this._timer = a(function() {
                        this.state = li, this.tryEmit()
                    }, e.interval, this), ri) : li
                }
                return ci
            },
            failTimeout: function() {
                return this._timer = a(function() {
                    this.state = ci
                }, this.options.interval, this), ci
            },
            reset: function() {
                clearTimeout(this._timer)
            },
            emit: function() {
                this.state == li && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
            }
        }), ae.VERSION = "2.0.4", ae.defaults = {
            domEvents: !1,
            touchAction: Je,
            enable: !0,
            inputTarget: null,
            inputClass: null,
            preset: [
                [ee, {
                    enable: !1
                }],
                [K, {
                        enable: !1
                    },
                    ["rotate"]
                ],
                [ie, {
                    direction: _e
                }],
                [J, {
                        direction: _e
                    },
                    ["swipe"]
                ],
                [ne],
                [ne, {
                        event: "doubletap",
                        taps: 2
                    },
                    ["tap"]
                ],
                [te]
            ],
            cssProps: {
                userSelect: "default",
                touchSelect: "none",
                touchCallout: "none",
                contentZooming: "none",
                userDrag: "none",
                tapHighlightColor: "rgba(0,0,0,0)"
            }
        };
        var di = 1,
            pi = 2;
        re.prototype = {
            set: function(t) {
                return s(this.options, t), t.touchAction && this.touchAction.update(), t.inputTarget && (this.input.destroy(), this.input.target = t.inputTarget, this.input.init()), this
            },
            stop: function(t) {
                this.session.stopped = t ? pi : di
            },
            recognize: function(t) {
                var e = this.session;
                if (!e.stopped) {
                    this.touchAction.preventDefaults(t);
                    var i, n = this.recognizers,
                        a = e.curRecognizer;
                    (!a || a && a.state & li) && (a = e.curRecognizer = null);
                    for (var r = 0; r < n.length;) i = n[r], e.stopped === pi || a && i != a && !i.canRecognizeWith(a) ? i.reset() : i.recognize(t), !a && i.state & (ri | oi | si) && (a = e.curRecognizer = i), r++
                }
            },
            get: function(t) {
                if (t instanceof Y) return t;
                for (var e = this.recognizers, i = 0; i < e.length; i++)
                    if (e[i].options.event == t) return e[i];
                return null
            },
            add: function(t) {
                if (r(t, "add", this)) return this;
                var e = this.get(t.options.event);
                return e && this.remove(e), this.recognizers.push(t), t.manager = this, this.touchAction.update(), t
            },
            remove: function(t) {
                if (r(t, "remove", this)) return this;
                var e = this.recognizers;
                return t = this.get(t), e.splice(y(e, t), 1), this.touchAction.update(), this
            },
            on: function(t, e) {
                var i = this.handlers;
                return o(m(t), function(t) {
                    i[t] = i[t] || [], i[t].push(e)
                }), this
            },
            off: function(t, e) {
                var i = this.handlers;
                return o(m(t), function(t) {
                    e ? i[t].splice(y(i[t], e), 1) : delete i[t]
                }), this
            },
            emit: function(t, e) {
                this.options.domEvents && se(t, e);
                var i = this.handlers[t] && this.handlers[t].slice();
                if (i && i.length) {
                    e.type = t, e.preventDefault = function() {
                        e.srcEvent.preventDefault()
                    };
                    for (var n = 0; n < i.length;) i[n](e), n++
                }
            },
            destroy: function() {
                this.element && oe(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null
            }
        }, s(ae, {
            INPUT_START: Se,
            INPUT_MOVE: Te,
            INPUT_END: Oe,
            INPUT_CANCEL: Pe,
            STATE_POSSIBLE: ai,
            STATE_BEGAN: ri,
            STATE_CHANGED: oi,
            STATE_ENDED: si,
            STATE_RECOGNIZED: li,
            STATE_CANCELLED: ui,
            STATE_FAILED: ci,
            DIRECTION_NONE: Ae,
            DIRECTION_LEFT: Ee,
            DIRECTION_RIGHT: qe,
            DIRECTION_UP: Me,
            DIRECTION_DOWN: Ie,
            DIRECTION_HORIZONTAL: _e,
            DIRECTION_VERTICAL: Ve,
            DIRECTION_ALL: je,
            Manager: re,
            Input: S,
            TouchAction: H,
            TouchInput: N,
            MouseInput: Q,
            PointerEventInput: L,
            TouchMouseInput: R,
            SingleTouchInput: z,
            Recognizer: Y,
            AttrRecognizer: Z,
            Tap: ne,
            Pan: J,
            Swipe: ie,
            Pinch: K,
            Rotate: ee,
            Press: te,
            on: f,
            off: h,
            each: o,
            merge: l,
            extend: s,
            inherit: u,
            bindFn: c,
            prefixed: x
        }), typeof define == ce && define.amd ? define(function() {
            return ae
        }) : "undefined" != typeof module && module.exports ? module.exports = ae : t[i] = ae
    }(window, document, "Hammer"),
    function(t) {
        "function" == typeof define && define.amd ? define(["jquery", "hammerjs"], t) : "object" == typeof exports ? t(require("jquery"), require("hammerjs")) : t(jQuery, Hammer)
    }(function(t, e) {
        function i(i, n) {
            var a = t(i);
            a.data("hammer") || a.data("hammer", new e(a[0], n))
        }
        t.fn.hammer = function(t) {
            return this.each(function() {
                i(this, t)
            })
        }, e.Manager.prototype.emit = function(e) {
            return function(i, n) {
                e.call(this, i, n), t(this.element).trigger({
                    type: i,
                    gesture: n
                })
            }
        }(e.Manager.prototype.emit)
    }), Materialize = {}, Materialize.guid = function() {
        function t() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
        }
        return function() {
            return t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t()
        }
    }(), Materialize.elementOrParentIsFixed = function(t) {
        var e = $(t),
            i = e.add(e.parents()),
            n = !1;
        return i.each(function() {
            return "fixed" === $(this).css("position") ? (n = !0, !1) : void 0
        }), n
    };
var Vel;
Vel = $ ? $.Velocity : Velocity,
    function(t) {
        t.fn.collapsible = function(e) {
            var i = {
                accordion: void 0
            };
            return e = t.extend(i, e), this.each(function() {
                function i(e) {
                    s = o.find("> li > .collapsible-header"), e.hasClass("active") ? e.parent().addClass("active") : e.parent().removeClass("active"), e.parent().hasClass("active") ? e.siblings(".collapsible-body").stop(!0, !1).slideDown({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            t(this).css("height", "")
                        }
                    }) : e.siblings(".collapsible-body").stop(!0, !1).slideUp({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            t(this).css("height", "")
                        }
                    }), s.not(e).removeClass("active").parent().removeClass("active"), s.not(e).parent().children(".collapsible-body").stop(!0, !1).slideUp({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            t(this).css("height", "")
                        }
                    })
                }

                function n(e) {
                    e.hasClass("active") ? e.parent().addClass("active") : e.parent().removeClass("active"), e.parent().hasClass("active") ? e.siblings(".collapsible-body").stop(!0, !1).slideDown({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            t(this).css("height", "")
                        }
                    }) : e.siblings(".collapsible-body").stop(!0, !1).slideUp({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            t(this).css("height", "")
                        }
                    })
                }

                function a(t) {
                    var e = r(t);
                    return e.length > 0
                }

                function r(t) {
                    return t.closest("li > .collapsible-header")
                }
                var o = t(this),
                    s = t(this).find("> li > .collapsible-header"),
                    l = o.data("collapsible");
                o.off("click.collapse", ".collapsible-header"), s.off("click.collapse"), e.accordion || "accordion" == l || void 0 == l ? (s = o.find("> li > .collapsible-header"), s.on("click.collapse", function(e) {
                    var n = t(e.target);
                    a(n) && (n = r(n)), n.toggleClass("active"), i(n)
                }), i(s.filter(".active").first())) : s.each(function() {
                    t(this).on("click.collapse", function(e) {
                        var i = t(e.target);
                        a(i) && (i = r(i)), i.toggleClass("active"), n(i)
                    }), t(this).hasClass("active") && n(t(this))
                })
            })
        }, t(document).ready(function() {
            t(".collapsible").collapsible()
        })
    }(jQuery),
    function(t) {
        t.fn.scrollTo = function(e) {
            return t(this).scrollTop(t(this).scrollTop() - t(this).offset().top + t(e).offset().top), this
        }, t.fn.dropdown = function(e) {
            var i = {
                inDuration: 300,
                outDuration: 225,
                constrain_width: !0,
                hover: !1,
                gutter: 0,
                belowOrigin: !1
            };
            this.each(function() {
                function n() {
                    void 0 != o.data("induration") && (s.inDuration = o.data("inDuration")), void 0 != o.data("outduration") && (s.outDuration = o.data("outDuration")), void 0 != o.data("constrainwidth") && (s.constrain_width = o.data("constrainwidth")), void 0 != o.data("hover") && (s.hover = o.data("hover")), void 0 != o.data("gutter") && (s.gutter = o.data("gutter")), void 0 != o.data("beloworigin") && (s.belowOrigin = o.data("beloworigin"))
                }

                function a() {
                    n(), l.addClass("active"), 1 == s.constrain_width && l.css("width", o.outerWidth());
                    var e = 0;
                    1 == s.belowOrigin && (e = o.height());
                    var i = o.offset().left,
                        a = 0,
                        r = s.gutter;
                    i + l.innerWidth() > t(window).width() && (a = o.innerWidth() - l.innerWidth(), r = -1 * r), l.css({
                        position: "absolute",
                        top: o.position().top + e,
                        left: o.position().left + a + r
                    }), l.stop(!0, !0).css("opacity", 0).slideDown({
                        queue: !1,
                        duration: s.inDuration,
                        easing: "easeOutCubic",
                        complete: function() {
                            t(this).css("height", "")
                        }
                    }).animate({
                        opacity: 1
                    }, {
                        queue: !1,
                        duration: s.inDuration,
                        easing: "easeOutSine"
                    })
                }

                function r() {
                    l.fadeOut(s.outDuration), l.removeClass("active")
                }
                var o = t(this),
                    s = t.extend({}, i, e),
                    l = t("#" + o.attr("data-activates"));
                if (n(), o.after(l), s.hover) {
                    var u = !1;
                    o.unbind("click." + o.attr("id")), o.on("mouseenter", function() {
                        u === !1 && (a(), u = !0)
                    }), o.on("mouseleave", function(e) {
                        t(e.toElement).closest(".dropdown-content").is(l) || (l.stop(!0, !0), r(), u = !1)
                    }), l.on("mouseleave", function(e) {
                        t(e.toElement).closest(".dropdown-button").is(o) || (l.stop(!0, !0), r(), u = !1)
                    })
                } else o.unbind("click." + o.attr("id")), o.bind("click." + o.attr("id"), function(e) {
                    o[0] == e.currentTarget && 0 === t(e.target).closest(".dropdown-content").length ? (e.preventDefault(), a()) : o.hasClass("active") && (r(), t(document).unbind("click." + l.attr("id"))), l.hasClass("active") && t(document).bind("click." + l.attr("id"), function(e) {
                        !l.is(e.target) && !o.is(e.target) && !o.find(e.target).length > 0 && (r(), t(document).unbind("click." + l.attr("id")))
                    })
                });
                o.on("open", a), o.on("close", r)
            })
        }, t(document).ready(function() {
            t(".dropdown-button").dropdown()
        })
    }(jQuery),
    function(t) {
        t.fn.extend({
            openModal: function(e) {
                var i = this,
                    n = t('<div id="lean-overlay"></div>');
                t("body").append(n);
                var a = {
                    opacity: .5,
                    in_duration: 350,
                    out_duration: 250,
                    ready: void 0,
                    complete: void 0,
                    dismissible: !0
                };
                e = t.extend(a, e), e.dismissible && (t("#lean-overlay").click(function() {
                    t(i).closeModal(e)
                }), t(document).on("keyup.leanModal", function(n) {
                    27 === n.keyCode && t(i).closeModal(e)
                })), t(i).find(".modal-close").click(function() {
                    t(i).closeModal(e)
                }), t("#lean-overlay").css({
                    display: "block",
                    opacity: 0
                }), t(i).css({
                    display: "block",
                    opacity: 0
                }), t("#lean-overlay").velocity({
                    opacity: e.opacity
                }, {
                    duration: e.in_duration,
                    queue: !1,
                    ease: "easeOutCubic"
                }), t(i).hasClass("bottom-sheet") ? t(i).velocity({
                    bottom: "0",
                    opacity: 1
                }, {
                    duration: e.in_duration,
                    queue: !1,
                    ease: "easeOutCubic",
                    complete: function() {
                        "function" == typeof e.ready && e.ready()
                    }
                }) : (t(i).css({
                    top: "4%"
                }), t(i).velocity({
                    top: "10%",
                    opacity: 1
                }, {
                    duration: e.in_duration,
                    queue: !1,
                    ease: "easeOutCubic",
                    complete: function() {
                        "function" == typeof e.ready && e.ready()
                    }
                }))
            }
        }), t.fn.extend({
            closeModal: function(e) {
                var i = {
                        out_duration: 250,
                        complete: void 0
                    },
                    e = t.extend(i, e);
                t(".modal-close").off(), t(document).off("keyup.leanModal"), t("#lean-overlay").velocity({
                    opacity: 0
                }, {
                    duration: e.out_duration,
                    queue: !1,
                    ease: "easeOutQuart"
                }), t(this).hasClass("bottom-sheet") ? t(this).velocity({
                    bottom: "-100%",
                    opacity: 0
                }, {
                    duration: e.out_duration,
                    queue: !1,
                    ease: "easeOutCubic",
                    complete: function() {
                        t("#lean-overlay").css({
                            display: "none"
                        }), "function" == typeof e.complete && e.complete(), t("#lean-overlay").remove()
                    }
                }) : t(this).fadeOut(e.out_duration, function() {
                    t(this).css({
                        top: 0
                    }), t("#lean-overlay").css({
                        display: "none"
                    }), "function" == typeof e.complete && e.complete(), t("#lean-overlay").remove()
                })
            }
        }), t.fn.extend({
            leanModal: function(e) {
                return this.each(function() {
                    t(this).click(function(i) {
                        var n = t(this).attr("href") || "#" + t(this).data("target");
                        t(n).openModal(e), i.preventDefault()
                    })
                })
            }
        })
    }(jQuery),
    function(t) {
        t.fn.materialbox = function() {
            return this.each(function() {
                function e() {
                    n = !1;
                    var e = o.parent(".material-placeholder"),
                        a = (window.innerWidth, window.innerHeight, o.data("width")),
                        s = o.data("height");
                    o.velocity("stop", !0), t("#materialbox-overlay").velocity("stop", !0), t(".materialbox-caption").velocity("stop", !0), t("#materialbox-overlay").velocity({
                        opacity: 0
                    }, {
                        duration: r,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            i = !1, t(this).remove()
                        }
                    }), o.velocity({
                        width: a,
                        height: s,
                        left: 0,
                        top: 0
                    }, {
                        duration: r,
                        queue: !1,
                        easing: "easeOutQuad"
                    }), t(".materialbox-caption").velocity({
                        opacity: 0
                    }, {
                        duration: r,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            e.css({
                                height: "",
                                width: "",
                                position: "",
                                top: "",
                                left: ""
                            }), o.css({
                                height: "",
                                top: "",
                                left: "",
                                width: "",
                                "max-width": "",
                                position: "",
                                "z-index": ""
                            }), o.removeClass("active"), n = !0, t(this).remove()
                        }
                    })
                }
                if (!t(this).hasClass("intialized")) {
                    t(this).addClass("intialized");
                    var i = !1,
                        n = !0,
                        a = 275,
                        r = 200,
                        o = t(this),
                        s = t("<div></div>").addClass("material-placeholder");
                    o.wrap(s), o.on("click", function() {
                        var r = o.parent(".material-placeholder"),
                            s = window.innerWidth,
                            l = window.innerHeight,
                            u = o.width(),
                            c = o.height();
                        if (n === !1) return e(), !1;
                        if (i && n === !0) return e(), !1;
                        n = !1, o.addClass("active"), i = !0, r.css({
                            width: r[0].getBoundingClientRect().width,
                            height: r[0].getBoundingClientRect().height,
                            position: "relative",
                            top: 0,
                            left: 0
                        }), o.css({
                            position: "absolute",
                            "z-index": 1e3
                        }).data("width", u).data("height", c);
                        var d = t('<div id="materialbox-overlay"></div>').css({
                            opacity: 0
                        }).click(function() {
                            n === !0 && e()
                        });
                        if (t("body").append(d), d.velocity({
                                opacity: 1
                            }, {
                                duration: a,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), "" !== o.data("caption")) {
                            var p = t('<div class="materialbox-caption"></div>');
                            p.text(o.data("caption")), t("body").append(p), p.css({
                                display: "inline"
                            }), p.velocity({
                                opacity: 1
                            }, {
                                duration: a,
                                queue: !1,
                                easing: "easeOutQuad"
                            })
                        }
                        var f = 0,
                            h = u / s,
                            v = c / l,
                            g = 0,
                            m = 0;
                        h > v ? (f = c / u, g = .9 * s, m = .9 * s * f) : (f = u / c, g = .9 * l * f, m = .9 * l), o.hasClass("responsive-img") ? o.velocity({
                            "max-width": g,
                            width: u
                        }, {
                            duration: 0,
                            queue: !1,
                            complete: function() {
                                o.css({
                                    left: 0,
                                    top: 0
                                }).velocity({
                                    height: m,
                                    width: g,
                                    left: t(document).scrollLeft() + s / 2 - o.parent(".material-placeholder").offset().left - g / 2,
                                    top: t(document).scrollTop() + l / 2 - o.parent(".material-placeholder").offset().top - m / 2
                                }, {
                                    duration: a,
                                    queue: !1,
                                    easing: "easeOutQuad",
                                    complete: function() {
                                        n = !0
                                    }
                                })
                            }
                        }) : o.css("left", 0).css("top", 0).velocity({
                            height: m,
                            width: g,
                            left: t(document).scrollLeft() + s / 2 - o.parent(".material-placeholder").offset().left - g / 2,
                            top: t(document).scrollTop() + l / 2 - o.parent(".material-placeholder").offset().top - m / 2
                        }, {
                            duration: a,
                            queue: !1,
                            easing: "easeOutQuad",
                            complete: function() {
                                n = !0
                            }
                        })
                    }), t(window).scroll(function() {
                        i && e()
                    }), t(document).keyup(function(t) {
                        27 === t.keyCode && n === !0 && i && e()
                    })
                }
            })
        }, t(document).ready(function() {
            t(".materialboxed").materialbox()
        })
    }(jQuery),
    function(t) {
        t.fn.parallax = function() {
            var e = t(window).width();
            return this.each(function() {
                function i(i) {
                    var a;
                    a = 601 > e ? n.height() > 0 ? n.height() : n.children("img").height() : n.height() > 0 ? n.height() : 500;
                    var r = n.children("img").first(),
                        o = r.height(),
                        s = o - a,
                        l = n.offset().top + a,
                        u = n.offset().top,
                        c = t(window).scrollTop(),
                        d = window.innerHeight,
                        p = c + d,
                        f = (p - u) / (a + d),
                        h = Math.round(s * f);
                    i && r.css("display", "block"), l > c && c + d > u && r.css("transform", "translate3D(-50%," + h + "px, 0)")
                }
                var n = t(this);
                n.addClass("parallax"), n.children("img").one("load", function() {
                    i(!0)
                }).each(function() {
                    this.complete && t(this).load()
                }), t(window).scroll(function() {
                    e = t(window).width(), i(!1)
                }), t(window).resize(function() {
                    e = t(window).width(), i(!1)
                })
            })
        }
    }(jQuery),
    function(t) {
        var e = {
            init: function() {
                return this.each(function() {
                    {
                        var e = t(this);
                        t(window).width()
                    }
                    e.width("100%");
                    var i = t(this).children("li").length;
                    e.children("li").each(function() {
                        t(this).width(100 / i + "%")
                    });
                    var n, a, r = e.find("li.tab a"),
                        o = e.width(),
                        s = e.find("li").first().outerWidth(),
                        l = 0;
                    n = t(r.filter('[href="' + location.hash + '"]')), 0 === n.length && (n = t(this).find("li.tab a.active").first()), 0 === n.length && (n = t(this).find("li.tab a").first()), n.addClass("active"), l = r.index(n), 0 > l && (l = 0), a = t(n[0].hash), e.append('<div class="indicator"></div>');
                    var u = e.find(".indicator");
                    e.is(":visible") && (u.css({
                        right: o - (l + 1) * s
                    }), u.css({
                        left: l * s
                    })), t(window).resize(function() {
                        o = e.width(), s = e.find("li").first().outerWidth(), 0 > l && (l = 0), 0 !== s && 0 !== o && (u.css({
                            right: o - (l + 1) * s
                        }), u.css({
                            left: l * s
                        }))
                    }), r.not(n).each(function() {
                        t(this.hash).hide()
                    }), e.on("click", "a", function(i) {
                        o = e.width(), s = e.find("li").first().outerWidth(), n.removeClass("active"), a.hide(), n = t(this), a = t(this.hash), r = e.find("li.tab a"), n.addClass("active");
                        var c = l;
                        l = r.index(t(this)), 0 > l && (l = 0), a.show(), l - c >= 0 ? (u.velocity({
                            right: o - (l + 1) * s
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        }), u.velocity({
                            left: l * s
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad",
                            delay: 90
                        })) : (u.velocity({
                            left: l * s
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        }), u.velocity({
                            right: o - (l + 1) * s
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad",
                            delay: 90
                        })), i.preventDefault()
                    })
                })
            },
            select_tab: function(t) {
                this.find('a[href="#' + t + '"]').trigger("click")
            }
        };
        t.fn.tabs = function(i) {
            return e[i] ? e[i].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof i && i ? void t.error("Method " + i + " does not exist on jQuery.tooltip") : e.init.apply(this, arguments)
        }, t(document).ready(function() {
            t("ul.tabs").tabs()
        })
    }(jQuery),
    function(t) {
        t.fn.tooltip = function(e) {
            var i = null,
                n = !1,
                a = null,
                r = 5,
                o = {
                    delay: 350
                };
            return e = t.extend(o, e), t(".material-tooltip").remove(), this.each(function() {
                var o = t(this),
                    s = t("<span></span>").text(o.attr("data-tooltip")),
                    l = t("<div></div>");
                l.addClass("material-tooltip").append(s), l.appendTo(t("body"));
                var u = t("<div></div>").addClass("backdrop");
                u.appendTo(l), u.css({
                    top: 0,
                    left: 0
                }), t(this).off("mouseenter mouseleave"), t(this).on({
                    mouseenter: function() {
                        var t = o.data("delay");
                        t = void 0 == t || "" == t ? e.delay : t, i = 0, a = setInterval(function() {
                            if (i += 10, i >= t && 0 == n) {
                                n = !0, l.css({
                                    display: "block",
                                    left: "0px",
                                    top: "0px"
                                }), l.children("span").text(o.attr("data-tooltip"));
                                var e = o.outerWidth(),
                                    a = o.outerHeight(),
                                    s = o.attr("data-position"),
                                    c = l.outerHeight(),
                                    d = l.outerWidth(),
                                    p = "0px",
                                    f = "0px",
                                    h = 8;
                                "top" === s ? (l.css({
                                    top: o.offset().top - c - r,
                                    left: o.offset().left + e / 2 - d / 2
                                }), p = "-10px", u.css({
                                    borderRadius: "14px 14px 0 0",
                                    transformOrigin: "50% 90%",
                                    marginTop: c,
                                    marginLeft: d / 2 - u.width() / 2
                                })) : "left" === s ? (l.css({
                                    top: o.offset().top + a / 2 - c / 2,
                                    left: o.offset().left - d - r
                                }), f = "-10px", u.css({
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "14px 0 0 14px",
                                    transformOrigin: "95% 50%",
                                    marginTop: c / 2,
                                    marginLeft: d
                                })) : "right" === s ? (l.css({
                                    top: o.offset().top + a / 2 - c / 2,
                                    left: o.offset().left + e + r
                                }), f = "+10px", u.css({
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "0 14px 14px 0",
                                    transformOrigin: "5% 50%",
                                    marginTop: c / 2,
                                    marginLeft: "0px"
                                })) : (l.css({
                                    top: o.offset().top + o.outerHeight() + r,
                                    left: o.offset().left + e / 2 - d / 2
                                }), p = "+10px", u.css({
                                    marginLeft: d / 2 - u.width() / 2
                                })), h = d / 8, 8 > h && (h = 8), ("right" === s || "left" === s) && (h = d / 10, 6 > h && (h = 6)), l.velocity({
                                    opacity: 1,
                                    marginTop: p,
                                    marginLeft: f
                                }, {
                                    duration: 350,
                                    queue: !1
                                }), u.css({
                                    display: "block"
                                }).velocity({
                                    opacity: 1
                                }, {
                                    duration: 55,
                                    delay: 0,
                                    queue: !1
                                }).velocity({
                                    scale: h
                                }, {
                                    duration: 300,
                                    delay: 0,
                                    queue: !1,
                                    easing: "easeInOutQuad"
                                })
                            }
                        }, 10)
                    },
                    mouseleave: function() {
                        clearInterval(a), i = 0, l.velocity({
                            opacity: 0,
                            marginTop: 0,
                            marginLeft: 0
                        }, {
                            duration: 225,
                            queue: !1,
                            delay: 275
                        }), u.velocity({
                            opacity: 0,
                            scale: 1
                        }, {
                            duration: 225,
                            delay: 275,
                            queue: !1,
                            complete: function() {
                                u.css("display", "none"), l.css("display", "none"), n = !1
                            }
                        })
                    }
                })
            })
        }, t(document).ready(function() {
            t(".tooltipped").tooltip()
        })
    }(jQuery),
    function(t) {
        "use strict";

        function e(t) {
            return null !== t && t === t.window
        }

        function i(t) {
            return e(t) ? t : 9 === t.nodeType && t.defaultView
        }

        function n(t) {
            var e, n, a = {
                    top: 0,
                    left: 0
                },
                r = t && t.ownerDocument;
            return e = r.documentElement, "undefined" != typeof t.getBoundingClientRect && (a = t.getBoundingClientRect()), n = i(r), {
                top: a.top + n.pageYOffset - e.clientTop,
                left: a.left + n.pageXOffset - e.clientLeft
            }
        }

        function a(t) {
            var e = "";
            for (var i in t) t.hasOwnProperty(i) && (e += i + ":" + t[i] + ";");
            return e
        }

        function r(t) {
            if (c.allowEvent(t) === !1) return null;
            for (var e = null, i = t.target || t.srcElement; null !== i.parentElement;) {
                if (!(i instanceof SVGElement || -1 === i.className.indexOf("waves-effect"))) {
                    e = i;
                    break
                }
                if (i.classList.contains("waves-effect")) {
                    e = i;
                    break
                }
                i = i.parentElement
            }
            return e
        }

        function o(e) {
            var i = r(e);
            null !== i && (u.show(e, i), "ontouchstart" in t && (i.addEventListener("touchend", u.hide, !1), i.addEventListener("touchcancel", u.hide, !1)), i.addEventListener("mouseup", u.hide, !1), i.addEventListener("mouseleave", u.hide, !1))
        }
        var s = s || {},
            l = document.querySelectorAll.bind(document),
            u = {
                duration: 750,
                show: function(t, e) {
                    if (2 === t.button) return !1;
                    var i = e || this,
                        r = document.createElement("div");
                    r.className = "waves-ripple", i.appendChild(r);
                    var o = n(i),
                        s = t.pageY - o.top,
                        l = t.pageX - o.left,
                        c = "scale(" + i.clientWidth / 100 * 10 + ")";
                    "touches" in t && (s = t.touches[0].pageY - o.top, l = t.touches[0].pageX - o.left), r.setAttribute("data-hold", Date.now()), r.setAttribute("data-scale", c), r.setAttribute("data-x", l), r.setAttribute("data-y", s);
                    var d = {
                        top: s + "px",
                        left: l + "px"
                    };
                    r.className = r.className + " waves-notransition", r.setAttribute("style", a(d)), r.className = r.className.replace("waves-notransition", ""), d["-webkit-transform"] = c, d["-moz-transform"] = c, d["-ms-transform"] = c, d["-o-transform"] = c, d.transform = c, d.opacity = "1", d["-webkit-transition-duration"] = u.duration + "ms", d["-moz-transition-duration"] = u.duration + "ms", d["-o-transition-duration"] = u.duration + "ms", d["transition-duration"] = u.duration + "ms", d["-webkit-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)", d["-moz-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)", d["-o-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)", d["transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)", r.setAttribute("style", a(d))
                },
                hide: function(t) {
                    c.touchup(t);
                    var e = this,
                        i = (1.4 * e.clientWidth, null),
                        n = e.getElementsByClassName("waves-ripple");
                    if (!(n.length > 0)) return !1;
                    i = n[n.length - 1];
                    var r = i.getAttribute("data-x"),
                        o = i.getAttribute("data-y"),
                        s = i.getAttribute("data-scale"),
                        l = Date.now() - Number(i.getAttribute("data-hold")),
                        d = 350 - l;
                    0 > d && (d = 0), setTimeout(function() {
                        var t = {
                            top: o + "px",
                            left: r + "px",
                            opacity: "0",
                            "-webkit-transition-duration": u.duration + "ms",
                            "-moz-transition-duration": u.duration + "ms",
                            "-o-transition-duration": u.duration + "ms",
                            "transition-duration": u.duration + "ms",
                            "-webkit-transform": s,
                            "-moz-transform": s,
                            "-ms-transform": s,
                            "-o-transform": s,
                            transform: s
                        };
                        i.setAttribute("style", a(t)), setTimeout(function() {
                            try {
                                e.removeChild(i)
                            } catch (t) {
                                return !1
                            }
                        }, u.duration)
                    }, d)
                },
                wrapInput: function(t) {
                    for (var e = 0; e < t.length; e++) {
                        var i = t[e];
                        if ("input" === i.tagName.toLowerCase()) {
                            var n = i.parentNode;
                            if ("i" === n.tagName.toLowerCase() && -1 !== n.className.indexOf("waves-effect")) continue;
                            var a = document.createElement("i");
                            a.className = i.className + " waves-input-wrapper";
                            var r = i.getAttribute("style");
                            r || (r = ""), a.setAttribute("style", r), i.className = "waves-button-input", i.removeAttribute("style"), n.replaceChild(a, i), a.appendChild(i)
                        }
                    }
                }
            },
            c = {
                touches: 0,
                allowEvent: function(t) {
                    var e = !0;
                    return "touchstart" === t.type ? c.touches += 1 : "touchend" === t.type || "touchcancel" === t.type ? setTimeout(function() {
                        c.touches > 0 && (c.touches -= 1)
                    }, 500) : "mousedown" === t.type && c.touches > 0 && (e = !1), e
                },
                touchup: function(t) {
                    c.allowEvent(t)
                }
            };
        s.displayEffect = function(e) {
            e = e || {}, "duration" in e && (u.duration = e.duration), u.wrapInput(l(".waves-effect")), "ontouchstart" in t && document.body.addEventListener("touchstart", o, !1), document.body.addEventListener("mousedown", o, !1)
        }, s.attach = function(e) {
            "input" === e.tagName.toLowerCase() && (u.wrapInput([e]), e = e.parentElement), "ontouchstart" in t && e.addEventListener("touchstart", o, !1), e.addEventListener("mousedown", o, !1)
        }, t.Waves = s, document.addEventListener("DOMContentLoaded", function() {
            s.displayEffect()
        }, !1)
    }(window), Materialize.toast = function(t, e, i, n) {
        function a(t) {
            var e = document.createElement("div");
            if (e.classList.add("toast"), i)
                for (var a = i.split(" "), r = 0, o = a.length; o > r; r++) e.classList.add(a[r]);
            e.innerHTML = t;
            var s = new Hammer(e, {
                prevent_default: !1
            });
            return s.on("pan", function(t) {
                var i = t.deltaX,
                    n = 80;
                e.classList.contains("panning") || e.classList.add("panning");
                var a = 1 - Math.abs(i / n);
                0 > a && (a = 0), Vel(e, {
                    left: i,
                    opacity: a
                }, {
                    duration: 50,
                    queue: !1,
                    easing: "easeOutQuad"
                })
            }), s.on("panend", function(t) {
                var i = t.deltaX,
                    a = 80;
                Math.abs(i) > a ? Vel(e, {
                    marginTop: "-40px"
                }, {
                    duration: 375,
                    easing: "easeOutExpo",
                    queue: !1,
                    complete: function() {
                        "function" == typeof n && n(), e.parentNode.removeChild(e)
                    }
                }) : (e.classList.remove("panning"), Vel(e, {
                    left: 0,
                    opacity: 1
                }, {
                    duration: 300,
                    easing: "easeOutExpo",
                    queue: !1
                }))
            }), e
        }
        i = i || "";
        var r = document.getElementById("toast-container");
        if (null === r) {
            var r = document.createElement("div");
            r.id = "toast-container", document.body.appendChild(r)
        }
        var o = a(t);
        r.appendChild(o), o.style.top = "35px", o.style.opacity = 0, Vel(o, {
            top: "0px",
            opacity: 1
        }, {
            duration: 300,
            easing: "easeOutCubic",
            queue: !1
        });
        var s = e,
            l = setInterval(function() {
                null === o.parentNode && window.clearInterval(l), o.classList.contains("panning") || (s -= 20), 0 >= s && (Vel(o, {
                    opacity: 0,
                    marginTop: "-40px"
                }, {
                    duration: 375,
                    easing: "easeOutExpo",
                    queue: !1,
                    complete: function() {
                        "function" == typeof n && n(), this[0].parentNode.removeChild(this[0])
                    }
                }), window.clearInterval(l))
            }, 20)
    },
    function(t) {
        var e = {
            init: function(e) {
                var i = {
                    menuWidth: 240,
                    edge: "left",
                    closeOnClick: !1
                };
                e = t.extend(i, e), t(this).each(function() {
                    function i(i) {
                        r = !1, o = !1, t("#sidenav-overlay").velocity({
                            opacity: 0
                        }, {
                            duration: 200,
                            queue: !1,
                            easing: "easeOutQuad",
                            complete: function() {
                                t(this).remove()
                            }
                        }), "left" === e.edge ? (t(".drag-target").css({
                            width: "",
                            right: "",
                            left: "0"
                        }), a.velocity({
                            left: -1 * (e.menuWidth + 10)
                        }, {
                            duration: 200,
                            queue: !1,
                            easing: "easeOutCubic",
                            complete: function() {
                                1 == i && (a.removeAttr("style"), a.css("width", e.menuWidth))
                            }
                        })) : (t(".drag-target").css({
                            width: "",
                            right: "0",
                            left: ""
                        }), a.velocity({
                            right: -1 * (e.menuWidth + 10)
                        }, {
                            duration: 200,
                            queue: !1,
                            easing: "easeOutCubic",
                            complete: function() {
                                1 == i && (a.removeAttr("style"), a.css("width", e.menuWidth))
                            }
                        }))
                    }
                    var n = t(this),
                        a = t("#" + n.attr("data-activates"));
                    240 != e.menuWidth && a.css("width", e.menuWidth), t("body").append(t('<div class="drag-target"></div>')), "left" == e.edge ? (a.css("left", -1 * (e.menuWidth + 10)), t(".drag-target").css({
                        left: 0
                    })) : (a.addClass("right-aligned").css("right", -1 * (e.menuWidth + 10)).css("left", ""), t(".drag-target").css({
                        right: 0
                    })), a.hasClass("fixed") && t(window).width() > 992 && a.css("left", 0), a.hasClass("fixed") && t(window).resize(function() {
                        window.innerWidth > 992 ? 0 != t("#sidenav-overlay").css("opacity") && o ? i(!0) : (a.removeAttr("style"), a.css("width", e.menuWidth)) : o === !1 && ("left" === e.edge ? a.css("left", -1 * (e.menuWidth + 10)) : a.css("right", -1 * (e.menuWidth + 10)))
                    }), 1 == e.closeOnClick && a.on("click.itemclick", "a:not(.collapsible-header)", function() {
                        i()
                    });
                    var r = !1,
                        o = !1;
                    t(".drag-target").on("click", function() {
                        i()
                    }), t(".drag-target").hammer({
                        prevent_default: !1
                    }).bind("pan", function(n) {
                        if ("touch" == n.gesture.pointerType) {
                            {
                                var r = (n.gesture.direction, n.gesture.center.x);
                                n.gesture.center.y, n.gesture.velocityX
                            }
                            if (0 === t("#sidenav-overlay").length) {
                                var s = t('<div id="sidenav-overlay"></div>');
                                s.css("opacity", 0).click(function() {
                                    i()
                                }), t("body").append(s)
                            }
                            if ("left" === e.edge && (r > e.menuWidth ? r = e.menuWidth : 0 > r && (r = 0)), "left" === e.edge) r < e.menuWidth / 2 ? o = !1 : r >= e.menuWidth / 2 && (o = !0), a.css("left", r - e.menuWidth);
                            else {
                                r < t(window).width() - e.menuWidth / 2 ? o = !0 : r >= t(window).width() - e.menuWidth / 2 && (o = !1);
                                var l = -1 * (r - e.menuWidth / 2);
                                l > 0 && (l = 0), a.css("right", l)
                            }
                            if ("left" === e.edge) {
                                var u = r / e.menuWidth;
                                t("#sidenav-overlay").velocity({
                                    opacity: u
                                }, {
                                    duration: 50,
                                    queue: !1,
                                    easing: "easeOutQuad"
                                })
                            } else {
                                var u = Math.abs((r - t(window).width()) / e.menuWidth);
                                t("#sidenav-overlay").velocity({
                                    opacity: u
                                }, {
                                    duration: 50,
                                    queue: !1,
                                    easing: "easeOutQuad"
                                })
                            }
                        }
                    }).bind("panend", function(i) {
                        if ("touch" == i.gesture.pointerType) {
                            var n = i.gesture.velocityX;
                            r = !1, "left" === e.edge ? o && .3 >= n || -.5 > n ? (a.velocity({
                                left: 0
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), t("#sidenav-overlay").velocity({
                                opacity: 1
                            }, {
                                duration: 50,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), t(".drag-target").css({
                                width: "50%",
                                right: 0,
                                left: ""
                            })) : (!o || n > .3) && (a.velocity({
                                left: -1 * (e.menuWidth + 10)
                            }, {
                                duration: 200,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), t("#sidenav-overlay").velocity({
                                opacity: 0
                            }, {
                                duration: 200,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    t(this).remove()
                                }
                            }), t(".drag-target").css({
                                width: "10px",
                                right: "",
                                left: 0
                            })) : o && n >= -.3 || n > .5 ? (a.velocity({
                                right: 0
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), t("#sidenav-overlay").velocity({
                                opacity: 1
                            }, {
                                duration: 50,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), t(".drag-target").css({
                                width: "50%",
                                right: "",
                                left: 0
                            })) : (!o || -.3 > n) && (a.velocity({
                                right: -1 * (e.menuWidth + 10)
                            }, {
                                duration: 200,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), t("#sidenav-overlay").velocity({
                                opacity: 0
                            }, {
                                duration: 200,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    t(this).remove()
                                }
                            }), t(".drag-target").css({
                                width: "10px",
                                right: 0,
                                left: ""
                            }))
                        }
                    }), n.click(function() {
                        if (1 == o) o = !1, r = !1, i();
                        else {
                            "left" === e.edge ? (t(".drag-target").css({
                                width: "50%",
                                right: 0,
                                left: ""
                            }), a.velocity({
                                left: 0
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad"
                            })) : (t(".drag-target").css({
                                width: "50%",
                                right: "",
                                left: 0
                            }), a.velocity({
                                right: 0
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), a.css("left", ""));
                            var n = t('<div id="sidenav-overlay"></div>');
                            n.css("opacity", 0).click(function() {
                                o = !1, r = !1, i(), n.velocity({
                                    opacity: 0
                                }, {
                                    duration: 300,
                                    queue: !1,
                                    easing: "easeOutQuad",
                                    complete: function() {
                                        t(this).remove()
                                    }
                                })
                            }), t("body").append(n), n.velocity({
                                opacity: 1
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    o = !0, r = !1
                                }
                            })
                        }
                        return !1
                    })
                })
            },
            show: function() {
                this.trigger("click")
            },
            hide: function() {
                t("#sidenav-overlay").trigger("click")
            }
        };
        t.fn.sideNav = function(i) {
            return e[i] ? e[i].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof i && i ? void t.error("Method " + i + " does not exist on jQuery.tooltip") : e.init.apply(this, arguments)
        }
    }(jQuery),
    function(t) {
        function e(e, i, n, a) {
            var r = t();
            return t.each(o, function(t, o) {
                if (o.height() > 0) {
                    var s = o.offset().top,
                        l = o.offset().left,
                        u = l + o.width(),
                        c = s + o.height(),
                        d = !(l > i || a > u || s > n || e > c);
                    d && r.push(o)
                }
            }), r
        }

        function i() {
            ++u;
            var i = r.scrollTop(),
                n = r.scrollLeft(),
                a = n + r.width(),
                o = i + r.height(),
                l = e(i + c.top + 80, a + c.right, o + c.bottom, n + c.left);
            t.each(l, function(t, e) {
                var i = e.data("scrollSpy:ticks");
                "number" != typeof i && e.triggerHandler("scrollSpy:enter"), e.data("scrollSpy:ticks", u)
            }), t.each(s, function(t, e) {
                var i = e.data("scrollSpy:ticks");
                "number" == typeof i && i !== u && (e.triggerHandler("scrollSpy:exit"), e.data("scrollSpy:ticks", null))
            }), s = l
        }

        function n() {
            r.trigger("scrollSpy:winSize")
        }

        function a(t, e, i) {
            var n, a, r, o = null,
                s = 0;
            i || (i = {});
            var l = function() {
                s = i.leading === !1 ? 0 : d(), o = null, r = t.apply(n, a), n = a = null
            };
            return function() {
                var u = d();
                s || i.leading !== !1 || (s = u);
                var c = e - (u - s);
                return n = this, a = arguments, 0 >= c ? (clearTimeout(o), o = null, s = u, r = t.apply(n, a), n = a = null) : o || i.trailing === !1 || (o = setTimeout(l, c)), r
            }
        }
        var r = t(window),
            o = [],
            s = [],
            l = !1,
            u = 0,
            c = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            d = Date.now || function() {
                return (new Date).getTime()
            };
        t.scrollSpy = function(e, n) {
            var s = [];
            e = t(e), e.each(function(e, i) {
                o.push(t(i)), t(i).data("scrollSpy:id", e), t("a[href=#" + t(i).attr("id") + "]").click(function(e) {
                    e.preventDefault();
                    var i = t(this.hash).offset().top + 1;
                    t("html, body").animate({
                        scrollTop: i - 60
                    }, {
                        duration: 400,
                        queue: !1,
                        easing: "easeOutCubic"
                    })
                })
            }), n = n || {
                throttle: 100
            }, c.top = n.offsetTop || 0, c.right = n.offsetRight || 0, c.bottom = n.offsetBottom || 0, c.left = n.offsetLeft || 0;
            var u = a(i, n.throttle || 100),
                d = function() {
                    t(document).ready(u)
                };
            return l || (r.on("scroll", d), r.on("resize", d), l = !0), setTimeout(d, 0), e.on("scrollSpy:enter", function() {
                s = t.grep(s, function(t) {
                    return 0 != t.height()
                });
                var e = t(this);
                s[0] ? (t("a[href=#" + s[0].attr("id") + "]").removeClass("active"), e.data("scrollSpy:id") < s[0].data("scrollSpy:id") ? s.unshift(t(this)) : s.push(t(this))) : s.push(t(this)), t("a[href=#" + s[0].attr("id") + "]").addClass("active")
            }), e.on("scrollSpy:exit", function() {
                if (s = t.grep(s, function(t) {
                        return 0 != t.height()
                    }), s[0]) {
                    t("a[href=#" + s[0].attr("id") + "]").removeClass("active");
                    var e = t(this);
                    s = t.grep(s, function(t) {
                        return t.attr("id") != e.attr("id")
                    }), s[0] && t("a[href=#" + s[0].attr("id") + "]").addClass("active")
                }
            }), e
        }, t.winSizeSpy = function(e) {
            return t.winSizeSpy = function() {
                return r
            }, e = e || {
                throttle: 100
            }, r.on("resize", a(n, e.throttle || 100))
        }, t.fn.scrollSpy = function(e) {
            return t.scrollSpy(t(this), e)
        }
    }(jQuery),
    function(t) {
        t(document).ready(function() {
            function e(e) {
                n.text(e.val() + "\n");
                var i = n.html().replace(/\n/g, "<br>");
                n.html(i), e.is(":visible") ? n.css("width", e.width()) : n.css("width", t(window).width() / 2), e.css("height", n.height())
            }
            Materialize.updateTextFields = function() {
                var e = "input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea";
                t(e).each(function(e, i) {
                    t(i).val().length > 0 || void 0 !== t(this).attr("placeholder") ? t(this).siblings("label, i").addClass("active") : t(this).siblings("label, i").removeClass("active")
                })
            };
            var i = "input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea";
            t("input[autofocus]").siblings("label, i").addClass("active"), t(document).on("change", i, function() {
                (0 !== t(this).val().length || void 0 !== t(this).attr("placeholder")) && t(this).siblings("label, i").addClass("active"), validate_field(t(this))
            }), t(document).ready(function() {
                Materialize.updateTextFields()
            }), t(document).on("reset", function(e) {
                t(e.target).is("form") && (t(this).find(i).removeClass("valid").removeClass("invalid"), t(this).find(i).siblings("label, i").removeClass("active"), t(this).find("select.initialized").each(function() {
                    var e = t(this).find("option[selected]").text();
                    t(this).siblings("input.select-dropdown").val(e)
                }))
            }), t(document).on("focus", i, function() {
                t(this).siblings("label, i").addClass("active")
            }), t(document).on("blur", i, function() {
                0 === t(this).val().length && void 0 === t(this).attr("placeholder") && t(this).siblings("label, i").removeClass("active"), validate_field(t(this))
            }), validate_field = function(t) {
                0 === t.val().length ? t.hasClass("validate") && (t.removeClass("valid"), t.removeClass("invalid")) : t.hasClass("validate") && (t.is(":valid") ? (t.removeClass("invalid"), t.addClass("valid")) : (t.removeClass("valid"), t.addClass("invalid")))
            };
            var n = t(".hiddendiv").first();
            n.length || (n = t('<div class="hiddendiv common"></div>'), t("body").append(n));
            var a = ".materialize-textarea";
            t(a).each(function() {
                var i = t(this);
                i.val().length && e(i)
            }), t("body").on("keyup keydown", a, function() {
                e(t(this))
            }), t(".file-field").each(function() {
                var e = t(this).find("input.file-path");
                t(this).find('input[type="file"]').change(function() {
                    e.val(t(this)[0].files[0].name), e.trigger("change")
                })
            });
            var r = "input[type=range]",
                o = !1;
            t(r).each(function() {
                var e = t('<span class="thumb"><span class="value"></span></span>');
                t(this).after(e)
            });
            var s = ".range-field";
            t(document).on("mousedown", s, function(e) {
                var i = t(this).children(".thumb");
                i.length <= 0 && (i = t('<span class="thumb"><span class="value"></span></span>'), t(this).append(i)), o = !0, t(this).addClass("active"), i.hasClass("active") || i.velocity({
                    height: "30px",
                    width: "30px",
                    top: "-20px",
                    marginLeft: "-15px"
                }, {
                    duration: 300,
                    easing: "easeOutExpo"
                });
                var n = e.pageX - t(this).offset().left,
                    a = t(this).outerWidth();
                0 > n ? n = 0 : n > a && (n = a), i.addClass("active").css("left", n), i.find(".value").html(t(this).children("input[type=range]").val())
            }), t(document).on("mouseup", s, function() {
                o = !1, t(this).removeClass("active")
            }), t(document).on("mousemove", s, function(e) {
                var i = t(this).children(".thumb");
                if (o) {
                    i.hasClass("active") || i.velocity({
                        height: "30px",
                        width: "30px",
                        top: "-20px",
                        marginLeft: "-15px"
                    }, {
                        duration: 300,
                        easing: "easeOutExpo"
                    });
                    var n = e.pageX - t(this).offset().left,
                        a = t(this).outerWidth();
                    0 > n ? n = 0 : n > a && (n = a), i.addClass("active").css("left", n), i.find(".value").html(t(this).children("input[type=range]").val())
                }
            }), t(document).on("mouseout", s, function() {
                if (!o) {
                    var e = t(this).children(".thumb");
                    e.hasClass("active") && e.velocity({
                        height: "0",
                        width: "0",
                        top: "10px",
                        marginLeft: "-6px"
                    }, {
                        duration: 100
                    }), e.removeClass("active")
                }
            })
        }), t.fn.material_select = function(e) {
            t(this).each(function() {
                if ($select = t(this), !$select.hasClass("browser-default")) {
                    var i = $select.data("select-id");
                    if (i && ($select.parent().find("i").remove(), $select.parent().find("input").remove(), $select.unwrap(), t("ul#select-options-" + i).remove()), "destroy" === e) return void $select.data("select-id", null).removeClass("initialized");
                    var n = Materialize.guid();
                    $select.data("select-id", n);
                    var a = t('<div class="select-wrapper"></div>');
                    a.addClass($select.attr("class"));
                    var r = t('<ul id="select-options-' + n + '" class="dropdown-content select-dropdown"></ul>'),
                        o = $select.children("option");
                    if (void 0 !== $select.find("option:selected")) var s = $select.find("option:selected");
                    else var s = r.first();
                    o.each(function() {
                        r.append(t('<li class="' + (t(this).is(":disabled") ? "disabled" : "") + '"><span>' + t(this).html() + "</span></li>"))
                    }), r.find("li").each(function(i) {
                        var n = $select;
                        t(this).click(function() {
                            t(this).hasClass("disabled") || (n.find("option").eq(i).prop("selected", !0), n.trigger("change"), n.siblings("input.select-dropdown").val(t(this).text()), "undefined" != typeof e && e())
                        })
                    }), $select.wrap(a);
                    var l = t('<i class="mdi-navigation-arrow-drop-down"></i>');
                    $select.is(":disabled") && l.addClass("disabled");
                    var u = t('<input type="text" class="select-dropdown" readonly="true" ' + ($select.is(":disabled") ? "disabled" : "") + ' data-activates="select-options-' + n + '" value="' + s.html() + '"/>');
                    $select.before(u), u.before(l), t("body").append(r), $select.is(":disabled") || u.dropdown({
                        hover: !1
                    }), $select.attr("tabindex") && t(u[0]).attr("tabindex", $select.attr("tabindex")), $select.addClass("initialized"), u.on("focus", function() {
                        t(this).trigger("open"), s = t(this).val(), selectedOption = r.find("li").filter(function() {
                            return t(this).text().toLowerCase() === s.toLowerCase()
                        })[0], activateOption(r, selectedOption)
                    }), u.on("blur", function() {
                        t(this).trigger("close")
                    }), activateOption = function(e, i) {
                        e.find("li.active").removeClass("active"), t(i).addClass("active"), e.scrollTo(i)
                    }, filterQuery = [], onKeyDown = function(e) {
                        return 9 == e.which ? void u.trigger("close") : 40 != e.which || r.is(":visible") ? void((13 != e.which || r.is(":visible")) && (e.preventDefault(), letter = String.fromCharCode(e.which).toLowerCase(), letter && (filterQuery.push(letter), string = filterQuery.join(""), newOption = r.find("li").filter(function() {
                            return 0 === t(this).text().toLowerCase().indexOf(string)
                        })[0], newOption && activateOption(r, newOption)), 13 == e.which && (activeOption = r.find("li.active:not(.disabled)")[0], activeOption && (t(activeOption).trigger("click"), u.trigger("close"))), 40 == e.which && (newOption = r.find("li.active").next("li:not(.disabled)")[0], newOption && activateOption(r, newOption)), 27 == e.which && u.trigger("close"), 38 == e.which && (newOption = r.find("li.active").prev("li:not(.disabled)")[0], newOption && activateOption(r, newOption)), setTimeout(function() {
                            filterQuery = []
                        }, 1e3))) : void u.trigger("open")
                    }, u.on("keydown", onKeyDown)
                }
            })
        }
    }(jQuery),
    function(t) {
        t.fn.slider = function(e) {
            var i = {
                indicators: !0,
                height: 400,
                transition: 500,
                interval: 6e3
            };
            return e = t.extend(i, e), this.each(function() {
                function i(t, e) {
                    t.hasClass("center-align") ? t.velocity({
                        opacity: 0,
                        translateY: -100
                    }, {
                        duration: e,
                        queue: !1
                    }) : t.hasClass("right-align") ? t.velocity({
                        opacity: 0,
                        translateX: 100
                    }, {
                        duration: e,
                        queue: !1
                    }) : t.hasClass("left-align") && t.velocity({
                        opacity: 0,
                        translateX: -100
                    }, {
                        duration: e,
                        queue: !1
                    })
                }

                function n(t) {
                    t >= s.length ? t = 0 : 0 > t && (t = s.length - 1), l = o.find(".active").index(), l != t && (a = s.eq(l), $caption = a.find(".caption"), a.removeClass("active"), a.velocity({
                        opacity: 0
                    }, {
                        duration: e.transition,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            s.not(".active").velocity({
                                opacity: 0,
                                translateX: 0,
                                translateY: 0
                            }, {
                                duration: 0,
                                queue: !1
                            })
                        }
                    }), i($caption, e.transition), e.indicators && u.eq(l).removeClass("active"), s.eq(t).velocity({
                        opacity: 1
                    }, {
                        duration: e.transition,
                        queue: !1,
                        easing: "easeOutQuad"
                    }), s.eq(t).find(".caption").velocity({
                        opacity: 1,
                        translateX: 0,
                        translateY: 0
                    }, {
                        duration: e.transition,
                        delay: e.transition,
                        queue: !1,
                        easing: "easeOutQuad"
                    }), s.eq(t).addClass("active"), e.indicators && u.eq(t).addClass("active"))
                }
                var a, r = t(this),
                    o = r.find("ul.slides").first(),
                    s = o.find("li"),
                    l = o.find(".active").index();
                if (-1 != l && (a = s.eq(l)), 400 != e.height && (r.height(e.height + 40), o.height(e.height)), s.find(".caption").each(function() {
                        i(t(this), 0)
                    }), s.find("img").each(function() {
                        t(this).css("background-image", "url(" + t(this).attr("src") + ")"), t(this).attr("src", "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==")
                    }), e.indicators) {
                    var u = t('<ul class="indicators"></ul>');
                    s.each(function() {
                        var i = t('<li class="indicator-item"></li>');
                        i.click(function() {
                            var i = o.parent(),
                                a = i.find(t(this)).index();
                            n(a), clearInterval($interval), $interval = setInterval(function() {
                                l = o.find(".active").index(), s.length == l + 1 ? l = 0 : l += 1, n(l)
                            }, e.transition + e.interval)
                        }), u.append(i)
                    }), r.append(u), u = r.find("ul.indicators").find("li.indicator-item")
                }
                a ? a.show() : (s.first().addClass("active").velocity({
                    opacity: 1
                }, {
                    duration: e.transition,
                    queue: !1,
                    easing: "easeOutQuad"
                }), l = 0, a = s.eq(l), e.indicators && u.eq(l).addClass("active")), a.find("img").each(function() {
                    a.find(".caption").velocity({
                        opacity: 1,
                        translateX: 0,
                        translateY: 0
                    }, {
                        duration: e.transition,
                        queue: !1,
                        easing: "easeOutQuad"
                    })
                }), $interval = setInterval(function() {
                    l = o.find(".active").index(), n(l + 1)
                }, e.transition + e.interval);
                var c = !1,
                    d = !1,
                    p = !1;
                r.hammer({
                    prevent_default: !1
                }).bind("pan", function(t) {
                    if ("touch" === t.gesture.pointerType) {
                        clearInterval($interval);
                        var e = t.gesture.direction,
                            i = t.gesture.deltaX,
                            n = t.gesture.velocityX;
                        $curr_slide = o.find(".active"), $curr_slide.velocity({
                            translateX: i
                        }, {
                            duration: 50,
                            queue: !1,
                            easing: "easeOutQuad"
                        }), 4 === e && (i > r.innerWidth() / 2 || -.65 > n) ? p = !0 : 2 === e && (i < -1 * r.innerWidth() / 2 || n > .65) && (d = !0);
                        var a;
                        d && (a = $curr_slide.next(), 0 === a.length && (a = s.first()), a.velocity({
                            opacity: 1
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        })), p && (a = $curr_slide.prev(), 0 === a.length && (a = s.last()), a.velocity({
                            opacity: 1
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        }))
                    }
                }).bind("panend", function(t) {
                    "touch" === t.gesture.pointerType && ($curr_slide = o.find(".active"), c = !1, curr_index = o.find(".active").index(), p || d ? d ? (n(curr_index + 1), $curr_slide.velocity({
                        translateX: -1 * r.innerWidth()
                    }, {
                        duration: 300,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            $curr_slide.velocity({
                                opacity: 0,
                                translateX: 0
                            }, {
                                duration: 0,
                                queue: !1
                            })
                        }
                    })) : p && (n(curr_index - 1), $curr_slide.velocity({
                        translateX: r.innerWidth()
                    }, {
                        duration: 300,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            $curr_slide.velocity({
                                opacity: 0,
                                translateX: 0
                            }, {
                                duration: 0,
                                queue: !1
                            })
                        }
                    })) : $curr_slide.velocity({
                        translateX: 0
                    }, {
                        duration: 300,
                        queue: !1,
                        easing: "easeOutQuad"
                    }), d = !1, p = !1, clearInterval($interval), $interval = setInterval(function() {
                        l = o.find(".active").index(), s.length == l + 1 ? l = 0 : l += 1, n(l)
                    }, e.transition + e.interval))
                })
            })
        }
    }(jQuery),
    function(t) {
        t(document).ready(function() {
            t(document).on("click.card", ".card", function(e) {
                t(this).find(".card-reveal").length && (t(e.target).is(t(".card-reveal .card-title")) || t(e.target).is(t(".card-reveal .card-title i")) ? t(this).find(".card-reveal").velocity({
                    translateY: 0
                }, {
                    duration: 225,
                    queue: !1,
                    easing: "easeInOutQuad",
                    complete: function() {
                        t(this).css({
                            display: "none"
                        })
                    }
                }) : (t(e.target).is(t(".card .activator")) || t(e.target).is(t(".card .activator i"))) && t(this).find(".card-reveal").css({
                    display: "block"
                }).velocity("stop", !1).velocity({
                    translateY: "-100%"
                }, {
                    duration: 300,
                    queue: !1,
                    easing: "easeInOutQuad"
                }))
            })
        })
    }(jQuery),
    function(t) {
        t(document).ready(function() {
            t.fn.pushpin = function(e) {
                var i = {
                    top: 0,
                    bottom: 1 / 0,
                    offset: 0
                };
                return e = t.extend(i, e), $index = 0, this.each(function() {
                    function i(t) {
                        t.removeClass("pin-top"), t.removeClass("pinned"), t.removeClass("pin-bottom")
                    }

                    function n(n, a) {
                        n.each(function() {
                            e.top <= a && e.bottom >= a && !t(this).hasClass("pinned") && (i(t(this)), t(this).css("top", e.offset), t(this).addClass("pinned")), a < e.top && !t(this).hasClass("pin-top") && (i(t(this)), t(this).css("top", 0), t(this).addClass("pin-top")), a > e.bottom && !t(this).hasClass("pin-bottom") && (i(t(this)), t(this).addClass("pin-bottom"), t(this).css("top", e.bottom - o))
                        })
                    }
                    var a = Materialize.guid(),
                        r = t(this),
                        o = t(this).offset().top;
                    n(r, t(window).scrollTop()), t(window).on("scroll." + a, function() {
                        var i = t(window).scrollTop() + e.offset;
                        n(r, i)
                    })
                })
            }
        })
    }(jQuery),
    function(t) {
        t(document).ready(function() {
            t.fn.reverse = [].reverse, t(document).on("mouseenter.fixedActionBtn", ".fixed-action-btn", function() {
                var e = t(this);
                e.find("ul .btn-floating").velocity({
                    scaleY: ".4",
                    scaleX: ".4",
                    translateY: "40px"
                }, {
                    duration: 0
                });
                var i = 0;
                e.find("ul .btn-floating").reverse().each(function() {
                    t(this).velocity({
                        opacity: "1",
                        scaleX: "1",
                        scaleY: "1",
                        translateY: "0"
                    }, {
                        duration: 80,
                        delay: i
                    }), i += 40
                })
            }), t(document).on("mouseleave.fixedActionBtn", ".fixed-action-btn", function() {
                var e = t(this);
                e.find("ul .btn-floating").velocity("stop", !0), e.find("ul .btn-floating").velocity({
                    opacity: "0",
                    scaleX: ".4",
                    scaleY: ".4",
                    translateY: "40px"
                }, {
                    duration: 80
                })
            })
        })
    }(jQuery),
    function(t) {
        Materialize.fadeInImage = function(e) {
            var i = t(e);
            i.css({
                opacity: 0
            }), t(i).velocity({
                opacity: 1
            }, {
                duration: 650,
                queue: !1,
                easing: "easeOutSine"
            }), t(i).velocity({
                opacity: 1
            }, {
                duration: 1300,
                queue: !1,
                easing: "swing",
                step: function(e, i) {
                    i.start = 100;
                    var n = e / 100,
                        a = 150 - (100 - e) / 1.75;
                    100 > a && (a = 100), e >= 0 && t(this).css({
                        "-webkit-filter": "grayscale(" + n + ")brightness(" + a + "%)",
                        filter: "grayscale(" + n + ")brightness(" + a + "%)"
                    })
                }
            })
        }, Materialize.showStaggeredList = function(e) {
            var i = 0;
            t(e).find("li").velocity({
                translateX: "-100px"
            }, {
                duration: 0
            }), t(e).find("li").each(function() {
                t(this).velocity({
                    opacity: "1",
                    translateX: "0"
                }, {
                    duration: 800,
                    delay: i,
                    easing: [60, 10]
                }), i += 120
            })
        }, t(document).ready(function() {
            var e = !1,
                i = !1;
            t(".dismissable").each(function() {
                t(this).hammer({
                    prevent_default: !1
                }).bind("pan", function(n) {
                    if ("touch" === n.gesture.pointerType) {
                        var a = t(this),
                            r = n.gesture.direction,
                            o = n.gesture.deltaX,
                            s = n.gesture.velocityX;
                        a.velocity({
                            translateX: o
                        }, {
                            duration: 50,
                            queue: !1,
                            easing: "easeOutQuad"
                        }), 4 === r && (o > a.innerWidth() / 2 || -.75 > s) ? e = !0 : 2 === r && (o < -1 * a.innerWidth() / 2 || s > .75) && (i = !0)
                    }
                }).bind("panend", function(n) {
                    if ("touch" === n.gesture.pointerType) {
                        var a = t(this);
                        if (e || i) {
                            var r;
                            r = e ? a.innerWidth() : -1 * a.innerWidth(), a.velocity({
                                translateX: r
                            }, {
                                duration: 100,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    a.css("border", "none"), a.velocity({
                                        height: 0,
                                        padding: 0
                                    }, {
                                        duration: 200,
                                        queue: !1,
                                        easing: "easeOutQuad",
                                        complete: function() {
                                            a.remove()
                                        }
                                    })
                                }
                            })
                        } else a.velocity({
                            translateX: 0
                        }, {
                            duration: 100,
                            queue: !1,
                            easing: "easeOutQuad"
                        });
                        e = !1, i = !1
                    }
                })
            })
        })
    }(jQuery),
    function() {
        Materialize.scrollFire = function(t) {
            var e = !1;
            window.addEventListener("scroll", function() {
                e = !0
            }), setInterval(function() {
                if (e) {
                    e = !1;
                    for (var i = window.pageYOffset + window.innerHeight, n = 0; n < t.length; n++) {
                        var a = t[n],
                            r = a.selector,
                            o = a.offset,
                            s = a.callback,
                            l = document.querySelector(r);
                        if (null !== l) {
                            var u = l.getBoundingClientRect().top + document.body.scrollTop;
                            if (i > u + o && 1 != a.done) {
                                var c = new Function(s);
                                c(), a.done = !0
                            }
                        }
                    }
                }
            }, 100)
        }
    }(jQuery),
    function(t) {
        "function" == typeof define && define.amd ? define("picker", ["jquery"], t) : "object" == typeof exports ? module.exports = t(require("jquery")) : this.Picker = t(jQuery)
    }(function(t) {
        function e(r, o, l, d) {
            function p() {
                return e._.node("div", e._.node("div", e._.node("div", e._.node("div", S.component.nodes(b.open), x.box), x.wrap), x.frame), x.holder)
            }

            function f() {
                C.data(o, S).addClass(x.input).attr("tabindex", -1).val(C.data("value") ? S.get("select", w.format) : r.value), w.editable || C.on("focus." + b.id + " click." + b.id, function(t) {
                    t.preventDefault(), S.$root[0].focus()
                }).on("keydown." + b.id, g), a(r, {
                    haspopup: !0,
                    expanded: !1,
                    readonly: !1,
                    owns: r.id + "_root"
                })
            }

            function h() {
                S.$root.on({
                    keydown: g,
                    focusin: function(t) {
                        S.$root.removeClass(x.focused), t.stopPropagation()
                    },
                    "mousedown click": function(e) {
                        var i = e.target;
                        i != S.$root.children()[0] && (e.stopPropagation(), "mousedown" != e.type || t(i).is("input, select, textarea, button, option") || (e.preventDefault(), S.$root[0].focus()))
                    }
                }).on({
                    focus: function() {
                        C.addClass(x.target)
                    },
                    blur: function() {
                        C.removeClass(x.target)
                    }
                }).on("focus.toOpen", m).on("click", "[data-pick], [data-nav], [data-clear], [data-close]", function() {
                    var e = t(this),
                        i = e.data(),
                        n = e.hasClass(x.navDisabled) || e.hasClass(x.disabled),
                        a = s();
                    a = a && (a.type || a.href), (n || a && !t.contains(S.$root[0], a)) && S.$root[0].focus(), !n && i.nav ? S.set("highlight", S.component.item.highlight, {
                        nav: i.nav
                    }) : !n && "pick" in i ? S.set("select", i.pick) : i.clear ? S.clear().close(!0) : i.close && S.close(!0)
                }), a(S.$root[0], "hidden", !0)
            }

            function v() {
                var e;
                w.hiddenName === !0 ? (e = r.name, r.name = "") : (e = ["string" == typeof w.hiddenPrefix ? w.hiddenPrefix : "", "string" == typeof w.hiddenSuffix ? w.hiddenSuffix : "_submit"], e = e[0] + r.name + e[1]), S._hidden = t('<input type=hidden name="' + e + '"' + (C.data("value") || r.value ? ' value="' + S.get("select", w.formatSubmit) + '"' : "") + ">")[0], C.on("change." + b.id, function() {
                    S._hidden.value = r.value ? S.get("select", w.formatSubmit) : ""
                }), w.container ? t(w.container).append(S._hidden) : C.after(S._hidden)
            }

            function g(t) {
                var e = t.keyCode,
                    i = /^(8|46)$/.test(e);
                return 27 == e ? (S.close(), !1) : void((32 == e || i || !b.open && S.component.key[e]) && (t.preventDefault(), t.stopPropagation(), i ? S.clear().close() : S.open()))
            }

            function m(t) {
                t.stopPropagation(), "focus" == t.type && S.$root.addClass(x.focused), S.open()
            }
            if (!r) return e;
            var y = !1,
                b = {
                    id: r.id || "P" + Math.abs(~~(Math.random() * new Date))
                },
                w = l ? t.extend(!0, {}, l.defaults, d) : d || {},
                x = t.extend({}, e.klasses(), w.klass),
                C = t(r),
                k = function() {
                    return this.start()
                },
                S = k.prototype = {
                    constructor: k,
                    $node: C,
                    start: function() {
                        return b && b.start ? S : (b.methods = {}, b.start = !0, b.open = !1, b.type = r.type, r.autofocus = r == s(), r.readOnly = !w.editable, r.id = r.id || b.id, "text" != r.type && (r.type = "text"), S.component = new l(S, w), S.$root = t(e._.node("div", p(), x.picker, 'id="' + r.id + '_root" tabindex="0"')), h(), w.formatSubmit && v(), f(), w.container ? t(w.container).append(S.$root) : C.after(S.$root), S.on({
                            start: S.component.onStart,
                            render: S.component.onRender,
                            stop: S.component.onStop,
                            open: S.component.onOpen,
                            close: S.component.onClose,
                            set: S.component.onSet
                        }).on({
                            start: w.onStart,
                            render: w.onRender,
                            stop: w.onStop,
                            open: w.onOpen,
                            close: w.onClose,
                            set: w.onSet
                        }), y = i(S.$root.children()[0]), r.autofocus && S.open(), S.trigger("start").trigger("render"))
                    },
                    render: function(t) {
                        return t ? S.$root.html(p()) : S.$root.find("." + x.box).html(S.component.nodes(b.open)), S.trigger("render")
                    },
                    stop: function() {
                        return b.start ? (S.close(), S._hidden && S._hidden.parentNode.removeChild(S._hidden), S.$root.remove(), C.removeClass(x.input).removeData(o), setTimeout(function() {
                            C.off("." + b.id)
                        }, 0), r.type = b.type, r.readOnly = !1, S.trigger("stop"), b.methods = {}, b.start = !1, S) : S
                    },
                    open: function(i) {
                        return b.open ? S : (C.addClass(x.active), a(r, "expanded", !0), setTimeout(function() {
                            S.$root.addClass(x.opened), a(S.$root[0], "hidden", !1)
                        }, 0), i !== !1 && (b.open = !0, y && c.css("overflow", "hidden").css("padding-right", "+=" + n()), S.$root[0].focus(), u.on("click." + b.id + " focusin." + b.id, function(t) {
                            var e = t.target;
                            e != r && e != document && 3 != t.which && S.close(e === S.$root.children()[0])
                        }).on("keydown." + b.id, function(i) {
                            var n = i.keyCode,
                                a = S.component.key[n],
                                r = i.target;
                            27 == n ? S.close(!0) : r != S.$root[0] || !a && 13 != n ? t.contains(S.$root[0], r) && 13 == n && (i.preventDefault(), r.click()) : (i.preventDefault(), a ? e._.trigger(S.component.key.go, S, [e._.trigger(a)]) : S.$root.find("." + x.highlighted).hasClass(x.disabled) || S.set("select", S.component.item.highlight).close())
                        })), S.trigger("open"))
                    },
                    close: function(t) {
                        return t && (S.$root.off("focus.toOpen")[0].focus(), setTimeout(function() {
                            S.$root.on("focus.toOpen", m)
                        }, 0)), C.removeClass(x.active), a(r, "expanded", !1), setTimeout(function() {
                            S.$root.removeClass(x.opened + " " + x.focused), a(S.$root[0], "hidden", !0)
                        }, 0), b.open ? (b.open = !1, y && c.css("overflow", "").css("padding-right", "-=" + n()), u.off("." + b.id), S.trigger("close")) : S
                    },
                    clear: function(t) {
                        return S.set("clear", null, t)
                    },
                    set: function(e, i, n) {
                        var a, r, o = t.isPlainObject(e),
                            s = o ? e : {};
                        if (n = o && t.isPlainObject(i) ? i : n || {}, e) {
                            o || (s[e] = i);
                            for (a in s) r = s[a], a in S.component.item && (void 0 === r && (r = null), S.component.set(a, r, n)), ("select" == a || "clear" == a) && C.val("clear" == a ? "" : S.get(a, w.format)).trigger("change");
                            S.render()
                        }
                        return n.muted ? S : S.trigger("set", s)
                    },
                    get: function(t, i) {
                        if (t = t || "value", null != b[t]) return b[t];
                        if ("valueSubmit" == t) {
                            if (S._hidden) return S._hidden.value;
                            t = "value"
                        }
                        if ("value" == t) return r.value;
                        if (t in S.component.item) {
                            if ("string" == typeof i) {
                                var n = S.component.get(t);
                                return n ? e._.trigger(S.component.formats.toString, S.component, [i, n]) : ""
                            }
                            return S.component.get(t)
                        }
                    },
                    on: function(e, i, n) {
                        var a, r, o = t.isPlainObject(e),
                            s = o ? e : {};
                        if (e) {
                            o || (s[e] = i);
                            for (a in s) r = s[a], n && (a = "_" + a), b.methods[a] = b.methods[a] || [], b.methods[a].push(r)
                        }
                        return S
                    },
                    off: function() {
                        var t, e, i = arguments;
                        for (t = 0, namesCount = i.length; t < namesCount; t += 1) e = i[t], e in b.methods && delete b.methods[e];
                        return S
                    },
                    trigger: function(t, i) {
                        var n = function(t) {
                            var n = b.methods[t];
                            n && n.map(function(t) {
                                e._.trigger(t, S, [i])
                            })
                        };
                        return n("_" + t), n(t), S
                    }
                };
            return new k
        }

        function i(t) {
            var e, i = "position";
            return t.currentStyle ? e = t.currentStyle[i] : window.getComputedStyle && (e = getComputedStyle(t)[i]), "fixed" == e
        }

        function n() {
            if (c.height() <= l.height()) return 0;
            var e = t('<div style="visibility:hidden;width:100px" />').appendTo("body"),
                i = e[0].offsetWidth;
            e.css("overflow", "scroll");
            var n = t('<div style="width:100%" />').appendTo(e),
                a = n[0].offsetWidth;
            return e.remove(), i - a
        }

        function a(e, i, n) {
            if (t.isPlainObject(i))
                for (var a in i) r(e, a, i[a]);
            else r(e, i, n)
        }

        function r(t, e, i) {
            t.setAttribute(("role" == e ? "" : "aria-") + e, i)
        }

        function o(e, i) {
            t.isPlainObject(e) || (e = {
                attribute: i
            }), i = "";
            for (var n in e) {
                var a = ("role" == n ? "" : "aria-") + n,
                    r = e[n];
                i += null == r ? "" : a + '="' + e[n] + '"'
            }
            return i
        }

        function s() {
            try {
                return document.activeElement
            } catch (t) {}
        }
        var l = t(window),
            u = t(document),
            c = t(document.documentElement);
        return e.klasses = function(t) {
            return t = t || "picker", {
                picker: t,
                opened: t + "--opened",
                focused: t + "--focused",
                input: t + "__input",
                active: t + "__input--active",
                target: t + "__input--target",
                holder: t + "__holder",
                frame: t + "__frame",
                wrap: t + "__wrap",
                box: t + "__box"
            }
        }, e._ = {
            group: function(t) {
                for (var i, n = "", a = e._.trigger(t.min, t); a <= e._.trigger(t.max, t, [a]); a += t.i) i = e._.trigger(t.item, t, [a]), n += e._.node(t.node, i[0], i[1], i[2]);
                return n
            },
            node: function(e, i, n, a) {
                return i ? (i = t.isArray(i) ? i.join("") : i, n = n ? ' class="' + n + '"' : "", a = a ? " " + a : "", "<" + e + n + a + ">" + i + "</" + e + ">") : ""
            },
            lead: function(t) {
                return (10 > t ? "0" : "") + t
            },
            trigger: function(t, e, i) {
                return "function" == typeof t ? t.apply(e, i || []) : t
            },
            digits: function(t) {
                return /\d/.test(t[1]) ? 2 : 1
            },
            isDate: function(t) {
                return {}.toString.call(t).indexOf("Date") > -1 && this.isInteger(t.getDate())
            },
            isInteger: function(t) {
                return {}.toString.call(t).indexOf("Number") > -1 && t % 1 === 0
            },
            ariaAttr: o
        }, e.extend = function(i, n) {
            t.fn[i] = function(a, r) {
                var o = this.data(i);
                return "picker" == a ? o : o && "string" == typeof a ? e._.trigger(o[a], o, [r]) : this.each(function() {
                    var r = t(this);
                    r.data(i) || new e(this, i, n, a)
                })
            }, t.fn[i].defaults = n.defaults
        }, e
    }),
    function(t) {
        "function" == typeof define && define.amd ? define(["picker", "jquery"], t) : "object" == typeof exports ? module.exports = t(require("./picker.js"), require("jquery")) : t(Picker, jQuery)
    }(function(t, e) {
        function i(t, e) {
            var i = this,
                n = t.$node[0],
                a = n.value,
                r = t.$node.data("value"),
                o = r || a,
                s = r ? e.formatSubmit : e.format,
                l = function() {
                    return n.currentStyle ? "rtl" == n.currentStyle.direction : "rtl" == getComputedStyle(t.$root[0]).direction
                };
            i.settings = e, i.$node = t.$node, i.queue = {
                min: "measure create",
                max: "measure create",
                now: "now create",
                select: "parse create validate",
                highlight: "parse navigate create validate",
                view: "parse create validate viewset",
                disable: "deactivate",
                enable: "activate"
            }, i.item = {}, i.item.clear = null, i.item.disable = (e.disable || []).slice(0), i.item.enable = - function(t) {
                return t[0] === !0 ? t.shift() : -1
            }(i.item.disable), i.set("min", e.min).set("max", e.max).set("now"), o ? i.set("select", o, {
                format: s
            }) : i.set("select", null).set("highlight", i.item.now), i.key = {
                40: 7,
                38: -7,
                39: function() {
                    return l() ? -1 : 1
                },
                37: function() {
                    return l() ? 1 : -1
                },
                go: function(t) {
                    var e = i.item.highlight,
                        n = new Date(e.year, e.month, e.date + t);
                    i.set("highlight", n, {
                        interval: t
                    }), this.render()
                }
            }, t.on("render", function() {
                t.$root.find("." + e.klass.selectMonth).on("change", function() {
                    var i = this.value;
                    i && (t.set("highlight", [t.get("view").year, i, t.get("highlight").date]), t.$root.find("." + e.klass.selectMonth).trigger("focus"))
                }), t.$root.find("." + e.klass.selectYear).on("change", function() {
                    var i = this.value;
                    i && (t.set("highlight", [i, t.get("view").month, t.get("highlight").date]), t.$root.find("." + e.klass.selectYear).trigger("focus"))
                })
            }, 1).on("open", function() {
                var n = "";
                i.disabled(i.get("now")) && (n = ":not(." + e.klass.buttonToday + ")"), t.$root.find("button" + n + ", select").attr("disabled", !1)
            }, 1).on("close", function() {
                t.$root.find("button, select").attr("disabled", !0)
            }, 1)
        }
        var n = 7,
            a = 6,
            r = t._;
        i.prototype.set = function(t, e, i) {
            var n = this,
                a = n.item;
            return null === e ? ("clear" == t && (t = "select"), a[t] = e, n) : (a["enable" == t ? "disable" : "flip" == t ? "enable" : t] = n.queue[t].split(" ").map(function(a) {
                return e = n[a](t, e, i)
            }).pop(), "select" == t ? n.set("highlight", a.select, i) : "highlight" == t ? n.set("view", a.highlight, i) : t.match(/^(flip|min|max|disable|enable)$/) && (a.select && n.disabled(a.select) && n.set("select", a.select, i), a.highlight && n.disabled(a.highlight) && n.set("highlight", a.highlight, i)), n)
        }, i.prototype.get = function(t) {
            return this.item[t]
        }, i.prototype.create = function(t, i, n) {
            var a, o = this;
            return i = void 0 === i ? t : i, i == -1 / 0 || 1 / 0 == i ? a = i : e.isPlainObject(i) && r.isInteger(i.pick) ? i = i.obj : e.isArray(i) ? (i = new Date(i[0], i[1], i[2]), i = r.isDate(i) ? i : o.create().obj) : i = r.isInteger(i) || r.isDate(i) ? o.normalize(new Date(i), n) : o.now(t, i, n), {
                year: a || i.getFullYear(),
                month: a || i.getMonth(),
                date: a || i.getDate(),
                day: a || i.getDay(),
                obj: a || i,
                pick: a || i.getTime()
            }
        }, i.prototype.createRange = function(t, i) {
            var n = this,
                a = function(t) {
                    return t === !0 || e.isArray(t) || r.isDate(t) ? n.create(t) : t
                };
            return r.isInteger(t) || (t = a(t)), r.isInteger(i) || (i = a(i)), r.isInteger(t) && e.isPlainObject(i) ? t = [i.year, i.month, i.date + t] : r.isInteger(i) && e.isPlainObject(t) && (i = [t.year, t.month, t.date + i]), {
                from: a(t),
                to: a(i)
            }
        }, i.prototype.withinRange = function(t, e) {
            return t = this.createRange(t.from, t.to), e.pick >= t.from.pick && e.pick <= t.to.pick
        }, i.prototype.overlapRanges = function(t, e) {
            var i = this;
            return t = i.createRange(t.from, t.to), e = i.createRange(e.from, e.to), i.withinRange(t, e.from) || i.withinRange(t, e.to) || i.withinRange(e, t.from) || i.withinRange(e, t.to)
        }, i.prototype.now = function(t, e, i) {
            return e = new Date, i && i.rel && e.setDate(e.getDate() + i.rel), this.normalize(e, i)
        }, i.prototype.navigate = function(t, i, n) {
            var a, r, o, s, l = e.isArray(i),
                u = e.isPlainObject(i),
                c = this.item.view;
            if (l || u) {
                for (u ? (r = i.year, o = i.month, s = i.date) : (r = +i[0], o = +i[1], s = +i[2]), n && n.nav && c && c.month !== o && (r = c.year, o = c.month), a = new Date(r, o + (n && n.nav ? n.nav : 0), 1), r = a.getFullYear(), o = a.getMonth(); new Date(r, o, s).getMonth() !== o;) s -= 1;
                i = [r, o, s]
            }
            return i
        }, i.prototype.normalize = function(t) {
            return t.setHours(0, 0, 0, 0), t
        }, i.prototype.measure = function(t, e) {
            var i = this;
            return e ? "string" == typeof e ? e = i.parse(t, e) : r.isInteger(e) && (e = i.now(t, e, {
                rel: e
            })) : e = "min" == t ? -1 / 0 : 1 / 0, e
        }, i.prototype.viewset = function(t, e) {
            return this.create([e.year, e.month, 1])
        }, i.prototype.validate = function(t, i, n) {
            var a, o, s, l, u = this,
                c = i,
                d = n && n.interval ? n.interval : 1,
                p = -1 === u.item.enable,
                f = u.item.min,
                h = u.item.max,
                v = p && u.item.disable.filter(function(t) {
                    if (e.isArray(t)) {
                        var n = u.create(t).pick;
                        n < i.pick ? a = !0 : n > i.pick && (o = !0)
                    }
                    return r.isInteger(t)
                }).length;
            if ((!n || !n.nav) && (!p && u.disabled(i) || p && u.disabled(i) && (v || a || o) || !p && (i.pick <= f.pick || i.pick >= h.pick)))
                for (p && !v && (!o && d > 0 || !a && 0 > d) && (d *= -1); u.disabled(i) && (Math.abs(d) > 1 && (i.month < c.month || i.month > c.month) && (i = c, d = d > 0 ? 1 : -1), i.pick <= f.pick ? (s = !0, d = 1, i = u.create([f.year, f.month, f.date + (i.pick === f.pick ? 0 : -1)])) : i.pick >= h.pick && (l = !0, d = -1, i = u.create([h.year, h.month, h.date + (i.pick === h.pick ? 0 : 1)])), !s || !l);) i = u.create([i.year, i.month, i.date + d]);
            return i
        }, i.prototype.disabled = function(t) {
            var i = this,
                n = i.item.disable.filter(function(n) {
                    return r.isInteger(n) ? t.day === (i.settings.firstDay ? n : n - 1) % 7 : e.isArray(n) || r.isDate(n) ? t.pick === i.create(n).pick : e.isPlainObject(n) ? i.withinRange(n, t) : void 0
                });
            return n = n.length && !n.filter(function(t) {
                return e.isArray(t) && "inverted" == t[3] || e.isPlainObject(t) && t.inverted
            }).length, -1 === i.item.enable ? !n : n || t.pick < i.item.min.pick || t.pick > i.item.max.pick
        }, i.prototype.parse = function(t, e, i) {
            var n = this,
                a = {};
            return e && "string" == typeof e ? (i && i.format || (i = i || {}, i.format = n.settings.format), n.formats.toArray(i.format).map(function(t) {
                var i = n.formats[t],
                    o = i ? r.trigger(i, n, [e, a]) : t.replace(/^!/, "").length;
                i && (a[t] = e.substr(0, o)), e = e.substr(o)
            }), [a.yyyy || a.yy, +(a.mm || a.m) - 1, a.dd || a.d]) : e
        }, i.prototype.formats = function() {
            function t(t, e, i) {
                var n = t.match(/\w+/)[0];
                return i.mm || i.m || (i.m = e.indexOf(n) + 1), n.length
            }

            function e(t) {
                return t.match(/\w+/)[0].length
            }
            return {
                d: function(t, e) {
                    return t ? r.digits(t) : e.date
                },
                dd: function(t, e) {
                    return t ? 2 : r.lead(e.date)
                },
                ddd: function(t, i) {
                    return t ? e(t) : this.settings.weekdaysShort[i.day]
                },
                dddd: function(t, i) {
                    return t ? e(t) : this.settings.weekdaysFull[i.day]
                },
                m: function(t, e) {
                    return t ? r.digits(t) : e.month + 1
                },
                mm: function(t, e) {
                    return t ? 2 : r.lead(e.month + 1)
                },
                mmm: function(e, i) {
                    var n = this.settings.monthsShort;
                    return e ? t(e, n, i) : n[i.month]
                },
                mmmm: function(e, i) {
                    var n = this.settings.monthsFull;
                    return e ? t(e, n, i) : n[i.month]
                },
                yy: function(t, e) {
                    return t ? 2 : ("" + e.year).slice(2)
                },
                yyyy: function(t, e) {
                    return t ? 4 : e.year
                },
                toArray: function(t) {
                    return t.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g)
                },
                toString: function(t, e) {
                    var i = this;
                    return i.formats.toArray(t).map(function(t) {
                        return r.trigger(i.formats[t], i, [0, e]) || t.replace(/^!/, "")
                    }).join("")
                }
            }
        }(), i.prototype.isDateExact = function(t, i) {
            var n = this;
            return r.isInteger(t) && r.isInteger(i) || "boolean" == typeof t && "boolean" == typeof i ? t === i : (r.isDate(t) || e.isArray(t)) && (r.isDate(i) || e.isArray(i)) ? n.create(t).pick === n.create(i).pick : e.isPlainObject(t) && e.isPlainObject(i) ? n.isDateExact(t.from, i.from) && n.isDateExact(t.to, i.to) : !1
        }, i.prototype.isDateOverlap = function(t, i) {
            var n = this,
                a = n.settings.firstDay ? 1 : 0;
            return r.isInteger(t) && (r.isDate(i) || e.isArray(i)) ? (t = t % 7 + a, t === n.create(i).day + 1) : r.isInteger(i) && (r.isDate(t) || e.isArray(t)) ? (i = i % 7 + a, i === n.create(t).day + 1) : e.isPlainObject(t) && e.isPlainObject(i) ? n.overlapRanges(t, i) : !1
        }, i.prototype.flipEnable = function(t) {
            var e = this.item;
            e.enable = t || (-1 == e.enable ? 1 : -1)
        }, i.prototype.deactivate = function(t, i) {
            var n = this,
                a = n.item.disable.slice(0);
            return "flip" == i ? n.flipEnable() : i === !1 ? (n.flipEnable(1), a = []) : i === !0 ? (n.flipEnable(-1), a = []) : i.map(function(t) {
                for (var i, o = 0; o < a.length; o += 1)
                    if (n.isDateExact(t, a[o])) {
                        i = !0;
                        break
                    }
                i || (r.isInteger(t) || r.isDate(t) || e.isArray(t) || e.isPlainObject(t) && t.from && t.to) && a.push(t)
            }), a
        }, i.prototype.activate = function(t, i) {
            var n = this,
                a = n.item.disable,
                o = a.length;
            return "flip" == i ? n.flipEnable() : i === !0 ? (n.flipEnable(1), a = []) : i === !1 ? (n.flipEnable(-1), a = []) : i.map(function(t) {
                var i, s, l, u;
                for (l = 0; o > l; l += 1) {
                    if (s = a[l], n.isDateExact(s, t)) {
                        i = a[l] = null, u = !0;
                        break
                    }
                    if (n.isDateOverlap(s, t)) {
                        e.isPlainObject(t) ? (t.inverted = !0, i = t) : e.isArray(t) ? (i = t, i[3] || i.push("inverted")) : r.isDate(t) && (i = [t.getFullYear(), t.getMonth(), t.getDate(), "inverted"]);
                        break
                    }
                }
                if (i)
                    for (l = 0; o > l; l += 1)
                        if (n.isDateExact(a[l], t)) {
                            a[l] = null;
                            break
                        }
                if (u)
                    for (l = 0; o > l; l += 1)
                        if (n.isDateOverlap(a[l], t)) {
                            a[l] = null;
                            break
                        }
                i && a.push(i)
            }), a.filter(function(t) {
                return null != t
            })
        }, i.prototype.nodes = function(t) {
            var e = this,
                i = e.settings,
                o = e.item,
                s = o.now,
                l = o.select,
                u = o.highlight,
                c = o.view,
                d = o.disable,
                p = o.min,
                f = o.max,
                h = function(t, e) {
                    return i.firstDay && (t.push(t.shift()), e.push(e.shift())), r.node("thead", r.node("tr", r.group({
                        min: 0,
                        max: n - 1,
                        i: 1,
                        node: "th",
                        item: function(n) {
                            return [t[n], i.klass.weekdays, 'scope=col title="' + e[n] + '"']
                        }
                    })))
                }((i.showWeekdaysFull ? i.weekdaysFull : i.weekdaysLetter).slice(0), i.weekdaysFull.slice(0)),
                v = function(t) {
                    return r.node("div", " ", i.klass["nav" + (t ? "Next" : "Prev")] + (t && c.year >= f.year && c.month >= f.month || !t && c.year <= p.year && c.month <= p.month ? " " + i.klass.navDisabled : ""), "data-nav=" + (t || -1) + " " + r.ariaAttr({
                        role: "button",
                        controls: e.$node[0].id + "_table"
                    }) + ' title="' + (t ? i.labelMonthNext : i.labelMonthPrev) + '"')
                },
                g = function(n) {
                    var a = i.showMonthsShort ? i.monthsShort : i.monthsFull;
                    return "short_months" == n && (a = i.monthsShort), i.selectMonths && void 0 == n ? r.node("select", r.group({
                        min: 0,
                        max: 11,
                        i: 1,
                        node: "option",
                        item: function(t) {
                            return [a[t], 0, "value=" + t + (c.month == t ? " selected" : "") + (c.year == p.year && t < p.month || c.year == f.year && t > f.month ? " disabled" : "")]
                        }
                    }), i.klass.selectMonth + " browser-default", (t ? "" : "disabled") + " " + r.ariaAttr({
                        controls: e.$node[0].id + "_table"
                    }) + ' title="' + i.labelMonthSelect + '"') : "short_months" == n ? null != l ? r.node("div", a[l.month]) : r.node("div", a[c.month]) : r.node("div", a[c.month], i.klass.month)
                },
                m = function(n) {
                    var a = c.year,
                        o = i.selectYears === !0 ? 5 : ~~(i.selectYears / 2);
                    if (o) {
                        var s = p.year,
                            l = f.year,
                            u = a - o,
                            d = a + o;
                        if (s > u && (d += s - u, u = s), d > l) {
                            var h = u - s,
                                v = d - l;
                            u -= h > v ? v : h, d = l
                        }
                        if (i.selectYears && void 0 == n) return r.node("select", r.group({
                            min: u,
                            max: d,
                            i: 1,
                            node: "option",
                            item: function(t) {
                                return [t, 0, "value=" + t + (a == t ? " selected" : "")]
                            }
                        }), i.klass.selectYear + " browser-default", (t ? "" : "disabled") + " " + r.ariaAttr({
                            controls: e.$node[0].id + "_table"
                        }) + ' title="' + i.labelYearSelect + '"')
                    }
                    return "raw" == n ? r.node("div", a) : r.node("div", a, i.klass.year)
                };
            return createDayLabel = function() {
                return null != l ? r.node("div", l.date) : r.node("div", s.date)
            }, createWeekdayLabel = function() {
                var t;
                t = null != l ? l.day : s.day;
                var e = i.weekdaysFull[t];
                return e
            }, r.node("div", r.node("div", createWeekdayLabel(), "picker__weekday-display") + r.node("div", g("short_months"), i.klass.month_display) + r.node("div", createDayLabel(), i.klass.day_display) + r.node("div", m("raw"), i.klass.year_display), i.klass.date_display) + r.node("div", r.node("div", (i.selectYears ? g() + m() : g() + m()) + v() + v(1), i.klass.header) + r.node("table", h + r.node("tbody", r.group({
                min: 0,
                max: a - 1,
                i: 1,
                node: "tr",
                item: function(t) {
                    var a = i.firstDay && 0 === e.create([c.year, c.month, 1]).day ? -7 : 0;
                    return [r.group({
                        min: n * t - c.day + a + 1,
                        max: function() {
                            return this.min + n - 1
                        },
                        i: 1,
                        node: "td",
                        item: function(t) {
                            t = e.create([c.year, c.month, t + (i.firstDay ? 1 : 0)]);
                            var n = l && l.pick == t.pick,
                                a = u && u.pick == t.pick,
                                o = d && e.disabled(t) || t.pick < p.pick || t.pick > f.pick,
                                h = r.trigger(e.formats.toString, e, [i.format, t]);
                            return [r.node("div", t.date, function(e) {
                                return e.push(c.month == t.month ? i.klass.infocus : i.klass.outfocus), s.pick == t.pick && e.push(i.klass.now), n && e.push(i.klass.selected), a && e.push(i.klass.highlighted), o && e.push(i.klass.disabled), e.join(" ")
                            }([i.klass.day]), "data-pick=" + t.pick + " " + r.ariaAttr({
                                role: "gridcell",
                                label: h,
                                selected: n && e.$node.val() === h ? !0 : null,
                                activedescendant: a ? !0 : null,
                                disabled: o ? !0 : null
                            })), "", r.ariaAttr({
                                role: "presentation"
                            })]
                        }
                    })]
                }
            })), i.klass.table, 'id="' + e.$node[0].id + '_table" ' + r.ariaAttr({
                role: "grid",
                controls: e.$node[0].id,
                readonly: !0
            })), i.klass.calendar_container) + r.node("div", r.node("button", i.today, "btn-flat picker__today", "type=button data-pick=" + s.pick + (t && !e.disabled(s) ? "" : " disabled") + " " + r.ariaAttr({
                controls: e.$node[0].id
            })) + r.node("button", i.clear, "btn-flat picker__clear", "type=button data-clear=1" + (t ? "" : " disabled") + " " + r.ariaAttr({
                controls: e.$node[0].id
            })) + r.node("button", i.close, "btn-flat picker__close", "type=button data-close=true " + (t ? "" : " disabled") + " " + r.ariaAttr({
                controls: e.$node[0].id
            })), i.klass.footer)
        }, i.defaults = function(t) {
            return {
                labelMonthNext: "Next month",
                labelMonthPrev: "Previous month",
                labelMonthSelect: "Select a month",
                labelYearSelect: "Select a year",
                monthsFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                weekdaysFull: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                weekdaysLetter: ["S", "M", "T", "W", "T", "F", "S"],
                today: "Today",
                clear: "Clear",
                close: "Close",
                format: "d mmmm, yyyy",
                klass: {
                    table: t + "table",
                    header: t + "header",
                    date_display: t + "date-display",
                    day_display: t + "day-display",
                    month_display: t + "month-display",
                    year_display: t + "year-display",
                    calendar_container: t + "calendar-container",
                    navPrev: t + "nav--prev",
                    navNext: t + "nav--next",
                    navDisabled: t + "nav--disabled",
                    month: t + "month",
                    year: t + "year",
                    selectMonth: t + "select--month",
                    selectYear: t + "select--year",
                    weekdays: t + "weekday",
                    day: t + "day",
                    disabled: t + "day--disabled",
                    selected: t + "day--selected",
                    highlighted: t + "day--highlighted",
                    now: t + "day--today",
                    infocus: t + "day--infocus",
                    outfocus: t + "day--outfocus",
                    footer: t + "footer",
                    buttonClear: t + "button--clear",
                    buttonToday: t + "button--today",
                    buttonClose: t + "button--close"
                }
            }
        }(t.klasses().picker + "__"), t.extend("pickadate", i)
    }),
    function(t) {
        function e() {
            var e = +t(this).attr("length"),
                i = +t(this).val().length,
                n = e >= i;
            t(this).parent().find('span[class="character-counter"]').html(i + "/" + e), a(n, t(this))
        }

        function i(e) {
            $counterElement = t("<span/>").addClass("character-counter").css("float", "right").css("font-size", "12px").css("height", 1), e.parent().append($counterElement)
        }

        function n() {
            t(this).parent().find('span[class="character-counter"]').html("")
        }

        function a(t, e) {
            inputHasInvalidClass = e.hasClass("invalid"), t && inputHasInvalidClass ? e.removeClass("invalid") : t || inputHasInvalidClass || (e.removeClass("valid"), e.addClass("invalid"))
        }
        t.fn.characterCounter = function() {
            return this.each(function() {
                itHasLengthAttribute = void 0 != t(this).attr("length"), itHasLengthAttribute && (t(this).on("input", e), t(this).on("focus", e), t(this).on("blur", n), i(t(this)))
            })
        }, t(document).ready(function() {
            t("input, textarea").characterCounter()
        })
    }(jQuery);;
/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function() {
    function e() {}

    function t(e, t) {
        for (var n = e.length; n--;)
            if (e[n].listener === t) return n;
        return -1
    }

    function n(e) {
        return function() {
            return this[e].apply(this, arguments)
        }
    }
    var i = e.prototype,
        r = this,
        o = r.EventEmitter;
    i.getListeners = function(e) {
        var t, n, i = this._getEvents();
        if ("object" == typeof e) {
            t = {};
            for (n in i) i.hasOwnProperty(n) && e.test(n) && (t[n] = i[n])
        } else t = i[e] || (i[e] = []);
        return t
    }, i.flattenListeners = function(e) {
        var t, n = [];
        for (t = 0; e.length > t; t += 1) n.push(e[t].listener);
        return n
    }, i.getListenersAsObject = function(e) {
        var t, n = this.getListeners(e);
        return n instanceof Array && (t = {}, t[e] = n), t || n
    }, i.addListener = function(e, n) {
        var i, r = this.getListenersAsObject(e),
            o = "object" == typeof n;
        for (i in r) r.hasOwnProperty(i) && -1 === t(r[i], n) && r[i].push(o ? n : {
            listener: n,
            once: !1
        });
        return this
    }, i.on = n("addListener"), i.addOnceListener = function(e, t) {
        return this.addListener(e, {
            listener: t,
            once: !0
        })
    }, i.once = n("addOnceListener"), i.defineEvent = function(e) {
        return this.getListeners(e), this
    }, i.defineEvents = function(e) {
        for (var t = 0; e.length > t; t += 1) this.defineEvent(e[t]);
        return this
    }, i.removeListener = function(e, n) {
        var i, r, o = this.getListenersAsObject(e);
        for (r in o) o.hasOwnProperty(r) && (i = t(o[r], n), -1 !== i && o[r].splice(i, 1));
        return this
    }, i.off = n("removeListener"), i.addListeners = function(e, t) {
        return this.manipulateListeners(!1, e, t)
    }, i.removeListeners = function(e, t) {
        return this.manipulateListeners(!0, e, t)
    }, i.manipulateListeners = function(e, t, n) {
        var i, r, o = e ? this.removeListener : this.addListener,
            s = e ? this.removeListeners : this.addListeners;
        if ("object" != typeof t || t instanceof RegExp)
            for (i = n.length; i--;) o.call(this, t, n[i]);
        else
            for (i in t) t.hasOwnProperty(i) && (r = t[i]) && ("function" == typeof r ? o.call(this, i, r) : s.call(this, i, r));
        return this
    }, i.removeEvent = function(e) {
        var t, n = typeof e,
            i = this._getEvents();
        if ("string" === n) delete i[e];
        else if ("object" === n)
            for (t in i) i.hasOwnProperty(t) && e.test(t) && delete i[t];
        else delete this._events;
        return this
    }, i.removeAllListeners = n("removeEvent"), i.emitEvent = function(e, t) {
        var n, i, r, o, s = this.getListenersAsObject(e);
        for (r in s)
            if (s.hasOwnProperty(r))
                for (i = s[r].length; i--;) n = s[r][i], n.once === !0 && this.removeListener(e, n.listener), o = n.listener.apply(this, t || []), o === this._getOnceReturnValue() && this.removeListener(e, n.listener);
        return this
    }, i.trigger = n("emitEvent"), i.emit = function(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(e, t)
    }, i.setOnceReturnValue = function(e) {
        return this._onceReturnValue = e, this
    }, i._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, i._getEvents = function() {
        return this._events || (this._events = {})
    }, e.noConflict = function() {
        return r.EventEmitter = o, e
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return e
    }) : "object" == typeof module && module.exports ? module.exports = e : this.EventEmitter = e
}).call(this),
    function(e) {
        function t(t) {
            var n = e.event;
            return n.target = n.target || n.srcElement || t, n
        }
        var n = document.documentElement,
            i = function() {};
        n.addEventListener ? i = function(e, t, n) {
            e.addEventListener(t, n, !1)
        } : n.attachEvent && (i = function(e, n, i) {
            e[n + i] = i.handleEvent ? function() {
                var n = t(e);
                i.handleEvent.call(i, n)
            } : function() {
                var n = t(e);
                i.call(e, n)
            }, e.attachEvent("on" + n, e[n + i])
        });
        var r = function() {};
        n.removeEventListener ? r = function(e, t, n) {
            e.removeEventListener(t, n, !1)
        } : n.detachEvent && (r = function(e, t, n) {
            e.detachEvent("on" + t, e[t + n]);
            try {
                delete e[t + n]
            } catch (i) {
                e[t + n] = void 0
            }
        });
        var o = {
            bind: i,
            unbind: r
        };
        "function" == typeof define && define.amd ? define("eventie/eventie", o) : e.eventie = o
    }(this),
    function(e, t) {
        "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], function(n, i) {
            return t(e, n, i)
        }) : "object" == typeof exports ? module.exports = t(e, require("wolfy87-eventemitter"), require("eventie")) : e.imagesLoaded = t(e, e.EventEmitter, e.eventie)
    }(window, function(e, t, n) {
        function i(e, t) {
            for (var n in t) e[n] = t[n];
            return e
        }

        function r(e) {
            return "[object Array]" === d.call(e)
        }

        function o(e) {
            var t = [];
            if (r(e)) t = e;
            else if ("number" == typeof e.length)
                for (var n = 0, i = e.length; i > n; n++) t.push(e[n]);
            else t.push(e);
            return t
        }

        function s(e, t, n) {
            if (!(this instanceof s)) return new s(e, t);
            "string" == typeof e && (e = document.querySelectorAll(e)), this.elements = o(e), this.options = i({}, this.options), "function" == typeof t ? n = t : i(this.options, t), n && this.on("always", n), this.getImages(), a && (this.jqDeferred = new a.Deferred);
            var r = this;
            setTimeout(function() {
                r.check()
            })
        }

        function f(e) {
            this.img = e
        }

        function c(e) {
            this.src = e, v[e] = this
        }
        var a = e.jQuery,
            u = e.console,
            h = u !== void 0,
            d = Object.prototype.toString;
        s.prototype = new t, s.prototype.options = {}, s.prototype.getImages = function() {
            this.images = [];
            for (var e = 0, t = this.elements.length; t > e; e++) {
                var n = this.elements[e];
                "IMG" === n.nodeName && this.addImage(n);
                var i = n.nodeType;
                if (i && (1 === i || 9 === i || 11 === i))
                    for (var r = n.querySelectorAll("img"), o = 0, s = r.length; s > o; o++) {
                        var f = r[o];
                        this.addImage(f)
                    }
            }
        }, s.prototype.addImage = function(e) {
            var t = new f(e);
            this.images.push(t)
        }, s.prototype.check = function() {
            function e(e, r) {
                return t.options.debug && h && u.log("confirm", e, r), t.progress(e), n++, n === i && t.complete(), !0
            }
            var t = this,
                n = 0,
                i = this.images.length;
            if (this.hasAnyBroken = !1, !i) return this.complete(), void 0;
            for (var r = 0; i > r; r++) {
                var o = this.images[r];
                o.on("confirm", e), o.check()
            }
        }, s.prototype.progress = function(e) {
            this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded;
            var t = this;
            setTimeout(function() {
                t.emit("progress", t, e), t.jqDeferred && t.jqDeferred.notify && t.jqDeferred.notify(t, e)
            })
        }, s.prototype.complete = function() {
            var e = this.hasAnyBroken ? "fail" : "done";
            this.isComplete = !0;
            var t = this;
            setTimeout(function() {
                if (t.emit(e, t), t.emit("always", t), t.jqDeferred) {
                    var n = t.hasAnyBroken ? "reject" : "resolve";
                    t.jqDeferred[n](t)
                }
            })
        }, a && (a.fn.imagesLoaded = function(e, t) {
            var n = new s(this, e, t);
            return n.jqDeferred.promise(a(this))
        }), f.prototype = new t, f.prototype.check = function() {
            var e = v[this.img.src] || new c(this.img.src);
            if (e.isConfirmed) return this.confirm(e.isLoaded, "cached was confirmed"), void 0;
            if (this.img.complete && void 0 !== this.img.naturalWidth) return this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), void 0;
            var t = this;
            e.on("confirm", function(e, n) {
                return t.confirm(e.isLoaded, n), !0
            }), e.check()
        }, f.prototype.confirm = function(e, t) {
            this.isLoaded = e, this.emit("confirm", this, t)
        };
        var v = {};
        return c.prototype = new t, c.prototype.check = function() {
            if (!this.isChecked) {
                var e = new Image;
                n.bind(e, "load", this), n.bind(e, "error", this), e.src = this.src, this.isChecked = !0
            }
        }, c.prototype.handleEvent = function(e) {
            var t = "on" + e.type;
            this[t] && this[t](e)
        }, c.prototype.onload = function(e) {
            this.confirm(!0, "onload"), this.unbindProxyEvents(e)
        }, c.prototype.onerror = function(e) {
            this.confirm(!1, "onerror"), this.unbindProxyEvents(e)
        }, c.prototype.confirm = function(e, t) {
            this.isConfirmed = !0, this.isLoaded = e, this.emit("confirm", this, t)
        }, c.prototype.unbindProxyEvents = function(e) {
            n.unbind(e.target, "load", this), n.unbind(e.target, "error", this)
        }, s
    });;
/*!
 * Shuffle.js by @Vestride
 * Categorize, sort, and filter a responsive grid of items.
 * Dependencies: jQuery 1.9+, Modernizr 2.6.2+
 * @license MIT license
 * @version 3.1.1
 */
window.Modernizr = function(a, b, c) {
        function d(a) {
            s.cssText = a
        }

        function e(a, b) {
            return typeof a === b
        }

        function f(a, b) {
            return !!~("" + a).indexOf(b)
        }

        function g(a, b) {
            for (var d in a) {
                var e = a[d];
                if (!f(e, "-") && s[e] !== c) return "pfx" == b ? e : !0
            }
            return !1
        }

        function h(a, b, d) {
            for (var f in a) {
                var g = b[a[f]];
                if (g !== c) return d === !1 ? a[f] : e(g, "function") ? g.bind(d || b) : g
            }
            return !1
        }

        function i(a, b, c) {
            var d = a.charAt(0).toUpperCase() + a.slice(1),
                f = (a + " " + v.join(d + " ") + d).split(" ");
            return e(b, "string") || e(b, "undefined") ? g(f, b) : (f = (a + " " + w.join(d + " ") + d).split(" "), h(f, b, c))
        }
        var j, k, l, m = "2.6.2",
            n = {},
            o = !0,
            p = b.documentElement,
            q = "modernizr",
            r = b.createElement(q),
            s = r.style,
            t = ({}.toString, " -webkit- -moz- -o- -ms- ".split(" ")),
            u = "Webkit Moz O ms",
            v = u.split(" "),
            w = u.toLowerCase().split(" "),
            x = {},
            y = [],
            z = y.slice,
            A = function(a, c, d, e) {
                var f, g, h, i, j = b.createElement("div"),
                    k = b.body,
                    l = k || b.createElement("body");
                if (parseInt(d, 10))
                    for (; d--;) h = b.createElement("div"), h.id = e ? e[d] : q + (d + 1), j.appendChild(h);
                return f = ["&#173;", '<style id="s', q, '">', a, "</style>"].join(""), j.id = q, (k ? j : l).innerHTML += f, l.appendChild(j), k || (l.style.background = "", l.style.overflow = "hidden", i = p.style.overflow, p.style.overflow = "hidden", p.appendChild(l)), g = c(j, a), k ? j.parentNode.removeChild(j) : (l.parentNode.removeChild(l), p.style.overflow = i), !!g
            },
            B = {}.hasOwnProperty;
        l = e(B, "undefined") || e(B.call, "undefined") ? function(a, b) {
            return b in a && e(a.constructor.prototype[b], "undefined")
        } : function(a, b) {
            return B.call(a, b)
        }, Function.prototype.bind || (Function.prototype.bind = function(a) {
            var b = this;
            if ("function" != typeof b) throw new TypeError;
            var c = z.call(arguments, 1),
                d = function() {
                    if (this instanceof d) {
                        var e = function() {};
                        e.prototype = b.prototype;
                        var f = new e,
                            g = b.apply(f, c.concat(z.call(arguments)));
                        return Object(g) === g ? g : f
                    }
                    return b.apply(a, c.concat(z.call(arguments)))
                };
            return d
        }), x.csstransforms = function() {
            return !!i("transform")
        }, x.csstransforms3d = function() {
            var a = !!i("perspective");
            return a && "webkitPerspective" in p.style && A("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function(b) {
                a = 9 === b.offsetLeft && 3 === b.offsetHeight
            }), a
        }, x.csstransitions = function() {
            return i("transition")
        };
        for (var C in x) l(x, C) && (k = C.toLowerCase(), n[k] = x[C](), y.push((n[k] ? "" : "no-") + k));
        return n.addTest = function(a, b) {
            if ("object" == typeof a)
                for (var d in a) l(a, d) && n.addTest(d, a[d]);
            else {
                if (a = a.toLowerCase(), n[a] !== c) return n;
                b = "function" == typeof b ? b() : b, "undefined" != typeof o && o && (p.className += " " + (b ? "" : "no-") + a), n[a] = b
            }
            return n
        }, d(""), r = j = null, n._version = m, n._prefixes = t, n._domPrefixes = w, n._cssomPrefixes = v, n.testProp = function(a) {
            return g([a])
        }, n.testAllProps = i, n.testStyles = A, n.prefixed = function(a, b, c) {
            return b ? i(a, b, c) : i(a, "pfx")
        }, p.className = p.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (o ? " js " + y.join(" ") : ""), n
    }(this, this.document),
    function(a) {
        "function" == typeof define && define.amd ? define(["jquery", "modernizr"], a) : "object" == typeof exports ? module.exports = a(require("jquery"), window.Modernizr) : window.Shuffle = a(window.jQuery, window.Modernizr)
    }(function(a, b, c) {
        "use strict";

        function d(a) {
            return a ? a.replace(/([A-Z])/g, function(a, b) {
                return "-" + b.toLowerCase()
            }).replace(/^ms-/, "-ms-") : ""
        }

        function e(b, c, d) {
            var e, f, g, h = null,
                i = 0;
            d = d || {};
            var j = function() {
                i = d.leading === !1 ? 0 : a.now(), h = null, g = b.apply(e, f), e = f = null
            };
            return function() {
                var k = a.now();
                i || d.leading !== !1 || (i = k);
                var l = c - (k - i);
                return e = this, f = arguments, 0 >= l || l > c ? (clearTimeout(h), h = null, i = k, g = b.apply(e, f), e = f = null) : h || d.trailing === !1 || (h = setTimeout(j, l)), g
            }
        }

        function f(a, b, c) {
            for (var d = 0, e = a.length; e > d; d++)
                if (b.call(c, a[d], d, a) === {}) return
        }

        function g(b, c, d) {
            return setTimeout(a.proxy(b, c), d)
        }

        function h(a) {
            return Math.max.apply(Math, a)
        }

        function i(a) {
            return Math.min.apply(Math, a)
        }

        function j(b) {
            return a.isNumeric(b) ? b : 0
        }

        function k(a) {
            var b, c, d = a.length;
            if (!d) return a;
            for (; --d;) c = Math.floor(Math.random() * (d + 1)), b = a[c], a[c] = a[d], a[d] = b;
            return a
        }
        if ("object" != typeof b) throw new Error("Shuffle.js requires Modernizr.\nhttp://vestride.github.io/Shuffle/#dependencies");
        var l = b.prefixed("transition"),
            m = b.prefixed("transitionDelay"),
            n = b.prefixed("transitionDuration"),
            o = {
                WebkitTransition: "webkitTransitionEnd",
                transition: "transitionend"
            }[l],
            p = b.prefixed("transform"),
            q = d(p),
            r = b.csstransforms && b.csstransitions,
            s = b.csstransforms3d,
            t = !!window.getComputedStyle,
            u = "shuffle",
            v = "all",
            w = "groups",
            x = 1,
            y = .001,
            z = window.getComputedStyle || function() {},
            A = function(a, b) {
                this.x = j(a), this.y = j(b)
            };
        A.equals = function(a, b) {
            return a.x === b.x && a.y === b.y
        };
        var B = function() {
                if (!t) return !1;
                var a = document.body || document.documentElement,
                    b = document.createElement("div");
                b.style.cssText = "width:10px;padding:2px;-webkit-box-sizing:border-box;box-sizing:border-box;", a.appendChild(b);
                var c = z(b, null).width,
                    d = "10px" === c;
                return a.removeChild(b), d
            }(),
            C = 0,
            D = a(window),
            E = function(b, c) {
                c = c || {}, a.extend(this, E.options, c, E.settings), this.$el = a(b), this.element = b, this.unique = "shuffle_" + C++, this._fire(E.EventType.LOADING), this._init(), g(function() {
                    this.initialized = !0, this._fire(E.EventType.DONE)
                }, this, 16)
            };
        return E.EventType = {
            LOADING: "loading",
            DONE: "done",
            LAYOUT: "layout",
            REMOVED: "removed"
        }, E.ClassName = {
            BASE: u,
            SHUFFLE_ITEM: "shuffle-item",
            FILTERED: "filtered",
            CONCEALED: "concealed"
        }, E.options = {
            group: v,
            speed: 250,
            easing: "ease-out",
            itemSelector: "",
            sizer: null,
            gutterWidth: 0,
            columnWidth: 0,
            delimeter: null,
            buffer: 0,
            columnThreshold: t ? .01 : .1,
            initialSort: null,
            throttle: e,
            throttleTime: 300,
            sequentialFadeDelay: 150,
            supported: r
        }, E.settings = {
            useSizer: !1,
            itemCss: {
                position: "absolute",
                top: 0,
                left: 0,
                visibility: "visible"
            },
            revealAppendedDelay: 300,
            lastSort: {},
            lastFilter: v,
            enabled: !0,
            destroyed: !1,
            initialized: !1,
            _animations: [],
            _transitions: [],
            _isMovementCanceled: !1,
            styleQueue: []
        }, E.Point = A, E._getItemTransformString = function(a, b) {
            return s ? "translate3d(" + a.x + "px, " + a.y + "px, 0) scale3d(" + b + ", " + b + ", 1)" : "translate(" + a.x + "px, " + a.y + "px) scale(" + b + ")"
        }, E._getNumberStyle = function(b, c, d) {
            if (t) {
                d = d || z(b, null);
                var e = E._getFloat(d[c]);
                return B || "width" !== c ? B || "height" !== c || (e += E._getFloat(d.paddingTop) + E._getFloat(d.paddingBottom) + E._getFloat(d.borderTopWidth) + E._getFloat(d.borderBottomWidth)) : e += E._getFloat(d.paddingLeft) + E._getFloat(d.paddingRight) + E._getFloat(d.borderLeftWidth) + E._getFloat(d.borderRightWidth), e
            }
            return E._getFloat(a(b).css(c))
        }, E._getFloat = function(a) {
            return j(parseFloat(a))
        }, E._getOuterWidth = function(a, b) {
            var c = z(a, null),
                d = E._getNumberStyle(a, "width", c);
            if (b) {
                var e = E._getNumberStyle(a, "marginLeft", c),
                    f = E._getNumberStyle(a, "marginRight", c);
                d += e + f
            }
            return d
        }, E._getOuterHeight = function(a, b) {
            var c = z(a, null),
                d = E._getNumberStyle(a, "height", c);
            if (b) {
                var e = E._getNumberStyle(a, "marginTop", c),
                    f = E._getNumberStyle(a, "marginBottom", c);
                d += e + f
            }
            return d
        }, E._skipTransition = function(a, b, c) {
            var d = a.style[n];
            a.style[n] = "0ms", b.call(c);
            var e = a.offsetWidth;
            e = null, a.style[n] = d
        }, E.prototype._init = function() {
            this.$items = this._getItems(), this.sizer = this._getElementOption(this.sizer), this.sizer && (this.useSizer = !0), this.$el.addClass(E.ClassName.BASE), this._initItems(), D.on("resize." + u + "." + this.unique, this._getResizeFunction());
            var a = this.$el.css(["position", "overflow"]),
                b = E._getOuterWidth(this.element);
            this._validateStyles(a), this._setColumns(b), this.shuffle(this.group, this.initialSort), this.supported && g(function() {
                this._setTransitions(), this.element.style[l] = "height " + this.speed + "ms " + this.easing
            }, this)
        }, E.prototype._getResizeFunction = function() {
            var b = a.proxy(this._onResize, this);
            return this.throttle ? this.throttle(b, this.throttleTime) : b
        }, E.prototype._getElementOption = function(a) {
            return "string" == typeof a ? this.$el.find(a)[0] || null : a && a.nodeType && 1 === a.nodeType ? a : a && a.jquery ? a[0] : null
        }, E.prototype._validateStyles = function(a) {
            "static" === a.position && (this.element.style.position = "relative"), "hidden" !== a.overflow && (this.element.style.overflow = "hidden")
        }, E.prototype._filter = function(a, b) {
            a = a || this.lastFilter, b = b || this.$items;
            var c = this._getFilteredSets(a, b);
            return this._toggleFilterClasses(c.filtered, c.concealed), this.lastFilter = a, "string" == typeof a && (this.group = a), c.filtered
        }, E.prototype._getFilteredSets = function(b, c) {
            var d = a(),
                e = a();
            return b === v ? d = c : f(c, function(c) {
                var f = a(c);
                this._doesPassFilter(b, f) ? d = d.add(f) : e = e.add(f)
            }, this), {
                filtered: d,
                concealed: e
            }
        }, E.prototype._doesPassFilter = function(b, c) {
            if (a.isFunction(b)) return b.call(c[0], c, this);
            var d = c.data(w),
                e = this.delimeter && !a.isArray(d) ? d.split(this.delimeter) : d;
            return a.inArray(b, e) > -1
        }, E.prototype._toggleFilterClasses = function(a, b) {
            a.removeClass(E.ClassName.CONCEALED).addClass(E.ClassName.FILTERED), b.removeClass(E.ClassName.FILTERED).addClass(E.ClassName.CONCEALED)
        }, E.prototype._initItems = function(a) {
            a = a || this.$items, a.addClass([E.ClassName.SHUFFLE_ITEM, E.ClassName.FILTERED].join(" ")), a.css(this.itemCss).data("point", new A).data("scale", x)
        }, E.prototype._updateItemCount = function() {
            this.visibleItems = this._getFilteredItems().length
        }, E.prototype._setTransition = function(a) {
            a.style[l] = q + " " + this.speed + "ms " + this.easing + ", opacity " + this.speed + "ms " + this.easing
        }, E.prototype._setTransitions = function(a) {
            a = a || this.$items, f(a, function(a) {
                this._setTransition(a)
            }, this)
        }, E.prototype._setSequentialDelay = function(a) {
            this.supported && f(a, function(a, b) {
                a.style[m] = "0ms," + (b + 1) * this.sequentialFadeDelay + "ms"
            }, this)
        }, E.prototype._getItems = function() {
            return this.$el.children(this.itemSelector)
        }, E.prototype._getFilteredItems = function() {
            return this.$items.filter("." + E.ClassName.FILTERED)
        }, E.prototype._getConcealedItems = function() {
            return this.$items.filter("." + E.ClassName.CONCEALED)
        }, E.prototype._getColumnSize = function(b, c) {
            var d;
            return d = a.isFunction(this.columnWidth) ? this.columnWidth(b) : this.useSizer ? E._getOuterWidth(this.sizer) : this.columnWidth ? this.columnWidth : this.$items.length > 0 ? E._getOuterWidth(this.$items[0], !0) : b, 0 === d && (d = b), d + c
        }, E.prototype._getGutterSize = function(b) {
            var c;
            return c = a.isFunction(this.gutterWidth) ? this.gutterWidth(b) : this.useSizer ? E._getNumberStyle(this.sizer, "marginLeft") : this.gutterWidth
        }, E.prototype._setColumns = function(a) {
            var b = a || E._getOuterWidth(this.element),
                c = this._getGutterSize(b),
                d = this._getColumnSize(b, c),
                e = (b + c) / d;
            Math.abs(Math.round(e) - e) < this.columnThreshold && (e = Math.round(e)), this.cols = Math.max(Math.floor(e), 1), this.containerWidth = b, this.colWidth = d
        }, E.prototype._setContainerSize = function() {
            this.$el.css("height", this._getContainerSize())
        }, E.prototype._getContainerSize = function() {
            return h(this.positions)
        }, E.prototype._fire = function(a, b) {
            this.$el.trigger(a + "." + u, b && b.length ? b : [this])
        }, E.prototype._resetCols = function() {
            var a = this.cols;
            for (this.positions = []; a--;) this.positions.push(0)
        }, E.prototype._layout = function(a, b) {
            f(a, function(a) {
                this._layoutItem(a, !!b)
            }, this), this._processStyleQueue(), this._setContainerSize()
        }, E.prototype._layoutItem = function(b, c) {
            var d = a(b),
                e = d.data(),
                f = e.point,
                g = e.scale,
                h = {
                    width: E._getOuterWidth(b, !0),
                    height: E._getOuterHeight(b, !0)
                },
                i = this._getItemPosition(h);
            A.equals(f, i) && g === x || (e.point = i, e.scale = x, this.styleQueue.push({
                $item: d,
                point: i,
                scale: x,
                opacity: c ? 0 : 1,
                skipTransition: c || 0 === this.speed,
                callfront: function() {
                    c || d.css("visibility", "visible")
                },
                callback: function() {
                    c && d.css("visibility", "hidden")
                }
            }))
        }, E.prototype._getItemPosition = function(a) {
            for (var b = this._getColumnSpan(a.width, this.colWidth, this.cols), c = this._getColumnSet(b, this.cols), d = this._getShortColumn(c, this.buffer), e = new A(Math.round(this.colWidth * d), Math.round(c[d])), f = c[d] + a.height, g = this.cols + 1 - c.length, h = 0; g > h; h++) this.positions[d + h] = f;
            return e
        }, E.prototype._getColumnSpan = function(a, b, c) {
            var d = a / b;
            return Math.abs(Math.round(d) - d) < this.columnThreshold && (d = Math.round(d)), Math.min(Math.ceil(d), c)
        }, E.prototype._getColumnSet = function(a, b) {
            if (1 === a) return this.positions;
            for (var c = b + 1 - a, d = [], e = 0; c > e; e++) d[e] = h(this.positions.slice(e, e + a));
            return d
        }, E.prototype._getShortColumn = function(a, b) {
            for (var c = i(a), d = 0, e = a.length; e > d; d++)
                if (a[d] >= c - b && a[d] <= c + b) return d;
            return 0
        }, E.prototype._shrink = function(b) {
            var c = b || this._getConcealedItems();
            f(c, function(b) {
                var c = a(b),
                    d = c.data();
                d.scale !== y && (d.scale = y, this.styleQueue.push({
                    $item: c,
                    point: d.point,
                    scale: y,
                    opacity: 0,
                    callback: function() {
                        c.css("visibility", "hidden")
                    }
                }))
            }, this)
        }, E.prototype._onResize = function() {
            if (this.enabled && !this.destroyed) {
                var a = E._getOuterWidth(this.element);
                a !== this.containerWidth && this.update()
            }
        }, E.prototype._getStylesForTransition = function(a) {
            var b = {
                opacity: a.opacity
            };
            return this.supported ? b[p] = E._getItemTransformString(a.point, a.scale) : (b.left = a.point.x, b.top = a.point.y), b
        }, E.prototype._transition = function(b) {
            var c = this._getStylesForTransition(b);
            this._startItemAnimation(b.$item, c, b.callfront || a.noop, b.callback || a.noop)
        }, E.prototype._startItemAnimation = function(b, c, d, e) {
            function f(b) {
                b.target === b.currentTarget && (a(b.target).off(o, f), g._removeTransitionReference(h), e())
            }
            var g = this,
                h = {
                    $element: b,
                    handler: f
                };
            if (d(), !this.initialized) return b.css(c), void e();
            if (this.supported) b.css(c), b.on(o, f), this._transitions.push(h);
            else {
                var i = b.stop(!0).animate(c, this.speed, "swing", e);
                this._animations.push(i.promise())
            }
        }, E.prototype._processStyleQueue = function(b) {
            this.isTransitioning && this._cancelMovement();
            var c = a();
            f(this.styleQueue, function(a) {
                a.skipTransition ? this._styleImmediately(a) : (c = c.add(a.$item), this._transition(a))
            }, this), c.length > 0 && this.initialized && this.speed > 0 ? (this.isTransitioning = !0, this.supported ? this._whenCollectionDone(c, o, this._movementFinished) : this._whenAnimationsDone(this._movementFinished)) : b || g(this._layoutEnd, this), this.styleQueue.length = 0
        }, E.prototype._cancelMovement = function() {
            this.supported ? f(this._transitions, function(a) {
                a.$element.off(o, a.handler)
            }) : (this._isMovementCanceled = !0, this.$items.stop(!0), this._isMovementCanceled = !1), this._transitions.length = 0, this.isTransitioning = !1
        }, E.prototype._removeTransitionReference = function(b) {
            var c = a.inArray(b, this._transitions);
            c > -1 && this._transitions.splice(c, 1)
        }, E.prototype._styleImmediately = function(a) {
            E._skipTransition(a.$item[0], function() {
                a.$item.css(this._getStylesForTransition(a))
            }, this)
        }, E.prototype._movementFinished = function() {
            this.isTransitioning = !1, this._layoutEnd()
        }, E.prototype._layoutEnd = function() {
            this._fire(E.EventType.LAYOUT)
        }, E.prototype._addItems = function(a, b, c) {
            this._initItems(a), this._setTransitions(a), this.$items = this._getItems(), this._shrink(a), f(this.styleQueue, function(a) {
                a.skipTransition = !0
            }), this._processStyleQueue(!0), b ? this._addItemsToEnd(a, c) : this.shuffle(this.lastFilter)
        }, E.prototype._addItemsToEnd = function(a, b) {
            var c = this._filter(null, a),
                d = c.get();
            this._updateItemCount(), this._layout(d, !0), b && this.supported && this._setSequentialDelay(d), this._revealAppended(d)
        }, E.prototype._revealAppended = function(b) {
            g(function() {
                f(b, function(b) {
                    var c = a(b);
                    this._transition({
                        $item: c,
                        opacity: 1,
                        point: c.data("point"),
                        scale: x
                    })
                }, this), this._whenCollectionDone(a(b), o, function() {
                    a(b).css(m, "0ms"), this._movementFinished()
                })
            }, this, this.revealAppendedDelay)
        }, E.prototype._whenCollectionDone = function(b, c, d) {
            function e(b) {
                b.target === b.currentTarget && (a(b.target).off(c, e), f++, f === g && (h._removeTransitionReference(i), d.call(h)))
            }
            var f = 0,
                g = b.length,
                h = this,
                i = {
                    $element: b,
                    handler: e
                };
            b.on(c, e), this._transitions.push(i)
        }, E.prototype._whenAnimationsDone = function(b) {
            a.when.apply(null, this._animations).always(a.proxy(function() {
                this._animations.length = 0, this._isMovementCanceled || b.call(this)
            }, this))
        }, E.prototype.shuffle = function(a, b) {
            this.enabled && (a || (a = v), this._filter(a), this._updateItemCount(), this._shrink(), this.sort(b))
        }, E.prototype.sort = function(a) {
            if (this.enabled) {
                this._resetCols();
                var b = a || this.lastSort,
                    c = this._getFilteredItems().sorted(b);
                this._layout(c), this.lastSort = b
            }
        }, E.prototype.update = function(a) {
            this.enabled && (a || this._setColumns(), this.sort())
        }, E.prototype.layout = function() {
            this.update(!0)
        }, E.prototype.appended = function(a, b, c) {
            this._addItems(a, b === !0, c !== !1)
        }, E.prototype.disable = function() {
            this.enabled = !1
        }, E.prototype.enable = function(a) {
            this.enabled = !0, a !== !1 && this.update()
        }, E.prototype.remove = function(b) {
            function c() {
                b.remove(), this.$items = this._getItems(), this._updateItemCount(), this._fire(E.EventType.REMOVED, [b, this]), b = null
            }
            b.length && b.jquery && (this._toggleFilterClasses(a(), b), this._shrink(b), this.sort(), this.$el.one(E.EventType.LAYOUT + "." + u, a.proxy(c, this)))
        }, E.prototype.destroy = function() {
            D.off("." + this.unique), this.$el.removeClass(u).removeAttr("style").removeData(u), this.$items.removeAttr("style").removeData("point").removeData("scale").removeClass([E.ClassName.CONCEALED, E.ClassName.FILTERED, E.ClassName.SHUFFLE_ITEM].join(" ")), this.$items = null, this.$el = null, this.sizer = null, this.element = null, this._transitions = null, this.destroyed = !0
        }, a.fn.shuffle = function(b) {
            var c = Array.prototype.slice.call(arguments, 1);
            return this.each(function() {
                var d = a(this),
                    e = d.data(u);
                e ? "string" == typeof b && e[b] && e[b].apply(e, c) : (e = new E(this, b), d.data(u, e))
            })
        }, a.fn.sorted = function(b) {
            var d = a.extend({}, a.fn.sorted.defaults, b),
                e = this.get(),
                f = !1;
            return e.length ? d.randomize ? k(e) : (a.isFunction(d.by) && e.sort(function(b, e) {
                if (f) return 0;
                var g = d.by(a(b)),
                    h = d.by(a(e));
                return g === c && h === c ? (f = !0, 0) : h > g || "sortFirst" === g || "sortLast" === h ? -1 : g > h || "sortLast" === g || "sortFirst" === h ? 1 : 0
            }), f ? this.get() : (d.reverse && e.reverse(), e)) : []
        }, a.fn.sorted.defaults = {
            reverse: !1,
            by: null,
            randomize: !1
        }, E
    });;
/*!
 * Masonry PACKAGED v3.3.0
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

! function(a) {
    function b() {}

    function c(a) {
        function c(b) {
            b.prototype.option || (b.prototype.option = function(b) {
                a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b))
            })
        }

        function e(b, c) {
            a.fn[b] = function(e) {
                if ("string" == typeof e) {
                    for (var g = d.call(arguments, 1), h = 0, i = this.length; i > h; h++) {
                        var j = this[h],
                            k = a.data(j, b);
                        if (k)
                            if (a.isFunction(k[e]) && "_" !== e.charAt(0)) {
                                var l = k[e].apply(k, g);
                                if (void 0 !== l) return l
                            } else f("no such method '" + e + "' for " + b + " instance");
                        else f("cannot call methods on " + b + " prior to initialization; attempted to call '" + e + "'")
                    }
                    return this
                }
                return this.each(function() {
                    var d = a.data(this, b);
                    d ? (d.option(e), d._init()) : (d = new c(this, e), a.data(this, b, d))
                })
            }
        }
        if (a) {
            var f = "undefined" == typeof console ? b : function(a) {
                console.error(a)
            };
            return a.bridget = function(a, b) {
                c(b), e(a, b)
            }, a.bridget
        }
    }
    var d = Array.prototype.slice;
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], c) : c("object" == typeof exports ? require("jquery") : a.jQuery)
}(window),
function(a) {
    function b(b) {
        var c = a.event;
        return c.target = c.target || c.srcElement || b, c
    }
    var c = document.documentElement,
        d = function() {};
    c.addEventListener ? d = function(a, b, c) {
        a.addEventListener(b, c, !1)
    } : c.attachEvent && (d = function(a, c, d) {
        a[c + d] = d.handleEvent ? function() {
            var c = b(a);
            d.handleEvent.call(d, c)
        } : function() {
            var c = b(a);
            d.call(a, c)
        }, a.attachEvent("on" + c, a[c + d])
    });
    var e = function() {};
    c.removeEventListener ? e = function(a, b, c) {
        a.removeEventListener(b, c, !1)
    } : c.detachEvent && (e = function(a, b, c) {
        a.detachEvent("on" + b, a[b + c]);
        try {
            delete a[b + c]
        } catch (d) {
            a[b + c] = void 0
        }
    });
    var f = {
        bind: d,
        unbind: e
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", f) : "object" == typeof exports ? module.exports = f : a.eventie = f
}(window),
function() {
    function a() {}

    function b(a, b) {
        for (var c = a.length; c--;)
            if (a[c].listener === b) return c;
        return -1
    }

    function c(a) {
        return function() {
            return this[a].apply(this, arguments)
        }
    }
    var d = a.prototype,
        e = this,
        f = e.EventEmitter;
    d.getListeners = function(a) {
        var b, c, d = this._getEvents();
        if (a instanceof RegExp) {
            b = {};
            for (c in d) d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c])
        } else b = d[a] || (d[a] = []);
        return b
    }, d.flattenListeners = function(a) {
        var b, c = [];
        for (b = 0; b < a.length; b += 1) c.push(a[b].listener);
        return c
    }, d.getListenersAsObject = function(a) {
        var b, c = this.getListeners(a);
        return c instanceof Array && (b = {}, b[a] = c), b || c
    }, d.addListener = function(a, c) {
        var d, e = this.getListenersAsObject(a),
            f = "object" == typeof c;
        for (d in e) e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c : {
            listener: c,
            once: !1
        });
        return this
    }, d.on = c("addListener"), d.addOnceListener = function(a, b) {
        return this.addListener(a, {
            listener: b,
            once: !0
        })
    }, d.once = c("addOnceListener"), d.defineEvent = function(a) {
        return this.getListeners(a), this
    }, d.defineEvents = function(a) {
        for (var b = 0; b < a.length; b += 1) this.defineEvent(a[b]);
        return this
    }, d.removeListener = function(a, c) {
        var d, e, f = this.getListenersAsObject(a);
        for (e in f) f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1));
        return this
    }, d.off = c("removeListener"), d.addListeners = function(a, b) {
        return this.manipulateListeners(!1, a, b)
    }, d.removeListeners = function(a, b) {
        return this.manipulateListeners(!0, a, b)
    }, d.manipulateListeners = function(a, b, c) {
        var d, e, f = a ? this.removeListener : this.addListener,
            g = a ? this.removeListeners : this.addListeners;
        if ("object" != typeof b || b instanceof RegExp)
            for (d = c.length; d--;) f.call(this, b, c[d]);
        else
            for (d in b) b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e));
        return this
    }, d.removeEvent = function(a) {
        var b, c = typeof a,
            d = this._getEvents();
        if ("string" === c) delete d[a];
        else if (a instanceof RegExp)
            for (b in d) d.hasOwnProperty(b) && a.test(b) && delete d[b];
        else delete this._events;
        return this
    }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function(a, b) {
        var c, d, e, f, g = this.getListenersAsObject(a);
        for (e in g)
            if (g.hasOwnProperty(e))
                for (d = g[e].length; d--;) c = g[e][d], c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), f === this._getOnceReturnValue() && this.removeListener(a, c.listener);
        return this
    }, d.trigger = c("emitEvent"), d.emit = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(a, b)
    }, d.setOnceReturnValue = function(a) {
        return this._onceReturnValue = a, this
    }, d._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, d._getEvents = function() {
        return this._events || (this._events = {})
    }, a.noConflict = function() {
        return e.EventEmitter = f, a
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return a
    }) : "object" == typeof module && module.exports ? module.exports = a : e.EventEmitter = a
}.call(this),
    function(a) {
        function b(a) {
            if (a) {
                if ("string" == typeof d[a]) return a;
                a = a.charAt(0).toUpperCase() + a.slice(1);
                for (var b, e = 0, f = c.length; f > e; e++)
                    if (b = c[e] + a, "string" == typeof d[b]) return b
            }
        }
        var c = "Webkit Moz ms Ms O".split(" "),
            d = document.documentElement.style;
        "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function() {
            return b
        }) : "object" == typeof exports ? module.exports = b : a.getStyleProperty = b
    }(window),
    function(a) {
        function b(a) {
            var b = parseFloat(a),
                c = -1 === a.indexOf("%") && !isNaN(b);
            return c && b
        }

        function c() {}

        function d() {
            for (var a = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, b = 0, c = g.length; c > b; b++) {
                var d = g[b];
                a[d] = 0
            }
            return a
        }

        function e(c) {
            function e() {
                if (!m) {
                    m = !0;
                    var d = a.getComputedStyle;
                    if (j = function() {
                            var a = d ? function(a) {
                                return d(a, null)
                            } : function(a) {
                                return a.currentStyle
                            };
                            return function(b) {
                                var c = a(b);
                                return c || f("Style returned " + c + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), c
                            }
                        }(), k = c("boxSizing")) {
                        var e = document.createElement("div");
                        e.style.width = "200px", e.style.padding = "1px 2px 3px 4px", e.style.borderStyle = "solid", e.style.borderWidth = "1px 2px 3px 4px", e.style[k] = "border-box";
                        var g = document.body || document.documentElement;
                        g.appendChild(e);
                        var h = j(e);
                        l = 200 === b(h.width), g.removeChild(e)
                    }
                }
            }

            function h(a) {
                if (e(), "string" == typeof a && (a = document.querySelector(a)), a && "object" == typeof a && a.nodeType) {
                    var c = j(a);
                    if ("none" === c.display) return d();
                    var f = {};
                    f.width = a.offsetWidth, f.height = a.offsetHeight;
                    for (var h = f.isBorderBox = !(!k || !c[k] || "border-box" !== c[k]), m = 0, n = g.length; n > m; m++) {
                        var o = g[m],
                            p = c[o];
                        p = i(a, p);
                        var q = parseFloat(p);
                        f[o] = isNaN(q) ? 0 : q
                    }
                    var r = f.paddingLeft + f.paddingRight,
                        s = f.paddingTop + f.paddingBottom,
                        t = f.marginLeft + f.marginRight,
                        u = f.marginTop + f.marginBottom,
                        v = f.borderLeftWidth + f.borderRightWidth,
                        w = f.borderTopWidth + f.borderBottomWidth,
                        x = h && l,
                        y = b(c.width);
                    y !== !1 && (f.width = y + (x ? 0 : r + v));
                    var z = b(c.height);
                    return z !== !1 && (f.height = z + (x ? 0 : s + w)), f.innerWidth = f.width - (r + v), f.innerHeight = f.height - (s + w), f.outerWidth = f.width + t, f.outerHeight = f.height + u, f
                }
            }

            function i(b, c) {
                if (a.getComputedStyle || -1 === c.indexOf("%")) return c;
                var d = b.style,
                    e = d.left,
                    f = b.runtimeStyle,
                    g = f && f.left;
                return g && (f.left = b.currentStyle.left), d.left = c, c = d.pixelLeft, d.left = e, g && (f.left = g), c
            }
            var j, k, l, m = !1;
            return h
        }
        var f = "undefined" == typeof console ? c : function(a) {
                console.error(a)
            },
            g = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
        "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], e) : "object" == typeof exports ? module.exports = e(require("desandro-get-style-property")) : a.getSize = e(a.getStyleProperty)
    }(window),
    function(a) {
        function b(a) {
            "function" == typeof a && (b.isReady ? a() : g.push(a))
        }

        function c(a) {
            var c = "readystatechange" === a.type && "complete" !== f.readyState;
            b.isReady || c || d()
        }

        function d() {
            b.isReady = !0;
            for (var a = 0, c = g.length; c > a; a++) {
                var d = g[a];
                d()
            }
        }

        function e(e) {
            return "complete" === f.readyState ? d() : (e.bind(f, "DOMContentLoaded", c), e.bind(f, "readystatechange", c), e.bind(a, "load", c)), b
        }
        var f = a.document,
            g = [];
        b.isReady = !1, "function" == typeof define && define.amd ? define("doc-ready/doc-ready", ["eventie/eventie"], e) : "object" == typeof exports ? module.exports = e(require("eventie")) : a.docReady = e(a.eventie)
    }(window),
    function(a) {
        function b(a, b) {
            return a[g](b)
        }

        function c(a) {
            if (!a.parentNode) {
                var b = document.createDocumentFragment();
                b.appendChild(a)
            }
        }

        function d(a, b) {
            c(a);
            for (var d = a.parentNode.querySelectorAll(b), e = 0, f = d.length; f > e; e++)
                if (d[e] === a) return !0;
            return !1
        }

        function e(a, d) {
            return c(a), b(a, d)
        }
        var f, g = function() {
            if (a.matches) return "matches";
            if (a.matchesSelector) return "matchesSelector";
            for (var b = ["webkit", "moz", "ms", "o"], c = 0, d = b.length; d > c; c++) {
                var e = b[c],
                    f = e + "MatchesSelector";
                if (a[f]) return f
            }
        }();
        if (g) {
            var h = document.createElement("div"),
                i = b(h, "div");
            f = i ? b : e
        } else f = d;
        "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function() {
            return f
        }) : "object" == typeof exports ? module.exports = f : window.matchesSelector = f
    }(Element.prototype),
    function(a, b) {
        "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["doc-ready/doc-ready", "matches-selector/matches-selector"], function(c, d) {
            return b(a, c, d)
        }) : "object" == typeof exports ? module.exports = b(a, require("doc-ready"), require("desandro-matches-selector")) : a.fizzyUIUtils = b(a, a.docReady, a.matchesSelector)
    }(window, function(a, b, c) {
        var d = {};
        d.extend = function(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }, d.modulo = function(a, b) {
            return (a % b + b) % b
        };
        var e = Object.prototype.toString;
        d.isArray = function(a) {
            return "[object Array]" == e.call(a)
        }, d.makeArray = function(a) {
            var b = [];
            if (d.isArray(a)) b = a;
            else if (a && "number" == typeof a.length)
                for (var c = 0, e = a.length; e > c; c++) b.push(a[c]);
            else b.push(a);
            return b
        }, d.indexOf = Array.prototype.indexOf ? function(a, b) {
            return a.indexOf(b)
        } : function(a, b) {
            for (var c = 0, d = a.length; d > c; c++)
                if (a[c] === b) return c;
            return -1
        }, d.removeFrom = function(a, b) {
            var c = d.indexOf(a, b); - 1 != c && a.splice(c, 1)
        }, d.isElement = "function" == typeof HTMLElement || "object" == typeof HTMLElement ? function(a) {
            return a instanceof HTMLElement
        } : function(a) {
            return a && "object" == typeof a && 1 == a.nodeType && "string" == typeof a.nodeName
        }, d.setText = function() {
            function a(a, c) {
                b = b || (void 0 !== document.documentElement.textContent ? "textContent" : "innerText"), a[b] = c
            }
            var b;
            return a
        }(), d.getParent = function(a, b) {
            for (; a != document.body;)
                if (a = a.parentNode, c(a, b)) return a
        }, d.getQueryElement = function(a) {
            return "string" == typeof a ? document.querySelector(a) : a
        }, d.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, d.filterFindElements = function(a, b) {
            a = d.makeArray(a);
            for (var e = [], f = 0, g = a.length; g > f; f++) {
                var h = a[f];
                if (d.isElement(h))
                    if (b) {
                        c(h, b) && e.push(h);
                        for (var i = h.querySelectorAll(b), j = 0, k = i.length; k > j; j++) e.push(i[j])
                    } else e.push(h)
            }
            return e
        }, d.debounceMethod = function(a, b, c) {
            var d = a.prototype[b],
                e = b + "Timeout";
            a.prototype[b] = function() {
                var a = this[e];
                a && clearTimeout(a);
                var b = arguments,
                    f = this;
                this[e] = setTimeout(function() {
                    d.apply(f, b), delete f[e]
                }, c || 100)
            }
        }, d.toDashed = function(a) {
            return a.replace(/(.)([A-Z])/g, function(a, b, c) {
                return b + "-" + c
            }).toLowerCase()
        };
        var f = a.console;
        return d.htmlInit = function(c, e) {
            b(function() {
                for (var b = d.toDashed(e), g = document.querySelectorAll(".js-" + b), h = "data-" + b + "-options", i = 0, j = g.length; j > i; i++) {
                    var k, l = g[i],
                        m = l.getAttribute(h);
                    try {
                        k = m && JSON.parse(m)
                    } catch (n) {
                        f && f.error("Error parsing " + h + " on " + l.nodeName.toLowerCase() + (l.id ? "#" + l.id : "") + ": " + n);
                        continue
                    }
                    var o = new c(l, k),
                        p = a.jQuery;
                    p && p.data(l, e, o)
                }
            })
        }, d
    }),
    function(a, b) {
        "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property", "fizzy-ui-utils/utils"], function(c, d, e, f) {
            return b(a, c, d, e, f)
        }) : "object" == typeof exports ? module.exports = b(a, require("wolfy87-eventemitter"), require("get-size"), require("desandro-get-style-property"), require("fizzy-ui-utils")) : (a.Outlayer = {}, a.Outlayer.Item = b(a, a.EventEmitter, a.getSize, a.getStyleProperty, a.fizzyUIUtils))
    }(window, function(a, b, c, d, e) {
        function f(a) {
            for (var b in a) return !1;
            return b = null, !0
        }

        function g(a, b) {
            a && (this.element = a, this.layout = b, this.position = {
                x: 0,
                y: 0
            }, this._create())
        }
        var h = a.getComputedStyle,
            i = h ? function(a) {
                return h(a, null)
            } : function(a) {
                return a.currentStyle
            },
            j = d("transition"),
            k = d("transform"),
            l = j && k,
            m = !!d("perspective"),
            n = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "otransitionend",
                transition: "transitionend"
            }[j],
            o = ["transform", "transition", "transitionDuration", "transitionProperty"],
            p = function() {
                for (var a = {}, b = 0, c = o.length; c > b; b++) {
                    var e = o[b],
                        f = d(e);
                    f && f !== e && (a[e] = f)
                }
                return a
            }();
        e.extend(g.prototype, b.prototype), g.prototype._create = function() {
            this._transn = {
                ingProperties: {},
                clean: {},
                onEnd: {}
            }, this.css({
                position: "absolute"
            })
        }, g.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, g.prototype.getSize = function() {
            this.size = c(this.element)
        }, g.prototype.css = function(a) {
            var b = this.element.style;
            for (var c in a) {
                var d = p[c] || c;
                b[d] = a[c]
            }
        }, g.prototype.getPosition = function() {
            var a = i(this.element),
                b = this.layout.options,
                c = b.isOriginLeft,
                d = b.isOriginTop,
                e = parseInt(a[c ? "left" : "right"], 10),
                f = parseInt(a[d ? "top" : "bottom"], 10);
            e = isNaN(e) ? 0 : e, f = isNaN(f) ? 0 : f;
            var g = this.layout.size;
            e -= c ? g.paddingLeft : g.paddingRight, f -= d ? g.paddingTop : g.paddingBottom, this.position.x = e, this.position.y = f
        }, g.prototype.layoutPosition = function() {
            var a = this.layout.size,
                b = this.layout.options,
                c = {},
                d = b.isOriginLeft ? "paddingLeft" : "paddingRight",
                e = b.isOriginLeft ? "left" : "right",
                f = b.isOriginLeft ? "right" : "left",
                g = this.position.x + a[d];
            g = b.percentPosition && !b.isHorizontal ? g / a.width * 100 + "%" : g + "px", c[e] = g, c[f] = "";
            var h = b.isOriginTop ? "paddingTop" : "paddingBottom",
                i = b.isOriginTop ? "top" : "bottom",
                j = b.isOriginTop ? "bottom" : "top",
                k = this.position.y + a[h];
            k = b.percentPosition && b.isHorizontal ? k / a.height * 100 + "%" : k + "px", c[i] = k, c[j] = "", this.css(c), this.emitEvent("layout", [this])
        };
        var q = m ? function(a, b) {
            return "translate3d(" + a + "px, " + b + "px, 0)"
        } : function(a, b) {
            return "translate(" + a + "px, " + b + "px)"
        };
        g.prototype._transitionTo = function(a, b) {
            this.getPosition();
            var c = this.position.x,
                d = this.position.y,
                e = parseInt(a, 10),
                f = parseInt(b, 10),
                g = e === this.position.x && f === this.position.y;
            if (this.setPosition(a, b), g && !this.isTransitioning) return void this.layoutPosition();
            var h = a - c,
                i = b - d,
                j = {},
                k = this.layout.options;
            h = k.isOriginLeft ? h : -h, i = k.isOriginTop ? i : -i, j.transform = q(h, i), this.transition({
                to: j,
                onTransitionEnd: {
                    transform: this.layoutPosition
                },
                isCleaning: !0
            })
        }, g.prototype.goTo = function(a, b) {
            this.setPosition(a, b), this.layoutPosition()
        }, g.prototype.moveTo = l ? g.prototype._transitionTo : g.prototype.goTo, g.prototype.setPosition = function(a, b) {
            this.position.x = parseInt(a, 10), this.position.y = parseInt(b, 10)
        }, g.prototype._nonTransition = function(a) {
            this.css(a.to), a.isCleaning && this._removeStyles(a.to);
            for (var b in a.onTransitionEnd) a.onTransitionEnd[b].call(this)
        }, g.prototype._transition = function(a) {
            if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(a);
            var b = this._transn;
            for (var c in a.onTransitionEnd) b.onEnd[c] = a.onTransitionEnd[c];
            for (c in a.to) b.ingProperties[c] = !0, a.isCleaning && (b.clean[c] = !0);
            if (a.from) {
                this.css(a.from);
                var d = this.element.offsetHeight;
                d = null
            }
            this.enableTransition(a.to), this.css(a.to), this.isTransitioning = !0
        };
        var r = k && e.toDashed(k) + ",opacity";
        g.prototype.enableTransition = function() {
            this.isTransitioning || (this.css({
                transitionProperty: r,
                transitionDuration: this.layout.options.transitionDuration
            }), this.element.addEventListener(n, this, !1))
        }, g.prototype.transition = g.prototype[j ? "_transition" : "_nonTransition"], g.prototype.onwebkitTransitionEnd = function(a) {
            this.ontransitionend(a)
        }, g.prototype.onotransitionend = function(a) {
            this.ontransitionend(a)
        };
        var s = {
            "-webkit-transform": "transform",
            "-moz-transform": "transform",
            "-o-transform": "transform"
        };
        g.prototype.ontransitionend = function(a) {
            if (a.target === this.element) {
                var b = this._transn,
                    c = s[a.propertyName] || a.propertyName;
                if (delete b.ingProperties[c], f(b.ingProperties) && this.disableTransition(), c in b.clean && (this.element.style[a.propertyName] = "", delete b.clean[c]), c in b.onEnd) {
                    var d = b.onEnd[c];
                    d.call(this), delete b.onEnd[c]
                }
                this.emitEvent("transitionEnd", [this])
            }
        }, g.prototype.disableTransition = function() {
            this.removeTransitionStyles(), this.element.removeEventListener(n, this, !1), this.isTransitioning = !1
        }, g.prototype._removeStyles = function(a) {
            var b = {};
            for (var c in a) b[c] = "";
            this.css(b)
        };
        var t = {
            transitionProperty: "",
            transitionDuration: ""
        };
        return g.prototype.removeTransitionStyles = function() {
            this.css(t)
        }, g.prototype.removeElem = function() {
            this.element.parentNode.removeChild(this.element), this.css({
                display: ""
            }), this.emitEvent("remove", [this])
        }, g.prototype.remove = function() {
            if (!j || !parseFloat(this.layout.options.transitionDuration)) return void this.removeElem();
            var a = this;
            this.once("transitionEnd", function() {
                a.removeElem()
            }), this.hide()
        }, g.prototype.reveal = function() {
            delete this.isHidden, this.css({
                display: ""
            });
            var a = this.layout.options,
                b = {},
                c = this.getHideRevealTransitionEndProperty("visibleStyle");
            b[c] = this.onRevealTransitionEnd, this.transition({
                from: a.hiddenStyle,
                to: a.visibleStyle,
                isCleaning: !0,
                onTransitionEnd: b
            })
        }, g.prototype.onRevealTransitionEnd = function() {
            this.isHidden || this.emitEvent("reveal")
        }, g.prototype.getHideRevealTransitionEndProperty = function(a) {
            var b = this.layout.options[a];
            if (b.opacity) return "opacity";
            for (var c in b) return c
        }, g.prototype.hide = function() {
            this.isHidden = !0, this.css({
                display: ""
            });
            var a = this.layout.options,
                b = {},
                c = this.getHideRevealTransitionEndProperty("hiddenStyle");
            b[c] = this.onHideTransitionEnd, this.transition({
                from: a.visibleStyle,
                to: a.hiddenStyle,
                isCleaning: !0,
                onTransitionEnd: b
            })
        }, g.prototype.onHideTransitionEnd = function() {
            this.isHidden && (this.css({
                display: "none"
            }), this.emitEvent("hide"))
        }, g.prototype.destroy = function() {
            this.css({
                position: "",
                left: "",
                right: "",
                top: "",
                bottom: "",
                transition: "",
                transform: ""
            })
        }, g
    }),
    function(a, b) {
        "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "eventEmitter/EventEmitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function(c, d, e, f, g) {
            return b(a, c, d, e, f, g)
        }) : "object" == typeof exports ? module.exports = b(a, require("eventie"), require("wolfy87-eventemitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : a.Outlayer = b(a, a.eventie, a.EventEmitter, a.getSize, a.fizzyUIUtils, a.Outlayer.Item)
    }(window, function(a, b, c, d, e, f) {
        function g(a, b) {
            var c = e.getQueryElement(a);
            if (!c) return void(h && h.error("Bad element for " + this.constructor.namespace + ": " + (c || a)));
            this.element = c, i && (this.$element = i(this.element)), this.options = e.extend({}, this.constructor.defaults), this.option(b);
            var d = ++k;
            this.element.outlayerGUID = d, l[d] = this, this._create(), this.options.isInitLayout && this.layout()
        }
        var h = a.console,
            i = a.jQuery,
            j = function() {},
            k = 0,
            l = {};
        return g.namespace = "outlayer", g.Item = f, g.defaults = {
            containerStyle: {
                position: "relative"
            },
            isInitLayout: !0,
            isOriginLeft: !0,
            isOriginTop: !0,
            isResizeBound: !0,
            isResizingContainer: !0,
            transitionDuration: "0.4s",
            hiddenStyle: {
                opacity: 0,
                transform: "scale(0.001)"
            },
            visibleStyle: {
                opacity: 1,
                transform: "scale(1)"
            }
        }, e.extend(g.prototype, c.prototype), g.prototype.option = function(a) {
            e.extend(this.options, a)
        }, g.prototype._create = function() {
            this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), e.extend(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
        }, g.prototype.reloadItems = function() {
            this.items = this._itemize(this.element.children)
        }, g.prototype._itemize = function(a) {
            for (var b = this._filterFindItemElements(a), c = this.constructor.Item, d = [], e = 0, f = b.length; f > e; e++) {
                var g = b[e],
                    h = new c(g, this);
                d.push(h)
            }
            return d
        }, g.prototype._filterFindItemElements = function(a) {
            return e.filterFindElements(a, this.options.itemSelector)
        }, g.prototype.getItemElements = function() {
            for (var a = [], b = 0, c = this.items.length; c > b; b++) a.push(this.items[b].element);
            return a
        }, g.prototype.layout = function() {
            this._resetLayout(), this._manageStamps();
            var a = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
            this.layoutItems(this.items, a), this._isLayoutInited = !0
        }, g.prototype._init = g.prototype.layout, g.prototype._resetLayout = function() {
            this.getSize()
        }, g.prototype.getSize = function() {
            this.size = d(this.element)
        }, g.prototype._getMeasurement = function(a, b) {
            var c, f = this.options[a];
            f ? ("string" == typeof f ? c = this.element.querySelector(f) : e.isElement(f) && (c = f), this[a] = c ? d(c)[b] : f) : this[a] = 0
        }, g.prototype.layoutItems = function(a, b) {
            a = this._getItemsForLayout(a), this._layoutItems(a, b), this._postLayout()
        }, g.prototype._getItemsForLayout = function(a) {
            for (var b = [], c = 0, d = a.length; d > c; c++) {
                var e = a[c];
                e.isIgnored || b.push(e)
            }
            return b
        }, g.prototype._layoutItems = function(a, b) {
            if (this._emitCompleteOnItems("layout", a), a && a.length) {
                for (var c = [], d = 0, e = a.length; e > d; d++) {
                    var f = a[d],
                        g = this._getItemLayoutPosition(f);
                    g.item = f, g.isInstant = b || f.isLayoutInstant, c.push(g)
                }
                this._processLayoutQueue(c)
            }
        }, g.prototype._getItemLayoutPosition = function() {
            return {
                x: 0,
                y: 0
            }
        }, g.prototype._processLayoutQueue = function(a) {
            for (var b = 0, c = a.length; c > b; b++) {
                var d = a[b];
                this._positionItem(d.item, d.x, d.y, d.isInstant)
            }
        }, g.prototype._positionItem = function(a, b, c, d) {
            d ? a.goTo(b, c) : a.moveTo(b, c)
        }, g.prototype._postLayout = function() {
            this.resizeContainer()
        }, g.prototype.resizeContainer = function() {
            if (this.options.isResizingContainer) {
                var a = this._getContainerSize();
                a && (this._setContainerMeasure(a.width, !0), this._setContainerMeasure(a.height, !1))
            }
        }, g.prototype._getContainerSize = j, g.prototype._setContainerMeasure = function(a, b) {
            if (void 0 !== a) {
                var c = this.size;
                c.isBorderBox && (a += b ? c.paddingLeft + c.paddingRight + c.borderLeftWidth + c.borderRightWidth : c.paddingBottom + c.paddingTop + c.borderTopWidth + c.borderBottomWidth), a = Math.max(a, 0), this.element.style[b ? "width" : "height"] = a + "px"
            }
        }, g.prototype._emitCompleteOnItems = function(a, b) {
            function c() {
                e.emitEvent(a + "Complete", [b])
            }

            function d() {
                g++, g === f && c()
            }
            var e = this,
                f = b.length;
            if (!b || !f) return void c();
            for (var g = 0, h = 0, i = b.length; i > h; h++) {
                var j = b[h];
                j.once(a, d)
            }
        }, g.prototype.ignore = function(a) {
            var b = this.getItem(a);
            b && (b.isIgnored = !0)
        }, g.prototype.unignore = function(a) {
            var b = this.getItem(a);
            b && delete b.isIgnored
        }, g.prototype.stamp = function(a) {
            if (a = this._find(a)) {
                this.stamps = this.stamps.concat(a);
                for (var b = 0, c = a.length; c > b; b++) {
                    var d = a[b];
                    this.ignore(d)
                }
            }
        }, g.prototype.unstamp = function(a) {
            if (a = this._find(a))
                for (var b = 0, c = a.length; c > b; b++) {
                    var d = a[b];
                    e.removeFrom(this.stamps, d), this.unignore(d)
                }
        }, g.prototype._find = function(a) {
            return a ? ("string" == typeof a && (a = this.element.querySelectorAll(a)), a = e.makeArray(a)) : void 0
        }, g.prototype._manageStamps = function() {
            if (this.stamps && this.stamps.length) {
                this._getBoundingRect();
                for (var a = 0, b = this.stamps.length; b > a; a++) {
                    var c = this.stamps[a];
                    this._manageStamp(c)
                }
            }
        }, g.prototype._getBoundingRect = function() {
            var a = this.element.getBoundingClientRect(),
                b = this.size;
            this._boundingRect = {
                left: a.left + b.paddingLeft + b.borderLeftWidth,
                top: a.top + b.paddingTop + b.borderTopWidth,
                right: a.right - (b.paddingRight + b.borderRightWidth),
                bottom: a.bottom - (b.paddingBottom + b.borderBottomWidth)
            }
        }, g.prototype._manageStamp = j, g.prototype._getElementOffset = function(a) {
            var b = a.getBoundingClientRect(),
                c = this._boundingRect,
                e = d(a),
                f = {
                    left: b.left - c.left - e.marginLeft,
                    top: b.top - c.top - e.marginTop,
                    right: c.right - b.right - e.marginRight,
                    bottom: c.bottom - b.bottom - e.marginBottom
                };
            return f
        }, g.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, g.prototype.bindResize = function() {
            this.isResizeBound || (b.bind(a, "resize", this), this.isResizeBound = !0)
        }, g.prototype.unbindResize = function() {
            this.isResizeBound && b.unbind(a, "resize", this), this.isResizeBound = !1
        }, g.prototype.onresize = function() {
            function a() {
                b.resize(), delete b.resizeTimeout
            }
            this.resizeTimeout && clearTimeout(this.resizeTimeout);
            var b = this;
            this.resizeTimeout = setTimeout(a, 100)
        }, g.prototype.resize = function() {
            this.isResizeBound && this.needsResizeLayout() && this.layout()
        }, g.prototype.needsResizeLayout = function() {
            var a = d(this.element),
                b = this.size && a;
            return b && a.innerWidth !== this.size.innerWidth
        }, g.prototype.addItems = function(a) {
            var b = this._itemize(a);
            return b.length && (this.items = this.items.concat(b)), b
        }, g.prototype.appended = function(a) {
            var b = this.addItems(a);
            b.length && (this.layoutItems(b, !0), this.reveal(b))
        }, g.prototype.prepended = function(a) {
            var b = this._itemize(a);
            if (b.length) {
                var c = this.items.slice(0);
                this.items = b.concat(c), this._resetLayout(), this._manageStamps(), this.layoutItems(b, !0), this.reveal(b), this.layoutItems(c)
            }
        }, g.prototype.reveal = function(a) {
            this._emitCompleteOnItems("reveal", a);
            for (var b = a && a.length, c = 0; b && b > c; c++) {
                var d = a[c];
                d.reveal()
            }
        }, g.prototype.hide = function(a) {
            this._emitCompleteOnItems("hide", a);
            for (var b = a && a.length, c = 0; b && b > c; c++) {
                var d = a[c];
                d.hide()
            }
        }, g.prototype.revealItemElements = function(a) {
            var b = this.getItems(a);
            this.reveal(b)
        }, g.prototype.hideItemElements = function(a) {
            var b = this.getItems(a);
            this.hide(b)
        }, g.prototype.getItem = function(a) {
            for (var b = 0, c = this.items.length; c > b; b++) {
                var d = this.items[b];
                if (d.element === a) return d
            }
        }, g.prototype.getItems = function(a) {
            a = e.makeArray(a);
            for (var b = [], c = 0, d = a.length; d > c; c++) {
                var f = a[c],
                    g = this.getItem(f);
                g && b.push(g)
            }
            return b
        }, g.prototype.remove = function(a) {
            var b = this.getItems(a);
            if (this._emitCompleteOnItems("remove", b), b && b.length)
                for (var c = 0, d = b.length; d > c; c++) {
                    var f = b[c];
                    f.remove(), e.removeFrom(this.items, f)
                }
        }, g.prototype.destroy = function() {
            var a = this.element.style;
            a.height = "", a.position = "", a.width = "";
            for (var b = 0, c = this.items.length; c > b; b++) {
                var d = this.items[b];
                d.destroy()
            }
            this.unbindResize();
            var e = this.element.outlayerGUID;
            delete l[e], delete this.element.outlayerGUID, i && i.removeData(this.element, this.constructor.namespace)
        }, g.data = function(a) {
            a = e.getQueryElement(a);
            var b = a && a.outlayerGUID;
            return b && l[b]
        }, g.create = function(a, b) {
            function c() {
                g.apply(this, arguments)
            }
            return Object.create ? c.prototype = Object.create(g.prototype) : e.extend(c.prototype, g.prototype), c.prototype.constructor = c, c.defaults = e.extend({}, g.defaults), e.extend(c.defaults, b), c.prototype.settings = {}, c.namespace = a, c.data = g.data, c.Item = function() {
                f.apply(this, arguments)
            }, c.Item.prototype = new f, e.htmlInit(c, a), i && i.bridget && i.bridget(a, c), c
        }, g.Item = f, g
    }),
    function(a, b) {
        "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "fizzy-ui-utils/utils"], b) : "object" == typeof exports ? module.exports = b(require("outlayer"), require("get-size"), require("fizzy-ui-utils")) : a.Masonry = b(a.Outlayer, a.getSize, a.fizzyUIUtils)
    }(window, function(a, b, c) {
        var d = a.create("masonry");
        return d.prototype._resetLayout = function() {
            this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
            var a = this.cols;
            for (this.colYs = []; a--;) this.colYs.push(0);
            this.maxY = 0
        }, d.prototype.measureColumns = function() {
            if (this.getContainerWidth(), !this.columnWidth) {
                var a = this.items[0],
                    c = a && a.element;
                this.columnWidth = c && b(c).outerWidth || this.containerWidth
            }
            var d = this.columnWidth += this.gutter,
                e = this.containerWidth + this.gutter,
                f = e / d,
                g = d - e % d,
                h = g && 1 > g ? "round" : "floor";
            f = Math[h](f), this.cols = Math.max(f, 1)
        }, d.prototype.getContainerWidth = function() {
            var a = this.options.isFitWidth ? this.element.parentNode : this.element,
                c = b(a);
            this.containerWidth = c && c.innerWidth
        }, d.prototype._getItemLayoutPosition = function(a) {
            a.getSize();
            var b = a.size.outerWidth % this.columnWidth,
                d = b && 1 > b ? "round" : "ceil",
                e = Math[d](a.size.outerWidth / this.columnWidth);
            e = Math.min(e, this.cols);
            for (var f = this._getColGroup(e), g = Math.min.apply(Math, f), h = c.indexOf(f, g), i = {
                    x: this.columnWidth * h,
                    y: g
                }, j = g + a.size.outerHeight, k = this.cols + 1 - f.length, l = 0; k > l; l++) this.colYs[h + l] = j;
            return i
        }, d.prototype._getColGroup = function(a) {
            if (2 > a) return this.colYs;
            for (var b = [], c = this.cols + 1 - a, d = 0; c > d; d++) {
                var e = this.colYs.slice(d, d + a);
                b[d] = Math.max.apply(Math, e)
            }
            return b
        }, d.prototype._manageStamp = function(a) {
            var c = b(a),
                d = this._getElementOffset(a),
                e = this.options.isOriginLeft ? d.left : d.right,
                f = e + c.outerWidth,
                g = Math.floor(e / this.columnWidth);
            g = Math.max(0, g);
            var h = Math.floor(f / this.columnWidth);
            h -= f % this.columnWidth ? 0 : 1, h = Math.min(this.cols - 1, h);
            for (var i = (this.options.isOriginTop ? d.top : d.bottom) + c.outerHeight, j = g; h >= j; j++) this.colYs[j] = Math.max(i, this.colYs[j])
        }, d.prototype._getContainerSize = function() {
            this.maxY = Math.max.apply(Math, this.colYs);
            var a = {
                height: this.maxY
            };
            return this.options.isFitWidth && (a.width = this._getContainerFitWidth()), a
        }, d.prototype._getContainerFitWidth = function() {
            for (var a = 0, b = this.cols; --b && 0 === this.colYs[b];) a++;
            return (this.cols - a) * this.columnWidth - this.gutter
        }, d.prototype.needsResizeLayout = function() {
            var a = this.containerWidth;
            return this.getContainerWidth(), a !== this.containerWidth
        }, d
    });;
(function($) {
    "use strict";
    $.ajaxChimp = {
        responses: {
            "We have sent you a confirmation email": 0,
            "Please enter a value": 1,
            "An email address must contain a single @": 2,
            "The domain portion of the email address is invalid (the portion after the @: )": 3,
            "The username portion of the email address is invalid (the portion before the @: )": 4,
            "This email address looks fake or invalid. Please enter a real email address": 5
        },
        translations: {
            en: null
        },
        init: function(selector, options) {
            $(selector).ajaxChimp(options)
        }
    };
    $.fn.ajaxChimp = function(options) {
        $(this).each(function(i, elem) {
            var form = $(elem);
            var email = form.find("input[type=email]");
            var status = $("div#status");
            var settings = $.extend({
                url: form.attr("action"),
                language: "en"
            }, options);
            var url = settings.url.replace("/post?", "/post-json?").concat("&c=?");
            form.attr("novalidate", "true");
            email.attr("name", "EMAIL");
            form.submit(function() {
                var msg;

                function successCallback(resp) {
                    status.hide();
                    if (resp.result === "success") {
                        msg = "We have sent you a confirmation email";
                        email.removeClass("error").addClass("valid")
                    } else {
                        email.removeClass("valid").addClass("error");
                        var index = -1;
                        try {
                            var parts = resp.msg.split(" - ", 2);
                            if (parts[1] === undefined) {
                                msg = resp.msg
                            } else {
                                var i = parseInt(parts[0], 10);
                                if (i.toString() === parts[0]) {
                                    index = parts[0];
                                    msg = parts[1]
                                } else {
                                    index = -1;
                                    msg = resp.msg
                                }
                            }
                        } catch (e) {
                            index = -1;
                            msg = resp.msg
                        }
                    }
                    if (settings.language !== "en" && $.ajaxChimp.responses[msg] !== undefined && $.ajaxChimp.translations && $.ajaxChimp.translations[settings.language] && $.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]]) {
                        msg = $.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]]
                    }
                    if (settings.callback) {
                        settings.callback(resp)
                    }
                }
                var data = {};
                var dataArray = form.serializeArray();
                $.each(dataArray, function(index, item) {
                    data[item.name] = item.value
                });
                status.show();
                $.ajax({
                    url: url,
                    data: data,
                    success: successCallback,
                    dataType: "jsonp",
                    error: function(resp, text) {
                        console.log("mailchimp ajax submit error: " + text)
                    }
                });
                var submitMsg = "Submitting...";
                if (settings.language !== "en" && $.ajaxChimp.translations && $.ajaxChimp.translations[settings.language] && $.ajaxChimp.translations[settings.language]["submit"]) {
                    submitMsg = $.ajaxChimp.translations[settings.language]["submit"]
                }
                return false
            })
        });
        return this
    }
})(jQuery);;
/*
 * @author  Mudit Ameta
 * @license https://github.com/zeusdeux/isInViewport/blob/master/license.md MIT
 */
! function(a, b) {
    function c(b) {
        var c, d = a("<div></div>").css({
            width: "100%"
        });
        return b.append(d), c = b.width() - d.width(), d.remove(), c
    }

    function d(e, f) {
        var g = e.getBoundingClientRect(),
            h = g.top,
            i = g.bottom,
            j = g.left,
            k = g.right,
            l = a.extend({
                tolerance: 0,
                viewport: b
            }, f),
            m = !1,
            n = l.viewport.jquery ? l.viewport : a(l.viewport);
        n.length || (console.warn("isInViewport: The viewport selector you have provided matches no element on page."), console.warn("isInViewport: Defaulting to viewport as window"), n = a(b));
        var o = n.height(),
            p = n.width(),
            q = n.get(0).toString();
        if (n[0] !== b && "[object Window]" !== q && "[object DOMWindow]" !== q) {
            var r = n.get(0).getBoundingClientRect();
            h -= r.top, i -= r.top, j -= r.left, k -= r.left, d.scrollBarWidth = d.scrollBarWidth || c(n), p -= d.scrollBarWidth
        }
        return l.tolerance = ~~Math.round(parseFloat(l.tolerance)), l.tolerance < 0 && (l.tolerance = o + l.tolerance), 0 >= k || j >= p ? m : m = l.tolerance ? !!(h <= l.tolerance && i >= l.tolerance) : !!(i > 0 && o >= h)
    }
    String.prototype.hasOwnProperty("trim") || (String.prototype.trim = function() {
        return this.replace(/^\s*(.*?)\s*$/, "$1")
    });
    var e = function(b) {
        if (1 === arguments.length && "function" == typeof b && (b = [b]), !(b instanceof Array)) throw new SyntaxError("isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions");
        for (var c = 0; c < b.length; c++)
            if ("function" == typeof b[c])
                for (var d = 0; d < this.length; d++) b[c].call(a(this[d]));
            else console.warn("isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions"), console.warn("isInViewport: Ignoring non-function values in array and moving on");
        return this
    };
    a.fn["do"] = function(a) {
        return console.warn("isInViewport: .do causes issues in IE and some browsers since its a reserved. Use $.fn.run instead i.e., $(el).run(fn)."), e(a)
    }, a.fn.run = e, a.extend(a.expr[":"], {
        "in-viewport": function(a, b, c) {
            if (c[3]) {
                var e = c[3].split(",");
                return 1 === e.length && isNaN(e[0]) && (e[1] = e[0], e[0] = void 0), d(a, {
                    tolerance: e[0] ? e[0].trim() : void 0,
                    viewport: e[1] ? e[1].trim() : void 0
                })
            }
            return d(a)
        }
    })
}(jQuery, window);;
"use strict";

function dissmissPreloader() {
    var a = $("#preloader"),
        b = $("body");
    b.css("overflow-y", "auto"), a.fadeOut("fast")
}

function trianglesReady() {
    dissmissPreloader()
}

function initializeMap() {
    var a = [{
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [{
                color: "#444444"
            }]
        }, {
            featureType: "landscape",
            elementType: "all",
            stylers: [{
                color: "#f2f2f2"
            }]
        }, {
            featureType: "poi",
            elementType: "all",
            stylers: [{
                visibility: "off"
            }]
        }, {
            featureType: "road",
            elementType: "all",
            stylers: [{
                saturation: -100
            }, {
                lightness: 45
            }]
        }, {
            featureType: "road.highway",
            elementType: "all",
            stylers: [{
                visibility: "simplified"
            }]
        }, {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [{
                visibility: "off"
            }]
        }, {
            featureType: "transit",
            elementType: "all",
            stylers: [{
                visibility: "off"
            }]
        }, {
            featureType: "water",
            elementType: "all",
            stylers: [{
                color: "#46bcec"
            }, {
                visibility: "on"
            }]
        }],
        b = new google.maps.StyledMapType(a, {
            name: "Styled Map"
        }),
        c = new google.maps.LatLng(Wata.googleMaps.lat, Wata.googleMaps.lng),
        d = {
            zoom: Wata.googleMaps.zoom,
            center: c,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, "map_style"]
            },
            scrollwheel: !1,
            draggable: !1
        },
        e = new google.maps.Map(document.getElementById("map-canvas"), d);
    new google.maps.Marker({
        position: c,
        map: e
    });
    e.mapTypes.set("map_style", b), e.setMapTypeId("map_style")
}! function() {
    function a() {
        b = 0, c = 0,  d= 0;
        //b = window.innerHeight, c = f.clientHeight, d = b - c, e.style.height = d + "px"
    }
    var b, c, d, e = document.getElementById("triangles"),
        f = document.getElementById("nav");
    a(), window.addEventListener("resize", a)
}(), $(document).ready(function() {
    $(".scrollspy").scrollSpy(), $(".materialboxed").materialbox(), $(".button-collapse").sideNav({
        closeOnClick: !0
    }), ScrollAnimations(), Shuffle.init(), CurrencySwitcher();
    var a = $(".masonry").masonry({
        itemSelector: ".col"
    });
    a.imagesLoaded().progress(function() {
        a.masonry("layout")
    });
    var b = $("form#mc-embedded-subscribe-form");
    b.ajaxChimp({
            url: $(this).attr("action"),
            callback: function(a) {
                var c = a.msg,
                    d = a.result,
                    e = "success" === d ? 1e4 : 5e3;
                Materialize.toast(c.replace(/\d - /, ""), e, d), "success" === d && (b.find("input[type=email]").val(""), b.find("label").removeClass("active"))
            }
        }),
        function() {
            function a() {
                for (var a = 0; j > a; a++)
                    if (0 === i[a].value.length) return !1;
                return !0
            }

            function b() {
                var a = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return k[0].value.length > 0 && a.test(k[0].value)
            }

            function c() {
                a() && b() ? (g.addClass(h), l = !0) : (g.removeClass(h), l = !1)
            }

            function d() {
                m.show(), $.ajax({
                    url: e.attr("action"),
                    data: e.serialize(),
                    type: "POST"
                }).done(function(a) {
                    m.hide(), "success" == a ? (Materialize.toast(Wata.toastMessages.messageSent, 7500, "success"), f.val(""), k.removeClass("valid"), c()) : Materialize.toast(Wata.toastMessages.somethingWrong + a, 7500, "error")
                }).error(function(a) {
                    m.hide(), Materialize.toast(Wata.toastMessages.somethingWrong + resp, 7500, "error")
                })
            }
            var e = $("form#contact-form"),
                f = e.find("input, textarea"),
                g = e.find("button[type=submit]"),
                h = "waves-effect waves-light green accent-2 indigo-text text-darken-4",
                i = $(".required"),
                j = i.length,
                k = e.find("input#email"),
                l = !1,
                m = $("div#status");
            e.on("submit", function(c) {
                c.preventDefault(), l ? d() : (a() || Materialize.toast(Wata.toastMessages.fillInRequiredFields, 5e3, "error"), a() && !b() && Materialize.toast(Wata.toastMessages.enterValidEmail, 5e3, "error"))
            }), f.on("blur", function() {
                c()
            }), k.on("blur", function() {
                var a = k[0].value.length;
                !b() && a > 0 ? k.addClass("invalid").removeClass("valid") : b() && a > 0 ? k.addClass("valid").removeClass("invalid") : 0 === a && k.removeClass("valid invalid")
            })
        }(), $("#explore").on("click", function(a) {
            a.preventDefault();
            var b = $("#services").offset().top + 1;
            $("html, body").animate({
                scrollTop: b - 64
            }, {
                duration: 400,
                queue: !1,
                easing: "easeOutCubic"
            })
        }),
        function() {
            function a() {
                e.removeClass("enter").addClass("translate").html(""), d.show().css("visibility", "hidden"), $(document).scrollTop(b), d.hide().css("visibility", "visible").fadeIn(), $("div#shuffle-grid").shuffle("update"), $(".masonry").masonry()
            }
            var b, c, d = $("#wrapper"),
                e = $("#ajax-box"),
                f = window.matchMedia("only screen and (max-width: 600px)");
            $("a.ajax-link").on("click", function(g) {
                g.preventDefault(), b = $(document).scrollTop(), e.load($(this).attr("href"), function(b, g, h) {
                    return "error" === g ? (a(), Materialize.toast(Wata.toastMessages.somethingWrong + h.status + " " + h.statusText, 5e3, "error"), !1) : (d.fadeOut("fast", function() {
                        window.scrollTo(0, 0)
                    }), $(".materialboxed").length && $(".materialboxed").materialbox(), $("ul.tabs").length && $("ul.tabs").tabs(), e.addClass("enter"), void setTimeout(function() {
                        e.removeClass("translate enter"), $("#ajax-status").hide(), c = $(".parallax").length, c && !f.matches ? $(".parallax").parallax() : c && f && $(".parallax img").css({
                            display: "block",
                            height: 500
                        })
                    }, 750))
                })
            }), $(document).on("click", "#close-ajax", function(b) {
                b.preventDefault(), a()
            })
        }()
        // initializeMap()
         $(".activator, .card-title").on("click", function() {
            $(this).parents(".card").toggleClass("active")
        });
    var c = .65 * window.innerHeight;
    $(window).scroll(function() {
        $(".picture-item:in-viewport(" + c + ")").addClass("animate"), $(".team .col:in-viewport(" + c + ")").addClass("animate"), $(".masonry .card:in-viewport(" + c + ")").addClass("animate")
    })
});
var ScrollAnimations = function() {
        var a, b = new ScrollMagic.Controller,
            c = $(".services .animated-color"),
            d = ["rgb(26, 35, 126)", "rgb(28, 37, 135)", "rgb(29, 40, 143)", "rgb(31, 42, 152)", "rgb(33, 44, 160)", "rgb(36, 49, 178)", "rgb(38, 52, 186)", "rgb(39, 54, 199)", "rgb(41, 56, 203)", "rgb(43, 58, 211)"],
            e = new ScrollMagic.Scene({
                triggerElement: "#services",
                duration: "75%"
            }).addTo(b);
        e.on("progress", function(b) {
            a = Math.floor(10 * b.progress), c.css("color", d[a])
        });
        var f, g = (new ScrollMagic.Scene({
                triggerElement: ".best-offer"
            }).setClassToggle(".best-offer", "z-depth-4").addTo(b), new ScrollMagic.Scene({
                triggerElement: "#get-started",
                duration: "75%"
            }).addTo(b)),
            h = $("#get-started"),
            i = ["#f2f2f2", "#ededed", "#e8e8e8", "#e3e3e3", "#dedede", "#dcdcdc", "#d6d6d6", "#d3d3d3", "#d4d4d4", "#cfcfcf"];
        g.on("progress", function(a) {
            f = Math.floor(10 * a.progress), h.css("background-color", i[f])
        });
        var j, k = new ScrollMagic.Scene({
                triggerElement: "#subscribe",
                duration: "75%"
            }).addTo(b),
            l = $("#subscribe");
        k.on("progress", function(a) {
            j = Math.floor(10 * a.progress), l.css("background-color", i[j])
        })
    },
    Shuffle = function(a, b) {
        var c, d, e, f = a("div#shuffle-grid"),
            g = f.find("img"),
            h = a("div.filter-options"),
            i = h.children(),
            j = a("#all");
        return d = function() {
            c = new b(g.get()), c.on("always", e)
        }, e = function(a) {
            f.shuffle({
                itemSelector: ".picture-item"
            })
        }, i.on("click", function() {
            var b = a(this),
                c = b.hasClass("active"),
                d = "all" === b.attr("id"),
                e = c ? "all" : b.data("group");
            return c && d ? !1 : (c || a(".filter-options .active").removeClass("active"), c && !d && j.addClass("active"), b.toggleClass("active"), d && j.addClass("active"), void f.shuffle("shuffle", e))
        }), i = null, {
            init: d
        }
    }(jQuery, window.imagesLoaded),
    CurrencySwitcher = function() {
        var a, b = $(".currency-switcher"),
            c = Wata.currencySwitcher.offers,
            d = Object.keys(c),
            e = d.length,
            f = Wata.currencySwitcher.symbols;
        b.find("input[type=radio]").on("change", function() {
            a = this.id;
            for (var b = 0; e > b; b++) $("#" + d[b]).find(".price").text(f[a] + c[d[b]][a])
        })
    };;
/**

The MIT License (MIT)

Copyright (c) 2014 Maksim Surguy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

**/
function initialise() {
    createRenderer(), createScene(), createMesh(), addLights(), addEventListeners(), resize(container.offsetWidth, container.offsetHeight), animate(), trianglesReady()
}

function createRenderer() {
    webglRenderer = new FSS.WebGLRenderer, canvasRenderer = new FSS.CanvasRenderer, svgRenderer = new FSS.SVGRenderer, setRenderer(RENDER.renderer)
}

function setRenderer(e) {
    switch (renderer && output.removeChild(renderer.element), e) {
        case WEBGL:
            renderer = webglRenderer;
            break;
        case CANVAS:
            renderer = canvasRenderer;
            break;
        case SVG:
            renderer = svgRenderer
    }
    renderer = svgRenderer, renderer.setSize(container.offsetWidth, container.offsetHeight), output.appendChild(renderer.element)
}

function createScene() {
    scene = new FSS.Scene
}

function createMesh() {
    scene.remove(mesh), renderer.clear(), geometry = new FSS.Plane(MESH.width * renderer.width, MESH.height * renderer.height, MESH.slices), material = new FSS.Material(MESH.ambient, MESH.diffuse), mesh = new FSS.Mesh(geometry, material), scene.add(mesh);
    var e, t;
    for (e = geometry.vertices.length - 1; e >= 0; e--) t = geometry.vertices[e], t.depth = Math.randomInRange(0, MESH.maxdepth / 10), t.anchor = FSS.Vector3.clone(t.position)
}

function addLight(e, t, i, r, n) {
    e = e !== void 0 ? e : LIGHT.ambient, t = t !== void 0 ? t : LIGHT.diffuse, i = i !== void 0 ? i : LIGHT.xPos, r = r !== void 0 ? r : LIGHT.yPos, n = n !== void 0 ? n : LIGHT.zOffset, renderer.clear(), light = new FSS.Light(e, t), light.ambientHex = light.ambient.format(), light.diffuseHex = light.diffuse.format(), light.setPosition(i, r, n), scene.add(light), LIGHT.diffuse = t, LIGHT.proxy = light, LIGHT.pickedup = !0, LIGHT.currIndex++
}

function addLights() {
    addLight(), LIGHT.count++
}

function trimLights(e) {
    for (l = e; scene.lights.length >= l; l++) light = scene.lights[l], scene.remove(light), LIGHT.currIndex--;
    LIGHT.proxy = scene.lights[LIGHT.currIndex - 1], LIGHT.pickedup = !1, renderer.clear()
}

function resize(e, t) {
    renderer.setSize(e, t), FSS.Vector3.set(center, renderer.halfWidth, renderer.halfHeight), createMesh()
}

function animate() {
    update(), render(), requestAnimationFrame(animate)
}

function update() {
    var e, t, i = MESH.depth / 100;
    for (e = geometry.vertices.length - 1; e >= 0; e--) t = geometry.vertices[e], FSS.Vector3.set(t.position, 1, 1, t.depth * i), FSS.Vector3.add(t.position, t.anchor);
    geometry.dirty = !0
}

function render() {
    renderer.render(scene)
}

function addEventListeners() {
    window.addEventListener("resize", onWindowResize), container.addEventListener("mousemove", onMouseMove)
}

function addControls() {
    var e, t, i;
    gui = new dat.GUI({
        autoPlace: !1
    }), controls.appendChild(gui.domElement), renderFolder = gui.addFolder("Render"), meshFolder = gui.addFolder("Mesh"), lightFolder = gui.addFolder("Light"), exportFolder = gui.addFolder("Export"), lightFolder.open(), i = renderFolder.add(RENDER, "renderer", {
        webgl: WEBGL,
        canvas: CANVAS,
        svg: SVG
    }), i.onChange(function(e) {
        setRenderer(e)
    }), i = meshFolder.addColor(MESH, "ambient"), i.onChange(function(i) {
        for (e = 0, t = scene.meshes.length; t > e; e++) scene.meshes[e].material.ambient.set(i)
    }), i = meshFolder.addColor(MESH, "diffuse"), i.onChange(function(i) {
        for (e = 0, t = scene.meshes.length; t > e; e++) scene.meshes[e].material.diffuse.set(i)
    }), i = meshFolder.add(MESH, "width", .05, 2), i.onChange(function(e) {
        geometry.width !== e * renderer.width && createMesh()
    }), i = meshFolder.add(MESH, "height", .05, 2), i.onChange(function(e) {
        geometry.height !== e * renderer.height && createMesh()
    }), i = meshFolder.add(MESH, "depth", 0, MESH.maxdepth).listen(), i = meshFolder.add(MESH, "slices", 1, 800), i.step(1), i.onChange(function(e) {
        geometry.slices !== e && createMesh()
    }), i = lightFolder.add(LIGHT, "currIndex", {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7
    }).name("Current light").listen(), i.onChange(function(e) {
        LIGHT.proxy = scene.lights[e - 1], LIGHT.ambient = LIGHT.proxy.ambient.hex, LIGHT.diffuse = LIGHT.proxy.diffuse.hex, LIGHT.xPos = LIGHT.proxy.position[0], LIGHT.yPos = LIGHT.proxy.position[1], LIGHT.zOffset = LIGHT.proxy.position[2], gui.__folders.Light.__controllers[1].updateDisplay(), gui.__folders.Light.__controllers[2].updateDisplay()
    }), i = lightFolder.addColor(LIGHT, "ambient"), i.onChange(function(e) {
        LIGHT.proxy.ambient.set(e), LIGHT.proxy.ambientHex = LIGHT.proxy.ambient.format()
    }), i = lightFolder.addColor(LIGHT, "diffuse"), i.onChange(function(e) {
        LIGHT.proxy.diffuse.set(e), LIGHT.proxy.diffuseHex = LIGHT.proxy.diffuse.format()
    }), i = lightFolder.add(LIGHT, "count", 1, 7).listen(), i.step(1), i.onChange(function(e) {
        scene.lights.length !== e && (e > scene.lights.length ? addLight() : trimLights(e))
    }), i = lightFolder.add(LIGHT, "xPos", -mesh.geometry.width / 2, mesh.geometry.width / 2).listen(), i.step(1), i.onChange(function(e) {
        LIGHT.proxy.setPosition(e, LIGHT.proxy.position[1], LIGHT.proxy.position[2])
    }), i = lightFolder.add(LIGHT, "yPos", -mesh.geometry.height / 2, mesh.geometry.height / 2).listen(), i.step(1), i.onChange(function(e) {
        LIGHT.proxy.setPosition(LIGHT.proxy.position[0], e, LIGHT.proxy.position[2])
    }), i = lightFolder.add(LIGHT, "zOffset", 0, 1e3).name("Distance").listen(), i.step(1), i.onChange(function(e) {
        LIGHT.proxy.setPosition(LIGHT.proxy.position[0], LIGHT.proxy.position[1], e)
    }), i = lightFolder.add(LIGHT, "randomize"), i = exportFolder.add(EXPORT, "width", 100, 3e3), i.step(100), i = exportFolder.add(EXPORT, "height", 100, 3e3), i.step(100), i = exportFolder.add(EXPORT, "export").name("export big"), i = exportFolder.add(EXPORT, "exportCurrent").name("export this")
}

function toggleEl(e) {
    var t = document.getElementById(e);
    t.style.display = "block" == t.style.display ? "none" : "block"
}

function getRandomColor() {
    return "#" + (Math.random().toString(16) + "000000").slice(2, 8)
}

function onWindowResize() {
    resize(container.offsetWidth, container.offsetHeight), render()
}

function onMouseMove(e) {
    LIGHT.pickedup && (LIGHT.xPos = e.clientX - renderer.width / 2, LIGHT.yPos = renderer.height / 2 - e.clientY, LIGHT.proxy.setPosition(LIGHT.xPos, LIGHT.yPos, LIGHT.proxy.position[2]))
}
var Delaunay;
(function() {
    "use strict";

    function e(e) {
        var t, i, r, n, o, s, a = Number.POSITIVE_INFINITY,
            h = Number.POSITIVE_INFINITY,
            l = Number.NEGATIVE_INFINITY,
            u = Number.NEGATIVE_INFINITY;
        for (t = e.length; t--;) a > e[t][0] && (a = e[t][0]), e[t][0] > l && (l = e[t][0]), h > e[t][1] && (h = e[t][1]), e[t][1] > u && (u = e[t][1]);
        return i = l - a, r = u - h, n = Math.max(i, r), o = a + .5 * i, s = h + .5 * r, [
            [o - 20 * n, s - n],
            [o, s + 20 * n],
            [o + 20 * n, s - n]
        ]
    }

    function t(e, t, i, n) {
        var o, s, a, h, l, u, c, d, f, S, g = e[t][0],
            m = e[t][1],
            p = e[i][0],
            F = e[i][1],
            b = e[n][0],
            y = e[n][1],
            v = Math.abs(m - F),
            L = Math.abs(F - y);
        if (r > v && r > L) throw Error("Eek! Coincident points!");
        return r > v ? (h = -((b - p) / (y - F)), u = (p + b) / 2, d = (F + y) / 2, o = (p + g) / 2, s = h * (o - u) + d) : r > L ? (a = -((p - g) / (F - m)), l = (g + p) / 2, c = (m + F) / 2, o = (b + p) / 2, s = a * (o - l) + c) : (a = -((p - g) / (F - m)), h = -((b - p) / (y - F)), l = (g + p) / 2, u = (p + b) / 2, c = (m + F) / 2, d = (F + y) / 2, o = (a * l - h * u + d - c) / (a - h), s = v > L ? a * (o - l) + c : h * (o - u) + d), f = p - o, S = F - s, {
            i: t,
            j: i,
            k: n,
            x: o,
            y: s,
            r: f * f + S * S
        }
    }

    function i(e) {
        var t, i, r, n, o, s;
        for (i = e.length; i;)
            for (n = e[--i], r = e[--i], t = i; t;)
                if (s = e[--t], o = e[--t], r === o && n === s || r === s && n === o) {
                    e.splice(i, 2), e.splice(t, 2);
                    break
                }
    }
    var r = 1 / 1048576;
    Delaunay = {
        triangulate: function(n, o) {
            var s, a, h, l, u, c, d, f, S, g, m, p, F = n.length;
            if (3 > F) return [];
            if (n = n.slice(0), o)
                for (s = F; s--;) n[s] = n[s][o];
            for (h = Array(F), s = F; s--;) h[s] = s;
            for (h.sort(function(e, t) {
                    return n[t][0] - n[e][0]
                }), l = e(n), n.push(l[0], l[1], l[2]), u = [t(n, F + 0, F + 1, F + 2)], c = [], d = [], s = h.length; s--; d.length = 0) {
                for (p = h[s], a = u.length; a--;) f = n[p][0] - u[a].x, f > 0 && f * f > u[a].r ? (c.push(u[a]), u.splice(a, 1)) : (S = n[p][1] - u[a].y, f * f + S * S - u[a].r > r || (d.push(u[a].i, u[a].j, u[a].j, u[a].k, u[a].k, u[a].i), u.splice(a, 1)));
                for (i(d), a = d.length; a;) m = d[--a], g = d[--a], u.push(t(n, g, m, p))
            }
            for (s = u.length; s--;) c.push(u[s]);
            for (u.length = 0, s = c.length; s--;) F > c[s].i && F > c[s].j && F > c[s].k && u.push(c[s].i, c[s].j, c[s].k);
            return u
        },
        contains: function(e, t) {
            if (t[0] < e[0][0] && t[0] < e[1][0] && t[0] < e[2][0] || t[0] > e[0][0] && t[0] > e[1][0] && t[0] > e[2][0] || t[1] < e[0][1] && t[1] < e[1][1] && t[1] < e[2][1] || t[1] > e[0][1] && t[1] > e[1][1] && t[1] > e[2][1]) return null;
            var i = e[1][0] - e[0][0],
                r = e[2][0] - e[0][0],
                n = e[1][1] - e[0][1],
                o = e[2][1] - e[0][1],
                s = i * o - r * n;
            if (0 === s) return null;
            var a = (o * (t[0] - e[0][0]) - r * (t[1] - e[0][1])) / s,
                h = (i * (t[1] - e[0][1]) - n * (t[0] - e[0][0])) / s;
            return 0 > a || 0 > h || a + h > 1 ? null : [a, h]
        }
    }, "undefined" != typeof module && (module.exports = Delaunay)
})(), FSS = {
        FRONT: 0,
        BACK: 1,
        DOUBLE: 2,
        SVGNS: "http://www.w3.org/2000/svg"
    }, FSS.Array = "function" == typeof Float32Array ? Float32Array : Array, FSS.Utils = {
        isNumber: function(e) {
            return !isNaN(parseFloat(e)) && isFinite(e)
        }
    },
    function() {
        for (var e = 0, t = ["ms", "moz", "webkit", "o"], i = 0; t.length > i && !window.requestAnimationFrame; ++i) window.requestAnimationFrame = window[t[i] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[t[i] + "CancelAnimationFrame"] || window[t[i] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function(t) {
            var i = (new Date).getTime(),
                r = Math.max(0, 16 - (i - e)),
                n = window.setTimeout(function() {
                    t(i + r)
                }, r);
            return e = i + r, n
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e) {
            clearTimeout(e)
        })
    }(), Math.PIM2 = 2 * Math.PI, Math.PID2 = Math.PI / 2, Math.randomInRange = function(e, t) {
        return e + (t - e) * Math.random()
    }, Math.clamp = function(e, t, i) {
        return e = Math.max(e, t), e = Math.min(e, i)
    }, FSS.Vector3 = {
        create: function(e, t, i) {
            var r = new FSS.Array(3);
            return this.set(r, e, t, i), r
        },
        clone: function(e) {
            var t = this.create();
            return this.copy(t, e), t
        },
        set: function(e, t, i, r) {
            return e[0] = t || 0, e[1] = i || 0, e[2] = r || 0, this
        },
        setX: function(e, t) {
            return e[0] = t || 0, this
        },
        setY: function(e, t) {
            return e[1] = t || 0, this
        },
        setZ: function(e, t) {
            return e[2] = t || 0, this
        },
        copy: function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], this
        },
        add: function(e, t) {
            return e[0] += t[0], e[1] += t[1], e[2] += t[2], this
        },
        addVectors: function(e, t, i) {
            return e[0] = t[0] + i[0], e[1] = t[1] + i[1], e[2] = t[2] + i[2], this
        },
        addScalar: function(e, t) {
            return e[0] += t, e[1] += t, e[2] += t, this
        },
        subtract: function(e, t) {
            return e[0] -= t[0], e[1] -= t[1], e[2] -= t[2], this
        },
        subtractVectors: function(e, t, i) {
            return e[0] = t[0] - i[0], e[1] = t[1] - i[1], e[2] = t[2] - i[2], this
        },
        subtractScalar: function(e, t) {
            return e[0] -= t, e[1] -= t, e[2] -= t, this
        },
        multiply: function(e, t) {
            return e[0] *= t[0], e[1] *= t[1], e[2] *= t[2], this
        },
        multiplyVectors: function(e, t, i) {
            return e[0] = t[0] * i[0], e[1] = t[1] * i[1], e[2] = t[2] * i[2], this
        },
        multiplyScalar: function(e, t) {
            return e[0] *= t, e[1] *= t, e[2] *= t, this
        },
        divide: function(e, t) {
            return e[0] /= t[0], e[1] /= t[1], e[2] /= t[2], this
        },
        divideVectors: function(e, t, i) {
            return e[0] = t[0] / i[0], e[1] = t[1] / i[1], e[2] = t[2] / i[2], this
        },
        divideScalar: function(e, t) {
            return 0 !== t ? (e[0] /= t, e[1] /= t, e[2] /= t) : (e[0] = 0, e[1] = 0, e[2] = 0), this
        },
        cross: function(e, t) {
            var i = e[0],
                r = e[1],
                n = e[2];
            return e[0] = r * t[2] - n * t[1], e[1] = n * t[0] - i * t[2], e[2] = i * t[1] - r * t[0], this
        },
        crossVectors: function(e, t, i) {
            return e[0] = t[1] * i[2] - t[2] * i[1], e[1] = t[2] * i[0] - t[0] * i[2], e[2] = t[0] * i[1] - t[1] * i[0], this
        },
        min: function(e, t) {
            return t > e[0] && (e[0] = t), t > e[1] && (e[1] = t), t > e[2] && (e[2] = t), this
        },
        max: function(e, t) {
            return e[0] > t && (e[0] = t), e[1] > t && (e[1] = t), e[2] > t && (e[2] = t), this
        },
        clamp: function(e, t, i) {
            return this.min(e, t), this.max(e, i), this
        },
        limit: function(e, t, i) {
            var r = this.length(e);
            return null !== t && t > r ? this.setLength(e, t) : null !== i && r > i && this.setLength(e, i), this
        },
        dot: function(e, t) {
            return e[0] * t[0] + e[1] * t[1] + e[2] * t[2]
        },
        normalise: function(e) {
            return this.divideScalar(e, this.length(e))
        },
        negate: function(e) {
            return this.multiplyScalar(e, -1)
        },
        distanceSquared: function(e, t) {
            var i = e[0] - t[0],
                r = e[1] - t[1],
                n = e[2] - t[2];
            return i * i + r * r + n * n
        },
        distance: function(e, t) {
            return Math.sqrt(this.distanceSquared(e, t))
        },
        lengthSquared: function(e) {
            return e[0] * e[0] + e[1] * e[1] + e[2] * e[2]
        },
        length: function(e) {
            return Math.sqrt(this.lengthSquared(e))
        },
        setLength: function(e, t) {
            var i = this.length(e);
            return 0 !== i && t !== i && this.multiplyScalar(e, t / i), this
        }
    }, FSS.Vector4 = {
        create: function(e, t, i) {
            var r = new FSS.Array(4);
            return this.set(r, e, t, i), r
        },
        set: function(e, t, i, r, n) {
            return e[0] = t || 0, e[1] = i || 0, e[2] = r || 0, e[3] = n || 0, this
        },
        setX: function(e, t) {
            return e[0] = t || 0, this
        },
        setY: function(e, t) {
            return e[1] = t || 0, this
        },
        setZ: function(e, t) {
            return e[2] = t || 0, this
        },
        setW: function(e, t) {
            return e[3] = t || 0, this
        },
        add: function(e, t) {
            return e[0] += t[0], e[1] += t[1], e[2] += t[2], e[3] += t[3], this
        },
        multiplyVectors: function(e, t, i) {
            return e[0] = t[0] * i[0], e[1] = t[1] * i[1], e[2] = t[2] * i[2], e[3] = t[3] * i[3], this
        },
        multiplyScalar: function(e, t) {
            return e[0] *= t, e[1] *= t, e[2] *= t, e[3] *= t, this
        },
        min: function(e, t) {
            return t > e[0] && (e[0] = t), t > e[1] && (e[1] = t), t > e[2] && (e[2] = t), t > e[3] && (e[3] = t), this
        },
        max: function(e, t) {
            return e[0] > t && (e[0] = t), e[1] > t && (e[1] = t), e[2] > t && (e[2] = t), e[3] > t && (e[3] = t), this
        },
        clamp: function(e, t, i) {
            return this.min(e, t), this.max(e, i), this
        }
    }, FSS.Color = function(e, t) {
        this.rgba = FSS.Vector4.create(), this.hex = e || "#000000", this.opacity = FSS.Utils.isNumber(t) ? t : 1, this.set(this.hex, this.opacity)
    }, FSS.Color.prototype = {
        set: function(e, t) {
            e = e.replace("#", "");
            var i = e.length / 3;
            return this.rgba[0] = parseInt(e.substring(0 * i, 1 * i), 16) / 255, this.rgba[1] = parseInt(e.substring(1 * i, 2 * i), 16) / 255, this.rgba[2] = parseInt(e.substring(2 * i, 3 * i), 16) / 255, this.rgba[3] = FSS.Utils.isNumber(t) ? t : this.rgba[3], this
        },
        hexify: function(e) {
            var t = Math.ceil(255 * e).toString(16);
            return 1 === t.length && (t = "0" + t), t
        },
        format: function() {
            var e = this.hexify(this.rgba[0]),
                t = this.hexify(this.rgba[1]),
                i = this.hexify(this.rgba[2]);
            return this.hex = "#" + e + t + i, this.hex
        }
    }, FSS.Object = function() {
        this.position = FSS.Vector3.create()
    }, FSS.Object.prototype = {
        setPosition: function(e, t, i) {
            return FSS.Vector3.set(this.position, e, t, i), this
        }
    }, FSS.Light = function(e, t) {
        FSS.Object.call(this), this.ambient = new FSS.Color(e || "#FFFFFF"), this.diffuse = new FSS.Color(t || "#FFFFFF"), this.ray = FSS.Vector3.create()
    }, FSS.Light.prototype = Object.create(FSS.Object.prototype), FSS.Vertex = function(e, t, i) {
        this.position = FSS.Vector3.create(e, t, i)
    }, FSS.Vertex.prototype = {
        setPosition: function(e, t, i) {
            return FSS.Vector3.set(this.position, e, t, i), this
        }
    }, FSS.Triangle = function(e, t, i) {
        this.a = e || new FSS.Vertex, this.b = t || new FSS.Vertex, this.c = i || new FSS.Vertex, this.vertices = [this.a, this.b, this.c], this.u = FSS.Vector3.create(), this.v = FSS.Vector3.create(), this.centroid = FSS.Vector3.create(), this.normal = FSS.Vector3.create(), this.color = new FSS.Color, this.polygon = document.createElementNS(FSS.SVGNS, "polygon"), this.polygon.setAttributeNS(null, "stroke-linejoin", "round"), this.polygon.setAttributeNS(null, "stroke-miterlimit", "1"), this.polygon.setAttributeNS(null, "stroke-width", "1"), this.computeCentroid(), this.computeNormal()
    }, FSS.Triangle.prototype = {
        computeCentroid: function() {
            return this.centroid[0] = this.a.position[0] + this.b.position[0] + this.c.position[0], this.centroid[1] = this.a.position[1] + this.b.position[1] + this.c.position[1], this.centroid[2] = this.a.position[2] + this.b.position[2] + this.c.position[2], FSS.Vector3.divideScalar(this.centroid, 3), this
        },
        computeNormal: function() {
            return FSS.Vector3.subtractVectors(this.u, this.b.position, this.a.position), FSS.Vector3.subtractVectors(this.v, this.c.position, this.a.position), FSS.Vector3.crossVectors(this.normal, this.u, this.v), FSS.Vector3.normalise(this.normal), this
        }
    }, FSS.Geometry = function() {
        this.vertices = [], this.triangles = [], this.dirty = !1
    }, FSS.Geometry.prototype = {
        update: function() {
            if (this.dirty) {
                var e, t;
                for (e = this.triangles.length - 1; e >= 0; e--) t = this.triangles[e], t.computeCentroid(), t.computeNormal();
                this.dirty = !1
            }
            return this
        }
    }, FSS.Plane = function(e, t, i) {
        FSS.Geometry.call(this), this.width = e || 100, this.height = t || 100;
        var r, n, o = Array(i);
        for (offsetX = this.width * -.5, offsetY = .5 * this.height, s = o.length; s--;) r = offsetX + Math.random() * e, n = offsetY - Math.random() * t, o[s] = [r, n];
        o.push([offsetX, offsetY]), o.push([offsetX + e / 2, offsetY]), o.push([offsetX + e, offsetY]), o.push([offsetX + e, offsetY - t / 2]), o.push([offsetX + e, offsetY - t]), o.push([offsetX + e / 2, offsetY - t]), o.push([offsetX, offsetY - t]), o.push([offsetX, offsetY - t / 2]);
        for (var s = 6; s >= 0; s--) o.push([offsetX + Math.random() * e, offsetY]), o.push([offsetX, offsetY - Math.random() * t]), o.push([offsetX + e, offsetY - Math.random() * t]), o.push([offsetX + Math.random() * e, offsetY - t]);
        var a = Delaunay.triangulate(o);
        for (s = a.length; s;) --s, v1 = new FSS.Vertex(Math.ceil(o[a[s]][0]), Math.ceil(o[a[s]][1])), --s, v2 = new FSS.Vertex(Math.ceil(o[a[s]][0]), Math.ceil(o[a[s]][1])), --s, v3 = new FSS.Vertex(Math.ceil(o[a[s]][0]), Math.ceil(o[a[s]][1])), t1 = new FSS.Triangle(v1, v2, v3), this.triangles.push(t1), this.vertices.push(v1), this.vertices.push(v2), this.vertices.push(v3)
    }, FSS.Plane.prototype = Object.create(FSS.Geometry.prototype), FSS.Material = function(e, t) {
        this.ambient = new FSS.Color(e || "#444444"), this.diffuse = new FSS.Color(t || "#FFFFFF"), this.slave = new FSS.Color
    }, FSS.Mesh = function(e, t) {
        FSS.Object.call(this), this.geometry = e || new FSS.Geometry, this.material = t || new FSS.Material, this.side = FSS.FRONT, this.visible = !0
    }, FSS.Mesh.prototype = Object.create(FSS.Object.prototype), FSS.Mesh.prototype.update = function(e, t) {
        var i, r, n, o, s;
        if (this.geometry.update(), t)
            for (i = this.geometry.triangles.length - 1; i >= 0; i--) {
                for (r = this.geometry.triangles[i], FSS.Vector4.set(r.color.rgba), n = e.length - 1; n >= 0; n--) o = e[n], FSS.Vector3.subtractVectors(o.ray, o.position, r.centroid), FSS.Vector3.normalise(o.ray), s = FSS.Vector3.dot(r.normal, o.ray), this.side === FSS.FRONT ? s = Math.max(s, 0) : this.side === FSS.BACK ? s = Math.abs(Math.min(s, 0)) : this.side === FSS.DOUBLE && (s = Math.max(Math.abs(s), 0)), FSS.Vector4.multiplyVectors(this.material.slave.rgba, this.material.ambient.rgba, o.ambient.rgba), FSS.Vector4.add(r.color.rgba, this.material.slave.rgba), FSS.Vector4.multiplyVectors(this.material.slave.rgba, this.material.diffuse.rgba, o.diffuse.rgba), FSS.Vector4.multiplyScalar(this.material.slave.rgba, s), FSS.Vector4.add(r.color.rgba, this.material.slave.rgba);
                FSS.Vector4.clamp(r.color.rgba, 0, 1)
            }
        return this
    }, FSS.Scene = function() {
        this.meshes = [], this.lights = []
    }, FSS.Scene.prototype = {
        add: function(e) {
            return e instanceof FSS.Mesh && !~this.meshes.indexOf(e) ? this.meshes.push(e) : e instanceof FSS.Light && !~this.lights.indexOf(e) && this.lights.push(e), this
        },
        remove: function(e) {
            return e instanceof FSS.Mesh && ~this.meshes.indexOf(e) ? this.meshes.splice(this.meshes.indexOf(e), 1) : e instanceof FSS.Light && ~this.lights.indexOf(e) && this.lights.splice(this.lights.indexOf(e), 1), this
        }
    }, FSS.Renderer = function() {
        this.width = 0, this.height = 0, this.halfWidth = 0, this.halfHeight = 0
    }, FSS.Renderer.prototype = {
        setSize: function(e, t) {
            return this.width !== e || this.height !== t ? (this.width = e, this.height = t, this.halfWidth = .5 * this.width, this.halfHeight = .5 * this.height, this) : void 0
        },
        clear: function() {
            return this
        },
        render: function() {
            return this
        }
    }, FSS.CanvasRenderer = function() {
        FSS.Renderer.call(this), this.element = document.createElement("canvas"), this.element.style.display = "block", this.context = this.element.getContext("2d"), this.setSize(this.element.width, this.element.height)
    }, FSS.CanvasRenderer.prototype = Object.create(FSS.Renderer.prototype), FSS.CanvasRenderer.prototype.setSize = function(e, t) {
        return FSS.Renderer.prototype.setSize.call(this, e, t), this.element.width = e, this.element.height = t, this.context.setTransform(1, 0, 0, -1, this.halfWidth, this.halfHeight), this
    }, FSS.CanvasRenderer.prototype.clear = function() {
        return FSS.Renderer.prototype.clear.call(this), this.context.clearRect(-this.halfWidth, -this.halfHeight, this.width, this.height), this
    }, FSS.CanvasRenderer.prototype.render = function(e) {
        FSS.Renderer.prototype.render.call(this, e);
        var t, i, r, n, o;
        for (this.clear(), this.context.lineJoin = "round", this.context.lineWidth = 1, t = e.meshes.length - 1; t >= 0; t--)
            if (i = e.meshes[t], i.visible)
                for (i.update(e.lights, !0), r = i.geometry.triangles.length - 1; r >= 0; r--) n = i.geometry.triangles[r], o = n.color.format(), this.context.beginPath(), this.context.moveTo(n.a.position[0], n.a.position[1]), this.context.lineTo(n.b.position[0], n.b.position[1]), this.context.lineTo(n.c.position[0], n.c.position[1]), this.context.closePath(), this.context.strokeStyle = o, this.context.fillStyle = o, this.context.stroke(), this.context.fill();
        return this
    }, FSS.WebGLRenderer = function() {
        FSS.Renderer.call(this), this.element = document.createElement("canvas"), this.element.style.display = "block", this.vertices = null, this.lights = null;
        var e = {
            preserveDrawingBuffer: !1,
            premultipliedAlpha: !0,
            antialias: !0,
            stencil: !0,
            alpha: !0
        };
        return this.gl = this.getContext(this.element, e), this.unsupported = !this.gl, this.unsupported ? "WebGL is not supported by your browser." : (this.gl.clearColor(0, 0, 0, 0), this.gl.enable(this.gl.DEPTH_TEST), this.setSize(this.element.width, this.element.height), void 0)
    }, FSS.WebGLRenderer.prototype = Object.create(FSS.Renderer.prototype), FSS.WebGLRenderer.prototype.getContext = function(e, t) {
        var i = !1;
        try {
            !(i = e.getContext("experimental-webgl", t))
        } catch (r) {
            console.error(r)
        }
        return i
    }, FSS.WebGLRenderer.prototype.setSize = function(e, t) {
        return FSS.Renderer.prototype.setSize.call(this, e, t), this.unsupported ? void 0 : (this.element.width = e, this.element.height = t, this.gl.viewport(0, 0, e, t), this)
    }, FSS.WebGLRenderer.prototype.clear = function() {
        return FSS.Renderer.prototype.clear.call(this), this.unsupported ? void 0 : (this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT), this)
    }, FSS.WebGLRenderer.prototype.render = function(e) {
        if (FSS.Renderer.prototype.render.call(this, e), !this.unsupported) {
            var t, i, r, n, o, s, a, h, l, u, c, d, f, S, g, m = !1,
                p = e.lights.length,
                F = 0;
            if (this.clear(), this.lights !== p) {
                if (this.lights = p, !(this.lights > 0)) return;
                this.buildProgram(p)
            }
            if (this.program) {
                for (t = e.meshes.length - 1; t >= 0; t--) i = e.meshes[t], i.geometry.dirty && (m = !0), i.update(e.lights, !1), F += 3 * i.geometry.triangles.length;
                if (m || this.vertices !== F) {
                    this.vertices = F;
                    for (h in this.program.attributes) {
                        for (u = this.program.attributes[h], u.data = new FSS.Array(F * u.size), f = 0, t = e.meshes.length - 1; t >= 0; t--)
                            for (i = e.meshes[t], r = 0, n = i.geometry.triangles.length; n > r; r++)
                                for (o = i.geometry.triangles[r], S = 0, g = o.vertices.length; g > S; S++) {
                                    switch (vertex = o.vertices[S], h) {
                                        case "side":
                                            this.setBufferData(f, u, i.side);
                                            break;
                                        case "position":
                                            this.setBufferData(f, u, vertex.position);
                                            break;
                                        case "centroid":
                                            this.setBufferData(f, u, o.centroid);
                                            break;
                                        case "normal":
                                            this.setBufferData(f, u, o.normal);
                                            break;
                                        case "ambient":
                                            this.setBufferData(f, u, i.material.ambient.rgba);
                                            break;
                                        case "diffuse":
                                            this.setBufferData(f, u, i.material.diffuse.rgba)
                                    }
                                    f++
                                }
                        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, u.buffer), this.gl.bufferData(this.gl.ARRAY_BUFFER, u.data, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(u.location), this.gl.vertexAttribPointer(u.location, u.size, this.gl.FLOAT, !1, 0, 0)
                    }
                }
                for (this.setBufferData(0, this.program.uniforms.resolution, [this.width, this.height, this.width]), s = p - 1; s >= 0; s--) a = e.lights[s], this.setBufferData(s, this.program.uniforms.lightPosition, a.position), this.setBufferData(s, this.program.uniforms.lightAmbient, a.ambient.rgba), this.setBufferData(s, this.program.uniforms.lightDiffuse, a.diffuse.rgba);
                for (l in this.program.uniforms) switch (u = this.program.uniforms[l], d = u.location, c = u.data, u.structure) {
                    case "3f":
                        this.gl.uniform3f(d, c[0], c[1], c[2]);
                        break;
                    case "3fv":
                        this.gl.uniform3fv(d, c);
                        break;
                    case "4fv":
                        this.gl.uniform4fv(d, c)
                }
            }
            return this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices), this
        }
    }, FSS.WebGLRenderer.prototype.setBufferData = function(e, t, i) {
        if (FSS.Utils.isNumber(i)) t.data[e * t.size] = i;
        else
            for (var r = i.length - 1; r >= 0; r--) t.data[e * t.size + r] = i[r]
    }, FSS.WebGLRenderer.prototype.buildProgram = function(e) {
        if (!this.unsupported) {
            var t = FSS.WebGLRenderer.VS(e),
                i = FSS.WebGLRenderer.FS(e),
                r = t + i;
            if (!this.program || this.program.code !== r) {
                var n = this.gl.createProgram(),
                    o = this.buildShader(this.gl.VERTEX_SHADER, t),
                    s = this.buildShader(this.gl.FRAGMENT_SHADER, i);
                if (this.gl.attachShader(n, o), this.gl.attachShader(n, s), this.gl.linkProgram(n), !this.gl.getProgramParameter(n, this.gl.LINK_STATUS)) {
                    var a = this.gl.getError(),
                        h = this.gl.getProgramParameter(n, this.gl.VALIDATE_STATUS);
                    return console.error("Could not initialise shader.\nVALIDATE_STATUS: " + h + "\nERROR: " + a), null
                }
                return this.gl.deleteShader(s), this.gl.deleteShader(o), n.code = r, n.attributes = {
                    side: this.buildBuffer(n, "attribute", "aSide", 1, "f"),
                    position: this.buildBuffer(n, "attribute", "aPosition", 3, "v3"),
                    centroid: this.buildBuffer(n, "attribute", "aCentroid", 3, "v3"),
                    normal: this.buildBuffer(n, "attribute", "aNormal", 3, "v3"),
                    ambient: this.buildBuffer(n, "attribute", "aAmbient", 4, "v4"),
                    diffuse: this.buildBuffer(n, "attribute", "aDiffuse", 4, "v4")
                }, n.uniforms = {
                    resolution: this.buildBuffer(n, "uniform", "uResolution", 3, "3f", 1),
                    lightPosition: this.buildBuffer(n, "uniform", "uLightPosition", 3, "3fv", e),
                    lightAmbient: this.buildBuffer(n, "uniform", "uLightAmbient", 4, "4fv", e),
                    lightDiffuse: this.buildBuffer(n, "uniform", "uLightDiffuse", 4, "4fv", e)
                }, this.program = n, this.gl.useProgram(this.program), n
            }
        }
    }, FSS.WebGLRenderer.prototype.buildShader = function(e, t) {
        if (!this.unsupported) {
            var i = this.gl.createShader(e);
            return this.gl.shaderSource(i, t), this.gl.compileShader(i), this.gl.getShaderParameter(i, this.gl.COMPILE_STATUS) ? i : (console.error(this.gl.getShaderInfoLog(i)), null)
        }
    }, FSS.WebGLRenderer.prototype.buildBuffer = function(e, t, i, r, n, o) {
        var s = {
            buffer: this.gl.createBuffer(),
            size: r,
            structure: n,
            data: null
        };
        switch (t) {
            case "attribute":
                s.location = this.gl.getAttribLocation(e, i);
                break;
            case "uniform":
                s.location = this.gl.getUniformLocation(e, i)
        }
        return o && (s.data = new FSS.Array(o * r)), s
    }, FSS.WebGLRenderer.VS = function(e) {
        var t = ["precision mediump float;", "#define LIGHTS " + e, "attribute float aSide;", "attribute vec3 aPosition;", "attribute vec3 aCentroid;", "attribute vec3 aNormal;", "attribute vec4 aAmbient;", "attribute vec4 aDiffuse;", "uniform vec3 uResolution;", "uniform vec3 uLightPosition[LIGHTS];", "uniform vec4 uLightAmbient[LIGHTS];", "uniform vec4 uLightDiffuse[LIGHTS];", "varying vec4 vColor;", "void main() {", "vColor = vec4(0.0);", "vec3 position = aPosition / uResolution * 2.0;", "for (int i = 0; i < LIGHTS; i++) {", "vec3 lightPosition = uLightPosition[i];", "vec4 lightAmbient = uLightAmbient[i];", "vec4 lightDiffuse = uLightDiffuse[i];", "vec3 ray = normalize(lightPosition - aCentroid);", "float illuminance = dot(aNormal, ray);", "if (aSide == 0.0) {", "illuminance = max(illuminance, 0.0);", "} else if (aSide == 1.0) {", "illuminance = abs(min(illuminance, 0.0));", "} else if (aSide == 2.0) {", "illuminance = max(abs(illuminance), 0.0);", "}", "vColor += aAmbient * lightAmbient;", "vColor += aDiffuse * lightDiffuse * illuminance;", "}", "vColor = clamp(vColor, 0.0, 1.0);", "gl_Position = vec4(position, 1.0);", "}"].join("\n");
        return t
    }, FSS.WebGLRenderer.FS = function() {
        var e = ["precision mediump float;", "varying vec4 vColor;", "void main() {", "gl_FragColor = vColor;", "}"].join("\n");
        return e
    }, FSS.SVGRenderer = function() {
        FSS.Renderer.call(this), this.element = document.createElementNS(FSS.SVGNS, "svg"), this.element.setAttribute("xmlns", FSS.SVGNS), this.element.setAttribute("version", "1.1"), this.element.style.display = "block", this.setSize(300, 150)
    }, FSS.SVGRenderer.prototype = Object.create(FSS.Renderer.prototype), FSS.SVGRenderer.prototype.setSize = function(e, t) {
        return FSS.Renderer.prototype.setSize.call(this, e, t), this.element.setAttribute("width", e), this.element.setAttribute("height", t), this
    }, FSS.SVGRenderer.prototype.clear = function() {
        FSS.Renderer.prototype.clear.call(this);
        for (var e = this.element.childNodes.length - 1; e >= 0; e--) this.element.removeChild(this.element.childNodes[e]);
        return this
    }, FSS.SVGRenderer.prototype.render = function(e) {
        FSS.Renderer.prototype.render.call(this, e);
        var t, i, r, n, o, s;
        for (t = e.meshes.length - 1; t >= 0; t--)
            if (i = e.meshes[t], i.visible)
                for (i.update(e.lights, !0), r = i.geometry.triangles.length - 1; r >= 0; r--) n = i.geometry.triangles[r], n.polygon.parentNode !== this.element && this.element.appendChild(n.polygon), o = this.formatPoint(n.a) + " ", o += this.formatPoint(n.b) + " ", o += this.formatPoint(n.c), s = this.formatStyle(n.color.format()), n.polygon.setAttributeNS(null, "points", o), n.polygon.setAttributeNS(null, "style", s);
        return this
    }, FSS.SVGRenderer.prototype.formatPoint = function(e) {
        return this.halfWidth + e.position[0] + "," + (this.halfHeight - e.position[1])
    }, FSS.SVGRenderer.prototype.formatStyle = function(e) {
        var t = "fill:" + e + ";";
        return t += "stroke:" + e + ";"
    };
var MESH = {
        width: 1.2,
        height: 1.2,
        slices: Wata.triangles.mesh.slices,
        depth: Wata.triangles.mesh.depth,
        maxdepth: 200,
        ambient: "#555555",
        diffuse: "#FFFFFF"
    },
    LIGHT = {
        count: 0,
        xPos: 68,
        yPos: 440,
        zOffset: Wata.triangles.light.distance,
        ambient: Wata.triangles.light.ambient,
        diffuse: Wata.triangles.light.diffuse,
        pickedup: !0,
        proxy: !1,
        currIndex: 0,
        randomize: function() {
            var e, t, i, r = Math.floor(3 * Math.random()) + 1;
            for (1 == r && (MESH.depth = 0), 2 == r && (MESH.depth = Math.randomInRange(0, 150)), 3 == r && (MESH.depth = Math.randomInRange(150, 200)), MESH.depth = 0, l = scene.lights.length - 1; l >= 0; l--) {
                e = Math.randomInRange(-mesh.geometry.width / 2, mesh.geometry.width / 2), t = Math.randomInRange(-mesh.geometry.height / 2, mesh.geometry.height / 2), i = scene.lights.length > 2 ? Math.randomInRange(10, 80) : Math.randomInRange(10, 100), light = scene.lights[l], FSS.Vector3.set(light.position, e, t, i);
                var n = this.diffuse,
                    o = this.ambient;
                light.diffuseHex = light.diffuse.format(), light.ambientHex = light.ambient.format(), LIGHT.xPos = e, LIGHT.yPos = t, LIGHT.zOffset = i, LIGHT.diffuse = n, LIGHT.ambient = o, gui.__folders.Light.__controllers[1].updateDisplay(), gui.__folders.Light.__controllers[2].updateDisplay()
            }
        }
    },
    WEBGL = "webgl",
    CANVAS = "canvas",
    SVG = "svg",
    RENDER = {
        renderer: CANVAS
    },
    EXPORT = {
        width: 2e3,
        height: 1e3,
        exportCurrent: function() {
            switch (RENDER.renderer) {
                case WEBGL:
                    window.open(webglRenderer.element.toDataURL(), "_blank");
                    break;
                case CANVAS:
                    window.open(canvasRenderer.element.toDataURL(), "_blank");
                    break;
                case SVG:
                    var e = encodeURIComponent(output.innerHTML),
                        t = "data:image/svg+xml," + e;
                    window.open(t, "_blank")
            }
        },
        "export": function() {
            var e, t, i, r, n = this.width / renderer.width,
                o = this.height / renderer.height,
                s = MESH.slices;
            for (MESH.slices = Math.ceil(1.4 * s * n), resize(this.width, this.height), MESH.slices = s, e = scene.lights.length - 1; e >= 0; e--) r = scene.lights[e], t = r.position[0], i = r.position[1], z = r.position[2], FSS.Vector3.set(r.position, t * n, i * o, z * n);
            switch (update(), render(), RENDER.renderer) {
                case WEBGL:
                    window.open(webglRenderer.element.toDataURL(), "_blank");
                    break;
                case CANVAS:
                    window.open(canvasRenderer.element.toDataURL(), "_blank");
                    break;
                case SVG:
                    var a = encodeURIComponent(output.innerHTML),
                        h = "data:image/svg+xml," + a;
                    window.open(h, "_blank")
            }
            for (resize(container.offsetWidth, container.offsetHeight), e = scene.lights.length - 1; e >= 0; e--) r = scene.lights[e], t = r.position[0], i = r.position[1], z = r.position[2], FSS.Vector3.set(r.position, t / n, i / o, z / n)
        }
    },
    center = FSS.Vector3.create(),
    container = document.getElementById("triangles"),
    controls = document.getElementById("controls"),
    output = document.getElementById("output"),
    renderer, scene, mesh, geometry, material, webglRenderer, canvasRenderer, svgRenderer, gui;
LIGHT.pickedup = !0;

         //initialise();
! function(e, t) {
    "function" == typeof define && define.amd ? define(t) : "object" == typeof exports ? module.exports = t() : e.ScrollMagic = t()
}(this, function() {
    "use strict";
    var e = function() {};
    e.version = "2.0.5", window.addEventListener("mousewheel", function() {});
    var t = "data-scrollmagic-pin-spacer";
    e.Controller = function(r) {
        var o, s, a = "ScrollMagic.Controller",
            l = "FORWARD",
            c = "REVERSE",
            u = "PAUSED",
            f = n.defaults,
            d = this,
            h = i.extend({}, f, r),
            g = [],
            p = !1,
            v = 0,
            m = u,
            w = !0,
            y = 0,
            S = !0,
            b = function() {
                for (var e in h) f.hasOwnProperty(e) || delete h[e];
                if (h.container = i.get.elements(h.container)[0], !h.container) throw a + " init failed.";
                w = h.container === window || h.container === document.body || !document.body.contains(h.container), w && (h.container = window), y = z(), h.container.addEventListener("resize", T), h.container.addEventListener("scroll", T), h.refreshInterval = parseInt(h.refreshInterval) || f.refreshInterval, E()
            },
            E = function() {
                h.refreshInterval > 0 && (s = window.setTimeout(A, h.refreshInterval))
            },
            x = function() {
                return h.vertical ? i.get.scrollTop(h.container) : i.get.scrollLeft(h.container)
            },
            z = function() {
                return h.vertical ? i.get.height(h.container) : i.get.width(h.container)
            },
            C = this._setScrollPos = function(e) {
                h.vertical ? w ? window.scrollTo(i.get.scrollLeft(), e) : h.container.scrollTop = e : w ? window.scrollTo(e, i.get.scrollTop()) : h.container.scrollLeft = e
            },
            F = function() {
                if (S && p) {
                    var e = i.type.Array(p) ? p : g.slice(0);
                    p = !1;
                    var t = v;
                    v = d.scrollPos();
                    var n = v - t;
                    0 !== n && (m = n > 0 ? l : c), m === c && e.reverse(), e.forEach(function(e) {
                        e.update(!0)
                    })
                }
            },
            L = function() {
                o = i.rAF(F)
            },
            T = function(e) {
                "resize" == e.type && (y = z(), m = u), p !== !0 && (p = !0, L())
            },
            A = function() {
                if (!w && y != z()) {
                    var e;
                    try {
                        e = new Event("resize", {
                            bubbles: !1,
                            cancelable: !1
                        })
                    } catch (t) {
                        e = document.createEvent("Event"), e.initEvent("resize", !1, !1)
                    }
                    h.container.dispatchEvent(e)
                }
                g.forEach(function(e) {
                    e.refresh()
                }), E()
            };
        this._options = h;
        var O = function(e) {
            if (e.length <= 1) return e;
            var t = e.slice(0);
            return t.sort(function(e, t) {
                return e.scrollOffset() > t.scrollOffset() ? 1 : -1
            }), t
        };
        return this.addScene = function(t) {
            if (i.type.Array(t)) t.forEach(function(e) {
                d.addScene(e)
            });
            else if (t instanceof e.Scene)
                if (t.controller() !== d) t.addTo(d);
                else if (g.indexOf(t) < 0) {
                g.push(t), g = O(g), t.on("shift.controller_sort", function() {
                    g = O(g)
                });
                for (var n in h.globalSceneOptions) t[n] && t[n].call(t, h.globalSceneOptions[n])
            }
            return d
        }, this.removeScene = function(e) {
            if (i.type.Array(e)) e.forEach(function(e) {
                d.removeScene(e)
            });
            else {
                var t = g.indexOf(e);
                t > -1 && (e.off("shift.controller_sort"), g.splice(t, 1), e.remove())
            }
            return d
        }, this.updateScene = function(t, n) {
            return i.type.Array(t) ? t.forEach(function(e) {
                d.updateScene(e, n)
            }) : n ? t.update(!0) : p !== !0 && t instanceof e.Scene && (p = p || [], -1 == p.indexOf(t) && p.push(t), p = O(p), L()), d
        }, this.update = function(e) {
            return T({
                type: "resize"
            }), e && F(), d
        }, this.scrollTo = function(n, r) {
            if (i.type.Number(n)) C.call(h.container, n, r);
            else if (n instanceof e.Scene) n.controller() === d && d.scrollTo(n.scrollOffset(), r);
            else if (i.type.Function(n)) C = n;
            else {
                var o = i.get.elements(n)[0];
                if (o) {
                    for (; o.parentNode.hasAttribute(t);) o = o.parentNode;
                    var s = h.vertical ? "top" : "left",
                        a = i.get.offset(h.container),
                        l = i.get.offset(o);
                    w || (a[s] -= d.scrollPos()), d.scrollTo(l[s] - a[s], r)
                }
            }
            return d
        }, this.scrollPos = function(e) {
            return arguments.length ? (i.type.Function(e) && (x = e), d) : x.call(d)
        }, this.info = function(e) {
            var t = {
                size: y,
                vertical: h.vertical,
                scrollPos: v,
                scrollDirection: m,
                container: h.container,
                isDocument: w
            };
            return arguments.length ? void 0 !== t[e] ? t[e] : void 0 : t
        }, this.loglevel = function() {
            return d
        }, this.enabled = function(e) {
            return arguments.length ? (S != e && (S = !!e, d.updateScene(g, !0)), d) : S
        }, this.destroy = function(e) {
            window.clearTimeout(s);
            for (var t = g.length; t--;) g[t].destroy(e);
            return h.container.removeEventListener("resize", T), h.container.removeEventListener("scroll", T), i.cAF(o), null
        }, b(), d
    };
    var n = {
        defaults: {
            container: window,
            vertical: !0,
            globalSceneOptions: {},
            loglevel: 2,
            refreshInterval: 100
        }
    };
    e.Controller.addOption = function(e, t) {
        n.defaults[e] = t
    }, e.Controller.extend = function(t) {
        var n = this;
        e.Controller = function() {
            return n.apply(this, arguments), this.$super = i.extend({}, this), t.apply(this, arguments) || this
        }, i.extend(e.Controller, n), e.Controller.prototype = n.prototype, e.Controller.prototype.constructor = e.Controller
    }, e.Scene = function(n) {
        var o, s, a = "BEFORE",
            l = "DURING",
            c = "AFTER",
            u = r.defaults,
            f = this,
            d = i.extend({}, u, n),
            h = a,
            g = 0,
            p = {
                start: 0,
                end: 0
            },
            v = 0,
            m = !0,
            w = function() {
                for (var e in d) u.hasOwnProperty(e) || delete d[e];
                for (var t in u) L(t);
                C()
            },
            y = {};
        this.on = function(e, t) {
            return i.type.Function(t) && (e = e.trim().split(" "), e.forEach(function(e) {
                var n = e.split("."),
                    r = n[0],
                    i = n[1];
                "*" != r && (y[r] || (y[r] = []), y[r].push({
                    namespace: i || "",
                    callback: t
                }))
            })), f
        }, this.off = function(e, t) {
            return e ? (e = e.trim().split(" "), e.forEach(function(e) {
                var n = e.split("."),
                    r = n[0],
                    i = n[1] || "",
                    o = "*" === r ? Object.keys(y) : [r];
                o.forEach(function(e) {
                    for (var n = y[e] || [], r = n.length; r--;) {
                        var o = n[r];
                        !o || i !== o.namespace && "*" !== i || t && t != o.callback || n.splice(r, 1)
                    }
                    n.length || delete y[e]
                })
            }), f) : f
        }, this.trigger = function(t, n) {
            if (t) {
                var r = t.trim().split("."),
                    i = r[0],
                    o = r[1],
                    s = y[i];
                s && s.forEach(function(t) {
                    o && o !== t.namespace || t.callback.call(f, new e.Event(i, t.namespace, f, n))
                })
            }
            return f
        }, f.on("change.internal", function(e) {
            "loglevel" !== e.what && "tweenChanges" !== e.what && ("triggerElement" === e.what ? E() : "reverse" === e.what && f.update())
        }).on("shift.internal", function() {
            S(), f.update()
        }), this.addTo = function(t) {
            return t instanceof e.Controller && s != t && (s && s.removeScene(f), s = t, C(), b(!0), E(!0), S(), s.info("container").addEventListener("resize", x), t.addScene(f), f.trigger("add", {
                controller: s
            }), f.update()), f
        }, this.enabled = function(e) {
            return arguments.length ? (m != e && (m = !!e, f.update(!0)), f) : m
        }, this.remove = function() {
            if (s) {
                s.info("container").removeEventListener("resize", x);
                var e = s;
                s = void 0, e.removeScene(f), f.trigger("remove")
            }
            return f
        }, this.destroy = function(e) {
            return f.trigger("destroy", {
                reset: e
            }), f.remove(), f.off("*.*"), null
        }, this.update = function(e) {
            if (s)
                if (e)
                    if (s.enabled() && m) {
                        var t, n = s.info("scrollPos");
                        t = d.duration > 0 ? (n - p.start) / (p.end - p.start) : n >= p.start ? 1 : 0, f.trigger("update", {
                            startPos: p.start,
                            endPos: p.end,
                            scrollPos: n
                        }), f.progress(t)
                    } else T && h === l && O(!0);
            else s.updateScene(f, !1);
            return f
        }, this.refresh = function() {
            return b(), E(), f
        }, this.progress = function(e) {
            if (arguments.length) {
                var t = !1,
                    n = h,
                    r = s ? s.info("scrollDirection") : "PAUSED",
                    i = d.reverse || e >= g;
                if (0 === d.duration ? (t = g != e, g = 1 > e && i ? 0 : 1, h = 0 === g ? a : l) : 0 > e && h !== a && i ? (g = 0, h = a, t = !0) : e >= 0 && 1 > e && i ? (g = e, h = l, t = !0) : e >= 1 && h !== c ? (g = 1, h = c, t = !0) : h !== l || i || O(), t) {
                    var o = {
                            progress: g,
                            state: h,
                            scrollDirection: r
                        },
                        u = h != n,
                        p = function(e) {
                            f.trigger(e, o)
                        };
                    u && n !== l && (p("enter"), p(n === a ? "start" : "end")), p("progress"), u && h !== l && (p(h === a ? "start" : "end"), p("leave"))
                }
                return f
            }
            return g
        };
        var S = function() {
                p = {
                    start: v + d.offset
                }, s && d.triggerElement && (p.start -= s.info("size") * d.triggerHook), p.end = p.start + d.duration
            },
            b = function(e) {
                if (o) {
                    var t = "duration";
                    F(t, o.call(f)) && !e && (f.trigger("change", {
                        what: t,
                        newval: d[t]
                    }), f.trigger("shift", {
                        reason: t
                    }))
                }
            },
            E = function(e) {
                var n = 0,
                    r = d.triggerElement;
                if (s && r) {
                    for (var o = s.info(), a = i.get.offset(o.container), l = o.vertical ? "top" : "left"; r.parentNode.hasAttribute(t);) r = r.parentNode;
                    var c = i.get.offset(r);
                    o.isDocument || (a[l] -= s.scrollPos()), n = c[l] - a[l]
                }
                var u = n != v;
                v = n, u && !e && f.trigger("shift", {
                    reason: "triggerElementPosition"
                })
            },
            x = function() {
                d.triggerHook > 0 && f.trigger("shift", {
                    reason: "containerResize"
                })
            },
            z = i.extend(r.validate, {
                duration: function(e) {
                    if (i.type.String(e) && e.match(/^(\.|\d)*\d+%$/)) {
                        var t = parseFloat(e) / 100;
                        e = function() {
                            return s ? s.info("size") * t : 0
                        }
                    }
                    if (i.type.Function(e)) {
                        o = e;
                        try {
                            e = parseFloat(o())
                        } catch (n) {
                            e = -1
                        }
                    }
                    if (e = parseFloat(e), !i.type.Number(e) || 0 > e) throw o ? (o = void 0, 0) : 0;
                    return e
                }
            }),
            C = function(e) {
                e = arguments.length ? [e] : Object.keys(z), e.forEach(function(e) {
                    var t;
                    if (z[e]) try {
                        t = z[e](d[e])
                    } catch (n) {
                        t = u[e]
                    } finally {
                        d[e] = t
                    }
                })
            },
            F = function(e, t) {
                var n = !1,
                    r = d[e];
                return d[e] != t && (d[e] = t, C(e), n = r != d[e]), n
            },
            L = function(e) {
                f[e] || (f[e] = function(t) {
                    return arguments.length ? ("duration" === e && (o = void 0), F(e, t) && (f.trigger("change", {
                        what: e,
                        newval: d[e]
                    }), r.shifts.indexOf(e) > -1 && f.trigger("shift", {
                        reason: e
                    })), f) : d[e]
                })
            };
        this.controller = function() {
            return s
        }, this.state = function() {
            return h
        }, this.scrollOffset = function() {
            return p.start
        }, this.triggerPosition = function() {
            var e = d.offset;
            return s && (e += d.triggerElement ? v : s.info("size") * f.triggerHook()), e
        };
        var T, A;
        f.on("shift.internal", function(e) {
            var t = "duration" === e.reason;
            (h === c && t || h === l && 0 === d.duration) && O(), t && _()
        }).on("progress.internal", function() {
            O()
        }).on("add.internal", function() {
            _()
        }).on("destroy.internal", function(e) {
            f.removePin(e.reset)
        });
        var O = function(e) {
                if (T && s) {
                    var t = s.info(),
                        n = A.spacer.firstChild;
                    if (e || h !== l) {
                        var r = {
                                position: A.inFlow ? "relative" : "absolute",
                                top: 0,
                                left: 0
                            },
                            o = i.css(n, "position") != r.position;
                        A.pushFollowers ? d.duration > 0 && (h === c && 0 === parseFloat(i.css(A.spacer, "padding-top")) ? o = !0 : h === a && 0 === parseFloat(i.css(A.spacer, "padding-bottom")) && (o = !0)) : r[t.vertical ? "top" : "left"] = d.duration * g, i.css(n, r), o && _()
                    } else {
                        "fixed" != i.css(n, "position") && (i.css(n, {
                            position: "fixed"
                        }), _());
                        var u = i.get.offset(A.spacer, !0),
                            f = d.reverse || 0 === d.duration ? t.scrollPos - p.start : Math.round(g * d.duration * 10) / 10;
                        u[t.vertical ? "top" : "left"] += f, i.css(A.spacer.firstChild, {
                            top: u.top,
                            left: u.left
                        })
                    }
                }
            },
            _ = function() {
                if (T && s && A.inFlow) {
                    var e = h === l,
                        t = s.info("vertical"),
                        n = A.spacer.firstChild,
                        r = i.isMarginCollapseType(i.css(A.spacer, "display")),
                        o = {};
                    A.relSize.width || A.relSize.autoFullWidth ? e ? i.css(T, {
                        width: i.get.width(A.spacer)
                    }) : i.css(T, {
                        width: "100%"
                    }) : (o["min-width"] = i.get.width(t ? T : n, !0, !0), o.width = e ? o["min-width"] : "auto"), A.relSize.height ? e ? i.css(T, {
                        height: i.get.height(A.spacer) - (A.pushFollowers ? d.duration : 0)
                    }) : i.css(T, {
                        height: "100%"
                    }) : (o["min-height"] = i.get.height(t ? n : T, !0, !r), o.height = e ? o["min-height"] : "auto"), A.pushFollowers && (o["padding" + (t ? "Top" : "Left")] = d.duration * g, o["padding" + (t ? "Bottom" : "Right")] = d.duration * (1 - g)), i.css(A.spacer, o)
                }
            },
            N = function() {
                s && T && h === l && !s.info("isDocument") && O()
            },
            P = function() {
                s && T && h === l && ((A.relSize.width || A.relSize.autoFullWidth) && i.get.width(window) != i.get.width(A.spacer.parentNode) || A.relSize.height && i.get.height(window) != i.get.height(A.spacer.parentNode)) && _()
            },
            D = function(e) {
                s && T && h === l && !s.info("isDocument") && (e.preventDefault(), s._setScrollPos(s.info("scrollPos") - ((e.wheelDelta || e[s.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || 30 * -e.detail)))
            };
        this.setPin = function(e, n) {
            var r = {
                pushFollowers: !0,
                spacerClass: "scrollmagic-pin-spacer"
            };
            if (n = i.extend({}, r, n), e = i.get.elements(e)[0], !e) return f;
            if ("fixed" === i.css(e, "position")) return f;
            if (T) {
                if (T === e) return f;
                f.removePin()
            }
            T = e;
            var o = T.parentNode.style.display,
                s = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
            T.parentNode.style.display = "none";
            var a = "absolute" != i.css(T, "position"),
                l = i.css(T, s.concat(["display"])),
                c = i.css(T, ["width", "height"]);
            T.parentNode.style.display = o, !a && n.pushFollowers && (n.pushFollowers = !1);
            var u = T.parentNode.insertBefore(document.createElement("div"), T),
                d = i.extend(l, {
                    position: a ? "relative" : "absolute",
                    boxSizing: "content-box",
                    mozBoxSizing: "content-box",
                    webkitBoxSizing: "content-box"
                });
            if (a || i.extend(d, i.css(T, ["width", "height"])), i.css(u, d), u.setAttribute(t, ""), i.addClass(u, n.spacerClass), A = {
                    spacer: u,
                    relSize: {
                        width: "%" === c.width.slice(-1),
                        height: "%" === c.height.slice(-1),
                        autoFullWidth: "auto" === c.width && a && i.isMarginCollapseType(l.display)
                    },
                    pushFollowers: n.pushFollowers,
                    inFlow: a
                }, !T.___origStyle) {
                T.___origStyle = {};
                var h = T.style,
                    g = s.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]);
                g.forEach(function(e) {
                    T.___origStyle[e] = h[e] || ""
                })
            }
            return A.relSize.width && i.css(u, {
                width: c.width
            }), A.relSize.height && i.css(u, {
                height: c.height
            }), u.appendChild(T), i.css(T, {
                position: a ? "relative" : "absolute",
                margin: "auto",
                top: "auto",
                left: "auto",
                bottom: "auto",
                right: "auto"
            }), (A.relSize.width || A.relSize.autoFullWidth) && i.css(T, {
                boxSizing: "border-box",
                mozBoxSizing: "border-box",
                webkitBoxSizing: "border-box"
            }), window.addEventListener("scroll", N), window.addEventListener("resize", N), window.addEventListener("resize", P), T.addEventListener("mousewheel", D), T.addEventListener("DOMMouseScroll", D), O(), f
        }, this.removePin = function(e) {
            if (T) {
                if (h === l && O(!0), e || !s) {
                    var n = A.spacer.firstChild;
                    if (n.hasAttribute(t)) {
                        var r = A.spacer.style,
                            o = ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
                        margins = {}, o.forEach(function(e) {
                            margins[e] = r[e] || ""
                        }), i.css(n, margins)
                    }
                    A.spacer.parentNode.insertBefore(n, A.spacer), A.spacer.parentNode.removeChild(A.spacer), T.parentNode.hasAttribute(t) || (i.css(T, T.___origStyle), delete T.___origStyle)
                }
                window.removeEventListener("scroll", N), window.removeEventListener("resize", N), window.removeEventListener("resize", P), T.removeEventListener("mousewheel", D), T.removeEventListener("DOMMouseScroll", D), T = void 0
            }
            return f
        };
        var R, k = [];
        return f.on("destroy.internal", function(e) {
            f.removeClassToggle(e.reset)
        }), this.setClassToggle = function(e, t) {
            var n = i.get.elements(e);
            return 0 !== n.length && i.type.String(t) ? (k.length > 0 && f.removeClassToggle(), R = t, k = n, f.on("enter.internal_class leave.internal_class", function(e) {
                var t = "enter" === e.type ? i.addClass : i.removeClass;
                k.forEach(function(e) {
                    t(e, R)
                })
            }), f) : f
        }, this.removeClassToggle = function(e) {
            return e && k.forEach(function(e) {
                i.removeClass(e, R)
            }), f.off("start.internal_class end.internal_class"), R = void 0, k = [], f
        }, w(), f
    };
    var r = {
        defaults: {
            duration: 0,
            offset: 0,
            triggerElement: void 0,
            triggerHook: .5,
            reverse: !0,
            loglevel: 2
        },
        validate: {
            offset: function(e) {
                if (e = parseFloat(e), !i.type.Number(e)) throw 0;
                return e
            },
            triggerElement: function(e) {
                if (e = e || void 0) {
                    var t = i.get.elements(e)[0];
                    if (!t) throw 0;
                    e = t
                }
                return e
            },
            triggerHook: function(e) {
                var t = {
                    onCenter: .5,
                    onEnter: 1,
                    onLeave: 0
                };
                if (i.type.Number(e)) e = Math.max(0, Math.min(parseFloat(e), 1));
                else {
                    if (!(e in t)) throw 0;
                    e = t[e]
                }
                return e
            },
            reverse: function(e) {
                return !!e
            }
        },
        shifts: ["duration", "offset", "triggerHook"]
    };
    e.Scene.addOption = function(e, t, n, i) {
        e in r.defaults || (r.defaults[e] = t, r.validate[e] = n, i && r.shifts.push(e))
    }, e.Scene.extend = function(t) {
        var n = this;
        e.Scene = function() {
            return n.apply(this, arguments), this.$super = i.extend({}, this), t.apply(this, arguments) || this
        }, i.extend(e.Scene, n), e.Scene.prototype = n.prototype, e.Scene.prototype.constructor = e.Scene
    }, e.Event = function(e, t, n, r) {
        r = r || {};
        for (var i in r) this[i] = r[i];
        return this.type = e, this.target = this.currentTarget = n, this.namespace = t || "", this.timeStamp = this.timestamp = Date.now(), this
    };
    var i = e._util = function(e) {
        var t, n = {},
            r = function(e) {
                return parseFloat(e) || 0
            },
            i = function(t) {
                return t.currentStyle ? t.currentStyle : e.getComputedStyle(t)
            },
            o = function(t, n, o, s) {
                if (n = n === document ? e : n, n === e) s = !1;
                else if (!f.DomElement(n)) return 0;
                t = t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
                var a = (o ? n["offset" + t] || n["outer" + t] : n["client" + t] || n["inner" + t]) || 0;
                if (o && s) {
                    var l = i(n);
                    a += "Height" === t ? r(l.marginTop) + r(l.marginBottom) : r(l.marginLeft) + r(l.marginRight)
                }
                return a
            },
            s = function(e) {
                return e.replace(/^[^a-z]+([a-z])/g, "$1").replace(/-([a-z])/g, function(e) {
                    return e[1].toUpperCase()
                })
            };
        n.extend = function(e) {
            for (e = e || {}, t = 1; t < arguments.length; t++)
                if (arguments[t])
                    for (var n in arguments[t]) arguments[t].hasOwnProperty(n) && (e[n] = arguments[t][n]);
            return e
        }, n.isMarginCollapseType = function(e) {
            return ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(e) > -1
        };
        var a = 0,
            l = ["ms", "moz", "webkit", "o"],
            c = e.requestAnimationFrame,
            u = e.cancelAnimationFrame;
        for (t = 0; !c && t < l.length; ++t) c = e[l[t] + "RequestAnimationFrame"], u = e[l[t] + "CancelAnimationFrame"] || e[l[t] + "CancelRequestAnimationFrame"];
        c || (c = function(t) {
            var n = (new Date).getTime(),
                r = Math.max(0, 16 - (n - a)),
                i = e.setTimeout(function() {
                    t(n + r)
                }, r);
            return a = n + r, i
        }), u || (u = function(t) {
            e.clearTimeout(t)
        }), n.rAF = c.bind(e), n.cAF = u.bind(e);
        var f = n.type = function(e) {
            return Object.prototype.toString.call(e).replace(/^\[object (.+)\]$/, "$1").toLowerCase()
        };
        f.String = function(e) {
            return "string" === f(e)
        }, f.Function = function(e) {
            return "function" === f(e)
        }, f.Array = function(e) {
            return Array.isArray(e)
        }, f.Number = function(e) {
            return !f.Array(e) && e - parseFloat(e) + 1 >= 0
        }, f.DomElement = function(e) {
            return "object" == typeof HTMLElement ? e instanceof HTMLElement : e && "object" == typeof e && null !== e && 1 === e.nodeType && "string" == typeof e.nodeName
        };
        var d = n.get = {};
        return d.elements = function(t) {
            var n = [];
            if (f.String(t)) try {
                t = document.querySelectorAll(t)
            } catch (r) {
                return n
            }
            if ("nodelist" === f(t) || f.Array(t))
                for (var i = 0, o = n.length = t.length; o > i; i++) {
                    var s = t[i];
                    n[i] = f.DomElement(s) ? s : d.elements(s)
                } else(f.DomElement(t) || t === document || t === e) && (n = [t]);
            return n
        }, d.scrollTop = function(t) {
            return t && "number" == typeof t.scrollTop ? t.scrollTop : e.pageYOffset || 0
        }, d.scrollLeft = function(t) {
            return t && "number" == typeof t.scrollLeft ? t.scrollLeft : e.pageXOffset || 0
        }, d.width = function(e, t, n) {
            return o("width", e, t, n)
        }, d.height = function(e, t, n) {
            return o("height", e, t, n)
        }, d.offset = function(e, t) {
            var n = {
                top: 0,
                left: 0
            };
            if (e && e.getBoundingClientRect) {
                var r = e.getBoundingClientRect();
                n.top = r.top, n.left = r.left, t || (n.top += d.scrollTop(), n.left += d.scrollLeft())
            }
            return n
        }, n.addClass = function(e, t) {
            t && (e.classList ? e.classList.add(t) : e.className += " " + t)
        }, n.removeClass = function(e, t) {
            t && (e.classList ? e.classList.remove(t) : e.className = e.className.replace(RegExp("(^|\\b)" + t.split(" ").join("|") + "(\\b|$)", "gi"), " "))
        }, n.css = function(e, t) {
            if (f.String(t)) return i(e)[s(t)];
            if (f.Array(t)) {
                var n = {},
                    r = i(e);
                return t.forEach(function(e) {
                    n[e] = r[s(e)]
                }), n
            }
            for (var o in t) {
                var a = t[o];
                a == parseFloat(a) && (a += "px"), e.style[s(o)] = a
            }
        }, n
    }(window || {});
    return e
});;
jQuery.easing.jswing = jQuery.easing.swing, jQuery.extend(jQuery.easing, {
        def: "easeOutQuad",
        swing: function(t, e, i, n, a) {
            return jQuery.easing[jQuery.easing.def](t, e, i, n, a)
        },
        easeInQuad: function(t, e, i, n, a) {
            return n * (e /= a) * e + i
        },
        easeOutQuad: function(t, e, i, n, a) {
            return -n * (e /= a) * (e - 2) + i
        },
        easeInOutQuad: function(t, e, i, n, a) {
            return (e /= a / 2) < 1 ? n / 2 * e * e + i : -n / 2 * (--e * (e - 2) - 1) + i
        },
        easeInCubic: function(t, e, i, n, a) {
            return n * (e /= a) * e * e + i
        },
        easeOutCubic: function(t, e, i, n, a) {
            return n * ((e = e / a - 1) * e * e + 1) + i
        },
        easeInOutCubic: function(t, e, i, n, a) {
            return (e /= a / 2) < 1 ? n / 2 * e * e * e + i : n / 2 * ((e -= 2) * e * e + 2) + i
        },
        easeInQuart: function(t, e, i, n, a) {
            return n * (e /= a) * e * e * e + i
        },
        easeOutQuart: function(t, e, i, n, a) {
            return -n * ((e = e / a - 1) * e * e * e - 1) + i
        },
        easeInOutQuart: function(t, e, i, n, a) {
            return (e /= a / 2) < 1 ? n / 2 * e * e * e * e + i : -n / 2 * ((e -= 2) * e * e * e - 2) + i
        },
        easeInQuint: function(t, e, i, n, a) {
            return n * (e /= a) * e * e * e * e + i
        },
        easeOutQuint: function(t, e, i, n, a) {
            return n * ((e = e / a - 1) * e * e * e * e + 1) + i
        },
        easeInOutQuint: function(t, e, i, n, a) {
            return (e /= a / 2) < 1 ? n / 2 * e * e * e * e * e + i : n / 2 * ((e -= 2) * e * e * e * e + 2) + i
        },
        easeInSine: function(t, e, i, n, a) {
            return -n * Math.cos(e / a * (Math.PI / 2)) + n + i
        },
        easeOutSine: function(t, e, i, n, a) {
            return n * Math.sin(e / a * (Math.PI / 2)) + i
        },
        easeInOutSine: function(t, e, i, n, a) {
            return -n / 2 * (Math.cos(Math.PI * e / a) - 1) + i
        },
        easeInExpo: function(t, e, i, n, a) {
            return 0 == e ? i : n * Math.pow(2, 10 * (e / a - 1)) + i
        },
        easeOutExpo: function(t, e, i, n, a) {
            return e == a ? i + n : n * (-Math.pow(2, -10 * e / a) + 1) + i
        },
        easeInOutExpo: function(t, e, i, n, a) {
            return 0 == e ? i : e == a ? i + n : (e /= a / 2) < 1 ? n / 2 * Math.pow(2, 10 * (e - 1)) + i : n / 2 * (-Math.pow(2, -10 * --e) + 2) + i
        },
        easeInCirc: function(t, e, i, n, a) {
            return -n * (Math.sqrt(1 - (e /= a) * e) - 1) + i
        },
        easeOutCirc: function(t, e, i, n, a) {
            return n * Math.sqrt(1 - (e = e / a - 1) * e) + i
        },
        easeInOutCirc: function(t, e, i, n, a) {
            return (e /= a / 2) < 1 ? -n / 2 * (Math.sqrt(1 - e * e) - 1) + i : n / 2 * (Math.sqrt(1 - (e -= 2) * e) + 1) + i
        },
        easeInElastic: function(t, e, i, n, a) {
            var r = 1.70158,
                o = 0,
                s = n;
            if (0 == e) return i;
            if (1 == (e /= a)) return i + n;
            if (o || (o = .3 * a), s < Math.abs(n)) {
                s = n;
                var r = o / 4
            } else var r = o / (2 * Math.PI) * Math.asin(n / s);
            return -(s * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e * a - r) * Math.PI / o)) + i
        },
        easeOutElastic: function(t, e, i, n, a) {
            var r = 1.70158,
                o = 0,
                s = n;
            if (0 == e) return i;
            if (1 == (e /= a)) return i + n;
            if (o || (o = .3 * a), s < Math.abs(n)) {
                s = n;
                var r = o / 4
            } else var r = o / (2 * Math.PI) * Math.asin(n / s);
            return s * Math.pow(2, -10 * e) * Math.sin(2 * (e * a - r) * Math.PI / o) + n + i
        },
        easeInOutElastic: function(t, e, i, n, a) {
            var r = 1.70158,
                o = 0,
                s = n;
            if (0 == e) return i;
            if (2 == (e /= a / 2)) return i + n;
            if (o || (o = .3 * a * 1.5), s < Math.abs(n)) {
                s = n;
                var r = o / 4
            } else var r = o / (2 * Math.PI) * Math.asin(n / s);
            return 1 > e ? -.5 * s * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e * a - r) * Math.PI / o) + i : s * Math.pow(2, -10 * (e -= 1)) * Math.sin(2 * (e * a - r) * Math.PI / o) * .5 + n + i
        },
        easeInBack: function(t, e, i, n, a, r) {
            return void 0 == r && (r = 1.70158), n * (e /= a) * e * ((r + 1) * e - r) + i
        },
        easeOutBack: function(t, e, i, n, a, r) {
            return void 0 == r && (r = 1.70158), n * ((e = e / a - 1) * e * ((r + 1) * e + r) + 1) + i
        },
        easeInOutBack: function(t, e, i, n, a, r) {
            return void 0 == r && (r = 1.70158), (e /= a / 2) < 1 ? n / 2 * e * e * (((r *= 1.525) + 1) * e - r) + i : n / 2 * ((e -= 2) * e * (((r *= 1.525) + 1) * e + r) + 2) + i
        },
        easeInBounce: function(t, e, i, n, a) {
            return n - jQuery.easing.easeOutBounce(t, a - e, 0, n, a) + i
        },
        easeOutBounce: function(t, e, i, n, a) {
            return (e /= a) < 1 / 2.75 ? 7.5625 * n * e * e + i : 2 / 2.75 > e ? n * (7.5625 * (e -= 1.5 / 2.75) * e + .75) + i : 2.5 / 2.75 > e ? n * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) + i : n * (7.5625 * (e -= 2.625 / 2.75) * e + .984375) + i
        },
        easeInOutBounce: function(t, e, i, n, a) {
            return a / 2 > e ? .5 * jQuery.easing.easeInBounce(t, 2 * e, 0, n, a) + i : .5 * jQuery.easing.easeOutBounce(t, 2 * e - a, 0, n, a) + .5 * n + i
        }
    }), jQuery.extend(jQuery.easing, {
        easeInOutMaterial: function(t, e, i, n, a) {
            return (e /= a / 2) < 1 ? n / 2 * e * e + i : n / 4 * ((e -= 2) * e * e + 2) + i
        }
    }), ! function(t) {
        function e(t) {
            var e = t.length,
                n = i.type(t);
            return "function" === n || i.isWindow(t) ? !1 : 1 === t.nodeType && e ? !0 : "array" === n || 0 === e || "number" == typeof e && e > 0 && e - 1 in t
        }
        if (!t.jQuery) {
            var i = function(t, e) {
                return new i.fn.init(t, e)
            };
            i.isWindow = function(t) {
                return null != t && t == t.window
            }, i.type = function(t) {
                return null == t ? t + "" : "object" == typeof t || "function" == typeof t ? a[o.call(t)] || "object" : typeof t
            }, i.isArray = Array.isArray || function(t) {
                return "array" === i.type(t)
            }, i.isPlainObject = function(t) {
                var e;
                if (!t || "object" !== i.type(t) || t.nodeType || i.isWindow(t)) return !1;
                try {
                    if (t.constructor && !r.call(t, "constructor") && !r.call(t.constructor.prototype, "isPrototypeOf")) return !1
                } catch (n) {
                    return !1
                }
                for (e in t);
                return void 0 === e || r.call(t, e)
            }, i.each = function(t, i, n) {
                var a, r = 0,
                    o = t.length,
                    s = e(t);
                if (n) {
                    if (s)
                        for (; o > r && (a = i.apply(t[r], n), a !== !1); r++);
                    else
                        for (r in t)
                            if (a = i.apply(t[r], n), a === !1) break
                } else if (s)
                    for (; o > r && (a = i.call(t[r], r, t[r]), a !== !1); r++);
                else
                    for (r in t)
                        if (a = i.call(t[r], r, t[r]), a === !1) break;
                return t
            }, i.data = function(t, e, a) {
                if (void 0 === a) {
                    var r = t[i.expando],
                        o = r && n[r];
                    if (void 0 === e) return o;
                    if (o && e in o) return o[e]
                } else if (void 0 !== e) {
                    var r = t[i.expando] || (t[i.expando] = ++i.uuid);
                    return n[r] = n[r] || {}, n[r][e] = a, a
                }
            }, i.removeData = function(t, e) {
                var a = t[i.expando],
                    r = a && n[a];
                r && i.each(e, function(t, e) {
                    delete r[e]
                })
            }, i.extend = function() {
                var t, e, n, a, r, o, s = arguments[0] || {},
                    l = 1,
                    u = arguments.length,
                    c = !1;
                for ("boolean" == typeof s && (c = s, s = arguments[l] || {}, l++), "object" != typeof s && "function" !== i.type(s) && (s = {}), l === u && (s = this, l--); u > l; l++)
                    if (null != (r = arguments[l]))
                        for (a in r) t = s[a], n = r[a], s !== n && (c && n && (i.isPlainObject(n) || (e = i.isArray(n))) ? (e ? (e = !1, o = t && i.isArray(t) ? t : []) : o = t && i.isPlainObject(t) ? t : {}, s[a] = i.extend(c, o, n)) : void 0 !== n && (s[a] = n));
                return s
            }, i.queue = function(t, n, a) {
                function r(t, i) {
                    var n = i || [];
                    return null != t && (e(Object(t)) ? ! function(t, e) {
                        for (var i = +e.length, n = 0, a = t.length; i > n;) t[a++] = e[n++];
                        if (i !== i)
                            for (; void 0 !== e[n];) t[a++] = e[n++];
                        return t.length = a, t
                    }(n, "string" == typeof t ? [t] : t) : [].push.call(n, t)), n
                }
                if (t) {
                    n = (n || "fx") + "queue";
                    var o = i.data(t, n);
                    return a ? (!o || i.isArray(a) ? o = i.data(t, n, r(a)) : o.push(a), o) : o || []
                }
            }, i.dequeue = function(t, e) {
                i.each(t.nodeType ? [t] : t, function(t, n) {
                    e = e || "fx";
                    var a = i.queue(n, e),
                        r = a.shift();
                    "inprogress" === r && (r = a.shift()), r && ("fx" === e && a.unshift("inprogress"), r.call(n, function() {
                        i.dequeue(n, e)
                    }))
                })
            }, i.fn = i.prototype = {
                init: function(t) {
                    if (t.nodeType) return this[0] = t, this;
                    throw new Error("Not a DOM node.")
                },
                offset: function() {
                    var e = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : {
                        top: 0,
                        left: 0
                    };
                    return {
                        top: e.top + (t.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
                        left: e.left + (t.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
                    }
                },
                position: function() {
                    function t() {
                        for (var t = this.offsetParent || document; t && "html" === !t.nodeType.toLowerCase && "static" === t.style.position;) t = t.offsetParent;
                        return t || document
                    }
                    var e = this[0],
                        t = t.apply(e),
                        n = this.offset(),
                        a = /^(?:body|html)$/i.test(t.nodeName) ? {
                            top: 0,
                            left: 0
                        } : i(t).offset();
                    return n.top -= parseFloat(e.style.marginTop) || 0, n.left -= parseFloat(e.style.marginLeft) || 0, t.style && (a.top += parseFloat(t.style.borderTopWidth) || 0, a.left += parseFloat(t.style.borderLeftWidth) || 0), {
                        top: n.top - a.top,
                        left: n.left - a.left
                    }
                }
            };
            var n = {};
            i.expando = "velocity" + (new Date).getTime(), i.uuid = 0;
            for (var a = {}, r = a.hasOwnProperty, o = a.toString, s = "Boolean Number String Function Array Date RegExp Object Error".split(" "), l = 0; l < s.length; l++) a["[object " + s[l] + "]"] = s[l].toLowerCase();
            i.fn.init.prototype = i.fn, t.Velocity = {
                Utilities: i
            }
        }
    }(window),
    function(t) {
        "object" == typeof module && "object" == typeof module.exports ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : t()
    }(function() {
        return function(t, e, i, n) {
            function a(t) {
                for (var e = -1, i = t ? t.length : 0, n = []; ++e < i;) {
                    var a = t[e];
                    a && n.push(a)
                }
                return n
            }

            function r(t) {
                return v.isWrapped(t) ? t = [].slice.call(t) : v.isNode(t) && (t = [t]), t
            }

            function o(t) {
                var e = p.data(t, "velocity");
                return null === e ? n : e
            }

            function s(t) {
                return function(e) {
                    return Math.round(e * t) * (1 / t)
                }
            }

            function l(t, i, n, a) {
                function r(t, e) {
                    return 1 - 3 * e + 3 * t
                }

                function o(t, e) {
                    return 3 * e - 6 * t
                }

                function s(t) {
                    return 3 * t
                }

                function l(t, e, i) {
                    return ((r(e, i) * t + o(e, i)) * t + s(e)) * t
                }

                function u(t, e, i) {
                    return 3 * r(e, i) * t * t + 2 * o(e, i) * t + s(e)
                }

                function c(e, i) {
                    for (var a = 0; v > a; ++a) {
                        var r = u(i, t, n);
                        if (0 === r) return i;
                        var o = l(i, t, n) - e;
                        i -= o / r
                    }
                    return i
                }

                function d() {
                    for (var e = 0; b > e; ++e) k[e] = l(e * w, t, n)
                }

                function p(e, i, a) {
                    var r, o, s = 0;
                    do o = i + (a - i) / 2, r = l(o, t, n) - e, r > 0 ? a = o : i = o; while (Math.abs(r) > m && ++s < y);
                    return o
                }

                function f(e) {
                    for (var i = 0, a = 1, r = b - 1; a != r && k[a] <= e; ++a) i += w;
                    --a;
                    var o = (e - k[a]) / (k[a + 1] - k[a]),
                        s = i + o * w,
                        l = u(s, t, n);
                    return l >= g ? c(e, s) : 0 == l ? s : p(e, i, i + w)
                }

                function h() {
                    S = !0, (t != i || n != a) && d()
                }
                var v = 4,
                    g = .001,
                    m = 1e-7,
                    y = 10,
                    b = 11,
                    w = 1 / (b - 1),
                    x = "Float32Array" in e;
                if (4 !== arguments.length) return !1;
                for (var C = 0; 4 > C; ++C)
                    if ("number" != typeof arguments[C] || isNaN(arguments[C]) || !isFinite(arguments[C])) return !1;
                t = Math.min(t, 1), n = Math.min(n, 1), t = Math.max(t, 0), n = Math.max(n, 0);
                var k = x ? new Float32Array(b) : new Array(b),
                    S = !1,
                    T = function(e) {
                        return S || h(), t === i && n === a ? e : 0 === e ? 0 : 1 === e ? 1 : l(f(e), i, a)
                    };
                T.getControlPoints = function() {
                    return [{
                        x: t,
                        y: i
                    }, {
                        x: n,
                        y: a
                    }]
                };
                var O = "generateBezier(" + [t, i, n, a] + ")";
                return T.toString = function() {
                    return O
                }, T
            }

            function u(t, e) {
                var i = t;
                return v.isString(t) ? b.Easings[t] || (i = !1) : i = v.isArray(t) && 1 === t.length ? s.apply(null, t) : v.isArray(t) && 2 === t.length ? w.apply(null, t.concat([e])) : v.isArray(t) && 4 === t.length ? l.apply(null, t) : !1, i === !1 && (i = b.Easings[b.defaults.easing] ? b.defaults.easing : y), i
            }

            function c(t) {
                if (t) {
                    var e = (new Date).getTime(),
                        i = b.State.calls.length;
                    i > 1e4 && (b.State.calls = a(b.State.calls));
                    for (var r = 0; i > r; r++)
                        if (b.State.calls[r]) {
                            var s = b.State.calls[r],
                                l = s[0],
                                u = s[2],
                                f = s[3],
                                h = !!f,
                                g = null;
                            f || (f = b.State.calls[r][3] = e - 16);
                            for (var m = Math.min((e - f) / u.duration, 1), y = 0, w = l.length; w > y; y++) {
                                var C = l[y],
                                    S = C.element;
                                if (o(S)) {
                                    var T = !1;
                                    if (u.display !== n && null !== u.display && "none" !== u.display) {
                                        if ("flex" === u.display) {
                                            var O = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];
                                            p.each(O, function(t, e) {
                                                x.setPropertyValue(S, "display", e)
                                            })
                                        }
                                        x.setPropertyValue(S, "display", u.display)
                                    }
                                    u.visibility !== n && "hidden" !== u.visibility && x.setPropertyValue(S, "visibility", u.visibility);
                                    for (var P in C)
                                        if ("element" !== P) {
                                            var A, E = C[P],
                                                q = v.isString(E.easing) ? b.Easings[E.easing] : E.easing;
                                            if (1 === m) A = E.endValue;
                                            else {
                                                var M = E.endValue - E.startValue;
                                                if (A = E.startValue + M * q(m, u, M), !h && A === E.currentValue) continue
                                            }
                                            if (E.currentValue = A, "tween" === P) g = A;
                                            else {
                                                if (x.Hooks.registered[P]) {
                                                    var I = x.Hooks.getRoot(P),
                                                        _ = o(S).rootPropertyValueCache[I];
                                                    _ && (E.rootPropertyValue = _)
                                                }
                                                var V = x.setPropertyValue(S, P, E.currentValue + (0 === parseFloat(A) ? "" : E.unitType), E.rootPropertyValue, E.scrollData);
                                                x.Hooks.registered[P] && (o(S).rootPropertyValueCache[I] = x.Normalizations.registered[I] ? x.Normalizations.registered[I]("extract", null, V[1]) : V[1]), "transform" === V[0] && (T = !0)
                                            }
                                        }
                                    u.mobileHA && o(S).transformCache.translate3d === n && (o(S).transformCache.translate3d = "(0px, 0px, 0px)", T = !0), T && x.flushTransformCache(S)
                                }
                            }
                            u.display !== n && "none" !== u.display && (b.State.calls[r][2].display = !1), u.visibility !== n && "hidden" !== u.visibility && (b.State.calls[r][2].visibility = !1), u.progress && u.progress.call(s[1], s[1], m, Math.max(0, f + u.duration - e), f, g), 1 === m && d(r)
                        }
                }
                b.State.isTicking && k(c)
            }

            function d(t, e) {
                if (!b.State.calls[t]) return !1;
                for (var i = b.State.calls[t][0], a = b.State.calls[t][1], r = b.State.calls[t][2], s = b.State.calls[t][4], l = !1, u = 0, c = i.length; c > u; u++) {
                    var d = i[u].element;
                    if (e || r.loop || ("none" === r.display && x.setPropertyValue(d, "display", r.display), "hidden" === r.visibility && x.setPropertyValue(d, "visibility", r.visibility)), r.loop !== !0 && (p.queue(d)[1] === n || !/\.velocityQueueEntryFlag/i.test(p.queue(d)[1])) && o(d)) {
                        o(d).isAnimating = !1, o(d).rootPropertyValueCache = {};
                        var f = !1;
                        p.each(x.Lists.transforms3D, function(t, e) {
                            var i = /^scale/.test(e) ? 1 : 0,
                                a = o(d).transformCache[e];
                            o(d).transformCache[e] !== n && new RegExp("^\\(" + i + "[^.]").test(a) && (f = !0, delete o(d).transformCache[e])
                        }), r.mobileHA && (f = !0, delete o(d).transformCache.translate3d), f && x.flushTransformCache(d), x.Values.removeClass(d, "velocity-animating")
                    }
                    if (!e && r.complete && !r.loop && u === c - 1) try {
                        r.complete.call(a, a)
                    } catch (h) {
                        setTimeout(function() {
                            throw h
                        }, 1)
                    }
                    s && r.loop !== !0 && s(a), o(d) && r.loop === !0 && !e && (p.each(o(d).tweensContainer, function(t, e) {
                        /^rotate/.test(t) && 360 === parseFloat(e.endValue) && (e.endValue = 0, e.startValue = 360), /^backgroundPosition/.test(t) && 100 === parseFloat(e.endValue) && "%" === e.unitType && (e.endValue = 0, e.startValue = 100)
                    }), b(d, "reverse", {
                        loop: !0,
                        delay: r.delay
                    })), r.queue !== !1 && p.dequeue(d, r.queue)
                }
                b.State.calls[t] = !1;
                for (var v = 0, g = b.State.calls.length; g > v; v++)
                    if (b.State.calls[v] !== !1) {
                        l = !0;
                        break
                    }
                l === !1 && (b.State.isTicking = !1, delete b.State.calls, b.State.calls = [])
            }
            var p, f = function() {
                    if (i.documentMode) return i.documentMode;
                    for (var t = 7; t > 4; t--) {
                        var e = i.createElement("div");
                        if (e.innerHTML = "<!--[if IE " + t + "]><span></span><![endif]-->", e.getElementsByTagName("span").length) return e = null, t
                    }
                    return n
                }(),
                h = function() {
                    var t = 0;
                    return e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || function(e) {
                        var i, n = (new Date).getTime();
                        return i = Math.max(0, 16 - (n - t)), t = n + i, setTimeout(function() {
                            e(n + i)
                        }, i)
                    }
                }(),
                v = {
                    isString: function(t) {
                        return "string" == typeof t
                    },
                    isArray: Array.isArray || function(t) {
                        return "[object Array]" === Object.prototype.toString.call(t)
                    },
                    isFunction: function(t) {
                        return "[object Function]" === Object.prototype.toString.call(t)
                    },
                    isNode: function(t) {
                        return t && t.nodeType
                    },
                    isNodeList: function(t) {
                        return "object" == typeof t && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(t)) && t.length !== n && (0 === t.length || "object" == typeof t[0] && t[0].nodeType > 0)
                    },
                    isWrapped: function(t) {
                        return t && (t.jquery || e.Zepto && e.Zepto.zepto.isZ(t))
                    },
                    isSVG: function(t) {
                        return e.SVGElement && t instanceof e.SVGElement
                    },
                    isEmptyObject: function(t) {
                        for (var e in t) return !1;
                        return !0
                    }
                },
                g = !1;
            if (t.fn && t.fn.jquery ? (p = t, g = !0) : p = e.Velocity.Utilities, 8 >= f && !g) throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
            if (7 >= f) return void(jQuery.fn.velocity = jQuery.fn.animate);
            var m = 400,
                y = "swing",
                b = {
                    State: {
                        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                        isAndroid: /Android/i.test(navigator.userAgent),
                        isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
                        isChrome: e.chrome,
                        isFirefox: /Firefox/i.test(navigator.userAgent),
                        prefixElement: i.createElement("div"),
                        prefixMatches: {},
                        scrollAnchor: null,
                        scrollPropertyLeft: null,
                        scrollPropertyTop: null,
                        isTicking: !1,
                        calls: []
                    },
                    CSS: {},
                    Utilities: p,
                    Redirects: {},
                    Easings: {},
                    Promise: e.Promise,
                    defaults: {
                        queue: "",
                        duration: m,
                        easing: y,
                        begin: n,
                        complete: n,
                        progress: n,
                        display: n,
                        visibility: n,
                        loop: !1,
                        delay: !1,
                        mobileHA: !0,
                        _cacheValues: !0
                    },
                    init: function(t) {
                        p.data(t, "velocity", {
                            isSVG: v.isSVG(t),
                            isAnimating: !1,
                            computedStyle: null,
                            tweensContainer: null,
                            rootPropertyValueCache: {},
                            transformCache: {}
                        })
                    },
                    hook: null,
                    mock: !1,
                    version: {
                        major: 1,
                        minor: 2,
                        patch: 2
                    },
                    debug: !1
                };
            e.pageYOffset !== n ? (b.State.scrollAnchor = e, b.State.scrollPropertyLeft = "pageXOffset", b.State.scrollPropertyTop = "pageYOffset") : (b.State.scrollAnchor = i.documentElement || i.body.parentNode || i.body, b.State.scrollPropertyLeft = "scrollLeft", b.State.scrollPropertyTop = "scrollTop");
            var w = function() {
                function t(t) {
                    return -t.tension * t.x - t.friction * t.v
                }

                function e(e, i, n) {
                    var a = {
                        x: e.x + n.dx * i,
                        v: e.v + n.dv * i,
                        tension: e.tension,
                        friction: e.friction
                    };
                    return {
                        dx: a.v,
                        dv: t(a)
                    }
                }

                function i(i, n) {
                    var a = {
                            dx: i.v,
                            dv: t(i)
                        },
                        r = e(i, .5 * n, a),
                        o = e(i, .5 * n, r),
                        s = e(i, n, o),
                        l = 1 / 6 * (a.dx + 2 * (r.dx + o.dx) + s.dx),
                        u = 1 / 6 * (a.dv + 2 * (r.dv + o.dv) + s.dv);
                    return i.x = i.x + l * n, i.v = i.v + u * n, i
                }
                return function n(t, e, a) {
                    var r, o, s, l = {
                            x: -1,
                            v: 0,
                            tension: null,
                            friction: null
                        },
                        u = [0],
                        c = 0,
                        d = 1e-4,
                        p = .016;
                    for (t = parseFloat(t) || 500, e = parseFloat(e) || 20, a = a || null, l.tension = t, l.friction = e, r = null !== a, r ? (c = n(t, e), o = c / a * p) : o = p; s = i(s || l, o), u.push(1 + s.x), c += 16, Math.abs(s.x) > d && Math.abs(s.v) > d;);
                    return r ? function(t) {
                        return u[t * (u.length - 1) | 0]
                    } : c
                }
            }();
            b.Easings = {
                linear: function(t) {
                    return t
                },
                swing: function(t) {
                    return .5 - Math.cos(t * Math.PI) / 2
                },
                spring: function(t) {
                    return 1 - Math.cos(4.5 * t * Math.PI) * Math.exp(6 * -t)
                }
            }, p.each([
                ["ease", [.25, .1, .25, 1]],
                ["ease-in", [.42, 0, 1, 1]],
                ["ease-out", [0, 0, .58, 1]],
                ["ease-in-out", [.42, 0, .58, 1]],
                ["easeInSine", [.47, 0, .745, .715]],
                ["easeOutSine", [.39, .575, .565, 1]],
                ["easeInOutSine", [.445, .05, .55, .95]],
                ["easeInQuad", [.55, .085, .68, .53]],
                ["easeOutQuad", [.25, .46, .45, .94]],
                ["easeInOutQuad", [.455, .03, .515, .955]],
                ["easeInCubic", [.55, .055, .675, .19]],
                ["easeOutCubic", [.215, .61, .355, 1]],
                ["easeInOutCubic", [.645, .045, .355, 1]],
                ["easeInQuart", [.895, .03, .685, .22]],
                ["easeOutQuart", [.165, .84, .44, 1]],
                ["easeInOutQuart", [.77, 0, .175, 1]],
                ["easeInQuint", [.755, .05, .855, .06]],
                ["easeOutQuint", [.23, 1, .32, 1]],
                ["easeInOutQuint", [.86, 0, .07, 1]],
                ["easeInExpo", [.95, .05, .795, .035]],
                ["easeOutExpo", [.19, 1, .22, 1]],
                ["easeInOutExpo", [1, 0, 0, 1]],
                ["easeInCirc", [.6, .04, .98, .335]],
                ["easeOutCirc", [.075, .82, .165, 1]],
                ["easeInOutCirc", [.785, .135, .15, .86]]
            ], function(t, e) {
                b.Easings[e[0]] = l.apply(null, e[1])
            });
            var x = b.CSS = {
                RegEx: {
                    isHex: /^#([A-f\d]{3}){1,2}$/i,
                    valueUnwrap: /^[A-z]+\((.*)\)$/i,
                    wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
                    valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi
                },
                Lists: {
                    colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"],
                    transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"],
                    transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"]
                },
                Hooks: {
                    templates: {
                        textShadow: ["Color X Y Blur", "black 0px 0px 0px"],
                        boxShadow: ["Color X Y Blur Spread", "black 0px 0px 0px 0px"],
                        clip: ["Top Right Bottom Left", "0px 0px 0px 0px"],
                        backgroundPosition: ["X Y", "0% 0%"],
                        transformOrigin: ["X Y Z", "50% 50% 0px"],
                        perspectiveOrigin: ["X Y", "50% 50%"]
                    },
                    registered: {},
                    register: function() {
                        for (var t = 0; t < x.Lists.colors.length; t++) {
                            var e = "color" === x.Lists.colors[t] ? "0 0 0 1" : "255 255 255 1";
                            x.Hooks.templates[x.Lists.colors[t]] = ["Red Green Blue Alpha", e]
                        }
                        var i, n, a;
                        if (f)
                            for (i in x.Hooks.templates) {
                                n = x.Hooks.templates[i], a = n[0].split(" ");
                                var r = n[1].match(x.RegEx.valueSplit);
                                "Color" === a[0] && (a.push(a.shift()), r.push(r.shift()), x.Hooks.templates[i] = [a.join(" "), r.join(" ")])
                            }
                        for (i in x.Hooks.templates) {
                            n = x.Hooks.templates[i], a = n[0].split(" ");
                            for (var t in a) {
                                var o = i + a[t],
                                    s = t;
                                x.Hooks.registered[o] = [i, s]
                            }
                        }
                    },
                    getRoot: function(t) {
                        var e = x.Hooks.registered[t];
                        return e ? e[0] : t
                    },
                    cleanRootPropertyValue: function(t, e) {
                        return x.RegEx.valueUnwrap.test(e) && (e = e.match(x.RegEx.valueUnwrap)[1]), x.Values.isCSSNullValue(e) && (e = x.Hooks.templates[t][1]), e
                    },
                    extractValue: function(t, e) {
                        var i = x.Hooks.registered[t];
                        if (i) {
                            var n = i[0],
                                a = i[1];
                            return e = x.Hooks.cleanRootPropertyValue(n, e), e.toString().match(x.RegEx.valueSplit)[a]
                        }
                        return e
                    },
                    injectValue: function(t, e, i) {
                        var n = x.Hooks.registered[t];
                        if (n) {
                            var a, r, o = n[0],
                                s = n[1];
                            return i = x.Hooks.cleanRootPropertyValue(o, i), a = i.toString().match(x.RegEx.valueSplit), a[s] = e, r = a.join(" ")
                        }
                        return i
                    }
                },
                Normalizations: {
                    registered: {
                        clip: function(t, e, i) {
                            switch (t) {
                                case "name":
                                    return "clip";
                                case "extract":
                                    var n;
                                    return x.RegEx.wrappedValueAlreadyExtracted.test(i) ? n = i : (n = i.toString().match(x.RegEx.valueUnwrap), n = n ? n[1].replace(/,(\s+)?/g, " ") : i), n;
                                case "inject":
                                    return "rect(" + i + ")"
                            }
                        },
                        blur: function(t, e, i) {
                            switch (t) {
                                case "name":
                                    return b.State.isFirefox ? "filter" : "-webkit-filter";
                                case "extract":
                                    var n = parseFloat(i);
                                    if (!n && 0 !== n) {
                                        var a = i.toString().match(/blur\(([0-9]+[A-z]+)\)/i);
                                        n = a ? a[1] : 0
                                    }
                                    return n;
                                case "inject":
                                    return parseFloat(i) ? "blur(" + i + ")" : "none"
                            }
                        },
                        opacity: function(t, e, i) {
                            if (8 >= f) switch (t) {
                                case "name":
                                    return "filter";
                                case "extract":
                                    var n = i.toString().match(/alpha\(opacity=(.*)\)/i);
                                    return i = n ? n[1] / 100 : 1;
                                case "inject":
                                    return e.style.zoom = 1, parseFloat(i) >= 1 ? "" : "alpha(opacity=" + parseInt(100 * parseFloat(i), 10) + ")"
                            } else switch (t) {
                                case "name":
                                    return "opacity";
                                case "extract":
                                    return i;
                                case "inject":
                                    return i
                            }
                        }
                    },
                    register: function() {
                        9 >= f || b.State.isGingerbread || (x.Lists.transformsBase = x.Lists.transformsBase.concat(x.Lists.transforms3D));
                        for (var t = 0; t < x.Lists.transformsBase.length; t++) ! function() {
                            var e = x.Lists.transformsBase[t];
                            x.Normalizations.registered[e] = function(t, i, a) {
                                switch (t) {
                                    case "name":
                                        return "transform";
                                    case "extract":
                                        return o(i) === n || o(i).transformCache[e] === n ? /^scale/i.test(e) ? 1 : 0 : o(i).transformCache[e].replace(/[()]/g, "");
                                    case "inject":
                                        var r = !1;
                                        switch (e.substr(0, e.length - 1)) {
                                            case "translate":
                                                r = !/(%|px|em|rem|vw|vh|\d)$/i.test(a);
                                                break;
                                            case "scal":
                                            case "scale":
                                                b.State.isAndroid && o(i).transformCache[e] === n && 1 > a && (a = 1), r = !/(\d)$/i.test(a);
                                                break;
                                            case "skew":
                                                r = !/(deg|\d)$/i.test(a);
                                                break;
                                            case "rotate":
                                                r = !/(deg|\d)$/i.test(a)
                                        }
                                        return r || (o(i).transformCache[e] = "(" + a + ")"), o(i).transformCache[e]
                                }
                            }
                        }();
                        for (var t = 0; t < x.Lists.colors.length; t++) ! function() {
                            var e = x.Lists.colors[t];
                            x.Normalizations.registered[e] = function(t, i, a) {
                                switch (t) {
                                    case "name":
                                        return e;
                                    case "extract":
                                        var r;
                                        if (x.RegEx.wrappedValueAlreadyExtracted.test(a)) r = a;
                                        else {
                                            var o, s = {
                                                black: "rgb(0, 0, 0)",
                                                blue: "rgb(0, 0, 255)",
                                                gray: "rgb(128, 128, 128)",
                                                green: "rgb(0, 128, 0)",
                                                red: "rgb(255, 0, 0)",
                                                white: "rgb(255, 255, 255)"
                                            };
                                            /^[A-z]+$/i.test(a) ? o = s[a] !== n ? s[a] : s.black : x.RegEx.isHex.test(a) ? o = "rgb(" + x.Values.hexToRgb(a).join(" ") + ")" : /^rgba?\(/i.test(a) || (o = s.black), r = (o || a).toString().match(x.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ")
                                        }
                                        return 8 >= f || 3 !== r.split(" ").length || (r += " 1"), r;
                                    case "inject":
                                        return 8 >= f ? 4 === a.split(" ").length && (a = a.split(/\s+/).slice(0, 3).join(" ")) : 3 === a.split(" ").length && (a += " 1"), (8 >= f ? "rgb" : "rgba") + "(" + a.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")"
                                }
                            }
                        }()
                    }
                },
                Names: {
                    camelCase: function(t) {
                        return t.replace(/-(\w)/g, function(t, e) {
                            return e.toUpperCase()
                        })
                    },
                    SVGAttribute: function(t) {
                        var e = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";
                        return (f || b.State.isAndroid && !b.State.isChrome) && (e += "|transform"), new RegExp("^(" + e + ")$", "i").test(t)
                    },
                    prefixCheck: function(t) {
                        if (b.State.prefixMatches[t]) return [b.State.prefixMatches[t], !0];
                        for (var e = ["", "Webkit", "Moz", "ms", "O"], i = 0, n = e.length; n > i; i++) {
                            var a;
                            if (a = 0 === i ? t : e[i] + t.replace(/^\w/, function(t) {
                                    return t.toUpperCase()
                                }), v.isString(b.State.prefixElement.style[a])) return b.State.prefixMatches[t] = a, [a, !0]
                        }
                        return [t, !1]
                    }
                },
                Values: {
                    hexToRgb: function(t) {
                        var e, i = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                            n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
                        return t = t.replace(i, function(t, e, i, n) {
                            return e + e + i + i + n + n
                        }), e = n.exec(t), e ? [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)] : [0, 0, 0]
                    },
                    isCSSNullValue: function(t) {
                        return 0 == t || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(t)
                    },
                    getUnitType: function(t) {
                        return /^(rotate|skew)/i.test(t) ? "deg" : /(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(t) ? "" : "px"
                    },
                    getDisplayType: function(t) {
                        var e = t && t.tagName.toString().toLowerCase();
                        return /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(e) ? "inline" : /^(li)$/i.test(e) ? "list-item" : /^(tr)$/i.test(e) ? "table-row" : /^(table)$/i.test(e) ? "table" : /^(tbody)$/i.test(e) ? "table-row-group" : "block"
                    },
                    addClass: function(t, e) {
                        t.classList ? t.classList.add(e) : t.className += (t.className.length ? " " : "") + e
                    },
                    removeClass: function(t, e) {
                        t.classList ? t.classList.remove(e) : t.className = t.className.toString().replace(new RegExp("(^|\\s)" + e.split(" ").join("|") + "(\\s|$)", "gi"), " ")
                    }
                },
                getPropertyValue: function(t, i, a, r) {
                    function s(t, i) {
                        function a() {
                            u && x.setPropertyValue(t, "display", "none")
                        }
                        var l = 0;
                        if (8 >= f) l = p.css(t, i);
                        else {
                            var u = !1;
                            if (/^(width|height)$/.test(i) && 0 === x.getPropertyValue(t, "display") && (u = !0, x.setPropertyValue(t, "display", x.Values.getDisplayType(t))), !r) {
                                if ("height" === i && "border-box" !== x.getPropertyValue(t, "boxSizing").toString().toLowerCase()) {
                                    var c = t.offsetHeight - (parseFloat(x.getPropertyValue(t, "borderTopWidth")) || 0) - (parseFloat(x.getPropertyValue(t, "borderBottomWidth")) || 0) - (parseFloat(x.getPropertyValue(t, "paddingTop")) || 0) - (parseFloat(x.getPropertyValue(t, "paddingBottom")) || 0);
                                    return a(), c
                                }
                                if ("width" === i && "border-box" !== x.getPropertyValue(t, "boxSizing").toString().toLowerCase()) {
                                    var d = t.offsetWidth - (parseFloat(x.getPropertyValue(t, "borderLeftWidth")) || 0) - (parseFloat(x.getPropertyValue(t, "borderRightWidth")) || 0) - (parseFloat(x.getPropertyValue(t, "paddingLeft")) || 0) - (parseFloat(x.getPropertyValue(t, "paddingRight")) || 0);
                                    return a(), d
                                }
                            }
                            var h;
                            h = o(t) === n ? e.getComputedStyle(t, null) : o(t).computedStyle ? o(t).computedStyle : o(t).computedStyle = e.getComputedStyle(t, null), "borderColor" === i && (i = "borderTopColor"), l = 9 === f && "filter" === i ? h.getPropertyValue(i) : h[i], ("" === l || null === l) && (l = t.style[i]), a()
                        }
                        if ("auto" === l && /^(top|right|bottom|left)$/i.test(i)) {
                            var v = s(t, "position");
                            ("fixed" === v || "absolute" === v && /top|left/i.test(i)) && (l = p(t).position()[i] + "px")
                        }
                        return l
                    }
                    var l;
                    if (x.Hooks.registered[i]) {
                        var u = i,
                            c = x.Hooks.getRoot(u);
                        a === n && (a = x.getPropertyValue(t, x.Names.prefixCheck(c)[0])), x.Normalizations.registered[c] && (a = x.Normalizations.registered[c]("extract", t, a)), l = x.Hooks.extractValue(u, a)
                    } else if (x.Normalizations.registered[i]) {
                        var d, h;
                        d = x.Normalizations.registered[i]("name", t), "transform" !== d && (h = s(t, x.Names.prefixCheck(d)[0]), x.Values.isCSSNullValue(h) && x.Hooks.templates[i] && (h = x.Hooks.templates[i][1])), l = x.Normalizations.registered[i]("extract", t, h)
                    }
                    if (!/^[\d-]/.test(l))
                        if (o(t) && o(t).isSVG && x.Names.SVGAttribute(i))
                            if (/^(height|width)$/i.test(i)) try {
                                l = t.getBBox()[i]
                            } catch (v) {
                                l = 0
                            } else l = t.getAttribute(i);
                            else l = s(t, x.Names.prefixCheck(i)[0]);
                    return x.Values.isCSSNullValue(l) && (l = 0), b.debug >= 2 && console.log("Get " + i + ": " + l), l
                },
                setPropertyValue: function(t, i, n, a, r) {
                    var s = i;
                    if ("scroll" === i) r.container ? r.container["scroll" + r.direction] = n : "Left" === r.direction ? e.scrollTo(n, r.alternateValue) : e.scrollTo(r.alternateValue, n);
                    else if (x.Normalizations.registered[i] && "transform" === x.Normalizations.registered[i]("name", t)) x.Normalizations.registered[i]("inject", t, n), s = "transform", n = o(t).transformCache[i];
                    else {
                        if (x.Hooks.registered[i]) {
                            var l = i,
                                u = x.Hooks.getRoot(i);
                            a = a || x.getPropertyValue(t, u), n = x.Hooks.injectValue(l, n, a), i = u
                        }
                        if (x.Normalizations.registered[i] && (n = x.Normalizations.registered[i]("inject", t, n), i = x.Normalizations.registered[i]("name", t)), s = x.Names.prefixCheck(i)[0], 8 >= f) try {
                            t.style[s] = n
                        } catch (c) {
                            b.debug && console.log("Browser does not support [" + n + "] for [" + s + "]")
                        } else o(t) && o(t).isSVG && x.Names.SVGAttribute(i) ? t.setAttribute(i, n) : t.style[s] = n;
                        b.debug >= 2 && console.log("Set " + i + " (" + s + "): " + n)
                    }
                    return [s, n]
                },
                flushTransformCache: function(t) {
                    function e(e) {
                        return parseFloat(x.getPropertyValue(t, e))
                    }
                    var i = "";
                    if ((f || b.State.isAndroid && !b.State.isChrome) && o(t).isSVG) {
                        var n = {
                            translate: [e("translateX"), e("translateY")],
                            skewX: [e("skewX")],
                            skewY: [e("skewY")],
                            scale: 1 !== e("scale") ? [e("scale"), e("scale")] : [e("scaleX"), e("scaleY")],
                            rotate: [e("rotateZ"), 0, 0]
                        };
                        p.each(o(t).transformCache, function(t) {
                            /^translate/i.test(t) ? t = "translate" : /^scale/i.test(t) ? t = "scale" : /^rotate/i.test(t) && (t = "rotate"), n[t] && (i += t + "(" + n[t].join(" ") + ") ", delete n[t])
                        })
                    } else {
                        var a, r;
                        p.each(o(t).transformCache, function(e) {
                            return a = o(t).transformCache[e], "transformPerspective" === e ? (r = a, !0) : (9 === f && "rotateZ" === e && (e = "rotate"), void(i += e + a + " "))
                        }), r && (i = "perspective" + r + " " + i)
                    }
                    x.setPropertyValue(t, "transform", i)
                }
            };
            x.Hooks.register(), x.Normalizations.register(), b.hook = function(t, e, i) {
                var a = n;
                return t = r(t), p.each(t, function(t, r) {
                    if (o(r) === n && b.init(r), i === n) a === n && (a = b.CSS.getPropertyValue(r, e));
                    else {
                        var s = b.CSS.setPropertyValue(r, e, i);
                        "transform" === s[0] && b.CSS.flushTransformCache(r), a = s
                    }
                }), a
            };
            var C = function() {
                function t() {
                    return s ? P.promise || null : l
                }

                function a() {
                    function t() {
                        function t(t, e) {
                            var i = n,
                                a = n,
                                o = n;
                            return v.isArray(t) ? (i = t[0], !v.isArray(t[1]) && /^[\d-]/.test(t[1]) || v.isFunction(t[1]) || x.RegEx.isHex.test(t[1]) ? o = t[1] : (v.isString(t[1]) && !x.RegEx.isHex.test(t[1]) || v.isArray(t[1])) && (a = e ? t[1] : u(t[1], s.duration), t[2] !== n && (o = t[2]))) : i = t, e || (a = a || s.easing), v.isFunction(i) && (i = i.call(r, S, k)), v.isFunction(o) && (o = o.call(r, S, k)), [i || 0, a, o]
                        }

                        function d(t, e) {
                            var i, n;
                            return n = (e || "0").toString().toLowerCase().replace(/[%A-z]+$/, function(t) {
                                return i = t, ""
                            }), i || (i = x.Values.getUnitType(t)), [n, i]
                        }

                        function f() {
                            var t = {
                                    myParent: r.parentNode || i.body,
                                    position: x.getPropertyValue(r, "position"),
                                    fontSize: x.getPropertyValue(r, "fontSize")
                                },
                                n = t.position === V.lastPosition && t.myParent === V.lastParent,
                                a = t.fontSize === V.lastFontSize;
                            V.lastParent = t.myParent, V.lastPosition = t.position, V.lastFontSize = t.fontSize;
                            var s = 100,
                                l = {};
                            if (a && n) l.emToPx = V.lastEmToPx, l.percentToPxWidth = V.lastPercentToPxWidth, l.percentToPxHeight = V.lastPercentToPxHeight;
                            else {
                                var u = o(r).isSVG ? i.createElementNS("http://www.w3.org/2000/svg", "rect") : i.createElement("div");
                                b.init(u), t.myParent.appendChild(u), p.each(["overflow", "overflowX", "overflowY"], function(t, e) {
                                    b.CSS.setPropertyValue(u, e, "hidden")
                                }), b.CSS.setPropertyValue(u, "position", t.position), b.CSS.setPropertyValue(u, "fontSize", t.fontSize), b.CSS.setPropertyValue(u, "boxSizing", "content-box"), p.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], function(t, e) {
                                    b.CSS.setPropertyValue(u, e, s + "%")
                                }), b.CSS.setPropertyValue(u, "paddingLeft", s + "em"), l.percentToPxWidth = V.lastPercentToPxWidth = (parseFloat(x.getPropertyValue(u, "width", null, !0)) || 1) / s, l.percentToPxHeight = V.lastPercentToPxHeight = (parseFloat(x.getPropertyValue(u, "height", null, !0)) || 1) / s, l.emToPx = V.lastEmToPx = (parseFloat(x.getPropertyValue(u, "paddingLeft")) || 1) / s, t.myParent.removeChild(u)
                            }
                            return null === V.remToPx && (V.remToPx = parseFloat(x.getPropertyValue(i.body, "fontSize")) || 16), null === V.vwToPx && (V.vwToPx = parseFloat(e.innerWidth) / 100, V.vhToPx = parseFloat(e.innerHeight) / 100), l.remToPx = V.remToPx, l.vwToPx = V.vwToPx, l.vhToPx = V.vhToPx, b.debug >= 1 && console.log("Unit ratios: " + JSON.stringify(l), r), l
                        }
                        if (s.begin && 0 === S) try {
                            s.begin.call(h, h)
                        } catch (m) {
                            setTimeout(function() {
                                throw m
                            }, 1)
                        }
                        if ("scroll" === A) {
                            var w, C, T, O = /^x$/i.test(s.axis) ? "Left" : "Top",
                                E = parseFloat(s.offset) || 0;
                            s.container ? v.isWrapped(s.container) || v.isNode(s.container) ? (s.container = s.container[0] || s.container, w = s.container["scroll" + O], T = w + p(r).position()[O.toLowerCase()] + E) : s.container = null : (w = b.State.scrollAnchor[b.State["scrollProperty" + O]], C = b.State.scrollAnchor[b.State["scrollProperty" + ("Left" === O ? "Top" : "Left")]], T = p(r).offset()[O.toLowerCase()] + E), l = {
                                scroll: {
                                    rootPropertyValue: !1,
                                    startValue: w,
                                    currentValue: w,
                                    endValue: T,
                                    unitType: "",
                                    easing: s.easing,
                                    scrollData: {
                                        container: s.container,
                                        direction: O,
                                        alternateValue: C
                                    }
                                },
                                element: r
                            }, b.debug && console.log("tweensContainer (scroll): ", l.scroll, r)
                        } else if ("reverse" === A) {
                            if (!o(r).tweensContainer) return void p.dequeue(r, s.queue);
                            "none" === o(r).opts.display && (o(r).opts.display = "auto"), "hidden" === o(r).opts.visibility && (o(r).opts.visibility = "visible"), o(r).opts.loop = !1, o(r).opts.begin = null, o(r).opts.complete = null, y.easing || delete s.easing, y.duration || delete s.duration, s = p.extend({}, o(r).opts, s);
                            var q = p.extend(!0, {}, o(r).tweensContainer);
                            for (var M in q)
                                if ("element" !== M) {
                                    var I = q[M].startValue;
                                    q[M].startValue = q[M].currentValue = q[M].endValue, q[M].endValue = I, v.isEmptyObject(y) || (q[M].easing = s.easing), b.debug && console.log("reverse tweensContainer (" + M + "): " + JSON.stringify(q[M]), r)
                                }
                            l = q
                        } else if ("start" === A) {
                            var q;
                            o(r).tweensContainer && o(r).isAnimating === !0 && (q = o(r).tweensContainer), p.each(g, function(e, i) {
                                if (RegExp("^" + x.Lists.colors.join("$|^") + "$").test(e)) {
                                    var a = t(i, !0),
                                        r = a[0],
                                        o = a[1],
                                        s = a[2];
                                    if (x.RegEx.isHex.test(r)) {
                                        for (var l = ["Red", "Green", "Blue"], u = x.Values.hexToRgb(r), c = s ? x.Values.hexToRgb(s) : n, d = 0; d < l.length; d++) {
                                            var p = [u[d]];
                                            o && p.push(o), c !== n && p.push(c[d]), g[e + l[d]] = p
                                        }
                                        delete g[e]
                                    }
                                }
                            });
                            for (var _ in g) {
                                var $ = t(g[_]),
                                    D = $[0],
                                    Q = $[1],
                                    L = $[2];
                                _ = x.Names.camelCase(_);
                                var z = x.Hooks.getRoot(_),
                                    F = !1;
                                if (o(r).isSVG || "tween" === z || x.Names.prefixCheck(z)[1] !== !1 || x.Normalizations.registered[z] !== n) {
                                    (s.display !== n && null !== s.display && "none" !== s.display || s.visibility !== n && "hidden" !== s.visibility) && /opacity|filter/.test(_) && !L && 0 !== D && (L = 0), s._cacheValues && q && q[_] ? (L === n && (L = q[_].endValue + q[_].unitType), F = o(r).rootPropertyValueCache[z]) : x.Hooks.registered[_] ? L === n ? (F = x.getPropertyValue(r, z), L = x.getPropertyValue(r, _, F)) : F = x.Hooks.templates[z][1] : L === n && (L = x.getPropertyValue(r, _));
                                    var N, W, R, H = !1;
                                    if (N = d(_, L), L = N[0], R = N[1], N = d(_, D), D = N[0].replace(/^([+-\/*])=/, function(t, e) {
                                            return H = e, ""
                                        }), W = N[1], L = parseFloat(L) || 0, D = parseFloat(D) || 0, "%" === W && (/^(fontSize|lineHeight)$/.test(_) ? (D /= 100, W = "em") : /^scale/.test(_) ? (D /= 100, W = "") : /(Red|Green|Blue)$/i.test(_) && (D = D / 100 * 255, W = "")), /[\/*]/.test(H)) W = R;
                                    else if (R !== W && 0 !== L)
                                        if (0 === D) W = R;
                                        else {
                                            a = a || f();
                                            var X = /margin|padding|left|right|width|text|word|letter/i.test(_) || /X$/.test(_) || "x" === _ ? "x" : "y";
                                            switch (R) {
                                                case "%":
                                                    L *= "x" === X ? a.percentToPxWidth : a.percentToPxHeight;
                                                    break;
                                                case "px":
                                                    break;
                                                default:
                                                    L *= a[R + "ToPx"]
                                            }
                                            switch (W) {
                                                case "%":
                                                    L *= 1 / ("x" === X ? a.percentToPxWidth : a.percentToPxHeight);
                                                    break;
                                                case "px":
                                                    break;
                                                default:
                                                    L *= 1 / a[W + "ToPx"]
                                            }
                                        }
                                    switch (H) {
                                        case "+":
                                            D = L + D;
                                            break;
                                        case "-":
                                            D = L - D;
                                            break;
                                        case "*":
                                            D = L * D;
                                            break;
                                        case "/":
                                            D = L / D
                                    }
                                    l[_] = {
                                        rootPropertyValue: F,
                                        startValue: L,
                                        currentValue: L,
                                        endValue: D,
                                        unitType: W,
                                        easing: Q
                                    }, b.debug && console.log("tweensContainer (" + _ + "): " + JSON.stringify(l[_]), r)
                                } else b.debug && console.log("Skipping [" + z + "] due to a lack of browser support.")
                            }
                            l.element = r
                        }
                        l.element && (x.Values.addClass(r, "velocity-animating"), j.push(l), "" === s.queue && (o(r).tweensContainer = l, o(r).opts = s), o(r).isAnimating = !0, S === k - 1 ? (b.State.calls.push([j, h, s, null, P.resolver]), b.State.isTicking === !1 && (b.State.isTicking = !0, c())) : S++)
                    }
                    var a, r = this,
                        s = p.extend({}, b.defaults, y),
                        l = {};
                    switch (o(r) === n && b.init(r), parseFloat(s.delay) && s.queue !== !1 && p.queue(r, s.queue, function(t) {
                        b.velocityQueueEntryFlag = !0, o(r).delayTimer = {
                            setTimeout: setTimeout(t, parseFloat(s.delay)),
                            next: t
                        }
                    }), s.duration.toString().toLowerCase()) {
                        case "fast":
                            s.duration = 200;
                            break;
                        case "normal":
                            s.duration = m;
                            break;
                        case "slow":
                            s.duration = 600;
                            break;
                        default:
                            s.duration = parseFloat(s.duration) || 1
                    }
                    b.mock !== !1 && (b.mock === !0 ? s.duration = s.delay = 1 : (s.duration *= parseFloat(b.mock) || 1, s.delay *= parseFloat(b.mock) || 1)), s.easing = u(s.easing, s.duration), s.begin && !v.isFunction(s.begin) && (s.begin = null), s.progress && !v.isFunction(s.progress) && (s.progress = null), s.complete && !v.isFunction(s.complete) && (s.complete = null), s.display !== n && null !== s.display && (s.display = s.display.toString().toLowerCase(), "auto" === s.display && (s.display = b.CSS.Values.getDisplayType(r))), s.visibility !== n && null !== s.visibility && (s.visibility = s.visibility.toString().toLowerCase()), s.mobileHA = s.mobileHA && b.State.isMobile && !b.State.isGingerbread, s.queue === !1 ? s.delay ? setTimeout(t, s.delay) : t() : p.queue(r, s.queue, function(e, i) {
                        return i === !0 ? (P.promise && P.resolver(h), !0) : (b.velocityQueueEntryFlag = !0, void t(e))
                    }), "" !== s.queue && "fx" !== s.queue || "inprogress" === p.queue(r)[0] || p.dequeue(r)
                }
                var s, l, f, h, g, y, w = arguments[0] && (arguments[0].p || p.isPlainObject(arguments[0].properties) && !arguments[0].properties.names || v.isString(arguments[0].properties));
                if (v.isWrapped(this) ? (s = !1, f = 0, h = this, l = this) : (s = !0, f = 1, h = w ? arguments[0].elements || arguments[0].e : arguments[0]), h = r(h)) {
                    w ? (g = arguments[0].properties || arguments[0].p, y = arguments[0].options || arguments[0].o) : (g = arguments[f], y = arguments[f + 1]);
                    var k = h.length,
                        S = 0;
                    if (!/^(stop|finish)$/i.test(g) && !p.isPlainObject(y)) {
                        var T = f + 1;
                        y = {};
                        for (var O = T; O < arguments.length; O++) v.isArray(arguments[O]) || !/^(fast|normal|slow)$/i.test(arguments[O]) && !/^\d/.test(arguments[O]) ? v.isString(arguments[O]) || v.isArray(arguments[O]) ? y.easing = arguments[O] : v.isFunction(arguments[O]) && (y.complete = arguments[O]) : y.duration = arguments[O]
                    }
                    var P = {
                        promise: null,
                        resolver: null,
                        rejecter: null
                    };
                    s && b.Promise && (P.promise = new b.Promise(function(t, e) {
                        P.resolver = t, P.rejecter = e
                    }));
                    var A;
                    switch (g) {
                        case "scroll":
                            A = "scroll";
                            break;
                        case "reverse":
                            A = "reverse";
                            break;
                        case "finish":
                        case "stop":
                            p.each(h, function(t, e) {
                                o(e) && o(e).delayTimer && (clearTimeout(o(e).delayTimer.setTimeout), o(e).delayTimer.next && o(e).delayTimer.next(), delete o(e).delayTimer)
                            });
                            var E = [];
                            return p.each(b.State.calls, function(t, e) {
                                e && p.each(e[1], function(i, a) {
                                    var r = y === n ? "" : y;
                                    return r === !0 || e[2].queue === r || y === n && e[2].queue === !1 ? void p.each(h, function(i, n) {
                                        n === a && ((y === !0 || v.isString(y)) && (p.each(p.queue(n, v.isString(y) ? y : ""), function(t, e) {
                                            v.isFunction(e) && e(null, !0)
                                        }), p.queue(n, v.isString(y) ? y : "", [])), "stop" === g ? (o(n) && o(n).tweensContainer && r !== !1 && p.each(o(n).tweensContainer, function(t, e) {
                                            e.endValue = e.currentValue
                                        }), E.push(t)) : "finish" === g && (e[2].duration = 1))
                                    }) : !0
                                })
                            }), "stop" === g && (p.each(E, function(t, e) {
                                d(e, !0)
                            }), P.promise && P.resolver(h)), t();
                        default:
                            if (!p.isPlainObject(g) || v.isEmptyObject(g)) {
                                if (v.isString(g) && b.Redirects[g]) {
                                    var q = p.extend({}, y),
                                        M = q.duration,
                                        I = q.delay || 0;
                                    return q.backwards === !0 && (h = p.extend(!0, [], h).reverse()), p.each(h, function(t, e) {
                                        parseFloat(q.stagger) ? q.delay = I + parseFloat(q.stagger) * t : v.isFunction(q.stagger) && (q.delay = I + q.stagger.call(e, t, k)), q.drag && (q.duration = parseFloat(M) || (/^(callout|transition)/.test(g) ? 1e3 : m), q.duration = Math.max(q.duration * (q.backwards ? 1 - t / k : (t + 1) / k), .75 * q.duration, 200)), b.Redirects[g].call(e, e, q || {}, t, k, h, P.promise ? P : n)
                                    }), t()
                                }
                                var _ = "Velocity: First argument (" + g + ") was not a property map, a known action, or a registered redirect. Aborting.";
                                return P.promise ? P.rejecter(new Error(_)) : console.log(_), t()
                            }
                            A = "start"
                    }
                    var V = {
                            lastParent: null,
                            lastPosition: null,
                            lastFontSize: null,
                            lastPercentToPxWidth: null,
                            lastPercentToPxHeight: null,
                            lastEmToPx: null,
                            remToPx: null,
                            vwToPx: null,
                            vhToPx: null
                        },
                        j = [];
                    p.each(h, function(t, e) {
                        v.isNode(e) && a.call(e)
                    });
                    var $, q = p.extend({}, b.defaults, y);
                    if (q.loop = parseInt(q.loop), $ = 2 * q.loop - 1, q.loop)
                        for (var D = 0; $ > D; D++) {
                            var Q = {
                                delay: q.delay,
                                progress: q.progress
                            };
                            D === $ - 1 && (Q.display = q.display, Q.visibility = q.visibility, Q.complete = q.complete), C(h, "reverse", Q)
                        }
                    return t()
                }
            };
            b = p.extend(C, b), b.animate = C;
            var k = e.requestAnimationFrame || h;
            return b.State.isMobile || i.hidden === n || i.addEventListener("visibilitychange", function() {
                i.hidden ? (k = function(t) {
                    return setTimeout(function() {
                        t(!0)
                    }, 16)
                }, c()) : k = e.requestAnimationFrame || h
            }), t.Velocity = b, t !== e && (t.fn.velocity = C, t.fn.velocity.defaults = b.defaults), p.each(["Down", "Up"], function(t, e) {
                b.Redirects["slide" + e] = function(t, i, a, r, o, s) {
                    var l = p.extend({}, i),
                        u = l.begin,
                        c = l.complete,
                        d = {
                            height: "",
                            marginTop: "",
                            marginBottom: "",
                            paddingTop: "",
                            paddingBottom: ""
                        },
                        f = {};
                    l.display === n && (l.display = "Down" === e ? "inline" === b.CSS.Values.getDisplayType(t) ? "inline-block" : "block" : "none"), l.begin = function() {
                        u && u.call(o, o);
                        for (var i in d) {
                            f[i] = t.style[i];
                            var n = b.CSS.getPropertyValue(t, i);
                            d[i] = "Down" === e ? [n, 0] : [0, n]
                        }
                        f.overflow = t.style.overflow, t.style.overflow = "hidden"
                    }, l.complete = function() {
                        for (var e in f) t.style[e] = f[e];
                        c && c.call(o, o), s && s.resolver(o)
                    }, b(t, d, l)
                }
            }), p.each(["In", "Out"], function(t, e) {
                b.Redirects["fade" + e] = function(t, i, a, r, o, s) {
                    var l = p.extend({}, i),
                        u = {
                            opacity: "In" === e ? 1 : 0
                        },
                        c = l.complete;
                    l.complete = a !== r - 1 ? l.begin = null : function() {
                        c && c.call(o, o), s && s.resolver(o)
                    }, l.display === n && (l.display = "In" === e ? "auto" : "none"), b(this, u, l)
                }
            }), b
        }(window.jQuery || window.Zepto || window, window, document)
    }), ! function(t, e, i, n) {
        "use strict";

        function a(t, e, i) {
            return setTimeout(c(t, i), e)
        }

        function r(t, e, i) {
            return Array.isArray(t) ? (o(t, i[e], i), !0) : !1
        }

        function o(t, e, i) {
            var a;
            if (t)
                if (t.forEach) t.forEach(e, i);
                else if (t.length !== n)
                for (a = 0; a < t.length;) e.call(i, t[a], a, t), a++;
            else
                for (a in t) t.hasOwnProperty(a) && e.call(i, t[a], a, t)
        }

        function s(t, e, i) {
            for (var a = Object.keys(e), r = 0; r < a.length;)(!i || i && t[a[r]] === n) && (t[a[r]] = e[a[r]]), r++;
            return t
        }

        function l(t, e) {
            return s(t, e, !0)
        }

        function u(t, e, i) {
            var n, a = e.prototype;
            n = t.prototype = Object.create(a), n.constructor = t, n._super = a, i && s(n, i)
        }

        function c(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        }

        function d(t, e) {
            return typeof t == ce ? t.apply(e ? e[0] || n : n, e) : t
        }

        function p(t, e) {
            return t === n ? e : t
        }

        function f(t, e, i) {
            o(m(e), function(e) {
                t.addEventListener(e, i, !1)
            })
        }

        function h(t, e, i) {
            o(m(e), function(e) {
                t.removeEventListener(e, i, !1)
            })
        }

        function v(t, e) {
            for (; t;) {
                if (t == e) return !0;
                t = t.parentNode
            }
            return !1
        }

        function g(t, e) {
            return t.indexOf(e) > -1
        }

        function m(t) {
            return t.trim().split(/\s+/g)
        }

        function y(t, e, i) {
            if (t.indexOf && !i) return t.indexOf(e);
            for (var n = 0; n < t.length;) {
                if (i && t[n][i] == e || !i && t[n] === e) return n;
                n++
            }
            return -1
        }

        function b(t) {
            return Array.prototype.slice.call(t, 0)
        }

        function w(t, e, i) {
            for (var n = [], a = [], r = 0; r < t.length;) {
                var o = e ? t[r][e] : t[r];
                y(a, o) < 0 && n.push(t[r]), a[r] = o, r++
            }
            return i && (n = e ? n.sort(function(t, i) {
                return t[e] > i[e]
            }) : n.sort()), n
        }

        function x(t, e) {
            for (var i, a, r = e[0].toUpperCase() + e.slice(1), o = 0; o < le.length;) {
                if (i = le[o], a = i ? i + r : e, a in t) return a;
                o++
            }
            return n
        }

        function C() {
            return he++
        }

        function k(t) {
            var e = t.ownerDocument;
            return e.defaultView || e.parentWindow
        }

        function S(t, e) {
            var i = this;
            this.manager = t, this.callback = e, this.element = t.element, this.target = t.options.inputTarget, this.domHandler = function(e) {
                d(t.options.enable, [t]) && i.handler(e)
            }, this.init()
        }

        function T(t) {
            var e, i = t.options.inputClass;
            return new(e = i ? i : me ? L : ye ? N : ge ? R : Q)(t, O)
        }

        function O(t, e, i) {
            var n = i.pointers.length,
                a = i.changedPointers.length,
                r = e & Se && 0 === n - a,
                o = e & (Oe | Pe) && 0 === n - a;
            i.isFirst = !!r, i.isFinal = !!o, r && (t.session = {}), i.eventType = e, P(t, i), t.emit("hammer.input", i), t.recognize(i), t.session.prevInput = i
        }

        function P(t, e) {
            var i = t.session,
                n = e.pointers,
                a = n.length;
            i.firstInput || (i.firstInput = q(e)), a > 1 && !i.firstMultiple ? i.firstMultiple = q(e) : 1 === a && (i.firstMultiple = !1);
            var r = i.firstInput,
                o = i.firstMultiple,
                s = o ? o.center : r.center,
                l = e.center = M(n);
            e.timeStamp = fe(), e.deltaTime = e.timeStamp - r.timeStamp, e.angle = j(s, l), e.distance = V(s, l), A(i, e), e.offsetDirection = _(e.deltaX, e.deltaY), e.scale = o ? D(o.pointers, n) : 1, e.rotation = o ? $(o.pointers, n) : 0, E(i, e);
            var u = t.element;
            v(e.srcEvent.target, u) && (u = e.srcEvent.target), e.target = u
        }

        function A(t, e) {
            var i = e.center,
                n = t.offsetDelta || {},
                a = t.prevDelta || {},
                r = t.prevInput || {};
            (e.eventType === Se || r.eventType === Oe) && (a = t.prevDelta = {
                x: r.deltaX || 0,
                y: r.deltaY || 0
            }, n = t.offsetDelta = {
                x: i.x,
                y: i.y
            }), e.deltaX = a.x + (i.x - n.x), e.deltaY = a.y + (i.y - n.y)
        }

        function E(t, e) {
            var i, a, r, o, s = t.lastInterval || e,
                l = e.timeStamp - s.timeStamp;
            if (e.eventType != Pe && (l > ke || s.velocity === n)) {
                var u = s.deltaX - e.deltaX,
                    c = s.deltaY - e.deltaY,
                    d = I(l, u, c);
                a = d.x, r = d.y, i = pe(d.x) > pe(d.y) ? d.x : d.y, o = _(u, c), t.lastInterval = e
            } else i = s.velocity, a = s.velocityX, r = s.velocityY, o = s.direction;
            e.velocity = i, e.velocityX = a, e.velocityY = r, e.direction = o
        }

        function q(t) {
            for (var e = [], i = 0; i < t.pointers.length;) e[i] = {
                clientX: de(t.pointers[i].clientX),
                clientY: de(t.pointers[i].clientY)
            }, i++;
            return {
                timeStamp: fe(),
                pointers: e,
                center: M(e),
                deltaX: t.deltaX,
                deltaY: t.deltaY
            }
        }

        function M(t) {
            var e = t.length;
            if (1 === e) return {
                x: de(t[0].clientX),
                y: de(t[0].clientY)
            };
            for (var i = 0, n = 0, a = 0; e > a;) i += t[a].clientX, n += t[a].clientY, a++;
            return {
                x: de(i / e),
                y: de(n / e)
            }
        }

        function I(t, e, i) {
            return {
                x: e / t || 0,
                y: i / t || 0
            }
        }

        function _(t, e) {
            return t === e ? Ae : pe(t) >= pe(e) ? t > 0 ? Ee : qe : e > 0 ? Me : Ie
        }

        function V(t, e, i) {
            i || (i = $e);
            var n = e[i[0]] - t[i[0]],
                a = e[i[1]] - t[i[1]];
            return Math.sqrt(n * n + a * a)
        }

        function j(t, e, i) {
            i || (i = $e);
            var n = e[i[0]] - t[i[0]],
                a = e[i[1]] - t[i[1]];
            return 180 * Math.atan2(a, n) / Math.PI
        }

        function $(t, e) {
            return j(e[1], e[0], De) - j(t[1], t[0], De)
        }

        function D(t, e) {
            return V(e[0], e[1], De) / V(t[0], t[1], De)
        }

        function Q() {
            this.evEl = Le, this.evWin = ze, this.allow = !0, this.pressed = !1, S.apply(this, arguments)
        }

        function L() {
            this.evEl = We, this.evWin = Re, S.apply(this, arguments), this.store = this.manager.session.pointerEvents = []
        }

        function z() {
            this.evTarget = Xe, this.evWin = Ye, this.started = !1, S.apply(this, arguments)
        }

        function F(t, e) {
            var i = b(t.touches),
                n = b(t.changedTouches);
            return e & (Oe | Pe) && (i = w(i.concat(n), "identifier", !0)), [i, n]
        }

        function N() {
            this.evTarget = Ge, this.targetIds = {}, S.apply(this, arguments)
        }

        function W(t, e) {
            var i = b(t.touches),
                n = this.targetIds;
            if (e & (Se | Te) && 1 === i.length) return n[i[0].identifier] = !0, [i, i];
            var a, r, o = b(t.changedTouches),
                s = [],
                l = this.target;
            if (r = i.filter(function(t) {
                    return v(t.target, l)
                }), e === Se)
                for (a = 0; a < r.length;) n[r[a].identifier] = !0, a++;
            for (a = 0; a < o.length;) n[o[a].identifier] && s.push(o[a]), e & (Oe | Pe) && delete n[o[a].identifier], a++;
            return s.length ? [w(r.concat(s), "identifier", !0), s] : void 0
        }

        function R() {
            S.apply(this, arguments);
            var t = c(this.handler, this);
            this.touch = new N(this.manager, t), this.mouse = new Q(this.manager, t)
        }

        function H(t, e) {
            this.manager = t, this.set(e)
        }

        function X(t) {
            if (g(t, ei)) return ei;
            var e = g(t, ii),
                i = g(t, ni);
            return e && i ? ii + " " + ni : e || i ? e ? ii : ni : g(t, ti) ? ti : Ke
        }

        function Y(t) {
            this.id = C(), this.manager = null, this.options = l(t || {}, this.defaults), this.options.enable = p(this.options.enable, !0), this.state = ai, this.simultaneous = {}, this.requireFail = []
        }

        function B(t) {
            return t & ui ? "cancel" : t & si ? "end" : t & oi ? "move" : t & ri ? "start" : ""
        }

        function G(t) {
            return t == Ie ? "down" : t == Me ? "up" : t == Ee ? "left" : t == qe ? "right" : ""
        }

        function U(t, e) {
            var i = e.manager;
            return i ? i.get(t) : t
        }

        function Z() {
            Y.apply(this, arguments)
        }

        function J() {
            Z.apply(this, arguments), this.pX = null, this.pY = null
        }

        function K() {
            Z.apply(this, arguments)
        }

        function te() {
            Y.apply(this, arguments), this._timer = null, this._input = null
        }

        function ee() {
            Z.apply(this, arguments)
        }

        function ie() {
            Z.apply(this, arguments)
        }

        function ne() {
            Y.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0
        }

        function ae(t, e) {
            return e = e || {}, e.recognizers = p(e.recognizers, ae.defaults.preset), new re(t, e)
        }

        function re(t, e) {
            e = e || {}, this.options = l(e, ae.defaults), this.options.inputTarget = this.options.inputTarget || t, this.handlers = {}, this.session = {}, this.recognizers = [], this.element = t, this.input = T(this), this.touchAction = new H(this, this.options.touchAction), oe(this, !0), o(e.recognizers, function(t) {
                var e = this.add(new t[0](t[1]));
                t[2] && e.recognizeWith(t[2]), t[3] && e.requireFailure(t[3])
            }, this)
        }

        function oe(t, e) {
            var i = t.element;
            o(t.options.cssProps, function(t, n) {
                i.style[x(i.style, n)] = e ? t : ""
            })
        }

        function se(t, i) {
            var n = e.createEvent("Event");
            n.initEvent(t, !0, !0), n.gesture = i, i.target.dispatchEvent(n)
        }
        var le = ["", "webkit", "moz", "MS", "ms", "o"],
            ue = e.createElement("div"),
            ce = "function",
            de = Math.round,
            pe = Math.abs,
            fe = Date.now,
            he = 1,
            ve = /mobile|tablet|ip(ad|hone|od)|android/i,
            ge = "ontouchstart" in t,
            me = x(t, "PointerEvent") !== n,
            ye = ge && ve.test(navigator.userAgent),
            be = "touch",
            we = "pen",
            xe = "mouse",
            Ce = "kinect",
            ke = 25,
            Se = 1,
            Te = 2,
            Oe = 4,
            Pe = 8,
            Ae = 1,
            Ee = 2,
            qe = 4,
            Me = 8,
            Ie = 16,
            _e = Ee | qe,
            Ve = Me | Ie,
            je = _e | Ve,
            $e = ["x", "y"],
            De = ["clientX", "clientY"];
        S.prototype = {
            handler: function() {},
            init: function() {
                this.evEl && f(this.element, this.evEl, this.domHandler), this.evTarget && f(this.target, this.evTarget, this.domHandler), this.evWin && f(k(this.element), this.evWin, this.domHandler)
            },
            destroy: function() {
                this.evEl && h(this.element, this.evEl, this.domHandler), this.evTarget && h(this.target, this.evTarget, this.domHandler), this.evWin && h(k(this.element), this.evWin, this.domHandler)
            }
        };
        var Qe = {
                mousedown: Se,
                mousemove: Te,
                mouseup: Oe
            },
            Le = "mousedown",
            ze = "mousemove mouseup";
        u(Q, S, {
            handler: function(t) {
                var e = Qe[t.type];
                e & Se && 0 === t.button && (this.pressed = !0), e & Te && 1 !== t.which && (e = Oe), this.pressed && this.allow && (e & Oe && (this.pressed = !1), this.callback(this.manager, e, {
                    pointers: [t],
                    changedPointers: [t],
                    pointerType: xe,
                    srcEvent: t
                }))
            }
        });
        var Fe = {
                pointerdown: Se,
                pointermove: Te,
                pointerup: Oe,
                pointercancel: Pe,
                pointerout: Pe
            },
            Ne = {
                2: be,
                3: we,
                4: xe,
                5: Ce
            },
            We = "pointerdown",
            Re = "pointermove pointerup pointercancel";
        t.MSPointerEvent && (We = "MSPointerDown", Re = "MSPointerMove MSPointerUp MSPointerCancel"), u(L, S, {
            handler: function(t) {
                var e = this.store,
                    i = !1,
                    n = t.type.toLowerCase().replace("ms", ""),
                    a = Fe[n],
                    r = Ne[t.pointerType] || t.pointerType,
                    o = r == be,
                    s = y(e, t.pointerId, "pointerId");
                a & Se && (0 === t.button || o) ? 0 > s && (e.push(t), s = e.length - 1) : a & (Oe | Pe) && (i = !0), 0 > s || (e[s] = t, this.callback(this.manager, a, {
                    pointers: e,
                    changedPointers: [t],
                    pointerType: r,
                    srcEvent: t
                }), i && e.splice(s, 1))
            }
        });
        var He = {
                touchstart: Se,
                touchmove: Te,
                touchend: Oe,
                touchcancel: Pe
            },
            Xe = "touchstart",
            Ye = "touchstart touchmove touchend touchcancel";
        u(z, S, {
            handler: function(t) {
                var e = He[t.type];
                if (e === Se && (this.started = !0), this.started) {
                    var i = F.call(this, t, e);
                    e & (Oe | Pe) && 0 === i[0].length - i[1].length && (this.started = !1), this.callback(this.manager, e, {
                        pointers: i[0],
                        changedPointers: i[1],
                        pointerType: be,
                        srcEvent: t
                    })
                }
            }
        });
        var Be = {
                touchstart: Se,
                touchmove: Te,
                touchend: Oe,
                touchcancel: Pe
            },
            Ge = "touchstart touchmove touchend touchcancel";
        u(N, S, {
            handler: function(t) {
                var e = Be[t.type],
                    i = W.call(this, t, e);
                i && this.callback(this.manager, e, {
                    pointers: i[0],
                    changedPointers: i[1],
                    pointerType: be,
                    srcEvent: t
                })
            }
        }), u(R, S, {
            handler: function(t, e, i) {
                var n = i.pointerType == be,
                    a = i.pointerType == xe;
                if (n) this.mouse.allow = !1;
                else if (a && !this.mouse.allow) return;
                e & (Oe | Pe) && (this.mouse.allow = !0), this.callback(t, e, i)
            },
            destroy: function() {
                this.touch.destroy(), this.mouse.destroy()
            }
        });
        var Ue = x(ue.style, "touchAction"),
            Ze = Ue !== n,
            Je = "compute",
            Ke = "auto",
            ti = "manipulation",
            ei = "none",
            ii = "pan-x",
            ni = "pan-y";
        H.prototype = {
            set: function(t) {
                t == Je && (t = this.compute()), Ze && (this.manager.element.style[Ue] = t), this.actions = t.toLowerCase().trim()
            },
            update: function() {
                this.set(this.manager.options.touchAction)
            },
            compute: function() {
                var t = [];
                return o(this.manager.recognizers, function(e) {
                    d(e.options.enable, [e]) && (t = t.concat(e.getTouchAction()))
                }), X(t.join(" "))
            },
            preventDefaults: function(t) {
                if (!Ze) {
                    var e = t.srcEvent,
                        i = t.offsetDirection;
                    if (this.manager.session.prevented) return void e.preventDefault();
                    var n = this.actions,
                        a = g(n, ei),
                        r = g(n, ni),
                        o = g(n, ii);
                    return a || r && i & _e || o && i & Ve ? this.preventSrc(e) : void 0
                }
            },
            preventSrc: function(t) {
                this.manager.session.prevented = !0, t.preventDefault()
            }
        };
        var ai = 1,
            ri = 2,
            oi = 4,
            si = 8,
            li = si,
            ui = 16,
            ci = 32;
        Y.prototype = {
            defaults: {},
            set: function(t) {
                return s(this.options, t), this.manager && this.manager.touchAction.update(), this
            },
            recognizeWith: function(t) {
                if (r(t, "recognizeWith", this)) return this;
                var e = this.simultaneous;
                return t = U(t, this), e[t.id] || (e[t.id] = t, t.recognizeWith(this)), this
            },
            dropRecognizeWith: function(t) {
                return r(t, "dropRecognizeWith", this) ? this : (t = U(t, this), delete this.simultaneous[t.id], this)
            },
            requireFailure: function(t) {
                if (r(t, "requireFailure", this)) return this;
                var e = this.requireFail;
                return t = U(t, this), -1 === y(e, t) && (e.push(t), t.requireFailure(this)), this
            },
            dropRequireFailure: function(t) {
                if (r(t, "dropRequireFailure", this)) return this;
                t = U(t, this);
                var e = y(this.requireFail, t);
                return e > -1 && this.requireFail.splice(e, 1), this
            },
            hasRequireFailures: function() {
                return this.requireFail.length > 0
            },
            canRecognizeWith: function(t) {
                return !!this.simultaneous[t.id]
            },
            emit: function(t) {
                function e(e) {
                    i.manager.emit(i.options.event + (e ? B(n) : ""), t)
                }
                var i = this,
                    n = this.state;
                si > n && e(!0), e(), n >= si && e(!0)
            },
            tryEmit: function(t) {
                return this.canEmit() ? this.emit(t) : void(this.state = ci)
            },
            canEmit: function() {
                for (var t = 0; t < this.requireFail.length;) {
                    if (!(this.requireFail[t].state & (ci | ai))) return !1;
                    t++
                }
                return !0
            },
            recognize: function(t) {
                var e = s({}, t);
                return d(this.options.enable, [this, e]) ? (this.state & (li | ui | ci) && (this.state = ai), this.state = this.process(e), void(this.state & (ri | oi | si | ui) && this.tryEmit(e))) : (this.reset(), void(this.state = ci))
            },
            process: function() {},
            getTouchAction: function() {},
            reset: function() {}
        }, u(Z, Y, {
            defaults: {
                pointers: 1
            },
            attrTest: function(t) {
                var e = this.options.pointers;
                return 0 === e || t.pointers.length === e
            },
            process: function(t) {
                var e = this.state,
                    i = t.eventType,
                    n = e & (ri | oi),
                    a = this.attrTest(t);
                return n && (i & Pe || !a) ? e | ui : n || a ? i & Oe ? e | si : e & ri ? e | oi : ri : ci
            }
        }), u(J, Z, {
            defaults: {
                event: "pan",
                threshold: 10,
                pointers: 1,
                direction: je
            },
            getTouchAction: function() {
                var t = this.options.direction,
                    e = [];
                return t & _e && e.push(ni), t & Ve && e.push(ii), e
            },
            directionTest: function(t) {
                var e = this.options,
                    i = !0,
                    n = t.distance,
                    a = t.direction,
                    r = t.deltaX,
                    o = t.deltaY;
                return a & e.direction || (e.direction & _e ? (a = 0 === r ? Ae : 0 > r ? Ee : qe, i = r != this.pX, n = Math.abs(t.deltaX)) : (a = 0 === o ? Ae : 0 > o ? Me : Ie, i = o != this.pY, n = Math.abs(t.deltaY))), t.direction = a, i && n > e.threshold && a & e.direction
            },
            attrTest: function(t) {
                return Z.prototype.attrTest.call(this, t) && (this.state & ri || !(this.state & ri) && this.directionTest(t))
            },
            emit: function(t) {
                this.pX = t.deltaX, this.pY = t.deltaY;
                var e = G(t.direction);
                e && this.manager.emit(this.options.event + e, t), this._super.emit.call(this, t)
            }
        }), u(K, Z, {
            defaults: {
                event: "pinch",
                threshold: 0,
                pointers: 2
            },
            getTouchAction: function() {
                return [ei]
            },
            attrTest: function(t) {
                return this._super.attrTest.call(this, t) && (Math.abs(t.scale - 1) > this.options.threshold || this.state & ri)
            },
            emit: function(t) {
                if (this._super.emit.call(this, t), 1 !== t.scale) {
                    var e = t.scale < 1 ? "in" : "out";
                    this.manager.emit(this.options.event + e, t)
                }
            }
        }), u(te, Y, {
            defaults: {
                event: "press",
                pointers: 1,
                time: 500,
                threshold: 5
            },
            getTouchAction: function() {
                return [Ke]
            },
            process: function(t) {
                var e = this.options,
                    i = t.pointers.length === e.pointers,
                    n = t.distance < e.threshold,
                    r = t.deltaTime > e.time;
                if (this._input = t, !n || !i || t.eventType & (Oe | Pe) && !r) this.reset();
                else if (t.eventType & Se) this.reset(), this._timer = a(function() {
                    this.state = li, this.tryEmit()
                }, e.time, this);
                else if (t.eventType & Oe) return li;
                return ci
            },
            reset: function() {
                clearTimeout(this._timer)
            },
            emit: function(t) {
                this.state === li && (t && t.eventType & Oe ? this.manager.emit(this.options.event + "up", t) : (this._input.timeStamp = fe(), this.manager.emit(this.options.event, this._input)))
            }
        }), u(ee, Z, {
            defaults: {
                event: "rotate",
                threshold: 0,
                pointers: 2
            },
            getTouchAction: function() {
                return [ei]
            },
            attrTest: function(t) {
                return this._super.attrTest.call(this, t) && (Math.abs(t.rotation) > this.options.threshold || this.state & ri)
            }
        }), u(ie, Z, {
            defaults: {
                event: "swipe",
                threshold: 10,
                velocity: .65,
                direction: _e | Ve,
                pointers: 1
            },
            getTouchAction: function() {
                return J.prototype.getTouchAction.call(this)
            },
            attrTest: function(t) {
                var e, i = this.options.direction;
                return i & (_e | Ve) ? e = t.velocity : i & _e ? e = t.velocityX : i & Ve && (e = t.velocityY), this._super.attrTest.call(this, t) && i & t.direction && t.distance > this.options.threshold && pe(e) > this.options.velocity && t.eventType & Oe
            },
            emit: function(t) {
                var e = G(t.direction);
                e && this.manager.emit(this.options.event + e, t), this.manager.emit(this.options.event, t)
            }
        }), u(ne, Y, {
            defaults: {
                event: "tap",
                pointers: 1,
                taps: 1,
                interval: 300,
                time: 250,
                threshold: 2,
                posThreshold: 10
            },
            getTouchAction: function() {
                return [ti]
            },
            process: function(t) {
                var e = this.options,
                    i = t.pointers.length === e.pointers,
                    n = t.distance < e.threshold,
                    r = t.deltaTime < e.time;
                if (this.reset(), t.eventType & Se && 0 === this.count) return this.failTimeout();
                if (n && r && i) {
                    if (t.eventType != Oe) return this.failTimeout();
                    var o = this.pTime ? t.timeStamp - this.pTime < e.interval : !0,
                        s = !this.pCenter || V(this.pCenter, t.center) < e.posThreshold;
                    this.pTime = t.timeStamp, this.pCenter = t.center, s && o ? this.count += 1 : this.count = 1, this._input = t;
                    var l = this.count % e.taps;
                    if (0 === l) return this.hasRequireFailures() ? (this._timer = a(function() {
                        this.state = li, this.tryEmit()
                    }, e.interval, this), ri) : li
                }
                return ci
            },
            failTimeout: function() {
                return this._timer = a(function() {
                    this.state = ci
                }, this.options.interval, this), ci
            },
            reset: function() {
                clearTimeout(this._timer)
            },
            emit: function() {
                this.state == li && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
            }
        }), ae.VERSION = "2.0.4", ae.defaults = {
            domEvents: !1,
            touchAction: Je,
            enable: !0,
            inputTarget: null,
            inputClass: null,
            preset: [
                [ee, {
                    enable: !1
                }],
                [K, {
                        enable: !1
                    },
                    ["rotate"]
                ],
                [ie, {
                    direction: _e
                }],
                [J, {
                        direction: _e
                    },
                    ["swipe"]
                ],
                [ne],
                [ne, {
                        event: "doubletap",
                        taps: 2
                    },
                    ["tap"]
                ],
                [te]
            ],
            cssProps: {
                userSelect: "default",
                touchSelect: "none",
                touchCallout: "none",
                contentZooming: "none",
                userDrag: "none",
                tapHighlightColor: "rgba(0,0,0,0)"
            }
        };
        var di = 1,
            pi = 2;
        re.prototype = {
            set: function(t) {
                return s(this.options, t), t.touchAction && this.touchAction.update(), t.inputTarget && (this.input.destroy(), this.input.target = t.inputTarget, this.input.init()), this
            },
            stop: function(t) {
                this.session.stopped = t ? pi : di
            },
            recognize: function(t) {
                var e = this.session;
                if (!e.stopped) {
                    this.touchAction.preventDefaults(t);
                    var i, n = this.recognizers,
                        a = e.curRecognizer;
                    (!a || a && a.state & li) && (a = e.curRecognizer = null);
                    for (var r = 0; r < n.length;) i = n[r], e.stopped === pi || a && i != a && !i.canRecognizeWith(a) ? i.reset() : i.recognize(t), !a && i.state & (ri | oi | si) && (a = e.curRecognizer = i), r++
                }
            },
            get: function(t) {
                if (t instanceof Y) return t;
                for (var e = this.recognizers, i = 0; i < e.length; i++)
                    if (e[i].options.event == t) return e[i];
                return null
            },
            add: function(t) {
                if (r(t, "add", this)) return this;
                var e = this.get(t.options.event);
                return e && this.remove(e), this.recognizers.push(t), t.manager = this, this.touchAction.update(), t
            },
            remove: function(t) {
                if (r(t, "remove", this)) return this;
                var e = this.recognizers;
                return t = this.get(t), e.splice(y(e, t), 1), this.touchAction.update(), this
            },
            on: function(t, e) {
                var i = this.handlers;
                return o(m(t), function(t) {
                    i[t] = i[t] || [], i[t].push(e)
                }), this
            },
            off: function(t, e) {
                var i = this.handlers;
                return o(m(t), function(t) {
                    e ? i[t].splice(y(i[t], e), 1) : delete i[t]
                }), this
            },
            emit: function(t, e) {
                this.options.domEvents && se(t, e);
                var i = this.handlers[t] && this.handlers[t].slice();
                if (i && i.length) {
                    e.type = t, e.preventDefault = function() {
                        e.srcEvent.preventDefault()
                    };
                    for (var n = 0; n < i.length;) i[n](e), n++
                }
            },
            destroy: function() {
                this.element && oe(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null
            }
        }, s(ae, {
            INPUT_START: Se,
            INPUT_MOVE: Te,
            INPUT_END: Oe,
            INPUT_CANCEL: Pe,
            STATE_POSSIBLE: ai,
            STATE_BEGAN: ri,
            STATE_CHANGED: oi,
            STATE_ENDED: si,
            STATE_RECOGNIZED: li,
            STATE_CANCELLED: ui,
            STATE_FAILED: ci,
            DIRECTION_NONE: Ae,
            DIRECTION_LEFT: Ee,
            DIRECTION_RIGHT: qe,
            DIRECTION_UP: Me,
            DIRECTION_DOWN: Ie,
            DIRECTION_HORIZONTAL: _e,
            DIRECTION_VERTICAL: Ve,
            DIRECTION_ALL: je,
            Manager: re,
            Input: S,
            TouchAction: H,
            TouchInput: N,
            MouseInput: Q,
            PointerEventInput: L,
            TouchMouseInput: R,
            SingleTouchInput: z,
            Recognizer: Y,
            AttrRecognizer: Z,
            Tap: ne,
            Pan: J,
            Swipe: ie,
            Pinch: K,
            Rotate: ee,
            Press: te,
            on: f,
            off: h,
            each: o,
            merge: l,
            extend: s,
            inherit: u,
            bindFn: c,
            prefixed: x
        }), typeof define == ce && define.amd ? define(function() {
            return ae
        }) : "undefined" != typeof module && module.exports ? module.exports = ae : t[i] = ae
    }(window, document, "Hammer"),
    function(t) {
        "function" == typeof define && define.amd ? define(["jquery", "hammerjs"], t) : "object" == typeof exports ? t(require("jquery"), require("hammerjs")) : t(jQuery, Hammer)
    }(function(t, e) {
        function i(i, n) {
            var a = t(i);
            a.data("hammer") || a.data("hammer", new e(a[0], n))
        }
        t.fn.hammer = function(t) {
            return this.each(function() {
                i(this, t)
            })
        }, e.Manager.prototype.emit = function(e) {
            return function(i, n) {
                e.call(this, i, n), t(this.element).trigger({
                    type: i,
                    gesture: n
                })
            }
        }(e.Manager.prototype.emit)
    }), Materialize = {}, Materialize.guid = function() {
        function t() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
        }
        return function() {
            return t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t()
        }
    }(), Materialize.elementOrParentIsFixed = function(t) {
        var e = $(t),
            i = e.add(e.parents()),
            n = !1;
        return i.each(function() {
            return "fixed" === $(this).css("position") ? (n = !0, !1) : void 0
        }), n
    };
var Vel;
Vel = $ ? $.Velocity : Velocity,
    function(t) {
        t.fn.collapsible = function(e) {
            var i = {
                accordion: void 0
            };
            return e = t.extend(i, e), this.each(function() {
                function i(e) {
                    s = o.find("> li > .collapsible-header"), e.hasClass("active") ? e.parent().addClass("active") : e.parent().removeClass("active"), e.parent().hasClass("active") ? e.siblings(".collapsible-body").stop(!0, !1).slideDown({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            t(this).css("height", "")
                        }
                    }) : e.siblings(".collapsible-body").stop(!0, !1).slideUp({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            t(this).css("height", "")
                        }
                    }), s.not(e).removeClass("active").parent().removeClass("active"), s.not(e).parent().children(".collapsible-body").stop(!0, !1).slideUp({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            t(this).css("height", "")
                        }
                    })
                }

                function n(e) {
                    e.hasClass("active") ? e.parent().addClass("active") : e.parent().removeClass("active"), e.parent().hasClass("active") ? e.siblings(".collapsible-body").stop(!0, !1).slideDown({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            t(this).css("height", "")
                        }
                    }) : e.siblings(".collapsible-body").stop(!0, !1).slideUp({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            t(this).css("height", "")
                        }
                    })
                }

                function a(t) {
                    var e = r(t);
                    return e.length > 0
                }

                function r(t) {
                    return t.closest("li > .collapsible-header")
                }
                var o = t(this),
                    s = t(this).find("> li > .collapsible-header"),
                    l = o.data("collapsible");
                o.off("click.collapse", ".collapsible-header"), s.off("click.collapse"), e.accordion || "accordion" == l || void 0 == l ? (s = o.find("> li > .collapsible-header"), s.on("click.collapse", function(e) {
                    var n = t(e.target);
                    a(n) && (n = r(n)), n.toggleClass("active"), i(n)
                }), i(s.filter(".active").first())) : s.each(function() {
                    t(this).on("click.collapse", function(e) {
                        var i = t(e.target);
                        a(i) && (i = r(i)), i.toggleClass("active"), n(i)
                    }), t(this).hasClass("active") && n(t(this))
                })
            })
        }, t(document).ready(function() {
            t(".collapsible").collapsible()
        })
    }(jQuery),
    function(t) {
        t.fn.scrollTo = function(e) {
            return t(this).scrollTop(t(this).scrollTop() - t(this).offset().top + t(e).offset().top), this
        }, t.fn.dropdown = function(e) {
            var i = {
                inDuration: 300,
                outDuration: 225,
                constrain_width: !0,
                hover: !1,
                gutter: 0,
                belowOrigin: !1
            };
            this.each(function() {
                function n() {
                    void 0 != o.data("induration") && (s.inDuration = o.data("inDuration")), void 0 != o.data("outduration") && (s.outDuration = o.data("outDuration")), void 0 != o.data("constrainwidth") && (s.constrain_width = o.data("constrainwidth")), void 0 != o.data("hover") && (s.hover = o.data("hover")), void 0 != o.data("gutter") && (s.gutter = o.data("gutter")), void 0 != o.data("beloworigin") && (s.belowOrigin = o.data("beloworigin"))
                }

                function a() {
                    n(), l.addClass("active"), 1 == s.constrain_width && l.css("width", o.outerWidth());
                    var e = 0;
                    1 == s.belowOrigin && (e = o.height());
                    var i = o.offset().left,
                        a = 0,
                        r = s.gutter;
                    i + l.innerWidth() > t(window).width() && (a = o.innerWidth() - l.innerWidth(), r = -1 * r), l.css({
                        position: "absolute",
                        top: o.position().top + e,
                        left: o.position().left + a + r
                    }), l.stop(!0, !0).css("opacity", 0).slideDown({
                        queue: !1,
                        duration: s.inDuration,
                        easing: "easeOutCubic",
                        complete: function() {
                            t(this).css("height", "")
                        }
                    }).animate({
                        opacity: 1
                    }, {
                        queue: !1,
                        duration: s.inDuration,
                        easing: "easeOutSine"
                    })
                }

                function r() {
                    l.fadeOut(s.outDuration), l.removeClass("active")
                }
                var o = t(this),
                    s = t.extend({}, i, e),
                    l = t("#" + o.attr("data-activates"));
                if (n(), o.after(l), s.hover) {
                    var u = !1;
                    o.unbind("click." + o.attr("id")), o.on("mouseenter", function() {
                        u === !1 && (a(), u = !0)
                    }), o.on("mouseleave", function(e) {
                        t(e.toElement).closest(".dropdown-content").is(l) || (l.stop(!0, !0), r(), u = !1)
                    }), l.on("mouseleave", function(e) {
                        t(e.toElement).closest(".dropdown-button").is(o) || (l.stop(!0, !0), r(), u = !1)
                    })
                } else o.unbind("click." + o.attr("id")), o.bind("click." + o.attr("id"), function(e) {
                    o[0] == e.currentTarget && 0 === t(e.target).closest(".dropdown-content").length ? (e.preventDefault(), a()) : o.hasClass("active") && (r(), t(document).unbind("click." + l.attr("id"))), l.hasClass("active") && t(document).bind("click." + l.attr("id"), function(e) {
                        !l.is(e.target) && !o.is(e.target) && !o.find(e.target).length > 0 && (r(), t(document).unbind("click." + l.attr("id")))
                    })
                });
                o.on("open", a), o.on("close", r)
            })
        }, t(document).ready(function() {
            t(".dropdown-button").dropdown()
        })
    }(jQuery),
    function(t) {
        t.fn.extend({
            openModal: function(e) {
                var i = this,
                    n = t('<div id="lean-overlay"></div>');
                t("body").append(n);
                var a = {
                    opacity: .5,
                    in_duration: 350,
                    out_duration: 250,
                    ready: void 0,
                    complete: void 0,
                    dismissible: !0
                };
                e = t.extend(a, e), e.dismissible && (t("#lean-overlay").click(function() {
                    t(i).closeModal(e)
                }), t(document).on("keyup.leanModal", function(n) {
                    27 === n.keyCode && t(i).closeModal(e)
                })), t(i).find(".modal-close").click(function() {
                    t(i).closeModal(e)
                }), t("#lean-overlay").css({
                    display: "block",
                    opacity: 0
                }), t(i).css({
                    display: "block",
                    opacity: 0
                }), t("#lean-overlay").velocity({
                    opacity: e.opacity
                }, {
                    duration: e.in_duration,
                    queue: !1,
                    ease: "easeOutCubic"
                }), t(i).hasClass("bottom-sheet") ? t(i).velocity({
                    bottom: "0",
                    opacity: 1
                }, {
                    duration: e.in_duration,
                    queue: !1,
                    ease: "easeOutCubic",
                    complete: function() {
                        "function" == typeof e.ready && e.ready()
                    }
                }) : (t(i).css({
                    top: "4%"
                }), t(i).velocity({
                    top: "10%",
                    opacity: 1
                }, {
                    duration: e.in_duration,
                    queue: !1,
                    ease: "easeOutCubic",
                    complete: function() {
                        "function" == typeof e.ready && e.ready()
                    }
                }))
            }
        }), t.fn.extend({
            closeModal: function(e) {
                var i = {
                        out_duration: 250,
                        complete: void 0
                    },
                    e = t.extend(i, e);
                t(".modal-close").off(), t(document).off("keyup.leanModal"), t("#lean-overlay").velocity({
                    opacity: 0
                }, {
                    duration: e.out_duration,
                    queue: !1,
                    ease: "easeOutQuart"
                }), t(this).hasClass("bottom-sheet") ? t(this).velocity({
                    bottom: "-100%",
                    opacity: 0
                }, {
                    duration: e.out_duration,
                    queue: !1,
                    ease: "easeOutCubic",
                    complete: function() {
                        t("#lean-overlay").css({
                            display: "none"
                        }), "function" == typeof e.complete && e.complete(), t("#lean-overlay").remove()
                    }
                }) : t(this).fadeOut(e.out_duration, function() {
                    t(this).css({
                        top: 0
                    }), t("#lean-overlay").css({
                        display: "none"
                    }), "function" == typeof e.complete && e.complete(), t("#lean-overlay").remove()
                })
            }
        }), t.fn.extend({
            leanModal: function(e) {
                return this.each(function() {
                    t(this).click(function(i) {
                        var n = t(this).attr("href") || "#" + t(this).data("target");
                        t(n).openModal(e), i.preventDefault()
                    })
                })
            }
        })
    }(jQuery),
    function(t) {
        t.fn.materialbox = function() {
            return this.each(function() {
                function e() {
                    n = !1;
                    var e = o.parent(".material-placeholder"),
                        a = (window.innerWidth, window.innerHeight, o.data("width")),
                        s = o.data("height");
                    o.velocity("stop", !0), t("#materialbox-overlay").velocity("stop", !0), t(".materialbox-caption").velocity("stop", !0), t("#materialbox-overlay").velocity({
                        opacity: 0
                    }, {
                        duration: r,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            i = !1, t(this).remove()
                        }
                    }), o.velocity({
                        width: a,
                        height: s,
                        left: 0,
                        top: 0
                    }, {
                        duration: r,
                        queue: !1,
                        easing: "easeOutQuad"
                    }), t(".materialbox-caption").velocity({
                        opacity: 0
                    }, {
                        duration: r,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            e.css({
                                height: "",
                                width: "",
                                position: "",
                                top: "",
                                left: ""
                            }), o.css({
                                height: "",
                                top: "",
                                left: "",
                                width: "",
                                "max-width": "",
                                position: "",
                                "z-index": ""
                            }), o.removeClass("active"), n = !0, t(this).remove()
                        }
                    })
                }
                if (!t(this).hasClass("intialized")) {
                    t(this).addClass("intialized");
                    var i = !1,
                        n = !0,
                        a = 275,
                        r = 200,
                        o = t(this),
                        s = t("<div></div>").addClass("material-placeholder");
                    o.wrap(s), o.on("click", function() {
                        var r = o.parent(".material-placeholder"),
                            s = window.innerWidth,
                            l = window.innerHeight,
                            u = o.width(),
                            c = o.height();
                        if (n === !1) return e(), !1;
                        if (i && n === !0) return e(), !1;
                        n = !1, o.addClass("active"), i = !0, r.css({
                            width: r[0].getBoundingClientRect().width,
                            height: r[0].getBoundingClientRect().height,
                            position: "relative",
                            top: 0,
                            left: 0
                        }), o.css({
                            position: "absolute",
                            "z-index": 1e3
                        }).data("width", u).data("height", c);
                        var d = t('<div id="materialbox-overlay"></div>').css({
                            opacity: 0
                        }).click(function() {
                            n === !0 && e()
                        });
                        if (t("body").append(d), d.velocity({
                                opacity: 1
                            }, {
                                duration: a,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), "" !== o.data("caption")) {
                            var p = t('<div class="materialbox-caption"></div>');
                            p.text(o.data("caption")), t("body").append(p), p.css({
                                display: "inline"
                            }), p.velocity({
                                opacity: 1
                            }, {
                                duration: a,
                                queue: !1,
                                easing: "easeOutQuad"
                            })
                        }
                        var f = 0,
                            h = u / s,
                            v = c / l,
                            g = 0,
                            m = 0;
                        h > v ? (f = c / u, g = .9 * s, m = .9 * s * f) : (f = u / c, g = .9 * l * f, m = .9 * l), o.hasClass("responsive-img") ? o.velocity({
                            "max-width": g,
                            width: u
                        }, {
                            duration: 0,
                            queue: !1,
                            complete: function() {
                                o.css({
                                    left: 0,
                                    top: 0
                                }).velocity({
                                    height: m,
                                    width: g,
                                    left: t(document).scrollLeft() + s / 2 - o.parent(".material-placeholder").offset().left - g / 2,
                                    top: t(document).scrollTop() + l / 2 - o.parent(".material-placeholder").offset().top - m / 2
                                }, {
                                    duration: a,
                                    queue: !1,
                                    easing: "easeOutQuad",
                                    complete: function() {
                                        n = !0
                                    }
                                })
                            }
                        }) : o.css("left", 0).css("top", 0).velocity({
                            height: m,
                            width: g,
                            left: t(document).scrollLeft() + s / 2 - o.parent(".material-placeholder").offset().left - g / 2,
                            top: t(document).scrollTop() + l / 2 - o.parent(".material-placeholder").offset().top - m / 2
                        }, {
                            duration: a,
                            queue: !1,
                            easing: "easeOutQuad",
                            complete: function() {
                                n = !0
                            }
                        })
                    }), t(window).scroll(function() {
                        i && e()
                    }), t(document).keyup(function(t) {
                        27 === t.keyCode && n === !0 && i && e()
                    })
                }
            })
        }, t(document).ready(function() {
            t(".materialboxed").materialbox()
        })
    }(jQuery),
    function(t) {
        t.fn.parallax = function() {
            var e = t(window).width();
            return this.each(function() {
                function i(i) {
                    var a;
                    a = 601 > e ? n.height() > 0 ? n.height() : n.children("img").height() : n.height() > 0 ? n.height() : 500;
                    var r = n.children("img").first(),
                        o = r.height(),
                        s = o - a,
                        l = n.offset().top + a,
                        u = n.offset().top,
                        c = t(window).scrollTop(),
                        d = window.innerHeight,
                        p = c + d,
                        f = (p - u) / (a + d),
                        h = Math.round(s * f);
                    i && r.css("display", "block"), l > c && c + d > u && r.css("transform", "translate3D(-50%," + h + "px, 0)")
                }
                var n = t(this);
                n.addClass("parallax"), n.children("img").one("load", function() {
                    i(!0)
                }).each(function() {
                    this.complete && t(this).load()
                }), t(window).scroll(function() {
                    e = t(window).width(), i(!1)
                }), t(window).resize(function() {
                    e = t(window).width(), i(!1)
                })
            })
        }
    }(jQuery),
    function(t) {
        var e = {
            init: function() {
                return this.each(function() {
                    {
                        var e = t(this);
                        t(window).width()
                    }
                    e.width("100%");
                    var i = t(this).children("li").length;
                    e.children("li").each(function() {
                        t(this).width(100 / i + "%")
                    });
                    var n, a, r = e.find("li.tab a"),
                        o = e.width(),
                        s = e.find("li").first().outerWidth(),
                        l = 0;
                    n = t(r.filter('[href="' + location.hash + '"]')), 0 === n.length && (n = t(this).find("li.tab a.active").first()), 0 === n.length && (n = t(this).find("li.tab a").first()), n.addClass("active"), l = r.index(n), 0 > l && (l = 0), a = t(n[0].hash), e.append('<div class="indicator"></div>');
                    var u = e.find(".indicator");
                    e.is(":visible") && (u.css({
                        right: o - (l + 1) * s
                    }), u.css({
                        left: l * s
                    })), t(window).resize(function() {
                        o = e.width(), s = e.find("li").first().outerWidth(), 0 > l && (l = 0), 0 !== s && 0 !== o && (u.css({
                            right: o - (l + 1) * s
                        }), u.css({
                            left: l * s
                        }))
                    }), r.not(n).each(function() {
                        t(this.hash).hide()
                    }), e.on("click", "a", function(i) {
                        o = e.width(), s = e.find("li").first().outerWidth(), n.removeClass("active"), a.hide(), n = t(this), a = t(this.hash), r = e.find("li.tab a"), n.addClass("active");
                        var c = l;
                        l = r.index(t(this)), 0 > l && (l = 0), a.show(), l - c >= 0 ? (u.velocity({
                            right: o - (l + 1) * s
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        }), u.velocity({
                            left: l * s
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad",
                            delay: 90
                        })) : (u.velocity({
                            left: l * s
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        }), u.velocity({
                            right: o - (l + 1) * s
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad",
                            delay: 90
                        })), i.preventDefault()
                    })
                })
            },
            select_tab: function(t) {
                this.find('a[href="#' + t + '"]').trigger("click")
            }
        };
        t.fn.tabs = function(i) {
            return e[i] ? e[i].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof i && i ? void t.error("Method " + i + " does not exist on jQuery.tooltip") : e.init.apply(this, arguments)
        }, t(document).ready(function() {
            t("ul.tabs").tabs()
        })
    }(jQuery),
    function(t) {
        t.fn.tooltip = function(e) {
            var i = null,
                n = !1,
                a = null,
                r = 5,
                o = {
                    delay: 350
                };
            return e = t.extend(o, e), t(".material-tooltip").remove(), this.each(function() {
                var o = t(this),
                    s = t("<span></span>").text(o.attr("data-tooltip")),
                    l = t("<div></div>");
                l.addClass("material-tooltip").append(s), l.appendTo(t("body"));
                var u = t("<div></div>").addClass("backdrop");
                u.appendTo(l), u.css({
                    top: 0,
                    left: 0
                }), t(this).off("mouseenter mouseleave"), t(this).on({
                    mouseenter: function() {
                        var t = o.data("delay");
                        t = void 0 == t || "" == t ? e.delay : t, i = 0, a = setInterval(function() {
                            if (i += 10, i >= t && 0 == n) {
                                n = !0, l.css({
                                    display: "block",
                                    left: "0px",
                                    top: "0px"
                                }), l.children("span").text(o.attr("data-tooltip"));
                                var e = o.outerWidth(),
                                    a = o.outerHeight(),
                                    s = o.attr("data-position"),
                                    c = l.outerHeight(),
                                    d = l.outerWidth(),
                                    p = "0px",
                                    f = "0px",
                                    h = 8;
                                "top" === s ? (l.css({
                                    top: o.offset().top - c - r,
                                    left: o.offset().left + e / 2 - d / 2
                                }), p = "-10px", u.css({
                                    borderRadius: "14px 14px 0 0",
                                    transformOrigin: "50% 90%",
                                    marginTop: c,
                                    marginLeft: d / 2 - u.width() / 2
                                })) : "left" === s ? (l.css({
                                    top: o.offset().top + a / 2 - c / 2,
                                    left: o.offset().left - d - r
                                }), f = "-10px", u.css({
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "14px 0 0 14px",
                                    transformOrigin: "95% 50%",
                                    marginTop: c / 2,
                                    marginLeft: d
                                })) : "right" === s ? (l.css({
                                    top: o.offset().top + a / 2 - c / 2,
                                    left: o.offset().left + e + r
                                }), f = "+10px", u.css({
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "0 14px 14px 0",
                                    transformOrigin: "5% 50%",
                                    marginTop: c / 2,
                                    marginLeft: "0px"
                                })) : (l.css({
                                    top: o.offset().top + o.outerHeight() + r,
                                    left: o.offset().left + e / 2 - d / 2
                                }), p = "+10px", u.css({
                                    marginLeft: d / 2 - u.width() / 2
                                })), h = d / 8, 8 > h && (h = 8), ("right" === s || "left" === s) && (h = d / 10, 6 > h && (h = 6)), l.velocity({
                                    opacity: 1,
                                    marginTop: p,
                                    marginLeft: f
                                }, {
                                    duration: 350,
                                    queue: !1
                                }), u.css({
                                    display: "block"
                                }).velocity({
                                    opacity: 1
                                }, {
                                    duration: 55,
                                    delay: 0,
                                    queue: !1
                                }).velocity({
                                    scale: h
                                }, {
                                    duration: 300,
                                    delay: 0,
                                    queue: !1,
                                    easing: "easeInOutQuad"
                                })
                            }
                        }, 10)
                    },
                    mouseleave: function() {
                        clearInterval(a), i = 0, l.velocity({
                            opacity: 0,
                            marginTop: 0,
                            marginLeft: 0
                        }, {
                            duration: 225,
                            queue: !1,
                            delay: 275
                        }), u.velocity({
                            opacity: 0,
                            scale: 1
                        }, {
                            duration: 225,
                            delay: 275,
                            queue: !1,
                            complete: function() {
                                u.css("display", "none"), l.css("display", "none"), n = !1
                            }
                        })
                    }
                })
            })
        }, t(document).ready(function() {
            t(".tooltipped").tooltip()
        })
    }(jQuery),
    function(t) {
        "use strict";

        function e(t) {
            return null !== t && t === t.window
        }

        function i(t) {
            return e(t) ? t : 9 === t.nodeType && t.defaultView
        }

        function n(t) {
            var e, n, a = {
                    top: 0,
                    left: 0
                },
                r = t && t.ownerDocument;
            return e = r.documentElement, "undefined" != typeof t.getBoundingClientRect && (a = t.getBoundingClientRect()), n = i(r), {
                top: a.top + n.pageYOffset - e.clientTop,
                left: a.left + n.pageXOffset - e.clientLeft
            }
        }

        function a(t) {
            var e = "";
            for (var i in t) t.hasOwnProperty(i) && (e += i + ":" + t[i] + ";");
            return e
        }

        function r(t) {
            if (c.allowEvent(t) === !1) return null;
            for (var e = null, i = t.target || t.srcElement; null !== i.parentElement;) {
                if (!(i instanceof SVGElement || -1 === i.className.indexOf("waves-effect"))) {
                    e = i;
                    break
                }
                if (i.classList.contains("waves-effect")) {
                    e = i;
                    break
                }
                i = i.parentElement
            }
            return e
        }

        function o(e) {
            var i = r(e);
            null !== i && (u.show(e, i), "ontouchstart" in t && (i.addEventListener("touchend", u.hide, !1), i.addEventListener("touchcancel", u.hide, !1)), i.addEventListener("mouseup", u.hide, !1), i.addEventListener("mouseleave", u.hide, !1))
        }
        var s = s || {},
            l = document.querySelectorAll.bind(document),
            u = {
                duration: 750,
                show: function(t, e) {
                    if (2 === t.button) return !1;
                    var i = e || this,
                        r = document.createElement("div");
                    r.className = "waves-ripple", i.appendChild(r);
                    var o = n(i),
                        s = t.pageY - o.top,
                        l = t.pageX - o.left,
                        c = "scale(" + i.clientWidth / 100 * 10 + ")";
                    "touches" in t && (s = t.touches[0].pageY - o.top, l = t.touches[0].pageX - o.left), r.setAttribute("data-hold", Date.now()), r.setAttribute("data-scale", c), r.setAttribute("data-x", l), r.setAttribute("data-y", s);
                    var d = {
                        top: s + "px",
                        left: l + "px"
                    };
                    r.className = r.className + " waves-notransition", r.setAttribute("style", a(d)), r.className = r.className.replace("waves-notransition", ""), d["-webkit-transform"] = c, d["-moz-transform"] = c, d["-ms-transform"] = c, d["-o-transform"] = c, d.transform = c, d.opacity = "1", d["-webkit-transition-duration"] = u.duration + "ms", d["-moz-transition-duration"] = u.duration + "ms", d["-o-transition-duration"] = u.duration + "ms", d["transition-duration"] = u.duration + "ms", d["-webkit-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)", d["-moz-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)", d["-o-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)", d["transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)", r.setAttribute("style", a(d))
                },
                hide: function(t) {
                    c.touchup(t);
                    var e = this,
                        i = (1.4 * e.clientWidth, null),
                        n = e.getElementsByClassName("waves-ripple");
                    if (!(n.length > 0)) return !1;
                    i = n[n.length - 1];
                    var r = i.getAttribute("data-x"),
                        o = i.getAttribute("data-y"),
                        s = i.getAttribute("data-scale"),
                        l = Date.now() - Number(i.getAttribute("data-hold")),
                        d = 350 - l;
                    0 > d && (d = 0), setTimeout(function() {
                        var t = {
                            top: o + "px",
                            left: r + "px",
                            opacity: "0",
                            "-webkit-transition-duration": u.duration + "ms",
                            "-moz-transition-duration": u.duration + "ms",
                            "-o-transition-duration": u.duration + "ms",
                            "transition-duration": u.duration + "ms",
                            "-webkit-transform": s,
                            "-moz-transform": s,
                            "-ms-transform": s,
                            "-o-transform": s,
                            transform: s
                        };
                        i.setAttribute("style", a(t)), setTimeout(function() {
                            try {
                                e.removeChild(i)
                            } catch (t) {
                                return !1
                            }
                        }, u.duration)
                    }, d)
                },
                wrapInput: function(t) {
                    for (var e = 0; e < t.length; e++) {
                        var i = t[e];
                        if ("input" === i.tagName.toLowerCase()) {
                            var n = i.parentNode;
                            if ("i" === n.tagName.toLowerCase() && -1 !== n.className.indexOf("waves-effect")) continue;
                            var a = document.createElement("i");
                            a.className = i.className + " waves-input-wrapper";
                            var r = i.getAttribute("style");
                            r || (r = ""), a.setAttribute("style", r), i.className = "waves-button-input", i.removeAttribute("style"), n.replaceChild(a, i), a.appendChild(i)
                        }
                    }
                }
            },
            c = {
                touches: 0,
                allowEvent: function(t) {
                    var e = !0;
                    return "touchstart" === t.type ? c.touches += 1 : "touchend" === t.type || "touchcancel" === t.type ? setTimeout(function() {
                        c.touches > 0 && (c.touches -= 1)
                    }, 500) : "mousedown" === t.type && c.touches > 0 && (e = !1), e
                },
                touchup: function(t) {
                    c.allowEvent(t)
                }
            };
        s.displayEffect = function(e) {
            e = e || {}, "duration" in e && (u.duration = e.duration), u.wrapInput(l(".waves-effect")), "ontouchstart" in t && document.body.addEventListener("touchstart", o, !1), document.body.addEventListener("mousedown", o, !1)
        }, s.attach = function(e) {
            "input" === e.tagName.toLowerCase() && (u.wrapInput([e]), e = e.parentElement), "ontouchstart" in t && e.addEventListener("touchstart", o, !1), e.addEventListener("mousedown", o, !1)
        }, t.Waves = s, document.addEventListener("DOMContentLoaded", function() {
            s.displayEffect()
        }, !1)
    }(window), Materialize.toast = function(t, e, i, n) {
        function a(t) {
            var e = document.createElement("div");
            if (e.classList.add("toast"), i)
                for (var a = i.split(" "), r = 0, o = a.length; o > r; r++) e.classList.add(a[r]);
            e.innerHTML = t;
            var s = new Hammer(e, {
                prevent_default: !1
            });
            return s.on("pan", function(t) {
                var i = t.deltaX,
                    n = 80;
                e.classList.contains("panning") || e.classList.add("panning");
                var a = 1 - Math.abs(i / n);
                0 > a && (a = 0), Vel(e, {
                    left: i,
                    opacity: a
                }, {
                    duration: 50,
                    queue: !1,
                    easing: "easeOutQuad"
                })
            }), s.on("panend", function(t) {
                var i = t.deltaX,
                    a = 80;
                Math.abs(i) > a ? Vel(e, {
                    marginTop: "-40px"
                }, {
                    duration: 375,
                    easing: "easeOutExpo",
                    queue: !1,
                    complete: function() {
                        "function" == typeof n && n(), e.parentNode.removeChild(e)
                    }
                }) : (e.classList.remove("panning"), Vel(e, {
                    left: 0,
                    opacity: 1
                }, {
                    duration: 300,
                    easing: "easeOutExpo",
                    queue: !1
                }))
            }), e
        }
        i = i || "";
        var r = document.getElementById("toast-container");
        if (null === r) {
            var r = document.createElement("div");
            r.id = "toast-container", document.body.appendChild(r)
        }
        var o = a(t);
        r.appendChild(o), o.style.top = "35px", o.style.opacity = 0, Vel(o, {
            top: "0px",
            opacity: 1
        }, {
            duration: 300,
            easing: "easeOutCubic",
            queue: !1
        });
        var s = e,
            l = setInterval(function() {
                null === o.parentNode && window.clearInterval(l), o.classList.contains("panning") || (s -= 20), 0 >= s && (Vel(o, {
                    opacity: 0,
                    marginTop: "-40px"
                }, {
                    duration: 375,
                    easing: "easeOutExpo",
                    queue: !1,
                    complete: function() {
                        "function" == typeof n && n(), this[0].parentNode.removeChild(this[0])
                    }
                }), window.clearInterval(l))
            }, 20)
    },
    function(t) {
        var e = {
            init: function(e) {
                var i = {
                    menuWidth: 240,
                    edge: "left",
                    closeOnClick: !1
                };
                e = t.extend(i, e), t(this).each(function() {
                    function i(i) {
                        r = !1, o = !1, t("#sidenav-overlay").velocity({
                            opacity: 0
                        }, {
                            duration: 200,
                            queue: !1,
                            easing: "easeOutQuad",
                            complete: function() {
                                t(this).remove()
                            }
                        }), "left" === e.edge ? (t(".drag-target").css({
                            width: "",
                            right: "",
                            left: "0"
                        }), a.velocity({
                            left: -1 * (e.menuWidth + 10)
                        }, {
                            duration: 200,
                            queue: !1,
                            easing: "easeOutCubic",
                            complete: function() {
                                1 == i && (a.removeAttr("style"), a.css("width", e.menuWidth))
                            }
                        })) : (t(".drag-target").css({
                            width: "",
                            right: "0",
                            left: ""
                        }), a.velocity({
                            right: -1 * (e.menuWidth + 10)
                        }, {
                            duration: 200,
                            queue: !1,
                            easing: "easeOutCubic",
                            complete: function() {
                                1 == i && (a.removeAttr("style"), a.css("width", e.menuWidth))
                            }
                        }))
                    }
                    var n = t(this),
                        a = t("#" + n.attr("data-activates"));
                    240 != e.menuWidth && a.css("width", e.menuWidth), t("body").append(t('<div class="drag-target"></div>')), "left" == e.edge ? (a.css("left", -1 * (e.menuWidth + 10)), t(".drag-target").css({
                        left: 0
                    })) : (a.addClass("right-aligned").css("right", -1 * (e.menuWidth + 10)).css("left", ""), t(".drag-target").css({
                        right: 0
                    })), a.hasClass("fixed") && t(window).width() > 992 && a.css("left", 0), a.hasClass("fixed") && t(window).resize(function() {
                        window.innerWidth > 992 ? 0 != t("#sidenav-overlay").css("opacity") && o ? i(!0) : (a.removeAttr("style"), a.css("width", e.menuWidth)) : o === !1 && ("left" === e.edge ? a.css("left", -1 * (e.menuWidth + 10)) : a.css("right", -1 * (e.menuWidth + 10)))
                    }), 1 == e.closeOnClick && a.on("click.itemclick", "a:not(.collapsible-header)", function() {
                        i()
                    });
                    var r = !1,
                        o = !1;
                    t(".drag-target").on("click", function() {
                        i()
                    }), t(".drag-target").hammer({
                        prevent_default: !1
                    }).bind("pan", function(n) {
                        if ("touch" == n.gesture.pointerType) {
                            {
                                var r = (n.gesture.direction, n.gesture.center.x);
                                n.gesture.center.y, n.gesture.velocityX
                            }
                            if (0 === t("#sidenav-overlay").length) {
                                var s = t('<div id="sidenav-overlay"></div>');
                                s.css("opacity", 0).click(function() {
                                    i()
                                }), t("body").append(s)
                            }
                            if ("left" === e.edge && (r > e.menuWidth ? r = e.menuWidth : 0 > r && (r = 0)), "left" === e.edge) r < e.menuWidth / 2 ? o = !1 : r >= e.menuWidth / 2 && (o = !0), a.css("left", r - e.menuWidth);
                            else {
                                r < t(window).width() - e.menuWidth / 2 ? o = !0 : r >= t(window).width() - e.menuWidth / 2 && (o = !1);
                                var l = -1 * (r - e.menuWidth / 2);
                                l > 0 && (l = 0), a.css("right", l)
                            }
                            if ("left" === e.edge) {
                                var u = r / e.menuWidth;
                                t("#sidenav-overlay").velocity({
                                    opacity: u
                                }, {
                                    duration: 50,
                                    queue: !1,
                                    easing: "easeOutQuad"
                                })
                            } else {
                                var u = Math.abs((r - t(window).width()) / e.menuWidth);
                                t("#sidenav-overlay").velocity({
                                    opacity: u
                                }, {
                                    duration: 50,
                                    queue: !1,
                                    easing: "easeOutQuad"
                                })
                            }
                        }
                    }).bind("panend", function(i) {
                        if ("touch" == i.gesture.pointerType) {
                            var n = i.gesture.velocityX;
                            r = !1, "left" === e.edge ? o && .3 >= n || -.5 > n ? (a.velocity({
                                left: 0
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), t("#sidenav-overlay").velocity({
                                opacity: 1
                            }, {
                                duration: 50,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), t(".drag-target").css({
                                width: "50%",
                                right: 0,
                                left: ""
                            })) : (!o || n > .3) && (a.velocity({
                                left: -1 * (e.menuWidth + 10)
                            }, {
                                duration: 200,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), t("#sidenav-overlay").velocity({
                                opacity: 0
                            }, {
                                duration: 200,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    t(this).remove()
                                }
                            }), t(".drag-target").css({
                                width: "10px",
                                right: "",
                                left: 0
                            })) : o && n >= -.3 || n > .5 ? (a.velocity({
                                right: 0
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), t("#sidenav-overlay").velocity({
                                opacity: 1
                            }, {
                                duration: 50,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), t(".drag-target").css({
                                width: "50%",
                                right: "",
                                left: 0
                            })) : (!o || -.3 > n) && (a.velocity({
                                right: -1 * (e.menuWidth + 10)
                            }, {
                                duration: 200,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), t("#sidenav-overlay").velocity({
                                opacity: 0
                            }, {
                                duration: 200,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    t(this).remove()
                                }
                            }), t(".drag-target").css({
                                width: "10px",
                                right: 0,
                                left: ""
                            }))
                        }
                    }), n.click(function() {
                        if (1 == o) o = !1, r = !1, i();
                        else {
                            "left" === e.edge ? (t(".drag-target").css({
                                width: "50%",
                                right: 0,
                                left: ""
                            }), a.velocity({
                                left: 0
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad"
                            })) : (t(".drag-target").css({
                                width: "50%",
                                right: "",
                                left: 0
                            }), a.velocity({
                                right: 0
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), a.css("left", ""));
                            var n = t('<div id="sidenav-overlay"></div>');
                            n.css("opacity", 0).click(function() {
                                o = !1, r = !1, i(), n.velocity({
                                    opacity: 0
                                }, {
                                    duration: 300,
                                    queue: !1,
                                    easing: "easeOutQuad",
                                    complete: function() {
                                        t(this).remove()
                                    }
                                })
                            }), t("body").append(n), n.velocity({
                                opacity: 1
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    o = !0, r = !1
                                }
                            })
                        }
                        return !1
                    })
                })
            },
            show: function() {
                this.trigger("click")
            },
            hide: function() {
                t("#sidenav-overlay").trigger("click")
            }
        };
        t.fn.sideNav = function(i) {
            return e[i] ? e[i].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof i && i ? void t.error("Method " + i + " does not exist on jQuery.tooltip") : e.init.apply(this, arguments)
        }
    }(jQuery),
    function(t) {
        function e(e, i, n, a) {
            var r = t();
            return t.each(o, function(t, o) {
                if (o.height() > 0) {
                    var s = o.offset().top,
                        l = o.offset().left,
                        u = l + o.width(),
                        c = s + o.height(),
                        d = !(l > i || a > u || s > n || e > c);
                    d && r.push(o)
                }
            }), r
        }

        function i() {
            ++u;
            var i = r.scrollTop(),
                n = r.scrollLeft(),
                a = n + r.width(),
                o = i + r.height(),
                l = e(i + c.top + 80, a + c.right, o + c.bottom, n + c.left);
            t.each(l, function(t, e) {
                var i = e.data("scrollSpy:ticks");
                "number" != typeof i && e.triggerHandler("scrollSpy:enter"), e.data("scrollSpy:ticks", u)
            }), t.each(s, function(t, e) {
                var i = e.data("scrollSpy:ticks");
                "number" == typeof i && i !== u && (e.triggerHandler("scrollSpy:exit"), e.data("scrollSpy:ticks", null))
            }), s = l
        }

        function n() {
            r.trigger("scrollSpy:winSize")
        }

        function a(t, e, i) {
            var n, a, r, o = null,
                s = 0;
            i || (i = {});
            var l = function() {
                s = i.leading === !1 ? 0 : d(), o = null, r = t.apply(n, a), n = a = null
            };
            return function() {
                var u = d();
                s || i.leading !== !1 || (s = u);
                var c = e - (u - s);
                return n = this, a = arguments, 0 >= c ? (clearTimeout(o), o = null, s = u, r = t.apply(n, a), n = a = null) : o || i.trailing === !1 || (o = setTimeout(l, c)), r
            }
        }
        var r = t(window),
            o = [],
            s = [],
            l = !1,
            u = 0,
            c = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            d = Date.now || function() {
                return (new Date).getTime()
            };
        t.scrollSpy = function(e, n) {
            var s = [];
            e = t(e), e.each(function(e, i) {
                o.push(t(i)), t(i).data("scrollSpy:id", e), t("a[href=#" + t(i).attr("id") + "]").click(function(e) {
                    e.preventDefault();
                    var i = t(this.hash).offset().top + 1;
                    t("html, body").animate({
                        scrollTop: i - 60
                    }, {
                        duration: 400,
                        queue: !1,
                        easing: "easeOutCubic"
                    })
                })
            }), n = n || {
                throttle: 100
            }, c.top = n.offsetTop || 0, c.right = n.offsetRight || 0, c.bottom = n.offsetBottom || 0, c.left = n.offsetLeft || 0;
            var u = a(i, n.throttle || 100),
                d = function() {
                    t(document).ready(u)
                };
            return l || (r.on("scroll", d), r.on("resize", d), l = !0), setTimeout(d, 0), e.on("scrollSpy:enter", function() {
                s = t.grep(s, function(t) {
                    return 0 != t.height()
                });
                var e = t(this);
                s[0] ? (t("a[href=#" + s[0].attr("id") + "]").removeClass("active"), e.data("scrollSpy:id") < s[0].data("scrollSpy:id") ? s.unshift(t(this)) : s.push(t(this))) : s.push(t(this)), t("a[href=#" + s[0].attr("id") + "]").addClass("active")
            }), e.on("scrollSpy:exit", function() {
                if (s = t.grep(s, function(t) {
                        return 0 != t.height()
                    }), s[0]) {
                    t("a[href=#" + s[0].attr("id") + "]").removeClass("active");
                    var e = t(this);
                    s = t.grep(s, function(t) {
                        return t.attr("id") != e.attr("id")
                    }), s[0] && t("a[href=#" + s[0].attr("id") + "]").addClass("active")
                }
            }), e
        }, t.winSizeSpy = function(e) {
            return t.winSizeSpy = function() {
                return r
            }, e = e || {
                throttle: 100
            }, r.on("resize", a(n, e.throttle || 100))
        }, t.fn.scrollSpy = function(e) {
            return t.scrollSpy(t(this), e)
        }
    }(jQuery),
    function(t) {
        t(document).ready(function() {
            function e(e) {
                n.text(e.val() + "\n");
                var i = n.html().replace(/\n/g, "<br>");
                n.html(i), e.is(":visible") ? n.css("width", e.width()) : n.css("width", t(window).width() / 2), e.css("height", n.height())
            }
            Materialize.updateTextFields = function() {
                var e = "input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea";
                t(e).each(function(e, i) {
                    t(i).val().length > 0 || void 0 !== t(this).attr("placeholder") ? t(this).siblings("label, i").addClass("active") : t(this).siblings("label, i").removeClass("active")
                })
            };
            var i = "input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea";
            t("input[autofocus]").siblings("label, i").addClass("active"), t(document).on("change", i, function() {
                (0 !== t(this).val().length || void 0 !== t(this).attr("placeholder")) && t(this).siblings("label, i").addClass("active"), validate_field(t(this))
            }), t(document).ready(function() {
                Materialize.updateTextFields()
            }), t(document).on("reset", function(e) {
                t(e.target).is("form") && (t(this).find(i).removeClass("valid").removeClass("invalid"), t(this).find(i).siblings("label, i").removeClass("active"), t(this).find("select.initialized").each(function() {
                    var e = t(this).find("option[selected]").text();
                    t(this).siblings("input.select-dropdown").val(e)
                }))
            }), t(document).on("focus", i, function() {
                t(this).siblings("label, i").addClass("active")
            }), t(document).on("blur", i, function() {
                0 === t(this).val().length && void 0 === t(this).attr("placeholder") && t(this).siblings("label, i").removeClass("active"), validate_field(t(this))
            }), validate_field = function(t) {
                0 === t.val().length ? t.hasClass("validate") && (t.removeClass("valid"), t.removeClass("invalid")) : t.hasClass("validate") && (t.is(":valid") ? (t.removeClass("invalid"), t.addClass("valid")) : (t.removeClass("valid"), t.addClass("invalid")))
            };
            var n = t(".hiddendiv").first();
            n.length || (n = t('<div class="hiddendiv common"></div>'), t("body").append(n));
            var a = ".materialize-textarea";
            t(a).each(function() {
                var i = t(this);
                i.val().length && e(i)
            }), t("body").on("keyup keydown", a, function() {
                e(t(this))
            }), t(".file-field").each(function() {
                var e = t(this).find("input.file-path");
                t(this).find('input[type="file"]').change(function() {
                    e.val(t(this)[0].files[0].name), e.trigger("change")
                })
            });
            var r = "input[type=range]",
                o = !1;
            t(r).each(function() {
                var e = t('<span class="thumb"><span class="value"></span></span>');
                t(this).after(e)
            });
            var s = ".range-field";
            t(document).on("mousedown", s, function(e) {
                var i = t(this).children(".thumb");
                i.length <= 0 && (i = t('<span class="thumb"><span class="value"></span></span>'), t(this).append(i)), o = !0, t(this).addClass("active"), i.hasClass("active") || i.velocity({
                    height: "30px",
                    width: "30px",
                    top: "-20px",
                    marginLeft: "-15px"
                }, {
                    duration: 300,
                    easing: "easeOutExpo"
                });
                var n = e.pageX - t(this).offset().left,
                    a = t(this).outerWidth();
                0 > n ? n = 0 : n > a && (n = a), i.addClass("active").css("left", n), i.find(".value").html(t(this).children("input[type=range]").val())
            }), t(document).on("mouseup", s, function() {
                o = !1, t(this).removeClass("active")
            }), t(document).on("mousemove", s, function(e) {
                var i = t(this).children(".thumb");
                if (o) {
                    i.hasClass("active") || i.velocity({
                        height: "30px",
                        width: "30px",
                        top: "-20px",
                        marginLeft: "-15px"
                    }, {
                        duration: 300,
                        easing: "easeOutExpo"
                    });
                    var n = e.pageX - t(this).offset().left,
                        a = t(this).outerWidth();
                    0 > n ? n = 0 : n > a && (n = a), i.addClass("active").css("left", n), i.find(".value").html(t(this).children("input[type=range]").val())
                }
            }), t(document).on("mouseout", s, function() {
                if (!o) {
                    var e = t(this).children(".thumb");
                    e.hasClass("active") && e.velocity({
                        height: "0",
                        width: "0",
                        top: "10px",
                        marginLeft: "-6px"
                    }, {
                        duration: 100
                    }), e.removeClass("active")
                }
            })
        }), t.fn.material_select = function(e) {
            t(this).each(function() {
                if ($select = t(this), !$select.hasClass("browser-default")) {
                    var i = $select.data("select-id");
                    if (i && ($select.parent().find("i").remove(), $select.parent().find("input").remove(), $select.unwrap(), t("ul#select-options-" + i).remove()), "destroy" === e) return void $select.data("select-id", null).removeClass("initialized");
                    var n = Materialize.guid();
                    $select.data("select-id", n);
                    var a = t('<div class="select-wrapper"></div>');
                    a.addClass($select.attr("class"));
                    var r = t('<ul id="select-options-' + n + '" class="dropdown-content select-dropdown"></ul>'),
                        o = $select.children("option");
                    if (void 0 !== $select.find("option:selected")) var s = $select.find("option:selected");
                    else var s = r.first();
                    o.each(function() {
                        r.append(t('<li class="' + (t(this).is(":disabled") ? "disabled" : "") + '"><span>' + t(this).html() + "</span></li>"))
                    }), r.find("li").each(function(i) {
                        var n = $select;
                        t(this).click(function() {
                            t(this).hasClass("disabled") || (n.find("option").eq(i).prop("selected", !0), n.trigger("change"), n.siblings("input.select-dropdown").val(t(this).text()), "undefined" != typeof e && e())
                        })
                    }), $select.wrap(a);
                    var l = t('<i class="mdi-navigation-arrow-drop-down"></i>');
                    $select.is(":disabled") && l.addClass("disabled");
                    var u = t('<input type="text" class="select-dropdown" readonly="true" ' + ($select.is(":disabled") ? "disabled" : "") + ' data-activates="select-options-' + n + '" value="' + s.html() + '"/>');
                    $select.before(u), u.before(l), t("body").append(r), $select.is(":disabled") || u.dropdown({
                        hover: !1
                    }), $select.attr("tabindex") && t(u[0]).attr("tabindex", $select.attr("tabindex")), $select.addClass("initialized"), u.on("focus", function() {
                        t(this).trigger("open"), s = t(this).val(), selectedOption = r.find("li").filter(function() {
                            return t(this).text().toLowerCase() === s.toLowerCase()
                        })[0], activateOption(r, selectedOption)
                    }), u.on("blur", function() {
                        t(this).trigger("close")
                    }), activateOption = function(e, i) {
                        e.find("li.active").removeClass("active"), t(i).addClass("active"), e.scrollTo(i)
                    }, filterQuery = [], onKeyDown = function(e) {
                        return 9 == e.which ? void u.trigger("close") : 40 != e.which || r.is(":visible") ? void((13 != e.which || r.is(":visible")) && (e.preventDefault(), letter = String.fromCharCode(e.which).toLowerCase(), letter && (filterQuery.push(letter), string = filterQuery.join(""), newOption = r.find("li").filter(function() {
                            return 0 === t(this).text().toLowerCase().indexOf(string)
                        })[0], newOption && activateOption(r, newOption)), 13 == e.which && (activeOption = r.find("li.active:not(.disabled)")[0], activeOption && (t(activeOption).trigger("click"), u.trigger("close"))), 40 == e.which && (newOption = r.find("li.active").next("li:not(.disabled)")[0], newOption && activateOption(r, newOption)), 27 == e.which && u.trigger("close"), 38 == e.which && (newOption = r.find("li.active").prev("li:not(.disabled)")[0], newOption && activateOption(r, newOption)), setTimeout(function() {
                            filterQuery = []
                        }, 1e3))) : void u.trigger("open")
                    }, u.on("keydown", onKeyDown)
                }
            })
        }
    }(jQuery),
    function(t) {
        t.fn.slider = function(e) {
            var i = {
                indicators: !0,
                height: 400,
                transition: 500,
                interval: 6e3
            };
            return e = t.extend(i, e), this.each(function() {
                function i(t, e) {
                    t.hasClass("center-align") ? t.velocity({
                        opacity: 0,
                        translateY: -100
                    }, {
                        duration: e,
                        queue: !1
                    }) : t.hasClass("right-align") ? t.velocity({
                        opacity: 0,
                        translateX: 100
                    }, {
                        duration: e,
                        queue: !1
                    }) : t.hasClass("left-align") && t.velocity({
                        opacity: 0,
                        translateX: -100
                    }, {
                        duration: e,
                        queue: !1
                    })
                }

                function n(t) {
                    t >= s.length ? t = 0 : 0 > t && (t = s.length - 1), l = o.find(".active").index(), l != t && (a = s.eq(l), $caption = a.find(".caption"), a.removeClass("active"), a.velocity({
                        opacity: 0
                    }, {
                        duration: e.transition,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            s.not(".active").velocity({
                                opacity: 0,
                                translateX: 0,
                                translateY: 0
                            }, {
                                duration: 0,
                                queue: !1
                            })
                        }
                    }), i($caption, e.transition), e.indicators && u.eq(l).removeClass("active"), s.eq(t).velocity({
                        opacity: 1
                    }, {
                        duration: e.transition,
                        queue: !1,
                        easing: "easeOutQuad"
                    }), s.eq(t).find(".caption").velocity({
                        opacity: 1,
                        translateX: 0,
                        translateY: 0
                    }, {
                        duration: e.transition,
                        delay: e.transition,
                        queue: !1,
                        easing: "easeOutQuad"
                    }), s.eq(t).addClass("active"), e.indicators && u.eq(t).addClass("active"))
                }
                var a, r = t(this),
                    o = r.find("ul.slides").first(),
                    s = o.find("li"),
                    l = o.find(".active").index();
                if (-1 != l && (a = s.eq(l)), 400 != e.height && (r.height(e.height + 40), o.height(e.height)), s.find(".caption").each(function() {
                        i(t(this), 0)
                    }), s.find("img").each(function() {
                        t(this).css("background-image", "url(" + t(this).attr("src") + ")"), t(this).attr("src", "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==")
                    }), e.indicators) {
                    var u = t('<ul class="indicators"></ul>');
                    s.each(function() {
                        var i = t('<li class="indicator-item"></li>');
                        i.click(function() {
                            var i = o.parent(),
                                a = i.find(t(this)).index();
                            n(a), clearInterval($interval), $interval = setInterval(function() {
                                l = o.find(".active").index(), s.length == l + 1 ? l = 0 : l += 1, n(l)
                            }, e.transition + e.interval)
                        }), u.append(i)
                    }), r.append(u), u = r.find("ul.indicators").find("li.indicator-item")
                }
                a ? a.show() : (s.first().addClass("active").velocity({
                    opacity: 1
                }, {
                    duration: e.transition,
                    queue: !1,
                    easing: "easeOutQuad"
                }), l = 0, a = s.eq(l), e.indicators && u.eq(l).addClass("active")), a.find("img").each(function() {
                    a.find(".caption").velocity({
                        opacity: 1,
                        translateX: 0,
                        translateY: 0
                    }, {
                        duration: e.transition,
                        queue: !1,
                        easing: "easeOutQuad"
                    })
                }), $interval = setInterval(function() {
                    l = o.find(".active").index(), n(l + 1)
                }, e.transition + e.interval);
                var c = !1,
                    d = !1,
                    p = !1;
                r.hammer({
                    prevent_default: !1
                }).bind("pan", function(t) {
                    if ("touch" === t.gesture.pointerType) {
                        clearInterval($interval);
                        var e = t.gesture.direction,
                            i = t.gesture.deltaX,
                            n = t.gesture.velocityX;
                        $curr_slide = o.find(".active"), $curr_slide.velocity({
                            translateX: i
                        }, {
                            duration: 50,
                            queue: !1,
                            easing: "easeOutQuad"
                        }), 4 === e && (i > r.innerWidth() / 2 || -.65 > n) ? p = !0 : 2 === e && (i < -1 * r.innerWidth() / 2 || n > .65) && (d = !0);
                        var a;
                        d && (a = $curr_slide.next(), 0 === a.length && (a = s.first()), a.velocity({
                            opacity: 1
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        })), p && (a = $curr_slide.prev(), 0 === a.length && (a = s.last()), a.velocity({
                            opacity: 1
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        }))
                    }
                }).bind("panend", function(t) {
                    "touch" === t.gesture.pointerType && ($curr_slide = o.find(".active"), c = !1, curr_index = o.find(".active").index(), p || d ? d ? (n(curr_index + 1), $curr_slide.velocity({
                        translateX: -1 * r.innerWidth()
                    }, {
                        duration: 300,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            $curr_slide.velocity({
                                opacity: 0,
                                translateX: 0
                            }, {
                                duration: 0,
                                queue: !1
                            })
                        }
                    })) : p && (n(curr_index - 1), $curr_slide.velocity({
                        translateX: r.innerWidth()
                    }, {
                        duration: 300,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            $curr_slide.velocity({
                                opacity: 0,
                                translateX: 0
                            }, {
                                duration: 0,
                                queue: !1
                            })
                        }
                    })) : $curr_slide.velocity({
                        translateX: 0
                    }, {
                        duration: 300,
                        queue: !1,
                        easing: "easeOutQuad"
                    }), d = !1, p = !1, clearInterval($interval), $interval = setInterval(function() {
                        l = o.find(".active").index(), s.length == l + 1 ? l = 0 : l += 1, n(l)
                    }, e.transition + e.interval))
                })
            })
        }
    }(jQuery),
    function(t) {
        t(document).ready(function() {
            t(document).on("click.card", ".card", function(e) {
                t(this).find(".card-reveal").length && (t(e.target).is(t(".card-reveal .card-title")) || t(e.target).is(t(".card-reveal .card-title i")) ? t(this).find(".card-reveal").velocity({
                    translateY: 0
                }, {
                    duration: 225,
                    queue: !1,
                    easing: "easeInOutQuad",
                    complete: function() {
                        t(this).css({
                            display: "none"
                        })
                    }
                }) : (t(e.target).is(t(".card .activator")) || t(e.target).is(t(".card .activator i"))) && t(this).find(".card-reveal").css({
                    display: "block"
                }).velocity("stop", !1).velocity({
                    translateY: "-100%"
                }, {
                    duration: 300,
                    queue: !1,
                    easing: "easeInOutQuad"
                }))
            })
        })
    }(jQuery),
    function(t) {
        t(document).ready(function() {
            t.fn.pushpin = function(e) {
                var i = {
                    top: 0,
                    bottom: 1 / 0,
                    offset: 0
                };
                return e = t.extend(i, e), $index = 0, this.each(function() {
                    function i(t) {
                        t.removeClass("pin-top"), t.removeClass("pinned"), t.removeClass("pin-bottom")
                    }

                    function n(n, a) {
                        n.each(function() {
                            e.top <= a && e.bottom >= a && !t(this).hasClass("pinned") && (i(t(this)), t(this).css("top", e.offset), t(this).addClass("pinned")), a < e.top && !t(this).hasClass("pin-top") && (i(t(this)), t(this).css("top", 0), t(this).addClass("pin-top")), a > e.bottom && !t(this).hasClass("pin-bottom") && (i(t(this)), t(this).addClass("pin-bottom"), t(this).css("top", e.bottom - o))
                        })
                    }
                    var a = Materialize.guid(),
                        r = t(this),
                        o = t(this).offset().top;
                    n(r, t(window).scrollTop()), t(window).on("scroll." + a, function() {
                        var i = t(window).scrollTop() + e.offset;
                        n(r, i)
                    })
                })
            }
        })
    }(jQuery),
    function(t) {
        t(document).ready(function() {
            t.fn.reverse = [].reverse, t(document).on("mouseenter.fixedActionBtn", ".fixed-action-btn", function() {
                var e = t(this);
                e.find("ul .btn-floating").velocity({
                    scaleY: ".4",
                    scaleX: ".4",
                    translateY: "40px"
                }, {
                    duration: 0
                });
                var i = 0;
                e.find("ul .btn-floating").reverse().each(function() {
                    t(this).velocity({
                        opacity: "1",
                        scaleX: "1",
                        scaleY: "1",
                        translateY: "0"
                    }, {
                        duration: 80,
                        delay: i
                    }), i += 40
                })
            }), t(document).on("mouseleave.fixedActionBtn", ".fixed-action-btn", function() {
                var e = t(this);
                e.find("ul .btn-floating").velocity("stop", !0), e.find("ul .btn-floating").velocity({
                    opacity: "0",
                    scaleX: ".4",
                    scaleY: ".4",
                    translateY: "40px"
                }, {
                    duration: 80
                })
            })
        })
    }(jQuery),
    function(t) {
        Materialize.fadeInImage = function(e) {
            var i = t(e);
            i.css({
                opacity: 0
            }), t(i).velocity({
                opacity: 1
            }, {
                duration: 650,
                queue: !1,
                easing: "easeOutSine"
            }), t(i).velocity({
                opacity: 1
            }, {
                duration: 1300,
                queue: !1,
                easing: "swing",
                step: function(e, i) {
                    i.start = 100;
                    var n = e / 100,
                        a = 150 - (100 - e) / 1.75;
                    100 > a && (a = 100), e >= 0 && t(this).css({
                        "-webkit-filter": "grayscale(" + n + ")brightness(" + a + "%)",
                        filter: "grayscale(" + n + ")brightness(" + a + "%)"
                    })
                }
            })
        }, Materialize.showStaggeredList = function(e) {
            var i = 0;
            t(e).find("li").velocity({
                translateX: "-100px"
            }, {
                duration: 0
            }), t(e).find("li").each(function() {
                t(this).velocity({
                    opacity: "1",
                    translateX: "0"
                }, {
                    duration: 800,
                    delay: i,
                    easing: [60, 10]
                }), i += 120
            })
        }, t(document).ready(function() {
            var e = !1,
                i = !1;
            t(".dismissable").each(function() {
                t(this).hammer({
                    prevent_default: !1
                }).bind("pan", function(n) {
                    if ("touch" === n.gesture.pointerType) {
                        var a = t(this),
                            r = n.gesture.direction,
                            o = n.gesture.deltaX,
                            s = n.gesture.velocityX;
                        a.velocity({
                            translateX: o
                        }, {
                            duration: 50,
                            queue: !1,
                            easing: "easeOutQuad"
                        }), 4 === r && (o > a.innerWidth() / 2 || -.75 > s) ? e = !0 : 2 === r && (o < -1 * a.innerWidth() / 2 || s > .75) && (i = !0)
                    }
                }).bind("panend", function(n) {
                    if ("touch" === n.gesture.pointerType) {
                        var a = t(this);
                        if (e || i) {
                            var r;
                            r = e ? a.innerWidth() : -1 * a.innerWidth(), a.velocity({
                                translateX: r
                            }, {
                                duration: 100,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    a.css("border", "none"), a.velocity({
                                        height: 0,
                                        padding: 0
                                    }, {
                                        duration: 200,
                                        queue: !1,
                                        easing: "easeOutQuad",
                                        complete: function() {
                                            a.remove()
                                        }
                                    })
                                }
                            })
                        } else a.velocity({
                            translateX: 0
                        }, {
                            duration: 100,
                            queue: !1,
                            easing: "easeOutQuad"
                        });
                        e = !1, i = !1
                    }
                })
            })
        })
    }(jQuery),
    function() {
        Materialize.scrollFire = function(t) {
            var e = !1;
            window.addEventListener("scroll", function() {
                e = !0
            }), setInterval(function() {
                if (e) {
                    e = !1;
                    for (var i = window.pageYOffset + window.innerHeight, n = 0; n < t.length; n++) {
                        var a = t[n],
                            r = a.selector,
                            o = a.offset,
                            s = a.callback,
                            l = document.querySelector(r);
                        if (null !== l) {
                            var u = l.getBoundingClientRect().top + document.body.scrollTop;
                            if (i > u + o && 1 != a.done) {
                                var c = new Function(s);
                                c(), a.done = !0
                            }
                        }
                    }
                }
            }, 100)
        }
    }(jQuery),
    function(t) {
        "function" == typeof define && define.amd ? define("picker", ["jquery"], t) : "object" == typeof exports ? module.exports = t(require("jquery")) : this.Picker = t(jQuery)
    }(function(t) {
        function e(r, o, l, d) {
            function p() {
                return e._.node("div", e._.node("div", e._.node("div", e._.node("div", S.component.nodes(b.open), x.box), x.wrap), x.frame), x.holder)
            }

            function f() {
                C.data(o, S).addClass(x.input).attr("tabindex", -1).val(C.data("value") ? S.get("select", w.format) : r.value), w.editable || C.on("focus." + b.id + " click." + b.id, function(t) {
                    t.preventDefault(), S.$root[0].focus()
                }).on("keydown." + b.id, g), a(r, {
                    haspopup: !0,
                    expanded: !1,
                    readonly: !1,
                    owns: r.id + "_root"
                })
            }

            function h() {
                S.$root.on({
                    keydown: g,
                    focusin: function(t) {
                        S.$root.removeClass(x.focused), t.stopPropagation()
                    },
                    "mousedown click": function(e) {
                        var i = e.target;
                        i != S.$root.children()[0] && (e.stopPropagation(), "mousedown" != e.type || t(i).is("input, select, textarea, button, option") || (e.preventDefault(), S.$root[0].focus()))
                    }
                }).on({
                    focus: function() {
                        C.addClass(x.target)
                    },
                    blur: function() {
                        C.removeClass(x.target)
                    }
                }).on("focus.toOpen", m).on("click", "[data-pick], [data-nav], [data-clear], [data-close]", function() {
                    var e = t(this),
                        i = e.data(),
                        n = e.hasClass(x.navDisabled) || e.hasClass(x.disabled),
                        a = s();
                    a = a && (a.type || a.href), (n || a && !t.contains(S.$root[0], a)) && S.$root[0].focus(), !n && i.nav ? S.set("highlight", S.component.item.highlight, {
                        nav: i.nav
                    }) : !n && "pick" in i ? S.set("select", i.pick) : i.clear ? S.clear().close(!0) : i.close && S.close(!0)
                }), a(S.$root[0], "hidden", !0)
            }

            function v() {
                var e;
                w.hiddenName === !0 ? (e = r.name, r.name = "") : (e = ["string" == typeof w.hiddenPrefix ? w.hiddenPrefix : "", "string" == typeof w.hiddenSuffix ? w.hiddenSuffix : "_submit"], e = e[0] + r.name + e[1]), S._hidden = t('<input type=hidden name="' + e + '"' + (C.data("value") || r.value ? ' value="' + S.get("select", w.formatSubmit) + '"' : "") + ">")[0], C.on("change." + b.id, function() {
                    S._hidden.value = r.value ? S.get("select", w.formatSubmit) : ""
                }), w.container ? t(w.container).append(S._hidden) : C.after(S._hidden)
            }

            function g(t) {
                var e = t.keyCode,
                    i = /^(8|46)$/.test(e);
                return 27 == e ? (S.close(), !1) : void((32 == e || i || !b.open && S.component.key[e]) && (t.preventDefault(), t.stopPropagation(), i ? S.clear().close() : S.open()))
            }

            function m(t) {
                t.stopPropagation(), "focus" == t.type && S.$root.addClass(x.focused), S.open()
            }
            if (!r) return e;
            var y = !1,
                b = {
                    id: r.id || "P" + Math.abs(~~(Math.random() * new Date))
                },
                w = l ? t.extend(!0, {}, l.defaults, d) : d || {},
                x = t.extend({}, e.klasses(), w.klass),
                C = t(r),
                k = function() {
                    return this.start()
                },
                S = k.prototype = {
                    constructor: k,
                    $node: C,
                    start: function() {
                        return b && b.start ? S : (b.methods = {}, b.start = !0, b.open = !1, b.type = r.type, r.autofocus = r == s(), r.readOnly = !w.editable, r.id = r.id || b.id, "text" != r.type && (r.type = "text"), S.component = new l(S, w), S.$root = t(e._.node("div", p(), x.picker, 'id="' + r.id + '_root" tabindex="0"')), h(), w.formatSubmit && v(), f(), w.container ? t(w.container).append(S.$root) : C.after(S.$root), S.on({
                            start: S.component.onStart,
                            render: S.component.onRender,
                            stop: S.component.onStop,
                            open: S.component.onOpen,
                            close: S.component.onClose,
                            set: S.component.onSet
                        }).on({
                            start: w.onStart,
                            render: w.onRender,
                            stop: w.onStop,
                            open: w.onOpen,
                            close: w.onClose,
                            set: w.onSet
                        }), y = i(S.$root.children()[0]), r.autofocus && S.open(), S.trigger("start").trigger("render"))
                    },
                    render: function(t) {
                        return t ? S.$root.html(p()) : S.$root.find("." + x.box).html(S.component.nodes(b.open)), S.trigger("render")
                    },
                    stop: function() {
                        return b.start ? (S.close(), S._hidden && S._hidden.parentNode.removeChild(S._hidden), S.$root.remove(), C.removeClass(x.input).removeData(o), setTimeout(function() {
                            C.off("." + b.id)
                        }, 0), r.type = b.type, r.readOnly = !1, S.trigger("stop"), b.methods = {}, b.start = !1, S) : S
                    },
                    open: function(i) {
                        return b.open ? S : (C.addClass(x.active), a(r, "expanded", !0), setTimeout(function() {
                            S.$root.addClass(x.opened), a(S.$root[0], "hidden", !1)
                        }, 0), i !== !1 && (b.open = !0, y && c.css("overflow", "hidden").css("padding-right", "+=" + n()), S.$root[0].focus(), u.on("click." + b.id + " focusin." + b.id, function(t) {
                            var e = t.target;
                            e != r && e != document && 3 != t.which && S.close(e === S.$root.children()[0])
                        }).on("keydown." + b.id, function(i) {
                            var n = i.keyCode,
                                a = S.component.key[n],
                                r = i.target;
                            27 == n ? S.close(!0) : r != S.$root[0] || !a && 13 != n ? t.contains(S.$root[0], r) && 13 == n && (i.preventDefault(), r.click()) : (i.preventDefault(), a ? e._.trigger(S.component.key.go, S, [e._.trigger(a)]) : S.$root.find("." + x.highlighted).hasClass(x.disabled) || S.set("select", S.component.item.highlight).close())
                        })), S.trigger("open"))
                    },
                    close: function(t) {
                        return t && (S.$root.off("focus.toOpen")[0].focus(), setTimeout(function() {
                            S.$root.on("focus.toOpen", m)
                        }, 0)), C.removeClass(x.active), a(r, "expanded", !1), setTimeout(function() {
                            S.$root.removeClass(x.opened + " " + x.focused), a(S.$root[0], "hidden", !0)
                        }, 0), b.open ? (b.open = !1, y && c.css("overflow", "").css("padding-right", "-=" + n()), u.off("." + b.id), S.trigger("close")) : S
                    },
                    clear: function(t) {
                        return S.set("clear", null, t)
                    },
                    set: function(e, i, n) {
                        var a, r, o = t.isPlainObject(e),
                            s = o ? e : {};
                        if (n = o && t.isPlainObject(i) ? i : n || {}, e) {
                            o || (s[e] = i);
                            for (a in s) r = s[a], a in S.component.item && (void 0 === r && (r = null), S.component.set(a, r, n)), ("select" == a || "clear" == a) && C.val("clear" == a ? "" : S.get(a, w.format)).trigger("change");
                            S.render()
                        }
                        return n.muted ? S : S.trigger("set", s)
                    },
                    get: function(t, i) {
                        if (t = t || "value", null != b[t]) return b[t];
                        if ("valueSubmit" == t) {
                            if (S._hidden) return S._hidden.value;
                            t = "value"
                        }
                        if ("value" == t) return r.value;
                        if (t in S.component.item) {
                            if ("string" == typeof i) {
                                var n = S.component.get(t);
                                return n ? e._.trigger(S.component.formats.toString, S.component, [i, n]) : ""
                            }
                            return S.component.get(t)
                        }
                    },
                    on: function(e, i, n) {
                        var a, r, o = t.isPlainObject(e),
                            s = o ? e : {};
                        if (e) {
                            o || (s[e] = i);
                            for (a in s) r = s[a], n && (a = "_" + a), b.methods[a] = b.methods[a] || [], b.methods[a].push(r)
                        }
                        return S
                    },
                    off: function() {
                        var t, e, i = arguments;
                        for (t = 0, namesCount = i.length; t < namesCount; t += 1) e = i[t], e in b.methods && delete b.methods[e];
                        return S
                    },
                    trigger: function(t, i) {
                        var n = function(t) {
                            var n = b.methods[t];
                            n && n.map(function(t) {
                                e._.trigger(t, S, [i])
                            })
                        };
                        return n("_" + t), n(t), S
                    }
                };
            return new k
        }

        function i(t) {
            var e, i = "position";
            return t.currentStyle ? e = t.currentStyle[i] : window.getComputedStyle && (e = getComputedStyle(t)[i]), "fixed" == e
        }

        function n() {
            if (c.height() <= l.height()) return 0;
            var e = t('<div style="visibility:hidden;width:100px" />').appendTo("body"),
                i = e[0].offsetWidth;
            e.css("overflow", "scroll");
            var n = t('<div style="width:100%" />').appendTo(e),
                a = n[0].offsetWidth;
            return e.remove(), i - a
        }

        function a(e, i, n) {
            if (t.isPlainObject(i))
                for (var a in i) r(e, a, i[a]);
            else r(e, i, n)
        }

        function r(t, e, i) {
            t.setAttribute(("role" == e ? "" : "aria-") + e, i)
        }

        function o(e, i) {
            t.isPlainObject(e) || (e = {
                attribute: i
            }), i = "";
            for (var n in e) {
                var a = ("role" == n ? "" : "aria-") + n,
                    r = e[n];
                i += null == r ? "" : a + '="' + e[n] + '"'
            }
            return i
        }

        function s() {
            try {
                return document.activeElement
            } catch (t) {}
        }
        var l = t(window),
            u = t(document),
            c = t(document.documentElement);
        return e.klasses = function(t) {
            return t = t || "picker", {
                picker: t,
                opened: t + "--opened",
                focused: t + "--focused",
                input: t + "__input",
                active: t + "__input--active",
                target: t + "__input--target",
                holder: t + "__holder",
                frame: t + "__frame",
                wrap: t + "__wrap",
                box: t + "__box"
            }
        }, e._ = {
            group: function(t) {
                for (var i, n = "", a = e._.trigger(t.min, t); a <= e._.trigger(t.max, t, [a]); a += t.i) i = e._.trigger(t.item, t, [a]), n += e._.node(t.node, i[0], i[1], i[2]);
                return n
            },
            node: function(e, i, n, a) {
                return i ? (i = t.isArray(i) ? i.join("") : i, n = n ? ' class="' + n + '"' : "", a = a ? " " + a : "", "<" + e + n + a + ">" + i + "</" + e + ">") : ""
            },
            lead: function(t) {
                return (10 > t ? "0" : "") + t
            },
            trigger: function(t, e, i) {
                return "function" == typeof t ? t.apply(e, i || []) : t
            },
            digits: function(t) {
                return /\d/.test(t[1]) ? 2 : 1
            },
            isDate: function(t) {
                return {}.toString.call(t).indexOf("Date") > -1 && this.isInteger(t.getDate())
            },
            isInteger: function(t) {
                return {}.toString.call(t).indexOf("Number") > -1 && t % 1 === 0
            },
            ariaAttr: o
        }, e.extend = function(i, n) {
            t.fn[i] = function(a, r) {
                var o = this.data(i);
                return "picker" == a ? o : o && "string" == typeof a ? e._.trigger(o[a], o, [r]) : this.each(function() {
                    var r = t(this);
                    r.data(i) || new e(this, i, n, a)
                })
            }, t.fn[i].defaults = n.defaults
        }, e
    }),
    function(t) {
        "function" == typeof define && define.amd ? define(["picker", "jquery"], t) : "object" == typeof exports ? module.exports = t(require("./picker.js"), require("jquery")) : t(Picker, jQuery)
    }(function(t, e) {
        function i(t, e) {
            var i = this,
                n = t.$node[0],
                a = n.value,
                r = t.$node.data("value"),
                o = r || a,
                s = r ? e.formatSubmit : e.format,
                l = function() {
                    return n.currentStyle ? "rtl" == n.currentStyle.direction : "rtl" == getComputedStyle(t.$root[0]).direction
                };
            i.settings = e, i.$node = t.$node, i.queue = {
                min: "measure create",
                max: "measure create",
                now: "now create",
                select: "parse create validate",
                highlight: "parse navigate create validate",
                view: "parse create validate viewset",
                disable: "deactivate",
                enable: "activate"
            }, i.item = {}, i.item.clear = null, i.item.disable = (e.disable || []).slice(0), i.item.enable = - function(t) {
                return t[0] === !0 ? t.shift() : -1
            }(i.item.disable), i.set("min", e.min).set("max", e.max).set("now"), o ? i.set("select", o, {
                format: s
            }) : i.set("select", null).set("highlight", i.item.now), i.key = {
                40: 7,
                38: -7,
                39: function() {
                    return l() ? -1 : 1
                },
                37: function() {
                    return l() ? 1 : -1
                },
                go: function(t) {
                    var e = i.item.highlight,
                        n = new Date(e.year, e.month, e.date + t);
                    i.set("highlight", n, {
                        interval: t
                    }), this.render()
                }
            }, t.on("render", function() {
                t.$root.find("." + e.klass.selectMonth).on("change", function() {
                    var i = this.value;
                    i && (t.set("highlight", [t.get("view").year, i, t.get("highlight").date]), t.$root.find("." + e.klass.selectMonth).trigger("focus"))
                }), t.$root.find("." + e.klass.selectYear).on("change", function() {
                    var i = this.value;
                    i && (t.set("highlight", [i, t.get("view").month, t.get("highlight").date]), t.$root.find("." + e.klass.selectYear).trigger("focus"))
                })
            }, 1).on("open", function() {
                var n = "";
                i.disabled(i.get("now")) && (n = ":not(." + e.klass.buttonToday + ")"), t.$root.find("button" + n + ", select").attr("disabled", !1)
            }, 1).on("close", function() {
                t.$root.find("button, select").attr("disabled", !0)
            }, 1)
        }
        var n = 7,
            a = 6,
            r = t._;
        i.prototype.set = function(t, e, i) {
            var n = this,
                a = n.item;
            return null === e ? ("clear" == t && (t = "select"), a[t] = e, n) : (a["enable" == t ? "disable" : "flip" == t ? "enable" : t] = n.queue[t].split(" ").map(function(a) {
                return e = n[a](t, e, i)
            }).pop(), "select" == t ? n.set("highlight", a.select, i) : "highlight" == t ? n.set("view", a.highlight, i) : t.match(/^(flip|min|max|disable|enable)$/) && (a.select && n.disabled(a.select) && n.set("select", a.select, i), a.highlight && n.disabled(a.highlight) && n.set("highlight", a.highlight, i)), n)
        }, i.prototype.get = function(t) {
            return this.item[t]
        }, i.prototype.create = function(t, i, n) {
            var a, o = this;
            return i = void 0 === i ? t : i, i == -1 / 0 || 1 / 0 == i ? a = i : e.isPlainObject(i) && r.isInteger(i.pick) ? i = i.obj : e.isArray(i) ? (i = new Date(i[0], i[1], i[2]), i = r.isDate(i) ? i : o.create().obj) : i = r.isInteger(i) || r.isDate(i) ? o.normalize(new Date(i), n) : o.now(t, i, n), {
                year: a || i.getFullYear(),
                month: a || i.getMonth(),
                date: a || i.getDate(),
                day: a || i.getDay(),
                obj: a || i,
                pick: a || i.getTime()
            }
        }, i.prototype.createRange = function(t, i) {
            var n = this,
                a = function(t) {
                    return t === !0 || e.isArray(t) || r.isDate(t) ? n.create(t) : t
                };
            return r.isInteger(t) || (t = a(t)), r.isInteger(i) || (i = a(i)), r.isInteger(t) && e.isPlainObject(i) ? t = [i.year, i.month, i.date + t] : r.isInteger(i) && e.isPlainObject(t) && (i = [t.year, t.month, t.date + i]), {
                from: a(t),
                to: a(i)
            }
        }, i.prototype.withinRange = function(t, e) {
            return t = this.createRange(t.from, t.to), e.pick >= t.from.pick && e.pick <= t.to.pick
        }, i.prototype.overlapRanges = function(t, e) {
            var i = this;
            return t = i.createRange(t.from, t.to), e = i.createRange(e.from, e.to), i.withinRange(t, e.from) || i.withinRange(t, e.to) || i.withinRange(e, t.from) || i.withinRange(e, t.to)
        }, i.prototype.now = function(t, e, i) {
            return e = new Date, i && i.rel && e.setDate(e.getDate() + i.rel), this.normalize(e, i)
        }, i.prototype.navigate = function(t, i, n) {
            var a, r, o, s, l = e.isArray(i),
                u = e.isPlainObject(i),
                c = this.item.view;
            if (l || u) {
                for (u ? (r = i.year, o = i.month, s = i.date) : (r = +i[0], o = +i[1], s = +i[2]), n && n.nav && c && c.month !== o && (r = c.year, o = c.month), a = new Date(r, o + (n && n.nav ? n.nav : 0), 1), r = a.getFullYear(), o = a.getMonth(); new Date(r, o, s).getMonth() !== o;) s -= 1;
                i = [r, o, s]
            }
            return i
        }, i.prototype.normalize = function(t) {
            return t.setHours(0, 0, 0, 0), t
        }, i.prototype.measure = function(t, e) {
            var i = this;
            return e ? "string" == typeof e ? e = i.parse(t, e) : r.isInteger(e) && (e = i.now(t, e, {
                rel: e
            })) : e = "min" == t ? -1 / 0 : 1 / 0, e
        }, i.prototype.viewset = function(t, e) {
            return this.create([e.year, e.month, 1])
        }, i.prototype.validate = function(t, i, n) {
            var a, o, s, l, u = this,
                c = i,
                d = n && n.interval ? n.interval : 1,
                p = -1 === u.item.enable,
                f = u.item.min,
                h = u.item.max,
                v = p && u.item.disable.filter(function(t) {
                    if (e.isArray(t)) {
                        var n = u.create(t).pick;
                        n < i.pick ? a = !0 : n > i.pick && (o = !0)
                    }
                    return r.isInteger(t)
                }).length;
            if ((!n || !n.nav) && (!p && u.disabled(i) || p && u.disabled(i) && (v || a || o) || !p && (i.pick <= f.pick || i.pick >= h.pick)))
                for (p && !v && (!o && d > 0 || !a && 0 > d) && (d *= -1); u.disabled(i) && (Math.abs(d) > 1 && (i.month < c.month || i.month > c.month) && (i = c, d = d > 0 ? 1 : -1), i.pick <= f.pick ? (s = !0, d = 1, i = u.create([f.year, f.month, f.date + (i.pick === f.pick ? 0 : -1)])) : i.pick >= h.pick && (l = !0, d = -1, i = u.create([h.year, h.month, h.date + (i.pick === h.pick ? 0 : 1)])), !s || !l);) i = u.create([i.year, i.month, i.date + d]);
            return i
        }, i.prototype.disabled = function(t) {
            var i = this,
                n = i.item.disable.filter(function(n) {
                    return r.isInteger(n) ? t.day === (i.settings.firstDay ? n : n - 1) % 7 : e.isArray(n) || r.isDate(n) ? t.pick === i.create(n).pick : e.isPlainObject(n) ? i.withinRange(n, t) : void 0
                });
            return n = n.length && !n.filter(function(t) {
                return e.isArray(t) && "inverted" == t[3] || e.isPlainObject(t) && t.inverted
            }).length, -1 === i.item.enable ? !n : n || t.pick < i.item.min.pick || t.pick > i.item.max.pick
        }, i.prototype.parse = function(t, e, i) {
            var n = this,
                a = {};
            return e && "string" == typeof e ? (i && i.format || (i = i || {}, i.format = n.settings.format), n.formats.toArray(i.format).map(function(t) {
                var i = n.formats[t],
                    o = i ? r.trigger(i, n, [e, a]) : t.replace(/^!/, "").length;
                i && (a[t] = e.substr(0, o)), e = e.substr(o)
            }), [a.yyyy || a.yy, +(a.mm || a.m) - 1, a.dd || a.d]) : e
        }, i.prototype.formats = function() {
            function t(t, e, i) {
                var n = t.match(/\w+/)[0];
                return i.mm || i.m || (i.m = e.indexOf(n) + 1), n.length
            }

            function e(t) {
                return t.match(/\w+/)[0].length
            }
            return {
                d: function(t, e) {
                    return t ? r.digits(t) : e.date
                },
                dd: function(t, e) {
                    return t ? 2 : r.lead(e.date)
                },
                ddd: function(t, i) {
                    return t ? e(t) : this.settings.weekdaysShort[i.day]
                },
                dddd: function(t, i) {
                    return t ? e(t) : this.settings.weekdaysFull[i.day]
                },
                m: function(t, e) {
                    return t ? r.digits(t) : e.month + 1
                },
                mm: function(t, e) {
                    return t ? 2 : r.lead(e.month + 1)
                },
                mmm: function(e, i) {
                    var n = this.settings.monthsShort;
                    return e ? t(e, n, i) : n[i.month]
                },
                mmmm: function(e, i) {
                    var n = this.settings.monthsFull;
                    return e ? t(e, n, i) : n[i.month]
                },
                yy: function(t, e) {
                    return t ? 2 : ("" + e.year).slice(2)
                },
                yyyy: function(t, e) {
                    return t ? 4 : e.year
                },
                toArray: function(t) {
                    return t.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g)
                },
                toString: function(t, e) {
                    var i = this;
                    return i.formats.toArray(t).map(function(t) {
                        return r.trigger(i.formats[t], i, [0, e]) || t.replace(/^!/, "")
                    }).join("")
                }
            }
        }(), i.prototype.isDateExact = function(t, i) {
            var n = this;
            return r.isInteger(t) && r.isInteger(i) || "boolean" == typeof t && "boolean" == typeof i ? t === i : (r.isDate(t) || e.isArray(t)) && (r.isDate(i) || e.isArray(i)) ? n.create(t).pick === n.create(i).pick : e.isPlainObject(t) && e.isPlainObject(i) ? n.isDateExact(t.from, i.from) && n.isDateExact(t.to, i.to) : !1
        }, i.prototype.isDateOverlap = function(t, i) {
            var n = this,
                a = n.settings.firstDay ? 1 : 0;
            return r.isInteger(t) && (r.isDate(i) || e.isArray(i)) ? (t = t % 7 + a, t === n.create(i).day + 1) : r.isInteger(i) && (r.isDate(t) || e.isArray(t)) ? (i = i % 7 + a, i === n.create(t).day + 1) : e.isPlainObject(t) && e.isPlainObject(i) ? n.overlapRanges(t, i) : !1
        }, i.prototype.flipEnable = function(t) {
            var e = this.item;
            e.enable = t || (-1 == e.enable ? 1 : -1)
        }, i.prototype.deactivate = function(t, i) {
            var n = this,
                a = n.item.disable.slice(0);
            return "flip" == i ? n.flipEnable() : i === !1 ? (n.flipEnable(1), a = []) : i === !0 ? (n.flipEnable(-1), a = []) : i.map(function(t) {
                for (var i, o = 0; o < a.length; o += 1)
                    if (n.isDateExact(t, a[o])) {
                        i = !0;
                        break
                    }
                i || (r.isInteger(t) || r.isDate(t) || e.isArray(t) || e.isPlainObject(t) && t.from && t.to) && a.push(t)
            }), a
        }, i.prototype.activate = function(t, i) {
            var n = this,
                a = n.item.disable,
                o = a.length;
            return "flip" == i ? n.flipEnable() : i === !0 ? (n.flipEnable(1), a = []) : i === !1 ? (n.flipEnable(-1), a = []) : i.map(function(t) {
                var i, s, l, u;
                for (l = 0; o > l; l += 1) {
                    if (s = a[l], n.isDateExact(s, t)) {
                        i = a[l] = null, u = !0;
                        break
                    }
                    if (n.isDateOverlap(s, t)) {
                        e.isPlainObject(t) ? (t.inverted = !0, i = t) : e.isArray(t) ? (i = t, i[3] || i.push("inverted")) : r.isDate(t) && (i = [t.getFullYear(), t.getMonth(), t.getDate(), "inverted"]);
                        break
                    }
                }
                if (i)
                    for (l = 0; o > l; l += 1)
                        if (n.isDateExact(a[l], t)) {
                            a[l] = null;
                            break
                        }
                if (u)
                    for (l = 0; o > l; l += 1)
                        if (n.isDateOverlap(a[l], t)) {
                            a[l] = null;
                            break
                        }
                i && a.push(i)
            }), a.filter(function(t) {
                return null != t
            })
        }, i.prototype.nodes = function(t) {
            var e = this,
                i = e.settings,
                o = e.item,
                s = o.now,
                l = o.select,
                u = o.highlight,
                c = o.view,
                d = o.disable,
                p = o.min,
                f = o.max,
                h = function(t, e) {
                    return i.firstDay && (t.push(t.shift()), e.push(e.shift())), r.node("thead", r.node("tr", r.group({
                        min: 0,
                        max: n - 1,
                        i: 1,
                        node: "th",
                        item: function(n) {
                            return [t[n], i.klass.weekdays, 'scope=col title="' + e[n] + '"']
                        }
                    })))
                }((i.showWeekdaysFull ? i.weekdaysFull : i.weekdaysLetter).slice(0), i.weekdaysFull.slice(0)),
                v = function(t) {
                    return r.node("div", " ", i.klass["nav" + (t ? "Next" : "Prev")] + (t && c.year >= f.year && c.month >= f.month || !t && c.year <= p.year && c.month <= p.month ? " " + i.klass.navDisabled : ""), "data-nav=" + (t || -1) + " " + r.ariaAttr({
                        role: "button",
                        controls: e.$node[0].id + "_table"
                    }) + ' title="' + (t ? i.labelMonthNext : i.labelMonthPrev) + '"')
                },
                g = function(n) {
                    var a = i.showMonthsShort ? i.monthsShort : i.monthsFull;
                    return "short_months" == n && (a = i.monthsShort), i.selectMonths && void 0 == n ? r.node("select", r.group({
                        min: 0,
                        max: 11,
                        i: 1,
                        node: "option",
                        item: function(t) {
                            return [a[t], 0, "value=" + t + (c.month == t ? " selected" : "") + (c.year == p.year && t < p.month || c.year == f.year && t > f.month ? " disabled" : "")]
                        }
                    }), i.klass.selectMonth + " browser-default", (t ? "" : "disabled") + " " + r.ariaAttr({
                        controls: e.$node[0].id + "_table"
                    }) + ' title="' + i.labelMonthSelect + '"') : "short_months" == n ? null != l ? r.node("div", a[l.month]) : r.node("div", a[c.month]) : r.node("div", a[c.month], i.klass.month)
                },
                m = function(n) {
                    var a = c.year,
                        o = i.selectYears === !0 ? 5 : ~~(i.selectYears / 2);
                    if (o) {
                        var s = p.year,
                            l = f.year,
                            u = a - o,
                            d = a + o;
                        if (s > u && (d += s - u, u = s), d > l) {
                            var h = u - s,
                                v = d - l;
                            u -= h > v ? v : h, d = l
                        }
                        if (i.selectYears && void 0 == n) return r.node("select", r.group({
                            min: u,
                            max: d,
                            i: 1,
                            node: "option",
                            item: function(t) {
                                return [t, 0, "value=" + t + (a == t ? " selected" : "")]
                            }
                        }), i.klass.selectYear + " browser-default", (t ? "" : "disabled") + " " + r.ariaAttr({
                            controls: e.$node[0].id + "_table"
                        }) + ' title="' + i.labelYearSelect + '"')
                    }
                    return "raw" == n ? r.node("div", a) : r.node("div", a, i.klass.year)
                };
            return createDayLabel = function() {
                return null != l ? r.node("div", l.date) : r.node("div", s.date)
            }, createWeekdayLabel = function() {
                var t;
                t = null != l ? l.day : s.day;
                var e = i.weekdaysFull[t];
                return e
            }, r.node("div", r.node("div", createWeekdayLabel(), "picker__weekday-display") + r.node("div", g("short_months"), i.klass.month_display) + r.node("div", createDayLabel(), i.klass.day_display) + r.node("div", m("raw"), i.klass.year_display), i.klass.date_display) + r.node("div", r.node("div", (i.selectYears ? g() + m() : g() + m()) + v() + v(1), i.klass.header) + r.node("table", h + r.node("tbody", r.group({
                min: 0,
                max: a - 1,
                i: 1,
                node: "tr",
                item: function(t) {
                    var a = i.firstDay && 0 === e.create([c.year, c.month, 1]).day ? -7 : 0;
                    return [r.group({
                        min: n * t - c.day + a + 1,
                        max: function() {
                            return this.min + n - 1
                        },
                        i: 1,
                        node: "td",
                        item: function(t) {
                            t = e.create([c.year, c.month, t + (i.firstDay ? 1 : 0)]);
                            var n = l && l.pick == t.pick,
                                a = u && u.pick == t.pick,
                                o = d && e.disabled(t) || t.pick < p.pick || t.pick > f.pick,
                                h = r.trigger(e.formats.toString, e, [i.format, t]);
                            return [r.node("div", t.date, function(e) {
                                return e.push(c.month == t.month ? i.klass.infocus : i.klass.outfocus), s.pick == t.pick && e.push(i.klass.now), n && e.push(i.klass.selected), a && e.push(i.klass.highlighted), o && e.push(i.klass.disabled), e.join(" ")
                            }([i.klass.day]), "data-pick=" + t.pick + " " + r.ariaAttr({
                                role: "gridcell",
                                label: h,
                                selected: n && e.$node.val() === h ? !0 : null,
                                activedescendant: a ? !0 : null,
                                disabled: o ? !0 : null
                            })), "", r.ariaAttr({
                                role: "presentation"
                            })]
                        }
                    })]
                }
            })), i.klass.table, 'id="' + e.$node[0].id + '_table" ' + r.ariaAttr({
                role: "grid",
                controls: e.$node[0].id,
                readonly: !0
            })), i.klass.calendar_container) + r.node("div", r.node("button", i.today, "btn-flat picker__today", "type=button data-pick=" + s.pick + (t && !e.disabled(s) ? "" : " disabled") + " " + r.ariaAttr({
                controls: e.$node[0].id
            })) + r.node("button", i.clear, "btn-flat picker__clear", "type=button data-clear=1" + (t ? "" : " disabled") + " " + r.ariaAttr({
                controls: e.$node[0].id
            })) + r.node("button", i.close, "btn-flat picker__close", "type=button data-close=true " + (t ? "" : " disabled") + " " + r.ariaAttr({
                controls: e.$node[0].id
            })), i.klass.footer)
        }, i.defaults = function(t) {
            return {
                labelMonthNext: "Next month",
                labelMonthPrev: "Previous month",
                labelMonthSelect: "Select a month",
                labelYearSelect: "Select a year",
                monthsFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                weekdaysFull: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                weekdaysLetter: ["S", "M", "T", "W", "T", "F", "S"],
                today: "Today",
                clear: "Clear",
                close: "Close",
                format: "d mmmm, yyyy",
                klass: {
                    table: t + "table",
                    header: t + "header",
                    date_display: t + "date-display",
                    day_display: t + "day-display",
                    month_display: t + "month-display",
                    year_display: t + "year-display",
                    calendar_container: t + "calendar-container",
                    navPrev: t + "nav--prev",
                    navNext: t + "nav--next",
                    navDisabled: t + "nav--disabled",
                    month: t + "month",
                    year: t + "year",
                    selectMonth: t + "select--month",
                    selectYear: t + "select--year",
                    weekdays: t + "weekday",
                    day: t + "day",
                    disabled: t + "day--disabled",
                    selected: t + "day--selected",
                    highlighted: t + "day--highlighted",
                    now: t + "day--today",
                    infocus: t + "day--infocus",
                    outfocus: t + "day--outfocus",
                    footer: t + "footer",
                    buttonClear: t + "button--clear",
                    buttonToday: t + "button--today",
                    buttonClose: t + "button--close"
                }
            }
        }(t.klasses().picker + "__"), t.extend("pickadate", i)
    }),
    function(t) {
        function e() {
            var e = +t(this).attr("length"),
                i = +t(this).val().length,
                n = e >= i;
            t(this).parent().find('span[class="character-counter"]').html(i + "/" + e), a(n, t(this))
        }

        function i(e) {
            $counterElement = t("<span/>").addClass("character-counter").css("float", "right").css("font-size", "12px").css("height", 1), e.parent().append($counterElement)
        }

        function n() {
            t(this).parent().find('span[class="character-counter"]').html("")
        }

        function a(t, e) {
            inputHasInvalidClass = e.hasClass("invalid"), t && inputHasInvalidClass ? e.removeClass("invalid") : t || inputHasInvalidClass || (e.removeClass("valid"), e.addClass("invalid"))
        }
        t.fn.characterCounter = function() {
            return this.each(function() {
                itHasLengthAttribute = void 0 != t(this).attr("length"), itHasLengthAttribute && (t(this).on("input", e), t(this).on("focus", e), t(this).on("blur", n), i(t(this)))
            })
        }, t(document).ready(function() {
            t("input, textarea").characterCounter()
        })
    }(jQuery);;
/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function() {
    function e() {}

    function t(e, t) {
        for (var n = e.length; n--;)
            if (e[n].listener === t) return n;
        return -1
    }

    function n(e) {
        return function() {
            return this[e].apply(this, arguments)
        }
    }
    var i = e.prototype,
        r = this,
        o = r.EventEmitter;
    i.getListeners = function(e) {
        var t, n, i = this._getEvents();
        if ("object" == typeof e) {
            t = {};
            for (n in i) i.hasOwnProperty(n) && e.test(n) && (t[n] = i[n])
        } else t = i[e] || (i[e] = []);
        return t
    }, i.flattenListeners = function(e) {
        var t, n = [];
        for (t = 0; e.length > t; t += 1) n.push(e[t].listener);
        return n
    }, i.getListenersAsObject = function(e) {
        var t, n = this.getListeners(e);
        return n instanceof Array && (t = {}, t[e] = n), t || n
    }, i.addListener = function(e, n) {
        var i, r = this.getListenersAsObject(e),
            o = "object" == typeof n;
        for (i in r) r.hasOwnProperty(i) && -1 === t(r[i], n) && r[i].push(o ? n : {
            listener: n,
            once: !1
        });
        return this
    }, i.on = n("addListener"), i.addOnceListener = function(e, t) {
        return this.addListener(e, {
            listener: t,
            once: !0
        })
    }, i.once = n("addOnceListener"), i.defineEvent = function(e) {
        return this.getListeners(e), this
    }, i.defineEvents = function(e) {
        for (var t = 0; e.length > t; t += 1) this.defineEvent(e[t]);
        return this
    }, i.removeListener = function(e, n) {
        var i, r, o = this.getListenersAsObject(e);
        for (r in o) o.hasOwnProperty(r) && (i = t(o[r], n), -1 !== i && o[r].splice(i, 1));
        return this
    }, i.off = n("removeListener"), i.addListeners = function(e, t) {
        return this.manipulateListeners(!1, e, t)
    }, i.removeListeners = function(e, t) {
        return this.manipulateListeners(!0, e, t)
    }, i.manipulateListeners = function(e, t, n) {
        var i, r, o = e ? this.removeListener : this.addListener,
            s = e ? this.removeListeners : this.addListeners;
        if ("object" != typeof t || t instanceof RegExp)
            for (i = n.length; i--;) o.call(this, t, n[i]);
        else
            for (i in t) t.hasOwnProperty(i) && (r = t[i]) && ("function" == typeof r ? o.call(this, i, r) : s.call(this, i, r));
        return this
    }, i.removeEvent = function(e) {
        var t, n = typeof e,
            i = this._getEvents();
        if ("string" === n) delete i[e];
        else if ("object" === n)
            for (t in i) i.hasOwnProperty(t) && e.test(t) && delete i[t];
        else delete this._events;
        return this
    }, i.removeAllListeners = n("removeEvent"), i.emitEvent = function(e, t) {
        var n, i, r, o, s = this.getListenersAsObject(e);
        for (r in s)
            if (s.hasOwnProperty(r))
                for (i = s[r].length; i--;) n = s[r][i], n.once === !0 && this.removeListener(e, n.listener), o = n.listener.apply(this, t || []), o === this._getOnceReturnValue() && this.removeListener(e, n.listener);
        return this
    }, i.trigger = n("emitEvent"), i.emit = function(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(e, t)
    }, i.setOnceReturnValue = function(e) {
        return this._onceReturnValue = e, this
    }, i._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, i._getEvents = function() {
        return this._events || (this._events = {})
    }, e.noConflict = function() {
        return r.EventEmitter = o, e
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return e
    }) : "object" == typeof module && module.exports ? module.exports = e : this.EventEmitter = e
}).call(this),
    function(e) {
        function t(t) {
            var n = e.event;
            return n.target = n.target || n.srcElement || t, n
        }
        var n = document.documentElement,
            i = function() {};
        n.addEventListener ? i = function(e, t, n) {
            e.addEventListener(t, n, !1)
        } : n.attachEvent && (i = function(e, n, i) {
            e[n + i] = i.handleEvent ? function() {
                var n = t(e);
                i.handleEvent.call(i, n)
            } : function() {
                var n = t(e);
                i.call(e, n)
            }, e.attachEvent("on" + n, e[n + i])
        });
        var r = function() {};
        n.removeEventListener ? r = function(e, t, n) {
            e.removeEventListener(t, n, !1)
        } : n.detachEvent && (r = function(e, t, n) {
            e.detachEvent("on" + t, e[t + n]);
            try {
                delete e[t + n]
            } catch (i) {
                e[t + n] = void 0
            }
        });
        var o = {
            bind: i,
            unbind: r
        };
        "function" == typeof define && define.amd ? define("eventie/eventie", o) : e.eventie = o
    }(this),
    function(e, t) {
        "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], function(n, i) {
            return t(e, n, i)
        }) : "object" == typeof exports ? module.exports = t(e, require("wolfy87-eventemitter"), require("eventie")) : e.imagesLoaded = t(e, e.EventEmitter, e.eventie)
    }(window, function(e, t, n) {
        function i(e, t) {
            for (var n in t) e[n] = t[n];
            return e
        }

        function r(e) {
            return "[object Array]" === d.call(e)
        }

        function o(e) {
            var t = [];
            if (r(e)) t = e;
            else if ("number" == typeof e.length)
                for (var n = 0, i = e.length; i > n; n++) t.push(e[n]);
            else t.push(e);
            return t
        }

        function s(e, t, n) {
            if (!(this instanceof s)) return new s(e, t);
            "string" == typeof e && (e = document.querySelectorAll(e)), this.elements = o(e), this.options = i({}, this.options), "function" == typeof t ? n = t : i(this.options, t), n && this.on("always", n), this.getImages(), a && (this.jqDeferred = new a.Deferred);
            var r = this;
            setTimeout(function() {
                r.check()
            })
        }

        function f(e) {
            this.img = e
        }

        function c(e) {
            this.src = e, v[e] = this
        }
        var a = e.jQuery,
            u = e.console,
            h = u !== void 0,
            d = Object.prototype.toString;
        s.prototype = new t, s.prototype.options = {}, s.prototype.getImages = function() {
            this.images = [];
            for (var e = 0, t = this.elements.length; t > e; e++) {
                var n = this.elements[e];
                "IMG" === n.nodeName && this.addImage(n);
                var i = n.nodeType;
                if (i && (1 === i || 9 === i || 11 === i))
                    for (var r = n.querySelectorAll("img"), o = 0, s = r.length; s > o; o++) {
                        var f = r[o];
                        this.addImage(f)
                    }
            }
        }, s.prototype.addImage = function(e) {
            var t = new f(e);
            this.images.push(t)
        }, s.prototype.check = function() {
            function e(e, r) {
                return t.options.debug && h && u.log("confirm", e, r), t.progress(e), n++, n === i && t.complete(), !0
            }
            var t = this,
                n = 0,
                i = this.images.length;
            if (this.hasAnyBroken = !1, !i) return this.complete(), void 0;
            for (var r = 0; i > r; r++) {
                var o = this.images[r];
                o.on("confirm", e), o.check()
            }
        }, s.prototype.progress = function(e) {
            this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded;
            var t = this;
            setTimeout(function() {
                t.emit("progress", t, e), t.jqDeferred && t.jqDeferred.notify && t.jqDeferred.notify(t, e)
            })
        }, s.prototype.complete = function() {
            var e = this.hasAnyBroken ? "fail" : "done";
            this.isComplete = !0;
            var t = this;
            setTimeout(function() {
                if (t.emit(e, t), t.emit("always", t), t.jqDeferred) {
                    var n = t.hasAnyBroken ? "reject" : "resolve";
                    t.jqDeferred[n](t)
                }
            })
        }, a && (a.fn.imagesLoaded = function(e, t) {
            var n = new s(this, e, t);
            return n.jqDeferred.promise(a(this))
        }), f.prototype = new t, f.prototype.check = function() {
            var e = v[this.img.src] || new c(this.img.src);
            if (e.isConfirmed) return this.confirm(e.isLoaded, "cached was confirmed"), void 0;
            if (this.img.complete && void 0 !== this.img.naturalWidth) return this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), void 0;
            var t = this;
            e.on("confirm", function(e, n) {
                return t.confirm(e.isLoaded, n), !0
            }), e.check()
        }, f.prototype.confirm = function(e, t) {
            this.isLoaded = e, this.emit("confirm", this, t)
        };
        var v = {};
        return c.prototype = new t, c.prototype.check = function() {
            if (!this.isChecked) {
                var e = new Image;
                n.bind(e, "load", this), n.bind(e, "error", this), e.src = this.src, this.isChecked = !0
            }
        }, c.prototype.handleEvent = function(e) {
            var t = "on" + e.type;
            this[t] && this[t](e)
        }, c.prototype.onload = function(e) {
            this.confirm(!0, "onload"), this.unbindProxyEvents(e)
        }, c.prototype.onerror = function(e) {
            this.confirm(!1, "onerror"), this.unbindProxyEvents(e)
        }, c.prototype.confirm = function(e, t) {
            this.isConfirmed = !0, this.isLoaded = e, this.emit("confirm", this, t)
        }, c.prototype.unbindProxyEvents = function(e) {
            n.unbind(e.target, "load", this), n.unbind(e.target, "error", this)
        }, s
    });;
/*!
 * Shuffle.js by @Vestride
 * Categorize, sort, and filter a responsive grid of items.
 * Dependencies: jQuery 1.9+, Modernizr 2.6.2+
 * @license MIT license
 * @version 3.1.1
 */
window.Modernizr = function(a, b, c) {
        function d(a) {
            s.cssText = a
        }

        function e(a, b) {
            return typeof a === b
        }

        function f(a, b) {
            return !!~("" + a).indexOf(b)
        }

        function g(a, b) {
            for (var d in a) {
                var e = a[d];
                if (!f(e, "-") && s[e] !== c) return "pfx" == b ? e : !0
            }
            return !1
        }

        function h(a, b, d) {
            for (var f in a) {
                var g = b[a[f]];
                if (g !== c) return d === !1 ? a[f] : e(g, "function") ? g.bind(d || b) : g
            }
            return !1
        }

        function i(a, b, c) {
            var d = a.charAt(0).toUpperCase() + a.slice(1),
                f = (a + " " + v.join(d + " ") + d).split(" ");
            return e(b, "string") || e(b, "undefined") ? g(f, b) : (f = (a + " " + w.join(d + " ") + d).split(" "), h(f, b, c))
        }
        var j, k, l, m = "2.6.2",
            n = {},
            o = !0,
            p = b.documentElement,
            q = "modernizr",
            r = b.createElement(q),
            s = r.style,
            t = ({}.toString, " -webkit- -moz- -o- -ms- ".split(" ")),
            u = "Webkit Moz O ms",
            v = u.split(" "),
            w = u.toLowerCase().split(" "),
            x = {},
            y = [],
            z = y.slice,
            A = function(a, c, d, e) {
                var f, g, h, i, j = b.createElement("div"),
                    k = b.body,
                    l = k || b.createElement("body");
                if (parseInt(d, 10))
                    for (; d--;) h = b.createElement("div"), h.id = e ? e[d] : q + (d + 1), j.appendChild(h);
                return f = ["&#173;", '<style id="s', q, '">', a, "</style>"].join(""), j.id = q, (k ? j : l).innerHTML += f, l.appendChild(j), k || (l.style.background = "", l.style.overflow = "hidden", i = p.style.overflow, p.style.overflow = "hidden", p.appendChild(l)), g = c(j, a), k ? j.parentNode.removeChild(j) : (l.parentNode.removeChild(l), p.style.overflow = i), !!g
            },
            B = {}.hasOwnProperty;
        l = e(B, "undefined") || e(B.call, "undefined") ? function(a, b) {
            return b in a && e(a.constructor.prototype[b], "undefined")
        } : function(a, b) {
            return B.call(a, b)
        }, Function.prototype.bind || (Function.prototype.bind = function(a) {
            var b = this;
            if ("function" != typeof b) throw new TypeError;
            var c = z.call(arguments, 1),
                d = function() {
                    if (this instanceof d) {
                        var e = function() {};
                        e.prototype = b.prototype;
                        var f = new e,
                            g = b.apply(f, c.concat(z.call(arguments)));
                        return Object(g) === g ? g : f
                    }
                    return b.apply(a, c.concat(z.call(arguments)))
                };
            return d
        }), x.csstransforms = function() {
            return !!i("transform")
        }, x.csstransforms3d = function() {
            var a = !!i("perspective");
            return a && "webkitPerspective" in p.style && A("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function(b) {
                a = 9 === b.offsetLeft && 3 === b.offsetHeight
            }), a
        }, x.csstransitions = function() {
            return i("transition")
        };
        for (var C in x) l(x, C) && (k = C.toLowerCase(), n[k] = x[C](), y.push((n[k] ? "" : "no-") + k));
        return n.addTest = function(a, b) {
            if ("object" == typeof a)
                for (var d in a) l(a, d) && n.addTest(d, a[d]);
            else {
                if (a = a.toLowerCase(), n[a] !== c) return n;
                b = "function" == typeof b ? b() : b, "undefined" != typeof o && o && (p.className += " " + (b ? "" : "no-") + a), n[a] = b
            }
            return n
        }, d(""), r = j = null, n._version = m, n._prefixes = t, n._domPrefixes = w, n._cssomPrefixes = v, n.testProp = function(a) {
            return g([a])
        }, n.testAllProps = i, n.testStyles = A, n.prefixed = function(a, b, c) {
            return b ? i(a, b, c) : i(a, "pfx")
        }, p.className = p.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (o ? " js " + y.join(" ") : ""), n
    }(this, this.document),
    function(a) {
        "function" == typeof define && define.amd ? define(["jquery", "modernizr"], a) : "object" == typeof exports ? module.exports = a(require("jquery"), window.Modernizr) : window.Shuffle = a(window.jQuery, window.Modernizr)
    }(function(a, b, c) {
        "use strict";

        function d(a) {
            return a ? a.replace(/([A-Z])/g, function(a, b) {
                return "-" + b.toLowerCase()
            }).replace(/^ms-/, "-ms-") : ""
        }

        function e(b, c, d) {
            var e, f, g, h = null,
                i = 0;
            d = d || {};
            var j = function() {
                i = d.leading === !1 ? 0 : a.now(), h = null, g = b.apply(e, f), e = f = null
            };
            return function() {
                var k = a.now();
                i || d.leading !== !1 || (i = k);
                var l = c - (k - i);
                return e = this, f = arguments, 0 >= l || l > c ? (clearTimeout(h), h = null, i = k, g = b.apply(e, f), e = f = null) : h || d.trailing === !1 || (h = setTimeout(j, l)), g
            }
        }

        function f(a, b, c) {
            for (var d = 0, e = a.length; e > d; d++)
                if (b.call(c, a[d], d, a) === {}) return
        }

        function g(b, c, d) {
            return setTimeout(a.proxy(b, c), d)
        }

        function h(a) {
            return Math.max.apply(Math, a)
        }

        function i(a) {
            return Math.min.apply(Math, a)
        }

        function j(b) {
            return a.isNumeric(b) ? b : 0
        }

        function k(a) {
            var b, c, d = a.length;
            if (!d) return a;
            for (; --d;) c = Math.floor(Math.random() * (d + 1)), b = a[c], a[c] = a[d], a[d] = b;
            return a
        }
        if ("object" != typeof b) throw new Error("Shuffle.js requires Modernizr.\nhttp://vestride.github.io/Shuffle/#dependencies");
        var l = b.prefixed("transition"),
            m = b.prefixed("transitionDelay"),
            n = b.prefixed("transitionDuration"),
            o = {
                WebkitTransition: "webkitTransitionEnd",
                transition: "transitionend"
            }[l],
            p = b.prefixed("transform"),
            q = d(p),
            r = b.csstransforms && b.csstransitions,
            s = b.csstransforms3d,
            t = !!window.getComputedStyle,
            u = "shuffle",
            v = "all",
            w = "groups",
            x = 1,
            y = .001,
            z = window.getComputedStyle || function() {},
            A = function(a, b) {
                this.x = j(a), this.y = j(b)
            };
        A.equals = function(a, b) {
            return a.x === b.x && a.y === b.y
        };
        var B = function() {
                if (!t) return !1;
                var a = document.body || document.documentElement,
                    b = document.createElement("div");
                b.style.cssText = "width:10px;padding:2px;-webkit-box-sizing:border-box;box-sizing:border-box;", a.appendChild(b);
                var c = z(b, null).width,
                    d = "10px" === c;
                return a.removeChild(b), d
            }(),
            C = 0,
            D = a(window),
            E = function(b, c) {
                c = c || {}, a.extend(this, E.options, c, E.settings), this.$el = a(b), this.element = b, this.unique = "shuffle_" + C++, this._fire(E.EventType.LOADING), this._init(), g(function() {
                    this.initialized = !0, this._fire(E.EventType.DONE)
                }, this, 16)
            };
        return E.EventType = {
            LOADING: "loading",
            DONE: "done",
            LAYOUT: "layout",
            REMOVED: "removed"
        }, E.ClassName = {
            BASE: u,
            SHUFFLE_ITEM: "shuffle-item",
            FILTERED: "filtered",
            CONCEALED: "concealed"
        }, E.options = {
            group: v,
            speed: 250,
            easing: "ease-out",
            itemSelector: "",
            sizer: null,
            gutterWidth: 0,
            columnWidth: 0,
            delimeter: null,
            buffer: 0,
            columnThreshold: t ? .01 : .1,
            initialSort: null,
            throttle: e,
            throttleTime: 300,
            sequentialFadeDelay: 150,
            supported: r
        }, E.settings = {
            useSizer: !1,
            itemCss: {
                position: "absolute",
                top: 0,
                left: 0,
                visibility: "visible"
            },
            revealAppendedDelay: 300,
            lastSort: {},
            lastFilter: v,
            enabled: !0,
            destroyed: !1,
            initialized: !1,
            _animations: [],
            _transitions: [],
            _isMovementCanceled: !1,
            styleQueue: []
        }, E.Point = A, E._getItemTransformString = function(a, b) {
            return s ? "translate3d(" + a.x + "px, " + a.y + "px, 0) scale3d(" + b + ", " + b + ", 1)" : "translate(" + a.x + "px, " + a.y + "px) scale(" + b + ")"
        }, E._getNumberStyle = function(b, c, d) {
            if (t) {
                d = d || z(b, null);
                var e = E._getFloat(d[c]);
                return B || "width" !== c ? B || "height" !== c || (e += E._getFloat(d.paddingTop) + E._getFloat(d.paddingBottom) + E._getFloat(d.borderTopWidth) + E._getFloat(d.borderBottomWidth)) : e += E._getFloat(d.paddingLeft) + E._getFloat(d.paddingRight) + E._getFloat(d.borderLeftWidth) + E._getFloat(d.borderRightWidth), e
            }
            return E._getFloat(a(b).css(c))
        }, E._getFloat = function(a) {
            return j(parseFloat(a))
        }, E._getOuterWidth = function(a, b) {
            var c = z(a, null),
                d = E._getNumberStyle(a, "width", c);
            if (b) {
                var e = E._getNumberStyle(a, "marginLeft", c),
                    f = E._getNumberStyle(a, "marginRight", c);
                d += e + f
            }
            return d
        }, E._getOuterHeight = function(a, b) {
            var c = z(a, null),
                d = E._getNumberStyle(a, "height", c);
            if (b) {
                var e = E._getNumberStyle(a, "marginTop", c),
                    f = E._getNumberStyle(a, "marginBottom", c);
                d += e + f
            }
            return d
        }, E._skipTransition = function(a, b, c) {
            var d = a.style[n];
            a.style[n] = "0ms", b.call(c);
            var e = a.offsetWidth;
            e = null, a.style[n] = d
        }, E.prototype._init = function() {
            this.$items = this._getItems(), this.sizer = this._getElementOption(this.sizer), this.sizer && (this.useSizer = !0), this.$el.addClass(E.ClassName.BASE), this._initItems(), D.on("resize." + u + "." + this.unique, this._getResizeFunction());
            var a = this.$el.css(["position", "overflow"]),
                b = E._getOuterWidth(this.element);
            this._validateStyles(a), this._setColumns(b), this.shuffle(this.group, this.initialSort), this.supported && g(function() {
                this._setTransitions(), this.element.style[l] = "height " + this.speed + "ms " + this.easing
            }, this)
        }, E.prototype._getResizeFunction = function() {
            var b = a.proxy(this._onResize, this);
            return this.throttle ? this.throttle(b, this.throttleTime) : b
        }, E.prototype._getElementOption = function(a) {
            return "string" == typeof a ? this.$el.find(a)[0] || null : a && a.nodeType && 1 === a.nodeType ? a : a && a.jquery ? a[0] : null
        }, E.prototype._validateStyles = function(a) {
            "static" === a.position && (this.element.style.position = "relative"), "hidden" !== a.overflow && (this.element.style.overflow = "hidden")
        }, E.prototype._filter = function(a, b) {
            a = a || this.lastFilter, b = b || this.$items;
            var c = this._getFilteredSets(a, b);
            return this._toggleFilterClasses(c.filtered, c.concealed), this.lastFilter = a, "string" == typeof a && (this.group = a), c.filtered
        }, E.prototype._getFilteredSets = function(b, c) {
            var d = a(),
                e = a();
            return b === v ? d = c : f(c, function(c) {
                var f = a(c);
                this._doesPassFilter(b, f) ? d = d.add(f) : e = e.add(f)
            }, this), {
                filtered: d,
                concealed: e
            }
        }, E.prototype._doesPassFilter = function(b, c) {
            if (a.isFunction(b)) return b.call(c[0], c, this);
            var d = c.data(w),
                e = this.delimeter && !a.isArray(d) ? d.split(this.delimeter) : d;
            return a.inArray(b, e) > -1
        }, E.prototype._toggleFilterClasses = function(a, b) {
            a.removeClass(E.ClassName.CONCEALED).addClass(E.ClassName.FILTERED), b.removeClass(E.ClassName.FILTERED).addClass(E.ClassName.CONCEALED)
        }, E.prototype._initItems = function(a) {
            a = a || this.$items, a.addClass([E.ClassName.SHUFFLE_ITEM, E.ClassName.FILTERED].join(" ")), a.css(this.itemCss).data("point", new A).data("scale", x)
        }, E.prototype._updateItemCount = function() {
            this.visibleItems = this._getFilteredItems().length
        }, E.prototype._setTransition = function(a) {
            a.style[l] = q + " " + this.speed + "ms " + this.easing + ", opacity " + this.speed + "ms " + this.easing
        }, E.prototype._setTransitions = function(a) {
            a = a || this.$items, f(a, function(a) {
                this._setTransition(a)
            }, this)
        }, E.prototype._setSequentialDelay = function(a) {
            this.supported && f(a, function(a, b) {
                a.style[m] = "0ms," + (b + 1) * this.sequentialFadeDelay + "ms"
            }, this)
        }, E.prototype._getItems = function() {
            return this.$el.children(this.itemSelector)
        }, E.prototype._getFilteredItems = function() {
            return this.$items.filter("." + E.ClassName.FILTERED)
        }, E.prototype._getConcealedItems = function() {
            return this.$items.filter("." + E.ClassName.CONCEALED)
        }, E.prototype._getColumnSize = function(b, c) {
            var d;
            return d = a.isFunction(this.columnWidth) ? this.columnWidth(b) : this.useSizer ? E._getOuterWidth(this.sizer) : this.columnWidth ? this.columnWidth : this.$items.length > 0 ? E._getOuterWidth(this.$items[0], !0) : b, 0 === d && (d = b), d + c
        }, E.prototype._getGutterSize = function(b) {
            var c;
            return c = a.isFunction(this.gutterWidth) ? this.gutterWidth(b) : this.useSizer ? E._getNumberStyle(this.sizer, "marginLeft") : this.gutterWidth
        }, E.prototype._setColumns = function(a) {
            var b = a || E._getOuterWidth(this.element),
                c = this._getGutterSize(b),
                d = this._getColumnSize(b, c),
                e = (b + c) / d;
            Math.abs(Math.round(e) - e) < this.columnThreshold && (e = Math.round(e)), this.cols = Math.max(Math.floor(e), 1), this.containerWidth = b, this.colWidth = d
        }, E.prototype._setContainerSize = function() {
            this.$el.css("height", this._getContainerSize())
        }, E.prototype._getContainerSize = function() {
            return h(this.positions)
        }, E.prototype._fire = function(a, b) {
            this.$el.trigger(a + "." + u, b && b.length ? b : [this])
        }, E.prototype._resetCols = function() {
            var a = this.cols;
            for (this.positions = []; a--;) this.positions.push(0)
        }, E.prototype._layout = function(a, b) {
            f(a, function(a) {
                this._layoutItem(a, !!b)
            }, this), this._processStyleQueue(), this._setContainerSize()
        }, E.prototype._layoutItem = function(b, c) {
            var d = a(b),
                e = d.data(),
                f = e.point,
                g = e.scale,
                h = {
                    width: E._getOuterWidth(b, !0),
                    height: E._getOuterHeight(b, !0)
                },
                i = this._getItemPosition(h);
            A.equals(f, i) && g === x || (e.point = i, e.scale = x, this.styleQueue.push({
                $item: d,
                point: i,
                scale: x,
                opacity: c ? 0 : 1,
                skipTransition: c || 0 === this.speed,
                callfront: function() {
                    c || d.css("visibility", "visible")
                },
                callback: function() {
                    c && d.css("visibility", "hidden")
                }
            }))
        }, E.prototype._getItemPosition = function(a) {
            for (var b = this._getColumnSpan(a.width, this.colWidth, this.cols), c = this._getColumnSet(b, this.cols), d = this._getShortColumn(c, this.buffer), e = new A(Math.round(this.colWidth * d), Math.round(c[d])), f = c[d] + a.height, g = this.cols + 1 - c.length, h = 0; g > h; h++) this.positions[d + h] = f;
            return e
        }, E.prototype._getColumnSpan = function(a, b, c) {
            var d = a / b;
            return Math.abs(Math.round(d) - d) < this.columnThreshold && (d = Math.round(d)), Math.min(Math.ceil(d), c)
        }, E.prototype._getColumnSet = function(a, b) {
            if (1 === a) return this.positions;
            for (var c = b + 1 - a, d = [], e = 0; c > e; e++) d[e] = h(this.positions.slice(e, e + a));
            return d
        }, E.prototype._getShortColumn = function(a, b) {
            for (var c = i(a), d = 0, e = a.length; e > d; d++)
                if (a[d] >= c - b && a[d] <= c + b) return d;
            return 0
        }, E.prototype._shrink = function(b) {
            var c = b || this._getConcealedItems();
            f(c, function(b) {
                var c = a(b),
                    d = c.data();
                d.scale !== y && (d.scale = y, this.styleQueue.push({
                    $item: c,
                    point: d.point,
                    scale: y,
                    opacity: 0,
                    callback: function() {
                        c.css("visibility", "hidden")
                    }
                }))
            }, this)
        }, E.prototype._onResize = function() {
            if (this.enabled && !this.destroyed) {
                var a = E._getOuterWidth(this.element);
                a !== this.containerWidth && this.update()
            }
        }, E.prototype._getStylesForTransition = function(a) {
            var b = {
                opacity: a.opacity
            };
            return this.supported ? b[p] = E._getItemTransformString(a.point, a.scale) : (b.left = a.point.x, b.top = a.point.y), b
        }, E.prototype._transition = function(b) {
            var c = this._getStylesForTransition(b);
            this._startItemAnimation(b.$item, c, b.callfront || a.noop, b.callback || a.noop)
        }, E.prototype._startItemAnimation = function(b, c, d, e) {
            function f(b) {
                b.target === b.currentTarget && (a(b.target).off(o, f), g._removeTransitionReference(h), e())
            }
            var g = this,
                h = {
                    $element: b,
                    handler: f
                };
            if (d(), !this.initialized) return b.css(c), void e();
            if (this.supported) b.css(c), b.on(o, f), this._transitions.push(h);
            else {
                var i = b.stop(!0).animate(c, this.speed, "swing", e);
                this._animations.push(i.promise())
            }
        }, E.prototype._processStyleQueue = function(b) {
            this.isTransitioning && this._cancelMovement();
            var c = a();
            f(this.styleQueue, function(a) {
                a.skipTransition ? this._styleImmediately(a) : (c = c.add(a.$item), this._transition(a))
            }, this), c.length > 0 && this.initialized && this.speed > 0 ? (this.isTransitioning = !0, this.supported ? this._whenCollectionDone(c, o, this._movementFinished) : this._whenAnimationsDone(this._movementFinished)) : b || g(this._layoutEnd, this), this.styleQueue.length = 0
        }, E.prototype._cancelMovement = function() {
            this.supported ? f(this._transitions, function(a) {
                a.$element.off(o, a.handler)
            }) : (this._isMovementCanceled = !0, this.$items.stop(!0), this._isMovementCanceled = !1), this._transitions.length = 0, this.isTransitioning = !1
        }, E.prototype._removeTransitionReference = function(b) {
            var c = a.inArray(b, this._transitions);
            c > -1 && this._transitions.splice(c, 1)
        }, E.prototype._styleImmediately = function(a) {
            E._skipTransition(a.$item[0], function() {
                a.$item.css(this._getStylesForTransition(a))
            }, this)
        }, E.prototype._movementFinished = function() {
            this.isTransitioning = !1, this._layoutEnd()
        }, E.prototype._layoutEnd = function() {
            this._fire(E.EventType.LAYOUT)
        }, E.prototype._addItems = function(a, b, c) {
            this._initItems(a), this._setTransitions(a), this.$items = this._getItems(), this._shrink(a), f(this.styleQueue, function(a) {
                a.skipTransition = !0
            }), this._processStyleQueue(!0), b ? this._addItemsToEnd(a, c) : this.shuffle(this.lastFilter)
        }, E.prototype._addItemsToEnd = function(a, b) {
            var c = this._filter(null, a),
                d = c.get();
            this._updateItemCount(), this._layout(d, !0), b && this.supported && this._setSequentialDelay(d), this._revealAppended(d)
        }, E.prototype._revealAppended = function(b) {
            g(function() {
                f(b, function(b) {
                    var c = a(b);
                    this._transition({
                        $item: c,
                        opacity: 1,
                        point: c.data("point"),
                        scale: x
                    })
                }, this), this._whenCollectionDone(a(b), o, function() {
                    a(b).css(m, "0ms"), this._movementFinished()
                })
            }, this, this.revealAppendedDelay)
        }, E.prototype._whenCollectionDone = function(b, c, d) {
            function e(b) {
                b.target === b.currentTarget && (a(b.target).off(c, e), f++, f === g && (h._removeTransitionReference(i), d.call(h)))
            }
            var f = 0,
                g = b.length,
                h = this,
                i = {
                    $element: b,
                    handler: e
                };
            b.on(c, e), this._transitions.push(i)
        }, E.prototype._whenAnimationsDone = function(b) {
            a.when.apply(null, this._animations).always(a.proxy(function() {
                this._animations.length = 0, this._isMovementCanceled || b.call(this)
            }, this))
        }, E.prototype.shuffle = function(a, b) {
            this.enabled && (a || (a = v), this._filter(a), this._updateItemCount(), this._shrink(), this.sort(b))
        }, E.prototype.sort = function(a) {
            if (this.enabled) {
                this._resetCols();
                var b = a || this.lastSort,
                    c = this._getFilteredItems().sorted(b);
                this._layout(c), this.lastSort = b
            }
        }, E.prototype.update = function(a) {
            this.enabled && (a || this._setColumns(), this.sort())
        }, E.prototype.layout = function() {
            this.update(!0)
        }, E.prototype.appended = function(a, b, c) {
            this._addItems(a, b === !0, c !== !1)
        }, E.prototype.disable = function() {
            this.enabled = !1
        }, E.prototype.enable = function(a) {
            this.enabled = !0, a !== !1 && this.update()
        }, E.prototype.remove = function(b) {
            function c() {
                b.remove(), this.$items = this._getItems(), this._updateItemCount(), this._fire(E.EventType.REMOVED, [b, this]), b = null
            }
            b.length && b.jquery && (this._toggleFilterClasses(a(), b), this._shrink(b), this.sort(), this.$el.one(E.EventType.LAYOUT + "." + u, a.proxy(c, this)))
        }, E.prototype.destroy = function() {
            D.off("." + this.unique), this.$el.removeClass(u).removeAttr("style").removeData(u), this.$items.removeAttr("style").removeData("point").removeData("scale").removeClass([E.ClassName.CONCEALED, E.ClassName.FILTERED, E.ClassName.SHUFFLE_ITEM].join(" ")), this.$items = null, this.$el = null, this.sizer = null, this.element = null, this._transitions = null, this.destroyed = !0
        }, a.fn.shuffle = function(b) {
            var c = Array.prototype.slice.call(arguments, 1);
            return this.each(function() {
                var d = a(this),
                    e = d.data(u);
                e ? "string" == typeof b && e[b] && e[b].apply(e, c) : (e = new E(this, b), d.data(u, e))
            })
        }, a.fn.sorted = function(b) {
            var d = a.extend({}, a.fn.sorted.defaults, b),
                e = this.get(),
                f = !1;
            return e.length ? d.randomize ? k(e) : (a.isFunction(d.by) && e.sort(function(b, e) {
                if (f) return 0;
                var g = d.by(a(b)),
                    h = d.by(a(e));
                return g === c && h === c ? (f = !0, 0) : h > g || "sortFirst" === g || "sortLast" === h ? -1 : g > h || "sortLast" === g || "sortFirst" === h ? 1 : 0
            }), f ? this.get() : (d.reverse && e.reverse(), e)) : []
        }, a.fn.sorted.defaults = {
            reverse: !1,
            by: null,
            randomize: !1
        }, E
    });;
/*!
 * Masonry PACKAGED v3.3.0
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

! function(a) {
    function b() {}

    function c(a) {
        function c(b) {
            b.prototype.option || (b.prototype.option = function(b) {
                a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b))
            })
        }

        function e(b, c) {
            a.fn[b] = function(e) {
                if ("string" == typeof e) {
                    for (var g = d.call(arguments, 1), h = 0, i = this.length; i > h; h++) {
                        var j = this[h],
                            k = a.data(j, b);
                        if (k)
                            if (a.isFunction(k[e]) && "_" !== e.charAt(0)) {
                                var l = k[e].apply(k, g);
                                if (void 0 !== l) return l
                            } else f("no such method '" + e + "' for " + b + " instance");
                        else f("cannot call methods on " + b + " prior to initialization; attempted to call '" + e + "'")
                    }
                    return this
                }
                return this.each(function() {
                    var d = a.data(this, b);
                    d ? (d.option(e), d._init()) : (d = new c(this, e), a.data(this, b, d))
                })
            }
        }
        if (a) {
            var f = "undefined" == typeof console ? b : function(a) {
                console.error(a)
            };
            return a.bridget = function(a, b) {
                c(b), e(a, b)
            }, a.bridget
        }
    }
    var d = Array.prototype.slice;
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], c) : c("object" == typeof exports ? require("jquery") : a.jQuery)
}(window),
function(a) {
    function b(b) {
        var c = a.event;
        return c.target = c.target || c.srcElement || b, c
    }
    var c = document.documentElement,
        d = function() {};
    c.addEventListener ? d = function(a, b, c) {
        a.addEventListener(b, c, !1)
    } : c.attachEvent && (d = function(a, c, d) {
        a[c + d] = d.handleEvent ? function() {
            var c = b(a);
            d.handleEvent.call(d, c)
        } : function() {
            var c = b(a);
            d.call(a, c)
        }, a.attachEvent("on" + c, a[c + d])
    });
    var e = function() {};
    c.removeEventListener ? e = function(a, b, c) {
        a.removeEventListener(b, c, !1)
    } : c.detachEvent && (e = function(a, b, c) {
        a.detachEvent("on" + b, a[b + c]);
        try {
            delete a[b + c]
        } catch (d) {
            a[b + c] = void 0
        }
    });
    var f = {
        bind: d,
        unbind: e
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", f) : "object" == typeof exports ? module.exports = f : a.eventie = f
}(window),
function() {
    function a() {}

    function b(a, b) {
        for (var c = a.length; c--;)
            if (a[c].listener === b) return c;
        return -1
    }

    function c(a) {
        return function() {
            return this[a].apply(this, arguments)
        }
    }
    var d = a.prototype,
        e = this,
        f = e.EventEmitter;
    d.getListeners = function(a) {
        var b, c, d = this._getEvents();
        if (a instanceof RegExp) {
            b = {};
            for (c in d) d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c])
        } else b = d[a] || (d[a] = []);
        return b
    }, d.flattenListeners = function(a) {
        var b, c = [];
        for (b = 0; b < a.length; b += 1) c.push(a[b].listener);
        return c
    }, d.getListenersAsObject = function(a) {
        var b, c = this.getListeners(a);
        return c instanceof Array && (b = {}, b[a] = c), b || c
    }, d.addListener = function(a, c) {
        var d, e = this.getListenersAsObject(a),
            f = "object" == typeof c;
        for (d in e) e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c : {
            listener: c,
            once: !1
        });
        return this
    }, d.on = c("addListener"), d.addOnceListener = function(a, b) {
        return this.addListener(a, {
            listener: b,
            once: !0
        })
    }, d.once = c("addOnceListener"), d.defineEvent = function(a) {
        return this.getListeners(a), this
    }, d.defineEvents = function(a) {
        for (var b = 0; b < a.length; b += 1) this.defineEvent(a[b]);
        return this
    }, d.removeListener = function(a, c) {
        var d, e, f = this.getListenersAsObject(a);
        for (e in f) f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1));
        return this
    }, d.off = c("removeListener"), d.addListeners = function(a, b) {
        return this.manipulateListeners(!1, a, b)
    }, d.removeListeners = function(a, b) {
        return this.manipulateListeners(!0, a, b)
    }, d.manipulateListeners = function(a, b, c) {
        var d, e, f = a ? this.removeListener : this.addListener,
            g = a ? this.removeListeners : this.addListeners;
        if ("object" != typeof b || b instanceof RegExp)
            for (d = c.length; d--;) f.call(this, b, c[d]);
        else
            for (d in b) b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e));
        return this
    }, d.removeEvent = function(a) {
        var b, c = typeof a,
            d = this._getEvents();
        if ("string" === c) delete d[a];
        else if (a instanceof RegExp)
            for (b in d) d.hasOwnProperty(b) && a.test(b) && delete d[b];
        else delete this._events;
        return this
    }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function(a, b) {
        var c, d, e, f, g = this.getListenersAsObject(a);
        for (e in g)
            if (g.hasOwnProperty(e))
                for (d = g[e].length; d--;) c = g[e][d], c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), f === this._getOnceReturnValue() && this.removeListener(a, c.listener);
        return this
    }, d.trigger = c("emitEvent"), d.emit = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(a, b)
    }, d.setOnceReturnValue = function(a) {
        return this._onceReturnValue = a, this
    }, d._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, d._getEvents = function() {
        return this._events || (this._events = {})
    }, a.noConflict = function() {
        return e.EventEmitter = f, a
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return a
    }) : "object" == typeof module && module.exports ? module.exports = a : e.EventEmitter = a
}.call(this),
    function(a) {
        function b(a) {
            if (a) {
                if ("string" == typeof d[a]) return a;
                a = a.charAt(0).toUpperCase() + a.slice(1);
                for (var b, e = 0, f = c.length; f > e; e++)
                    if (b = c[e] + a, "string" == typeof d[b]) return b
            }
        }
        var c = "Webkit Moz ms Ms O".split(" "),
            d = document.documentElement.style;
        "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function() {
            return b
        }) : "object" == typeof exports ? module.exports = b : a.getStyleProperty = b
    }(window),
    function(a) {
        function b(a) {
            var b = parseFloat(a),
                c = -1 === a.indexOf("%") && !isNaN(b);
            return c && b
        }

        function c() {}

        function d() {
            for (var a = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, b = 0, c = g.length; c > b; b++) {
                var d = g[b];
                a[d] = 0
            }
            return a
        }

        function e(c) {
            function e() {
                if (!m) {
                    m = !0;
                    var d = a.getComputedStyle;
                    if (j = function() {
                            var a = d ? function(a) {
                                return d(a, null)
                            } : function(a) {
                                return a.currentStyle
                            };
                            return function(b) {
                                var c = a(b);
                                return c || f("Style returned " + c + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), c
                            }
                        }(), k = c("boxSizing")) {
                        var e = document.createElement("div");
                        e.style.width = "200px", e.style.padding = "1px 2px 3px 4px", e.style.borderStyle = "solid", e.style.borderWidth = "1px 2px 3px 4px", e.style[k] = "border-box";
                        var g = document.body || document.documentElement;
                        g.appendChild(e);
                        var h = j(e);
                        l = 200 === b(h.width), g.removeChild(e)
                    }
                }
            }

            function h(a) {
                if (e(), "string" == typeof a && (a = document.querySelector(a)), a && "object" == typeof a && a.nodeType) {
                    var c = j(a);
                    if ("none" === c.display) return d();
                    var f = {};
                    f.width = a.offsetWidth, f.height = a.offsetHeight;
                    for (var h = f.isBorderBox = !(!k || !c[k] || "border-box" !== c[k]), m = 0, n = g.length; n > m; m++) {
                        var o = g[m],
                            p = c[o];
                        p = i(a, p);
                        var q = parseFloat(p);
                        f[o] = isNaN(q) ? 0 : q
                    }
                    var r = f.paddingLeft + f.paddingRight,
                        s = f.paddingTop + f.paddingBottom,
                        t = f.marginLeft + f.marginRight,
                        u = f.marginTop + f.marginBottom,
                        v = f.borderLeftWidth + f.borderRightWidth,
                        w = f.borderTopWidth + f.borderBottomWidth,
                        x = h && l,
                        y = b(c.width);
                    y !== !1 && (f.width = y + (x ? 0 : r + v));
                    var z = b(c.height);
                    return z !== !1 && (f.height = z + (x ? 0 : s + w)), f.innerWidth = f.width - (r + v), f.innerHeight = f.height - (s + w), f.outerWidth = f.width + t, f.outerHeight = f.height + u, f
                }
            }

            function i(b, c) {
                if (a.getComputedStyle || -1 === c.indexOf("%")) return c;
                var d = b.style,
                    e = d.left,
                    f = b.runtimeStyle,
                    g = f && f.left;
                return g && (f.left = b.currentStyle.left), d.left = c, c = d.pixelLeft, d.left = e, g && (f.left = g), c
            }
            var j, k, l, m = !1;
            return h
        }
        var f = "undefined" == typeof console ? c : function(a) {
                console.error(a)
            },
            g = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
        "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], e) : "object" == typeof exports ? module.exports = e(require("desandro-get-style-property")) : a.getSize = e(a.getStyleProperty)
    }(window),
    function(a) {
        function b(a) {
            "function" == typeof a && (b.isReady ? a() : g.push(a))
        }

        function c(a) {
            var c = "readystatechange" === a.type && "complete" !== f.readyState;
            b.isReady || c || d()
        }

        function d() {
            b.isReady = !0;
            for (var a = 0, c = g.length; c > a; a++) {
                var d = g[a];
                d()
            }
        }

        function e(e) {
            return "complete" === f.readyState ? d() : (e.bind(f, "DOMContentLoaded", c), e.bind(f, "readystatechange", c), e.bind(a, "load", c)), b
        }
        var f = a.document,
            g = [];
        b.isReady = !1, "function" == typeof define && define.amd ? define("doc-ready/doc-ready", ["eventie/eventie"], e) : "object" == typeof exports ? module.exports = e(require("eventie")) : a.docReady = e(a.eventie)
    }(window),
    function(a) {
        function b(a, b) {
            return a[g](b)
        }

        function c(a) {
            if (!a.parentNode) {
                var b = document.createDocumentFragment();
                b.appendChild(a)
            }
        }

        function d(a, b) {
            c(a);
            for (var d = a.parentNode.querySelectorAll(b), e = 0, f = d.length; f > e; e++)
                if (d[e] === a) return !0;
            return !1
        }

        function e(a, d) {
            return c(a), b(a, d)
        }
        var f, g = function() {
            if (a.matches) return "matches";
            if (a.matchesSelector) return "matchesSelector";
            for (var b = ["webkit", "moz", "ms", "o"], c = 0, d = b.length; d > c; c++) {
                var e = b[c],
                    f = e + "MatchesSelector";
                if (a[f]) return f
            }
        }();
        if (g) {
            var h = document.createElement("div"),
                i = b(h, "div");
            f = i ? b : e
        } else f = d;
        "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function() {
            return f
        }) : "object" == typeof exports ? module.exports = f : window.matchesSelector = f
    }(Element.prototype),
    function(a, b) {
        "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["doc-ready/doc-ready", "matches-selector/matches-selector"], function(c, d) {
            return b(a, c, d)
        }) : "object" == typeof exports ? module.exports = b(a, require("doc-ready"), require("desandro-matches-selector")) : a.fizzyUIUtils = b(a, a.docReady, a.matchesSelector)
    }(window, function(a, b, c) {
        var d = {};
        d.extend = function(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }, d.modulo = function(a, b) {
            return (a % b + b) % b
        };
        var e = Object.prototype.toString;
        d.isArray = function(a) {
            return "[object Array]" == e.call(a)
        }, d.makeArray = function(a) {
            var b = [];
            if (d.isArray(a)) b = a;
            else if (a && "number" == typeof a.length)
                for (var c = 0, e = a.length; e > c; c++) b.push(a[c]);
            else b.push(a);
            return b
        }, d.indexOf = Array.prototype.indexOf ? function(a, b) {
            return a.indexOf(b)
        } : function(a, b) {
            for (var c = 0, d = a.length; d > c; c++)
                if (a[c] === b) return c;
            return -1
        }, d.removeFrom = function(a, b) {
            var c = d.indexOf(a, b); - 1 != c && a.splice(c, 1)
        }, d.isElement = "function" == typeof HTMLElement || "object" == typeof HTMLElement ? function(a) {
            return a instanceof HTMLElement
        } : function(a) {
            return a && "object" == typeof a && 1 == a.nodeType && "string" == typeof a.nodeName
        }, d.setText = function() {
            function a(a, c) {
                b = b || (void 0 !== document.documentElement.textContent ? "textContent" : "innerText"), a[b] = c
            }
            var b;
            return a
        }(), d.getParent = function(a, b) {
            for (; a != document.body;)
                if (a = a.parentNode, c(a, b)) return a
        }, d.getQueryElement = function(a) {
            return "string" == typeof a ? document.querySelector(a) : a
        }, d.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, d.filterFindElements = function(a, b) {
            a = d.makeArray(a);
            for (var e = [], f = 0, g = a.length; g > f; f++) {
                var h = a[f];
                if (d.isElement(h))
                    if (b) {
                        c(h, b) && e.push(h);
                        for (var i = h.querySelectorAll(b), j = 0, k = i.length; k > j; j++) e.push(i[j])
                    } else e.push(h)
            }
            return e
        }, d.debounceMethod = function(a, b, c) {
            var d = a.prototype[b],
                e = b + "Timeout";
            a.prototype[b] = function() {
                var a = this[e];
                a && clearTimeout(a);
                var b = arguments,
                    f = this;
                this[e] = setTimeout(function() {
                    d.apply(f, b), delete f[e]
                }, c || 100)
            }
        }, d.toDashed = function(a) {
            return a.replace(/(.)([A-Z])/g, function(a, b, c) {
                return b + "-" + c
            }).toLowerCase()
        };
        var f = a.console;
        return d.htmlInit = function(c, e) {
            b(function() {
                for (var b = d.toDashed(e), g = document.querySelectorAll(".js-" + b), h = "data-" + b + "-options", i = 0, j = g.length; j > i; i++) {
                    var k, l = g[i],
                        m = l.getAttribute(h);
                    try {
                        k = m && JSON.parse(m)
                    } catch (n) {
                        f && f.error("Error parsing " + h + " on " + l.nodeName.toLowerCase() + (l.id ? "#" + l.id : "") + ": " + n);
                        continue
                    }
                    var o = new c(l, k),
                        p = a.jQuery;
                    p && p.data(l, e, o)
                }
            })
        }, d
    }),
    function(a, b) {
        "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property", "fizzy-ui-utils/utils"], function(c, d, e, f) {
            return b(a, c, d, e, f)
        }) : "object" == typeof exports ? module.exports = b(a, require("wolfy87-eventemitter"), require("get-size"), require("desandro-get-style-property"), require("fizzy-ui-utils")) : (a.Outlayer = {}, a.Outlayer.Item = b(a, a.EventEmitter, a.getSize, a.getStyleProperty, a.fizzyUIUtils))
    }(window, function(a, b, c, d, e) {
        function f(a) {
            for (var b in a) return !1;
            return b = null, !0
        }

        function g(a, b) {
            a && (this.element = a, this.layout = b, this.position = {
                x: 0,
                y: 0
            }, this._create())
        }
        var h = a.getComputedStyle,
            i = h ? function(a) {
                return h(a, null)
            } : function(a) {
                return a.currentStyle
            },
            j = d("transition"),
            k = d("transform"),
            l = j && k,
            m = !!d("perspective"),
            n = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "otransitionend",
                transition: "transitionend"
            }[j],
            o = ["transform", "transition", "transitionDuration", "transitionProperty"],
            p = function() {
                for (var a = {}, b = 0, c = o.length; c > b; b++) {
                    var e = o[b],
                        f = d(e);
                    f && f !== e && (a[e] = f)
                }
                return a
            }();
        e.extend(g.prototype, b.prototype), g.prototype._create = function() {
            this._transn = {
                ingProperties: {},
                clean: {},
                onEnd: {}
            }, this.css({
                position: "absolute"
            })
        }, g.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, g.prototype.getSize = function() {
            this.size = c(this.element)
        }, g.prototype.css = function(a) {
            var b = this.element.style;
            for (var c in a) {
                var d = p[c] || c;
                b[d] = a[c]
            }
        }, g.prototype.getPosition = function() {
            var a = i(this.element),
                b = this.layout.options,
                c = b.isOriginLeft,
                d = b.isOriginTop,
                e = parseInt(a[c ? "left" : "right"], 10),
                f = parseInt(a[d ? "top" : "bottom"], 10);
            e = isNaN(e) ? 0 : e, f = isNaN(f) ? 0 : f;
            var g = this.layout.size;
            e -= c ? g.paddingLeft : g.paddingRight, f -= d ? g.paddingTop : g.paddingBottom, this.position.x = e, this.position.y = f
        }, g.prototype.layoutPosition = function() {
            var a = this.layout.size,
                b = this.layout.options,
                c = {},
                d = b.isOriginLeft ? "paddingLeft" : "paddingRight",
                e = b.isOriginLeft ? "left" : "right",
                f = b.isOriginLeft ? "right" : "left",
                g = this.position.x + a[d];
            g = b.percentPosition && !b.isHorizontal ? g / a.width * 100 + "%" : g + "px", c[e] = g, c[f] = "";
            var h = b.isOriginTop ? "paddingTop" : "paddingBottom",
                i = b.isOriginTop ? "top" : "bottom",
                j = b.isOriginTop ? "bottom" : "top",
                k = this.position.y + a[h];
            k = b.percentPosition && b.isHorizontal ? k / a.height * 100 + "%" : k + "px", c[i] = k, c[j] = "", this.css(c), this.emitEvent("layout", [this])
        };
        var q = m ? function(a, b) {
            return "translate3d(" + a + "px, " + b + "px, 0)"
        } : function(a, b) {
            return "translate(" + a + "px, " + b + "px)"
        };
        g.prototype._transitionTo = function(a, b) {
            this.getPosition();
            var c = this.position.x,
                d = this.position.y,
                e = parseInt(a, 10),
                f = parseInt(b, 10),
                g = e === this.position.x && f === this.position.y;
            if (this.setPosition(a, b), g && !this.isTransitioning) return void this.layoutPosition();
            var h = a - c,
                i = b - d,
                j = {},
                k = this.layout.options;
            h = k.isOriginLeft ? h : -h, i = k.isOriginTop ? i : -i, j.transform = q(h, i), this.transition({
                to: j,
                onTransitionEnd: {
                    transform: this.layoutPosition
                },
                isCleaning: !0
            })
        }, g.prototype.goTo = function(a, b) {
            this.setPosition(a, b), this.layoutPosition()
        }, g.prototype.moveTo = l ? g.prototype._transitionTo : g.prototype.goTo, g.prototype.setPosition = function(a, b) {
            this.position.x = parseInt(a, 10), this.position.y = parseInt(b, 10)
        }, g.prototype._nonTransition = function(a) {
            this.css(a.to), a.isCleaning && this._removeStyles(a.to);
            for (var b in a.onTransitionEnd) a.onTransitionEnd[b].call(this)
        }, g.prototype._transition = function(a) {
            if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(a);
            var b = this._transn;
            for (var c in a.onTransitionEnd) b.onEnd[c] = a.onTransitionEnd[c];
            for (c in a.to) b.ingProperties[c] = !0, a.isCleaning && (b.clean[c] = !0);
            if (a.from) {
                this.css(a.from);
                var d = this.element.offsetHeight;
                d = null
            }
            this.enableTransition(a.to), this.css(a.to), this.isTransitioning = !0
        };
        var r = k && e.toDashed(k) + ",opacity";
        g.prototype.enableTransition = function() {
            this.isTransitioning || (this.css({
                transitionProperty: r,
                transitionDuration: this.layout.options.transitionDuration
            }), this.element.addEventListener(n, this, !1))
        }, g.prototype.transition = g.prototype[j ? "_transition" : "_nonTransition"], g.prototype.onwebkitTransitionEnd = function(a) {
            this.ontransitionend(a)
        }, g.prototype.onotransitionend = function(a) {
            this.ontransitionend(a)
        };
        var s = {
            "-webkit-transform": "transform",
            "-moz-transform": "transform",
            "-o-transform": "transform"
        };
        g.prototype.ontransitionend = function(a) {
            if (a.target === this.element) {
                var b = this._transn,
                    c = s[a.propertyName] || a.propertyName;
                if (delete b.ingProperties[c], f(b.ingProperties) && this.disableTransition(), c in b.clean && (this.element.style[a.propertyName] = "", delete b.clean[c]), c in b.onEnd) {
                    var d = b.onEnd[c];
                    d.call(this), delete b.onEnd[c]
                }
                this.emitEvent("transitionEnd", [this])
            }
        }, g.prototype.disableTransition = function() {
            this.removeTransitionStyles(), this.element.removeEventListener(n, this, !1), this.isTransitioning = !1
        }, g.prototype._removeStyles = function(a) {
            var b = {};
            for (var c in a) b[c] = "";
            this.css(b)
        };
        var t = {
            transitionProperty: "",
            transitionDuration: ""
        };
        return g.prototype.removeTransitionStyles = function() {
            this.css(t)
        }, g.prototype.removeElem = function() {
            this.element.parentNode.removeChild(this.element), this.css({
                display: ""
            }), this.emitEvent("remove", [this])
        }, g.prototype.remove = function() {
            if (!j || !parseFloat(this.layout.options.transitionDuration)) return void this.removeElem();
            var a = this;
            this.once("transitionEnd", function() {
                a.removeElem()
            }), this.hide()
        }, g.prototype.reveal = function() {
            delete this.isHidden, this.css({
                display: ""
            });
            var a = this.layout.options,
                b = {},
                c = this.getHideRevealTransitionEndProperty("visibleStyle");
            b[c] = this.onRevealTransitionEnd, this.transition({
                from: a.hiddenStyle,
                to: a.visibleStyle,
                isCleaning: !0,
                onTransitionEnd: b
            })
        }, g.prototype.onRevealTransitionEnd = function() {
            this.isHidden || this.emitEvent("reveal")
        }, g.prototype.getHideRevealTransitionEndProperty = function(a) {
            var b = this.layout.options[a];
            if (b.opacity) return "opacity";
            for (var c in b) return c
        }, g.prototype.hide = function() {
            this.isHidden = !0, this.css({
                display: ""
            });
            var a = this.layout.options,
                b = {},
                c = this.getHideRevealTransitionEndProperty("hiddenStyle");
            b[c] = this.onHideTransitionEnd, this.transition({
                from: a.visibleStyle,
                to: a.hiddenStyle,
                isCleaning: !0,
                onTransitionEnd: b
            })
        }, g.prototype.onHideTransitionEnd = function() {
            this.isHidden && (this.css({
                display: "none"
            }), this.emitEvent("hide"))
        }, g.prototype.destroy = function() {
            this.css({
                position: "",
                left: "",
                right: "",
                top: "",
                bottom: "",
                transition: "",
                transform: ""
            })
        }, g
    }),
    function(a, b) {
        "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "eventEmitter/EventEmitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function(c, d, e, f, g) {
            return b(a, c, d, e, f, g)
        }) : "object" == typeof exports ? module.exports = b(a, require("eventie"), require("wolfy87-eventemitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : a.Outlayer = b(a, a.eventie, a.EventEmitter, a.getSize, a.fizzyUIUtils, a.Outlayer.Item)
    }(window, function(a, b, c, d, e, f) {
        function g(a, b) {
            var c = e.getQueryElement(a);
            if (!c) return void(h && h.error("Bad element for " + this.constructor.namespace + ": " + (c || a)));
            this.element = c, i && (this.$element = i(this.element)), this.options = e.extend({}, this.constructor.defaults), this.option(b);
            var d = ++k;
            this.element.outlayerGUID = d, l[d] = this, this._create(), this.options.isInitLayout && this.layout()
        }
        var h = a.console,
            i = a.jQuery,
            j = function() {},
            k = 0,
            l = {};
        return g.namespace = "outlayer", g.Item = f, g.defaults = {
            containerStyle: {
                position: "relative"
            },
            isInitLayout: !0,
            isOriginLeft: !0,
            isOriginTop: !0,
            isResizeBound: !0,
            isResizingContainer: !0,
            transitionDuration: "0.4s",
            hiddenStyle: {
                opacity: 0,
                transform: "scale(0.001)"
            },
            visibleStyle: {
                opacity: 1,
                transform: "scale(1)"
            }
        }, e.extend(g.prototype, c.prototype), g.prototype.option = function(a) {
            e.extend(this.options, a)
        }, g.prototype._create = function() {
            this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), e.extend(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
        }, g.prototype.reloadItems = function() {
            this.items = this._itemize(this.element.children)
        }, g.prototype._itemize = function(a) {
            for (var b = this._filterFindItemElements(a), c = this.constructor.Item, d = [], e = 0, f = b.length; f > e; e++) {
                var g = b[e],
                    h = new c(g, this);
                d.push(h)
            }
            return d
        }, g.prototype._filterFindItemElements = function(a) {
            return e.filterFindElements(a, this.options.itemSelector)
        }, g.prototype.getItemElements = function() {
            for (var a = [], b = 0, c = this.items.length; c > b; b++) a.push(this.items[b].element);
            return a
        }, g.prototype.layout = function() {
            this._resetLayout(), this._manageStamps();
            var a = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
            this.layoutItems(this.items, a), this._isLayoutInited = !0
        }, g.prototype._init = g.prototype.layout, g.prototype._resetLayout = function() {
            this.getSize()
        }, g.prototype.getSize = function() {
            this.size = d(this.element)
        }, g.prototype._getMeasurement = function(a, b) {
            var c, f = this.options[a];
            f ? ("string" == typeof f ? c = this.element.querySelector(f) : e.isElement(f) && (c = f), this[a] = c ? d(c)[b] : f) : this[a] = 0
        }, g.prototype.layoutItems = function(a, b) {
            a = this._getItemsForLayout(a), this._layoutItems(a, b), this._postLayout()
        }, g.prototype._getItemsForLayout = function(a) {
            for (var b = [], c = 0, d = a.length; d > c; c++) {
                var e = a[c];
                e.isIgnored || b.push(e)
            }
            return b
        }, g.prototype._layoutItems = function(a, b) {
            if (this._emitCompleteOnItems("layout", a), a && a.length) {
                for (var c = [], d = 0, e = a.length; e > d; d++) {
                    var f = a[d],
                        g = this._getItemLayoutPosition(f);
                    g.item = f, g.isInstant = b || f.isLayoutInstant, c.push(g)
                }
                this._processLayoutQueue(c)
            }
        }, g.prototype._getItemLayoutPosition = function() {
            return {
                x: 0,
                y: 0
            }
        }, g.prototype._processLayoutQueue = function(a) {
            for (var b = 0, c = a.length; c > b; b++) {
                var d = a[b];
                this._positionItem(d.item, d.x, d.y, d.isInstant)
            }
        }, g.prototype._positionItem = function(a, b, c, d) {
            d ? a.goTo(b, c) : a.moveTo(b, c)
        }, g.prototype._postLayout = function() {
            this.resizeContainer()
        }, g.prototype.resizeContainer = function() {
            if (this.options.isResizingContainer) {
                var a = this._getContainerSize();
                a && (this._setContainerMeasure(a.width, !0), this._setContainerMeasure(a.height, !1))
            }
        }, g.prototype._getContainerSize = j, g.prototype._setContainerMeasure = function(a, b) {
            if (void 0 !== a) {
                var c = this.size;
                c.isBorderBox && (a += b ? c.paddingLeft + c.paddingRight + c.borderLeftWidth + c.borderRightWidth : c.paddingBottom + c.paddingTop + c.borderTopWidth + c.borderBottomWidth), a = Math.max(a, 0), this.element.style[b ? "width" : "height"] = a + "px"
            }
        }, g.prototype._emitCompleteOnItems = function(a, b) {
            function c() {
                e.emitEvent(a + "Complete", [b])
            }

            function d() {
                g++, g === f && c()
            }
            var e = this,
                f = b.length;
            if (!b || !f) return void c();
            for (var g = 0, h = 0, i = b.length; i > h; h++) {
                var j = b[h];
                j.once(a, d)
            }
        }, g.prototype.ignore = function(a) {
            var b = this.getItem(a);
            b && (b.isIgnored = !0)
        }, g.prototype.unignore = function(a) {
            var b = this.getItem(a);
            b && delete b.isIgnored
        }, g.prototype.stamp = function(a) {
            if (a = this._find(a)) {
                this.stamps = this.stamps.concat(a);
                for (var b = 0, c = a.length; c > b; b++) {
                    var d = a[b];
                    this.ignore(d)
                }
            }
        }, g.prototype.unstamp = function(a) {
            if (a = this._find(a))
                for (var b = 0, c = a.length; c > b; b++) {
                    var d = a[b];
                    e.removeFrom(this.stamps, d), this.unignore(d)
                }
        }, g.prototype._find = function(a) {
            return a ? ("string" == typeof a && (a = this.element.querySelectorAll(a)), a = e.makeArray(a)) : void 0
        }, g.prototype._manageStamps = function() {
            if (this.stamps && this.stamps.length) {
                this._getBoundingRect();
                for (var a = 0, b = this.stamps.length; b > a; a++) {
                    var c = this.stamps[a];
                    this._manageStamp(c)
                }
            }
        }, g.prototype._getBoundingRect = function() {
            var a = this.element.getBoundingClientRect(),
                b = this.size;
            this._boundingRect = {
                left: a.left + b.paddingLeft + b.borderLeftWidth,
                top: a.top + b.paddingTop + b.borderTopWidth,
                right: a.right - (b.paddingRight + b.borderRightWidth),
                bottom: a.bottom - (b.paddingBottom + b.borderBottomWidth)
            }
        }, g.prototype._manageStamp = j, g.prototype._getElementOffset = function(a) {
            var b = a.getBoundingClientRect(),
                c = this._boundingRect,
                e = d(a),
                f = {
                    left: b.left - c.left - e.marginLeft,
                    top: b.top - c.top - e.marginTop,
                    right: c.right - b.right - e.marginRight,
                    bottom: c.bottom - b.bottom - e.marginBottom
                };
            return f
        }, g.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, g.prototype.bindResize = function() {
            this.isResizeBound || (b.bind(a, "resize", this), this.isResizeBound = !0)
        }, g.prototype.unbindResize = function() {
            this.isResizeBound && b.unbind(a, "resize", this), this.isResizeBound = !1
        }, g.prototype.onresize = function() {
            function a() {
                b.resize(), delete b.resizeTimeout
            }
            this.resizeTimeout && clearTimeout(this.resizeTimeout);
            var b = this;
            this.resizeTimeout = setTimeout(a, 100)
        }, g.prototype.resize = function() {
            this.isResizeBound && this.needsResizeLayout() && this.layout()
        }, g.prototype.needsResizeLayout = function() {
            var a = d(this.element),
                b = this.size && a;
            return b && a.innerWidth !== this.size.innerWidth
        }, g.prototype.addItems = function(a) {
            var b = this._itemize(a);
            return b.length && (this.items = this.items.concat(b)), b
        }, g.prototype.appended = function(a) {
            var b = this.addItems(a);
            b.length && (this.layoutItems(b, !0), this.reveal(b))
        }, g.prototype.prepended = function(a) {
            var b = this._itemize(a);
            if (b.length) {
                var c = this.items.slice(0);
                this.items = b.concat(c), this._resetLayout(), this._manageStamps(), this.layoutItems(b, !0), this.reveal(b), this.layoutItems(c)
            }
        }, g.prototype.reveal = function(a) {
            this._emitCompleteOnItems("reveal", a);
            for (var b = a && a.length, c = 0; b && b > c; c++) {
                var d = a[c];
                d.reveal()
            }
        }, g.prototype.hide = function(a) {
            this._emitCompleteOnItems("hide", a);
            for (var b = a && a.length, c = 0; b && b > c; c++) {
                var d = a[c];
                d.hide()
            }
        }, g.prototype.revealItemElements = function(a) {
            var b = this.getItems(a);
            this.reveal(b)
        }, g.prototype.hideItemElements = function(a) {
            var b = this.getItems(a);
            this.hide(b)
        }, g.prototype.getItem = function(a) {
            for (var b = 0, c = this.items.length; c > b; b++) {
                var d = this.items[b];
                if (d.element === a) return d
            }
        }, g.prototype.getItems = function(a) {
            a = e.makeArray(a);
            for (var b = [], c = 0, d = a.length; d > c; c++) {
                var f = a[c],
                    g = this.getItem(f);
                g && b.push(g)
            }
            return b
        }, g.prototype.remove = function(a) {
            var b = this.getItems(a);
            if (this._emitCompleteOnItems("remove", b), b && b.length)
                for (var c = 0, d = b.length; d > c; c++) {
                    var f = b[c];
                    f.remove(), e.removeFrom(this.items, f)
                }
        }, g.prototype.destroy = function() {
            var a = this.element.style;
            a.height = "", a.position = "", a.width = "";
            for (var b = 0, c = this.items.length; c > b; b++) {
                var d = this.items[b];
                d.destroy()
            }
            this.unbindResize();
            var e = this.element.outlayerGUID;
            delete l[e], delete this.element.outlayerGUID, i && i.removeData(this.element, this.constructor.namespace)
        }, g.data = function(a) {
            a = e.getQueryElement(a);
            var b = a && a.outlayerGUID;
            return b && l[b]
        }, g.create = function(a, b) {
            function c() {
                g.apply(this, arguments)
            }
            return Object.create ? c.prototype = Object.create(g.prototype) : e.extend(c.prototype, g.prototype), c.prototype.constructor = c, c.defaults = e.extend({}, g.defaults), e.extend(c.defaults, b), c.prototype.settings = {}, c.namespace = a, c.data = g.data, c.Item = function() {
                f.apply(this, arguments)
            }, c.Item.prototype = new f, e.htmlInit(c, a), i && i.bridget && i.bridget(a, c), c
        }, g.Item = f, g
    }),
    function(a, b) {
        "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "fizzy-ui-utils/utils"], b) : "object" == typeof exports ? module.exports = b(require("outlayer"), require("get-size"), require("fizzy-ui-utils")) : a.Masonry = b(a.Outlayer, a.getSize, a.fizzyUIUtils)
    }(window, function(a, b, c) {
        var d = a.create("masonry");
        return d.prototype._resetLayout = function() {
            this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
            var a = this.cols;
            for (this.colYs = []; a--;) this.colYs.push(0);
            this.maxY = 0
        }, d.prototype.measureColumns = function() {
            if (this.getContainerWidth(), !this.columnWidth) {
                var a = this.items[0],
                    c = a && a.element;
                this.columnWidth = c && b(c).outerWidth || this.containerWidth
            }
            var d = this.columnWidth += this.gutter,
                e = this.containerWidth + this.gutter,
                f = e / d,
                g = d - e % d,
                h = g && 1 > g ? "round" : "floor";
            f = Math[h](f), this.cols = Math.max(f, 1)
        }, d.prototype.getContainerWidth = function() {
            var a = this.options.isFitWidth ? this.element.parentNode : this.element,
                c = b(a);
            this.containerWidth = c && c.innerWidth
        }, d.prototype._getItemLayoutPosition = function(a) {
            a.getSize();
            var b = a.size.outerWidth % this.columnWidth,
                d = b && 1 > b ? "round" : "ceil",
                e = Math[d](a.size.outerWidth / this.columnWidth);
            e = Math.min(e, this.cols);
            for (var f = this._getColGroup(e), g = Math.min.apply(Math, f), h = c.indexOf(f, g), i = {
                    x: this.columnWidth * h,
                    y: g
                }, j = g + a.size.outerHeight, k = this.cols + 1 - f.length, l = 0; k > l; l++) this.colYs[h + l] = j;
            return i
        }, d.prototype._getColGroup = function(a) {
            if (2 > a) return this.colYs;
            for (var b = [], c = this.cols + 1 - a, d = 0; c > d; d++) {
                var e = this.colYs.slice(d, d + a);
                b[d] = Math.max.apply(Math, e)
            }
            return b
        }, d.prototype._manageStamp = function(a) {
            var c = b(a),
                d = this._getElementOffset(a),
                e = this.options.isOriginLeft ? d.left : d.right,
                f = e + c.outerWidth,
                g = Math.floor(e / this.columnWidth);
            g = Math.max(0, g);
            var h = Math.floor(f / this.columnWidth);
            h -= f % this.columnWidth ? 0 : 1, h = Math.min(this.cols - 1, h);
            for (var i = (this.options.isOriginTop ? d.top : d.bottom) + c.outerHeight, j = g; h >= j; j++) this.colYs[j] = Math.max(i, this.colYs[j])
        }, d.prototype._getContainerSize = function() {
            this.maxY = Math.max.apply(Math, this.colYs);
            var a = {
                height: this.maxY
            };
            return this.options.isFitWidth && (a.width = this._getContainerFitWidth()), a
        }, d.prototype._getContainerFitWidth = function() {
            for (var a = 0, b = this.cols; --b && 0 === this.colYs[b];) a++;
            return (this.cols - a) * this.columnWidth - this.gutter
        }, d.prototype.needsResizeLayout = function() {
            var a = this.containerWidth;
            return this.getContainerWidth(), a !== this.containerWidth
        }, d
    });;
(function($) {
    "use strict";
    $.ajaxChimp = {
        responses: {
            "We have sent you a confirmation email": 0,
            "Please enter a value": 1,
            "An email address must contain a single @": 2,
            "The domain portion of the email address is invalid (the portion after the @: )": 3,
            "The username portion of the email address is invalid (the portion before the @: )": 4,
            "This email address looks fake or invalid. Please enter a real email address": 5
        },
        translations: {
            en: null
        },
        init: function(selector, options) {
            $(selector).ajaxChimp(options)
        }
    };
    $.fn.ajaxChimp = function(options) {
        $(this).each(function(i, elem) {
            var form = $(elem);
            var email = form.find("input[type=email]");
            var status = $("div#status");
            var settings = $.extend({
                url: form.attr("action"),
                language: "en"
            }, options);
            var url = settings.url.replace("/post?", "/post-json?").concat("&c=?");
            form.attr("novalidate", "true");
            email.attr("name", "EMAIL");
            form.submit(function() {
                var msg;

                function successCallback(resp) {
                    status.hide();
                    if (resp.result === "success") {
                        msg = "We have sent you a confirmation email";
                        email.removeClass("error").addClass("valid")
                    } else {
                        email.removeClass("valid").addClass("error");
                        var index = -1;
                        try {
                            var parts = resp.msg.split(" - ", 2);
                            if (parts[1] === undefined) {
                                msg = resp.msg
                            } else {
                                var i = parseInt(parts[0], 10);
                                if (i.toString() === parts[0]) {
                                    index = parts[0];
                                    msg = parts[1]
                                } else {
                                    index = -1;
                                    msg = resp.msg
                                }
                            }
                        } catch (e) {
                            index = -1;
                            msg = resp.msg
                        }
                    }
                    if (settings.language !== "en" && $.ajaxChimp.responses[msg] !== undefined && $.ajaxChimp.translations && $.ajaxChimp.translations[settings.language] && $.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]]) {
                        msg = $.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]]
                    }
                    if (settings.callback) {
                        settings.callback(resp)
                    }
                }
                var data = {};
                var dataArray = form.serializeArray();
                $.each(dataArray, function(index, item) {
                    data[item.name] = item.value
                });
                status.show();
                $.ajax({
                    url: url,
                    data: data,
                    success: successCallback,
                    dataType: "jsonp",
                    error: function(resp, text) {
                        console.log("mailchimp ajax submit error: " + text)
                    }
                });
                var submitMsg = "Submitting...";
                if (settings.language !== "en" && $.ajaxChimp.translations && $.ajaxChimp.translations[settings.language] && $.ajaxChimp.translations[settings.language]["submit"]) {
                    submitMsg = $.ajaxChimp.translations[settings.language]["submit"]
                }
                return false
            })
        });
        return this
    }
})(jQuery);;
/*
 * @author  Mudit Ameta
 * @license https://github.com/zeusdeux/isInViewport/blob/master/license.md MIT
 */
! function(a, b) {
    function c(b) {
        var c, d = a("<div></div>").css({
            width: "100%"
        });
        return b.append(d), c = b.width() - d.width(), d.remove(), c
    }

    function d(e, f) {
        var g = e.getBoundingClientRect(),
            h = g.top,
            i = g.bottom,
            j = g.left,
            k = g.right,
            l = a.extend({
                tolerance: 0,
                viewport: b
            }, f),
            m = !1,
            n = l.viewport.jquery ? l.viewport : a(l.viewport);
        n.length || (console.warn("isInViewport: The viewport selector you have provided matches no element on page."), console.warn("isInViewport: Defaulting to viewport as window"), n = a(b));
        var o = n.height(),
            p = n.width(),
            q = n.get(0).toString();
        if (n[0] !== b && "[object Window]" !== q && "[object DOMWindow]" !== q) {
            var r = n.get(0).getBoundingClientRect();
            h -= r.top, i -= r.top, j -= r.left, k -= r.left, d.scrollBarWidth = d.scrollBarWidth || c(n), p -= d.scrollBarWidth
        }
        return l.tolerance = ~~Math.round(parseFloat(l.tolerance)), l.tolerance < 0 && (l.tolerance = o + l.tolerance), 0 >= k || j >= p ? m : m = l.tolerance ? !!(h <= l.tolerance && i >= l.tolerance) : !!(i > 0 && o >= h)
    }
    String.prototype.hasOwnProperty("trim") || (String.prototype.trim = function() {
        return this.replace(/^\s*(.*?)\s*$/, "$1")
    });
    var e = function(b) {
        if (1 === arguments.length && "function" == typeof b && (b = [b]), !(b instanceof Array)) throw new SyntaxError("isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions");
        for (var c = 0; c < b.length; c++)
            if ("function" == typeof b[c])
                for (var d = 0; d < this.length; d++) b[c].call(a(this[d]));
            else console.warn("isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions"), console.warn("isInViewport: Ignoring non-function values in array and moving on");
        return this
    };
    a.fn["do"] = function(a) {
        return console.warn("isInViewport: .do causes issues in IE and some browsers since its a reserved. Use $.fn.run instead i.e., $(el).run(fn)."), e(a)
    }, a.fn.run = e, a.extend(a.expr[":"], {
        "in-viewport": function(a, b, c) {
            if (c[3]) {
                var e = c[3].split(",");
                return 1 === e.length && isNaN(e[0]) && (e[1] = e[0], e[0] = void 0), d(a, {
                    tolerance: e[0] ? e[0].trim() : void 0,
                    viewport: e[1] ? e[1].trim() : void 0
                })
            }
            return d(a)
        }
    })
}(jQuery, window);;
"use strict";

function dissmissPreloader() {
    var a = $("#preloader"),
        b = $("body");
    b.css("overflow-y", "auto"), a.fadeOut("fast")
}

function trianglesReady() {
    dissmissPreloader()
}

function initializeMap() {
    var a = [{
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [{
                color: "#444444"
            }]
        }, {
            featureType: "landscape",
            elementType: "all",
            stylers: [{
                color: "#f2f2f2"
            }]
        }, {
            featureType: "poi",
            elementType: "all",
            stylers: [{
                visibility: "off"
            }]
        }, {
            featureType: "road",
            elementType: "all",
            stylers: [{
                saturation: -100
            }, {
                lightness: 45
            }]
        }, {
            featureType: "road.highway",
            elementType: "all",
            stylers: [{
                visibility: "simplified"
            }]
        }, {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [{
                visibility: "off"
            }]
        }, {
            featureType: "transit",
            elementType: "all",
            stylers: [{
                visibility: "off"
            }]
        }, {
            featureType: "water",
            elementType: "all",
            stylers: [{
                color: "#46bcec"
            }, {
                visibility: "on"
            }]
        }],
        b = new google.maps.StyledMapType(a, {
            name: "Styled Map"
        }),
        c = new google.maps.LatLng(Wata.googleMaps.lat, Wata.googleMaps.lng),
        d = {
            zoom: Wata.googleMaps.zoom,
            center: c,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, "map_style"]
            },
            scrollwheel: !1,
            draggable: !1
        },
        e = new google.maps.Map(document.getElementById("map-canvas"), d);
    new google.maps.Marker({
        position: c,
        map: e
    });
    e.mapTypes.set("map_style", b), e.setMapTypeId("map_style")
}! function() {
    function a() {
        b = 0, c = 0, d = 0;
        //b = window.innerHeight, c = f.clientHeight, d = b - c, e.style.height = d + "px"
    }
    var b, c, d, e = document.getElementById("triangles"),
        f = document.getElementById("nav");
    a(), window.addEventListener("resize", a)
}(), $(document).ready(function() {
    $(".scrollspy").scrollSpy(), $(".materialboxed").materialbox(), $(".button-collapse").sideNav({
        closeOnClick: !0
    }), ScrollAnimations(), Shuffle.init(), CurrencySwitcher();
    var a = $(".masonry").masonry({
        itemSelector: ".col"
    });
    a.imagesLoaded().progress(function() {
        a.masonry("layout")
    });
    var b = $("form#mc-embedded-subscribe-form");
    b.ajaxChimp({
            url: $(this).attr("action"),
            callback: function(a) {
                var c = a.msg,
                    d = a.result,
                    e = "success" === d ? 1e4 : 5e3;
                Materialize.toast(c.replace(/\d - /, ""), e, d), "success" === d && (b.find("input[type=email]").val(""), b.find("label").removeClass("active"))
            }
        }),
        function() {
            function a() {
                for (var a = 0; j > a; a++)
                    if (0 === i[a].value.length) return !1;
                return !0
            }

            function b() {
                var a = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return k[0].value.length > 0 && a.test(k[0].value)
            }

            function c() {
                a() && b() ? (g.addClass(h), l = !0) : (g.removeClass(h), l = !1)
            }

            function d() {
                m.show(), $.ajax({
                    url: e.attr("action"),
                    data: e.serialize(),
                    type: "POST"
                }).done(function(a) {
                    m.hide(), "success" == a ? (Materialize.toast(Wata.toastMessages.messageSent, 7500, "success"), f.val(""), k.removeClass("valid"), c()) : Materialize.toast(Wata.toastMessages.somethingWrong + a, 7500, "error")
                }).error(function(a) {
                    m.hide(), Materialize.toast(Wata.toastMessages.somethingWrong + resp, 7500, "error")
                })
            }
            var e = $("form#contact-form"),
                f = e.find("input, textarea"),
                g = e.find("button[type=submit]"),
                h = "waves-effect waves-light green accent-2 indigo-text text-darken-4",
                i = $(".required"),
                j = i.length,
                k = e.find("input#email"),
                l = !1,
                m = $("div#status");
            e.on("submit", function(c) {
                c.preventDefault(), l ? d() : (a() || Materialize.toast(Wata.toastMessages.fillInRequiredFields, 5e3, "error"), a() && !b() && Materialize.toast(Wata.toastMessages.enterValidEmail, 5e3, "error"))
            }), f.on("blur", function() {
                c()
            }), k.on("blur", function() {
                var a = k[0].value.length;
                !b() && a > 0 ? k.addClass("invalid").removeClass("valid") : b() && a > 0 ? k.addClass("valid").removeClass("invalid") : 0 === a && k.removeClass("valid invalid")
            })
        }(), $("#explore").on("click", function(a) {
            a.preventDefault();
            var b = $("#services").offset().top + 1;
            $("html, body").animate({
                scrollTop: b - 64
            }, {
                duration: 400,
                queue: !1,
                easing: "easeOutCubic"
            })
        }),
        function() {
            function a() {
                e.removeClass("enter").addClass("translate").html(""), d.show().css("visibility", "hidden"), $(document).scrollTop(b), d.hide().css("visibility", "visible").fadeIn(), $("div#shuffle-grid").shuffle("update"), $(".masonry").masonry()
            }
            var b, c, d = $("#wrapper"),
                e = $("#ajax-box"),
                f = window.matchMedia("only screen and (max-width: 600px)");
            $("a.ajax-link").on("click", function(g) {
                g.preventDefault(), b = $(document).scrollTop(), e.load($(this).attr("href"), function(b, g, h) {
                    return "error" === g ? (a(), Materialize.toast(Wata.toastMessages.somethingWrong + h.status + " " + h.statusText, 5e3, "error"), !1) : (d.fadeOut("fast", function() {
                        window.scrollTo(0, 0)
                    }), $(".materialboxed").length && $(".materialboxed").materialbox(), $("ul.tabs").length && $("ul.tabs").tabs(), e.addClass("enter"), void setTimeout(function() {
                        e.removeClass("translate enter"), $("#ajax-status").hide(), c = $(".parallax").length, c && !f.matches ? $(".parallax").parallax() : c && f && $(".parallax img").css({
                            display: "block",
                            height: 500
                        })
                    }, 750))
                })
            }), $(document).on("click", "#close-ajax", function(b) {
                b.preventDefault(), a()
            })
        }(), 

                //initializeMap()
             $(".activator, .card-title").on("click", function() {
            $(this).parents(".card").toggleClass("active")
        });
    var c = .65 * window.innerHeight;
    $(window).scroll(function() {
        $(".picture-item:in-viewport(" + c + ")").addClass("animate"), $(".team .col:in-viewport(" + c + ")").addClass("animate"), $(".masonry .card:in-viewport(" + c + ")").addClass("animate")
    })
});
var ScrollAnimations = function() {
        var a, b = new ScrollMagic.Controller,
            c = $(".services .animated-color"),
            d = ["rgb(26, 35, 126)", "rgb(28, 37, 135)", "rgb(29, 40, 143)", "rgb(31, 42, 152)", "rgb(33, 44, 160)", "rgb(36, 49, 178)", "rgb(38, 52, 186)", "rgb(39, 54, 199)", "rgb(41, 56, 203)", "rgb(43, 58, 211)"],
            e = new ScrollMagic.Scene({
                triggerElement: "#services",
                duration: "75%"
            }).addTo(b);
        e.on("progress", function(b) {
            a = Math.floor(10 * b.progress), c.css("color", d[a])
        });
        var f, g = (new ScrollMagic.Scene({
                triggerElement: ".best-offer"
            }).setClassToggle(".best-offer", "z-depth-4").addTo(b), new ScrollMagic.Scene({
                triggerElement: "#get-started",
                duration: "75%"
            }).addTo(b)),
            h = $("#get-started"),
            i = ["#f2f2f2", "#ededed", "#e8e8e8", "#e3e3e3", "#dedede", "#dcdcdc", "#d6d6d6", "#d3d3d3", "#d4d4d4", "#cfcfcf"];
        g.on("progress", function(a) {
            f = Math.floor(10 * a.progress), h.css("background-color", i[f])
        });
        var j, k = new ScrollMagic.Scene({
                triggerElement: "#subscribe",
                duration: "75%"
            }).addTo(b),
            l = $("#subscribe");
        k.on("progress", function(a) {
            j = Math.floor(10 * a.progress), l.css("background-color", i[j])
        })
    },
    Shuffle = function(a, b) {
        var c, d, e, f = a("div#shuffle-grid"),
            g = f.find("img"),
            h = a("div.filter-options"),
            i = h.children(),
            j = a("#all");
        return d = function() {
            c = new b(g.get()), c.on("always", e)
        }, e = function(a) {
            f.shuffle({
                itemSelector: ".picture-item"
            })
        }, i.on("click", function() {
            var b = a(this),
                c = b.hasClass("active"),
                d = "all" === b.attr("id"),
                e = c ? "all" : b.data("group");
            return c && d ? !1 : (c || a(".filter-options .active").removeClass("active"), c && !d && j.addClass("active"), b.toggleClass("active"), d && j.addClass("active"), void f.shuffle("shuffle", e))
        }), i = null, {
            init: d
        }
    }(jQuery, window.imagesLoaded),
    CurrencySwitcher = function() {
        var a, b = $(".currency-switcher"),
            c = Wata.currencySwitcher.offers,
            d = Object.keys(c),
            e = d.length,
            f = Wata.currencySwitcher.symbols;
        b.find("input[type=radio]").on("change", function() {
            a = this.id;
            for (var b = 0; e > b; b++) $("#" + d[b]).find(".price").text(f[a] + c[d[b]][a])
        })
    };;
/**

The MIT License (MIT)

Copyright (c) 2014 Maksim Surguy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

**/
function initialise() {
    createRenderer(), createScene(), createMesh(), addLights(), addEventListeners(), resize(container.offsetWidth, container.offsetHeight), animate(), trianglesReady()
}

function createRenderer() {
    webglRenderer = new FSS.WebGLRenderer, canvasRenderer = new FSS.CanvasRenderer, svgRenderer = new FSS.SVGRenderer, setRenderer(RENDER.renderer)
}

function setRenderer(e) {
    switch (renderer && output.removeChild(renderer.element), e) {
        case WEBGL:
            renderer = webglRenderer;
            break;
        case CANVAS:
            renderer = canvasRenderer;
            break;
        case SVG:
            renderer = svgRenderer
    }
    renderer = svgRenderer, renderer.setSize(container.offsetWidth, container.offsetHeight), output.appendChild(renderer.element)
}

function createScene() {
    scene = new FSS.Scene
}

function createMesh() {
    scene.remove(mesh), renderer.clear(), geometry = new FSS.Plane(MESH.width * renderer.width, MESH.height * renderer.height, MESH.slices), material = new FSS.Material(MESH.ambient, MESH.diffuse), mesh = new FSS.Mesh(geometry, material), scene.add(mesh);
    var e, t;
    for (e = geometry.vertices.length - 1; e >= 0; e--) t = geometry.vertices[e], t.depth = Math.randomInRange(0, MESH.maxdepth / 10), t.anchor = FSS.Vector3.clone(t.position)
}

function addLight(e, t, i, r, n) {
    e = e !== void 0 ? e : LIGHT.ambient, t = t !== void 0 ? t : LIGHT.diffuse, i = i !== void 0 ? i : LIGHT.xPos, r = r !== void 0 ? r : LIGHT.yPos, n = n !== void 0 ? n : LIGHT.zOffset, renderer.clear(), light = new FSS.Light(e, t), light.ambientHex = light.ambient.format(), light.diffuseHex = light.diffuse.format(), light.setPosition(i, r, n), scene.add(light), LIGHT.diffuse = t, LIGHT.proxy = light, LIGHT.pickedup = !0, LIGHT.currIndex++
}

function addLights() {
    addLight(), LIGHT.count++
}

function trimLights(e) {
    for (l = e; scene.lights.length >= l; l++) light = scene.lights[l], scene.remove(light), LIGHT.currIndex--;
    LIGHT.proxy = scene.lights[LIGHT.currIndex - 1], LIGHT.pickedup = !1, renderer.clear()
}

function resize(e, t) {
    renderer.setSize(e, t), FSS.Vector3.set(center, renderer.halfWidth, renderer.halfHeight), createMesh()
}

function animate() {
    update(), render(), requestAnimationFrame(animate)
}

function update() {
    var e, t, i = MESH.depth / 100;
    for (e = geometry.vertices.length - 1; e >= 0; e--) t = geometry.vertices[e], FSS.Vector3.set(t.position, 1, 1, t.depth * i), FSS.Vector3.add(t.position, t.anchor);
    geometry.dirty = !0
}

function render() {
    renderer.render(scene)
}

function addEventListeners() {
    window.addEventListener("resize", onWindowResize), container.addEventListener("mousemove", onMouseMove)
}

function addControls() {
    var e, t, i;
    gui = new dat.GUI({
        autoPlace: !1
    }), controls.appendChild(gui.domElement), renderFolder = gui.addFolder("Render"), meshFolder = gui.addFolder("Mesh"), lightFolder = gui.addFolder("Light"), exportFolder = gui.addFolder("Export"), lightFolder.open(), i = renderFolder.add(RENDER, "renderer", {
        webgl: WEBGL,
        canvas: CANVAS,
        svg: SVG
    }), i.onChange(function(e) {
        setRenderer(e)
    }), i = meshFolder.addColor(MESH, "ambient"), i.onChange(function(i) {
        for (e = 0, t = scene.meshes.length; t > e; e++) scene.meshes[e].material.ambient.set(i)
    }), i = meshFolder.addColor(MESH, "diffuse"), i.onChange(function(i) {
        for (e = 0, t = scene.meshes.length; t > e; e++) scene.meshes[e].material.diffuse.set(i)
    }), i = meshFolder.add(MESH, "width", .05, 2), i.onChange(function(e) {
        geometry.width !== e * renderer.width && createMesh()
    }), i = meshFolder.add(MESH, "height", .05, 2), i.onChange(function(e) {
        geometry.height !== e * renderer.height && createMesh()
    }), i = meshFolder.add(MESH, "depth", 0, MESH.maxdepth).listen(), i = meshFolder.add(MESH, "slices", 1, 800), i.step(1), i.onChange(function(e) {
        geometry.slices !== e && createMesh()
    }), i = lightFolder.add(LIGHT, "currIndex", {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7
    }).name("Current light").listen(), i.onChange(function(e) {
        LIGHT.proxy = scene.lights[e - 1], LIGHT.ambient = LIGHT.proxy.ambient.hex, LIGHT.diffuse = LIGHT.proxy.diffuse.hex, LIGHT.xPos = LIGHT.proxy.position[0], LIGHT.yPos = LIGHT.proxy.position[1], LIGHT.zOffset = LIGHT.proxy.position[2], gui.__folders.Light.__controllers[1].updateDisplay(), gui.__folders.Light.__controllers[2].updateDisplay()
    }), i = lightFolder.addColor(LIGHT, "ambient"), i.onChange(function(e) {
        LIGHT.proxy.ambient.set(e), LIGHT.proxy.ambientHex = LIGHT.proxy.ambient.format()
    }), i = lightFolder.addColor(LIGHT, "diffuse"), i.onChange(function(e) {
        LIGHT.proxy.diffuse.set(e), LIGHT.proxy.diffuseHex = LIGHT.proxy.diffuse.format()
    }), i = lightFolder.add(LIGHT, "count", 1, 7).listen(), i.step(1), i.onChange(function(e) {
        scene.lights.length !== e && (e > scene.lights.length ? addLight() : trimLights(e))
    }), i = lightFolder.add(LIGHT, "xPos", -mesh.geometry.width / 2, mesh.geometry.width / 2).listen(), i.step(1), i.onChange(function(e) {
        LIGHT.proxy.setPosition(e, LIGHT.proxy.position[1], LIGHT.proxy.position[2])
    }), i = lightFolder.add(LIGHT, "yPos", -mesh.geometry.height / 2, mesh.geometry.height / 2).listen(), i.step(1), i.onChange(function(e) {
        LIGHT.proxy.setPosition(LIGHT.proxy.position[0], e, LIGHT.proxy.position[2])
    }), i = lightFolder.add(LIGHT, "zOffset", 0, 1e3).name("Distance").listen(), i.step(1), i.onChange(function(e) {
        LIGHT.proxy.setPosition(LIGHT.proxy.position[0], LIGHT.proxy.position[1], e)
    }), i = lightFolder.add(LIGHT, "randomize"), i = exportFolder.add(EXPORT, "width", 100, 3e3), i.step(100), i = exportFolder.add(EXPORT, "height", 100, 3e3), i.step(100), i = exportFolder.add(EXPORT, "export").name("export big"), i = exportFolder.add(EXPORT, "exportCurrent").name("export this")
}

function toggleEl(e) {
    var t = document.getElementById(e);
    t.style.display = "block" == t.style.display ? "none" : "block"
}

function getRandomColor() {
    return "#" + (Math.random().toString(16) + "000000").slice(2, 8)
}

function onWindowResize() {
    resize(container.offsetWidth, container.offsetHeight), render()
}

function onMouseMove(e) {
    LIGHT.pickedup && (LIGHT.xPos = e.clientX - renderer.width / 2, LIGHT.yPos = renderer.height / 2 - e.clientY, LIGHT.proxy.setPosition(LIGHT.xPos, LIGHT.yPos, LIGHT.proxy.position[2]))
}
var Delaunay;
(function() {
    "use strict";

    function e(e) {
        var t, i, r, n, o, s, a = Number.POSITIVE_INFINITY,
            h = Number.POSITIVE_INFINITY,
            l = Number.NEGATIVE_INFINITY,
            u = Number.NEGATIVE_INFINITY;
        for (t = e.length; t--;) a > e[t][0] && (a = e[t][0]), e[t][0] > l && (l = e[t][0]), h > e[t][1] && (h = e[t][1]), e[t][1] > u && (u = e[t][1]);
        return i = l - a, r = u - h, n = Math.max(i, r), o = a + .5 * i, s = h + .5 * r, [
            [o - 20 * n, s - n],
            [o, s + 20 * n],
            [o + 20 * n, s - n]
        ]
    }

    function t(e, t, i, n) {
        var o, s, a, h, l, u, c, d, f, S, g = e[t][0],
            m = e[t][1],
            p = e[i][0],
            F = e[i][1],
            b = e[n][0],
            y = e[n][1],
            v = Math.abs(m - F),
            L = Math.abs(F - y);
        if (r > v && r > L) throw Error("Eek! Coincident points!");
        return r > v ? (h = -((b - p) / (y - F)), u = (p + b) / 2, d = (F + y) / 2, o = (p + g) / 2, s = h * (o - u) + d) : r > L ? (a = -((p - g) / (F - m)), l = (g + p) / 2, c = (m + F) / 2, o = (b + p) / 2, s = a * (o - l) + c) : (a = -((p - g) / (F - m)), h = -((b - p) / (y - F)), l = (g + p) / 2, u = (p + b) / 2, c = (m + F) / 2, d = (F + y) / 2, o = (a * l - h * u + d - c) / (a - h), s = v > L ? a * (o - l) + c : h * (o - u) + d), f = p - o, S = F - s, {
            i: t,
            j: i,
            k: n,
            x: o,
            y: s,
            r: f * f + S * S
        }
    }

    function i(e) {
        var t, i, r, n, o, s;
        for (i = e.length; i;)
            for (n = e[--i], r = e[--i], t = i; t;)
                if (s = e[--t], o = e[--t], r === o && n === s || r === s && n === o) {
                    e.splice(i, 2), e.splice(t, 2);
                    break
                }
    }
    var r = 1 / 1048576;
    Delaunay = {
        triangulate: function(n, o) {
            var s, a, h, l, u, c, d, f, S, g, m, p, F = n.length;
            if (3 > F) return [];
            if (n = n.slice(0), o)
                for (s = F; s--;) n[s] = n[s][o];
            for (h = Array(F), s = F; s--;) h[s] = s;
            for (h.sort(function(e, t) {
                    return n[t][0] - n[e][0]
                }), l = e(n), n.push(l[0], l[1], l[2]), u = [t(n, F + 0, F + 1, F + 2)], c = [], d = [], s = h.length; s--; d.length = 0) {
                for (p = h[s], a = u.length; a--;) f = n[p][0] - u[a].x, f > 0 && f * f > u[a].r ? (c.push(u[a]), u.splice(a, 1)) : (S = n[p][1] - u[a].y, f * f + S * S - u[a].r > r || (d.push(u[a].i, u[a].j, u[a].j, u[a].k, u[a].k, u[a].i), u.splice(a, 1)));
                for (i(d), a = d.length; a;) m = d[--a], g = d[--a], u.push(t(n, g, m, p))
            }
            for (s = u.length; s--;) c.push(u[s]);
            for (u.length = 0, s = c.length; s--;) F > c[s].i && F > c[s].j && F > c[s].k && u.push(c[s].i, c[s].j, c[s].k);
            return u
        },
        contains: function(e, t) {
            if (t[0] < e[0][0] && t[0] < e[1][0] && t[0] < e[2][0] || t[0] > e[0][0] && t[0] > e[1][0] && t[0] > e[2][0] || t[1] < e[0][1] && t[1] < e[1][1] && t[1] < e[2][1] || t[1] > e[0][1] && t[1] > e[1][1] && t[1] > e[2][1]) return null;
            var i = e[1][0] - e[0][0],
                r = e[2][0] - e[0][0],
                n = e[1][1] - e[0][1],
                o = e[2][1] - e[0][1],
                s = i * o - r * n;
            if (0 === s) return null;
            var a = (o * (t[0] - e[0][0]) - r * (t[1] - e[0][1])) / s,
                h = (i * (t[1] - e[0][1]) - n * (t[0] - e[0][0])) / s;
            return 0 > a || 0 > h || a + h > 1 ? null : [a, h]
        }
    }, "undefined" != typeof module && (module.exports = Delaunay)
})(), FSS = {
        FRONT: 0,
        BACK: 1,
        DOUBLE: 2,
        SVGNS: "http://www.w3.org/2000/svg"
    }, FSS.Array = "function" == typeof Float32Array ? Float32Array : Array, FSS.Utils = {
        isNumber: function(e) {
            return !isNaN(parseFloat(e)) && isFinite(e)
        }
    },
    function() {
        for (var e = 0, t = ["ms", "moz", "webkit", "o"], i = 0; t.length > i && !window.requestAnimationFrame; ++i) window.requestAnimationFrame = window[t[i] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[t[i] + "CancelAnimationFrame"] || window[t[i] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function(t) {
            var i = (new Date).getTime(),
                r = Math.max(0, 16 - (i - e)),
                n = window.setTimeout(function() {
                    t(i + r)
                }, r);
            return e = i + r, n
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e) {
            clearTimeout(e)
        })
    }(), Math.PIM2 = 2 * Math.PI, Math.PID2 = Math.PI / 2, Math.randomInRange = function(e, t) {
        return e + (t - e) * Math.random()
    }, Math.clamp = function(e, t, i) {
        return e = Math.max(e, t), e = Math.min(e, i)
    }, FSS.Vector3 = {
        create: function(e, t, i) {
            var r = new FSS.Array(3);
            return this.set(r, e, t, i), r
        },
        clone: function(e) {
            var t = this.create();
            return this.copy(t, e), t
        },
        set: function(e, t, i, r) {
            return e[0] = t || 0, e[1] = i || 0, e[2] = r || 0, this
        },
        setX: function(e, t) {
            return e[0] = t || 0, this
        },
        setY: function(e, t) {
            return e[1] = t || 0, this
        },
        setZ: function(e, t) {
            return e[2] = t || 0, this
        },
        copy: function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], this
        },
        add: function(e, t) {
            return e[0] += t[0], e[1] += t[1], e[2] += t[2], this
        },
        addVectors: function(e, t, i) {
            return e[0] = t[0] + i[0], e[1] = t[1] + i[1], e[2] = t[2] + i[2], this
        },
        addScalar: function(e, t) {
            return e[0] += t, e[1] += t, e[2] += t, this
        },
        subtract: function(e, t) {
            return e[0] -= t[0], e[1] -= t[1], e[2] -= t[2], this
        },
        subtractVectors: function(e, t, i) {
            return e[0] = t[0] - i[0], e[1] = t[1] - i[1], e[2] = t[2] - i[2], this
        },
        subtractScalar: function(e, t) {
            return e[0] -= t, e[1] -= t, e[2] -= t, this
        },
        multiply: function(e, t) {
            return e[0] *= t[0], e[1] *= t[1], e[2] *= t[2], this
        },
        multiplyVectors: function(e, t, i) {
            return e[0] = t[0] * i[0], e[1] = t[1] * i[1], e[2] = t[2] * i[2], this
        },
        multiplyScalar: function(e, t) {
            return e[0] *= t, e[1] *= t, e[2] *= t, this
        },
        divide: function(e, t) {
            return e[0] /= t[0], e[1] /= t[1], e[2] /= t[2], this
        },
        divideVectors: function(e, t, i) {
            return e[0] = t[0] / i[0], e[1] = t[1] / i[1], e[2] = t[2] / i[2], this
        },
        divideScalar: function(e, t) {
            return 0 !== t ? (e[0] /= t, e[1] /= t, e[2] /= t) : (e[0] = 0, e[1] = 0, e[2] = 0), this
        },
        cross: function(e, t) {
            var i = e[0],
                r = e[1],
                n = e[2];
            return e[0] = r * t[2] - n * t[1], e[1] = n * t[0] - i * t[2], e[2] = i * t[1] - r * t[0], this
        },
        crossVectors: function(e, t, i) {
            return e[0] = t[1] * i[2] - t[2] * i[1], e[1] = t[2] * i[0] - t[0] * i[2], e[2] = t[0] * i[1] - t[1] * i[0], this
        },
        min: function(e, t) {
            return t > e[0] && (e[0] = t), t > e[1] && (e[1] = t), t > e[2] && (e[2] = t), this
        },
        max: function(e, t) {
            return e[0] > t && (e[0] = t), e[1] > t && (e[1] = t), e[2] > t && (e[2] = t), this
        },
        clamp: function(e, t, i) {
            return this.min(e, t), this.max(e, i), this
        },
        limit: function(e, t, i) {
            var r = this.length(e);
            return null !== t && t > r ? this.setLength(e, t) : null !== i && r > i && this.setLength(e, i), this
        },
        dot: function(e, t) {
            return e[0] * t[0] + e[1] * t[1] + e[2] * t[2]
        },
        normalise: function(e) {
            return this.divideScalar(e, this.length(e))
        },
        negate: function(e) {
            return this.multiplyScalar(e, -1)
        },
        distanceSquared: function(e, t) {
            var i = e[0] - t[0],
                r = e[1] - t[1],
                n = e[2] - t[2];
            return i * i + r * r + n * n
        },
        distance: function(e, t) {
            return Math.sqrt(this.distanceSquared(e, t))
        },
        lengthSquared: function(e) {
            return e[0] * e[0] + e[1] * e[1] + e[2] * e[2]
        },
        length: function(e) {
            return Math.sqrt(this.lengthSquared(e))
        },
        setLength: function(e, t) {
            var i = this.length(e);
            return 0 !== i && t !== i && this.multiplyScalar(e, t / i), this
        }
    }, FSS.Vector4 = {
        create: function(e, t, i) {
            var r = new FSS.Array(4);
            return this.set(r, e, t, i), r
        },
        set: function(e, t, i, r, n) {
            return e[0] = t || 0, e[1] = i || 0, e[2] = r || 0, e[3] = n || 0, this
        },
        setX: function(e, t) {
            return e[0] = t || 0, this
        },
        setY: function(e, t) {
            return e[1] = t || 0, this
        },
        setZ: function(e, t) {
            return e[2] = t || 0, this
        },
        setW: function(e, t) {
            return e[3] = t || 0, this
        },
        add: function(e, t) {
            return e[0] += t[0], e[1] += t[1], e[2] += t[2], e[3] += t[3], this
        },
        multiplyVectors: function(e, t, i) {
            return e[0] = t[0] * i[0], e[1] = t[1] * i[1], e[2] = t[2] * i[2], e[3] = t[3] * i[3], this
        },
        multiplyScalar: function(e, t) {
            return e[0] *= t, e[1] *= t, e[2] *= t, e[3] *= t, this
        },
        min: function(e, t) {
            return t > e[0] && (e[0] = t), t > e[1] && (e[1] = t), t > e[2] && (e[2] = t), t > e[3] && (e[3] = t), this
        },
        max: function(e, t) {
            return e[0] > t && (e[0] = t), e[1] > t && (e[1] = t), e[2] > t && (e[2] = t), e[3] > t && (e[3] = t), this
        },
        clamp: function(e, t, i) {
            return this.min(e, t), this.max(e, i), this
        }
    }, FSS.Color = function(e, t) {
        this.rgba = FSS.Vector4.create(), this.hex = e || "#000000", this.opacity = FSS.Utils.isNumber(t) ? t : 1, this.set(this.hex, this.opacity)
    }, FSS.Color.prototype = {
        set: function(e, t) {
            e = e.replace("#", "");
            var i = e.length / 3;
            return this.rgba[0] = parseInt(e.substring(0 * i, 1 * i), 16) / 255, this.rgba[1] = parseInt(e.substring(1 * i, 2 * i), 16) / 255, this.rgba[2] = parseInt(e.substring(2 * i, 3 * i), 16) / 255, this.rgba[3] = FSS.Utils.isNumber(t) ? t : this.rgba[3], this
        },
        hexify: function(e) {
            var t = Math.ceil(255 * e).toString(16);
            return 1 === t.length && (t = "0" + t), t
        },
        format: function() {
            var e = this.hexify(this.rgba[0]),
                t = this.hexify(this.rgba[1]),
                i = this.hexify(this.rgba[2]);
            return this.hex = "#" + e + t + i, this.hex
        }
    }, FSS.Object = function() {
        this.position = FSS.Vector3.create()
    }, FSS.Object.prototype = {
        setPosition: function(e, t, i) {
            return FSS.Vector3.set(this.position, e, t, i), this
        }
    }, FSS.Light = function(e, t) {
        FSS.Object.call(this), this.ambient = new FSS.Color(e || "#FFFFFF"), this.diffuse = new FSS.Color(t || "#FFFFFF"), this.ray = FSS.Vector3.create()
    }, FSS.Light.prototype = Object.create(FSS.Object.prototype), FSS.Vertex = function(e, t, i) {
        this.position = FSS.Vector3.create(e, t, i)
    }, FSS.Vertex.prototype = {
        setPosition: function(e, t, i) {
            return FSS.Vector3.set(this.position, e, t, i), this
        }
    }, FSS.Triangle = function(e, t, i) {
        this.a = e || new FSS.Vertex, this.b = t || new FSS.Vertex, this.c = i || new FSS.Vertex, this.vertices = [this.a, this.b, this.c], this.u = FSS.Vector3.create(), this.v = FSS.Vector3.create(), this.centroid = FSS.Vector3.create(), this.normal = FSS.Vector3.create(), this.color = new FSS.Color, this.polygon = document.createElementNS(FSS.SVGNS, "polygon"), this.polygon.setAttributeNS(null, "stroke-linejoin", "round"), this.polygon.setAttributeNS(null, "stroke-miterlimit", "1"), this.polygon.setAttributeNS(null, "stroke-width", "1"), this.computeCentroid(), this.computeNormal()
    }, FSS.Triangle.prototype = {
        computeCentroid: function() {
            return this.centroid[0] = this.a.position[0] + this.b.position[0] + this.c.position[0], this.centroid[1] = this.a.position[1] + this.b.position[1] + this.c.position[1], this.centroid[2] = this.a.position[2] + this.b.position[2] + this.c.position[2], FSS.Vector3.divideScalar(this.centroid, 3), this
        },
        computeNormal: function() {
            return FSS.Vector3.subtractVectors(this.u, this.b.position, this.a.position), FSS.Vector3.subtractVectors(this.v, this.c.position, this.a.position), FSS.Vector3.crossVectors(this.normal, this.u, this.v), FSS.Vector3.normalise(this.normal), this
        }
    }, FSS.Geometry = function() {
        this.vertices = [], this.triangles = [], this.dirty = !1
    }, FSS.Geometry.prototype = {
        update: function() {
            if (this.dirty) {
                var e, t;
                for (e = this.triangles.length - 1; e >= 0; e--) t = this.triangles[e], t.computeCentroid(), t.computeNormal();
                this.dirty = !1
            }
            return this
        }
    }, FSS.Plane = function(e, t, i) {
        FSS.Geometry.call(this), this.width = e || 100, this.height = t || 100;
        var r, n, o = Array(i);
        for (offsetX = this.width * -.5, offsetY = .5 * this.height, s = o.length; s--;) r = offsetX + Math.random() * e, n = offsetY - Math.random() * t, o[s] = [r, n];
        o.push([offsetX, offsetY]), o.push([offsetX + e / 2, offsetY]), o.push([offsetX + e, offsetY]), o.push([offsetX + e, offsetY - t / 2]), o.push([offsetX + e, offsetY - t]), o.push([offsetX + e / 2, offsetY - t]), o.push([offsetX, offsetY - t]), o.push([offsetX, offsetY - t / 2]);
        for (var s = 6; s >= 0; s--) o.push([offsetX + Math.random() * e, offsetY]), o.push([offsetX, offsetY - Math.random() * t]), o.push([offsetX + e, offsetY - Math.random() * t]), o.push([offsetX + Math.random() * e, offsetY - t]);
        var a = Delaunay.triangulate(o);
        for (s = a.length; s;) --s, v1 = new FSS.Vertex(Math.ceil(o[a[s]][0]), Math.ceil(o[a[s]][1])), --s, v2 = new FSS.Vertex(Math.ceil(o[a[s]][0]), Math.ceil(o[a[s]][1])), --s, v3 = new FSS.Vertex(Math.ceil(o[a[s]][0]), Math.ceil(o[a[s]][1])), t1 = new FSS.Triangle(v1, v2, v3), this.triangles.push(t1), this.vertices.push(v1), this.vertices.push(v2), this.vertices.push(v3)
    }, FSS.Plane.prototype = Object.create(FSS.Geometry.prototype), FSS.Material = function(e, t) {
        this.ambient = new FSS.Color(e || "#444444"), this.diffuse = new FSS.Color(t || "#FFFFFF"), this.slave = new FSS.Color
    }, FSS.Mesh = function(e, t) {
        FSS.Object.call(this), this.geometry = e || new FSS.Geometry, this.material = t || new FSS.Material, this.side = FSS.FRONT, this.visible = !0
    }, FSS.Mesh.prototype = Object.create(FSS.Object.prototype), FSS.Mesh.prototype.update = function(e, t) {
        var i, r, n, o, s;
        if (this.geometry.update(), t)
            for (i = this.geometry.triangles.length - 1; i >= 0; i--) {
                for (r = this.geometry.triangles[i], FSS.Vector4.set(r.color.rgba), n = e.length - 1; n >= 0; n--) o = e[n], FSS.Vector3.subtractVectors(o.ray, o.position, r.centroid), FSS.Vector3.normalise(o.ray), s = FSS.Vector3.dot(r.normal, o.ray), this.side === FSS.FRONT ? s = Math.max(s, 0) : this.side === FSS.BACK ? s = Math.abs(Math.min(s, 0)) : this.side === FSS.DOUBLE && (s = Math.max(Math.abs(s), 0)), FSS.Vector4.multiplyVectors(this.material.slave.rgba, this.material.ambient.rgba, o.ambient.rgba), FSS.Vector4.add(r.color.rgba, this.material.slave.rgba), FSS.Vector4.multiplyVectors(this.material.slave.rgba, this.material.diffuse.rgba, o.diffuse.rgba), FSS.Vector4.multiplyScalar(this.material.slave.rgba, s), FSS.Vector4.add(r.color.rgba, this.material.slave.rgba);
                FSS.Vector4.clamp(r.color.rgba, 0, 1)
            }
        return this
    }, FSS.Scene = function() {
        this.meshes = [], this.lights = []
    }, FSS.Scene.prototype = {
        add: function(e) {
            return e instanceof FSS.Mesh && !~this.meshes.indexOf(e) ? this.meshes.push(e) : e instanceof FSS.Light && !~this.lights.indexOf(e) && this.lights.push(e), this
        },
        remove: function(e) {
            return e instanceof FSS.Mesh && ~this.meshes.indexOf(e) ? this.meshes.splice(this.meshes.indexOf(e), 1) : e instanceof FSS.Light && ~this.lights.indexOf(e) && this.lights.splice(this.lights.indexOf(e), 1), this
        }
    }, FSS.Renderer = function() {
        this.width = 0, this.height = 0, this.halfWidth = 0, this.halfHeight = 0
    }, FSS.Renderer.prototype = {
        setSize: function(e, t) {
            return this.width !== e || this.height !== t ? (this.width = e, this.height = t, this.halfWidth = .5 * this.width, this.halfHeight = .5 * this.height, this) : void 0
        },
        clear: function() {
            return this
        },
        render: function() {
            return this
        }
    }, FSS.CanvasRenderer = function() {
        FSS.Renderer.call(this), this.element = document.createElement("canvas"), this.element.style.display = "block", this.context = this.element.getContext("2d"), this.setSize(this.element.width, this.element.height)
    }, FSS.CanvasRenderer.prototype = Object.create(FSS.Renderer.prototype), FSS.CanvasRenderer.prototype.setSize = function(e, t) {
        return FSS.Renderer.prototype.setSize.call(this, e, t), this.element.width = e, this.element.height = t, this.context.setTransform(1, 0, 0, -1, this.halfWidth, this.halfHeight), this
    }, FSS.CanvasRenderer.prototype.clear = function() {
        return FSS.Renderer.prototype.clear.call(this), this.context.clearRect(-this.halfWidth, -this.halfHeight, this.width, this.height), this
    }, FSS.CanvasRenderer.prototype.render = function(e) {
        FSS.Renderer.prototype.render.call(this, e);
        var t, i, r, n, o;
        for (this.clear(), this.context.lineJoin = "round", this.context.lineWidth = 1, t = e.meshes.length - 1; t >= 0; t--)
            if (i = e.meshes[t], i.visible)
                for (i.update(e.lights, !0), r = i.geometry.triangles.length - 1; r >= 0; r--) n = i.geometry.triangles[r], o = n.color.format(), this.context.beginPath(), this.context.moveTo(n.a.position[0], n.a.position[1]), this.context.lineTo(n.b.position[0], n.b.position[1]), this.context.lineTo(n.c.position[0], n.c.position[1]), this.context.closePath(), this.context.strokeStyle = o, this.context.fillStyle = o, this.context.stroke(), this.context.fill();
        return this
    }, FSS.WebGLRenderer = function() {
        FSS.Renderer.call(this), this.element = document.createElement("canvas"), this.element.style.display = "block", this.vertices = null, this.lights = null;
        var e = {
            preserveDrawingBuffer: !1,
            premultipliedAlpha: !0,
            antialias: !0,
            stencil: !0,
            alpha: !0
        };
        return this.gl = this.getContext(this.element, e), this.unsupported = !this.gl, this.unsupported ? "WebGL is not supported by your browser." : (this.gl.clearColor(0, 0, 0, 0), this.gl.enable(this.gl.DEPTH_TEST), this.setSize(this.element.width, this.element.height), void 0)
    }, FSS.WebGLRenderer.prototype = Object.create(FSS.Renderer.prototype), FSS.WebGLRenderer.prototype.getContext = function(e, t) {
        var i = !1;
        try {
            !(i = e.getContext("experimental-webgl", t))
        } catch (r) {
            console.error(r)
        }
        return i
    }, FSS.WebGLRenderer.prototype.setSize = function(e, t) {
        return FSS.Renderer.prototype.setSize.call(this, e, t), this.unsupported ? void 0 : (this.element.width = e, this.element.height = t, this.gl.viewport(0, 0, e, t), this)
    }, FSS.WebGLRenderer.prototype.clear = function() {
        return FSS.Renderer.prototype.clear.call(this), this.unsupported ? void 0 : (this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT), this)
    }, FSS.WebGLRenderer.prototype.render = function(e) {
        if (FSS.Renderer.prototype.render.call(this, e), !this.unsupported) {
            var t, i, r, n, o, s, a, h, l, u, c, d, f, S, g, m = !1,
                p = e.lights.length,
                F = 0;
            if (this.clear(), this.lights !== p) {
                if (this.lights = p, !(this.lights > 0)) return;
                this.buildProgram(p)
            }
            if (this.program) {
                for (t = e.meshes.length - 1; t >= 0; t--) i = e.meshes[t], i.geometry.dirty && (m = !0), i.update(e.lights, !1), F += 3 * i.geometry.triangles.length;
                if (m || this.vertices !== F) {
                    this.vertices = F;
                    for (h in this.program.attributes) {
                        for (u = this.program.attributes[h], u.data = new FSS.Array(F * u.size), f = 0, t = e.meshes.length - 1; t >= 0; t--)
                            for (i = e.meshes[t], r = 0, n = i.geometry.triangles.length; n > r; r++)
                                for (o = i.geometry.triangles[r], S = 0, g = o.vertices.length; g > S; S++) {
                                    switch (vertex = o.vertices[S], h) {
                                        case "side":
                                            this.setBufferData(f, u, i.side);
                                            break;
                                        case "position":
                                            this.setBufferData(f, u, vertex.position);
                                            break;
                                        case "centroid":
                                            this.setBufferData(f, u, o.centroid);
                                            break;
                                        case "normal":
                                            this.setBufferData(f, u, o.normal);
                                            break;
                                        case "ambient":
                                            this.setBufferData(f, u, i.material.ambient.rgba);
                                            break;
                                        case "diffuse":
                                            this.setBufferData(f, u, i.material.diffuse.rgba)
                                    }
                                    f++
                                }
                        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, u.buffer), this.gl.bufferData(this.gl.ARRAY_BUFFER, u.data, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(u.location), this.gl.vertexAttribPointer(u.location, u.size, this.gl.FLOAT, !1, 0, 0)
                    }
                }
                for (this.setBufferData(0, this.program.uniforms.resolution, [this.width, this.height, this.width]), s = p - 1; s >= 0; s--) a = e.lights[s], this.setBufferData(s, this.program.uniforms.lightPosition, a.position), this.setBufferData(s, this.program.uniforms.lightAmbient, a.ambient.rgba), this.setBufferData(s, this.program.uniforms.lightDiffuse, a.diffuse.rgba);
                for (l in this.program.uniforms) switch (u = this.program.uniforms[l], d = u.location, c = u.data, u.structure) {
                    case "3f":
                        this.gl.uniform3f(d, c[0], c[1], c[2]);
                        break;
                    case "3fv":
                        this.gl.uniform3fv(d, c);
                        break;
                    case "4fv":
                        this.gl.uniform4fv(d, c)
                }
            }
            return this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices), this
        }
    }, FSS.WebGLRenderer.prototype.setBufferData = function(e, t, i) {
        if (FSS.Utils.isNumber(i)) t.data[e * t.size] = i;
        else
            for (var r = i.length - 1; r >= 0; r--) t.data[e * t.size + r] = i[r]
    }, FSS.WebGLRenderer.prototype.buildProgram = function(e) {
        if (!this.unsupported) {
            var t = FSS.WebGLRenderer.VS(e),
                i = FSS.WebGLRenderer.FS(e),
                r = t + i;
            if (!this.program || this.program.code !== r) {
                var n = this.gl.createProgram(),
                    o = this.buildShader(this.gl.VERTEX_SHADER, t),
                    s = this.buildShader(this.gl.FRAGMENT_SHADER, i);
                if (this.gl.attachShader(n, o), this.gl.attachShader(n, s), this.gl.linkProgram(n), !this.gl.getProgramParameter(n, this.gl.LINK_STATUS)) {
                    var a = this.gl.getError(),
                        h = this.gl.getProgramParameter(n, this.gl.VALIDATE_STATUS);
                    return console.error("Could not initialise shader.\nVALIDATE_STATUS: " + h + "\nERROR: " + a), null
                }
                return this.gl.deleteShader(s), this.gl.deleteShader(o), n.code = r, n.attributes = {
                    side: this.buildBuffer(n, "attribute", "aSide", 1, "f"),
                    position: this.buildBuffer(n, "attribute", "aPosition", 3, "v3"),
                    centroid: this.buildBuffer(n, "attribute", "aCentroid", 3, "v3"),
                    normal: this.buildBuffer(n, "attribute", "aNormal", 3, "v3"),
                    ambient: this.buildBuffer(n, "attribute", "aAmbient", 4, "v4"),
                    diffuse: this.buildBuffer(n, "attribute", "aDiffuse", 4, "v4")
                }, n.uniforms = {
                    resolution: this.buildBuffer(n, "uniform", "uResolution", 3, "3f", 1),
                    lightPosition: this.buildBuffer(n, "uniform", "uLightPosition", 3, "3fv", e),
                    lightAmbient: this.buildBuffer(n, "uniform", "uLightAmbient", 4, "4fv", e),
                    lightDiffuse: this.buildBuffer(n, "uniform", "uLightDiffuse", 4, "4fv", e)
                }, this.program = n, this.gl.useProgram(this.program), n
            }
        }
    }, FSS.WebGLRenderer.prototype.buildShader = function(e, t) {
        if (!this.unsupported) {
            var i = this.gl.createShader(e);
            return this.gl.shaderSource(i, t), this.gl.compileShader(i), this.gl.getShaderParameter(i, this.gl.COMPILE_STATUS) ? i : (console.error(this.gl.getShaderInfoLog(i)), null)
        }
    }, FSS.WebGLRenderer.prototype.buildBuffer = function(e, t, i, r, n, o) {
        var s = {
            buffer: this.gl.createBuffer(),
            size: r,
            structure: n,
            data: null
        };
        switch (t) {
            case "attribute":
                s.location = this.gl.getAttribLocation(e, i);
                break;
            case "uniform":
                s.location = this.gl.getUniformLocation(e, i)
        }
        return o && (s.data = new FSS.Array(o * r)), s
    }, FSS.WebGLRenderer.VS = function(e) {
        var t = ["precision mediump float;", "#define LIGHTS " + e, "attribute float aSide;", "attribute vec3 aPosition;", "attribute vec3 aCentroid;", "attribute vec3 aNormal;", "attribute vec4 aAmbient;", "attribute vec4 aDiffuse;", "uniform vec3 uResolution;", "uniform vec3 uLightPosition[LIGHTS];", "uniform vec4 uLightAmbient[LIGHTS];", "uniform vec4 uLightDiffuse[LIGHTS];", "varying vec4 vColor;", "void main() {", "vColor = vec4(0.0);", "vec3 position = aPosition / uResolution * 2.0;", "for (int i = 0; i < LIGHTS; i++) {", "vec3 lightPosition = uLightPosition[i];", "vec4 lightAmbient = uLightAmbient[i];", "vec4 lightDiffuse = uLightDiffuse[i];", "vec3 ray = normalize(lightPosition - aCentroid);", "float illuminance = dot(aNormal, ray);", "if (aSide == 0.0) {", "illuminance = max(illuminance, 0.0);", "} else if (aSide == 1.0) {", "illuminance = abs(min(illuminance, 0.0));", "} else if (aSide == 2.0) {", "illuminance = max(abs(illuminance), 0.0);", "}", "vColor += aAmbient * lightAmbient;", "vColor += aDiffuse * lightDiffuse * illuminance;", "}", "vColor = clamp(vColor, 0.0, 1.0);", "gl_Position = vec4(position, 1.0);", "}"].join("\n");
        return t
    }, FSS.WebGLRenderer.FS = function() {
        var e = ["precision mediump float;", "varying vec4 vColor;", "void main() {", "gl_FragColor = vColor;", "}"].join("\n");
        return e
    }, FSS.SVGRenderer = function() {
        FSS.Renderer.call(this), this.element = document.createElementNS(FSS.SVGNS, "svg"), this.element.setAttribute("xmlns", FSS.SVGNS), this.element.setAttribute("version", "1.1"), this.element.style.display = "block", this.setSize(300, 150)
    }, FSS.SVGRenderer.prototype = Object.create(FSS.Renderer.prototype), FSS.SVGRenderer.prototype.setSize = function(e, t) {
        return FSS.Renderer.prototype.setSize.call(this, e, t), this.element.setAttribute("width", e), this.element.setAttribute("height", t), this
    }, FSS.SVGRenderer.prototype.clear = function() {
        FSS.Renderer.prototype.clear.call(this);
        for (var e = this.element.childNodes.length - 1; e >= 0; e--) this.element.removeChild(this.element.childNodes[e]);
        return this
    }, FSS.SVGRenderer.prototype.render = function(e) {
        FSS.Renderer.prototype.render.call(this, e);
        var t, i, r, n, o, s;
        for (t = e.meshes.length - 1; t >= 0; t--)
            if (i = e.meshes[t], i.visible)
                for (i.update(e.lights, !0), r = i.geometry.triangles.length - 1; r >= 0; r--) n = i.geometry.triangles[r], n.polygon.parentNode !== this.element && this.element.appendChild(n.polygon), o = this.formatPoint(n.a) + " ", o += this.formatPoint(n.b) + " ", o += this.formatPoint(n.c), s = this.formatStyle(n.color.format()), n.polygon.setAttributeNS(null, "points", o), n.polygon.setAttributeNS(null, "style", s);
        return this
    }, FSS.SVGRenderer.prototype.formatPoint = function(e) {
        return this.halfWidth + e.position[0] + "," + (this.halfHeight - e.position[1])
    }, FSS.SVGRenderer.prototype.formatStyle = function(e) {
        var t = "fill:" + e + ";";
        return t += "stroke:" + e + ";"
    };
var MESH = {
        width: 1.2,
        height: 1.2,
        slices: Wata.triangles.mesh.slices,
        depth: Wata.triangles.mesh.depth,
        maxdepth: 200,
        ambient: "#555555",
        diffuse: "#FFFFFF"
    },
    LIGHT = {
        count: 0,
        xPos: 68,
        yPos: 440,
        zOffset: Wata.triangles.light.distance,
        ambient: Wata.triangles.light.ambient,
        diffuse: Wata.triangles.light.diffuse,
        pickedup: !0,
        proxy: !1,
        currIndex: 0,
        randomize: function() {
            var e, t, i, r = Math.floor(3 * Math.random()) + 1;
            for (1 == r && (MESH.depth = 0), 2 == r && (MESH.depth = Math.randomInRange(0, 150)), 3 == r && (MESH.depth = Math.randomInRange(150, 200)), MESH.depth = 0, l = scene.lights.length - 1; l >= 0; l--) {
                e = Math.randomInRange(-mesh.geometry.width / 2, mesh.geometry.width / 2), t = Math.randomInRange(-mesh.geometry.height / 2, mesh.geometry.height / 2), i = scene.lights.length > 2 ? Math.randomInRange(10, 80) : Math.randomInRange(10, 100), light = scene.lights[l], FSS.Vector3.set(light.position, e, t, i);
                var n = this.diffuse,
                    o = this.ambient;
                light.diffuseHex = light.diffuse.format(), light.ambientHex = light.ambient.format(), LIGHT.xPos = e, LIGHT.yPos = t, LIGHT.zOffset = i, LIGHT.diffuse = n, LIGHT.ambient = o, gui.__folders.Light.__controllers[1].updateDisplay(), gui.__folders.Light.__controllers[2].updateDisplay()
            }
        }
    },
    WEBGL = "webgl",
    CANVAS = "canvas",
    SVG = "svg",
    RENDER = {
        renderer: CANVAS
    },
    EXPORT = {
        width: 2e3,
        height: 1e3,
        exportCurrent: function() {
            switch (RENDER.renderer) {
                case WEBGL:
                    window.open(webglRenderer.element.toDataURL(), "_blank");
                    break;
                case CANVAS:
                    window.open(canvasRenderer.element.toDataURL(), "_blank");
                    break;
                case SVG:
                    var e = encodeURIComponent(output.innerHTML),
                        t = "data:image/svg+xml," + e;
                    window.open(t, "_blank")
            }
        },
        "export": function() {
            var e, t, i, r, n = this.width / renderer.width,
                o = this.height / renderer.height,
                s = MESH.slices;
            for (MESH.slices = Math.ceil(1.4 * s * n), resize(this.width, this.height), MESH.slices = s, e = scene.lights.length - 1; e >= 0; e--) r = scene.lights[e], t = r.position[0], i = r.position[1], z = r.position[2], FSS.Vector3.set(r.position, t * n, i * o, z * n);
            switch (update(), render(), RENDER.renderer) {
                case WEBGL:
                    window.open(webglRenderer.element.toDataURL(), "_blank");
                    break;
                case CANVAS:
                    window.open(canvasRenderer.element.toDataURL(), "_blank");
                    break;
                case SVG:
                    var a = encodeURIComponent(output.innerHTML),
                        h = "data:image/svg+xml," + a;
                    window.open(h, "_blank")
            }
            for (resize(container.offsetWidth, container.offsetHeight), e = scene.lights.length - 1; e >= 0; e--) r = scene.lights[e], t = r.position[0], i = r.position[1], z = r.position[2], FSS.Vector3.set(r.position, t / n, i / o, z / n)
        }
    },
    center = FSS.Vector3.create(),
    container = document.getElementById("triangles"),
    controls = document.getElementById("controls"),
    output = document.getElementById("output"),
    renderer, scene, mesh, geometry, material, webglRenderer, canvasRenderer, svgRenderer, gui;
LIGHT.pickedup = !0;
        // initialise();
