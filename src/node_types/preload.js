import { register } from '../processor'
import group from './group'

const TYPE = 'preload'

const useProps = (function useProps() {
    const TYPE = 'useProps'

    return register({
        TYPE,
        factory(props, child) {
            return {
                TYPE,
                props,
                child,
            }
        },
        nodeProcessor(next, scope, node, ...args) {
            const childScope = {
                ...scope,
                props: node.props,
            }
            return next(childScope, node.child, ...args)
        },
    })
}())

const preload = register({
    TYPE,
    factory(factory) {
        return {
            TYPE,
            factory,
        }
    },
    nodeProcessor(next, scope, node, ...args) {
        const children = node.factory(useProps, ...args)

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


export default preload
