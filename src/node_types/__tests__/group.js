import test from 'ava'
import group from '../group'

test(`group with no children`, t => {
    const actual = () => group()
    t.throws(actual, /missing children/i)
})

test(`group throws when passed an empty object`, t => {
    const actual = () => group({})
    t.throws(actual, /empty children/i)
})

test(`group throws when passed an empty array`, t => {
    const actual = () => group([])
    t.throws(actual, /empty children/i)
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
