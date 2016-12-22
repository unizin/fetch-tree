import React from 'react'

import { renderSnapshot } from './test-utils.js'
import fetchTree, { group, dispatch } from 'fetch-tree'
import configureStore from '../src/configure_store'
import { selectCount } from '../src/reducer'
import { incrementCount } from '../src/actions'

const Button = (props) => <button {...props} />

class Counter extends React.Component {
    static displayName = 'Counter'

    componentDidMount() {
        this.props.dispatch({ type: 'INCREMENT_COUNT' })
    }

    render() {
        const props = this.props
        return (
            <Button className="increment" onClick={props.increment}>
                {props.count}
            </Button>
        )
    }
}


const ConnectedCounter = fetchTree({
    component: Counter,
    resourceGroup: group({
        // Any time fetchTree sees a function where it expects a node, it wraps
        // selector() around it
        count: selectCount,
        increment: dispatch(incrementCount),
        // If you just need access to dispatch, you don't have to pass a function
        dispatch: dispatch(),
    }),
})

test(`passing dispatch`, async () => {
    const store = configureStore()
    const report = await renderSnapshot((
        <ConnectedCounter />
    ), store)
    expect(report.apiRequests).toEqual({})
    expect(report.loadingScreens).toBe(0)

    // counter was incremented in componentDidMount()
    expect(selectCount(store.getState())).toBe(1)

    report.tree.props.onClick()
    expect(selectCount(store.getState())).toBe(2)
})
