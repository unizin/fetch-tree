import td from 'testdouble'
import loader from '../loader'

it(`loader without an action`, () => {
    const actual = () => loader()

    // https://github.com/avajs/ava/issues/779
    expect(actual).toThrowError(/missing action/i)
})

it(`loader without a selector`, () => {
    const actual = () => loader({
        action: () => null,
    })

    expect(actual).toThrowError(/missing selector/i)
})

it(`loader without an id function`, () => {
    const actual = () => loader({
        action: () => null,
        selector: () => null,
    })

    expect(actual).toThrowError(/missing id/i)
})

it(`loader return type`, () => {
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

    expect(actual).toEqual(expected)
})

function processorMacro(state, expected) {
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
    expect(actual).toEqual(expected)
}


it('macro (not ready)', () => processorMacro(
    {},
    { isReady: false, value: undefined }
))

it('macro (ready)', () => processorMacro(
    {
        fetchTree: {
            ready: {
                'key-1': true,
            },
        },
    },
    { isReady: true, value: 'someValue' }
))
