const TYPE = 'lazy'

export default function lazy(factory) {
    return {
        TYPE,
        factory,
    }
}

lazy.TYPE = TYPE
