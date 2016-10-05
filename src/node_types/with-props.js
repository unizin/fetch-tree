import { register } from '../processor'

const TYPE = 'useProps'

export default register({
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
