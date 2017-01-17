import { register } from '../processor.js'

const TYPE = 'selector'

export default register({
    TYPE,
    factory(select) {
        if (typeof select !== 'function') {
            throw new Error('Missing selector')
        }

        return {
            TYPE,
            select,
        }
    },
    nodeProcessor(next, scope, node, ...args) {
        if (process.env.NODE_ENV !== 'production' && scope.hasMocks()) {
            if (!scope.hasMock(node.select)) {
                throw scope.missingMock('dispatch')
            }
            const mock = scope.getMock(node.select)
            return {
                isReady: true,
                value: mock(...args),
            }
        }
        return {
            isReady: true,
            value: node.select(scope.state, ...args),
        }
    },
})
