const TYPE = 'debug'

export default function debug(child) {
    if (child == null) {
        throw new Error('Missing child')
    }

    return {
        TYPE,
        child,
    }
}
debug.TYPE = TYPE
