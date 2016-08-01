import test from 'ava'
import { map, reduce } from '../utils'

test(`map over an object`, t => {
    const msg = `"what should it do?"`
    const expected = {
        foo: 2,
        bar: 4,
    }
    const double = (value) => value * 2

    const actual = map({
        foo: 1,
        bar: 2,
    }, double)

    t.deepEqual(actual, expected, msg)
})

test(`reduce an object`, t => {
    const msg = `"what should it do?"`
    const expected = [
        ['foo', 1],
        ['bar', 2],
    ]

    const data = {
        foo: 1,
        bar: 2,
    }
    const processor = (memo, value, key) => [
        ...memo,
        [key, value],
    ]

    const actual = reduce(data, processor, [])

    t.deepEqual(actual, expected, msg)
})
