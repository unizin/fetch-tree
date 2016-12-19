import debug from '../debug'

it(`debug.processor sets debug in the context and processes its child`, () => {
    const childNode = { TYPE: 'example' }
    const node = debug(childNode)

    const context = {
        someNonsenseValue: {},
        debug: false,
    }

    const next = (childContext, node) => {
        // The node sets debug in the context
        expect(childContext.debug).toBe(true)
        // This is a NEW context, not modified
        expect(childContext).not.toBe(context)
        // The new context inherits the existing properties
        expect(childContext.someNonsenseValue).toBe(context.someNonsenseValue)
        // the child node is processed unmodified
        expect(node).toBe(childNode)
    }

    debug.nodeProcessor(next, context, node)

    // Original context was not modified
    expect(context.debug).toBe(false)
})
