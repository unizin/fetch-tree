import { map, reduce } from '../utils'

it(`map over an object`, () => {
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

    expect(actual).toEqual(expected)
})

it(`reduce an object`, () => {
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

    expect(actual).toEqual(expected)
})
