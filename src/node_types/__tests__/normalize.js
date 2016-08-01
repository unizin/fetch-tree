import test from 'ava'
import selector from '../selector'
import normalize from '../normalize'

test(`normalize accepts a function and returns a selector node`, t => {
    const select = () => 'foo'

    const expected = {
        TYPE: selector.TYPE,
        select,
    }

    const actual = normalize(select)

    t.deepEqual(actual, expected)
})

test(`normalize is a NOOP when passed an existing node`, t => {
    const expected = {
        TYPE: 'some node type',
    }

    const actual = normalize(expected)

    t.is(actual, expected)
})

test(`normalize throws when passed an invalid node`, t => {
    const actual = () => normalize('potato')

    t.throws(actual, /invalid/i)
})
