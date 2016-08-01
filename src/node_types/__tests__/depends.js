import test from 'ava'
import depends from '../depends'
import loader from '../loader'

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

test(`depends return type`, t => {
    const child = loader({
        id: () => 'foo',
        action: () => null,
        selector: () => 'child',
    })

    const expected = {
        TYPE: depends.TYPE,
        dependencies: [
            { type: 'resource', path: 'foo' },
        ],
        child,
    }

    const actual = depends(
        ['foo'],
        child
    )

    t.deepEqual(actual, expected)
})
