import { register } from '../processor'
import normalize from './normalize'
const TYPE = 'debug'


/* eslint-disable no-console */
/* istanbul ignore next */
const groupCollapsed = (...args) => {
    if (console.groupCollapsed != null) {
        console.groupCollapsed(...args)
    }
}
/* istanbul ignore next */
const groupEnd = (...args) => {
    /* istanbul ignore if */
    if (console.groupEnd != null) {
        console.groupEnd(...args)
    }
}


export default register({
    TYPE,
    factory(child) {
        if (child == null) {
            throw new Error('Missing child')
        }

        return {
            TYPE,
            child: normalize(child),
        }
    },
    nodeProcessor(next, scope, node) {
        const childScope = {
            ...scope,
            debug: true,
        }

        try {
            groupCollapsed('DEBUG')
            return next(childScope, node.child)
        } finally {
            groupEnd('DEBUG')
        }
    },
})
