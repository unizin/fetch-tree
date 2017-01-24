import { register } from '../processor'

const TYPE = 'fromProps'

export default register({
    TYPE,
    factory(path, defaultValue) {
        if (typeof path !== 'string') {
            throw new Error('path must be a string')
        }

        return {
            TYPE,
            path,
            defaultValue,
        }
    },
    nodeProcessor(next, scope, node) {
        const path = node.path.split('.')

        let value = path.reduce(
            (value, next) => (value != null ? value[next] : null),
            scope.props
        )
        if (value == null && node.defaultValue != null) {
            value = node.defaultValue
        }

        return {
            isReady: true,
            value,
        }
    },
    findPropTypes(next, propShape, node, flags) {
        const path = node.path.split('.')
        const propName = path.shift()

        let leaf = propShape[propName] = propShape[propName] || {}
        if (path.length > 0) {
            path.reduce((current, path) => {
                leaf = current[path] = current[path] || {}
                return current[path]
            }, propShape[propName])
        }

        if (node.defaultValue) {
            leaf[flags.notRequired] = true
        }

        return propShape
    },
})
