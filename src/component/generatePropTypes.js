import React from 'react'
import { map, reduce } from '../utils'

export default function generatePropTypes(resourceGroup) {
    let group = resourceGroup
    if (group.TYPE === 'debug') {
        group = group.child
    }

    const mergePropShape = (propPaths, node) => {
        if (node.TYPE === 'virtual' || node.TYPE === 'debug') {
            return mergePropShape(propPaths, node.child)
        }

        if (node.TYPE === 'fromProps') {
            const path = node.path.split('.')
            const propName = path.shift()

            propPaths[propName] = propPaths[propName] || {}
            if (path.length > 0) {
                path.reduce((current, path) => {
                    current[path] = current[path] || {}
                    return current[path]
                }, propPaths[propName])
            }
        }

        return propPaths
    }
    // This produces a tree of objects representing all known props.
    const propPaths = reduce(group.children, mergePropShape, {})

    return map(propPaths, function makeProptype(tmp) {
        if (Object.keys(tmp).length === 0) {
            return React.PropTypes.any.isRequired
        }

        return React.PropTypes.shape(
            map(tmp, makeProptype)
        ).isRequired
    })
}
