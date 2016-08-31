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
    nodeProcessor(next, scope, node, ...args) {
        const child = node.factory(...args)
        return next(scope, child)
    },
})
