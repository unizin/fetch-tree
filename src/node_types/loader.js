import { register } from '../processor'
import { selectIsReady } from '../actions-reducer'
const TYPE = 'loader'

export default function loader(options = {}) {
    const { action, selector, id, lazy = false } = options

    if (typeof action !== 'function') {
        throw new Error('Missing action')
    }
    if (typeof selector !== 'function') {
        throw new Error('Missing selector')
    }
    if (typeof id !== 'function') {
        throw new Error('Missing id')
    }

    return {
        TYPE,
        id,
        action,
        selector,
        lazy,
    }
}

loader.TYPE = TYPE

register(TYPE, (next, processingContext, node, ...args) => {
    const id = node.id(...args)
    if (typeof id !== 'string') {
        throw new Error('Loader failed to return an id')
    }
    let value

    const isReady = node.lazy === true || selectIsReady(processingContext.state, id)

    // Always queue the action. The component can choose whether or not to
    // call it.
    processingContext.queue(id, node.action, args)

    if (isReady) {
        value = node.selector(processingContext.state, ...args)
    }

    return {
        isReady,
        value,
    }
})
