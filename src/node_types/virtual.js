import { register } from '../processor'
import normalize from './normalize.js'
const TYPE = 'virtual'

export default function virtual(child) {
    if (child == null) {
        throw new Error('Missing child')
    }

    return {
        TYPE,
        child: normalize(child),
    }
}
virtual.TYPE = TYPE

register(TYPE, (next, processingContext, node, ...args) => {
    const value = next(processingContext, node.child, ...args)

    return {
        ...value,
        excludeProp: true,
    }
})
