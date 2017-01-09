import React from 'react'
import td from 'testdouble'

import { renderSnapshot } from './test-utils.js'
import fetchTree, { group, fromProps, depends } from 'fetch-tree'
import { todoResource } from '../src/resources'

const JSONProps = (props) => (<pre>{JSON.stringify(props, undefined, 4)}</pre>)

const ConnectedDummy = fetchTree({
    component: JSONProps,
    resourceGroup: group.debug({
        id: fromProps('id'),
        todo: depends(
            ['id'],
            todoResource
        ),

    }),
})

// WARNING: This is very noisy
test(`use group.debug to log what fetchTree is doing`, async () => {
    const log = []
    td.replace(console, 'log', (...args) => {
        log.push(args.join(' '))
    })

    const report = await renderSnapshot(
        <ConnectedDummy id={1} />
    )

    expect(report.apiRequests).toEqual({
        fetchTodo: 1,
    })
    expect(report.loadingScreens).toBe(1)

    expect(log.join('\n')).toMatchSnapshot()
})
