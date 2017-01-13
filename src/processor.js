/* eslint-disable no-console */
import { hasMocks, getMock, hasMock } from './mocks'
const visitors = {}

function next(processingContext, node, ...args) {
    if (process.env.NODE_ENV !== 'production' && hasMocks()) {
        node = getMock(node)
    }

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

    if (process.env.NODE_ENV !== 'production' && hasMocks()) {
        if (!value.isReady) {
            throw processingContext.missingMock('when mocking all nodes must be ready')
        }
    }

    return value
}

export default function processor(node, state) {
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
        // Expose these for 3rd party nodes
        hasMocks,
        hasMock,
        getMock,
        missingMock(message = '') {
            return new Error(`MissingMock: ${message}\nLocation: ${this.path.join('.')}`)
        },
    }

    const value = next(processingContext, node)

    return {
        ...value,
        actionQueue,
    }
}

export const register = ({ TYPE, factory, nodeProcessor }) => {
    if (!TYPE) { throw new Error('missing TYPE') }
    if (typeof TYPE !== 'string') { throw new Error('Invalid TYPE (it must be a string)') }
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
