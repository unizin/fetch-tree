import { register } from '../processor'
import depends from './depends'

function processChild(next, scope, child) {
    if (!child || !child.type.resourceGroup) {
        throw new Error(`child() node at ${scope.path.join('.')} does not appear to be a fetch-tree component`)
    }
    const { props, type: Component } = child

    const childScope = {
        ...scope,
        props,
    }

    return next(childScope, Component.resourceGroup)
}


function processChildren(next, scope, children) {
    const returnArray = Array.isArray(children)

    if (!returnArray) {
        children = [children]
    }

    return children.reduce((tmp, child) => {
        const { isReady: childReady, value } = processChild(next, scope, child)

        const isReady = (tmp.isReady && childReady)
        if (!isReady) {
            return { isReady, value: null }
        }
        // We need to merge the provided props and the generated props
        const fullProps = { ...child.props, ...value }
        return {
            isReady,
            value: (returnArray)
            ? [...tmp.value, fullProps]
            : fullProps,
        }
    }, { isReady: true, value: [] })
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

        // if (Array.isArray(children)) {
        //     return processChildren(next, scope, children)
        // }
        return processChildren(next, scope, children)
    },
})
