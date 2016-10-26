import { register } from '../processor'

const TYPE = 'dispatch'

export default register({
    TYPE,
    factory(actionCreator) {
        return {
            TYPE,
            actionCreator,
        }
    },
    nodeProcessor(next, scope, node) {
        const { dispatch } = scope
        if (!dispatch) {
            throw new Error(`No dispatch found on scope`)
        }
        const { actionCreator } = node

        const value = (...args) => dispatch(actionCreator(...args))

        return {
            isReady: true,
            value,
        }
    },
})
