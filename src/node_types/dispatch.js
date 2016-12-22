import { register } from '../processor'

const TYPE = 'dispatch'

const dummyCreator = (action) => action

export default register({
    TYPE,
    factory(actionCreator = dummyCreator) {
        if (typeof actionCreator !== 'function') {
            throw new Error('actionCreator must be a function')
        }
        return {
            TYPE,
            actionCreator,
        }
    },
    nodeProcessor(next, scope, node) {
        const { dispatch } = scope
        /* istanbul ignore if: dispatch is placed in scope by the component */
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
