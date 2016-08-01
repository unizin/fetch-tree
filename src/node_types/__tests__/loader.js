import test from 'ava'
import loader from '../loader'

test(`loader without an action`, t => {
    const actual = () => loader()

    // https://github.com/avajs/ava/issues/779
    t.throws(actual, /missing action/i)
})

test(`loader without a selector`, t => {
    const actual = () => loader({
        action: () => null,
    })

    t.throws(actual, /missing selector/i)
})

test(`loader without an id function`, t => {
    const actual = () => loader({
        action: () => null,
        selector: () => null,
    })

    t.throws(actual, /missing id/i)
})

test(`loader return type`, t => {
    const id = () => `foo`
    const selector = () => 'select'
    const action = () => null

    const expected = {
        TYPE: loader.TYPE,
        id,
        selector,
        action,
        lazy: false,
    }

    const actual = loader({
        id,
        selector,
        action,
    })

    t.deepEqual(actual, expected)
})
