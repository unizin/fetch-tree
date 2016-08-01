
const TYPE = 'selector'

export default function selector(select) {
    if (typeof select !== 'function') {
        throw new Error('Missing selector')
    }

    return {
        TYPE,
        select,
    }
}
selector.TYPE = TYPE
