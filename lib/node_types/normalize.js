'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = normalize;

var _selector = require('./selector.js');

var _selector2 = _interopRequireDefault(_selector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function normalize(child) {
    if (typeof child === 'function') {
        return (0, _selector2.default)(child);
    }

    if (child.TYPE == null) {
        console.error('node:', child);
        throw new Error('Invalid node');
    }

    return child;
}