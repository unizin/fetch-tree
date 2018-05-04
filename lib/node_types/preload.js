'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = preload;


var TYPE = 'preload';

function preload(factory) {
    return {
        TYPE: TYPE,
        factory: factory
    };
}

preload.TYPE = TYPE;

preload.useProps = function useProps() {
    var TYPE = 'useProps';
    function useProps(props, child) {
        return {
            TYPE: TYPE,
            props: props,
            child: child
        };
    }
    useProps.TYPE = TYPE;
    return useProps;
}();