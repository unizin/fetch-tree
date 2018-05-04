'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = selector;

var TYPE = 'selector';

function selector(select) {
    if (typeof select !== 'function') {
        throw new Error('Missing selector');
    }

    return {
        TYPE: TYPE,
        select: select
    };
}
selector.TYPE = TYPE;