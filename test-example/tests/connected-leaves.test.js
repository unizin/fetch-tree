import React from 'react'

import { renderSnapshot } from './test-utils.js'
import fetchTree, { group, fromProps, virtual, child } from 'fetch-tree'

import Leaf from '../src/components/todo'
import Loading from '../src/components/loading'

// This doesn't need a resourceGroup because it will use the one defined in Leaf
const ConnectedLeaf = fetchTree({
    component: Leaf,
    busy: Loading,
})

test(`When you render a connected leaf, it fetches its own data`, async () => {
    const report = await renderSnapshot(
        <ConnectedLeaf id={1} />
    )
    // Rendering a connected component will fetch its own data and show a
    // loading screen until it's ready.
    expect(report.apiRequests).toEqual({
        fetchTodo: 1,
    })
    expect(report.loadingScreens).toBe(1)
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

test(`Render a set of leaves individually`, async () => {
    const report = await renderSnapshot(
        <Root ids={[1, 2, 3, 4, 5]} />
    )

    expect(report.apiRequests).toEqual({
        fetchTodo: 5,
    })
    expect(report.loadingScreens).toBe(5)
})

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
test(`Preload the leaves data before rendering`, async () => {
    const report = await renderSnapshot(
        <ConnectedRoot ids={[1, 2, 3, 4, 5]} />
    )

    expect(report.apiRequests).toEqual({
        fetchTodo: 5,
    })
    // It still took 5 requests, but the user only saw 1 loading screen while
    // everything loaded.
    expect(report.loadingScreens).toBe(1)
})
