import normalize from './normalize'

const TYPE = 'depends'

const prop = (path) => ({ type: 'prop', path })
const resource = (path) => ({ type: 'resource', path })
const value = (value) => ({ type: 'value', value })

function normalizeDependency(dep) {
    if (typeof dep === 'string') {
        dep = {
            type: 'resource',
            path: dep,
        }
    }

    if (dep.type !== 'resource' && dep.type !== 'prop' && dep.type !== 'value') {
        throw new Error(`Invalid dependency type: ${dep.type}`)
    }
    if (!dep.path && dep.type !== 'value') {
        throw new Error(`Missing dependency path`)
    }

    return dep
}

export default function depends(dependencies = [], child) {
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
}

depends.prop = prop
depends.resource = resource

// I don't know if `value` is useful outside of tests
depends.value = value

depends.TYPE = TYPE
