import test from 'ava'
import depends from '../depends'

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
    const context = {
        props: {
            foo: 'fooProp',
        },
        resources: {
            foo: 'fooResource',
            bar: 'barResource',
        },
    }

    const node = depends(
        dependencies,
        { TYPE: 'example' }
    )

    const next = (context, node, ...actual) => {
        t.deepEqual(actual, expected)
    }

    depends.nodeProcessor(next, context, node)
}

test(`depends with depends.value`, dependsMacro,
    [depends.value('someValue')],
    ['someValue']
)

test(`depends with depends.value`, dependsMacro,
    ['foo', depends.resource('bar')],
    ['fooResource', 'barResource']
)

test(`depends with depends.value`, dependsMacro,
    [depends.prop('foo')],
    ['fooProp']
)
