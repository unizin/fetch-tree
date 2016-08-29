import { register } from '../processor'
const TYPE = 'lazy'

export default function lazy(factory) {
    return {
        TYPE,
        factory,
    }
}

lazy.TYPE = TYPE


register(TYPE, (next, processingContext, node, state, ...args) => {
    const child = node.factory(...args)
    return next(processingContext, child, state)
})
