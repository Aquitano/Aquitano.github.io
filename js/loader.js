console.log("Why are you here?!?!?!");
!(function () {
  var e = { FORM_ERROR: "form-error", SERVER_ERROR: "server-error" },
    t =
      (Hammer.DIRECTION_HORIZONTAL,
      Hammer.DIRECTION_HORIZONTAL,
      { SM: "SM", MD: "MD", LG: "LG" }),
    n = { PORTRAIT: "PORTRAIT", LANDSCAPE: "LANDSCAPE" },
    i = {
      AXWWWFU: "application/x-www-form-urlencoded",
      MFD: "multipart/form-data",
    },
    o = (function () {
      function e(e, t) {
        e == n.polyfills && t();
      }
      function t(t) {
        var n = 0;
        Modernizr.promises
          ? ++n
          : $.getScript("assets/polyfills/promise.min.js", function () {
              e(++n, t);
            }),
          Modernizr.history
            ? ++n
            : $.getScript("assets/polyfills/history.js", function () {
                e(++n, t);
              }),
          Modernizr.picture
            ? ++n
            : $.getScript("assets/polyfills/picturefill.min.js", function () {
                e(++n, t);
              }),
          e(n, t);
      }
      var n = { polyfills: 3 };
      return {
        init: function (e) {
          t(e);
        },
      };
    })(),
    a = (function () {
      function e(e) {
        T.push(e);
      }
      function t() {
        for (var e = 0; e < T.length; ++e) T[e]();
      }
      function i() {
        window.onpopstate = function (e) {
          null == e.state ? m() : (h = e.state),
            c().then(function () {
              t();
            });
        };
      }
      function o() {
        $("body").on("click", "a.internal", function () {
          if (b.interactionBlocked) return !1;
          b.interactionBlocked = !0;
          var e = $(this).attr("href"),
            i = "/" == e ? "home" : e;
          return (
            $(".loader-background img")
              .not('[data-page="' + i + '"]')
              .removeClass("active"),
            $('.loader-background img[data-page="' + i + '"]').addClass(
              "active"
            ),
            d(e),
            n(),
            s.load().then(function () {}),
            (b.pageLoaded = !1),
            setTimeout(function () {
              (b.interactionBlocked = !1),
                c().then(function () {
                  t();
                });
            }, b.preAnimationTime),
            !1
          );
        });
      }
      function a() {
        (document.title = h.title),
          $("meta[name='description']").attr("content", h.description),
          $("meta[name='keywords']").attr("content", h.keywords),
          $("meta[property='og\\:title']").attr("content", h.title),
          $("meta[property='og\\:description']").attr("content", h.description),
          $("meta[property='og\\:url']").attr(
            "content",
            encodeURIComponent(window.location.href)
          ),
          $("meta[property='og\\:image']").attr(
            "content",
            encodeURIComponent(g + h.og_image)
          ),
          $("meta[property='og\\:image\\:width']").attr(
            "content",
            h.og_image_w
          ),
          $("meta[property='og\\:image\\:height']").attr(
            "content",
            h.og_image_h
          );
      }
      function r() {
        matchMedia(
          "(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)"
        ).matches &&
          $("img[data-srcset]").each(function () {
            var e = $(this).attr("data-srcset"),
              t = e.split(","),
              n = t[t.length - 1].trim().split(" "),
              i =
                n[0].replace("/images/", "/images/2x/") +
                " " +
                2 * parseInt(n[1]) +
                "w";
            $(this).attr("data-srcset", e + "," + i);
          });
        new LazyLoad({
          elements_selector: ".lazy:not(.video-poster)",
          threshold: 2 * $(window).height(),
          callback_load: function (e) {
            $(e).parent().addClass("loaded");
          },
        }),
          new LazyLoad({
            elements_selector: ".lazy.video-poster",
            threshold: 3 * $(window).height(),
            callback_load: function (e) {
              $(e).parent().addClass("loaded");
            },
          });
      }
      function c() {
        return (
          (b.pageLoaded = !1),
          a(),
          $("html").attr("class", h.class),
          f.setActive(h.name),
          new Promise(function (e) {
            $.get(h.partial + "?v=" + Config.VERSION, function (t) {
              b.pageLoaded = !0;
              var n = BNS.isOn();
              if (
                (n && BNS.off(),
                l.scrollTo(0),
                C.html(t),
                r(),
                C.hasClass("loaded"))
              )
                v.init(), y.init();
              else
                var i = setInterval(function () {
                  C.hasClass("loaded") &&
                    (v.init(), y.init(), clearInterval(i));
                }, 50);
              n && BNS.on(), e();
            });
          })
        );
      }
      function d(e) {
        (h = null), ("/" !== e && "" !== e && e !== w.BASE_URL) || (e = "home");
        for (var t in w)
          if (w.hasOwnProperty(t) && e === w[t].name) {
            h = w[t];
            break;
          }
        null === h && (h = w.PAGE_404);
      }
      function u(e) {
        var t;
        ("/" !== e && "" !== e && e !== w.BASE_URL) || (e = "home");
        for (var n in w) w.hasOwnProperty(n) && e === w[n].name && (t = w[n]);
        return null === t && (t = w.PAGE_404), t;
      }
      function m() {
        var e = window.location.href.replace(g, "").split("#")[0];
        "/" === e || "" === e || e === w.BASE_URL
          ? (h = w.HOME)
          : d((e = e.replace(/^\/+|\/+$/g, "")));
      }
      function p() {
        (w = Config),
          delete Config.PROJECT_TESTTEMPLATE,
          (g = document.getElementsByTagName("base")[0].href),
          (C = $(".container")),
          (h = currentPageData),
          s.init().then(function () {}),
          r(),
          (b.pageLoaded = !0);
        var e = BNS.isOn();
        e && BNS.off(), l.scrollTo(0), e && BNS.on(), o(), i();
      }
      var Config = {};
      var currentPageData = {};
      var g,
        h,
        w,
        C,
        b = { preAnimationTime: 600, pageLoaded: !1, interactionBlocked: !1 },
        T = [];
      return {
        init: function () {
          p();
        },
        getInteractionBlocked: function () {
          return b.interactionBlocked;
        },
        setInteractionBlocked: function (e) {
          b.interactionBlocked = e;
        },
        addLoadCallback: function (t) {
          e(t);
        },
        getCurrentPage: function () {
          return h;
        },
        isPageLoaded: function () {
          return b.pageLoaded;
        },
        getPageFromPath: function (e) {
          return u(e);
        },
      };
    })(),
    s = (function () {
      function e() {
        d.hasClass("on") &&
          m.css(
            "bottom",
            $(window).height() - g.navElementsOffset[r.getSize()] + "px"
          );
      }
      function t() {
        (g.completedActions = !0),
          clearTimeout(g.cleanupTimerId),
          f.addClass("off reset"),
          l.hideScrollTop(),
          setTimeout(function () {
            m.css("bottom", "auto"),
              d.removeClass("on"),
              c.addClass("loaded"),
              BNS.off();
          }, g.textOffTime),
          setTimeout(function () {
            $(".loader-background img").removeClass("active"),
              d.addClass("fully-closed");
          }, 700),
          d.hasClass("first-loading") &&
            setTimeout(function () {
              v.init(),
                y.init(),
                d.removeClass("first-loading"),
                $(window).trigger("scroll"),
                $(".loader .loader-background").append(
                  $(".loader-background-preloader img:not(.active)").clone()
                ),
                $("#nav .loader-background").append(
                  $(".loader-background-preloader img").clone()
                ),
                $("#nav .loader-background img").removeClass("active"),
                $(".loader-background-preloader").remove(),
                $(".loader-background img")
                  .on("load", function () {
                    $(this).addClass("loaded");
                  })
                  .each(function () {
                    this.complete && $(this).addClass("loaded");
                  });
            }, g.postAnimationTime);
      }
      function n() {
        a.isPageLoaded() ? t() : setTimeout(n, 100);
      }
      function i() {
        return new Promise(function (e) {
          n(), e();
        });
      }
      function o() {
        (h = null),
          clearTimeout(w),
          clearInterval(C),
          (b = g.intervalTime),
          (T = 0),
          (k = !1),
          c.removeClass("loaded"),
          f.removeClass("off reset");
        var e = a.getCurrentPage();
        f.find("h5").text(e.loader.H5), f.find("h1").text(e.loader.H1);
      }
      function s() {
        return (
          (c = $(".container")),
          (d = $("div.loader")),
          (f = $(".text", d)),
          (u = $(".progress", d)),
          (m = $(".logo", d)),
          (p = $(".loader-background")),
          ($loaderBgImg = $("img", p)),
          BNS.on(),
          m.css(
            "bottom",
            $(window).height() - g.navElementsOffset[r.getSize()] + "px"
          ),
          m.addClass("set"),
          r.addResizeCallback(e),
          new Promise(function (e) {
            setTimeout(function () {
              i().then(function () {
                e();
              });
            }, 1e3);
          })
        );
      }
      var c,
        d,
        u,
        f,
        m,
        p,
        g = {
          intervalTime: 16,
          maximumSlowdown: 32,
          finishLoadingAcceleration: 4,
          timeoutTime: 12e3,
          preAnimationTime: 200,
          textOffTime: 200,
          postAnimationTime: 200,
          navElementsOffset: { SM: 66, MD: 76, LG: 86 },
          completedActions: !1,
          cleanupTimerId: 0,
        },
        h = null,
        w = null,
        C = null,
        b = g.intervalTime,
        T = 0,
        k = !1;
      return {
        init: function () {
          return (
            $(".loader-background img")
              .on("load", function () {
                $(this).addClass("loaded");
              })
              .each(function () {
                this.complete && $(this).addClass("loaded");
              }),
            new Promise(function (e) {
              s().then(function () {
                e();
              });
            })
          );
        },
        load: function () {
          return new Promise(function (e) {
            (g.completedActions = !1),
              o(),
              m.css(
                "bottom",
                r.getHeight() - g.navElementsOffset[r.getSize()] + "px"
              ),
              d.removeClass("fully-closed"),
              d.addClass("on"),
              BNS.on(),
              setTimeout(function () {
                i().then(function () {
                  e();
                });
              }, g.preAnimationTime),
              clearTimeout(g.cleanupTimerId),
              (g.cleanupTimerId = setTimeout(function () {
                g.completedActions || t();
              }, g.timeoutTime));
          });
        },
      };
    })(),
    r = (function () {
      function e(e) {
        u.push(e);
      }
      function i(e) {
        for (var t = 0; t < u.length; ++t)
          if (u[t] === e) {
            u.splice(t, 1);
            break;
          }
      }
      function o() {
        return (
          window.devicePixelRatio > 1 ||
          !(
            !window.matchMedia ||
            !window.matchMedia(
              "(-webkit-min-device-pixel-ratio: 1.5),\t\t\t\t(min--moz-device-pixel-ratio: 1.5),\t\t\t\t(-o-min-device-pixel-ratio: 3/2),\t\t\t\t(min-resolution: 1.5dppx)"
            ).matches
          )
        );
      }
      function a() {
        var e = Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
          ),
          n = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
          );
        return Modernizr.mediaqueries
          ? e < l.smBreakpoint ||
            (e < l.mdBreakpoint && n < l.smBreakpointHeight)
            ? t.SM
            : e < l.mdBreakpoint
            ? t.MD
            : t.LG
          : t.SM;
      }
      function s() {
        var e =
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
          t = window.devicePixelRatio || 1,
          n = {
            width: window.screen.width * t,
            height: window.screen.height * t,
          };
        e && 1125 == n.width && 2436 === n.height && (m = !0);
      }
      function r() {
        s(),
          (c = Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
          )),
          (d = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
          )),
          (f = o()),
          $(window).on("resize", function () {
            var e = !1,
              t = !1,
              n = Math.max(
                document.documentElement.clientWidth,
                window.innerWidth || 0
              ),
              i = Math.max(
                document.documentElement.clientHeight,
                window.innerHeight || 0
              );
            n > i && m && (i = window.innerHeight),
              n !== c && (e = !0),
              i !== d && (t = !0),
              (c = n),
              (d = i);
            for (var o = 0; o < u.length; ++o) u[o](e, t);
          });
      }
      var l = {
          smBreakpointHeight: 620,
          smBreakpoint: 768,
          mdBreakpoint: 1280,
        },
        c = 0,
        d = 0,
        u = [],
        f = !1,
        m = !1;
      return {
        init: function () {
          r();
        },
        removeResizeCallback: function (e) {
          i(e);
        },
        addResizeCallback: function (t) {
          e(t);
        },
        getSize: function () {
          return a();
        },
        getHeight: function (e) {
          return e && c > d && m
            ? window.innerHeight
            : Math.max(
                document.documentElement.clientHeight,
                window.innerHeight || 0
              );
        },
        isMobileDevice: function () {
          return /Mobi/.test(navigator.userAgent);
        },
        getOrientation: function () {
          return window.matchMedia("(orientation: portrait)").matches
            ? n.PORTRAIT
            : n.LANDSCAPE;
        },
        isRetina: function () {
          return f;
        },
      };
    })(),
    l = (function () {
      function e() {
        BNS.isOn() ||
          ((document.documentElement.scrollTop || document.body.scrollTop) >
          d.scrollTopBreakpoint
            ? c.hasClass("on") || c.addClass("on")
            : c.hasClass("on") && c.removeClass("on"));
      }
      function t() {
        c.removeClass("on");
      }
      function n(e) {
        for (var t = 0; t < u.length; ++t)
          if (u[t] === e) {
            u.splice(t, 1);
            break;
          }
      }
      function i(e) {
        u.push(e);
      }
      function o() {
        e(),
          i(e),
          c.on("click", function () {
            return (
              $("html, body").animate(
                { scrollTop: 0 },
                { duration: d.scrollTime, easing: d.scrollAnimationType }
              ),
              !1
            );
          });
      }
      function a() {
        $("body").on("click", "a.scroll-to", function () {
          var e = $(this).prop("hash"),
            t = parseInt($(e).css("margin-top"));
          t > 0 && (t = 0);
          var n = parseInt($(e).css("padding-top"));
          return (
            $("html, body").animate(
              {
                scrollTop:
                  $(e).offset().top - d.headerHeight[r.getSize()] - t + n,
              },
              { duration: d.scrollTime, easing: d.scrollAnimationType }
            ),
            !1
          );
        });
      }
      function s() {
        $(window).on("scroll", function () {
          d.isScrolling = !0;
          for (var e = 0; e < u.length; ++e) u[e]();
          clearTimeout(d.scrollTimeout),
            (d.scrollTimeout = setTimeout(function () {
              d.isScrolling = !1;
            }, 200));
        });
      }
      function l() {
        (c = $("a.scroll-top")), o(), a(), s();
      }
      var c,
        d = {
          scrollTime: 800,
          scrollAnimationType: "easeInOutCubic",
          headerHeight: { SM: 85, MD: 125, LG: 125 },
          isScrolling: !0,
          scrollTimeout: null,
          scrollTopBreakpoint: 600,
        },
        u = [];
      return {
        init: function () {
          l();
        },
        removeScrollCallback: function (e) {
          n(e);
        },
        addScrollCallback: function (e) {
          i(e);
        },
        scrollTo: function (e) {
          window.scrollTo(0, e);
        },
        isScrolling: function () {
          return d.isScrolling;
        },
        hideScrollTop: function () {
          t();
        },
      };
    })(),
    c = (function () {
      function n(e, t, n) {
        return e.val() !== e.data("default-value") || t || n
          ? e[0].checkValidity()
            ? (e.closest("div.field").removeClass("error"), !0)
            : (e.closest("div.field").addClass("error"), !1)
          : (e.closest("div.field").removeClass("error"), !0);
      }
      function o(e) {
        var t = !1;
        return (
          $("input:not(.selectric-input), textarea, select", e).each(
            function () {
              t = !n($(this), !0) || t;
            }
          ),
          t
        );
      }
      function s() {
        $("input, textarea, select").each(function () {
          $(this).data("default-value", $(this).val());
        }),
          $("form").data("submitted", !1);
      }
      function l(e, t) {
        0 !== $(".notifications", e).length &&
          ($(".notifications > div", e).removeClass("on"),
          $(".notifications > div." + t, e).addClass("on"));
      }
      function c(e) {
        0 !== $(".notifications", e).length &&
          $(".notifications > div", e).removeClass("on");
      }
      function d(e, t) {
        var n;
        0 === t
          ? ((n = $('button[type="submit"]', e)).removeClass("sending sent"),
            n.addClass("regular"),
            n.prop("disabled", !1))
          : 1 === t
          ? ((n = $('button[type="submit"]', e)).removeClass("regular sent"),
            n.addClass("sending"),
            n.prop("disabled", !0))
          : 2 === t &&
            ((n = $('button[type="submit"]', e)).removeClass("regular sending"),
            n.addClass("sent"),
            n.prop("disabled", !1));
      }
      function u(e) {
        $('button[type="submit"]', e).prop("disabled", !1);
      }
      function f(e) {
        return new Promise(function (t, n) {
          var o,
            a = e.attr("action"),
            s = e.attr("method"),
            r = e.attr("enctype");
          switch (r) {
            case i.AXWWWFU:
              o = e.serialize();
              break;
            case i.MFD:
              o = new FormData(e[0]);
          }
          $.ajax({
            url: Config.BASE_URL + a,
            data: o,
            type: s,
            processData: !(r === i.MFD),
            contentType: r,
          })
            .done(function (e) {
              t(e);
            })
            .fail(function () {
              n();
            });
        });
      }
      function m() {
        r.getSize() === t.LG
          ? y.selectricInitialized ||
            ($("select").on("selectric-init", function () {
              $(this).prop("tabindex", "-1");
            }),
            $("select").selectric({
              arrowButtonMarkup: '<b class="button"></b>',
            }),
            (y.selectricInitialized = !0))
          : y.selectricInitialized &&
            ($("select").off("selectric-init"),
            $("select").selectric("destroy"),
            (y.selectricInitialized = !1));
      }
      function p() {
        $("textarea")
          .each(function () {
            $(this).css("height", $(this).prop("scrollHeight") + "px");
          })
          .on("input", function () {
            $(this).prop("scrollHeight") /
              parseInt($(this).css("line-height"), 10) >
            y.textareaLines
              ? $(this).css("overflow-y", "scroll")
              : ($(this).css("overflow-y", "hidden"),
                $(this).css("height", "auto"),
                $(this).css("height", $(this).prop("scrollHeight") + 1 + "px"));
          });
      }
      function g() {
        $("input, textarea, select").on("change", function (t) {
          var i = $(this).closest("form");
          n($(this), !1, i.data("submitted"));
          var o = !1;
          $("input:not(.selectric-input), textarea, select", i).each(
            function () {
              o = !this.checkValidity() || o;
            }
          ),
            o ? i.data("submitted") && l(i, e.FORM_ERROR) : c(i);
        });
      }
      function h() {
        $("body").off("submit", "form"),
          $("body").on("submit", "form", function () {
            var t = $(this);
            t.data("submitted", !0), d(t, 1);
            var n = o(t);
            return (
              $("#contact-recaptcha > div iframe").removeAttr("style"),
              "" === $("#g-recaptcha-response").val() &&
                ((n = !0),
                $("#contact-recaptcha > div iframe").css({
                  border: "1px solid #ff5959",
                  "border-radius": "5px",
                  margin: "-1px",
                })),
              n
                ? (d(t, 0), l(t, e.FORM_ERROR), !1)
                : t.hasClass("fh-no-ajax")
                ? (u(t), !0)
                : (f(t).then(
                    function (n) {
                      JSON.parse(n).error
                        ? (l(t, e.SERVER_ERROR), d(t, 0))
                        : (c(t),
                          d(t, 2),
                          t.data("submitted", !1),
                          t.hasClass("fh-no-clear"));
                    },
                    function () {
                      l(t, e.SERVER_ERROR), d(t, 0);
                    }
                  ),
                  !1)
            );
          });
      }
      function v() {
        $("form").attr("novalidate", "novalidate"),
          (y.selectricInitialized = !1),
          r.removeResizeCallback(m),
          m(),
          r.addResizeCallback(m),
          p(),
          g(),
          s(),
          h();
      }
      var y = { selectricInitialized: !1, textareaLines: 16 };
      return {
        init: function () {
          v(), a.addLoadCallback(v);
        },
      };
    })(),
    d = 0,
    u = function (e, t) {
      clearTimeout(d), (d = setTimeout(e, t));
    },
    f =
      ((function () {
        var e,
          t = document.createElement("fakeelement"),
          n = {
            transition: "transitionend",
            OTransition: "oTransitionEnd",
            MozTransition: "transitionend",
            WebkitTransition: "webkitTransitionEnd",
          };
        for (e in n) if (void 0 !== t.style[e]) return n[e];
      })(),
      (function () {
        function e(e) {
          m.removeClass("active"),
            (e = "home" == e ? "/" : e),
            $('ul > li a[href="' + e + '"]', c).addClass("active");
        }
        function t() {
          h.outerHeight(r.getHeight(!0) - parseInt(h.css("top"))),
            g.outerHeight($(document).outerHeight()),
            $(".loader-background").outerHeight(r.getHeight()),
            c.hasClass("on") &&
              (f.css(
                "bottom",
                r.getHeight() - w.navElementsOffset[r.getSize()] + "px"
              ),
              l.css(
                "bottom",
                r.getHeight() - w.navElementsOffset[r.getSize()] + "px"
              ),
              $(".loader-background").outerHeight(r.getHeight()));
        }
        function n() {
          f.css("bottom", "auto"),
            l.css("bottom", "auto"),
            o.removeClass("nav-on"),
            $body.removeClass("overlay-transition-end"),
            c.removeClass("transition-end"),
            c.removeClass("on loading"),
            clearTimeout(d),
            u(function () {
              a.setInteractionBlocked(!1),
                $(".loader-background img").removeClass("hover");
            }, 620),
            BNS.off();
        }
        function i() {
          (o = $("header#header")),
            (s = $("header#header .menu")),
            (l = $("nav#nav .close")),
            (c = $("nav#nav,#nav-overlay-content")),
            (h = $("#nav-overlay-content .content")),
            (f = $(".logo", c)),
            (m = $("ul > li a, a.logo", c)),
            (p = $(window)),
            ($body = $("body")),
            (g = $(".document-overlay")),
            (v = $("div.loader")),
            (y = $(".loader-background img")),
            r.addResizeCallback(t),
            h.outerHeight(r.getHeight(!0) - parseInt(h.css("top"))),
            $(".loader-background").outerHeight(r.getHeight()),
            s.on("click", function () {
              return (
                !a.getInteractionBlocked() &&
                (a.setInteractionBlocked(!0),
                f.css(
                  "bottom",
                  r.getHeight() - w.navElementsOffset[r.getSize()] + "px"
                ),
                l.css(
                  "bottom",
                  r.getHeight() - w.navElementsOffset[r.getSize()] + "px"
                ),
                o.addClass("nav-on"),
                c.addClass("on"),
                u(function () {
                  a.setInteractionBlocked(!1),
                    g.outerHeight($(document).outerHeight()),
                    c.addClass("transition-end"),
                    $body.addClass("overlay-transition-end");
                }, 520),
                BNS.on(),
                !1)
              );
            }),
            l.on("click", function () {
              return (
                !a.getInteractionBlocked() &&
                (a.setInteractionBlocked(!0), n(), BNS.off(), !1)
              );
            }),
            c.on("click", function (e) {
              if ($(e.target).not("a")) {
                if (a.getInteractionBlocked()) return !1;
                a.setInteractionBlocked(!0), n(), BNS.off();
              }
            }),
            m.on("click", function () {
              if ("_blank" !== $(this).attr("target")) {
                if (a.getInteractionBlocked()) return !1;
                a.setInteractionBlocked(!0);
                var e = $(this).attr("href");
                return (
                  $(".loader-background img")
                    .not('[data-page="' + $(this).data("page") + '"]')
                    .removeClass("active"),
                  $(
                    '.loader-background img[data-page="' +
                      $(this).data("page") +
                      '"]'
                  ).addClass("active"),
                  v.addClass("open-from-nav"),
                  c.addClass("loading"),
                  setTimeout(function () {
                    setTimeout(function () {
                      n(), v.removeClass("open-from-nav");
                    }, w.loaderOpenTime);
                  }, w.menuClosingTime),
                  !1
                );
              }
            });
        }
        var o,
          s,
          l,
          c,
          f,
          m,
          p,
          g,
          h,
          v,
          y,
          w = {
            loaderOpenTime: 600,
            menuClosingTime: 200,
            navElementsOffset: { SM: 66, MD: 76, LG: 86 },
            interactionBlocked: !1,
          };
        return {
          init: function () {
            i();
          },
          setActive: function (t) {
            e(t);
          },
        };
      })()),
    m = (function () {
      function e() {
        if (!(BNS.isOn() || m.length < 1)) {
          var e = document.documentElement.scrollTop || document.body.scrollTop,
            t = 0;
          try {
            t = m[0].getBoundingClientRect();
          } catch (e) {
            t = { top: m[0].offsetTop, left: m[0].offsetLeft };
          }
          e - t > t
            ? m.hasClass("animate") && m.removeClass("animate")
            : m.hasClass("animate") || m.addClass("animate");
        }
      }
      function n() {
        if (!BNS.isOn() && r.getSize() !== t.SM) {
          var e = (100 - $(window).scrollTop() / 6) / 100;
          (e = e < 0 ? 0 : e),
            parseFloat(p.css("opacity")) !== e && p.css("opacity", e);
        }
      }
      function i() {
        var e = r.getSize(),
          n = r.getHeight(),
          i = r.getOrientation();
        if (e === t.SM)
          return (
            u.removeClass("flying keep-arrow"),
            u.css("min-height", "0"),
            void (h.previousOrientation = null)
          );
        if (e === t.MD && r.isMobileDevice()) {
          if (h.previousOrientation === i) return;
          h.previousOrientation = i;
        } else h.previousOrientation = null;
        e === t.LG && (h.previousOrientation = null),
          u.css("min-height", n + "px"),
          u.removeClass("flying"),
          f.outerHeight() + h.arrowSizing[e] <= n - h.wrapperOffset[e]
            ? u.addClass("flying keep-arrow")
            : (u.removeClass("keep-arrow"), u.css("min-height", "0"));
      }
      function s(e, t) {
        if (e) {
          var n = $("section.home-instagram .list-item-portfolio .p"),
            i = h.instagramClampLimit[r.getSize()];
          n.each(function () {
            void 0 !== $(this).data("clamp-original") &&
              $(this).html($(this).data("clamp-original"));
            var e = $clamp(this, { clamp: i });
            $(this).data("clamp-original", e.original);
          });
        }
      }
      function c() {
        if (r.getSize() === t.LG) {
          var e = $("section.home-portfolio .list .list-item-portfolio>a");
          e.off("mouseenter mouseleave");
          var n = $({ deg: -170 });
          e.hover(
            function () {
              var e = $(this).find("svg.circle");
              $(this).find("svg.circle circle").stop(!0, !0).animate(
                {
                  "stroke-dashoffset": 0,
                  "stroke-dasharray": 295.16,
                  opacity: 1,
                },
                500
              ),
                n.animate(
                  { deg: -90 },
                  {
                    duration: 500,
                    step: function (t) {
                      e.css({ transform: "rotate(" + t + "deg)" });
                    },
                  }
                );
            },
            function () {
              var e = $(this).find("svg.circle"),
                t = $(this).find("svg.circle circle");
              t.stop().animate({ opacity: 0 }, 250, function () {
                t.stop(!0, !0).removeAttr("style"),
                  e.removeAttr("style"),
                  (n = $({ deg: -170 }));
              }),
                n.stop();
            }
          );
        }
      }
      function d() {
        l.removeScrollCallback(e),
          l.removeScrollCallback(n),
          r.removeResizeCallback(i),
          $("html").hasClass("home") &&
            ((u = $("section.home-top")),
            (f = $(".wrapper > .row", u)),
            (m = $("a.toggle", u)),
            (p = $(".bg-image", u)),
            (g = $("section.home-instagram .list")),
            $(".bg-image img").on("load", function () {
              $(".bg-image").addClass("loaded");
            }),
            $(".bg-image img")[0].complete &&
              $(".bg-image img").trigger("load"),
            $("section.home-portfolio .list-item-portfolio>a")
              .off("click")
              .on("click", function () {
                $(this).addClass("clicked");
              }),
            (h.previousOrientation = null),
            i(),
            c(),
            $(window).on("load", function () {
              setTimeout(function () {
                s(!0);
              }, 100);
            }),
            l.addScrollCallback(e),
            l.addScrollCallback(n),
            r.addResizeCallback(i),
            r.addResizeCallback(s));
      }
      var u,
        f,
        m,
        p,
        g,
        h = {
          arrowSizing: { MD: 100, LG: 110 },
          wrapperOffset: { MD: 155, LG: 165 },
          instagramClampLimit: { SM: 5, MD: 5, LG: 6 },
          previousOrientation: null,
        };
      return {
        init: function () {
          d(), a.addLoadCallback(d);
        },
      };
    })(),
    p =
      ((function () {
        function e(e) {
          var t = e.getContext("2d");
          t.beginPath(),
            t.arc(25, 25, 25, 0, 2 * Math.PI),
            (t.fillStyle = "#0f141e"),
            t.fill();
        }
        function n(e, t) {
          if (e.aIn && !(t > 100)) {
            setTimeout(function () {
              window.requestAnimationFrame(function () {
                n(e, t + 5);
              });
            }, 1e3 / d.fps);
            var i = e.getContext("2d");
            i.clearRect(0, 0, e.width, e.height),
              i.beginPath(),
              i.arc(
                25,
                25,
                23.5,
                1 * Math.PI + (0.5 * Math.PI * t) / 100,
                1.5 * Math.PI + (t / 100) * 2 * Math.PI
              ),
              (i.strokeStyle = "rgba(255, 255, 255, " + t / 100 + ")"),
              (i.lineWidth = 3),
              i.stroke();
          }
        }
        function i(e, t) {
          if (e.aOut && !(t > 100)) {
            setTimeout(function () {
              window.requestAnimationFrame(function () {
                i(e, t + 10);
              });
            }, 1e3 / d.fps);
            var n = e.getContext("2d");
            n.clearRect(0, 0, e.width, e.height),
              n.beginPath(),
              n.arc(25, 25, 25, 0, 2 * Math.PI),
              (n.fillStyle = "#0f141e"),
              n.fill(),
              n.beginPath(),
              n.arc(25, 25, 23.5, 0, 2 * Math.PI),
              (n.strokeStyle = "rgba(255, 255, 255, " + (1 - t / 100) + ")"),
              (n.lineWidth = 3),
              n.stroke();
          }
        }
        function o() {
          c.each(function () {
            var t = $(this)[0];
            t.getContext && ((t.aIn = !1), (t.aOut = !1), e(t));
          });
        }
        function a() {
          var e = r.getSize();
          l.off("mouseenter"),
            l.off("mouseleave"),
            e === t.LG &&
              (l.on("mouseenter", function () {
                var e = $(this).find("canvas")[0];
                e &&
                  e.getContext &&
                  ((e.aIn = !0),
                  (e.aOut = !1),
                  window.requestAnimationFrame(function () {
                    n(e, 0);
                  }));
              }),
              l.on("mouseleave", function () {
                var e = $(this).find("canvas")[0];
                e &&
                  e.getContext &&
                  ((e.aIn = !1),
                  (e.aOut = !0),
                  window.requestAnimationFrame(function () {
                    i(e, 0);
                  }));
              }));
        }
        function s() {
          $("html").hasClass("home") &&
            ((l = $("section.home-portfolio .list-item-portfolio > a.new")),
            (c = $("canvas", l)),
            o(),
            a(),
            r.removeResizeCallback(a),
            r.addResizeCallback(a));
        }
        var l,
          c,
          d = { fps: 60 };
      })(),
      (function () {
        var l,
          c,
          d,
          u = {
            lgMapOffset: 170,
            position: { lat: 50.091472, lng: 19.99234 },
            positionOffset: { MD: 365, LG: 490 },
          };
        return {
          init: function () {
            a.addLoadCallback(s);
          },
        };
      })()),
    g = (function () {
      function e(e) {
        var t = $(".swiper-pagination-line-active");
        t.addClass("is-init"),
          e.$el.addClass("is-autoplay"),
          setTimeout(function () {
            t.removeClass("is-init");
          }, 10);
      }
      function t(t) {
        t.autoplay.running ||
          ((t.params.autoplay = { delay: i.total, disableOnInteraction: !0 }),
          t.autoplay.start(),
          e(t));
      }
      function n() {
        new Swiper(".swiper-container", {
          intervalId: 0,
          isInteraction: !1,
          firstStart: !1,
          loop: !0,
          speed: 400,
          touchEventsTarget: "wrapper",
          preloadImages: !1,
          lazy: { loadPrevNext: !0, preloaderClass: "null" },
          watchSlidesProgress: !0,
          touchAngle:
            "ontouchstart" in window ||
            (window.DocumentTouch && document instanceof DocumentTouch)
              ? 45
              : 90,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: !0,
            bulletClass: "swiper-pagination-line",
            bulletActiveClass: "swiper-pagination-line-active",
            renderBullet: function (e, t) {
              return (
                '<a href="#" data-id="' +
                e +
                '" class="' +
                t +
                '"><span class="swiper-pagination-line-index">0' +
                (e + 1) +
                '</span><span class="swiper-pagination-line-bg"><span><i></i></span></span></a>'
              );
            },
          },
          on: {
            init: function () {
              var e = this;
              setTimeout(function () {
                var n = scrollMonitor.create(e.$el, -80);
                n.fullyEnterViewport(function () {
                  n.destroy(),
                    e.$el.addClass("in-viewport"),
                    o.hasClass("loaded") &&
                    e.$el
                      .find(".swiper-slide-active")
                      .children(".swiper-lazy-loaded").length > 0
                      ? t(e)
                      : (e.intervalId = setInterval(function () {
                          !e.isInteraction &&
                            !e.autoplay.running &&
                            o.hasClass("loaded") &&
                            e.$el
                              .find(".swiper-slide-active")
                              .children(".swiper-lazy-loaded").length > 0 &&
                            (setTimeout(function () {
                              e.isInteraction || t(e);
                            }, 1e3),
                            clearInterval(e.intervalId));
                        }, 25));
                });
              }, 50);
            },
            resize: function () {
              if ($("#nav").hasClass("on")) {
                var e = this;
                setTimeout(function () {
                  e.update();
                }, 600);
              }
            },
            paginationRender: function () {
              $("body").on("click", ".swiper-pagination-line-bg", function (e) {
                e.preventDefault(), e.stopPropagation();
              });
            },
            autoplayStart: function () {},
            autoplayStop: function () {
              this.$el.removeClass("is-autoplay");
            },
            beforeTransitionStart: function (e, t) {
              this.firstStart
                ? t ||
                  (this.$el.addClass("interacted"), (this.isInteraction = !0))
                : (this.firstStart = !0);
            },
            slideChangeTransitionStart: function (e, t) {
              !this.isInteraction &&
                this.autoplay.running &&
                this.$el
                  .find(".swiper-slide-active")
                  .children(".swiper-lazy-loaded").length < 1 &&
                this.autoplay.stop();
            },
            lazyImageReady: function (e, n) {
              !this.isInteraction &&
                o.hasClass("loaded") &&
                this.$el.hasClass("in-viewport") &&
                !this.autoplay.running &&
                $(n).parent().hasClass("swiper-slide-active") &&
                (t(this), clearInterval(this.intervalId));
              var i = this;
              $(n).on("load", function () {
                i.pagination.$el
                  .find('[data-id="' + $(e).data("swiper-slide-index") + '"]')
                  .addClass("img-loaded"),
                  $(n).parent().addClass("loaded"),
                  $(n).next(".swiper-lazy-preloader").remove();
              });
            },
          },
        });
        window.addEventListener("orientationchange", function () {
          $(".swiper-container-horizontal.is-autoplay").addClass("reset"),
            setTimeout(function () {
              $(".swiper-container-horizontal.is-autoplay").removeClass(
                "reset"
              );
            }, 5);
        });
      }
      var i = { id: null, start: null, progress: null, total: 5e3 },
        o = $(".container");
      return {
        init: function () {
          n(), a.addLoadCallback(n);
        },
      };
    })(),
    h = (function () {
      function e() {
        c.css("height", ""),
          d.removeClass("on"),
          d.css("height", ""),
          d.css("top", ""),
          u.removeClass("on"),
          u.css("opacity", "");
      }
      function n(n) {
        if (!BNS.isOn()) {
          if (r.getSize() !== t.LG) return e(), void (m.switched = !1);
          n && (e(), (m.switched = !1));
          var i = document.documentElement.scrollTop || document.body.scrollTop,
            o = $(window).outerHeight(),
            a = $("body").outerHeight();
          i >= a - 2 * o
            ? (m.switched ||
                (c.css("height", a + "px"),
                d.addClass("on"),
                d.css("height", a - o + "px"),
                d.css("top", 2 * o - a + "px"),
                u.addClass("on"),
                (m.switched = !0)),
              u.css("opacity", 1 - (a - i - o) / o))
            : (e(), (m.switched = !1));
        }
      }
      function i() {
        n(!1);
      }
      function o() {
        n(!0);
      }
      function s() {
        $("html").hasClass("case-study") &&
          ((c = $(".scroll-container")),
          (d = $(".scroll-wrapper")),
          (u = $("section.case-study-next-project")),
          (f = $("section.case-study-photos img")
            .add("section.case-study-text")
            .add("section.case-study-photo-bg img")
            .add("section.case-study-photo-bg video")
            .add(
              $("section.case-study-distinct").find(
                ".row, .images > img, .images > video"
              )
            )
            .add("section.case-study-slider")
            .add("section.case-study-thanks")
            .not(".first")),
          r.removeResizeCallback(o),
          r.addResizeCallback(o),
          l.removeScrollCallback(i),
          l.addScrollCallback(i));
      }
      var c,
        d,
        u,
        f,
        m = { showImageOffset: 100, switched: !1 };
      return {
        init: function () {
          s(), a.addLoadCallback(s);
        },
      };
    })(),
    v = (function () {
      function e() {
        this.isInViewport &&
          ($(this.watchItem).addClass("animate--init"), this.destroy());
      }
      function t(t, n) {
        var i = scrollMonitor.create(t, n);
        i.stateChange(e), e.call(i);
      }
      function n() {
        if ($(window).height() > 680) e = -100;
        else var e = -parseInt(0.1 * $(window).height());
        $("section.case-study-photos .lazyload-wrapper")
          .add("section.case-study-text > .wrapper")
          .add("section.case-study-photo-bg .lazyload-wrapper")
          .add("section.case-study-photo-bg video")
          .add(
            $("section.case-study-distinct").find(
              ".row, .images > img, .images > video"
            )
          )
          .add("section.case-study-slider")
          .add("section.case-study-thanks")
          .add(".video-wrapper")
          .add(".animate--me")
          .each(function () {
            t($(this)[0], e);
          });
      }
      function i() {
        n();
      }
      return {
        init: function () {
          i();
        },
      };
    })(),
    y = (function () {
      function e() {
        if (this.isInViewport) {
          var e = $(this.watchItem)[0];
          e.readyState > 3
            ? ($(e).closest(".video-wrapper").addClass("loaded"), e.play())
            : ($(e).on("canplaythrough", function (t) {
                $(e).closest(".video-wrapper").removeClass("paused"),
                  e.paused &&
                    ($(e).closest(".video-wrapper").addClass("loaded"),
                    e.play());
              }),
              $(e).on("waiting", function (t) {
                e.readyState > 1
                  ? ($(e).closest(".video-wrapper").addClass("paused"),
                    e.pause())
                  : ($(e).off("canplaythrough"), $(e).off("waiting"));
              })),
            this.destroy();
        }
      }
      function t() {
        this.isInViewport && ($(this.watchItem)[0].load(), this.destroy());
      }
      function n(n, i) {
        var o = scrollMonitor.create(n, parseInt(r.getHeight()));
        o.stateChange(t), t.call(o);
        var a = scrollMonitor.create(n, i);
        a.stateChange(e), e.call(a);
      }
      function i() {
        var e = -parseInt(0.3 * r.getHeight());
        $(".video-wrapper video").each(function () {
          n($(this)[0], e);
        });
      }
      function o() {
        i(),
          $(".video-button").on("click", function () {
            "play" == $(this).attr("data-action")
              ? $(this).attr("data-action", "pause").prev("video")[0].play()
              : $(this).attr("data-action", "play").prev("video")[0].pause();
          });
      }
      return {
        init: function () {
          o();
        },
      };
    })();
  o.init(function () {
    a.init(),
      r.init(),
      l.init(),
      c.init(),
      f.init(),
      m.init(),
      p.init(),
      g.init(),
      h.init();
  });
})();
