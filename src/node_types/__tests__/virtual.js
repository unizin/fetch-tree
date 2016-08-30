import test from 'ava'
import virtual from '../virtual'
import processor from '../../processor'

test(`virtual throws if you don't supply a child node`, t => {
    t.throws(() => virtual(), /Missing child/)
})

test(`virtual adds excludeProp to the return value`, t => {
    const state = { foo: 'fooState' }
    const props = {}

    const node = virtual(
        (state) => state.foo
    )

    const actual = processor(node, state, props)

    t.is(actual.value, 'fooState')
    t.true(actual.excludeProp)
})
