import virtual from '../virtual'
import processor from '../../processor'

it(`virtual throws if you don't supply a child node`, () => {
    expect(() => virtual()).toThrowError(/Missing child/)
})

it(`virtual adds excludeProp to the return value`, () => {
    const state = { foo: 'fooState' }

    const node = virtual(
        (state) => state.foo
    )

    const actual = processor(node, state)

    expect(actual.value).toBe('fooState')
    expect(actual.excludeProp).toBe(true)
})
