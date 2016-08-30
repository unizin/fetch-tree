import { register } from '../processor.js'

const TYPE = 'selector'

export default register({
    TYPE,
    factory(select) {
        if (typeof select !== 'function') {
            throw new Error('Missing selector')
        }

        return {
            TYPE,
            select,
        }
    },
    nodeProcessor(next, processingContext, node, ...args) {
        return {
            isReady: true,
            value: node.select(processingContext.state, ...args),
        }
    },
})
