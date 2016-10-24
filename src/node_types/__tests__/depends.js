import test from 'ava'
import processor from '../../processor'
import depends from '../depends'
import group from '../group'

test(`depends with missing first parameter`, t => {
    const actual = () => depends()

    t.throws(actual, /missing dependencies/i)
})

test(`depends with empty dependencies`, t => {
    const actual = () => depends([])

    t.throws(actual, /missing dependencies/i)
})

test(`depends normalizes the child`, t => {
    const selector = () => 'whatever'
    const actual = () => depends(
        ['foo'],
        selector
    )

    t.notThrows(actual, /child.*loader/i)
})

function dependsMacro(t, dependencies, expected) {
    const state = {
        foo: 'fooResource',
        bar: 'barResource',
    }
    const selectFoo = (state) => state.foo
    const selectBar = (state) => state.bar
    const props = {
        foo: 'fooProp',
    }

    const node = group({
        foo: selectFoo,
        bar: selectBar,
        actualResource: depends(
            dependencies,
            (state, ...args) => args
        ),
    })


    const { isReady, value } = processor(node, state, props)
    t.true(isReady)

    const actual = value.actualResource
    t.deepEqual(actual, expected)
}

// test(`depends with depends.value`, dependsMacro,
//     [depends.value('someValue')],
//     ['someValue']
// )

test(`depends with depends.value`, dependsMacro,
    ['foo', 'bar'],
    ['fooResource', 'barResource']
)

// test(`depends with depends.value`, dependsMacro,
//     [depends.prop('foo')],
//     ['fooProp']
// )
