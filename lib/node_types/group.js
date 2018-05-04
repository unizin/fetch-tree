'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = group;

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

var _normalize = require('./normalize.js');

var _normalize2 = _interopRequireDefault(_normalize);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TYPE = 'group';

function group(children) {
    if (children == null) {
        throw new Error('Missing children');
    }
    if (Array.isArray(children)) {
        if (children.length === 0) {
            throw new Error('Empty children'); // Are you my mummy?
        }
    } else {
        if (Object.keys(children).length === 0) {
            throw new Error('Empty children'); // Are you my mummy?
        }
    }

    return {
        TYPE: TYPE,
        children: (0, _utils.map)(children, _normalize2.default)
    };
}
group.TYPE = TYPE;

group.debug = function debugGroup(children) {
    return (0, _debug2.default)(group(children));
};