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

register(TYPE, (next, context, node, state, props, ...args) => {
    const value = next(context, node.child, state, props, ...args)

    return {
        ...value,
        excludeProp: true,
    }
})
