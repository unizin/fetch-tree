import test from 'ava'
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

test(`loaderContext interface`, t => {
    const expected = loaderContext()

    t.is(typeof expected.execute, 'function')
    t.is(typeof expected.hasExecuted, 'function')
})

test(`loaderContext.hasExecuted`, t => {
    const context = loaderContext()

    t.is(context.hasExecuted('some-action'), false)
})

test(`loaderContext.execute on a new action`, t => {
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

    t.is(context.hasExecuted('some-action', cacheKey), false)

    // Once an action has been executed in a context, it will not get
    // re-executed.
    context.execute(dispatch, [action], cacheKey)
    context.execute(dispatch, [action], cacheKey)

    t.is(context.hasExecuted('some-action', cacheKey), true)

    td.verify(dispatch(actionReturn), { times: 1 })
})

test(`loaderContext with a parent`, t => {
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

    t.is(parent.hasExecuted('some-action', cacheKey), true)
    t.is(child.hasExecuted('some-action', cacheKey), true)

    td.verify(dispatch(actionReturn), { times: 1 })
})

test(`loaderContext with a cache key`, t => {
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

    t.is(parent.hasExecuted('some-action', cacheKey), true)
    t.is(child.hasExecuted('some-action', cacheKey), true)

    td.verify(dispatch(actionReturn), { times: 1 })

    cacheKey++
    t.is(parent.hasExecuted('some-action', cacheKey), false)
    t.is(child.hasExecuted('some-action', cacheKey), false)
})
