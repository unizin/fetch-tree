/* eslint-env jest */
import processor from './processor'
import { registerNodeType } from './index.js'
import td from 'testdouble'

const invalidNode = {}

describe(`processor`, () => {
    test(`throws if it is passed an invlid node`, () => {
        td.replace(console, 'log', () => null)
        expect(() => {
            processor(invalidNode, {})
        }).toThrow(/Invalid type:/)
    })
    test(`throws when passed an unregistered type`, () => {
        td.replace(console, 'log', () => null)
        expect(() => {
            const fakeType = { TYPE: 'not-registered' }
            processor(fakeType, {})
        }).toThrow(/Invalid type: not-registered/)
    })
})

describe(`register / registerNodeType`, () => {
    test(`requires a TYPE string`, () => {
        expect(() => {
            registerNodeType({
            })
        }).toThrow(/missing TYPE/)
    })

    test(`type can't be a symbol because they're hard to debug`, () => {
        expect(() => {
            registerNodeType({
                TYPE: Symbol('this is always unique'),
            })
        }).toThrow(/Invalid TYPE/)
    })

    test(`requires a factory function`, () => {
        expect(() => {
            registerNodeType({
                TYPE: 'foo',
            })
        }).toThrow(/missing factory/)
    })

    test(`requires a nodeProcessor function`, () => {
        expect(() => {
            registerNodeType({
                TYPE: 'foo',
                factory() { },
            })
        }).toThrow(/missing nodeProcessor/)
    })
    test(`throws when you re-register an existing type`, () => {
        registerNodeType({
            TYPE: 'foo',
            factory() { },
            nodeProcessor() {},
        })
        expect(() => {
            registerNodeType({
                TYPE: 'foo',
                factory() { },
                nodeProcessor() {},
            })
        }).toThrow(/is already registered/)
    })
})
