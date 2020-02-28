import $ from 'jquery';
import Util from './util';
var ɵ0 = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'alert';
    var VERSION = '4.0.0';
    var DATA_KEY = 'bs.alert';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var TRANSITION_DURATION = 150;
    var Selector = {
        DISMISS: '[data-dismiss="alert"]'
    };
    var Event = {
        CLOSE: "close" + EVENT_KEY,
        CLOSED: "closed" + EVENT_KEY,
        CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
    };
    var ClassName = {
        ALERT: 'alert',
        FADE: 'fade',
        SHOW: 'show'
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
    var Alert = (function () {
        function Alert(element) {
            this._element = element;
        }
        Object.defineProperty(Alert, "VERSION", {
            // Getters
            get: function () {
                return VERSION;
            },
            enumerable: true,
            configurable: true
        });
        // Public
        Alert.prototype.close = function (element) {
            element = element || this._element;
            var rootElement = this._getRootElement(element);
            var customEvent = this._triggerCloseEvent(rootElement);
            if (customEvent.isDefaultPrevented()) {
                return;
            }
            this._removeElement(rootElement);
        };
        Alert.prototype.dispose = function () {
            $.removeData(this._element, DATA_KEY);
            this._element = null;
        };
        // Private
        Alert.prototype._getRootElement = function (element) {
            var selector = Util.getSelectorFromElement(element);
            var parent = false;
            if (selector) {
                parent = $(selector)[0];
            }
            if (!parent) {
                parent = $(element).closest("." + ClassName.ALERT)[0];
            }
            return parent;
        };
        Alert.prototype._triggerCloseEvent = function (element) {
            var closeEvent = $.Event(Event.CLOSE);
            $(element).trigger(closeEvent);
            return closeEvent;
        };
        Alert.prototype._removeElement = function (element) {
            var _this = this;
            $(element).removeClass(ClassName.SHOW);
            if (!Util.supportsTransitionEnd() ||
                !$(element).hasClass(ClassName.FADE)) {
                this._destroyElement(element);
                return;
            }
            $(element)
                .one(Util.TRANSITION_END, function (event) { return _this._destroyElement(element, event); })
                .emulateTransitionEnd(TRANSITION_DURATION);
        };
        Alert.prototype._destroyElement = function (element) {
            $(element)
                .detach()
                .trigger(Event.CLOSED)
                .remove();
        };
        // Static
        Alert._jQueryInterface = function (config) {
            return this.each(function () {
                var $element = $(this);
                var data = $element.data(DATA_KEY);
                if (!data) {
                    data = new Alert(this);
                    $element.data(DATA_KEY, data);
                }
                if (config === 'close') {
                    data[config](this);
                }
            });
        };
        Alert._handleDismiss = function (alertInstance) {
            return function (event) {
                if (event) {
                    event.preventDefault();
                }
                alertInstance.close(this);
            };
        };
        return Alert;
    }());
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
    $(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */
    $.fn[NAME] = Alert._jQueryInterface;
    $.fn[NAME].Constructor = Alert;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return Alert._jQueryInterface;
    };
    return Alert;
};
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
var Alert = (ɵ0)($);
export default Alert;
export { ɵ0 };
