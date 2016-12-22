import React from 'react'
import renderer from 'react-test-renderer'

import { renderSnapshot } from './test-utils.js'
import fetchTree, { group, fromProps, child, depends } from 'fetch-tree'

import Loading from '../src/components/loading'

import { branchResource } from '../src/resources'
// These are FetchTree components, but are not connected
import LeafA from '../src/components/leaf-a'
import LeafB from '../src/components/leaf-b'
import Todo from '../src/components/todo'

/*
Read the connected-leaves tests first
*/

function Branch(props) {
    return (
        <div>
            {`Branch props: ${JSON.stringify(props, undefined, 2)}`}
            {/*

                You can't just pass id here because these leaves aren't
                connected and can't pull its data from the store.

            */}
            <h1>{props.branch.name}</h1>
            <LeafA {...props.leafAProps} />
            <LeafB {...props.leafBProps} />
        </div>
    )
}
Branch.propTypes = {
    branch: React.PropTypes.shape({
        // This has other props, but this component doesn't care about them
        name: React.PropTypes.string.isRequired,
    }).isRequired,
    // Branch doesn't know or care what the shape is
    leafAProps: React.PropTypes.shape(
        LeafA.propTypes
    ).isRequired,
    leafBProps: React.PropTypes.shape(
        LeafB.propTypes
    ).isRequired,
}
const ConnectedBranch = fetchTree({
    component: Branch,
    busy: Loading,
    resourceGroup: group({
        id: fromProps('id'),
        branch: depends(
            ['id'],
            branchResource
        ),
        // this child() is not wrapped in virtual. it's going to gether the
        // props that need to be passed down and store them in `leafAProps`
        leafAProps: child(
            // When using child() or depends() you may depend on any named
            // resource defined from above
            ['branch.leafAId', 'id'],
            (id, branchId) => <LeafA id={id} branchId={branchId} />
        ),
        leafBProps: child(
            ['branch.leafBId'],
            (id) => <LeafB id={id} />
        ),
    }),
})

test(`Connected root composed of unconnected branches and leaves`, async () => {
    const report = await renderSnapshot(
        <ConnectedBranch id={1} />
    )
    expect(report.apiRequests).toEqual({
        fetchBranch: 1,
        fetchTodo: 2,
    })
    expect(report.loadingScreens).toBe(1)
})

test(`Connected root with an array of unconnected children`, async () => {
    let actualProps
    function Root(props) {
        actualProps = props
        return (
            <div>
                {props.todoProps.map(
                    (props, index) => <Todo key={index} {...props} />
                )}
            </div>
        )
    }
    const ConnectedRoot = fetchTree({
        component: Root,
        busy: Loading,
        resourceGroup: group({
            ids: fromProps('ids'),
            todoProps: child(
                ['ids'],
                ids => ids.map(
                    id => <Todo id={id} />
                )
            ),
        }),
    })
    const report = await renderSnapshot(
        <ConnectedRoot ids={[1, 2, 3]} />
    )
    expect(actualProps.ids.length).toBe(actualProps.todoProps.length)
    expect(report.apiRequests).toEqual({
        fetchTodo: 3,
    })
    expect(report.loadingScreens).toBe(1)
})

test(`Disconnected root with mock/fixture props`, async () => {
    const branch = { name: 'Branch Fixture' }
    const leafA = { id: 11, note: 'LeafA fixture' }
    const leafB = { id: 42, note: 'LeafA fixture' }

    const leafAProps = { data: leafA }
    const leafBProps = { data: leafB }

    const component = renderer.create(
        <Branch branch={branch} leafAProps={leafAProps} leafBProps={leafBProps} />
    )
    // see __snapshots__ for the the HTML the component produced.
    expect(component.toJSON()).toMatchSnapshot()
})
