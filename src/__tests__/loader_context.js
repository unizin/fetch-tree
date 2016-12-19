
import td from 'testdouble'
import loaderContext from '../loader_context'

function mockDispatch() {
    const dispatch = td.function('.dispatch')

    td.when(dispatch(td.matchers.anything())).thenDo((action) => {
        return (typeof action === 'function') ?
          action(dispatch) :
          action
    })

    return dispatch
}

it(`loaderContext interface`, () => {
    const expected = loaderContext()

    expect(typeof expected.execute).toBe('function')
    expect(typeof expected.hasExecuted).toBe('function')
})

it(`loaderContext.hasExecuted`, () => {
    const context = loaderContext()

    expect(context.hasExecuted('some-action')).toBe(false)
})

it(`loaderContext.execute on a new action`, () => {
    const cacheKey = 0
    const dispatch = mockDispatch()
    const context = loaderContext()

    const action = {
        id: 'some-action',
        action: td.function('.action'),
        args: [1, 2],
    }
    const actionReturn = Promise.resolve(null)
    td.when(action.action(...action.args)).thenReturn(actionReturn)

    expect(context.hasExecuted('some-action', cacheKey)).toBe(false)

    // Once an action has been executed in a context, it will not get
    // re-executed.
    context.execute(dispatch, [action], cacheKey)
    context.execute(dispatch, [action], cacheKey)

    expect(context.hasExecuted('some-action', cacheKey)).toBe(true)

    td.verify(dispatch(actionReturn), { times: 1 })
})

it(`loaderContext with a parent`, () => {
    const cacheKey = 0
    const dispatch = mockDispatch()
    const parent = loaderContext()
    const child = loaderContext(parent)

    const action = {
        id: 'some-action',
        action: td.function('.action'),
        args: [1, 2],
    }
    const actionReturn = Promise.resolve(null)
    td.when(action.action(...action.args)).thenReturn(actionReturn)

    parent.execute(dispatch, [action], cacheKey)

    expect(parent.hasExecuted('some-action', cacheKey)).toBe(true)
    expect(child.hasExecuted('some-action', cacheKey)).toBe(true)

    td.verify(dispatch(actionReturn), { times: 1 })
})

it(`loaderContext with a cache key`, () => {
    let cacheKey = 0
    const dispatch = mockDispatch()
    const parent = loaderContext()
    const child = loaderContext(parent)

    const action = {
        id: 'some-action',
        action: td.function('.action'),
        args: [1, 2],
    }
    const actionReturn = Promise.resolve(null)
    td.when(action.action(...action.args)).thenReturn(actionReturn)

    parent.execute(dispatch, [action], cacheKey)

    expect(parent.hasExecuted('some-action', cacheKey)).toBe(true)
    expect(child.hasExecuted('some-action', cacheKey)).toBe(true)

    td.verify(dispatch(actionReturn), { times: 1 })

    cacheKey++
    expect(parent.hasExecuted('some-action', cacheKey)).toBe(false)
    expect(child.hasExecuted('some-action', cacheKey)).toBe(false)
})
