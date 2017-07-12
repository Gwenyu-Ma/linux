/**
 * jquery-resizable-columns - Resizable table columns for jQuery
 * @date Fri May 27 2016 00:04:32 GMT-0700 (PDT)
 * @version v0.2.3
 * @link http://dobtco.github.io/jquery-resizable-columns/
 * @license MIT
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _class = require('./class');

var _class2 = _interopRequireDefault(_class);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

$.fn.resizableColumns = function (optionsOrMethod) {
	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
	}

	return this.each(function () {
		var $table = $(this);

		var api = $table.data(_constants.DATA_API);
		if (!api) {
			api = new _class2['default']($table, optionsOrMethod);
			$table.data(_constants.DATA_API, api);
		} else if (typeof optionsOrMethod === 'string') {
			var _api;

			return (_api = api)[optionsOrMethod].apply(_api, args);
		}
	});
};

$.resizableColumns = _class2['default'];

},{"./class":2,"./constants":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
Takes a <table /> element and makes it's columns resizable across both
mobile and desktop clients.

@class ResizableColumns
@param $table {jQuery} jQuery-wrapped <table> element to make resizable
@param options {Object} Configuration object
**/

var ResizableColumns = function () {
	function ResizableColumns($table, options) {
		_classCallCheck(this, ResizableColumns);

		this.ns = '.rc' + this.count++;

		this.options = $.extend({}, ResizableColumns.defaults, options);

		this.$window = $(window);
		this.$document = $(document);
		this.$body = $('body');
		this.$ownerDocument = $($table[0].ownerDocument);
		this.$table = $table;

		this.refreshHeaders();
		this.restoreColumnWidths();
		this.syncHandleWidths();

		this.bindEvents(this.$window, 'resize', this.syncHandleWidths.bind(this));

		if (this.options.start) {
			this.bindEvents(this.$table, _constants.EVENT_RESIZE_START, this.options.start);
		}
		if (this.options.resize) {
			this.bindEvents(this.$table, _constants.EVENT_RESIZE, this.options.resize);
		}
		if (this.options.stop) {
			this.bindEvents(this.$table, _constants.EVENT_RESIZE_STOP, this.options.stop);
		}

		this.bindEvents(this.$table, 'refresh', this.refresh.bind(this));
		this.bindEvents(this.$table, 'destroy', this.destroy.bind(this));
	}

	/**
 Refreshes the headers associated with this instances <table/> element and
 generates handles for them. Also assigns percentage widths.
 	@method refreshHeaders
 **/


	_createClass(ResizableColumns, [{
		key: 'refreshHeaders',
		value: function () {
			function refreshHeaders() {
				// Allow the selector to be both a regular selctor string as well as
				// a dynamic callback
				var selector = this.options.selector;
				if (typeof selector === 'function') {
					selector = selector.call(this, this.$table);
				}

				// Select all table headers
				this.$tableHeaders = this.$table.find(selector);

				// Assign percentage widths first, then create drag handles
				this.assignPercentageWidths();
				this.createHandles();
			}

			return refreshHeaders;
		}()

		/**
  Creates dummy handle elements for all table header columns
  	@method createHandles
  **/

	}, {
		key: 'createHandles',
		value: function () {
			function createHandles() {
				var _this = this;

				var ref = this.$handleContainer;
				if (ref != null) {
					ref.remove();
				}

				this.$handleContainer = $('<div class=\'' + _constants.CLASS_HANDLE_CONTAINER + '\' />');
				this.$table.before(this.$handleContainer);

				this.$tableHeaders.each(function (i, el) {
					var $current = _this.$tableHeaders.eq(i);
					var $next = _this.$tableHeaders.eq(i + 1);

					if ($next.length === 0 || $current.is(_constants.SELECTOR_UNRESIZABLE) || $next.is(_constants.SELECTOR_UNRESIZABLE)) {
						return;
					}

					var $handle = $('<div class=\'' + _constants.CLASS_HANDLE + '\' />').data(_constants.DATA_TH, $(el)).appendTo(_this.$handleContainer);
				});

				this.bindEvents(this.$handleContainer, ['mousedown', 'touchstart'], '.' + _constants.CLASS_HANDLE, this.onPointerDown.bind(this));
			}

			return createHandles;
		}()

		/**
  Assigns a percentage width to all columns based on their current pixel width(s)
  	@method assignPercentageWidths
  **/

	}, {
		key: 'assignPercentageWidths',
		value: function () {
			function assignPercentageWidths() {
				var _this2 = this;

				this.$tableHeaders.each(function (_, el) {
					var $el = $(el);
					_this2.setWidth($el[0], $el.outerWidth() / _this2.$table.width() * 100);
				});
			}

			return assignPercentageWidths;
		}()

		/**
  
  @method syncHandleWidths
  **/

	}, {
		key: 'syncHandleWidths',
		value: function () {
			function syncHandleWidths() {
				var _this3 = this;

				var $container = this.$handleContainer;

				$container.width(this.$table.width());

				$container.find('.' + _constants.CLASS_HANDLE).each(function (_, el) {
					var $el = $(el);

					var height = _this3.options.resizeFromBody ? _this3.$table.height() : _this3.$table.find('thead').height();

					var left = $el.data(_constants.DATA_TH).outerWidth() + ($el.data(_constants.DATA_TH).offset().left - _this3.$handleContainer.offset().left);

					$el.css({ left: left, height: height });
				});
			}

			return syncHandleWidths;
		}()

		/**
  Persists the column widths in localStorage
  	@method saveColumnWidths
  **/

	}, {
		key: 'saveColumnWidths',
		value: function () {
			function saveColumnWidths() {
				var _this4 = this;

				this.$tableHeaders.each(function (_, el) {
					var $el = $(el);

					if (_this4.options.store && !$el.is(_constants.SELECTOR_UNRESIZABLE)) {
						_this4.options.store.set(_this4.generateColumnId($el), _this4.parseWidth(el));
					}
				});
			}

			return saveColumnWidths;
		}()

		/**
  Retrieves and sets the column widths from localStorage
  	@method restoreColumnWidths
  **/

	}, {
		key: 'restoreColumnWidths',
		value: function () {
			function restoreColumnWidths() {
				var _this5 = this;

				this.$tableHeaders.each(function (_, el) {
					var $el = $(el);

					if (_this5.options.store && !$el.is(_constants.SELECTOR_UNRESIZABLE)) {
						var width = _this5.options.store.get(_this5.generateColumnId($el));

						if (width != null) {
							_this5.setWidth(el, width);
						}
					}
				});
			}

			return restoreColumnWidths;
		}()

		/**
  Pointer/mouse down handler
  	@method onPointerDown
  @param event {Object} Event object associated with the interaction
  **/

	}, {
		key: 'onPointerDown',
		value: function () {
			function onPointerDown(event) {
				// Only applies to left-click dragging
				if (event.which !== 1) {
					return;
				}

				this.$document.bind('selectstart', function () {
					return false;
				});
				this.$body.css('-moz-user-select', 'none');

				// If a previous operation is defined, we missed the last mouseup.
				// Probably gobbled up by user mousing out the window then releasing.
				// We'll simulate a pointerup here prior to it
				if (this.operation) {
					this.onPointerUp(event);
				}

				// Ignore non-resizable columns
				var $currentGrip = $(event.currentTarget);
				if ($currentGrip.is(_constants.SELECTOR_UNRESIZABLE)) {
					return;
				}

				var gripIndex = $currentGrip.index();
				var $leftColumn = this.$tableHeaders.eq(gripIndex).not(_constants.SELECTOR_UNRESIZABLE);
				var $rightColumn = this.$tableHeaders.eq(gripIndex + 1).not(_constants.SELECTOR_UNRESIZABLE);

				var leftWidth = this.parseWidth($leftColumn[0]);
				var rightWidth = this.parseWidth($rightColumn[0]);

				this.operation = {
					$leftColumn: $leftColumn, $rightColumn: $rightColumn, $currentGrip: $currentGrip,

					startX: this.getPointerX(event),

					widths: {
						left: leftWidth,
						right: rightWidth
					},
					newWidths: {
						left: leftWidth,
						right: rightWidth
					}
				};

				this.bindEvents(this.$ownerDocument, ['mousemove', 'touchmove'], this.onPointerMove.bind(this));
				this.bindEvents(this.$ownerDocument, ['mouseup', 'touchend'], this.onPointerUp.bind(this));

				this.$handleContainer.add(this.$table).addClass(_constants.CLASS_TABLE_RESIZING);

				$leftColumn.add($rightColumn).add($currentGrip).addClass(_constants.CLASS_COLUMN_RESIZING);

				this.triggerEvent(_constants.EVENT_RESIZE_START, [$leftColumn, $rightColumn, leftWidth, rightWidth], event);

				event.preventDefault();
			}

			return onPointerDown;
		}()

		/**
  Pointer/mouse movement handler
  	@method onPointerMove
  @param event {Object} Event object associated with the interaction
  **/

	}, {
		key: 'onPointerMove',
		value: function () {
			function onPointerMove(event) {
				var op = this.operation;
				if (!this.operation) {
					return;
				}

				// Determine the delta change between start and new mouse position, as a percentage of the table width
				var difference = (this.getPointerX(event) - op.startX) / this.$table.width() * 100;
				if (difference === 0) {
					return;
				}

				var leftColumn = op.$leftColumn[0];
				var rightColumn = op.$rightColumn[0];
				var widthLeft = void 0,
				    widthRight = void 0;

				if (difference > 0) {
					widthLeft = this.constrainWidth(op.widths.left + (op.widths.right - op.newWidths.right));
					widthRight = this.constrainWidth(op.widths.right - difference);
				} else if (difference < 0) {
					widthLeft = this.constrainWidth(op.widths.left + difference);
					widthRight = this.constrainWidth(op.widths.right + (op.widths.left - op.newWidths.left));
				}

				if (leftColumn) {
					this.setWidth(leftColumn, widthLeft);
				}
				if (rightColumn) {
					this.setWidth(rightColumn, widthRight);
				}

				op.newWidths.left = widthLeft;
				op.newWidths.right = widthRight;

				return this.triggerEvent(_constants.EVENT_RESIZE, [op.$leftColumn, op.$rightColumn, widthLeft, widthRight], event);
			}

			return onPointerMove;
		}()

		/**
  Pointer/mouse release handler
  	@method onPointerUp
  @param event {Object} Event object associated with the interaction
  **/

	}, {
		key: 'onPointerUp',
		value: function () {
			function onPointerUp(event) {
				var op = this.operation;
				if (!this.operation) {
					return;
				}

				this.$document.unbind('selectstart');
				this.$body.css('-moz-user-select', '');

				this.unbindEvents(this.$ownerDocument, ['mouseup', 'touchend', 'mousemove', 'touchmove']);

				this.$handleContainer.add(this.$table).removeClass(_constants.CLASS_TABLE_RESIZING);

				op.$leftColumn.add(op.$rightColumn).add(op.$currentGrip).removeClass(_constants.CLASS_COLUMN_RESIZING);

				this.syncHandleWidths();
				this.saveColumnWidths();

				this.operation = null;

				return this.triggerEvent(_constants.EVENT_RESIZE_STOP, [op.$leftColumn, op.$rightColumn, op.newWidths.left, op.newWidths.right], event);
			}

			return onPointerUp;
		}()

		/**
  Removes all event listeners, data, and added DOM elements. Takes
  the <table/> element back to how it was, and returns it
  	@method destroy
  @return {jQuery} Original jQuery-wrapped <table> element
  **/

	}, {
		key: 'destroy',
		value: function () {
			function destroy() {
				var $table = this.$table;
				var $handles = this.$handleContainer.find('.' + _constants.CLASS_HANDLE);

				this.unbindEvents(this.$window.add(this.$ownerDocument).add(this.$table).add($handles));

				$handles.removeData(_constants.DATA_TH);
				$table.removeData(_constants.DATA_API);

				this.$handleContainer.remove();
				this.$handleContainer = null;
				this.$tableHeaders = null;
				this.$table = null;

				return $table;
			}

			return destroy;
		}()
	}, {
		key: 'refresh',
		value: function () {
			function refresh() {
				this.unbindEvents(this.$handleContainer, ['mousedown', 'touchstart']);
				this.$handleContainer.remove();

				this.refreshHeaders();
				this.syncHandleWidths();
			}

			return refresh;
		}()

		/**
  Binds given events for this instance to the given target DOMElement
  	@private
  @method bindEvents
  @param target {jQuery} jQuery-wrapped DOMElement to bind events to
  @param events {String|Array} Event name (or array of) to bind
  @param selectorOrCallback {String|Function} Selector string or callback
  @param [callback] {Function} Callback method
  **/

	}, {
		key: 'bindEvents',
		value: function () {
			function bindEvents($target, events, selectorOrCallback, callback) {
				if (typeof events === 'string') {
					events = events + this.ns;
				} else {
					events = events.join(this.ns + ' ') + this.ns;
				}

				if (arguments.length > 3) {
					$target.on(events, selectorOrCallback, callback);
				} else {
					$target.on(events, selectorOrCallback);
				}
			}

			return bindEvents;
		}()

		/**
  Unbinds events specific to this instance from the given target DOMElement
  	@private
  @method unbindEvents
  @param target {jQuery} jQuery-wrapped DOMElement to unbind events from
  @param events {String|Array} Event name (or array of) to unbind
  **/

	}, {
		key: 'unbindEvents',
		value: function () {
			function unbindEvents($target, events) {
				if (typeof events === 'string') {
					events = events + this.ns;
				} else if (events != null) {
					events = events.join(this.ns + ' ') + this.ns;
				} else {
					events = this.ns;
				}

				$target.off(events);
			}

			return unbindEvents;
		}()

		/**
  Triggers an event on the <table/> element for a given type with given
  arguments, also setting and allowing access to the originalEvent if
  given. Returns the result of the triggered event.
  	@private
  @method triggerEvent
  @param type {String} Event name
  @param args {Array} Array of arguments to pass through
  @param [originalEvent] If given, is set on the event object
  @return {Mixed} Result of the event trigger action
  **/

	}, {
		key: 'triggerEvent',
		value: function () {
			function triggerEvent(type, args, originalEvent) {
				var event = $.Event(type);
				if (event.originalEvent) {
					event.originalEvent = $.extend({}, originalEvent);
				}

				return this.$table.trigger(event, [this].concat(args || []));
			}

			return triggerEvent;
		}()

		/**
  Calculates a unique column ID for a given column DOMElement
  	@private
  @method generateColumnId
  @param $el {jQuery} jQuery-wrapped column element
  @return {String} Column ID
  **/

	}, {
		key: 'generateColumnId',
		value: function () {
			function generateColumnId($el) {
				return this.$table.data(_constants.DATA_COLUMNS_ID) + '-' + $el.data(_constants.DATA_COLUMN_ID);
			}

			return generateColumnId;
		}()

		/**
  Parses a given DOMElement's width into a float
  	@private
  @method parseWidth
  @param element {DOMElement} Element to get width of
  @return {Number} Element's width as a float
  **/

	}, {
		key: 'parseWidth',
		value: function () {
			function parseWidth(element) {
				return element ? parseFloat(element.style.width.replace('%', '')) : 0;
			}

			return parseWidth;
		}()

		/**
  Sets the percentage width of a given DOMElement
  	@private
  @method setWidth
  @param element {DOMElement} Element to set width on
  @param width {Number} Width, as a percentage, to set
  **/

	}, {
		key: 'setWidth',
		value: function () {
			function setWidth(element, width) {
				width = width.toFixed(2);
				width = width > 0 ? width : 0;
				element.style.width = width + '%';
			}

			return setWidth;
		}()

		/**
  Constrains a given width to the minimum and maximum ranges defined in
  the `minWidth` and `maxWidth` configuration options, respectively.
  	@private
  @method constrainWidth
  @param width {Number} Width to constrain
  @return {Number} Constrained width
  **/

	}, {
		key: 'constrainWidth',
		value: function () {
			function constrainWidth(width) {
				if (this.options.minWidth != undefined) {
					width = Math.max(this.options.minWidth, width);
				}

				if (this.options.maxWidth != undefined) {
					width = Math.min(this.options.maxWidth, width);
				}

				return width;
			}

			return constrainWidth;
		}()

		/**
  Given a particular Event object, retrieves the current pointer offset along
  the horizontal direction. Accounts for both regular mouse clicks as well as
  pointer-like systems (mobiles, tablets etc.)
  	@private
  @method getPointerX
  @param event {Object} Event object associated with the interaction
  @return {Number} Horizontal pointer offset
  **/

	}, {
		key: 'getPointerX',
		value: function () {
			function getPointerX(event) {
				if (event.type.indexOf('touch') === 0) {
					return (event.originalEvent.touches[0] || event.originalEvent.changedTouches[0]).pageX;
				}
				return event.pageX;
			}

			return getPointerX;
		}()
	}]);

	return ResizableColumns;
}();

exports['default'] = ResizableColumns;


ResizableColumns.defaults = {
	selector: function () {
		function selector($table) {
			if ($table.find('thead').length) {
				return _constants.SELECTOR_TH;
			}

			return _constants.SELECTOR_TD;
		}

		return selector;
	}(),
	store: window.store,
	syncHandlers: true,
	resizeFromBody: true,
	maxWidth: null,
	minWidth: 0.01
};

ResizableColumns.count = 0;

},{"./constants":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DATA_API = exports.DATA_API = 'resizableColumns';
var DATA_COLUMNS_ID = exports.DATA_COLUMNS_ID = 'resizable-columns-id';
var DATA_COLUMN_ID = exports.DATA_COLUMN_ID = 'resizable-column-id';
var DATA_TH = exports.DATA_TH = 'th';

var CLASS_TABLE_RESIZING = exports.CLASS_TABLE_RESIZING = 'rc-table-resizing';
var CLASS_COLUMN_RESIZING = exports.CLASS_COLUMN_RESIZING = 'rc-column-resizing';
var CLASS_HANDLE = exports.CLASS_HANDLE = 'rc-handle';
var CLASS_HANDLE_CONTAINER = exports.CLASS_HANDLE_CONTAINER = 'rc-handle-container';

var EVENT_RESIZE_START = exports.EVENT_RESIZE_START = 'column:resize:start';
var EVENT_RESIZE = exports.EVENT_RESIZE = 'column:resize';
var EVENT_RESIZE_STOP = exports.EVENT_RESIZE_STOP = 'column:resize:stop';

var SELECTOR_TH = exports.SELECTOR_TH = 'tr:first > th:visible';
var SELECTOR_TD = exports.SELECTOR_TD = 'tr:first > td:visible';
var SELECTOR_UNRESIZABLE = exports.SELECTOR_UNRESIZABLE = '[data-noresize]';

},{}],4:[function(require,module,exports){
'use strict';

var _class = require('./class');

var _class2 = _interopRequireDefault(_class);

var _adapter = require('./adapter');

var _adapter2 = _interopRequireDefault(_adapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

//export default ResizableColumns;
module.exports = _class2['default'];

},{"./adapter":1,"./class":2}]},{},[4])


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWRhcHRlci5qcyIsInNyYy9jbGFzcy5qcyIsInNyYy9jb25zdGFudHMuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFFQSxFQUFFLEVBQUYsQ0FBSyxnQkFBTCxHQUF3QixVQUFTLGVBQVQsRUFBbUM7QUFBQSxtQ0FBTixJQUFNO0FBQU4sTUFBTTtBQUFBOztBQUMxRCxRQUFPLEtBQUssSUFBTCxDQUFVLFlBQVc7QUFDM0IsTUFBSSxTQUFTLEVBQUUsSUFBRixDQUFiOztBQUVBLE1BQUksTUFBTSxPQUFPLElBQVAscUJBQVY7QUFDQSxNQUFJLENBQUMsR0FBTCxFQUFVO0FBQ1QsU0FBTSx1QkFBcUIsTUFBckIsRUFBNkIsZUFBN0IsQ0FBTjtBQUNBLFVBQU8sSUFBUCxzQkFBc0IsR0FBdEI7QUFDQSxHQUhELE1BS0ssSUFBSSxPQUFPLGVBQVAsS0FBMkIsUUFBL0IsRUFBeUM7QUFBQTs7QUFDN0MsVUFBTyxhQUFJLGVBQUosY0FBd0IsSUFBeEIsQ0FBUDtBQUNBO0FBQ0QsRUFaTSxDQUFQO0FBYUEsQ0FkRDs7QUFnQkEsRUFBRSxnQkFBRjs7Ozs7Ozs7Ozs7QUNuQkE7Ozs7Ozs7Ozs7Ozs7SUEwQnFCLGdCO0FBQ3BCLFVBRG9CLGdCQUNwQixDQUFZLE1BQVosRUFBb0IsT0FBcEIsRUFBNkI7QUFBQSx3QkFEVCxnQkFDUzs7QUFDNUIsT0FBSyxFQUFMLEdBQVUsUUFBUSxLQUFLLEtBQUwsRUFBbEI7O0FBRUEsT0FBSyxPQUFMLEdBQWUsRUFBRSxNQUFGLENBQVMsRUFBVCxFQUFhLGlCQUFpQixRQUE5QixFQUF3QyxPQUF4QyxDQUFmOztBQUVBLE9BQUssT0FBTCxHQUFlLEVBQUUsTUFBRixDQUFmO0FBQ0EsT0FBSyxTQUFMLEdBQWlCLEVBQUUsUUFBRixDQUFqQjtBQUNBLE9BQUssS0FBTCxHQUFhLEVB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cyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlc2l6YWJsZUNvbHVtbnMgZnJvbSAnLi9jbGFzcyc7XG5pbXBvcnQge0RBVEFfQVBJfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbiQuZm4ucmVzaXphYmxlQ29sdW1ucyA9IGZ1bmN0aW9uKG9wdGlvbnNPck1ldGhvZCwgLi4uYXJncykge1xuXHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdGxldCAkdGFibGUgPSAkKHRoaXMpO1xuXG5cdFx0bGV0IGFwaSA9ICR0YWJsZS5kYXRhKERBVEFfQVBJKTtcblx0XHRpZiAoIWFwaSkge1xuXHRcdFx0YXBpID0gbmV3IFJlc2l6YWJsZUNvbHVtbnMoJHRhYmxlLCBvcHRpb25zT3JNZXRob2QpO1xuXHRcdFx0JHRhYmxlLmRhdGEoREFUQV9BUEksIGFwaSk7XG5cdFx0fVxuXG5cdFx0ZWxzZSBpZiAodHlwZW9mIG9wdGlvbnNPck1ldGhvZCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybiBhcGlbb3B0aW9uc09yTWV0aG9kXSguLi5hcmdzKTtcblx0XHR9XG5cdH0pO1xufTtcblxuJC5yZXNpemFibGVDb2x1bW5zID0gUmVzaXphYmxlQ29sdW1ucztcbiIsImltcG9ydCB7XG5cdERBVEFfQVBJLFxuXHREQVRBX0NPTFVNTlNfSUQsXG5cdERBVEFfQ09MVU1OX0lELFxuXHREQVRBX1RILFxuXHRDTEFTU19UQUJMRV9SRVNJWklORyxcblx0Q0xBU1NfQ09MVU1OX1JFU0laSU5HLFxuXHRDTEFTU19IQU5ETEUsXG5cdENMQVNTX0hBTkRMRV9DT05UQUlORVIsXG5cdEVWRU5UX1JFU0laRV9TVEFSVCxcblx0RVZFTlRfUkVTSVpFLFxuXHRFVkVOVF9SRVNJWkVfU1RPUCxcblx0U0VMRUNUT1JfVEgsXG5cdFNFTEVDVE9SX1RELFxuXHRTRUxFQ1RPUl9VTlJFU0laQUJMRVxufVxuZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcblRha2VzIGEgPHRhYmxlIC8+IGVsZW1lbnQgYW5kIG1ha2VzIGl0J3MgY29sdW1ucyByZXNpemFibGUgYWNyb3NzIGJvdGhcbm1vYmlsZSBhbmQgZGVza3RvcCBjbGllbnRzLlxuXG5AY2xhc3MgUmVzaXphYmxlQ29sdW1uc1xuQHBhcmFtICR0YWJsZSB7alF1ZXJ5fSBqUXVlcnktd3JhcHBlZCA8dGFibGU+IGVsZW1lbnQgdG8gbWFrZSByZXNpemFibGVcbkBwYXJhbSBvcHRpb25zIHtPYmplY3R9IENvbmZpZ3VyYXRpb24gb2JqZWN0XG4qKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc2l6YWJsZUNvbHVtbnMge1xuXHRjb25zdHJ1Y3RvcigkdGFibGUsIG9wdGlvbnMpIHtcblx0XHR0aGlzLm5zID0gJy5yYycgKyB0aGlzLmNvdW50Kys7XG5cblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgUmVzaXphYmxlQ29sdW1ucy5kZWZhdWx0cywgb3B0aW9ucyk7XG5cblx0XHR0aGlzLiR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cdFx0dGhpcy4kZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcblx0XHR0aGlzLiRib2R5ID0gJCgnYm9keScpO1xuXHRcdHRoaXMuJG93bmVyRG9jdW1lbnQgPSAkKCR0YWJsZVswXS5vd25lckRvY3VtZW50KTtcblx0XHR0aGlzLiR0YWJsZSA9ICR0YWJsZTtcblxuXHRcdHRoaXMucmVmcmVzaEhlYWRlcnMoKTtcblx0XHR0aGlzLnJlc3RvcmVDb2x1bW5XaWR0aHMoKTtcblx0XHR0aGlzLnN5bmNIYW5kbGVXaWR0aHMoKTtcblxuXHRcdHRoaXMuYmluZEV2ZW50cyh0aGlzLiR3aW5kb3csICdyZXNpemUnLCB0aGlzLnN5bmNIYW5kbGVXaWR0aHMuYmluZCh0aGlzKSk7XG5cblx0XHRpZiAodGhpcy5vcHRpb25zLnN0YXJ0KSB7XG5cdFx0XHR0aGlzLmJpbmRFdmVudHModGhpcy4kdGFibGUsIEVWRU5UX1JFU0laRV9TVEFSVCwgdGhpcy5vcHRpb25zLnN0YXJ0KTtcblx0XHR9XG5cdFx0aWYgKHRoaXMub3B0aW9ucy5yZXNpemUpIHtcblx0XHRcdHRoaXMuYmluZEV2ZW50cyh0aGlzLiR0YWJsZSwgRVZFTlRfUkVTSVpFLCB0aGlzLm9wdGlvbnMucmVzaXplKTtcblx0XHR9XG5cdFx0aWYgKHRoaXMub3B0aW9ucy5zdG9wKSB7XG5cdFx0XHR0aGlzLmJpbmRFdmVudHModGhpcy4kdGFibGUsIEVWRU5UX1JFU0laRV9TVE9QLCB0aGlzLm9wdGlvbnMuc3RvcCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5iaW5kRXZlbnRzKHRoaXMuJHRhYmxlLCAncmVmcmVzaCcsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLmJpbmRFdmVudHModGhpcy4kdGFibGUsICdkZXN0cm95JywgdGhpcy5kZXN0cm95LmJpbmQodGhpcykpO1xuXHR9XG5cblx0LyoqXG5cdFJlZnJlc2hlcyB0aGUgaGVhZGVycyBhc3NvY2lhdGVkIHdpdGggdGhpcyBpbnN0YW5jZXMgPHRhYmxlLz4gZWxlbWVudCBhbmRcblx0Z2VuZXJhdGVzIGhhbmRsZXMgZm9yIHRoZW0uIEFsc28gYXNzaWducyBwZXJjZW50YWdlIHdpZHRocy5cblxuXHRAbWV0aG9kIHJlZnJlc2hIZWFkZXJzXG5cdCoqL1xuXHRyZWZyZXNoSGVhZGVycygpIHtcblx0XHQvLyBBbGxvdyB0aGUgc2VsZWN0b3IgdG8gYmUgYm90aCBhIHJlZ3VsYXIgc2VsY3RvciBzdHJpbmcgYXMgd2VsbCBhc1xuXHRcdC8vIGEgZHluYW1pYyBjYWxsYmFja1xuXHRcdGxldCBzZWxlY3RvciA9IHRoaXMub3B0aW9ucy5zZWxlY3Rvcjtcblx0XHRpZih0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3IuY2FsbCh0aGlzLCB0aGlzLiR0YWJsZSk7XG5cdFx0fVxuXG5cdFx0Ly8gU2VsZWN0IGFsbCB0YWJsZSBoZWFkZXJzXG5cdFx0dGhpcy4kdGFibGVIZWFkZXJzID0gdGhpcy4kdGFibGUuZmluZChzZWxlY3Rvcik7XG5cblx0XHQvLyBBc3NpZ24gcGVyY2VudGFnZSB3aWR0aHMgZmlyc3QsIHRoZW4gY3JlYXRlIGRyYWcgaGFuZGxlc1xuXHRcdHRoaXMuYXNzaWduUGVyY2VudGFnZVdpZHRocygpO1xuXHRcdHRoaXMuY3JlYXRlSGFuZGxlcygpO1xuXHR9XG5cblx0LyoqXG5cdENyZWF0ZXMgZHVtbXkgaGFuZGxlIGVsZW1lbnRzIGZvciBhbGwgdGFibGUgaGVhZGVyIGNvbHVtbnNcblxuXHRAbWV0aG9kIGNyZWF0ZUhhbmRsZXNcblx0KiovXG5cdGNyZWF0ZUhhbmRsZXMoKSB7XG5cdFx0bGV0IHJlZiA9IHRoaXMuJGhhbmRsZUNvbnRhaW5lcjtcblx0XHRpZiAocmVmICE9IG51bGwpIHtcblx0XHRcdHJlZi5yZW1vdmUoKTtcblx0XHR9XG5cblx0XHR0aGlzLiRoYW5kbGVDb250YWluZXIgPSAkKGA8ZGl2IGNsYXNzPScke0NMQVNTX0hBTkRMRV9DT05UQUlORVJ9JyAvPmApXG5cdFx0dGhpcy4kdGFibGUuYmVmb3JlKHRoaXMuJGhhbmRsZUNvbnRhaW5lcik7XG5cblx0XHR0aGlzLiR0YWJsZUhlYWRlcnMuZWFjaCgoaSwgZWwpID0+IHtcblx0XHRcdGxldCAkY3VycmVudCA9IHRoaXMuJHRhYmxlSGVhZGVycy5lcShpKTtcblx0XHRcdGxldCAkbmV4dCA9IHRoaXMuJHRhYmxlSGVhZGVycy5lcShpICsgMSk7XG5cblx0XHRcdGlmICgkbmV4dC5sZW5ndGggPT09IDAgfHwgJGN1cnJlbnQuaXMoU0VMRUNUT1JfVU5SRVNJWkFCTEUpIHx8ICRuZXh0LmlzKFNFTEVDVE9SX1VOUkVTSVpBQkxFKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCAkaGFuZGxlID0gJChgPGRpdiBjbGFzcz0nJHtDTEFTU19IQU5ETEV9JyAvPmApXG5cdFx0XHRcdC5kYXRhKERBVEFfVEgsICQoZWwpKVxuXHRcdFx0XHQuYXBwZW5kVG8odGhpcy4kaGFuZGxlQ29udGFpbmVyKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuYmluZEV2ZW50cyh0aGlzLiRoYW5kbGVDb250YWluZXIsIFsnbW91c2Vkb3duJywgJ3RvdWNoc3RhcnQnXSwgJy4nK0NMQVNTX0hBTkRMRSwgdGhpcy5vblBvaW50ZXJEb3duLmJpbmQodGhpcykpO1xuXHR9XG5cblx0LyoqXG5cdEFzc2lnbnMgYSBwZXJjZW50YWdlIHdpZHRoIHRvIGFsbCBjb2x1bW5zIGJhc2VkIG9uIHRoZWlyIGN1cnJlbnQgcGl4ZWwgd2lkdGgocylcblxuXHRAbWV0aG9kIGFzc2lnblBlcmNlbnRhZ2VXaWR0aHNcblx0KiovXG5cdGFzc2lnblBlcmNlbnRhZ2VXaWR0aHMoKSB7XG5cdFx0dGhpcy4kdGFibGVIZWFkZXJzLmVhY2goKF8sIGVsKSA9PiB7XG5cdFx0XHRsZXQgJGVsID0gJChlbCk7XG5cdFx0XHR0aGlzLnNldFdpZHRoKCRlbFswXSwgJGVsLm91dGVyV2lkdGgoKSAvIHRoaXMuJHRhYmxlLndpZHRoKCkgKiAxMDApO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cblxuXHRAbWV0aG9kIHN5bmNIYW5kbGVXaWR0aHNcblx0KiovXG5cdHN5bmNIYW5kbGVXaWR0aHMoKSB7XG5cdFx0bGV0ICRjb250YWluZXIgPSB0aGlzLiRoYW5kbGVDb250YWluZXJcblxuXHRcdCRjb250YWluZXIud2lkdGgodGhpcy4kdGFibGUud2lkdGgoKSk7XG5cblx0XHQkY29udGFpbmVyLmZpbmQoJy4nK0NMQVNTX0hBTkRMRSkuZWFjaCgoXywgZWwpID0+IHtcblx0XHRcdGxldCAkZWwgPSAkKGVsKTtcblxuXHRcdFx0bGV0IGhlaWdodCA9IHRoaXMub3B0aW9ucy5yZXNpemVGcm9tQm9keSA/XG5cdFx0XHRcdHRoaXMuJHRhYmxlLmhlaWdodCgpIDpcblx0XHRcdFx0dGhpcy4kdGFibGUuZmluZCgndGhlYWQnKS5oZWlnaHQoKTtcblxuXHRcdFx0bGV0IGxlZnQgPSAkZWwuZGF0YShEQVRBX1RIKS5vdXRlcldpZHRoKCkgKyAoXG5cdFx0XHRcdCRlbC5kYXRhKERBVEFfVEgpLm9mZnNldCgpLmxlZnQgLSB0aGlzLiRoYW5kbGVDb250YWluZXIub2Zmc2V0KCkubGVmdFxuXHRcdFx0KTtcblxuXHRcdFx0JGVsLmNzcyh7IGxlZnQsIGhlaWdodCB9KTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHRQZXJzaXN0cyB0aGUgY29sdW1uIHdpZHRocyBpbiBsb2NhbFN0b3JhZ2VcblxuXHRAbWV0aG9kIHNhdmVDb2x1bW5XaWR0aHNcblx0KiovXG5cdHNhdmVDb2x1bW5XaWR0aHMoKSB7XG5cdFx0dGhpcy4kdGFibGVIZWFkZXJzLmVhY2goKF8sIGVsKSA9PiB7XG5cdFx0XHRsZXQgJGVsID0gJChlbCk7XG5cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuc3RvcmUgJiYgISRlbC5pcyhTRUxFQ1RPUl9VTlJFU0laQUJMRSkpIHtcblx0XHRcdFx0dGhpcy5vcHRpb25zLnN0b3JlLnNldChcblx0XHRcdFx0XHR0aGlzLmdlbmVyYXRlQ29sdW1uSWQoJGVsKSxcblx0XHRcdFx0XHR0aGlzLnBhcnNlV2lkdGgoZWwpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0UmV0cmlldmVzIGFuZCBzZXRzIHRoZSBjb2x1bW4gd2lkdGhzIGZyb20gbG9jYWxTdG9yYWdlXG5cblx0QG1ldGhvZCByZXN0b3JlQ29sdW1uV2lkdGhzXG5cdCoqL1xuXHRyZXN0b3JlQ29sdW1uV2lkdGhzKCkge1xuXHRcdHRoaXMuJHRhYmxlSGVhZGVycy5lYWNoKChfLCBlbCkgPT4ge1xuXHRcdFx0bGV0ICRlbCA9ICQoZWwpO1xuXG5cdFx0XHRpZih0aGlzLm9wdGlvbnMuc3RvcmUgJiYgISRlbC5pcyhTRUxFQ1RPUl9VTlJFU0laQUJMRSkpIHtcblx0XHRcdFx0bGV0IHdpZHRoID0gdGhpcy5vcHRpb25zLnN0b3JlLmdldChcblx0XHRcdFx0XHR0aGlzLmdlbmVyYXRlQ29sdW1uSWQoJGVsKVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmKHdpZHRoICE9IG51bGwpIHtcblx0XHRcdFx0XHR0aGlzLnNldFdpZHRoKGVsLCB3aWR0aCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHRQb2ludGVyL21vdXNlIGRvd24gaGFuZGxlclxuXG5cdEBtZXRob2Qgb25Qb2ludGVyRG93blxuXHRAcGFyYW0gZXZlbnQge09iamVjdH0gRXZlbnQgb2JqZWN0IGFzc29jaWF0ZWQgd2l0aCB0aGUgaW50ZXJhY3Rpb25cblx0KiovXG5cdG9uUG9pbnRlckRvd24oZXZlbnQpIHtcblx0XHQvLyBPbmx5IGFwcGxpZXMgdG8gbGVmdC1jbGljayBkcmFnZ2luZ1xuXHRcdGlmKGV2ZW50LndoaWNoICE9PSAxKSB7IHJldHVybjsgfVxuXG5cdFx0dGhpcy4kZG9jdW1lbnQuYmluZCgnc2VsZWN0c3RhcnQnLGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSlcblx0XHR0aGlzLiRib2R5LmNzcygnLW1vei11c2VyLXNlbGVjdCcsJ25vbmUnKTtcblxuXHRcdC8vIElmIGEgcHJldmlvdXMgb3BlcmF0aW9uIGlzIGRlZmluZWQsIHdlIG1pc3NlZCB0aGUgbGFzdCBtb3VzZXVwLlxuXHRcdC8vIFByb2JhYmx5IGdvYmJsZWQgdXAgYnkgdXNlciBtb3VzaW5nIG91dCB0aGUgd2luZG93IHRoZW4gcmVsZWFzaW5nLlxuXHRcdC8vIFdlJ2xsIHNpbXVsYXRlIGEgcG9pbnRlcnVwIGhlcmUgcHJpb3IgdG8gaXRcblx0XHRpZih0aGlzLm9wZXJhdGlvbikge1xuXHRcdFx0dGhpcy5vblBvaW50ZXJVcChldmVudCk7XG5cdFx0fVxuXG5cdFx0Ly8gSWdub3JlIG5vbi1yZXNpemFibGUgY29sdW1uc1xuXHRcdGxldCAkY3VycmVudEdyaXAgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuXHRcdGlmKCRjdXJyZW50R3JpcC5pcyhTRUxFQ1RPUl9VTlJFU0laQUJMRSkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgZ3JpcEluZGV4ID0gJGN1cnJlbnRHcmlwLmluZGV4KCk7XG5cdFx0bGV0ICRsZWZ0Q29sdW1uID0gdGhpcy4kdGFibGVIZWFkZXJzLmVxKGdyaXBJbmRleCkubm90KFNFTEVDVE9SX1VOUkVTSVpBQkxFKTtcblx0XHRsZXQgJHJpZ2h0Q29sdW1uID0gdGhpcy4kdGFibGVIZWFkZXJzLmVxKGdyaXBJbmRleCArIDEpLm5vdChTRUxFQ1RPUl9VTlJFU0laQUJMRSk7XG5cblx0XHRsZXQgbGVmdFdpZHRoID0gdGhpcy5wYXJzZVdpZHRoKCRsZWZ0Q29sdW1uWzBdKTtcblx0XHRsZXQgcmlnaHRXaWR0aCA9IHRoaXMucGFyc2VXaWR0aCgkcmlnaHRDb2x1bW5bMF0pO1xuXG5cdFx0dGhpcy5vcGVyYXRpb24gPSB7XG5cdFx0XHQkbGVmdENvbHVtbiwgJHJpZ2h0Q29sdW1uLCAkY3VycmVudEdyaXAsXG5cblx0XHRcdHN0YXJ0WDogdGhpcy5nZXRQb2ludGVyWChldmVudCksXG5cblx0XHRcdHdpZHRoczoge1xuXHRcdFx0XHRsZWZ0OiBsZWZ0V2lkdGgsXG5cdFx0XHRcdHJpZ2h0OiByaWdodFdpZHRoXG5cdFx0XHR9LFxuXHRcdFx0bmV3V2lkdGhzOiB7XG5cdFx0XHRcdGxlZnQ6IGxlZnRXaWR0aCxcblx0XHRcdFx0cmlnaHQ6IHJpZ2h0V2lkdGhcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dGhpcy5iaW5kRXZlbnRzKHRoaXMuJG93bmVyRG9jdW1lbnQsIFsnbW91c2Vtb3ZlJywgJ3RvdWNobW92ZSddLCB0aGlzLm9uUG9pbnRlck1vdmUuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5iaW5kRXZlbnRzKHRoaXMuJG93bmVyRG9jdW1lbnQsIFsnbW91c2V1cCcsICd0b3VjaGVuZCddLCB0aGlzLm9uUG9pbnRlclVwLmJpbmQodGhpcykpO1xuXG5cdFx0dGhpcy4kaGFuZGxlQ29udGFpbmVyXG5cdFx0XHQuYWRkKHRoaXMuJHRhYmxlKVxuXHRcdFx0LmFkZENsYXNzKENMQVNTX1RBQkxFX1JFU0laSU5HKTtcblxuXHRcdCRsZWZ0Q29sdW1uXG5cdFx0XHQuYWRkKCRyaWdodENvbHVtbilcblx0XHRcdC5hZGQoJGN1cnJlbnRHcmlwKVxuXHRcdFx0LmFkZENsYXNzKENMQVNTX0NPTFVNTl9SRVNJWklORyk7XG5cblx0XHR0aGlzLnRyaWdnZXJFdmVudChFVkVOVF9SRVNJWkVfU1RBUlQsIFtcblx0XHRcdCRsZWZ0Q29sdW1uLCAkcmlnaHRDb2x1bW4sXG5cdFx0XHRsZWZ0V2lkdGgsIHJpZ2h0V2lkdGhcblx0XHRdLFxuXHRcdGV2ZW50KTtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHQvKipcblx0UG9pbnRlci9tb3VzZSBtb3ZlbWVudCBoYW5kbGVyXG5cblx0QG1ldGhvZCBvblBvaW50ZXJNb3ZlXG5cdEBwYXJhbSBldmVudCB7T2JqZWN0fSBFdmVudCBvYmplY3QgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnRlcmFjdGlvblxuXHQqKi9cblx0b25Qb2ludGVyTW92ZShldmVudCkge1xuXHRcdGxldCBvcCA9IHRoaXMub3BlcmF0aW9uO1xuXHRcdGlmKCF0aGlzLm9wZXJhdGlvbikgeyByZXR1cm47IH1cblxuXHRcdC8vIERldGVybWluZSB0aGUgZGVsdGEgY2hhbmdlIGJldHdlZW4gc3RhcnQgYW5kIG5ldyBtb3VzZSBwb3NpdGlvbiwgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0YWJsZSB3aWR0aFxuXHRcdGxldCBkaWZmZXJlbmNlID0gKHRoaXMuZ2V0UG9pbnRlclgoZXZlbnQpIC0gb3Auc3RhcnRYKSAvIHRoaXMuJHRhYmxlLndpZHRoKCkgKiAxMDA7XG5cdFx0aWYoZGlmZmVyZW5jZSA9PT0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBsZWZ0Q29sdW1uID0gb3AuJGxlZnRDb2x1bW5bMF07XG5cdFx0bGV0IHJpZ2h0Q29sdW1uID0gb3AuJHJpZ2h0Q29sdW1uWzBdO1xuXHRcdGxldCB3aWR0aExlZnQsIHdpZHRoUmlnaHQ7XG5cblx0XHRpZihkaWZmZXJlbmNlID4gMCkge1xuXHRcdFx0d2lkdGhMZWZ0ID0gdGhpcy5jb25zdHJhaW5XaWR0aChvcC53aWR0aHMubGVmdCArIChvcC53aWR0aHMucmlnaHQgLSBvcC5uZXdXaWR0aHMucmlnaHQpKTtcblx0XHRcdHdpZHRoUmlnaHQgPSB0aGlzLmNvbnN0cmFpbldpZHRoKG9wLndpZHRocy5yaWdodCAtIGRpZmZlcmVuY2UpO1xuXHRcdH1cblx0XHRlbHNlIGlmKGRpZmZlcmVuY2UgPCAwKSB7XG5cdFx0XHR3aWR0aExlZnQgPSB0aGlzLmNvbnN0cmFpbldpZHRoKG9wLndpZHRocy5sZWZ0ICsgZGlmZmVyZW5jZSk7XG5cdFx0XHR3aWR0aFJpZ2h0ID0gdGhpcy5jb25zdHJhaW5XaWR0aChvcC53aWR0aHMucmlnaHQgKyAob3Aud2lkdGhzLmxlZnQgLSBvcC5uZXdXaWR0aHMubGVmdCkpO1xuXHRcdH1cblxuXHRcdGlmKGxlZnRDb2x1bW4pIHtcblx0XHRcdHRoaXMuc2V0V2lkdGgobGVmdENvbHVtbiwgd2lkdGhMZWZ0KTtcblx0XHR9XG5cdFx0aWYocmlnaHRDb2x1bW4pIHtcblx0XHRcdHRoaXMuc2V0V2lkdGgocmlnaHRDb2x1bW4sIHdpZHRoUmlnaHQpO1xuXHRcdH1cblxuXHRcdG9wLm5ld1dpZHRocy5sZWZ0ID0gd2lkdGhMZWZ0O1xuXHRcdG9wLm5ld1dpZHRocy5yaWdodCA9IHdpZHRoUmlnaHQ7XG5cblx0XHRyZXR1cm4gdGhpcy50cmlnZ2VyRXZlbnQoRVZFTlRfUkVTSVpFLCBbXG5cdFx0XHRvcC4kbGVmdENvbHVtbiwgb3AuJHJpZ2h0Q29sdW1uLFxuXHRcdFx0d2lkdGhMZWZ0LCB3aWR0aFJpZ2h0XG5cdFx0XSxcblx0XHRldmVudCk7XG5cdH1cblxuXHQvKipcblx0UG9pbnRlci9tb3VzZSByZWxlYXNlIGhhbmRsZXJcblxuXHRAbWV0aG9kIG9uUG9pbnRlclVwXG5cdEBwYXJhbSBldmVudCB7T2JqZWN0fSBFdmVudCBvYmplY3QgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnRlcmFjdGlvblxuXHQqKi9cblx0b25Qb2ludGVyVXAoZXZlbnQpIHtcblx0XHRsZXQgb3AgPSB0aGlzLm9wZXJhdGlvbjtcblx0XHRpZighdGhpcy5vcGVyYXRpb24pIHsgcmV0dXJuOyB9XG5cblx0XHRcblx0XHR0aGlzLiRkb2N1bWVudC51bmJpbmQoJ3NlbGVjdHN0YXJ0Jyk7XG5cdFx0dGhpcy4kYm9keS5jc3MoJy1tb3otdXNlci1zZWxlY3QnLCcnKTtcblxuXHRcdHRoaXMudW5iaW5kRXZlbnRzKHRoaXMuJG93bmVyRG9jdW1lbnQsIFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICdtb3VzZW1vdmUnLCAndG91Y2htb3ZlJ10pO1xuXG5cdFx0dGhpcy4kaGFuZGxlQ29udGFpbmVyXG5cdFx0XHQuYWRkKHRoaXMuJHRhYmxlKVxuXHRcdFx0LnJlbW92ZUNsYXNzKENMQVNTX1RBQkxFX1JFU0laSU5HKTtcblxuXHRcdG9wLiRsZWZ0Q29sdW1uXG5cdFx0XHQuYWRkKG9wLiRyaWdodENvbHVtbilcblx0XHRcdC5hZGQob3AuJGN1cnJlbnRHcmlwKVxuXHRcdFx0LnJlbW92ZUNsYXNzKENMQVNTX0NPTFVNTl9SRVNJWklORyk7XG5cblx0XHR0aGlzLnN5bmNIYW5kbGVXaWR0aHMoKTtcblx0XHR0aGlzLnNhdmVDb2x1bW5XaWR0aHMoKTtcblxuXHRcdHRoaXMub3BlcmF0aW9uID0gbnVsbDtcblxuXHRcdHJldHVybiB0aGlzLnRyaWdnZXJFdmVudChFVkVOVF9SRVNJWkVfU1RPUCwgW1xuXHRcdFx0b3AuJGxlZnRDb2x1bW4sIG9wLiRyaWdodENvbHVtbixcblx0XHRcdG9wLm5ld1dpZHRocy5sZWZ0LCBvcC5uZXdXaWR0aHMucmlnaHRcblx0XHRdLFxuXHRcdGV2ZW50KTtcblx0fVxuXG5cdC8qKlxuXHRSZW1vdmVzIGFsbCBldmVudCBsaXN0ZW5lcnMsIGRhdGEsIGFuZCBhZGRlZCBET00gZWxlbWVudHMuIFRha2VzXG5cdHRoZSA8dGFibGUvPiBlbGVtZW50IGJhY2sgdG8gaG93IGl0IHdhcywgYW5kIHJldHVybnMgaXRcblxuXHRAbWV0aG9kIGRlc3Ryb3lcblx0QHJldHVybiB7alF1ZXJ5fSBPcmlnaW5hbCBqUXVlcnktd3JhcHBlZCA8dGFibGU+IGVsZW1lbnRcblx0KiovXG5cdGRlc3Ryb3koKSB7XG5cdFx0bGV0ICR0YWJsZSA9IHRoaXMuJHRhYmxlO1xuXHRcdGxldCAkaGFuZGxlcyA9IHRoaXMuJGhhbmRsZUNvbnRhaW5lci5maW5kKCcuJytDTEFTU19IQU5ETEUpO1xuXG5cdFx0dGhpcy51bmJpbmRFdmVudHMoXG5cdFx0XHR0aGlzLiR3aW5kb3dcblx0XHRcdFx0LmFkZCh0aGlzLiRvd25lckRvY3VtZW50KVxuXHRcdFx0XHQuYWRkKHRoaXMuJHRhYmxlKVxuXHRcdFx0XHQuYWRkKCRoYW5kbGVzKVxuXHRcdCk7XG5cblx0XHQkaGFuZGxlcy5yZW1vdmVEYXRhKERBVEFfVEgpO1xuXHRcdCR0YWJsZS5yZW1vdmVEYXRhKERBVEFfQVBJKTtcblxuXHRcdHRoaXMuJGhhbmRsZUNvbnRhaW5lci5yZW1vdmUoKTtcblx0XHR0aGlzLiRoYW5kbGVDb250YWluZXIgPSBudWxsO1xuXHRcdHRoaXMuJHRhYmxlSGVhZGVycyA9IG51bGw7XG5cdFx0dGhpcy4kdGFibGUgPSBudWxsO1xuXG5cdFx0cmV0dXJuICR0YWJsZTtcblx0fVxuXG5cdHJlZnJlc2goKSB7XG5cdFx0dGhpcy51bmJpbmRFdmVudHModGhpcy4kaGFuZGxlQ29udGFpbmVyLCBbJ21vdXNlZG93bicsICd0b3VjaHN0YXJ0J10pO1xuXHRcdHRoaXMuJGhhbmRsZUNvbnRhaW5lci5yZW1vdmUoKTtcblxuXHRcdHRoaXMucmVmcmVzaEhlYWRlcnMoKTtcblx0XHR0aGlzLnN5bmNIYW5kbGVXaWR0aHMoKTtcblx0fVxuXG5cdC8qKlxuXHRCaW5kcyBnaXZlbiBldmVudHMgZm9yIHRoaXMgaW5zdGFuY2UgdG8gdGhlIGdpdmVuIHRhcmdldCBET01FbGVtZW50XG5cblx0QHByaXZhdGVcblx0QG1ldGhvZCBiaW5kRXZlbnRzXG5cdEBwYXJhbSB0YXJnZXQge2pRdWVyeX0galF1ZXJ5LXdyYXBwZWQgRE9NRWxlbWVudCB0byBiaW5kIGV2ZW50cyB0b1xuXHRAcGFyYW0gZXZlbnRzIHtTdHJpbmd8QXJyYXl9IEV2ZW50IG5hbWUgKG9yIGFycmF5IG9mKSB0byBiaW5kXG5cdEBwYXJhbSBzZWxlY3Rvck9yQ2FsbGJhY2sge1N0cmluZ3xGdW5jdGlvbn0gU2VsZWN0b3Igc3RyaW5nIG9yIGNhbGxiYWNrXG5cdEBwYXJhbSBbY2FsbGJhY2tdIHtGdW5jdGlvbn0gQ2FsbGJhY2sgbWV0aG9kXG5cdCoqL1xuXHRiaW5kRXZlbnRzKCR0YXJnZXQsIGV2ZW50cywgc2VsZWN0b3JPckNhbGxiYWNrLCBjYWxsYmFjaykge1xuXHRcdGlmKHR5cGVvZiBldmVudHMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRldmVudHMgPSBldmVudHMgKyB0aGlzLm5zO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGV2ZW50cyA9IGV2ZW50cy5qb2luKHRoaXMubnMgKyAnICcpICsgdGhpcy5ucztcblx0XHR9XG5cblx0XHRpZihhcmd1bWVudHMubGVuZ3RoID4gMykge1xuXHRcdFx0JHRhcmdldC5vbihldmVudHMsIHNlbGVjdG9yT3JDYWxsYmFjaywgY2FsbGJhY2spO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdCR0YXJnZXQub24oZXZlbnRzLCBzZWxlY3Rvck9yQ2FsbGJhY2spO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHRVbmJpbmRzIGV2ZW50cyBzcGVjaWZpYyB0byB0aGlzIGluc3RhbmNlIGZyb20gdGhlIGdpdmVuIHRhcmdldCBET01FbGVtZW50XG5cblx0QHByaXZhdGVcblx0QG1ldGhvZCB1bmJpbmRFdmVudHNcblx0QHBhcmFtIHRhcmdldCB7alF1ZXJ5fSBqUXVlcnktd3JhcHBlZCBET01FbGVtZW50IHRvIHVuYmluZCBldmVudHMgZnJvbVxuXHRAcGFyYW0gZXZlbnRzIHtTdHJpbmd8QXJyYXl9IEV2ZW50IG5hbWUgKG9yIGFycmF5IG9mKSB0byB1bmJpbmRcblx0KiovXG5cdHVuYmluZEV2ZW50cygkdGFyZ2V0LCBldmVudHMpIHtcblx0XHRpZih0eXBlb2YgZXZlbnRzID09PSAnc3RyaW5nJykge1xuXHRcdFx0ZXZlbnRzID0gZXZlbnRzICsgdGhpcy5ucztcblx0XHR9XG5cdFx0ZWxzZSBpZihldmVudHMgIT0gbnVsbCkge1xuXHRcdFx0ZXZlbnRzID0gZXZlbnRzLmpvaW4odGhpcy5ucyArICcgJykgKyB0aGlzLm5zO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGV2ZW50cyA9IHRoaXMubnM7XG5cdFx0fVxuXG5cdFx0JHRhcmdldC5vZmYoZXZlbnRzKTtcblx0fVxuXG5cdC8qKlxuXHRUcmlnZ2VycyBhbiBldmVudCBvbiB0aGUgPHRhYmxlLz4gZWxlbWVudCBmb3IgYSBnaXZlbiB0eXBlIHdpdGggZ2l2ZW5cblx0YXJndW1lbnRzLCBhbHNvIHNldHRpbmcgYW5kIGFsbG93aW5nIGFjY2VzcyB0byB0aGUgb3JpZ2luYWxFdmVudCBpZlxuXHRnaXZlbi4gUmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB0cmlnZ2VyZWQgZXZlbnQuXG5cblx0QHByaXZhdGVcblx0QG1ldGhvZCB0cmlnZ2VyRXZlbnRcblx0QHBhcmFtIHR5cGUge1N0cmluZ30gRXZlbnQgbmFtZVxuXHRAcGFyYW0gYXJncyB7QXJyYXl9IEFycmF5IG9mIGFyZ3VtZW50cyB0byBwYXNzIHRocm91Z2hcblx0QHBhcmFtIFtvcmlnaW5hbEV2ZW50XSBJZiBnaXZlbiwgaXMgc2V0IG9uIHRoZSBldmVudCBvYmplY3Rcblx0QHJldHVybiB7TWl4ZWR9IFJlc3VsdCBvZiB0aGUgZXZlbnQgdHJpZ2dlciBhY3Rpb25cblx0KiovXG5cdHRyaWdnZXJFdmVudCh0eXBlLCBhcmdzLCBvcmlnaW5hbEV2ZW50KSB7XG5cdFx0bGV0IGV2ZW50ID0gJC5FdmVudCh0eXBlKTtcblx0XHRpZihldmVudC5vcmlnaW5hbEV2ZW50KSB7XG5cdFx0XHRldmVudC5vcmlnaW5hbEV2ZW50ID0gJC5leHRlbmQoe30sIG9yaWdpbmFsRXZlbnQpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLiR0YWJsZS50cmlnZ2VyKGV2ZW50LCBbdGhpc10uY29uY2F0KGFyZ3MgfHwgW10pKTtcblx0fVxuXG5cdC8qKlxuXHRDYWxjdWxhdGVzIGEgdW5pcXVlIGNvbHVtbiBJRCBmb3IgYSBnaXZlbiBjb2x1bW4gRE9NRWxlbWVudFxuXG5cdEBwcml2YXRlXG5cdEBtZXRob2QgZ2VuZXJhdGVDb2x1bW5JZFxuXHRAcGFyYW0gJGVsIHtqUXVlcnl9IGpRdWVyeS13cmFwcGVkIGNvbHVtbiBlbGVtZW50XG5cdEByZXR1cm4ge1N0cmluZ30gQ29sdW1uIElEXG5cdCoqL1xuXHRnZW5lcmF0ZUNvbHVtbklkKCRlbCkge1xuXHRcdHJldHVybiB0aGlzLiR0YWJsZS5kYXRhKERBVEFfQ09MVU1OU19JRCkgKyAnLScgKyAkZWwuZGF0YShEQVRBX0NPTFVNTl9JRCk7XG5cdH1cblxuXHQvKipcblx0UGFyc2VzIGEgZ2l2ZW4gRE9NRWxlbWVudCdzIHdpZHRoIGludG8gYSBmbG9hdFxuXG5cdEBwcml2YXRlXG5cdEBtZXRob2QgcGFyc2VXaWR0aFxuXHRAcGFyYW0gZWxlbWVudCB7RE9NRWxlbWVudH0gRWxlbWVudCB0byBnZXQgd2lkdGggb2Zcblx0QHJldHVybiB7TnVtYmVyfSBFbGVtZW50J3Mgd2lkdGggYXMgYSBmbG9hdFxuXHQqKi9cblx0cGFyc2VXaWR0aChlbGVtZW50KSB7XG5cdFx0cmV0dXJuIGVsZW1lbnQgPyBwYXJzZUZsb2F0KGVsZW1lbnQuc3R5bGUud2lkdGgucmVwbGFjZSgnJScsICcnKSkgOiAwO1xuXHR9XG5cblx0LyoqXG5cdFNldHMgdGhlIHBlcmNlbnRhZ2Ugd2lkdGggb2YgYSBnaXZlbiBET01FbGVtZW50XG5cblx0QHByaXZhdGVcblx0QG1ldGhvZCBzZXRXaWR0aFxuXHRAcGFyYW0gZWxlbWVudCB7RE9NRWxlbWVudH0gRWxlbWVudCB0byBzZXQgd2lkdGggb25cblx0QHBhcmFtIHdpZHRoIHtOdW1iZXJ9IFdpZHRoLCBhcyBhIHBlcmNlbnRhZ2UsIHRvIHNldFxuXHQqKi9cblx0c2V0V2lkdGgoZWxlbWVudCwgd2lkdGgpIHtcblx0XHR3aWR0aCA9IHdpZHRoLnRvRml4ZWQoMik7XG5cdFx0d2lkdGggPSB3aWR0aCA+IDAgPyB3aWR0aCA6IDA7XG5cdFx0ZWxlbWVudC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJyUnO1xuXHR9XG5cblx0LyoqXG5cdENvbnN0cmFpbnMgYSBnaXZlbiB3aWR0aCB0byB0aGUgbWluaW11bSBhbmQgbWF4aW11bSByYW5nZXMgZGVmaW5lZCBpblxuXHR0aGUgYG1pbldpZHRoYCBhbmQgYG1heFdpZHRoYCBjb25maWd1cmF0aW9uIG9wdGlvbnMsIHJlc3BlY3RpdmVseS5cblxuXHRAcHJpdmF0ZVxuXHRAbWV0aG9kIGNvbnN0cmFpbldpZHRoXG5cdEBwYXJhbSB3aWR0aCB7TnVtYmVyfSBXaWR0aCB0byBjb25zdHJhaW5cblx0QHJldHVybiB7TnVtYmVyfSBDb25zdHJhaW5lZCB3aWR0aFxuXHQqKi9cblx0Y29uc3RyYWluV2lkdGgod2lkdGgpIHtcblx0XHRpZiAodGhpcy5vcHRpb25zLm1pbldpZHRoICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0d2lkdGggPSBNYXRoLm1heCh0aGlzLm9wdGlvbnMubWluV2lkdGgsIHdpZHRoKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5vcHRpb25zLm1heFdpZHRoICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0d2lkdGggPSBNYXRoLm1pbih0aGlzLm9wdGlvbnMubWF4V2lkdGgsIHdpZHRoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gd2lkdGg7XG5cdH1cblxuXHQvKipcblx0R2l2ZW4gYSBwYXJ0aWN1bGFyIEV2ZW50IG9iamVjdCwgcmV0cmlldmVzIHRoZSBjdXJyZW50IHBvaW50ZXIgb2Zmc2V0IGFsb25nXG5cdHRoZSBob3Jpem9udGFsIGRpcmVjdGlvbi4gQWNjb3VudHMgZm9yIGJvdGggcmVndWxhciBtb3VzZSBjbGlja3MgYXMgd2VsbCBhc1xuXHRwb2ludGVyLWxpa2Ugc3lzdGVtcyAobW9iaWxlcywgdGFibGV0cyBldGMuKVxuXG5cdEBwcml2YXRlXG5cdEBtZXRob2QgZ2V0UG9pbnRlclhcblx0QHBhcmFtIGV2ZW50IHtPYmplY3R9IEV2ZW50IG9iamVjdCBhc3NvY2lhdGVkIHdpdGggdGhlIGludGVyYWN0aW9uXG5cdEByZXR1cm4ge051bWJlcn0gSG9yaXpvbnRhbCBwb2ludGVyIG9mZnNldFxuXHQqKi9cblx0Z2V0UG9pbnRlclgoZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQudHlwZS5pbmRleE9mKCd0b3VjaCcpID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gKGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXSB8fCBldmVudC5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdKS5wYWdlWDtcblx0XHR9XG5cdFx0cmV0dXJuIGV2ZW50LnBhZ2VYO1xuXHR9XG59XG5cblJlc2l6YWJsZUNvbHVtbnMuZGVmYXVsdHMgPSB7XG5cdHNlbGVjdG9yOiBmdW5jdGlvbigkdGFibGUpIHtcblx0XHRpZigkdGFibGUuZmluZCgndGhlYWQnKS5sZW5ndGgpIHtcblx0XHRcdHJldHVybiBTRUxFQ1RPUl9USDtcblx0XHR9XG5cblx0XHRyZXR1cm4gU0VMRUNUT1JfVEQ7XG5cdH0sXG5cdHN0b3JlOiB3aW5kb3cuc3RvcmUsXG5cdHN5bmNIYW5kbGVyczogdHJ1ZSxcblx0cmVzaXplRnJvbUJvZHk6IHRydWUsXG5cdG1heFdpZHRoOiBudWxsLFxuXHRtaW5XaWR0aDogMC4wMVxufTtcblxuUmVzaXphYmxlQ29sdW1ucy5jb3VudCA9IDA7XG4iLCJleHBvcnQgY29uc3QgREFUQV9BUEkgPSAncmVzaXphYmxlQ29sdW1ucyc7XG5leHBvcnQgY29uc3QgREFUQV9DT0xVTU5TX0lEID0gJ3Jlc2l6YWJsZS1jb2x1bW5zLWlkJztcbmV4cG9ydCBjb25zdCBEQVRBX0NPTFVNTl9JRCA9ICdyZXNpemFibGUtY29sdW1uLWlkJztcbmV4cG9ydCBjb25zdCBEQVRBX1RIID0gJ3RoJztcblxuZXhwb3J0IGNvbnN0IENMQVNTX1RBQkxFX1JFU0laSU5HID0gJ3JjLXRhYmxlLXJlc2l6aW5nJztcbmV4cG9ydCBjb25zdCBDTEFTU19DT0xVTU5fUkVTSVpJTkcgPSAncmMtY29sdW1uLXJlc2l6aW5nJztcbmV4cG9ydCBjb25zdCBDTEFTU19IQU5ETEUgPSAncmMtaGFuZGxlJztcbmV4cG9ydCBjb25zdCBDTEFTU19IQU5ETEVfQ09OVEFJTkVSID0gJ3JjLWhhbmRsZS1jb250YWluZXInO1xuXG5leHBvcnQgY29uc3QgRVZFTlRfUkVTSVpFX1NUQVJUID0gJ2NvbHVtbjpyZXNpemU6c3RhcnQnO1xuZXhwb3J0IGNvbnN0IEVWRU5UX1JFU0laRSA9ICdjb2x1bW46cmVzaXplJztcbmV4cG9ydCBjb25zdCBFVkVOVF9SRVNJWkVfU1RPUCA9ICdjb2x1bW46cmVzaXplOnN0b3AnO1xuXG5leHBvcnQgY29uc3QgU0VMRUNUT1JfVEggPSAndHI6Zmlyc3QgPiB0aDp2aXNpYmxlJztcbmV4cG9ydCBjb25zdCBTRUxFQ1RPUl9URCA9ICd0cjpmaXJzdCA+IHRkOnZpc2libGUnO1xuZXhwb3J0IGNvbnN0IFNFTEVDVE9SX1VOUkVTSVpBQkxFID0gYFtkYXRhLW5vcmVzaXplXWA7XG4iLCJpbXBvcnQgUmVzaXphYmxlQ29sdW1ucyBmcm9tICcuL2NsYXNzJztcbmltcG9ydCBhZGFwdGVyIGZyb20gJy4vYWRhcHRlcic7XG5cbi8vZXhwb3J0IGRlZmF1bHQgUmVzaXphYmxlQ29sdW1ucztcbm1vZHVsZS5leHBvcnRzID0gUmVzaXphYmxlQ29sdW1uczsiXX0=
