/* eslint-disable no-console */
const visitors = {}

function next(processingContext, node, ...args) {
    if (!visitors[node.TYPE]) {
        console.log(node)
        throw new Error(`Invalid type: ${String(node.TYPE)}`)
    }

    const { debug } = processingContext

    let value

    if (debug) {
        const groupName = `${node.TYPE}: ${processingContext.path.join('.')}`

        console.groupCollapsed(groupName)
        console.log('node: ', node)
        if (args.length > 0) {
            console.log('...args: ', ...args)
        }
        value = visitors[node.TYPE](next, processingContext, node, ...args)
        console.log('isReady', value.isReady)
        console.log('value', value.value)
        console.groupEnd(groupName)
    } else {
        value = visitors[node.TYPE](next, processingContext, node, ...args)
    }
    return value
}

export default function processor(node, state, props) {
    if (props) {
        throw new Error(`processor does not accept props. Wrap the node in withProps instead`)
    }
    const actionQueue = []
    const processingContext = {
        props: {},
        state,
        debug: false,
        queue(id, action, args) {
            if (this.debug) {
                console.log('queue action', id)
            }
            actionQueue.push({ id, action, args, debug: this.debug })
        },
        path: ['root'],
    }

    const value = next(processingContext, node)

    return {
        ...value,
        actionQueue,
    }
}

export const register = ({ TYPE, factory, nodeProcessor }) => {
    if (!TYPE) { throw new Error('missing TYPE') }
    if (!factory) { throw new Error('missing factory') }
    if (!nodeProcessor) { throw new Error('missing nodeProcessor') }
    if (visitors[TYPE]) {
        throw new Error(`visitor ${TYPE} is already registered`)
    }
    visitors[TYPE] = nodeProcessor

    // It's useful to attach the nodeProcessor and type for testing purposes.
    factory.nodeProcessor = nodeProcessor
    factory.TYPE = TYPE

    // the factory is the only piece users interact with, so return it directly
    return factory
}
