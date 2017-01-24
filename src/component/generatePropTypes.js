import React from 'react'
import { map } from '../utils'

const visitors = {}
const defaultProcessor = (next, propPaths) => propPaths
const flags = {
    notRequired: Symbol('notRequired'),
}

export function registerPropTypeProcessor(TYPE, findPropTypes = defaultProcessor) {
    visitors[TYPE] = findPropTypes
}

function processNode(propPaths, node) {
    const fn = visitors[node.TYPE]

    const tmp = fn(processNode, propPaths, node, flags)
    if (typeof tmp !== 'object') {
        throw new Error(`${node.TYPE}.findPropTypes() failed to return an object`)
    }

    return tmp
}

export default function generatePropTypes(resourceGroup) {
    const propPaths = processNode({}, resourceGroup)

    let shapeIsRequired = false

    const path = []
    return map(propPaths, function makeProptype(tmp, name) {
        path.push(name)
        if (Object.keys(tmp).length === 0) {
            path.pop()
            const type = React.PropTypes.any

            if (tmp[flags.notRequired]) {
                return type
            }
            shapeIsRequired = true
            return type.isRequired
        }

        shapeIsRequired = false
        const shape = React.PropTypes.shape(
            map(tmp, makeProptype)
        )

        path.pop()
        if (shapeIsRequired) {
            return shape.isRequired
        }
        return shape
    })
}
