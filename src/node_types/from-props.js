
import { register } from '../processor'

const TYPE = 'fromProps'

export default register({
    TYPE,
    factory(path) {
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
})
