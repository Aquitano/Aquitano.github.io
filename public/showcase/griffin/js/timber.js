function replaceUrlParam(e, t, i) {
    var n = new RegExp('(' + t + '=).*?(&|$)'),
        o = e;
    return 0 <= e.search(n) ? e.replace(n, '$1' + i + '$2') : o + (0 < o.indexOf('?') ? '&' : '?') + t + '=' + i;
}
function qtyProduct() {
    $('.qtyplus').click(function (e) {
        var t = $(this).attr('data-field'),
            i = parseInt($('input[name=' + t + ']').val());
        isNaN(i) ? $('input[name=' + t + ']').val(1) : $('input[name=' + t + ']').val(i + 1), e.preventDefault();
    }),
        $('.qtyminus').click(function (e) {
            var t = $(this).attr('data-field'),
                i = parseInt($('input[name=' + t + ']').val());
            !isNaN(i) && 1 < i ? $('input[name=' + t + ']').val(i - 1) : $('input[name=' + t + ']').val(1),
                e.preventDefault();
        });
}
function showPopup(e) {
    $(e).addClass('active');
}
function hidePopup(e) {
    $(e).removeClass('active');
}
!(function (e) {
    e.fn.prepareTransition = function () {
        return this.each(function () {
            var i = e(this);
            i.one('TransitionEnd webkitTransitionEnd transitionend oTransitionEnd', function () {
                i.removeClass('is-transitioning');
            });
            var n = 0;
            e.each(
                [
                    'transition-duration',
                    '-moz-transition-duration',
                    '-webkit-transition-duration',
                    '-o-transition-duration',
                ],
                function (e, t) {
                    n = parseFloat(i.css(t)) || n;
                },
            ),
                0 != n && (i.addClass('is-transitioning'), i[0].offsetWidth);
        });
    };
})(jQuery),
    'undefined' == typeof Shopify && (Shopify = {}),
    Shopify.formatMoney ||
        (Shopify.formatMoney = function (e, t) {
            var i = '',
                n = /\{\{\s*(\w+)\s*\}\}/,
                o = t || this.money_format;
            function r(e, t) {
                return void 0 === e ? t : e;
            }
            function a(e, t, i, n) {
                if (((t = r(t, 2)), (i = r(i, ',')), (n = r(n, '.')), isNaN(e) || null == e)) return 0;
                var o = (e = (e / 100).toFixed(t)).split('.');
                return o[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + i) + (o[1] ? n + o[1] : '');
            }
            switch (('string' == typeof e && (e = e.replace('.', '')), o.match(n)[1])) {
                case 'amount':
                    i = a(e, 2);
                    break;
                case 'amount_no_decimals':
                    i = a(e, 0);
                    break;
                case 'amount_with_comma_separator':
                    i = a(e, 2, '.', ',');
                    break;
                case 'amount_no_decimals_with_comma_separator':
                    i = a(e, 0, '.', ',');
            }
            return o.replace(n, i);
        }),
    (Shopify.getProduct = function (e, i) {
        jQuery.getJSON('/products/' + e + '.js', function (e, t) {
            'function' == typeof i ? i(e) : Shopify.onProduct(e);
        });
    }),
    (window.qtyProduct = qtyProduct),
    (Shopify.resizeImage = function (t, e) {
        try {
            if ('original' == e) return t;
            var i = t.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
            return i[1] + '_' + e + '.' + i[2];
        } catch (e) {
            return t;
        }
    }),
    (window.timber = window.timber || {}),
    (timber.cacheSelectors = function () {
        timber.cache = {
            $html: $('html'),
            $body: $('body'),
            $navigation: $('#AccessibleNav'),
            $mobileSubNavToggle: $('.mobile-nav__toggle'),
            $changeView: $('.change-view'),
            $productImage: $('#ProductPhotoImg'),
            $thumbImages: $('#ProductThumbs').find('a.product-single__thumbnail'),
            $recoverPasswordLink: $('#RecoverPassword'),
            $hideRecoverPasswordLink: $('#HideRecoverPasswordLink'),
            $recoverPasswordForm: $('#RecoverPasswordForm'),
            $customerLoginForm: $('#CustomerLoginForm'),
            $passwordResetSuccess: $('#ResetSuccess'),
        };
    }),
    (timber.init = function () {
        FastClick.attach(document.body),
            timber.cacheSelectors(),
            timber.accessibleNav(),
            timber.drawersInit(),
            timber.mobileNavToggle(),
            timber.productImageSwitch(),
            timber.responsiveVideos(),
            timber.collectionViews(),
            timber.loginForms();
    }),
    (timber.accessibleNav = function () {
        var e = timber.cache.$navigation,
            t = e.find('a'),
            i = e.children('li').find('a'),
            n = e.find('.site-nav--has-dropdown'),
            o = e.find('.site-nav__dropdown').find('a'),
            r = 'nav-hover',
            a = 'nav-focus';
        function s(e) {
            e.removeClass(r), timber.cache.$body.off('touchstart');
        }
        function c(e) {
            e.addClass(a);
        }
        function u(e) {
            e.removeClass(a);
        }
        n.on('mouseenter touchstart', function (e) {
            var t,
                i = $(this);
            i.hasClass(r) || e.preventDefault(),
                (t = i).addClass(r),
                setTimeout(function () {
                    timber.cache.$body.on('touchstart', function () {
                        s(t);
                    });
                }, 250);
        }),
            n.on('mouseleave', function () {
                s($(this));
            }),
            o.on('touchstart', function (e) {
                e.stopImmediatePropagation();
            }),
            t.focus(function () {
                !(function (e) {
                    e.next('ul').hasClass('sub-nav');
                    var t = $('.site-nav__dropdown').has(e).length;
                    t ? c(e.closest('.site-nav--has-dropdown').find('a')) : (u(i), c(e));
                })($(this));
            }),
            t.blur(function () {
                u(i);
            });
    }),
    (timber.drawersInit = function () {
        (timber.LeftDrawer = new timber.Drawers('NavDrawer', 'left')),
            (timber.RightDrawer = new timber.Drawers('CartDrawer', 'right', { onDrawerOpen: ''.load }));
    }),
    (timber.mobileNavToggle = function () {
        timber.cache.$mobileSubNavToggle.on('click', function () {
            $(this).parent().toggleClass('mobile-nav--expanded');
        });
    }),
    (timber.getHash = function () {
        return window.location.hash;
    }),
    (timber.productPage = function (e) {
        var t,
            i,
            n = e.money_format,
            o = e.variant,
            r = (e.selector, $('#ProductPhotoImg')),
            a = $('#AddToCart'),
            s = $('#ProductPrice'),
            c = $('#ComparePrice'),
            u = $('.quantity-selector, label + .js-qty'),
            d = $('#AddToCartText');
        o
            ? (o.featured_image &&
                  ((t = o.featured_image), (i = r[0]), Shopify.Image.switchImage(t, i, timber.switchImage)),
              o.available
                  ? (a.removeClass('disabled').prop('disabled', !1), d.html('Add to Cart'), u.show())
                  : (a.addClass('disabled').prop('disabled', !0), d.html('Sold Out'), u.hide()),
              s.html(Shopify.formatMoney(o.price, n)),
              o.compare_at_price > o.price
                  ? c.html('Compare at ' + Shopify.formatMoney(o.compare_at_price, n)).show()
                  : c.hide())
            : (a.addClass('disabled').prop('disabled', !0), d.html('Unavailable'), u.hide());
    }),
    (timber.productImageSwitch = function () {
        timber.cache.$thumbImages.length &&
            timber.cache.$thumbImages.on('click', function (e) {
                e.preventDefault();
                var t = $(this).attr('href');
                timber.switchImage(t, null, timber.cache.$productImage);
            });
    }),
    (timber.switchImage = function (e, t, i) {
        $(i).attr('src', e);
    }),
    (timber.responsiveVideos = function () {
        var e = $('iframe[src*="youtube.com/embed"], iframe[src*="player.vimeo"]'),
            t = e.add('iframe#admin_bar_iframe');
        e.each(function () {
            $(this).wrap('<div class="video-wrapper"></div>');
        }),
            t.each(function () {
                this.src;
            });
    }),
    (timber.collectionViews = function () {
        timber.cache.$changeView.length &&
            timber.cache.$changeView.on('click', function () {
                var e = $(this).data('view'),
                    t = document.URL,
                    i = -1 < t.indexOf('?');
                window.location = i ? replaceUrlParam(t, 'view', e) : t + '?view=' + e;
            });
    }),
    (timber.loginForms = function () {
        function t() {
            timber.cache.$recoverPasswordForm.show(), timber.cache.$customerLoginForm.hide();
        }
        timber.cache.$recoverPasswordLink.on('click', function (e) {
            e.preventDefault(), t();
        }),
            timber.cache.$hideRecoverPasswordLink.on('click', function (e) {
                e.preventDefault(), timber.cache.$recoverPasswordForm.hide(), timber.cache.$customerLoginForm.show();
            }),
            '#recover' == timber.getHash() && t();
    }),
    (timber.resetPasswordSuccess = function () {
        timber.cache.$passwordResetSuccess.show();
    }),
    (timber.Drawers = (function () {
        function e(e, t, i) {
            var n = {
                close: '.js-drawer-close',
                open: '.js-drawer-open-' + t,
                openClass: 'js-drawer-open',
                dirOpenClass: 'js-drawer-open-' + t,
            };
            if (
                ((this.$nodes = {
                    parent: $('body, html'),
                    page: $('#PageContainer'),
                    moved: $('.is-moved-by-drawer'),
                }),
                (this.config = $.extend(n, i)),
                (this.position = t),
                (this.$drawer = $('#' + e)),
                !this.$drawer.length)
            )
                return !1;
            (this.drawerIsOpen = !1), this.init();
        }
        return (
            (e.prototype.init = function () {
                $(this.config.open).on('click', $.proxy(this.open, this)),
                    this.$drawer.find(this.config.close).on('click', $.proxy(this.close, this));
            }),
            (e.prototype.open = function (e) {
                var t = !1;
                if (
                    (e ? e.preventDefault() : (t = !0),
                    e && e.stopPropagation && (e.stopPropagation(), (this.$activeSource = $(e.currentTarget))),
                    this.drawerIsOpen && !t)
                )
                    return this.close();
                this.$nodes.moved.addClass('is-transitioning'),
                    this.$drawer.prepareTransition(),
                    this.$nodes.parent.addClass(this.config.openClass + ' ' + this.config.dirOpenClass),
                    (this.drawerIsOpen = !0),
                    this.trapFocus(this.$drawer, 'drawer_focus'),
                    this.config.onDrawerOpen &&
                        'function' == typeof this.config.onDrawerOpen &&
                        (t || this.config.onDrawerOpen()),
                    this.$activeSource &&
                        this.$activeSource.attr('aria-expanded') &&
                        this.$activeSource.attr('aria-expanded', 'true'),
                    this.$nodes.page.on('touchmove.drawer', function () {
                        return !1;
                    }),
                    this.$nodes.page.on(
                        'click.drawer',
                        $.proxy(function () {
                            return this.close(), !1;
                        }, this),
                    );
            }),
            (e.prototype.close = function () {
                this.drawerIsOpen &&
                    ($(document.activeElement).trigger('blur'),
                    this.$nodes.moved.prepareTransition({ disableExisting: !0 }),
                    this.$drawer.prepareTransition({ disableExisting: !0 }),
                    this.$nodes.parent.removeClass(this.config.dirOpenClass + ' ' + this.config.openClass),
                    (this.drawerIsOpen = !1),
                    this.removeTrapFocus(this.$drawer, 'drawer_focus'),
                    this.$nodes.page.off('.drawer'));
            }),
            (e.prototype.trapFocus = function (t, e) {
                var i = e ? 'focusin.' + e : 'focusin';
                t.attr('tabindex', '-1'),
                    t.focus(),
                    $(document).on(i, function (e) {
                        t[0] === e.target || t.has(e.target).length || t.focus();
                    });
            }),
            (e.prototype.removeTrapFocus = function (e, t) {
                var i = t ? 'focusin.' + t : 'focusin';
                e.removeAttr('tabindex'), $(document).off(i);
            }),
            e
        );
    })()),
    $(timber.init),
    (window.showPopup = showPopup),
    (function (o) {
        (o.fn.PBR_CountDown = function (e) {
            return this.each(function () {
                new o.PBR_CountDown(this, e);
            });
        }),
            (o.PBR_CountDown = function (e, t) {
                var i, n;
                (this.options = o.extend(
                    {
                        autoStart: !0,
                        LeadingZero: !0,
                        DisplayFormat:
                            '<div>%%D%% Days</div><div>%%H%% Hours</div><div>%%M%% Minutes</div><div>%%S%% Seconds</div>',
                        FinishMessage: 'Expired',
                        CountActive: !0,
                        TargetDate: null,
                    },
                    t || {},
                )),
                    null != this.options.TargetDate &&
                        '' != this.options.TargetDate &&
                        ((this.timer = null),
                        (this.element = e),
                        (this.CountStepper = -1),
                        (this.CountStepper = Math.ceil(this.CountStepper)),
                        (this.SetTimeOutPeriod = 1e3 * (Math.abs(this.CountStepper) - 1) + 990),
                        (i = new Date(this.options.TargetDate)),
                        (n = new Date()),
                        (ddiff = 0 < this.CountStepper ? new Date(n - i) : new Date(i - n)),
                        (gsecs = Math.floor(ddiff.valueOf() / 1e3)),
                        this.CountBack(gsecs, this));
            }),
            (o.PBR_CountDown.fn = o.PBR_CountDown.prototype),
            (o.PBR_CountDown.fn.extend = o.PBR_CountDown.extend = o.extend),
            o.PBR_CountDown.fn.extend({
                calculateDate: function (e, t, i) {
                    var n = (Math.floor(e / t) % i).toString();
                    return this.options.LeadingZero && n.length < 2 && (n = '0' + n), '<b>' + n + '</b>';
                },
                CountBack: function (e, t) {
                    e < 0
                        ? (t.element.innerHTML = '<div class="lof-labelexpired"> ' + t.options.FinishMessage + '</div>')
                        : (clearInterval(t.timer),
                          (DisplayStr = t.options.DisplayFormat.replace(/%%D%%/g, t.calculateDate(e, 86400, 1e5))),
                          (DisplayStr = DisplayStr.replace(/%%H%%/g, t.calculateDate(e, 3600, 24))),
                          (DisplayStr = DisplayStr.replace(/%%M%%/g, t.calculateDate(e, 60, 60))),
                          (DisplayStr = DisplayStr.replace(/%%S%%/g, t.calculateDate(e, 1, 60))),
                          (t.element.innerHTML = DisplayStr),
                          t.options.CountActive &&
                              ((t.timer = null),
                              (t.timer = setTimeout(function () {
                                  t.CountBack(e + t.CountStepper, t);
                              }, t.SetTimeOutPeriod))));
                },
            });
    })(jQuery);
