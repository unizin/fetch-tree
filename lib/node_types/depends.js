'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = depends;

var _normalize = require('./normalize');

var _normalize2 = _interopRequireDefault(_normalize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TYPE = 'depends';

var prop = function prop(path) {
    return { type: 'prop', path: path };
};
var resource = function resource(path) {
    return { type: 'resource', path: path };
};
var value = function value(_value) {
    return { type: 'value', value: _value };
};

function normalizeDependency(dep) {
    if (typeof dep === 'string') {
        dep = {
            type: 'resource',
            path: dep
        };
    }

    if (dep.type !== 'resource' && dep.type !== 'prop' && dep.type !== 'value') {
        throw new Error('Invalid dependency type: ' + dep.type);
    }
    if (!dep.path && dep.type !== 'value') {
        throw new Error('Missing dependency path');
    }

    return dep;
}

function depends() {
    var dependencies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var child = arguments[1];

    if (!Array.isArray(dependencies)) {
        throw new Error('dependencies must be an array');
    }
    if (dependencies.length === 0) {
        throw new Error('Missing dependencies');
    }
    if (child == null) {
        throw new Error('Missing child');
    }
    child = (0, _normalize2.default)(child);
    if (!child.TYPE) {
        throw new Error('Invalid child type');
    }

    return {
        TYPE: TYPE,
        dependencies: dependencies.map(normalizeDependency),
        child: child
    };
}

depends.prop = prop;
depends.resource = resource;

// I don't know if `value` is useful outside of tests
depends.value = value;

depends.TYPE = TYPE;