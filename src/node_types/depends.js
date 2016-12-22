import { register } from '../processor'
import normalize from './normalize'

const TYPE = 'depends'

function verifyDependencies(dep) {
    if (typeof dep === 'string') {
        return dep
    }
    return normalize(dep)
}

const depends = register({
    TYPE,
    factory(dependencies, child) {
        if (!dependencies || !Array.isArray(dependencies)) {
            throw new Error(`dependencies must be an array`)
        }
        if (dependencies.length === 0) {
            throw new Error('Missing dependencies')
        }
        if (child == null) {
            throw new Error('Missing child')
        }
        child = normalize(child)

        return {
            TYPE,
            dependencies: dependencies.map(verifyDependencies),
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

            if (typeof dep === 'string') {
                const path = dep.split('.')
                const key = path.shift()
                const resource = scope.resources[key]

                if (resource == null) {
                    throw new Error(`Resource not found: ${key}`)
                }
                if (!resource.isReady) {
                    isReady = false
                    return null
                }

                return path.reduce(
                    (value, next) => (value != null ? value[next] : null),
                    resource.value
                )
            }

            const resource = next(scope, dep)
            if (!resource.isReady) {
                isReady = false
                return null
            }

            return resource.value
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
