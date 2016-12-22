import { register } from '../processor'
import { selectIsReady } from '../actions-reducer'
const TYPE = 'loader'

export default register({
    TYPE,
    factory(options = {}) {
        const { action, selector, id, lazy = false } = options

        if (typeof action !== 'function') {
            throw new Error('action must be a function')
        }
        if (typeof selector !== 'function') {
            throw new Error('selector must be a function')
        }
        if (typeof id !== 'function') {
            throw new Error('id must be a function')
        }

        return {
            TYPE,
            id,
            action,
            selector,
            lazy,
        }
    },
    nodeProcessor(next, scope, node, ...args) {
        const id = node.id(...args)
        if (typeof id !== 'string') {
            throw new Error('Loader failed to return an id')
        }
        let value

        const isReady = node.lazy === true || selectIsReady(scope.state, id)

        // Always queue the action. The component can choose whether or not to
        // call it.
        scope.queue(id, node.action, args)

        if (isReady) {
            value = node.selector(scope.state, ...args)
        }

        return {
            isReady,
            value,
        }
    },
})
