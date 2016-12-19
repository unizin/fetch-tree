import selector from '../selector'
import normalize from '../normalize'

it(`normalize accepts a function and returns a selector node`, () => {
    const select = () => 'foo'

    const expected = {
        TYPE: selector.TYPE,
        select,
    }

    const actual = normalize(select)

    expect(actual).toEqual(expected)
})

it(`normalize is a NOOP when passed an existing node`, () => {
    const expected = {
        TYPE: 'some node type',
    }

    const actual = normalize(expected)

    expect(actual).toBe(expected)
})

it(`normalize throws when passed an invalid node`, () => {
    const actual = () => normalize('potato')

    expect(actual).toThrowError(/invalid/i)
})
