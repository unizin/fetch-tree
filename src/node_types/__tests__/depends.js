import test from 'ava'
import processor from '../../processor'
import depends from '../depends'
import group from '../group'
import fromProps from '../from-props.js'
import selector from '../selector.js'
import virtual from '../virtual'

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

const selectFoo = (state) => state.foo
const selectBar = (state) => state.bar
function dependsMacro(t, dependencies, expected) {
    const state = {
        foo: 'fooResource',
        bar: 'barResource',
    }
    const props = {
        foo: 'fooProp',
    }

    const node = group({
        foo: selectFoo,
        bar: selectBar,
        virtualFoo: virtual(fromProps('foo')),
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

test(`depends with a selector node`, dependsMacro,
    [selector(selectFoo)],
    ['fooResource']
)

test(`depending on a function automatically wraps it in selector()`, dependsMacro,
    [selectFoo],
    ['fooResource']
)

test(`If you need a static value, you can use a selector that ignores state`, dependsMacro,
    [function dummySelector(state) {
        void(state)
        return 'someValue'
    }],
    ['someValue']
)

test(`Using strings will provide sibling resources`, dependsMacro,
    ['foo', 'bar'],
    ['fooResource', 'barResource']
)

test(`you can embed a fromProps (Not sure if I recommend it though)`, dependsMacro,
    [fromProps('foo')],
    ['fooProp']
)

test(`When depending on props, I think it's often better to depend on a virtual sibling`, dependsMacro,
    ['virtualFoo'],
    ['fooProp']
)
