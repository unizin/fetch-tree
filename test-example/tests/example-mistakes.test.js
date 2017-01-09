import React from 'react'

import { renderSnapshot } from './test-utils.js'
import fetchTree, { group, fromProps, depends, loader, child } from 'fetch-tree'
import LeafA from '../src/components/leaf-a'

const Dummy = () => <div />

async function captureError(component) {
    try {
        await renderSnapshot(component)
    } catch (e) {
        return e
    }
    return undefined
}

describe(`mistakes that throw while loading`, () => {
    test(`loader doesn't return an id`, async () => {
        const Example = fetchTree({
            component: Dummy,
            resourceGroup: group({
                id: fromProps('id'),
                data: depends(
                    ['id'],
                    loader({
                        // oops, this calculates and ID and then doesn't return it
                        id(id) { `data-${id}` },
                        action() {},
                        selector() {},
                    })
                ),

            }),
        })

        const error = await captureError(
            <Example id={1} />
        )
        expect(error.message).toMatch(/failed to return an id/)
    })

    test(`loader action must return a promise`, async () => {
        const Example = fetchTree({
            component: Dummy,
            resourceGroup: group({
                id: fromProps('id'),
                data: depends(
                    ['id'],
                    loader({
                        id(id) { return `data-${id}` },
			// fetch-tree expects loader actions to be
			// asynchronous. They must return a promise.
                        action() { return { type: 'STUFF' } },
                        selector() {},
                    })
                ),

            }),
        })

        const error = await captureError(
            <Example id={1} />
        )
        expect(error.message).toMatch(/Actions need to return a promise/)
    })

    test(`depends() Referring to a resource out of order`, async () => {
        function selectData(state, id) {
            return state.data[id]
        }

        const Example = fetchTree({
            component: Dummy,
            resourceGroup: group({
                data: depends(
                    ['id'],
                    selectData
                ),
                // the group is processed in order, so data doesn't have access
                // to id
                id: fromProps('id'),
            }),
        })

        const error = await captureError(
            <Example id={1} />
        )
        expect(error.message).toMatch(/Resource not found: id/)
    })

    test(`depends() Referring to a missing resource`, async () => {
        function selectData(state, id) {
            return state.data[id]
        }

        const Example = fetchTree({
            component: Dummy,
            resourceGroup: group({
                data: depends(
                    // forgot to define this
                    ['id'],
                    selectData
                ),

            }),
        })

        const error = await captureError(
            <Example id={1} />
        )
        expect(error.message).toMatch(/Resource not found: id/)
    })

    test(`child() throws if it doesn't return a fetch-tree child`, async () => {
        const Example = fetchTree({
            component: Dummy,
            resourceGroup: group({
                id: fromProps('id'),
                data: child(
                    ['id'],
                    // Not a fetch-tree component
                    (id) => (<div />)
                ),

            }),
        })

        const error = await captureError(
            <Example id={1} />
        )
        expect(error.message).toMatch(/child.*does not appear to be a fetch-tree component/)
    })

    test(`child() throws if it doesn't return a fetch-tree child`, async () => {
        const Example = fetchTree({
            component: Dummy,
            resourceGroup: group({
                id: fromProps('id'),
                data: child(
                    ['id'],
                    (id) => {
                        // nothing is returned here
                        <LeafA id={id} />
                    }
                ),

            }),
        })

        const error = await captureError(
            <Example id={1} />
        )
        expect(error.message).toMatch(/child.*does not appear to be a fetch-tree component/)
    })
})
