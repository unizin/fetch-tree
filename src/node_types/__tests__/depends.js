import processor from '../../processor'
import depends from '../depends'
import group from '../group'
import fromProps from '../from-props.js'
import selector from '../selector.js'
import virtual from '../virtual'
import withProps from '../with-props'

it(`depends with missing first parameter`, () => {
    const actual = () => depends()

    expect(actual).toThrowError(/missing dependencies/i)
})

it(`depends with empty dependencies`, () => {
    const actual = () => depends([])

    expect(actual).toThrowError(/missing dependencies/i)
})

it(`depends normalizes the child`, () => {
    const selector = () => 'whatever'
    const actual = () => depends(
        ['foo'],
        selector
    )

    expect(actual).not.toThrowError(/child.*loader/i)
})

const selectFoo = (state) => state.foo
const selectBar = (state) => state.bar
function dependsMacro(dependencies, expected) {
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


    const nodeWithProps = withProps(props, node)
    const { isReady, value } = processor(nodeWithProps, state)
    expect(isReady).toBe(true)

    const actual = value.actualResource
    expect(actual).toEqual(expected)
}

it(`depends with a selector node`, () => dependsMacro(
    [selector(selectFoo)],
    ['fooResource']
))

it(`depending on a function automatically wraps it in selector()`, () => dependsMacro(
    [selectFoo],
    ['fooResource']
))

it(`If you need a static value, you can use a selector that ignores state`, () => dependsMacro(
    [function dummySelector(state) {
        void(state)
        return 'someValue'
    }],
    ['someValue']
))

it(`Using strings will provide sibling resources`, () => dependsMacro(
    ['foo', 'bar'],
    ['fooResource', 'barResource']
))

it(`you can embed a fromProps (Not sure if I recommend it though)`, () => dependsMacro(
    [fromProps('foo')],
    ['fooProp']
))

it(`When depending on props, I think it's often better to depend on a virtual sibling`, () => dependsMacro(
    ['virtualFoo'],
    ['fooProp']
))
