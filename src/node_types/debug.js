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
register(TYPE, (next, processingContext, node) => {
    const childProcessingContext = {
        ...processingContext,
        debug: true,
    }

    try {
        console.groupCollapsed('DEBUG')
        return next(childProcessingContext, node.child)
    } finally {
        console.groupEnd('DEBUG')
    }
}
)
