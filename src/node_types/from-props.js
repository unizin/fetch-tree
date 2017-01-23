
import { register } from '../processor'

const TYPE = 'fromProps'

export default register({
    TYPE,
    factory(path) {
        if (typeof path !== 'string') {
            throw new Error('path must be a string')
        }

        return {
            TYPE,
            path,
        }
    },
    nodeProcessor(next, scope, node) {
        const path = node.path.split('.')

        const value = path.reduce(
            (value, next) => (value != null ? value[next] : null),
            scope.props
        )

        return {
            isReady: true,
            value,
        }
    },
    findPropTypes(next, propShape, node) {
        const path = node.path.split('.')
        const propName = path.shift()

        propShape[propName] = propShape[propName] || {}
        if (path.length > 0) {
            path.reduce((current, path) => {
                current[path] = current[path] || {}
                return current[path]
            }, propShape[propName])
        }

        return propShape
    },
})
