import test from 'ava'
import debug from '../debug'

test(`debug.processor sets debug in the context and processes its child`, t => {
    const childNode = { TYPE: 'example' }
    const node = debug(childNode)

    const context = {
        someNonsenseValue: {},
        debug: false,
    }

    const next = (childContext, node) => {
        // The node sets debug in the context
        t.is(childContext.debug, true)
        // This is a NEW context, not modified
        t.not(childContext, context)
        // The new context inherits the existing properties
        t.is(childContext.someNonsenseValue, context.someNonsenseValue)
        // the child node is processed unmodified
        t.is(node, childNode)
    }

    debug.nodeProcessor(next, context, node)

    // Original context was not modified
    t.is(context.debug, false)
})
