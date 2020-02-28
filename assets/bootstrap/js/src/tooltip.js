var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import $ from 'jquery';
import Popper from 'popper.js';
import Util from './util';
var ɵ0 = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'tooltip';
    var VERSION = '4.0.0';
    var DATA_KEY = 'bs.tooltip';
    var EVENT_KEY = "." + DATA_KEY;
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var TRANSITION_DURATION = 150;
    var CLASS_PREFIX = 'bs-tooltip';
    var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');
    var DefaultType = {
        animation: 'boolean',
        template: 'string',
        title: '(string|element|function)',
        trigger: 'string',
        delay: '(number|object)',
        html: 'boolean',
        selector: '(string|boolean)',
        placement: '(string|function)',
        offset: '(number|string)',
        container: '(string|element|boolean)',
        fallbackPlacement: '(string|array)',
        boundary: '(string|element)'
    };
    var AttachmentMap = {
        AUTO: 'auto',
        TOP: 'top',
        RIGHT: 'right',
        BOTTOM: 'bottom',
        LEFT: 'left'
    };
    var Default = {
        animation: true,
        template: '<div class="tooltip" role="tooltip">' +
            '<div class="arrow"></div>' +
            '<div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        selector: false,
        placement: 'top',
        offset: 0,
        container: false,
        fallbackPlacement: 'flip',
        boundary: 'scrollParent'
    };
    var HoverState = {
        SHOW: 'show',
        OUT: 'out'
    };
    var Event = {
        HIDE: "hide" + EVENT_KEY,
        HIDDEN: "hidden" + EVENT_KEY,
        SHOW: "show" + EVENT_KEY,
        SHOWN: "shown" + EVENT_KEY,
        INSERTED: "inserted" + EVENT_KEY,
        CLICK: "click" + EVENT_KEY,
        FOCUSIN: "focusin" + EVENT_KEY,
        FOCUSOUT: "focusout" + EVENT_KEY,
        MOUSEENTER: "mouseenter" + EVENT_KEY,
        MOUSELEAVE: "mouseleave" + EVENT_KEY
    };
    var ClassName = {
        FADE: 'fade',
        SHOW: 'show'
    };
    var Selector = {
        TOOLTIP: '.tooltip',
        TOOLTIP_INNER: '.tooltip-inner',
        ARROW: '.arrow'
    };
    var Trigger = {
        HOVER: 'hover',
        FOCUS: 'focus',
        CLICK: 'click',
        MANUAL: 'manual'
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
    var Tooltip = (function () {
        function Tooltip(element, config) {
            /**
             * Check for Popper dependency
             * Popper - https://popper.js.org
             */
            if (typeof Popper === 'undefined') {
                throw new TypeError('Bootstrap tooltips require Popper.js (https://popper.js.org)');
            }
            // private
            this._isEnabled = true;
            this._timeout = 0;
            this._hoverState = '';
            this._activeTrigger = {};
            this._popper = null;
            // Protected
            this.element = element;
            this.config = this._getConfig(config);
            this.tip = null;
            this._setListeners();
        }
        Object.defineProperty(Tooltip, "VERSION", {
            // Getters
            get: function () {
                return VERSION;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tooltip, "Default", {
            get: function () {
                return Default;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tooltip, "NAME", {
            get: function () {
                return NAME;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tooltip, "DATA_KEY", {
            get: function () {
                return DATA_KEY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tooltip, "Event", {
            get: function () {
                return Event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tooltip, "EVENT_KEY", {
            get: function () {
                return EVENT_KEY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tooltip, "DefaultType", {
            get: function () {
                return DefaultType;
            },
            enumerable: true,
            configurable: true
        });
        // Public
        Tooltip.prototype.enable = function () {
            this._isEnabled = true;
        };
        Tooltip.prototype.disable = function () {
            this._isEnabled = false;
        };
        Tooltip.prototype.toggleEnabled = function () {
            this._isEnabled = !this._isEnabled;
        };
        Tooltip.prototype.toggle = function (event) {
            if (!this._isEnabled) {
                return;
            }
            if (event) {
                var dataKey = this.constructor.DATA_KEY;
                var context = $(event.currentTarget).data(dataKey);
                if (!context) {
                    context = new this.constructor(event.currentTarget, this._getDelegateConfig());
                    $(event.currentTarget).data(dataKey, context);
                }
                context._activeTrigger.click = !context._activeTrigger.click;
                if (context._isWithActiveTrigger()) {
                    context._enter(null, context);
                }
                else {
                    context._leave(null, context);
                }
            }
            else {
                if ($(this.getTipElement()).hasClass(ClassName.SHOW)) {
                    this._leave(null, this);
                    return;
                }
                this._enter(null, this);
            }
        };
        Tooltip.prototype.dispose = function () {
            clearTimeout(this._timeout);
            $.removeData(this.element, this.constructor.DATA_KEY);
            $(this.element).off(this.constructor.EVENT_KEY);
            $(this.element).closest('.modal').off('hide.bs.modal');
            if (this.tip) {
                $(this.tip).remove();
            }
            this._isEnabled = null;
            this._timeout = null;
            this._hoverState = null;
            this._activeTrigger = null;
            if (this._popper !== null) {
                this._popper.destroy();
            }
            this._popper = null;
            this.element = null;
            this.config = null;
            this.tip = null;
        };
        Tooltip.prototype.show = function () {
            var _this = this;
            if ($(this.element).css('display') === 'none') {
                throw new Error('Please use show on visible elements');
            }
            var showEvent = $.Event(this.constructor.Event.SHOW);
            if (this.isWithContent() && this._isEnabled) {
                $(this.element).trigger(showEvent);
                var isInTheDom = $.contains(this.element.ownerDocument.documentElement, this.element);
                if (showEvent.isDefaultPrevented() || !isInTheDom) {
                    return;
                }
                var tip = this.getTipElement();
                var tipId = Util.getUID(this.constructor.NAME);
                tip.setAttribute('id', tipId);
                this.element.setAttribute('aria-describedby', tipId);
                this.setContent();
                if (this.config.animation) {
                    $(tip).addClass(ClassName.FADE);
                }
                var placement = typeof this.config.placement === 'function'
                    ? this.config.placement.call(this, tip, this.element)
                    : this.config.placement;
                var attachment = this._getAttachment(placement);
                this.addAttachmentClass(attachment);
                var container = this.config.container === false ? document.body : $(this.config.container);
                $(tip).data(this.constructor.DATA_KEY, this);
                if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
                    $(tip).appendTo(container);
                }
                $(this.element).trigger(this.constructor.Event.INSERTED);
                this._popper = new Popper(this.element, tip, {
                    placement: attachment,
                    modifiers: {
                        offset: {
                            offset: this.config.offset
                        },
                        flip: {
                            behavior: this.config.fallbackPlacement
                        },
                        arrow: {
                            element: Selector.ARROW
                        },
                        preventOverflow: {
                            boundariesElement: this.config.boundary
                        }
                    },
                    onCreate: function (data) {
                        if (data.originalPlacement !== data.placement) {
                            _this._handlePopperPlacementChange(data);
                        }
                    },
                    onUpdate: function (data) {
                        _this._handlePopperPlacementChange(data);
                    }
                });
                $(tip).addClass(ClassName.SHOW);
                // If this is a touch-enabled device we add extra
                // empty mouseover listeners to the body's immediate children;
                // only needed because of broken event delegation on iOS
                // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
                if ('ontouchstart' in document.documentElement) {
                    $('body').children().on('mouseover', null, $.noop);
                }
                var complete = function () {
                    if (_this.config.animation) {
                        _this._fixTransition();
                    }
                    var prevHoverState = _this._hoverState;
                    _this._hoverState = null;
                    $(_this.element).trigger(_this.constructor.Event.SHOWN);
                    if (prevHoverState === HoverState.OUT) {
                        _this._leave(null, _this);
                    }
                };
                if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {
                    $(this.tip)
                        .one(Util.TRANSITION_END, complete)
                        .emulateTransitionEnd(Tooltip._TRANSITION_DURATION);
                }
                else {
                    complete();
                }
            }
        };
        Tooltip.prototype.hide = function (callback) {
            var _this = this;
            var tip = this.getTipElement();
            var hideEvent = $.Event(this.constructor.Event.HIDE);
            var complete = function () {
                if (_this._hoverState !== HoverState.SHOW && tip.parentNode) {
                    tip.parentNode.removeChild(tip);
                }
                _this._cleanTipClass();
                _this.element.removeAttribute('aria-describedby');
                $(_this.element).trigger(_this.constructor.Event.HIDDEN);
                if (_this._popper !== null) {
                    _this._popper.destroy();
                }
                if (callback) {
                    callback();
                }
            };
            $(this.element).trigger(hideEvent);
            if (hideEvent.isDefaultPrevented()) {
                return;
            }
            $(tip).removeClass(ClassName.SHOW);
            // If this is a touch-enabled device we remove the extra
            // empty mouseover listeners we added for iOS support
            if ('ontouchstart' in document.documentElement) {
                $('body').children().off('mouseover', null, $.noop);
            }
            this._activeTrigger[Trigger.CLICK] = false;
            this._activeTrigger[Trigger.FOCUS] = false;
            this._activeTrigger[Trigger.HOVER] = false;
            if (Util.supportsTransitionEnd() &&
                $(this.tip).hasClass(ClassName.FADE)) {
                $(tip)
                    .one(Util.TRANSITION_END, complete)
                    .emulateTransitionEnd(TRANSITION_DURATION);
            }
            else {
                complete();
            }
            this._hoverState = '';
        };
        Tooltip.prototype.update = function () {
            if (this._popper !== null) {
                this._popper.scheduleUpdate();
            }
        };
        // Protected
        Tooltip.prototype.isWithContent = function () {
            return Boolean(this.getTitle());
        };
        Tooltip.prototype.addAttachmentClass = function (attachment) {
            $(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
        };
        Tooltip.prototype.getTipElement = function () {
            this.tip = this.tip || $(this.config.template)[0];
            return this.tip;
        };
        Tooltip.prototype.setContent = function () {
            var $tip = $(this.getTipElement());
            this.setElementContent($tip.find(Selector.TOOLTIP_INNER), this.getTitle());
            $tip.removeClass(ClassName.FADE + " " + ClassName.SHOW);
        };
        Tooltip.prototype.setElementContent = function ($element, content) {
            var html = this.config.html;
            if (typeof content === 'object' && (content.nodeType || content.jquery)) {
                // Content is a DOM node or a jQuery
                if (html) {
                    if (!$(content).parent().is($element)) {
                        $element.empty().append(content);
                    }
                }
                else {
                    $element.text($(content).text());
                }
            }
            else {
                $element[html ? 'html' : 'text'](content);
            }
        };
        Tooltip.prototype.getTitle = function () {
            var title = this.element.getAttribute('data-original-title');
            if (!title) {
                title = typeof this.config.title === 'function'
                    ? this.config.title.call(this.element)
                    : this.config.title;
            }
            return title;
        };
        // Private
        Tooltip.prototype._getAttachment = function (placement) {
            return AttachmentMap[placement.toUpperCase()];
        };
        Tooltip.prototype._setListeners = function () {
            var _this = this;
            var triggers = this.config.trigger.split(' ');
            triggers.forEach(function (trigger) {
                if (trigger === 'click') {
                    $(_this.element).on(_this.constructor.Event.CLICK, _this.config.selector, function (event) { return _this.toggle(event); });
                }
                else if (trigger !== Trigger.MANUAL) {
                    var eventIn = trigger === Trigger.HOVER
                        ? _this.constructor.Event.MOUSEENTER
                        : _this.constructor.Event.FOCUSIN;
                    var eventOut = trigger === Trigger.HOVER
                        ? _this.constructor.Event.MOUSELEAVE
                        : _this.constructor.Event.FOCUSOUT;
                    $(_this.element)
                        .on(eventIn, _this.config.selector, function (event) { return _this._enter(event); })
                        .on(eventOut, _this.config.selector, function (event) { return _this._leave(event); });
                }
                $(_this.element).closest('.modal').on('hide.bs.modal', function () { return _this.hide(); });
            });
            if (this.config.selector) {
                this.config = __assign({}, this.config, { trigger: 'manual', selector: '' });
            }
            else {
                this._fixTitle();
            }
        };
        Tooltip.prototype._fixTitle = function () {
            var titleType = typeof this.element.getAttribute('data-original-title');
            if (this.element.getAttribute('title') ||
                titleType !== 'string') {
                this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
                this.element.setAttribute('title', '');
            }
        };
        Tooltip.prototype._enter = function (event, context) {
            var dataKey = this.constructor.DATA_KEY;
            context = context || $(event.currentTarget).data(dataKey);
            if (!context) {
                context = new this.constructor(event.currentTarget, this._getDelegateConfig());
                $(event.currentTarget).data(dataKey, context);
            }
            if (event) {
                context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
            }
            if ($(context.getTipElement()).hasClass(ClassName.SHOW) ||
                context._hoverState === HoverState.SHOW) {
                context._hoverState = HoverState.SHOW;
                return;
            }
            clearTimeout(context._timeout);
            context._hoverState = HoverState.SHOW;
            if (!context.config.delay || !context.config.delay.show) {
                context.show();
                return;
            }
            context._timeout = setTimeout(function () {
                if (context._hoverState === HoverState.SHOW) {
                    context.show();
                }
            }, context.config.delay.show);
        };
        Tooltip.prototype._leave = function (event, context) {
            var dataKey = this.constructor.DATA_KEY;
            context = context || $(event.currentTarget).data(dataKey);
            if (!context) {
                context = new this.constructor(event.currentTarget, this._getDelegateConfig());
                $(event.currentTarget).data(dataKey, context);
            }
            if (event) {
                context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
            }
            if (context._isWithActiveTrigger()) {
                return;
            }
            clearTimeout(context._timeout);
            context._hoverState = HoverState.OUT;
            if (!context.config.delay || !context.config.delay.hide) {
                context.hide();
                return;
            }
            context._timeout = setTimeout(function () {
                if (context._hoverState === HoverState.OUT) {
                    context.hide();
                }
            }, context.config.delay.hide);
        };
        Tooltip.prototype._isWithActiveTrigger = function () {
            for (var trigger in this._activeTrigger) {
                if (this._activeTrigger[trigger]) {
                    return true;
                }
            }
            return false;
        };
        Tooltip.prototype._getConfig = function (config) {
            config = __assign({}, this.constructor.Default, $(this.element).data(), config);
            if (typeof config.delay === 'number') {
                config.delay = {
                    show: config.delay,
                    hide: config.delay
                };
            }
            if (typeof config.title === 'number') {
                config.title = config.title.toString();
            }
            if (typeof config.content === 'number') {
                config.content = config.content.toString();
            }
            Util.typeCheckConfig(NAME, config, this.constructor.DefaultType);
            return config;
        };
        Tooltip.prototype._getDelegateConfig = function () {
            var config = {};
            if (this.config) {
                for (var key in this.config) {
                    if (this.constructor.Default[key] !== this.config[key]) {
                        config[key] = this.config[key];
                    }
                }
            }
            return config;
        };
        Tooltip.prototype._cleanTipClass = function () {
            var $tip = $(this.getTipElement());
            var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);
            if (tabClass !== null && tabClass.length > 0) {
                $tip.removeClass(tabClass.join(''));
            }
        };
        Tooltip.prototype._handlePopperPlacementChange = function (data) {
            this._cleanTipClass();
            this.addAttachmentClass(this._getAttachment(data.placement));
        };
        Tooltip.prototype._fixTransition = function () {
            var tip = this.getTipElement();
            var initConfigAnimation = this.config.animation;
            if (tip.getAttribute('x-placement') !== null) {
                return;
            }
            $(tip).removeClass(ClassName.FADE);
            this.config.animation = false;
            this.hide();
            this.show();
            this.config.animation = initConfigAnimation;
        };
        // Static
        Tooltip._jQueryInterface = function (config) {
            return this.each(function () {
                var data = $(this).data(DATA_KEY);
                var _config = typeof config === 'object' && config;
                if (!data && /dispose|hide/.test(config)) {
                    return;
                }
                if (!data) {
                    data = new Tooltip(this, _config);
                    $(this).data(DATA_KEY, data);
                }
                if (typeof config === 'string') {
                    if (typeof data[config] === 'undefined') {
                        throw new TypeError("No method named \"" + config + "\"");
                    }
                    data[config]();
                }
            });
        };
        return Tooltip;
    }());
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */
    $.fn[NAME] = Tooltip._jQueryInterface;
    $.fn[NAME].Constructor = Tooltip;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return Tooltip._jQueryInterface;
    };
    return Tooltip;
};
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
var Tooltip = (ɵ0)($, Popper);
export default Tooltip;
export { ɵ0 };
