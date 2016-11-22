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

        if (!Component.resourceGroup) {
            throw new Error(`child() node at ${scope.path.join('.')} does not appear to be a fetch-tree component`)
        }

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
