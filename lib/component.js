"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (_ref) {
  var Component = _ref.component,
      Busy = _ref.busy,
      resources = _ref.resources,
      _ref$mapDispatchToPro = _ref.mapDispatchToProps,
      mapDispatchToProps = _ref$mapDispatchToPro === undefined ? {} : _ref$mapDispatchToPro;

  var displayName = "Loader(" + getDisplayName(Component) + ")";

  if (resources.TYPE !== "group") {
    if (resources.TYPE === "debug" && resources.child.TYPE === "group") {
      // It's ok to wrap the group in a debug node
    } else {
      throw new Error("resources must be a `group()`");
    }
  }

  var LoaderComponent = function (_React$Component) {
    _inherits(LoaderComponent, _React$Component);

    function LoaderComponent(props, context) {
      _classCallCheck(this, LoaderComponent);

      var _this = _possibleConstructorReturn(this, (LoaderComponent.__proto__ || Object.getPrototypeOf(LoaderComponent)).call(this, props, context));

      _this.loaderContext = (0, _loader_context2.default)(context.loaderContext);
      return _this;
    }

    _createClass(LoaderComponent, [{
      key: "getChildContext",
      value: function getChildContext() {
        return {
          loaderContext: this.loaderContext
        };
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var _props = this.props,
            actionQueue = _props[ACTION_QUEUE],
            dispatch = _props[DISPATCH];

        this.loaderContext.execute(dispatch, actionQueue);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        var _props2 = this.props,
            actionQueue = _props2[ACTION_QUEUE],
            dispatch = _props2[DISPATCH];

        this.loaderContext.execute(dispatch, actionQueue);
      }
    }, {
      key: "render",
      value: function render() {
        var _props3 = this.props,
            isReady = _props3[IS_READY],
            actionQueue = _props3[ACTION_QUEUE],
            props = _objectWithoutProperties(_props3, [IS_READY, ACTION_QUEUE]);

        if (!isReady) {
          if (Busy) {
            return _react2.default.createElement(Busy, null);
          }

          return _react2.default.createElement("noscript", null);
        }

        return _react2.default.createElement(Component, props);
      }
    }]);

    return LoaderComponent;
  }(_react2.default.Component);

  LoaderComponent.displayName = displayName;
  LoaderComponent.childContextTypes = {
    loaderContext: contextShape
  };
  LoaderComponent.contextTypes = {
    loaderContext: contextShape
  };


  function mapStateToProps(state, props) {
    var _extends2;

    var _processor = (0, _processor3.default)(resources, state, props),
        isReady = _processor.isReady,
        actionQueue = _processor.actionQueue,
        value = _processor.value;

    return _extends({}, value, (_extends2 = {}, _defineProperty(_extends2, IS_READY, isReady), _defineProperty(_extends2, ACTION_QUEUE, actionQueue), _extends2));
  }

  if (typeof mapDispatchToProps === "function") {
    throw new Error("not implemented");
  }
  mapDispatchToProps[DISPATCH] = function (action) {
    return action;
  };

  return (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(LoaderComponent);
};

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _loader_context = require("./loader_context");

var _loader_context2 = _interopRequireDefault(_loader_context);

var _processor2 = require("./processor");

var _processor3 = _interopRequireDefault(_processor2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getDisplayName = function getDisplayName(Component) {
  return Component.displayName || Component.name || (typeof Component === "string" ? Component : "Component");
};

var contextShape = _propTypes2.default.shape({
  execute: _propTypes2.default.func.isRequired,
  hasExecuted: _propTypes2.default.func.isRequired
});

// These need to get passed as props and we need to avoid name conflicts with
// any props the user is passing through to Component. Using the dashes and
// colons ensures that we can't accidentally conflict with JSX props.
var IS_READY = "--loader:is-ready";
var ACTION_QUEUE = "--loader:action-queue";
var DISPATCH = "--loader:dispatch";