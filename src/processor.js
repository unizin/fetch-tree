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
    const actionQueue = []
    const processingContext = {
        props,
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

export const register = (type, implemenation) => {
    if (visitors[type]) {
        throw new Error(`visitor ${type} is already registered`)
    }
    visitors[type] = implemenation
}
