var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import $ from 'jquery';
import Util from './util';
var ɵ0 = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'modal';
    var VERSION = '4.0.0';
    var DATA_KEY = 'bs.modal';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var TRANSITION_DURATION = 300;
    var BACKDROP_TRANSITION_DURATION = 150;
    var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key
    var Default = {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: true
    };
    var DefaultType = {
        backdrop: '(boolean|string)',
        keyboard: 'boolean',
        focus: 'boolean',
        show: 'boolean'
    };
    var Event = {
        HIDE: "hide" + EVENT_KEY,
        HIDDEN: "hidden" + EVENT_KEY,
        SHOW: "show" + EVENT_KEY,
        SHOWN: "shown" + EVENT_KEY,
        FOCUSIN: "focusin" + EVENT_KEY,
        RESIZE: "resize" + EVENT_KEY,
        CLICK_DISMISS: "click.dismiss" + EVENT_KEY,
        KEYDOWN_DISMISS: "keydown.dismiss" + EVENT_KEY,
        MOUSEUP_DISMISS: "mouseup.dismiss" + EVENT_KEY,
        MOUSEDOWN_DISMISS: "mousedown.dismiss" + EVENT_KEY,
        CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
    };
    var ClassName = {
        SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
        BACKDROP: 'modal-backdrop',
        OPEN: 'modal-open',
        FADE: 'fade',
        SHOW: 'show'
    };
    var Selector = {
        DIALOG: '.modal-dialog',
        DATA_TOGGLE: '[data-toggle="modal"]',
        DATA_DISMISS: '[data-dismiss="modal"]',
        FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
        STICKY_CONTENT: '.sticky-top',
        NAVBAR_TOGGLER: '.navbar-toggler'
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
    var Modal = (function () {
        function Modal(element, config) {
            this._config = this._getConfig(config);
            this._element = element;
            this._dialog = $(element).find(Selector.DIALOG)[0];
            this._backdrop = null;
            this._isShown = false;
            this._isBodyOverflowing = false;
            this._ignoreBackdropClick = false;
            this._originalBodyPadding = 0;
            this._scrollbarWidth = 0;
        }
        Object.defineProperty(Modal, "VERSION", {
            // Getters
            get: function () {
                return VERSION;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Modal, "Default", {
            get: function () {
                return Default;
            },
            enumerable: true,
            configurable: true
        });
        // Public
        Modal.prototype.toggle = function (relatedTarget) {
            return this._isShown ? this.hide() : this.show(relatedTarget);
        };
        Modal.prototype.show = function (relatedTarget) {
            var _this = this;
            if (this._isTransitioning || this._isShown) {
                return;
            }
            if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE)) {
                this._isTransitioning = true;
            }
            var showEvent = $.Event(Event.SHOW, {
                relatedTarget: relatedTarget
            });
            $(this._element).trigger(showEvent);
            if (this._isShown || showEvent.isDefaultPrevented()) {
                return;
            }
            this._isShown = true;
            this._checkScrollbar();
            this._setScrollbar();
            this._adjustDialog();
            $(document.body).addClass(ClassName.OPEN);
            this._setEscapeEvent();
            this._setResizeEvent();
            $(this._element).on(Event.CLICK_DISMISS, Selector.DATA_DISMISS, function (event) { return _this.hide(event); });
            $(this._dialog).on(Event.MOUSEDOWN_DISMISS, function () {
                $(_this._element).one(Event.MOUSEUP_DISMISS, function (event) {
                    if ($(event.target).is(_this._element)) {
                        _this._ignoreBackdropClick = true;
                    }
                });
            });
            this._showBackdrop(function () { return _this._showElement(relatedTarget); });
        };
        Modal.prototype.hide = function (event) {
            var _this = this;
            if (event) {
                event.preventDefault();
            }
            if (this._isTransitioning || !this._isShown) {
                return;
            }
            var hideEvent = $.Event(Event.HIDE);
            $(this._element).trigger(hideEvent);
            if (!this._isShown || hideEvent.isDefaultPrevented()) {
                return;
            }
            this._isShown = false;
            var transition = Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE);
            if (transition) {
                this._isTransitioning = true;
            }
            this._setEscapeEvent();
            this._setResizeEvent();
            $(document).off(Event.FOCUSIN);
            $(this._element).removeClass(ClassName.SHOW);
            $(this._element).off(Event.CLICK_DISMISS);
            $(this._dialog).off(Event.MOUSEDOWN_DISMISS);
            if (transition) {
                $(this._element)
                    .one(Util.TRANSITION_END, function (event) { return _this._hideModal(event); })
                    .emulateTransitionEnd(TRANSITION_DURATION);
            }
            else {
                this._hideModal();
            }
        };
        Modal.prototype.dispose = function () {
            $.removeData(this._element, DATA_KEY);
            $(window, document, this._element, this._backdrop).off(EVENT_KEY);
            this._config = null;
            this._element = null;
            this._dialog = null;
            this._backdrop = null;
            this._isShown = null;
            this._isBodyOverflowing = null;
            this._ignoreBackdropClick = null;
            this._scrollbarWidth = null;
        };
        Modal.prototype.handleUpdate = function () {
            this._adjustDialog();
        };
        // Private
        Modal.prototype._getConfig = function (config) {
            config = __assign({}, Default, config);
            Util.typeCheckConfig(NAME, config, DefaultType);
            return config;
        };
        Modal.prototype._showElement = function (relatedTarget) {
            var _this = this;
            var transition = Util.supportsTransitionEnd() &&
                $(this._element).hasClass(ClassName.FADE);
            if (!this._element.parentNode ||
                this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
                // Don't move modal's DOM position
                document.body.appendChild(this._element);
            }
            this._element.style.display = 'block';
            this._element.removeAttribute('aria-hidden');
            this._element.scrollTop = 0;
            if (transition) {
                Util.reflow(this._element);
            }
            $(this._element).addClass(ClassName.SHOW);
            if (this._config.focus) {
                this._enforceFocus();
            }
            var shownEvent = $.Event(Event.SHOWN, {
                relatedTarget: relatedTarget
            });
            var transitionComplete = function () {
                if (_this._config.focus) {
                    _this._element.focus();
                }
                _this._isTransitioning = false;
                $(_this._element).trigger(shownEvent);
            };
            if (transition) {
                $(this._dialog)
                    .one(Util.TRANSITION_END, transitionComplete)
                    .emulateTransitionEnd(TRANSITION_DURATION);
            }
            else {
                transitionComplete();
            }
        };
        Modal.prototype._enforceFocus = function () {
            var _this = this;
            $(document)
                .off(Event.FOCUSIN) // Guard against infinite focus loop
                .on(Event.FOCUSIN, function (event) {
                if (document !== event.target &&
                    _this._element !== event.target &&
                    $(_this._element).has(event.target).length === 0) {
                    _this._element.focus();
                }
            });
        };
        Modal.prototype._setEscapeEvent = function () {
            var _this = this;
            if (this._isShown && this._config.keyboard) {
                $(this._element).on(Event.KEYDOWN_DISMISS, function (event) {
                    if (event.which === ESCAPE_KEYCODE) {
                        event.preventDefault();
                        _this.hide();
                    }
                });
            }
            else if (!this._isShown) {
                $(this._element).off(Event.KEYDOWN_DISMISS);
            }
        };
        Modal.prototype._setResizeEvent = function () {
            var _this = this;
            if (this._isShown) {
                $(window).on(Event.RESIZE, function (event) { return _this.handleUpdate(event); });
            }
            else {
                $(window).off(Event.RESIZE);
            }
        };
        Modal.prototype._hideModal = function () {
            var _this = this;
            this._element.style.display = 'none';
            this._element.setAttribute('aria-hidden', true);
            this._isTransitioning = false;
            this._showBackdrop(function () {
                $(document.body).removeClass(ClassName.OPEN);
                _this._resetAdjustments();
                _this._resetScrollbar();
                $(_this._element).trigger(Event.HIDDEN);
            });
        };
        Modal.prototype._removeBackdrop = function () {
            if (this._backdrop) {
                $(this._backdrop).remove();
                this._backdrop = null;
            }
        };
        Modal.prototype._showBackdrop = function (callback) {
            var _this = this;
            var animate = $(this._element).hasClass(ClassName.FADE)
                ? ClassName.FADE : '';
            if (this._isShown && this._config.backdrop) {
                var doAnimate = Util.supportsTransitionEnd() && animate;
                this._backdrop = document.createElement('div');
                this._backdrop.className = ClassName.BACKDROP;
                if (animate) {
                    $(this._backdrop).addClass(animate);
                }
                $(this._backdrop).appendTo(document.body);
                $(this._element).on(Event.CLICK_DISMISS, function (event) {
                    if (_this._ignoreBackdropClick) {
                        _this._ignoreBackdropClick = false;
                        return;
                    }
                    if (event.target !== event.currentTarget) {
                        return;
                    }
                    if (_this._config.backdrop === 'static') {
                        _this._element.focus();
                    }
                    else {
                        _this.hide();
                    }
                });
                if (doAnimate) {
                    Util.reflow(this._backdrop);
                }
                $(this._backdrop).addClass(ClassName.SHOW);
                if (!callback) {
                    return;
                }
                if (!doAnimate) {
                    callback();
                    return;
                }
                $(this._backdrop)
                    .one(Util.TRANSITION_END, callback)
                    .emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
            }
            else if (!this._isShown && this._backdrop) {
                $(this._backdrop).removeClass(ClassName.SHOW);
                var callbackRemove = function () {
                    _this._removeBackdrop();
                    if (callback) {
                        callback();
                    }
                };
                if (Util.supportsTransitionEnd() &&
                    $(this._element).hasClass(ClassName.FADE)) {
                    $(this._backdrop)
                        .one(Util.TRANSITION_END, callbackRemove)
                        .emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
                }
                else {
                    callbackRemove();
                }
            }
            else if (callback) {
                callback();
            }
        };
        // ----------------------------------------------------------------------
        // the following methods are used to handle overflowing modals
        // todo (fat): these should probably be refactored out of modal.js
        // ----------------------------------------------------------------------
        Modal.prototype._adjustDialog = function () {
            var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
            if (!this._isBodyOverflowing && isModalOverflowing) {
                this._element.style.paddingLeft = this._scrollbarWidth + "px";
            }
            if (this._isBodyOverflowing && !isModalOverflowing) {
                this._element.style.paddingRight = this._scrollbarWidth + "px";
            }
        };
        Modal.prototype._resetAdjustments = function () {
            this._element.style.paddingLeft = '';
            this._element.style.paddingRight = '';
        };
        Modal.prototype._checkScrollbar = function () {
            var rect = document.body.getBoundingClientRect();
            this._isBodyOverflowing = rect.left + rect.right < window.innerWidth;
            this._scrollbarWidth = this._getScrollbarWidth();
        };
        Modal.prototype._setScrollbar = function () {
            var _this = this;
            if (this._isBodyOverflowing) {
                // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
                //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
                // Adjust fixed content padding
                $(Selector.FIXED_CONTENT).each(function (index, element) {
                    var actualPadding = $(element)[0].style.paddingRight;
                    var calculatedPadding = $(element).css('padding-right');
                    $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this._scrollbarWidth + "px");
                });
                // Adjust sticky content margin
                $(Selector.STICKY_CONTENT).each(function (index, element) {
                    var actualMargin = $(element)[0].style.marginRight;
                    var calculatedMargin = $(element).css('margin-right');
                    $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - _this._scrollbarWidth + "px");
                });
                // Adjust navbar-toggler margin
                $(Selector.NAVBAR_TOGGLER).each(function (index, element) {
                    var actualMargin = $(element)[0].style.marginRight;
                    var calculatedMargin = $(element).css('margin-right');
                    $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) + _this._scrollbarWidth + "px");
                });
                // Adjust body padding
                var actualPadding = document.body.style.paddingRight;
                var calculatedPadding = $('body').css('padding-right');
                $('body').data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + "px");
            }
        };
        Modal.prototype._resetScrollbar = function () {
            // Restore fixed content padding
            $(Selector.FIXED_CONTENT).each(function (index, element) {
                var padding = $(element).data('padding-right');
                if (typeof padding !== 'undefined') {
                    $(element).css('padding-right', padding).removeData('padding-right');
                }
            });
            // Restore sticky content and navbar-toggler margin
            $(Selector.STICKY_CONTENT + ", " + Selector.NAVBAR_TOGGLER).each(function (index, element) {
                var margin = $(element).data('margin-right');
                if (typeof margin !== 'undefined') {
                    $(element).css('margin-right', margin).removeData('margin-right');
                }
            });
            // Restore body padding
            var padding = $('body').data('padding-right');
            if (typeof padding !== 'undefined') {
                $('body').css('padding-right', padding).removeData('padding-right');
            }
        };
        Modal.prototype._getScrollbarWidth = function () {
            var scrollDiv = document.createElement('div');
            scrollDiv.className = ClassName.SCROLLBAR_MEASURER;
            document.body.appendChild(scrollDiv);
            var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            return scrollbarWidth;
        };
        // Static
        Modal._jQueryInterface = function (config, relatedTarget) {
            return this.each(function () {
                var data = $(this).data(DATA_KEY);
                var _config = __assign({}, Modal.Default, $(this).data(), typeof config === 'object' && config);
                if (!data) {
                    data = new Modal(this, _config);
                    $(this).data(DATA_KEY, data);
                }
                if (typeof config === 'string') {
                    if (typeof data[config] === 'undefined') {
                        throw new TypeError("No method named \"" + config + "\"");
                    }
                    data[config](relatedTarget);
                }
                else if (_config.show) {
                    data.show(relatedTarget);
                }
            });
        };
        return Modal;
    }());
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
    $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
        var _this = this;
        var target;
        var selector = Util.getSelectorFromElement(this);
        if (selector) {
            target = $(selector)[0];
        }
        var config = $(target).data(DATA_KEY)
            ? 'toggle' : __assign({}, $(target).data(), $(this).data());
        if (this.tagName === 'A' || this.tagName === 'AREA') {
            event.preventDefault();
        }
        var $target = $(target).one(Event.SHOW, function (showEvent) {
            if (showEvent.isDefaultPrevented()) {
                // Only register focus restorer if modal will actually get shown
                return;
            }
            $target.one(Event.HIDDEN, function () {
                if ($(_this).is(':visible')) {
                    _this.focus();
                }
            });
        });
        Modal._jQueryInterface.call($(target), config, this);
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */
    $.fn[NAME] = Modal._jQueryInterface;
    $.fn[NAME].Constructor = Modal;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return Modal._jQueryInterface;
    };
    return Modal;
};
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
var Modal = (ɵ0)($);
export default Modal;
export { ɵ0 };
