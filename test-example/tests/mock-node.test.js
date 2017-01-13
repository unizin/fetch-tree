import React from 'react'
import td from 'testdouble'

import { renderSnapshot } from './test-utils.js'
import fetchTree, { group, fromProps, virtual, child, mockNode, resetMocks } from 'fetch-tree'

import Leaf from '../src/components/todo'
import Loading from '../src/components/loading'
import { todoResource } from '../src/resources'

afterEach(resetMocks)

// This doesn't need a resourceGroup because it will use the one defined in Leaf
const ConnectedLeaf = fetchTree({
    component: Leaf,
    busy: Loading,
})

function Root(props) {
    return (
        <ul>
            {props.ids.map(id => (
                <li key={id}>
                    <ConnectedLeaf id={id} />
                </li>
            ))}
        </ul>
    )
}

const ConnectedRoot = fetchTree({
    component: Root,
    resourceGroup: group({
        // virtual allows you to define nodes that don't get added to the props
        idsForThisComponent: virtual(fromProps('ids')),
        preloadLeaves: virtual(child(
            ['idsForThisComponent'],
            // While `ConnectedRoot` is holding a loading screen up, it loads
            // the data for the connected children.
            (ids) => ids.map(id => (
                <ConnectedLeaf id={id} />
            ))
        )),

    }),
})

test(`mockNode() will replace the way a node processes`, async () => {
    mockNode(todoResource, (id) => {
        let note
        // You can check your parameters any way you want.
        if (id === 1) {
            note = 'one'
        } else if (id === 2) {
            note = 'two'
        } else {
            throw new Error('')
        }
        return {
            id,
            done: true,
            note,
        }
    })
    const report = await renderSnapshot(
        <ConnectedRoot ids={[1, 2]} />
    )

    expect(report.apiRequests).toEqual({})
    // Nothing needed to be fetched, so it was able to render immediately.
    expect(report.loadingScreens).toBe(0)
})


test(`resetMocks())`, async () => {
    mockNode(todoResource, (id) => {
        return { id, done: true, note: 'whatever' }
    })

    resetMocks()
    const report = await renderSnapshot(
        <ConnectedRoot ids={[1, 2]} />
    )

    expect(report.apiRequests).toEqual({
        fetchTodo: 2,
    })
    // Nothing needed to be fetched, so it was able to render immediately.
    expect(report.loadingScreens).toBe(1)
})

test(`mocking a mocked node replaces it`, async () => {
    const mock1 = td.function('.mock1')
    const mock2 = td.function('.mock2')
    td.when(mock2(1)).thenReturn({
        id: 1, done: true, note: 'second mock',
    })

    mockNode(todoResource, mock1)
    mockNode(todoResource, mock2)

    const report = await renderSnapshot(
        <ConnectedRoot ids={[1]} />
    )

    td.verify(mock1(), { ignoreExtraArgs: true, times: 0 })

    expect(report.apiRequests).toEqual({})
    // Nothing needed to be fetched, so it was able to render immediately.
    expect(report.loadingScreens).toBe(0)
})
