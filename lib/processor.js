'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _visitors;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = processor;

var _depends = require('./node_types/depends');

var _depends2 = _interopRequireDefault(_depends);

var _group = require('./node_types/group');

var _group2 = _interopRequireDefault(_group);

var _loader = require('./node_types/loader');

var _loader2 = _interopRequireDefault(_loader);

var _preload = require('./node_types/preload');

var _preload2 = _interopRequireDefault(_preload);

var _selector = require('./node_types/selector');

var _selector2 = _interopRequireDefault(_selector);

var _debug = require('./node_types/debug');

var _debug2 = _interopRequireDefault(_debug);

var _virtual = require('./node_types/virtual');

var _virtual2 = _interopRequireDefault(_virtual);

var _utils = require('./utils');

var _actionsReducer = require('./actions-reducer.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
var visitors = (_visitors = {}, _defineProperty(_visitors, _loader2.default.TYPE, function (context, node, state, props) {
    for (var _len = arguments.length, args = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
        args[_key - 4] = arguments[_key];
    }

    var id = node.id.apply(node, args);
    if (typeof id !== 'string') {
        throw new Error('Loader failed to return an id');
    }
    var value = void 0;

    var isReady = node.lazy === true || (0, _actionsReducer.selectIsReady)(state, id);

    // Always queue the action. The component can choose whether or not to
    // call it.
    context.queue(id, node.action, args);

    if (isReady) {
        value = node.selector.apply(node, [state].concat(args));
    }

    return {
        isReady: isReady,
        value: value
    };
}), _defineProperty(_visitors, _virtual2.default.TYPE, function (context, node, state, props) {
    for (var _len2 = arguments.length, args = Array(_len2 > 4 ? _len2 - 4 : 0), _key2 = 4; _key2 < _len2; _key2++) {
        args[_key2 - 4] = arguments[_key2];
    }

    var value = next.apply(undefined, [context, node.child, state, props].concat(args));

    return _extends({}, value, {
        excludeProp: true
    });
}), _defineProperty(_visitors, _preload2.default.TYPE, function (context, node, state, props) {
    for (var _len3 = arguments.length, args = Array(_len3 > 4 ? _len3 - 4 : 0), _key3 = 4; _key3 < _len3; _key3++) {
        args[_key3 - 4] = arguments[_key3];
    }

    var children = node.factory.apply(node, [_preload2.default.useProps].concat(args));

    if (!Array.isArray(children)) {
        throw new Error('Preload must return an array of nodes to process');
    }

    if (Array.isArray(children) && children.length === 0) {
        return {
            isReady: true,
            excludeProp: true
        };
    }

    var child = (0, _group2.default)(children);

    var _next = next(context, child, state, props),
        isReady = _next.isReady;

    return {
        excludeProp: true,
        isReady: isReady
    };
}), _defineProperty(_visitors, _preload2.default.useProps.TYPE, function (context, node, state, props) {
    for (var _len4 = arguments.length, args = Array(_len4 > 4 ? _len4 - 4 : 0), _key4 = 4; _key4 < _len4; _key4++) {
        args[_key4 - 4] = arguments[_key4];
    }

    return next.apply(undefined, [context, node.child, state, node.props].concat(args));
}), _defineProperty(_visitors, _depends2.default.TYPE, function (context, node, state, props) {
    var isReady = true;

    if (context.debug) {
        var _console;

        (_console = console).log.apply(_console, ['node.dependencies: '].concat(_toConsumableArray(node.dependencies)));
    }

    var args = node.dependencies.map(function (dep) {
        if (isReady === false) return null;

        if (dep.type === 'value') {
            return dep.value;
        }

        var path = dep.path.split('.');
        var root = void 0;
        if (dep.type === 'prop') {
            root = props;
        } else if (dep.type === 'resource') {
            var key = path.shift();
            var resource = context.resources[key];

            if (resource.isReady) {
                root = resource.value;
            } else {
                isReady = false;
                return null;
            }
        }

        return path.reduce(function (value, next) {
            return value != null ? value[next] : null;
        }, root);
    });

    if (!isReady) {
        return {
            isReady: isReady
        };
    }

    return next.apply(undefined, [context, node.child, state, props].concat(_toConsumableArray(args)));
}), _defineProperty(_visitors, _selector2.default.TYPE, function (context, node, state, props) {
    for (var _len5 = arguments.length, args = Array(_len5 > 4 ? _len5 - 4 : 0), _key5 = 4; _key5 < _len5; _key5++) {
        args[_key5 - 4] = arguments[_key5];
    }

    return {
        isReady: true,
        value: node.select.apply(node, [state].concat(args))
    };
}), _defineProperty(_visitors, _group2.default.TYPE, function (context, node, state, props) {
    var resources = {};
    var path = context.path;


    var results = (0, _utils.reduce)(node.children, function (x, child, key) {
        var childContext = _extends({}, context, {
            resources: resources,
            path: [].concat(_toConsumableArray(path), [key])
        });
        var result = resources[key] = next(childContext, child, state, props);
        var isReady = result.isReady,
            value = result.value,
            excludeProp = result.excludeProp;


        if (excludeProp === true || !isReady) {
            return _extends({}, x, {
                isReady: x.isReady && isReady
            });
        }

        var nextValue = Array.isArray(node.children) ? [].concat(_toConsumableArray(x.value), [value]) : _extends({}, x.value, _defineProperty({}, key, value));

        return {
            isReady: x.isReady && isReady,
            value: nextValue
        };
    }, { isReady: true, value: Array.isArray(node.children) ? [] : {} });

    return results;
}), _defineProperty(_visitors, _debug2.default.TYPE, function (context, node, state, props) {
    var childContext = _extends({}, context, {
        debug: true
    });

    try {
        console.groupCollapsed('DEBUG');
        return next(childContext, node.child, state, props);
    } finally {
        console.groupEnd('DEBUG');
    }
}), _visitors);

function next(context, node, state, props) {
    if (!visitors[node.TYPE]) {
        console.log(node);
        throw new Error('Invalid type: ' + String(node.TYPE));
    }

    var debug = context.debug;


    var value = void 0;

    for (var _len6 = arguments.length, args = Array(_len6 > 4 ? _len6 - 4 : 0), _key6 = 4; _key6 < _len6; _key6++) {
        args[_key6 - 4] = arguments[_key6];
    }

    if (debug) {
        var groupName = node.TYPE + ': ' + context.path.join('.');

        console.groupCollapsed(groupName);
        console.log('node: ', node);
        if (args.length > 0) {
            var _console2;

            (_console2 = console).log.apply(_console2, ['...args: '].concat(args));
        }
        try {
            value = visitors[node.TYPE].apply(visitors, [context, node, state, props].concat(args));
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            console.log('isReady', value.isReady);
            console.log('value', value.value);
            console.groupEnd(groupName);
        }
    } else {
        value = visitors[node.TYPE].apply(visitors, [context, node, state, props].concat(args));
    }
    return value;
}

function processor(node, state, props) {
    var actionQueue = [];
    var context = {
        debug: false,
        queue: function queue(id, action, args) {
            if (this.debug) {
                console.log('queue action', id);
            }
            actionQueue.push({ id: id, action: action, args: args, debug: this.debug });
        },

        path: ['root']
    };

    var value = next(context, node, state, props);

    return _extends({}, value, {
        actionQueue: actionQueue
    });
}