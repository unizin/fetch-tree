import { register } from '../processor'

const TYPE = 'withContext'

export default register({
    TYPE,
    factory(key, value, child) {
        return {
            TYPE,
            key,
            value,
            child,
        }
    },
    nodeProcessor(next, scope, node, ...args) {
        const childScope = {
            ...scope,
            [node.key]: node.value,
        }
        return next(childScope, node.child, ...args)
    },
})
