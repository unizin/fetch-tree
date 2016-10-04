import { register } from '../processor'
import group from './group'
import withProps from './with-props'

const TYPE = 'preload'

export default register({
    TYPE,
    factory(factory) {
        return {
            TYPE,
            factory,
        }
    },
    nodeProcessor(next, scope, node, ...args) {
        const children = node.factory(withProps, ...args)

        if (!Array.isArray(children)) {
            throw new Error('Preload must return an array of nodes to process')
        }

        if (Array.isArray(children) && children.length === 0) {
            return {
                isReady: true,
                excludeProp: true,
            }
        }

        const child = group(children)

        const { isReady } = next(scope, child)
        return {
            excludeProp: true,
            isReady,
        }
    },
})
