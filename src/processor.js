import depends from './node_types/depends'
import group from './node_types/group'
import loader from './node_types/loader'
import preload from './node_types/preload'
import selector from './node_types/selector'
import debug from './node_types/debug'
import virtual from './node_types/virtual'
import { reduce } from './utils'
import { selectIsReady } from './actions-reducer.js'

/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
const visitors = {
    [loader.TYPE](context, node, state, props, ...args) {
        const id = node.id(...args)
        if (typeof id !== 'string') {
            throw new Error('Loader failed to return an id')
        }
        let value

        const isReady = node.lazy === true || selectIsReady(state, id)

        // Always queue the action. The component can choose whether or not to
        // call it.
        context.queue(id, node.action, args)

        if (isReady) {
            value = node.selector(state, ...args)
        }

        return {
            isReady,
            value,
        }
    },
    [virtual.TYPE](context, node, state, props, ...args) {
        const value = next(context, node.child, state, props, ...args)

        return {
            ...value,
            excludeProp: true,
        }
    },
    [preload.TYPE](context, node, state, props, ...args) {
        const children = node.factory(preload.useProps, ...args)

        if (!Array.isArray(children)) {
            throw new Error('Preload must return an array of nodes to process')
        }

        if (Array.isArray(children) && children.length === 0) {
            return {
                isReady: true,
                excludeProp: true,
            }
        }

        const child = group(children)

        const { isReady } = next(context, child, state, props)
        return {
            excludeProp: true,
            isReady,
        }
    },
    [preload.useProps.TYPE](context, node, state, props, ...args) {
        return next(context, node.child, state, node.props, ...args)
    },
    [depends.TYPE](context, node, state, props) {
        let isReady = true

        if (context.debug) {
            console.log('node.dependencies: ', ...node.dependencies)
        }

        const args = node.dependencies.map(dep => {
            if (isReady === false) return null

            if (dep.type === 'value') {
                return dep.value
            }

            const path = dep.path.split('.')
            let root
            if (dep.type === 'prop') {
                root = props
            } else if (dep.type === 'resource') {
                const key = path.shift()
                const resource = context.resources[key]

                if (resource.isReady) {
                    root = resource.value
                } else {
                    isReady = false
                    return null
                }
            }

            return path.reduce(
                (value, next) => (value != null ? value[next] : null),
                root
            )
        })

        if (!isReady) {
            return {
                isReady,
            }
        }

        return next(context, node.child, state, props, ...args)
    },
    [selector.TYPE](context, node, state, props, ...args) {
        return {
            isReady: true,
            value: node.select(state, ...args),
        }
    },
    [group.TYPE](context, node, state, props) {
        const resources = {}
        const { path } = context

        const results = reduce(
            node.children,
            (x, child, key) => {
                const childContext = {
                    ...context,
                    resources,
                    path: [...path, key],
                }
                const result = resources[key] = next(childContext, child, state, props)
                const { isReady, value, excludeProp } = result

                if (excludeProp === true || !isReady) {
                    return {
                        ...x,
                        isReady: x.isReady && isReady,
                    }
                }

                const nextValue = Array.isArray(node.children) ?
                    [...x.value, value] :
                    { ...x.value, [key]: value }

                return {
                    isReady: x.isReady && isReady,
                    value: nextValue,
                }
            },
            { isReady: true, value: Array.isArray(node.children) ? [] : {} }
        )

        return results
    },
    [debug.TYPE](context, node, state, props) {
        const childContext = {
            ...context,
            debug: true,
        }

        try {
            console.groupCollapsed('DEBUG')
            return next(childContext, node.child, state, props)
        } finally {
            console.groupEnd('DEBUG')
        }
    },
}

function next(context, node, state, props, ...args) {
    if (!visitors[node.TYPE]) {
        console.log(node)
        throw new Error(`Invalid type: ${String(node.TYPE)}`)
    }

    const { debug } = context

    let value

    if (debug) {
        const groupName = `${node.TYPE}: ${context.path.join('.')}`

        console.groupCollapsed(groupName)
        console.log('node: ', node)
        if (args.length > 0) {
            console.log('...args: ', ...args)
        }
        try {
            value = visitors[node.TYPE](context, node, state, props, ...args)
        } catch (e) {
            console.error(e)
            throw e
        } finally {
            console.log('isReady', value.isReady)
            console.log('value', value.value)
            console.groupEnd(groupName)
        }
    } else {
        value = visitors[node.TYPE](context, node, state, props, ...args)
    }
    return value
}

export default function processor(node, state, props) {
    const actionQueue = []
    const context = {
        debug: false,
        queue(id, action, args) {
            if (this.debug) {
                console.log('queue action', id)
            }
            actionQueue.push({ id, action, args, debug: this.debug })
        },
        path: ['root'],
    }

    const value = next(context, node, state, props)

    return {
        ...value,
        actionQueue,
    }
}
