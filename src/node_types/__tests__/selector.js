import selector from '../selector'

it(`selector requires a function`, () => {
    const actual = () => selector()

    expect(actual).toThrowError(/missing selector/i)
})

it(`selector return value`, () => {
    const select = () => 'foo'

    const expected = {
        TYPE: selector.TYPE,
        select,
    }

    const actual = selector(select)

    expect(actual).toEqual(expected)
})
