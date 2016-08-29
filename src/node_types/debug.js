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
register(TYPE, (next, processingContext, node, state) => {
    const childProcessingContext = {
        ...processingContext,
        debug: true,
    }

    try {
        console.groupCollapsed('DEBUG')
        return next(childProcessingContext, node.child, state)
    } finally {
        console.groupEnd('DEBUG')
    }
}
)
