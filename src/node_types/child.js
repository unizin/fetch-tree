import { register } from '../processor'
import depends from './depends'

function processChild(next, scope, child) {
    const { props, type: Component } = child

    if (!Component.resourceGroup) {
        throw new Error(`child() node at ${scope.path.join('.')} does not appear to be a fetch-tree component`)
    }

    const childScope = {
        ...scope,
        props,
    }

    return next(childScope, Component.resourceGroup)
}


function processChildren(next, scope, children) {
    return children.reduce((tmp, child) => {
        const { isReady, value } = processChild(next, scope, child)

        return {
            isReady: (tmp.isReady && isReady),
            value: (tmp.isReady && isReady)
            ? { ...child.props, ...value }
            : null,
        }
    }, { isReady: true })
}


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
        const children = node.childFactory(...args)

        if (Array.isArray(children)) {
            return processChildren(next, scope, children)
        }
        return processChildren(next, scope, [children]).pop()
    },
})
