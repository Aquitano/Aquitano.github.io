$(document).ready(function () {
    'use strict';
    var e, s;
    function t() {
        var e;
        767 < $(window).width() &&
            ((e = $('.slick-slider').height()), $('#slick-pager .slick-pager').css('height', e - 60));
    }
    $(window).on('load', function () {
        $('#preloader').delay(600).fadeOut();
    }),
        0 < $('.my-slider').length &&
            ((e = $('#my-slider-1').data('slider-width')),
            (s = $('#my-slider-1').data('slider-height')),
            $('#my-slider-1').sliderPro({
                width: e,
                height: s,
                fade: !0,
                arrows: !0,
                buttons: !1,
                waitForLayers: !1,
                thumbnailPointer: !1,
                touchSwipe: !1,
                autoplay: !0,
                autoScaleLayers: !0,
            })),
        $(window).on('scroll', function (e) {
            e.preventDefault(), 100 < $(this).scrollTop() ? $('#back-to-top').fadeIn() : $('#back-to-top').fadeOut();
        }),
        $('#back-to-top').on('click', function (e) {
            e.preventDefault(), $('body,html').animate({ scrollTop: 0 }, 'slow');
        }),
        $('.counter').counterUp({ delay: 10, time: 1e3 }),
        $('.deal-clock').PBR_CountDown({
            TargetDate: '10/24/2020 00:00:00',
            DisplayFormat:
                "<ul class='list-inline'><li class='day'>%%D%%<span>Days</span></li><li>%%H%%<span>Hours</span></li><li>%%M%%<span>Mins</span></li><li>%%S%%<span>Secs</span></li></ul>",
            FinishMessage: 'End Deal',
        }),
        $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: { enabled: !0, navigateByImgClick: !0, preload: [0, 1] },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function (e) {
                    return e.el.attr('title') + '<small>by Marsel Van Oosten</small>';
                },
            },
        }),
        $(function () {
            var e, s, t, a, r, o, l, c, d, i, p;
            (e = $('.ps-search-btn')),
                (s = $('.ps-search__close')),
                (t = $('.ps-search')),
                e.on('click', function (e) {
                    e.preventDefault(), t.addClass('open');
                }),
                s.on('click', function (e) {
                    e.preventDefault(), t.removeClass('open');
                }),
                (r = $('.ps-slider')),
                (o = r.siblings().find('.ps-slider__min')),
                (l = r.siblings().find('.ps-slider__max')),
                (c = r.data('default-min')),
                (d = r.data('default-max')),
                (i = r.data('max')),
                (p = r.data('step')),
                0 < r.length &&
                    (r.slider({
                        min: 0,
                        max: i,
                        step: p,
                        range: !0,
                        values: [c, d],
                        slide: function (e, s) {
                            var t = s.values;
                            o.text('$' + t[0]), l.text('$' + t[1]);
                        },
                    }),
                    (a = r.slider('option', 'values')),
                    console.log(a[1]),
                    o.text('$' + a[0]),
                    l.text('$' + a[1]));
        }),
        $('.owl-carousel').each(function () {
            var e,
                s,
                t,
                a,
                r,
                o = $(this).data('items');
            (e = $(this).data('large') ? $(this).data('large') : o),
                (s = $(this).data('medium') ? $(this).data('medium') : o),
                (t = $(this).data('smallmedium') ? $(this).data('smallmedium') : o),
                (a = $(this).data('extrasmall') ? $(this).data('extrasmall') : 2),
                (r = $(this).data('verysmall') ? $(this).data('verysmall') : 2);
            var l = [];
            (l.dots = $(this).data('pagination')),
                (l.arrows = $(this).data('nav')),
                (l.infinite = !0),
                (l.speed = 500),
                (l.autoplay = $(this).data('autoplay')),
                (l.cssEase = 'linear'),
                (l.slidesToShow = o),
                (l.slidesToScroll = 1),
                (l.mobileFirst = !0),
                (l.vertical = !1),
                (l.responsive = [
                    { breakpoint: 1500, settings: { slidesToShow: o, slidesToScroll: o } },
                    { breakpoint: 1280, settings: { slidesToShow: e, slidesToScroll: e } },
                    { breakpoint: 980, settings: { slidesToShow: s, slidesToScroll: s } },
                    { breakpoint: 767, settings: { slidesToShow: t, slidesToScroll: t, infinite: !1 } },
                    { breakpoint: 479, settings: { slidesToShow: a, slidesToScroll: a, infinite: !1, unslick: !0 } },
                    { breakpoint: 0, settings: { slidesToShow: r, slidesToScroll: r, infinite: !1 } },
                ]),
                $(this).slick(l);
        }),
        $('.featuredPostSlider').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: !1,
            fade: !0,
            autoplay: !1,
            adaptiveHeight: !0,
            asNavFor: '.slick-pager',
        }),
        $('.slick-pager').slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            nextArrow: $('.pagerNavigation .bottom'),
            prevArrow: $('.pagerNavigation .top'),
            asNavFor: '.featuredPostSlider',
            focusOnSelect: !0,
            vertical: !0,
            responsive: [{ breakpoint: 767, settings: { vertical: !1 } }],
        }),
        t(),
        $(window).resize(function () {
            t();
        }),
        $('.product_1 .color_selector > .swatch-color').on('click', function (e) {
            e.preventDefault();
            var s = $(this).data('value');
            'blue' == s
                ? ($('.product_1 .swatch-blue').addClass('selected'),
                  $('.product_1 .product-featured-image').attr('src', 'assets/images/product/product_12.jpg'))
                : $('.product_1 .swatch-blue').removeClass('selected'),
                'orange' == s
                    ? ($('.product_1 .swatch-orange').addClass('selected'),
                      $('.product_1 .product-featured-image').attr('src', 'assets/images/product/product_2.jpg'))
                    : $('.product_1 .swatch-orange').removeClass('selected'),
                'purple' == s
                    ? ($('.product_1 .swatch-purple').addClass('selected'),
                      $('.product_1 .product-featured-image').attr('src', 'assets/images/product/product_9.jpg'))
                    : $('.product_1 .swatch-purple').removeClass('selected'),
                'red' == s
                    ? ($('.product_1 .swatch-red').addClass('selected'),
                      $('.product_1 .product-featured-image').attr('src', 'assets/images/product/product_5.jpg'))
                    : $('.product_1 .swatch-red').removeClass('selected');
        }),
        $('.product_2 .color_selector > .swatch-color').on('click', function (e) {
            e.preventDefault();
            var s = $(this).data('value');
            'blue' == s
                ? ($('.product_2 .swatch-blue').addClass('selected'),
                  $('.product_2 .product-featured-image').attr('src', 'assets/images/product/product_8.jpg'))
                : $('.product_2 .swatch-blue').removeClass('selected'),
                'green' == s
                    ? ($('.product_2 .swatch-green').addClass('selected'),
                      $('.product_2 .product-featured-image').attr('src', 'assets/images/product/product_4.jpg'))
                    : $('.product_2 .swatch-green').removeClass('selected'),
                'purple' == s
                    ? ($('.product_2 .swatch-purple').addClass('selected'),
                      $('.product_2 .product-featured-image').attr('src', 'assets/images/product/product_7.jpg'))
                    : $('.product_2 .swatch-purple').removeClass('selected'),
                'red' == s
                    ? ($('.product_2 .swatch-red').addClass('selected'),
                      $('.product_2 .product-featured-image').attr('src', 'assets/images/product/product_5.jpg'))
                    : $('.product_2 .swatch-red').removeClass('selected');
        }),
        $('.product-info .color_selector > .swatch-color').on('click', function (e) {
            e.preventDefault();
            var s = $(this).data('value');
            'blue' == s
                ? ($('.product-info .swatch-blue').addClass('selected'),
                  $('.product_selector_1').attr('src', 'assets/images/product_single/product_single_6.jpg'))
                : $('.product-info .swatch-blue').removeClass('selected'),
                'green' == s
                    ? ($('.product-info .swatch-green').addClass('selected'),
                      $('.product_selector_1').attr('src', 'assets/images/product_single/product_single_2.jpg'))
                    : $('.product-info .swatch-green').removeClass('selected'),
                'purple' == s
                    ? ($('.product-info .swatch-purple').addClass('selected'),
                      $('.product_selector_1').attr('src', 'assets/images/product_single/product_single_3.jpg'))
                    : $('.product-info .swatch-purple').removeClass('selected'),
                'orange' == s
                    ? ($('.product-info .swatch-orange').addClass('selected'),
                      $('.product_selector_1').attr('src', 'assets/images/product_single/product_single_5.jpg'))
                    : $('.product-info .swatch-orange').removeClass('selected'),
                'red' == s
                    ? ($('.product-info .swatch-red').addClass('selected'),
                      $('.product_selector_1').attr('src', 'assets/images/product_single/product_single_4.jpg'))
                    : $('.product-info .swatch-red').removeClass('selected'),
                console.log(s);
        }),
        $('.product-info #size_selector > .swatch-label').on('click', function (e) {
            e.preventDefault();
            var s = $(this).data('value');
            'l' == s
                ? ($('.product-info .swatch-l').addClass('selected'),
                  $('.product_selector_1').attr('src', 'assets/images/product_single/product_single_2.jpg'))
                : $('.product-info .swatch-l').removeClass('selected'),
                'm' == s
                    ? ($('.product-info .swatch-m').addClass('selected'),
                      $('.product_selector_1').attr('src', 'assets/images/product_single/product_single_3.jpg'))
                    : $('.product-info .swatch-m').removeClass('selected'),
                's' == s
                    ? ($('.product-info .swatch-s').addClass('selected'),
                      $('.product_selector_1').attr('src', 'assets/images/product_single/product_single_4.jpg'))
                    : $('.product-info .swatch-s').removeClass('selected'),
                'xl' == s
                    ? ($('.product-info .swatch-xl').addClass('selected'),
                      $('product_selector_1').attr('src', 'assets/images/product_single/product_single_5.jpg'))
                    : $('.product-info .swatch-xl').removeClass('selected'),
                'xxl' == s
                    ? ($('.product-info .swatch-xxl').addClass('selected'),
                      $('product_selector_1').attr('src', 'assets/images/product_single/product_single_6.jpg'))
                    : $('.product-info .swatch-xxl').removeClass('selected'),
                console.log(s);
        });
});
