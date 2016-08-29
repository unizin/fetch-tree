import { register } from '../processor'
import group from './group'

const TYPE = 'preload'

export default function preload(factory) {
    return {
        TYPE,
        factory,
    }
}

preload.TYPE = TYPE

preload.useProps = (function useProps() {
    const TYPE = 'useProps'
    function useProps(props, child) {
        return {
            TYPE,
            props,
            child,
        }
    }
    useProps.TYPE = TYPE
    return useProps
}())

register(TYPE, (next, context, node, state, ...args) => {
    const children = node.factory(preload.useProps, ...args)

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

    const { isReady } = next(context, child, state)
    return {
        excludeProp: true,
        isReady,
    }
})

register(preload.useProps.TYPE, (next, context, node, state, ...args) => {
    const childContext = {
        ...context,
        props: node.props,
    }
    return next(childContext, node.child, state, ...args)
})
