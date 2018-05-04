'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = loader;
var TYPE = 'loader';

function loader() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = options.action,
        selector = options.selector,
        id = options.id,
        _options$lazy = options.lazy,
        lazy = _options$lazy === undefined ? false : _options$lazy;


    if (typeof action !== 'function') {
        throw new Error('Missing action');
    }
    if (typeof selector !== 'function') {
        throw new Error('Missing selector');
    }
    if (typeof id !== 'function') {
        throw new Error('Missing id');
    }

    return {
        TYPE: TYPE,
        id: id,
        action: action,
        selector: selector,
        lazy: lazy
    };
}

loader.TYPE = TYPE;