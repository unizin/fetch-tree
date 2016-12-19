import processor from '../processor'
import { group, selector, depends, loader, withProps, virtual, fromProps } from '../index'

const dummySelector = (value) => (state) => value // eslint-disable-line no-unused-vars

const state = {
    someCount: 0,
    todos: [
        { id: 1, message: 'foo', done: false },
        { id: 2, message: 'bar', done: true },
    ],
    fetchTree: {
        ready: {
            "todo-1": true,
            "todo-2": true,
        },
    },
}

const selectTodos = (state) => state.todos
const selectTodo = (state, id) => state.todos.find(t => t.id === id)
const selectTotalTodos = (state) => state.todos.length
const selectCompletedTodos = (state) => state.todos.filter(t => t.done)

const fetchTodo = (id) => Promise.resolve({
    id,
    message: 'remote todo',
    done: false,
})

const todoLoader = loader({
    id: (id) => `todo-${id}`,
    action: fetchTodo,
    selector: selectTodo,
})

it(`processor with a single selector`, () => {
    const subject = selector(selectTotalTodos)

    const expected = {
        actionQueue: [],
        isReady: true,
        value: 2,
    }

    const actual = processor(subject, state)

    expect(actual).toEqual(expected)
})

it(`processor with a group of selectors`, () => {
    const tree = group({
        totalTodos: selectTotalTodos,
        completedTodos: selectCompletedTodos,
    })

    const expected = {
        actionQueue: [],
        isReady: true,
        value: {
            totalTodos: 2,
            completedTodos: [
                { id: 2, message: 'bar', done: true },
            ],
        },
    }

    const actual = processor(tree, state)

    expect(actual).toEqual(expected)
})

it(`processor with a depends(selector)`, () => {
    const tree = group({
        id: virtual(fromProps('id')),
        todo: depends(
            ['id'],
            selector(selectTodo)
        ),
        message: depends(
            ['todo'],
            (state, todo) => todo.message,
        ),
    })
    const props = { id: 2 }

    const expected = {
        actionQueue: [],
        isReady: true,
        value: {
            todo: { id: 2, message: 'bar', done: true },
            message: 'bar',
        },
    }

    const treeWithProps = withProps(props, tree)
    const actual = processor(treeWithProps, state)


    expect(actual).toEqual(expected)
})

it(`processor with a loader (not ready)`, () => {
    const tree = group({
        id: virtual(fromProps('id')),
        todo: depends(
            ['id'],
            todoLoader
        ),
    })
    const props = {
        id: 3,
    }

    const expected = {
        actionQueue: [
            { id: 'todo-3', action: fetchTodo, args: [3], debug: false },
        ],
        isReady: false,
        value: {
            // todo is *not* included in the props because it isn't ready
            // todo: undefined,
        },
    }

    const treeWithProps = withProps(props, tree)
    const actual = processor(treeWithProps, state)

    expect(actual).toEqual(expected)
})

it(`processor with a lazy loader`, () => {
    const updateCount = () => () => Promise.resolve(null)

    const tree = group({
        someCount: loader({
            lazy: true,
            id: () => 'some-count',
            action: updateCount,
            selector: (state) => state.someCount,
        }),
    })

    const expected = {
        actionQueue: [
            { id: 'some-count', action: updateCount, args: [], debug: false },
        ],
        isReady: true,
        value: {
            someCount: 0,
        },
    }

    const actual = processor(tree, state)

    expect(actual.isReady).toBe(expected.isReady)
    expect(actual.value).toEqual(expected.value)
    expect(actual).toEqual(expected)
})

it(`processor with a loader (ready)`, () => {
    const tree = group({
        id: virtual(fromProps('id')),
        todo: depends(
            ['id'],
            todoLoader
        ),
    })
    const props = {
        id: 2,
    }

    const expected = {
        actionQueue: [
            { id: 'todo-2', action: fetchTodo, args: [2], debug: false },
        ],
        isReady: true,
        value: {
            todo: { id: 2, message: 'bar', done: true },
        },
    }

    const treeWithProps = withProps(props, tree)
    const actual = processor(treeWithProps, state)

    expect(actual).toEqual(expected)
})

it(`depending on an unready loader`, () => {
    const fetchAllTodos = () => Promise.resolve([])
    const tree = group({
        allTodos: loader({
            id: () => `all-todos`,
            action: fetchAllTodos,
            selector: selectTodos,
        }),
        totalTodos: depends(
            ['allTodos'],
            (state, allTodos) => allTodos.length
        ),
    })

    const expected = {
        isReady: false,
        actionQueue: [
            { id: 'all-todos', action: fetchAllTodos, args: [], debug: false },
        ],
        value: {
        },
    }

    const actual = processor(tree, state)

    expect(actual).toEqual(expected)
})

it(`group(factory) formery preload`, () => {
    const childTree = group({
        id: virtual(fromProps('id')),
        todo: depends(
            ['id'],
            todoLoader
        ),
    })

    const parentTree = group({
        ids: virtual(fromProps('ids')),
        preload: depends(
            ['ids'],
            virtual(group((ids) => {
                return ids.map(
                    id => withProps({ id }, childTree)
                )
            }))
        ),
    })

    const props = {
        ids: [1, 2],
    }

    const expected = {
        isReady: true,
        actionQueue: [
            { id: 'todo-1', action: fetchTodo, args: [1], debug: false },
            { id: 'todo-2', action: fetchTodo, args: [2], debug: false },
        ],
        value: {
            // preloads should not be included
            // preload: undefined,
        },
    }

    const parentTreeWithProps = withProps(props, parentTree)
    const actual = processor(parentTreeWithProps, state)
    expect(actual).toEqual(expected)
})

it(`preload with an empty array`, () => {
    const childTree = group({
        id: virtual(fromProps('id')),
        todo: depends(
            ['id'],
            todoLoader
        ),
    })

    const parentTree = group({
        ids: virtual(fromProps('ids')),
        preload: depends(
            ['ids'],
            virtual(group((ids) => {
                return ids.map(
                    id => withProps({ id }, childTree)
                )
            }))
        ),
    })

    const props = {
        ids: [],
    }

    const expected = {
        isReady: true,
        actionQueue: [
        ],
        value: {
            // preloads should not be included
            // preload: undefined,
        },
    }

    const parentTreeWithProps = withProps(props, parentTree)
    const actual = processor(parentTreeWithProps, state)
    expect(actual).toEqual(expected)
})

it(`groups of arrays will return an array`, () => {
    // I don't think you would really create a group like this, but preload will
    // sometimes use an internal array based group.
    const tree = group([
        (state) => selectTodo(state, 1),
        (state) => selectTodo(state, 2),
    ])

    const expected = {
        isReady: true,
        actionQueue: [],
        value: [
            { id: 1, message: 'foo', done: false },
            { id: 2, message: 'bar', done: true },
        ],
    }

    const actual = processor(tree, state)

    expect(actual).toEqual(expected)
})

it(`groups of arrays maintain order, but not indexes`, () => {
    // I don't think you would really create a group like this, but preload will
    // sometimes use an internal array based group.
    const tree = group([
        depends([dummySelector(3)], todoLoader), // index: 0
        depends([dummySelector(2)], todoLoader), // index: 1
        depends([dummySelector(1)], todoLoader), // index: 2
    ])

    const expected = {
        isReady: false,
        actionQueue: [
            { id: 'todo-3', action: fetchTodo, args: [3], debug: false },
            { id: 'todo-2', action: fetchTodo, args: [2], debug: false },
            { id: 'todo-1', action: fetchTodo, args: [1], debug: false },
        ],
        value: [
            // todo 3 was skipped because it isn't ready.
            { id: 2, message: 'bar', done: true },
            { id: 1, message: 'foo', done: false },
        ],
    }

    const actual = processor(tree, state)

    expect(actual).toEqual(expected)
})

it(`fromProps/depends allows a dotted path and doesn't throw on missing props`, () => {
    const tree = group({
        routerLocation: virtual(fromProps('router.location')),
        location: depends(
            ['routerLocation'],
            (state, location) => location
        ),
    })

    const expected = {
        isReady: true,
        actionQueue: [],
        value: {
            location: null,
        },
    }

    const actual = processor(tree, state)

    expect(actual).toEqual(expected)
})

it(`virtual nodes can compute a value without emitting a prop to the component`, () => {
    const tree = group({
        completedTodos: virtual(
            (state) => state.todos.filter(t => t.done)
        ),
        completedCount: depends(
            ['completedTodos'],
            (state, completed) => completed.length
        ),
    })

    const expected = {
        isReady: true,
        actionQueue: [],
        value: {
            completedCount: 1,
        },
    }

    const actual = processor(tree, state)

    expect(actual.isReady).toEqual(expected.isReady)
    expect(actual.actionQueue).toEqual(expected.actionQueue)
    expect(actual.value).toEqual(expected.value)
})

it(`lazy() generates a child node at runtime`, () => {
    const tree = group({
        ids: virtual(fromProps('ids')),
        todos: depends(
            ['ids'],
            group((ids) => ids.map(
                id => depends([dummySelector(id)], todoLoader)
            ))
        ),
    })

    const expected = {
        isReady: true,
        actionQueue: [
            { id: 'todo-2', action: fetchTodo, args: [2], debug: false },
            { id: 'todo-1', action: fetchTodo, args: [1], debug: false },
        ],
        value: {
            todos: [
                // todo 3 was skipped because it isn't ready.
                { id: 2, message: 'bar', done: true },
                { id: 1, message: 'foo', done: false },
            ],
        },
    }
    const props = {
        ids: [2, 1],
    }

    const treeWithProps = withProps(props, tree)
    const actual = processor(treeWithProps, state)

    expect(actual.isReady).toEqual(expected.isReady)
    expect(actual.actionQueue).toEqual(expected.actionQueue)
    expect(actual.value).toEqual(expected.value)
})
