import test from 'ava'
import processor from '../processor'
import { group, selector, depends, loader, preload, virtual, lazy } from '../index'

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

test(`processor with a single selector`, t => {
    const subject = selector(selectTotalTodos)
    const props = {}

    const expected = {
        actionQueue: [],
        isReady: true,
        value: 2,
    }

    const actual = processor(subject, state, props)

    t.deepEqual(actual, expected)
})

test(`processor with a group of selectors`, t => {
    const tree = group({
        totalTodos: selectTotalTodos,
        completedTodos: selectCompletedTodos,
    })
    const props = {}

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

    const actual = processor(tree, state, props)

    t.deepEqual(actual, expected)
})

test(`processor with a depends(selector)`, t => {
    const tree = group({
        todo: depends(
            [depends.prop('id')],
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

    const actual = processor(tree, state, props)


    t.deepEqual(actual, expected)
})

test(`processor with a loader (not ready)`, t => {
    const tree = group({
        todo: depends(
            [depends.prop('id')],
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

    const actual = processor(tree, state, props)

    t.deepEqual(actual, expected)
})

test(`processor with a lazy loader`, t => {
    const updateCount = () => () => Promise.resolve(null)

    const tree = group({
        someCount: loader({
            lazy: true,
            id: () => 'some-count',
            action: updateCount,
            selector: (state) => state.someCount,
        }),
    })
    const props = {}

    const expected = {
        actionQueue: [
            { id: 'some-count', action: updateCount, args: [], debug: false },
        ],
        isReady: true,
        value: {
            someCount: 0,
        },
    }

    const actual = processor(tree, state, props)

    t.is(actual.isReady, expected.isReady)
    t.deepEqual(actual.value, expected.value)
    t.deepEqual(actual, expected)
})

test(`processor with a loader (ready)`, t => {
    const tree = group({
        todo: depends(
            [depends.prop('id')],
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

    const actual = processor(tree, state, props)

    t.deepEqual(actual, expected)
})

test(`depending on an unready loader`, t => {
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
    const props = {}

    const expected = {
        isReady: false,
        actionQueue: [
            { id: 'all-todos', action: fetchAllTodos, args: [], debug: false },
        ],
        value: {
        },
    }

    const actual = processor(tree, state, props)

    t.deepEqual(actual, expected)
})

test(`preload`, t => {
    const childTree = group({
        todo: depends(
            [depends.prop('id')],
            todoLoader
        ),
    })

    const parentTree = group({
        preload: depends(
            [depends.prop('ids')],
            preload((useProps, ids) => {
                return ids.map(
                    id => useProps({ id }, childTree)
                )
            })
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

    const actual = processor(parentTree, state, props)
    t.deepEqual(actual, expected)
})

test(`preload with an empty array`, t => {
    const childTree = group({
        todo: depends(
            [depends.prop('id')],
            todoLoader
        ),
    })

    const parentTree = group({
        preload: depends(
            [depends.prop('ids')],
            preload((useProps, ids) => {
                return ids.map(
                    id => useProps({ id }, childTree)
                )
            })
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

    const actual = processor(parentTree, state, props)
    t.deepEqual(actual, expected)
})

test(`preload requires returning an array`, t => {
    const props = {}
    const parentTree = preload(() => { return {} })

    t.throws(() => processor(parentTree, state, props), /return an array/i)
})

test(`groups of arrays will return an array`, t => {
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
    const props = {}

    const actual = processor(tree, state, props)

    t.deepEqual(actual, expected)
})

test(`groups of arrays maintain order, but not indexes`, t => {
    // I don't think you would really create a group like this, but preload will
    // sometimes use an internal array based group.
    const tree = group([
        depends([depends.value(3)], todoLoader), // index: 0
        depends([depends.value(2)], todoLoader), // index: 1
        depends([depends.value(1)], todoLoader), // index: 2
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
    const props = {}

    const actual = processor(tree, state, props)

    t.deepEqual(actual, expected)
})

test(`depends allows a dotted path and doesn't throw on missing props`, t => {
    const tree = group({
        location: depends(
            [depends.prop('router.location')],
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
    const props = {}

    const actual = processor(tree, state, props)

    t.deepEqual(actual, expected)
})

test(`virtual nodes can compute a value without emitting a prop to the component`, t => {
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
    const props = {}

    const actual = processor(tree, state, props)

    t.deepEqual(actual.isReady, expected.isReady)
    t.deepEqual(actual.actionQueue, expected.actionQueue)
    t.deepEqual(actual.value, expected.value)
})

test(`lazy() generates a child node at runtime`, t => {
    const tree = group({
        todos: depends(
            [depends.prop('ids')],
            lazy(
                (ids) => group(ids.map(
                    id => depends([depends.value(id)], todoLoader)
                ))
            )
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

    const actual = processor(tree, state, props)

    t.deepEqual(actual.isReady, expected.isReady)
    t.deepEqual(actual.actionQueue, expected.actionQueue)
    t.deepEqual(actual.value, expected.value)
})
