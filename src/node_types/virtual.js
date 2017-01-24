import { register } from '../processor'
import normalize from './normalize.js'
const TYPE = 'virtual'

export default register({
    TYPE,
    factory(child) {
        if (child == null) {
            throw new Error('Missing child')
        }

        return {
            TYPE,
            child: normalize(child),
        }
    },
    nodeProcessor(next, scope, node, ...args) {
        const value = next(scope, node.child, ...args)

        return {
            ...value,
            excludeProp: true,
        }
    },
    findPropTypes(next, propShape, node) {
        return next(propShape, node.child)
    },
})
