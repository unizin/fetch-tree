import { register } from '../processor.js'
import debug from './debug'
import normalize from './normalize.js'
import { map, reduce } from '../utils'

const TYPE = 'group'

export default function group(children) {
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
}
group.TYPE = TYPE

group.debug = function debugGroup(children) {
    return debug(group(children))
}

register(TYPE, (next, processingContext, node, state) => {
    const resources = {}
    const { path } = processingContext

    const results = reduce(
        node.children,
        (x, child, key) => {
            const childProcessingContext = {
                ...processingContext,
                resources,
                path: [...path, key],
            }
            const result = resources[key] = next(childProcessingContext, child, state)
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
})
