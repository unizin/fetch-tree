import React from 'react'
import { map } from '../utils'

const visitors = {}
const defaultProcessor = (next, propPaths) => propPaths

export function registerPropTypeProcessor(TYPE, findPropTypes = defaultProcessor) {
    visitors[TYPE] = findPropTypes
}

function processNode(propPaths, node) {
    const fn = visitors[node.TYPE]

    const tmp = fn(processNode, propPaths, node)
    if (typeof tmp !== 'object') {
        throw new Error(`${node.TYPE}.findPropTypes() failed to return an object`)
    }

    return tmp
}

export default function generatePropTypes(resourceGroup) {
    const propPaths = processNode({}, resourceGroup)

    return map(propPaths, function makeProptype(tmp) {
        if (Object.keys(tmp).length === 0) {
            return React.PropTypes.any.isRequired
        }

        return React.PropTypes.shape(
            map(tmp, makeProptype)
        ).isRequired
    })
}
