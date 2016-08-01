import debug from './debug'
import normalize from './normalize.js'
import { map } from '../utils'

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
