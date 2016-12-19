import td from 'testdouble'
import processor from '../../processor'
import dispatch from '../dispatch'
import group from '../group'
import withDispatch from '../with-dispatch'


it(`dispatch throws if there isn't a dispatch in context`, () => {
    const store = {
        getState: () => ({}),
        dispatch(action) {
            void(action)
        },
    }
    const setFilter = (value) => ({ type: 'SET_FILTER', payload: value })

    const tree = group({
        setFilter: dispatch(setFilter),
    })

    expect(() => {
        processor(tree, store.getState())
    }).toThrowError(/No dispatch/)


    const treeWithDispatch = withDispatch(store.dispatch, tree)
    expect(() => {
        processor(treeWithDispatch, store.getState())
    }).not.toThrow()
})

it(`ent-to-end test of a dispatch node`, () => {
    const setFilter = td.function('setFilter')
    const expectedAction = {
        type: 'SET_FILTER',
        payload: 'completed',
    }
    td.when(setFilter('completed')).thenReturn(expectedAction)

    const store = {
        getState: () => ({}),
        dispatch: td.function('.dispatch'),
    }

    const tree = group({
        setFilter: dispatch(setFilter),
    })

    const treeWithDispatch = withDispatch(store.dispatch, tree)
    const { value } = processor(treeWithDispatch, store.getState())
    value.setFilter('completed')

    td.verify(store.dispatch(expectedAction))
})
