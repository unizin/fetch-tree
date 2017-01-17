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
        let { actionCreator } = node
        if (process.env.NODE_ENV !== 'production' && scope.hasMocks()) {
            if (!scope.hasMock(actionCreator)) {
                throw scope.missingMock('dispatch')
            }
            actionCreator = scope.getMock(actionCreator)
        }

        const value = (...args) => dispatch(actionCreator(...args))

        return {
            isReady: true,
            value,
        }
    },
})
