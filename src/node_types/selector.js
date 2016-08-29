import { register } from '../processor.js'

const TYPE = 'selector'

export default function selector(select) {
    if (typeof select !== 'function') {
        throw new Error('Missing selector')
    }

    return {
        TYPE,
        select,
    }
}
selector.TYPE = TYPE

register(TYPE, (next, processingContext, node, ...args) => {
    return {
        isReady: true,
        value: node.select(processingContext.state, ...args),
    }
})
