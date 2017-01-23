import { register } from '../processor.js'
import debug from './debug'
import normalize from './normalize.js'
import { map, reduce } from '../utils'

const TYPE = 'group'

const normalizeChildren = (children) => {
    if (children == null) {
        throw new Error('Missing children')
    }

    return map(children, normalize)
}

const group = register({
    TYPE,
    factory(children) {
        if (typeof children === 'function') {
            return {
                TYPE,
                factory: children,
            }
        }

        return {
            TYPE,
            children: normalizeChildren(children),
        }
    },
    nodeProcessor(next, scope, node, ...args) {
        const resources = {}
        const { path } = scope
        let children = node.children

        if (node.factory) {
            children = normalizeChildren(
                node.factory(...args)
            )
        }

        const results = reduce(
            children,
            (x, child, key) => {
                const childScope = {
                    ...scope,
                    resources,
                    path: [...path, key],
                }
                const result = resources[key] = next(childScope, child)
                const { isReady, value, excludeProp } = result

                if (excludeProp === true || !isReady) {
                    return {
                        ...x,
                        isReady: x.isReady && isReady,
                    }
                }

                const nextValue = Array.isArray(children) ?
                [...x.value, value] :
                { ...x.value, [key]: value }

                return {
                    isReady: x.isReady && isReady,
                    value: nextValue,
                }
            },
            { isReady: true, value: Array.isArray(children) ? [] : {} }
        )

        return results
    },
    findPropTypes(next, propShape, node) {
        return reduce(node.children, next, propShape)
    },
})

group.debug = function debugGroup(children) {
    return debug(group(children))
}
export default group
