const TYPE = 'loader'

export default function loader(options = {}) {
    const { action, selector, id, lazy = false } = options

    if (typeof action !== 'function') {
        throw new Error('Missing action')
    }
    if (typeof selector !== 'function') {
        throw new Error('Missing selector')
    }
    if (typeof id !== 'function') {
        throw new Error('Missing id')
    }

    return {
        TYPE,
        id,
        action,
        selector,
        lazy,
    }
}

loader.TYPE = TYPE
