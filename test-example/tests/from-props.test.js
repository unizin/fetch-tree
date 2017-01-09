import React from 'react'
import td from 'testdouble'

import { renderSnapshot } from './test-utils.js'
import fetchTree, { group, fromProps } from 'fetch-tree'

let actualProps
const JSONProps = (props) => {
    actualProps = props

    return (<pre>{JSON.stringify(props, undefined, 4)}</pre>)
}


const ConnectedDummy = fetchTree({
    component: JSONProps,
    resourceGroup: group({
        id: fromProps('params.id'),
        // Paths can pass through objects that don't exist without errors
        baz: fromProps('params.foo.bar.baz'),
        fakeProp: fromProps('fakeProp'),
    }),
})

test(`use group.debug to log what fetchTree is doing`, async () => {
    const params = {
        id: 1,
    }
    const errors = []
    td.replace(console, 'error', (message) => errors.push(message))
    const report = await renderSnapshot(
        <ConnectedDummy params={params} />
    )

    expect(actualProps).toEqual({
        params,
        id: 1,
        baz: null,
        fakeProp: undefined,
    })
    expect(report.apiRequests).toEqual({})
    expect(report.loadingScreens).toBe(0)
    expect(errors.shift() || "").toMatch(/^Warning:.*The prop `params.foo`/)
    expect(errors.shift() || "").toMatch(/^Warning:.*The prop `fakeProp`/)
    expect(errors.length).toBe(0)
})
