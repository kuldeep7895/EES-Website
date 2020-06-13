// $(function() {
// 	 $('#images').carouFredSel({
// 	 	items: 1,
// 		direction: 'up',
// 		auto: {
// 			duration: 750,
// 			timeoutDuration: 2000,
// 			easing: 'quadratic',
// 			onBefore: function() {
// 				var index = $(this).triggerHandler( 'currentPosition' );
// 				if ( index == 0 ) {
// 					index = $(this).children().length;
// 				}
// 				$('#texts').trigger('slideTo', [ index, {
// 					fx: 'directscroll'
// 				}, 'prev' ]);
// 			}
// 		}
// 	 });
// 	 $('#texts').carouFredSel({
// 		items: 1,
// 		direction: 'up',
// 		auto: {
// 			play: false,
// 			duration: 750,
// 			easing: 'quadratic'
// 		}
// 	 });
// });

// (function ($) {
//     if ($.fn.carouFredSel) {
//         return;
//     }

//     $.fn.carouFredSel = $.fn.caroufredsel = function(options, configs) {
//         return this.each(function() {
//             new CarouFredSel(this, options, configs);
//         });
//     };

//     //
//     // Our constructor
//     //

//     function CarouFredSel(el, options, configs) {
//         var starting_position,
//             start_arr,
//             a, l,
//             s,
//             siz,
//             itm;

//         this.$cfs = $(el);
//         this.$tt0 = el;

//         if (this.$cfs.data('cfs_isCarousel')) {
//             starting_position = this.$cfs.triggerHandler('_cfs_currentPosition');
//             this.$cfs.trigger('_cfs_destroy', true);
//         } else {
//             starting_position = false;
//         }

//         //    START

//         this.crsl = {
//             'direction'        : 'next',
//             'isPaused'        : true,
//             'isScrolling'    : false,
//             'isStopped'        : false,

//             'mousewheelNext': false,
//             'mousewheelPrev': false,
//             'touchwipe'        : false
//         };
//         this.itms = {
//             'total'            : this.$cfs.children().length,
//             'first'            : 0
//         };
//         this.tmrs = {
//             'timer'            : null,
//             'auto'            : null,
//             'queue'            : null,
//             'startTime'        : CarouFredSel.getTime(),
//             'timePassed'    : 0
//         };
//         this.scrl = {
//             'isStopped'        : false,
//             'duration'        : 0,
//             'startTime'        : 0,
//             'easing'        : '',
//             'anims'            : []
//         };
//         this.clbk = {
//             'onBefore'        : [],
//             'onAfter'        : []
//         };
//         this.queu = [];
//         this.conf = $.extend(true, {}, CarouFredSel.configs, configs);
//         this.opts = {};
//         this.opts_orig = options;
//         this.$wrp = this.$cfs.wrap('<'+this.conf.wrapper.element+' class="'+this.conf.wrapper.classname+'" />').parent();

//         this.conf.selector        = this.$cfs.selector;
//         this.conf.serialNumber    = CarouFredSel.serialNumber++;

//         //    create carousel
//         this._cfs_init(this.opts_orig, true, starting_position);
//         this._cfs_build();
//         this._cfs_bind_events();
//         this._cfs_bind_buttons();

//         //    find item to start
//         if ($.isArray(this.opts.items.start)) {
//             start_arr = this.opts.items.start;
//         } else {
//             start_arr = [];
//             if (this.opts.items.start != 0) {
//                 start_arr.push(this.opts.items.start);
//             }
//         }
//         if (this.opts.cookie) {
//             start_arr.unshift(CarouFredSel.cf_readCookie(this.opts.cookie));
//         }
//         if (start_arr.length > 0) {
//             for (a = 0, l = start_arr.length; a < l; a++) {
//                 s = start_arr[a];
//                 if (s == 0) {
//                     continue;
//                 }
//                 if (s === true) {
//                     s = window.location.hash;
//                     if (s.length < 1) {
//                         continue;
//                     }
//                 } else if (s === 'random') {
//                     s = Math.floor(Math.random()*this.itms.total);
//                 }
//                 if (this.$cfs.triggerHandler(CarouFredSel.cf_e('slideTo', this.conf), [s, 0, true, { fx: 'none' }])) {
//                     break;
//                 }
//             }
//         }
//         siz = CarouFredSel.sz_setSizes(this.$cfs, this.opts, false);
//         itm = CarouFredSel.gi_getCurrentItems(this.$cfs.children(), this.opts);

//         if (this.opts.onCreate) {
//             this.opts.onCreate.call(this.$tt0, itm, siz);
//         }

//         this.$cfs.trigger(CarouFredSel.cf_e('updatePageStatus', this.conf), [true, siz]);
//         this.$cfs.trigger(CarouFredSel.cf_e('linkAnchors', this.conf));
//     }

//     //
//     // Prototype
//     //

//     CarouFredSel.prototype = {
//         _cfs_init: function(o, setOrig, start) {
//             o = CarouFredSel.go_getObject(this.$tt0, o);

//             //    DEPRECATED
//             if (o.debug) {
//                 this.conf.debug = o.debug;
//                 debug(this.conf, 'The "debug" option should be moved to the second configuration-object.');
//             }
//             //    /DEPRECATED

//             var obs = ['items', 'scroll', 'auto', 'prev', 'next', 'pagination'];
//             for (var a = 0, l = obs.length; a < l; a++) {
//                 o[obs[a]] = CarouFredSel.go_getObject(this.$tt0, o[obs[a]]);
//             }

//             if (typeof o.scroll == 'number') {
//                 if (o.scroll <= 50)                    o.scroll    = { 'items'        : o.scroll     };
//                 else                                o.scroll    = { 'duration'    : o.scroll     };
//             } else {
//                 if (typeof o.scroll == 'string')    o.scroll    = { 'easing'    : o.scroll     };
//             }

//                  if (typeof o.items == 'number')    o.items        = { 'visible'    : o.items     };
//             else if (        o.items == 'variable')    o.items        = { 'visible'    : o.items,
//                                                                     'width'        : o.items,
//                                                                     'height'    : o.items    };

//             if (typeof o.items != 'object') o.items = {};
//             if (setOrig) this.opts_orig = $.extend(true, {}, CarouFredSel.defaults, o);

//             this.opts = $.extend(true, {}, CarouFredSel.defaults, o);

//             if (typeof this.opts.items.visibleConf != 'object') this.opts.items.visibleConf = {};

//             if (this.opts.items.start == 0 && typeof start == 'number') {
//                 this.opts.items.start = start;
//             }

//             this.crsl.upDateOnWindowResize = (this.opts.responsive);
//             this.crsl.direction = (this.opts.direction == 'up' || this.opts.direction == 'left') ? 'next' : 'prev';

//             var dims = [
//                 ['width'    , 'innerWidth'    , 'outerWidth'    , 'height'    , 'innerHeight'    , 'outerHeight'    , 'left', 'top'    , 'marginRight'    , 0, 1, 2, 3],
//                 ['height'    , 'innerHeight'    , 'outerHeight'    , 'width'    , 'innerWidth'    , 'outerWidth'    , 'top'    , 'left', 'marginBottom', 3, 2, 1, 0]
//             ];

//             var dn = dims[0].length,
//                 dx = (this.opts.direction == 'right' || this.opts.direction == 'left') ? 0 : 1;

//             this.opts.d = {};
//             for (var d = 0; d < dn; d++) {
//                 this.opts.d[dims[0][d]] = dims[dx][d];
//             }

//             var    all_itm = this.$cfs.children();

//             //    check visible items
//             switch (typeof this.opts.items.visible) {

//                 //    min and max visible items
//                 case 'object':
//                     this.opts.items.visibleConf.min = this.opts.items.visible.min;
//                     this.opts.items.visibleConf.max = this.opts.items.visible.max;
//                     this.opts.items.visible = false;
//                     break;

//                 case 'string':
//                     //    variable visible items
//                     if (this.opts.items.visible == 'variable') {
//                         this.opts.items.visibleConf.variable = true;

//                     //    adjust string visible items
//                     } else {
//                         this.opts.items.visibleConf.adjust = this.opts.items.visible;
//                     }
//                     this.opts.items.visible = false;
//                     break;

//                 // function visible items
//                 case 'function':
//                     this.opts.items.visibleConf.adjust = this.opts.items.visible;
//                     this.opts.items.visible = false;
//                     break;
//             }

//             //    set items filter
//             if (typeof this.opts.items.filter == 'undefined') {
//                 this.opts.items.filter = (all_itm.filter(':hidden').length > 0) ? ':visible' : '*';
//             }

//             //    primary size set to auto -> measure largest size and set it
//             if (this.opts[this.opts.d['width']] == 'auto') {
//                 this.opts[this.opts.d['width']] = CarouFredSel.ms_getTrueLargestSize(all_itm, this.opts, 'outerWidth');
//             }
//             //    primary size percentage
//             if (CarouFredSel.ms_isPercentage(this.opts[this.opts.d['width']]) && !this.opts.responsive) {
//                 this.opts[this.opts.d['width']] = CarouFredSel.ms_getPercentage(CarouFredSel.ms_getTrueInnerSize(this.$wrp.parent(), this.opts, 'innerWidth'), this.opts[this.opts.d['width']]);
//                 this.crsl.upDateOnWindowResize = true;
//             }

//             //    secondary size set to auto -> measure largest size and set it
//             if (this.opts[this.opts.d['height']] == 'auto') {
//                 this.opts[this.opts.d['height']] = CarouFredSel.ms_getTrueLargestSize(all_itm, this.opts, 'outerHeight');
//             }

//             //    primary item-size not set
//             if (!this.opts.items[this.opts.d['width']]) {
//                 //    responsive carousel -> set to largest
//                 if (this.opts.responsive) {
//                     debug(true, 'Set a '+this.opts.d['width']+' for the items!');
//                     this.opts.items[this.opts.d['width']] = CarouFredSel.ms_getTrueLargestSize(all_itm, this.opts, 'outerWidth');
//                                 //     non-responsive -> measure it or set to "variable"
//                 } else {
//                                 this.opts.items[this.opts.d['width']] = (CarouFredSel.ms_hasVariableSizes(all_itm, this.opts, 'outerWidth'))
//                                     ? 'variable'
//                                     : all_itm[this.opts.d['outerWidth']](true);
//                 }
//             }

//             //    secondary item-size not set -> measure it or set to "variable"
//             if (!this.opts.items[this.opts.d['height']]) {
//                 this.opts.items[this.opts.d['height']] = (CarouFredSel.ms_hasVariableSizes(all_itm, this.opts, 'outerHeight'))
//                     ? 'variable'
//                     : all_itm[this.opts.d['outerHeight']](true);
//             }

//             //    secondary size not set -> set to secondary item-size
//             if (!this.opts[this.opts.d['height']]) {
//                 this.opts[this.opts.d['height']] = this.opts.items[this.opts.d['height']];
//             }

//             //    visible-items not set
//             if (!this.opts.items.visible && !this.opts.responsive) {
//                 //    primary item-size variable -> set visible items variable
//                 if (this.opts.items[this.opts.d['width']] == 'variable') {
//                     this.opts.items.visibleConf.variable = true;
//                 }
//                 if (!this.opts.items.visibleConf.variable) {
//                     //    primary size is number -> calculate visible-items
//                     if (typeof this.opts[this.opts.d['width']] == 'number') {
//                         this.opts.items.visible = Math.floor(this.opts[this.opts.d['width']] / this.opts.items[this.opts.d['width']]);
//                     } else {
//                         //    measure and calculate primary size and visible-items
//                         var maxS = CarouFredSel.ms_getTrueInnerSize(this.$wrp.parent(), this.opts, 'innerWidth');
//                         this.opts.items.visible = Math.floor(maxS / this.opts.items[this.opts.d['width']]);
//                         this.opts[this.opts.d['width']] = this.opts.items.visible * this.opts.items[this.opts.d['width']];
//                         if (!this.opts.items.visibleConf.adjust) this.opts.align = false;
//                     }
//                     if (this.opts.items.visible == 'Infinity' || this.opts.items.visible < 1) {
//                         debug(true, 'Not a valid number of visible items: Set to "variable".');
//                         this.opts.items.visibleConf.variable = true;
//                     }
//                 }
//             }

//             //    primary size not set -> calculate it or set to "variable"
//             if (!this.opts[this.opts.d['width']]) {
//                 this.opts[this.opts.d['width']] = 'variable';
//                 if (!this.opts.responsive && this.opts.items.filter == '*' && !this.opts.items.visibleConf.variable && this.opts.items[this.opts.d['width']] != 'variable') {
//                     this.opts[this.opts.d['width']] = this.opts.items.visible * this.opts.items[this.opts.d['width']];
//                     this.opts.align = false;
//                 }
//             }

//             //    variable primary item-sizes with variabe visible-items
//             if (this.opts.items.visibleConf.variable) {
//                 this.opts.maxDimention = (this.opts[this.opts.d['width']] == 'variable')
//                     ? CarouFredSel.ms_getTrueInnerSize(this.$wrp.parent(), this.opts, 'innerWidth')
//                     : this.opts[this.opts.d['width']];
//                 if (this.opts.align === false) {
//                     this.opts[this.opts.d['width']] = 'variable';
//                 }
//                 this.opts.items.visible = CarouFredSel.gn_getVisibleItemsNext(all_itm, this.opts, 0);

//             //    set visible items by filter
//             } else if (this.opts.items.filter != '*') {
//                 this.opts.items.visibleConf.org = this.opts.items.visible;
//                 this.opts.items.visible = CarouFredSel.gn_getVisibleItemsNextFilter(all_itm, this.opts, 0);
//             }

//             //    align not set -> set to center if primary size is number
//             if (typeof this.opts.align == 'undefined') {
//                 this.opts.align = (this.opts[this.opts.d['width']] == 'variable')
//                     ? false
//                     : 'center';
//             }

//             this.opts.items.visible = CarouFredSel.cf_getItemsAdjust(this.opts.items.visible, this.opts, this.opts.items.visibleConf.adjust, this.$tt0);
//             this.opts.items.visibleConf.old = this.opts.items.visible;
//             this.opts.usePadding = false;

//             if (this.opts.responsive) {

//                 if (!this.opts.items.visibleConf.min) this.opts.items.visibleConf.min = this.opts.items.visible;
//                 if (!this.opts.items.visibleConf.max) this.opts.items.visibleConf.max = this.opts.items.visible;

//                 this.opts.align = false;
//                 this.opts.padding = [0, 0, 0, 0];

//                 var isVisible = this.$wrp.is(':visible');
//                 if (isVisible) this.$wrp.hide();
//                 var fullS = CarouFredSel.ms_getPercentage(CarouFredSel.ms_getTrueInnerSize(this.$wrp.parent(), this.opts, 'innerWidth'), this.opts[this.opts.d['width']]);

//                 if (typeof this.opts[this.opts.d['width']] == 'number' && fullS < this.opts[this.opts.d['width']]) {
//                     fullS = this.opts[this.opts.d['width']];
//                 }
//                 if (isVisible) this.$wrp.show();

//                 var visb = CarouFredSel.cf_getItemAdjustMinMax(Math.ceil(fullS / this.opts.items[this.opts.d['width']]), this.opts.items.visibleConf);
//                 if (visb > all_itm.length) {
//                     visb = all_itm.length;
//                 }

//                 var newS = Math.floor(fullS/visb),
//                     seco = this.opts[this.opts.d['height']],
//                     secp = CarouFredSel.ms_isPercentage(seco);

//                 all_itm.each($.proxy(function(i, el) {
//                     var $t = $(el),
//                         nw = newS - CarouFredSel.ms_getPaddingBorderMargin($t, this.opts, 'Width');

//                     $t[this.opts.d['width']](nw);
//                     if (secp) {
//                         $t[this.opts.d['height']](CarouFredSel.ms_getPercentage(nw, seco));
//                     }
//                 }, this));

//                 this.opts.items.visible = visb;
//                 this.opts.items[this.opts.d['width']] = newS;
//                 this.opts[this.opts.d['width']] = visb * newS;

//             } else {

//             this.opts.padding = CarouFredSel.cf_getPadding(this.opts.padding);

//             if (this.opts.align == 'top')         this.opts.align = 'left';
//             if (this.opts.align == 'bottom')     this.opts.align = 'right';

//             switch (this.opts.align) {
//                 //    align: center, left or right
//                 case 'center':
//                 case 'left':
//                 case 'right':
//                     if (this.opts[this.opts.d['width']] != 'variable') {
//                         var p = CarouFredSel.cf_getAlignPadding(CarouFredSel.gi_getCurrentItems(all_itm, this.opts), this.opts);
//                         this.opts.usePadding = true;
//                         this.opts.padding[this.opts.d[1]] = p[1];
//                         this.opts.padding[this.opts.d[3]] = p[0];
//                     }
//                     break;

//                 //    padding
//                 default:
//                     this.opts.align = false;
//                     this.opts.usePadding = (
//                         this.opts.padding[0] == 0 &&
//                         this.opts.padding[1] == 0 &&
//                         this.opts.padding[2] == 0 &&
//                         this.opts.padding[3] == 0
//                     ) ? false : true;
//                     break;
//             }
// }

//             if (typeof this.opts.cookie == 'boolean' && this.opts.cookie)            this.opts.cookie                     = 'caroufredsel_cookie_'+this.$cfs.attr('id');
//             if (typeof this.opts.items.minimum                != 'number')    this.opts.items.minimum                = this.opts.items.visible;
//             if (typeof this.opts.scroll.duration                != 'number')    this.opts.scroll.duration            = 500;
//             if (typeof this.opts.scroll.items                == 'undefined') this.opts.scroll.items                 = (this.opts.items.visibleConf.variable || this.opts.items.filter != '*') ? 'visible' : this.opts.items.visible;

//             this.opts.auto        = CarouFredSel.go_getNaviObject(this.$tt0, this.opts.auto, 'auto');
//             this.opts.prev        = CarouFredSel.go_getNaviObject(this.$tt0, this.opts.prev);
//             this.opts.next        = CarouFredSel.go_getNaviObject(this.$tt0, this.opts.next);
//             this.opts.pagination    = CarouFredSel.go_getNaviObject(this.$tt0, this.opts.pagination, 'pagination');

//             this.opts.auto        = $.extend(true, {}, this.opts.scroll, this.opts.auto);
//             this.opts.prev        = $.extend(true, {}, this.opts.scroll, this.opts.prev);
//             this.opts.next        = $.extend(true, {}, this.opts.scroll, this.opts.next);
//             this.opts.pagination    = $.extend(true, {}, this.opts.scroll, this.opts.pagination);

//             if (typeof this.opts.pagination.keys                != 'boolean')    this.opts.pagination.keys             = false;
//             if (typeof this.opts.pagination.anchorBuilder    != 'function'
//                     && this.opts.pagination.anchorBuilder    !== false)        this.opts.pagination.anchorBuilder    = CarouFredSel.pageAnchorBuilder;
//             if (typeof this.opts.auto.play                    != 'boolean')    this.opts.auto.play                    = true;
//             if (typeof this.opts.auto.delay                    != 'number')    this.opts.auto.delay                    = 0;
//             if (typeof this.opts.auto.pauseOnEvent             == 'undefined')    this.opts.auto.pauseOnEvent            = true;
//             if (typeof this.opts.auto.pauseOnResize             != 'boolean')    this.opts.auto.pauseOnResize            = true;
//             if (typeof this.opts.auto.pauseDuration            != 'number')    this.opts.auto.pauseDuration            = (this.opts.auto.duration < 10) ? 2500 : this.opts.auto.duration * 5;

//             if (this.opts.synchronise) {
//                 this.opts.synchronise = CarouFredSel.cf_getSynchArr(this.opts.synchronise);
//             }
//             if (this.conf.debug) {
//                 debug(this.conf, 'Carousel width: '+this.opts.width);
//                 debug(this.conf, 'Carousel height: '+this.opts.height);
//                 if (this.opts.maxDimention)    debug(this.conf, 'Available '+this.opts.d['width']+': '+this.opts.maxDimention);
//                 debug(this.conf, 'Item widths: '+this.opts.items.width);
//                 debug(this.conf, 'Item heights: '+this.opts.items.height);
//                 debug(this.conf, 'Number of items visible: '+this.opts.items.visible);
//                 if (this.opts.auto.play)        debug(this.conf, 'Number of items scrolled automatically: '+this.opts.auto.items);
//                 if (this.opts.prev.button)    debug(this.conf, 'Number of items scrolled backward: '+this.opts.prev.items);
//                 if (this.opts.next.button)    debug(this.conf, 'Number of items scrolled forward: '+this.opts.next.items);
//             }
//         },    //    /init
//         _cfs_build: function() {
//             this.$cfs.data('cfs_isCarousel', true);

//             var orgCSS = {
//                 'textAlign'        : this.$cfs.css('textAlign'),
//                 'float'            : this.$cfs.css('float'),
//                 'position'        : this.$cfs.css('position'),
//                 'top'            : this.$cfs.css('top'),
//                 'right'            : this.$cfs.css('right'),
//                 'bottom'        : this.$cfs.css('bottom'),
//                 'left'            : this.$cfs.css('left'),
//                 'width'            : this.$cfs.css('width'),
//                 'height'        : this.$cfs.css('height'),
//                 'marginTop'        : this.$cfs.css('marginTop'),
//                 'marginRight'    : this.$cfs.css('marginRight'),
//                 'marginBottom'    : this.$cfs.css('marginBottom'),
//                 'marginLeft'    : this.$cfs.css('marginLeft')
//             };

//             switch (orgCSS.position) {
//                 case 'absolute':
//                     var newPosition = 'absolute';
//                     break;
//                 case 'fixed':
//                     var newPosition = 'fixed';
//                     break;
//                 default:
//                     var newPosition = 'relative';
//             }

//             this.$wrp.css(orgCSS).css({
//                 'overflow'        : 'hidden',
//                 'position'        : newPosition
//             });

//             this.$cfs.data('cfs_origCss', orgCSS).css({
//                 'textAlign'        : 'left',
//                 'float'            : 'none',
//                 'position'        : 'absolute',
//                 'top'            : 0,
//                 'left'            : 0,
//                 'marginTop'        : 0,
//                 'marginRight'    : 0,
//                 'marginBottom'    : 0,
//                 'marginLeft'    : 0
//             });

//             if (this.opts.usePadding) {
//                 this.$cfs.children().each($.proxy(function(i, el) {
//                     var m = parseInt($(el).css(this.opts.d['marginRight']));
//                     if (isNaN(m)) m = 0;
//                     $(el).data('cfs_origCssMargin', m);
//                 }, this));
//             }

//         },    //    /build
//         _cfs_bind_events: function() {
//             this._cfs_unbind_events();

//             //    stop event
//             this.$cfs.bind(CarouFredSel.cf_e('stop', this.conf), $.proxy(function(e, imm) {
//                 e.stopPropagation();

//                 //    button
//                 if (!this.crsl.isStopped) {
//                     if (this.opts.auto.button) {
//                         this.opts.auto.button.addClass(CarouFredSel.cf_c('stopped', this.conf));
//                     }
//                 }

//                 //    set stopped
//                 this.crsl.isStopped = true;

//                 if (this.opts.auto.play) {
//                     this.opts.auto.play = false;
//                     this.$cfs.trigger(CarouFredSel.cf_e('pause', this.conf), imm);
//                 }
//                 return true;
//             }, this));

//             //    finish event
//             this.$cfs.bind(CarouFredSel.cf_e('finish', this.conf), $.proxy(function(e) {
//                 e.stopPropagation();
//                 if (this.crsl.isScrolling) {
//                     CarouFredSel.sc_stopScroll(this.scrl);
//                 }
//                 return true;
//             }, this));

//             //    pause event
//             this.$cfs.bind(CarouFredSel.cf_e('pause', this.conf), $.proxy(function(e, imm, res) {
//                 e.stopPropagation();
//                 this.tmrs = CarouFredSel.sc_clearTimers(this.tmrs);

//                 //    immediately pause
//                 if (imm && this.crsl.isScrolling) {
//                     this.scrl.isStopped = true;
//                     var nst = CarouFredSel.getTime() - this.scrl.startTime;
//                     this.scrl.duration -= nst;
//                     if (this.scrl.pre) this.scrl.pre.duration -= nst;
//                     if (this.scrl.post) this.scrl.post.duration -= nst;
//                     CarouFredSel.sc_stopScroll(this.scrl, false);
//                 }

//                 //    update remaining pause-time
//                 if (!this.crsl.isPaused && !this.crsl.isScrolling) {
//                     if (res) this.tmrs.timePassed += CarouFredSel.getTime() - this.tmrs.startTime;
//                 }

//                 //    button
//                 if (!this.crsl.isPaused) {
//                     if (this.opts.auto.button) {
//                         this.opts.auto.button.addClass(CarouFredSel.cf_c('paused', this.conf));
//                     }
//                 }

//                 //    set paused
//                 this.crsl.isPaused = true;

//                 //    pause pause callback
//                 if (this.opts.auto.onPausePause) {
//                     var dur1 = this.opts.auto.pauseDuration - this.tmrs.timePassed,
//                         perc = 100 - Math.ceil( dur1 * 100 / this.opts.auto.pauseDuration );
//                     this.opts.auto.onPausePause.call(this.$tt0, perc, dur1);
//                 }
//                 return true;
//             }, this));

//             //    play event
//             this.$cfs.bind(CarouFredSel.cf_e('play', this.conf), $.proxy(function(e, dir, del, res) {
//                 e.stopPropagation();
//                 this.tmrs = CarouFredSel.sc_clearTimers(this.tmrs);

//                 //    sort params
//                 var v = [dir, del, res],
//                     t = ['string', 'number', 'boolean'],
//                     a = CarouFredSel.cf_sortParams(v, t);

//                 var dir = a[0],
//                     del = a[1],
//                     res = a[2];

//                 if (dir != 'prev' && dir != 'next') dir = this.crsl.direction;
//                 if (typeof del != 'number')         del = 0;
//                 if (typeof res != 'boolean')         res = false;

//                 //    stopped?
//                 if (res) {
//                     this.crsl.isStopped = false;
//                     this.opts.auto.play = true;
//                 }
//                 if (!this.opts.auto.play) {
//                     e.stopImmediatePropagation();
//                     return debug(this.conf, 'Carousel stopped: Not scrolling.');
//                 }

//                 //    button
//                 if (this.crsl.isPaused) {
//                     if (this.opts.auto.button) {
//                         this.opts.auto.button.removeClass(CarouFredSel.cf_c('stopped', this.conf));
//                         this.opts.auto.button.removeClass(CarouFredSel.cf_c('paused', this.conf));
//                     }
//                 }

//                 //    set playing
//                 this.crsl.isPaused = false;
//                 this.tmrs.startTime = CarouFredSel.getTime();

//                 //    timeout the scrolling
//                 var dur1 = this.opts.auto.pauseDuration + del;
//                     dur2 = dur1 - this.tmrs.timePassed;
//                     perc = 100 - Math.ceil(dur2 * 100 / dur1);

//                 this.tmrs.auto = setTimeout($.proxy(function() {
//                     if (this.opts.auto.onPauseEnd) {
//                         this.opts.auto.onPauseEnd.call(this.$tt0, perc, dur2);
//                     }
//                     if (this.crsl.isScrolling) {
//                         this.$cfs.trigger(CarouFredSel.cf_e('play', this.conf), dir);
//                     } else {
//                         this.$cfs.trigger(CarouFredSel.cf_e(dir, this.conf), this.opts.auto);
//                     }
//                 }, this), dur2);

//                 //    pause start callback
//                 if (this.opts.auto.onPauseStart) {
//                     this.opts.auto.onPauseStart.call(this.$tt0, perc, dur2);
//                 }

//                 return true;
//             }, this));

//             //    resume event
//             this.$cfs.bind(CarouFredSel.cf_e('resume', this.conf), $.proxy(function(e) {
//                 e.stopPropagation();
//                 if (this.scrl.isStopped) {
//                     this.scrl.isStopped = false;
//                     this.crsl.isPaused = false;
//                     this.crsl.isScrolling = true;
//                     this.scrl.startTime = CarouFredSel.getTime();
//                     CarouFredSel.sc_startScroll(this.scrl);
//                 } else {
//                     this.$cfs.trigger(CarouFredSel.cf_e('play', this.conf));
//                 }
//                 return true;
//             }, this));

//             //    prev + next events
//             this.$cfs.bind(CarouFredSel.cf_e('prev', this.conf)+' '+CarouFredSel.cf_e('next', this.conf), $.proxy(function(e, obj, num, clb) {
//                 e.stopPropagation();

//                 //    stopped or hidden carousel, don't scroll, don't queue
//                 if (this.crsl.isStopped || this.$cfs.is(':hidden')) {
//                     e.stopImmediatePropagation();
//                     return debug(this.conf, 'Carousel stopped or hidden: Not scrolling.');
//                 }

//                 //    not enough items
//                 if (this.opts.items.minimum >= this.itms.total) {
//                     e.stopImmediatePropagation();
//                     return debug(this.conf, 'Not enough items ('+this.itms.total+', '+this.opts.items.minimum+' needed): Not scrolling.');
//                 }

//                 //    get config
//                 var v = [obj, num, clb],
//                     t = ['object', 'number/string', 'function'],
//                     a = CarouFredSel.cf_sortParams(v, t);

//                 var obj = a[0],
//                     num = a[1],
//                     clb = a[2];

//                 var eType = e.type.substr(this.conf.events.prefix.length);

//                 if (typeof obj != 'object' || obj == null)    obj = this.opts[eType];
//                 if (typeof clb == 'function')                obj.onAfter = clb;

//                 if (typeof num != 'number') {
//                     if (this.opts.items.filter != '*') {
//                         num = 'visible';
//                     } else {
//                         var arr = [num, obj.items, this.opts[eType].items];
//                         for (var a = 0, l = arr.length; a < l; a++) {
//                             if (typeof arr[a] == 'number' || arr[a] == 'page' || arr[a] == 'visible') {
//                                 num = arr[a];
//                                 break;
//                             }
//                         }
//                     }
//                     switch(num) {
//                         case 'page':
//                             e.stopImmediatePropagation();
//                             return this.$cfs.triggerHandler(eType+'Page', [obj, clb]);
//                             break;

//                         case 'visible':
//                             if (!this.opts.items.visibleConf.variable && this.opts.items.filter == '*') {
//                                 num = this.opts.items.visible;
//                             }
//                             break;
//                     }
//                 }

//                 //    resume animation, add current to queue
//                 if (this.scrl.isStopped) {
//                     this.$cfs.trigger(CarouFredSel.cf_e('resume', this.conf));
//                     this.$cfs.trigger(CarouFredSel.cf_e('queue', this.conf), [eType, [obj, num, clb]]);
//                     e.stopImmediatePropagation();
//                     return debug(this.conf, 'Carousel resumed scrolling.');
//                 }

//                 //    queue if scrolling
//                 if (obj.duration > 0) {
//                     if (this.crsl.isScrolling) {
//                         if (obj.queue) this.$cfs.trigger(CarouFredSel.cf_e('queue', this.conf), [eType, [obj, num, clb]]);
//                         e.stopImmediatePropagation();
//                         return debug(this.conf, 'Carousel currently scrolling.');
//                     }
//                 }

//                 //    test conditions callback
//                 if (obj.conditions && !obj.conditions.call(this.$tt0)) {
//                     e.stopImmediatePropagation();
//                     return debug(this.conf, 'Callback "conditions" returned false.');
//                 }

//                 this.tmrs.timePassed = 0;
//                 this.$cfs.trigger('_cfs_slide_'+eType, [obj, num]);

//                 //    synchronise
//                 if (this.opts.synchronise) {
//                     var s = this.opts.synchronise,
//                         c = [obj, num];
//                     for (var j = 0, l = s.length; j < l; j++) {
//                         var d = eType;
//                         if (!s[j][1]) c[0] = s[j][0].triggerHandler('_cfs_configuration', eType);
//                         if (!s[j][2]) d = (d == 'prev') ? 'next' : 'prev';
//                         c[1] = num + s[j][3];
//                         s[j][0].trigger('_cfs_slide_'+d, c);
//                     }
//                 }
//                 return true;
//             }, this));

//             //    prev event, accessible from outside
//             this.$cfs.bind(CarouFredSel.cf_e('_cfs_slide_prev', this.conf, false), $.proxy(function(e, sO, nI) {
//                 e.stopPropagation();
//                 var a_itm = this.$cfs.children();

//                 //    non-circular at start, scroll to end
//                 if (!this.opts.circular) {
//                     if (this.itms.first == 0) {
//                         if (this.opts.infinite) {
//                             this.$cfs.trigger(CarouFredSel.cf_e('next', this.conf), this.itms.total-1);
//                         }
//                         return e.stopImmediatePropagation();
//                     }
//                 }

//                 if (this.opts.usePadding) CarouFredSel.sz_resetMargin(a_itm, this.opts);

//                 //    find number of items to scroll
//                 if (typeof nI != 'number') {
//                     if (this.opts.items.visibleConf.variable) {
//                         nI = CarouFredSel.gn_getVisibleItemsPrev(a_itm, this.opts, this.itms.total-1);
//                     } else if (this.opts.items.filter != '*') {
//                         var xI = (typeof sO.items == 'number') ? sO.items : CarouFredSel.gn_getVisibleOrg(this.$cfs, this.opts);
//                         nI = CarouFredSel.gn_getScrollItemsPrevFilter(a_itm, this.opts, this.itms.total-1, xI);
//                     } else {
//                         nI = this.opts.items.visible;
//                     }
//                     nI = CarouFredSel.cf_getAdjust(nI, this.opts, sO.items, this.$tt0);
//                 }

//                 //    prevent non-circular from scrolling to far
//                 if (!this.opts.circular) {
//                     if (this.itms.total - nI < this.itms.first) {
//                         nI = this.itms.total - this.itms.first;
//                     }
//                 }

//                 //    set new number of visible items
//                 this.opts.items.visibleConf.old = this.opts.items.visible;
//                 if (this.opts.items.visibleConf.variable) {
//                     var vI = CarouFredSel.gn_getVisibleItemsNext(a_itm, this.opts, this.itms.total-nI);
//                     if (this.opts.items.visible+nI <= vI && nI < this.itms.total) {
//                         nI++;
//                         vI = CarouFredSel.gn_getVisibleItemsNext(a_itm, this.opts, this.itms.total-nI);
//                     }
//                     this.opts.items.visible = CarouFredSel.cf_getItemsAdjust(vI, this.opts, this.opts.items.visibleConf.adjust, this.$tt0);
//                 } else if (this.opts.items.filter != '*') {
//                     var vI = CarouFredSel.gn_getVisibleItemsNextFilter(a_itm, this.opts, this.itms.total-nI);
//                     this.opts.items.visible = CarouFredSel.cf_getItemsAdjust(vI, this.opts, this.opts.items.visibleConf.adjust, this.$tt0);
//                 }

//                 if (this.opts.usePadding) CarouFredSel.sz_resetMargin(a_itm, this.opts, true);

//                 //    scroll 0, don't scroll
//                 if (nI == 0) {
//                     e.stopImmediatePropagation();
//                     return debug(this.conf, '0 items to scroll: Not scrolling.');
//                 }
//                 debug(this.conf, 'Scrolling '+nI+' items backward.');

//                 //    save new config
//                 this.itms.first += nI;
//                 while (this.itms.first >= this.itms.total) {
//                     this.itms.first -= this.itms.total;
//                 }

//                 //    non-circular callback
//                 if (!this.opts.circular) {
//                     if (this.itms.first == 0 && sO.onEnd) sO.onEnd.call(this.$tt0);
//                     if (!this.opts.infinite) CarouFredSel.nv_enableNavi(this.opts, this.itms.first, this.conf);
//                 }

//                 //    rearrange items
//                 this.$cfs.children().slice(this.itms.total-nI, this.itms.total).prependTo(this.$cfs);
//                 if (this.itms.total < this.opts.items.visible + nI) {
//                     this.$cfs.children().slice(0, (this.opts.items.visible+nI)-this.itms.total).clone(true).appendTo(this.$cfs);
//                 }

//                 //    the needed items
//                 var a_itm = this.$cfs.children(),
//                     c_old = CarouFredSel.gi_getOldItemsPrev(a_itm, this.opts, nI),
//                     c_new = CarouFredSel.gi_getNewItemsPrev(a_itm, this.opts),
//                     l_cur = a_itm.eq(nI-1),
//                     l_old = c_old.last(),
//                     l_new = c_new.last();

//                 if (this.opts.usePadding) CarouFredSel.sz_resetMargin(a_itm, this.opts);
//                 if (this.opts.align) {
//                     var p = CarouFredSel.cf_getAlignPadding(c_new, this.opts),
//                         pL = p[0],
//                         pR = p[1];
//                 } else {
//                     var pL = 0,
//                         pR = 0;
//                 }
//                 var oL = (pL < 0) ? this.opts.padding[this.opts.d[3]] : 0;

//                 //    hide items for fx directscroll
//                 if (sO.fx == 'directscroll' && this.opts.items.visible < nI) {
//                     var hiddenitems = a_itm.slice(this.opts.items.visibleConf.old, nI),
//                         orgW = this.opts.items[this.opts.d['width']];
//                     hiddenitems.each($.proxy(function(i, el) {
//                         var hi = $(el);
//                         hi.data('isHidden', hi.is(':hidden')).hide();
//                     }, this));
//                     this.opts.items[this.opts.d['width']] = 'variable';
//                 } else {
//                     var hiddenitems = false;
//                 }

//                 //    save new sizes
//                 var i_siz = CarouFredSel.ms_getTotalSize(a_itm.slice(0, nI), this.opts, 'width'),
//                     w_siz = CarouFredSel.cf_mapWrapperSizes(CarouFredSel.ms_getSizes(c_new, this.opts, true), this.opts, !this.opts.usePadding);

//                 if (hiddenitems) this.opts.items[this.opts.d['width']] = orgW;

//                 if (this.opts.usePadding) {
//                     CarouFredSel.sz_resetMargin(a_itm, this.opts, true);
//                     if (pR >= 0) {
//                         CarouFredSel.sz_resetMargin(l_old, this.opts, this.opts.padding[this.opts.d[1]]);
//                     }
//                     CarouFredSel.sz_resetMargin(l_cur, this.opts, this.opts.padding[this.opts.d[3]]);
//                 }
//                 if (this.opts.align) {
//                     this.opts.padding[this.opts.d[1]] = pR;
//                     this.opts.padding[this.opts.d[3]] = pL;
//                 }

//                 //    animation configuration
//                 var a_cfs = {},
//                     a_dur = sO.duration;

//                      if (sO.fx == 'none')    a_dur = 0;
//                 else if (a_dur == 'auto')    a_dur = this.opts.scroll.duration / this.opts.scroll.items * nI;
//                 else if (a_dur <= 0)        a_dur = 0;
//                 else if (a_dur < 10)        a_dur = i_siz / a_dur;

//                 this.scrl = CarouFredSel.sc_setScroll(a_dur, sO.easing);

//                 //    animate wrapper
//                 if (this.opts[this.opts.d['width']] == 'variable' || this.opts[this.opts.d['height']] == 'variable') {
//                     this.scrl.anims.push([this.$wrp, w_siz]);
//                 }

//                 //    animate items
//                 if (this.opts.usePadding) {
//                     var new_m = this.opts.padding[this.opts.d[3]];

//                     if (l_new.not(l_cur).length) {
//                          var a_cur = {};
//                              a_cur[this.opts.d['marginRight']] = l_cur.data('cfs_origCssMargin');

//                         if (pL < 0) l_cur.css(a_cur);
//                         else         this.scrl.anims.push([l_cur, a_cur]);
//                     }

//                     if (l_new.not(l_old).length) {
//                         var a_old = {};
//                             a_old[this.opts.d['marginRight']] = l_old.data('cfs_origCssMargin');
//                         this.scrl.anims.push([l_old, a_old]);
//                     }

//                     if (pR >= 0) {
//                         var a_new = {};
//                             a_new[this.opts.d['marginRight']] = l_new.data('cfs_origCssMargin') + this.opts.padding[this.opts.d[1]];
//                         this.scrl.anims.push([l_new, a_new]);
//                     }
//                 } else {
//                     var new_m = 0;
//                 }

//                 //    animate carousel
//                 a_cfs[this.opts.d['left']] = new_m;

//                 //    onBefore callback
//                 var args = [c_old, c_new, w_siz, a_dur];
//                 if (sO.onBefore) sO.onBefore.apply(this.$tt0, args);
//                 this.clbk.onBefore = CarouFredSel.sc_callCallbacks(this.clbk.onBefore, this.$tt0, args);

//                 //    ALTERNATIVE EFFECTS

//                 //    extra animation arrays
//                 switch(sO.fx) {
//                     case 'fade':
//                     case 'crossfade':
//                     case 'cover':
//                     case 'uncover':
//                         this.scrl.pre = CarouFredSel.sc_setScroll(this.scrl.duration, this.scrl.easing);
//                         this.scrl.post = CarouFredSel.sc_setScroll(this.scrl.duration, this.scrl.easing);
//                         this.scrl.duration = 0;
//                         break;
//                 }

//                 //    create copy
//                 switch(sO.fx) {
//                     case 'crossfade':
//                     case 'cover':
//                     case 'uncover':
//                         var $cf2 = this.$cfs.clone().appendTo(this.$wrp);
//                         break;
//                 }
//                 switch(sO.fx) {
//                     case 'uncover':
//                         $cf2.children().slice(0, nI).remove();
//                     case 'crossfade':
//                     case 'cover':
//                         $cf2.children().slice(this.opts.items.visible).remove();
//                         break;
//                 }

//                 //    animations
//                 switch(sO.fx) {
//                     case 'fade':
//                         this.scrl.pre.anims.push([this.$cfs, { 'opacity': 0 }]);
//                         break;
//                     case 'crossfade':
//                         $cf2.css({ 'opacity': 0 });
//                         this.scrl.pre.anims.push([this.$cfs, { 'width': '+=0' }, function() { $cf2.remove(); }]);
//                         this.scrl.post.anims.push([$cf2, { 'opacity': 1 }]);
//                         break;
//                     case 'cover':
//                         this.scrl = CarouFredSel.fx_cover(this.scrl, this.$cfs, $cf2, this.opts, true);
//                         break;
//                     case 'uncover':
//                         this.scrl = CarouFredSel.fx_uncover(this.scrl, this.$cfs, $cf2, this.opts, true, nI);
//                         break;
//                 }

//                 //    /ALTERNATIVE EFFECTS

//                 //    complete callback
//                 var a_complete = $.proxy(function() {

//                     var overFill = this.opts.items.visible+nI-this.itms.total;
//                     if (overFill > 0) {
//                         this.$cfs.children().slice(this.itms.total).remove();
//                         c_old = this.$cfs.children().slice(this.itms.total-(nI-overFill)).get().concat( this.$cfs.children().slice(0, overFill).get() );
//                     }
//                     if (hiddenitems) {
//                         hiddenitems.each($.proxy(function(i, el) {
//                             var hi = $(el);
//                             if (!hi.data('isHidden')) hi.show();
//                         }, this));
//                     }
//                     if (this.opts.usePadding) {
//                         var l_itm = this.$cfs.children().eq(this.opts.items.visible+nI-1);
//                         l_itm.css(this.opts.d['marginRight'], l_itm.data('cfs_origCssMargin'));
//                     }

//                     this.scrl.anims = [];
//                     if (this.scrl.pre) this.scrl.pre = CarouFredSel.sc_setScroll(this.scrl.orgDuration, this.scrl.easing);

//                     var fn = $.proxy(function() {
//                         switch(sO.fx) {
//                             case 'fade':
//                             case 'crossfade':
//                                 this.$cfs.css('filter', '');
//                                 break;
//                         }

//                         this.scrl.post = CarouFredSel.sc_setScroll(0, null);
//                         this.crsl.isScrolling = false;

//                         var args = [c_old, c_new, w_siz];
//                         if (sO.onAfter) sO.onAfter.apply(this.$tt0, args);
//                         this.clbk.onAfter = CarouFredSel.sc_callCallbacks(this.clbk.onAfter, this.$tt0, args);

//                         if (this.queu.length) {
//                             this.$cfs.trigger(CarouFredSel.cf_e(this.queu[0][0], this.conf), this.queu[0][1]);
//                             this.queu.shift();
//                         }
//                         if (!this.crsl.isPaused) this.$cfs.trigger(CarouFredSel.cf_e('play', this.conf));
//                     }, this);
//                     switch(sO.fx) {
//                         case 'fade':
//                             this.scrl.pre.anims.push([this.$cfs, { 'opacity': 1 }, fn]);
//                             CarouFredSel.sc_startScroll(this.scrl.pre);
//                             break;
//                         case 'uncover':
//                             this.scrl.pre.anims.push([this.$cfs, { 'width': '+=0' }, fn]);
//                             CarouFredSel.sc_startScroll(this.scrl.pre);
//                             break;
//                         default:
//                             fn();
//                             break;
//                     }
//                 }, this);

//                 this.scrl.anims.push([this.$cfs, a_cfs, a_complete]);
//                 this.crsl.isScrolling = true;
//                 this.$cfs.css(this.opts.d['left'], -(i_siz-oL));
//                 this.tmrs = CarouFredSel.sc_clearTimers(this.tmrs);
//                 CarouFredSel.sc_startScroll(this.scrl);
//                 CarouFredSel.cf_setCookie(this.opts.cookie, this.$cfs.triggerHandler(CarouFredSel.cf_e('currentPosition', this.conf)));

//                 this.$cfs.trigger(CarouFredSel.cf_e('updatePageStatus', this.conf), [false, w_siz]);

//                 return true;
//             }, this));

//             //    next event, accessible from outside
//             this.$cfs.bind(CarouFredSel.cf_e('_cfs_slide_next', this.conf, false), $.proxy(function(e, sO, nI) {
//                 e.stopPropagation();
//                 var a_itm = this.$cfs.children();

//                 //    non-circular at end, scroll to start
//                 if (!this.opts.circular) {
//                     if (this.itms.first == this.opts.items.visible) {
//                         if (this.opts.infinite) {
//                             this.$cfs.trigger(CarouFredSel.cf_e('prev', this.conf), this.itms.total-1);
//                         }
//                         return e.stopImmediatePropagation();
//                     }
//                 }

//                 if (this.opts.usePadding) CarouFredSel.sz_resetMargin(a_itm, this.opts);

//                 //    find number of items to scroll
//                 if (typeof nI != 'number') {
//                     if (this.opts.items.filter != '*') {
//                         var xI = (typeof sO.items == 'number') ? sO.items : CarouFredSel.gn_getVisibleOrg(this.$cfs, this.opts);
//                         nI = CarouFredSel.gn_getScrollItemsNextFilter(a_itm, this.opts, 0, xI);
//                     } else {
//                         nI = this.opts.items.visible;
//                     }
//                     nI = CarouFredSel.cf_getAdjust(nI, this.opts, sO.items, this.$tt0);
//                 }

//                 var lastItemNr = (this.itms.first == 0) ? this.itms.total : this.itms.first;

//                 //    prevent non-circular from scrolling to far
//                 if (!this.opts.circular) {
//                     if (this.opts.items.visibleConf.variable) {
//                         var vI = CarouFredSel.gn_getVisibleItemsNext(a_itm, this.opts, nI),
//                             xI = CarouFredSel.gn_getVisibleItemsPrev(a_itm, this.opts, lastItemNr-1);
//                     } else {
//                         var vI = this.opts.items.visible,
//                             xI = this.opts.items.visible;
//                     }

//                     if (nI + vI > lastItemNr) {
//                         nI = lastItemNr - xI;
//                     }
//                 }

//                 //    set new number of visible items
//                 this.opts.items.visibleConf.old = this.opts.items.visible;
//                 if (this.opts.items.visibleConf.variable) {
//                     var vI = CarouFredSel.gn_getVisibleItemsNextTestCircular(a_itm, this.opts, nI, lastItemNr);
//                     while (this.opts.items.visible-nI >= vI && nI < this.itms.total) {
//                         nI++;
//                         vI = CarouFredSel.gn_getVisibleItemsNextTestCircular(a_itm, this.opts, nI, lastItemNr);
//                     }
//                     this.opts.items.visible = CarouFredSel.cf_getItemsAdjust(vI, this.opts, this.opts.items.visibleConf.adjust, this.$tt0);
//                 } else if (this.opts.items.filter != '*') {
//                     var vI = CarouFredSel.gn_getVisibleItemsNextFilter(a_itm, this.opts, nI);
//                     this.opts.items.visible = CarouFredSel.cf_getItemsAdjust(vI, this.opts, this.opts.items.visibleConf.adjust, $tt0);
//                 }

//                 if (this.opts.usePadding) CarouFredSel.sz_resetMargin(a_itm, this.opts, true);

//                 //    scroll 0, don't scroll
//                 if (nI == 0) {
//                     e.stopImmediatePropagation();
//                     return debug(this.conf, '0 items to scroll: Not scrolling.');
//                 }
//                 debug(this.conf, 'Scrolling '+nI+' items forward.');

//                 //    save new config
//                 this.itms.first -= nI;
//                 while (this.itms.first < 0) {
//                     this.itms.first += this.itms.total;
//                 }

//                 //    non-circular callback
//                 if (!this.opts.circular) {
//                     if (this.itms.first == this.opts.items.visible && sO.onEnd) sO.onEnd.call(this.$tt0);
//                     if (!this.opts.infinite) CarouFredSel.nv_enableNavi(this.opts, this.itms.first, this.conf);
//                 }

//                 //    rearrange items
//                 if (this.itms.total < this.opts.items.visible+nI) {
//                     this.$cfs.children().slice(0, (this.opts.items.visible+nI)-this.itms.total).clone(true).appendTo(this.$cfs);
//                 }

//                 //    the needed items
//                 var a_itm = this.$cfs.children(),
//                     c_old = CarouFredSel.gi_getOldItemsNext(a_itm, this.opts),
//                     c_new = CarouFredSel.gi_getNewItemsNext(a_itm, this.opts, nI),
//                     l_cur = a_itm.eq(nI-1),
//                     l_old = c_old.last(),
//                     l_new = c_new.last();

//                 if (this.opts.usePadding) CarouFredSel.sz_resetMargin(a_itm, this.opts);
//                 if (this.opts.align)    {
//                     var p = CarouFredSel.cf_getAlignPadding(c_new, this.opts),
//                         pL = p[0],
//                         pR = p[1];
//                 } else {
//                     var pL = 0,
//                         pR = 0;
//                 }

//                 //    hide items for fx directscroll
//                 if (sO.fx == 'directscroll' && this.opts.items.visibleConf.old < nI) {
//                     var hiddenitems = a_itm.slice(this.opts.items.visibleConf.old, nI),
//                         orgW = this.opts.items[this.opts.d['width']];
//                     hiddenitems.each($.proxy(function(i, el) {
//                         var hi = $(el);
//                         hi.data('isHidden', hi.is(':hidden')).hide();
//                     }, this));
//                     this.opts.items[this.opts.d['width']] = 'variable';
//                 } else {
//                     var hiddenitems = false;
//                 }

//                 //    save new sizes
//                 var i_siz = CarouFredSel.ms_getTotalSize(a_itm.slice(0, nI), this.opts, 'width'),
//                     w_siz = CarouFredSel.cf_mapWrapperSizes(CarouFredSel.ms_getSizes(c_new, this.opts, true), this.opts, !this.opts.usePadding);

//                 if (hiddenitems) this.opts.items[this.opts.d['width']] = orgW;

//                 if (this.opts.align) {
//                     if (this.opts.padding[this.opts.d[1]] < 0) {
//                         this.opts.padding[this.opts.d[1]] = 0;
//                     }
//                 }
//                 if (this.opts.usePadding) {
//                     CarouFredSel.sz_resetMargin(a_itm, this.opts, true);
//                     CarouFredSel.sz_resetMargin(l_old, this.opts, this.opts.padding[this.opts.d[1]]);
//                 }
//                 if (this.opts.align) {
//                     this.opts.padding[this.opts.d[1]] = pR;
//                     this.opts.padding[this.opts.d[3]] = pL;
//                 }

//                 //    animation configuration
//                 var a_cfs = {},
//                     a_dur = sO.duration;

//                      if (sO.fx == 'none')    a_dur = 0;
//                 else if (a_dur == 'auto')    a_dur = this.opts.scroll.duration / this.opts.scroll.items * nI;
//                 else if (a_dur <= 0)        a_dur = 0;
//                 else if (a_dur < 10)        a_dur = i_siz / a_dur;

//                 this.scrl = CarouFredSel.sc_setScroll(a_dur, sO.easing);

//                 //    animate wrapper
//                 if (this.opts[this.opts.d['width']] == 'variable' || this.opts[this.opts.d['height']] == 'variable') {
//                     this.scrl.anims.push([this.$wrp, w_siz]);
//                 }

//                 //    animate items
//                 if (this.opts.usePadding) {
//                     var l_new_m = l_new.data('cfs_origCssMargin');
//                     if (pR >= 0) {
//                         l_new_m += this.opts.padding[this.opts.d[1]];
//                     }
//                     l_new.css(this.opts.d['marginRight'], l_new_m);

//                     if (l_cur.not(l_old).length) {
//                         var a_old = {};
//                             a_old[this.opts.d['marginRight']] = l_old.data('cfs_origCssMargin');
//                         this.scrl.anims.push([l_old, a_old]);
//                     }

//                     var c_new_m = l_cur.data('cfs_origCssMargin');
//                     if (pL >= 0) {
//                         c_new_m += this.opts.padding[this.opts.d[3]];
//                     }
//                     var a_cur = {};
//                         a_cur[this.opts.d['marginRight']] = c_new_m;
//                     this.scrl.anims.push([l_cur, a_cur]);

//                 }

//                 //    animate carousel
//                 a_cfs[this.opts.d['left']] = -i_siz;
//                 if (pL < 0) {
//                     a_cfs[this.opts.d['left']] += pL;
//                 }

//                 //    onBefore callback
//                 var args = [c_old, c_new, w_siz, a_dur];
//                 if (sO.onBefore) sO.onBefore.apply(this.$tt0, args);
//                 this.clbk.onBefore = CarouFredSel.sc_callCallbacks(this.clbk.onBefore, this.$tt0, args);

//                 //    ALTERNATIVE EFFECTS

//                 //    extra animation arrays
//                 switch(sO.fx) {
//                     case 'fade':
//                     case 'crossfade':
//                     case 'cover':
//                     case 'uncover':
//                         this.scrl.pre = CarouFredSel.sc_setScroll(this.scrl.duration, this.scrl.easing);
//                         this.scrl.post = CarouFredSel.sc_setScroll(this.scrl.duration, this.scrl.easing);
//                         this.scrl.duration = 0;
//                         break;
//                 }

//                 //    create copy
//                 switch(sO.fx) {
//                     case 'crossfade':
//                     case 'cover':
//                     case 'uncover':
//                         var $cf2 = this.$cfs.clone().appendTo(this.$wrp);
//                         break;
//                 }
//                 switch(sO.fx) {
//                     case 'uncover':
//                         $cf2.children().slice(this.opts.items.visibleConf.old).remove();
//                         break;
//                     case 'crossfade':
//                     case 'cover':
//                         $cf2.children().slice(0, nI).remove();
//                         $cf2.children().slice(this.opts.items.visible).remove();
//                         break;
//                 }

//                 //    animations
//                 switch(sO.fx) {
//                     case 'fade':
//                         this.scrl.pre.anims.push([this.$cfs, { 'opacity': 0 }]);
//                         break;
//                     case 'crossfade':
//                         $cf2.css({ 'opacity': 0 });
//                         this.scrl.pre.anims.push([this.$cfs, { 'width': '+=0' }, function() { $cf2.remove(); }]);
//                         this.scrl.post.anims.push([$cf2, { 'opacity': 1 }]);
//                         break;
//                     case 'cover':
//                         this.scrl = CarouFredSel.fx_cover(this.scrl, this.$cfs, $cf2, this.opts, false);
//                         break;
//                     case 'uncover':
//                         this.scrl = CarouFredSel.fx_uncover(this.scrl, this.$cfs, $cf2, this.opts, false, nI);
//                         break;
//                 }

//                 //    /ALTERNATIVE EFFECTS

//                 //    complete callback
//                 var a_complete = $.proxy(function() {

//                     var overFill = this.opts.items.visible+nI-this.itms.total,
//                         new_m = (this.opts.usePadding) ? this.opts.padding[this.opts.d[3]] : 0;
//                     this.$cfs.css(this.opts.d['left'], new_m);
//                     if (overFill > 0) {
//                         this.$cfs.children().slice(this.itms.total).remove();
//                     }
//                     var l_itm = this.$cfs.children().slice(0, nI).appendTo(this.$cfs).last();
//                     if (overFill > 0) {
//                         c_new = CarouFredSel.gi_getCurrentItems(a_itm, this.opts);
//                     }
//                     if (hiddenitems) {
//                         hiddenitems.each($.proxy(function(i, el) {
//                             var hi = $(el);
//                             if (!hi.data('isHidden')) hi.show();
//                         }, this));
//                     }
//                     if (this.opts.usePadding) {
//                         if (this.itms.total < this.opts.items.visible+nI) {
//                             var l_cur = this.$cfs.children().eq(this.opts.items.visible-1);
//                             l_cur.css(this.opts.d['marginRight'], l_cur.data('cfs_origCssMargin') + this.opts.padding[this.opts.d[3]]);
//                         }
//                         l_itm.css(this.opts.d['marginRight'], l_itm.data('cfs_origCssMargin'));
//                     }

//                     this.scrl.anims = [];
//                     if (this.scrl.pre) this.scrl.pre = CarouFredSel.sc_setScroll(this.scrl.orgDuration, this.scrl.easing);

//                     var fn = $.proxy(function() {
//                         switch(sO.fx) {
//                             case 'fade':
//                             case 'crossfade':
//                                 this.$cfs.css('filter', '');
//                                 break;
//                         }

//                         this.scrl.post = CarouFredSel.sc_setScroll(0, null);
//                         this.crsl.isScrolling = false;

//                         var args = [c_old, c_new, w_siz];
//                         if (sO.onAfter) sO.onAfter.apply(this.$tt0, args);
//                         this.clbk.onAfter = CarouFredSel.sc_callCallbacks(this.clbk.onAfter, this.$tt0, args);

//                         if (this.queu.length) {
//                             this.$cfs.trigger(CarouFredSel.cf_e(this.queu[0][0], this.conf), this.queu[0][1]);
//                             this.queu.shift();
//                         }
//                         if (!this.crsl.isPaused) this.$cfs.trigger(CarouFredSel.cf_e('play', this.conf));
//                     }, this);
//                     switch(sO.fx) {
//                         case 'fade':
//                             this.scrl.pre.anims.push([this.$cfs, { 'opacity': 1 }, fn]);
//                             CarouFredSel.sc_startScroll(this.scrl.pre);
//                             break;
//                         case 'uncover':
//                             this.scrl.pre.anims.push([this.$cfs, { 'width': '+=0' }, fn]);
//                             CarouFredSel.sc_startScroll(this.scrl.pre);
//                             break;
//                         default:
//                             fn();
//                             break;
//                     }
//                 }, this);

//                 this.scrl.anims.push([this.$cfs, a_cfs, a_complete]);
//                 this.crsl.isScrolling = true;
//                 this.tmrs = CarouFredSel.sc_clearTimers(this.tmrs);
//                 CarouFredSel.sc_startScroll(this.scrl);
//                 CarouFredSel.cf_setCookie(this.opts.cookie, this.$cfs.triggerHandler(CarouFredSel.cf_e('currentPosition', this.conf)));

//                 this.$cfs.trigger(CarouFredSel.cf_e('updatePageStatus', this.conf), [false, w_siz]);

//                 return true;
//             }, this));

//             //    slideTo event
//             this.$cfs.bind(CarouFredSel.cf_e('slideTo', this.conf), $.proxy(function(e, num, dev, org, obj, dir, clb) {
//                 e.stopPropagation();

//                 var v = [num, dev, org, obj, dir, clb],
//                     t = ['string/number/object', 'number', 'boolean', 'object', 'string', 'function'],
//                     a = CarouFredSel.cf_sortParams(v, t);

//                 var obj = a[3],
//                     dir = a[4],
//                     clb = a[5];

//                 num = CarouFredSel.gn_getItemIndex(a[0], a[1], a[2], this.itms, this.$cfs);

//                 if (num == 0) return;
//                 if (typeof obj != 'object') obj = false;

//                 if (this.crsl.isScrolling) {
//                     if (typeof obj != 'object' || obj.duration > 0) return false;
//                 }

//                 if (dir != 'prev' && dir != 'next') {
//                     if (this.opts.circular) {
//                         if (num <= this.itms.total / 2)     dir = 'next';
//                         else                         dir = 'prev';
//                     } else {
//                         if (this.itms.first == 0 ||
//                             this.itms.first > num)        dir = 'next';
//                         else                        dir = 'prev';
//                     }
//                 }

//                 if (dir == 'prev') num = this.itms.total-num;
//                 this.$cfs.trigger(CarouFredSel.cf_e(dir, this.conf), [obj, num, clb]);

//                 return true;
//             }, this));

//             //    prevPage event
//             this.$cfs.bind(CarouFredSel.cf_e('prevPage', this.conf), $.proxy(function(e, obj, clb) {
//                 e.stopPropagation();
//                 var cur = this.$cfs.triggerHandler(CarouFredSel.cf_e('currentPage', this.conf));
//                 return this.$cfs.triggerHandler(CarouFredSel.cf_e('slideToPage', this.conf), [cur-1, obj, 'prev', clb]);
//             }, this));

//             //    nextPage event
//             this.$cfs.bind(CarouFredSel.cf_e('nextPage', this.conf), $.proxy(function(e, obj, clb) {
//                 e.stopPropagation();
//                 var cur = this.$cfs.triggerHandler(CarouFredSel.cf_e('currentPage', this.conf));
//                 return this.$cfs.triggerHandler(CarouFredSel.cf_e('slideToPage', this.conf), [cur+1, obj, 'next', clb]);
//             }, this));

//             //    slideToPage event
//             this.$cfs.bind(CarouFredSel.cf_e('slideToPage', this.conf), $.proxy(function(e, pag, obj, dir, clb) {
//                 e.stopPropagation();
//                 if (typeof pag != 'number') pag = this.$cfs.triggerHandler(CarouFredSel.cf_e('currentPage', this.conf));
//                 var ipp = this.opts.pagination.items || this.opts.items.visible,
//                     max = Math.floor(this.itms.total / ipp)-1;
//                 if (pag < 0)    pag = max;
//                 if (pag > max)    pag = 0;
//                 return this.$cfs.triggerHandler(CarouFredSel.cf_e('slideTo', this.conf), [pag*ipp, 0, true, obj, dir, clb]);
//             }, this));

//             //    jumpToStart event
//             this.$cfs.bind(CarouFredSel.cf_e('jumpToStart', this.conf), $.proxy(function(e, s) {
//                 e.stopPropagation();
//                 if (s)    s = CarouFredSel.gn_getItemIndex(s, 0, true, this.itms, this.$cfs);
//                 else     s = 0;

//                 s += this.itms.first;
//                 if (s != 0) {
//                     while (s > this.itms.total) s -= this.itms.total;
//                     this.$cfs.prepend(this.$cfs.children().slice(s, this.itms.total));
//                 }
//                 return true;
//             }, this));

//             //    synchronise event
//             this.$cfs.bind(CarouFredSel.cf_e('synchronise', this.conf), $.proxy(function(e, s) {
//                 e.stopPropagation();
//                      if (s)                 s = CarouFredSel.cf_getSynchArr(s);
//                 else if (this.opts.synchronise)    s = this.opts.synchronise;
//                 else return debug(this.conf, 'No carousel to synchronise.');

//                 var n = this.$cfs.triggerHandler(CarouFredSel.cf_e('currentPosition', this.conf)),
//                     x = true;
//                 for (var j = 0, l = s.length; j < l; j++) {
//                     if (!s[j][0].triggerHandler(CarouFredSel.cf_e('slideTo', this.conf), [n, s[j][3], true])) {
//                         x = false;
//                     }
//                 }
//                 return x;
//             }, this));

//             //    queue event
//             this.$cfs.bind(CarouFredSel.cf_e('queue', this.conf), $.proxy(function(e, dir, opt) {
//                 e.stopPropagation();
//                 if (typeof dir == 'function') {
//                     dir.call(this.$tt0, this.queu);
//                 } else if ($.isArray(dir)) {
//                     this.queu = dir;
//                 } else if (typeof dir != 'undefined') {
//                     this.queu.push([dir, opt]);
//                 }
//                 return this.queu;
//             }, this));

//             //    insertItem event
//             this.$cfs.bind(CarouFredSel.cf_e('insertItem', this.conf), $.proxy(function(e, itm, num, org, dev) {
//                 e.stopPropagation();

//                 var v = [itm, num, org, dev],
//                     t = ['string/object', 'string/number/object', 'boolean', 'number'],
//                     a = CarouFredSel.cf_sortParams(v, t);

//                 var itm = a[0],
//                     num = a[1],
//                     org = a[2],
//                     dev = a[3];

//                 if (typeof itm == 'object' &&
//                     typeof itm.jquery == 'undefined')    itm = $(itm);
//                 if (typeof itm == 'string')             itm = $(itm);
//                 if (typeof itm != 'object' ||
//                     typeof itm.jquery == 'undefined' ||
//                     itm.length == 0) return debug(this.conf, 'Not a valid object.');

//                 if (typeof num == 'undefined') num = 'end';

//                 if (this.opts.usePadding) {
//                     itm.each($.proxy(function(i, el) {
//                         var m = parseInt($(el).css(this.opts.d['marginRight']));
//                         if (isNaN(m)) m = 0;
//                         $(el).data('cfs_origCssMargin', m);
//                     }, this));
//                 }

//                 var orgNum = num,
//                     before = 'before';

//                 if (num == 'end') {
//                     if (org) {
//                         if (this.itms.first == 0) {
//                             num = this.itms.total-1;
//                             before = 'after';
//                         } else {
//                             num = this.itms.first;
//                             this.itms.first += itm.length
//                         }
//                         if (num < 0) num = 0;
//                     } else {
//                         num = this.itms.total-1;
//                         before = 'after';
//                     }
//                 } else {
//                     num = CarouFredSel.gn_getItemIndex(num, dev, org, this.itms, this.$cfs);
//                 }
//                 if (orgNum != 'end' && !org) {
//                     if (num < this.itms.first) this.itms.first += itm.length;
//                 }
//                 if (this.itms.first >= this.itms.total) this.itms.first -= this.itms.total;

//                 var $cit = this.$cfs.children().eq(num);
//                 if ($cit.length) {
//                     $cit[before](itm);
//                 } else {
//                     this.$cfs.append(itm);
//                 }

//                 this.itms.total = this.$cfs.children().length;

//                 var sz = this.$cfs.triggerHandler('updateSizes');
//                 CarouFredSel.nv_showNavi(this.opts, this.itms.total, this.conf);
//                 CarouFredSel.nv_enableNavi(this.opts, this.itms.first, this.conf);
//                 this.$cfs.trigger(CarouFredSel.cf_e('linkAnchors', this.conf));
//                 this.$cfs.trigger(CarouFredSel.cf_e('updatePageStatus', this.conf), [true, sz]);

//                 return true;
//             }, this));

//             //    removeItem event
//             this.$cfs.bind(CarouFredSel.cf_e('removeItem', this.conf), $.proxy(function(e, num, org, dev) {
//                 e.stopPropagation();

//                 var v = [num, org, dev],
//                     t = ['string/number/object', 'boolean', 'number'],
//                     a = CarouFredSel.cf_sortParams(v, t);

//                 var num = a[0],
//                     org = a[1],
//                     dev = a[2];

//                 if (typeof num == 'undefined' || num == 'end') {
//                     this.$cfs.children().last().remove();
//                 } else {
//                     num = CarouFredSel.gn_getItemIndex(num, dev, org, this.itms, this.$cfs);
//                     var $cit = this.$cfs.children().eq(num);
//                     if ($cit.length){
//                         if (num < this.itms.first) this.itms.first -= $cit.length;
//                         $cit.remove();
//                     }
//                 }
//                 this.itms.total = this.$cfs.children().length;

//                 var sz = this.$cfs.triggerHandler('updateSizes');
//                 CarouFredSel.nv_showNavi(this.opts, this.itms.total, this.conf);
//                 CarouFredSel.nv_enableNavi(this.opts, this.itms.first, this.conf);
//                 this.$cfs.trigger(CarouFredSel.cf_e('updatePageStatus', this.conf), [true, sz]);

//                 return true;
//             }, this));

//             //    onBefore and onAfter event
//             this.$cfs.bind(CarouFredSel.cf_e('onBefore', this.conf)+' '+CarouFredSel.cf_e('onAfter', this.conf), $.proxy(function(e, fn) {
//                 e.stopPropagation();
//                 var eType = e.type.substr(this.conf.events.prefix.length);
//                 if ($.isArray(fn))                this.clbk[eType] = fn;
//                 if (typeof fn == 'function')    this.clbk[eType].push(fn);
//                 return this.clbk[eType];
//             }, this));

//             //    currentPosition event, accessible from outside
//             this.$cfs.bind(CarouFredSel.cf_e('_cfs_currentPosition', this.conf, false), $.proxy(function(e, fn) {
//                 e.stopPropagation();
//                 return this.$cfs.triggerHandler(CarouFredSel.cf_e('currentPosition', this.conf), fn);
//             }, this));
//             this.$cfs.bind(CarouFredSel.cf_e('currentPosition', this.conf), $.proxy(function(e, fn) {
//                 e.stopPropagation();
//                 if (this.itms.first == 0) var val = 0;
//                 else var val = this.itms.total - this.itms.first;
//                 if (typeof fn == 'function') fn.call(this.$tt0, val);
//                 return val;
//             }, this));

//             //    currentPage event
//             this.$cfs.bind(CarouFredSel.cf_e('currentPage', this.conf), $.proxy(function(e, fn) {
//                 e.stopPropagation();
//                 var ipp = this.opts.pagination.items || this.opts.items.visible;
//                 var max = Math.ceil(this.itms.total/ipp-1);
//                 if (this.itms.first == 0)                             var nr = 0;
//                 else if (this.itms.first < this.itms.total % ipp)         var nr = 0;
//                 else if (this.itms.first == ipp && !this.opts.circular)     var nr = max;
//                 else                                             var nr = Math.round((this.itms.total-this.itms.first)/ipp);
//                 if (nr < 0) nr = 0;
//                 if (nr > max) nr = max;
//                 if (typeof fn == 'function') fn.call(this.$tt0, nr);
//                 return nr;
//             }, this));

//             //    currentVisible event
//             this.$cfs.bind(CarouFredSel.cf_e('currentVisible', this.conf), $.proxy(function(e, fn) {
//                 e.stopPropagation();
//                 $i = CarouFredSel.gi_getCurrentItems(this.$cfs.children(), this.opts);
//                 if (typeof fn == 'function') fn.call(this.$tt0, $i);
//                 return $i;
//             }, this));

//             //    slice event
//             this.$cfs.bind(CarouFredSel.cf_e('slice', this.conf), $.proxy(function(e, f, l, fn) {
//                 e.stopPropagation();

//                 var v = [f, l, fn],
//                     t = ['number', 'number', 'function'],
//                     a = CarouFredSel.cf_sortParams(v, t);

//                 f = (typeof a[0] == 'number') ? a[0] : 0,
//                 l = (typeof a[1] == 'number') ? a[1] : this.itms.total,
//                 fn = a[2];

//                 f += this.itms.first;
//                 l += this.itms.first;

//                 while (f > this.itms.total) { f -= this.itms.total }
//                 while (l > this.itms.total) { l -= this.itms.total }
//                 while (f < 0) { f += this.itms.total }
//                 while (l < 0) { l += this.itms.total }

//                 var $iA = this.$cfs.children();

//                 if (l > f) {
//                     var $i = $iA.slice(f, l);
//                 } else {
//                     var $i = $iA.slice(f, this.itms.total).get().concat( $iA.slice(0, l).get() );
//                 }

//                 if (typeof fn == 'function') fn.call(this.$tt0, $i);
//                 return $i;
//             }, this));

//             //    isPaused, isStopped and isScrolling events
//             this.$cfs.bind(CarouFredSel.cf_e('isPaused', this.conf)+' '+CarouFredSel.cf_e('isStopped', this.conf)+' '+CarouFredSel.cf_e('isScrolling', this.conf), $.proxy(function(e, fn) {
//                 e.stopPropagation();
//                 var eType = e.type.substr(this.conf.events.prefix.length);
//                 if (typeof fn == 'function') fn.call(this.$tt0, this.crsl[eType]);
//                 return this.crsl[eType];
//             }, this));

//             //    configuration event, accessible from outside
//             this.$cfs.bind(CarouFredSel.cf_e('_cfs_configuration', this.conf, false), $.proxy(function(e, a, b, c) {
//                 e.stopPropagation();
//                 return this.$cfs.triggerHandler(CarouFredSel.cf_e('configuration', this.conf), [a, b, c]);
//             }, this));
//             this.$cfs.bind(CarouFredSel.cf_e('configuration', this.conf), $.proxy(function(e, a, b, c) {
//                 e.stopPropagation();
//                 var reInit = false;

//                 //    return entire configuration-object
//                 if (typeof a == 'function') {
//                     a.call(this.$tt0, this.opts);

//                 //    set multiple options via object
//                 } else if (typeof a == 'object') {
//                     this.opts_orig = $.extend(true, {}, this.opts_orig, a);
//                     if (b !== false) reInit = true;
//                     else this.opts = $.extend(true, {}, this.opts, a);

//                 } else if (typeof a != 'undefined') {

//                     //    callback function for specific option
//                     if (typeof b == 'function') {
//                         var val = this.opts.a;
//                         if (typeof val == 'undefined') val = '';
//                         b.call(this.$tt0, val);

//                     //    set individual option
//                     } else if (typeof b != 'undefined') {
//                         if (typeof c !== 'boolean') {
//                             c = true;
//                         }
//                         this.opts_orig.a = b;
//                         if (c !== false) {
//                             reInit = true;
//                         } else {
//                             this.opts.a = b;
//                         }

//                     //    return value for specific option
//                     } else {
//                         return this.opts.a;
//                     }
//                 }
//                 if (reInit) {
//                     CarouFredSel.sz_resetMargin(this.$cfs.children(), this.opts);
//                     this._cfs_init(this.opts_orig);
//                     this._cfs_bind_buttons();
//                     var siz = CarouFredSel.sz_setSizes(this.$cfs, this.opts, false);
//                     this.$cfs.trigger(CarouFredSel.cf_e('updatePageStatus', this.conf), [true, siz]);
//                 }
//                 return this.opts;
//             }, this));

//             //    linkAnchors event
//             this.$cfs.bind(CarouFredSel.cf_e('linkAnchors', this.conf), $.proxy(function(e, $con, sel) {
//                 e.stopPropagation();
//                 if (typeof $con == 'undefined' || $con.length == 0) $con = $('body');
//                 else if (typeof $con == 'string') $con = $($con);
//                 if (typeof $con != 'object') return debug(this.conf, 'Not a valid object.');
//                 if (typeof sel != 'string' || sel.length == 0) sel = 'a.caroufredsel';
//                 $con.find(sel).each($.proxy(function(i, el) {
//                     var h = el.hash || '';
//                     if (h.length > 0 && this.$cfs.children().index($(h)) != -1) {
//                         $(el).unbind('click').click($.proxy(function(e) {
//                             e.preventDefault();
//                             this.$cfs.trigger(CarouFredSel.cf_e('slideTo', this.conf), h);
//                         }, this));
//                     }
//                 }, this));
//                 return true;
//             }, this));

//             //    updatePageStatus event
//             this.$cfs.bind(CarouFredSel.cf_e('updatePageStatus', this.conf), $.proxy(function(e, build, sizes) {
//                 e.stopPropagation();
//                 if (!this.opts.pagination.container) return;

//                 if (build) {
//                     var ipp = this.opts.pagination.items || this.opts.items.visible,
//                         l = Math.ceil(this.itms.total/ipp);

//                     if (this.opts.pagination.anchorBuilder) {
//                         this.opts.pagination.container.children().remove();
//                         this.opts.pagination.container.each($.proxy(function(i, el) {
//                             for (var a = 0; a < l; a++) {
//                                 var i = this.$cfs.children().eq( CarouFredSel.gn_getItemIndex(a*ipp, 0, true, this.itms, this.$cfs) );
//                                 $(el).append(this.opts.pagination.anchorBuilder(a+1, i));
//                             }
//                         }, this));
//                     }
//                     this.opts.pagination.container.each($.proxy(function(i, el) {
//                         $(el).children().unbind(this.opts.pagination.event).each($.proxy(function(a, el) {
//                             $(el).bind(this.opts.pagination.event, $.proxy(function(e) {
//                                 e.preventDefault();
//                                 this.$cfs.trigger(CarouFredSel.cf_e('slideTo', this.conf), [a*ipp, 0, true, this.opts.pagination]);
//                             }, this));
//                         }, this));
//                     }, this));
//                 }
//                 this.opts.pagination.container.each($.proxy(function(i, el) {
//                     $(el).children().removeClass(CarouFredSel.cf_c('selected', this.conf)).eq(this.$cfs.triggerHandler(CarouFredSel.cf_e('currentPage', this.conf))).addClass(CarouFredSel.cf_c('selected', this.conf));
//                 }, this));
//                 return true;
//             }, this));

//             //    updateSizes event
//             this.$cfs.bind(CarouFredSel.cf_e('updateSizes', this.conf), $.proxy(function(e) {
//                 var a_itm = this.$cfs.children(),
//                     vI = this.opts.items.visible;

//                      if (this.opts.items.visibleConf.variable)    vI = CarouFredSel.gn_getVisibleItemsNext(a_itm, this.opts, 0);
//                 else if (this.opts.items.filter != '*')             vI = CarouFredSel.gn_getVisibleItemsNextFilter(a_itm, this.opts, 0);

//                 if (!this.opts.circular && this.itms.first != 0 && vI > this.itms.first) {
//                     if (this.opts.items.visibleConf.variable) {
//                         var nI = CarouFredSel.gn_getVisibleItemsPrev(a_itm, this.opts, this.itms.first) - this.itms.first;
//                     } else if (this.opts.items.filter != '*') {
//                         var nI = CarouFredSel.gn_getVisibleItemsPrevFilter(a_itm, this.opts, this.itms.first) - this.itms.first;
//                     } else {
//                         nI = this.opts.items.visible - this.itms.first;
//                     }
//                     debug(this.conf, 'Preventing non-circular: sliding '+nI+' items backward.');
//                     this.$cfs.trigger('prev', nI);
//                 }
//                 this.opts.items.visible = CarouFredSel.cf_getItemsAdjust(vI, this.opts, this.opts.items.visibleConf.adjust, this.$tt0);
//                 return CarouFredSel.sz_setSizes(this.$cfs, this.opts);
//             }, this));

//             //    destroy event, accessible from outside
//             this.$cfs.bind(CarouFredSel.cf_e('_cfs_destroy', this.conf, false), $.proxy(function(e, orgOrder) {
//                 e.stopPropagation();
//                 this.$cfs.trigger(CarouFredSel.cf_e('destroy', this.conf), orgOrder);
//                 return true;
//             }, this));
//             this.$cfs.bind(CarouFredSel.cf_e('destroy', this.conf), $.proxy(function(e, orgOrder) {
//                 e.stopPropagation();
//                 this.tmrs = CarouFredSel.sc_clearTimers(this.tmrs);

//                 this.$cfs.data('cfs_isCarousel', false);
//                 this.$cfs.trigger(CarouFredSel.cf_e('finish', this.conf));
//                 if (orgOrder) {
//                     this.$cfs.trigger(CarouFredSel.cf_e('jumpToStart', this.conf));
//                 }
//                 if (this.opts.usePadding) {
//                     CarouFredSel.sz_resetMargin(this.$cfs.children(), this.opts);
//                 }

//                 this.$cfs.css(this.$cfs.data('cfs_origCss'));
//                 this._cfs_unbind_events();
//                 this._cfs_unbind_buttons();
//                 this.$wrp.replaceWith(this.$cfs);

//                 return true;
//             }, this));
//         },    //    /bind_events
//         _cfs_unbind_events: function() {
//             this.$cfs.unbind(CarouFredSel.cf_e('', this.conf));
//             this.$cfs.unbind(CarouFredSel.cf_e('', this.conf, false));
//         },    //    /unbind_events
//         _cfs_bind_buttons: function() {
//             this._cfs_unbind_buttons();
//             CarouFredSel.nv_showNavi(this.opts, this.itms.total, this.conf);
//             CarouFredSel.nv_enableNavi(this.opts, this.itms.first, this.conf);

//             if (this.opts.auto.pauseOnHover) {
//                 var pC = CarouFredSel.bt_pauseOnHoverConfig(this.opts.auto.pauseOnHover);
//                 this.$wrp.bind(CarouFredSel.cf_e('mouseenter', this.conf, false), $.proxy(function() { this.$cfs.trigger(CarouFredSel.cf_e('pause', this.conf), pC);    }, this))
//                     .bind(CarouFredSel.cf_e('mouseleave', this.conf, false), $.proxy(function() { this.$cfs.trigger(CarouFredSel.cf_e('resume', this.conf));        }, this));
//             }

//             if (this.opts.auto.button) {
//                 this.opts.auto.button.bind(CarouFredSel.cf_e(this.opts.auto.event, this.conf, false), $.proxy(function(e) {
//                     e.preventDefault();
//                     var ev = false,
//                         pC = null;

//                     if (this.crsl.isPaused) {
//                         ev = 'play';
//                     } else if (this.opts.auto.pauseOnEvent) {
//                         ev = 'pause';
//                         pC = CarouFredSel.bt_pauseOnHoverConfig(this.opts.auto.pauseOnEvent);
//                     }
//                     if (ev) {
//                         this.$cfs.trigger(CarouFredSel.cf_e(ev, this.conf), pC);
//                     }
//                 }, this));
//             }
//             if (this.opts.prev.button) {
//                 this.opts.prev.button.bind(CarouFredSel.cf_e(this.opts.prev.event, this.conf, false), $.proxy(function(e) {
//                     e.preventDefault();
//                     this.$cfs.trigger(CarouFredSel.cf_e('prev', this.conf));
//                 }, this));
//                 if (this.opts.prev.pauseOnHover) {
//                     var pC = CarouFredSel.bt_pauseOnHoverConfig(this.opts.prev.pauseOnHover);
//                     this.opts.prev.button.bind(CarouFredSel.cf_e('mouseenter', this.conf, false), $.proxy(function() { this.$cfs.trigger(CarouFredSel.cf_e('pause', this.conf), pC);    }, this))
//                                     .bind(CarouFredSel.cf_e('mouseleave', this.conf, false), $.proxy(function() { this.$cfs.trigger(CarouFredSel.cf_e('resume', this.conf));        }, this));
//                 }
//             }

//             if (this.opts.next.button) {
//                 this.opts.next.button.bind(CarouFredSel.cf_e(this.opts.next.event, this.conf, false), $.proxy(function(e) {
//                     e.preventDefault();
//                     this.$cfs.trigger(CarouFredSel.cf_e('next', this.conf));
//                 }, this));
//                 if (this.opts.next.pauseOnHover) {
//                     var pC = CarouFredSel.bt_pauseOnHoverConfig(this.opts.next.pauseOnHover);
//                     this.opts.next.button.bind(CarouFredSel.cf_e('mouseenter', this.conf, false), $.proxy(function() { this.$cfs.trigger(CarouFredSel.cf_e('pause', this.conf), pC);     }, this))
//                                     .bind(CarouFredSel.cf_e('mouseleave', this.conf, false), $.proxy(function() { this.$cfs.trigger(CarouFredSel.cf_e('resume', this.conf));        }, this));
//                 }
//             }
//             if ($.fn.mousewheel) {
//                 if (this.opts.prev.mousewheel) {
//                     if (!this.crsl.mousewheelPrev) {
//                         this.crsl.mousewheelPrev = true;
//                         this.$wrp.mousewheel($.proxy(function(e, delta) {
//                             if (delta > 0) {
//                                 e.preventDefault();
//                                 var num = CarouFredSel.bt_mousesheelNumber(this.opts.prev.mousewheel);
//                                 this.$cfs.trigger(CarouFredSel.cf_e('prev', this.conf), num);
//                             }
//                         }, this));
//                     }
//                 }
//                 if (this.opts.next.mousewheel) {
//                     if (!this.crsl.mousewheelNext) {
//                         this.crsl.mousewheelNext = true;
//                         this.$wrp.mousewheel($.proxy(function(e, delta) {
//                             if (delta < 0) {
//                                 e.preventDefault();
//                                 var num = CarouFredSel.bt_mousesheelNumber(this.opts.next.mousewheel);
//                                 this.$cfs.trigger(CarouFredSel.cf_e('next', this.conf), num);
//                             }
//                         }, this));
//                     }
//                 }
//             }
//             if ($.fn.touchwipe) {
//                 var wP = (this.opts.prev.wipe) ? $.proxy(function() { this.$cfs.trigger(CarouFredSel.cf_e('prev', this.conf)) }, this) : null,
//                     wN = (this.opts.next.wipe) ? $.proxy(function() { this.$cfs.trigger(CarouFredSel.cf_e('next', this.conf)) }, this) : null;

//                 if (wN || wN) {
//                     if (!this.crsl.touchwipe) {
//                         this.crsl.touchwipe = true;
//                         var twOps = {
//                             'min_move_x': 30,
//                             'min_move_y': 30,
//                             'preventDefaultEvents': true
//                         };
//                         switch (this.opts.direction) {
//                             case 'up':
//                             case 'down':
//                                 twOps.wipeUp = wN;
//                                 twOps.wipeDown = wP;
//                                 break;
//                             default:
//                                 twOps.wipeLeft = wN;
//                                 twOps.wipeRight = wP;
//                         }
//                         this.$wrp.touchwipe(twOps);
//                     }
//                 }
//             }
//             if (this.opts.pagination.container) {
//                 if (this.opts.pagination.pauseOnHover) {
//                     var pC = CarouFredSel.bt_pauseOnHoverConfig(this.opts.pagination.pauseOnHover);
//                     this.opts.pagination.container.bind(CarouFredSel.cf_e('mouseenter', this.conf, false), $.proxy(function() { this.$cfs.trigger(CarouFredSel.cf_e('pause', this.conf), pC);    }, this))
//                                              .bind(CarouFredSel.cf_e('mouseleave', this.conf, false), $.proxy(function() { this.$cfs.trigger(CarouFredSel.cf_e('resume', this.conf));    }, this));
//                 }
//             }
//             if (this.opts.prev.key || this.opts.next.key) {
//                 $(document).bind(CarouFredSel.cf_e('keyup', this.conf, false, true, true), $.proxy(function(e) {
//                     var k = e.keyCode;
//                     if (k == this.opts.next.key)    {
//                         e.preventDefault();
//                         this.$cfs.trigger(CarouFredSel.cf_e('next', this.conf));
//                     }
//                     if (k == this.opts.prev.key) {
//                         e.preventDefault();
//                         this.$cfs.trigger(CarouFredSel.cf_e('prev', this.conf));
//                     }
//                 }, this));
//             }
//             if (this.opts.pagination.keys) {
//                 $(document).bind(CarouFredSel.cf_e('keyup', this.conf, false, true, true), $.proxy(function(e) {
//                     var k = e.keyCode;
//                     if (k >= 49 && k < 58) {
//                         k = (k-49) * this.opts.items.visible;
//                         if (k <= this.itms.total) {
//                             e.preventDefault();
//                             this.$cfs.trigger(CarouFredSel.cf_e('slideTo', this.conf), [k, 0, true, this.opts.pagination]);
//                         }
//                     }
//                 }, this));
//             }
//             if (this.opts.auto.play) {
//                 this.$cfs.trigger(CarouFredSel.cf_e('play', this.conf), this.opts.auto.delay);
//             }

//             if (this.crsl.upDateOnWindowResize) {
//                 $(window).bind(CarouFredSel.cf_e('resize', this.conf, false, true, true), $.proxy(function(e) {
//                     this.$cfs.trigger(CarouFredSel.cf_e('finish', this.conf));
//                     if (this.opts.auto.pauseOnResize && !this.crsl.isPaused) {
//                         this.$cfs.trigger(CarouFredSel.cf_e('play', this.conf));
//                     }
//                     CarouFredSel.sz_resetMargin(this.$cfs.children(), this.opts);
//                     this._cfs_init(this.opts_orig);
//                     var siz = CarouFredSel.sz_setSizes(this.$cfs, this.opts, false);
//                     this.$cfs.trigger(CarouFredSel.cf_e('updatePageStatus', this.conf), [true, siz]);
//                 }, this));
//             }

//         },    //    /bind_buttons
//         _cfs_unbind_buttons: function() {
//             var ns1 = CarouFredSel.cf_e('', this.conf),
//                 ns2 = CarouFredSel.cf_e('', this.conf, false);
//                 ns3 = CarouFredSel.cf_e('', this.conf, false, true, true);

//             $(document).unbind(ns3);
//             $(window).unbind(ns3);
//             this.$wrp.unbind(ns2);

//             if (this.opts.auto.button) this.opts.auto.button.unbind(ns2);
//             if (this.opts.prev.button) this.opts.prev.button.unbind(ns2);
//             if (this.opts.next.button) this.opts.next.button.unbind(ns2);
//             if (this.opts.pagination.container) {
//                 this.opts.pagination.container.unbind(ns2);
//                 if (this.opts.pagination.anchorBuilder) {
//                     this.opts.pagination.container.children().remove();
//                 }
//             }

//             CarouFredSel.nv_showNavi(this.opts, 'hide', this.conf);
//             CarouFredSel.nv_enableNavi(this.opts, 'removeClass', this.conf);

//         }    //    /unbind_buttons
//     }

//     //
//     // Static
//     //

//     CarouFredSel.serialNumber = 1;
//     CarouFredSel.defaults = {
//         'synchronise'    : false,
//         'infinite'        : true,
//         'circular'        : true,
//         'responsive'    : false,
//         'direction'        : 'left',
//         'items'            : {
//             'start'            : 0
//         },
//         'scroll'        : {
//             'easing'        : 'swing',
//             'duration'        : 500,
//             'pauseOnHover'    : false,
//             'mousewheel'    : false,
//             'wipe'            : false,
//             'event'            : 'click',
//             'queue'            : false
//         }
//     };
//     CarouFredSel.configs = {
//         'debug'            : false,
//         'events'        : {
//             'prefix'        : '',
//             'namespace'        : 'cfs'
//         },
//         'wrapper'        : {
//             'element'        : 'div',
//             'classname'        : 'caroufredsel_wrapper'
//         },
//         'classnames'    : {}
//     };

//     //    scrolling functions
//     CarouFredSel.sc_setScroll = function (d, e) {
//         return {
//             anims        : [],
//             duration    : d,
//             orgDuration    : d,
//             easing        : e,
//             startTime    : this.getTime()
//         };
//     };
//     CarouFredSel.sc_startScroll = function (s) {
//         if (typeof s.pre == 'object') {
//             this.sc_startScroll(s.pre);
//         }
//         for (var a = 0, l = s.anims.length; a < l; a++) {
//             var b = s.anims[a];
//             if (!b) continue;
//             if (b[3]) b[0].stop();
//             b[0].animate(b[1], {
//                 complete: b[2],
//                 duration: s.duration,
//                 easing: s.easing
//             });
//         }
//         if (typeof s.post == 'object') {
//             this.sc_startScroll(s.post);
//         }
//     };
//     CarouFredSel.sc_stopScroll = function (s, finish) {
//         if (typeof finish != 'boolean') finish = true;
//         if (typeof s.pre == 'object') {
//             this.sc_stopScroll(s.pre, finish);
//         }
//         for (var a = 0, l = s.anims.length; a < l; a++) {
//             var b = s.anims[a];
//             b[0].stop(true);
//             if (finish) {
//                 b[0].css(b[1]);
//                 if (typeof b[2] == 'function') b[2]();
//             }
//         }
//         if (typeof s.post == 'object') {
//             this.sc_stopScroll(s.post, finish);
//         }
//     };
//     CarouFredSel.sc_clearTimers = function (t) {
//         if (t.auto) clearTimeout(t.auto);
//         return t;
//     };
//     CarouFredSel.sc_callCallbacks = function (cbs, t, args) {
//         if (cbs.length) {
//             for (var a = 0, l = cbs.length; a < l; a++) {
//                 cbs[a].apply(t, args);
//             }
//         }
//         return [];
//     };

//     //    fx functions
//     CarouFredSel.fx_fade = function (sO, c, x, d, f) {
//         var o = {
//             'duration'    : d,
//             'easing'    : sO.easing
//         };
//         if (typeof f == 'function') o.complete = f;
//         c.animate({
//             opacity: x
//         }, o);
//     };
//     CarouFredSel.fx_cover = function (sc, c1, c2, o, prev) {
//         var old_w = this.ms_getSizes(this.gi_getOldItemsNext(c1.children(), o), o, true)[0],
//             new_w = this.ms_getSizes(c2.children(), o, true)[0],
//             cur_l = (prev) ? -new_w : old_w,
//             css_o = {},
//             ani_o = {};

//         css_o[o.d['width']] = new_w;
//         css_o[o.d['left']] = cur_l;
//         ani_o[o.d['left']] = 0;

//         sc.pre.anims.push([c1, { 'opacity': 1 }]);
//         sc.post.anims.push([c2, ani_o, function() { $(this).remove(); }]);
//         c2.css(css_o);
//         return sc;
//     };
//     CarouFredSel.fx_uncover = function (sc, c1, c2, o, prev, n) {
//         var new_w = this.ms_getSizes(this.gi_getNewItemsNext(c1.children(), o, n), o, true)[0],
//             old_w = this.ms_getSizes(c2.children(), o, true)[0],
//             cur_l = (prev) ? -old_w : new_w,
//             css_o = {},
//             ani_o = {};

//         css_o[o.d['width']] = old_w;
//         css_o[o.d['left']] = 0;
//         ani_o[o.d['left']] = cur_l;
//         sc.post.anims.push([c2, ani_o, function() { $(this).remove(); }]);
//         c2.css(css_o);
//         return sc;
//     };

//     //    navigation functions
//     CarouFredSel.nv_showNavi = function (o, t, c) {
//         if (t == 'show' || t == 'hide') {
//             var f = t;
//         } else if (o.items.minimum >= t) {
//             debug(c, 'Not enough items: hiding navigation ('+t+' items, '+o.items.minimum+' needed).');
//             var f = 'hide';
//         } else {
//             var f = 'show';
//         }
//         var s = (f == 'show') ? 'removeClass' : 'addClass',
//             h = this.cf_c('hidden', c);
//         if (o.auto.button) o.auto.button[f]()[s](h);
//         if (o.prev.button) o.prev.button[f]()[s](h);
//         if (o.next.button) o.next.button[f]()[s](h);
//         if (o.pagination.container) o.pagination.container[f]()[s](h);
//     };
//     CarouFredSel.nv_enableNavi = function (o, f, c) {
//         if (o.circular || o.infinite) return;
//         var fx = (f == 'removeClass' || f == 'addClass') ? f : false,
//             di = this.cf_c('disabled', c);
//         if (o.auto.button && fx) {
//             o.auto.button[fx](di);
//         }
//         if (o.prev.button) {
//             var fn = fx || (f == 0) ? 'addClass' : 'removeClass';
//             o.prev.button[fn](di);
//         }
//         if (o.next.button) {
//             var fn = fx || (f == o.items.visible) ? 'addClass' : 'removeClass';
//             o.next.button[fn](di);
//         }
//     };

//     //    get object functions
//     CarouFredSel.go_getObject = function ($tt, obj) {
//         if (typeof obj == 'function')    obj = obj.call($tt);
//         if (typeof obj == 'undefined')    obj = {};
//         return obj;
//     };
//     CarouFredSel.go_getNaviObject = function ($tt, obj, type) {
//         if (typeof type != 'string') type = '';

//         obj = this.go_getObject($tt, obj);
//         if (typeof obj == 'string') {
//             var temp = this.cf_getKeyCode(obj);
//             if (temp == -1) obj = $(obj);
//             else             obj = temp;
//         }

//         //    pagination
//         if (type == 'pagination') {
//             if (typeof obj                 == 'boolean')    obj = { 'keys': obj };
//             if (typeof obj.jquery         != 'undefined')    obj = { 'container': obj };
//             if (typeof obj.container    == 'function')    obj.container = obj.container.call($tt);
//             if (typeof obj.container    == 'string')    obj.container = $(obj.container);
//             if (typeof obj.items        != 'number')    obj.items = false;

//         //    auto
//         } else if (type == 'auto') {
//             if (typeof obj.jquery    != 'undefined')        obj = { 'button': obj };
//             if (typeof obj == 'boolean')                obj = { 'play': obj };
//             if (typeof obj == 'number')                    obj = { 'pauseDuration': obj };
//             if (typeof obj.button        == 'function')    obj.button = obj.button.call($tt);
//             if (typeof obj.button        == 'string')    obj.button = $(obj.button);

//         //    prev + next
//         } else {
//             if (typeof obj.jquery        != 'undefined')    obj = { 'button': obj };
//             if (typeof obj                 == 'number')    obj = { 'key': obj };
//             if (typeof obj.button        == 'function')    obj.button = obj.button.call($tt);
//             if (typeof obj.button        == 'string')    obj.button = $(obj.button);
//             if (typeof obj.key            == 'string')    obj.key = this.cf_getKeyCode(obj.key);
//         }

//         return obj;
//     };

//     //    get number functions
//     CarouFredSel.gn_getItemIndex = function (num, dev, org, items, $cfs) {
//         if (typeof num == 'string') {
//             if (isNaN(num)) num = $(num);
//             else             num = parseInt(num);
//         }
//         if (typeof num == 'object') {
//             if (typeof num.jquery == 'undefined') num = $(num);
//             num = $cfs.children().index(num);
//             if (num == -1) num = 0;
//             if (typeof org != 'boolean') org = false;
//         } else {
//             if (typeof org != 'boolean') org = true;
//         }
//         if (isNaN(num))    num = 0;
//         else             num = parseInt(num);
//         if (isNaN(dev))    dev = 0;
//         else             dev = parseInt(dev);

//         if (org) {
//             num += items.first;
//         }
//         num += dev;
//         if (items.total > 0) {
//             while (num >= items.total)    {    num -= items.total; }
//             while (num < 0)                {    num += items.total; }
//         }
//         return num;
//     };

//     //    items prev
//     CarouFredSel.gn_getVisibleItemsPrev = function (i, o, s) {
//         var t = 0,
//             x = 0;

//         for (var a = s; a >= 0; a--) {
//             var j = i.eq(a);
//             t += (j.is(':visible')) ? j[o.d['outerWidth']](true) : 0;
//             if (t > o.maxDimention) return x;
//             if (a == 0) a = i.length;
//             x++;
//         }
//     };
//     CarouFredSel.gn_getVisibleItemsPrevFilter = function (i, o, s) {
//         return this.gn_getItemsPrevFilter(i, o.items.filter, o.items.visibleConf.org, s);
//     };
//     CarouFredSel.gn_getScrollItemsPrevFilter = function (i, o, s, m) {
//         return this.gn_getItemsPrevFilter(i, o.items.filter, m, s);
//     };
//     CarouFredSel.gn_getItemsPrevFilter = function (i, f, m, s) {
//         var t = 0,
//             x = 0;

//         for (var a = s, l = i.length-1; a >= 0; a--) {
//             x++;
//             if (x == l) return x;

//             var j = i.eq(a);
//             if (j.is(f)) {
//                 t++;
//                 if (t == m) return x;
//             }
//             if (a == 0) a = i.length;
//         }
//     };

//     CarouFredSel.gn_getVisibleOrg = function ($c, o) {
//         return o.items.visibleConf.org || $c.children().slice(0, o.items.visible).filter(o.items.filter).length;
//     };

//     //    items next
//     CarouFredSel.gn_getVisibleItemsNext = function (i, o, s) {
//         var t = 0,
//             x = 0;

//         for (var a = s, l = i.length-1; a <= l; a++) {
//             var j = i.eq(a);

//             t += (j.is(':visible')) ? j[o.d['outerWidth']](true) : 0;
//             if (t > o.maxDimention) return x;

//             x++;
//             if (x == l) return x;
//             if (a == l) a = -1;
//         }
//     };
//     CarouFredSel.gn_getVisibleItemsNextTestCircular = function (i, o, s, l) {
//         var v = this.gn_getVisibleItemsNext(i, o, s);
//         if (!o.circular) {
//             if (s + v > l) v = l - s;
//         }
//         return v;
//     };
//     CarouFredSel.gn_getVisibleItemsNextFilter = function (i, o, s) {
//         return this.gn_getItemsNextFilter(i, o.items.filter, o.items.visibleConf.org, s, o.circular);
//     };
//     CarouFredSel.gn_getScrollItemsNextFilter = function (i, o, s, m) {
//         return this.gn_getItemsNextFilter(i, o.items.filter, m+1, s, o.circular) - 1;
//     };
//     CarouFredSel.gn_getItemsNextFilter = function (i, f, m, s, c) {
//         var t = 0,
//             x = 0;

//         for (var a = s, l = i.length-1; a <= l; a++) {
//             x++;
//             if (x == l) return x;

//             var j = i.eq(a);
//             if (j.is(f)) {
//                 t++;
//                 if (t == m) return x;
//             }
//             if (a == l) a = -1;
//         }
//     };

//     //    get items functions
//     CarouFredSel.gi_getCurrentItems = function (i, o) {
//         return i.slice(0, o.items.visible);
//     };
//     CarouFredSel.gi_getOldItemsPrev = function (i, o, n) {
//         return i.slice(n, o.items.visibleConf.old+n);
//     };
//     CarouFredSel.gi_getNewItemsPrev = function (i, o) {
//         return i.slice(0, o.items.visible);
//     };
//     CarouFredSel.gi_getOldItemsNext = function (i, o) {
//         return i.slice(0, o.items.visibleConf.old);
//     };
//     CarouFredSel.gi_getNewItemsNext = function (i, o, n) {
//         return i.slice(n, o.items.visible+n);
//     };

//     //    sizes functions
//     CarouFredSel.sz_resetMargin = function (i, o, m) {
//         var x = (typeof m == 'boolean') ? m : false;
//         if (typeof m != 'number') m = 0;
//         i.each(function() {
//             var j = $(this);
//             var t = parseInt(j.css(o.d['marginRight']));
//             if (isNaN(t)) t = 0;
//             j.data('cfs_tempCssMargin', t);
//             j.css(o.d['marginRight'], ((x) ? j.data('cfs_tempCssMargin') : m + j.data('cfs_origCssMargin')));
//         });
//     };
//     CarouFredSel.sz_setSizes = function ($c, o, p) {
//         var $w = $c.parent(),
//             $i = $c.children(),
//             $v = this.gi_getCurrentItems($i, o),
//             sz = this.cf_mapWrapperSizes(this.ms_getSizes($v, o, true), o, p);

//         $w.css(sz);

//         if (o.usePadding) {
//             var p = o.padding,
//                 r = p[o.d[1]];
//             if (o.align) {
//                 if (r < 0) r = 0;
//             }
//             var $l = $v.last();
//             $l.css(o.d['marginRight'], $l.data('cfs_origCssMargin') + r);
//             $c.css(o.d['top'], p[o.d[0]]);
//             $c.css(o.d['left'], p[o.d[3]]);
//         }

//         $c.css(o.d['width'], sz[o.d['width']]+(this.ms_getTotalSize($i, o, 'width')*2));
//         $c.css(o.d['height'], this.ms_getLargestSize($i, o, 'height'));
//         return sz;
//     };

//     //    measuring functions
//     CarouFredSel.ms_getSizes = function (i, o, wrapper) {
//         var s1 = this.ms_getTotalSize(i, o, 'width', wrapper),
//             s2 = this.ms_getLargestSize(i, o, 'height', wrapper);
//         return [s1, s2];
//     };
//     CarouFredSel.ms_getLargestSize = function (i, o, dim, wrapper) {
//         if (typeof wrapper != 'boolean') wrapper = false;
//         if (typeof o[o.d[dim]] == 'number' && wrapper) return o[o.d[dim]];
//         if (typeof o.items[o.d[dim]] == 'number') return o.items[o.d[dim]];
//         var di2 = (dim.toLowerCase().indexOf('width') > -1) ? 'outerWidth' : 'outerHeight';
//         return this.ms_getTrueLargestSize(i, o, di2);
//     };
//     CarouFredSel.ms_getTrueLargestSize = function (i, o, dim) {
//         var s = 0;

//         for (var a = 0, l = i.length; a < l; a++) {
//             var j = i.eq(a);

//             var m = (j.is(':visible')) ? j[o.d[dim]](true) : 0;
//             if (s < m) s = m;
//         }
//         return s;
//     };
//     CarouFredSel.ms_getTrueInnerSize = function ($el, o, dim) {
//         if (!$el.is(':visible')) return 0;

//         var siz = $el[o.d[dim]](),
//             arr = (o.d[dim].toLowerCase().indexOf('width') > -1) ? ['paddingLeft', 'paddingRight'] : ['paddingTop', 'paddingBottom'];

//         for (var a = 0, l = arr.length; a < l; a++) {
//             var m = parseInt($el.css(arr[a]));
//             siz -= (isNaN(m)) ? 0 : m;
//         }
//         return siz;
//     };
//     CarouFredSel.ms_getTotalSize = function (i, o, dim, wrapper) {
//         if (typeof wrapper != 'boolean') wrapper = false;
//         if (typeof o[o.d[dim]] == 'number' && wrapper) return o[o.d[dim]];
//         if (typeof o.items[o.d[dim]] == 'number') return o.items[o.d[dim]] * i.length;

//         var d = (dim.toLowerCase().indexOf('width') > -1) ? 'outerWidth' : 'outerHeight',
//             s = 0;

//         for (var a = 0, l = i.length; a < l; a++) {
//             var j = i.eq(a);
//             s += (j.is(':visible')) ? j[o.d[d]](true) : 0;
//         }
//         return s;
//     };
//     CarouFredSel.ms_hasVariableSizes = function (i, o, dim) {
//         var s = false,
//             v = false;

//         for (var a = 0, l = i.length; a < l; a++) {
//             var j = i.eq(a);

//             var c = (j.is(':visible')) ? j[o.d[dim]](true) : 0;
//             if (s === false) s = c;
//             else if (s != c) v = true;
//             if (s == 0)         v = true;
//         }
//         return v;
//     };
//     CarouFredSel.ms_getPaddingBorderMargin = function (i, o, d) {
//         return i[o.d['outer'+d]](true) - this.ms_getTrueInnerSize(i, o, 'inner'+d);
//     };
//     CarouFredSel.ms_isPercentage = function (x) {
//         return (typeof x == 'string' && x.substr(-1) == '%');
//     };
//     CarouFredSel.ms_getPercentage = function (s, o) {
//         if (this.ms_isPercentage(o)) {
//             o = o.substring(0, o.length-1);
//             if (isNaN(o)) return s;
//             s *= o/100;
//         }
//         return s;
//     };

//     //    config functions
//     CarouFredSel.cf_e = function (n, c, pf, ns, rd) {
//         if (typeof pf != 'boolean') pf = true;
//         if (typeof ns != 'boolean') ns = true;
//         if (typeof rd != 'boolean') rd = false;

//         if (pf) n = c.events.prefix + n;
//         if (ns) n = n +'.'+ c.events.namespace;
//         if (ns && rd) n += c.serialNumber;

//         return n;
//     };
//     CarouFredSel.cf_c = function (n, c) {
//         return (typeof c.classnames[n] == 'string') ? c.classnames[n] : n;
//     };
//     CarouFredSel.cf_mapWrapperSizes = function (ws, o, p) {
//         if (typeof p != 'boolean') p = true;
//         var pad = (o.usePadding && p) ? o.padding : [0, 0, 0, 0];
//         var wra = {};
//             wra[o.d['width']] = ws[0] + pad[1] + pad[3];
//             wra[o.d['height']] = ws[1] + pad[0] + pad[2];

//         return wra;
//     };
//     CarouFredSel.cf_sortParams = function (vals, typs) {
//         var arr = [];
//         for (var a = 0, l1 = vals.length; a < l1; a++) {
//             for (var b = 0, l2 = typs.length; b < l2; b++) {
//                 if (typs[b].indexOf(typeof vals[a]) > -1 && typeof arr[b] == 'undefined') {
//                     arr[b] = vals[a];
//                     break;
//                 }
//             }
//         }
//         return arr;
//     };
//     CarouFredSel.cf_getPadding = function (p) {
//         if (typeof p == 'undefined') return [0, 0, 0, 0];

//         if (typeof p == 'number') return [p, p, p, p];
//         else if (typeof p == 'string') p = p.split('px').join('').split('em').join('').split(' ');

//         if (!$.isArray(p)) {
//             return [0, 0, 0, 0];
//         }
//         for (var i = 0; i < 4; i++) {
//             p[i] = parseInt(p[i]);
//         }
//         switch (p.length) {
//             case 0:    return [0, 0, 0, 0];
//             case 1: return [p[0], p[0], p[0], p[0]];
//             case 2: return [p[0], p[1], p[0], p[1]];
//             case 3: return [p[0], p[1], p[2], p[1]];
//             default: return [p[0], p[1], p[2], p[3]];
//         }
//     };
//     CarouFredSel.cf_getAlignPadding = function (itm, o) {
//         var x = (typeof o[o.d['width']] == 'number') ? Math.ceil(o[o.d['width']] - this.ms_getTotalSize(itm, o, 'width')) : 0;
//         switch (o.align) {
//             case 'left': return [0, x];
//             case 'right': return [x, 0];
//             case 'center':
//             default:
//                 return [Math.ceil(x/2), Math.floor(x/2)];
//         }
//     };
//     CarouFredSel.cf_getAdjust = function (x, o, a, $t) {
//         var v = x;
//         if (typeof a == 'function') {
//             v = a.call($t, v);

//         } else if (typeof a == 'string') {
//             var p = a.split('+'),
//                 m = a.split('-');

//             if (m.length > p.length) {
//                 var neg = true,
//                     sta = m[0],
//                     adj = m[1];
//             } else {
//                 var neg = false,
//                     sta = p[0],
//                     adj = p[1];
//             }

//             switch(sta) {
//                 case 'even':
//                     v = (x % 2 == 1) ? x-1 : x;
//                     break;
//                 case 'odd':
//                     v = (x % 2 == 0) ? x-1 : x;
//                     break;
//                 default:
//                     v = x;
//                     break;
//             }
//             adj = parseInt(adj);
//             if (!isNaN(adj)) {
//                 if (neg) adj = -adj;
//                 v += adj;
//             }
//         }
//         if (typeof v != 'number') v = 1;
//         if (v < 1) v = 1;
//         return v;
//     };
//     CarouFredSel.cf_getItemsAdjust = function (x, o, a, $t) {
//         return this.cf_getItemAdjustMinMax(this.cf_getAdjust(x, o, a, $t), o.items.visibleConf);
//     };
//     CarouFredSel.cf_getItemAdjustMinMax = function (v, i) {
//         if (typeof i.min == 'number' && v < i.min) v = i.min;
//         if (typeof i.max == 'number' && v > i.max) v = i.max;
//         if (v < 1) v = 1;
//         return v;
//     };
//     CarouFredSel.cf_getSynchArr = function (s) {
//         if (!$.isArray(s))         s = [[s]];
//         if (!$.isArray(s[0]))    s = [s];
//         for (var j = 0, l = s.length; j < l; j++) {
//             if (typeof s[j][0] == 'string')        s[j][0] = $(s[j][0]);
//             if (typeof s[j][1] != 'boolean')    s[j][1] = true;
//             if (typeof s[j][2] != 'boolean')    s[j][2] = true;
//             if (typeof s[j][3] != 'number')        s[j][3] = 0;
//         }
//         return s;
//     };
//     CarouFredSel.cf_getKeyCode = function (k) {
//         if (k == 'right')    return 39;
//         if (k == 'left')    return 37;
//         if (k == 'up')        return 38;
//         if (k == 'down')    return 40;
//         return -1;
//     };
//     CarouFredSel.cf_setCookie = function (n, v) {
//         if (n) document.cookie = n+'='+v+'; path=/';
//     };
//     CarouFredSel.cf_readCookie = function (n) {
//         n += '=';
//         var ca = document.cookie.split(';');
//         for (var a = 0, l = ca.length; a < l; a++) {
//             var c = ca[a];
//             while (c.charAt(0) == ' ') {
//                 c = c.substring(1, c.length);
//             }
//             if (c.indexOf(n) == 0) {
//                 return c.substring(n.length, c.length);
//             }
//         }
//         return 0;
//     };

//     //    buttons functions
//     CarouFredSel.bt_pauseOnHoverConfig = function (p) {
//         if (p && typeof p == 'string') {
//             var i = (p.indexOf('immediate') > -1) ? true : false,
//                 r = (p.indexOf('resume')     > -1) ? true : false;
//         } else {
//             var i = r = false;
//         }
//         return [i, r];
//     };
//     CarouFredSel.bt_mousesheelNumber = function (mw) {
//         return (typeof mw == 'number') ? mw : null
//     };

//     CarouFredSel.pageAnchorBuilder = function(nr, itm) {
//         return '<a href="#"><span>'+nr+'</span></a>';
//     };

//     CarouFredSel.getTime = function () {
//         return new Date().getTime();
//     };

//     function debug(d, m) {
//         if (typeof d == 'object') {
//             var s = ' ('+d.selector+')';
//             d = d.debug;
//         } else {
//             var s = '';
//         }
//         if (!d) return false;

//         if (typeof m == 'string') m = 'carouFredSel'+s+': ' + m;
//         else m = ['carouFredSel'+s+':', m];

//         if (window.console && window.console.log) window.console.log(m);
//         return false;
//     }

//     //    EASING FUNCTIONS

//     $.extend($.easing, {
//         'quadratic'    : function(t) {
//             var t2 = t * t;
//             return t * (-t2 * t + 4 * t2 - 6 * t + 4);
//         },
//         'cubic'        : function(t) {
//             return t * (4 * t * t - 9 * t + 6);
//         },
//         'elastic'    : function(t) {
//             var t2 = t * t;
//             return t * (33 * t2 * t2 - 106 * t2 * t + 126 * t2 - 67 * t + 15);
//         }
//     });

// })(jQuery);
