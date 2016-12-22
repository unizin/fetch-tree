/* eslint-env jest */
/* eslint-disable react/prop-types */
import React from 'react'

import { renderSnapshot } from './test-utils.js'
import fetchTree from 'fetch-tree'

import Todo from '../src/components/todo'
import Loading from '../src/components/loading'

const LeafNode = fetchTree({
    component: Todo,
    busy: Loading,
})

test(`Render Leaf Node`, async () => {
    const report = await renderSnapshot(
        <LeafNode id={1} />
    )
    expect(report.apiRequests).toEqual({
        fetchTodo: 1,
    })
    expect(report.loadingScreens).toBe(1)
})
