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
    var NAME = 'collapse';
    var VERSION = '4.0.0';
    var DATA_KEY = 'bs.collapse';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var TRANSITION_DURATION = 600;
    var Default = {
        toggle: true,
        parent: ''
    };
    var DefaultType = {
        toggle: 'boolean',
        parent: '(string|element)'
    };
    var Event = {
        SHOW: "show" + EVENT_KEY,
        SHOWN: "shown" + EVENT_KEY,
        HIDE: "hide" + EVENT_KEY,
        HIDDEN: "hidden" + EVENT_KEY,
        CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
    };
    var ClassName = {
        SHOW: 'show',
        COLLAPSE: 'collapse',
        COLLAPSING: 'collapsing',
        COLLAPSED: 'collapsed'
    };
    var Dimension = {
        WIDTH: 'width',
        HEIGHT: 'height'
    };
    var Selector = {
        ACTIVES: '.show, .collapsing',
        DATA_TOGGLE: '[data-toggle="collapse"]'
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
    var Collapse = (function () {
        function Collapse(element, config) {
            this._isTransitioning = false;
            this._element = element;
            this._config = this._getConfig(config);
            this._triggerArray = $.makeArray($("[data-toggle=\"collapse\"][href=\"#" + element.id + "\"]," +
                ("[data-toggle=\"collapse\"][data-target=\"#" + element.id + "\"]")));
            var tabToggles = $(Selector.DATA_TOGGLE);
            for (var i = 0; i < tabToggles.length; i++) {
                var elem = tabToggles[i];
                var selector = Util.getSelectorFromElement(elem);
                if (selector !== null && $(selector).filter(element).length > 0) {
                    this._selector = selector;
                    this._triggerArray.push(elem);
                }
            }
            this._parent = this._config.parent ? this._getParent() : null;
            if (!this._config.parent) {
                this._addAriaAndCollapsedClass(this._element, this._triggerArray);
            }
            if (this._config.toggle) {
                this.toggle();
            }
        }
        Object.defineProperty(Collapse, "VERSION", {
            // Getters
            get: function () {
                return VERSION;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Collapse, "Default", {
            get: function () {
                return Default;
            },
            enumerable: true,
            configurable: true
        });
        // Public
        Collapse.prototype.toggle = function () {
            if ($(this._element).hasClass(ClassName.SHOW)) {
                this.hide();
            }
            else {
                this.show();
            }
        };
        Collapse.prototype.show = function () {
            var _this = this;
            if (this._isTransitioning ||
                $(this._element).hasClass(ClassName.SHOW)) {
                return;
            }
            var actives;
            var activesData;
            if (this._parent) {
                actives = $.makeArray($(this._parent)
                    .find(Selector.ACTIVES)
                    .filter("[data-parent=\"" + this._config.parent + "\"]"));
                if (actives.length === 0) {
                    actives = null;
                }
            }
            if (actives) {
                activesData = $(actives).not(this._selector).data(DATA_KEY);
                if (activesData && activesData._isTransitioning) {
                    return;
                }
            }
            var startEvent = $.Event(Event.SHOW);
            $(this._element).trigger(startEvent);
            if (startEvent.isDefaultPrevented()) {
                return;
            }
            if (actives) {
                Collapse._jQueryInterface.call($(actives).not(this._selector), 'hide');
                if (!activesData) {
                    $(actives).data(DATA_KEY, null);
                }
            }
            var dimension = this._getDimension();
            $(this._element)
                .removeClass(ClassName.COLLAPSE)
                .addClass(ClassName.COLLAPSING);
            this._element.style[dimension] = 0;
            if (this._triggerArray.length > 0) {
                $(this._triggerArray)
                    .removeClass(ClassName.COLLAPSED)
                    .attr('aria-expanded', true);
            }
            this.setTransitioning(true);
            var complete = function () {
                $(_this._element)
                    .removeClass(ClassName.COLLAPSING)
                    .addClass(ClassName.COLLAPSE)
                    .addClass(ClassName.SHOW);
                _this._element.style[dimension] = '';
                _this.setTransitioning(false);
                $(_this._element).trigger(Event.SHOWN);
            };
            if (!Util.supportsTransitionEnd()) {
                complete();
                return;
            }
            var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
            var scrollSize = "scroll" + capitalizedDimension;
            $(this._element)
                .one(Util.TRANSITION_END, complete)
                .emulateTransitionEnd(TRANSITION_DURATION);
            this._element.style[dimension] = this._element[scrollSize] + "px";
        };
        Collapse.prototype.hide = function () {
            var _this = this;
            if (this._isTransitioning ||
                !$(this._element).hasClass(ClassName.SHOW)) {
                return;
            }
            var startEvent = $.Event(Event.HIDE);
            $(this._element).trigger(startEvent);
            if (startEvent.isDefaultPrevented()) {
                return;
            }
            var dimension = this._getDimension();
            this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + "px";
            Util.reflow(this._element);
            $(this._element)
                .addClass(ClassName.COLLAPSING)
                .removeClass(ClassName.COLLAPSE)
                .removeClass(ClassName.SHOW);
            if (this._triggerArray.length > 0) {
                for (var i = 0; i < this._triggerArray.length; i++) {
                    var trigger = this._triggerArray[i];
                    var selector = Util.getSelectorFromElement(trigger);
                    if (selector !== null) {
                        var $elem = $(selector);
                        if (!$elem.hasClass(ClassName.SHOW)) {
                            $(trigger).addClass(ClassName.COLLAPSED)
                                .attr('aria-expanded', false);
                        }
                    }
                }
            }
            this.setTransitioning(true);
            var complete = function () {
                _this.setTransitioning(false);
                $(_this._element)
                    .removeClass(ClassName.COLLAPSING)
                    .addClass(ClassName.COLLAPSE)
                    .trigger(Event.HIDDEN);
            };
            this._element.style[dimension] = '';
            if (!Util.supportsTransitionEnd()) {
                complete();
                return;
            }
            $(this._element)
                .one(Util.TRANSITION_END, complete)
                .emulateTransitionEnd(TRANSITION_DURATION);
        };
        Collapse.prototype.setTransitioning = function (isTransitioning) {
            this._isTransitioning = isTransitioning;
        };
        Collapse.prototype.dispose = function () {
            $.removeData(this._element, DATA_KEY);
            this._config = null;
            this._parent = null;
            this._element = null;
            this._triggerArray = null;
            this._isTransitioning = null;
        };
        // Private
        Collapse.prototype._getConfig = function (config) {
            config = __assign({}, Default, config);
            config.toggle = Boolean(config.toggle); // Coerce string values
            Util.typeCheckConfig(NAME, config, DefaultType);
            return config;
        };
        Collapse.prototype._getDimension = function () {
            var hasWidth = $(this._element).hasClass(Dimension.WIDTH);
            return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
        };
        Collapse.prototype._getParent = function () {
            var _this = this;
            var parent = null;
            if (Util.isElement(this._config.parent)) {
                parent = this._config.parent;
                // It's a jQuery object
                if (typeof this._config.parent.jquery !== 'undefined') {
                    parent = this._config.parent[0];
                }
            }
            else {
                parent = $(this._config.parent)[0];
            }
            var selector = "[data-toggle=\"collapse\"][data-parent=\"" + this._config.parent + "\"]";
            $(parent).find(selector).each(function (i, element) {
                _this._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
            });
            return parent;
        };
        Collapse.prototype._addAriaAndCollapsedClass = function (element, triggerArray) {
            if (element) {
                var isOpen = $(element).hasClass(ClassName.SHOW);
                if (triggerArray.length > 0) {
                    $(triggerArray)
                        .toggleClass(ClassName.COLLAPSED, !isOpen)
                        .attr('aria-expanded', isOpen);
                }
            }
        };
        // Static
        Collapse._getTargetFromElement = function (element) {
            var selector = Util.getSelectorFromElement(element);
            return selector ? $(selector)[0] : null;
        };
        Collapse._jQueryInterface = function (config) {
            return this.each(function () {
                var $this = $(this);
                var data = $this.data(DATA_KEY);
                var _config = __assign({}, Default, $this.data(), typeof config === 'object' && config);
                if (!data && _config.toggle && /show|hide/.test(config)) {
                    _config.toggle = false;
                }
                if (!data) {
                    data = new Collapse(this, _config);
                    $this.data(DATA_KEY, data);
                }
                if (typeof config === 'string') {
                    if (typeof data[config] === 'undefined') {
                        throw new TypeError("No method named \"" + config + "\"");
                    }
                    data[config]();
                }
            });
        };
        return Collapse;
    }());
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
    $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
        // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
        if (event.currentTarget.tagName === 'A') {
            event.preventDefault();
        }
        var $trigger = $(this);
        var selector = Util.getSelectorFromElement(this);
        $(selector).each(function () {
            var $target = $(this);
            var data = $target.data(DATA_KEY);
            var config = data ? 'toggle' : $trigger.data();
            Collapse._jQueryInterface.call($target, config);
        });
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */
    $.fn[NAME] = Collapse._jQueryInterface;
    $.fn[NAME].Constructor = Collapse;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return Collapse._jQueryInterface;
    };
    return Collapse;
};
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
var Collapse = (ɵ0)($);
export default Collapse;
export { ɵ0 };
