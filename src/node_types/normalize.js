import selector from './selector.js'

export default function normalize(child) {
    if (typeof child === 'function') {
        return selector(child)
    }

    if (child.TYPE == null) {
        throw new Error('Invalid node')
    }

    return child
}
