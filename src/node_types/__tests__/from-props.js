import test from 'ava'
import processor from '../../processor'
import fromProps from '../from-props'
import group from '../group'
import virtual from '../virtual'
import depends from '../depends'

test(`fromProps`, t => {
    const state = {
        todos: {
            1: {
                id: 1,
                todo: 'Write Tests',
            },
        },
    }
    const selectTodo = (state, id) => state.todos[id]

    const tree = group({
        id: virtual(fromProps('params.id')),
        deeplyNestedProp: fromProps('foo.bar.baz'),

        todo: depends(['id'], selectTodo),
    })

    const expected = {
        isReady: true,
        actionQueue: [
        ],
        value: {
            deeplyNestedProp: 'Hello World',
            todo: {
                id: 1,
                todo: 'Write Tests',
            },
        },
    }
    const props = {
        params: {
            id: '1',
        },
        foo: {
            bar: {
                baz: 'Hello World',
            },
        },
    }

    const actual = processor(tree, state, props)

    t.deepEqual(actual.isReady, expected.isReady)
    t.deepEqual(actual.actionQueue, expected.actionQueue)
    t.deepEqual(actual.value, expected.value)
})
