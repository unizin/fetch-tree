import test from 'ava'
import selector from '../selector'

test(`selector requires a function`, t => {
    const actual = () => selector()

    t.throws(actual, /missing selector/i)
})

test(`selector return value`, t => {
    const select = () => 'foo'

    const expected = {
        TYPE: selector.TYPE,
        select,
    }

    const actual = selector(select)

    t.deepEqual(actual, expected)
})
