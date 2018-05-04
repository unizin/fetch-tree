'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = debug;
var TYPE = 'debug';

function debug(child) {
    if (child == null) {
        throw new Error('Missing child');
    }

    return {
        TYPE: TYPE,
        child: child
    };
}
debug.TYPE = TYPE;