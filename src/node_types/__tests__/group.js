import processor from '../../processor'
import group from '../group'

it(`group with no children`, () => {
    const actual = () => group()
    expect(actual).toThrowError(/missing children/i)
})

it(`processing a group of selectors`, () => {
    const state = {}
    const tree = group({
        one: () => 1,
    })

    const expected = {
        actionQueue: [],
        isReady: true,
        value: {
            one: 1,
        },
    }

    const actual = processor(tree, state)

    expect(actual).toEqual(expected)
})


it(`processing a (lazy) group of selectors`, () => {
    const state = {}
    const tree = group(() => {
        return ({
            one: () => 1,
        })
    })

    const expected = {
        actionQueue: [],
        isReady: true,
        value: {
            one: 1,
        },
    }

    const actual = processor(tree, state)

    expect(actual).toEqual(expected)
})

it(`group normalizes its children`, () => {
    const actual = () => group({
        foo: { TYPE: 'anything is ok here' },
        bar: () => 'potato',
    })

    expect(actual).not.toThrowError(/wat/i)
})

it(`group return value`, () => {
    const expected = {
        TYPE: group.TYPE,
        children: {
            foo: { TYPE: 'foo type' },
            bar: { TYPE: 'bar type' },
        },
    }

    const actual = group({
        foo: { TYPE: 'foo type' },
        bar: { TYPE: 'bar type' },
    })

    expect(actual).toEqual(expected)
})
