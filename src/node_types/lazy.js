import { register } from '../processor'
const TYPE = 'lazy'

export default function lazy(factory) {
    return {
        TYPE,
        factory,
    }
}

lazy.TYPE = TYPE


register(TYPE, (next, context, node, state, ...args) => {
    const child = node.factory(...args)
    return next(context, child, state)
})
