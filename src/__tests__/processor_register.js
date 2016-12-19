import { register } from '../processor'

// This registers group into the processor.
import '../node_types/group'

const TYPE = 'RegistrationTest'
describe(`processor_register`, () => {
    test(`error: missing TYPE`, () => {
        const errorRegex = /missing TYPE/
        const node = {}
        expect(() => register(node)).toThrowError(errorRegex)
    })
    test(`error: missing factory`, () => {
        const errorRegex = /missing factory/
        const node = { TYPE }
        expect(() => register(node)).toThrowError(errorRegex)
    })
    test(`error: missing nodeProcessor`, () => {
        const errorRegex = /missing nodeProcessor/
        const node = { TYPE, factory() {} }
        expect(() => register(node)).toThrowError(errorRegex)
    })
    test(`error: already registered`, () => {
        const errorRegex = /already registered/
        // group is a built in node type
        const node = { TYPE: 'group', factory() {}, nodeProcessor() {} }
        expect(() => register(node)).toThrowError(errorRegex)
    })
})
