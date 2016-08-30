import { register } from '../processor'
const TYPE = 'lazy'

export default register({
    TYPE,
    factory(factory) {
        return {
            TYPE,
            factory,
        }
    },
    nodeProcessor(next, processingContext, node, ...args) {
        const child = node.factory(...args)
        return next(processingContext, child)
    },
})
