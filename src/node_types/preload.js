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
        nodeProcessor(next, processingContext, node, ...args) {
            const childProcessingContext = {
                ...processingContext,
                props: node.props,
            }
            return next(childProcessingContext, node.child, ...args)
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
    nodeProcessor(next, processingContext, node, ...args) {
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

        const { isReady } = next(processingContext, child)
        return {
            excludeProp: true,
            isReady,
        }
    },
})


export default preload
