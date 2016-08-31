import { register } from '../processor'
const TYPE = 'debug'


/* eslint-disable no-console */
const groupCollapsed = (...args) => {
    if (console.groupCollapsed != null) {
        console.groupCollapsed(...args)
    }
}
const groupEnd = (...args) => {
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
            child,
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
