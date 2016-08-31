import test from 'ava'
import td from 'testdouble'
import loader from '../loader'

test(`loader without an action`, t => {
    const actual = () => loader()

    // https://github.com/avajs/ava/issues/779
    t.throws(actual, /missing action/i)
})

test(`loader without a selector`, t => {
    const actual = () => loader({
        action: () => null,
    })

    t.throws(actual, /missing selector/i)
})

test(`loader without an id function`, t => {
    const actual = () => loader({
        action: () => null,
        selector: () => null,
    })

    t.throws(actual, /missing id/i)
})

test(`loader return type`, t => {
    const id = () => `foo`
    const selector = () => 'select'
    const action = () => null

    const expected = {
        TYPE: loader.TYPE,
        id,
        selector,
        action,
        lazy: false,
    }

    const actual = loader({
        id,
        selector,
        action,
    })

    t.deepEqual(actual, expected)
})

function processorMacro(t, state, expected) {
    const todoId = 1

    const nodeDefinition = {
        id: (id) => `key-${id}`,
        action: td.function('.action'),
        selector: td.function('.selector'),
    }
    td.when(nodeDefinition.selector(state, todoId)).thenReturn('someValue')

    const node = loader(nodeDefinition)
    const next = () => undefined

    const scope = {
        state,
        queue: td.function('.queue'),
    }

    const actual = loader.nodeProcessor(next, scope, node, todoId)

    td.verify(scope.queue('key-1', nodeDefinition.action, [todoId]))
    t.deepEqual(actual, expected)
}


test(
    'macro (not ready)',
    processorMacro,
    {},
    { isReady: false, value: undefined }
)

test(
    'macro (ready)',
    processorMacro,
    {
        fetchTree: {
            'key-1': true,
        },
    },
    { isReady: true, value: 'someValue' }
)
