'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (parent) {
    if (parent && !parent.hasExecuted) {
        throw new Error('invalid parent');
    }
    var executedIds = new Map();

    function hasExecuted(id) {
        return executedIds.has(id) || (parent != null ? parent.hasExecuted(id) : false);
    }

    function execute(dispatch, actions) {
        actions.forEach(function (_ref) {
            var id = _ref.id,
                action = _ref.action,
                args = _ref.args,
                debug = _ref.debug;

            if (!hasExecuted(id)) {
                var tmp = void 0;
                if (debug) {
                    var _console;

                    /* eslint-disable no-console */
                    var groupName = 'action: ' + id;
                    console.groupCollapsed(groupName);
                    (_console = console).log.apply(_console, ['...args: '].concat(_toConsumableArray(args)));
                    try {
                        tmp = dispatch(action.apply(undefined, _toConsumableArray(args)));
                    } catch (e) {
                        console.error('Error executing:', id);
                        throw e;
                    } finally {
                        console.groupEnd(groupName);
                    }
                    /* eslint-enable no-console */
                } else {
                    tmp = dispatch(action.apply(undefined, _toConsumableArray(args)));
                }
                executedIds.set(id, true);

                if (!tmp || !tmp.then) {
                    // Use the thunk middleware and return a promise from the thunk.
                    throw new Error('Actions need to return a promise');
                } else {
                    tmp.then(function () {
                        return dispatch((0, _actionsReducer.setActionStatusDone)(id));
                    });
                }
            }
        });
    }

    return {
        execute: execute,
        hasExecuted: hasExecuted
    };
};

var _actionsReducer = require('./actions-reducer');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }