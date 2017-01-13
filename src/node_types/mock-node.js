import { register, registerMock } from '../processor.js'

const TYPE = 'mocked-node'
const mockedNode = register({
    TYPE,
    factory(original, fn) {
        if (typeof fn !== 'function') {
            throw new Error('You must x')
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
