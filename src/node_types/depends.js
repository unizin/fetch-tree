import { register } from '../processor'
import normalize from './normalize'

const TYPE = 'depends'

const resource = (path) => ({ type: 'resource', path })

function normalizeDependency(dep) {
    if (typeof dep === 'string') {
        dep = resource(dep)
    }

    if (dep.type !== 'resource' && dep.type !== 'prop' && dep.type !== 'value') {
        throw new Error(`Invalid dependency type: ${dep.type}`)
    }
    if (!dep.path && dep.type !== 'value') {
        throw new Error(`Missing dependency path`)
    }

    return dep
}

const depends = register({
    TYPE,
    factory(dependencies = [], child) {
        if (!Array.isArray(dependencies)) {
            throw new Error(`dependencies must be an array`)
        }
        if (dependencies.length === 0) {
            throw new Error('Missing dependencies')
        }
        if (child == null) {
            throw new Error('Missing child')
        }
        child = normalize(child)
        if (!child.TYPE) {
            throw new Error('Invalid child type')
        }

        return {
            TYPE,
            dependencies: dependencies.map(normalizeDependency),
            child,
        }
    },
    nodeProcessor(next, scope, node) {
        let isReady = true

        if (scope.debug) {
            console.log('node.dependencies: ', ...node.dependencies) // eslint-disable-line no-console
        }

        const args = node.dependencies.map(dep => {
            if (isReady === false) return null

            if (dep.type === 'value') {
                return dep.value
            }

            const path = dep.path.split('.')
            let root
            if (dep.type === 'prop') {
                root = scope.props
            } else if (dep.type === 'resource') {
                const key = path.shift()
                const resource = scope.resources[key]

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

        return next(scope, node.child, ...args)
    },
})

export default depends
