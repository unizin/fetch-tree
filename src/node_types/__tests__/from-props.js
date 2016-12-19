import processor from '../../processor'
import fromProps from '../from-props'
import group from '../group'
import virtual from '../virtual'
import depends from '../depends'
import withProps from '../with-props'

it(`fromProps`, () => {
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

    const treeWithProps = withProps(props, tree)
    const actual = processor(treeWithProps, state)

    expect(actual.isReady).toEqual(expected.isReady)
    expect(actual.actionQueue).toEqual(expected.actionQueue)
    expect(actual.value).toEqual(expected.value)
})
