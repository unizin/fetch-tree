import { register } from '../processor.js'
import debug from './debug'
import normalize from './normalize.js'
import { map, reduce } from '../utils'

const TYPE = 'group'

const group = register({
    TYPE,
    factory(children) {
        if (children == null) {
            throw new Error('Missing children')
        }
        if (Array.isArray(children)) {
            if (children.length === 0) {
                throw new Error('Empty children') // Are you my mummy?
            }
        } else {
            if (Object.keys(children).length === 0) {
                throw new Error('Empty children') // Are you my mummy?
            }
        }

        return {
            TYPE,
            children: map(children, normalize),
        }
    },
    nodeProcessor(next, scope, node) {
        const resources = {}
        const { path } = scope

        const results = reduce(
            node.children,
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

                const nextValue = Array.isArray(node.children) ?
                [...x.value, value] :
                { ...x.value, [key]: value }

                return {
                    isReady: x.isReady && isReady,
                    value: nextValue,
                }
            },
            { isReady: true, value: Array.isArray(node.children) ? [] : {} }
        )

        return results
    },
})

group.debug = function debugGroup(children) {
    return debug(group(children))
}
export default group
