import { register } from '../processor'
import { registerMock } from '../mocks'

const TYPE = 'mocked-node'
const mockedNode = register({
    TYPE,
    factory(original, fn) {
        if (typeof fn !== 'function') {
            throw new Error('missing function')
        }

        return {
            TYPE,
            original,
            fn,
        }
    },
    nodeProcessor(next, scope, node, ...args) {
        return {
            isReady: true,
            value: node.fn(...args),
        }
    },
})

export default function mockNode(node, fn) {
    registerMock(node, mockedNode(node, fn))
}
