import entity from '../entity'

test(`error: id.*function`, () => {
    const actual = { id: 'static-id' }
    const expected = /id.*function/

    expect(() => entity(actual)).toThrowError(expected)
})

test(`error: id.*function`, () => {
    const actual = { id: (id) => `key-${id}` }
    const expected = /apiFunction.*function/

    expect(() => entity(actual)).toThrowError(expected)
})
