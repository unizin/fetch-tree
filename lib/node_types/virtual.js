'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = virtual;

var _normalize = require('./normalize.js');

var _normalize2 = _interopRequireDefault(_normalize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TYPE = 'virtual';

function virtual(child) {
    if (child == null) {
        throw new Error('Missing child');
    }

    return {
        TYPE: TYPE,
        child: (0, _normalize2.default)(child)
    };
}
virtual.TYPE = TYPE;