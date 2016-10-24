import { register } from '../processor'
import normalize from './normalize'

const TYPE = 'depends'

function verifyDependencies(dep) {
    if (typeof dep === 'string') {
        return dep
    }
    dep = normalize(dep)
    if (dep.TYPE == null) {
        throw new Error(`Invalid dependency: ${dep}`)
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

                if (!resource.isReady) {
                    isReady = false
                    return null
                }

                return path.reduce(
                    (value, next) => (value != null ? value[next] : null),
                    resource.value
                )
            }

            if (dep.TYPE != null) {
                const resource = next(scope, dep)
                if (!resource.isReady) {
                    isReady = false
                    return null
                }

                return resource.value
            }

            throw new Error('Invalid Dependency')
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
