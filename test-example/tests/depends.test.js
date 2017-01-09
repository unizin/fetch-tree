import React from 'react'

import { renderSnapshot } from './test-utils.js'
import fetchTree, { group, depends, selector, child } from 'fetch-tree'
import { userResource } from '../src/resources'
import { selectCurrentUsername } from '../src/reducer'
import Todo from '../src/containers/todo'

// You can build up reusable resources from other nodes
const currentUserResource = depends(
    // It's not a good idea to use fromProps here though. It would force every
    // component using the resource to use the same prop name for whatever you
    // depend on.
    [
        selector(selectCurrentUsername),
    ],
    userResource
)

test(`depends()/child() may depend on nodes instead of names of sibling resources`, async () => {
    const JSONProps = (props) => (<pre>{JSON.stringify(props, undefined, 4)}</pre>)

    const ConnectedDummy = fetchTree({
        component: JSONProps,
        resourceGroup: group({
            myTodos: child(
                [currentUserResource],
                (user) => user.todos.map(id => (
                    <Todo id={id} />
                ))
            ),
        }),
    })


    const params = { id: 1 }
    const report = await renderSnapshot(
        <ConnectedDummy params={params} />
    )
    expect(report.apiRequests).toEqual({
        fetchUser: 1,
        fetchTodo: 5,
    })
    expect(report.loadingScreens).toBe(1)
})
