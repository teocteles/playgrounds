var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import $ from 'jquery';
import Tooltip from './tooltip';
var ɵ0 = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'popover';
    var VERSION = '4.0.0';
    var DATA_KEY = 'bs.popover';
    var EVENT_KEY = "." + DATA_KEY;
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var CLASS_PREFIX = 'bs-popover';
    var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');
    var Default = __assign({}, Tooltip.Default, { placement: 'right', trigger: 'click', content: '', template: '<div class="popover" role="tooltip">' +
            '<div class="arrow"></div>' +
            '<h3 class="popover-header"></h3>' +
            '<div class="popover-body"></div></div>' });
    var DefaultType = __assign({}, Tooltip.DefaultType, { content: '(string|element|function)' });
    var ClassName = {
        FADE: 'fade',
        SHOW: 'show'
    };
    var Selector = {
        TITLE: '.popover-header',
        CONTENT: '.popover-body'
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
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
    var Popover = (function (_super) {
        __extends(Popover, _super);
        function Popover() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Popover, "VERSION", {
            // Getters
            get: function () {
                return VERSION;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Popover, "Default", {
            get: function () {
                return Default;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Popover, "NAME", {
            get: function () {
                return NAME;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Popover, "DATA_KEY", {
            get: function () {
                return DATA_KEY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Popover, "Event", {
            get: function () {
                return Event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Popover, "EVENT_KEY", {
            get: function () {
                return EVENT_KEY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Popover, "DefaultType", {
            get: function () {
                return DefaultType;
            },
            enumerable: true,
            configurable: true
        });
        // Overrides
        Popover.prototype.isWithContent = function () {
            return this.getTitle() || this._getContent();
        };
        Popover.prototype.addAttachmentClass = function (attachment) {
            $(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
        };
        Popover.prototype.getTipElement = function () {
            this.tip = this.tip || $(this.config.template)[0];
            return this.tip;
        };
        Popover.prototype.setContent = function () {
            var $tip = $(this.getTipElement());
            // We use append for html objects to maintain js events
            this.setElementContent($tip.find(Selector.TITLE), this.getTitle());
            var content = this._getContent();
            if (typeof content === 'function') {
                content = content.call(this.element);
            }
            this.setElementContent($tip.find(Selector.CONTENT), content);
            $tip.removeClass(ClassName.FADE + " " + ClassName.SHOW);
        };
        // Private
        Popover.prototype._getContent = function () {
            return this.element.getAttribute('data-content') ||
                this.config.content;
        };
        Popover.prototype._cleanTipClass = function () {
            var $tip = $(this.getTipElement());
            var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);
            if (tabClass !== null && tabClass.length > 0) {
                $tip.removeClass(tabClass.join(''));
            }
        };
        // Static
        Popover._jQueryInterface = function (config) {
            return this.each(function () {
                var data = $(this).data(DATA_KEY);
                var _config = typeof config === 'object' ? config : null;
                if (!data && /destroy|hide/.test(config)) {
                    return;
                }
                if (!data) {
                    data = new Popover(this, _config);
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
        return Popover;
    }(Tooltip));
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */
    $.fn[NAME] = Popover._jQueryInterface;
    $.fn[NAME].Constructor = Popover;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return Popover._jQueryInterface;
    };
    return Popover;
};
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
var Popover = (ɵ0)($);
export default Popover;
export { ɵ0 };
