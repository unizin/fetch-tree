import { register } from '../processor'
const TYPE = 'debug'

export default function debug(child) {
    if (child == null) {
        throw new Error('Missing child')
    }

    return {
        TYPE,
        child,
    }
}

/* eslint-disable no-console */
register(TYPE, (next, context, node, state) => {
    const childContext = {
        ...context,
        debug: true,
    }

    try {
        console.groupCollapsed('DEBUG')
        return next(childContext, node.child, state)
    } finally {
        console.groupEnd('DEBUG')
    }
}
)
