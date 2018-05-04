'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reducer;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ACTION_DONE = exports.ACTION_DONE = '@@fetchTree/action_done';

var setActionStatusDone = exports.setActionStatusDone = function setActionStatusDone(id) {
    return {
        type: ACTION_DONE,
        payload: id
    };
};

var selectIsReady = exports.selectIsReady = function selectIsReady(state, id) {
    return state.fetchTree && state.fetchTree[id] != null;
};

function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (action.type !== ACTION_DONE) return state;
    return _extends({}, state, _defineProperty({}, action.payload, true));
}