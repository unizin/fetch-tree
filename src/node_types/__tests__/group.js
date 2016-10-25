import test from 'ava'
import processor from '../../processor'
import group from '../group'

test(`group with no children`, t => {
    const actual = () => group()
    t.throws(actual, /missing children/i)
})

test(`processing a group of selectors`, t => {
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

    t.deepEqual(actual, expected)
})


test(`processing a (lazy) group of selectors`, t => {
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

    t.deepEqual(actual, expected)
})

test(`group normalizes its children`, t => {
    const actual = () => group({
        foo: { TYPE: 'anything is ok here' },
        bar: () => 'potato',
    })

    t.notThrows(actual, /wat/i, 'message')
})

test(`group return value`, t => {
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

    t.deepEqual(actual, expected)
})
