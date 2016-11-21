import { register } from '../processor'
import depends from './depends'

const TYPE = 'child'
export default register({
    TYPE,
    factory(deps, childFactory) {
        return depends(
            deps,
            { TYPE, childFactory, deps }
        )
    },
    nodeProcessor(next, scope, node, ...args) {
        const { props, type: Component } = node.childFactory(...args)

        const childScope = {
            ...scope,
            props,
        }

        const { isReady, value } = next(childScope, Component.resourceGroup)

        return {
            isReady,
            value: isReady
                ? { ...props, ...value }
                : null,
        }
    },
})
