/* eslint-env jest */
import { debug, depends, dispatch, entity, fromProps, group, loader, selector, virtual } from './index'

const invalidNode = {}
const selectorFunction = (state) => state.foo

describe(`Node factory errors`, () => {
    describe(`debug`, () => {
        test(`requires a child node`, () => {
            expect(() => {
                debug()
            }).toThrow(/Missing child/)
        })

        test(`requires child to be a node`, () => {
            expect(() => {
                debug(invalidNode)
            }).toThrow(/Invalid node/)
        })

        test(`Selectors are valid children`, () => {
            expect(() => {
                debug(selectorFunction)
            }).not.toThrow()
        })
    })

    describe(`depends`, () => {
        test(`dependencies must be an array`, () => {
            expect(() => {
                depends()
            }).toThrow(/dependencies must be an array/)
            expect(() => {
                depends('foo')
            }).toThrow(/dependencies must be an array/)
            expect(() => {
                depends([])
            }).toThrow(/Missing dependencies/)
        })
        test(`will throw if dependencies aren't strings or nodes`, () => {
            expect(() => {
                depends([invalidNode], selectorFunction)
            }).toThrow(/Invalid node/)
        })
        test(`a child node is required`, () => {
            expect(() => {
                depends(['foo'])
            }).toThrow(/Missing child/)
            expect(() => {
                depends(['foo'], invalidNode)
            }).toThrow(/Invalid node/)
        })
        test(`Selectors are valid children`, () => {
            expect(() => {
                depends(['foo'], selectorFunction)
            }).not.toThrow()
        })
    })

    describe(`dispatch`, () => {
        test(`actionCreator is optional (useful for group({ dispatch: dispatch() }))`, () => {
            expect(() => {
                dispatch()
            }).not.toThrow()
        })
        test(`actionCreator must be a function`, () => {
            expect(() => {
                dispatch(invalidNode)
            }).toThrow(/function/)
        })
    })

    describe(`entity`, () => {
        test(`requires an id function`, () => {
            expect(() => {
                entity()
            }).toThrow(/id must be a function/)
            expect(() => {
                entity({})
            }).toThrow(/id must be a function/)
            expect(() => {
                entity({
                    id: `todo`,
                })
            }).toThrow(/id must be a function/)
        })
        test(`requires apiFunction to be a function`, () => {
            const id = (id) => `todo-${id}`

            expect(() => {
                entity({
                    id,
                })
            }).toThrow(/apiFunction must be a function/)
            expect(() => {
                entity({
                    id,
                    apiFunction: invalidNode,
                })
            }).toThrow(/apiFunction must be a function/)
        })
    })

    describe(`fromProps`, () => {
        test(`requires a string`, () => {
            expect(() => {
                fromProps()
            }).toThrow(/path must be a string/)
            expect(() => {
                fromProps('params.foo')
            }).not.toThrow()
            expect(() => {
                fromProps('foo')
            }).not.toThrow()
        })
    })

    describe(`group`, () => {
        test(`requires one prop`, () => {
            expect(() => {
                group()
            }).toThrow(/Missing children/)
        })
        test(`Accepts a function or an object`, () => {
            const factory = () => ({ foo: 'foo' })
            expect(() => {
                group(factory)

                group({
                    selectSomething: selectorFunction,
                })
            }).not.toThrow()
        })
        test(`object must contain valid nodes (or selectors)`, () => {
            expect(() => {
                group({
                    invalidNode,
                })
            }).toThrow(/Invalid node/)
        })
    })

    describe(`loader`, () => {
        test(`requries an action`, () => {
            expect(() => {
                loader()
            }).toThrow(/action must be a function/)
            expect(() => {
                loader({})
            }).toThrow(/action must be a function/)
        })
        test(`requries a selector`, () => {
            const action = () => null
            expect(() => {
                loader({
                    action,
                })
            }).toThrow(/selector must be a function/)
        })
        test(`requries a id`, () => {
            const action = () => null
            const selector = selectorFunction
            expect(() => {
                loader({
                    action,
                    selector,
                })
            }).toThrow(/id must be a function/)
        })
    })

    describe(`selector`, () => {
        test(`requires a function`, () => {
            expect(() => {
                selector()
            }).toThrow(/Missing selector/)
        })
    })

    describe(`virtual`, () => {
        test(`requires a child`, () => {
            expect(() => {
                virtual()
            }).toThrow(/Missing child/)
            expect(() => {
                virtual(invalidNode)
            }).toThrow(/Invalid node/)
        })
    })
})
